import { browser } from '$app/environment';
import type { FilterState, LegoSet, SortField, SortState } from './types';
import { uniqueSorted } from './formatting';

const STORAGE_KEY = 'lego_browser_sets';
const LIST_KEY = 'lego_browser_list';
const PAGE_SIZE_DEFAULT = 50;

function loadList(): LegoSet[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(LIST_KEY);
		return raw ? (JSON.parse(raw) as LegoSet[]) : [];
	} catch {
		return [];
	}
}

function saveList(list: LegoSet[]) {
	if (!browser) return;
	try {
		localStorage.setItem(LIST_KEY, JSON.stringify(list));
	} catch {}
}

// ===== Load persisted sets from localStorage =====
function loadFromStorage(): LegoSet[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		return JSON.parse(raw) as LegoSet[];
	} catch {
		return [];
	}
}

function saveToStorage(sets: LegoSet[]) {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
	} catch {
		// quota exceeded — silently fail
	}
}

// ===== Store =====

function createStore() {
	let sets = $state<LegoSet[]>(loadFromStorage());
	let list = $state<LegoSet[]>(loadList());
	let filter = $state<FilterState>({
		search: '',
		theme: '',
		subtheme: '',
		yearMin: null,
		yearMax: null,
		ownedOnly: false,
		wantedOnly: false
	});
	let sort = $state<SortState>({ field: 'year', direction: 'desc' });
	let page = $state(1);
	let pageSize = $state(
		(() => {
			if (typeof localStorage === 'undefined') return PAGE_SIZE_DEFAULT;
			const raw = localStorage.getItem('pageSize');
			if (raw === 'all') return Infinity;
			const saved = parseInt(raw ?? '');
			return [25, 50, 100, 200, 500].includes(saved) ? saved : PAGE_SIZE_DEFAULT;
		})()
	);

	// ===== Derived =====

	const themes = $derived(uniqueSorted(sets.map((s) => s.theme)));
	const yearOptions = $derived(
		[...new Set(sets.map((s) => s.year).filter((y): y is number => y !== null))].sort(
			(a, b) => a - b
		)
	);
	const subthemes = $derived(
		uniqueSorted(
			sets.filter((s) => !filter.theme || s.theme === filter.theme).map((s) => s.subtheme)
		)
	);

	const filtered = $derived.by(() => {
		const q = filter.search.toLowerCase().trim();
		return sets.filter((s) => {
			if (q) {
				const haystack =
					`${s.name} ${s.number} ${s.year ?? ''} ${s.theme} ${s.subtheme} ${s.pieces ?? ''} ${s.usRetailPrice ?? ''}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			if (filter.theme && s.theme !== filter.theme) return false;
			if (filter.subtheme && s.subtheme !== filter.subtheme) return false;
			if (filter.yearMin !== null && (s.year === null || s.year < filter.yearMin)) return false;
			if (filter.yearMax !== null && (s.year === null || s.year > filter.yearMax)) return false;
			if (filter.ownedOnly && !s.own) return false;
			if (filter.wantedOnly && !s.want) return false;
			return true;
		});
	});

	const sorted = $derived.by(() => {
		const field = sort.field;
		const dir = sort.direction === 'asc' ? 1 : -1;
		return [...filtered].sort((a, b) => {
			const av = a[field];
			const bv = b[field];
			if (av === null && bv === null) return 0;
			if (av === null) return 1;
			if (bv === null) return -1;
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
			if (typeof av === 'string' && typeof bv === 'string')
				return av.localeCompare(bv, undefined, { sensitivity: 'base' }) * dir;
			return 0;
		});
	});

	const totalPages = $derived(Math.max(1, Math.ceil(sorted.length / pageSize)));

	const currentPage = $derived.by(() => {
		if (pageSize === Infinity) return sorted;
		const clamped = Math.min(page, totalPages);
		const start = (clamped - 1) * pageSize;
		return sorted.slice(start, start + pageSize);
	});

	// ===== Actions =====

	function importSets(newSets: LegoSet[]) {
		sets = newSets;
		page = 1;
		saveToStorage(newSets);
	}

	function clearSets() {
		sets = [];
		page = 1;
		if (browser) localStorage.removeItem(STORAGE_KEY);
	}

	function setSort(field: SortField) {
		if (sort.field === field) {
			sort = { field, direction: sort.direction === 'asc' ? 'desc' : 'asc' };
		} else {
			sort = { field, direction: 'asc' };
		}
		page = 1;
	}

	function setFilter(update: Partial<FilterState>) {
		filter = { ...filter, ...update };
		page = 1;
	}

	function resetFilters() {
		filter = {
			search: '',
			theme: '',
			subtheme: '',
			yearMin: null,
			yearMax: null,
			ownedOnly: false,
			wantedOnly: false
		};
		page = 1;
	}

	function setPage(n: number) {
		page = Math.max(1, Math.min(n, totalPages));
	}

	function setPageSize(n: number) {
		pageSize = n;
		page = 1;
		localStorage.setItem('pageSize', n === Infinity ? 'all' : String(n));
	}

	function getById(id: number): LegoSet | undefined {
		return sets.find((s) => s.setId === id);
	}

	function addToList(set: LegoSet) {
		if (!list.some((s) => s.setId === set.setId)) {
			list = [...list, set];
			saveList(list);
		}
	}

	function removeFromList(setId: number) {
		list = list.filter((s) => s.setId !== setId);
		saveList(list);
	}

	function clearList() {
		list = [];
		saveList(list);
	}

	function isInList(setId: number): boolean {
		return list.some((s) => s.setId === setId);
	}

	return {
		get sets() {
			return sets;
		},
		get filter() {
			return filter;
		},
		get sort() {
			return sort;
		},
		get page() {
			return page;
		},
		get pageSize() {
			return pageSize;
		},
		get themes() {
			return themes;
		},
		get yearOptions() {
			return yearOptions;
		},
		get subthemes() {
			return subthemes;
		},
		get filtered() {
			return filtered;
		},
		get sorted() {
			return sorted;
		},
		get totalPages() {
			return totalPages;
		},
		get currentPage() {
			return currentPage;
		},
		get list() {
			return list;
		},
		importSets,
		clearSets,
		setSort,
		setFilter,
		resetFilters,
		setPage,
		setPageSize,
		getById,
		addToList,
		removeFromList,
		clearList,
		isInList
	};
}

export const store = createStore();
