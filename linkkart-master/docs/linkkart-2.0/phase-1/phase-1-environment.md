# Phase 1 Environment Configuration

## Local Setup
A new `docker-compose.yml` has been provided at the root of the project.

**To start locally:**
1. Copy `linkkart-backend/.env.example` to `linkkart-backend/.env` and fill out the values.
2. Run `docker-compose up --build`.

This spins up:
- MySQL 8.0 on port 3306.
- LinkKart Backend on port 8080.
- LinkKart Frontend on port 3000.

## Required Environment Variables
The application now requires the following environment variables to boot safely:
- `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- `JWT_SECRET`, `IP_HASH_SALT`
- `GEMINI_API_KEY`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`
