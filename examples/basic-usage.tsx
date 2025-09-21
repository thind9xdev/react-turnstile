import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const BasicTurnstileExample = () => {
  const siteKey = "1x00000000000000000000AA"; // Test site key
  const { ref, token, error, isLoading, reset } = useTurnstile(siteKey);

  const handleSubmit = async () => {
    if (token) {
      // Send token to your backend for verification
      console.log("Submitting with token:", token);
      
      // Example API call
      try {
        const response = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        
        const result = await response.json();
        console.log('Verification result:', result);
      } catch (err) {
        console.error('API call failed:', err);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Cloudflare Turnstile Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div ref={ref}></div>
      </div>
      
      {isLoading && (
        <p style={{ color: 'blue' }}>Loading Turnstile...</p>
      )}
      
      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}
      
      {token && (
        <p style={{ color: 'green' }}>✅ Verification successful!</p>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleSubmit} 
          disabled={!token || isLoading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: token ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: token ? 'pointer' : 'not-allowed'
          }}
        >
          {isLoading ? 'Verifying...' : 'Submit Form'}
        </button>
        
        <button 
          onClick={reset}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
      </div>
    </div>
  );
};

export default BasicTurnstileExample;