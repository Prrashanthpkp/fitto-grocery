# 🛒 Fitto Grocery App

A full stack grocery web application built with **React.js** and **Spring Boot**, designed to provide a seamless online grocery shopping experience.

---

## 🚀 Features

- 🔐 **User Authentication** — Secure Login and Registration system
- 🛍️ **Product Listing** — Browse a wide range of grocery products
- 🛒 **Shopping Cart** — Add, update, and remove items from cart
- 🔍 **Search & Filter** — Easily find products by name or category
- 🛠️ **Admin Dashboard** — Manage products, users, and orders

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI Framework |
| HTML5 & CSS3 | Structure & Styling |
| JavaScript | Logic & Interactivity |
| Axios | API Calls |

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot | REST API Framework |
| Java | Programming Language |
| Spring Security | Authentication & Authorization |
| Spring Data JPA | Database ORM |
| MySQL | Relational Database |
| Maven | Build Tool |

---

## 📁 Project Structure

```
fitto-grocery/
│
├── main (branch) - Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── public/
│   └── package.json
│
└── backend (branch) - Backend
    ├── src/main/java/
    │   └── com/fitgrocery/
    │       ├── controller/
    │       ├── model/
    │       ├── repository/
    │       └── service/
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- MySQL
- Maven
- Spring Tool Suite (STS)

---

### 🖥️ Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Prrashanthpkp/fitto-grocery.git

# Go to project directory
cd fitto-grocery

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run at `http://localhost:3000`

---

### 🔧 Backend Setup

```bash
# Switch to backend branch
git checkout backend

# Open in Spring Tool Suite (STS)
# Run as Spring Boot Application
```

The backend will run at `http://localhost:8080`

---

### 🗄️ Database Setup

```sql
-- Create the database in MySQL
CREATE DATABASE fitgrocery;
```

Update `application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fitgrocery
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```
## 🙋‍♂️ Author

**Prrashanthpkp**
- GitHub: [@Prrashanthpkp](https://github.com/Prrashanthpkp)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
