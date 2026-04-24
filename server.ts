import express from "express";
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";

// --- Types ---
interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: "idle" | "running" | "failed";
  memory_provider: string;
  tools: string[];
  skills: string[];
  type?: "agent" | "sub-agent";
  plugins?: string[];
  automations?: string[];
  layer?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    remember: boolean;
    share: boolean;
  };
}

interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
}

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun?: Date;
  status: "active" | "inactive";
  targetAgentId: string;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string; // 'file' | 'photo'
  url?: string;
  size?: number;
  created_at: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  owner_id: string;
  instructions?: string;
  files: ProjectFile[];
}

interface Memory {
  id: string;
  user_id: string;
  org_id?: string;
  project_id?: string;
  chat_id?: string;
  scope: "global" | "project" | "session";
  content: string;
  summary: string;
  embedding?: number[];
  tags: string[];
  source_type: string;
  created_at: Date;
  updated_at: Date;
  importance_score: number;
  expires_at?: Date;
}

// --- Data ---
let projects: Project[] = [
  { 
    id: "p1", 
    name: "Project Aurora", 
    description: "Strategic expansion into neural networks.", 
    color: "#10b981", 
    owner_id: "u1",
    instructions: "Always focus on scalability and neural efficiency.",
    files: [
      { id: "f1", name: "network_specs.pdf", type: "file", size: 1024 * 45, created_at: new Date() },
      { id: "f2", name: "architecture_diagram.png", type: "photo", size: 1024 * 800, created_at: new Date() }
    ]
  },
  { 
    id: "p2", 
    name: "Project Zenith", 
    description: "Top-level architecture redesign.", 
    color: "#3b82f6", 
    owner_id: "u1",
    instructions: "Maintain modularity at all costs.",
    files: []
  }
];

let memories: Memory[] = [
  {
    id: "m1",
    user_id: "u1",
    scope: "global",
    content: "The system override password is 'OPENCLAW-2024'.",
    summary: "System override password",
    tags: ["security", "credentials"],
    source_type: "manual",
    created_at: new Date(),
    updated_at: new Date(),
    importance_score: 0.9
  },
  {
    id: "m2",
    user_id: "u1",
    project_id: "p1",
    scope: "project",
    content: "Neural link frequency should be set to 432Hz for stability.",
    summary: "Neural link frequency setting",
    tags: ["technical", "calibration"],
    source_type: "observation",
    created_at: new Date(),
    updated_at: new Date(),
    importance_score: 0.8
  },
  {
    id: "m3",
    user_id: "u1",
    project_id: "p2",
    scope: "project",
    content: "Project Zenith requires a bypass of the primary firewall using port 8080.",
    summary: "Zenith firewall bypass",
    tags: ["security", "networking"],
    source_type: "manual",
    created_at: new Date(),
    updated_at: new Date(),
    importance_score: 0.7
  },
  {
    id: "m4",
    user_id: "u1",
    chat_id: "c1",
    scope: "session",
    content: "The user mentioned they are testing the new memory system specifically for session-only data.",
    summary: "Session test note",
    tags: ["test"],
    source_type: "conversation",
    created_at: new Date(),
    updated_at: new Date(),
    importance_score: 0.5
  }
];

let agents: Agent[] = [
  {
    id: "1",
    name: "L.I.S.A.",
    role: "Lead Orchestrator",
    model: "gemini-1.5-pro",
    status: "idle",
    memory_provider: "LanceDB-Org",
    tools: ["web_search", "code_interpreter"],
    skills: ["skill-1"],
    type: "agent",
    layer: "personal",
    permissions: { read: true, write: true, remember: true, share: false },
    plugins: [],
    automations: []
  },
  {
    id: "2-prime",
    name: "Architect Prime",
    role: "System Designer",
    model: "gemini-3.1-pro-preview",
    status: "running",
    memory_provider: "Qdrant",
    tools: ["git_access"],
    skills: ["skill-2"],
    type: "sub-agent",
    layer: "org",
    permissions: { read: true, write: true, remember: true, share: true },
    plugins: [],
    automations: []
  },
  {
    id: "2",
    name: "OpenClaw",
    role: "Tactical Response",
    model: "gemini-2.0-flash-exp",
    status: "idle",
    memory_provider: "LanceDB-Org",
    tools: ["neural_defense"],
    skills: ["Rapid Analysis", "Edge Computing", "Neural Defense"],
    layer: "org",
    permissions: { read: true, write: true, remember: true, share: true }
  }
];

