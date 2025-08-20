export interface DataRow {
  EEID: string;
  Full_Name?: string;
  Job_Title?: string;
  Department?: string;
  Business_Unit?: string;
  Gender?: string;
  Ethnicity?: string;
  Age?: number;
  Hire_Date?: string | null;
  Annual_Salary?: string;
  Bonus_Percentage?: string;
  Country?: string;
  City?: string;
  Exit_Date?: string | null;
  [key: string]: string | number | null | undefined;
}