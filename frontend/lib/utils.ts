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


// 
export const currentYear = new Date().getFullYear();

export const months = [
  { value: "01", label: "มกราคม" },
  { value: "02", label: "กุมภาพันธ์" },
  { value: "03", label: "มีนาคม" },
  { value: "04", label: "เมษายน" },
  { value: "05", label: "พฤษภาคม" },
  { value: "06", label: "มิถุนายน" },
  { value: "07", label: "กรกฎาคม" },
  { value: "08", label: "สิงหาคม" },
  { value: "09", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" },
];

export const years = Array.from({ length: 4 }, (_, i) => {
  const y = currentYear - 1 + i;
  return { value: y.toString(), label: y.toString() };
});
