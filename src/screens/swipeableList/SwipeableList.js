import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TouchableOpacity,
  FlatList,
} from 'react-native-gesture-handler';

const windowDimensions = Dimensions.get('window');
const BUTTON_WIDTH = 80;
const MAX_TRANSLATE = -BUTTON_WIDTH;

const data = [
  {
    id: '1',
    title: 'Kate Bell',
  },
  {
    id: '2',
    title: 'John Appleseed',
  },
  {
    id: '3',
    title: 'Steve Jobs',
  },
  {
    id: '4',
    title: 'Iron Man',
  },
  {
    id: '5',
    title: 'Captain America',
  },
  {
    id: '6',
    title: 'Batman',
  },
  {
    id: '7',
    title: 'Matt Smith',
  },
];

function SwipableList() {
  const [dataItems, setDataItems] = useState(data);
  function onRemove(id) {
    const newItems = dataItems.filter((item) => item.id !== id);
    setDataItems(newItems);
  }

  return (
    <View style={s.container}>
      <FlatList
        data={dataItems}
        renderItem={({item}) => (
          <ListItem item={item} onRemove={() => onRemove(item.id)} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const springConfig = (velocity) => {
  'worklet';

  return {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    velocity,
  };
};

const timingConfig = {
  duration: 400,
  easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
};

function ListItem({item, onRemove}) {
  const isRemoving = useSharedValue(false);
  const isEditing = useSharedValue(false);
  const translateX = useSharedValue(0);

  const handler = useAnimatedGestureHandler({
    onStart: (_evt, ctx) => {
      ctx.startX = translateX.value;
    },

    onActive: (evt, ctx) => {
      const nextTranslate = evt.translationX + ctx.startX;
      translateX.value = Math.max(nextTranslate, MAX_TRANSLATE);
    },

    onEnd: (evt) => {
      if (evt.translationX < -50 && translateX.value < 0) {
        translateX.value = withSpring(
          MAX_TRANSLATE,
          springConfig(evt.velocityX),
        );
      } else if (evt.translationX > 50 && translateX.value > 0) {
        translateX.value = withSpring(
          -MAX_TRANSLATE,
          springConfig(evt.velocityX),
        );
      } else {
        translateX.value = withSpring(0, springConfig(evt.velocityX));
      }
    },
  });

  function handleRightbuttonClick() {
    isRemoving.value = true;
  }

  function handleLeftbuttonClick() {
    isEditing.value = true;
  }

  const styles = useAnimatedStyle(() => {
    if (isRemoving.value || isEditing.value) {
      return {
        height: withDelay(
          0,
          withTiming(0, timingConfig, () => {
            runOnJS(onRemove)();
          }),
        ),
        transform: [
          {
            translateX: isRemoving.value
              ? withTiming(-2 * windowDimensions.width, timingConfig)
              : withTiming(2 * windowDimensions.width, timingConfig),
          },
        ],
      };
    }

    return {
      height: 78,
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  return (
    <View style={s.item}>
      <PanGestureHandler activeOffsetX={[-10, 10]} onGestureEvent={handler}>
        <Animated.View style={styles}>
          <View style={[s.leftButtons]}>
            <Button
              item={{
                title: 'Archive',
                backgroundColor: 'green',
                color: 'white',
                onPress: handleLeftbuttonClick,
                type: 'left',
              }}
            />
          </View>
          <ListItemContent item={item} />
          <View style={[s.rightButtons]}>
            <Button
              item={{
                title: 'Delete',
                backgroundColor: 'red',
                color: 'white',
                onPress: handleRightbuttonClick,
                type: 'right',
              }}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

function Button({item}) {
  return (
    <View
      style={[s.button, item.type === 'right' ? s.rightSpace : s.leftSpace]}>
      <TouchableOpacity
        onPress={item.onPress}
        style={[s.buttonInner, {backgroundColor: item.backgroundColor}]}>
        <Text style={{color: item.color}}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
}

function ListItemContent({item}) {
  return (
    <View style={s.itemContainer}>
      <View style={s.avatarContainer}>
        <Text style={s.avatarText}>{item.title[0]}</Text>
      </View>
      <Text style={s.title}>{item.title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: 'white',
  },
  title: {
    fontSize: 18,
    marginLeft: 16,
  },
  rightButtons: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: windowDimensions.width,
    width: windowDimensions.width,
    justifyContent: 'center',
  },
  leftButtons: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: windowDimensions.width,
    width: windowDimensions.width,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    width: windowDimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSpace: {
    paddingRight: windowDimensions.width - BUTTON_WIDTH,
  },
  leftSpace: {
    paddingLeft: windowDimensions.width - BUTTON_WIDTH,
  },
  buttonInner: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: BUTTON_WIDTH,
  },
});

export default SwipableList;
