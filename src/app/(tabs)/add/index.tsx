import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
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
          <View style={{ gap: 0 }}>
            <ThemedText style={styles.subtitle}>Completa i dettagli della tua nuova miniatura</ThemedText>
          </View>
          <TouchableOpacity onPress={() => setIsPresented(true)}>
            <ThemedBox
              style={{
                width: "100%",
                height: 220,
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
                borderRadius: 16,
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
          <Modal
            visible={isPresented}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={() => setIsPresented(false)}
          >
            <View style={styles.sheetOverlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setIsPresented(false)}
              />
              <View style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
                <View style={styles.sheetHandle} />
                <ThemedText style={styles.sheetTitle}>Aggiungi una foto</ThemedText>
                <ThemedText style={styles.sheetSubtitle}>
                  Scegli una foto dalla galleria o scatta una nuova immagine.
                </ThemedText>
                <TouchableOpacity
                  style={[styles.sheetAction, { backgroundColor: theme.backgroundSelected }]}
                  activeOpacity={0.75}
                  onPress={() => closeSheetThen(pickImageAsync)}
                >
                  <View style={[styles.sheetIcon, { backgroundColor: theme.primary + "18" }]}>
                    <ThemedLucideIcon name="images" size={21} style={{ color: theme.primary }} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText style={styles.sheetActionTitle}>Scegli dalla galleria</ThemedText>
                    <ThemedText style={styles.sheetActionHint}>Usa una foto già presente sul dispositivo</ThemedText>
                  </View>
                  <ThemedLucideIcon name="chevron-right" size={20} style={{ color: theme.textSecondary }} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sheetAction, { backgroundColor: theme.backgroundSelected }]}
                  activeOpacity={0.75}
                  onPress={() => closeSheetThen(takePhoto)}
                >
                  <View style={[styles.sheetIcon, { backgroundColor: theme.primary + "18" }]}>
                    <ThemedLucideIcon name="camera" size={21} style={{ color: theme.primary }} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText style={styles.sheetActionTitle}>Scatta una foto</ThemedText>
                    <ThemedText style={styles.sheetActionHint}>Apri la fotocamera</ThemedText>
                  </View>
                  <ThemedLucideIcon name="chevron-right" size={20} style={{ color: theme.textSecondary }} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetCancel}
                  onPress={() => setIsPresented(false)}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.sheetCancelText}>Annulla</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
    gap: 18,
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
  },

  subtitle: {
    textAlign: "left",
    fontSize: 14,
    opacity: 0.75,
    marginTop: 0,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
    opacity: 0.82,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(10, 16, 24, 0.48)",
  },
  sheet: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 12,
  },
  sheetHandle: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#AAB3BE",
    alignSelf: "center",
    marginBottom: 5,
  },
  sheetTitle: {
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 14,
    opacity: 0.75,
    marginBottom: 5,
  },
  sheetAction: {
    minHeight: 72,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 12,
  },
  sheetIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetActionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  sheetActionHint: {
    fontSize: 12,
    opacity: 0.72,
  },
  sheetCancel: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  sheetCancelText: {
    fontSize: 15,
    fontWeight: "700",
    opacity: 0.78,
  },

  alert: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
