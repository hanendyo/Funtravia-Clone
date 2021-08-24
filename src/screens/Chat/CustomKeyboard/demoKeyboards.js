import React from "react";
import { ScrollView, Pressable } from "react-native";
import { Keyboard, View, Text, Image, Spacings } from "react-native-ui-lib";
import _ from "lodash";
const KeyboardRegistry = Keyboard.KeyboardRegistry;
const onItemSelected = Keyboard.onItemSelected;
const images = [
  // "https://images.pexels.com/photos/1148521/pexels-photo-1148521.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=200",
  "https://images.pexels.com/photos/1528975/pexels-photo-1528975.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=200",
  "https://images.pexels.com/photos/1495580/pexels-photo-1495580.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200",
  "https://images.pexels.com/photos/943150/pexels-photo-943150.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=200",
  "https://images.pexels.com/photos/1769408/pexels-photo-1769408.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=200",
];

function ImagesKeyboard() {
  return (
    <View flex>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacings.s4 }}
      >
        {_.map(images, (image, i) => {
          return (
            <Pressable
              onPress={() => {
                console.log(i);
                let a = "aa";
                KeyboardRegistry.onItemSelected("unicorn.ImagesKeyboard", {
                  message: "item selected from KeyboardView",
                });
              }}
            >
              <Image
                key={i}
                source={{ uri: image }}
                style={{ height: "100%", width: 200 }}
                marginR-s4
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function CustomKeyboard() {
  return (
    <View flex padding-s4>
      <Text h3>Custom Keyboard</Text>
    </View>
  );
}

KeyboardRegistry.registerKeyboard(
  "unicorn.ImagesKeyboard",
  () => ImagesKeyboard
);
KeyboardRegistry.registerKeyboard(
  "unicorn.CustomKeyboard",
  () => CustomKeyboard
);
