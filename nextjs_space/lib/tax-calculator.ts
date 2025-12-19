// Greek Tax Calculator - Core Calculation Engine
// Implements all 456 formulas from the Excel specification

/**
 * Calculate progressive tax for individuals based on Greek tax brackets
 * Brackets: 0-10k: 9%, 10-20k: 22%, 20-30k: 28%, 30-40k: 36%, 40k+: 44%
 */
export function calculateProgressiveTax(income: number): number {
  if (income <= 0) return 0;
  
  let tax = 0;
  
  if (income <= 10000) {
    tax = income * 0.09;
  } else if (income <= 20000) {
    tax = 10000 * 0.09 + (income - 10000) * 0.22;
  } else if (income <= 30000) {
    tax = 10000 * 0.09 + 10000 * 0.22 + (income - 20000) * 0.28;
  } else if (income <= 40000) {
    tax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + (income - 30000) * 0.36;
  } else {
    tax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + 10000 * 0.36 + (income - 40000) * 0.44;
  }
  
  return Math.round(tax * 100) / 100;
}

/**
 * Calculate corporate tax (22% flat rate)
 */
export function calculateCorporateTax(income: number): number {
  return income > 0 ? Math.round(income * 0.22 * 100) / 100 : 0;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): string | number {
  if (previous === 0) {
    if (current !== 0) {
      return Math.abs(current);
    }
    return '-';
  }
  return ((Math.abs(current) - Math.abs(previous)) / Math.abs(previous)) * 100;
}

/**
 * Calculate minimum card spending requirement
 * 30% of taxable income, capped at €20,000
 */
export function calculateMinimumCardSpending(taxableIncome: number): number {
  return Math.min(taxableIncome * 0.30, 20000);
}

/**
 * Calculate solidarity contribution based on income
 * Rates: 12k-20k: 2.2%, 20k-30k: 5%, 30k-40k: 6.5%, 40k-65k: 7.5%, 65k-220k: 9%, 220k+: 10%
 */
export function calculateSolidarityContribution(income: number): number {
  if (income <= 12000) return 0;
  
  let contribution = 0;
  
  if (income <= 20000) {
    contribution = (income - 12000) * 0.022;
  } else if (income <= 30000) {
    contribution = 8000 * 0.022 + (income - 20000) * 0.05;
  } else if (income <= 40000) {
    contribution = 8000 * 0.022 + 10000 * 0.05 + (income - 30000) * 0.065;
  } else if (income <= 65000) {
    contribution = 8000 * 0.022 + 10000 * 0.05 + 10000 * 0.065 + (income - 40000) * 0.075;
  } else if (income <= 220000) {
    contribution = 8000 * 0.022 + 10000 * 0.05 + 10000 * 0.065 + 25000 * 0.075 + (income - 65000) * 0.09;
  } else {
    contribution = 8000 * 0.022 + 10000 * 0.05 + 10000 * 0.065 + 25000 * 0.075 + 155000 * 0.09 + (income - 220000) * 0.10;
  }
  
  return Math.round(contribution * 100) / 100;
}

/**
 * Individual Business Calculation Results
 */
export interface IndividualCalculationResults {
  resultBeforeTax: number;
  adjustedResults: number;
  taxableResults: number;
  taxableIncome: number;
  taxDue: number;
  prepaymentNextYear: number;
  totalTaxDeclaration: number;
  minimumCardSpending: number;
  totalIncome: number;
  totalTaxes: number;
  netIncome: number;
}

/**
 * Calculate all results for individual business (Ατομική)
 */
