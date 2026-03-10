import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";

function App() {
  return (
    <ProjectsProvider>
      <Index />
      <Toaster />
    </ProjectsProvider>
  );
}

export default App;
