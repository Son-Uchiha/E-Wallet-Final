export const STORAGE_KEYS = {
  TRANSACTIONS: "ewallet_transactions",
  CATEGORIES: "ewallet_categories",
  BUDGET: "ewallet_budget",
};

export const loadFromStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
};
