import React from "react";
import { motion } from "motion/react";
import { 
  Activity, 
  Cpu, 
  Database, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  HardDrive,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { cn } from "../lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function UsageView({ usage }: { usage: any }) {
  if (!usage) return (
    <div className="flex items-center justify-center h-full text-zinc-500 italic">
      Synchronizing neural metrics...
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic text-crisp">Analytical Vector</h2>
        <p className="text-zinc-500 text-sm font-medium text-crisp">Neural resource distribution and financial overhead telemetry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Spent" 
          value={`$${usage.cost.total.toFixed(2)}`} 
          trend="+5.2% VS LAST MONTH" 
          up={true}
          icon={<DollarSign size={16} />}
        />
        <MetricCard 
          label="Spent Today" 
          value={`$${usage.cost.today.toFixed(2)}`} 
          trend="-2.1% OPTIMIZED" 
          up={false}
          icon={<Zap size={16} />}
        />
        <MetricCard 
          label="Daily Average" 
          value={`$${usage.cost.average.toFixed(2)}`} 
          trend="STABLE" 
          up={true}
          icon={<TrendingUp size={16} />}
        />
        <MetricCard 
          label="Total Requests" 
          value={usage.requests.toLocaleString()} 
          trend="+12% LOAD" 
          up={true}
          icon={<Activity size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card glass-card-dark">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 text-crisp">
                <Activity size={14} className="text-emerald-500" />
                Network Traffic & Cost (24H)
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <div className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-500/30 text-emerald-500 bg-emerald-500/5">REAL-TIME</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usage.history}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981', fontSize: '12px' }}
                  labelStyle={{ color: '#a1a1aa', fontSize: '10px', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="Load"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#usageGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="cost" 
                  name="Cost ($)"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={0} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card glass-card-dark">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 text-crisp">
              <PieIcon size={14} className="text-blue-500" />
              Model Distribution
            </CardTitle>
            <CardDescription className="text-[10px] text-zinc-500 uppercase tracking-tighter">Usage across neural architectures.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usage.models} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} fontSize={10} stroke="#71717a" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#27272a'}}
                    contentStyle={{ backgroundColor: '#121214', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="tokens" radius={[0, 4, 4, 0]}>
                    {usage.models.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {usage.models.map((model: any) => (
                <div key={model.name} className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
                    <span className="text-xs font-bold text-zinc-300">{model.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-zinc-100 italic">${model.cost.toFixed(2)}</p>
                    <p className="text-[9px] font-mono text-zinc-500">{(model.tokens / 1000000).toFixed(1)}M TKN</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card glass-card-dark">
          <CardHeader className="border-b border-border/50 pb-4">
             <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 text-crisp">
              <Cpu size={14} className="text-emerald-500" />
              Resource Saturation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <ResourceBar label="Logic Core (CPU)" value={usage.cpu} color="bg-emerald-500" />
            <ResourceBar label="Neural Memory (RAM)" value={usage.memory} color="bg-blue-500" />
            <ResourceBar label="Quantum Cache" value={28} color="bg-purple-500" />
          </CardContent>
        </Card>

        <Card className="glass-card glass-card-dark">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 text-crisp">
              <BarChart3 size={14} className="text-emerald-500" />
              Efficiency Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Response / $</p>
              <p className="text-xl font-mono text-emerald-400 italic">4.2k</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Latency P99</p>
              <p className="text-xl font-mono text-emerald-400 italic">124ms</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Token Reuse</p>
              <p className="text-xl font-mono text-emerald-400 italic">18.4%</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Uptime</p>
              <p className="text-xl font-mono text-emerald-400 italic">99.99%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, up, icon }: { label: string, value: string, trend: string, up: boolean, icon: React.ReactNode }) {
  return (
    <Card className="glass-card glass-card-dark overflow-hidden relative group">
       <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] scale-[4] rotate-12 group-hover:scale-[4.5] transition-transform text-zinc-100">
         {icon}
       </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded bg-muted/50 border border-border/50 text-zinc-400 group-hover:text-emerald-500 transition-colors">
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-crisp">{label}</span>
        </div>
        <div className="flex items-baseline justify-between mt-4">
          <h4 className="text-2xl font-bold tracking-tight text-zinc-100 font-mono italic text-crisp">{value}</h4>
          <div className={cn(
            "flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-tighter text-crisp",
            up ? "text-emerald-500" : "text-blue-400"
          )}>
            {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-crisp">
        <span>{label}</span>
        <span className="text-zinc-300 italic">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className={cn("h-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border text-crisp",
      className
    )}>
      {children}
    </span>
  );
}
