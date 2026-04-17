import { collection, getDocs, getDoc, doc } from "firebase/firestore/lite";
import { db } from "./firestore";
import { withId, toDate } from "./converters";
import type { Event } from "@/lib/types";

export async function getEvents(): Promise<Event[]> {
  const snap = await getDocs(collection(db, "events"));
  return snap.docs.map((d) => {
    const raw = d.data();
    return {
      ...withId<Omit<Event, "id">>(d),
      startDate: toDate(raw.startDate),
      endDate: toDate(raw.endDate),
      createdAt: toDate(raw.createdAt),
      updatedAt: toDate(raw.updatedAt),
      bannerImage: raw.bannerImage,
    };
  });
}

export async function getEvent(id: string): Promise<Event | null> {
  const snap = await getDoc(doc(db, "events", id));
  if (!snap.exists()) return null;
  const raw = snap.data();
  return {
    ...withId<Omit<Event, "id">>(snap),
    startDate: toDate(raw.startDate),
    endDate: toDate(raw.endDate),
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
    bannerImage: raw.bannerImage,
  };
}