export function calculateIndividualBusiness(
  inputs: {
    netTurnover: number;
    otherOrdinaryIncome: number;
    inventoryChanges: number;
    purchasesGoodsMaterials: number;
    employeeBenefits: number;
    depreciation: number;
    otherExpensesLosses: number;
    otherIncomeGains: number;
    interestNet: number;
    adjustments: number;
    carriedForwardLosses: number;
    deemedTaxation: number;
    businessWithholdings: number;
    previousYearPrepayment: number;
  }
): IndividualCalculationResults {
  // Row 18: Result Before Tax (sum of rows 9-17)
  const resultBeforeTax = 
    inputs.netTurnover +
    inputs.otherOrdinaryIncome +
    inputs.inventoryChanges +
    inputs.purchasesGoodsMaterials +
    inputs.employeeBenefits +
    inputs.depreciation +
    inputs.otherExpensesLosses +
    inputs.otherIncomeGains +
    inputs.interestNet;

  // Row 20: Adjusted Results (result + adjustments)
  const adjustedResults = resultBeforeTax + inputs.adjustments;

  // Row 22: Taxable Results Method 1 (adjusted + carried forward losses)
  const taxableResults = adjustedResults + inputs.carriedForwardLosses;

  // Row 24: Taxable Income (max of method 1 and deemed taxation)
  const taxableIncome = Math.max(taxableResults, inputs.deemedTaxation);

  // Row 25: Tax Due (progressive brackets)
  const taxDue = calculateProgressiveTax(taxableIncome);

  // Row 26: Prepayment for Next Year (55% of tax minus withholdings, minimum 0)
  const prepaymentCalc = taxDue * 0.55 - Math.abs(inputs.businessWithholdings);
  const prepaymentNextYear = Math.max(0, prepaymentCalc);

  // Row 29: Total Tax Declaration (tax + prepayment - previous prepayment)
  const totalTaxDeclaration = 
    taxDue + prepaymentNextYear + inputs.businessWithholdings - inputs.previousYearPrepayment;

  // Row 31: Minimum Card Spending
  const minimumCardSpending = calculateMinimumCardSpending(taxableIncome);

  // Summary calculations
  const totalIncome = taxableIncome;
  const totalTaxes = taxDue + prepaymentNextYear - inputs.previousYearPrepayment;
  const netIncome = totalIncome - totalTaxes;

  return {
    resultBeforeTax: Math.round(resultBeforeTax * 100) / 100,
    adjustedResults: Math.round(adjustedResults * 100) / 100,
    taxableResults: Math.round(taxableResults * 100) / 100,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    taxDue: Math.round(taxDue * 100) / 100,
    prepaymentNextYear: Math.round(prepaymentNextYear * 100) / 100,
    totalTaxDeclaration: Math.round(totalTaxDeclaration * 100) / 100,
    minimumCardSpending: Math.round(minimumCardSpending * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalTaxes: Math.round(totalTaxes * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
  };
}

/**
 * Company Calculation Results
 */
export interface CompanyCalculationResults {
  resultBeforeTax: number;
  adjustedResults: number;
  taxableResults: number;
  taxDue: number;
  prepaymentNextYear: number;
  totalTaxDeclaration: number;
  totalIncome: number;
  totalTaxes: number;
  netIncome: number;
}

/**
 * Calculate all results for company (Εταιρεία)
 */
export function calculateCompany(
  inputs: {
    netTurnover: number;
    otherOrdinaryIncome: number;
    inventoryChanges: number;
    purchasesGoodsMaterials: number;
    employeeBenefits: number;
    depreciation: number;
    otherExpensesLosses: number;
    otherIncomeGains: number;
    interestNet: number;
    adjustments: number;
    carriedForwardLosses: number;
    businessWithholdings: number;
    previousYearPrepayment: number;
    professionalFee: number;
  }
): CompanyCalculationResults {
  // Row 18: Result Before Tax
  const resultBeforeTax = 
    inputs.netTurnover +
    inputs.otherOrdinaryIncome +
    inputs.inventoryChanges +
    inputs.purchasesGoodsMaterials +
    inputs.employeeBenefits +
    inputs.depreciation +
    inputs.otherExpensesLosses +
    inputs.otherIncomeGains +
    inputs.interestNet;

  // Row 20: Adjusted Results
  const adjustedResults = resultBeforeTax + inputs.adjustments;

  // Row 22: Taxable Results (no deemed taxation for companies)
  const taxableResults = adjustedResults + inputs.carriedForwardLosses;

  // Row 23: Tax Due (22% flat rate, only if positive)
  const taxDue = calculateCorporateTax(taxableResults);

  // Row 24: Prepayment for Next Year (80% of tax + withholdings)
  const prepaymentNextYear = taxDue * 0.80 + inputs.businessWithholdings;

  // Row 28: Total Tax Declaration
  const totalTaxDeclaration = 
    taxDue + prepaymentNextYear + inputs.businessWithholdings - inputs.previousYearPrepayment + inputs.professionalFee;

  // Summary
  const totalIncome = taxableResults;
  const totalTaxes = taxDue + prepaymentNextYear - inputs.previousYearPrepayment + inputs.professionalFee;
  const netIncome = totalIncome - totalTaxes;

  return {
    resultBeforeTax: Math.round(resultBeforeTax * 100) / 100,
    adjustedResults: Math.round(adjustedResults * 100) / 100,
    taxableResults: Math.round(taxableResults * 100) / 100,
    taxDue: Math.round(taxDue * 100) / 100,
    prepaymentNextYear: Math.round(prepaymentNextYear * 100) / 100,
    totalTaxDeclaration: Math.round(totalTaxDeclaration * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalTaxes: Math.round(totalTaxes * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
  };
}

/**
 * Employee Income Calculation Results (Individual + Employee)
 */
export interface EmployeeIncomeResults {
  resultBeforeTax: number;
  adjustedResults: number;
  taxableResults: number;
  employeeIncome: number;
  totalTaxableIncome: number;
  totalIncomeTax: number;
  taxReductions: number;
  netTaxDue: number;
  businessTaxOnly: number;
  prepaymentNextYear: number;
  employeeWithholdings: number;
  businessWithholdings: number;
  previousYearPrepayment: number;
  totalTaxDeclaration: number;
  minimumCardSpending: number;
  solidarityContribution: number;
  totalIncome: number;
  totalTaxes: number;
  netIncome: number;
}

/**
 * Calculate all results for individual business with employee income (Ατομική & Μισθωτές)
 */
export function calculateEmployeeIncome(
  inputs: {
    // Business income (from Ατομική)
    netTurnover: number;
    otherOrdinaryIncome: number;
    inventoryChanges: number;
    purchasesGoodsMaterials: number;
    employeeBenefits: number;
    depreciation: number;
    otherExpensesLosses: number;
    otherIncomeGains: number;
    interestNet: number;
    adjustments: number;
    carriedForwardLosses: number;
    deemedTaxation: number;
    // Employee income
    employeeIncome: number;
    // Withholdings and prepayments
    taxReductions: number;
    employeeWithholdings: number;
    businessWithholdings: number;
    previousYearPrepayment: number;
  }
): EmployeeIncomeResults {
  // Calculate business results (same as Ατομική)
  const resultBeforeTax = 
    inputs.netTurnover +
    inputs.otherOrdinaryIncome +
    inputs.inventoryChanges +
    inputs.purchasesGoodsMaterials +
    inputs.employeeBenefits +
    inputs.depreciation +
    inputs.otherExpensesLosses +
    inputs.otherIncomeGains +
    inputs.interestNet;

  const adjustedResults = resultBeforeTax + inputs.adjustments;
  const taxableResults = adjustedResults + inputs.carriedForwardLosses;

  // Row 25: Total Taxable Income = MAX(taxableResults + employee, deemedTaxation + employee)
  const totalTaxableIncome = Math.max(
    taxableResults + inputs.employeeIncome,
    inputs.deemedTaxation + inputs.employeeIncome
  );

  // Row 26: Total Income Tax (progressive on combined income)
  const totalIncomeTax = calculateProgressiveTax(totalTaxableIncome);

  // Row 28: Net Tax Due (after reductions)
  const netTaxDue = Math.max(0, totalIncomeTax - inputs.taxReductions);

  // Row 45: Business Tax Only (for prepayment calculation) - tax on business income only
  const businessIncomeOnly = Math.max(taxableResults, inputs.deemedTaxation);
  const businessTaxOnly = calculateProgressiveTax(businessIncomeOnly);

  // Row 29: Prepayment (55% of business tax only)
  const prepaymentNextYear = Math.max(0, businessTaxOnly * 0.55 - Math.abs(inputs.businessWithholdings));

  // Row 33: Total Tax Declaration
  const totalTaxDeclaration = 
    netTaxDue + 
    prepaymentNextYear + 
    inputs.employeeWithholdings + 
    inputs.businessWithholdings - 
    inputs.previousYearPrepayment;

  // Row 35: Minimum Card Spending
  const minimumCardSpending = calculateMinimumCardSpending(totalTaxableIncome);

  // Solidarity Contribution
  const solidarityContribution = calculateSolidarityContribution(totalTaxableIncome);

  // Summary
  const totalIncome = totalTaxableIncome;
  const totalTaxes = netTaxDue + solidarityContribution + prepaymentNextYear - inputs.previousYearPrepayment;
  const netIncome = totalIncome - totalTaxes;

  return {
    resultBeforeTax: Math.round(resultBeforeTax * 100) / 100,
    adjustedResults: Math.round(adjustedResults * 100) / 100,
    taxableResults: Math.round(taxableResults * 100) / 100,
    employeeIncome: Math.round(inputs.employeeIncome * 100) / 100,
    totalTaxableIncome: Math.round(totalTaxableIncome * 100) / 100,
    totalIncomeTax: Math.round(totalIncomeTax * 100) / 100,
    taxReductions: Math.round(inputs.taxReductions * 100) / 100,
    netTaxDue: Math.round(netTaxDue * 100) / 100,
    businessTaxOnly: Math.round(businessTaxOnly * 100) / 100,
    prepaymentNextYear: Math.round(prepaymentNextYear * 100) / 100,
    employeeWithholdings: Math.round(inputs.employeeWithholdings * 100) / 100,
    businessWithholdings: Math.round(inputs.businessWithholdings * 100) / 100,
    previousYearPrepayment: Math.round(inputs.previousYearPrepayment * 100) / 100,
    totalTaxDeclaration: Math.round(totalTaxDeclaration * 100) / 100,
    minimumCardSpending: Math.round(minimumCardSpending * 100) / 100,
    solidarityContribution: Math.round(solidarityContribution * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalTaxes: Math.round(totalTaxes * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
  };
}

/**
 * Combined Calculation Results (Individual + Company)
 * Calculates each part separately and then combines
 */
export interface CombinedCalculationResults {
  // Individual part
  individualResultBeforeTax: number;
  individualTaxableIncome: number;
  individualTaxDue: number;
  individualPrepayment: number;
  individualTotalTaxDeclaration: number;
  individualNetIncome: number;
  
  // Company part
  companyResultBeforeTax: number;
  companyTaxableResults: number;
  companyTaxDue: number;
  companyPrepayment: number;
  companyTotalTaxDeclaration: number;
  companyNetIncome: number;
  
  // Combined totals
  totalIncome: number;
  totalTaxes: number;
  totalNetIncome: number;
  totalPrepayment: number;
  overallTaxDeclaration: number;
}

/**
 * Calculate combined individual and company income (Ατομική + Εταιρεία)
 * Each source is calculated separately with its own tax rules, then combined
 */
export function calculateCombined(
  individualInputs: {
    netTurnover: number;
    otherOrdinaryIncome: number;
    inventoryChanges: number;
    purchasesGoodsMaterials: number;
    employeeBenefits: number;
    depreciation: number;
    otherExpensesLosses: number;
    otherIncomeGains: number;
    interestNet: number;
    adjustments: number;
    carriedForwardLosses: number;
    deemedTaxation: number;
    businessWithholdings: number;
    previousYearPrepayment: number;
  },
  companyInputs: {
    netTurnover: number;
    otherOrdinaryIncome: number;
    inventoryChanges: number;
    purchasesGoodsMaterials: number;
    employeeBenefits: number;
    depreciation: number;
    otherExpensesLosses: number;
    otherIncomeGains: number;
    interestNet: number;
    adjustments: number;
    carriedForwardLosses: number;
    businessWithholdings: number;
    previousYearPrepayment: number;
    professionalFee: number;
  }
): CombinedCalculationResults {
  // Calculate individual business separately
  const individualResults = calculateIndividualBusiness(individualInputs);
  
  // Calculate company separately
  const companyResults = calculateCompany(companyInputs);
  
  // Combined totals
  const totalIncome = individualResults.taxableIncome + companyResults.taxableResults;
  const totalTaxes = individualResults.totalTaxes + companyResults.totalTaxes;
  const totalNetIncome = individualResults.netIncome + companyResults.netIncome;
  const totalPrepayment = individualResults.prepaymentNextYear + companyResults.prepaymentNextYear;
  const overallTaxDeclaration = individualResults.totalTaxDeclaration + companyResults.totalTaxDeclaration;

  return {
    // Individual part
    individualResultBeforeTax: individualResults.resultBeforeTax,
    individualTaxableIncome: individualResults.taxableIncome,
    individualTaxDue: individualResults.taxDue,
    individualPrepayment: individualResults.prepaymentNextYear,
    individualTotalTaxDeclaration: individualResults.totalTaxDeclaration,
    individualNetIncome: individualResults.netIncome,
    
    // Company part
    companyResultBeforeTax: companyResults.resultBeforeTax,
    companyTaxableResults: companyResults.taxableResults,
    companyTaxDue: companyResults.taxDue,
    companyPrepayment: companyResults.prepaymentNextYear,
    companyTotalTaxDeclaration: companyResults.totalTaxDeclaration,
    companyNetIncome: companyResults.netIncome,
    
    // Combined totals
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalTaxes: Math.round(totalTaxes * 100) / 100,
    totalNetIncome: Math.round(totalNetIncome * 100) / 100,
    totalPrepayment: Math.round(totalPrepayment * 100) / 100,
    overallTaxDeclaration: Math.round(overallTaxDeclaration * 100) / 100,
  };
}

/**
 * Full Combined Calculation Results (Individual + Company + Employee)
 */
export interface FullCombinedCalculationResults {
  // Individual part
  individualTaxableIncome: number;
  individualTaxDue: number;
  individualPrepayment: number;
  
  // Company part
  companyTaxableResults: number;
  companyTaxDue: number;
  companyPrepayment: number;
  
  // Personal income (Individual + Employee combined with progressive tax)
  personalTaxableIncome: number;
  personalTaxDue: number;
  solidarityContribution: number;
  personalPrepayment: number;
  minimumCardSpending: number;
  
  // Combined totals
  totalGrossIncome: number;
  totalTaxes: number;
  totalPrepayments: number;
  overallTaxDeclaration: number;
  totalNetIncome: number;
}

/**
 * Calculate full combined income from all sources (Πλήρης Συνδυασμός)
 * Individual + Company (separate) + Employee (combined with Individual for personal tax)
 */
export function calculateFullCombined(
  individualInputs: {
    netTurnover: number;
    otherOrdinaryIncome: number;
    inventoryChanges: number;
    purchasesGoodsMaterials: number;
    employeeBenefits: number;
    depreciation: number;
    otherExpensesLosses: number;
    otherIncomeGains: number;
    interestNet: number;
    adjustments: number;
    carriedForwardLosses: number;
    deemedTaxation: number;
    businessWithholdings: number;
    previousYearPrepayment: number;
  },
  companyInputs: {
    netTurnover: number;
    otherOrdinaryIncome: number;
    inventoryChanges: number;
    purchasesGoodsMaterials: number;
    employeeBenefits: number;
    depreciation: number;
    otherExpensesLosses: number;
    otherIncomeGains: number;
    interestNet: number;
    adjustments: number;
    carriedForwardLosses: number;
    businessWithholdings: number;
    previousYearPrepayment: number;
    professionalFee: number;
  },
  employeeInputs: {
    employeeIncome: number;
    taxReductions: number;
    employeeWithholdings: number;
  }
): FullCombinedCalculationResults {
  // Calculate individual business results
  const individualResults = calculateIndividualBusiness(individualInputs);
  
  // Calculate company results (22% flat tax)
  const companyResults = calculateCompany(companyInputs);
  
  // Personal Income = Individual business income + Employee income
  // This gets progressive taxation
  const personalTaxableIncome = individualResults.taxableIncome + employeeInputs.employeeIncome;
  const personalGrossTax = calculateProgressiveTax(personalTaxableIncome);
  const personalTaxDue = Math.max(0, personalGrossTax - employeeInputs.taxReductions);
  
  // Solidarity contribution on personal income
  const solidarityContribution = calculateSolidarityContribution(personalTaxableIncome);
  
  // Personal prepayment (based on individual business tax only)
  const personalPrepayment = Math.max(0, individualResults.taxDue * 0.55 - Math.abs(individualInputs.businessWithholdings));
  
  // Minimum card spending
  const minimumCardSpending = calculateMinimumCardSpending(personalTaxableIncome);
  
  // Total gross income from all sources
  const totalGrossIncome = personalTaxableIncome + companyResults.taxableResults;
  
  // Total taxes (personal tax + solidarity + company tax + professional fee)
  const totalTaxes = 
    personalTaxDue + 
    solidarityContribution + 
    companyResults.taxDue + 
    companyInputs.professionalFee;
  
  // Total prepayments
  const totalPrepayments = personalPrepayment + companyResults.prepaymentNextYear;
  
  // Overall tax declaration
  const overallTaxDeclaration = 
    personalTaxDue + 
    personalPrepayment + 
    employeeInputs.employeeWithholdings + 
    individualInputs.businessWithholdings + 
    companyResults.totalTaxDeclaration - 
    individualInputs.previousYearPrepayment;
  
  // Total net income
  const totalNetIncome = totalGrossIncome - totalTaxes - totalPrepayments + 
    individualInputs.previousYearPrepayment + companyInputs.previousYearPrepayment;

  return {
    // Individual part
    individualTaxableIncome: Math.round(individualResults.taxableIncome * 100) / 100,
    individualTaxDue: Math.round(individualResults.taxDue * 100) / 100,
    individualPrepayment: Math.round(personalPrepayment * 100) / 100,
    
    // Company part
    companyTaxableResults: Math.round(companyResults.taxableResults * 100) / 100,
    companyTaxDue: Math.round(companyResults.taxDue * 100) / 100,
    companyPrepayment: Math.round(companyResults.prepaymentNextYear * 100) / 100,
    
    // Personal income (Individual + Employee)
    personalTaxableIncome: Math.round(personalTaxableIncome * 100) / 100,
    personalTaxDue: Math.round(personalTaxDue * 100) / 100,
    solidarityContribution: Math.round(solidarityContribution * 100) / 100,
    personalPrepayment: Math.round(personalPrepayment * 100) / 100,
    minimumCardSpending: Math.round(minimumCardSpending * 100) / 100,
    
    // Combined totals
    totalGrossIncome: Math.round(totalGrossIncome * 100) / 100,
    totalTaxes: Math.round(totalTaxes * 100) / 100,
    totalPrepayments: Math.round(totalPrepayments * 100) / 100,
    overallTaxDeclaration: Math.round(overallTaxDeclaration * 100) / 100,
    totalNetIncome: Math.round(totalNetIncome * 100) / 100,
  };
}

/**
 * Format number as Greek currency (€1.234,56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number as percentage (12,34%)
 */
export function formatPercentage(value: number | string): string {
  if (value === '-') return '-';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('el-GR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue / 100);
}
