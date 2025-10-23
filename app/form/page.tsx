import ProfileForm from '@/components/ProfileForm';
import Link from 'next/link';

export default function FormPage() {
  return (
    <main className="form-page">
      <div className="container mx-auto">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
        <ProfileForm />
      </div>
    </main>
  );
}