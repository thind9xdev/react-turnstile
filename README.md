# React Cloudflare Turnstile

Thư viện React hiện đại và sạch sẽ cho việc tích hợp Cloudflare Turnstile.

## 📦 Cài đặt

```bash
npm install @thind9xdev/react-turnstile
```

## 🚀 Import vào React

```tsx
import { useTurnstile, TurnstileComponent } from "@thind9xdev/react-turnstile";
```

## 📝 Cách sử dụng Hook (useTurnstile)

### Sử dụng cơ bản với Hook

```tsx
import React from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const MyComponent = () => {
  const siteKey = "YOUR_SITE_KEY"; // Thay bằng site key thực của bạn
  const { ref, token, error, isLoading } = useTurnstile(siteKey);

  if (isLoading) {
    return <div>Đang tải Turnstile...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  // Bạn có thể sử dụng token để gửi request tới API
  return (
    <div>
      <div ref={ref}></div>
      {token && <p>Token Turnstile đã được tạo thành công!</p>}
    </div>
  );
};

export default MyComponent;
```

### Sử dụng nâng cao với Hook

```tsx
import React from "react";
import { useTurnstile, TurnstileOptions } from "@thind9xdev/react-turnstile";

const AdvancedComponent = () => {
  const siteKey = "YOUR_SITE_KEY";
  const options: TurnstileOptions = {
    theme: "light",              // Chế độ sáng
    size: "normal",              // Kích thước tiêu chuẩn
    language: "vi",              // Ngôn ngữ tiếng Việt
    retry: "auto",               // Tự động thử lại
    "refresh-expired": "auto",   // Tự động làm mới khi hết hạn
    appearance: "always"         // Luôn hiển thị widget
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
        // Gửi request tới API với token
        console.log("Token hiện tại:", currentToken);
        
        // Ví dụ gọi API
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: currentToken })
        });
        
        const result = await response.json();
        console.log("Kết quả xác thực:", result);
      } else {
        // Thực thi Turnstile nếu chưa có token
        execute();
      }
    } catch (err) {
      console.error("Không thể lấy token Turnstile:", err);
    }
  };

  const handleReset = () => {
    reset(); // Reset widget về trạng thái ban đầu
  };

  return (
    <div>
      <div ref={ref}></div>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Đang xác thực..." : "Gửi"}
      </button>
      <button onClick={handleReset} disabled={isLoading}>
        Đặt lại Turnstile
      </button>
      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}
      {token && <p style={{ color: "green" }}>Token đã sẵn sàng!</p>}
    </div>
  );
};

export default AdvancedComponent;
```

## 🧩 Cách sử dụng Component (TurnstileComponent)

### Sử dụng cơ bản với Component

```tsx
import React, { useRef } from "react";
import { TurnstileComponent, TurnstileComponentRef } from "@thind9xdev/react-turnstile";

const ComponentExample = () => {
  const turnstileRef = useRef<TurnstileComponentRef>(null);
  const siteKey = "YOUR_SITE_KEY";

  const handleSubmit = () => {
    const token = turnstileRef.current?.getResponse();
    if (token) {
      console.log("Token từ component:", token);
      // Gửi token tới API của bạn
    } else {
      console.log("Chưa có token, thực thi verification...");
      turnstileRef.current?.execute();
    }
  };

  const handleReset = () => {
    turnstileRef.current?.reset();
  };

  return (
    <div>
      <h3>Sử dụng TurnstileComponent</h3>
      
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
          Gửi Form
        </button>
        <button onClick={handleReset}>
          Đặt lại
        </button>
      </div>
    </div>
  );
};

export default ComponentExample;
```

### Sử dụng Component với các tùy chọn nâng cao

