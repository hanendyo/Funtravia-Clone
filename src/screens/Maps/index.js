import React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import WorldMap from "./src/world/world.svg";
import Europe from "./src/world/europe.svg";
import Asia from "./src/world/asia.svg";
import Australia from "./src/world/australia.svg";
import NortAmerica from "./src/world/north_america.svg";
import SouthAmerica from "./src/world/south_america.svg";
import Africa from "./src/world/africa.svg";
import { Text } from "../../component";
import { View } from "native-base";
import { SvgCss } from "react-native-svg";
export default function World({ navigation }) {
  const { width, height } = Dimensions.get("screen");
  const HeaderHeight = (height * 34) / 100;
  const ContentHeight = (height * 66) / 100;
  const MapHeight = (ContentHeight * 22) / 150;
  const MapWidth = width / 2 - 20;
  const data = [
    {
      name: "Europe",
      screen: "Europe",
      count: 50,
      available: false,
      map: <Europe width={MapWidth} height={MapHeight} />,
    },
    {
      name: "Asia",
      screen: "Asia",
      count: 50,
      available: true,
      map: <Asia width={MapWidth} height={MapHeight} />,
    },
    {
      name: "Australia",
      screen: "Australia",
      count: 6,
      available: false,
      map: <Australia width={MapWidth} height={MapHeight} />,
    },
    {
      name: "North America",
      screen: "NorthAmerica",
      count: 31,
      available: false,
      map: <NortAmerica width={MapWidth} height={MapHeight} />,
    },
    {
      name: "South America",
      screen: "SouthAmerica",
      count: 21,
      available: false,
      map: <SouthAmerica width={MapWidth} height={MapHeight} />,
    },
    {
      name: "Africa",
      screen: "Africa",
      count: 54,
      available: false,
      map: <Africa width={MapWidth} height={MapHeight} />,
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <StatusBar backgroundColor="#14646E" barStyle="dark-content" />
      <View
        style={{
          height: (height * 34) / 110,
          alignItems: "center",
          //   backgroundColor: "#FFF",
          //   borderWidth: 1,
          paddingVertical: 15,
        }}
      >
        <Text type="bold" size="title">
          World Tourism
        </Text>
        {/* <Text type="regular" size="label">
          Get closer to your perfect destination
        </Text> */}
        <View style={{ marginVertical: 10 }}>
          <WorldMap width={HeaderHeight} height={HeaderHeight - 125} />
        </View>
        <Text
          type="regular"
          size="label"
          style={{ marginHorizontal: width / 6, textAlign: "center" }}
        >
          Choose your destination. Pick the best place for your holiday.
        </Text>
      </View>
      <FlatList
        key="world"
        data={data}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          height: ContentHeight - 115,
          backgroundColor: "#FFFFFF",
          marginVertical: 5,
          shadowColor: "#FFF",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,

          elevation: 6,
          marginLeft: 10,
          //   marginTop: -5,
          marginRight: 10,
          borderRadius: 20,
        }}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              item.available
                ? navigation.navigate(item.screen)
                : Alert.alert("Cooming Soon")
            }
            style={{
              borderRadius: 5,
              backgroundColor: "#FFF",
              margin: 5,
              marginTop: 10,
            }}
          >
            {item.available ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 15,
                    marginTop: 15,
                  }}
                >
                  <View
                    style={{
                      width: 5,
                      // height: 15,
                      marginRight: 5,
                      backgroundColor: "#209FAE",
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  ></View>

                  <Text
                    type="bold"
                    size="title"
                    style={{
                      color: "#464646",
                      textAlign: "center",
                    }}
                  >{`${item.name}`}</Text>
                </View>
                <Text
                  type="regular"
                  size="description"
                  style={{
                    color: "#464646",
                    marginLeft: 23,
                    // textAlign: "center",
                  }}
                >{`${item.count} Country`}</Text>
              </View>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 15,
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      width: 5,
                      // height: 15,
                      marginRight: 5,
                      backgroundColor: "#209FAE",
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  ></View>

                  <Text
                    type="bold"
                    size="title"
                    style={{
                      color: "#464646",
                      textAlign: "center",
                    }}
                  >{`${item.name}`}</Text>
                </View>

                <Text
                  type="regular"
                  size="description"
                  style={{
                    color: "#464646",
                    marginLeft: 23,
                    // textAlign: "center",
                  }}
                >{`${item.count} Country`}</Text>
              </View>
            )}
            {!item.available ? (
              <View
                style={{
                  position: "absolute",
                  //   backgroundColor: "rgba(0,0,0,0.5)",
                  width: "30%",
                  height: "40%",
                  borderRadius: 4,
                  left: 65,
                  top: 70,
                  zIndex: 999,
                  //   justifyContent: "center",
                  //   alignItems: "center",
                }}
              >
                <Text
                  size="description"
                  type="bold"
                  style={{
                    color: "#808080",
                    opacity: 0.4,
                    textAlign: "center",
                  }}
                >
                  Available Soon
                </Text>
              </View>
            ) : null}
            <View
              style={{
                justifyContent: "flex-end",
              }}
            >
              {item.map}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
