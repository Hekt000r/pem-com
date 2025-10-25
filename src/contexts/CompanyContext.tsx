"use client";
import { createContext, useContext } from "react";

interface CompanyContextType {
  company: Company | null;
  billingData: BillingData | null;
  admins: Array<Admin> | null;
}

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  billingData: null,
  admins: null,
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({
  company,
  billingData,
  admins,
  children,
}: {
  company: Company | null;
  billingData: BillingData | null;
  admins: Array<Admin> | null;
  children: React.ReactNode;
}) => {
  return (
    <CompanyContext.Provider value={{ company, billingData, admins }}>
      {children}
    </CompanyContext.Provider>
  );
};
