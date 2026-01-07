import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import type { AppUser } from "../types/User";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth listener");
    console.log("Auth object:", auth);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("onAuthStateChanged triggered, firebaseUser:", firebaseUser);
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        if (!firebaseUser.email) {
          console.log("Firebase user without email, setting user to null");
          setUser(null);
          setLoading(false);
          return;
        }

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", firebaseUser.email));
        const querySnap = await getDocs(q);

        if (querySnap.empty) {
          console.log("No user document found in Firestore for email", firebaseUser.email);
          setUser(null);
          setLoading(false);
          return;
        }

        const userDoc = querySnap.docs[0];
        const userData = userDoc.data() as any;
        console.log("User data from Firestore:", userData);

        if (userData.disabled) {
          console.log("User is disabled, setting user to null");
          setUser(null);
          setLoading(false);
          return;
        }

        if (!userData.role || (userData.role !== "ADMIN" && userData.role !== "MASTER")) {
          console.log("Invalid or missing role, setting user to null");
          setUser(null);
          setLoading(false);
          return;
        }
        setUser({
          uid: firebaseUser.uid,
          ...(userData as Omit<AppUser, "uid">),
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }

      setLoading(false);
      console.log("AuthContext: loading set to false, user:", user);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
