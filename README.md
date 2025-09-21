# React Cloudflare Turnstile

A modern and clean React library for Cloudflare Turnstile integration.

## 📦 Installation

```bash
npm install @thind9xdev/react-turnstile
```

## 🚀 Import into React

```tsx
import { useTurnstile, TurnstileComponent } from "@thind9xdev/react-turnstile";
```

## 📝 Hook Usage (useTurnstile)

### Basic Hook Usage

```tsx
import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const MyComponent = () => {
  const siteKey = "YOUR_SITE_KEY"; // Replace with your actual site key
  const { ref, token, error, isLoading } = useTurnstile(siteKey);

  if (isLoading) {
    return <div>Loading Turnstile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // You can use the token to send requests to your API
  return (
    <div>
      <div ref={ref}></div>
      {token && <p>Turnstile token has been generated successfully!</p>}
    </div>
  );
};

export default MyComponent;
```

### Advanced Hook Usage

```tsx
import React from "react";
import { useTurnstile, TurnstileOptions } from "@thind9xdev/react-turnstile";

const AdvancedComponent = () => {
  const siteKey = "YOUR_SITE_KEY";
  const options: TurnstileOptions = {
    theme: "light",              // Light mode
    size: "normal",              // Standard size
    language: "en",              // English language
    retry: "auto",               // Auto retry
    "refresh-expired": "auto",   // Auto refresh when expired
    appearance: "always"         // Always show widget
  };
  
  const { 
    ref,
    token, 
    error, 
    isLoading, 
    reset,
    execute,
    getResponse
  } = useTurnstile(siteKey, options);

  const handleSubmit = async () => {
    try {
      const currentToken = getResponse();
      if (currentToken) {
        // Send request to your API with the token
        console.log("Current token:", currentToken);
        
        // Example API call
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: currentToken })
        });
        
        const result = await response.json();
        console.log("Verification result:", result);
      } else {
        // Execute Turnstile if no token available
        execute();
      }
    } catch (err) {
      console.error("Failed to get Turnstile token:", err);
    }
  };

  const handleReset = () => {
    reset(); // Reset widget to initial state
  };

  return (
    <div>
      <div ref={ref}></div>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Verifying..." : "Submit"}
      </button>
      <button onClick={handleReset} disabled={isLoading}>
        Reset Turnstile
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {token && <p style={{ color: "green" }}>Token is ready!</p>}
    </div>
  );
};

export default AdvancedComponent;
```

## 🧩 Component Usage (TurnstileComponent)

### Basic Component Usage

```tsx
import React, { useRef } from "react";
import { TurnstileComponent, TurnstileComponentRef } from "@thind9xdev/react-turnstile";

const ComponentExample = () => {
  const turnstileRef = useRef<TurnstileComponentRef>(null);
  const siteKey = "YOUR_SITE_KEY";

  const handleSubmit = () => {
    const token = turnstileRef.current?.getResponse();
    if (token) {
      console.log("Token from component:", token);
      // Send token to your API
    } else {
      console.log("No token yet, executing verification...");
      turnstileRef.current?.execute();
    }
  };

  const handleReset = () => {
    turnstileRef.current?.reset();
  };

  return (
    <div>
      <h3>Using TurnstileComponent</h3>
      
      <TurnstileComponent
        ref={turnstileRef}
        siteKey={siteKey}
        theme="auto"
        size="normal"
        className="my-turnstile"
        style={{ margin: "20px 0" }}
      />
      
      <div>
        <button onClick={handleSubmit}>
          Submit Form
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ComponentExample;
```

### Advanced Component Usage

```tsx
import React, { useRef, useState } from "react";
import { TurnstileComponent, TurnstileComponentRef } from "@thind9xdev/react-turnstile";

const AdvancedComponentExample = () => {
  const turnstileRef = useRef<TurnstileComponentRef>(null);
  const [status, setStatus] = useState<string>("");
  const siteKey = "YOUR_SITE_KEY";

  const handleSuccess = (token: string) => {
    setStatus(`Verification successful! Token: ${token.substring(0, 20)}...`);
  };

  const handleError = (error?: string) => {
    setStatus(`Verification error: ${error || "Unknown"}`);
  };

  const handleLoad = () => {
    setStatus("Turnstile has been loaded");
  };

  return (
    <div>
      <h3>Component with callback handlers</h3>
      
      <TurnstileComponent
        ref={turnstileRef}
        siteKey={siteKey}
        theme="dark"
        size="compact"
        language="en"
        onSuccess={handleSuccess}
        onError={handleError}
        onLoad={handleLoad}
        className="custom-turnstile"
        style={{ 
          border: "1px solid #ddd", 
          borderRadius: "8px",
          padding: "10px"
        }}
      />
      
      {status && (
        <div style={{ 
          marginTop: "10px", 
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px"
        }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default AdvancedComponentExample;
```

