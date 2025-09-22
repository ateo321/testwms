# 🏪 Warehouse Management System (WMS)

A modern, full-stack warehouse management system built with Next.js, Node.js, and PostgreSQL.

## ✨ Features

- **User Management**: Complete user CRUD operations with role-based access
- **Inventory Management**: Track products, stock levels, and warehouse locations
- **Order Management**: Process orders with status tracking and priority management
- **Warehouse Management**: Manage warehouses, zones, and storage locations
- **Reports & Analytics**: Comprehensive reporting with charts and data visualization
- **Real-time Data**: Live updates and real-time statistics
- **Responsive Design**: Glassmorphism UI that works on all devices
- **Authentication**: Secure JWT-based authentication system

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Recharts** - Data visualization
- **Glassmorphism Design** - Modern UI/UX

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **JWT** - Authentication

### Database
- **PostgreSQL** - Primary database
- **Prisma Migrations** - Database schema management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wms.git
   cd wms
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   **Backend (.env)**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/wms"
   JWT_SECRET="your-super-secret-jwt-key"
   NODE_ENV="development"
   PORT=5001
   ```
   
   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5001/api"
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development servers**
   
   **Backend (Terminal 1)**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api
   - Health Check: http://localhost:5001/api/health

## 👤 Default Login

- **Email**: admin@wms.com
- **Password**: password123

## 📁 Project Structure

```
wms/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── scripts/            # Database scripts
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── theme.ts       # MUI theme
│   └── public/            # Static assets
└── README.md
```

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Option 1: Vercel + Railway (Recommended)
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway
- **Database**: Use Railway PostgreSQL

### Option 2: VPS Deployment
- Use DigitalOcean, Linode, or AWS EC2
- Set up Nginx reverse proxy
- Use PM2 for process management

### Option 3: Docker
- Use Docker Compose for local development
- Deploy containers to any cloud provider

## 📊 Features Overview

### Dashboard
- Real-time statistics and metrics
- Quick access to all modules
- Glassmorphism design

### User Management
- Create, read, update, delete users
- Role-based access control (Admin, Manager, Supervisor, Employee)
- User activity tracking

### Inventory Management
- Product catalog management
- Stock level tracking
- Low stock alerts
- Warehouse location management

### Order Management
- Order creation and processing
- Status tracking (Pending, Processing, Shipped, Delivered)
- Priority management
- Customer information

### Reports & Analytics
- Revenue trends
- Order status distribution
- Top selling products
- Warehouse performance metrics
- CSV export functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Material-UI for the component library
- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- All contributors and testers

---

**Built with ❤️ for modern warehouse management**