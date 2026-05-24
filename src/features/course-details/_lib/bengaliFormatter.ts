/**
 * Bengali Number and Date/Time Formatting Utilities
 * Ported from bundle-details page
 */

/**
 * Convert English numbers to Bengali digits
 * @param num - Number to convert
 * @returns Bengali number string
 */
export const toBengaliNumber = (num: number): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => bengaliDigits[parseInt(digit)] || digit)
    .join("");
};

/**
 * Convert date string to Bengali format (e.g., "২৫ নভেম্বর")
 * @param dateString - ISO date string
 * @returns Bengali formatted date string
 */
export const formatDateToBengali = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর",
    ];
    const month = monthNames[date.getMonth()];
    return `${toBengaliNumber(day)} ${month}`;
  } catch (error) {
    return dateString;
  }
};

/**
 * Convert time string to Bengali format (e.g., "রাত ৯:১৫")
 * @param timeString - Time string in format "T21:15:00" or "21:15:00"
 * @returns Bengali formatted time string
 */
export const formatTimeToBengali = (timeString: string): string => {
  try {
    // Handle time format like "T21:15:00" or "21:15:00"
    let timeOnly = timeString;
    if (timeString.startsWith("T")) {
      timeOnly = timeString.substring(1);
    }

    const [hours, minutes] = timeOnly
      .split(":")
      .map((part) => parseInt(part));

    // Convert to 12-hour format
    let hour12 = hours % 12;
    if (hour12 === 0) hour12 = 12;

    // Determine period (সকাল for AM, রাত for PM)
    const period = hours < 12 ? "সকাল" : "রাত";

    // Format with Bengali numbers
    const bengaliHour = toBengaliNumber(hour12);
    const bengaliMinutes = toBengaliNumber(minutes);

    return `${period} ${bengaliHour}:${bengaliMinutes}`;
  } catch (error) {
    return timeString;
  }
};
