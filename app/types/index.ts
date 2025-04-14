export type PuppyEntry = {
  id: string;
  puppyName: string;
  ownerName: string;
  service: string;
  arrivalTime: string;
  status: 'waiting' | 'completed';
  position: number;
};

export type WaitingList = {
  id: string;
  date: string;
  entries: PuppyEntry[];
};

// Mock data for puppy name autocomplete
export const PUPPY_NAMES = [
  'Max', 'Luna', 'Bella', 'Charlie', 'Lucy',
  'Cooper', 'Bailey', 'Daisy', 'Milo', 'Sadie'
]; 