import Link from 'next/link';
import '../app/styles/hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-content">
        
        {/* Logo Mark */}
        <div className="logo-mark">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="10" width="60" height="60" rx="12" stroke="url(#gradient1)" strokeWidth="3"/>
            <path d="M25 40 L35 50 L55 30" stroke="url(#gradient1)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Title */}
        <h1 className="hero-title gradient-text text-glow">
          KeySmart AI
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Your AI-powered path to homeownership
        </p>

        {/* Description */}
        <p className="hero-description">
          Get matched with mortgage programs, build your credit strategy, 
          and receive personalized guidance—all in 3 minutes.
        </p>

        {/* CTA Button */}
        <Link href="/form" className="hero-cta">
          <span>Start Your Journey</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 3L15 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-text">
              <div className="stat-number">4</div>
              <div className="stat-label">Loan Programs</div>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-text">
              <div className="stat-number">3</div>
              <div className="stat-label">Minutes to Complete</div>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-text">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered Guidance</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}