import { getFirestore } from "firebase/firestore/lite";
import { firebaseApp } from "./config";

export const db = getFirestore(firebaseApp);
