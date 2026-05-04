# RegFormProj - Onboarding Portal

Fullstack onboarding application built with React, TypeScript, Django REST Framework and PostgreSQL.

Live demo: https://regformproj.netlify.app

## Features

- Multi-step onboarding form
- Account creation with session-based authentication
- Login and logout flow
- CSRF-protected API requests
- Email verification with activation token
- Resume onboarding from saved progress
- Summary page with editable sections
- Responsive UI built with Material UI
- Deployed frontend and backend

## Tech stack

### Frontend

- React
- Vite
- TypeScript
- Material UI
- Formik
- Yup

### Backend

- Django
- Django REST Framework
- PostgreSQL
- Session authentication with cookies
- CSRF protection
- Resend Email API

### Deployment

- Frontend: Netlify
- Backend: Render
- Database: Neon PostgreSQL
- Emails: Resend

## Main user flow

1. User creates an account in Step 1.
2. Backend creates a Django user and onboarding session.
3. Backend logs the user in using Django session cookies.
4. Backend sends an email verification link.
5. User continues onboarding and completes profile details.
6. User completes contact details.
7. User reviews the summary and can edit selected sections.
8. User can verify the email from the activation link.
9. User can resume onboarding from the saved step after logging in again.
10. Finished onboarding changes the onboarding status to completed.

## Local setup

### Backend

```bash
cd server
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Future improvements

- Add backend tests for authentication, onboarding progress and email verification.
- Add frontend tests for form validation and user flow.
- Improve frontend UI and loading states.
- Add better error messages for failed API requests.
- Add password reset flow.
- Add user profile page after completed onboarding.
- Improve accessibility and mobile responsiveness.
