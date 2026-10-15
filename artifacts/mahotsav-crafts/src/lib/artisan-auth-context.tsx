import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, firebaseConfigured, requireFirebaseAuth } from './firebase';

type ArtisanAuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const ArtisanAuthContext = createContext<ArtisanAuthContextValue | null>(null);

export function ArtisanAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setUser(null);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    }, () => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  const value: ArtisanAuthContextValue = {
    user,
    loading,
    configured: firebaseConfigured,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(requireFirebaseAuth(), email.trim(), password);
    },
    signUp: async (email, password, name) => {
      const credentials = await createUserWithEmailAndPassword(requireFirebaseAuth(), email.trim(), password);
      await updateProfile(credentials.user, { displayName: name.trim() });
    },
    sendPasswordReset: async (email) => {
      await sendPasswordResetEmail(requireFirebaseAuth(), email.trim());
    },
    signOut: async () => {
      await firebaseSignOut(requireFirebaseAuth());
    },
  };

  return <ArtisanAuthContext.Provider value={value}>{children}</ArtisanAuthContext.Provider>;
}

export function useArtisanAuth() {
  const context = useContext(ArtisanAuthContext);
  if (!context) {
    throw new Error('useArtisanAuth must be used inside ArtisanAuthProvider.');
  }
  return context;
}
