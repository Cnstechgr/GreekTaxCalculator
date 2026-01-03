# 🧮 Greek Tax Calculator / Φορολογικός Υπολογιστής

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.7-2D3748)](https://www.prisma.io/)

A comprehensive web application for calculating Greek business taxes, supporting multiple business structures and tax scenarios.

🌐 **Live Demo:** [https://abacus.taxstop.gr](https://abacus.taxstop.gr)

## 📋 Table of Contents

- [Features](#-features)
- [Tax Scenarios](#-tax-scenarios)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **6 Tax Calculation Scenarios** - Support for various business structures and income types
- **Real-time Calculations** - Instant tax calculations with 456 validated formulas
- **Year-over-Year Comparison** - Compare current year with previous year data
- **Multi-format Export** - Export calculations to PDF, Excel, and Word formats
- **Dark/Light Theme** - Full theme support with automatic system detection
- **User Authentication** - Secure login and signup with NextAuth.js
- **Business Management** - Create, view, and delete multiple businesses
- **Database Persistence** - All data stored in PostgreSQL database

### 🌙 UI/UX Features
- Responsive design for all screen sizes
- Greek language interface throughout
- Progressive tax calculations (9% - 44%)
- Automatic deemed taxation calculations
- Solidarity contribution calculations (2.2% - 10%)
- Minimum card spending requirements
- Professional tax report generation

## 📊 Tax Scenarios

### 1. Ατομική Επιχείρηση (Individual Business)
- Progressive tax rates: 9%, 22%, 28%, 36%, 44%
- Deemed taxation with 7 lifestyle indicators
- Tax prepayment calculations (55% of tax due)
- Minimum card spending requirements

### 2. Εταιρεία (Company)
- Flat 22% corporate tax rate
- 80% prepayment rules
- Professional fee deductions
- Business withholding tax adjustments

### 3. Ατομική & Μισθωτές (Individual + Employee Income)
- Combined business and employee income
- Progressive tax on combined income
- Solidarity contribution (2.2% - 10%)
- Deemed taxation with lifestyle indicators
- Minimum card spending calculations

### 4. Ατομική + Εταιρεία (Individual + Company)
- Combined analysis of individual and company income
- Separate tax calculations for each structure
- Total tax burden comparison
- Side-by-side results display

### 5. Πίνακας Σύγκρισης (Comparison Table)
- Compare all tax scenarios side-by-side
- Net income comparison across structures
- Quick stats for each scenario
- Export individual scenarios or full comparison

### 6. Πλήρης Συνδυασμός (Full Combined)
- Navigation hub for comprehensive analysis
- Links to all related scenarios
- Usage tips and guidance

## 🛠️ Technology Stack

### Frontend
- **Next.js 14.2** - React framework with App Router
- **TypeScript 5.2** - Type-safe development
- **Tailwind CSS 3.3** - Utility-first styling
- **shadcn/ui** - Reusable component library
- **Radix UI** - Accessible component primitives
- **next-themes** - Dark/light theme support
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js 4.24** - Authentication system
- **Prisma 6.7** - ORM for database operations
- **PostgreSQL** - Primary database
- **bcryptjs** - Password hashing

### Export & Reporting
- **jsPDF** - PDF generation
- **jspdf-autotable** - Table formatting in PDFs
- **xlsx** - Excel file generation
- **docx** - Word document generation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- PostgreSQL 14+
- Yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Cnstechgr/GreekTaxCalculator.git
   cd GreekTaxCalculator
   ```

2. **Install dependencies**
   ```bash
   cd nextjs_space
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `nextjs_space` directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/greek_tax_calculator"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Run Prisma migrations
   yarn prisma generate
   yarn prisma migrate dev
   
   # Seed the database with sample data
   yarn prisma db seed
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

6. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Test Credentials

Use these credentials to log in:
- **Email:** john@doe.com
- **Password:** johndoe123

## 📁 Project Structure

```
greek_tax_calculator/
├── nextjs_space/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── business/     # Business CRUD operations
│   │   │   ├── calculation/  # Tax calculation endpoints
│   │   │   └── export/       # Export endpoints (PDF/Excel/Word)
│   │   ├── auth/             # Login/Signup pages
│   │   ├── business/         # Business management pages
│   │   ├── calculation/      # Tax calculation pages
│   │   ├── dashboard/        # Dashboard page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── auth/             # Authentication components
│   │   ├── business/         # Business components
│   │   ├── calculation/      # Calculation form components
│   │   ├── dashboard/        # Dashboard components
│   │   └── ui/               # Reusable UI components
│   ├── lib/
│   │   ├── auth-options.ts   # NextAuth configuration
│   │   ├── db.ts             # Prisma client
│   │   ├── export-utils.ts   # Export utility functions
│   │   ├── tax-calculator.ts # Tax calculation engine (456 formulas)
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── utils.ts          # Utility functions
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── public/               # Static assets
│   ├── scripts/
│   │   └── seed.ts           # Database seeding script
│   ├── types/                # TypeScript type definitions
│   └── package.json          # Dependencies
├── PROJECT_DOCUMENTATION.md  # Technical documentation
├── INSTALLATION_GUIDE.md     # Installation instructions
├── USER_MANUAL.md            # User guide (Greek)
└── README.md                 # This file
```

## 📚 Documentation

For detailed documentation, please refer to:

- **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** - Technical architecture, database schema, API endpoints, and calculation formulas
- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Detailed installation and deployment instructions
- **[USER_MANUAL.md](USER_MANUAL.md)** - User guide in Greek with step-by-step instructions

All documentation is also available in PDF format.

## 🌐 Deployment

### Production Deployment

The application is deployed at:
- **Primary:** [https://abacus.taxstop.gr](https://abacus.taxstop.gr)
- **Mirror:** [https://taxstop.abacusai.app](https://taxstop.abacusai.app)

### Deployment Options

The application can be deployed to:
- Vercel (recommended for Next.js)
- AWS (EC2, ECS, or Amplify)
- DigitalOcean
- Docker containers
- Any Node.js hosting platform

See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed deployment instructions.

## 🧪 Testing

To test the application:

1. **Run type checking**
   ```bash
   yarn tsc --noEmit
   ```

2. **Build the application**
   ```bash
   yarn build
   ```

3. **Start production server**
   ```bash
   yarn start
   ```

## 🔐 Security

- Passwords are hashed using bcryptjs
- JWT-based session management with NextAuth.js
- Environment variables for sensitive data
- Input validation on all forms
- User authorization checks on all API routes
- Database row-level security with Prisma

## 🎨 Customization

### Theme Customization

Colors can be customized in `app/globals.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more color variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... more color variables */
}
```

### Tax Formula Customization

Tax calculations can be modified in `lib/tax-calculator.ts`.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting PR
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - [Cnstech.gr](https://github.com/Cnstechgr)
- **Client** - [CNS Tech](https://github.com/Cnstechgr)

## 🙏 Acknowledgments

- Greek tax law specifications from Excel analysis
- shadcn/ui for the component library
- Radix UI for accessible primitives
- Next.js team for the amazing framework
- Prisma team for the excellent ORM

## 📞 Support

For support or questions:
- Open an issue on GitHub
- Visit [https://taxstop.gr](https://taxstop.gr)
- Email: support@taxstop.gr

## 🗺️ Roadmap

### Planned Features
- [ ] Google Analytics integration
- [ ] Google SSO authentication
- [ ] Multi-user collaboration
- [ ] Export templates customization
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Advanced reporting and analytics
- [ ] Tax planning scenarios
- [ ] Historical data analysis

---

**Made with ❤️ in Greece** | **Φτιαγμένο με ❤️ στην Ελλάδα**
