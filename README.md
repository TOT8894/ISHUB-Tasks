# User & Marketplace API

A beginner-friendly REST API built with **Node.js** and **Express.js**.

This project is a small in-memory marketplace application designed to practice fundamental backend and Express.js concepts such as routing, middleware, request handling, authentication, validation, HTTP status codes, and basic API logic.

---

## Features

- User registration
- User login
- Dummy authentication middleware
- Request headers
- Request body handling
- Route parameters
- User balance management
- Deposit money
- View available marketplace items
- Sell items
- Buy items
- Input validation
- HTTP status codes
- In-memory data storage
- Automated testing

---

## Technologies

- Node.js
- Express.js
- JavaScript
- REST API
- HTTP
- JSON

---

## Project Structure

```text
Backend_assignment/
│
├── server.js
├── test.js
├── package.json
├── package-lock.json
├── node_modules/
└── README.md


```
## Complete API Workflow

```
                    USER
                     │
                     ▼
                 REGISTER
                     │
                     ▼
                   LOGIN
                     │
                     ▼
                 userId
                     │
                     ▼
          ┌─────────────────────┐
          │ Send x-user-id      │
          │ in request headers  │
          └──────────┬──────────┘
                     │
                     ▼
              Authentication
                 Middleware
                     │
                     ▼
                 req.user
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
       Deposit      Sell       Buy
          │          │          │
          └──────────┼──────────┘
                     │
                     ▼
              Update in-memory
                  data
                     │
                     ▼
                 Response
```
author: Shanbel Dires 
```
