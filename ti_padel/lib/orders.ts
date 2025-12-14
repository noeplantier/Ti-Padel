/**
 * Types de base pour les commandes
 */
export interface BaseOrder {
  id: string;
  kind: 'booking' | 'racket' | 'product' | 'membership';
  createdAt: number;
  price: number;
}

/**
 * Commande de réservation de terrain
 */
export interface BookingOrder extends BaseOrder {
  kind: 'booking';
  date: string;
  time: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  courtId?: number | string;
  courtName?: string;
  surface?: string;
  type?: string;
  duration?: number | string;
  serviceName?: string;
}

/**
 * Commande de location de raquette
 */
export interface RacketOrder extends BaseOrder {
  kind: 'racket';
  label: string;
  racketId?: string;
  quantity?: number;
}

/**
 * Commande de produit
 */
export interface ProductOrder extends BaseOrder {
  kind: 'product';
  productId: string;
  productName: string;
  quantity: number;
}

/**
 * Commande d'adhésion
 */
export interface MembershipOrder extends BaseOrder {
  kind: 'membership';
  membershipType: string;
  validUntil: string;
}

/**
 * Union de tous les types de commandes
 */
export type Order = BookingOrder | RacketOrder | ProductOrder | MembershipOrder;

/**
 * Type pour les listeners de changement
 */
type OrdersChangeListener = (orders: Order[]) => void;

/**
 * Configuration
 */
const STORAGE_KEY = 'tipadel-orders';
const CACHE_ENABLED = true;

/**
 * État interne
 */
let listeners: OrdersChangeListener[] = [];
let ordersCache: Order[] | null = null;
let lastStorageUpdate = 0;

/**
 * Génère un ID unique pour une commande
 */
function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Vérifie si nous sommes côté client
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Récupère les commandes depuis le localStorage avec mise en cache optimisée
 */
export function getOrders(): Order[] {
  if (!isClient()) return [];
  
  try {
    // Utiliser le cache si disponible et activé
    if (CACHE_ENABLED && ordersCache !== null) {
      return [...ordersCache]; // Retourner une copie pour éviter les mutations
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const orders: Order[] = stored ? JSON.parse(stored) : [];
    
    // Mise en cache
    if (CACHE_ENABLED) {
      ordersCache = orders;
    }
    
    return orders;
  } catch (error) {
    console.error('[Orders] Erreur lors de la récupération:', error);
    return [];
  }
}

/**
 * Sauvegarde les commandes dans le localStorage et notifie les listeners
 */
function saveOrders(orders: Order[]): void {
  if (!isClient()) return;
  
  try {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    
    // Mettre à jour le cache
    if (CACHE_ENABLED) {
      ordersCache = [...orders];
    }
    
    lastStorageUpdate = now;
    
    // Notifier tous les listeners de manière asynchrone pour éviter les blocages
    queueMicrotask(() => notifyListeners(orders));
  } catch (error) {
    console.error('[Orders] Erreur lors de la sauvegarde:', error);
    throw new Error('Impossible de sauvegarder la commande');
  }
}

/**
 * Notifie tous les listeners des changements de manière sécurisée
 */
function notifyListeners(orders: Order[]): void {
  const ordersCopy = [...orders]; // Copie pour éviter les mutations
  
  listeners.forEach(listener => {
    try {
      listener(ordersCopy);
    } catch (error) {
      console.error('[Orders] Erreur dans un listener:', error);
    }
  });
}

/**
 * S'abonner aux changements du panier avec notification immédiate
 */
export function subscribeToOrders(listener: OrdersChangeListener): () => void {
  if (!isClient()) {
    return () => {}; // Retourner une fonction vide côté serveur
  }

  // Ajouter le listener
  listeners.push(listener);
  
  // Notifier immédiatement avec les données actuelles
  try {
    const currentOrders = getOrders();
    listener(currentOrders);
  } catch (error) {
    console.error('[Orders] Erreur lors de la notification initiale:', error);
  }
  
  // Retourner la fonction de désabonnement
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

/**
 * Valide qu'une commande a tous les champs requis selon son type
 */
export function validateOrder(order: Order): boolean {
  // Validation commune
  if (!order.id || !order.kind || !order.createdAt || order.price === undefined) {
    return false;
  }
  
  // Validation spécifique selon le type
  switch (order.kind) {
    case 'booking':
      const booking = order as BookingOrder;
      return !!(booking.date && booking.time);
    
    case 'racket':
      const racket = order as RacketOrder;
      return !!racket.label;
    
    case 'product':
      const product = order as ProductOrder;
      return !!(product.productId && product.productName && product.quantity > 0);
    
    case 'membership':
      const membership = order as MembershipOrder;
      return !!(membership.membershipType && membership.validUntil);
    
    default:
      return false;
  }
}

/**
 * Ajoute une commande au panier de manière optimisée
 */
export function addOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: generateOrderId(),
    createdAt: Date.now(),
  } as Order;
  
  // Valider la commande
  if (!validateOrder(newOrder)) {
    throw new Error('Commande invalide');
  }
  
  const orders = getOrders();
  const updatedOrders = [...orders, newOrder];
  saveOrders(updatedOrders);
  
  return newOrder;
}

