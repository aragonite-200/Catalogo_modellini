"use no memo";

import { HStack, VStack, Text, Image, Spacer } from '@expo/ui/swift-ui';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import { font, foregroundStyle, padding, frame, background } from '@expo/ui/swift-ui/modifiers';



type statsWidgetProps = {
  totModellini: number;
  valoreStimato: number;
};




const statsWidget = (props: statsWidgetProps, environment: WidgetEnvironment) => {
    'widget';

    const isDark = environment.colorScheme === 'dark';

    const RED = isDark? '#da0008': '#E10600';
    const BLUE = '#0A84FF';
    const CARD_BG = isDark ? '#000000' : '#F2F2F7';
    const GRAY = '#8E8E93';
    const WHITE = isDark ? '#FFFFFF' : '#000000';

    // Formatta i valori grandi in modo compatto (€ 1.2k, € 3.4M) per far stare
    // più informazione in poco spazio senza tagliare il testo
    const formatCompact = (value: number) => {
        if (value >= 1_000_000) return `€ ${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `€ ${(value / 1_000).toFixed(1)}k`;
        return `€ ${value.toLocaleString('it-IT')}`;
    };

    const avgValue = props.totModellini > 0 ? props.valoreStimato / props.totModellini : 0;

    const m = environment.widgetContentMargins ?? { top: 16, bottom: 16, leading: 16, trailing: 16 };
    const cardModifiers = [
        padding({ top: m.top, bottom: m.bottom, leading: m.leading, trailing: m.trailing }),
        frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'topLeading' }),
        background(CARD_BG),
    ];

    const StatBlock = ({ value, label, color }: { value: string; label: string; color: string }) => (
        <VStack alignment="leading" spacing={2}>
            <Text modifiers={[font({ size: 22, weight: 'bold' }), foregroundStyle(color)]}>{value}</Text>
            <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>{label}</Text>
        </VStack>
        );


    //renderizza il widget in base alle dimensioni
    if (environment.widgetFamily === 'systemSmall') {
        return(
            <VStack alignment="leading" spacing={0} modifiers={cardModifiers}>
                {/* Header: icona brand + refresh */}
                <HStack alignment="center">
                <Image systemName="car.2.fill" color={RED} size={18} />
                <Spacer />
                <Image systemName="arrow.triangle.2.circlepath" color={GRAY} size={11} />
                </HStack>

                <Spacer />

                {/* Statistica principale */}
                <VStack alignment="leading" spacing={2}>
                    <Text modifiers={[font({ size: 32, weight: 'bold' }), foregroundStyle(RED)]}>
                        {String(props.totModellini)}
                    </Text>
                    <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>Modellini</Text>
                </VStack>

                <Spacer />

                {/* Dato secondario: valore stimato, compatto */}
                <HStack alignment="center" spacing={4}>
                    <Image systemName="eurosign.circle.fill" color={RED} size={12} />
                    <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(WHITE)]}>
                        {formatCompact(props.valoreStimato)}
                    </Text>
                </HStack>
            </VStack>
        )
    }

    if (environment.widgetFamily === 'systemMedium') {
        return(
             <VStack alignment="leading" spacing={14} modifiers={cardModifiers}>
                <HStack alignment="center">
                <Image systemName="car.2.fill" color={RED} size={16} />
                <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(WHITE)]}>
                    La mia collezione
                </Text>
                <Spacer />
                <Image systemName="arrow.triangle.2.circlepath" color={GRAY} size={13} />
                </HStack>

                <HStack alignment="top" spacing={26}>
                <StatBlock value={String(props.totModellini)} label="Modellini" color={RED} />
                <StatBlock
                    value={formatCompact(props.valoreStimato)}
                    label="Valore stimato"
                    color={WHITE}
                />
                <StatBlock
                    value={formatCompact(avgValue)}
                    label="Valore medio"
                    color={BLUE}
                />
                </HStack>

                <Spacer />

                <HStack alignment="center">
                <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>Aggiornato ora</Text>
                <Spacer />
                <Image systemName="chevron.right" color={GRAY} size={11} />
                </HStack>
            </VStack>
        )
    }
    
    return(
        <VStack >
            <HStack >
                <VStack >
                    <Text >Totale Modellini</Text>
                    <Text >{props.totModellini}</Text>
                </VStack>
                <VStack >
                    <Text >Valore Stimato</Text>
                    <Text >{props.valoreStimato}</Text>
                </VStack>
            </HStack>
        </VStack>
    )
    
    
    
}

const Widget = createWidget('statsWidget', statsWidget);
export default Widget;