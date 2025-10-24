import ChatInterface from '@/components/ChatInterface';
import Link from 'next/link';

export default function ChatPage() {
  return (
<main className="chat-page relative overflow-hidden">
  <div className="gradient-orb orb-red"></div>
  <div className="gradient-orb orb-gold"></div>

  <div className="chat-container relative z-10">
    <Link href="/results" className="back-link">
      ← Back to Results
    </Link>
    <ChatInterface />
  </div>
</main>

  );
}