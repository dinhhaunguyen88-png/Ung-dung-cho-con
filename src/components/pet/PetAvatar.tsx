import { type ReactNode, useId } from 'react';
import { motion } from 'motion/react';
import type { PetType } from '../../types/pet';
import { getPetEvolutionScale } from '../../types/pet';

interface PetAvatarProps {
    type: PetType;
    color: string;
    level: number;
    size?: number;
    accessories?: string[];
    className?: string;
    disableAnimation?: boolean;
}

interface PetSvgProps {
    color: string;
    size: number;
}

interface PetPalette {
    base: string;
    light: string;
    lighter: string;
    dark: string;
    deep: string;
    outline: string;
    belly: string;
    blush: string;
    innerEar: string;
    sparkle: string;
}

function clampByte(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)));
}

function normalizeHex(color: string): string {
    const raw = color.trim().replace('#', '');
    if (/^[0-9a-f]{3}$/i.test(raw)) {
        return `#${raw.split('').map((part) => `${part}${part}`).join('').toLowerCase()}`;
    }

    if (/^[0-9a-f]{6}$/i.test(raw)) {
        return `#${raw.toLowerCase()}`;
    }

    return '#30e86e';
}

function hexToRgb(color: string): { r: number; g: number; b: number } {
    const normalized = normalizeHex(color).slice(1);
    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16),
    };
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map((channel) => clampByte(channel).toString(16).padStart(2, '0')).join('')}`;
}

function mixHex(color: string, target: string, weight: number): string {
    const sourceRgb = hexToRgb(color);
    const targetRgb = hexToRgb(target);
    const mix = Math.max(0, Math.min(1, weight));

    return rgbToHex(
        sourceRgb.r + (targetRgb.r - sourceRgb.r) * mix,
        sourceRgb.g + (targetRgb.g - sourceRgb.g) * mix,
        sourceRgb.b + (targetRgb.b - sourceRgb.b) * mix,
    );
}

function toRgba(color: string, alpha: number): string {
    const rgb = hexToRgb(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function getPetPalette(color: string): PetPalette {
    const base = normalizeHex(color);
    return {
        base,
        light: mixHex(base, '#ffffff', 0.18),
        lighter: mixHex(base, '#ffffff', 0.4),
        dark: mixHex(base, '#0f172a', 0.22),
        deep: mixHex(base, '#020617', 0.48),
        outline: mixHex(base, '#0f172a', 0.7),
        belly: mixHex(base, '#fff7ed', 0.78),
        blush: mixHex(base, '#fb7185', 0.55),
        innerEar: mixHex(base, '#fecdd3', 0.7),
        sparkle: mixHex(base, '#fde68a', 0.72),
    };
}

function AvatarSvg({ size, children }: { size: number; children: ReactNode }) {
    return (
        <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
            {children}
        </svg>
    );
}

function PetEye({ x, y, outline }: { x: number; y: number; outline: string }) {
    return (
        <g>
            <ellipse cx={x} cy={y} rx="12.5" ry="14" fill="white" />
            <ellipse cx={x + 1.5} cy={y + 2} rx="6.5" ry="8.5" fill={outline} />
            <circle cx={x + 4} cy={y - 4.5} r="2.8" fill="white" />
            <circle cx={x - 1} cy={y - 1} r="1.4" fill={toRgba('#ffffff', 0.7)} />
        </g>
    );
}

function PetSparkles({ color }: { color: string }) {
    return (
        <g opacity="0.9">
            <path d="M40 55 L40 66 M34 60.5 L46 60.5" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M156 48 L156 58 M151 53 L161 53" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="150" cy="76" r="3" fill={toRgba(color, 0.7)} />
            <circle cx="54" cy="44" r="2.8" fill={toRgba(color, 0.55)} />
        </g>
    );
}

function DragonSvg({ color, size }: PetSvgProps) {
    const palette = getPetPalette(color);
    const id = useId();
    const bodyGradientId = `${id}-dragon-body`;
    const bellyGradientId = `${id}-dragon-belly`;
    const wingGradientId = `${id}-dragon-wing`;
    const hornGradientId = `${id}-dragon-horn`;
    const spikeGradientId = `${id}-dragon-spike`;

    return (
        <AvatarSvg size={size}>
            <defs>
                <linearGradient id={bodyGradientId} x1="62" y1="36" x2="138" y2="170">
                    <stop offset="0%" stopColor={palette.lighter} />
                    <stop offset="58%" stopColor={palette.base} />
                    <stop offset="100%" stopColor={palette.dark} />
                </linearGradient>
                <linearGradient id={bellyGradientId} x1="80" y1="88" x2="120" y2="158">
                    <stop offset="0%" stopColor="#fffef9" />
                    <stop offset="100%" stopColor={palette.belly} />
                </linearGradient>
                <linearGradient id={wingGradientId} x1="42" y1="62" x2="82" y2="122">
                    <stop offset="0%" stopColor={toRgba(palette.lighter, 0.9)} />
                    <stop offset="100%" stopColor={toRgba(palette.dark, 0.72)} />
                </linearGradient>
                <linearGradient id={hornGradientId} x1="70" y1="22" x2="92" y2="46">
                    <stop offset="0%" stopColor="#fff8dc" />
                    <stop offset="100%" stopColor="#f6ad55" />
                </linearGradient>
                <linearGradient id={spikeGradientId} x1="94" y1="48" x2="112" y2="88">
                    <stop offset="0%" stopColor={palette.sparkle} />
                    <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
            </defs>

            <ellipse cx="100" cy="181" rx="51" ry="12" fill={toRgba(palette.deep, 0.14)} />
            <path d="M138 136 C159 143 168 158 162 173" fill="none" stroke={palette.dark} strokeWidth="13" strokeLinecap="round" />
            <path d="M161 172 C169 167 175 161 177 154 C170 154 164 158 159 163" fill={palette.sparkle} stroke={palette.outline} strokeWidth="3" strokeLinejoin="round" />

            <path d="M66 118 C44 100 43 75 64 77 C78 82 84 95 82 109 C76 118 71 121 66 118 Z" fill={`url(#${wingGradientId})`} stroke={palette.outline} strokeWidth="4" strokeLinejoin="round" />
            <path d="M134 118 C156 100 157 75 136 77 C122 82 116 95 118 109 C124 118 129 121 134 118 Z" fill={`url(#${wingGradientId})`} stroke={palette.outline} strokeWidth="4" strokeLinejoin="round" />

            <ellipse cx="100" cy="132" rx="42" ry="35" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" />
            <ellipse cx="100" cy="142" rx="24" ry="21" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.28)} strokeWidth="3" />
            <path d="M69 86 C69 58 131 58 131 86 C131 111 118 124 100 124 C82 124 69 111 69 86 Z" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" />
            <path d="M86 50 L79 30 L93 42 Z" fill={`url(#${hornGradientId})`} stroke={palette.outline} strokeWidth="3" strokeLinejoin="round" />
            <path d="M114 50 L121 30 L107 42 Z" fill={`url(#${hornGradientId})`} stroke={palette.outline} strokeWidth="3" strokeLinejoin="round" />
            <path d="M96 48 L100 36 L104 48" fill={`url(#${spikeGradientId})`} stroke={palette.outline} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M87 58 L92 48 L97 60" fill={`url(#${spikeGradientId})`} stroke={palette.outline} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M103 60 L108 48 L113 58" fill={`url(#${spikeGradientId})`} stroke={palette.outline} strokeWidth="2.8" strokeLinejoin="round" />

            <path d="M83 68 C91 60 109 60 117 68" fill="none" stroke={toRgba('#ffffff', 0.34)} strokeWidth="6" strokeLinecap="round" />
            <PetEye x={84} y={82} outline={palette.deep} />
            <PetEye x={116} y={82} outline={palette.deep} />
            <circle cx="73" cy="93" r="7" fill={toRgba(palette.blush, 0.32)} />
            <circle cx="127" cy="93" r="7" fill={toRgba(palette.blush, 0.32)} />
            <ellipse cx="100" cy="96" rx="17" ry="13" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.22)} strokeWidth="2.8" />
            <circle cx="95" cy="97" r="1.9" fill={palette.deep} opacity="0.45" />
            <circle cx="105" cy="97" r="1.9" fill={palette.deep} opacity="0.45" />
            <path d="M92 103 C95 108 105 108 108 103" fill="none" stroke={palette.deep} strokeWidth="3.2" strokeLinecap="round" />

            <path d="M83 122 C77 133 77 144 83 153" fill="none" stroke={palette.outline} strokeWidth="4" strokeLinecap="round" />
            <path d="M117 122 C123 133 123 144 117 153" fill="none" stroke={palette.outline} strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="80" cy="166" rx="14" ry="8.5" fill={palette.dark} />
            <ellipse cx="120" cy="166" rx="14" ry="8.5" fill={palette.dark} />
            <path d="M72 167 L68 172 M80 168 L77 174 M88 167 L85 172" stroke="#fffdf8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M112 167 L115 172 M120 168 L123 174 M128 167 L132 172" stroke="#fffdf8" strokeWidth="2.5" strokeLinecap="round" />

            <PetSparkles color={palette.sparkle} />
        </AvatarSvg>
    );
}

