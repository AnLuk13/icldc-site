import { collection, getDocs, getDoc, doc } from "firebase/firestore/lite";
import { db } from "./firestore";
import { withId, toDate } from "./converters";
import type { Partner, Project } from "@/lib/types";

/** Fetches a single project by ID without importing from projects.ts (avoids circular deps). */
async function fetchProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  const raw = snap.data();
  return {
    ...withId<Omit<Project, "id">>(snap),
    startDate: toDate(raw.startDate),
    endDate: toDate(raw.endDate),
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
}

async function resolveProjects(projectIds: string[]): Promise<Project[]> {
  if (!projectIds?.length) return [];
  const results = await Promise.all(projectIds.map(fetchProject));
  return results.filter((p): p is Project => p !== null);
}

export async function getPartners(): Promise<Partner[]> {
  const snap = await getDocs(collection(db, "partners"));
  return Promise.all(
    snap.docs.map(async (d) => {
      const raw = d.data();
      const projectIds: string[] = raw.projects ?? [];
      return {
        ...withId<Omit<Partner, "id">>(d),
        logo: raw.logo,
        createdAt: toDate(raw.createdAt),
        updatedAt: toDate(raw.updatedAt),
        projects: await resolveProjects(projectIds),
      };
    }),
  );
}

export async function getPartner(id: string): Promise<Partner | null> {
  const snap = await getDoc(doc(db, "partners", id));
  if (!snap.exists()) return null;
  const raw = snap.data();
  const projectIds: string[] = raw.projects ?? [];
  return {
    ...withId<Omit<Partner, "id">>(snap),
    logo: raw.logo,
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
    projects: await resolveProjects(projectIds),
  };
}
