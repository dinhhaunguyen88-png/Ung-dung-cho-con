import type { ReactNode } from 'react';
import type { PetType } from '../../types/pet';
import { getPetEvolutionScale } from '../../types/pet';

interface PetAvatarProps {
    type: PetType;
    color: string;
    level: number;
    size?: number;
    accessories?: string[];
    className?: string;
}

// Simple, cute SVG pets drawn inline
function DragonSvg({ color, size }: { color: string; size: number }) {
    return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
            {/* Body */}
            <ellipse cx="100" cy="120" rx="50" ry="45" fill={color} />
            {/* Belly */}
            <ellipse cx="100" cy="130" rx="32" ry="28" fill="white" opacity="0.4" />
            {/* Head */}
            <circle cx="100" cy="70" r="38" fill={color} />
            {/* Eyes */}
            <circle cx="85" cy="62" r="10" fill="white" />
            <circle cx="115" cy="62" r="10" fill="white" />
            <circle cx="87" cy="64" r="6" fill="#1e293b" />
            <circle cx="117" cy="64" r="6" fill="#1e293b" />
            <circle cx="89" cy="62" r="2" fill="white" />
            <circle cx="119" cy="62" r="2" fill="white" />
            {/* Smile */}
            <path d="M 85 80 Q 100 95 115 80" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Horns */}
            <polygon points="75,45 68,15 85,40" fill={color} opacity="0.8" />
            <polygon points="125,45 132,15 115,40" fill={color} opacity="0.8" />
            {/* Wings */}
            <path d="M 50 100 Q 20 60 40 100" fill={color} opacity="0.5" />
            <path d="M 150 100 Q 180 60 160 100" fill={color} opacity="0.5" />
            {/* Tail */}
            <path d="M 140 150 Q 170 160 160 140 Q 180 130 170 120" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Feet */}
            <ellipse cx="80" cy="165" rx="14" ry="8" fill={color} opacity="0.9" />
            <ellipse cx="120" cy="165" rx="14" ry="8" fill={color} opacity="0.9" />
            {/* Nostrils */}
            <circle cx="92" cy="74" r="2" fill="#1e293b" opacity="0.4" />
            <circle cx="108" cy="74" r="2" fill="#1e293b" opacity="0.4" />
        </svg>
    );
}

function CatSvg({ color, size }: { color: string; size: number }) {
    return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
            {/* Body */}
            <ellipse cx="100" cy="130" rx="45" ry="40" fill={color} />
            {/* Belly */}
            <ellipse cx="100" cy="140" rx="28" ry="24" fill="white" opacity="0.4" />
            {/* Head */}
            <circle cx="100" cy="75" r="36" fill={color} />
            {/* Ears */}
            <polygon points="68,55 55,15 82,45" fill={color} />
            <polygon points="132,55 145,15 118,45" fill={color} />
            <polygon points="70,50 62,25 80,43" fill="white" opacity="0.3" />
            <polygon points="130,50 138,25 120,43" fill="white" opacity="0.3" />
            {/* Eyes */}
            <ellipse cx="85" cy="68" rx="9" ry="10" fill="white" />
            <ellipse cx="115" cy="68" rx="9" ry="10" fill="white" />
            <ellipse cx="86" cy="70" rx="5" ry="7" fill="#1e293b" />
            <ellipse cx="116" cy="70" rx="5" ry="7" fill="#1e293b" />
            <circle cx="88" cy="67" r="2" fill="white" />
            <circle cx="118" cy="67" r="2" fill="white" />
            {/* Nose */}
            <polygon points="100,80 95,85 105,85" fill="#ec4899" />
            {/* Whiskers */}
            <line x1="60" y1="82" x2="88" y2="83" stroke="#1e293b" strokeWidth="1.5" opacity="0.4" />
            <line x1="60" y1="88" x2="88" y2="86" stroke="#1e293b" strokeWidth="1.5" opacity="0.4" />
            <line x1="112" y1="83" x2="140" y2="82" stroke="#1e293b" strokeWidth="1.5" opacity="0.4" />
            <line x1="112" y1="86" x2="140" y2="88" stroke="#1e293b" strokeWidth="1.5" opacity="0.4" />
            {/* Mouth */}
            <path d="M 95 88 Q 100 93 105 88" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Feet */}
            <ellipse cx="78" cy="168" rx="12" ry="7" fill={color} opacity="0.9" />
            <ellipse cx="122" cy="168" rx="12" ry="7" fill={color} opacity="0.9" />
            {/* Tail */}
            <path d="M 140 140 Q 175 110 165 80" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
    );
}

