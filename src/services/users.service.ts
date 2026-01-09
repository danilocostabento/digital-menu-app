import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { AppUser } from "../types/User";

export async function getUsers(): Promise<AppUser[]> {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs
    .map(d => ({
      uid: d.id,
      ...d.data(),
    } as AppUser & { disabled?: boolean }))
    .filter(user => !user.disabled);
}

export async function createUser(email: string, name: string, role: "ADMIN" | "MASTER"): Promise<void> {

  const userRef = doc(collection(db, "users"));

  await setDoc(userRef, {
    name,
    email,
    role,
    // flag para "desativar" ao invés de deletar de fato
    disabled: false,
  });
}

export async function deleteUserById(uid: string): Promise<void> {
  // Sem Admin SDK, não é possível deletar contas de Auth de outros usuários.
  // Aqui removemos apenas o documento do Firestore.
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}

export async function updateUser(
  uid: string,
  data: Partial<Pick<AppUser, "name" | "role">>,
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}