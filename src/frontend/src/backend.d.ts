import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SemenStraw {
    status: AvailabilityStatus;
    quality: QualityGrade;
    quantity: bigint;
    storageLocation: string;
    bullId: string;
    collectionDate: string;
    strawId: string;
}
export interface Sale {
    saleId: string;
    buyerContact: string;
    quantitySold: bigint;
    salePrice: number;
    buyerName: string;
    strawId: string;
    saleDate: string;
}
export enum AvailabilityStatus {
    Available = "Available",
    Sold = "Sold",
    Used = "Used"
}
export enum QualityGrade {
    Substandard = "Substandard",
    Standard = "Standard",
    Superior = "Superior"
}
export interface backendInterface {
    addOrUpdateStraw(strawId: string, bullId: string, collectionDate: string, quality: QualityGrade, storageLocation: string, quantity: bigint): Promise<void>;
    createSale(strawId: string, saleDate: string, buyerName: string, buyerContact: string, quantitySold: bigint, salePrice: number): Promise<void>;
    getAllSales(): Promise<Array<Sale>>;
    getAllStraws(): Promise<Array<SemenStraw>>;
    getSaleById(saleId: string): Promise<Sale | null>;
    getStrawById(strawId: string): Promise<SemenStraw | null>;
    updateStrawStatus(strawId: string, newStatus: AvailabilityStatus): Promise<void>;
}
