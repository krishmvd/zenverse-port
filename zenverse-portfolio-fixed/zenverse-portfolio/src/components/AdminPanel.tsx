import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Pencil, Star, StarOff, Image as ImageIcon, Loader2 } from "lucide-react";
import { useProjects, type Project } from "@/hooks/useProjects";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_CODE = "KRISHADMIN2026";

const AdminPanel = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { projects, addProject, updateProject, deleteProject, toggleFeatured } = useProjects();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.ctrlKey && e.key === "A") {
        e.preventDefault();
        setShowCodeModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCodeSubmit = () => {
    if (code === ADMIN_CODE) {
      setShowCodeModal(false);
      setShowDashboard(true);
      setCode("");
      setError("");
    } else {
      setError("Invalid code");
    }
  };

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, GIF, WEBP allowed");
      return;
    }
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 100MB.`);
      return;
    }
    setError("");
    setUploading(true);
    setUploadProgress(10);

    try {
      // Upload via Cloudinary edge function
      setUploadProgress(30);
      const formData = new FormData();
      formData.append("file", file);

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-cloudinary`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: formData,
        }
      );

      setUploadProgress(80);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setImage(result.url);
      setUploadProgress(100);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setImage("");
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (editingId) {
      updateProject(editingId, { title, description, link, ...(image ? { image } : {}) });
    } else {
      addProject({ title, description, image, link, featured: true });
    }
    resetForm();
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setLink(p.link);
    setImage(p.image);
  };

  return (
    <>
      {/* Code Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-accent/60 backdrop-blur-sm"
            onClick={() => { setShowCodeModal(false); setCode(""); setError(""); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-8 w-full max-w-sm mx-4"
              style={{ boxShadow: "var(--shadow-card-hover)" }}
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                Enter Admin Code
              </h3>
              <p className="text-xs text-muted-foreground mb-5">Access restricted to authorized users</p>
              <input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                placeholder="Secret code"
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
                autoFocus
              />
              {error && <p className="text-xs text-destructive mt-2">{error}</p>}
              <button
                onClick={handleCodeSubmit}
                className="mt-4 w-full py-2.5 bg-accent text-accent-foreground font-display font-medium text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                Enter
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-lg overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto px-6 py-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Admin Dashboard
                </h2>
                <button
                  onClick={() => { setShowDashboard(false); resetForm(); }}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Add/Edit Form */}
              <div className="bg-card border border-border rounded-xl p-6 mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
                <h3 className="font-display font-semibold text-foreground mb-4">
                  {editingId ? "Edit Project" : "Add Project"}
                </h3>
                <div className="space-y-3">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project Title"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Project link (optional)"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      {uploading ? "Uploading..." : image ? "Change Image" : "Upload Image"}
                    </button>
                    {uploading && (
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono w-8">{uploadProgress}%</span>
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {image && (
                      <img src={image} alt="Preview" className="w-10 h-10 rounded-md object-cover border border-border" loading="eager" />
                    )}
                  </div>
                  {error && (
                    <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground font-display font-medium text-sm rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      {editingId ? "Update" : "Add Project"}
                    </button>
                    {editingId && (
                      <button
                        onClick={resetForm}
                        className="px-4 py-2.5 border border-border text-sm rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Project List */}
              <div className="space-y-3">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-sm text-foreground truncate">
                        {p.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleFeatured(p.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                        title={p.featured ? "Unfeature" : "Feature"}
                      >
                        {p.featured ? <Star className="w-4 h-4 fill-primary text-primary" /> : <StarOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(p)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No projects yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
