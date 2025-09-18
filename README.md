# Knowledge Graph Backend API

## Overview

This is the backend API server for the Knowledge Graph application, built with **Node.js**, **Express**, and **MongoDB**. It provides RESTful endpoints for managing graph nodes and edges with full CRUD operations, search functionality, and data persistence.

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS
- **Development**: Nodemon, ts-node
- **Logging**: Morgan

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── controllers/        # Request handlers
│   │   └── graphController.ts
│   ├── models/             # MongoDB schemas
│   │   ├── NodeModel.ts
│   │   └── EdgeModel.ts
│   ├── routes/             # API route definitions
│   │   ├── graph.ts
│   │   └── search.ts
│   └── db/                 # Database connection
│       └── index.ts
├── seed/                   # Database seeding
│   └── seedGraph.ts
├── package.json
└── tsconfig.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas cloud database)
- npm or yarn

### Installation

1. **Clone this repository:**
   ```bash
   git clone https://github.com/devsaad05858/Knowledge-Graph-Backend.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   
   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
   
   Add the following configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/graphdb
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/graphdb
   
   # Server
   PORT=3001
   NODE_ENV=development
   
   # CORS (for production)
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Start MongoDB:**
   
   **Option A: Local MongoDB**
   ```bash
   # Start MongoDB service (varies by OS)
   # macOS with Homebrew:
   brew services start mongodb-community
   
   # Linux:
   sudo systemctl start mongod
   
   # Windows:
   net start MongoDB
   ```
   
   **Option B: MongoDB Atlas**
   - Create a free cluster at https://cloud.mongodb.com
   - Get your connection string and update `MONGODB_URI` in `.env`

5. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

### Production Build

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### Graph Data
- `GET /api/graph` - Get entire graph (nodes + edges)

### Node Operations
- `POST /api/nodes` - Create new node
- `PUT /api/nodes/:id` - Update node
- `DELETE /api/nodes/:id` - Delete node (and connected edges)

### Edge Operations
- `POST /api/edges` - Create new edge
- `PUT /api/edges/:id` - Update edge
- `DELETE /api/edges/:id` - Delete edge

### Search
- `GET /api/search?q=query` - Search nodes by label/type

### Health Check
- `GET /health` - Server health status

## 📊 Database Schema

### Node Schema
```typescript
{
  _id: ObjectId,
  label: string,          // Display name
  type: string,           // Node category
  properties: object,     // Custom properties
  x: number,             // X position
  y: number,             // Y position
  fx?: number,           // Fixed X (for pinning)
  fy?: number,           // Fixed Y (for pinning)
  createdAt: Date,
  updatedAt: Date
}
```

### Edge Schema
```typescript
{
  _id: ObjectId,
  source: ObjectId,       // Source node ID
  target: ObjectId,       // Target node ID
  label: string,          // Relationship label
  properties: object,     // Custom properties
  directed: boolean,      // Arrow direction
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 Features

- **Graph Management**: Full CRUD operations for nodes and edges
- **Search**: Text-based search on node labels and types
- **Data Validation**: Input sanitization and validation
- **Transaction Safety**: Atomic operations for data consistency
- **Indexing**: Optimized database queries with proper indexing
- **Error Handling**: Comprehensive error responses
- **CORS**: Configurable cross-origin resource sharing
- **Security**: Helmet middleware for security headers

## 🗃️ Sample Data

The seed script creates a technology stack knowledge graph with 14 nodes and 16 relationships, including:

- **Frontend**: React, TypeScript, Tailwind CSS, D3.js
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Tools**: Vite, Neo4j, MongoDB Atlas
- **Concepts**: REST API, Graph Database, Force Graph

## 🔧 Development Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Production server
npm start

# Seed database
npm run seed
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- **Local MongoDB**: Ensure MongoDB service is running
- **MongoDB Atlas**: Verify connection string and network access
- **Firewall**: Check if port 27017 is accessible (for local)
- **Authentication**: Verify username/password for Atlas

### Port Already in Use
- Change `PORT` in `.env` file
- Kill existing process: `lsof -ti:3001 | xargs kill -9`

### Seeding Fails
- Ensure MongoDB connection is established
- Check database permissions
- Verify `.env` configuration
- Clear existing data: `npm run seed -- --force`

### CORS Issues
- Update `ALLOWED_ORIGINS` in `.env` for your frontend URL
- Ensure frontend is running on expected port

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/graphdb` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins | Local development URLs |

## 🔐 Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin policies
- **Input Validation**: Request data sanitization
- **MongoDB Injection Protection**: Mongoose built-in protections
- **Error Handling**: No sensitive data in error responses

## 📈 Performance Optimizations

- **Database Indexing**: Text search and relationship queries
- **Lean Queries**: Optimized data fetching
- **Connection Pooling**: MongoDB connection management
- **Request Logging**: Morgan middleware for monitoring

## 🚀 Deployment

This backend is deployed on Heroku and accessible at:
**https://knowledge-graph-backend-app-0dd39e8bfcd4.herokuapp.com/**

### Live API Endpoints
- Health Check: https://knowledge-graph-backend-app-0dd39e8bfcd4.herokuapp.com/health
- Graph Data: https://knowledge-graph-backend-app-0dd39e8bfcd4.herokuapp.com/api/graph
- Search: https://knowledge-graph-backend-app-0dd39e8bfcd4.herokuapp.com/api/search?q=query

### Frontend Integration
The deployed backend is configured to accept requests from:
- **Frontend URL**: https://frontend-dun-one-70.vercel.app/
- Local development URLs (localhost:3000, localhost:5173)

### Database Setup (MongoDB Atlas Required)
The deployed backend requires a MongoDB Atlas database. To set it up:

1. Create a free MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster (M0 Sandbox - Free tier)
3. Create a database user with read/write permissions
4. Get your connection string (replace `<username>` and `<password>`)
5. Set the environment variable on Heroku:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/graphdb" --app knowledge-graph-backend-app
   ```

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/graphdb
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://frontend-dun-one-70.vercel.app
```

### Deployment Options

#### Option 1: Traditional Server
```bash
# Install PM2 for process management
npm install -g pm2

# Build the project
npm run build

# Start with PM2
pm2 start dist/server.js --name "graph-api"
```

#### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

#### Option 3: Serverless
- Deploy to Vercel Functions, Netlify Functions, or AWS Lambda
- Use MongoDB Atlas for database
- Configure environment variables in platform settings

## 🔗 Frontend Integration

This backend is designed to work with the Knowledge Graph frontend. The frontend should:

- Set `VITE_API_BASE_URL` to point to this backend
- Handle the JSON response format from all endpoints
- Implement proper error handling for API failures
- Use the provided search endpoint for real-time search

See the frontend repository for implementation details. 