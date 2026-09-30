import { useState } from "react";
import { data } from "../data/data.js";
import useCompareRate from "../hooks/useCompareRate";

const compareCurrencies = [
  "EUR",
  "GBP",
  "AFN",
  "INR",
  "CNY",
  "CAD",
  "AUD",
  "JPY",
];

export default function Compare({
  senderField,
  currency,
  handleFavorite,
  favorited,
}) {
  const compareResult = useCompareRate(
    currency.fromSelectedCurrency,
    compareCurrencies,
  );

  const amount = Number(senderField) || 0;

  return (
    <div className="">
      <div className="w-[343px] bg-[#171719]  mt-4 rounded-2xl p-4  md:w-[720px] lg:w-[1036px]">
        <div className="flex flex-col gap-1 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#9d9d9d]">MULTI-CURRENCY </span>
            <span className="text-white font-bold text-[20px]">
              {senderField} FROM {currency.fromSelectedCurrency}
            </span>
          </div>
          <div>
            <p className="text-[#9d9d9d] text-[18px]">
              {compareResult.length} PAIRS
            </p>
          </div>
        </div>
        {/*card div */}
        {compareResult.map((Compare) => {
          const recieverCurrency = data.find(
            (country) => country.currency === Compare.quote,
          );
          const isFavorited = favorited.some(
            (favorite) =>
              favorite.senderCurrency === currency.fromSelectedCurrency &&
              favorite.receiverCurrency === Compare.quote,
          );
          const convertedAmount = amount * Compare.rate;
          return (
            <div
              key={Compare.quote}
              className="flex items-center justify-between w-[311px] md:w-[680px] lg:w-[996px] hover:border hover:border-[#454547] cursor-pointer  h-[70px] mt-4 p-[12px] rounded-[10px] bg-[#202022] text-white "
            >
              <div className="flex items-center gap-3 md:gap-5">
                <div>
                  <img
                    className="w-[24px] h-[24px] rounded-full"
                    src={recieverCurrency.flag}
                    alt=""
                  />
                </div>
                <div>
                  <p className="text-white">{Compare.quote}</p>
                  <p className="text-[#dcdcdc] tracking-wider">
                    {currency.currencyName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2  md:gap-6 ">
                <div>
                  <p className="text-white text-[20px] font-bold">
                    {convertedAmount.toFixed(3)}
                  </p>
                  <p className="text-[#dcdcdc] tracking-wider">
                    @ {(convertedAmount * 1000).toFixed(2)}
                  </p>
                </div>
                <div
                  onClick={() =>
                    handleFavorite(
                      currency.fromSelectedCurrency,
                      Compare.quote,
                      Compare.rate,
                    )
                  }
                  className={` flex justify-center cursor-pointer items-center rounded-lg bg-[#2e2e2e] w-[32px] h-[32px] ${isFavorited ? "border-2 border-[#CEF739]" : ""}`}
                >
                  {isFavorited ? (
                    <img className="w-3 h-3 " src="./starfil.png" alt="starr" />
                  ) : (
                    <img className="w-3 h-3 " src="./star1.png" alt="starr" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
