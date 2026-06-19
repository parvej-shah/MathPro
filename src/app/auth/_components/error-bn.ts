const errorBn: Record<string, string> = {
  "No active code. Please request a new one.": "কোনো সক্রিয় কোড নেই। অনুগ্রহ করে নতুন কোড পাঠাও।",
  "OTP has expired. Please request a new one.": "OTP এর মেয়াদ শেষ হয়ে গেছে। নতুন কোড পাঠাও।",
  "Too many attempts. Please request a new code.": "অনেকবার ভুল চেষ্টা হয়েছে। নতুন কোড পাঠাও।",
  "Invalid OTP": "ভুল OTP। আবার চেষ্টা করো।",
  "Enter a valid phone number": "সঠিক ফোন নম্বর দাও।",
  "Enter a valid phone number or email": "সঠিক ফোন নম্বর বা ইমেইল দাও।",
  "An account already exists with this phone": "এই ফোন নম্বর দিয়ে আগেই অ্যাকাউন্ট আছে।",
  "An account already exists with this email": "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে।",
  "Password must be at least 6 characters long": "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।",
  "OTP is required": "OTP কোড দরকার।",
  "Failed to send OTP. Please try again.": "OTP পাঠানো যায়নি। আবার চেষ্টা করো।",
  "Daily OTP limit reached. Please try again later.": "আজকের OTP সীমা শেষ। পরে আবার চেষ্টা করো।",
  "Registration failed": "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করো।",
  "Failed to process OTP. Please try again.": "OTP প্রক্রিয়া করা যায়নি। আবার চেষ্টা করো।",
  "User not found": "কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
  "Invalid password": "পাসওয়ার্ড ভুল হয়েছে।",
  "No account found with this phone": "এই ফোন নম্বরে কোনো অ্যাকাউন্ট নেই।",
  "No account found with this email": "এই ইমেইলে কোনো অ্যাকাউন্ট নেই।",
  "Failed to update password - user not found": "পাসওয়ার্ড আপডেট করা যায়নি — অ্যাকাউন্ট পাওয়া যায়নি।",
  "Password updated successfully": "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।",
  "Phone number or email is required": "ফোন নম্বর বা ইমেইল দরকার।",
  "Login and password are required": "ফোন/ইমেইল ও পাসওয়ার্ড দরকার।",
  "Name is required": "নাম দরকার।",
  "Login, password and OTP are required": "ফোন/ইমেইল, পাসওয়ার্ড ও OTP দরকার।",
  "Contact, OTP, and new password are required": "ফোন নম্বর, OTP ও নতুন পাসওয়ার্ড দরকার।",
  "Too many authentication attempts. Please try again later.": "অনেক বেশি চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করো।",
  "Too many login attempts. Please try again later.": "অনেক বেশি লগইন চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করো।",
  "This Google account is already linked to another user": "এই Google অ্যাকাউন্ট অন্য একটি অ্যাকাউন্টে যুক্ত আছে।",
  "Google id_token is required": "Google টোকেন পাওয়া যায়নি।",
  "Google account email is missing or invalid": "Google অ্যাকাউন্টে ইমেইল পাওয়া যায়নি।",
  "Google account email is not verified": "Google ইমেইল ভেরিফাই করা নেই।",
  "Google token audience mismatch": "Google টোকেন যাচাই ব্যর্থ হয়েছে।",
  "Failed to verify Google token": "Google টোকেন যাচাই করা যায়নি।",
  "Failed to connect Google account": "Google অ্যাকাউন্ট কানেক্ট করা যায়নি।",
  "An error occurred while connecting Google": "Google কানেক্ট করতে সমস্যা হয়েছে।",
  "An error occurred during Google login": "Google লগইন করতে সমস্যা হয়েছে।",
  "No account found with this Google email": "এই Google ইমেইলে কোনো অ্যাকাউন্ট নেই।",
  "Current password is incorrect": "বর্তমান পাসওয়ার্ড ভুল।",
  "New phone number and OTP are required": "নতুন ফোন নম্বর ও OTP দরকার।",
  "Invalid phone number. Must be 11 digits starting with 01": "সঠিক ফোন নম্বর দাও (০১ দিয়ে শুরু, ১১ ডিজিট)।",
  "Failed to update phone number": "ফোন নম্বর আপডেট করা যায়নি।",
  "Phone number updated successfully": "ফোন নম্বর সফলভাবে আপডেট হয়েছে।",
};

export function toBanglaError(msg?: string): string {
  if (!msg) return "";
  if (errorBn[msg]) return errorBn[msg];
  const waitMatch = msg.match(/^Please wait (\d+)s before requesting another code$/);
  if (waitMatch) return `আরো ${waitMatch[1]} সেকেন্ড অপেক্ষা করো।`;
  const phoneCooldown = msg.match(/^Phone number can only be changed once every \d+ days\. Try again in (\d+) day\(s\)\.$/);
  if (phoneCooldown) return `ফোন নম্বর ৭ দিনে একবার পরিবর্তন করা যায়। আরো ${phoneCooldown[1]} দিন অপেক্ষা করো।`;
  const emailCooldown = msg.match(/^Email can only be changed once every \d+ days\. Try again in (\d+) day\(s\)\.$/);
  if (emailCooldown) return `ইমেইল ৭ দিনে একবার পরিবর্তন করা যায়। আরো ${emailCooldown[1]} দিন অপেক্ষা করো।`;
  return msg;
}
