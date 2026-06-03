import Papa from 'papaparse';
import type { BricksetRawRow, LegoSet } from './types';
import { parseNum, parseInt2, parseCount, parseBool, parseList } from './parsing';
import { buildImageUrl, normalizeInText } from './formatting';

export interface ParseResult {
	sets: LegoSet[];
	errors: string[];
}
``;
export function parseBricksetCsv(file: File): Promise<ParseResult> {
	return new Promise((resolve) => {
		Papa.parse<BricksetRawRow>(file, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (h) => h.trim(),
			complete(results) {
				const errors: string[] = [];
				if (results.errors.length > 0) {
					errors.push(...results.errors.slice(0, 5).map((e) => `Row ${e.row}: ${e.message}`));
				}

				const sets: LegoSet[] = [];
				for (const raw of results.data) {
					try {
						sets.push(normalizeRow(raw));
					} catch (err) {
						errors.push(`Failed to parse row: ${String(err)}`);
					}
				}

				resolve({ sets, errors });
			},
			error(err) {
				resolve({ sets: [], errors: [err.message] });
			}
		});
	});
}

function normalizeRow(r: BricksetRawRow): LegoSet {
	const number = (r.Number ?? '').trim();
	const variant = (r.Variant ?? '').trim();
	const imageFilename = (r.ImageFilename ?? '').trim();

	return {
		setId: parseCount(r.SetID),
		number,
		variant,
		year: parseInt2(r.YearFrom),
		category: (r.Category ?? '').trim(),
		theme: (r.Theme ?? '').trim(),
		themeGroup: (r.ThemeGroup ?? '').trim(),
		subtheme: normalizeInText((r.Subtheme ?? '').trim()),
		name: normalizeInText((r.SetName ?? '').trim()),
		hasImage: parseBool(r.Image),
		imageFilename,
		imageUrl: buildImageUrl(imageFilename, number, variant),
		usRetailPrice: parseNum(r.USRetailPrice),
		ukRetailPrice: parseNum(r.UKRetailPrice),
		caRetailPrice: parseNum(r.CARetailPrice),
		deRetailPrice: parseNum(r.DERetailPrice),
		usDateAdded: (r.USDateAdded ?? '').trim(),
		usDateRemoved: (r.USDateRemoved ?? '').trim(),
		pieces: parseInt2(r.Pieces),
		minifigs: parseInt2(r.Minifigs),
		minifigNumbers: parseList(r.MinifigNumbers),
		packagingType: (r.PackagingType ?? '').trim(),
		availability: (r.Availability ?? '').trim(),
		usItemNumber: (r.USItemNumber ?? '').trim(),
		euItemNumber: (r.EUItemNumber ?? '').trim(),
		ean: (r.EAN ?? '').trim(),
		upc: (r.UPC ?? '').trim(),
		width: parseNum(r.Width),
		height: parseNum(r.Height),
		depth: parseNum(r.Depth),
		weight: parseNum(r.Weight),
		ageMin: parseInt2(r.AgeMin),
		ageMax: parseInt2(r.AgeMax),
		ownCount: parseCount(r.OwnCount),
		wantCount: parseCount(r.WantCount),
		instructionsCount: parseCount(r.InstructionsCount),
		additionalImageCount: parseCount(r.AdditionalImageCount),
		released: parseBool(r.Released),
		rating: parseNum(r.Rating),
		bricklinkSoldPriceNew: parseNum(r.BrickLinkSoldPriceNew),
		bricklinkSoldPriceUsed: parseNum(r.BrickLinkSoldPriceUsed),
		designers: parseList(r.Designers),
		launchDate: (r.LaunchDate ?? '').trim(),
		exitDate: (r.ExitDate ?? '').trim(),
		own: parseBool(r.Own),
		want: parseBool(r.Want),
		qtyOwned: parseCount(r.QtyOwned),
		qtyOwnedNew: parseCount(r.QtyOwnedNew),
		qtyOwnedUsed: parseCount(r.QtyOwnedUsed),
		qtyWanted: parseCount(r.QtyWanted),
		wantedPriority: (r.WantedPriority ?? '').trim(),
		userNotes: (r.UserNotes ?? '').trim()
	};
}
