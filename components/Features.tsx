import '../app/styles/features.css';

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L20 12H30L22 18L26 28L16 22L6 28L10 18L2 12H12L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'AI-Powered Matching',
    description: 'Get matched with mortgage programs based on your unique financial profile in seconds.'
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 12H28M12 4V12M20 4V12" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    title: 'Personalized Roadmap',
    description: 'Receive a custom timeline with actionable steps toward homeownership.'
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 8V16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: '24/7 AI Assistant',
    description: 'Chat with our AI to understand credit, loans, and the home buying process.'
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L4 10L16 16L28 10L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M4 22L16 28L28 22M4 16L16 22L28 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'HUD-Approved Counselors',
    description: 'Connect with free, certified housing counselors in your area.'
  }
];

export default function Features() {
  return (
    <section className="features-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="features-header">
          <h2 className="features-title">How KeySmart AI Helps You</h2>
          <p className="features-subtitle">
            Everything you need to navigate the mortgage process with confidence
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}