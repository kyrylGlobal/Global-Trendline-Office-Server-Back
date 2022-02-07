export interface SalesRaportData {
    baseContent: string;
    newContent?: string;
}

export interface PositionRaportData extends SalesRaportData {
    fullSumm: number,
    netto: number
}