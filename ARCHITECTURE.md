# Kodella.ai Platform Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Kodella.ai Platform                       │
│                     AI Plugin Making Platform                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│                      │         │                      │
│   Frontend (React)   │◄───────►│   Backend (Node.js)  │
│   Port: 5173         │   API   │   Port: 3001         │
│                      │         │                      │
└──────────────────────┘         └──────────┬───────────┘
                                            │
                         ┌──────────────────┼──────────────────┐
                         │                  │                  │
                    ┌────▼─────┐     ┌─────▼──────┐    ┌─────▼──────┐
                    │          │     │            │    │            │
                    │ SQLite   │     │ MegaLLM    │    │   Tebex    │
                    │ Database │     │    API     │    │  Payment   │
                    │          │     │            │    │            │
                    └──────────┘     └────────────┘    └────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Landing    │  │   Auth       │  │  Dashboard   │         │
│  │   Page       │  │  (Login/Reg) │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Create     │  │   Plugin     │  │   Tokens     │         │
│  │   Plugin     │  │   Editor     │  │   Page       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   Profile    │         Components & Context                 │
│  │   Page       │                                               │
│  └──────────────┘  ┌──────────────────────────────┐           │
│                     │  AuthContext (User State)    │           │
│                     │  API Client (Axios)          │           │
│                     │  Router (React Router)       │           │
│                     └──────────────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Express.js Server                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Middleware Layer                       │    │
│  │  • CORS                                                 │    │
│  │  • Rate Limiting                                        │    │
│  │  • Authentication (JWT)                                 │    │
│  │  • Body Parser                                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    API Routes                           │    │
│  │                                                         │    │
│  │  /api/auth/*        - Authentication                    │    │
│  │  /api/plugins/*     - Plugin Management                 │    │
│  │  /api/profile/*     - User Profile                      │    │
│  │  /api/payment/*     - Token Purchases                   │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Business Logic                         │    │
│  │                                                         │    │
│  │  • Token Management                                     │    │
│  │  • MegaLLM Integration                                  │    │
│  │  • Database Operations                                  │    │
│  │  • Payment Processing                                   │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                          SQLite Database                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                                           │
│  │     users        │                                           │
│  ├──────────────────┤                                           │
│  │ id (PK)          │───┐                                       │
│  │ email            │   │                                       │
│  │ username         │   │                                       │
│  │ password         │   │                                       │
│  │ tokens           │   │                                       │
│  │ created_at       │   │                                       │
│  └──────────────────┘   │                                       │
│                          │                                       │
│  ┌──────────────────┐   │   ┌──────────────────────┐           │
│  │    plugins       │   │   │  token_transactions  │           │
│  ├──────────────────┤   │   ├──────────────────────┤           │
│  │ id (PK)          │   └──►│ user_id (FK)         │           │
│  │ user_id (FK)     │───┐   │ plugin_id (FK)       │           │
│  │ name             │   │   │ amount               │           │
│  │ description      │   │   │ type                 │           │
│  │ code             │   │   │ description          │           │
│  │ prompt           │   │   │ created_at           │           │
│  │ status           │   │   └──────────────────────┘           │
│  │ tokens_used      │   │                                       │
│  │ created_at       │   │                                       │
│  └──────────────────┘   │                                       │
│                          │                                       │
│  ┌──────────────────┐   │                                       │
│  │ plugin_versions  │   │                                       │
│  ├──────────────────┤   │                                       │
│  │ id (PK)          │   │                                       │
│  │ plugin_id (FK)   │◄──┘                                       │
│  │ version          │                                           │
│  │ code             │                                           │
│  │ prompt           │                                           │
│  │ tokens_used      │                                           │
│  │ created_at       │                                           │
│  └──────────────────┘                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow - Plugin Creation

```
1. User Input
   ↓
2. Frontend (CreatePlugin)
   ↓ [POST /api/plugins/generate]
3. Backend Route Handler
   ↓
4. Token Validation
   ↓ (Check user has sufficient tokens)
5. MegaLLM API Call
   ↓ (Generate plugin code)
6. Token Calculation
   ↓ (Calculate cost based on I/O)
7. Token Deduction
   ↓
8. Save to Database
   ↓ (plugins table + plugin_versions)
9. Return Response
   ↓
10. Display in Editor
```

## Authentication Flow

```
Registration:
User → Frontend → Backend → Hash Password → Save to DB → Generate JWT → Return Token

Login:
User → Frontend → Backend → Verify Password → Generate JWT → Return Token

Protected Routes:
Request → JWT Middleware → Verify Token → Extract User → Continue or Reject
```

## Payment Flow (Tebex Integration)

```
1. User selects token package
   ↓
2. Frontend requests checkout session
   ↓ [POST /api/payment/create-checkout]
3. Backend creates checkout data
   ↓
4. Return Tebex checkout URL
   ↓
5. User completes payment on Tebex
   ↓
6. Tebex sends webhook
   ↓ [POST /api/payment/webhook/tebex]
7. Backend verifies signature
   ↓
8. Add tokens to user account
   ↓
9. Update transaction history
   ↓
10. User sees updated balance
```

## Token System Flow

```
┌─────────────────────────────────────────┐
│          Token Calculation              │
├─────────────────────────────────────────┤
│                                         │
│  Input Length → Input Tokens            │
│  (characters / 4)                       │
│                                         │
│  Output Length → Output Tokens          │
│  (characters / 4)                       │
│                                         │
│  Cost = (Input × 0.1) + (Output × 0.2)  │
│                                         │
└─────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Security Measures               │
├─────────────────────────────────────────┤
│                                         │
│  • JWT Authentication                   │
│  • Password Hashing (bcryptjs)          │
│  • Rate Limiting                        │
│  • CORS Protection                      │
│  • Input Validation                     │
│  • SQL Injection Prevention             │
│  • XSS Protection                       │
│  • Webhook Signature Verification       │
│                                         │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
Production Setup:

┌────────────────┐
│   CloudFlare   │  (CDN, SSL)
│   DNS & CDN    │
└────────┬───────┘
         │
┌────────▼───────┐
│   NGINX        │  (Reverse Proxy)
│   Web Server   │
└────────┬───────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ React│  │ Node │
│ Build│  │ API  │
│      │  │      │
└──────┘  └──┬───┘
             │
        ┌────▼────┐
        │ SQLite  │
        │   DB    │
        └─────────┘

External Services:
• MegaLLM API (AI Generation)
• Tebex API (Payments)
```

## Technology Stack Summary

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Custom CSS with CSS Variables

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Rate Limiting**: express-rate-limit

### External Services
- **AI**: MegaLLM API
- **Payments**: Tebex Gateway

### Development
- **Package Manager**: npm
- **Version Control**: Git
- **Hot Reload**: Nodemon (backend), Vite HMR (frontend)

## Performance Considerations

1. **Database**: SQLite is lightweight and sufficient for medium-scale deployments
2. **Caching**: Could add Redis for session and token caching
3. **CDN**: Static assets should be served via CDN in production
4. **Load Balancing**: Multiple backend instances can be deployed behind a load balancer
5. **Database Scaling**: For large scale, migrate to PostgreSQL or MySQL

## Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Redis caching layer
- [ ] PostgreSQL for production scale
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] CI/CD pipeline
- [ ] Monitoring & Analytics
- [ ] Multi-region deployment
