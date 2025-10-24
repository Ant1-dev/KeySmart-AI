'use client';

import { useState, useEffect } from 'react';
import { MatchResult, UserProfile } from '@/lib/types';
import Link from 'next/link';
import '../app/styles/results.css';

export default function ResultsDashboard() {
  const [result] = useState<MatchResult | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedResult = sessionStorage.getItem('matchResult');
    return storedResult ? JSON.parse(storedResult) : null;
  });

  const [profile] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedProfile = sessionStorage.getItem('userProfile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  // AI Features State
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [readinessAnalysis, setReadinessAnalysis] = useState<any>(null);

  // Load AI Readiness Analysis on mount
  useEffect(() => {
    if (result && profile) {
      const loadAnalysis = async () => {
        try {
          const response = await fetch('/api/readiness-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userProfile: profile,
              readinessScore: result.readinessScore,
              matches: result.matches
            })
          });
          const data = await response.json();
          setReadinessAnalysis(data.analysis);
        } catch (error) {
          console.error('Error loading analysis:', error);
        }
      };
      loadAnalysis();
    }
  }, [result, profile]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExplainLoan = async (match: any) => {
    setLoadingExplanation(true);
    setShowExplanation(true);
    
    try {
      const response = await fetch('/api/explain-loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanType: match.program.name,
          userProfile: profile,
          matchedProgram: match.program
        })
      });

      const data = await response.json();
      setCurrentExplanation(data.explanation);
    } catch (error) {
      console.error('Error:', error);
      setCurrentExplanation('Sorry, unable to generate explanation right now.');
    } finally {
      setLoadingExplanation(false);
    }
  };

  if (!result || !profile) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading your results...</p>
        <Link href="/form" className="back-link">
          Go back to form
        </Link>
      </div>
    );
  }

  const getReadinessColor = (score: number) => {
    if (score >= 75) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
  };

  const getReadinessMessage = (score: number) => {
    if (score >= 75) return "You're ready to buy!";
    if (score >= 50) return "You're almost there!";
    return "Keep building your readiness";
  };

  const getDTIBadge = (dti: number) => {
    if (dti < 36) return { text: 'Excellent', className: 'excellent' };
    if (dti < 43) return { text: 'Good', className: 'good' };
    if (dti < 50) return { text: 'Acceptable', className: 'acceptable' };
    return { text: 'High', className: 'high' };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const readinessColor = getReadinessColor(result.readinessScore);
  const dtiBadge = getDTIBadge(result.dtiRatio);
  const monthlyIncome = Math.round(profile.annualIncome / 12);
  const totalHousingDebt = result.matches[0] 
    ? profile.monthlyDebt + result.matches[0].estimatedMonthlyPayment 
    : profile.monthlyDebt;
  const remainingIncome = monthlyIncome - totalHousingDebt;

  return (
    <div>
      {/* Readiness Score */}
      <section className="readiness-section">
        <h2 className="readiness-header">Your Homeownership Readiness</h2>
        <div className="readiness-content">
          <div className="score-gauge">
            <svg width="160" height="160" className="score-circle">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#374151"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={readinessColor === 'green' ? '#16a34a' : readinessColor === 'yellow' ? '#eab308' : '#dc2626'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${result.readinessScore * 4.4} 440`}
                strokeLinecap="round"
              />
            </svg>
            <div className={`score-number ${readinessColor}`}>
              {result.readinessScore}%
            </div>
          </div>
          <div className="readiness-message">
            <h3 className={readinessColor}>{getReadinessMessage(result.readinessScore)}</h3>
            <p>Here&apos;s what you qualify for based on your profile</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <p className="stat-label">Annual Income</p>
            <p className="stat-value">{formatCurrency(profile.annualIncome)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Credit Score</p>
            <p className="stat-value">{profile.creditScore}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">DTI Ratio</p>
            <p className="stat-value">
              {result.dtiRatio}%
              <span className={`dti-badge ${dtiBadge.className}`}>
                {dtiBadge.text}
              </span>
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Location</p>
            <p className="stat-value">{profile.location}</p>
          </div>
        </div>
      </section>

      {/* AI READINESS ANALYSIS - NEW! */}
      {readinessAnalysis && (
        <section style={{
          background: 'linear-gradient(135deg, #854d0e 0%, #713f12 100%)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '2px solid #ca8a04',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            🎯 Your AI-Powered Roadmap
          </h3>
          <p style={{
            color: '#fef3c7',
            marginBottom: '1.5rem',
            fontSize: '1.125rem',
            lineHeight: '1.6'
          }}>
            {readinessAnalysis.summary}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '0.75rem'
            }}>
              <h4 style={{
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '0.75rem',
                fontSize: '1rem'
              }}>
                📅 Immediate (0-30 days):
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {readinessAnalysis.immediateSteps?.map((step: string, i: number) => (
                  <li key={i} style={{
                    color: '#fef3c7',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    paddingLeft: '1.25rem',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: '#16a34a',
                      fontWeight: 'bold'
                    }}>✓</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '0.75rem'
            }}>
              <h4 style={{
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '0.75rem',
                fontSize: '1rem'
              }}>
                🎯 Short-term (1-3 months):
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {readinessAnalysis.shortTermSteps?.map((step: string, i: number) => (
                  <li key={i} style={{
                    color: '#fef3c7',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    paddingLeft: '1.25rem',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: '#16a34a',
                      fontWeight: 'bold'
                    }}>✓</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <p style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}>
            🏠 Estimated Ready Date: <span style={{ color: '#fbbf24' }}>{readinessAnalysis.readyDate}</span>
          </p>
        </section>
      )}

      {/* Affordable Range */}
      {result.matches.length > 0 && (
        <div className="affordable-range">
          <p>Based on your income, you can afford homes between:</p>
          <p className="affordable-price">
            {formatCurrency(result.matches[0].affordableRange.min)} - {formatCurrency(result.matches[0].affordableRange.max)}
          </p>
        </div>
      )}

      {/* Down Payment Strategy */}
      {result.matches.length > 0 && (
        <section className="strategy-section">
          <h3 className="strategy-title">💰 Down Payment Strategy</h3>
          <div className="strategy-amounts">
            <div className="amount-item">
              <p className="amount-label">You Have</p>
              <p className="amount-value">{formatCurrency(profile.downPaymentSaved)}</p>
            </div>
            <div className="amount-item">
              <p className="amount-label">You Need</p>
              <p className="amount-value">{formatCurrency(result.matches[0].estimatedDownPayment)}</p>
            </div>
            <div className="amount-item">
              <p className="amount-label">
                {profile.downPaymentSaved >= result.matches[0].estimatedDownPayment ? 'Extra' : 'Gap'}
              </p>
              <p className={`amount-value ${profile.downPaymentSaved >= result.matches[0].estimatedDownPayment ? 'success-value' : 'gap-value'}`}>
                {formatCurrency(Math.abs(profile.downPaymentSaved - result.matches[0].estimatedDownPayment))}
              </p>
            </div>
          </div>

          {profile.downPaymentSaved < result.matches[0].estimatedDownPayment ? (
            <div className="strategy-list">
              <p className="strategy-list-title">Strategies to close the gap:</p>
              <ul>
                <li>Save {formatCurrency(Math.round((result.matches[0].estimatedDownPayment - profile.downPaymentSaved) / 12))}/month for 12 months</li>
                <li>Apply for down payment assistance programs (up to $10K available)</li>
                <li>Accept gift funds from family members (100% allowed for FHA loans)</li>
                <li>Explore IDA matched savings programs (doubles your savings)</li>
              </ul>
            </div>
          ) : (
            <p className="success-value" style={{fontWeight: 'bold', marginTop: '1rem'}}>
              ✓ You have enough saved for your down payment!
            </p>
          )}
        </section>
      )}

      {/* Budget Breakdown */}
      {result.matches.length > 0 && (
        <section className="budget-section">
          <h3 className="budget-title">📊 Your Monthly Budget</h3>
          <div className="budget-rows">
            <div className="budget-row">
              <span className="budget-label">Monthly Income:</span>
              <span className="budget-value">{formatCurrency(monthlyIncome)}</span>
            </div>
            <div className="budget-row">
              <span className="budget-label">Current Debt Payments:</span>
              <span className="budget-value">{formatCurrency(profile.monthlyDebt)}</span>
            </div>
            <div className="budget-row">
              <span className="budget-label">Estimated Mortgage Payment:</span>
              <span className="budget-value">{formatCurrency(result.matches[0].estimatedMonthlyPayment)}</span>
            </div>
            <div className="budget-row">
              <span className="budget-label">Total Housing + Debt:</span>
              <span className="budget-value">{formatCurrency(totalHousingDebt)}</span>
            </div>
            <div className="budget-row total">
              <span className="budget-label">Monthly After Housing:</span>
              <span className="budget-value positive">{formatCurrency(remainingIncome)}</span>
            </div>
          </div>
          <p className="budget-tip">
            💡 Tip: Aim to keep 30% of income ({formatCurrency(monthlyIncome * 0.3)}) for savings and emergencies
          </p>
        </section>
      )}

      {/* Matched Loans */}
      <section className="matches-section">
        <h2 className="matches-title">💚 You Qualify For These Loans</h2>
        {result.matches.map((match, index) => (
          <div key={match.program.id} className="loan-card">
            <div className="loan-header">
              <h3 className="loan-title">🏠 {match.program.name}</h3>
              {index === 0 && (
                <span className="best-match-badge">BEST MATCH</span>
              )}
            </div>

            <p className="loan-description">{match.program.description}</p>

            <div className="why-matched">
              <p className="why-matched-title">Why this works for you:</p>
              <ul>
                {match.whyMatched.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>

            <div className="loan-details">
              <div className="loan-detail">
                <p className="loan-detail-label">Down Payment</p>
                <p className="loan-detail-value">
                  {formatCurrency(match.estimatedDownPayment)} ({match.program.minDownPaymentPercent}%)
                </p>
              </div>
              <div className="loan-detail">
                <p className="loan-detail-label">Est. Monthly Payment</p>
                <p className="loan-detail-value">{formatCurrency(match.estimatedMonthlyPayment)}</p>
              </div>
              <div className="loan-detail">
                <p className="loan-detail-label">Home Price Range</p>
                <p className="loan-detail-value">
                  {formatCurrency(match.affordableRange.min)} - {formatCurrency(match.affordableRange.max)}
                </p>
              </div>
            </div>

            <div className="loan-actions">
              <button 
                className="btn-primary"
                onClick={() => handleExplainLoan(match)}
              >
                ✨ Why This Loan?
              </button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
        ))}
      </section>

      {/* Current Rates */}
      <section className="rates-section">
        <h3 className="rates-title">📊 Current Mortgage Rates</h3>
        <div className="rates-grid">
          <div className="rate-item">
            <p className="rate-label">30-year fixed</p>
            <p className="rate-value">{result.currentRates.fixed30}%</p>
          </div>
          <div className="rate-item">
            <p className="rate-label">15-year fixed</p>
            <p className="rate-value">{result.currentRates.fixed15}%</p>
          </div>
          <div className="rate-item">
            <p className="rate-label">5/1 ARM</p>
            <p className="rate-value">{result.currentRates.arm51}%</p>
          </div>
        </div>
        <p className="rates-source">National averages • Updated daily</p>
      </section>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Link href="/chat" className="action-button red">
          💬 Chat with AI Assistant
        </Link>
        <Link href="/counselors" className="action-button green">
          🎯 Find Housing Counselors
        </Link>
      </div>

      {/* AI LOAN EXPLANATION MODAL - NEW! */}
      {showExplanation && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem'
          }}
          onClick={() => setShowExplanation(false)}
        >
          <div 
            style={{
              backgroundColor: '#111827',
              borderRadius: '1rem',
              maxWidth: '42rem',
              width: '100%',
              padding: '2rem',
              border: '2px solid #374151',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                ✨ AI-Powered Loan Analysis
              </h3>
              <button 
                onClick={() => setShowExplanation(false)}
                style={{
                  color: '#9ca3af',
                  fontSize: '2rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
            
            {loadingExplanation ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div className="loading-spinner" style={{
                  margin: '0 auto 1rem',
                  width: '3rem',
                  height: '3rem'
                }}></div>
                <p style={{ color: '#9ca3af' }}>
                  Analyzing your profile and generating personalized explanation...
                </p>
              </div>
            ) : (
              <div style={{
                color: '#d1d5db',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                fontSize: '1rem'
              }}>
                {currentExplanation}
              </div>
            )}
            
            <button
              onClick={() => setShowExplanation(false)}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                color: '#ffffff',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}