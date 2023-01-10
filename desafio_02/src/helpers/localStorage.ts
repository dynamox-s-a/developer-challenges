const setLocalStorage = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

function getLocalStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value != null ? JSON.parse(value) : null;
}

export { setLocalStorage, getLocalStorage };
