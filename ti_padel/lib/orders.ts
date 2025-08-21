// Client-side Orders persistence using localStorage
// This is a minimal utility to store and retrieve orders generated from various UI components.

export type OrderKind = 'court' | 'menu' | 'racket' | 'booking';

export interface OrderBase {
  id: string; // uuid-like string
  kind: OrderKind;
  createdAt: string; // ISO string
}

export type CourtOrder = OrderBase & {
  kind: 'court';
  courtId: number;
  courtName: string;
  date?: string; // optional ISO date if known
  time?: string; // optional time string
  price?: number;
};

export type MenuOrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type MenuOrder = OrderBase & {
  kind: 'menu';
  items: MenuOrderItem[];
  total: number;
};

export type RacketOrder = OrderBase & {
  kind: 'racket';
  racketId: number;
  label: string;
  price: number;
};

export type BookingOrder = OrderBase & {
  kind: 'booking';
  serviceId: string;
  serviceName: string;
  date: string; // ISO date
  time: string; // HH:mm
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  price?: number;
};

export type Order = CourtOrder | MenuOrder | RacketOrder | BookingOrder;

const STORAGE_KEY = 'ti-padel-orders';

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getOrders(): Order[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Order[];
  } catch (e) {
    console.warn('Failed to read orders from localStorage', e);
    return [];
  }
}

export function addOrder(order: Omit<Order, 'id' | 'createdAt'>): Order[] {
  if (!isBrowser()) return [];
  const newOrder: Order = {
    ...(order as any),
    id: crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
  const current = getOrders();
  const updated = [newOrder, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save order to localStorage', e);
  }
  return updated;
}

export function clearOrders(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear orders from localStorage', e);
  }
}

export function removeOrder(id: string): Order[] {
  if (!isBrowser()) return [];
  const current = getOrders();
  const updated = current.filter(o => o.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to remove order from localStorage', e);
  }
  return updated;
}
