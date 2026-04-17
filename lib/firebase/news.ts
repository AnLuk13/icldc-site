import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore/lite";
import { db } from "./firestore";
import { withId, toDate } from "./converters";
import type { News } from "@/lib/types";

export async function getNews(): Promise<News[]> {
  const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const raw = d.data();
    return {
      ...withId<Omit<News, "id">>(d),
      createdAt: toDate(raw.createdAt),
      updatedAt: toDate(raw.updatedAt),
      bannerImage: raw.bannerImage,
    };
  });
}

export async function getNewsItem(id: string): Promise<News | null> {
  const snap = await getDoc(doc(db, "news", id));
  if (!snap.exists()) return null;
  const raw = snap.data();
  return {
    ...withId<Omit<News, "id">>(snap),
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
    bannerImage: raw.bannerImage,
  };
}