let skills: Skill[] = [
  { id: "skill-1", name: "Web Scraper", description: "Extracts data from websites", version: "1.0.0" },
  { id: "skill-2", name: "Code Reviewer", description: "Analyzes and suggests improvements to code", version: "1.1.0" }
];

let clawhubRegistry = {
  skills: [
    { id: "skill-3", name: "Slack Integrator", description: "Send and receive messages via Slack", category: "Social" },
    { id: "skill-4", name: "Image Generator", description: "Generate assets using DALL-E/Stable Diffusion", category: "Media" },
    { id: "skill-5", name: "Market Analyzer", description: "Real-time stock and crypto monitoring", category: "Finance" }
  ],
  plugins: [
    { id: "plug-1", name: "DeepSearch", description: "Advanced vector search across all memories" },
    { id: "plug-2", name: "AutoLog", description: "Automated detailed reporting and logging" }
  ],
  automations: [
    { id: "auto-1", name: "Morning Brief", description: "Summarize top events every morning" },
    { id: "auto-2", name: "Fail-over Sync", description: "Redundant cross-region state sync" }
  ]
};

let usageStats = {
  cpu: 18.4,
  memory: 42.1,
  requests: 1240,
  latency: 42,
  cost: {
    total: 124.50,
    today: 12.80,
    average: 8.45,
    currency: "USD"
  },
  models: [
    { name: "Gemini 1.5 Pro", tokens: 850000, cost: 45.20, color: "#10b981" },
    { name: "Gemini 1.5 Flash", tokens: 4200000, cost: 21.00, color: "#3b82f6" },
    { name: "GPT-4o", tokens: 120000, cost: 34.80, color: "#a855f7" },
    { name: "Claude 3.5 Sonnet", tokens: 250000, cost: 23.50, color: "#f97316" }
  ],
  history: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 100),
    cost: Math.random() * 2
  }))
};

