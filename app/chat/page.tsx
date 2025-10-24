import ChatInterface from '@/components/ChatInterface';
import Link from 'next/link';

export default function ChatPage() {
  return (
    <main className="chat-page">
      <div className="chat-container">
        <Link href="/results" className="back-link">
          ← Back to Results
        </Link>
        <ChatInterface />
      </div>
    </main>
  );
}