import { useRef } from "react";

export default function useFocus() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return { inputRef, focusInput };
}
