import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  fetchProjectsFromFirebase,
  addProjectToFirebase,
  updateProjectInFirebase,
  deleteProjectFromFirebase,
} from "@/lib/firebase";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  featured: boolean;
}

// Default projects as fallback
const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Vibe UI Kit",
    description: "A modern component library built with React and TailwindCSS. Focused on clean aesthetics and developer experience.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
    link: "https://example.com",
    featured: true,
  },
  {
    id: "2",
    title: "Neon Dashboard",
    description: "Real-time analytics dashboard with smooth animations, dark mode, and responsive design for data visualization.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    link: "https://example.com",
    featured: true,
  },
];

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from Firebase on mount
  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProjects = await fetchProjectsFromFirebase();
      if (fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      } else {
        // If no projects in Firebase, use defaults
        setProjects(defaultProjects);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects from database");
      // Fallback to default projects
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const addProject = useCallback(async (project: Omit<Project, "id">) => {
    try {
      setLoading(true);
      // Save to Firebase
      const newProject = await addProjectToFirebase(project);
      // Update local state
      setProjects((prev) => [...prev, newProject]);
    } catch (err) {
      console.error("Failed to add project:", err);
      setError("Failed to add project");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      setLoading(true);
      // Update in Firebase
      await updateProjectInFirebase(id, data);
      // Update local state
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    } catch (err) {
      console.error("Failed to update project:", err);
      setError("Failed to update project");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      // Delete from Firebase
      await deleteProjectFromFirebase(id);
      // Update local state
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError("Failed to delete project");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      await updateProject(id, { featured: !project.featured });
    }
  }, [projects, updateProject]);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        toggleFeatured,
        refreshProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}