```tsx
import React, { useRef, useState } from "react";
import { TurnstileComponent, TurnstileComponentRef } from "@thind9xdev/react-turnstile";

const AdvancedComponentExample = () => {
  const turnstileRef = useRef<TurnstileComponentRef>(null);
  const [status, setStatus] = useState<string>("");
  const siteKey = "YOUR_SITE_KEY";

  const handleSuccess = (token: string) => {
    setStatus(`Xác thực thành công! Token: ${token.substring(0, 20)}...`);
  };

  const handleError = (error?: string) => {
    setStatus(`Lỗi xác thực: ${error || "Không xác định"}`);
  };

  const handleLoad = () => {
    setStatus("Turnstile đã được tải");
  };

  return (
    <div>
      <h3>Component với callback handlers</h3>
      
      <TurnstileComponent
        ref={turnstileRef}
        siteKey={siteKey}
        theme="dark"
        size="compact"
        language="vi"
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

## 🔍 Chế độ ẩn (Invisible Mode)

### Sử dụng chế độ ẩn với Hook

```tsx
import React, { useState } from "react";
import { useTurnstile } from "@thind9xdev/react-turnstile";

const InvisibleTurnstile = () => {
  const [email, setEmail] = useState("");
  const siteKey = "YOUR_SITE_KEY";
  
  const { ref, token, error, isLoading, execute } = useTurnstile(siteKey, {
    appearance: "execute",  // Chế độ ẩn
    execution: "execute",
    theme: "light"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      // Thực thi xác thực Turnstile
      console.log("Đang xác thực...");
      execute();
      return;
    }

    // Gửi form với token
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token })
      });
      
      if (response.ok) {
        console.log("Form đã được gửi thành công!");
        setEmail("");
      }
    } catch (err) {
      console.error("Lỗi gửi form:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Container ẩn cho Turnstile */}
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
        {isLoading ? "Đang xác thực..." : "Đăng ký"}
      </button>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default InvisibleTurnstile;
```

## 📚 Tài liệu API

### `useTurnstile(siteKey, options?)`

#### Tham số:
- `siteKey` (string): Site key của Cloudflare Turnstile
- `options` (TurnstileOptions, tùy chọn): Các tùy chọn cấu hình

#### Tùy chọn (TurnstileOptions):
- `theme` ('light' | 'dark' | 'auto'): Chế độ hiển thị (mặc định: 'auto')
- `size` ('normal' | 'compact'): Kích thước widget (mặc định: 'normal')
- `language` (string): Mã ngôn ngữ (mặc định: 'auto')
- `retry` ('auto' | 'never'): Hành vi thử lại (mặc định: 'auto')
- `retry-interval` (number): Khoảng thời gian thử lại (milliseconds)
- `refresh-expired` ('auto' | 'manual' | 'never'): Hành vi làm mới token hết hạn (mặc định: 'auto')
- `appearance` ('always' | 'execute' | 'interaction-only'): Khi nào hiển thị widget (mặc định: 'always')
- `execution` ('render' | 'execute'): Chế độ thực thi (mặc định: 'render')
- `onLoad` (function): Callback khi widget được tải
- `onSuccess` (function): Callback khi xác thực thành công
- `onError` (function): Callback khi có lỗi
- `onExpire` (function): Callback khi token hết hạn
- `onTimeout` (function): Callback khi timeout

#### Trả về:
- `ref` (React.RefObject): Ref để gắn vào container div
- `token` (string | null): Token Turnstile
- `error` (string | null): Thông báo lỗi nếu có
- `isLoading` (boolean): Trạng thái đang tải
- `reset` (function): Hàm reset widget
- `execute` (function): Hàm thực thi Turnstile thủ công (cho chế độ ẩn)
- `getResponse` (function): Hàm lấy token hiện tại
- `widgetId` (string | null): ID widget được trả về bởi Turnstile

### `TurnstileComponent`

#### Props:
- `siteKey` (string): Site key của Cloudflare Turnstile
- `className` (string, tùy chọn): CSS class cho container
- `style` (React.CSSProperties, tùy chọn): Inline styles cho container
- Tất cả các tùy chọn từ `TurnstileOptions`

#### Ref Methods:
- `reset()`: Reset widget về trạng thái ban đầu
- `execute()`: Thực thi xác thực thủ công
- `getResponse()`: Lấy token hiện tại

## 🎨 Hỗ trợ TypeScript

Thư viện này bao gồm hỗ trợ TypeScript đầy đủ với các interface được export:

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

## 🎭 Giao diện và Chế độ hiển thị

### Chế độ giao diện (Themes)
- `light`: Giao diện sáng
- `dark`: Giao diện tối  
- `auto`: Tự động theo cài đặt hệ thống người dùng

### Kích thước (Sizes)
- `normal`: Widget kích thước tiêu chuẩn
- `compact`: Widget kích thước nhỏ gọn

### Chế độ hiển thị (Appearance Modes)
- `always`: Widget luôn hiển thị (mặc định)
- `execute`: Chế độ ẩn - widget chỉ xuất hiện khi thực thi
- `interaction-only`: Widget chỉ xuất hiện khi cần tương tác với người dùng

## ✨ Tính năng

- ✅ React hook hiện đại và sạch sẽ
- ✅ Hỗ trợ TypeScript đầy đủ
- ✅ Tự động tải script và dọn dẹp
- ✅ Xử lý lỗi
- ✅ Trạng thái loading  
- ✅ Làm mới và reset token thủ công
- ✅ Hỗ trợ chế độ ẩn
- ✅ Tùy chỉnh giao diện và kích thước
- ✅ Hỗ trợ đa ngôn ngữ
- ✅ Quản lý vòng đời widget toàn diện
- ✅ Không phụ thuộc (peer dependency: React >=16.8.0)

## 🔧 Lấy Site Key của bạn

1. Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Điều hướng đến "Turnstile"
3. Tạo một site mới
4. Sao chép **Site Key** và **Secret Key** của bạn

### Site Key dành cho test
Để test, bạn có thể sử dụng: `1x00000000000000000000AA`

## 🔧 Tích hợp Backend

### Xác thực token Turnstile với Node.js/Express:

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TURNSTILE_SECRET_KEY = 'YOUR_SECRET_KEY'; // Thay bằng secret key thực của bạn

app.post('/verify-turnstile', async (req, res) => {
  const { token, remoteip } = req.body;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: 'Thiếu token' 
    });
  }

  try {
    const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: remoteip // tùy chọn
    });

    const { success, error_codes } = response.data;

    if (success) {
      res.json({ 
        success: true, 
        message: 'Xác thực thành công' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Xác thực thất bại',
        error_codes 
      });
    }
  } catch (error) {
    console.error('Lỗi xác thực Turnstile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ nội bộ' 
    });
  }
});

app.listen(3000, () => {
  console.log('Server đang chạy trên port 3000');
});
```

### Xác thực token Turnstile với NestJS:

#### Tạo TurnstileGuard:
```bash
nest generate guard turnstile
```

#### Thêm code cho guard:
```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';

@Injectable()
export class TurnstileGuard implements CanActivate {
  private readonly secretKey = 'YOUR_SECRET_KEY'; // Thay bằng secret key thực

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const turnstileToken = request.body.token;
    
    if (!turnstileToken) {
      throw new UnauthorizedException('Thiếu token Turnstile');
    }

    try {
      const response = await axios.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          secret: this.secretKey,
          response: turnstileToken,
          remoteip: request.ip
        }
      );

      const { success, error_codes } = response.data;

      if (!success) {
        throw new UnauthorizedException({
          message: 'Token Turnstile không hợp lệ',
          error_codes 
        });
      }

      return true;
    } catch (error) {
      console.error('Lỗi xác thực Turnstile:', error);
      throw new UnauthorizedException('Xác thực Turnstile thất bại');
    }
  }
}
```

#### Sử dụng Guard trong Controller:
```typescript
import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { TurnstileGuard } from './turnstile.guard';

@Controller('api')
export class AppController {
  @Post('submit')
  @UseGuards(TurnstileGuard)
  submitForm(@Body() body: any) {
    // Logic xử lý form sau khi đã xác thực Turnstile
    return { message: 'Form đã được gửi thành công!' };
  }
}
```

### Xác thức với PHP (Laravel):

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TurnstileController extends Controller
{
    public function verify(Request $request)
    {
        $token = $request->input('token');
        $secretKey = env('TURNSTILE_SECRET_KEY'); // Thêm vào .env

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Thiếu token'
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
                'message' => 'Xác thực thành công'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Xác thực thất bại',
                'error_codes' => $result['error_codes'] ?? []
            ], 400);
        }
    }
}
```

## 🚀 Bắt đầu với Cloudflare Turnstile

1. **Đăng ký Cloudflare**: Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Điều hướng đến Turnstile**: Vào "Turnstile" trong sidebar
3. **Tạo Site**: Click "Add Site" và cấu hình domain của bạn
4. **Lấy keys**: Sao chép Site Key và Secret Key của bạn
5. **Cấu hình site**: Thiết lập domain được phép và các cài đặt khác

## ⚠️ Xử lý lỗi

Các mã lỗi phổ biến và ý nghĩa:

- `missing-input-secret`: Thiếu tham số secret
- `invalid-input-secret`: Tham số secret không hợp lệ hoặc sai định dạng
- `missing-input-response`: Thiếu tham số response
- `invalid-input-response`: Tham số response không hợp lệ hoặc sai định dạng
- `bad-request`: Request không hợp lệ hoặc sai định dạng
- `timeout-or-duplicate`: Tham số response đã được xác thực trước đó

### Ví dụ xử lý lỗi:

```tsx
import { useTurnstile } from "@thind9xdev/react-turnstile";

