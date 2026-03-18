import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
    ShoppingBag, 
    ArrowLeft, 
    Star, 
    Search, 
    Filter,
    ShoppingBasket,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { getShopItems, buyItem, ShopItem } from '../../services/api';

interface PetShopProps {
    onBack: () => void;
    userId: string;
    onPurchaseSuccess?: (newBalance: number) => void;
}

export function PetShop({ onBack, userId, onPurchaseSuccess }: PetShopProps) {
    const { t } = useTranslation();
    const [items, setItems] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [purchaseModal, setPurchaseModal] = useState<ShopItem | null>(null);
    const [isBuying, setIsBuying] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getShopItems();
                setItems(data);
            } catch (err) {
                console.error('Failed to fetch shop items:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const filteredItems = items.filter(item => {
        const matchesFilter = filter === 'all' || item.category === filter;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleBuy = async (item: ShopItem) => {
        setIsBuying(true);
        setFeedback(null);
        try {
            const result = await buyItem(userId, item.id);
            if (result.success) {
                setFeedback({ type: 'success', message: t('shop.purchaseSuccess', { item: item.name }) });
                if (onPurchaseSuccess) onPurchaseSuccess(result.stars);
                setTimeout(() => setPurchaseModal(null), 1500);
            }
        } catch (err: any) {
            setFeedback({ type: 'error', message: err.message || t('shop.purchaseError') });
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
                            <ShoppingBag className="text-secondary" />
                            {t('shop.title', 'Pet Shop')}
                        </h1>
                        <p className="text-slate-500">{t('shop.subtitle', 'Upgrade your pet with magical items!')}</p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder={t('shop.searchPlaceholder', 'Search items...')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border-2 border-slate-100 bg-white py-3 pl-12 pr-4 text-slate-700 outline-none transition-all focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['all', 'food', 'accessory', 'toy'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                                filter === cat 
                                ? 'bg-secondary text-white shadow-lg shadow-secondary/30' 
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {t(`shop.category.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1))}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-64 animate-pulse rounded-3xl bg-slate-100" />
                    ))
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            whileHover={{ y: -8 }}
                            className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition-all hover:shadow-xl"
                        >
                            <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-50">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-600 backdrop-blur-sm">
                                    {t(`shop.category.${item.category}`, item.category)}
                                </div>
                            </div>

                            <h3 className="mb-1 font-bold text-slate-800">{item.name}</h3>
                            <p className="mb-4 text-xs text-slate-500 line-clamp-2">{item.description}</p>

                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="fill-yellow-500 text-yellow-600" />
                                    <span className="font-black text-slate-900">{item.price}</span>
                                </div>
                                <button
                                    onClick={() => setPurchaseModal(item)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-secondary hover:text-white active:scale-90"
                                >
                                    <ShoppingBasket size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <ShoppingBag size={64} className="mx-auto mb-4 text-slate-200" />
                        <h3 className="text-xl font-bold text-slate-400">{t('shop.noItems', 'No items found matching your search')}</h3>
                    </div>
                )}
            </div>

            {/* Purchase Modal */}
            <AnimatePresence>
                {purchaseModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isBuying && setPurchaseModal(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl"
                        >
                            {!feedback ? (
                                <>
                                    <div className="mb-6 aspect-square w-32 mx-auto overflow-hidden rounded-3xl bg-slate-50 shadow-inner">
                                        <img src={purchaseModal.image_url} alt={purchaseModal.name} className="h-full w-full object-cover" />
                                    </div>
                                    <h2 className="mb-2 text-center text-2xl font-black text-slate-800">{t('shop.confirmTitle', 'Buy Item?')}</h2>
                                    <p className="mb-8 text-center text-slate-500">
                                        {t('shop.confirmBody', { name: purchaseModal.name, price: purchaseModal.price })}
                                    </p>

                                    <div className="flex gap-4">
                                        <button
                                            disabled={isBuying}
                                            onClick={() => setPurchaseModal(null)}
                                            className="flex-1 rounded-2xl bg-slate-100 py-4 font-bold text-slate-600 transition-all hover:bg-slate-200"
                                        >
                                            {t('common.cancel', 'Cancel')}
                                        </button>
                                        <button
                                            disabled={isBuying}
                                            onClick={() => handleBuy(purchaseModal)}
                                            className="flex-1 rounded-2xl bg-secondary py-4 font-bold text-white shadow-lg shadow-secondary/30 transition-all hover:brightness-110 disabled:opacity-50"
                                        >
                                            {isBuying ? t('common.processing', 'Processing...') : t('shop.confirmAction', 'Confirm')}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    {feedback.type === 'success' ? (
                                        <CheckCircle2 size={64} className="mx-auto mb-4 text-emerald-500" />
                                    ) : (
                                        <XCircle size={64} className="mx-auto mb-4 text-rose-500" />
                                    )}
                                    <h2 className="mb-2 text-2xl font-black text-slate-800">
                                        {feedback.type === 'success' ? t('common.hooray', 'Hooray!') : t('common.oops', 'Oops!')}
                                    </h2>
                                    <p className="text-slate-500">{feedback.message}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
