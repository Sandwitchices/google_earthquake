
export interface Earthquake {
  date: string;
  time: string;
  location: string;
  magnitude: number;
  depth: string | number;
  datetime: string; // Combined ISO string for sorting
}
