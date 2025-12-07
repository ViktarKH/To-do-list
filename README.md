# To-Do List REST API (Node.js/Express/MongoDB)

This is the backend server for a To-Do List application, built using Node.js, the Express framework, and MongoDB for data persistence.

## Technologies Used

* **Server:** Node.js, Express
* **Database:** MongoDB (via Mongoose ORM)
* **Authentication:** JWT (JSON Web Tokens), bcryptjs
* **Configuration:** dotenv (Environment Variables)

---

## Local Setup and Installation

Follow these steps to get the API up and running on your local machine.

### 1. Clone the Repository

Open your terminal or command prompt and clone the project:

```bash
git clone [INSERT YOUR REPOSITORY ADDRESS HERE]
cd todo-list-app # Navigate into the project directory
```

### 2. Install Dependencies
Install all the necessary packages defined in package.json:

```bash
npm install
```
### 3. Configure Environment Variables (Crucial Step)
The project requires specific configuration variables for database connectivity and security. These values are highly sensitive and should never be committed to Git.

Action: Create a file named .env in the root directory of the project (where package.json is located).

You must define the following variables in your new .env file:

```bash
MONGO_URI=YOUR_ACTUAL_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_COMPLEX_SECRET_KEY_FOR_JWT
PORT=4000
```
### 4. Run the Server
Start the API server using npm:

```Example .env File Content:
node server.js
```
