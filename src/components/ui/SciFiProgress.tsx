import { motion } from 'motion/react';

interface SciFiProgressProps {
    value: number;
    max: number;
    label: string;
    variant?: 'cyan' | 'amber' | 'emerald';
}

export function SciFiProgress({ value, max, label, variant = 'cyan' }: SciFiProgressProps) {
    const percentage = Math.min(100, Math.max(0, (max > 0 ? value / max : 0) * 100));
    
    const gradients = {
        cyan: 'from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]',
        amber: 'from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]',
        emerald: 'from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
    };

    const bgColors = {
        cyan: 'bg-slate-900 border-cyan-500/30',
        amber: 'bg-slate-900 border-amber-500/30',
        emerald: 'bg-slate-900 border-emerald-500/30'
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-300">
                <span>{label}</span>
                <span className="text-white">{value} / {max}</span>
            </div>
            <div className={`h-2.5 w-full overflow-hidden rounded-full border border-slate-700/50 ${bgColors[variant]}`}>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${gradients[variant]}`}
                />
            </div>
        </div>
    );
}
