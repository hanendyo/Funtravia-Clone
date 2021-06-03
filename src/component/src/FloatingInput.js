import React, { useState, useEffect } from "react";
import { TextInput, View, StyleSheet, Animated } from "react-native";

export default function FloatingInput({
  customStyle,
  customTextStyle,
  label,
  ...otherProps
}) {
  let [isFocused, setIsFocused] = useState(false);
  const animatedFocus = new Animated.Value(otherProps.value === "" ? 0 : 1);
  let containerStyle = [styles.main, customStyle];
  let textStyle = [styles.textInput, customTextStyle];

  const labelStyle = {
    position: "absolute",
    fontFamily: "Lato-Regular",
    left: 0,
    top: animatedFocus.interpolate({
      inputRange: [0, 0],
      outputRange: [20, 1],
    }),
    fontSize: animatedFocus.interpolate({
      inputRange: [0, 0],
      outputRange: [12, 12],
    }),
    color: animatedFocus.interpolate({
      inputRange: [0, 1],
      outputRange: ["#A0A0A0", "#A0A0A0"],
    }),
  };
  useEffect(() => {
    Animated.timing(animatedFocus, {
      toValue: isFocused || otherProps.value !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={containerStyle}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={textStyle}
        {...otherProps}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 10,
  },
  textInput: {
    marginTop: 15,
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 30,
    fontFamily: "Lato-Regular",
    padding: 0,
  },
});