const ErrorHandlingExample = () => {
  const { ref, token, error, isLoading, reset } = useTurnstile("YOUR_SITE_KEY");

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'timeout-or-duplicate':
        return 'Token đã được sử dụng hoặc hết thời gian. Vui lòng thử lại.';
      case 'invalid-input-response':
        return 'Phản hồi không hợp lệ. Vui lòng làm mới trang.';
      default:
        return `Lỗi xác thực: ${error}`;
    }
  };

  return (
    <div>
      <div ref={ref}></div>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <p>{getErrorMessage(error)}</p>
          <button onClick={reset}>Thử lại</button>
        </div>
      )}
      {token && <p style={{ color: 'green' }}>✅ Xác thực thành công!</p>}
    </div>
  );
};
```

## 🌐 Hỗ trợ trình duyệt

Cloudflare Turnstile hoạt động trên tất cả trình duyệt hiện đại hỗ trợ:
- ES6 Promises
- Fetch API hoặc XMLHttpRequest
- Các tính năng JavaScript hiện đại

## 🔄 Migration từ reCAPTCHA

Nếu bạn đang migration từ Google reCAPTCHA, những khác biệt chính là:

1. **Script URL**: Sử dụng CDN của Cloudflare thay vì Google
2. **API Methods**: Tên method và tham số khác nhau
3. **Verification endpoint**: Sử dụng API xác thực của Cloudflare
4. **Tùy chọn cấu hình**: Các option theme và customization khác
5. **Privacy**: Bảo vệ quyền riêng tư tốt hơn vì Cloudflare không track users

### Bảng so sánh:

| reCAPTCHA | Turnstile |
|-----------|-----------|
| `grecaptcha.render()` | `turnstile.render()` |
| `grecaptcha.reset()` | `turnstile.reset()` |
| `grecaptcha.getResponse()` | `turnstile.getResponse()` |
| Google CDN | Cloudflare CDN |
| Tracks users | Privacy-focused |

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng tạo Pull Request.

## 📄 License

Dự án này được cấp phép theo MIT License.

## 👨‍💻 Tác giả

Copyright 2024 thind9xdev

## 🔗 Liên kết

- [Tài liệu Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [GitHub Repository](https://github.com/thind9xdev/react-turnstile)
- [NPM Package](https://www.npmjs.com/package/@thind9xdev/react-turnstile)
- [Hướng dẫn nhanh](./QUICK_START.md)