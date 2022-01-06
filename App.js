import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useSharedValue} from 'react-native-reanimated/src/reanimated2/hook/useSharedValue';

const {height, width} = Dimensions.get('window');
const WORDS = ["What's", 'up', 'mobile', 'devs?'];
const SQUARE_SIZE = width * 0.7;

const Page = ({title, index, translateX}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {scale: 1},
      ],
    };
  });

  return (
    <View
      style={[
        styles.pageContainer,
        {backgroundColor: `rgba(0,0,256,0.${index + 2})`},
      ]}>
      <Animated.View style={[styles.square, rStyle]} />
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
  },
});

export default App;
