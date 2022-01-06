import React from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';

const {height, width} = Dimensions.get('window');
const {Extrapolate} = Animated;
const WORDS = ["What's", 'up', 'mobile', 'devs?'];
const SQUARE_SIZE = width * 0.7;

const Page = ({title, index, translateX}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP,
    );

    const borderRadius = interpolate(
      translateX.value,
      inputRange,
      [0, SQUARE_SIZE / 2, 0],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      transform: [{scale}],
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      translateX.value,
      inputRange,
      [height / 2, 0, -height / 2],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      translateX.value,
      inputRange,
      [-2, 1, -2],
      Extrapolate.CLAMP,
    );
    return {
      opacity,
      transform: [
        {
          translateY: translateY,
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.pageContainer,
        {backgroundColor: `rgba(0,0,256,0.${index + 2})`},
      ]}>
      <Animated.View style={[styles.square, rStyle]}>
        <Animated.View style={[{position: 'absolute'}, rTextStyle]}>
          <Text style={styles.text}>{title}</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const App = () => {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateX.value = event.contentOffset.x;
  });

  return (
    <Animated.ScrollView
      style={styles.container}
      horizontal
      scrollEventThrottle={16}
      onScroll={scrollHandler}>
      {WORDS.map((item, index) => {
        return (
          <Page
            key={index.toString()}
            index={index}
            title={item}
            translateX={translateX}
          />
        );
      })}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // page
  pageContainer: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    backgroundColor: 'rgba(0,0,256,1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 70,
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});

export default App;