## 🔍 Invisible Mode Usage

### Using Invisible Mode with Hook

```tsx
import React, { useState } from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const InvisibleTurnstile = () => {
  const [email, setEmail] = useState("");
  const siteKey = "YOUR_SITE_KEY";
  
  const { ref, token, error, isLoading, execute } = useTurnstile(siteKey, {
    appearance: "execute",  // Invisible mode
    execution: "execute",
    theme: "light"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      // Execute Turnstile verification
      console.log("Verifying...");
      execute();
      return;
    }

    // Submit form with token
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token })
      });
      
      if (response.ok) {
        console.log("Form submitted successfully!");
        setEmail("");
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Hidden container for Turnstile */}
      <div ref={ref} style={{ display: "none" }}></div>
      
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <button type="submit" disabled={isLoading || !email}>
        {isLoading ? "Verifying..." : "Sign Up"}
      </button>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default InvisibleTurnstile;
```

## 📚 API Reference

### `useTurnstile(siteKey, options?)`

#### Parameters:
- `siteKey` (string): Your Cloudflare Turnstile site key
- `options` (TurnstileOptions, optional): Configuration options

#### Options (TurnstileOptions):
- `theme` ('light' | 'dark' | 'auto'): Display theme (default: 'auto')
- `size` ('normal' | 'compact'): Widget size (default: 'normal')
- `language` (string): Language code (default: 'auto')
- `retry` ('auto' | 'never'): Retry behavior (default: 'auto')
- `retry-interval` (number): Retry interval (milliseconds)
- `refresh-expired` ('auto' | 'manual' | 'never'): Expired token refresh behavior (default: 'auto')
- `appearance` ('always' | 'execute' | 'interaction-only'): When to show widget (default: 'always')
- `execution` ('render' | 'execute'): Execution mode (default: 'render')
- `onLoad` (function): Callback when widget is loaded
- `onSuccess` (function): Callback when verification succeeds
- `onError` (function): Callback when an error occurs
- `onExpire` (function): Callback when token expires
- `onTimeout` (function): Callback when timeout occurs

#### Returns:
- `ref` (React.RefObject): Ref to attach to container div
- `token` (string | null): Turnstile token
- `error` (string | null): Error message if any
- `isLoading` (boolean): Loading state
- `reset` (function): Function to reset widget
- `execute` (function): Function to manually execute Turnstile (for invisible mode)
- `getResponse` (function): Function to get current token
- `widgetId` (string | null): Widget ID returned by Turnstile

### `TurnstileComponent`

#### Props:
- `siteKey` (string): Your Cloudflare Turnstile site key
- `className` (string, optional): CSS class for container
- `style` (React.CSSProperties, optional): Inline styles for container
- All options from `TurnstileOptions`

#### Ref Methods:
- `reset()`: Reset widget to initial state
- `execute()`: Manually execute verification
- `getResponse()`: Get current token

## 🎨 TypeScript Support

This library includes full TypeScript support with exported interfaces:

```tsx
import { 
  useTurnstile, 
  TurnstileComponent,
  TurnstileResponse, 
  TurnstileOptions,
  TurnstileComponentProps,
  TurnstileComponentRef 
} from "@thind9xdev/react-turnstile";
```

## 🎭 Themes and Display Modes

### Theme Modes
- `light`: Light theme
- `dark`: Dark theme  
- `auto`: Auto-detect based on user system settings

### Sizes
- `normal`: Standard widget size
- `compact`: Compact widget size

### Appearance Modes
- `always`: Widget always visible (default)
- `execute`: Invisible mode - widget only appears when executed
- `interaction-only`: Widget only appears when user interaction is needed

## ✨ Features

- ✅ Clean and modern React hook
- ✅ Full TypeScript support
- ✅ Automatic script loading and cleanup
- ✅ Error handling
- ✅ Loading states  
- ✅ Manual token refresh and reset
- ✅ Support for invisible mode
- ✅ Theme and size customization
- ✅ Language support
- ✅ Comprehensive widget lifecycle management
- ✅ Zero dependencies (peer dependency: React >=16.8.0)

## 🔧 Getting Your Site Key

