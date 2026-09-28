import { useState } from "react";

import useHistoryRate from "../hooks/useHistoryRate";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import HistoryLoading from "./HistoryLoading";
import CustomTooltip from "./CustomToolTip";

export default function History({ currency }) {
  const [historyDate, setHistoryDate] = useState("1D");

  const today = new Date();

  switch (historyDate) {
    case "1D":
      today.setDate(today.getDate() - 1);
      break;

    case "1W":
      today.setDate(today.getDate() - 7);
      break;

    case "1M":
      today.setMonth(today.getMonth() - 1);
      break;

    case "3M":
      today.setMonth(today.getMonth() - 3);
      break;

    case "1Y":
      today.setFullYear(today.getFullYear() - 1);
      break;

    case "5Y":
      today.setFullYear(today.getFullYear() - 5);
      break;

    default:
      break;
  }

  const startDate = today.toISOString().split("T")[0];

  const { historyRate, isLoading, error } = useHistoryRate(
    currency.fromSelectedCurrency,
    currency.toSelectedCurrency,
    startDate,
  );

  const open = historyRate[0]?.rate;
  const last = historyRate[historyRate.length - 1]?.rate;

  const change = open !== undefined && last !== undefined ? last - open : 0;

  const percentageChange = open && open !== 0 ? (change / open) * 100 : 0;

  return (
    <div className="w-full min-w-0 max-w-full pb-4 lg:w-[1036px]">
      {isLoading ? (
        <HistoryLoading />
      ) : error ? (
        <div className="text-white">Something went wrong.</div>
      ) : (
        <>
          {/* ================= TOP SECTION ================= */}

          <div className="w-full min-w-0">
            {/* ================= CARDS ================= */}

            <div className="mt-4 grid w-full min-w-0 grid-cols-2 gap-3 md:flex md:gap-5">
              {/* OPEN */}
              <div className="flex h-20 min-w-0 w-full flex-col gap-2 rounded-2xl bg-black px-4 py-2 font-jetbrains md:w-[145px] md:bg-[#171719]">
                <span className="tracking-wider text-[#b2b2b2]">OPEN</span>

                <p className="truncate text-[20px] tracking-[1px] text-white">
                  {open ?? "-"}
                </p>
              </div>

              {/* LAST */}
              <div className="flex h-20 min-w-0 w-full flex-col gap-2 rounded-2xl bg-black px-4 py-2 font-jetbrains md:w-[145px] md:bg-[#171719]">
                <span className="tracking-wider text-[#b2b2b2]">LAST</span>

                <p className="truncate text-[20px] tracking-[1px] text-white">
                  {last ?? "-"}
                </p>
              </div>

              {/* CHANGE */}
              <div className="flex h-20 min-w-0 w-full flex-col gap-2 rounded-2xl bg-black px-4 py-2 font-jetbrains md:w-[145px] md:bg-[#171719]">
                <span className="tracking-wider text-[#b2b2b2]">CHANGE</span>

                <p className="truncate text-[18px] tracking-[1px] text-[#42eb05]">
                  {change.toFixed(5)}
                </p>
              </div>

              {/* % CHANGE */}
              <div className="flex h-20 min-w-0 w-full flex-col gap-2 rounded-2xl bg-black px-4 py-2 font-jetbrains md:w-[145px] md:bg-[#171719]">
                <span className="tracking-wider text-[#b2b2b2]">% CHANGE</span>

                <p
                  className={`truncate tracking-wide text-[16px] ${
                    percentageChange > 0
                      ? "text-[#42eb05]"
                      : percentageChange < 0
                        ? "text-[#ff4141]"
                        : "text-[#42eb05]"
                  }`}
                >
                  {percentageChange > 0 ? "▲" : percentageChange < 0 ? "▼" : ""}{" "}
                  {percentageChange.toFixed(5)}%
                </p>
              </div>
            </div>

            {/* ================= TIME RANGE ================= */}

            <div className="mt-6 flex h-10 w-full max-w-[286px] items-center justify-around rounded-lg bg-black p-1 text-[12px] text-[#b2b2b2] md:bg-[#171719] md:text-[14px]">
              {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((range) => (
                <span
                  key={range}
                  onClick={() => setHistoryDate(range)}
                  className={`cursor-pointer rounded-lg px-2 py-1.5 ${
                    historyDate === range ? "bg-[#3d3d3d] text-white" : ""
                  }`}
                >
                  {range}
                </span>
              ))}
            </div>
          </div>

          {/* ================= CHART ================= */}

          <div className="mt-4 box-border w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-black p-3 lg:bg-[#171719] md:h-[370px] lg:w-[1036px]">
            {/* Chart Header */}

            <div className="mb-2 flex w-full min-w-0 items-center justify-between gap-2">
              <p className="shrink-0 text-[13px] text-white md:text-[18px]">
                {currency.fromSelectedCurrency}/{currency.toSelectedCurrency}
              </p>

              <p className="flex min-w-0 items-center justify-end gap-1 overflow-hidden text-[10px] text-[#b2b2b2] md:gap-3 md:text-[16px]">
                <span className="truncate">{last ?? "-"}</span>

                {historyRate.length > 0 && (
                  <>
                    <span>·</span>

                    <span className="shrink-0">
                      {new Date(
                        historyRate[historyRate.length - 1]?.date,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    <span className="hidden shrink-0 sm:inline">16:00</span>

                    <span className="hidden shrink-0 sm:inline">CET</span>
                  </>
                )}
              </p>
            </div>

            {/* Chart */}

            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <LineChart
                  data={historyRate}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#777", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />

                  <YAxis
                    tick={{ fill: "#777", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />

                  <CartesianGrid stroke="#2A2A2C" strokeDasharray="3 3" />

                  <Tooltip content={<CustomTooltip />} />

                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#CEF739"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
