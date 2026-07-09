import * as Device from 'expo-device';
import { Platform, StyleSheet, ScrollView, View, TouchableOpacity, RefreshControl} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';



import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import {ThemedBox} from '@/components/ThemedBox';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { PieChartBox } from "@/components/PieChartBox";
import { BarChartBox } from "@/components/CartesianChart";
import { LatestModels } from '@/components/LatestModels';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { linkTo } from 'expo-router/build/global-state/router';


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

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true)
    load().finally(() => setRefreshing(false));;
  };

    async function load() {
      const totModellini = await db.getFirstAsync<{ totale: number }>('SELECT COUNT(id) as totale FROM modellini');
      if (totModellini) {
        setTotaleModellini(totModellini.totale);
        await AsyncStorage.setItem('totModellini', String(totaleModellini));
      }

      const  totValore = await db.getFirstAsync<{ totalePrezzo: number}>(`SELECT SUM(prezzo) as totalePrezzo FROM modellini`);
      if(totValore && totValore.totalePrezzo > 0) {
        setValore(totValore.totalePrezzo);
      } else {
        setValore(0);
      }

      const scaleResult = await db.getAllAsync<StatScala>('SELECT scala, COUNT(id) as totalePerScala FROM modellini GROUP BY scala ORDER BY totalePerScala DESC');
      setStatsScale(scaleResult);

      const marcheResult = await db.getAllAsync<StatMarca>('SELECT marca, COUNT(id) as totalePerMarca FROM modellini GROUP BY marca ORDER BY totalePerMarca DESC');
      setStatsMarche(marcheResult);
    }

  useEffect(() => {
    load()
  }, [])

  return (
    <ThemedSafeAreaView >
      <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator={false}  refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>
        <ThemedView style={styles.container}>
          <ThemedView style={{ gap: 2 }}>
            <ThemedText style={styles.title}>Bentornato</ThemedText>
            <ThemedText style={styles.subtitle}>
              Ecco il riepilogo della tua collezione
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
            <ThemedBox style={{ flex: 1, minWidth: 150 }}>
                  <ThemedText style={styles.label}>Totale Modellini</ThemedText>
                  <ThemedText style={styles.value}>{totaleModellini}</ThemedText>
            </ThemedBox>

            <ThemedBox style={{ flex: 1, minWidth: 150 }}>
                  <ThemedText style={styles.label}>Valore Stimato</ThemedText>
                  <ThemedText style={styles.value}>{valore}</ThemedText>
            </ThemedBox>
          </ThemedView>

            <ThemedBox>
              <ThemedText style={styles.label}>Distribuzione per scala</ThemedText>
              <View style={{flexDirection: "row", alignItems: "center", gap: 16,}}>
    
                {/* GRAFICO */}
                <PieChartBox
                  data={
                    statsScale.map((item) => ({
                      label: String(item.scala),
                      value: item.totalePerScala,
                    }))}
                />
              </View>
            </ThemedBox>

            <ThemedBox>
              <ThemedText style={styles.label}>Distribuzione per marca</ThemedText>
              <BarChartBox
                data={
                  statsMarche.map((item) => ({
                    label: String(item.marca),
                    value: item.totalePerMarca,
                  }))
                }
                maxItems={5}
              />
            </ThemedBox>

            <ThemedBox>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <ThemedText style={styles.label}>Ultimi Arrivi</ThemedText>
                  <TouchableOpacity onPress={() => {
                    linkTo("/all-model");
                  }}>
                    <ThemedText type='linkPrimary'>Vedi Tutti</ThemedText>
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
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
  },

  title: {
    textAlign: "left",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitle: {
    textAlign: "left",
    fontSize: 13,
    opacity: 0.7,
    marginTop: 0,
  },

  label: {
    fontSize: 14,
    opacity: 0.7,
  },

  value: {
    fontSize: 25,
    fontWeight: "bold",
    
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
