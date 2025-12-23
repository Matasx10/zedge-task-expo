import { store } from '@/app/store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaView className='flex-1'>
      <GestureHandlerRootView className='flex-1'>
        <Provider store={store}>
          <View className='bg-black flex-1'>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="[assetId]" options={{ presentation: 'modal', title: 'Video' }} />
            </Stack>
            <StatusBar style="auto" />
          </View>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
