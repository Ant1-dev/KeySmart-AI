import Link from 'next/link';
import './styles/landing.css';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20">
            {/* Logo/Name */}
            <h1 className="logo-text">
              <span className="logo-key">Key</span>
              <span className="logo-smart">Smart</span>
              <span className="logo-ai"> AI</span>
            </h1>

            {/* Tagline */}
            <p className="tagline">
              Unlock Your Path to Homeownership
            </p>
            
            <p className="subtitle">
              AI-powered mortgage guidance for first-time and minority homebuyers
            </p>

            {/* CTA Button */}
            <Link href="/form" className="cta-button">
              Get Started →
            </Link>
          </div>

          {/* Value Props */}
          <div className="value-props">
            {/* Card 1 */}
            <div className="value-card red">
              <div className="value-icon">🎯</div>
              <h3 className="value-title red">
                Personalized Matches
              </h3>
              <p className="value-description">
                Get loan recommendations based on your actual financial profile
              </p>
            </div>

            {/* Card 2 */}
            <div className="value-card gold">
              <div className="value-icon">💬</div>
              <h3 className="value-title gold">
                Plain Language
              </h3>
              <p className="value-description">
                AI explains everything in simple terms, no confusing jargon
              </p>
            </div>

            {/* Card 3 */}
            <div className="value-card green">
              <div className="value-icon">🤝</div>
              <h3 className="value-title green">
                Free Support
              </h3>
              <p className="value-description">
                Connect with HUD-approved housing counselors in your area
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        
        <div className="steps-container">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-number red">1</div>
            <div className="step-content">
              <h3>Share Your Profile</h3>
              <p>
                Enter your income, credit score, savings, and location (2 minutes)
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-number gold">2</div>
            <div className="step-content">
              <h3>Get Matched</h3>
              <p>
                Our AI instantly analyzes your profile and finds loans you qualify for
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-number green">3</div>
            <div className="step-content">
              <h3>Take Action</h3>
              <p>
                Chat with AI, find counselors, and start your homeownership journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="trust-signals">
        <div className="trust-card">
          <div className="trust-items">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span className="trust-text">100% Free</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🏛️</span>
              <span className="trust-text">HUD-Powered Data</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span className="trust-text">Privacy-First</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span className="trust-text">Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <p className="final-cta-text">
          Ready to become a homeowner?
        </p>
        <Link href="/form" className="cta-button cta-button-green">
          Start Your Journey
        </Link>
      </section>
    </main>
  );
}