import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Booking } from '@/components/Booking';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <Booking />
      <Contact />
      <Footer />
    </main>
  );
}