import { BottomSheet, Button, Column, Host, Icon, Text } from "@expo/ui";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedPicker } from "@/components/Themed-picekr";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedBox } from "@/components/ThemedBox";
import { ThemedLucideIcon } from "@/components/ThemedLucidIcon";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function addModel() {
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useTheme();

  const [image_path, set_image_path] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [scala, setscala] = useState<string | null>(null);

  const [imagePicked, setImagePicked] = useState("");
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

  const [isPresented, setIsPresented] = useState(false);

  // Su iOS la sheet SwiftUI è un modale: se lanci il picker mentre sta ancora
  // animando la chiusura, il picker non si presenta o viene chiuso subito.
  // Chiudiamo la sheet e lanciamo l'azione solo dopo che l'animazione è finita.
  const closeSheetThen = (action: () => void) => {
    setIsPresented(false);
    const delay = Platform.OS === "ios" ? 500 : 0;
    setTimeout(action, delay);
  };

  async function ensureImagesDirectory(): Promise<string> {
    const dir = `${FileSystem.documentDirectory}images/`;
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return dir;
  }

  // Salva l'immagine e ritorna SOLO il filename
  async function saveImageAndGetPath(temporaryUri: string): Promise<string> {
    const filename = `${Date.now()}_${temporaryUri.split("/").pop()}`;
    const dir = await ensureImagesDirectory();

    await FileSystem.copyAsync({
      from: temporaryUri,
      to: `${dir}${filename}`,
    });

    return filename;
  }

  const handleImageResult = async (result: ImagePicker.ImagePickerResult) => {
    // Se l'utente annulla non facciamo nulla: è un'azione normale.
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setSelectedImage(uri);
    setImagePicked("");
    set_image_path(await saveImageAndGetPath(uri));
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permesso necessario",
          "Per scattare una foto, devi concedere il permesso di accesso alla fotocamera.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      await handleImageResult(result);
    } catch (error) {
      console.log("takePhoto error:", error);
      Alert.alert("Errore", "Impossibile aprire la fotocamera.");
    }
  };

  const pickImageAsync = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      await handleImageResult(result);
    } catch (error) {
      console.log("pickImageAsync error:", error);
      Alert.alert("Errore", "Impossibile aprire la galleria.");
    }
  };

  const reset = () => {
    set_image_path("");
    setSelectedImage(undefined);
    setscala(null);
    setImagePicked("");
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
  };

  const save = async () => {
    // Pulisco gli errori della volta precedente
    setImagePicked("");
    setAlertMarca("");
    setAlertModello("");
    setAlertProduttore("");
    setAlertPrezzo("");
    setAlertscala("");

    if (!selectedImage) {
      setImagePicked(
        "Devi selezionare o scattare una foto del modellino prima di salvarlo.",
      );
    }
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

    if (!selectedImage || !marca || !modello || !produttore || !scala) {
      return;
    }

    if (prezzo && isNaN(Number(prezzo))) {
      setAlertPrezzo("Il prezzo deve essere un numero valido");
      return;
    }

    try {
      const result = await db.runAsync(
        "INSERT INTO modellini (marca, modello, produttore, versione, prezzo, scala, foto_path) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          marca,
          modello,
          produttore,
          versione,
          prezzo ? parseFloat(prezzo) : null,
          scala,
          image_path,
        ],
      );

      if (result) {
        Alert.alert("Salvato!", "Modellino aggiunto con successo!", [
          {
            text: "OK",
            onPress: () => {
              reset();
              router.replace("/(tabs)/collection");
            },
          },
        ]);
      }
    } catch (error) {
      console.log("save error:", error);
      Alert.alert("Errore", "Non sono riuscito a salvare il modellino.");
    }
  };

  return (
    <ThemedSafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          <TouchableOpacity onPress={() => setIsPresented(true)}>
            <ThemedBox
              style={{
                width: "100%",
                height: 200,
                borderStyle: "dashed",
                borderWidth: 1,
                borderColor: theme.border,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View style={{ alignItems: "center" }}>
                  <ThemedLucideIcon
                    style={{ opacity: 0.5 }}
                    name="camera"
                    size={50}
                  />
                  <ThemedText>Aggiungi foto</ThemedText>
                  <ThemedText style={styles.subtitle}>
                    Tocca per scattare o caricare
                  </ThemedText>
                </View>
              )}
            </ThemedBox>
          </TouchableOpacity>
          {!!imagePicked && (
            <ThemedText style={styles.alert}>{imagePicked}</ThemedText>
          )}

          <View>
            <ThemedText style={styles.label}>Marca Veicolo</ThemedText>
            <ThemedTextInput
              placeholder="Marca"
              style={{ width: "100%" }}
              value={marca}
              onChangeText={onChangeMarca}
            />
            {!!AlertMarca && (
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
            {!!AlertModello && (
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
            {!!AlertProduttore && (
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
            {!!AlertVersione && (
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
            {!!AlertPrezzo && (
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
            {!!Alertscala && (
              <ThemedText style={styles.alert}>{Alertscala}</ThemedText>
            )}
          </View>

          <TouchableOpacity onPress={save}>
            <View
              style={{
                width: "100%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.primary,
                borderRadius: 8,
              }}
            >
              <ThemedText
                style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
              >
                Aggiungi Modellino
              </ThemedText>
            </View>
          </TouchableOpacity>

          {/* Bottom Sheet per scelta immagini o fotografia */}
          <Host style={{ flex: 1 }}>
            <BottomSheet
              isPresented={isPresented}
              onDismiss={() => setIsPresented(false)}
            >
              <Column spacing={12}>
                <Text
                  textStyle={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: theme.text,
                  }}
                >
                  Scegli l'azione che vuoi effettuare.
                </Text>

                <Button
                  variant="text"
                  onPress={() => closeSheetThen(pickImageAsync)}
                >
                  <Icon
                    name={Icon.select({
                      ios: "photo",
                      android: require("@expo/material-symbols/image.xml"),
                    })}
                    size={30}
                    color={theme.text}
                  />
                  <Text
                    textStyle={{ color: theme.text }}
                    style={{ paddingBottom: 12 }}
                  >
                    Carica immagine
                  </Text>
                </Button>

                <Button
                  variant="text"
                  onPress={() => closeSheetThen(takePhoto)}
                >
                  <Icon
                    name={Icon.select({
                      ios: "camera",
                      android: require("@expo/material-symbols/camera.xml"),
                    })}
                    size={30}
                    color={theme.text}
                  />
                  <Text textStyle={{ color: theme.text }}>Scatta foto</Text>
                </Button>
              </Column>
            </BottomSheet>
          </Host>
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

  alert: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});