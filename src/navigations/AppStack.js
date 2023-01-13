import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WithTimingAnimate from '../screens/withTiming/WithTimingPage';
import AnimatedScrollPage from '../screens/animatedScroll/AnimatedScrollPage';
import SwipableList from '../screens/swipeableList/SwipeableList';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SwipableList" component={SwipableList} />
      <Stack.Screen name="AnimatedScrollPage" component={AnimatedScrollPage} />
      <Stack.Screen name="WithTimingAnimate" component={WithTimingAnimate} />
    </Stack.Navigator>
  );
}

export default AppStack;
