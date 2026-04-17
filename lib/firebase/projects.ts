import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  type QueryConstraint,
} from "firebase/firestore/lite";
import { db } from "./firestore";
import { withId, toDate } from "./converters";
import type { Project, Partner } from "@/lib/types";

export interface ProjectFilters {
  status?: "ongoing" | "completed" | "planned";
  partnerId?: string;
}

/** Fetches a single partner by ID without importing from partners.ts (avoids circular deps). */
async function fetchPartner(id: string): Promise<Partner | null> {
  const snap = await getDoc(doc(db, "partners", id));
  if (!snap.exists()) return null;
  const raw = snap.data();
  return {
    ...withId<Omit<Partner, "id">>(snap),
    logo: raw.logo,
  };
}

async function resolvePartners(partnerIds: string[]): Promise<Partner[]> {
  if (!partnerIds?.length) return [];
  const results = await Promise.all(partnerIds.map(fetchPartner));
  return results.filter((p): p is Partner => p !== null);
}

export async function getProjects(
  filters: ProjectFilters = {},
): Promise<Project[]> {
  const constraints: QueryConstraint[] = [];

  if (filters.status) {
    constraints.push(where("status", "==", filters.status));
  }
  if (filters.partnerId) {
    constraints.push(where("partners", "array-contains", filters.partnerId));
  }

  const q = constraints.length
    ? query(collection(db, "projects"), ...constraints)
    : collection(db, "projects");

  const snap = await getDocs(q);
  return Promise.all(
    snap.docs.map(async (d) => {
      const raw = d.data();
      const partnerIds: string[] = raw.partners ?? [];
      return {
        ...withId<Omit<Project, "id">>(d),
        startDate: toDate(raw.startDate),
        endDate: toDate(raw.endDate),
        createdAt: toDate(raw.createdAt),
        updatedAt: toDate(raw.updatedAt),
        partners: await resolvePartners(partnerIds),
      };
    }),
  );
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  const raw = snap.data();
  const partnerIds: string[] = raw.partners ?? [];
  return {
    ...withId<Omit<Project, "id">>(snap),
    startDate: toDate(raw.startDate),
    endDate: toDate(raw.endDate),
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
    partners: await resolvePartners(partnerIds),
  };
}
