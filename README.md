# 💰 Simple Expense Tracker

A full-stack web application for tracking personal income and expenses, built with the MERN stack (MongoDB, Express.js, React, Node.js). Features a modern, responsive UI with dark/light theme support and comprehensive expense management capabilities.

![Expense Tracker Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Expense+Tracker+Dashboard)

## ✨ Features

### 📊 Dashboard
- **Financial Overview**: Total income, expenses, and current balance cards
- **Visual Analytics**: Interactive pie chart showing expense breakdown by category
- **Quick Actions**: Easy access to add transactions and view history
- **Real-time Updates**: Dynamic calculations and statistics

### 💳 Transaction Management
- **Add Transactions**: Simple form to record income and expenses
- **Categories**: Organized categorization (Food, Transport, Shopping, Bills, etc.)
- **Transaction History**: Comprehensive list with filtering and search
- **CRUD Operations**: Create, read, update, and delete transactions

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Modern UI**: Clean, intuitive interface using shadcn/ui components
- **Loading States**: Smooth user feedback during operations

### 🔧 Technical Features
- **RESTful API**: Well-structured backend with proper error handling
- **Data Validation**: Comprehensive input validation on both frontend and backend
- **Database Optimization**: Indexed queries and aggregation pipelines
- **Error Handling**: Graceful error management with user-friendly messages

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Next.js 14** - App Router, Server Components, and optimized performance
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Recharts** - Interactive charts and data visualization
- **next-themes** - Theme management with system preference support

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling and validation
- **bcryptjs** - Password hashing and security
- **express-validator** - Input validation and sanitization

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/expense-tracker
# PORT=5000
# CLIENT_URL=http://localhost:3000

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
# In a new terminal, from the root directory
npm install

# Start the development server
npm run dev
\`\`\`

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔌 API Endpoints

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions with filtering |
| GET | `/api/transactions/:id` | Get single transaction |
| POST | `/api/transactions` | Create new transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary/stats` | Get financial summary |
| GET | `/api/transactions/summary/breakdown` | Get expense breakdown |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/users/profile/:id` | Get user profile |
| PUT | `/api/users/profile/:id` | Update user profile |

### Query Parameters (GET /api/transactions)
- `page` - Page number for pagination
- `limit` - Number of items per page
- `type` - Filter by income/expense
- `category` - Filter by category
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `search` - Search in transaction titles

## 📱 Usage

### Adding a Transaction
1. Click "Add Transaction" button on dashboard or navigation
2. Fill in the transaction details:
   - **Title**: Descriptive name for the transaction
   - **Type**: Select Income or Expense
   - **Amount**: Enter the monetary amount
   - **Category**: Choose appropriate category
   - **Date**: Select transaction date
3. Click "Save Transaction" to submit

### Viewing Transaction History
1. Navigate to "History" page
2. Use filters to narrow down results:
   - Search by transaction title
   - Filter by category or type
   - Set date ranges
3. Click delete button to remove transactions

### Theme Switching
- Click the theme toggle button in the navigation
- Choose from Light, Dark, or System preference
- Theme preference is automatically saved

## 🏗️ Project Structure

\`\`\`
expense-tracker/
├── app/                          # Next.js app directory
│   ├── add-transaction/          # Add transaction page
│   ├── history/                  # Transaction history page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Dashboard page
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui components
│   ├── expense-chart.tsx        # Chart component
│   ├── navigation.tsx           # Navigation component
│   └── theme-provider.tsx       # Theme context provider
├── server/                      # Backend application
│   ├── models/                  # Mongoose models
│   ├── routes/                  # Express routes
│   ├── middleware/              # Custom middleware
│   ├── scripts/                 # Database scripts
│   └── server.js               # Express server
└── README.md                    # Project documentation
\`\`\`

## 🔒 Environment Variables

### Backend (.env)
\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-here
\`\`\`

## 🧪 Testing

### Backend Testing
\`\`\`bash
cd server
npm test
npm run test:watch
\`\`\`

### API Testing with curl
\`\`\`bash
# Get all transactions
curl http://localhost:5000/api/transactions

# Create a new transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Coffee",
    "type": "expense",
    "amount": 4.50,
    "category": "food",
    "date": "2024-01-20"
  }'

# Get financial summary
curl http://localhost:5000/api/transactions/summary/stats
\`\`\`

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the server directory

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Deploy automatically on push

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
- [MongoDB](https://www.mongodb.com/) for the database solution

## 📞 Support

If you have any questions or run into issues, please:
1. Check the existing [Issues](https://github.com/yourusername/expense-tracker/issues)
2. Create a new issue with detailed information
3. Contact the maintainers

## 🗺️ Roadmap

- [ ] JWT Authentication implementation
- [ ] Budget tracking and alerts
- [ ] Data export (CSV/PDF)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Financial goals tracking
- [ ] Advanced analytics and reports

---

**Built with ❤️ using the MERN stack**
