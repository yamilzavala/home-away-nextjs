# HomeAway - Full-Stack Property Rental Platform

A modern, full-stack web application for property rentals and bookings, inspired by Airbnb. Built with cutting-edge technologies to deliver a seamless experience for users searching, booking, and managing vacation properties.

## 📋 Project Overview

**HomeAway** is an educational full-stack project that demonstrates best practices in modern web development. It provides a complete platform where users can:

- **Browse** available properties with detailed information and images
- **Search** properties based on location, dates, and preferences
- **Book** properties with a secure checkout process
- **Manage** their bookings and favorite properties
- **Leave** reviews and ratings for properties
- **List** their own properties for rental

This project serves as a comprehensive learning resource for full-stack development with focus on modern tooling, type safety, and production-ready patterns.

## 🎯 Key Features

- **Property Discovery**: Browse and filter properties with advanced search capabilities
- **Booking Management**: Complete booking workflow with date selection and checkout
- **User Reviews**: Rate and review properties with detailed feedback
- **Favorites System**: Bookmark and organize favorite properties
- **User Profiles**: Manage personal information and rental history
- **Responsive Design**: Fully responsive interface that works on all devices
- **Real-time Validation**: Client and server-side form validation with Zod
- **Database Persistence**: Secure data management with Prisma ORM and Supabase

## 🛠 Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - High-quality, accessible components
- **Form Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Testing**: [Vitest](https://vitest.dev/) - Unit testing framework

### Backend
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL-based backend as a service

### Development
- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: Next.js ESLint configuration

## 📋 Prerequisites

Before running this project, ensure you have installed:

- **Node.js** 18.17 or higher
- **npm** 9 or higher
- **Git** for version control
- A **Supabase** account with a PostgreSQL database

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd home-away-nextjs-master
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database URL for Prisma
DATABASE_URL=your_database_connection_string
```

Replace the placeholder values with your actual Supabase credentials.

### 4. Setup Database

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the production application |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once and exit |

## 📁 Project Structure

```
home-away-nextjs-master/
├── app/                           # Next.js app directory
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── bookings/                 # Bookings management page
│   ├── checkout/                 # Checkout page
│   ├── favorites/                # Favorites page
│   ├── profile/                  # User profile page
│   ├── properties/               # Properties listing page
│   ├── rentals/                  # Rentals management page
│   └── reviews/                  # Reviews page
│
├── components/                    # Reusable React components
│   ├── ui/                       # shadcn/ui components
│   ├── card/                     # Card components
│   ├── form/                     # Form components
│   ├── home/                     # Home page specific components
│   ├── navbar/                   # Navigation components
│   └── properties/               # Property-related components
│
├── lib/                          # Utility functions and helpers
│   ├── prisma.ts                # Prisma client
│   └── utils.ts                 # General utilities
│
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma            # Prisma schema definition
│   └── migrations/              # Database migrations
│
├── public/                       # Static assets
│
├── .env.local                    # Environment variables (not committed)
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── next.config.js                # Next.js configuration
└── README.md                     # This file
```

## 🔐 Security Considerations

- **Environment Variables**: Never commit `.env.local` to version control
- **Database Secrets**: Use Supabase's secure credential management
- **User Authentication**: Implement proper authentication before deploying to production
- **Input Validation**: All forms are validated with Zod both client and server-side
- **API Routes**: Secure all API endpoints with proper authorization checks

## 🧪 Testing

Run the test suite:

```bash
npm test           # Watch mode
npm run test:run   # Single run
```

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
- [Supabase Guides](https://supabase.com/docs)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

Please ensure all tests pass and code follows the project's style guidelines.

## 📝 License

This project is part of an educational learning program. Check with the course provider for specific licensing terms.

## 👨‍💼 Author

Created as a full-stack learning project based on the curriculum from Janis Smilga's Full-Stack Development Course.

## 📞 Support

For questions or issues:
- Review the [Next.js documentation](https://nextjs.org/docs)
- Check [Prisma troubleshooting](https://www.prisma.io/docs/reference/error-reference)
- Consult the [shadcn/ui documentation](https://ui.shadcn.com/)

---

**Note**: This is an educational project. Before deploying to production, ensure proper security measures, authentication, payment processing, and legal compliance are implemented.
