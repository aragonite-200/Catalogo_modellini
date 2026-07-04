import { useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { useFont } from "@shopify/react-native-skia";

import spaceMonoFont from "@/assets/fonts/SpaceMono-Regular.ttf";

const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

function getColor(index: number) {
  return colors[index % colors.length];
}

type BarDatum = {
  label: string;
  value: number;
};

type BarChartBoxProps = {
  data: BarDatum[];
  maxItems?: number;
  height?: number;
};

export function BarChartBox({ data, maxItems, height = 220 }: BarChartBoxProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const font = useFont(spaceMonoFont, 11);

  const visibleData = maxItems ? data.slice(0, maxItems) : data;

  const chartData = visibleData.map((item, index) => ({
    x: index,
    value: item.value,
  }));

  const itemCount = Math.max(visibleData.length, 1);

  // Valore massimo per fissare il dominio y (con un minimo per evitare grafici vuoti)
  const maxValue = Math.max(...visibleData.map((item) => item.value), 1);

  const barWidth = containerWidth > 0
    ? Math.min(32, Math.max(12, (containerWidth / itemCount) * 0.5))
    : 20;

  const rightPadding = containerWidth > 0
    ? Math.max(16, (containerWidth / itemCount) * 0.25)
    : 20;

  // Padding sinistro con un minimo fisso, così la prima barra
  // non tocca mai le etichette dell'asse y
  const leftPadding = Math.max(28, rightPadding);

  function handleLayout(event: LayoutChangeEvent) {
    setContainerWidth(event.nativeEvent.layout.width);
  }

  return (
    <View style={{ width: "100%", height }} onLayout={handleLayout}>
      {font && containerWidth > 0 && (
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["value"]}
          domain={{ y: [0, maxValue] }}
          domainPadding={{ left: leftPadding, right: rightPadding, top: 20 }}
          axisOptions={{
            font,
            tickCount: { x: itemCount, y: 4 },
            formatXLabel: (value) => visibleData[value]?.label ?? "",
            lineColor: "#71717a30",
            labelColor: "#71717a",
          }}
        >
          {({ points, chartBounds }) =>
            points.value.map((point, index) => (
              <Bar
                key={index}
                points={[point]}
                chartBounds={chartBounds}
                color={getColor(index)}
                roundedCorners={{ topLeft: 6, topRight: 6 }}
                barWidth={barWidth}
              />
            ))
          }
        </CartesianChart>
      )}
    </View>
  );
}