# NX NestJS Backend Assessment

This project demonstrates a backend API built using **NX Monorepo** with
**NestJS** for a technical assessment. The purpose of this backend is to provide
a modular, scalable API for managing billing records, with role-based access
control (RBAC) and custom authentication. NX helps in managing multiple services
efficiently within a single monorepo structure.

## Tech Stack

- **NestJS** – Backend framework for building efficient, scalable Node.js
  server-side applications.
- **NX Monorepo** – Advanced set of extensible dev tools for monorepos, enabling
  faster builds and integrated testing.
- **Sequelize & Sequelize-Typescript** – ORM for database interaction (MySQL).
- **MySQL2** – MySQL client for Node.js.
- **Axios** – Promise-based HTTP client for making requests.
- **class-validator / class-transformer** – For DTO validation and
  transformation.
- **Swagger** – API documentation.
- **cross-env** – Manage environment variables across platforms.

---

## API Structure

All routes are versioned under `/api/v1/billing` with the following available
endpoints:

- **POST `/api/v1/billing/`** – Create a billing record (Admin only).
- **GET `/api/v1/billing/`** – Retrieve all billing records (Supports
  pagination).
- **GET `/api/v1/billing/:id`** – Get billing record by ID.
- **PATCH `/api/v1/billing/:id`** – Update billing record by ID.
- **DELETE `/api/v1/billing/:id`** – Delete billing record by ID (Admin only).
- **POST `/api/v1/billing/login`** – Admin login endpoint (custom, non-OAuth
  based).
- **POST `/api/v1/billing/create-customer-and-product-data`** – Seed sample
  customer and product data.
- **GET `/api/v1/billing/get-customers`** – Get list of customer names and IDs.
- **GET `/api/v1/billing/get-products`** – Get list of product codes and
  details.

API uses **role-based access control (RBAC)**, where certain routes are
restricted to admin users.

---

## Setup Instructions

### Prerequisites

- **Node.js** v20.17.0
- **MySQL Database**

### Environment Variables

DB_DIALECT='mysql' DB_HOST=127.0.0.1 DB_PORT=3306 DB_NAME=local_db DB_USERNAME=
DB_PASSWORD= DB_DATABASE=zurich_sit APP_NAME=MyZurichApp APP_DESC=Zurich
Assessment APP_VERSION=v1 PORT=4000

Create a `.env.development` file in the root with the following variables
(sample structure):

1. **Clone the repository**: ===> git clone <repository-url>
2. npm install
3. Create a .env.development file.
4. Fill in your database credentials and app config as shown above. 5.**Run
   Development Server**: npm run start:billing:dev
