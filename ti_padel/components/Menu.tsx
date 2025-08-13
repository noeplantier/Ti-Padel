'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: 'drink' | 'snack';
}

interface CartItem extends MenuItem {
    quantity: number;
}

export function MenuPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<'all' | 'drink' | 'snack'>('all');

    const menuItems: MenuItem[] = [
        { id: 1, name: 'Eau minérale', description: 'Eau plate ou gazeuse', price: 2.5, category: 'drink' },
        { id: 2, name: 'Jus de fruits', description: 'Jus d\'orange, de pomme ou d\'ananas', price: 3.5, category: 'drink' },
        { id: 3, name: 'Soda', description: 'Coca, Sprite, Fanta', price: 3.0, category: 'drink' },
        { id: 4, name: 'Bières', description: 'Bières locales artisanales', price: 4.5, category: 'drink' },
        { id: 5, name: 'Chips', description: 'Chips nature, paprika ou fromage', price: 2.5, category: 'snack' },
        { id: 6, name: 'Barres de céréales', description: 'Barres énergétiques aux fruits', price: 2.0, category: 'snack' },
        { id: 7, name: 'Fruits secs', description: 'Mélanges de noix et amandes', price: 3.5, category: 'snack' },
        { id: 8, name: 'Banana bread', description: 'Maison fait avec des bananes bio', price: 3.0, category: 'snack' },
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
        <section id="carte" className="py-24  bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Carte des Boissons & Snacks</h1>
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
                        <Card key={item.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{item.name}</CardTitle>
                                <CardDescription>{item.description}</CardDescription>
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
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre commande</h2>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-gray-600">{item.price.toFixed(2)}€ x {item.quantity}</p>
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
                                <Button className="bg-black text-white hover:bg-gray-800">Commander</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
