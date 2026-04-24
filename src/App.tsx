import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  GitBranch, 
  Database, 
  Terminal, 
  Settings,
  Activity,
  Zap,
  ShieldCheck,
  Plus,
  MessageSquare,
  Network,
  ChevronRight,
  LineChart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import socket from "./lib/socket";

// Components
import AgentsView from "./components/AgentsView";
import DashboardView from "./components/DashboardView";
import WorkflowEditor from "./components/WorkflowEditor";
import SkillsView from "./components/SkillsView";
import MemoryView from "./components/MemoryView";
import LogsView from "./components/LogsView";
import ChatView from "./components/ChatView";
import UsageView from "./components/UsageView";
import CronJobsView from "./components/CronJobsView";
import OrgView from "./components/OrgView";
import TerminalView from "./components/TerminalView";
import ProjectContextSelector from "./components/ProjectContextSelector";

import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  const [agents, setAgents] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [cronJobs, setCronJobs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isSidebarTabsVisible, setIsSidebarTabsVisible] = useState(true);

  useEffect(() => {
    socket.on("init_data", (data) => {
      setAgents(data.agents);
      setSkills(data.skills);
      setUsage(data.usage);
      setCronJobs(data.cronJobs || []);
      setProjects(data.projects || []);
    });

    socket.on("agent_updated", (updatedAgents) => {
      setAgents(updatedAgents);
    });

    socket.on("agent_log", (log) => {
      setLogs(prev => [log, ...prev].slice(0, 100));
    });

    socket.on("usage_updated", (newUsage) => {
      setUsage(newUsage);
    });

    socket.on("cron_jobs_updated", (newJobs) => {
      setCronJobs(newJobs);
    });

    return () => {
      socket.off("init_data");
      socket.off("agent_updated");
      socket.off("agent_log");
      socket.off("usage_updated");
      socket.off("cron_jobs_updated");
    };
  }, []);

  return (
    <TooltipProvider>
      <Router>
        <AppLayout 
          agents={agents} 
          skills={skills} 
          logs={logs} 
          usage={usage} 
          cronJobs={cronJobs} 
          projects={projects}
          activeProjectId={activeProjectId}
          setActiveProjectId={setActiveProjectId}
          isSidebarTabsVisible={isSidebarTabsVisible}
          setIsSidebarTabsVisible={setIsSidebarTabsVisible}
        />
      </Router>
    </TooltipProvider>
  );
}