function CatSvg({ color, size }: PetSvgProps) {
    const palette = getPetPalette(color);
    const id = useId();
    const bodyGradientId = `${id}-cat-body`;
    const bellyGradientId = `${id}-cat-belly`;

    return (
        <AvatarSvg size={size}>
            <defs>
                <linearGradient id={bodyGradientId} x1="64" y1="38" x2="136" y2="170">
                    <stop offset="0%" stopColor={palette.lighter} />
                    <stop offset="60%" stopColor={palette.base} />
                    <stop offset="100%" stopColor={palette.dark} />
                </linearGradient>
                <linearGradient id={bellyGradientId} x1="84" y1="96" x2="120" y2="160">
                    <stop offset="0%" stopColor="#fffdf9" />
                    <stop offset="100%" stopColor={palette.belly} />
                </linearGradient>
            </defs>

            <ellipse cx="100" cy="180" rx="46" ry="11" fill={toRgba(palette.deep, 0.14)} />
            <path d="M145 140 C171 128 178 100 162 75" fill="none" stroke={palette.dark} strokeWidth="12" strokeLinecap="round" />

            <ellipse cx="100" cy="128" rx="43" ry="39" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" />
            <ellipse cx="100" cy="140" rx="25" ry="22" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.28)} strokeWidth="3" />
            <path d="M73 76 L60 39 L86 55 Z" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" strokeLinejoin="round" />
            <path d="M127 76 L140 39 L114 55 Z" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" strokeLinejoin="round" />
            <path d="M73 69 L66 48 L82 58 Z" fill={palette.innerEar} opacity="0.92" />
            <path d="M127 69 L134 48 L118 58 Z" fill={palette.innerEar} opacity="0.92" />
            <circle cx="100" cy="78" r="35" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" />

            <path d="M84 58 C93 52 107 52 116 58" fill="none" stroke={toRgba('#ffffff', 0.38)} strokeWidth="6" strokeLinecap="round" />
            <path d="M91 60 C95 56 105 56 109 60" fill="none" stroke={palette.deep} strokeWidth="3" strokeLinecap="round" opacity="0.28" />
            <PetEye x={84} y={73} outline={palette.deep} />
            <PetEye x={116} y={73} outline={palette.deep} />

            <path d="M84 88 C90 80 110 80 116 88 C114 100 108 107 100 107 C92 107 86 100 84 88 Z" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.28)} strokeWidth="3" />
            <circle cx="74" cy="86" r="7" fill={toRgba(palette.blush, 0.28)} />
            <circle cx="126" cy="86" r="7" fill={toRgba(palette.blush, 0.28)} />
            <path d="M100 84 L94 89 H106 Z" fill="#fb7185" stroke={palette.outline} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M95 92 C97 97 99 99 100 100 C101 99 103 97 105 92" fill="none" stroke={palette.deep} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M61 86 L84 87 M60 94 L83 91 M116 87 L139 86 M117 91 L140 94" fill="none" stroke={toRgba(palette.outline, 0.55)} strokeWidth="2.3" strokeLinecap="round" />

            <ellipse cx="79" cy="167" rx="14" ry="8.5" fill={palette.dark} />
            <ellipse cx="121" cy="167" rx="14" ry="8.5" fill={palette.dark} />
            <path d="M75 165 C77 170 81 170 83 165" fill="none" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M117 165 C119 170 123 170 125 165" fill="none" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" />

            <PetSparkles color={palette.sparkle} />
        </AvatarSvg>
    );
}

