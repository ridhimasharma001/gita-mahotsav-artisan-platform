import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { z } from 'zod';
import type { Artisan } from '../artisan_data';
import { firebaseConfigured, requireFirestore } from './firebase';

export type ArtisanListingDraft = Omit<Artisan, 'id'>;

const productSchema = z.object({
  name: z.string().trim().min(1).max(120),
  image: z.string().trim().max(2048),
});

const listingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  craft: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
  origin: z.string().trim().min(1).max(160),
  stallNumber: z.string().trim().max(40),
  phone: z.string().trim().min(1).max(40),
  story: z.string().trim().max(3000),
  coverImage: z.string().trim().max(2048),
  profileImage: z.string().trim().max(2048),
  products: z.array(productSchema).max(12),
});

function toArtisan(id: string, data: DocumentData): Artisan | null {
  const parsed = listingSchema.safeParse(data);
  if (!parsed.success || typeof data.ownerUid !== 'string') return null;

  return {
    id,
    ...parsed.data,
  };
}

export function subscribeToArtisanListings(
  onListings: (listings: Artisan[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  if (!firebaseConfigured) {
    onListings([]);
    return () => undefined;
  }

  return onSnapshot(
    collection(requireFirestore(), 'artisanListings'),
    (snapshot) => {
      onListings(
        snapshot.docs
          .map((listing) => toArtisan(listing.id, listing.data()))
          .filter((listing): listing is Artisan => listing !== null),
      );
    },
    (error) => onError(error),
  );
}

export async function saveArtisanListing(
  ownerUid: string,
  draft: ArtisanListingDraft,
): Promise<void> {
  const normalizedDraft = {
    ...draft,
    products: draft.products.filter((product) => product.name.trim()),
  };
  const parsed = listingSchema.safeParse(normalizedDraft);
  if (!parsed.success) {
    throw new Error('Please check the listing details and try again.');
  }

  const database = requireFirestore();
  const listingRef = doc(database, 'artisanListings', ownerUid);
  const existing = await getDoc(listingRef);

  await setDoc(listingRef, {
    ...parsed.data,
    ownerUid,
    createdAt: existing.exists() ? existing.data().createdAt ?? serverTimestamp() : serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
