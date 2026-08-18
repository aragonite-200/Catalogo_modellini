import * as Device from 'expo-device';
import { Platform, StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Image, RefreshControl} from 'react-native';
import {useState, useEffect} from 'react';
import { Lucide } from '@react-native-vector-icons/lucide';
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
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ModelList } from '@/components/Model-list';
import * as FileSystem from 'expo-file-system/legacy';

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

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totaleModellini, setTotModellini] = useState("0")

  const aggiornaTotale = async () => {
    setTotModellini(await AsyncStorage.getItem('totModellini') ?? "0");
  }

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    aggiornaTotale();
    setTimeout(() => setRefreshing(false), 800);
  };

  useEffect(() => {
    aggiornaTotale();
  }, [])

  function getImageUri(filename: string): string {
  return `${FileSystem.documentDirectory}images/${filename}`;
}

  return (
    <ThemedSafeAreaView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>
        <ThemedView style={styles.container}>
          <ThemedView style={{ gap: 2 }}>
            <ThemedText style={[styles.title, Platform.OS === "android" && { marginTop: 16 }]}>La Collezione</ThemedText>
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

          <ThemedText style={styles.subtitle}>{totaleModellini} modellini</ThemedText>

          <ModelList query={text} refreshTrigger={refreshKey}/>


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
