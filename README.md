# Medical Response System

## Prerequisites
- Node.js & npm (for frontend)
- Java 17+ & Maven (for backend)
- MySQL Database

### 1. Run using Docker (Recommended for another laptop)
If you have Docker installed, simply run this from the project root:
```bash
docker-compose up --build
```
This will automatically set up the Database, Backend, and Frontend.

### 2. Manual Run
Open two terminals:
- **Backend**: `cd medical-response-backend && mvn spring-boot:run`
- **Frontend**: `cd MedicalResponseApp && npm run dev`

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
