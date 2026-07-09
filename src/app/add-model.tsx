import * as Device from 'expo-device';
import { Platform, StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useState, useEffect} from 'react';
import { Lucide } from '@react-native-vector-icons/lucide';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';

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
import { ThemedLucideIcon } from '@/components/ThemedLucidIcon';
import { useTheme } from '@/hooks/use-theme';
import { ThemedPicker } from '@/components/Themed-picekr';
import { Color } from 'expo-router';

type Model = {
  id: string;
  name: string;
  image: string;
  marca: string;
  scala: string;
  createdAt: string;
};



export default function addModel() {
  
  const db = useSQLiteContext();
  const [image_path, set_image_path] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [scala, setscala] = useState<string | null>(null);

  const [marca, onChangeMarca] = useState("");
  const [modello, onChangeModello] = useState("");
  const [produttore, onChangeProduttore] = useState("");
  const [versione, onChangeVersione] = useState("");
  const [prezzo, onChangePrezzo] = useState("");
  const [AlertMarca, setAlertMarca] = useState("");
  const [AlertModello, setAlertModello] = useState("");
  const [AlertProduttore, setAlertProduttore] = useState("");
  const [AlertVersione, setAlertVersione] = useState("");
  const [AlertPrezzo, setAlertPrezzo] = useState("");
  const [Alertscala, setAlertscala] = useState("");


  const theme = useTheme();

  async function saveImageAndGetPath(temporaryUri: string): Promise<string> {
    const filename = `${Date.now()}_${temporaryUri.split('/').pop()}`;
    const newPath = `${FileSystem.documentDirectory}images/${filename}`;

    

    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}images/`, {
      intermediates: true,
    });


    await FileSystem.copyAsync({
      from: temporaryUri,
      to: newPath,
    });

    return newPath;
  }

   const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      set_image_path(await saveImageAndGetPath(result.assets[0].uri));

    } else {
      alert('Non hai selezionato nessuna immagine.');
    }
  };

  const reset = () => {
    set_image_path("");
    setSelectedImage(undefined);
    setscala(null);
    onChangeMarca("");
    onChangeModello("");
    onChangeProduttore("");
    onChangeVersione("");
    onChangePrezzo("");
    setAlertMarca("");
    setAlertModello("");
    setAlertProduttore("");
    setAlertVersione("");
    setAlertPrezzo("");
    setAlertscala("");
  }

  const save = async () => {
    if (!marca) {
      setAlertMarca("Inserisci la marca del modellino");
    }
    if (!modello) {
      setAlertModello("Inserisci il modello del modellino");
    }
    if (!produttore) {
      setAlertProduttore("Inserisci il produttore del modellino");
    }
    if (!scala) {
      setAlertscala("Inserisci la scala del modellino");
    }

    if (!marca || !modello || !produttore || !scala) {
      return;
    }

    if (prezzo && isNaN(Number(prezzo))) {
      setAlertPrezzo("Il prezzo deve essere un numero valido");
      return;
    }


    console.log("Salvataggio modellino:", { marca, modello, produttore, versione, prezzo, scala, selectedImage });

    const result = await db.runAsync(
      'INSERT INTO modellini (marca, modello, produttore, versione, prezzo, scala, foto_path) VALUES (?, ?, ?, ?, ?, ?, ? )',
      [marca, modello, produttore, versione, prezzo ? parseFloat(prezzo) : null, scala, image_path ]
    )

    if(result) {
      Alert.alert("Salvato!", "Modellino aggiunto con successo!", [
        {
          text: "OK",
          onPress: () => {linkTo("/all-model"); reset();},
        }
      ])
    }

  }

  return (
    <ThemedSafeAreaView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.container}>
          <ThemedView style={{ gap: 2 }}>
            <ThemedText style={styles.title}>Aggiungi Modellino</ThemedText>
          </ThemedView>

          <TouchableOpacity onPress={pickImageAsync}>
            <ThemedBox style={{ width: "100%", height: 200, borderStyle: "dashed", borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
              
              
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <>
                <View style={{ alignItems: "center" }}>
                
                    <ThemedLucideIcon style={{ opacity: 0.5,  }} name="camera" size={50} />
                    <ThemedText>Aggiungi foto</ThemedText>
                    <ThemedText style={styles.subtitle}>Tocca per scattare o caricare</ThemedText>
                  </View>
                </>
              )}
            </ThemedBox>
          </TouchableOpacity>
          
          <View>
            <ThemedText style={styles.label}>Marca Veicolo</ThemedText>
            <ThemedTextInput
              placeholder="Marca"
              style={{ width: "100%" }}
              value={marca}
              onChangeText={onChangeMarca}
            />
            {AlertMarca && (
              <ThemedText style={styles.alert}>{AlertMarca}</ThemedText>
            )}
          </View>

          <View>
            <ThemedText style={styles.label}>Modello Veicolo</ThemedText>
            <ThemedTextInput
              placeholder="Modello"
              style={{ width: "100%" }}
              value={modello}
              onChangeText={onChangeModello}
            />
            {AlertModello && (
              <ThemedText style={styles.alert}>{AlertModello}</ThemedText>
            )}
          </View>

          <View>
            <ThemedText style={styles.label}>Produttore Modellino</ThemedText>
            <ThemedTextInput
              placeholder="Produttore"
              style={{ width: "100%" }}
              value={produttore}
              onChangeText={onChangeProduttore}
            />
            {AlertProduttore && (
              <ThemedText style={styles.alert}>{AlertProduttore}</ThemedText>
            )}
          </View>

          <View>
            <ThemedText style={styles.label}>Versione (opzionale)</ThemedText>
            <ThemedTextInput
              placeholder="Versione"
              style={{ width: "100%" }}
              value={versione}
              onChangeText={onChangeVersione}
            />
            {AlertVersione && (
              <ThemedText style={styles.alert}>{AlertVersione}</ThemedText>
            )}
          </View>

          <View>
            <ThemedText style={styles.label}>Prezzo (opzionale)</ThemedText>
            <ThemedTextInput
              placeholder="Prezzo"
              style={{ width: "100%" }}
              value={prezzo}
              onChangeText={onChangePrezzo}
              keyboardType="numeric"
            />
            {AlertPrezzo && (
              <ThemedText style={styles.alert}>{AlertPrezzo}</ThemedText>
            )}
          </View>

          <View>
            <ThemedText style={styles.label}>Scala Modellino</ThemedText>
            <ThemedPicker
              value={scala}
              onChange={setscala}
              items={[
                { label: "1:18", value: "1:18" },
                { label: "1:24", value: "1:24" },
                { label: "1:43", value: "1:43" },
                { label: "1:64", value: "1:64" },
                { label: "Altro", value: "altro" },
              ]}
            />
            {Alertscala && (
              <ThemedText style={styles.alert}>{Alertscala}</ThemedText>
            )}
          </View>

          <TouchableOpacity onPress={save}>
            <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center", backgroundColor: theme.primary, borderRadius: 8 }}>
              <ThemedText style={[{ color: "white", fontWeight: "bold", fontSize: 15 }]}>Aggiungi Modellino</ThemedText>
            </View>
          </TouchableOpacity>

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

  alert: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
