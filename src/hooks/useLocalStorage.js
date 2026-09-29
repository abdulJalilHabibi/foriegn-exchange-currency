import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialvalue) {
  const [value, setValue] = useState(() => {
    const savedItem = localStorage.getItem(key);
    return savedItem ? JSON.parse(savedItem) : initialvalue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key,value]);


  return [value,setValue];
}