function AppLayout({ 
  agents, 
  skills, 
  logs, 
  usage, 
  cronJobs, 
  projects, 
  activeProjectId, 
  setActiveProjectId,
  isSidebarTabsVisible,
  setIsSidebarTabsVisible
}: { 
  agents: any[], 
  skills: any[], 
  logs: any[], 
  usage: any, 
  cronJobs: any[],
  projects: any[],
  activeProjectId: string | null,
  setActiveProjectId: (id: string | null) => void,
  isSidebarTabsVisible: boolean,
  setIsSidebarTabsVisible: (visible: boolean) => void
}) {
  const location = useLocation();
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Left Sidebar */}
      <aside className={cn(
        "glass-card glass-card-dark rounded-none border-r border-border flex flex-col z-20 transition-all duration-300",
        isSidebarTabsVisible ? "w-64" : "w-16"
      )}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-zinc-950 font-bold">
              O
            </div>
            {isSidebarTabsVisible && (
              <span className="font-semibold text-zinc-100 tracking-tight text-crisp">OPENCLAW</span>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarTabsVisible(!isSidebarTabsVisible)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Settings size={14} className="text-zinc-500" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <SidebarSection label="Communication" defaultOpen={true} isCollapsed={!isSidebarTabsVisible}>
            <SidebarLink to="/chat" label="Chat" isCollapsed={!isSidebarTabsVisible} />
          </SidebarSection>
          
          <SidebarSection label="Orchestration" isCollapsed={!isSidebarTabsVisible}>
            <SidebarLink to="/" icon={<LayoutDashboard size={16} />} label="Overview" isCollapsed={!isSidebarTabsVisible} />
            <SidebarLink to="/org" icon={<Network size={16} />} label="Organization" isCollapsed={!isSidebarTabsVisible} />
            <SidebarLink to="/agents" icon={<Users size={16} />} label="Agents" count={agents.length} isCollapsed={!isSidebarTabsVisible} />
            <SidebarLink to="/skills" icon={<Wrench size={16} />} label="Skills" isCollapsed={!isSidebarTabsVisible} />
            <SidebarLink to="/workflows" icon={<GitBranch size={16} />} label="Workflows" isCollapsed={!isSidebarTabsVisible} />
          </SidebarSection>
          
          <SidebarSection label="Engine" defaultOpen={false} isCollapsed={!isSidebarTabsVisible}>
            <SidebarLink to="/memory" icon={<Database size={16} />} label="Vault" isCollapsed={!isSidebarTabsVisible} />
            <SidebarLink to="/usage" icon={<LineChart size={16} />} label="Usage" isCollapsed={!isSidebarTabsVisible} />
            <SidebarLink to="/terminal" icon={<Terminal size={16} />} label="Terminal" isCollapsed={!isSidebarTabsVisible} />
            <SidebarLink to="/logs" icon={<Activity size={16} />} label="Logs" isCollapsed={!isSidebarTabsVisible} />
          </SidebarSection>
        </nav>

        {isSidebarTabsVisible && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-2 px-2 text-zinc-200 italic">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono tracking-tight text-crisp">Cluster: GCP-US-CENTRAL</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded overflow-hidden shadow-inner">
              <div 
                className="bg-emerald-500 h-full transition-all duration-700 ease-out" 
                style={{ width: `${(agents.filter(a => a.status === 'running').length / Math.max(agents.length, 1)) * 100}%` }}
              />
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative app-bg-glass">
        {/* Top Bar - Header */}
        <header className="h-16 glass-card-dark border-b border-border flex items-center justify-between px-8 z-10 transition-all duration-300">
          <div className="flex gap-8">
            <HeaderStat label="System Latency" value="4ms" />
            <HeaderStat label="Active Threads" value={agents.filter(a => a.status === 'running').length.toString()} />
            <HeaderStat label="Session Resource" value="0.012% / m" />
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-zinc-100 uppercase tracking-widest text-crisp">OPENCLAW DASHBOARD</span>
            
            <button className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" referrerPolicy="no-referrer" />
            </button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-auto p-8 bg-background relative">
          <div className="absolute inset-0 geometric-grid opacity-20 pointer-events-none" />
          <div className="relative z-10 h-full">
            <Routes location={location}>
              <Route path="/" element={<DashboardView agents={agents} skills={skills} logs={logs} usage={usage} />} />
              <Route path="/org" element={<OrgView agents={agents} />} />
              <Route path="/chat" element={<ChatView agents={agents} skills={skills} logs={logs} activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId} projects={projects} />} />
              <Route path="/agents" element={<AgentsView agents={agents} />} />
              <Route path="/skills" element={<SkillsView skills={skills} />} />
              <Route path="/workflows" element={<WorkflowEditor />} />
              <Route path="/memory" element={<MemoryView activeProjectId={activeProjectId} projects={projects} />} />
              <Route path="/logs" element={<LogsView logs={logs} />} />
              <Route path="/terminal" element={<TerminalView />} />
              <Route path="/usage" element={<UsageView usage={usage} />} />
              <Route path="/cron" element={<CronJobsView cronJobs={cronJobs} />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, count, isCollapsed }: { to: string, icon?: React.ReactNode, label: string, count?: number, isCollapsed: boolean }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (isCollapsed) {
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center justify-center p-2 rounded-md transition-all group relative",
          isActive 
            ? "nav-active" 
            : "text-zinc-500 hover:bg-secondary hover:text-zinc-200"
        )}
      >
        {icon && (
          <span className={cn("transition-colors", isActive ? "text-emerald-500" : "group-hover:text-zinc-300")}>
            {icon}
          </span>
        )}
        {count !== undefined && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full" />
        )}
      </Link>
    );
  }

  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group",
        isActive 
          ? "nav-active" 
          : "text-zinc-400 hover:bg-secondary hover:text-zinc-200"
      )}
    >
      {icon && (
        <span className={cn("transition-colors", isActive ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-300")}>
          {icon}
        </span>
      )}
      <span className={cn("truncate text-crisp", !icon && "ml-0")}>{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded text-zinc-500 font-mono">
          {count}
        </span>
      )}
    </Link>
  );
}

function SidebarSection({ label, children, defaultOpen = true, isCollapsed }: { label: string, children: React.ReactNode, defaultOpen?: boolean, isCollapsed: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  if (isCollapsed) {
    return <div className="space-y-2 py-4 border-t border-border/50">{children}</div>;
  }

  return (
    <div className="pt-4 space-y-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors"
      >
        <span className="text-crisp text-[9px]">{label}</span>
        <ChevronRight size={10} className={cn("transition-transform", isOpen && "rotate-90")} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeaderStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight text-crisp">{label}</span>
      <span className="text-zinc-100 font-mono text-sm text-crisp">{value}</span>
    </div>
  );
}

