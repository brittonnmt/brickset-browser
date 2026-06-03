// Raw CSV row — all strings from PapaParse
export interface BricksetRawRow {
	SetID: string;
	Number: string;
	Variant: string;
	YearFrom: string;
	Category: string;
	Theme: string;
	ThemeGroup: string;
	Subtheme: string;
	SetName: string;
	Image: string;
	ImageFilename: string;
	USRetailPrice: string;
	UKRetailPrice: string;
	CARetailPrice: string;
	DERetailPrice: string;
	USDateAdded: string;
	USDateRemoved: string;
	Pieces: string;
	Minifigs: string;
	MinifigNumbers: string;
	PackagingType: string;
	Availability: string;
	USItemNumber: string;
	EUItemNumber: string;
	EAN: string;
	UPC: string;
	Width: string;
	Height: string;
	Depth: string;
	Weight: string;
	ModelDimension1: string;
	ModelDimension2: string;
	ModelDimension3: string;
	AgeMin: string;
	AgeMax: string;
	OwnCount: string;
	WantCount: string;
	InstructionsCount: string;
	AdditionalImageCount: string;
	Released: string;
	Rating: string;
	BrickLinkSoldPriceNew: string;
	BrickLinkSoldPriceUsed: string;
	Designers: string;
	LaunchDate: string;
	ExitDate: string;
	Own: string;
	Want: string;
	QtyOwned: string;
	QtyOwnedNew: string;
	QtyOwnedUsed: string;
	QtyWanted: string;
	WantedPriority: string;
	Flag2: string;
	Flag3: string;
	Flag4: string;
	Flag5: string;
	Flag6: string;
	Flag7: string;
	Flag8: string;
	UserNotes: string;

	[key: string]: string;
}

// Normalized internal model
export interface LegoSet {
	setId: number;
	number: string;
	variant: string;
	year: number | null;
	category: string;
	theme: string;
	themeGroup: string;
	subtheme: string;
	name: string;
	hasImage: boolean;
	imageFilename: string;
	imageUrl: string;
	usRetailPrice: number | null;
	ukRetailPrice: number | null;
	caRetailPrice: number | null;
	deRetailPrice: number | null;
	usDateAdded: string;
	usDateRemoved: string;
	pieces: number | null;
	minifigs: number | null;
	minifigNumbers: string[];
	packagingType: string;
	availability: string;
	usItemNumber: string;
	euItemNumber: string;
	ean: string;
	upc: string;
	width: number | null;
	height: number | null;
	depth: number | null;
	weight: number | null;
	ageMin: number | null;
	ageMax: number | null;
	ownCount: number;
	wantCount: number;
	instructionsCount: number;
	additionalImageCount: number;
	released: boolean;
	rating: number | null;
	bricklinkSoldPriceNew: number | null;
	bricklinkSoldPriceUsed: number | null;
	designers: string[];
	launchDate: string;
	exitDate: string;
	own: boolean;
	want: boolean;
	qtyOwned: number;
	qtyOwnedNew: number;
	qtyOwnedUsed: number;
	qtyWanted: number;
	wantedPriority: string;
	userNotes: string;
}

// Sort state
export type SortField = keyof LegoSet;
export type SortDirection = 'asc' | 'desc';

export interface SortState {
	field: SortField;
	direction: SortDirection;
}

// Filter state
export interface FilterState {
	search: string;
	theme: string;
	subtheme: string;
	yearMin: number | null;
	yearMax: number | null;
	ownedOnly: boolean;
	wantedOnly: boolean;
}
