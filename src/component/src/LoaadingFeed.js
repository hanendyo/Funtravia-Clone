import * as React from "react";
import {
  Easing,
  TextInput,
  Animated,
  Text,
  View,
  StyleSheet,
} from "react-native";
import Svg, { G, Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function LoadingFeed({
  percentage = 75,
  radius = 40,
  strokeWidth = 10,
  duration,
  color,
  delay = 0,
  textColor,
  max = 100,
}) {
  const animated = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef();
  const inputRef = React.useRef();
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth + 10;
  console.log("duration", duration);

  const animation = (toValue) => {
    return Animated.timing(animated, {
      delay: 0,
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      // animation(toValue === 0 ? percentage : 0);
      animation(toValue === 100 ? percentage : 0);
    });
  };

  React.useEffect(() => {
    animation(percentage);
    animated.addListener(
      (v) => {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset =
          circumference - (circumference * maxPerc) / 100;
        if (inputRef?.current) {
          inputRef.current.setNativeProps({
            text: `${Math.round(v.value)} %`,
          });
        }
        if (circleRef?.current) {
          circleRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [max, percentage]
    );

    return () => {
      animated.removeAllListeners();
    };
  });

  return (
    <View
      style={{
        width: radius,
        height: radius,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg
        height={radius * 1.5}
        width={radius * 1.5}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius + 10}
            fill="transparent"
            stroke={"#daf0f2"}
            strokeWidth={strokeWidth}
          />
          <Circle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDashoffset={circumference}
            strokeDasharray={circumference}
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="#daf0f2"
            strokeLinejoin="round"
            strokeOpacity=".1"
          />
        </G>
      </Svg>
      <AnimatedTextInput
        ref={inputRef}
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue="0"
        style={[
          StyleSheet.absoluteFillObject,
          { fontSize: radius / 2, color: textColor ?? color },
          styles.text,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "900",
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Lato-Regular",
  },
});
