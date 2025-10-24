import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ParticleBackground from '@/components/ParticleBackground';

export default function Home() {
  return (
    <main className="animated-gradient-bg relative overflow-hidden min-h-screen">
      {/* Subtle Background Effects */}
      <ParticleBackground />
      <div className="gradient-orb orb-red"></div>
      <div className="gradient-orb orb-gold"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <Features />
      </div>
    </main>
  );
}