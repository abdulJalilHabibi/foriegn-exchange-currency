import useLiveMarket from "../hooks/useLiveMarket";
import CurrencyItem from "./CurrencyItem";

const marketPairs = [
  ["EUR", "USD"],
  ["USD", "EUR"],
  ["USD", "JPY"],
  ["GBP", "USD"],
  ["USD", "CHF"],
  ["EUR", "GBP"],
  ["AUD", "USD"],
];
export default function LiveMarket() {
  const currencyLiveMarket = useLiveMarket(marketPairs);

  const result = currencyLiveMarket.map((currency, index) => {
    return (
      <div
        key={index}
        className="flex h-full shrink-0 items-center border-r-2   border-[#434141] text-[11px] md:text-[15px]"
      >
        <p className="whitespace-nowrap">
          <span className="ml-2 text-[#9d9d9d]">
            {currency[0]}/{currency[1]}
          </span>
          <span className="text-white ml-2">{currency.currentRate}</span>
          <span
            className={`${currency.changePercent > 0 ? "text-[#42eb05]" : "text-[#ff4141]"} mr-2 ml-2 `}
          >
            {currency.changePercent > 0 ? "▲" : "▼"}{" "}
            {currency.changePercent.toFixed(3)}%
          </span>
        </p>
      </div>
    );
  });

  return (
    <div className="flex h-[30px] w-full items-center overflow-hidden bg-[#171719] gap-2">
      {/* LIVE MARKETS */}
      <div className="flex h-full w-27 shrink-0 items-center gap-2 md:w-34.25 bg-[#cef739] p-2">
        <img className="ml-1 w-1.5" src="./dot.png" alt="dot" />

        <p className="text-[#0a0a0a] text-[11px] md:text-[15px] whitespace-nowrap">
          LIVE MARKETS
        </p>
      </div>

      {/* CHANGE */}

      {result}
    </div>
  );
}
