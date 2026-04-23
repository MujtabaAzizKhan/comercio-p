# Comercio

A full-stack mobile commerce platform built with **React Native** and **Node.js/Express**, enabling producers and retailers to connect, manage inventory, process orders, and transact seamlessly — all from a single mobile app.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Mobile App Setup](#mobile-app-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Comercio** is a B2B/B2C mobile commerce application that bridges producers and retailers. It provides tools for inventory management, product listings with barcode support, AI-powered chatbot assistance, Stripe-integrated payments, order tracking, returns and refunds, and much more.

---

## Features

- 🔐 **Authentication** — Secure sign-up / sign-in with email OTP verification and encrypted local storage
- 👤 **Dual User Roles** — Separate flows for **Producers** and **Retailers/Distributors**
- 📦 **Inventory Management** — Add, update, and categorize products manually, via image, or by scanning barcodes (camera-powered)
- 🛒 **Cart & Checkout** — Full shopping cart with Stripe payment integration and pay-on-pickup option
- 📊 **Sales & Purchase History** — Detailed buying and selling records with receipt tracking
- 🤝 **Partner Network** — Send/accept connection requests, browse partner profiles, and manage distributor relationships
- 🔖 **Barcode Generation** — Generate and share product barcodes natively on-device
- 🤖 **AI Chatbot** — DialogFlow-powered virtual assistant for customer support
- ⭐ **Reviews** — Leave and manage product and producer reviews
- 🔄 **Returns & Refunds** — Initiate and track return requests
- 🔔 **Notifications** — In-app connection and order notifications
- 📷 **Image Uploads** — Product photos via camera or gallery, stored on Cloudinary
- 📧 **Email Support** — Contact support directly from the app via nodemailer

---

## Tech Stack

### Mobile (Frontend)

| Technology | Purpose |
|---|---|
| React Native 0.71 | Cross-platform mobile framework |
| React Navigation 6 | Stack, bottom tabs, and drawer navigation |
| Stripe React Native | Payment processing |
| Axios | HTTP client |
| Formik + Yup | Form management and validation |
| React Native Vision Camera | Barcode scanning |
| Cloudinary React Native | Image upload and management |
| React Native Encrypted Storage | Secure token storage |
| React Native Paper / RNEUI | UI component libraries |
| DialogFlow | AI chatbot integration |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Authentication |
| Bcrypt | Password hashing |
| Stripe | Payment processing |
| Nodemailer | Transactional email |
| Multer | File upload handling |
| Mindee | Receipt / document OCR |
| Google Dialogflow | Chatbot integration |
| express-validator | Request validation |

---

## Project Structure

```
comercio-p/
├── App.js                    # Root app component & navigation stack
├── app/
│   ├── api/                  # Axios client configuration
│   ├── components/           # Reusable UI components
│   ├── pages/                # Screen components
│   └── utils/                # Helpers (auth, notifications, etc.)
├── assets/                   # Static assets (fonts, images)
├── backend/
│   ├── app.js                # Express server entry point
│   ├── controllers/          # Route handler logic
│   ├── db/                   # MongoDB connection
│   ├── middleware/            # Auth and validation middleware
│   ├── model/                # Mongoose data models
│   ├── routes/               # API route definitions
│   └── utils/                # Server-side helpers
├── android/                  # Android native project
├── ios/                      # iOS native project
└── __tests__/                # Jest test suites
```

---

## Prerequisites

- **Node.js** ≥ 16
- **Yarn** or **npm**
- **React Native CLI** environment configured — see the [official setup guide](https://reactnative.dev/docs/environment-setup)
- **Android Studio** (for Android) or **Xcode** (for iOS)
- **MongoDB** instance (local or Atlas)
- **Stripe** account (for payments)
- **Cloudinary** account (for image uploads)
- **Google Cloud** project with Dialogflow enabled (for chatbot)

---

## Getting Started

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm start
# Server runs on http://localhost:8000 by default
```

### Mobile App Setup

From the project root, install dependencies:

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

#### iOS — install CocoaPods

```bash
cd ios && pod install && cd ..
```

#### Start Metro bundler

```bash
yarn start
# OR
npm start
```

#### Run on Android

```bash
yarn android
# OR
npm run android
```

#### Run on iOS

```bash
yarn ios
# OR
npm run ios
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following keys:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_APPLICATION_CREDENTIALS=path_to_dialogflow_credentials.json
```

> ⚠️ **Never commit your `.env` file or any credentials to version control.**

---

## Available Scripts

### Mobile App (root directory)

| Script | Description |
|---|---|
| `yarn start` | Start the Metro bundler |
| `yarn android` | Build and run on Android |
| `yarn ios` | Build and run on iOS |
| `yarn test` | Run Jest tests |
| `yarn lint` | Run ESLint |

### Backend (`backend/` directory)

| Script | Description |
|---|---|
| `npm start` | Start the server with nodemon (auto-restart on changes) |

---

## API Reference

All API routes are prefixed with `/api`. The following resource endpoints are available:

| Route | Description |
|---|---|
| `/api/user` | Registration, login, OTP verification, profile management |
| `/api/product` | Create, read, update, delete products |
| `/api/category` | Product category management |
| `/api/cart` | Shopping cart operations |
| `/api/payment` | Stripe payment intent creation |
| `/api/partner` | Partner connection requests and management |
| `/api/history` | Buying history and receipts |
| `/api/sellingHistory` | Selling history and receipts |
| `/api/productReview` | Product reviews |
| `/api/producerReview` | Producer reviews |
| `/api/dialogFlow` | Chatbot query handling |
| `/api/refund` | Return and refund requests |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style enforced by ESLint and Prettier (`.eslintrc.js` / `.prettierrc.js`).

---

## License

This project is private and not licensed for public distribution.
