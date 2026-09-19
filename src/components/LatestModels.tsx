import * as FileSystem from "expo-file-system/legacy";
import { linkTo } from "expo-router/build/global-state/router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

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
type Props = {
  limit?: number;
};

export function LatestModels({ limit = 5 }: Props) {
  const db = useSQLiteContext();
  const [data, setData] = useState<Model[]>([]);

  useEffect(() => {
    async function load() {
      const rows = await db.getAllAsync<Model>(
        "SELECT * FROM modellini ORDER BY created_at DESC LIMIT ?",
        limit,
      );
      setData(rows);
    }
    load();
  }, [limit]);

  function getImageUri(filename: string): string {
    return `${FileSystem.documentDirectory}images/${filename}`;
  }

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
    <View style={{ gap: 12 }}>
      {data.map((item) => (
        <View
          key={item.id}
          style={{
            alignItems: "left",
            gap: 12,
          }}
        >
          <Image
            source={{ uri: getImageUri(item.foto_path) }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              backgroundColor: "#ccc",
            }}
          />
        </View>
      ))}
    </View>
  );
}
