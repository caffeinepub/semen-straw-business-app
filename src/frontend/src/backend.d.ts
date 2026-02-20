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
    storageLocation: string;
    bullId: string;
    collectionDate: string;
    strawId: string;
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
    addOrUpdateStraw(strawId: string, bullId: string, collectionDate: string, quality: QualityGrade, storageLocation: string): Promise<void>;
    getAllStraws(): Promise<Array<SemenStraw>>;
    getStrawById(strawId: string): Promise<SemenStraw | null>;
    updateStrawStatus(strawId: string, newStatus: AvailabilityStatus): Promise<void>;
}
