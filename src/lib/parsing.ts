export function parseNum(val: string): number | null {
	if (!val || val.trim() === '') return null;
	const n = parseFloat(val.replace(/,/g, ''));
	return isNaN(n) ? null : n;
}

export function parseInt2(val: string): number | null {
	if (!val || val.trim() === '') return null;
	const n = parseInt(val.trim(), 10);
	return isNaN(n) ? null : n;
}

export function parseCount(val: string): number {
	return parseInt2(val) ?? 0;
}

/** "X" or "true" or "1" → true, anything else → false */
export function parseBool(val: string): boolean {
	if (!val) return false;
	const v = val.trim().toLowerCase();
	return v === 'x' || v === 'true' || v === '1' || v === 'yes';
}

export function parseList(val: string): string[] {
	if (!val || val.trim() === '') return [];
	return val
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}
