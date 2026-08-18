import * as FileSystem from 'expo-file-system/legacy';
import { widgetsDirectory } from 'expo-widgets';
import { type SQLiteDatabase } from 'expo-sqlite';
import lastArrivalsWidget from '../../widgets/lastArrivalsWidget';

type ModelRow = {
    foto_path: string;
};

/**
 * Copia le foto degli ultimi `limit` modellini in widgetsDirectory (accessibile
 * anche dall'estensione widget) e aggiorna il widget "Ultimi arrivi" con i
 * nomi file risultanti.
 *
 * TODO: Da chiamare dopo ogni insert/delete di un modellino, e all'avvio dell'app per tenere il widget allineato.
 */
export async function syncWidgetImages(db: SQLiteDatabase, limit = 4): Promise<void> {
    const rows = await db.getAllAsync<ModelRow>(
        'SELECT foto_path FROM modellini ORDER BY created_at DESC LIMIT ?',
        limit
    );

    // Assicura che la cartella condivisa esista
    const dirInfo = await FileSystem.getInfoAsync(widgetsDirectory);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(widgetsDirectory, { intermediates: true });
    }

    const filenames: string[] = [];

    for (const row of rows) {
        const sourceUri = `${FileSystem.documentDirectory}images/${row.foto_path}`;
        const destUri = `${widgetsDirectory}${row.foto_path}`;

        const destInfo = await FileSystem.getInfoAsync(destUri);
        if (!destInfo.exists) {
            try {
                await FileSystem.copyAsync({ from: sourceUri, to: destUri });
            } catch (err) {
                // Il file sorgente potrebbe non esistere più
                // salta questo modello invece di far fallire tutto il sync
                console.warn('syncWidgetImages: impossibile copiare', row.foto_path, err);
                continue;
            }
        }

        filenames.push(row.foto_path);
    }

    // rimuovi da widgetsDirectory le immagini che
    // non sono più tra le ultime `limit`, per non far crescere la cartella
    // all'infinito nel tempo
    const existingFiles = await FileSystem.readDirectoryAsync(widgetsDirectory);
    const keep = new Set(filenames);
    for (const file of existingFiles) {
        if (!keep.has(file)) {
            await FileSystem.deleteAsync(`${widgetsDirectory}${file}`, { idempotent: true });
        }
    }

    const imageUris = filenames.map(f => `${widgetsDirectory}${f}`);
    lastArrivalsWidget.updateSnapshot({ images: imageUris });
}