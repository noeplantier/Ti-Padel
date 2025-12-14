export interface Order {
  id: string;
  kind: 'booking' | 'racket';
  createdAt: number;
}

export interface BookingOrder extends Order {
  kind: 'booking';
  date: string;
  time: string;
  name?: string;
  courtId?: string;
  duration?: number;
  price: number;
}

export interface RacketOrder extends Order {
  kind: 'racket';
  label: string;
  racketId?: string;
  quantity?: number;
  price: number;
}

type OrdersChangeListener = (orders: Order[]) => void;

const STORAGE_KEY = 'tipadel-orders';
let listeners: OrdersChangeListener[] = [];
let ordersCache: Order[] | null = null;

/**
 * Récupère les commandes depuis le localStorage avec mise en cache
 */
export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const orders = stored ? JSON.parse(stored) : [];
    ordersCache = orders;
    return orders;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return [];
  }
}

/**
 * Sauvegarde les commandes dans le localStorage et notifie les listeners
 */
function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    ordersCache = orders;
    notifyListeners(orders);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des commandes:', error);
    throw new Error('Impossible de sauvegarder la commande');
  }
}

/**
 * Notifie tous les listeners des changements
 */
function notifyListeners(orders: Order[]): void {
  listeners.forEach(listener => {
    try {
      listener(orders);
    } catch (error) {
      console.error('Erreur dans un listener:', error);
    }
  });
}

/**
 * S'abonner aux changements du panier
 */
export function subscribeToOrders(listener: OrdersChangeListener): () => void {
  listeners.push(listener);
  
  // Notifier immédiatement avec les données actuelles
  const currentOrders = ordersCache ?? getOrders();
  try {
    listener(currentOrders);
  } catch (error) {
    console.error('Erreur lors de la notification initiale:', error);
  }
  
  // Retourner la fonction de désabonnement
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

/**
 * Génère un ID unique pour une commande
 */
function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Ajoute une commande au panier
 */
export function addOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
  const newOrder: Order = {
    ...order,
    id: generateOrderId(),
    createdAt: Date.now(),
  } as Order;
  
  const orders = getOrders();
  const updatedOrders = [...orders, newOrder];
  saveOrders(updatedOrders);
  
  return newOrder;
}

/**
 * Ajoute une réservation de terrain au panier
 */
export function addBookingOrder(booking: Omit<BookingOrder, 'id' | 'kind' | 'createdAt'>): BookingOrder {
  const order = addOrder({
    kind: 'booking',
    ...booking,
  }) as BookingOrder;
  
  return order;
}

/**
 * Ajoute une location de raquette au panier
 */
export function addRacketOrder(racket: Omit<RacketOrder, 'id' | 'kind' | 'createdAt'>): RacketOrder {
  const order = addOrder({
    kind: 'racket',
    ...racket,
  }) as RacketOrder;
  
  return order;
}

/**
 * Supprime une commande du panier
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
 * Récupère une commande spécifique par son ID
 */
export function getOrderById(orderId: string): Order | undefined {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
}

/**
 * Calcule le total du panier
 */
export function calculateTotal(): number {
  const orders = getOrders();
  return orders.reduce((total, order) => {
    const price = (order as any).price || 0;
    return total + Number(price);
  }, 0);
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
  return getOrders().length === 0;
}

/**
 * Récupère les commandes par type
 */
export function getOrdersByKind(kind: 'booking' | 'racket'): Order[] {
  const orders = getOrders();
  return orders.filter(order => order.kind === kind);
}

/**
 * Met à jour une commande existante
 */
export function updateOrder(orderId: string, updates: Partial<Order>): boolean {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return false;
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    ...updates,
    id: orderId, // Préserver l'ID
    createdAt: orders[orderIndex].createdAt, // Préserver la date de création
  };
  
  saveOrders(orders);
  return true;
}

/**
 * Valide qu'une commande a tous les champs requis
 */
export function validateOrder(order: Order): boolean {
  if (!order.id || !order.kind || !order.createdAt) {
    return false;
  }
  
  if (order.kind === 'booking') {
    const booking = order as BookingOrder;
    return !!(booking.date && booking.time && booking.price !== undefined);
  }
  
  if (order.kind === 'racket') {
    const racket = order as RacketOrder;
    return !!(racket.label && racket.price !== undefined);
  }
  
  return false;
}

/**
 * Exporte les commandes au format JSON
 */
export function exportOrders(): string {
  const orders = getOrders();
  return JSON.stringify(orders, null, 2);
}

/**
 * Importe des commandes depuis un JSON
 */
export function importOrders(jsonData: string): boolean {
  try {
    const orders = JSON.parse(jsonData);
    
    if (!Array.isArray(orders)) {
      throw new Error('Format invalide');
    }
    
    // Valider toutes les commandes
    const validOrders = orders.filter(order => validateOrder(order));
    
    if (validOrders.length === 0) {
      throw new Error('Aucune commande valide trouvée');
    }
    
    saveOrders(validOrders);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return false;
  }
}

/**
 * Nettoie le cache (utile pour les tests)
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