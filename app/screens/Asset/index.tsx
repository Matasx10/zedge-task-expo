import { useGetItemDataQuery } from '@/app/store/api';
import { Video } from '@/components/Video';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { FC, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

const Asset: FC = () => {
    const { assetId } = useLocalSearchParams();

    const { data, isLoading } = useGetItemDataQuery(String(assetId))

    const copyToClipboard = useCallback(async () => {
        if (!data?.videoUrl) return

        await Clipboard.setStringAsync(data.videoUrl);
    }, [data?.videoUrl]);

    if (isLoading) {
        return <Text>Loading</Text>
    }

    if (!data) {
        return <Text>No data</Text>
    }

    return (
        <View className='flex-1 bg-black p-[16px]'>
            <View className='flex-[0.8]'>
                <Video autoplay url={data.videoUrl} />
                <Pressable className='w-full h-[50px] border-2 border-white border-dotted items-center justify-center rounded-full bg-[#A2C53D] mt-2'
                    onPress={copyToClipboard} >
                    <Text className='text-white font-bold text-xl'>Share</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default Asset