let cronJobs: CronJob[] = [
  { id: "cron-1", name: "Daily Memory Backup", schedule: "0 0 * * *", status: "active", targetAgentId: "1" },
  { id: "cron-2", name: "Weekly Performance Audit", schedule: "0 0 * * 0", status: "inactive", targetAgentId: "2" }
];

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/init", (req, res) => {
    res.json({ agents, skills, usage: usageStats, cronJobs, registry: clawhubRegistry, projects, memories });
  });

  // --- Project Routes ---
  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const newProject: Project = {
      ...req.body,
      id: "p_" + Math.random().toString(36).substr(2, 9),
      owner_id: "u1" // Hardcoded for demo
    };
    projects.push(newProject);
    res.json(newProject);
  });

  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...req.body };
      res.json(projects[index]);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  });

  app.post("/api/projects/:id/files", (req, res) => {
    const { id } = req.params;
    const project = projects.find(p => p.id === id);
    if (project) {
      const newFile: ProjectFile = {
        ...req.body,
        id: "f_" + Math.random().toString(36).substr(2, 9),
        created_at: new Date()
      };
      if (!project.files) project.files = [];
      project.files.push(newFile);
      res.json(newFile);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  });

  // --- Memory Routes ---
  app.get("/api/memories", (req, res) => {
    res.json(memories);
  });

  app.post("/api/memories", (req, res) => {
    const newMemory: Memory = {
      ...req.body,
      id: "m_" + Math.random().toString(36).substr(2, 9),
      created_at: new Date(),
      updated_at: new Date()
    };
    memories.push(newMemory);
    res.json(newMemory);
  });

  app.put("/api/memories/:id", (req, res) => {
    const { id } = req.params;
    const index = memories.findIndex(m => m.id === id);
    if (index !== -1) {
      memories[index] = { ...memories[index], ...req.body, updated_at: new Date() };
      res.json(memories[index]);
    } else {
      res.status(404).json({ error: "Memory not found" });
    }
  });

  app.delete("/api/memories/:id", (req, res) => {
    const { id } = req.params;
    memories = memories.filter(m => m.id !== id);
    res.json({ success: true });
  });

  // Retrieval rules implementation
  app.post("/api/memories/search", (req, res) => {
    const { active_project_id, chat_id, query, cross_project_search = false, exclude_ids = [] } = req.body;
    
    // Filtering logic as per requirements
    const results = memories.filter(m => {
      // 0. Check exclusion list
      if (exclude_ids.includes(m.id)) return false;

      // 1. Always include GLOBAL memories
      if (m.scope === "global") return true;

      // 2. Include SESSION memories for the current chat
      if (m.scope === "session" && m.chat_id === chat_id) return true;

      // 3. Project scoped memories
      if (m.scope === "project") {
        // If cross_project_search is enabled, return all project memories
        if (cross_project_search) return true;
        
        // Otherwise, only if it matches active project
        return m.project_id === active_project_id;
      }

      return false;
    });

    res.json(results);
  });

  app.get("/api/agents", (req, res) => {
    res.json(agents);
  });

  app.post("/api/agents", (req, res) => {
    const newAgent = { 
      ...req.body, 
      id: Math.random().toString(36).substr(2, 9), 
      status: "idle",
      plugins: [],
      automations: []
    };
    agents.push(newAgent);
    io.emit("agent_updated", agents);
    res.json(newAgent);
  });

  app.put("/api/agents/:id", (req, res) => {
    const { id } = req.params;
    const index = agents.findIndex(a => a.id === id);
    if (index !== -1) {
      agents[index] = { ...agents[index], ...req.body };
      io.emit("agent_updated", agents);
      res.json(agents[index]);
    } else {
      res.status(404).json({ error: "Agent not found" });
    }
  });

  app.delete("/api/agents/:id", (req, res) => {
    const { id } = req.params;
    agents = agents.filter(a => a.id !== id);
    io.emit("agent_updated", agents);
    res.json({ success: true });
  });

  app.get("/api/skills", (req, res) => {
    res.json(skills);
  });

  app.get("/api/usage", (req, res) => {
    res.json(usageStats);
  });

  app.get("/api/cron", (req, res) => {
    res.json(cronJobs);
  });

  app.get("/api/registry", (req, res) => {
    res.json(clawhubRegistry);
  });

  // OpenRouter Proxy (Placeholder - requires API Key in env)
  app.post("/api/ai/chat", async (req, res) => {
    const { messages, model = "openrouter/auto" } = req.body;
    try {
      // In a real implementation with an API key:
      /*
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model, messages })
      });
      const data = await response.json();
      res.json({ content: data.choices[0].message.content });
      */
      
      // If no key is set, we'll return a mock "helpful" response or a reminder to set the key
      if (!process.env.OPENROUTER_API_KEY) {
        res.json({ 
          content: "[SYSTEM]: OpenRouter API Key not detected in environment. Please provide OPENROUTER_API_KEY to enable 3rd party model communication. Falling back to internal reasoning...",
          fallback: true
        });
      } else {
        // Mock success if key exists (Actual implementation would be as above)
        res.json({ content: "This is a simulated response from OpenRouter." });
      }
    } catch (error) {
      res.status(500).json({ error: "Upstream AI failure" });
    }
  });

  // --- WebSockets ---
  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("init_data", { agents, skills, usage: usageStats, cronJobs, registry: clawhubRegistry });

    socket.on("run_agent", (agentId) => {
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        agent.status = "running";
        io.emit("agent_updated", agents);
        
        // Simulating work
        setTimeout(() => {
          agent.status = "idle";
          io.emit("agent_updated", agents);
          io.emit("agent_log", { agentId, message: "Task completed successfully", timestamp: new Date() });
        }, 3000);
      }
    });

    socket.on("update_agent", (data: { id: string, name?: string, role?: string }) => {
      const index = agents.findIndex(a => a.id === data.id);
      if (index !== -1) {
        agents[index] = { ...agents[index], ...data };
        io.emit("agent_updated", agents);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Mission Control Server running at http://localhost:${PORT}`);
  });
}

startServer();
