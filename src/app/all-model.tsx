import * as Device from 'expo-device';
import { Platform, StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Image} from 'react-native';
import {useState, useEffect} from 'react';
import { Lucide } from '@react-native-vector-icons/lucide';

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
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ModelList } from '@/components/Model-list';

type Model = {
  id: string;
  name: string;
  image: string;
  marca: string;
  scala: string;
  createdAt: string;
};



export default function AllModels() {
  
  const [text, onChangeText] = useState("");
  const [data, setData] = useState<Model[]>([]);
  
    useEffect(() => {
      async function load() {
        const res = await fetch("https://YOUR_API/models"); 
        const json: Model[] = await res.json();
  
        // ordina per data (più recenti prima)
        const sorted = json.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
  
        setData(sorted.slice(0));
      }
  
      //load();
    })

  return (
    <ThemedSafeAreaView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.container}>
          <ThemedView style={{ gap: 2 }}>
            <ThemedText style={styles.title}>La Collezione</ThemedText>
          </ThemedView>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-between"}}>

            <ThemedTextInput
              placeholder="Cerca marca, modello o scala..."
              onChangeText={onChangeText}
              value={text}
              style={{ flex: 1}}
            />

            <TouchableOpacity>
              <Lucide name="funnel" size={35} />
            </TouchableOpacity>

          </View>

          <ThemedText style={styles.subtitle}>67 modellini</ThemedText>

          <ModelList/>


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
