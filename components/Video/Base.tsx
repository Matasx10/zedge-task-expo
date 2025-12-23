import PauseIcon from '@/assets/icons/pause.png';
import PlayIcon from '@/assets/icons/play.png';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { memo, useCallback, useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';
import { VideoBaseProps } from './types';

const Video = memo(({ url, classname, autoplay, showControls = true, isActive = true, thumbnail }: VideoBaseProps) => {
    const player = useVideoPlayer((isActive) ? url : null, player => {
        player.loop = true;
        player.muted = true
        player.staysActiveInBackground = false
    });

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
        if (isActive && autoplay) {
            player.play();
        } else {
            player.pause();
        }
    }, [autoplay, player, isActive]);
    // ! We could show thumbnail while video is being rendered. 
    return (
        <View className={`relative ${classname}`}>
            {showControls && <Pressable className='absolute h-20 w-20 top-5 left-5 items-center justify-center z-10 bg-white/50 rounded-full p-5' onPress={toggle}>
                <Image
                    className='w-full h-full'
                    source={player.playing ? PauseIcon : PlayIcon}
                    resizeMode="cover" />
            </Pressable>}

            <VideoView
                className={classname}
                style={{ height: '100%', width: '100%', }}
                player={player}
                contentFit="cover"
                nativeControls={false}
            />
        </View>

    );
});

export default Video