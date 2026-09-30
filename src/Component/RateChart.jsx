import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const LINE_COLOR = "#CEF739";
const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";

export default function RateChart({ historyRate }) {
  const { min, max, yTicks, xTicks } = useMemo(() => {
    const rates = historyRate.map((d) => Number(d.rate));
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const mid = (min + max) / 2;

    const step = Math.max(1, Math.floor(historyRate.length / 4));
    const xTicks = historyRate
      .filter((_, i) => i % step === 0)
      .map((d) => d.date);
    const lastDate = historyRate[historyRate.length - 1]?.date;
    if (lastDate && !xTicks.includes(lastDate)) {
      if (xTicks.length > 1) xTicks.pop();
      xTicks.push(lastDate);
    }

    return { min, max, yTicks: [min, mid, max], xTicks };
  }, [historyRate]);

  const renderXTick = ({ x, y, payload }) => {
    const isFirst = payload.value === xTicks[0];
    const isLast = payload.value === xTicks[xTicks.length - 1];
    return (
      <text
        x={x}
        y={y + 12}
        fill="#777"
        fontSize={11}
        fontFamily={MONO_FONT}
        textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
      >
        {new Date(payload.value).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <AreaChart
        data={historyRate}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.7} />
            <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="date"
          ticks={xTicks}
          interval={0}
          tick={renderXTick}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          domain={[min, max]}
          ticks={yTicks}
          tickFormatter={(v) => v.toFixed(4)}
          tick={{ fill: "#777", fontSize: 11, fontFamily: MONO_FONT }}
          axisLine={false}
          tickLine={false}
          width={55}
        />

        {yTicks.map((v) => (
          <ReferenceLine
            key={v}
            y={v}
            stroke="#666"
            strokeDasharray="2 4"
            strokeWidth={1.5}
          />
        ))}

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#666", strokeDasharray: "3 3" }}
        />

        <Area
          type="linear"
          dataKey="rate"
          stroke={LINE_COLOR}
          strokeWidth={2}
          fill="url(#rateGradient)"
          baseValue={min}
          dot={false}
          activeDot={{ r: 4, fill: LINE_COLOR, stroke: "none" }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
