import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
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

export async function createUser(email: string, password: string, name: string, role: "ADMIN" | "MASTER"): Promise<void> {
  // Sem Cloud Functions / plano Blaze, não conseguimos criar contas no Auth
  // para outros usuários. Aqui criamos apenas o documento no Firestore.
  // O usuário depois fará o próprio cadastro no Auth usando o mesmo email.

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
  // Em vez disso, marcamos o documento como desativado no Firestore.
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { disabled: true });
}