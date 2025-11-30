# Quick Setup Guide

## Prerequisites

1. Node.js (v20 or higher)
2. MongoDB (local installation or MongoDB Atlas account)

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/handcrafted-haven
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/handcrafted-haven

MONGODB_DB=handcrafted-haven

# JWT Secret Key (generate a random string)
JWT_SECRET=your-secret-key-change-in-production-$(openssl rand -hex 32)

# Base URL (optional, defaults to localhost:3000)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Start MongoDB

**If using local MongoDB:**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

**If using MongoDB Atlas:**
- Use the connection string from your Atlas dashboard
- Update `MONGODB_URI` in `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing the Implementation

### 1. Test Authentication

1. Go to `http://localhost:3000/auth/signup`
2. Create an artisan account:
   - Name: Test Artisan
   - Email: artisan@test.com
   - Password: test123
   - Account Type: Artisan
3. Create a customer account:
   - Name: Test Customer
   - Email: customer@test.com
   - Password: test123
   - Account Type: Customer
4. Test login at `http://localhost:3000/auth/login`

### 2. Test Product Management (as Artisan)

1. Login as artisan
2. Go to `/products/manage`
3. Create a product:
   - Product name: Terracotta Tea Set
   - Price: 120
   - Category: Ceramics
   - Image URL: https://example.com/image.jpg
   - Description: Hand-crafted tea set made with traditional techniques
4. Click "Publish listing" or "Save draft"

### 3. Test Artisan Profile

1. Go to `/profiles` to see the artisan listing
2. Click on an artisan to view their profile
3. You should see their products if any are published

### 4. Test Customer Profile

1. Login as customer
2. Go to `/profiles/customer`
3. View account information
4. View orders (empty initially)
5. View reviews (empty initially)

## API Endpoints

All API endpoints are documented in `IMPLEMENTATION.md`

### Quick Test with curl

```bash
# Create a user
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "artisan"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' \
  -c cookies.txt

# Get products
curl http://localhost:3000/api/products
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check `MONGODB_URI` is correct
- Verify network connectivity for Atlas

### Authentication Issues

- Clear browser cookies
- Check JWT_SECRET is set
- Verify cookies are enabled in browser

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product CRUD operations
│   │   ├── profiles/     # Profile endpoints
│   │   └── customers/    # Customer data endpoints
│   ├── auth/             # Auth pages
│   ├── products/         # Product pages
│   ├── profiles/         # Profile pages
│   └── ...
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection & models
│   └── middleware.ts     # Route protection
```

## Next Steps

See `IMPLEMENTATION.md` for details on what's been implemented and what remains.

