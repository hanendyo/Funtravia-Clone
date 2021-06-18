import React, { useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FunImageAutoSize, FunVideo, FunImage, Text } from "../../component";
import Video from "react-native-video";
import { Mute, Unmute, AlbumFeed } from "../../assets/svg";
import { default_image } from "../../assets/png";

const { width, height } = Dimensions.get("screen");
export default function RenderSinglePhoto({
  data,
  props,
  play,
  isFocused,
  muted,
  setMuted,
  isComment,
}) {
  let videoView = useRef(null);
  if (data?.assets[0]?.type === "video") {
    return (
      <View key={`FEED_${data.id}`}>
        <TouchableWithoutFeedback onPress={() => setMuted(!muted)}>
          <FunVideo
            poster={data?.assets[0]?.filepath.replace(
              "output.m3u8",
              "thumbnail.png"
            )}
            posterResizeMode={"cover"}
            source={{
              uri: data?.assets[0]?.filepath,
            }}
            innerRef={(ref) => {
              videoView = ref;
            }}
            onBuffer={videoView?.current?.onBuffer}
            onError={videoView?.current?.videoError}
            repeat={true}
            style={{
              width: width - 40,
              height: width,
              borderRadius: 15,
            }}
            resizeMode="cover"
            muted={muted}
            paused={
              isComment ? false : play === data.id && isFocused ? false : true
            }
          />
        </TouchableWithoutFeedback>
        <View
          style={{
            padding: 5,
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.50)",
            bottom: 10,
            right: 10,
            borderRadius: 15,
          }}
        >
          {muted ? (
            <Mute width="15" height="15" />
          ) : (
            <Unmute width="15" height="15" />
          )}
        </View>
        {data && data?.album !== null ? (
          <>
            <Pressable
              onPress={() => console.log("album")}
              style={{
                backgroundColor: "#040404",
                position: "absolute",
                right: 10,
                top: 10,
                borderRadius: 15,
                opacity: 0.6,
                height: 30,
                width: 50,
              }}
            ></Pressable>
            <AlbumFeed
              onPress={() => console.log("album")}
              height={17}
              width={17}
              style={{
                marginHorizontal: 15,
                marginVertical: 5,
                position: "absolute",
                top: 12,
                right: 10,
              }}
            />
          </>
        ) : null}
      </View>
    );
  } else if (data?.assets[0]?.type === "image") {
    return (
      <View>
        <FunImageAutoSize
          style={{
            width: Dimensions.get("screen").width - 40,
            borderRadius: 15,
            alignSelf: "center",
            marginHorizontal: 10,
          }}
          key={`FEED_${data.id}`}
          uri={data?.assets[0]?.filepath}
        />
        {data && data?.album !== null ? (
          <>
            <Pressable
              onPress={() => console.log("album")}
              style={{
                backgroundColor: "#040404",
                position: "absolute",
                right: 10,
                top: 10,
                borderRadius: 15,
                opacity: 0.6,
                height: 30,
                width: 50,
              }}
            ></Pressable>
            <AlbumFeed
              onPress={() => console.log("album")}
              height={17}
              width={17}
              style={{
                marginHorizontal: 15,
                marginVertical: 5,
                position: "absolute",
                top: 12,
                right: 10,
              }}
            />
          </>
        ) : null}
      </View>
    );
  } else {
    return (
      <FunImageAutoSize
        style={{
          width: Dimensions.get("screen").width - 40,
          borderRadius: 15,
          alignSelf: "center",
          marginHorizontal: 10,
        }}
        key={`FEED_${data.id}`}
        uri={"https://fa12.funtravia.com/default.png"}
      />
    );
  }
}
