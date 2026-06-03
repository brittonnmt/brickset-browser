import { browser } from '$app/environment';

const CACHE_KEY = 'lego_cached_images';

// In-memory set, seeded from localStorage on first import
const cached: Set<string> = new Set(
	browser
		? (() => {
				try {
					return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]') as string[];
				} catch {
					return [];
				}
			})()
		: []
);

function persist() {
	if (!browser) return;
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify([...cached]));
	} catch {}
}

/** Returns the local /images/<filename> path if already cached, else null */
export function localPath(filename: string | undefined): string | null {
	if (!filename) return null;
	return cached.has(filename) ? `/images/${filename}` : null;
}

/** Derive a filename from a remote image URL */
export function filenameFromUrl(url: string): string {
	const part = url.split('/').pop() ?? '';
	// ensure .jpg extension
	return part.includes('.') ? part : `${part}.jpg`;
}

/** Fire-and-forget: download the image server-side and mark it cached */
export async function cacheImage(url: string, filename: string): Promise<void> {
	if (!browser || !url || !filename) return;
	if (cached.has(filename)) return; // already done

	try {
		const res = await fetch('/api/cache-image', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url, filename })
		});
		const data = (await res.json()) as { cached?: boolean };
		if (data.cached) {
			cached.add(filename);
			persist();
		}
	} catch {
		/* silently ignore */
	}
}
