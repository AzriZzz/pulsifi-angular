# Deploying JSON Server to Render

This guide will walk you through the process of deploying your JSON Server to Render and integrating it with your Angular application.

## Prerequisites

- A GitHub account
- Your JSON Server repository (https://github.com/AzriZzz/JSON-SERVER)
- A Render account (https://render.com)

## Steps to Deploy

### 1. Repository Configuration

1. Your `package.json` configuration:

```json
{
  "name": "mock-pulsifi-json-server",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "keywords": [],
  "author": "Muhammad Azri",
  "license": "ISC",
  "dependencies": {
    "json-server": "^0.16.2"
  }
}
```

2. Your `server.js` configuration:

```javascript
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
 
server.use(middlewares)
server.use('/api', router)
server.listen(process.env.PORT || 5001, () => {
  console.log('JSON Server is running')
})
```

Note: Your server is configured to serve the API under the `/api` path prefix.

### 2. Deploy to Render

1. Log in to [Render](https://render.com)
2. Click on "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the following settings:
   - **Name**: `mock-pulsifi-json-server` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Click "Create Web Service"

### 3. Update Angular Environment

1. Update your Angular environment files to use the Render URL:

In `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api' // Note the /api suffix
  mockDelay: 500, // Simulated network delay
};
```

In `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://mock-pulsifi-json-server.onrender.com/api', // Example: https://mock-pulsifi-json-server.onrender.com/api
  mockDelay: 0, // No artificial delay in production
};
```

## Testing the Deployment

1. Wait for Render to complete the deployment (this may take a few minutes)
2. Test your API endpoints using the Render URL:
   ```
   https://mock-pulsifi-json-server.onrender.com/api/employees
   https://mock-pulsifi-json-server.onrender.com/api/roles
   https://mock-pulsifi-json-server.onrender.com/api/permissions
   https://mock-pulsifi-json-server.onrender.com/api/users
   https://mock-pulsifi-json-server.onrender.com/api/validation
   ```
   Note: Remember to include the `/api` prefix in all your endpoint URLs

## Common Issues and Solutions

1. **404 Errors**: Make sure you're including the `/api` prefix in all your API requests
2. **Deployment Failures**: Check Render logs for detailed error messages
3. **Slow Initial Response**: Free tier services may have cold starts, first request might be slow

## Maintaining Your Deployment

1. Any changes pushed to main branch need to be manually deployed on Render dashboard
2. Monitor your service's health in the Render dashboard
3. Check logs regularly for any issues

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [JSON Server Documentation](https://github.com/typicode/json-server)
- [JSON Server on GitHub](https://github.com/typicode/json-server) 