# Medical Response System

## Prerequisites
- Node.js & npm (for frontend)
- Java 17+ & Maven (for backend)
- MySQL Database

## How to Run

### 1. Database
Ensure your MySQL server is running. The backend will automatically create the database `medical_response_db` if it doesn't exist.
*Note: Default credentials are `root` with no password. Update `src/main/resources/application.properties` if yours differ.*

### 2. Backend (Spring Boot)
Open a new terminal:
```bash
cd medical-response-backend
mvn spring-boot:run
```
The server will start on `http://localhost:8080`.

### 3. Frontend (React)
Open a terminal (or usage exiting one):
```bash
cd MedicalResponseApp
npm run dev
```
Open the provided URL (usually `http://localhost:5173`).

## Usage
1. Open the frontend in your browser.
2. Grant location permissions if asked.
3. Click "Emergency" to report an incident.
4. Select the nature of emergency and confirm.
5. The request will be sent to the backend and saved in the database.

## Viewing the Data
Since you are using MySQL, you can view the stored data using:

### Option 1: Command Line
1. Open terminal: `mysql -u root -p`
2. Enter password (empty by default).
3. Run:
   ```sql
   use medical_response_db;
   select * from emergency_request;
   ```

### Option 2: GUI Tools
Use standard tools like **MySQL Workbench**, **DBeaver**, or **VS Code Database Client**.
- Connect to `localhost:3306`.
- Open `medical_response_db`.
- View table `emergency_request`.
