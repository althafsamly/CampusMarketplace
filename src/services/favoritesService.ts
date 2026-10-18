import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const STORAGE_KEY = "@campus_marketplace_saved_ids";
const DEFAULT_SAVED_IDS = ["1", "3"];

// In-memory fallback if localStorage is not accessible
let memorySavedIds: string[] = [...DEFAULT_SAVED_IDS];

function getLocalStorage(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch (err) {
    // Ignore security/cross-origin storage restrictions
  }
  return null;
}

export function getLocalSavedIds(): string[] {
  const storage = getLocalStorage();
  if (storage) {
    try {
      const data = storage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed reading saved IDs from localStorage:", err);
    }
  }
  return memorySavedIds;
}

export function setLocalSavedIds(ids: string[]): void {
  memorySavedIds = [...ids];
  const storage = getLocalStorage();
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (err) {
      console.warn("Failed writing saved IDs to localStorage:", err);
    }
  }
}

/**
 * Load saved listing IDs, merging local storage and Firestore (if user is authenticated)
 */
export async function loadSavedListingIds(userId?: string | null): Promise<string[]> {
  const localIds = getLocalSavedIds();

  if (!userId || !db) {
    return localIds;
  }

  try {
    const savedCol = collection(db, "users", userId, "saved");
    const snapshot = await getDocs(savedCol);
    const remoteIds = snapshot.docs.map((docSnap) => docSnap.id);

    // Merge remote and local (union)
    const merged = Array.from(new Set([...remoteIds, ...localIds]));
    setLocalSavedIds(merged);

    // If there were local IDs not yet in Firestore, sync them up in background
    for (const id of localIds) {
      if (!remoteIds.includes(id)) {
        setDoc(
          doc(db, "users", userId, "saved", id),
          { listingId: id, savedAt: serverTimestamp() },
          { merge: true },
        ).catch(() => undefined);
      }
    }

    return merged;
  } catch (err) {
    console.warn("Could not fetch remote saved listings, using local:", err);
    return localIds;
  }
}

/**
 * Save a listing ID to favorites
 */
export async function saveListingId(
  listingId: string,
  currentIds: string[],
  userId?: string | null,
): Promise<string[]> {
  if (currentIds.includes(listingId)) return currentIds;
  const next = [...currentIds, listingId];
  setLocalSavedIds(next);

  if (userId && db) {
    try {
      await setDoc(
        doc(db, "users", userId, "saved", listingId),
        { listingId, savedAt: serverTimestamp() },
        { merge: true },
      );
    } catch (err) {
      console.warn("Could not save favorite to remote database:", err);
    }
  }

  return next;
}

/**
 * Remove a listing ID from favorites
 */
export async function removeListingId(
  listingId: string,
  currentIds: string[],
  userId?: string | null,
): Promise<string[]> {
  const next = currentIds.filter((id) => id !== listingId);
  setLocalSavedIds(next);

  if (userId && db) {
    try {
      await deleteDoc(doc(db, "users", userId, "saved", listingId));
    } catch (err) {
      console.warn("Could not delete favorite from remote database:", err);
    }
  }

  return next;
}

/**
 * Toggle a listing favorite status
 */
export async function toggleSavedListingId(
  listingId: string,
  currentIds: string[],
  userId?: string | null,
): Promise<{ nextIds: string[]; isSaved: boolean }> {
  const isCurrentlySaved = currentIds.includes(listingId);
  if (isCurrentlySaved) {
    const nextIds = await removeListingId(listingId, currentIds, userId);
    return { nextIds, isSaved: false };
  } else {
    const nextIds = await saveListingId(listingId, currentIds, userId);
    return { nextIds, isSaved: true };
  }
}

/**
 * Clear all saved favorites
 */
export async function clearAllSavedListings(
  currentIds: string[],
  userId?: string | null,
): Promise<string[]> {
  setLocalSavedIds([]);

  if (userId && db) {
    try {
      for (const id of currentIds) {
        deleteDoc(doc(db, "users", userId, "saved", id)).catch(() => undefined);
      }
    } catch (err) {
      console.warn("Could not clear remote favorites:", err);
    }
  }

  return [];
}
