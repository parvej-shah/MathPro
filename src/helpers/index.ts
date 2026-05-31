import { Anek_Bangla } from "next/font/google";
import { jwtDecode } from 'jwt-decode';
import CryptoJS from "crypto-js";

const AUTH_COOKIE_DOMAIN = ".mathpro.org";

export const HindSiliguri = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-anek-bangla",
});
export const checkTokenValidity = (token: any) => {
  try {
    const decoded = jwtDecode<any>(token);

    // Check if token has any user identifier
    const hasUserIdentifier =
      decoded &&
      (decoded.name ||
        decoded.email ||
        decoded.user_id ||
        decoded.sub ||
        decoded.id);

    // If token has expiration, check it. If no expiration, consider it valid if it has user identifier
    const isNotExpired = decoded.exp ? decoded.exp > Date.now() / 1000 : true;

    return hasUserIdentifier && isNotExpired;
  } catch (error) {
    console.warn("Token validation error:", error);
    return false;
  }
};

function getCookie(name: string) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

/** Set cookie with domain for cross-subdomain auth (e.g. .mathpro.org). */
export function setCookieWithDomain(
  name: string,
  value: string,
  domain: string,
  maxAgeSeconds: number = 7 * 24 * 3600
) {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && window.location?.protocol === "https:" ? "; secure" : "";
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (isLocalhost) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; domain=${domain}; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

/** Append token to URL using hash (#token=...) so it is not sent to the server. For cross-LMS redirects. */
export function appendTokenToUrl(url: string, token: string | null): string {
  if (!token || typeof token !== "string") return url;
  const separator = url.includes("#") ? "&" : "#";
  return `${url}${separator}token=${encodeURIComponent(token)}`;
}

// Extract and validate token from URL (hash #token= first, then query ?token=)
export const extractTokenFromUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  let token: string | null = null;
  let fromHash = false;
  const hash = window.location.hash?.slice(1);
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    token = hashParams.get("token");
    if (token) fromHash = true;
  }
  if (!token) {
    token = new URLSearchParams(window.location.search).get("token");
  }

  if (token) {
    try {
      const decoded = jwtDecode<any>(token);
      const hasValidStructure =
        decoded &&
        (decoded.name ||
          decoded.email ||
          decoded.user_id ||
          decoded.sub ||
          decoded.id);
      const isNotExpired = decoded.exp && decoded.exp > Date.now() / 1000;

      if (hasValidStructure && isNotExpired) {
        localStorage.setItem("token", token);
        setCookieWithDomain("token", token, AUTH_COOKIE_DOMAIN);

        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        url.hash = url.hash
          ? url.hash
              .replace(/\btoken=[^&]*&?/g, "")
              .replace(/&$/, "")
          : "";
        if (url.hash === "#") url.hash = "";
        window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);

        return token;
      } else {
        console.warn("Token validation failed:", { hasValidStructure, isNotExpired, decoded });
      }
    } catch (error) {
      console.warn("Invalid token in URL:", error);
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("token");
    url.hash = url.hash ? url.hash.replace(/\btoken=[^&]*&?/g, "").replace(/&$/, "") : "";
    if (url.hash === "#") url.hash = "";
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  }
  return null;
};

export const isLoggedIn = () => {
  let token: any = "";
  if (typeof window !== "undefined") {
    // 1. First check URL parameters (highest priority)
    token = extractTokenFromUrl();

    // 2. Then check cookies
    if (!token) {
      token = getCookie("token");
      if (token) {
        localStorage.setItem("token", token);
      }
    }

    // 3. Finally check localStorage
    if (!token) {
      token = localStorage.getItem("token");
    }
  }

  if (!token || !checkTokenValidity(token)) {
    return false;
  }
  return true;
};
function deleteCookie(name: string) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function deleteCookieWithDomain(name: string, domain: string) {
  document.cookie =
    name +
    "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" +
    domain +
    "; path=/;";
}


