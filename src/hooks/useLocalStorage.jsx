import { useState } from "react";

export const useLocalStorage = (keyName) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      }
      return;
    } catch (err) {
      return;
    }
  });
  const setValue = (newValue) => {
    try {
      localStorage.setItem(keyName, newValue ? JSON.stringify(newValue) : null);
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue || null);
  };
  return [storedValue, setValue];
};
