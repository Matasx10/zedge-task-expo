import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

export interface SwitchOption<T> {
    title: string;
    value: T;
}

interface SwitchProps<T> {
    options: SwitchOption<T>[];
    value: T;
    onSelect: (value: T) => void;
}

export default function Switch<T>({
    options,
    value,
    onSelect,
}: SwitchProps<T>) {

    const [containerWidth, setContainerWidth] = useState(0);


    const padding = 8;
    const segmentWidth = containerWidth ? (containerWidth - padding) / options.length : 0;

    const selectedIndex = options.findIndex(opt => opt.value === value);
    const safeIndex = selectedIndex === -1 ? 0 : selectedIndex;

    const translateX = useSharedValue(0);
    const context = useSharedValue(0);

    useEffect(() => {
        if (segmentWidth > 0) {
            translateX.value = withSpring(safeIndex * segmentWidth);
        }
    }, [safeIndex, segmentWidth, translateX]);

    const handleSelection = (index: number) => {
        if (index !== safeIndex) {
            onSelect(options[index].value);
        }
    };

    const onLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            context.value = translateX.value;
        })
        .onUpdate((event) => {
            const nextValue = event.translationX + context.value;
            const maxTranslate = (options.length - 1) * segmentWidth;
            translateX.value = Math.min(Math.max(nextValue, 0), maxTranslate);
        })
        .onEnd((event) => {
            const closestIndex = Math.round(translateX.value / segmentWidth);
            let finalIndex = closestIndex;

            if (event.velocityX > 500 && closestIndex < options.length - 1) {
                finalIndex = Math.min(closestIndex + 1, options.length - 1);
            } else if (event.velocityX < -500 && closestIndex > 0) {
                finalIndex = Math.max(closestIndex - 1, 0);
            }

            translateX.value = withSpring(finalIndex * segmentWidth);
            runOnJS(handleSelection)(finalIndex);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        width: segmentWidth,
    }));

    if (!options || options.length === 0) return null;

    return (
        <GestureDetector gesture={panGesture}>
            <View
                onLayout={onLayout}
                className="relative flex-row bg-black rounded-[15px] p-1 border border-[1px] border-white border-dashed w-full"
            >

                {segmentWidth > 0 && (
                    <Animated.View
                        className="absolute bg-[#A2C53D] h-[42px] top-1 left-1 rounded-[10px]"
                        style={animatedStyle}
                    />
                )}

                {options.map((option, index) => (
                    <Pressable
                        key={index}
                        onPress={() => handleSelection(index)}
                        className="h-[42px] justify-center items-center z-10 flex-1"
                    >
                        <Text
                            className={`font-semibold text-[15px] ${safeIndex === index ? 'text-white' : 'text-[#8E8E93]'}`}>
                            {option.title}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </GestureDetector>
    );
}