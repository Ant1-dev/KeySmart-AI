'use client';

import { useState, useEffect } from 'react';
import { Counselor, UserProfile } from '@/lib/types';
import '../app/styles/counselors.css';

export default function CounselorsList() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
          const userProfile: UserProfile = JSON.parse(storedProfile);
          setProfile(userProfile);

          // Parse city and state from location
          const locationParts = userProfile.location.split(',');
          const city = locationParts[0]?.trim() || '';
          const state = locationParts[1]?.trim() || '';

          if (city && state) {
            const response = await fetch(
              `/api/counselors?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
            );
            const data = await response.json();
            setCounselors(data.counselors || []);
          }
        }
      } catch (error) {
        console.error('Error fetching counselors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large"></div>
        <p className="loading-text">Finding counselors near you...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="counselors-header">
        <h2 className="counselors-main-title">
          🎯 HUD-Approved Housing Counselors Near You
        </h2>
        <p className="counselors-description">
          These FREE services can help you navigate the home buying process with expert guidance
        </p>
        <div className="counselors-info-box">
          <p className="info-box-title">What can counselors help with?</p>
          <div className="info-grid">
            <div className="info-item">Review your finances</div>
            <div className="info-item">Improve your credit</div>
            <div className="info-item">Navigate mortgage applications</div>
            <div className="info-item">Avoid scams and predatory lending</div>
            <div className="info-item">Connect to down payment assistance</div>
            <div className="info-item">First-time buyer education</div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {counselors.length > 0 && (
        <p className="results-count">
          <span className="results-count-icon">📍</span>
          {counselors.length} counselor{counselors.length !== 1 ? 's' : ''} found in {profile?.location}
        </p>
      )}

      {/* Counselors List */}
      {counselors.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3 className="no-results-title">No counselors found in your area</h3>
          <p className="no-results-text">
            We couldn&apos;t find HUD-approved counselors in your immediate area, but you can search the national directory or try expanding your search radius.
          </p>
          
          <a
            href="https://www.hud.gov/findacounselor"
            target="_blank"
            rel="noopener noreferrer"
            className="no-results-link"
          >
            Visit HUD&apos;s National Search Tool →
          </a>
        </div>
      ) : (
        <div className="counselors-list">
          {counselors.map((counselor) => (
            <div key={counselor.id} className="counselor-card">
              <h3 className="counselor-name">{counselor.name}</h3>

              {/* Details */}
              <div className="counselor-details">
                {/* Address */}
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <div className="detail-content">
                    {counselor.address.street && <div>{counselor.address.street}</div>}
                    <div>
                      {counselor.address.city}, {counselor.address.state} {counselor.address.zip}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                {counselor.phone && (
                  <div className="detail-item">
                    <span className="detail-icon">☎️</span>
                    <div className="detail-content">
                      <a href={`tel:${counselor.phone}`} className="detail-link">
                        {counselor.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {counselor.website && (
                  <div className="detail-item">
                    <span className="detail-icon">🌐</span>
                    <div className="detail-content">
                      <a
                        href={counselor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-link"
                      >
                        {counselor.website}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {counselor.email && (
                  <div className="detail-item">
                    <span className="detail-icon">✉️</span>
                    <div className="detail-content">
                      <a href={`mailto:${counselor.email}`} className="detail-link">
                        {counselor.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Services */}
              {counselor.services && counselor.services.length > 0 && (
                <div className="services-section">
                  <p className="services-title">Services offered:</p>
                  <ul className="services-list">
                    {counselor.services.map((service, index) => (
                      <li key={index} className="service-item">
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {counselor.languages && counselor.languages.length > 0 && (
                <div className="languages-section">
                  <span className="languages-label">Languages:</span>
                  <span className="languages-value">
                    {counselor.languages.join(', ')}
                  </span>
                </div>
              )}

              {/* Distance Badge */}
              {counselor.distance && (
                <div className="distance-badge">
                  📏 {counselor.distance} miles from you
                </div>
              )}

              {/* Action Buttons */}
              <div className="counselor-actions">
                {counselor.phone && (
                  <a
                    href={`tel:${counselor.phone}`}
                    className="action-btn action-btn-primary"
                  >
                    📞 Call Now
                  </a>
                )}
                {counselor.website && (
                  <a
                    href={counselor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn action-btn-secondary"
                  >
                    🌐 Visit Website
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${counselor.address.street}, ${counselor.address.city}, ${counselor.address.state} ${counselor.address.zip}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn action-btn-tertiary"
                >
                  🗺️ Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}