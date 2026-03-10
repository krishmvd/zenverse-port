import { useState, useEffect, useCallback } from "react";
import { useProjects, type Project } from "@/contexts/ProjectsContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Star, ExternalLink, X } from "lucide-react";

// Admin Panel Component
function AdminPanel({ onClose }: { onClose: () => void }) {
  const { projects, loading, addProject, deleteProject, toggleFeatured } = useProjects();
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: "",
    image: "",
    featured: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.title || !newProject.description) {
      toast.error("Title and description are required!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addProject(newProject);
      toast.success("Project added successfully!");
      setNewProject({
        title: "",
        description: "",
        link: "",
        image: "",
        featured: true,
      });
    } catch (error) {
      toast.error("Failed to add project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Add New Project Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Add New Project</h3>
          
          <div>
            <input
              type="text"
              placeholder="Project Title *"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <textarea
              placeholder="Project Description *"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <input
              type="url"
              placeholder="Project Link (https://...)"
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newProject.image}
              onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </>
            )}
          </Button>
        </form>

        {/* Existing Projects List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            Existing Projects ({projects.length})
          </h3>
          
          {loading && projects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No projects yet. Add your first one above!</p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{project.title}</h4>
                    <p className="text-gray-400 text-sm truncate max-w-md">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFeatured(project.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        project.featured
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-zinc-700 text-gray-400 hover:text-yellow-500"
                      }`}
                      title={project.featured ? "Unfeature" : "Feature"}
                    >
                      <Star className={`w-4 h-4 ${project.featured ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group">
      {project.image && (
        <div className="mb-4 overflow-hidden rounded-xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      
      <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
      <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>
      
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          View Project
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

// Main Index Page
export default function Index() {
  const { projects, loading } = useProjects();
  const [adminOpen, setAdminOpen] = useState(false);

  // Secret key combination: Shift + Ctrl + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.ctrlKey && e.key === "A") {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Panel */}
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-400 font-medium mb-4 tracking-wide uppercase text-sm">
            Web Developer & Vibe Coder
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              W3b Dev
            </span>
            <br />
            Krish
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            I build modern websites, creative UI experiences, and clean web interfaces with code and design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#projects"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-zinc-700 hover:border-zinc-500 text-white rounded-full font-medium transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Work</h2>
            <p className="text-gray-400 text-lg">Featured Projects</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let&apos;s Connect</h2>
          <p className="text-gray-400 mb-8">
            Have a project in mind? Let&apos;s work together to bring your ideas to life.
          </p>
          <a
            href="mailto:hello@zenverse.dev"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium transition-all"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Krish — Built with code & vibe.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/krishmvd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
