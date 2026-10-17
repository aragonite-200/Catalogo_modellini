import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { BarChartBox } from "@/components/CartesianChart";
import { LatestModels } from "@/components/LatestModels";
import { PieChartBox } from "@/components/PieChartBox";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedBox } from "@/components/ThemedBox";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { linkTo } from "expo-router/build/global-state/router";
import { syncWidgetImages } from "../../../components/WindgetImagesync";

import addModelWidget from "../../../../widgets/addModelWidget";
import StatsWidget from "../../../../widgets/statsWidget";

export default function HomeScreen() {
  interface StatScala {
    scala: number;
    totalePerScala: number;
  }

  interface StatMarca {
    marca: string;
    totalePerMarca: number;
  }

  const db = useSQLiteContext();
  const [totaleModellini, setTotaleModellini] = useState<number>(0);
  const [valore, setValore] = useState<number>(0);
  const [statsScale, setStatsScale] = useState<StatScala[]>([]);
  const [statsMarche, setStatsMarche] = useState<StatMarca[]>([]);

  if (Platform.OS === "ios") {
    syncWidgetImages(db);
    StatsWidget.updateSnapshot({
      totModellini: totaleModellini,
      valoreStimato: valore,
    });
    addModelWidget.updateSnapshot({});
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  };

  async function load() {
    const totModellini = await db.getFirstAsync<{ totale: number }>(
      "SELECT COUNT(id) as totale FROM modellini",
    );
    if (totModellini) {
      await AsyncStorage.setItem("totModellini", String(totaleModellini));
      setTotaleModellini(totModellini.totale);
    }

    const totValore = await db.getFirstAsync<{ totalePrezzo: number }>(
      `SELECT SUM(prezzo) as totalePrezzo FROM modellini`,
    );
    if (totValore && totValore.totalePrezzo > 0) {
      setValore(totValore.totalePrezzo);
    } else {
      setValore(0);
    }

    const scaleResult = await db.getAllAsync<StatScala>(
      "SELECT scala, COUNT(id) as totalePerScala FROM modellini GROUP BY scala ORDER BY totalePerScala DESC",
    );
    setStatsScale(scaleResult);

    const marcheResult = await db.getAllAsync<StatMarca>(
      "SELECT marca, COUNT(id) as totalePerMarca FROM modellini GROUP BY marca ORDER BY totalePerMarca DESC",
    );
    setStatsMarche(marcheResult);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ThemedSafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ThemedView style={styles.container}>
          <ThemedView style={{ gap: 0 }}>
            <ThemedText style={styles.subtitle}>
              Tutti i tuoi modellini, in un unico posto
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={{
              gap: 15,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <ThemedBox style={styles.statCard}>
              <ThemedText style={styles.label}>MODELLINI</ThemedText>
              <ThemedText style={styles.value}>{totaleModellini}</ThemedText>
            </ThemedBox>

            <ThemedBox style={styles.statCard}>
              <ThemedText style={styles.label}>VALORE STIMATO</ThemedText>
              <ThemedText style={styles.value}>{valore.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</ThemedText>
            </ThemedBox>
          </ThemedView>

          <ThemedBox>
            <ThemedText style={styles.label}>
              Distribuzione per scala
            </ThemedText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              {/* GRAFICO */}
              <PieChartBox
                data={statsScale.map((item) => ({
                  label: String(item.scala),
                  value: item.totalePerScala,
                }))}
              />
            </View>
          </ThemedBox>

          <ThemedBox>
            <ThemedText style={styles.label}>
              Distribuzione per marca
            </ThemedText>
            <BarChartBox
              data={statsMarche.map((item) => ({
                label: String(item.marca),
                value: item.totalePerMarca,
              }))}
              maxItems={5}
            />
          </ThemedBox>

          <ThemedBox>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ThemedText style={styles.label}>Ultimi Arrivi</ThemedText>
              <TouchableOpacity
                onPress={() => {
                  linkTo("/(tabs)/collection");
                }}
              >
                <ThemedText type="linkPrimary">Vedi Tutti</ThemedText>
              </TouchableOpacity>
            </View>

            <LatestModels limit={5} />
          </ThemedBox>
        </ThemedView>
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: 20,
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
  },

  title: {
    textAlign: "left",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  subtitle: {
    textAlign: "left",
    fontSize: 15,
    opacity: 0.78,
  },

  label: {
    fontSize: 11,
    letterSpacing: 0.9,
    fontWeight: "700",
    opacity: 0.72,
  },

  value: {
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.4,
    flexShrink: 1,
    includeFontPadding: false,
  },

  statCard: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 8,
  },

  chart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  legend: {
    flex: 1,
    gap: 6,
  },
});