export const createLoginRedirectUrl = () => {
  const currentDomain = window.location.href;
  return `/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
};

export const createRegisterRedirectUrl = () => {
  const currentDomain = window.location.href;
  return `/auth/register?redirect=${encodeURIComponent(currentDomain)}`;
};

/**
 * Get authentication token from multiple sources (URL, cookies, localStorage)
 * Returns null if no valid token is found
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  let token: string | null = null;

  // 1. First check URL parameters (highest priority)
  token = extractTokenFromUrl();

  // 2. Then check cookies
  if (!token) {
    token = getCookie("token");
    if (token) {
      localStorage.setItem("token", token);
    }
  }

  // 3. Finally check localStorage
  if (!token) {
    token = localStorage.getItem("token");
  }

  // Validate token before returning
  if (token && checkTokenValidity(token)) {
    return token;
  }

  return null;
};

export const logout = () => {
  localStorage.removeItem("token");
  deleteCookie("token");
  deleteCookieWithDomain("token", AUTH_COOKIE_DOMAIN);
  window.location.reload();
};

export function capitalizeFirstWord(str: String) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
let token: string = "";
if (typeof window !== "undefined") {
  // Perform localStorage action
  token = localStorage.getItem("token") || "";
}

export const apiConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export function englishToBanglaNumbers(number: number) {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const englishNumberStr = number.toString();
  const banglaNumberStr = englishNumberStr
    .split("")
    .map((digit) => banglaDigits[parseInt(digit)])
    .join("");

  return banglaNumberStr;
}

export function calculateRemainingDays(targetDate: string) {
  // Parse the target date string into a Date object
  const target = new Date(targetDate).getTime();

  // Get the current date
  const currentDate = new Date().getTime();

  // Calculate the difference in milliseconds between the two dates
  const timeDifference = target - currentDate;

  // Calculate the remaining days
  const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return remainingDays;
}
export function countAssignmentsAndVideos(data: any) {
  let assignmentCount = 0;
  let videoCount = 0;

  let codeCount = 0;
  let quizCount = 0;
  let pdfCount = 0;

  if (!Array.isArray(data)) return { assignmentCount, videoCount, codeCount, quizCount, pdfCount };

  data.forEach((item: any) => {
    const category = item?.data?.category;
    if (category === "ASSIGNMENT") {
      assignmentCount++;
    } else if (category === "VIDEO") {
      videoCount++;
    } else if (category === "QUIZ") {
      quizCount++;
    } else if (category === "CODE") {
      codeCount++;
    } else if (category === "PDF") {
      pdfCount++;
    }
  });

  return {
    assignmentCount,
    videoCount,
    codeCount,
    quizCount,
    pdfCount,
  };
}

export function countModulesAssignmentsVideos(data: any) {
  let totalModules = 0;
  let totalAssignments = 0;
  let totalVideos = 0;
  let totalCodes = 0;
  let totalQuiz = 0;
  let totalPDF = 0;

  const chapters = data?.chapters ?? [];
  if (!chapters.length) return { totalModules, totalAssignments, totalVideos, totalCodes, totalQuiz, totalPDF };
  for (const chapter of chapters) {
    const modules = chapter?.modules ?? [];
    for (const elem of modules) {
      const category = elem?.data?.category;
      if (category === "VIDEO") {
        totalVideos++;
      } else if (category === "ASSIGNMENT") {
        totalAssignments++;
      } else if (category === "QUIZ") {
        totalQuiz++;
      } else if (category === "CODE") {
        totalCodes++;
      } else if (category === "PDF") {
        totalPDF++;
      }
      totalModules++;
    }
  }

  return {
    totalModules,
    totalAssignments,
    totalVideos,
    totalCodes,
    totalQuiz,
    totalPDF,
  };
}

export function decryptString(encryptedText: any, secretKey: any) {
  console.log(encryptedText, secretKey);
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);

  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}
export function convertUnixTimestamp(timestamp: any) {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = date.toLocaleDateString(undefined, options);

  return formattedDate;
}

export function formatDate(inputDate: any) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[inputDate.getMonth()];
  const day = inputDate.getDate();
  const year = inputDate.getFullYear();

  const formattedDate = `${month} ${day.toString().padStart(2, "0")}, ${year}`;

  return formattedDate;
}

/**
 * Extract user ID from JWT token
 * Returns null if no valid user ID is found
 */
export const getUserIdFromToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<any>(token);
    
    // Try different possible user ID fields (same as checkTokenValidity function)
    const userId = decoded.user_id || decoded.id || decoded.userId || decoded.sub;
    
    return userId ? String(userId) : null;
  } catch (error) {
    console.error('getUserIdFromToken: Failed to decode JWT token:', error);
    return null;
  }
};
