# Deploying Angular Application to Firebase Hosting

## Prerequisites

- Node.js and npm installed
- Angular CLI installed globally (`npm install -g @angular/cli`)
- A Firebase account (https://firebase.google.com)
- Firebase CLI installed globally (`npm install -g firebase-tools`)

## Steps to Deploy

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click on "Add Project" or "Create Project"
3. Enter your project name (e.g., "pulsifi-angular")
4. Choose whether to enable Google Analytics (recommended)
5. Accept the Firebase terms
6. Click "Create Project"
7. Wait for project creation to complete
8. Once created, you'll be redirected to the project dashboard

Note: Keep your Project ID handy as you'll need it for deployment

### 2. Configure Bundle Size Budgets

If you encounter bundle size warnings or errors during build, you'll need to adjust the budget limits in `angular.json`. Locate the `budgets` section in your `angular.json` and update it:

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "2mb",
      "maximumError": "5mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "2kb",
      "maximumError": "4kb"
    }
  ]
}
```

For long-term maintenance, consider implementing these optimizations:
1. Enable production mode build optimizations
2. Use lazy loading for routes (which you're already doing)
3. Implement code splitting
4. Use tree-shaking
5. Compress images and assets
6. Remove unused dependencies

### 3. Build Your Angular Application

```bash
# Build the production version of your application with environment configuration
ng build --configuration=production
```

This will:
1. Create a `dist` folder containing your production-ready application
2. Replace `environment.ts` with `environment.prod.ts`
3. Enable production mode optimizations
4. Apply all production configurations from angular.json

The production build will use the following configurations from angular.json:
```json
"configurations": {
  "production": {
    "budgets": [...],
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    "outputHashing": "all"
  }
}
```

### 4. Firebase Setup

1. Login to Firebase CLI:
```bash
firebase login
```

2. Initialize Firebase in your project:
```bash
firebase init
```

During initialization:
- Select "Hosting" when prompted for features
- Choose "dist/pulsifi-angular" as your public directory
- Configure as a single-page app: "Yes"
- Don't overwrite index.html: "No"

3. This will create two files:
- `.firebaserc`: Project-specific settings
- `firebase.json`: Firebase configuration file

Example `firebase.json`:
```json
{
  "hosting": {
    "public": "dist/pulsifi-angular",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 5. Deploy to Firebase

```bash
firebase deploy
```

After successful deployment, Firebase will provide you with a hosting URL where your application is live.

### 6. Environment Configuration

Make sure your production environment (`environment.prod.ts`) is properly configured:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://mock-pulsifi-json-server.onrender.com/api',
  // Add other production environment variables here
};
```

## Continuous Deployment (Optional)

You can set up GitHub Actions for continuous deployment:

1. Create `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase Hosting
on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

## Common Issues and Solutions

1. **404 Errors**: Ensure `firebase.json` has proper rewrites configuration
2. **Build Errors**: Check if all dependencies are properly installed
3. **Deployment Failures**: Verify Firebase CLI authentication and project settings

## Maintaining Your Deployment

1. Monitor your Firebase Console for:
   - Hosting usage
   - Performance metrics
   - Error reports

2. Regular maintenance:
   - Keep dependencies updated
   - Monitor Firebase Hosting quotas
   - Review security rules regularly

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Firebase Console](https://console.firebase.google.com) 