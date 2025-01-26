# Pulsifi Angular Application

A modern Angular-based employee management system that enables organizations to efficiently manage their workforce, roles, and permissions.

## Live Demo

Visit the live application at [https://pulsifi-assessment-54494.web.app/](https://pulsifi-assessment-54494.web.app/)

**Note:** On first access, the backend JSON server needs to wake up from sleep mode, which takes approximately 50 seconds. Please be patient during this initial load.

### Test Credentials

You can use these credentials to test different user roles:

**Admin Access**
- Email: admin@example.com
- Password: admin123

**Manager Access**
- Email: manager@example.com
- Password: manager123

**Employee Access**
- Email: employee@example.com
- Password: employee123

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

# Start mock server (terminal 1)
npm run mock:server

# Start development server (terminal 2)
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload on source file changes.

### Building for Production
```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## Deployment

- [Firebase Deployment Guide](docs/FIREBASE_DEPLOYMENT.md) - Frontend application deployment
- [Render Deployment Guide](docs/RENDER_DEPLOYMENT.md) - JSON Server API deployment

## Additional Resources

For more information on using Angular CLI, see the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
