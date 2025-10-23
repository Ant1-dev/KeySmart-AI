import ResultsDashboard from '@/components/ResultsDashboard';
import Link from 'next/link';

export default function ResultsPage() {
  return (
    <main className="results-page">
      <div className="results-container">
        <Link href="/form" className="back-link">
          ← Back to Form
        </Link>
        <div className="page-header">
          <h1 className="page-title">Your Homeownership Roadmap</h1>
        </div>
        <ResultsDashboard />
      </div>
    </main>
  );
}