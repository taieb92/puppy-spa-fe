export type PuppyEntry = {
  id: string;
  puppyName: string;
  ownerName: string;
  service: string;
  serviceRequired?: string; // for backward compatibility
  arrivalTime: string;
  status: 'WAITING' | 'COMPLETED';
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
  'Cooper', 'Bailey', 'Daisy', 'Milo', 'Sadie',
  'Molly', 'Buddy', 'Rocky', 'Maggie', 'Bear',
  'Sophie', 'Tucker', 'Coco', 'Ruby', 'Duke'
]; 