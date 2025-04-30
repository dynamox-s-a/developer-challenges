import { Header } from '../../components/header';
import { Hero } from '@/components/hero';
import { Intro } from '../../components/intro';
import { Solutions } from '../../components/solutions';
import { Footer } from '../../components/footer';

export function Home() {
  return (
    <div className="min-h-screen flex flex-col px-6">
      <Header />
      <main className="flex-1">
        <Hero />
        <Intro />
        <Solutions />
      </main>
      <Footer />
    </div>
  );
}
