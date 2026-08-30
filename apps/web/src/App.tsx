// Archive of Trust direction: the app shell stays quiet and editorial, with an ink canvas, warm paper surfaces, and copper / emerald status cues.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AssetChainPage from "./pages/AssetChainPage";
import Home from "./pages/Home";
import OpenBankingDashboard from "./pages/OpenBankingDashboard";
import PlatformDashboard from "./pages/PlatformDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PlatformDashboard} />
      <Route path="/dashboard" component={PlatformDashboard} />
      <Route path="/platform" component={PlatformDashboard} />
      <Route path="/open-banking" component={OpenBankingDashboard} />
      <Route path="/asset-chain" component={AssetChainPage} />
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
