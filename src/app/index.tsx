import * as Device from 'expo-device';
import { Platform, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';




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
  return (
    <ThemedSafeAreaView >
      <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator={false}>
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
                  <ThemedText style={styles.value}>67</ThemedText>
            </ThemedBox>

            <ThemedBox style={{ flex: 1, minWidth: 150 }}>
                  <ThemedText style={styles.label}>Valore Stimato</ThemedText>
                  <ThemedText style={styles.value}>67</ThemedText>
            </ThemedBox>
          </ThemedView>

            <ThemedBox>
              <ThemedText style={styles.label}>Distribuzione per scala</ThemedText>
              <View style={{flexDirection: "row", alignItems: "center", gap: 16,}}>
    
                {/* GRAFICO */}
                <PieChartBox
                  data={[
                    { label: "Ferrari", value: 20 },
                    { label: "Mercedes", value: 15 },
                    { label: "Red Bull", value: 32 },
                  ]}
                />
              </View>
            </ThemedBox>

            <ThemedBox>
              <ThemedText style={styles.label}>Distribuzione per marca</ThemedText>
              <BarChartBox
                data={[
                  { label: "Ferrari", value: 20 },
                  { label: "Mercedes", value: 15 },
                  { label: "Red Bull", value: 32 },
                  { label: "Alfa Romeo", value: 10},
                  { label: "Seat", value: 20},
                ]}
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
