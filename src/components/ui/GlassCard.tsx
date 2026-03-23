import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    glowColor?: string;
    className?: string;
}

export function GlassCard({ children, glowColor = 'rgba(6,182,212,0.2)', className = '', ...props }: GlassCardProps) {
    return (
        <motion.div
            className={`rounded-2xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-xl shadow-xl transition-all ${className}`}
            style={{
                boxShadow: `0 8px 32px ${glowColor}, inset 0 0 0 1px rgba(255,255,255,0.05)`,
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface NeonButtonProps extends HTMLMotionProps<'button'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
}

export function NeonButton({ children, variant = 'primary', className = '', ...props }: NeonButtonProps) {
    const baseStyle = "relative overflow-hidden rounded-full font-bold text-white transition-all hover:scale-105 active:scale-95";
    const colors = {
        primary: "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]",
        secondary: "bg-slate-700 hover:bg-slate-600 border border-slate-600 shadow-[0_0_10px_rgba(255,255,255,0.1)] text-slate-200",
        danger: "bg-rose-500 hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)]"
    };

    return (
        <motion.button 
            className={`${baseStyle} ${colors[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
}
