# Secure Session Auth - Cyber Security Project

A secure login/register system built with Node.js, JWT and HttpOnly cookies.

## Security Features Implemented
1. **XSS Prevention:** JWT stored in HttpOnly cookie, not localStorage
2. **CSRF Prevention:** SameSite=Strict cookie policy
3. **Password Security:** bcrypt hashing
4. **Input Validation:** Email validation

## How to Run
npm install
npm start
Open http://localhost:3000

## Tech Stack
Node.js, Express, JWT, bcrypt, MongoDB (in-memory for demo)
