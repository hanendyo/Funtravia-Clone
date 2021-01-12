import React, {ReactChild} from 'react';
import {
  Text as TextComponent,
  StyleSheet,
  StyleProp,
  TextStyle,
  TextProps,
} from 'react-native';

type Props = TextProps & {
  children: ReactChild,
  style?: StyleProp<TextStyle>,
  size?:
    | 'small'
    | 'description'
    | 'label'
    | 'title'
    | 'h5'
    | 'h4'
    | 'h3'
    | 'h2'
    | 'h1',
  type?: 'light' | 'regular' | 'bold' | 'black',
  onPress?: () => void,
};

export default function Text({
  children,
  style,
  onPress,
  type = 'regular',
  size = 'description',
  ...otherProps
}: Props) {
  return (
    <TextComponent
      style={[fontSize[size], fontType[type], style]}
      allowFontScaling={false}
      onPress={onPress ? onPress : null}
      {...otherProps}>
      {children}
    </TextComponent>
  );
}

const fontSize = StyleSheet.create({
  small: {fontSize: 12},
  description: {fontSize: 14},
  label: {fontSize: 16},
  title: {fontSize: 20},
  h5: {fontSize: 24},
  h4: {fontSize: 30},
  h3: {fontSize: 36},
  h2: {fontSize: 48},
  h1: {fontSize: 64},
});

const fontType = StyleSheet.create({
  light: {fontFamily: 'Lato-Light', color: '#464646'},
  regular: {fontFamily: 'Lato-Regular', color: '#464646'},
  bold: {fontFamily: 'Lato-Bold', color: '#464646'},
  black: {fontFamily: 'Lato-Black', color: '#464646'},
});
