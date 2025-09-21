import React, { useState } from "react";
import { useTurnstile, TurnstileOptions } from "@thind9xdev/react-turnstile";

const InvisibleTurnstileExample = () => {
  const siteKey = "1x00000000000000000000AA"; // Test site key
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const options: TurnstileOptions = {
    appearance: "execute", // Invisible mode
    execution: "execute",
    theme: "light"
  };
  
  const { ref, token, error, isLoading, execute } = useTurnstile(siteKey, options);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      // Execute Turnstile verification first
      setMessage("Verifying you're human...");
      execute();
      return;
    }

    // Proceed with form submission
    setMessage("Submitting form...");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form submitted with:", { email, token });
      setMessage("Form submitted successfully!");
      
      // Reset form
      setEmail("");
    } catch (err) {
      setMessage("Failed to submit form. Please try again.");
    }
  };

  // Auto-submit when token is received
  React.useEffect(() => {
    if (token && message === "Verifying you're human...") {
      handleFormSubmit(new Event('submit') as any);
    }
  }, [token, message]);

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Invisible Turnstile Example</h2>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        This form uses invisible Turnstile verification. The CAPTCHA will only appear if needed.
      </p>
      
      <form onSubmit={handleFormSubmit}>
        {/* Hidden Turnstile container */}
        <div ref={ref} style={{ display: 'none' }}></div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your email"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !email}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Verifying...' : 'Subscribe to Newsletter'}
        </button>
      </form>
      
      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          Error: {error}
        </div>
      )}
      
      {message && !error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: message.includes('successfully') ? '#e8f5e8' : '#e3f2fd',
          color: message.includes('successfully') ? '#2e7d32' : '#1565c0',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
        <p>This form demonstrates invisible Turnstile integration.</p>
        <p>Token: {token ? '✅ Verified' : '❌ Not verified'}</p>
      </div>
    </div>
  );
};

export default InvisibleTurnstileExample;