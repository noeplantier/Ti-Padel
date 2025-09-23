'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    GiWaterBottle,
    GiFruitBowl,
    GiSodaCan,
    GiBeerBottle,
    GiPotato,

    GiSlicedBread, GiChiliPepper, GiAppleCore
} from 'react-icons/gi';
import {addOrder, MenuOrder} from '@/lib/orders';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: 'drink' | 'snack';
    icon: JSX.Element;
}

interface CartItem extends MenuItem {
    quantity: number;
}

export function MenuPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<'all' | 'drink' | 'snack'>('all');

    const menuItems: MenuItem[] = [
        { id: 1, name: 'Eau minérale', description: 'Eau plate ou gazeuse', price: 2.5, category: 'drink', icon: <GiWaterBottle className="text-blue-500" size={40} /> },
        { id: 2, name: 'Jus de fruits', description: 'Jus d\'orange, de pomme ou d\'ananas', price: 3.5, category: 'drink', icon: <GiFruitBowl className="text-orange-500" size={40} /> },
        { id: 3, name: 'Soda', description: 'Coca, Sprite, Fanta', price: 3.0, category: 'drink', icon: <GiSodaCan className="text-red-500" size={40} /> },
        { id: 4, name: 'Bières', description: 'Bières locales artisanales', price: 4.5, category: 'drink', icon: <GiBeerBottle className="text-amber-600" size={40} /> },
        { id: 5, name: 'Chips', description: 'Chips nature ou fromage', price: 2.5, category: 'snack', icon: <GiPotato className="text-yellow-500" size={40} /> },
        { id: 6, name: 'Spicy Food', description: 'Nourriture épicée', price: 2.0, category: 'snack', icon: <GiChiliPepper className="text-red-500" size={40} />},
        { id: 7, name: 'Fruits secs', description: 'Mélanges de noix et amandes', price: 3.5, category: 'snack', icon: <GiAppleCore className="text-green-700" size={40} />},
        { id: 8, name: 'Banana bread', description: 'Maison fait avec des bananes bio', price: 3.0, category: 'snack', icon: <GiSlicedBread className="text-yellow-700" size={40} /> },
    ];

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const addToCart = (item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === id);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(cartItem =>
                    cartItem.id === id
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                );
            } else {
                return prevCart.filter(cartItem => cartItem.id !== id);
            }
        });
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <section id="carte" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                <h2 className="text-6xl font-bold text-black mb-4">Boissons & Snacks</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Découvrez notre sélection de boissons et snacks pour accompagner votre partie de padel
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <Button
                        onClick={() => setActiveCategory('all')}
                        variant={activeCategory === 'all' ? 'default' : 'outline'}
                    >
                        Tous les produits
                    </Button>
                    <Button
                        onClick={() => setActiveCategory('drink')}
                        variant={activeCategory === 'drink' ? 'default' : 'outline'}
                    >
                        Boissons
                    </Button>
                    <Button
                        onClick={() => setActiveCategory('snack')}
                        variant={activeCategory === 'snack' ? 'default' : 'outline'}
                    >
                        Snacks
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                    {filteredItems.map((item) => (
                        <Card key={item.id} className="flex flex-col relative">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{item.name}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        {item.icon}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-2xl font-bold text-gray-900">{item.price.toFixed(2)}€</p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() => addToCart(item)}
                                    className="w-full bg-black text-white hover:bg-gray-800"
                                >
                                    Ajouter au panier
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                {cart.length > 0 && (
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre commande</h2>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-500">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-gray-600">{item.price.toFixed(2)}€ x {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            -
                                        </Button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addToCart(item)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-bold">Total: {getTotalPrice().toFixed(2)}€</p>
                            <div className="space-x-2">
                                <Button variant="outline" onClick={clearCart}>Vider le panier</Button>
                                <Button className="bg-black text-white hover:bg-gray-800" onClick={() => {
                                    if (cart.length === 0) return;
                                    const menuOrder: Omit<MenuOrder, 'id' | 'createdAt'> = {
                                        kind: 'menu',
                                        items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, quantity: c.quantity })),
                                        total: getTotalPrice(),
                                    };
                                    addOrder(menuOrder);
                                    clearCart();
                                    alert('Votre commande a été ajoutée. Merci !');
                                }}>Commander</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
