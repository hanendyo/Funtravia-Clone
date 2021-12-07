import React, { useState, useEffect } from "react";
import { View, Dimensions, Image, Pressable } from "react-native";
import { default_image } from "../../../../assets/png";
import User_Post from "../../../../graphQL/Query/Profile/post";
import { Kosong, PlayVideo } from "../../../../assets/svg";
import {
  Text,
  FunImage,
  FunImageBackground,
  FunVideo,
} from "../../../../component";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
const { width, height } = Dimensions.get("screen");
import DeviceInfo from "react-native-device-info";
const Notch = DeviceInfo.hasNotch();
export default function Album({ item, props, token }) {
  // const { t } = useTranslation();
  return (
    <Pressable
      // key={index}
      onPress={() => {
        props.navigation.push("albumdetail", {
          id: item.id,
          type: item.type,
          token: token,
          judul: item.title,
        });
      }}
      style={{
        width: Dimensions.get("screen").width - 30,
        height: width * 0.55,
        marginBottom: 10,
        marginHorizontal: 15,
        // paddingHorizontal: 10,
        marginTop: Platform.OS == "ios" ? (Notch ? 5 : 0) : 0,
      }}
    >
      <View
        style={{
          borderRadius: 10,
          flex: 1,
          elevation: 1,
          backgroundColor: "#fff",
        }}
      >
        {item.firstimg !== null ? (
          item.firstimg.type == "video" ? (
            <>
              <FunVideo
                poster={item.firstimg.filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                paused={true}
                // key={"posted" + index + item.id}
                source={{
                  uri: item.firstimg.filepath,
                }}
                muted={true}
                // defaultSource={default_image}
                resizeMode="cover"
                style={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  // resizeMode: "cover",
                  width: "100%",
                  height: "80%",
                  backgroundColor: "#fff",
                }}
                grid
              />
              <View
                style={{
                  // flexDirection: "row",
                  position: "absolute",
                  width: "100%",
                  height: "80%",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  justifyContent: "flex-end",
                  borderRadius: 5,

                  // top: 5,
                  // left: "35%",
                }}
              >
                <PlayVideo width={15} height={15} style={{ margin: 10 }} />
              </View>
            </>
          ) : (
            <FunImage
              source={{ uri: item.firstimg.filepath }}
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                // resizeMode: "cover",
                width: "100%",
                height: "80%",
                backgroundColor: "#fff",

                // margin: 2,
                // borderRadius: 5,
                resizeMode: "cover",
              }}
            />
          )
        ) : (
          <Image
            source={default_image}
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              // resizeMode: "cover",
              width: "100%",
              height: "80%",
            }}
          />
        )}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 15,
          }}
        >
          <Text size={"label"} type="bold">
            {item.title}
          </Text>
          <Text size={"label"} type="regular">
            {item.count_foto + " Foto"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
