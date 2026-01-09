import { videoManager } from '@/app/services/VideoManager';
import PauseIcon from '@/assets/icons/pause.png';
import PlayIcon from '@/assets/icons/play.png';
import { useEvent } from 'expo';
import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import { memo, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { VideoBaseProps } from './types';

const Video = memo(({ index, url, classname, autoplay, showControls = true, isActive = true, thumbnail }: VideoBaseProps) => {

    const player = videoManager.getPlayer(index)

    // ! Handle more logic for player. Catch errors etc.
    // const { status } = useEvent(player, 'statusChange', { status: player.status, });
    useEvent(player, 'playingChange');

    const toggle = useCallback(() => {
        if (player.playing) {
            player.pause()
        } else {
            player.play()
        }
    }, [player,])

    useEffect(() => {
        if (isActive && url) {
            player.replaceAsync(url);

            if (autoplay) {
                player.play();
            } else {
                player.pause();
            }

        }
    }, [isActive, url, player, autoplay]);

    return (
        <View className={`relative ${classname}`}>
            {showControls && <Pressable className='absolute h-20 w-20 top-5 left-5 items-center justify-center z-10 bg-white/50 rounded-full p-5' onPress={toggle}>
                <Image
                    style={style.playPause}
                    source={player.playing ? PauseIcon : PlayIcon}
                    contentFit="cover"
                />
            </Pressable>}

            <VideoView
                className={classname}
                style={style.video}
                player={player}
                contentFit="cover"
                nativeControls={false}
                allowsVideoFrameAnalysis={false}
            />
        </View>
    );
});

const style = StyleSheet.create({
    playPause: {
        width: '100%',
        height: '100%'
    },
    video: {
        height: '100%',
        width: '100%',
    }
})

export default Video