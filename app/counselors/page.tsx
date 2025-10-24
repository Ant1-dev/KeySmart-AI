import CounselorsList from '@/components/CounselorsList';
import Link from 'next/link';

export default function CounselorsPage() {
  return (
    <main className="counselors-page">
      <div className="counselors-container">
        <Link href="/results" className="back-link">
          ← Back to Results
        </Link>
        <CounselorsList />
      </div>
    </main>
  );
}