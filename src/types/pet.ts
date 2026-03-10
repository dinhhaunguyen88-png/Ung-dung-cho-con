export type PetType = 'dragon' | 'cat' | 'dog' | 'bunny';

export interface PetAccessory {
    id: string;
    name: string;
    nameVi: string;
    emoji: string;
    requiredXp: number;
    category: 'hat' | 'glasses' | 'necklace' | 'wings';
}

export interface PetConfig {
    type: PetType;
    name: string;
    color: string;
    equippedAccessories: string[]; // accessory IDs
    xp: number;
    level: number;
}

export const PET_COLORS = [
    { id: 'green', value: '#30e86e', label: 'Xanh lá' },
    { id: 'blue', value: '#3b82f6', label: 'Xanh dương' },
    { id: 'red', value: '#ef4444', label: 'Đỏ' },
    { id: 'purple', value: '#8b5cf6', label: 'Tím' },
    { id: 'orange', value: '#f97316', label: 'Cam' },
    { id: 'pink', value: '#ec4899', label: 'Hồng' },
    { id: 'yellow', value: '#eab308', label: 'Vàng' },
    { id: 'cyan', value: '#06b6d4', label: 'Xanh ngọc' },
];

export const PET_ACCESSORIES: PetAccessory[] = [
    { id: 'party-hat', name: 'Party Hat', nameVi: 'Nón tiệc', emoji: '🎉', requiredXp: 0, category: 'hat' },
    { id: 'crown', name: 'Crown', nameVi: 'Vương miện', emoji: '👑', requiredXp: 200, category: 'hat' },
    { id: 'sunglasses', name: 'Sunglasses', nameVi: 'Kính mát', emoji: '🕶️', requiredXp: 100, category: 'glasses' },
    { id: 'star-glasses', name: 'Star Glasses', nameVi: 'Kính ngôi sao', emoji: '⭐', requiredXp: 500, category: 'glasses' },
    { id: 'bow-tie', name: 'Bow Tie', nameVi: 'Nơ cổ', emoji: '🎀', requiredXp: 150, category: 'necklace' },
    { id: 'medal', name: 'Medal', nameVi: 'Huy chương', emoji: '🏅', requiredXp: 300, category: 'necklace' },
    { id: 'angel-wings', name: 'Angel Wings', nameVi: 'Cánh thiên thần', emoji: '👼', requiredXp: 800, category: 'wings' },
    { id: 'dragon-wings', name: 'Dragon Wings', nameVi: 'Cánh rồng lửa', emoji: '🐉', requiredXp: 1000, category: 'wings' },
];

export const PET_INFO: Record<PetType, { name: string; nameVi: string; emoji: string }> = {
    dragon: { name: 'Dragon', nameVi: 'Rồng', emoji: '🐲' },
    cat: { name: 'Cat', nameVi: 'Mèo', emoji: '🐱' },
    dog: { name: 'Dog', nameVi: 'Chó', emoji: '🐶' },
    bunny: { name: 'Bunny', nameVi: 'Thỏ', emoji: '🐰' },
};

export function getPetEvolutionStage(level: number): 'baby' | 'teen' | 'adult' {
    if (level < 5) return 'baby';
    if (level < 15) return 'teen';
    return 'adult';
}

export function getPetEvolutionScale(level: number): number {
    const stage = getPetEvolutionStage(level);
    if (stage === 'baby') return 0.7;
    if (stage === 'teen') return 0.85;
    return 1.0;
}
