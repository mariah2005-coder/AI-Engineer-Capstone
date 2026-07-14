export interface ProfileSettings {
  displayName: string;
  email: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  timezone: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  profileVisibility: "public" | "private" | "team";
}

export const defaultProfileSettings: ProfileSettings = {
  displayName: "Alex Rivera",
  email: "alex.rivera@example.com",
  username: "arivera",
  bio: "AI engineer building thoughtful tools with human-centered design.",
  location: "San Francisco, CA",
  website: "https://alexrivera.dev",
  timezone: "America/Los_Angeles",
  emailNotifications: true,
  marketingEmails: false,
  profileVisibility: "public",
};

export const TIMEZONE_OPTIONS = [
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
] as const;

export const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public", description: "Anyone can view your profile" },
  { value: "team", label: "Team only", description: "Only teammates can view your profile" },
  { value: "private", label: "Private", description: "Only you can view your profile" },
] as const;
