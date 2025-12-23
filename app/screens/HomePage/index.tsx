import { Text, View } from 'react-native';

import { Asset, useGetHomepageDataQuery } from '@/app/store/api';
import { Switch } from '@/components/Switch';
import { Video } from '@/components/Video';
import { useIsFocused } from '@react-navigation/native';
import { FlashList, FlashListRef, ListRenderItem, ViewToken } from "@shopify/flash-list";
import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type OptionsValueType, SWITCH_OPTIONS, VIEWABILITY_CONFIG } from './deps';

export default function HomeScreen() {
    const isFocused = useIsFocused()
    const [viewWidth, setViewWidth] = useState<number>()
    const { data, isLoading } = useGetHomepageDataQuery(undefined)
    const [selectedSwitchValue, setSelectedSwitchValue] = useState<OptionsValueType>('CAT')
    const [viewableIds, setViewableIds] = useState<string[]>([]);
    const listRef = useRef<FlashListRef<Asset>>(null);

    const filteredData = useMemo(() => {
        return data?.filter(({ type }) => type === selectedSwitchValue)
    }, [data, selectedSwitchValue])

    const handleSwitch = useCallback((value: OptionsValueType) => {
        setSelectedSwitchValue(value)
        setViewableIds([])
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
        listRef.current?.recomputeViewableItems()
    }, [])

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<Asset>[] }) => {
        const ids = viewableItems.map(v => v.item.id);
        setViewableIds(ids);
    }, []);

    const clearViewableIds = useCallback(() => {
        setViewableIds([])
    }, [])

    const renderItem: ListRenderItem<Asset> = useCallback(({ item, index }) => {
        if (!viewWidth) {
            return null
        }

        const isFullWidth = item.layout === 'FULL_WIDTH'

        return (
            <Link
                href={`/${item.id}`}
                style={{ height: isFullWidth ? viewWidth : viewWidth / 2 }}
                className="bg-black m-[8px] rounded-lg border-2 border-white overflow-hidden"
            >
                <Link.Trigger>
                    <View className="h-full w-full">

                        <View className="h-[80%] w-full bg-slate-900 overflow-hidden">
                            <Video
                                classname="absolute inset-0 w-full h-full"
                                autoplay={item.autoplay}
                                isActive={viewableIds.includes(item.id)}
                                url={item.videoUrl}
                                showControls={!item.autoplay}
                            />
                        </View>

                        <View className="h-[20%] w-full bg-black p-2 justify-center">
                            <Text className="text-white font-bold text-[14px]" numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text className="text-white text-[11px] opacity-60" numberOfLines={1}>
                                {item.description}
                            </Text>
                        </View>

                    </View>
                </Link.Trigger>
            </Link>
        );
    }, [viewWidth, viewableIds])

    useEffect(() => {
        if (isFocused) {
            listRef.current?.recomputeViewableItems()
        } else {
            clearViewableIds()
        }
    }, [clearViewableIds, isFocused])

    return (
        <View className='flex-1 bg-black p-[8px]' onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}>
            <View className='p-[8px]'>
                <Switch<OptionsValueType>
                    options={SWITCH_OPTIONS}
                    onSelect={handleSwitch}
                    value={selectedSwitchValue}
                />
            </View>
            {!viewWidth || isLoading ?
                <Text>Loading</Text>
                : <FlashList
                    ref={listRef}
                    style={{ flex: 1 }}
                    onViewableItemsChanged={onViewableItemsChanged}
                    data={filteredData}
                    renderItem={renderItem}
                    getItemType={(item) => item.layout + selectedSwitchValue}
                    numColumns={2}
                    extraData={viewableIds}
                    removeClippedSubviews={true}
                    overrideItemLayout={(layout, item) => {
                        layout.span = item.layout === 'FULL_WIDTH' ? 2 : 1
                    }}
                    viewabilityConfig={VIEWABILITY_CONFIG}
                />}
        </View>
    );
}