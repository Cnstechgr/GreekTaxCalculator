import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create test user with admin privileges
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'Δοκιμαστικός Χρήστης',
    },
  });

  console.log('Test user created:', testUser.email);

  // Create sample business with calculation data
  const sampleBusiness = await prisma.business.upsert({
    where: { id: 'sample-business-1' },
    update: {},
    create: {
      id: 'sample-business-1',
      userId: testUser.id,
      businessName: 'ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ',
      activity: 'ΕΜΠΟΡΙΟ Η/Υ',
      address: 'ΣΟΦΟΚΛΕΟΥΣ 12 ΑΘΗΝΑ',
      taxId: '134467717',
    },
  });

  console.log('Sample business created:', sampleBusiness.businessName);

  // Create individual calculation for 2025
  const calc2025 = await prisma.individualCalculation.upsert({
    where: { businessId_year: { businessId: sampleBusiness.id, year: 2025 } },
    update: {},
    create: {
      businessId: sampleBusiness.id,
      year: 2025,
      isPreviousYear: false,
      netTurnover: 57788.06,
      otherOrdinaryIncome: 0,
      inventoryChanges: 0,
      purchasesGoodsMaterials: -49496.09,
      employeeBenefits: 0,
      depreciation: 0,
      otherExpensesLosses: -11104.63,
      otherIncomeGains: 0,
      interestNet: -162.67,
      adjustments: 997.46,
      carriedForwardLosses: 0,
      deemedTaxation: 16397.92,
      businessWithholdings: 0,
      previousYearPrepayment: 1480.40,
      // Calculated results
      resultBeforeTax: -2975.33,
      adjustedResults: -1977.87,
      taxableResults: -1977.87,
      taxableIncome: 16397.92,
      taxDue: 2307.54,
      prepaymentNextYear: 1269.15,
      totalTaxDeclaration: 1674.37,
      minimumCardSpending: 4919.38,
      totalIncome: 16397.92,
      totalTaxes: 1674.37,
      netIncome: 14723.55,
    },
  });

  console.log('2025 calculation created');

  // Create individual calculation for 2024
  const calc2024 = await prisma.individualCalculation.upsert({
    where: { businessId_year: { businessId: sampleBusiness.id, year: 2024 } },
    update: {},
    create: {
      businessId: sampleBusiness.id,
      year: 2024,
      isPreviousYear: true,
      netTurnover: 69625.33,
      otherOrdinaryIncome: 3.23,
      inventoryChanges: 0,
      purchasesGoodsMaterials: -37786.57,
      employeeBenefits: 0,
      depreciation: 0,
      otherExpensesLosses: -10256.10,
      otherIncomeGains: 0,
      interestNet: -304.60,
      adjustments: 0,
      carriedForwardLosses: 0,
      deemedTaxation: 14701.11,
      businessWithholdings: 0,
      previousYearPrepayment: 1480.40,
      // Calculated results
      resultBeforeTax: 21281.29,
      adjustedResults: 21281.29,
      taxableResults: 21281.29,
      taxableIncome: 21281.29,
      taxDue: 3458.76,
      prepaymentNextYear: 1902.32,
      totalTaxDeclaration: 3880.68,
      minimumCardSpending: 6384.39,
      totalIncome: 21281.29,
      totalTaxes: 3880.68,
      netIncome: 17400.61,
    },
  });

  console.log('2024 calculation created');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
