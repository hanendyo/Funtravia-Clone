import React, { ReactChild, useState, useRef } from "react";
import {
  Text as TextComponent,
  StyleSheet,
  StyleProp,
  TextStyle,
  TextProps,
} from "react-native";
import normalize from "react-native-normalize";

type Props = TextProps & {
  children: ReactChild,
  style?: StyleProp<TextStyle>,
  size?:
    | "small"
    | "readable"
    | "description"
    | "label"
    | "title"
    | "header"
    | "h5"
    | "h4"
    | "h3"
    | "h2"
    | "h1",
  type?: "light" | "regular" | "bold" | "black",
  onPress?: () => void,
};

export default function Text({
  children,
  onPress,
  style,
  type = "regular",
  size = "description",
  ...otherProps
}: Props) {
  if (style) {
    return (
      <TextComponent
        style={[fontSize[size], fontType[type], style]}
        allowFontScaling={false}
        onPress={onPress ? onPress : null}
        {...otherProps}
      >
        {children}
      </TextComponent>
    );
  } else {
    return (
      <TextComponent
        style={[fontSize[size], fontType[type]]}
        allowFontScaling={false}
        onPress={onPress ? onPress : null}
        {...otherProps}
      >
        {children}
      </TextComponent>
    );
  }
}

// const fontSize = StyleSheet.create({
//   small: { fontSize: 10 },
//   description: { fontSize: 12 },
//   readable: { fontSize: 14 },
//   label: { fontSize: 14 },
//   title: { fontSize: 16 },
//   header: { fontSize: 18 },
//   h5: { fontSize: 20 },
//   h4: { fontSize: 26 },
//   h3: { fontSize: 32 },
//   h2: { fontSize: 44 },
//   h1: { fontSize: 60 },
// });
// const fontSize = StyleSheet.create({
//   small: { fontSize: normalize(10) },
//   description: { fontSize: normalize(12) },
//   readable: { fontSize: normalize(14) },
//   label: { fontSize: normalize(14) },
//   title: { fontSize: normalize(16) },
//   header: { fontSize: normalize(18) },
//   h5: { fontSize: normalize(20) },
//   h4: { fontSize: normalize(26) },
//   h3: { fontSize: normalize(32) },
//   h2: { fontSize: normalize(44) },
//   h1: { fontSize: normalize(60) },
// });
const fontSize = StyleSheet.create({
  small: { fontSize: normalize(12) },
  description: { fontSize: normalize(14) },
  readable: { fontSize: 16, lineHeight: normalize(25) },
  label: { fontSize: normalize(16) },
  title: { fontSize: normalize(18) },
  header: { fontSize: normalize(20) },
  h5: { fontSize: normalize(22) },
  h4: { fontSize: normalize(28) },
  h3: { fontSize: normalize(34) },
  h2: { fontSize: normalize(46) },
  h1: { fontSize: normalize(62) },
});

const fontType = StyleSheet.create({
  light: {
    fontFamily: "Lato-Light",
    color: "#464646",
  },
  regular: {
    fontFamily: "Lato-Regular",
    color: "#464646",
  },
  bold: {
    fontFamily: "Lato-Bold",
    color: "#464646",
  },
  black: {
    fontFamily: "Lato-Black",
    color: "#464646",
  },
});
