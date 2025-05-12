import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number | string, showMoney: boolean) {
  if (!showMoney) return "••••••";

  const num = Number(amount);

  if (isNaN(num)) return "0";

  try {
    return num.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    });
  } catch (error) {
    console.error("Error formatting amount:", error);
    return `฿${num.toLocaleString("th-TH")}`;
  }
}

