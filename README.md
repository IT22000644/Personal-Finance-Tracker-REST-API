[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)

# 🚀 Personal Finance Tracker REST API - IT22000644

*A powerful and easy-to-use API for managing expenses, tracking income, and gaining insights into your financial health.* 💰📊  



## 📌 Prerequisites  

Ensure you have the following installed before proceeding:  

- [Node.js](https://nodejs.org/) (Recommended: latest LTS version)  
- [npm](https://www.npmjs.com/) (Included with Node.js)  
- [Docker](https://www.docker.com/) (If running in a containerized environment) 

## 📘 Documentation

Full API Documentation available [in here.](https://documenter.getpostman.com/view/23289550/2sAYk8tMpx "View API Documentation")


---

## ⚙️ Setup  

### 🔹 Local Environment  

Follow these steps to set up and run the project locally:  

1. Copy the sample environment file and configure it:  
   ```sh
   cp .env.sample .env
2. Open the .env file and set the following:
    ```sh
    ENVIRONMENT=local
    ENVIRONMENT=local
    DB_URL=your_database_connection_string
    CURRENCY_EXCHANGE_API=your_api_key_from_exchangerate-api
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
3. Install project dependencies:
   ```sh
   npm install
4. Start the application:
   ```sh
   npm start
5. The API will be available at:
   `http:/localhost:8080`

### 🐳 Running with Docker

To run the project inside a Docker container:

1. Copy the sample environment file and configure it:
    ```bash
    cp .env.sample .env
    ```
2. Open the .env file and set the following
    ```bash
    ENVIRONMENT=docker
    CURRENCY_EXCHANGE_API=your_api_key_from_exchangerate-api
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    ```
3. Build and start the container
   ```bash
   docker compose up -d
   ```
5. The API will be available at:
   `http:/localhost:8080`

---

### 🔑 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication and authorization.  

#### Obtaining a Token  
To access protected endpoints, you need to obtain a JWT by logging in with valid credentials:  

**Endpoint:**  
```http
POST /api/auth/login
```

---

### 🧪 Running Tests

Run the test suite using:
```bash
npm test
```

---

### 📂 Project Structure

    project-root/
    ├── src/
    │   ├── app.js
    │   ├── models/
    │   │   ├── user.model.js
    │   │   ├── transaction.model.js
    │   │   ├── category.model.js
    │   │   ├── budget.model.js
    │   │   └── goal.model.js
    │   ├── services/
    │   │   ├── user.services.js
    │   │   ├── transaction.service.js
    │   │   ├── category.service.js
    │   │   ├── budget.service.js
    │   │   └── goal.service.js
    │   ├── controllers/
    │   │   ├── user.controller.js
    │   │   ├── transaction.controller.js
    │   │   ├── category.controller.js
    │   │   ├── budget.controller.js
    │   │   └── goal.controller.js
    │   ├── routes/
    │   │   ├── user.routes.js
    │   │   ├── transaction.routes.js
    │   │   ├── category.routes.js
    │   │   ├── budget.routes.js
    │   │   └── goal.routes.js
    │   └── config/
    │       ├── constants.js
    │       └── database.js
    ├── tests/
    │   ├── unit/
    │   │   ├── services/
    │   │   │   ├── userService.test.js
    │   │   │   ├── transactionService.test.js
    │   │   │   ├── categoryService.test.js
    │   │   │   ├── budgetService.test.js
    │   │   │   └── goalService.test.js
    │   │   └── controllers/
    │   │       ├── userController.test.js
    │   │       ├── transactionController.test.js
    │   │       ├── categoryController.test.js
    │   │       ├── budgetController.test.js
    │   │       └── goalController.test.js
    │   ├── integration/
    │   │   ├── user.test.js
    │   │   ├── transaction.test.js
    │   │   ├── category.test.js
    │   │   ├── budget.test.js
    │   │   └── goal.test.js
    ├── jest.config.js
    ├── jest.setup.js
    ├── package.json
    └── README.md

---

### 🎯 Additional Commands

Stop the Docker container
```bash
docker compose down
```
Run in development mode (with live reload)
```bash
npm run dev
```
---

### 📞 Contact

For any inquiries, feel free to reach out via:

Email: manilkadikkumbura17@gmail.com\
GitHub Issues: Open an issue\
Contributors: @IT22000644\