/**
 * Ajoute une réservation de terrain (helper typé)
 */
export function addBookingOrder(booking: Omit<BookingOrder, 'id' | 'kind' | 'createdAt'>): BookingOrder {
  return addOrder({
    kind: 'booking',
    ...booking,
  }) as BookingOrder;
}

/**
 * Ajoute une location de raquette (helper typé)
 */
export function addRacketOrder(racket: Omit<RacketOrder, 'id' | 'kind' | 'createdAt'>): RacketOrder {
  return addOrder({
    kind: 'racket',
    ...racket,
  }) as RacketOrder;
}

/**
 * Ajoute un produit (helper typé)
 */
export function addProductOrder(product: Omit<ProductOrder, 'id' | 'kind' | 'createdAt'>): ProductOrder {
  return addOrder({
    kind: 'product',
    ...product,
  }) as ProductOrder;
}

/**
 * Ajoute une adhésion (helper typé)
 */
export function addMembershipOrder(membership: Omit<MembershipOrder, 'id' | 'kind' | 'createdAt'>): MembershipOrder {
  return addOrder({
    kind: 'membership',
    ...membership,
  }) as MembershipOrder;
}

/**
 * Supprime une commande du panier de manière optimisée
 */
export function removeOrder(orderId: string): boolean {
  const orders = getOrders();
  const initialLength = orders.length;
  const filteredOrders = orders.filter(order => order.id !== orderId);
  
  if (filteredOrders.length === initialLength) {
    return false; // Commande non trouvée
  }
  
  saveOrders(filteredOrders);
  return true;
}

/**
 * Vide complètement le panier
 */
export function clearOrders(): void {
  saveOrders([]);
}

/**
 * Récupère une commande spécifique par son ID avec recherche optimisée
 */
export function getOrderById(orderId: string): Order | undefined {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
}

/**
 * Calcule le total du panier de manière optimisée
 */
export function calculateTotal(): number {
  const orders = getOrders();
  return orders.reduce((total, order) => total + Number(order.price || 0), 0);
}

/**
 * Calcule le total avec détails (sous-total, TVA, etc.)
 */
export function calculateDetailedTotal(taxRate: number = 0.2): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = calculateTotal();
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
}

/**
 * Récupère le nombre d'articles dans le panier
 */
export function getOrderCount(): number {
  return getOrders().length;
}

/**
 * Vérifie si le panier est vide
 */
export function isCartEmpty(): boolean {
  return getOrderCount() === 0;
}

/**
 * Récupère les commandes par type avec typage strict
 */
