# Splitwise Frontend-Backend Integration Setup

This guide explains how to set up and run the complete Splitwise application with frontend-backend integration.

## Prerequisites

### Backend Requirements
- Java 17 or later
- Maven 3.6+
- PostgreSQL database

### Frontend Requirements
- Node.js 16+ 
- npm or yarn

## Backend Setup

1. **Database Setup**
   ```bash
   # Install PostgreSQL and create database
   createdb splitwise_db
   
   # Update database credentials in backend/src/main/resources/application.properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

2. **Run Backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   
   # Alternative: using Maven directly
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

3. **Verify Backend**
   - API documentation: `http://localhost:8080/swagger-ui.html`
   - Health check: `http://localhost:8080/actuator/health`

## Frontend Setup

1. **Install Dependencies**
   ```bash
   # In the root directory (where package.json is located)
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## API Integration Features

The frontend now integrates with the following backend APIs:

### Authentication
- **Register**: Create new user accounts
- **Login**: User authentication with JWT tokens

### User Management
- **Get Users**: Retrieve user information
- **User Profiles**: Display user details

### Group Management
- **Create Groups**: Add new expense sharing groups
- **Group Details**: View group information and members
- **Add Expenses**: Create and split expenses within groups

### Budget Management
- **Create Budgets**: Set spending limits by category
- **Budget Tracking**: Monitor spending against budgets
- **Budget Alerts**: Get notified when approaching or exceeding limits
- **Budget Summary**: Overview of total budgets and spending

## Usage Guide

1. **Getting Started**
   - Start both backend and frontend servers
   - Navigate to `http://localhost:5173`
   - Register a new account or login

2. **Creating Groups**
   - Go to the Groups section
   - Click "Create Group"
   - Enter group name and member emails
   - Members will need to register to join

3. **Adding Expenses**
   - Click the "Add Expense" button in the sidebar
   - Select a group and enter expense details
   - Choose split type (Equal, Exact, Percentage, or Shares)
   - Submit to record the expense

4. **Managing Budgets**
   - Navigate to the Budget section
   - Create budgets by category and time period
   - Monitor spending and get alerts for exceeded budgets

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID

### Groups
- `POST /createGroup` - Create new group
- `POST /addExpense` - Add expense to group
- `GET /expenses` - Get expenses with filters
- `GET /settleUp/{groupId}/{userId}` - Get settlement details

### Budgets
- `POST /api/budget` - Create/update budget
- `GET /api/budget/user/{userId}` - Get user budgets
- `GET /api/budget/summary/{userId}` - Get budget summary
- `GET /api/budget/exceeded/{userId}` - Get exceeded budgets
- `DELETE /api/budget/{budgetId}` - Delete budget

## Development Notes

### CORS Configuration
The backend is configured to allow CORS requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)

### JWT Authentication
- Tokens are stored in localStorage
- Automatically included in API requests
- Logout clears the token

### Error Handling
- API errors are displayed in the UI
- Network errors are handled gracefully
- Loading states provide user feedback

## Troubleshooting

### Backend Issues
- Check PostgreSQL is running
- Verify database credentials in application.properties
- Check logs for specific error messages

### Frontend Issues
- Ensure backend is running on port 8080
- Check browser console for API errors
- Verify CORS is properly configured

### Common Problems
1. **"Failed to fetch"**: Backend not running or CORS issue
2. **401 Unauthorized**: Invalid or expired JWT token
3. **404 Not Found**: Incorrect API endpoint or routing issue

## Next Steps

To extend the application:
1. Add more expense categories
2. Implement real-time notifications
3. Add expense attachments/receipts
4. Implement group invitations via email
5. Add data visualization for spending patterns
6. Mobile responsive improvements