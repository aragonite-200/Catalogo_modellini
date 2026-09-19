import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import * as FileSystem from "expo-file-system/legacy";
import { linkTo } from "expo-router/build/global-state/router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedBox } from "./ThemedBox";

type Model = {
  id: number;
  marca: string;
  modello: string;
  produttore: string;
  versione: string | null;
  prezzo: number | null;
  scala: string;
  foto_path: string;
  created_at: string;
};

interface ModelListProps {
  query: string;
  refreshTrigger: number;
}

export function ModelList({ query, refreshTrigger }: ModelListProps) {
  const theme = useTheme();
  const db = useSQLiteContext();
  const [data, setData] = useState<Model[]>([]);
  const [selectedItem, setSelectedItem] = useState<Model | null>(null);

  async function load() {
    const rows = await db.getAllAsync<Model>(
      "SELECT * FROM modellini ORDER BY created_at DESC",
    );
    setData(rows);
  }

  async function deleteModel(item: Model) {
    try {
      await db.runAsync("DELETE FROM modellini WHERE id = ?", [item.id]);
      await load(); // ricarica la lista aggiornata
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
      Alert.alert("Errore", "Non è stato possibile cancellare il modellino.");
    }
  }

  function confirmDelete(item: Model) {
    Alert.alert(
      "Elimina modellino",
      `Vuoi eliminare "${item.marca} ${item.modello}"? Questa azione non può essere annullata.`,
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: () => deleteModel(item),
        },
      ],
    );
  }

  // --- LETTURA: ricostruisce il path assoluto CORRENTE a partire dal filename ---
  function getImageUri(filename: string): string {
    return `${FileSystem.documentDirectory}images/${filename}`;
  }

  useEffect(() => {
    load();
  }, [query, refreshTrigger]);

  //TODO modificare icona e testo quando non ci sono modelli
  if (data.length === 0) {
    return (
      <TouchableOpacity
        onPress={() => {
          linkTo("/(tabs)/add");
        }}
      >
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <ThemedText style={{ fontSize: 14, opacity: 0.6 }}>
            Nessun modello inserito
          </ThemedText>
          <ThemedText style={{ fontSize: 12, opacity: 0.4 }}>
            Aggiungi il tuo primo modellino 🚗
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <View
        style={{
          gap: 12,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {data.map((item) => {
          if (
            item.produttore.toLowerCase().includes(query.toLowerCase()) ||
            item.marca.toLowerCase().includes(query.toLowerCase()) ||
            item.modello.toLowerCase().includes(query.toLowerCase()) ||
            item.scala.toLowerCase().includes(query.toLowerCase())
          )
            return (
              <ThemedBox
                key={item.id}
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding: 0,
                  overflow: "hidden",
                  minHeight: 150,
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedItem(item)}
                  activeOpacity={0.8}
                  onLongPress={() => confirmDelete(item)}
                  delayLongPress={400}
                >
                  <Image
                    source={{ uri: getImageUri(item.foto_path) }}
                    style={{
                      width: "100%",
                      height: 100,
                      backgroundColor: "#ccc",
                    }}
                  />
                  <View
                    style={{ padding: Spacing.two, paddingTop: Spacing.half }}
                  >
                    <ThemedText style={{ fontWeight: "bold" }} type="default">
                      {item.marca} {item.modello}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 14, opacity: 0.7 }}>
                      {item.produttore}
                    </ThemedText>
                    <View style={{ alignSelf: "flex-end" }}>
                      <ThemedText
                        style={{
                          borderRadius: 8,
                          paddingVertical: 4,
                          paddingHorizontal: 10,
                          borderWidth: 1,
                          borderColor: theme.primary,
                          backgroundColor: theme.primary + "20",
                          fontSize: 14,
                          opacity: 0.7,
                        }}
                      >
                        {item.scala}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              </ThemedBox>
            );
        })}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedItem}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSelectedItem(null)}
          />

          {selectedItem && (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.background ?? "#fff" },
              ]}
            >
              <Image
                source={{ uri: getImageUri(selectedItem.foto_path) }}
                style={styles.cardImage}
              />

              <TouchableOpacity
                onPress={() => setSelectedItem(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              <ScrollView
                style={styles.cardBody}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <View style={styles.titleRow}>
                  <ThemedText style={styles.title}>
                    {selectedItem.marca} {selectedItem.modello}
                  </ThemedText>
                  <View
                    style={[
                      styles.badge,
                      {
                        borderColor: theme.primary,
                        backgroundColor: theme.primary + "20",
                      },
                    ]}
                  >
                    <ThemedText style={{ fontSize: 13, opacity: 0.8 }}>
                      {selectedItem.scala}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.infoList}>
                  <InfoRow
                    label="Produttore"
                    value={selectedItem.produttore}
                    theme={theme}
                  />
                  {selectedItem.versione && (
                    <InfoRow
                      label="Versione"
                      value={selectedItem.versione}
                      theme={theme}
                    />
                  )}
                  {selectedItem.prezzo != null && (
                    <InfoRow
                      label="Prezzo"
                      value={`€ ${selectedItem.prezzo.toFixed(2)}`}
                      theme={theme}
                    />
                  )}
                  <InfoRow
                    label="Aggiunto il"
                    value={new Date(selectedItem.created_at).toLocaleDateString(
                      "it-IT",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                    theme={theme}
                  />
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

function InfoRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={{ fontSize: 13, opacity: 0.5 }}>{label}</ThemedText>
      <ThemedText style={{ fontSize: 15, fontWeight: "500" }}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#ccc",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cardBody: {
    padding: 18,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  badge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  infoList: {
    gap: 10,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#00000020",
    paddingBottom: 8,
  },
});
