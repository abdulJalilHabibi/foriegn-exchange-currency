import { useEffect, useState } from "react";

export default function useCompareRate(senderCurrency, toCurrency) {
  const [compareResult, setCompareResult] = useState([]);
  const currenciesToCompare = toCurrency.filter(
    (currency) => currency !== senderCurrency,
  );

  useEffect(() => {
    const request = currenciesToCompare.map((currency) => {
      return fetch(
        `https://api.frankfurter.dev/v2/rate/${senderCurrency}/${currency}`,
      );
    });
    Promise.all(request).then((res) => {
      return Promise.all(res.map((res) => res.json())).then((data) =>
        setCompareResult(data),
      );
    });
  }, [toCurrency, senderCurrency]);

  return compareResult;
}
