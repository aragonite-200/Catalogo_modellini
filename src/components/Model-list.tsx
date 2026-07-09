import { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { linkTo } from 'expo-router/build/global-state/router';
import { useSQLiteContext } from 'expo-sqlite';
import { ThemedBox } from "./ThemedBox";
import { Spacing } from '@/constants/theme';
import { useTheme } from "@/hooks/use-theme";

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

    async function load() {
      console.log("carico")
      const rows = await db.getAllAsync<Model>(
        'SELECT * FROM modellini ORDER BY created_at DESC'
      );
      setData(rows);
    }

  useEffect(() => {
    console.log("use effect")
    load();
  }, [query, refreshTrigger]);

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
    <View
      style={{
        gap: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {data.map((item) => (
        <ThemedBox key={item.id} style={{flex: 1, minWidth: 150, padding: 0, overflow: "hidden", minHeight: 150}}>
          <Image
            source={{ uri: item.foto_path }}
            style={{
              width: "100%",
              height: 100,
              backgroundColor: "#ccc",
            }}
          />

          <View style={{padding: Spacing.two, paddingTop: Spacing.half}}>
            <ThemedText style={{fontWeight: "bold"}} type="default">{item.marca} {item.modello}</ThemedText>
            <ThemedText style={{fontSize: 14, opacity: 0.7,}}>{item.produttore}</ThemedText>
            <View style={{alignSelf: "flex-end", }}>
              <ThemedText style={[{borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10, borderWidth: 1 , borderColor: theme.primary,  backgroundColor:theme.primary + "20", fontSize: 14, opacity: 0.7}]}>{item.scala}</ThemedText>
            </View>
            
          </View>

          
        </ThemedBox>
      ))}
    </View>
  );
}