function DogSvg({ color, size }: { color: string; size: number }) {
    return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
            {/* Body */}
            <ellipse cx="100" cy="130" rx="48" ry="42" fill={color} />
            {/* Belly */}
            <ellipse cx="100" cy="140" rx="30" ry="26" fill="white" opacity="0.4" />
            {/* Head */}
            <circle cx="100" cy="72" r="37" fill={color} />
            {/* Ears (floppy) */}
            <ellipse cx="62" cy="56" rx="18" ry="30" fill={color} opacity="0.8" transform="rotate(-15 62 56)" />
            <ellipse cx="138" cy="56" rx="18" ry="30" fill={color} opacity="0.8" transform="rotate(15 138 56)" />
            {/* Eyes */}
            <circle cx="85" cy="66" r="10" fill="white" />
            <circle cx="115" cy="66" r="10" fill="white" />
            <circle cx="87" cy="68" r="6" fill="#1e293b" />
            <circle cx="117" cy="68" r="6" fill="#1e293b" />
            <circle cx="89" cy="66" r="2" fill="white" />
            <circle cx="119" cy="66" r="2" fill="white" />
            {/* Nose */}
            <ellipse cx="100" cy="82" rx="8" ry="6" fill="#1e293b" />
            <circle cx="98" cy="80" r="2" fill="white" opacity="0.4" />
            {/* Mouth */}
            <path d="M 92 90 Q 100 98 108 90" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Tongue */}
            <ellipse cx="100" cy="96" rx="6" ry="8" fill="#ec4899" />
            {/* Feet */}
            <ellipse cx="76" cy="168" rx="14" ry="8" fill={color} opacity="0.9" />
            <ellipse cx="124" cy="168" rx="14" ry="8" fill={color} opacity="0.9" />
            {/* Tail */}
            <path d="M 145 125 Q 170 100 160 80" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" />
        </svg>
    );
}

function BunnySvg({ color, size }: { color: string; size: number }) {
    return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
            {/* Body */}
            <ellipse cx="100" cy="135" rx="42" ry="38" fill={color} />
            {/* Belly */}
            <ellipse cx="100" cy="143" rx="26" ry="22" fill="white" opacity="0.4" />
            {/* Head */}
            <circle cx="100" cy="80" r="34" fill={color} />
            {/* Ears (tall) */}
            <ellipse cx="80" cy="30" rx="12" ry="35" fill={color} />
            <ellipse cx="120" cy="30" rx="12" ry="35" fill={color} />
            <ellipse cx="80" cy="28" rx="7" ry="25" fill="white" opacity="0.3" />
            <ellipse cx="120" cy="28" rx="7" ry="25" fill="white" opacity="0.3" />
            {/* Eyes */}
            <circle cx="86" cy="74" r="9" fill="white" />
            <circle cx="114" cy="74" r="9" fill="white" />
            <circle cx="88" cy="76" r="5" fill="#1e293b" />
            <circle cx="116" cy="76" r="5" fill="#1e293b" />
            <circle cx="90" cy="74" r="2" fill="white" />
            <circle cx="118" cy="74" r="2" fill="white" />
            {/* Nose */}
            <ellipse cx="100" cy="86" rx="5" ry="4" fill="#ec4899" />
            {/* Mouth */}
            <path d="M 95 92 L 100 96 L 105 92" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="75" cy="85" r="6" fill="#ec4899" opacity="0.2" />
            <circle cx="125" cy="85" r="6" fill="#ec4899" opacity="0.2" />
            {/* Feet */}
            <ellipse cx="80" cy="170" rx="16" ry="8" fill={color} opacity="0.9" />
            <ellipse cx="120" cy="170" rx="16" ry="8" fill={color} opacity="0.9" />
            {/* Puff tail */}
            <circle cx="145" cy="140" r="12" fill="white" opacity="0.7" />
        </svg>
    );
}

const PET_SVG_MAP: Record<PetType, typeof DragonSvg> = {
    dragon: DragonSvg,
    cat: CatSvg,
    dog: DogSvg,
    bunny: BunnySvg,
};

export function PetAvatar({ type, color, level, size = 200, accessories = [], className = '' }: PetAvatarProps) {
    const SvgComponent = PET_SVG_MAP[type];
    const scale = getPetEvolutionScale(level);

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <div
                className="island-float transition-transform duration-500"
                style={{ transform: `scale(${scale})` }}
            >
                <SvgComponent color={color} size={size} />
            </div>

            {/* Accessory overlays */}
            {accessories.length > 0 && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center">
                    {accessories.includes('party-hat') && (
                        <span className="absolute -top-2 text-3xl" style={{ fontSize: size * 0.2 }}>🎉</span>
                    )}
                    {accessories.includes('crown') && (
                        <span className="absolute -top-2 text-3xl" style={{ fontSize: size * 0.2 }}>👑</span>
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
                        <span className="absolute" style={{ top: size * 0.35, left: 0, fontSize: size * 0.12 }}>👼</span>
                    )}
                    {accessories.includes('dragon-wings') && (
                        <span className="absolute" style={{ top: size * 0.35, right: 0, fontSize: size * 0.12 }}>🐉</span>
                    )}
                </div>
            )}
        </div>
    );
}
