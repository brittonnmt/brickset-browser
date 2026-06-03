export function buildImageUrl(imageFilename: string, number: string, variant: string): string {
	// Use ImageFilename if it looks like a valid filename (has a dash)
	if (imageFilename && imageFilename.trim() !== '' && imageFilename.includes('-')) {
		const filename = imageFilename.trim();
		// Strip extension if present, then add .jpg
		const base = filename.replace(/\.\w+$/, '');
		return `https://images.brickset.com/sets/images/${base}.jpg`;
	}
	// Fallback: derive from Number-Variant
	if (number && variant) {
		return `https://images.brickset.com/sets/images/${number}-${variant}.jpg`;
	}
	return '';
}

export function formatPrice(price: number | null, currency = '$'): string {
	if (price === null) return '—';
	return `${currency}${price.toFixed(2)}`;
}

export function formatNumber(n: number | null): string {
	if (n === null) return '—';
	return n.toLocaleString();
}

export function formatRating(r: number | null): string {
	if (r === null) return '—';
	return r.toFixed(1);
}

/** Normalize "3 in 1" → "3-in-1" (case-insensitive, any digits) */
export function normalizeInText(val: string): string {
	return val.replace(/\b(\d+)\s+in\s+(\d+)\b/gi, '$1-in-$2');
}

function yearFromRaw(val: string): string {
	if (!val) return '';
	const dateStr = val.split(/[\sT]/)[0];
	if (dateStr.includes('-')) return dateStr.split('-')[0]; // yyyy-mm-dd
	if (dateStr.includes('/')) return dateStr.split('/')[2] ?? ''; // dd/mm/yyyy
	if (/^\d{4}$/.test(dateStr)) return dateStr; // bare year
	return '';
}

export function formatAvailability(launchDate: string, exitDate: string): string {
	const launch = formatDate(launchDate);
	if (!launch) return '';
	const exit = formatDate(exitDate);
	if (exit) {
		const y1 = yearFromRaw(launchDate);
		const y2 = yearFromRaw(exitDate);
		if (y1 && y2) return y1 === y2 ? y1 : `${y1} – ${y2}`;
		return `${launch} – ${exit}`;
	}
	return launch;
}

export function formatDate(val: string): string {
	if (!val) return '';
	const dateStr = val.split(/[\sT]/)[0]; // strip time portion
	if (dateStr.includes('-')) {
		// ISO format: yyyy-mm-dd
		const [year, month, day] = dateStr.split('-');
		if (!year || !month || !day) return dateStr;
		return `${parseInt(month)}/${parseInt(day)}/${year}`;
	} else if (dateStr.includes('/')) {
		// European format from CSV: dd/mm/yyyy
		const [day, month, year] = dateStr.split('/');
		if (!year || !month || !day) return dateStr;
		return `${parseInt(month)}/${parseInt(day)}/${year}`;
	}
	return dateStr;
}

export function uniqueSorted(values: string[]): string[] {
	return [...new Set(values.filter(Boolean))].sort((a, b) =>
		a.localeCompare(b, undefined, { sensitivity: 'base' })
	);
}
