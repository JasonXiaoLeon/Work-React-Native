// utils/getInternshipInfo.ts
export function getInternshipInfo(startDate: Date | null) {
    if (!startDate) return { start: '', end: '', daysLeft: 0 };
  
    const start = new Date(startDate);
    const end = new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);
  
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    const daysLeft = Math.max(
      0,
      Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );
  
    return { start: startStr, end: endStr, daysLeft };
  }
  
 export const formatDateYMD = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  