export function getOrdersByKind<T extends Order['kind']>(kind: T): Extract<Order, { kind: T }>[] {
  const orders = getOrders();
  return orders.filter(order => order.kind === kind) as Extract<Order, { kind: T }>[];
}

/**
 * Met à jour une commande existante de manière optimisée
 */
export function updateOrder(orderId: string, updates: Partial<Omit<Order, 'id' | 'createdAt'>>): boolean {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return false;
  }
  
  const updatedOrder = {
    ...orders[orderIndex],
    ...updates,
    id: orderId, // Préserver l'ID
    createdAt: orders[orderIndex].createdAt, // Préserver la date de création
  } as Order;
  
  // Valider la commande mise à jour
  if (!validateOrder(updatedOrder)) {
    throw new Error('Mise à jour invalide');
  }
  
  const updatedOrders = [...orders];
  updatedOrders[orderIndex] = updatedOrder;
  saveOrders(updatedOrders);
  
  return true;
}

/**
 * Duplique une commande existante
 */
export function duplicateOrder(orderId: string): Order | null {
  const order = getOrderById(orderId);
  
  if (!order) {
    return null;
  }
  
  const { id, createdAt, ...orderData } = order;
  return addOrder(orderData as Omit<Order, 'id' | 'createdAt'>);
}

/**
 * Exporte les commandes au format JSON
 */
export function exportOrders(): string {
  const orders = getOrders();
  return JSON.stringify(orders, null, 2);
}

/**
 * Importe des commandes depuis un JSON avec validation
 */
export function importOrders(jsonData: string, merge: boolean = false): boolean {
  try {
    const importedOrders = JSON.parse(jsonData);
    
    if (!Array.isArray(importedOrders)) {
      throw new Error('Format invalide: doit être un tableau');
    }
    
    // Valider toutes les commandes
    const validOrders = importedOrders.filter(order => {
      try {
        return validateOrder(order);
      } catch {
        return false;
      }
    });
    
    if (validOrders.length === 0) {
      throw new Error('Aucune commande valide trouvée');
    }
    
    if (merge) {
      const existingOrders = getOrders();
      const mergedOrders = [...existingOrders, ...validOrders];
      saveOrders(mergedOrders);
    } else {
      saveOrders(validOrders);
    }
    
    return true;
  } catch (error) {
    console.error('[Orders] Erreur lors de l\'importation:', error);
    return false;
  }
}

/**
 * Obtient des statistiques sur le panier
 */
export function getCartStats(): {
  totalOrders: number;
  totalAmount: number;
  ordersByKind: Record<Order['kind'], number>;
  averageOrderValue: number;
} {
  const orders = getOrders();
  const totalOrders = orders.length;
  const totalAmount = calculateTotal();
  
  const ordersByKind = orders.reduce((acc, order) => {
    acc[order.kind] = (acc[order.kind] || 0) + 1;
    return acc;
  }, {} as Record<Order['kind'], number>);
  
  const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
  
  return {
    totalOrders,
    totalAmount,
    ordersByKind,
    averageOrderValue,
  };
}

/**
 * Nettoie le cache (utile pour les tests et le debugging)
 */
export function clearCache(): void {
  ordersCache = null;
}

/**
 * Réinitialise tous les listeners (utile pour les tests)
 */
export function resetListeners(): void {
  listeners = [];
}

/**
 * Réinitialise complètement le système (cache + listeners + storage)
 */
export function resetAll(): void {
  clearCache();
  resetListeners();
  clearOrders();
}

/**
 * Obtient des informations de debug
 */
export function getDebugInfo(): {
  cacheEnabled: boolean;
  cacheSize: number | null;
  listenersCount: number;
  lastUpdate: number;
  storageKey: string;
} {
  return {
    cacheEnabled: CACHE_ENABLED,
    cacheSize: ordersCache?.length ?? null,
    listenersCount: listeners.length,
    lastUpdate: lastStorageUpdate,
    storageKey: STORAGE_KEY,
  };
}