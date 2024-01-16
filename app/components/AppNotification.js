import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, Text} from 'react-native';
const AppNotification = ({type, text}) => {
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(height, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);

  const backgroundColor =
    type === 'error' ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 255, 0, 0.7)';

  return (
    <Animated.View style={[styles.container, {height, backgroundColor}]}>
      <Text style={{color: '#fff', fontSize: 16}}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});

export default AppNotification;
