import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SOS from "./pages/SOS";
import Resources from "./pages/Resources";
import Jobs from "./pages/Jobs";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import RescuedPeople from "./pages/RescuedPeople";
import IncidentsDetails from "./pages/IncidentsDetails";
import EtaDetails from "./pages/EtaDetails";
import MapView from "./pages/MapView";
import TeamStatus from "./pages/TeamStatus";
import JobApplication from "./pages/JobApplication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sos" element={<SOS />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:jobId/apply" element={<JobApplication />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rescued-people" element={<RescuedPeople />} />
              <Route path="/incidents" element={<IncidentsDetails />} />
              <Route path="/eta-details" element={<EtaDetails />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/team-status" element={<TeamStatus />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
