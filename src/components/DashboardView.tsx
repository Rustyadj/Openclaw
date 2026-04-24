import React from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Wrench, 
  Activity, 
  Clock, 
  ChevronRight,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function DashboardView({ agents, skills, logs, usage }: { agents: any[], skills: any[], logs: any[], usage: any }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic text-crisp">Sector Overview</h2>
        <p className="text-zinc-500 text-sm font-medium text-crisp">Monitoring autonomous node distribution across clusters.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Cluster Population" 
          value={agents.length.toString()} 
          subValue={`+2 deployed / 24h`}
          icon={<Users className="text-emerald-500" size={18} />} 
          trend="up"
        />
        <StatCard 
          title="Skill Manifest" 
          value={skills.length.toString()} 
          subValue="Integrated capabilities"
          icon={<Wrench className="text-blue-400" size={18} />} 
        />
        <StatCard 
          title="Network Latency" 
          value="42ms" 
          subValue="Internal cluster sync"
          icon={<Zap className="text-amber-500" size={18} />} 
          trend="up"
        />
        <StatCard 
          title="Token Velocity" 
          value="1.2k" 
          subValue="Active per minute"
          icon={<TrendingUp className="text-emerald-500" size={18} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 glass-card glass-card-dark">
          <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border/50 mb-4">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-100 uppercase tracking-tighter text-crisp">Event Vector</CardTitle>
              <CardDescription className="text-zinc-500 text-crisp">Global orchestration log.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="btn-secondary text-zinc-500 hover:text-zinc-100 text-[10px] uppercase font-bold tracking-widest border-none h-7">
              Full Spectrum <ChevronRight size={14} className="ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.length > 0 ? logs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-2 rounded border border-transparent hover:border-border hover:bg-muted/30 transition-all font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-zinc-500 font-bold uppercase">{agents.find(a => a.id === log.agentId)?.name || 'SYSTEM'}</span>
                       <span className="text-[10px] text-zinc-600 px-1 bg-muted rounded">OK</span>
                    </div>
                    <p className="text-xs text-zinc-300 truncate">{log.message}</p>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                   <div className="w-1 h-8 bg-border mx-auto animate-pulse mb-2" />
                   <p className="text-[10px] font-bold uppercase text-zinc-600 tracking-widest">Waiting for signal...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Health / Model Routing */}
        <Card className="glass-card glass-card-dark border-none">
          <CardHeader className="py-4 border-b border-zinc-800/50 mb-4">
            <CardTitle className="text-lg font-bold text-zinc-100 uppercase tracking-tighter">Thread Load</CardTitle>
            <CardDescription className="text-zinc-500">Resource distribution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ThreadStat label="GEMINI-FLASH-3" color="bg-emerald-500" percent={65} />
            <ThreadStat label="GEMINI-PRO-3" color="bg-blue-400" percent={25} />
            <ThreadStat label="SYSTEM-CORE" color="bg-zinc-700" percent={10} />

            <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-widest">Efficiency Vector</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                Autonomous scaling is active. System currently prioritizing low-latency inference routes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon, trend }: { title: string, value: string, subValue: string, icon: React.ReactNode, trend?: 'up' | 'down' }) {
  return (
    <Card className="glass-card glass-card-dark overflow-hidden relative group hover:glass-card-accent transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-crisp">{title}</p>
          <div className="p-1.5 rounded-md bg-muted border border-border">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-2xl font-mono font-bold text-zinc-100">{value}</h3>
          {trend && (
            <span className="text-[10px] font-bold text-emerald-500 py-0.5 px-1 bg-emerald-500/10 rounded">
              {trend === 'up' ? '↑' : '↓'}12%
            </span>
          )}
        </div>
        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">{subValue}</p>
      </CardContent>
    </Card>
  );
}

function ThreadStat({ label, color, percent }: { label: string, color: string, percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        <span>{label}</span>
        <span className="text-zinc-300">{percent}%</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden shadow-inner">
        <div className={cn("h-full transition-all duration-1000 ease-in-out", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
