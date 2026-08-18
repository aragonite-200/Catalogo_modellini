"use no memo";

import { HStack, VStack, Text, Image, Spacer } from '@expo/ui/swift-ui';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import { font, foregroundStyle, padding, frame, background, widgetURL } from '@expo/ui/swift-ui/modifiers';

const addModelWidget = (props: {}, environment: WidgetEnvironment) => {
    'widget';

    const isDark = environment.colorScheme === 'dark';

    const RED = isDark ? '#da0008' : '#E10600';
    const CARD_BG = isDark ? '#000000' : '#F2F2F7';
    const GRAY = '#8E8E93';
    const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#000000';

    const m = environment.widgetContentMargins ?? { top: 16, bottom: 16, leading: 16, trailing: 16 };
    
    const cardModifiers = [
        // DEEP LINK: Cambia questo URL con la rotta reale della tua app (es. 'mia-app://aggiungi' o simile)
        widgetURL('tuapp://add-model'), 
        padding({ top: m.top, bottom: m.bottom, leading: m.leading, trailing: m.trailing }),
        frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'center' }),
        background(CARD_BG),
    ];

    return (
        <VStack alignment="center" modifiers={cardModifiers}>
            {/* Spacer elastico superiore */}
            <Spacer />
            
            {/* Blocco Centrale (Icona + Testi) */}
            <Image systemName="plus.circle" color={RED} size={42} />
            
            <VStack alignment="center" spacing={4} modifiers={[padding({ top: 8 })]}>
                <Text modifiers={[font({ size: 16, weight: 'bold' }), foregroundStyle(TEXT_PRIMARY)]}>
                    Aggiungi Modellino
                </Text>

                {/* Blocco testo grigio separato riga per riga per centratura sicura */}
                <VStack alignment="center" spacing={2}>
                    <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>Scatta o carica una foto</Text>
                    <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>per aggiungere</Text>
                    <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>un nuovo modellino</Text>
                </VStack>
            </VStack>

            {/* Spacer elastico inferiore */}
            <Spacer />

            {/* Footer orizzontale, forzato a larghezza massima */}
            <HStack alignment="center" modifiers={[frame({ maxWidth: Infinity })]}>
                <Text modifiers={[font({ size: 11 }), foregroundStyle(GRAY)]}>Aggiornato ora</Text>
                <Spacer />
                <Image systemName="arrow.triangle.2.circlepath" color={GRAY} size={11} />
            </HStack>
        </VStack>
    );
};

const Widget = createWidget('addModelWidget', addModelWidget);
export default Widget;