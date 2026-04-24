import React, { useState } from "react";
import { 
  Zap, 
  Clock, 
  Power, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Calendar,
  Activity,
  Bot
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { db, handleFirestoreError } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function CronJobsView({ cronJobs }: { cronJobs: any[] }) {
  const toggleStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateDoc(doc(db, "cronJobs", jobId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, "update", `cronJobs/${jobId}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic">Temporal Automations</h2>
          <p className="text-zinc-500 text-sm font-medium">Managing scheduled logic cycles across nodes.</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
          <Plus size={14} className="mr-2" /> Schedule Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cronJobs.map((job) => (
          <Card key={job.id} className="bg-card border-border overflow-hidden group hover:border-zinc-700 transition-all">
             <div className="flex h-full">
               <div className={cn(
                 "w-1 h-full",
                 job.status === 'active' ? "bg-emerald-500" : "bg-zinc-800"
               )} />
               <div className="flex-1 p-6">
                 <div className="flex items-start justify-between">
                   <div className="space-y-1">
                     <h3 className="text-lg font-bold tracking-tight text-zinc-100 italic">{job.name}</h3>
                     <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest">
                       <span className="flex items-center gap-1.5 text-zinc-500">
                         <Calendar size={12} className="text-zinc-500" />
                         {job.schedule}
                       </span>
                       <span className="flex items-center gap-1.5 text-emerald-500">
                         <Zap size={12} />
                         Target ID: {job.targetAgentId}
                       </span>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <Badge className={cn(
                       job.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                     )}>
                       {job.status}
                     </Badge>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-100"><MoreVertical size={16} /></Button>
                   </div>
                 </div>

                 <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/50 pt-4">
                   <StatItem label="Last Execution" value="12M AGO" />
                   <StatItem label="Next Window" value="9H 24M" />
                   <StatItem label="Load Factor" value="0.02%" />
                 </div>

                 <div className="mt-6 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono italic">
                     <Activity size={12} />
                     Operational cycle optimized.
                   </div>
                   <div className="flex gap-2">
                     <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest border-border hover:bg-muted">Logs</Button>
                     <Button 
                       onClick={() => toggleStatus(job.id, job.status)}
                       size="sm" 
                       className={cn(
                         "h-8 text-[10px] uppercase font-bold tracking-widest transition-all",
                         job.status === 'active' ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                       )}
                     >
                       {job.status === 'active' ? 'Disable' : 'Enable'}
                     </Button>
                   </div>
                 </div>
               </div>
             </div>
          </Card>
        ))}
      </div>
      
      {/* Simulation Info */}
      <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4 text-xs text-zinc-500">
         <div className="w-10 h-10 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
           <Zap size={20} />
         </div>
         <p className="leading-relaxed">
           <span className="text-emerald-500 font-bold uppercase tracking-widest mr-1">Neural Sync Note:</span>
           Cron jobs are simulated operational cycles. In the production cluster, these are executed by the Orchestrator Node via standard Unix-style crontab vectors.
         </p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
      <span className="text-xs font-bold text-zinc-200 font-mono italic">{value}</span>
    </div>
  );
}
