
/**
 * Parse THC percentage to number
 */
export const parseThcPercentage = (thcStr?: string): number => {
  if (!thcStr) return 0;
  
  // Handle ranges like "10-15%"
  if (thcStr.includes("-")) {
    const parts = thcStr.split("-");
    const avg = parts.map(p => parseFloat(p)).reduce((a, b) => a + b, 0) / parts.length;
    return avg;
  }
  
  // Handle "< 0.2%" format
  if (thcStr.includes("<")) {
    return 0.1; // Just a small value for "less than" cases
  }
  
  // Handle "X% per piece" format
  if (thcStr.includes("per piece")) {
    return parseFloat(thcStr) || 0;
  }
  
  // Regular percentage
  return parseFloat(thcStr) || 0;
};
