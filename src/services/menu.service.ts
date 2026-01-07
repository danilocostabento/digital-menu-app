import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { DocumentData } from "firebase/firestore";
import type { MenuItem } from "../types/MenuItem";

const menuRef = collection(db, "menuItems");

// Create
export async function createMenuItem(
  data: Omit<MenuItem, "id" | "createdAt" | "active">
) {
  return addDoc(menuRef, {
    ...data,
    createdAt: serverTimestamp(),
    active: true,
  });
}

// Read
export async function getMenuItems(): Promise<MenuItem[]> {
  const snapshot = await getDocs(menuRef);

  return snapshot.docs.map(
    (docSnap: QueryDocumentSnapshot<DocumentData>) =>
      ({
        id: docSnap.id,
        ...docSnap.data(),
      } as MenuItem)
  );
}

// Update
export async function updateMenuItem(
  id: string,
  data: Partial<Omit<MenuItem, "id" | "createdAt">>
) {
  const ref = doc(db, "menuItems", id);
  return updateDoc(ref, data);
}

// Delete
export async function deleteMenuItem(id: string) {
  const ref = doc(db, "menuItems", id);
  return deleteDoc(ref);
}
