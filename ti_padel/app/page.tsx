'use client';

import { useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Booking } from '@/components/Booking';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { CourtsPage } from '@/components/Courts';
import { MenuPage } from '@/components/Menu';
import { RacketRental } from '@/components/RacketRental';
import { CartSidebar, type CartSidebarRef } from '@/components/CartSidebar';

export default function Home() {
  const cartRef = useRef<CartSidebarRef>(null);

  const handleCartClick = () => {
    cartRef.current?.open();
  };

  return (
    <main className="min-h-screen bg-white">
      <Navigation onCartClick={handleCartClick} />
      <Hero />
      <Services />
      <About />
      <CourtsPage />
      <Booking />
      <RacketRental />
      {/* <MenuPage /> */}
      <Contact />
      <Footer />
      
      {/* Cart Sidebar */}
      <CartSidebar ref={cartRef} />
    </main>
  );
}