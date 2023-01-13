import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RooNavigation from './src/navigations/RootNavigation';

export default function ScreensModule(props) {
  return (
    <SafeAreaProvider>
      <RooNavigation />
    </SafeAreaProvider>
  );
}
