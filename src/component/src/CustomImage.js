import React from 'react';
import {Image, TouchableOpacity, StyleSheet, View} from 'react-native';

export default function CustomImage({
  source,
  customStyle,
  isTouchable,
  onPress,
  customImageStyle,
}) {
  //use default style, if explicitly different, use custom style, and take otherProps
  return isTouchable ? (
    <TouchableOpacity style={[styles.container, customStyle]} onPress={onPress}>
      <Image source={source} style={[styles.default, customImageStyle]} />
    </TouchableOpacity>
  ) : (
    <View style={[styles.container, customStyle]}>
      <Image source={source} style={[styles.default, customImageStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    resizeMode: 'contain',
    width: null,
    height: null,
  },
  container: {
    width: 65,
    height: 65,
  },
});