1. Visit [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Turnstile"
3. Create a new site
4. Copy your **Site Key** and **Secret Key**

### Test Site Key
For testing, you can use: `1x00000000000000000000AA`

## 🔧 Backend Integration

### Verify Turnstile token from React with Node.js/Express Back-End:

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TURNSTILE_SECRET_KEY = 'YOUR_SECRET_KEY'; // Replace with your actual secret key

app.post('/verify-turnstile', async (req, res) => {
  const { token, remoteip } = req.body;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing token' 
    });
  }

  try {
    const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: remoteip // optional
    });

    const { success, error_codes } = response.data;

    if (success) {
      res.json({ 
        success: true, 
        message: 'Verification successful' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Verification failed',
        error_codes 
      });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Verify Turnstile token with NestJS Back-End:

#### Create TurnstileMiddleware:
```bash
nest generate middleware turnstile
```

#### Add middleware code:
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class TurnstileMiddleware implements NestMiddleware {
  private secretKey = 'YOUR_SECRET_KEY';

  async use(req: Request, res: Response, next: NextFunction) {
    const turnstileToken = req.body.turnstileToken;
    
    if (!turnstileToken) {
      return res.status(400).json({ message: 'Missing turnstileToken' });
    }

    try {
      const response = await axios.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          secret: this.secretKey,
          response: turnstileToken,
          remoteip: req.ip
        }
      );

      const { success, error_codes } = response.data;

      if (!success) {
        return res.status(401).json({ 
          message: 'Invalid turnstileToken',
          error_codes 
        });
      }

      next();
    } catch (error) {
      console.error('Turnstile verification error:', error);
      return res.status(500).json({ message: 'Verification failed' });
    }
  }
}
```

### Verify with PHP (Laravel):

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TurnstileController extends Controller
{
    public function verify(Request $request)
    {
        $token = $request->input('token');
        $secretKey = env('TURNSTILE_SECRET_KEY'); // Add to .env

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Missing token'
            ], 400);
        }

        $response = Http::post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret' => $secretKey,
            'response' => $token,
            'remoteip' => $request->ip()
        ]);

        $result = $response->json();

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => 'Verification successful'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Verification failed',
                'error_codes' => $result['error_codes'] ?? []
            ], 400);
        }
    }
}
```

## 🚀 Getting Started with Cloudflare Turnstile

1. **Sign up for Cloudflare**: Visit [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Navigate to Turnstile**: Go to "Turnstile" in the sidebar
3. **Create a Site**: Click "Add Site" and configure your domain
4. **Get your keys**: Copy your Site Key and Secret Key
5. **Configure your site**: Set up allowed domains and other settings

## ⚠️ Error Handling

Common error codes and their meanings:

- `missing-input-secret`: The secret parameter is missing
- `invalid-input-secret`: The secret parameter is invalid or malformed
- `missing-input-response`: The response parameter is missing
- `invalid-input-response`: The response parameter is invalid or malformed
- `bad-request`: The request is invalid or malformed
- `timeout-or-duplicate`: The response parameter has already been validated before

### Error handling example:

```tsx
import { useTurnstile } from "@thind9xdev/react-turnstile";

const ErrorHandlingExample = () => {
  const { ref, token, error, isLoading, reset } = useTurnstile("YOUR_SITE_KEY");

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'timeout-or-duplicate':
        return 'Token has been used or expired. Please try again.';
      case 'invalid-input-response':
        return 'Invalid response. Please refresh the page.';
      default:
        return `Verification error: ${error}`;
    }
  };

  return (
    <div>
      <div ref={ref}></div>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <p>{getErrorMessage(error)}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
      {token && <p style={{ color: 'green' }}>✅ Verification successful!</p>}
    </div>
  );
};
```

## 🌐 Browser Support

Cloudflare Turnstile works in all modern browsers that support:
- ES6 Promises
- Fetch API or XMLHttpRequest
- Modern JavaScript features

## 🔄 Migration from reCAPTCHA

If you're migrating from Google reCAPTCHA, the main differences are:

1. **Script URL**: Uses Cloudflare's CDN instead of Google's
2. **API Methods**: Different method names and parameters
3. **Verification endpoint**: Uses Cloudflare's verification API
4. **Configuration options**: Different theme and customization options
5. **Privacy**: Better privacy protection as Cloudflare doesn't track users

### Comparison table:

| reCAPTCHA | Turnstile |
|-----------|-----------|
| `grecaptcha.render()` | `turnstile.render()` |
| `grecaptcha.reset()` | `turnstile.reset()` |
| `grecaptcha.getResponse()` | `turnstile.getResponse()` |
| Google CDN | Cloudflare CDN |
| Tracks users | Privacy-focused |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Copyright 2024 thind9xdev

## 🔗 Links

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [GitHub Repository](https://github.com/thind9xdev/react-turnstile)
- [NPM Package](https://www.npmjs.com/package/@thind9xdev/react-turnstile)
- [Quick Start Guide](./QUICK_START.md)