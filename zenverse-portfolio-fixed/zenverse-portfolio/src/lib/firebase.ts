// Firebase Configuration - FIXED VERSION
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAOr7_z7ibQ5nzRxg_QchxXTfWr9ZQDhX4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "a-portfo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "a-portfo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "a-portfo.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "366282535867",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:366282535867:web:5a1843b2f303c1eda10a9e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-REZVN6MB14"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Projects collection reference
export const projectsCollection = collection(db, "projects");

// Fetch all projects from Firestore
export const fetchProjectsFromFirebase = async () => {
  try {
    const q = query(projectsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const projects: any[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Add a new project to Firestore
export const addProjectToFirebase = async (projectData: any) => {
  try {
    const docRef = await addDoc(projectsCollection, {
      ...projectData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// Update a project in Firestore
export const updateProjectInFirebase = async (projectId: string, data: any) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project from Firestore
export const deleteProjectFromFirebase = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, "projects", projectId));
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
