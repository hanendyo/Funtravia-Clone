import React, { ReactChild } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  StyleProp,
  TextStyle,
  TextProps,
  Animated,
  Pressable,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from "react-native";
import normalize from "react-native-normalize";

import Ripple from "react-native-material-ripple";

export default function Button({
  children = null,
  style,
  onPress,
  size = "medium",
  color = "primary",
  type = "box",
  text = null,
  position = "left",
  variant = "normal",
  ...otherProps
}) {
  if (type == "icon") {
    return (
      <TouchableOpacity
        // rippleCentered={true}

        style={[
          buttonSize[size],
          buttonColor[color],
          {
            borderRadius: 5,
            flexDirection: "row",
            paddingHorizontal: 20,
          },
          buttonVariant[variant][color],
          style,
        ]}
        allowFontScaling={false}
        onPress={onPress ? onPress : null}
        {...otherProps}
      >
        {position == "left" ? children : null}
        {text ? (
          <Text
            allowFontScaling={false}
            style={[
              fontSize[size],
              fontColor[variant][color],
              { marginHorizontal: 10, textAlign: "center" },
            ]}
          >
            {text}
          </Text>
        ) : null}

        {position == "right" ? children : null}
      </TouchableOpacity>
    );
  } else if (type == "circle") {
    return (
      <TouchableOpacity
        // rippleCentered={true}

        style={[
          buttonSize[size],
          buttonColor[color],
          {
            borderRadius: buttonSize[size].height / 2,
          },
          { width: buttonSize[size].height },
          buttonVariant[variant][color],
          style,
        ]}
        allowFontScaling={false}
        onPress={onPress ? onPress : null}
        {...otherProps}
      >
        {position == "left" ? children : null}
        {text ? (
          <Text
            allowFontScaling={false}
            style={[
              fontSize[size],
              fontColor[variant][color],
              { marginHorizontal: 10, textAlign: "center" },
            ]}
          >
            {text}
          </Text>
        ) : null}

        {position == "right" ? children : null}
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        // rippleCentered={true}

        style={[
          buttonSize[size],
          buttonColor[color],
          {
            borderRadius: 5,
          },
          buttonVariant[variant][color],
          style,
        ]}
        allowFontScaling={false}
        onPress={onPress ? onPress : null}
        {...otherProps}
      >
        <Text
          allowFontScaling={false}
          style={[
            fontSize[size],
            fontColor[variant][color],
            { marginHorizontal: 15, textAlign: "center" },
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const buttonSize = StyleSheet.create({
  small: {
    height: normalize(32),
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  medium: {
    height: normalize(40),
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  large: {
    height: normalize(48),
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  small_light: {
    height: normalize(32),
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});

const buttonColor = StyleSheet.create({
  primary: { backgroundColor: "#209FAE" },
  secondary: { backgroundColor: "#D75995" },
  tertiary: { backgroundColor: "#E2ECF8" },
  black: { backgroundColor: "#464646" },
  green: { backgroundColor: "#daf0f2" },
  pink: { backgroundColor: "#f2dae6" },
  disabled: { backgroundColor: "#EAEAEA" },
});

const buttonVariant = {
  normal: { primary: null, secondary: null, tertiary: null, black: null },
  bordered: {
    primary: {
      backgroundColor: "transparent",
      borderColor: "#209FAE",
      borderWidth: 1,
    },
    secondary: {
      backgroundColor: "transparent",
      borderColor: "#D75995",
      borderWidth: 1,
    },
    pink: {
      backgroundColor: "transparent",
      borderColor: "#f2dae6",
      borderWidth: 1,
    },
    tertiary: {
      backgroundColor: "transparent",
      borderColor: "#E2ECF8",
      borderWidth: 1,
    },
    black: {
      backgroundColor: "transparent",
      borderColor: "#d3d3d3",
      borderWidth: 1,
    },
    disabled: {
      backgroundColor: "transparent",
      borderColor: "#EAEAEA",
      borderWidth: 1,
    },
  },
  transparent: {
    primary: { backgroundColor: "transparent" },
    secondary: { backgroundColor: "transparent" },
    tertiary: { backgroundColor: "transparent" },
    black: { backgroundColor: "transparent" },
    disabled: { backgroundColor: "transparent" },
  },
};

const fontColor = {
  normal: {
    primary: { color: "#FFFFFF" },
    secondary: { color: "#FFFFFF" },
    tertiary: { color: "#464646" },
    black: { color: "#FFFFFF" },
    green: { color: "#464646" },
    pink: { color: "#ffffff" },
    disabled: { color: "#D1D1D1" },
  },
  bordered: {
    primary: { color: "#209FAE" },
    secondary: { color: "#D75995" },
    tertiary: { color: "#E2ECF8" },
    black: { color: "#464646" },
  },
  transparent: {
    primary: { color: "#209FAE" },
    secondary: { color: "#D75995" },
    tertiary: { color: "#E2ECF8" },
    black: { color: "#464646" },
  },
};

const fontSize = StyleSheet.create({
  small: { fontSize: normalize(12), fontFamily: "Lato-Bold" },
  medium: { fontSize: normalize(14), fontFamily: "Lato-Bold" },
  large: { fontSize: normalize(16), fontFamily: "Lato-Bold" },
  small_light: { fontSize: normalize(10), fontFamily: "Lato-Light" },
});
