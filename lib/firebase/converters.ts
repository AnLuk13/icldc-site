import { Timestamp, type DocumentSnapshot } from "firebase/firestore/lite";

/**
 * Merges a Firestore document's ID with its data into a typed object.
 */
export function withId<T extends object>(
  snap: DocumentSnapshot,
): T & { id: string } {
  return { id: snap.id, ...(snap.data() as T) };
}

/**
 * Converts a Firestore Timestamp, Date, or ISO string to a JS Date.
 * Returns undefined for missing/null values.
 */
export function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === "string") return new Date(value);
  return undefined;
}
