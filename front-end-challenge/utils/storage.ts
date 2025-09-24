export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  THEME_PREFERENCE: "themePreference",
  LAST_VISITED_PAGE: "lastVisitedPage",
} as const;

export const getStorageItem = (key: string): string | null => {
  try {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item from localStorage (${key}):`, error);
    return null;
  }
};

export const setStorageItem = (key: string, value: string): boolean => {
  try {
    if (typeof window === "undefined") {
      return false;
    }
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage (${key}):`, error);
    return false;
  }
};

export const removeStorageItem = (key: string): boolean => {
  try {
    if (typeof window === "undefined") {
      return false;
    }
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage (${key}):`, error);
    return false;
  }
};

export const authStorage = {
  getToken: (): string | null => getStorageItem(STORAGE_KEYS.AUTH_TOKEN),
  setToken: (token: string): boolean =>
    setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeToken: (): boolean => removeStorageItem(STORAGE_KEYS.AUTH_TOKEN),
  hasToken: (): boolean => getStorageItem(STORAGE_KEYS.AUTH_TOKEN) !== null,
};
