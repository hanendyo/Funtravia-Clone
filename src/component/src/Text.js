import React, { ReactChild } from "react";
import {
  Text as TextComponent,
  StyleSheet,
  StyleProp,
  TextStyle,
  TextProps,
} from "react-native";

type Props = TextProps & {
  children: ReactChild,
  style?: StyleProp<TextStyle>,
  size?:
    | "small"
    | "description"
    | "label"
    | "title"
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
  style,
  onPress,
  type = "regular",
  size = "description",
  ...otherProps
}: Props) {
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
}

const fontSize = StyleSheet.create({
  small: { fontSize: 10 },
  description: { fontSize: 12 },
  label: { fontSize: 14 },
  title: { fontSize: 18 },
  h5: { fontSize: 22 },
  h4: { fontSize: 28 },
  h3: { fontSize: 34 },
  h2: { fontSize: 46 },
  h1: { fontSize: 62 },
});

const fontType = StyleSheet.create({
  light: {
    fontFamily: "Lato-Light",
    color: "#464646",
    // shadowColor: "#464646",
    // shadowOffset: { width: 0.2, height: 0.2 },
    // shadowRadius: 0.2,
    // shadowOpacity: 0.2,
    // elevation: 2,
  },
  regular: {
    fontFamily: "Lato-Regular",
    color: "#464646",
    // shadowColor: "#464646",
    // shadowOffset: { width: 0.2, height: 0.2 },
    // shadowRadius: 0.2,
    // shadowOpacity: 0.2,
    // elevation: 2,
  },
  bold: {
    fontFamily: "Lato-Bold",
    color: "#464646",
    // shadowColor: "#464646",
    // shadowOffset: { width: 0.2, height: 0.2 },
    // shadowRadius: 0.2,
    // shadowOpacity: 0.2,
    // elevation: 2,
  },
  black: {
    fontFamily: "Lato-Black",
    color: "#464646",
    // shadowColor: "#464646",
    // shadowOffset: { width: 0.2, height: 0.2 },
    // shadowRadius: 0.2,
    // shadowOpacity: 0.2,
    // elevation: 2,
  },
});
