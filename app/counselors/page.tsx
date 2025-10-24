import CounselorsList from '@/components/CounselorsList';
import Link from 'next/link';

export default function CounselorsPage() {
  return (
    <main className="counselors-page relative overflow-hidden">
      {/* Background Orbs */}
      <div className="gradient-orb orb-red"></div>
      <div className="gradient-orb orb-gold"></div>

      {/* Content */}
      <div className="counselors-container relative z-10">
        <Link href="/results" className="back-link">
          ← Back to Results
        </Link>
        <CounselorsList />
      </div>
    </main>
  );
}
