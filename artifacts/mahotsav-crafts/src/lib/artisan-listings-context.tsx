import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Artisan } from '../artisan_data';
import { firebaseConfigured } from './firebase';
import { subscribeToArtisanListings } from './firestore-listings';

type ArtisanListingsContextValue = {
  listings: Artisan[];
  loading: boolean;
  error: boolean;
};

const ArtisanListingsContext = createContext<ArtisanListingsContextValue | null>(null);

export function ArtisanListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }

    return subscribeToArtisanListings(
      (nextListings) => {
        setListings(nextListings);
        setLoading(false);
        setError(false);
      },
      () => {
        setLoading(false);
        setError(true);
      },
    );
  }, []);

  return (
    <ArtisanListingsContext.Provider value={{ listings, loading, error }}>
      {children}
    </ArtisanListingsContext.Provider>
  );
}

export function useArtisanListings() {
  const context = useContext(ArtisanListingsContext);
  if (!context) {
    throw new Error('useArtisanListings must be used inside ArtisanListingsProvider.');
  }
  return context;
}