function DogSvg({ color, size }: PetSvgProps) {
    const palette = getPetPalette(color);
    const id = useId();
    const bodyGradientId = `${id}-dog-body`;
    const bellyGradientId = `${id}-dog-belly`;
    const earGradientId = `${id}-dog-ear`;

    return (
        <AvatarSvg size={size}>
            <defs>
                <linearGradient id={bodyGradientId} x1="62" y1="40" x2="138" y2="172">
                    <stop offset="0%" stopColor={palette.lighter} />
                    <stop offset="58%" stopColor={palette.base} />
                    <stop offset="100%" stopColor={palette.dark} />
                </linearGradient>
                <linearGradient id={bellyGradientId} x1="80" y1="96" x2="122" y2="158">
                    <stop offset="0%" stopColor="#fffdf8" />
                    <stop offset="100%" stopColor={palette.belly} />
                </linearGradient>
                <linearGradient id={earGradientId} x1="58" y1="42" x2="80" y2="92">
                    <stop offset="0%" stopColor={palette.dark} />
                    <stop offset="100%" stopColor={palette.deep} />
                </linearGradient>
            </defs>

            <ellipse cx="100" cy="180" rx="48" ry="12" fill={toRgba(palette.deep, 0.16)} />
            <path d="M145 132 C169 122 173 96 160 78" fill="none" stroke={palette.dark} strokeWidth="13" strokeLinecap="round" />

            <ellipse cx="100" cy="130" rx="46" ry="40" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" />
            <ellipse cx="100" cy="141" rx="28" ry="22" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.28)} strokeWidth="3" />
            <ellipse cx="65" cy="60" rx="19" ry="31" fill={`url(#${earGradientId})`} transform="rotate(-12 65 60)" stroke={palette.outline} strokeWidth="4" />
            <ellipse cx="135" cy="60" rx="19" ry="31" fill={`url(#${earGradientId})`} transform="rotate(12 135 60)" stroke={palette.outline} strokeWidth="4" />
            <circle cx="100" cy="77" r="35" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" />

            <path d="M79 72 C79 60 91 55 99 60 C106 53 121 58 121 72 C121 91 112 104 100 104 C88 104 79 91 79 72 Z" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.28)} strokeWidth="3" />
            <ellipse cx="82" cy="71" rx="12" ry="14" fill={toRgba(palette.dark, 0.42)} />
            <PetEye x={87} y={71} outline={palette.deep} />
            <PetEye x={114} y={71} outline={palette.deep} />
            <ellipse cx="100" cy="85" rx="10" ry="7" fill={palette.deep} />
            <circle cx="97" cy="82.5" r="2.3" fill={toRgba('#ffffff', 0.45)} />
            <path d="M92 93 C96 98 104 98 108 93" fill="none" stroke={palette.deep} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M97 94 C97 99 99 103 100 103 C101 103 103 99 103 94" fill="#fb7185" stroke={palette.outline} strokeWidth="2" strokeLinecap="round" />

            <path d="M81 109 C92 114 108 114 119 109" fill="none" stroke={toRgba('#ffffff', 0.4)} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M77 115 C88 121 112 121 123 115" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <circle cx="100" cy="118" r="5" fill="#fbbf24" stroke={palette.outline} strokeWidth="2.5" />

            <ellipse cx="77" cy="168" rx="15" ry="9" fill={palette.dark} />
            <ellipse cx="123" cy="168" rx="15" ry="9" fill={palette.dark} />
            <path d="M71 166 C74 171 80 171 83 166" fill="none" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M117 166 C120 171 126 171 129 166" fill="none" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" />

            <PetSparkles color={palette.sparkle} />
        </AvatarSvg>
    );
}

