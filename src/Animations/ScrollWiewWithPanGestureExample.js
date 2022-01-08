import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDecay,
  cancelAnimation,
} from 'react-native-reanimated';

const titles = ["What's", 'up', 'mobile', 'devs?'];
const {width: PAGE_WIDTH} = Dimensions.get('window');
const MAX_TRANSLATE_X = -PAGE_WIDTH * (titles.length - 1);

const Page = ({index, title, translateX}) => {
  const pageOffset = PAGE_WIDTH * index;
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value + pageOffset}],
    };
  });

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: `rgba(0,0,256,0.${index + 2})`,
          alignItems: 'center',
          justifyContent: 'center',
        },
        rStyle,
      ]}>
      <Text
        style={{
          fontSize: 70,
          fontWeight: '700',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
        {title}
      </Text>
    </Animated.View>
  );
};

export default function App() {
  const translateX = useSharedValue(0);

  const clampedTranslateX = useDerivedValue(() => {
    return Math.max(Math.min(translateX.value, 0), MAX_TRANSLATE_X);
  });

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.x = clampedTranslateX.value;
      cancelAnimation(translateX);
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
    },
    onEnd: event => {
      translateX.value = withDecay({velocity: event.velocityX});
    },
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={{flex: 1, flexDirection: 'row'}}>
          {titles.map((title, index) => {
            return (
              <Page
                key={index.toString()}
                translateX={clampedTranslateX}
                index={index}
                title={title}
              />
            );
          })}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
