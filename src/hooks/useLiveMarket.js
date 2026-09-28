import { useEffect, useState } from "react";

const todayDate = new Date();

const previousDate = new Date(todayDate);
previousDate.setDate(previousDate.getDate() - 1);

const yesterdayDate = previousDate.toISOString().split("T")[0];

export default function useLiveMarket(marketPairs) {
  const [currencyMarket, setCurrencyMarket] = useState([]);

  useEffect(() => {
    async function fetchMarketRates() {
      const requests = marketPairs.map(async (market) => {
        const [currentRes, previousRes] = await Promise.all([
          fetch(
            `https://api.frankfurter.dev/v2/rate/${market[0]}/${market[1]}`,
          ),
          fetch(
            `https://api.frankfurter.dev/v2/rate/${market[0]}/${market[1]}?date=${yesterdayDate}`,
          ),
        ]);

        const [currentData, previousData] = await Promise.all([
          currentRes.json(),
          previousRes.json(),
        ]);

        return {
          ...market,
          currentRate: currentData.rate,
          previousRate: previousData.rate,
          changePercent:
            ((currentData.rate - previousData.rate) / previousData.rate) * 100,
        };
      });

      const data = await Promise.all(requests);

      setCurrencyMarket(data);
    }

    fetchMarketRates();
  }, [marketPairs]);

  return currencyMarket;
}
