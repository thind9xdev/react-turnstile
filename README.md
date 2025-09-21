# React Cloudflare Turnstile

A clean, modern React hook for Cloudflare Turnstile integration.

## Install:

```bash
npm i @thind9xdev/react-turnstile
```

## Import to React:

```tsx
import { useTurnstile } from "@thind9xdev/react-turnstile";
```

## Basic Usage

```tsx
import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const YourComponent = () => {
  const siteKey = "YOUR_SITE_KEY";
  const { ref, token, error, isLoading } = useTurnstile(siteKey);

  if (isLoading) {
    return <div>Loading Turnstile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // You can use token to send request to API
  return (
    <div>
      <div ref={ref}></div>
      {token && <p>Turnstile token generated successfully!</p>}
    </div>
  );
};

export default YourComponent;
```

## Component Usage

You can also use the `TurnstileComponent` for a more React-like component approach:

```tsx
import React, { useRef } from "react";
import { TurnstileComponent, TurnstileComponentRef } from "@thind9xdev/react-turnstile";

const YourComponent = () => {
  const turnstileRef = useRef<TurnstileComponentRef>(null);
  const siteKey = "YOUR_SITE_KEY";

  const handleSuccess = (token: string) => {
    console.log("Turnstile success:", token);
    // Handle the token (send to your API, etc.)
  };

  const handleError = (error?: string) => {
    console.error("Turnstile error:", error);
  };

  const handleReset = () => {
    turnstileRef.current?.reset();
  };

  return (
    <div>
      <TurnstileComponent
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={handleError}
        theme="light"
        size="normal"
      />
      <button onClick={handleReset}>
        Reset Turnstile
      </button>
    </div>
  );
};

export default YourComponent;
```

## Advanced Usage

```tsx
import React from "react";
import { useTurnstile, TurnstileOptions } from "@thind9xdev/react-turnstile";

const YourComponent = () => {
  const siteKey = "YOUR_SITE_KEY";
  const options: TurnstileOptions = {
    theme: "light",
    size: "normal",
    language: "en",
    retry: "auto",
    "refresh-expired": "auto",
    appearance: "always"
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
      } else {
        // Execute Turnstile if no token available
        execute();
      }
    } catch (err) {
      console.error("Failed to get Turnstile token:", err);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div>
      <div ref={ref}></div>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
      <button onClick={handleReset} disabled={isLoading}>
        Reset Turnstile
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {token && <p style={{ color: "green" }}>Token ready!</p>}
    </div>
  );
};

export default YourComponent;
```

## Invisible/Execute Mode Usage

```tsx
import React from "react";
import { useTurnstile, TurnstileOptions } from "@thind9xdev/react-turnstile";

const InvisibleTurnstile = () => {
  const siteKey = "YOUR_SITE_KEY";
  const options: TurnstileOptions = {
    appearance: "execute", // Invisible mode
    execution: "execute"
  };
  
  const { ref, token, error, isLoading, execute } = useTurnstile(siteKey, options);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      // Execute Turnstile verification
      execute();
      return;
    }

    // Proceed with form submission using the token
    console.log("Submitting with token:", token);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div ref={ref}></div>
      <input type="email" placeholder="Your email" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Submit"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default InvisibleTurnstile;
```

## API Reference

### `useTurnstile(siteKey, options?)`

#### Parameters:
- `siteKey` (string): Your Cloudflare Turnstile site key
- `options` (TurnstileOptions, optional): Configuration options

#### Options (TurnstileOptions):
- `theme` ('light' | 'dark' | 'auto', optional): Widget theme (default: 'auto')
- `size` ('normal' | 'compact', optional): Widget size (default: 'normal')
- `language` (string, optional): Language code (default: 'auto')
- `retry` ('auto' | 'never', optional): Retry behavior (default: 'auto')
- `retry-interval` (number, optional): Retry interval in milliseconds
- `refresh-expired` ('auto' | 'manual' | 'never', optional): Token refresh behavior (default: 'auto')
- `appearance` ('always' | 'execute' | 'interaction-only', optional): When to show the widget (default: 'always')
- `execution` ('render' | 'execute', optional): Execution mode (default: 'render')

#### Returns:
- `ref` (React.RefObject): Ref to attach to the container div element
- `token` (string | null): The Turnstile token
- `error` (string | null): Error message if something went wrong
- `isLoading` (boolean): Loading state
- `reset` (function): Function to reset the widget
- `execute` (function): Function to manually execute Turnstile (for invisible mode)
- `getResponse` (function): Function to get the current token
- `widgetId` (string | null): The widget ID returned by Turnstile

## TypeScript Support

This package includes full TypeScript support with exported interfaces:

```tsx
import { useTurnstile, TurnstileResponse, TurnstileOptions } from "@thind9xdev/react-turnstile";
```

## Widget Themes and Appearance

### Themes
- `light`: Light theme
- `dark`: Dark theme  
- `auto`: Automatically matches user's system preference

### Sizes
- `normal`: Standard size widget
- `compact`: Smaller, compact widget

### Appearance Modes
- `always`: Widget is always visible (default)
- `execute`: Invisible mode - widget only appears during execution
- `interaction-only`: Widget appears only when user interaction is required

## Features

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

# Backend Integration

## Verify Turnstile token from React with Node.js/Express Back-End:

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TURNSTILE_SECRET_KEY = 'YOUR_SECRET_KEY';

app.post('/verify-turnstile', async (req, res) => {
  const { token, remoteip } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Missing token' });
  }

  try {
    const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: remoteip // optional
    });

    const { success, error_codes } = response.data;

    if (success) {
      res.json({ success: true, message: 'Verification successful' });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Verification failed',
        error_codes 
      });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
```

## Verify Turnstile token with NestJS Back-End:

### Create TurnstileMiddleware:
```bash
nest generate middleware turnstile
```

### Add middleware code:
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
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
```

## Getting Started with Cloudflare Turnstile

1. **Sign up for Cloudflare**: Visit [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Navigate to Turnstile**: Go to "Turnstile" in the sidebar
3. **Create a Site**: Click "Add Site" and configure your domain
4. **Get your keys**: Copy your Site Key and Secret Key
5. **Configure your site**: Set up allowed domains and other settings

## Error Handling

Common error codes and their meanings:

- `missing-input-secret`: The secret parameter is missing
- `invalid-input-secret`: The secret parameter is invalid or malformed
- `missing-input-response`: The response parameter is missing
- `invalid-input-response`: The response parameter is invalid or malformed
- `bad-request`: The request is invalid or malformed
- `timeout-or-duplicate`: The response parameter has already been validated before

## Browser Support

Cloudflare Turnstile works in all modern browsers that support:
- ES6 Promises
- Fetch API or XMLHttpRequest
- Modern JavaScript features

## Migration from reCAPTCHA

If you're migrating from Google reCAPTCHA, the main differences are:

1. **Script URL**: Uses Cloudflare's CDN instead of Google's
2. **API Methods**: Different method names and parameters
3. **Verification endpoint**: Uses Cloudflare's verification API
4. **Configuration options**: Different theme and customization options
5. **Privacy**: Better privacy protection as Cloudflare doesn't track users

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

Copyright 2024 thind9xdev

## Links

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [GitHub Repository](https://github.com/thind9xdev/react-turnstile1)
- [NPM Package](https://www.npmjs.com/package/@thind9xdev/react-turnstile)