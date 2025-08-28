# Courier Service API - Backend

A RESTful API for managing courier shipments built with Node.js, Express.js, Prisma ORM, and PostgreSQL.

## Features

- **JWT Authentication**: Secure user registration and login
- **User Management**: Handle user accounts and profiles
- **Shipment Management**: Create, track, and manage shipments
- **Admin Controls**: Administrative functions for shipment management
- **Database ORM**: Prisma for type-safe database operations
- **Input Validation**: Request validation and sanitization
- **CORS Support**: Cross-origin resource sharing enabled

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone and setup

```bash
git clone https://github.com/ChanmithK/courier-service-app-backend.git
cd courier-service-app-backend
```

### 2. Install dependencies

```bash
# Install production dependencies
npm install express cors bcryptjs jsonwebtoken dotenv prisma @prisma/client

# Install development dependencies
npm install -D @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/node typescript ts-node nodemon
```

### 3. Initialize TypeScript and Prisma

```bash
# Initialize TypeScript configuration
npx tsc --init

# Initialize Prisma
npx prisma init
```

### 4. Configure Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  password     String
  company_name String?
  contact_name String
  address      String
  phone_number String?
  is_admin     Boolean   @default(false)
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt
  shipments    Shipment[]

  @@map("users")
}

model Shipment {
  id                  Int      @id @default(autoincrement())
  tracking_number     String   @unique
  user_id             Int
  sender_name         String
  sender_address      String
  recipient_name      String
  recipient_address   String
  package_description String?
  package_weight      Float?
  package_dimensions  String?
  status              String
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt
  user                User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("shipments")
}
```

### 5. Environment Setup

Create `.env` file in root directory:

```bash
DATABASE_URL=postgresql://courier_user:password123@localhost:5432/courier_service
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
CLIENT_URL=http://localhost:3000
```

### 6. Database Setup

```bash
# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE courier_service;
CREATE USER courier_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE courier_service TO courier_user;
\q

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### 7. Configure package.json scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "npx prisma migrate dev",
    "db:generate": "npx prisma generate",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "npx prisma studio",
    "db:reset": "npx prisma migrate reset",
    "db:push": "npx prisma db push"
  }
}
```

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── shipmentController.ts
│   ├── models/
│   │   ├── Shipment.ts
│   │   └── User.ts
│   ├── middleware/
│   │   ├── auth.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── shipments.ts
│   ├── lib/
│   │   └── prisma.ts
│   ├── config/
│   │   └── database.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Server will run on http://localhost:4000

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Shipment Routes (Protected)

- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/track/:tracking_number` - Track specific shipment
- `GET /api/shipments/my-shipments` - Get current user's shipments
- `GET /api/shipments/all` - Get all shipments (Admin only)
- `PATCH /api/shipments/:tracking_number/status` - Update shipment status (Admin only)

## Request/Response Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "securePassword123",
  "contact_name": "John Doe",
  "company_name": "ABC Company",
  "address": "123 Business St, City, State 12345",
  "phone_number": "+1234567890"
}
```

### Create Shipment

```bash
POST /api/shipments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "sender_name": "John Doe",
  "sender_address": "123 Sender St, City, State",
  "recipient_name": "Jane Smith",
  "recipient_address": "456 Recipient Ave, City, State",
  "package_description": "Electronics",
  "package_weight": 2.5,
  "package_dimensions": "30x20x10 cm",
  "status": "Pending"
}
```

## Prisma Commands

### Database Operations

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply new migration
npx prisma migrate dev --name <migration_name>

# Reset database (development only)
npx prisma migrate reset

# Push schema changes without migration
npx prisma db push

# View database in Prisma Studio
npx prisma studio

# Check migration status
npx prisma migrate status
```

## Environment Variables

| Variable       | Description                  | Example                                    |
| -------------- | ---------------------------- | ------------------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`   | Secret key for JWT tokens    | `your-super-secret-jwt-key-here`           |
| `PORT`         | Server port number           | `4000`                                     |
| `CLIENT_URL`   | Frontend application URL     | `http://localhost:3000`                    |

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)

## Development Tools

### Prisma Studio

```bash
npx prisma studio
```

Opens a web interface to view and edit database data.

### Database Reset (Development)

```bash
npx prisma migrate reset
npx prisma migrate dev --name init
npx prisma generate
```

## Testing

### Manual Testing with cURL

```bash
# Test server health
curl http://localhost:4000/api/health

# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","contact_name":"Test User","address":"Test Address"}'
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Verify PostgreSQL is running
   - Check DATABASE_URL format and credentials
   - Ensure database exists

2. **Migration Errors**

   - Reset database: `npx prisma migrate reset`
   - Regenerate client: `npx prisma generate`

3. **TypeScript Compilation Errors**

   - Check tsconfig.json configuration
   - Ensure all dependencies are installed

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:4000 | xargs kill`

## Contributing

1. Follow TypeScript best practices
2. Use Prisma for all database operations
3. Implement proper error handling
4. Add input validation for all endpoints
5. Update this README for any new features
