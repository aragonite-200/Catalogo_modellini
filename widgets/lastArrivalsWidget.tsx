"use no memo";

import { HStack, VStack, Text, Image, Spacer } from '@expo/ui/swift-ui';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import { font, foregroundStyle, padding, frame, background, clipShape, resizable, aspectRatio, shapes, } from '@expo/ui/swift-ui/modifiers';

// widgetsDirectory (da expo-widgets) è la directory condivisa tra app e widget
// è garantita accessibile anche dal processo separato dell'estensione widget su iOS.


type lastArrivalWidgetProps = {
    // Nomi file (non path completi) delle ultime immagini, già copiate in
    // widgetsDirectory da syncWidgetImages() lato app. Vedi widgetImagesSync.ts.
    images: string[];
};

const lastArrivalsWidget = (props: lastArrivalWidgetProps, environment: WidgetEnvironment) => {
    'widget';

    // function getImageUri(filename: string): string {
    //     return `${widgetsDirectory}${filename}`;
    // }
    const isDark = environment.colorScheme === 'dark';

    const RED = isDark ? '#da0008' : '#E10600';
    const CARD_BG = isDark ? '#000000' : '#F2F2F7';
    const GRAY = '#8E8E93';
    const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#000000';
    const PLACEHOLDER_BG = isDark ? '#1C1C1E' : '#E5E5EA';

    const m = environment.widgetContentMargins ?? { top: 16, bottom: 16, leading: 16, trailing: 16 };
    const cardModifiers = [
        padding({ top: m.top, bottom: m.bottom, leading: m.leading, trailing: m.trailing }),
        frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'topLeading' }),
        background(CARD_BG),
    ];

    // Ogni cella della griglia: riempie lo spazio disponibile nella riga/colonna,
    // ritaglia l'immagine a riempimento (fill) mantenendo le proporzioni, angoli arrotondati
    const gridCellModifiers = [
        resizable(),
        aspectRatio({ contentMode: 'fill', ratio: 1 }),
        frame({ maxWidth: Infinity, maxHeight: Infinity }),
        clipShape('roundedRectangle', 10),
    ];

    const GridCell = ({ filename }: { filename?: string }) => {
        if (!filename) {
            // Placeholder per slot vuoti (es. collezione con meno di 4 modelli)
            return (
                <VStack modifiers={[
                    frame({ maxWidth: Infinity, maxHeight: Infinity }),
                    background(PLACEHOLDER_BG, shapes.roundedRectangle({ cornerRadius: 10 })),
                ]}>
                    <Spacer />
                </VStack>
            );
        }
        return <Image uiImage={filename} modifiers={gridCellModifiers} />;
    };

    return (
        <VStack alignment="leading" spacing={10} modifiers={cardModifiers}>
            {/* Header */}
            <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(TEXT_PRIMARY)]}>
                Ultimi arrivi
            </Text>

            {/* Griglia 2x2 */}
            <VStack spacing={6} modifiers={[frame({ maxWidth: Infinity, maxHeight: Infinity })]}>
                <HStack spacing={6} modifiers={[frame({ maxWidth: Infinity, maxHeight: Infinity })]}>
                    <GridCell filename={props.images?.[0]} />
                    <GridCell filename={props.images?.[1]} />
                </HStack>
                <HStack spacing={6} modifiers={[frame({ maxWidth: Infinity, maxHeight: Infinity })]}>
                    <GridCell filename={props.images?.[2]} />
                    <GridCell filename={props.images?.[3]} />
                </HStack>
            </VStack>

            {/* Footer */}
            <HStack alignment="center">
                <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>Aggiornato ora</Text>
                <Spacer />
                <Image systemName="arrow.triangle.2.circlepath" color={GRAY} size={12} />
            </HStack>
        </VStack>
    );
};

const Widget = createWidget('lastArrivalsWidget', lastArrivalsWidget);
export default Widget;