export interface PuppyEntry {
  id: number;
  ownerName: string;
  puppyName: string;
  serviceRequired: string;
  arrivalTime: string;
  position: number;
  status: string;
}

export interface WaitingList {
  entries: PuppyEntry[];
  id?: number;
  date?: string;
}

export const PUPPY_NAMES = [
  "Max",
  "Bella",
  "Charlie",
  "Luna",
  "Lucy",
  "Cooper",
  "Bailey",
  "Daisy",
  "Sadie",
  "Molly",
  "Buddy",
  "Rocky",
  "Maggie",
  "Bear",
  "Sophie",
  "Tucker",
  "Coco",
  "Ruby",
  "Duke",
  "Milo"
]; 