function BunnySvg({ color, size }: PetSvgProps) {
    const palette = getPetPalette(color);
    const id = useId();
    const bodyGradientId = `${id}-bunny-body`;
    const bellyGradientId = `${id}-bunny-belly`;
    const earGradientId = `${id}-bunny-ear`;

    return (
        <AvatarSvg size={size}>
            <defs>
                <linearGradient id={bodyGradientId} x1="62" y1="38" x2="138" y2="174">
                    <stop offset="0%" stopColor={palette.lighter} />
                    <stop offset="58%" stopColor={palette.base} />
                    <stop offset="100%" stopColor={palette.dark} />
                </linearGradient>
                <linearGradient id={bellyGradientId} x1="84" y1="98" x2="120" y2="160">
                    <stop offset="0%" stopColor="#fffdf9" />
                    <stop offset="100%" stopColor={palette.belly} />
                </linearGradient>
                <linearGradient id={earGradientId} x1="78" y1="6" x2="120" y2="74">
                    <stop offset="0%" stopColor={palette.light} />
                    <stop offset="100%" stopColor={palette.dark} />
                </linearGradient>
            </defs>

            <ellipse cx="100" cy="180" rx="44" ry="11" fill={toRgba(palette.deep, 0.14)} />
            <circle cx="146" cy="140" r="12" fill="#fff8f1" stroke={toRgba(palette.outline, 0.2)} strokeWidth="2.5" />

            <ellipse cx="82" cy="43" rx="14" ry="38" fill={`url(#${earGradientId})`} stroke={palette.outline} strokeWidth="4" />
            <ellipse cx="118" cy="43" rx="14" ry="38" fill={`url(#${earGradientId})`} stroke={palette.outline} strokeWidth="4" />
            <ellipse cx="82" cy="41" rx="7" ry="27" fill={palette.innerEar} />
            <ellipse cx="118" cy="41" rx="7" ry="27" fill={palette.innerEar} />

            <ellipse cx="100" cy="132" rx="40" ry="36" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" />
            <ellipse cx="100" cy="143" rx="24" ry="21" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.25)} strokeWidth="3" />
            <circle cx="100" cy="84" r="33" fill={`url(#${bodyGradientId})`} stroke={palette.outline} strokeWidth="4" />

            <path d="M86 63 C91 57 109 57 114 63" fill="none" stroke={toRgba('#ffffff', 0.42)} strokeWidth="6" strokeLinecap="round" />
            <PetEye x={86} y={79} outline={palette.deep} />
            <PetEye x={114} y={79} outline={palette.deep} />
            <circle cx="75" cy="89" r="7" fill={toRgba(palette.blush, 0.28)} />
            <circle cx="125" cy="89" r="7" fill={toRgba(palette.blush, 0.28)} />
            <path d="M85 92 C90 84 110 84 115 92 C112 103 106 108 100 108 C94 108 88 103 85 92 Z" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.25)} strokeWidth="3" />
            <ellipse cx="100" cy="90" rx="5.5" ry="4.5" fill="#fb7185" stroke={palette.outline} strokeWidth="2.2" />
            <path d="M95 95 C97 99 99 101 100 102 C101 101 103 99 105 95" fill="none" stroke={palette.deep} strokeWidth="3" strokeLinecap="round" />

            <ellipse cx="87" cy="126" rx="9" ry="12" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.25)} strokeWidth="3" />
            <ellipse cx="113" cy="126" rx="9" ry="12" fill={`url(#${bellyGradientId})`} stroke={toRgba(palette.outline, 0.25)} strokeWidth="3" />
            <ellipse cx="79" cy="168" rx="16" ry="8.5" fill={palette.dark} />
            <ellipse cx="121" cy="168" rx="16" ry="8.5" fill={palette.dark} />
            <path d="M73 166 C76 171 82 171 85 166" fill="none" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M115 166 C118 171 124 171 127 166" fill="none" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" />

            <PetSparkles color={palette.sparkle} />
        </AvatarSvg>
    );
}

