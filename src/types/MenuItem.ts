import { Timestamp } from "firebase/firestore";

export interface MenuItem {
  id?: string;              // Firestore doc id
  name: string;
  description?: string;
  price: number;
  category?: string;
  active: boolean;
  createdAt?: Timestamp;
}
