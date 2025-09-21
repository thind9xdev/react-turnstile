# Quick Start Guide - React Cloudflare Turnstile

## Installation

```bash
npm install @thind9xdev/react-turnstile
```

## 1. Basic Usage (5 minutes)

```tsx
import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

function MyForm() {
  const { ref, token, error, isLoading } = useTurnstile("YOUR_SITE_KEY");

  const handleSubmit = () => {
    if (token) {
      console.log("Token:", token);
      // Send to your API
    }
  };

  return (
    <div>
      <div ref={ref}></div>
      {token && <button onClick={handleSubmit}>Submit</button>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## 2. Get Your Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Turnstile"
3. Create a new site
4. Copy your **Site Key** and **Secret Key**

## 3. Test Site Key

For testing, you can use: `1x00000000000000000000AA`

## 4. Backend Verification

```javascript
// Node.js/Express
app.post('/verify', async (req, res) => {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: 'YOUR_SECRET_KEY',
      response: req.body.token
    })
  });
  
  const result = await response.json();
  res.json({ success: result.success });
});
```

## 5. Common Options

```tsx
const options = {
  theme: 'dark',           // 'light' | 'dark' | 'auto'
  size: 'compact',         // 'normal' | 'compact'  
  appearance: 'execute'    // 'always' | 'execute' | 'interaction-only'
};

const { ref, token } = useTurnstile("YOUR_SITE_KEY", options);
```

That's it! Check the [full README](./README.md) for more examples and advanced usage.