const PET_SVG_MAP: Record<PetType, typeof DragonSvg> = {
    dragon: DragonSvg,
    cat: CatSvg,
    dog: DogSvg,
    bunny: BunnySvg,
};

export function PetAvatar({ type, color, level, size = 200, accessories = [], className = '', disableAnimation = false }: PetAvatarProps) {
    const SvgComponent = PET_SVG_MAP[type];
    const scale = getPetEvolutionScale(level);
    const auraColor = mixHex(color, '#ffffff', 0.28);
    const glowBlur = Math.max(8, Math.round(size * 0.05));
    const showOrbitRing = size > 120;
    const showDashedRing = size > 150;
    const showOrbitDot = size > 190;

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <div
                className="absolute inset-[16%] rounded-full"
                style={{
                    background: `radial-gradient(circle at 32% 28%, ${toRgba(auraColor, 0.3)} 0%, ${toRgba(color, 0.12)} 40%, transparent 72%)`,
                    filter: `blur(${glowBlur}px)`,
                }}
            />
            {showOrbitRing && (
                <motion.div
                    animate={disableAnimation ? {} : { rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[4%] rounded-full border"
                    style={{
                        borderColor: toRgba(color, 0.22),
                        boxShadow: `0 0 ${Math.round(size * 0.14)}px ${toRgba(color, 0.1)}`,
                    }}
                />
            )}
            {showDashedRing && (
                <motion.div
                    animate={disableAnimation ? {} : { rotate: -360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[10%] rounded-full border border-dashed"
                    style={{ borderColor: toRgba(auraColor, 0.24) }}
                />
            )}

            {showOrbitDot && (
                <motion.div
                    animate={disableAnimation ? {} : { rotate: -360 }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[7%]"
                >
                    <span
                        className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                        style={{
                            backgroundColor: auraColor,
                            boxShadow: `0 0 10px ${toRgba(auraColor, 0.45)}`,
                        }}
                    />
                </motion.div>
            )}

            <motion.div
                animate={disableAnimation ? {} : { y: [-6, 4, -6] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 transition-transform duration-500"
                style={{
                    transform: `scale(${scale})`,
                    filter: `drop-shadow(0 ${Math.max(8, Math.round(size * 0.06))}px ${Math.max(12, Math.round(size * 0.1))}px ${toRgba(color, 0.28)})`,
                }}
            >
                <SvgComponent color={color} size={size} />

                {accessories.length > 0 && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center">
                        {accessories.includes('party-hat') && (
                            <span className="absolute -top-2 text-3xl" style={{ fontSize: size * 0.2, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}>🎉</span>
                        )}
                        {accessories.includes('crown') && (
                            <span className="absolute -top-2 text-3xl" style={{ fontSize: size * 0.2, filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.8))' }}>👑</span>
                        )}
                        {accessories.includes('sunglasses') && (
                            <span className="absolute" style={{ top: size * 0.28, fontSize: size * 0.15 }}>🕶️</span>
                        )}
                        {accessories.includes('star-glasses') && (
                            <span className="absolute" style={{ top: size * 0.28, fontSize: size * 0.15 }}>⭐</span>
                        )}
                        {accessories.includes('bow-tie') && (
                            <span className="absolute" style={{ top: size * 0.52, fontSize: size * 0.15 }}>🎀</span>
                        )}
                        {accessories.includes('medal') && (
                            <span className="absolute" style={{ top: size * 0.52, fontSize: size * 0.15 }}>🏅</span>
                        )}
                        {accessories.includes('angel-wings') && (
                            <span className="absolute" style={{ top: size * 0.35, left: -size * 0.05, fontSize: size * 0.15, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }}>👼</span>
                        )}
                        {accessories.includes('dragon-wings') && (
                            <span className="absolute" style={{ top: size * 0.35, right: -size * 0.05, fontSize: size * 0.15, transform: 'scaleX(-1)', filter: 'drop-shadow(0 0 10px rgba(255,0,0,0.5))' }}>🐉</span>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
