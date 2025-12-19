// Type definitions for the Greek Tax Calculator

export interface Business {
  id: string;
  businessName: string;
  activity: string;
  address: string;
  taxId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndividualCalculationInput {
  year: number;
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

export interface CompanyCalculationInput {
  year: number;
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

export interface EmployeeIncomeInput {
  year: number;
  employeeIncome: number;
  taxReductions: number;
  employeeWithholdings: number;
}

export type CalculationType = 
  | 'individual' 
  | 'company' 
  | 'individual_company' 
  | 'individual_employee' 
  | 'full';

export interface CalculationScenario {
  id: string;
  type: CalculationType;
  title: string;
  description: string;
  icon: string;
}
