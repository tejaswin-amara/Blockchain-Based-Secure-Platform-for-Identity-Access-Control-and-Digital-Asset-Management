// Archive of Trust direction: the app shell stays quiet and editorial, with an ink canvas, warm paper surfaces, and copper / emerald status cues.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AssetChainProvider } from "./contexts/AssetChainContext";
import { PeerSyncProvider } from "./contexts/PeerSyncContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AssetChainPage from "./pages/AssetChainPage";
import Home from "./pages/Home";
import OpenBankingDashboard from "./pages/OpenBankingDashboard";
import PlatformDashboard from "./pages/PlatformDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PlatformDashboard} />
      <Route path="/dashboard" component={PlatformDashboard} />
      
      {/* Protected Admin-Only Routes */}
      <Route path="/platform">
        <ProtectedRoute requiredRole="admin">
          <PlatformDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/blockchain">
        <ProtectedRoute requiredRole="admin">
          <PlatformDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute requiredRole="admin">
          <PlatformDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/assets/create">
        <ProtectedRoute requiredRole="admin">
          <PlatformDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/asset-chain">
        <ProtectedRoute requiredRole="admin">
          <AssetChainPage />
        </ProtectedRoute>
      </Route>

      {/* Public / User Routes */}
      <Route path="/open-banking" component={OpenBankingDashboard} />
      <Route path="/home" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <AssetChainProvider>
            <PeerSyncProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </PeerSyncProvider>
          </AssetChainProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
