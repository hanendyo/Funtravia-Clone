import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { default_image } from "../../../../assets/png";
import User_Post from "../../../../graphQL/Query/Profile/post";
import { Kosong } from "../../../../assets/svg";
import { Text } from "../../../../component";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
const { width, height } = Dimensions.get("screen");

export default function Post({ item, index }) {
  if (item.length > 2) {
    if (item[3].grid == 1) {
      return (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingHorizontal: 2.5,
          }}
        >
          <View
            style={{
              width: ((width - 12) / 3) * 2,
              height: ((width - 12) / 3) * 2,
              margin: 2.5,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              source={
                item[0].assets[0].filepath
                  ? { uri: item[0].assets[0].filepath }
                  : default_image
              }
            />
          </View>
          <View>
            <View
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={
                  item[1].assets[0].filepath
                    ? { uri: item[1].assets[0].filepath }
                    : default_image
                }
              />
            </View>
            <View
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={
                  item[2].assets[0].filepath
                    ? { uri: item[2].assets[0].filepath }
                    : default_image
                }
              />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingHorizontal: 2.5,
          }}
        >
          <View>
            <View
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={
                  item[0].assets[0].filepath
                    ? { uri: item[0].assets[0].filepath }
                    : default_image
                }
              />
            </View>
            <View
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={
                  item[1].assets[0].filepath
                    ? { uri: item[1].assets[0].filepath }
                    : default_image
                }
              />
            </View>
          </View>
          <View
            style={{
              width: ((width - 12) / 3) * 2,
              height: ((width - 12) / 3) * 2,
              margin: 2.5,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              source={
                item[2].assets[0].filepath
                  ? { uri: item[2].assets[0].filepath }
                  : default_image
              }
            />
          </View>
        </View>
      );
    }
  } else {
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingHorizontal: 2.5,
        }}
      >
        {item.map((data, index) => {
          return (
            <View
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={
                  data.assets[0].filepath
                    ? { uri: data.assets[0].filepath }
                    : default_image
                }
              />
            </View>
          );
        })}
      </View>
    );
  }
}
