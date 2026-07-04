import { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { linkTo } from 'expo-router/build/global-state/router';

type Model = {
  id: string;
  name: string;
  image: string;
  createdAt: string;
};

type Props = {
  limit?: number;
};

export function LatestModels({ limit = 5 }: Props) {
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

      setData(sorted.slice(0, limit));
    }

    //load();
  }, [limit]);

//TODO modificare icona e testo quando non ci sono modelli
  if (data.length === 0 ) {
    return (
        <TouchableOpacity onPress={() => {
          linkTo("/add-model");
        }}>
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
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              backgroundColor: "#ccc",
            }}
          />

          <ThemedText style={{ fontSize: 14 }}>
            {item.name}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}