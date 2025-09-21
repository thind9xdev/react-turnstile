# React Cloudflare Turnstile

> **Tiếng Việt**: Thư viện React hook hiện đại và sạch sẽ để tích hợp Cloudflare Turnstile - giải pháp thay thế an toàn và bảo mật hơn cho reCAPTCHA từ Google. Thư viện này cung cấp đầy đủ TypeScript support, xử lý lỗi tự động, quản lý trạng thái loading, và hỗ trợ nhiều chế độ hiển thị khác nhau.

A clean, modern React hook for Cloudflare Turnstile integration - a privacy-focused, secure alternative to Google reCAPTCHA. This library provides full TypeScript support, automatic error handling, loading state management, and multiple appearance mode options.

## 📋 Mục lục / Table of Contents

- [Cài đặt / Installation](#-cài-đặt--installation)
- [Bắt đầu nhanh / Quick Start](#-bắt-đầu-nhanh--quick-start)
- [Cách sử dụng cơ bản / Basic Usage](#-cách-sử-dụng-cơ-bản--basic-usage)
- [Cách sử dụng nâng cao / Advanced Usage](#-cách-sử-dụng-nâng-cao--advanced-usage)
- [Chế độ ẩn / Invisible Mode](#-chế-độ-ẩn--invisible-mode)
- [API Reference](#-api-reference)
- [Tùy chọn cấu hình / Configuration Options](#-tùy-chọn-cấu-hình--configuration-options)
- [Tích hợp Backend / Backend Integration](#-tích-hợp-backend--backend-integration)
- [Xử lý lỗi / Error Handling](#-xử-lý-lỗi--error-handling)
- [Tính năng / Features](#-tính-năng--features)
- [Yêu cầu hệ thống / System Requirements](#-yêu-cầu-hệ-thống--system-requirements)
- [Ví dụ thực tế / Real-world Examples](#-ví-dụ-thực-tế--real-world-examples)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Cài đặt / Installation

### Sử dụng npm:
```bash
npm install @thind9xdev/react-turnstile
```

### Sử dụng yarn:
```bash
yarn add @thind9xdev/react-turnstile
```

### Sử dụng pnpm:
```bash
pnpm add @thind9xdev/react-turnstile
```

### Yêu cầu hệ thống:
- React >= 16.8.0 (cần hooks support)
- TypeScript >= 4.1.0 (tùy chọn, nhưng được khuyến khích)
- Modern browser với ES6 support

## ⚡ Bắt đầu nhanh / Quick Start

### 1. Import thư viện:
```tsx
import { useTurnstile } from "@thind9xdev/react-turnstile";
```

### 2. Sử dụng cơ bản trong 5 phút:
```tsx
import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

function MyForm() {
  const { ref, token, error, isLoading } = useTurnstile("YOUR_SITE_KEY");

  const handleSubmit = () => {
    if (token) {
      console.log("Token nhận được:", token);
      // Gửi token đến API của bạn
    }
  };

  return (
    <div>
      <div ref={ref}></div>
      {token && <button onClick={handleSubmit}>Gửi form</button>}
      {error && <p>Lỗi: {error}</p>}
    </div>
  );
}
```

### 3. Lấy Site Key và Secret Key:
1. Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Điều hướng đến "Turnstile"
3. Tạo site mới
4. Sao chép **Site Key** và **Secret Key**

### 4. Site Key để test:
```tsx
const testSiteKey = "1x00000000000000000000AA"; // Chỉ dùng để test
```

## 📖 Cách sử dụng cơ bản / Basic Usage

### Ví dụ cơ bản với xử lý trạng thái đầy đủ:

```tsx
import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const BasicTurnstileForm = () => {
  const siteKey = "YOUR_SITE_KEY";
  const { ref, token, error, isLoading } = useTurnstile(siteKey);

  // Xử lý khi loading
  if (isLoading) {
    return (
      <div className="turnstile-loading">
        <p>Đang tải Turnstile...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  // Xử lý khi có lỗi
  if (error) {
    return (
      <div className="turnstile-error">
        <p>❌ Lỗi: {error}</p>
        <button onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

  // Gửi token đến server
  const handleSubmit = async () => {
    if (!token) {
      alert("Vui lòng hoàn thành xác minh Turnstile");
      return;
    }

    try {
      const response = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert("✅ Xác minh thành công!");
      } else {
        alert("❌ Xác minh thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi API:", err);
      alert("❌ Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  return (
    <div className="form-container">
      <h2>Form với Cloudflare Turnstile</h2>
      
      {/* Container cho Turnstile widget */}
      <div ref={ref} className="turnstile-widget"></div>
      
      {/* Hiển thị trạng thái */}
      {token ? (
        <p className="success">✅ Xác minh thành công!</p>
      ) : (
        <p className="pending">⏳ Vui lòng hoàn thành xác minh</p>
      )}
      
      {/* Button gửi */}
      <button 
        onClick={handleSubmit} 
        disabled={!token || isLoading}
        className={`submit-btn ${token ? 'active' : 'disabled'}`}
      >
        {isLoading ? "Đang xử lý..." : "Gửi form"}
      </button>
      
      {/* Debug info */}
      <details className="debug-info">
        <summary>Thông tin debug</summary>
        <pre>{JSON.stringify({ token: token?.substring(0, 20) + "...", error, isLoading }, null, 2)}</pre>
      </details>
    </div>
  );
};

export default BasicTurnstileForm;
```

## 🔧 Cách sử dụng nâng cao / Advanced Usage

### Với tất cả các tùy chọn cấu hình:

```tsx
import React from "react";
import { useTurnstile, TurnstileOptions } from "@thind9xdev/react-turnstile";

const AdvancedTurnstileForm = () => {
  const siteKey = "YOUR_SITE_KEY";
  
  // Cấu hình chi tiết
  const options: TurnstileOptions = {
    theme: "light",                    // 'light' | 'dark' | 'auto'
    size: "normal",                    // 'normal' | 'compact'
    language: "vi",                    // Mã ngôn ngữ (vi, en, fr, de, ...)
    retry: "auto",                     // 'auto' | 'never'
    "retry-interval": 8000,            // Thời gian retry (ms)
    "refresh-expired": "auto",         // 'auto' | 'manual' | 'never'
    appearance: "always",              // 'always' | 'execute' | 'interaction-only'
    execution: "render",               // 'render' | 'execute'
    
    // Callback functions
    onLoad: () => {
      console.log("Turnstile đã tải thành công");
    },
    onSuccess: (token: string) => {
      console.log("Token nhận được:", token);
    },
    onError: (errorCode?: string) => {
      console.error("Lỗi Turnstile:", errorCode);
    },
    onExpire: () => {
      console.warn("Token đã hết hạn");
    },
    onTimeout: () => {
      console.warn("Turnstile timeout");
    }
  };
  
  const { 
    ref,
    token, 
    error, 
    isLoading, 
    reset,           // Reset widget
    execute,         // Thực thi thủ công
    getResponse,     // Lấy token hiện tại
    widgetId         // ID của widget
  } = useTurnstile(siteKey, options);

  // Xử lý gửi form
  const handleSubmit = async () => {
    try {
      const currentToken = getResponse();
      if (currentToken) {
        console.log("Token hiện tại:", currentToken);
        
        // Gửi đến API
        const response = await fetch("/api/submit-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            token: currentToken,
            formData: "your-form-data"
          }),
        });
        
        if (response.ok) {
          alert("Gửi thành công!");
        } else {
          throw new Error("API response không thành công");
        }
      } else {
        // Nếu không có token, thực thi Turnstile
        console.log("Không có token, thực thi Turnstile");
        execute();
      }
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  // Reset Turnstile
  const handleReset = () => {
    console.log("Reset Turnstile widget");
    reset();
  };

  return (
    <div className="advanced-form">
      <h2>Form Nâng cao với Turnstile</h2>
      
      {/* Turnstile widget container */}
      <div ref={ref} className="turnstile-container"></div>
      
      {/* Các button điều khiển */}
      <div className="controls">
        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? "Đang xử lý..." : "Gửi Form"}
        </button>
        
        <button 
          onClick={handleReset} 
          disabled={isLoading}
          className="btn btn-secondary"
        >
          Reset Turnstile
        </button>
        
        <button 
          onClick={execute} 
          disabled={isLoading}
          className="btn btn-tertiary"
        >
          Thực thi thủ công
        </button>
      </div>
      
      {/* Hiển thị trạng thái */}
      <div className="status-display">
        {error && (
          <div className="alert alert-error">
            ❌ Lỗi: {error}
          </div>
        )}
        
        {token && (
          <div className="alert alert-success">
            ✅ Token đã sẵn sàng!
          </div>
        )}
        
        {isLoading && (
          <div className="alert alert-info">
            ⏳ Đang tải...
          </div>
        )}
      </div>
      
      {/* Thông tin debug chi tiết */}
      <details className="debug-panel">
        <summary>🔍 Thông tin Debug</summary>
        <div className="debug-content">
          <p><strong>Widget ID:</strong> {widgetId || "Chưa có"}</p>
          <p><strong>Token:</strong> {token ? `${token.substring(0, 30)}...` : "Chưa có"}</p>
          <p><strong>Error:</strong> {error || "Không có"}</p>
          <p><strong>Loading:</strong> {isLoading ? "Có" : "Không"}</p>
          <p><strong>Site Key:</strong> {siteKey}</p>
        </div>
      </details>
    </div>
  );
};

export default AdvancedTurnstileForm;
```

## 👤 Chế độ ẩn / Invisible Mode

Chế độ ẩn cho phép Turnstile chạy ngầm mà không hiển thị widget trừ khi cần thiết:

```tsx
import React, { useState } from "react";
import { useTurnstile, TurnstileOptions } from "@thind9xdev/react-turnstile";

const InvisibleTurnstileForm = () => {
  const siteKey = "YOUR_SITE_KEY";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  // Cấu hình chế độ ẩn
  const options: TurnstileOptions = {
    appearance: "execute",        // Widget chỉ hiển thị khi cần
    execution: "execute",         // Thực thi thủ công
    theme: "auto",               // Tự động theo theme hệ thống
    size: "normal"
  };
  
  const { ref, token, error, isLoading, execute } = useTurnstile(siteKey, options);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      // Nếu chưa có token, thực thi Turnstile
      setMessage("Đang xác minh bạn là con người...");
      execute();
      return;
    }

    // Nếu đã có token, gửi form
    setMessage("Đang gửi form...");
    
    try {
      const response = await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          turnstileToken: token
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage("🎉 Đăng ký thành công! Kiểm tra email của bạn.");
        setEmail(""); // Reset form
      } else {
        throw new Error(result.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setMessage("❌ Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  // Tự động gửi form khi nhận được token
  React.useEffect(() => {
    if (token && message === "Đang xác minh bạn là con người...") {
      handleFormSubmit(new Event('submit') as any);
    }
  }, [token, message]);

  return (
    <div className="invisible-form-container">
      <h2>📧 Đăng ký Newsletter</h2>
      <p className="description">
        Form này sử dụng Turnstile ẩn. Widget chỉ xuất hiện khi cần thiết.
      </p>
      
      <form onSubmit={handleFormSubmit} className="newsletter-form">
        {/* Container ẩn cho Turnstile */}
        <div ref={ref} style={{ display: 'none' }}></div>
        
        <div className="form-group">
          <label htmlFor="email">
            📧 Địa chỉ Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Nhập email của bạn"
            className="email-input"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !email.trim()}
          className={`submit-button ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Đang xác minh...
            </>
          ) : (
            <>
              🚀 Đăng ký nhận tin
            </>
          )}
        </button>
      </form>
      
      {/* Hiển thị thông báo */}
      {error && (
        <div className="alert alert-error">
          ❌ Lỗi: {error}
        </div>
      )}
      
      {message && !error && (
        <div className={`alert ${
          message.includes('thành công') ? 'alert-success' :
          message.includes('xác minh') ? 'alert-info' : 'alert-warning'
        }`}>
          {message}
        </div>
      )}
      
      {/* Chỉ báo trạng thái Turnstile */}
      <div className="turnstile-status">
        <small>
          🔒 Turnstile: {token ? '✅ Đã xác minh' : '⏳ Chưa xác minh'}
        </small>
      </div>
      
      <style jsx>{`
        .invisible-form-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .description {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .email-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        .email-input:focus {
          border-color: #4CAF50;
          outline: none;
        }
        
        .submit-button {
          width: 100%;
          padding: 12px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .submit-button:hover:not(:disabled) {
          background: #45a049;
        }
        
        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .submit-button.loading {
          background: #2196F3;
        }
        
        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .alert {
          padding: 12px;
          border-radius: 6px;
          margin-top: 15px;
        }
        
        .alert-error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef5350;
        }
        
        .alert-success {
          background: #e8f5e8;
          color: #2e7d32;
          border: 1px solid #4caf50;
        }
        
        .alert-info {
          background: #e3f2fd;
          color: #1565c0;
          border: 1px solid #2196f3;
        }
        
        .turnstile-status {
          text-align: center;
          margin-top: 15px;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default InvisibleTurnstileForm;
```

### Ví dụ chế độ ẩn với form đăng nhập:

```tsx
import React, { useState } from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { ref, token, execute, isLoading } = useTurnstile("YOUR_SITE_KEY", {
    appearance: "execute",
    theme: "dark"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      await execute(); // Thực thi Turnstile trước
      return;
    }

    // Gửi thông tin đăng nhập cùng token
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...credentials,
          turnstileToken: token
        })
      });
      
      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        alert("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div ref={ref} style={{ display: "none" }}></div>
      
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={credentials.username}
        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        required
      />
      
      <input
        type="password"
        placeholder="Mật khẩu"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Đang xác minh..." : "Đăng nhập"}
      </button>
    </form>
  );
};
```

## 📚 API Reference

### `useTurnstile(siteKey, options?)`

Hook chính để tích hợp Cloudflare Turnstile vào React component.

#### Parameters / Tham số:

| Tham số | Loại | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `siteKey` | `string` | ✅ | Site key từ Cloudflare Turnstile Dashboard |
| `options` | `TurnstileOptions` | ❌ | Các tùy chọn cấu hình (xem bên dưới) |

#### Returns / Trả về:

Hook trả về một object với các thuộc tính sau:

| Thuộc tính | Loại | Mô tả |
|------------|------|-------|
| `ref` | `React.RefObject<HTMLDivElement>` | Ref để gắn vào container div element |
| `token` | `string \| null` | Token Turnstile sau khi xác minh thành công |
| `error` | `string \| null` | Thông báo lỗi nếu có sự cố |
| `isLoading` | `boolean` | Trạng thái loading của widget |
| `reset` | `() => void` | Function để reset widget về trạng thái ban đầu |
| `execute` | `() => void` | Function để thực thi Turnstile thủ công (dùng cho invisible mode) |
| `getResponse` | `() => string \| null` | Function để lấy token hiện tại |
| `widgetId` | `string \| null` | ID duy nhất của widget được tạo bởi Turnstile |

#### Ví dụ sử dụng return values:

```tsx
const ExampleComponent = () => {
  const { ref, token, error, isLoading, reset, execute, getResponse } = useTurnstile("YOUR_SITE_KEY");
  
  // Kiểm tra token có sẵn
  const checkToken = () => {
    const currentToken = getResponse();
    console.log("Token hiện tại:", currentToken);
  };
  
  // Reset widget khi cần
  const handleReset = () => {
    reset();
    console.log("Widget đã được reset");
  };
  
  // Thực thi thủ công (cho invisible mode)
  const handleExecute = () => {
    execute();
    console.log("Đã thực thi Turnstile");
  };
  
  return (
    <div>
      <div ref={ref}></div>
      <button onClick={checkToken}>Kiểm tra Token</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleExecute}>Thực thi</button>
    </div>
  );
};
```

## ⚙️ Tùy chọn cấu hình / Configuration Options

### Interface `TurnstileOptions`

```tsx
interface TurnstileOptions {
  // Cấu hình giao diện
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  language?: string;
  
  // Cấu hình hành vi
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
  'refresh-expired'?: 'auto' | 'manual' | 'never';
  appearance?: 'always' | 'execute' | 'interaction-only';
  execution?: 'render' | 'execute';
  
  // Callback functions
  onLoad?: () => void;
  onSuccess?: (token: string) => void;
  onError?: (errorCode?: string) => void;
  onExpire?: () => void;
  onTimeout?: () => void;
}
```

### Chi tiết các tùy chọn:

#### **Giao diện (Appearance Options)**

| Tùy chọn | Loại | Mặc định | Mô tả |
|----------|------|----------|-------|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Theme màu của widget |
| `size` | `'normal' \| 'compact'` | `'normal'` | Kích thước widget |
| `language` | `string` | `'auto'` | Mã ngôn ngữ (vi, en, fr, de, ja, ko, ...) |

**Ví dụ theme:**
```tsx
// Light theme
const { ref } = useTurnstile("SITE_KEY", { theme: "light" });

// Dark theme  
const { ref } = useTurnstile("SITE_KEY", { theme: "dark" });

// Auto (theo hệ thống)
const { ref } = useTurnstile("SITE_KEY", { theme: "auto" });
```

#### **Hành vi (Behavior Options)**

| Tùy chọn | Loại | Mặc định | Mô tả |
|----------|------|----------|-------|
| `retry` | `'auto' \| 'never'` | `'auto'` | Có tự động retry khi thất bại |
| `retry-interval` | `number` | `8000` | Thời gian giữa các lần retry (ms) |
| `refresh-expired` | `'auto' \| 'manual' \| 'never'` | `'auto'` | Cách xử lý khi token hết hạn |
| `appearance` | `'always' \| 'execute' \| 'interaction-only'` | `'always'` | Khi nào hiển thị widget |
| `execution` | `'render' \| 'execute'` | `'render'` | Chế độ thực thi |

**Ví dụ behavior:**
```tsx
// Không tự động retry
const { ref } = useTurnstile("SITE_KEY", { retry: "never" });

// Retry sau 10 giây
const { ref } = useTurnstile("SITE_KEY", { 
  retry: "auto", 
  "retry-interval": 10000 
});

// Chế độ invisible
const { ref } = useTurnstile("SITE_KEY", { 
  appearance: "execute",
  execution: "execute"
});
```

#### **Callback Functions**

| Callback | Tham số | Mô tả |
|----------|---------|-------|
| `onLoad` | `()` | Được gọi khi widget tải xong |
| `onSuccess` | `(token: string)` | Được gọi khi xác minh thành công |
| `onError` | `(errorCode?: string)` | Được gọi khi có lỗi |
| `onExpire` | `()` | Được gọi khi token hết hạn |
| `onTimeout` | `()` | Được gọi khi timeout |

**Ví dụ callbacks:**
```tsx
const { ref } = useTurnstile("SITE_KEY", {
  onLoad: () => {
    console.log("✅ Turnstile đã tải thành công");
  },
  onSuccess: (token) => {
    console.log("🎉 Nhận được token:", token);
    // Tự động gửi form hoặc làm gì đó với token
  },
  onError: (errorCode) => {
    console.error("❌ Lỗi Turnstile:", errorCode);
    // Hiển thị thông báo lỗi cho user
  },
  onExpire: () => {
    console.warn("⏰ Token đã hết hạn");
    // Có thể tự động reset widget
  },
  onTimeout: () => {
    console.warn("⏱️ Turnstile timeout");
    // Xử lý timeout
  }
});
```

### Ví dụ cấu hình đầy đủ:

```tsx
import React from "react";
import { useTurnstile, TurnstileOptions } from "@thind9xdev/react-turnstile";

const FullConfigExample = () => {
  const options: TurnstileOptions = {
    // Giao diện
    theme: "auto",                    // Tự động theo theme hệ thống
    size: "compact",                  // Kích thước nhỏ gọn
    language: "vi",                   // Tiếng Việt
    
    // Hành vi
    retry: "auto",                    // Tự động retry
    "retry-interval": 5000,           // Retry sau 5 giây
    "refresh-expired": "auto",        // Tự động refresh token hết hạn
    appearance: "interaction-only",   // Chỉ hiện khi cần tương tác
    execution: "render",              // Render ngay lập tức
    
    // Callbacks
    onLoad: () => {
      console.log("Turnstile loaded");
      // Có thể hiển thị thông báo "Đã sẵn sàng"
    },
    onSuccess: (token) => {
      console.log("Success! Token:", token);
      // Có thể tự động gửi form
    },
    onError: (errorCode) => {
      console.error("Error:", errorCode);
      // Hiển thị lỗi cho user
    },
    onExpire: () => {
      console.warn("Token expired");
      // Có thể hiển thị thông báo cần làm lại
    },
    onTimeout: () => {
      console.warn("Timeout occurred");
      // Xử lý timeout
    }
  };

  const { ref, token, error, isLoading } = useTurnstile("YOUR_SITE_KEY", options);

  return (
    <div>
      <h3>Turnstile với cấu hình đầy đủ</h3>
      <div ref={ref}></div>
      
      <div className="status">
        <p>Loading: {isLoading ? "Có" : "Không"}</p>
        <p>Token: {token ? "Có" : "Không có"}</p>
        <p>Error: {error || "Không có"}</p>
      </div>
    </div>
  );
};

export default FullConfigExample;
```

## 📝 TypeScript Support

Thư viện này được viết hoàn toàn bằng TypeScript và cung cấp đầy đủ type definitions:

```tsx
import { 
  useTurnstile, 
  TurnstileResponse, 
  TurnstileOptions 
} from "@thind9xdev/react-turnstile";

// Tất cả types đều được export
const MyComponent: React.FC = () => {
  // Có đủ type hints và autocomplete
  const options: TurnstileOptions = {
    theme: "dark", // TypeScript sẽ suggest: 'light' | 'dark' | 'auto'
    size: "compact", // TypeScript sẽ suggest: 'normal' | 'compact'
    appearance: "execute" // Và các tùy chọn khác...
  };

  const {
    ref,      // React.RefObject<HTMLDivElement>
    token,    // string | null
    error,    // string | null
    isLoading // boolean
  } = useTurnstile("YOUR_SITE_KEY", options);

  return <div ref={ref}></div>;
};
```

### Interface Definitions:

```tsx
// Response từ Cloudflare API
interface TurnstileResponse {
  success: boolean;
  error_codes?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

// Component với TypeScript
interface MyFormProps {
  siteKey: string;
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
}

const MyForm: React.FC<MyFormProps> = ({ siteKey, onSuccess, onError }) => {
  const { ref, token, error } = useTurnstile(siteKey, {
    onSuccess,
    onError
  });

  return <div ref={ref}></div>;
};
```

## 🔧 Tích hợp Backend / Backend Integration

### Node.js + Express

Ví dụ đầy đủ server Express để xác minh token:

```javascript
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const turnstileLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 100 requests mỗi IP
  message: { error: 'Too many requests' }
});

// Cấu hình
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Endpoint xác minh Turnstile
app.post('/api/verify-turnstile', turnstileLimit, async (req, res) => {
  const { token, remoteip } = req.body;

  // Validation
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing or invalid token' 
    });
  }

  if (!TURNSTILE_SECRET_KEY) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return res.status(500).json({ 
      success: false, 
      error: 'Server configuration error' 
    });
  }

  try {
    // Gửi request đến Cloudflare
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: remoteip || req.ip || req.connection.remoteAddress
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    const { success, error_codes, challenge_ts, hostname } = response.data;

    if (success) {
      // Log successful verification
      console.log(`Turnstile verification successful for ${hostname} at ${challenge_ts}`);
      
      res.json({ 
        success: true, 
        message: 'Verification successful',
        timestamp: challenge_ts,
        hostname 
      });
    } else {
      // Log failed verification
      console.warn(`Turnstile verification failed: ${error_codes?.join(', ')}`);
      
      res.status(400).json({ 
        success: false, 
        error: 'Verification failed',
        error_codes 
      });
    }
  } catch (error) {
    // Log error
    console.error('Turnstile verification error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        success: false, 
        error: 'Verification timeout' 
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

### NestJS Implementation

#### 1. Tạo Middleware:

```bash
nest generate middleware turnstile
```

#### 2. Implement Middleware:

```typescript
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TurnstileMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const turnstileToken = req.body.turnstileToken;
    
    if (!turnstileToken) {
      throw new HttpException(
        { 
          message: 'Missing turnstileToken in request body',
          error: 'MISSING_TURNSTILE_TOKEN'
        }, 
        HttpStatus.BAD_REQUEST
      );
    }

    const secretKey = this.configService.get<string>('TURNSTILE_SECRET_KEY');
    
    if (!secretKey) {
      throw new HttpException(
        'Turnstile not properly configured', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      const verificationResponse = await firstValueFrom(
        this.httpService.post(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            secret: secretKey,
            response: turnstileToken,
            remoteip: req.ip
          },
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      );

      const { success, error_codes, challenge_ts, hostname } = verificationResponse.data;

      if (!success) {
        throw new HttpException(
          { 
            message: 'Turnstile verification failed',
            error_codes,
            error: 'TURNSTILE_VERIFICATION_FAILED'
          }, 
          HttpStatus.UNAUTHORIZED
        );
      }

      // Attach verification info to request
      req['turnstileVerification'] = {
        success: true,
        challenge_ts,
        hostname,
        verified_at: new Date().toISOString()
      };

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Turnstile verification error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      throw new HttpException(
        'Turnstile verification service unavailable', 
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
```

#### 3. Apply Middleware:

```typescript
// app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TurnstileMiddleware } from './turnstile.middleware';

@Module({
  // ... other module config
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TurnstileMiddleware)
      .forRoutes(
        { path: 'api/protected/*', method: RequestMethod.POST },
        { path: 'api/forms/*', method: RequestMethod.POST }
      );
  }
}
```

#### 4. Use in Controller:

```typescript
import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('api/forms')
export class FormsController {
  @Post('contact')
  async submitContact(@Body() contactData: any, @Req() req: Request) {
    // Turnstile đã được verify trong middleware
    const verification = req['turnstileVerification'];
    
    console.log('Form submitted with Turnstile verification:', verification);
    
    // Process form...
    return { 
      success: true, 
      message: 'Contact form submitted successfully',
      verifiedAt: verification.verified_at
    };
  }
}
```

### Next.js API Routes

```typescript
// pages/api/verify-turnstile.ts hoặc app/api/verify-turnstile/route.ts

import { NextApiRequest, NextApiResponse } from 'next';

interface TurnstileVerifyRequest {
  token: string;
  remoteip?: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  error_codes?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, remoteip }: TurnstileVerifyRequest = req.body;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing token' 
    });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return res.status(500).json({ 
      success: false, 
      error: 'Server configuration error' 
    });
  }

  try {
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          remoteip: remoteip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        }),
      }
    );

    const result: TurnstileVerifyResponse = await verifyResponse.json();

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Verification successful',
        challenge_ts: result.challenge_ts,
        hostname: result.hostname
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Verification failed',
        error_codes: result.error_codes 
      });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
```

### Python Flask/FastAPI

```python
# Flask example
from flask import Flask, request, jsonify
import requests
import os
from datetime import datetime

app = Flask(__name__)

TURNSTILE_SECRET_KEY = os.getenv('TURNSTILE_SECRET_KEY')

@app.route('/api/verify-turnstile', methods=['POST'])
def verify_turnstile():
    data = request.get_json()
    
    if not data or 'token' not in data:
        return jsonify({
            'success': False,
            'error': 'Missing token'
        }), 400
    
    token = data['token']
    remoteip = data.get('remoteip') or request.remote_addr
    
    try:
        response = requests.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            json={
                'secret': TURNSTILE_SECRET_KEY,
                'response': token,
                'remoteip': remoteip
            },
            timeout=10
        )
        
        result = response.json()
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'message': 'Verification successful',
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Verification failed',
                'error_codes': result.get('error_codes', [])
            }), 400
            
    except requests.RequestException as e:
        print(f"Turnstile verification error: {e}")
        return jsonify({
            'success': False,
            'error': 'Verification service unavailable'
        }), 503

if __name__ == '__main__':
    app.run(debug=True)
```

## 🚨 Xử lý lỗi / Error Handling

### Các mã lỗi phổ biến và cách xử lý:

| Mã lỗi | Ý nghĩa | Cách khắc phục |
|--------|---------|----------------|
| `missing-input-secret` | Thiếu secret key | Kiểm tra cấu hình server |
| `invalid-input-secret` | Secret key không hợp lệ | Kiểm tra secret key từ dashboard |
| `missing-input-response` | Thiếu response token | Đảm bảo token được gửi từ client |
| `invalid-input-response` | Token không hợp lệ | Token có thể đã hết hạn hoặc bị sai |
| `bad-request` | Request không hợp lệ | Kiểm tra định dạng request |
| `timeout-or-duplicate` | Token đã được sử dụng | Mỗi token chỉ dùng được 1 lần |

### Xử lý lỗi trong React:

```tsx
import React, { useState } from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const ErrorHandlingExample = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { ref, token, error, isLoading, reset } = useTurnstile("YOUR_SITE_KEY");

  const handleSubmit = async () => {
    setSubmitError(null);
    
    if (!token) {
      setSubmitError("Vui lòng hoàn thành xác minh Turnstile");
      return;
    }

    try {
      const response = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const result = await response.json();

      if (!result.success) {
        // Xử lý các loại lỗi khác nhau
        if (result.error_codes?.includes('timeout-or-duplicate')) {
          setSubmitError("Token đã được sử dụng. Vui lòng thử lại.");
          reset(); // Reset widget để lấy token mới
        } else if (result.error_codes?.includes('invalid-input-response')) {
          setSubmitError("Token không hợp lệ. Vui lòng thử lại.");
          reset();
        } else {
          setSubmitError("Xác minh thất bại. Vui lòng thử lại.");
        }
      } else {
        alert("Gửi thành công!");
      }
    } catch (err) {
      console.error("Network error:", err);
      setSubmitError("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
    }
  };

  // Auto-retry khi có lỗi
  React.useEffect(() => {
    if (error && error.includes('Failed to load')) {
      console.log("Retrying Turnstile load...");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [error]);

  return (
    <div className="error-handling-form">
      <div ref={ref}></div>
      
      {/* Hiển thị lỗi Turnstile */}
      {error && (
        <div className="error-message turnstile-error">
          <h4>❌ Lỗi Turnstile:</h4>
          <p>{error}</p>
          {error.includes('Failed to load') && (
            <p><small>Đang tự động thử lại sau 3 giây...</small></p>
          )}
          <button onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      )}
      
      {/* Hiển thị lỗi submit */}
      {submitError && (
        <div className="error-message submit-error">
          <h4>⚠️ Lỗi gửi form:</h4>
          <p>{submitError}</p>
        </div>
      )}
      
      <button onClick={handleSubmit} disabled={isLoading || !token}>
        {isLoading ? "Đang xử lý..." : "Gửi"}
      </button>
      
      {/* Debug panel */}
      <details className="debug-panel">
        <summary>🔍 Debug Info</summary>
        <pre>{JSON.stringify({
          token: token ? "Có" : "Không",
          error,
          submitError,
          isLoading
        }, null, 2)}</pre>
      </details>
    </div>
  );
};
```

### Retry Strategy:

```tsx
import React, { useState, useCallback } from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const RetryStrategy = () => {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  const { ref, token, error, reset } = useTurnstile("YOUR_SITE_KEY", {
    onError: (errorCode) => {
      console.error(`Turnstile error (attempt ${retryCount + 1}):`, errorCode);
    }
  });

  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      reset();
      console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
    }
  }, [retryCount, reset]);

  const resetRetryCount = () => {
    setRetryCount(0);
  };

  return (
    <div>
      <div ref={ref}></div>
      
      {error && (
        <div className="retry-section">
          <p>❌ Lỗi: {error}</p>
          <p>Lần thử: {retryCount}/{maxRetries}</p>
          
          {retryCount < maxRetries ? (
            <button onClick={handleRetry}>
              🔄 Thử lại ({maxRetries - retryCount} lần còn lại)
            </button>
          ) : (
            <div>
              <p>🚫 Đã hết số lần thử. Vui lòng:</p>
              <button onClick={() => window.location.reload()}>
                🔄 Tải lại trang
              </button>
              <button onClick={resetRetryCount}>
                ↺ Reset số lần thử
              </button>
            </div>
          )}
        </div>
      )}
      
      {token && <p>✅ Thành công sau {retryCount} lần thử!</p>}
    </div>
  );
};
```

## ✨ Tính năng / Features

- ✅ **React Hook hiện đại**: Sử dụng React Hooks pattern mới nhất
- ✅ **TypeScript hoàn chình**: Đầy đủ type definitions và IntelliSense
- ✅ **Tự động tải script**: Không cần thêm script tag thủ công
- ✅ **Cleanup tự động**: Tự động dọn dẹp khi component unmount
- ✅ **Xử lý lỗi thông minh**: Error handling và retry logic tích hợp
- ✅ **Loading states**: Theo dõi trạng thái loading chi tiết
- ✅ **Refresh token thủ công**: Function reset và execute
- ✅ **Chế độ ẩn**: Hỗ trợ invisible mode đầy đủ
- ✅ **Tùy chỉnh theme**: Light, dark, auto theme support
- ✅ **Tùy chỉnh kích thước**: Normal và compact size
- ✅ **Đa ngôn ngữ**: Hỗ trợ nhiều ngôn ngữ bao gồm tiếng Việt
- ✅ **Quản lý lifecycle**: Quản lý widget lifecycle hoàn chỉnh
- ✅ **Zero dependencies**: Chỉ cần React >=16.8.0
- ✅ **Performance tối ưu**: Lazy loading và memoization
- ✅ **Callback system**: Đầy đủ callback cho các sự kiện
- ✅ **Mobile friendly**: Responsive và touch-friendly
- ✅ **Accessibility**: ARIA labels và keyboard navigation
- ✅ **SSR support**: Server-side rendering compatible
- ✅ **Tree-shaking**: Module ES6 với tree-shaking support

## 💻 Yêu cầu hệ thống / System Requirements

### Phía Client:
- **React**: >= 16.8.0 (cần hooks support)
- **TypeScript**: >= 4.1.0 (tùy chọn nhưng khuyến khích)
- **Browsers**: Tất cả modern browsers
  - Chrome >= 60
  - Firefox >= 60  
  - Safari >= 12
  - Edge >= 79
  - Mobile browsers (iOS Safari, Chrome Mobile)

### Phía Server:
- **Node.js**: >= 14.0.0 (cho các ví dụ backend)
- **Frameworks**: Express, NestJS, Next.js, Fastify, etc.
- **Languages**: JavaScript, TypeScript, Python, PHP, Go, Java, etc.

### Browser Features Required:
- ES6 Promises
- Fetch API hoặc XMLHttpRequest
- Modern JavaScript features (let, const, arrow functions)
- DOM manipulation APIs

### Compatibility Check:

```tsx
import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const CompatibilityCheck = () => {
  const [isCompatible, setIsCompatible] = React.useState(true);
  const [errors, setErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    const checkCompatibility = () => {
      const checks = [];

      // Check for required APIs
      if (!window.fetch) checks.push("Fetch API not supported");
      if (!window.Promise) checks.push("Promises not supported");
      if (!document.createElement) checks.push("DOM manipulation not supported");
      
      // Check React version
      const reactVersion = React.version;
      const [major, minor] = reactVersion.split('.').map(Number);
      if (major < 16 || (major === 16 && minor < 8)) {
        checks.push(`React ${reactVersion} too old, need >= 16.8.0`);
      }

      if (checks.length > 0) {
        setIsCompatible(false);
        setErrors(checks);
      }
    };

    checkCompatibility();
  }, []);

  if (!isCompatible) {
    return (
      <div className="compatibility-error">
        <h3>❌ Browser không tương thích</h3>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
        <p>Vui lòng nâng cấp browser hoặc sử dụng polyfills.</p>
      </div>
    );
  }

  return <div>✅ Browser tương thích!</div>;
};
```

## 🌍 Ví dụ thực tế / Real-world Examples

### 1. Form liên hệ với validation:

```tsx
import React, { useState } from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "", email: "", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const { ref, token, error, isLoading } = useTurnstile("YOUR_SITE_KEY", {
    theme: "auto",
    language: "vi"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Vui lòng nhập tên";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email không hợp lệ";
    if (!formData.message.trim()) return "Vui lòng nhập tin nhắn";
    if (!token) return "Vui lòng hoàn thành xác minh Turnstile";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          turnstileToken: token
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage("🎉 Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitMessage("❌ Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      setSubmitMessage("❌ Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <h2>📞 Liên hệ với chúng tôi</h2>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Họ tên *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Tin nhắn *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="turnstile-container">
          <div ref={ref}></div>
          {error && <p className="error">Lỗi Turnstile: {error}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || isLoading || !token}
          className="submit-button"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
        </button>

        {submitMessage && (
          <div className={`message ${submitMessage.includes('🎉') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
```

### 2. E-commerce checkout với Turnstile:

```tsx
import React, { useState } from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  totalAmount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, totalAmount }) => {
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    phone: "",
    address: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { ref, token, error, isLoading } = useTurnstile("YOUR_SITE_KEY", {
    theme: "light",
    size: "compact"
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Vui lòng hoàn thành xác minh bảo mật");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          customer: customerInfo,
          totalAmount,
          turnstileToken: token
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to payment or success page
        window.location.href = `/order-success/${result.orderId}`;
      } else {
        alert("Lỗi đặt hàng: " + result.message);
      }
    } catch (err) {
      alert("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-form">
      <h2>🛒 Thanh toán</h2>
      
      {/* Order Summary */}
      <div className="order-summary">
        <h3>Đơn hàng của bạn:</h3>
        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name} x {item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString()} VNĐ</span>
          </div>
        ))}
        <div className="total">
          <strong>Tổng: {totalAmount.toLocaleString()} VNĐ</strong>
        </div>
      </div>

      <form onSubmit={handleCheckout}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ giao hàng:</label>
          <textarea
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
            required
          />
        </div>

        <div className="security-check">
          <p>🔒 Xác minh bảo mật:</p>
          <div ref={ref}></div>
          {error && <p className="error">❌ {error}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isProcessing || isLoading || !token}
          className="checkout-button"
        >
          {isProcessing ? "Đang xử lý..." : `Đặt hàng - ${totalAmount.toLocaleString()} VNĐ`}
        </button>
      </form>
    </div>
  );
};
```

## 🧪 Testing

### Testing với Jest và React Testing Library:

```tsx
// __tests__/useTurnstile.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useTurnstile } from '@thind9xdev/react-turnstile';

// Mock component để test hook
const TestComponent = ({ siteKey, options = {} }) => {
  const { ref, token, error, isLoading, reset, execute } = useTurnstile(siteKey, options);
  
  return (
    <div>
      <div ref={ref} data-testid="turnstile-container"></div>
      <div data-testid="token">{token || 'no-token'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <button data-testid="reset-btn" onClick={reset}>Reset</button>
      <button data-testid="execute-btn" onClick={execute}>Execute</button>
    </div>
  );
};

// Mock Turnstile API
const mockTurnstile = {
  render: jest.fn().mockReturnValue('widget-id-123'),
  reset: jest.fn(),
  remove: jest.fn(),
  execute: jest.fn(),
  getResponse: jest.fn().mockReturnValue('mock-token-123'),
  ready: jest.fn(callback => callback())
};

// Setup global mocks
beforeAll(() => {
  // Mock script loading
  global.document.createElement = jest.fn().mockImplementation((tagName) => {
    const element = document.createElement(tagName);
    if (tagName === 'script') {
      // Simulate successful script load
      setTimeout(() => {
        window.turnstile = mockTurnstile;
        element.onload && element.onload();
      }, 100);
    }
    return element;
  });

  global.document.head.appendChild = jest.fn();
});

describe('useTurnstile Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.turnstile;
  });

  test('renders Turnstile container', () => {
    render(<TestComponent siteKey="test-key" />);
    expect(screen.getByTestId('turnstile-container')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<TestComponent siteKey="test-key" />);
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
  });

  test('loads Turnstile script and renders widget', async () => {
    render(<TestComponent siteKey="test-key" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });
    
    expect(mockTurnstile.render).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        sitekey: 'test-key'
      })
    );
  });

  test('handles reset function', async () => {
    render(<TestComponent siteKey="test-key" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });
    
    fireEvent.click(screen.getByTestId('reset-btn'));
    expect(mockTurnstile.reset).toHaveBeenCalled();
  });

  test('handles execute function', async () => {
    render(<TestComponent siteKey="test-key" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });
    
    fireEvent.click(screen.getByTestId('execute-btn'));
    expect(mockTurnstile.execute).toHaveBeenCalled();
  });

  test('handles script loading error', async () => {
    // Mock script error
    global.document.createElement = jest.fn().mockImplementation((tagName) => {
      const element = document.createElement(tagName);
      if (tagName === 'script') {
        setTimeout(() => {
          element.onerror && element.onerror();
        }, 100);
      }
      return element;
    });

    render(<TestComponent siteKey="test-key" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).not.toHaveTextContent('no-error');
    });
  });

  test('passes options correctly', async () => {
    const options = {
      theme: 'dark',
      size: 'compact',
      language: 'vi'
    };

    render(<TestComponent siteKey="test-key" options={options} />);
    
    await waitFor(() => {
      expect(mockTurnstile.render).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          sitekey: 'test-key',
          theme: 'dark',
          size: 'compact',
          language: 'vi'
        })
      );
    });
  });
});
```

### E2E Testing với Cypress:

```typescript
// cypress/e2e/turnstile.cy.ts
describe('Turnstile Integration', () => {
  beforeEach(() => {
    // Intercept Turnstile script
    cy.intercept('GET', '**/turnstile/v0/api.js*', { fixture: 'turnstile-mock.js' });
    
    // Intercept verification API
    cy.intercept('POST', '**/turnstile/v0/siteverify', {
      success: true,
      challenge_ts: '2024-01-01T00:00:00.000Z',
      hostname: 'localhost'
    }).as('verifyTurnstile');
    
    cy.visit('/contact');
  });

  it('should load and display Turnstile widget', () => {
    cy.get('[data-testid="turnstile-container"]').should('be.visible');
    cy.get('[data-testid="turnstile-container"] iframe').should('exist');
  });

  it('should submit form with valid Turnstile token', () => {
    // Fill form
    cy.get('[name="name"]').type('John Doe');
    cy.get('[name="email"]').type('john@example.com');
    cy.get('[name="message"]').type('Test message');
    
    // Wait for Turnstile to load
    cy.get('[data-testid="turnstile-container"]').should('contain', 'Verify');
    
    // Click Turnstile (simulated)
    cy.get('[data-testid="turnstile-container"]').click();
    
    // Wait for token
    cy.get('[data-testid="submit-btn"]').should('not.be.disabled');
    
    // Submit form
    cy.get('[data-testid="submit-btn"]').click();
    
    // Verify API call
    cy.wait('@verifyTurnstile');
    
    // Check success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should handle Turnstile errors gracefully', () => {
    // Mock error response
    cy.intercept('POST', '**/turnstile/v0/siteverify', {
      success: false,
      error_codes: ['invalid-input-response']
    }).as('verifyTurnstileError');
    
    // Try to submit form
    cy.get('[name="name"]').type('John Doe');
    cy.get('[name="email"]').type('john@example.com');
    cy.get('[name="message"]').type('Test message');
    
    cy.get('[data-testid="submit-btn"]').click();
    
    cy.wait('@verifyTurnstileError');
    
    // Check error message
    cy.get('[data-testid="error-message"]').should('contain', 'Verification failed');
  });
});
```

### Unit Testing cho Backend:

```javascript
// __tests__/turnstile-verification.test.js
const request = require('supertest');
const app = require('../app'); // Your Express app

describe('Turnstile Verification', () => {
  beforeEach(() => {
    // Mock axios
    jest.mock('axios');
  });

  test('should verify valid token', async () => {
    const axios = require('axios');
    axios.post.mockResolvedValue({
      data: {
        success: true,
        challenge_ts: '2024-01-01T00:00:00.000Z',
        hostname: 'localhost'
      }
    });

    const response = await request(app)
      .post('/api/verify-turnstile')
      .send({ token: 'valid-token' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Verification successful');
  });

  test('should reject invalid token', async () => {
    const axios = require('axios');
    axios.post.mockResolvedValue({
      data: {
        success: false,
        error_codes: ['invalid-input-response']
      }
    });

    const response = await request(app)
      .post('/api/verify-turnstile')
      .send({ token: 'invalid-token' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error_codes).toContain('invalid-input-response');
  });

  test('should handle missing token', async () => {
    const response = await request(app)
      .post('/api/verify-turnstile')
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Missing token');
  });
});
```

## 🚀 Deployment

### Environment Variables:

```bash
# .env file
TURNSTILE_SECRET_KEY=your_secret_key_here
TURNSTILE_SITE_KEY=your_site_key_here
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Docker Deployment:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - TURNSTILE_SECRET_KEY=${TURNSTILE_SECRET_KEY}
    restart: unless-stopped
```

### Vercel Deployment:

```json
// vercel.json
{
  "functions": {
    "pages/api/verify-turnstile.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "TURNSTILE_SECRET_KEY": "@turnstile-secret-key"
  }
}
```

### Netlify Functions:

```javascript
// netlify/functions/verify-turnstile.js
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { token } = JSON.parse(event.body);
  
  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Missing token' })
    };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token
      })
    });

    const result = await response.json();

    return {
      statusCode: result.success ? 200 : 400,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
```

## 🔧 Troubleshooting

### Vấn đề thường gặp:

#### 1. Widget không hiển thị
```tsx
// Kiểm tra:
// - Site key có đúng không
// - Domain có được thêm vào Cloudflare dashboard không
// - Console có báo lỗi script loading không

const DiagnosticComponent = () => {
  const { ref, error, isLoading } = useTurnstile("YOUR_SITE_KEY");
  
  React.useEffect(() => {
    console.log('Turnstile debug:', {
      scriptLoaded: !!window.turnstile,
      containerExists: !!ref.current,
      error,
      isLoading
    });
  }, [error, isLoading]);
  
  return (
    <div>
      <div ref={ref}></div>
      {error && <p>Error: {error}</p>}
      {isLoading && <p>Loading...</p>}
    </div>
  );
};
```

#### 2. Token không được tạo
```tsx
// Kiểm tra callback
const { ref, token } = useTurnstile("YOUR_SITE_KEY", {
  onSuccess: (token) => {
    console.log('Token received:', token);
  },
  onError: (error) => {
    console.error('Turnstile error:', error);
  }
});
```

#### 3. Verification thất bại
```javascript
// Backend debugging
app.post('/api/verify-turnstile', async (req, res) => {
  const { token } = req.body;
  
  console.log('Verifying token:', token);
  console.log('Secret key exists:', !!process.env.TURNSTILE_SECRET_KEY);
  
  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: req.ip
      }
    );
    
    console.log('Cloudflare response:', response.data);
    
    res.json(response.data);
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
```

### Debug Tools:

```tsx
import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const TurnstileDebugger = ({ siteKey }) => {
  const { ref, token, error, isLoading, widgetId } = useTurnstile(siteKey, {
    onLoad: () => console.log('✅ Turnstile loaded'),
    onSuccess: (token) => console.log('✅ Token:', token),
    onError: (error) => console.log('❌ Error:', error),
    onExpire: () => console.log('⏰ Token expired'),
    onTimeout: () => console.log('⏱️ Timeout')
  });

  return (
    <div className="turnstile-debugger">
      <div ref={ref}></div>
      
      <div className="debug-info">
        <h4>🔍 Debug Information:</h4>
        <table>
          <tr><td>Site Key:</td><td>{siteKey}</td></tr>
          <tr><td>Widget ID:</td><td>{widgetId || 'None'}</td></tr>
          <tr><td>Token:</td><td>{token ? `${token.substring(0, 20)}...` : 'None'}</td></tr>
          <tr><td>Error:</td><td>{error || 'None'}</td></tr>
          <tr><td>Loading:</td><td>{isLoading ? 'Yes' : 'No'}</td></tr>
          <tr><td>Script Loaded:</td><td>{window.turnstile ? 'Yes' : 'No'}</td></tr>
          <tr><td>Container:</td><td>{ref.current ? 'Connected' : 'Not connected'}</td></tr>
        </table>
        
        <button onClick={() => console.log('Window turnstile:', window.turnstile)}>
          Log Turnstile Object
        </button>
      </div>
    </div>
  );
};
```

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! Dưới đây là hướng dẫn để đóng góp:

### Setup Development Environment:

```bash
# Clone repository
git clone https://github.com/thind9xdev/react-turnstile.git
cd react-turnstile

# Install dependencies
npm install

# Build project
npm run build

# Link for local testing
npm link

# In your test project
npm link @thind9xdev/react-turnstile
```

### Development Workflow:

1. **Fork repository** trên GitHub
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** và test thoroughly
4. **Run tests**: `npm test`
5. **Build project**: `npm run build`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Create Pull Request**

### Code Style:

```typescript
// Sử dụng TypeScript
// Tuân theo ESLint rules
// Comment cho complex logic
// Export types khi cần thiết

interface MyInterface {
  property: string;
}

const myFunction = (param: string): MyInterface => {
  // Implementation
  return { property: param };
};

export { myFunction };
export type { MyInterface };
```

### Testing Guidelines:

- Viết unit tests cho mọi functions
- Test coverage >= 80%
- Test cả happy path và error cases
- Mock external dependencies

### Bug Reports:

Khi báo cáo bug, vui lòng cung cấp:

- **React version**
- **Browser và version**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Code example** (tối thiểu)
- **Console errors** (nếu có)

### Feature Requests:

Khi đề xuất feature mới:

- **Mô tả chi tiết** feature
- **Use case** cụ thể
- **API design** đề xuất
- **Backward compatibility** considerations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 thind9xdev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**thind9xdev**
- GitHub: [@thind9xdev](https://github.com/thind9xdev)
- Email: thind9xdev@gmail.com

## 🔗 Links & Resources

### Official Documentation:
- [📚 Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [🔧 Turnstile API Reference](https://developers.cloudflare.com/turnstile/reference/)
- [🎯 Best Practices Guide](https://developers.cloudflare.com/turnstile/best-practices/)

### Package Links:
- [📦 NPM Package](https://www.npmjs.com/package/@thind9xdev/react-turnstile)
- [🐙 GitHub Repository](https://github.com/thind9xdev/react-turnstile)
- [📋 Changelog](https://github.com/thind9xdev/react-turnstile/blob/main/CHANGELOG.md)
- [🐛 Issues](https://github.com/thind9xdev/react-turnstile/issues)

### Getting Started:
- [⚡ Quick Start Guide](./QUICK_START.md)
- [📖 Examples](./examples/)
- [🧪 Testing Guide](./docs/testing.md)
- [🚀 Deployment Guide](./docs/deployment.md)

### Community:
- [💬 Discussions](https://github.com/thind9xdev/react-turnstile/discussions)
- [🤝 Contributing Guide](./CONTRIBUTING.md)
- [📋 Code of Conduct](./CODE_OF_CONDUCT.md)

---

<div align="center">

**🌟 Nếu thư viện này hữu ích, hãy cho chúng tôi một star trên GitHub! 🌟**

**If this library is helpful, please give us a star on GitHub!**

[⭐ Star on GitHub](https://github.com/thind9xdev/react-turnstile) | [📦 View on NPM](https://www.npmjs.com/package/@thind9xdev/react-turnstile)

---

Made with ❤️ by **thind9xdev** | Copyright © 2024

</div>