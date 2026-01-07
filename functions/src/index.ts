import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const createUser = functions.https.onCall(async (data, context) => {
  // Verificar se o caller é MASTER
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore().doc(`users/${callerUid}`).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "MASTER") {
    throw new functions.https.HttpsError("permission-denied", "Apenas MASTER pode criar usuários");
  }

  const { email, password, name, role } = data;
  if (!email || !password || !name || !role || !["ADMIN", "MASTER"].includes(role)) {
    throw new functions.https.HttpsError("invalid-argument", "Dados inválidos");
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().doc(`users/${userRecord.uid}`).set({
      name,
      email,
      role,
    });

    return { uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Erro ao criar usuário");
  }
});

export const deleteUser = functions.https.onCall(async (data, context) => {
  // Verificar se o caller é MASTER
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore().doc(`users/${callerUid}`).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "MASTER") {
    throw new functions.https.HttpsError("permission-denied", "Apenas MASTER pode deletar usuários");
  }

  const { uid } = data;
  if (!uid) {
    throw new functions.https.HttpsError("invalid-argument", "UID necessário");
  }

  if (uid === callerUid) {
    throw new functions.https.HttpsError("permission-denied", "Não pode deletar seu próprio usuário");
  }

  try {
    await admin.auth().deleteUser(uid);
    await admin.firestore().doc(`users/${uid}`).delete();
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Erro ao deletar usuário");
  }
});