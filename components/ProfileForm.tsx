'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/lib/types';
import { US_STATES } from '@/lib/data/states';
import '../app/styles/form.css';

export default function ProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    annualIncome: 55000,
    creditScore: 680,
    monthlyDebt: 800,
    downPaymentSaved: 8000,
    city: '',
    state: '',
    location: '',
    isFirstTime: true
  });

  // Debt calculator state
  const [debtBreakdown, setDebtBreakdown] = useState({
    carLoan: 0,
    studentLoans: 0,
    creditCards: 0,
    otherLoans: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate location is set
    if (!formData.location) {
      alert('Please select both city and state');
      return;
    }
    
    setLoading(true);

    try {
      // Prepare profile for API
      const profile: UserProfile = {
        annualIncome: formData.annualIncome,
        creditScore: formData.creditScore,
        monthlyDebt: formData.monthlyDebt,
        downPaymentSaved: formData.downPaymentSaved,
        location: formData.location,
        isFirstTime: formData.isFirstTime
      };

      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const result = await response.json();

      // Store results and navigate
      sessionStorage.setItem('matchResult', JSON.stringify(result));
      sessionStorage.setItem('userProfile', JSON.stringify(profile));
      router.push('/results');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const updateLocation = (city: string, state: string) => {
    const location = city && state ? `${city}, ${state}` : '';
    setFormData(prev => ({ ...prev, city, state, location }));
  };

  const calculateDebtTotal = () => {
    return debtBreakdown.carLoan + 
           debtBreakdown.studentLoans + 
           debtBreakdown.creditCards + 
           debtBreakdown.otherLoans;
  };

  const useCalculatedDebt = () => {
    const total = calculateDebtTotal();
    setFormData(prev => ({ ...prev, monthlyDebt: total }));
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-header">
        <h2 className="form-title">Tell us about yourself</h2>
        <p className="form-subtitle">All information is private and secure 🔒</p>
      </div>

      {/* Annual Income */}
      <div className="form-group">
        <label className="form-label">
          💰 Annual Income (before taxes)
        </label>
        <input
          type="number"
          required
          value={formData.annualIncome}
          onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
          className="form-input"
          placeholder="55000"
          min="0"
          step="1000"
        />
        <p className="form-helper">
          Yearly: {formatCurrency(formData.annualIncome)}
          <span className="value-display">({formatCurrency(formData.annualIncome / 12)}/month)</span>
        </p>
        
        <details className="helper-details">
          <summary className="helper-summary">
            💡 What to include in annual income
          </summary>
          <div className="helper-content">
            <p><strong>✓ Include:</strong></p>
            <ul>
              <li>Salary and wages from employment</li>
              <li>Regular bonuses (if you get them yearly)</li>
              <li>Side gig or freelance income</li>
              <li>Investment income (dividends, interest)</li>
              <li>Child support or alimony (if applicable)</li>
            </ul>
            <p><strong>✗ Don&apos;t include:</strong></p>
            <ul>
              <li>One-time windfalls or inheritances</li>
              <li>Tax refunds</li>
              <li>Gifts from family</li>
              <li>Unemployment benefits</li>
            </ul>
          </div>
        </details>
      </div>

      {/* Credit Score */}
      <div className="form-group">
        <label className="form-label">
          💳 Credit Score
          <span className="range-value">{formData.creditScore}</span>
        </label>
        <input
          type="range"
          min="500"
          max="850"
          value={formData.creditScore}
          onChange={(e) => setFormData({ ...formData, creditScore: Number(e.target.value) })}
          className="range-slider"
        />
        <div className="range-labels">
          <span>500 (Poor)</span>
          <span>680 (Good)</span>
          <span>850 (Excellent)</span>
        </div>
        
        <details className="helper-details">
          <summary className="helper-summary">
            ❓ Don&apos;t know your credit score?
          </summary>
          <div className="helper-content">
            <p><strong>Here&apos;s how to estimate:</strong></p>
            <ul>
              <li><strong>740+:</strong> Always pay bills on time, credit card usage under 30%, long credit history</li>
              <li><strong>670-739:</strong> Mostly pay on time, occasional late payment (1-2 per year)</li>
              <li><strong>580-669:</strong> Some late payments, higher credit card balances (50%+ usage)</li>
              <li><strong>Below 580:</strong> Frequent late payments, collections, or bankruptcies</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              <strong>Get your real score FREE:</strong><br />
              <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer">
                AnnualCreditReport.com
              </a> (official government site)
            </p>
          </div>
        </details>
      </div>

      {/* Monthly Debt */}
      <div className="form-group">
        <label className="form-label">
          💵 Total Monthly Debt Payments
        </label>
        <input
          type="number"
          required
          value={formData.monthlyDebt}
          onChange={(e) => setFormData({ ...formData, monthlyDebt: Number(e.target.value) })}
          className="form-input"
          placeholder="800"
          min="0"
          step="50"
        />
        <p className="form-helper">
          Include car loans, student loans, credit cards (minimum payment), etc.
          <span className="value-display">{formatCurrency(formData.monthlyDebt)}/month</span>
        </p>
        
        <details className="helper-details">
          <summary className="helper-summary">
            🧮 Calculate my total monthly debt
          </summary>
          <div className="helper-content">
            <p style={{ fontWeight: '600', marginBottom: '0.75rem' }}>
              Add up these monthly payments:
            </p>
            
            <div className="debt-calculator">
              <div className="debt-input-row">
                <span>Car loan:</span>
                <input 
                  type="number" 
                  placeholder="$0"
                  value={debtBreakdown.carLoan || ''}
                  onChange={(e) => setDebtBreakdown({ 
                    ...debtBreakdown, 
                    carLoan: Number(e.target.value) || 0 
                  })}
                />
              </div>
              
              <div className="debt-input-row">
                <span>Student loans:</span>
                <input 
                  type="number" 
                  placeholder="$0"
                  value={debtBreakdown.studentLoans || ''}
                  onChange={(e) => setDebtBreakdown({ 
                    ...debtBreakdown, 
                    studentLoans: Number(e.target.value) || 0 
                  })}
                />
              </div>
              
              <div className="debt-input-row">
                <span>Credit cards (min payment):</span>
                <input 
                  type="number" 
                  placeholder="$0"
                  value={debtBreakdown.creditCards || ''}
                  onChange={(e) => setDebtBreakdown({ 
                    ...debtBreakdown, 
                    creditCards: Number(e.target.value) || 0 
                  })}
                />
              </div>
              
              <div className="debt-input-row">
                <span>Other loans:</span>
                <input 
                  type="number" 
                  placeholder="$0"
                  value={debtBreakdown.otherLoans || ''}
                  onChange={(e) => setDebtBreakdown({ 
                    ...debtBreakdown, 
                    otherLoans: Number(e.target.value) || 0 
                  })}
                />
              </div>
              
              <div className="debt-total">
                <span>Total:</span>
                <span className="debt-total-value">
                  {formatCurrency(calculateDebtTotal())}
                </span>
              </div>
              
              <button 
                type="button" 
                className="use-total-btn"
                onClick={useCalculatedDebt}
              >
                Use This Total
              </button>
            </div>
            
            <p style={{ marginTop: '0.75rem', fontStyle: 'italic', fontSize: '0.75rem' }}>
              💡 <strong>Don&apos;t include:</strong> rent, utilities, groceries, subscriptions, insurance
            </p>
          </div>
        </details>
      </div>

      {/* Down Payment */}
      <div className="form-group">
        <label className="form-label">
          💸 Down Payment Saved
        </label>
        <input
          type="number"
          required
          value={formData.downPaymentSaved}
          onChange={(e) => setFormData({ ...formData, downPaymentSaved: Number(e.target.value) })}
          className="form-input"
          placeholder="8000"
          min="0"
          step="500"
        />
        <p className="form-helper">
          How much do you have saved specifically for your down payment?
          <span className="value-display">{formatCurrency(formData.downPaymentSaved)}</span>
        </p>
      </div>

      {/* City */}
      <div className="form-group">
        <label className="form-label">
          📍 City
        </label>
        <input
          type="text"
          required
          value={formData.city}
          onChange={(e) => updateLocation(e.target.value, formData.state)}
          className="form-input"
          placeholder="Chicago"
        />
        <p className="form-helper">Enter the city where you want to buy</p>
      </div>

      {/* State */}
      <div className="form-group">
        <label className="form-label">
          📍 State
        </label>
        <select
          required
          value={formData.state}
          onChange={(e) => updateLocation(formData.city, e.target.value)}
          className="form-input"
          style={{ cursor: 'pointer' }}
        >
          <option value="">Select a state...</option>
          {US_STATES.map(s => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
        {formData.location && (
          <p className="form-helper">
            Looking in: <span className="value-display">{formData.location}</span>
          </p>
        )}
      </div>

      {/* First Time Buyer */}
      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={formData.isFirstTime}
            onChange={(e) => setFormData({ ...formData, isFirstTime: e.target.checked })}
            className="form-checkbox"
          />
          <span className="checkbox-label">
            I am a first-time homebuyer (haven&apos;t owned a home in 3 years)
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !formData.location}
        className="submit-button"
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Analyzing Your Profile...
          </>
        ) : (
          'See My Options →'
        )}
      </button>
    </form>
  );
}