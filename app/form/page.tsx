import ProfileForm from '@/components/ProfileForm';
import Link from 'next/link';

export default function FormPage() {
  return (
    <main className="form-page animated-gradient-bg relative overflow-hidden">
      {/* Subtle Background Orbs */}
      <div className="gradient-orb orb-red" style={{ opacity: 0.1 }}></div>
      <div className="gradient-orb orb-gold" style={{ opacity: 0.1 }}></div>
      
      <div className="container mx-auto relative z-10">
        <Link href="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'inline-block', marginRight: '0.5rem' }}>
            <path d="M15 10H5M5 10L9 6M5 10L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
        <ProfileForm />
      </div>
    </main>
  );
}