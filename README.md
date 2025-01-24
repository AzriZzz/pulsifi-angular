# Pulsifi Angular Application

A modern Angular-based employee management system that enables organizations to efficiently manage their workforce, roles, and permissions.

## Features

- **Employee Management**
  - Create, view, edit, and delete employee profiles
  - Multi-step employee onboarding wizard
  - Personal information management
  - Role assignment

- **Role-Based Access Control**
  - Dynamic role management
  - Permission-based authorization
  - Granular access control

- **Dashboard**
  - Overview of key metrics
  - Employee statistics
  - Role distribution

## Technical Stack

- **Frontend**: Angular 19.0.6
- **Backend**: JSON Server (Mock API)
- **Hosting**: Firebase
- **API Hosting**: Render

## Development

### Prerequisites
- Node.js
- Angular CLI (`npm install -g @angular/cli`)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload on source file changes.

### Building for Production
```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Deployment

- [Firebase Deployment Guide](FIREBASE_DEPLOYMENT.md) - Frontend application deployment
- [Render Deployment Guide](RENDER_DEPLOYMENT.md) - JSON Server API deployment

## Additional Resources

For more information on using Angular CLI, see the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
