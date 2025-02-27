# E-commerce Backend API

A robust e-commerce backend API built with Node.js, Express, and Prisma with PostgreSQL.

## Technologies Used

- Node.js
- Express.js
- Prisma
- PostgreSQL
- JWT for authentication

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL installed and running
- npm or yarn package manager

## Setup and Installation

1. Clone the repository
```bash
git clone [repository-url]
cd ecommerce-backend
```

2. Install dependencies
```bash
npm install
```

3. Create .env file in the root directory with the following variables:
```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5435/ecommerce?schema=public
JWT_SECRET=your_jwt_secret
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
ecommerce-backend/
├─ .gitignore
├─ app.js
├─ config/
│  └─ env.js
├─ controllers/
│  ├─ auth.controllers.js
│  ├─ category.controllers.js
│  └─ products.controller.js
├─ eslint.config.mjs
├─ LICENSE
├─ middlewares/
│  ├─ auth.middleware.js
│  ├─ categoryAndProducts.middleware.js
│  └─ error.middleware.js
├─ package-lock.json
├─ package.json
├─ prisma/
│  ├─ migrations
│  └─ schema.prisma
├─ README.md
├─ routes/
│  ├─ auth.routes.js
│  ├─ category.routes.js
│  └─ products.routes.js
└─ utils/
   └─ db.js
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create new product (Admin)
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)

### Orders
- GET /api/orders - Get user orders
- POST /api/orders - Create new order
- GET /api/orders/:id - Get order details

### Categories
- GET /api/categories - Get all categories
- POST /api/categories - Create new category (Admin)
- PUT /api/categories/:id - Update category (Admin)
- DELETE /api/categories/:id - Delete category (Admin)



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
