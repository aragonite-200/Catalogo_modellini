import { View } from "react-native";
import { Pie, PolarChart } from "victory-native";
import { ThemedText } from '@/components/themed-text';

const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"];

function getColor(index: number) {
  return colors[index % colors.length];
}

type PieDatum = {
  label: string;
  value: number;
};

type PieChartBoxProps = {
  data: PieDatum[];
};

export function PieChartBox({ data }: PieChartBoxProps) {

  const chartData = data.map((item, index) => ({
    ...item,
    color: getColor(index),
  }));

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>

      {/* PIE */}
      <View style={{ width: 160, height: 160 }}>
        <PolarChart
          data={chartData}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius={40} />
        </PolarChart>
      </View>

      {/* LEGGENDA */}
      <View style={{ marginLeft: 16, gap: 6 }}>
        {data.map((item, index) => (
          <View
            key={item.label}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: getColor(index),
              }}
            />

            <ThemedText style={{ fontSize: 12 }}>
              {item.label}
            </ThemedText>

            <ThemedText style={{ fontWeight: "bold" }}>
              {item.value}
            </ThemedText>
          </View>
        ))}
      </View>

    </View>
  );
}