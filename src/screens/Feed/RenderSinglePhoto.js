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
  token,
}) {
  // console.log("data single", data);
  let videoView = useRef(null);
  const [heightScaled, setHeightScaled] = useState(width);
  const [oriented, setOriented] = useState("");
  const [time, setTime] = useState(false);

  const durationTime = (data) => {
    data.currentTime < 60.0 ? setTime(false) : setTime(true);
  };

  const L = (2.2 / 3) * Dimensions.get("screen").width - 40;
  const P = (5 / 4) * Dimensions.get("screen").width - 40;
  const S = Dimensions.get("screen").width - 40;

  if (data?.assets[0]?.type === "video") {
    return (
      <View
        key={`FEED_${data.id}`}
        style={{
          borderWidth: 1,
          borderColor: "#f6f6f6",
          borderRadius: 10,
        }}
      >
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
            // controls
            onError={videoView?.current?.videoError}
            onLoad={(response) => console.log("response")}
            on
            onProgress={durationTime}
            // onProgress={(event) => console.log("e", event)}
            repeat={true}
            style={{
              width: width - 40,
              height:
                data.media_orientation == "L"
                  ? L
                  : data.media_orientation == "P"
                  ? P
                  : S,
              borderRadius: 10,
            }}
            // resizeMode={oriented === "portrait" ? "cover" : "contain"}
            resizeMode={"cover"}
            muted={muted}
            paused={
              isComment ? false : play === data.id && isFocused ? false : true
            }
          />
        </TouchableWithoutFeedback>
        <Pressable
          onPress={() => setMuted(!muted)}
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
        </Pressable>
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
            // width: Dimensions.get("screen").width - 40,
            height:
              data.media_orientation == "L"
                ? L
                : data.media_orientation == "P"
                ? P
                : S,
            borderRadius: 15,
            alignSelf: "center",
            marginHorizontal: 10,
          }}
          key={`FEED_${data.id}`}
          uri={data?.assets[0]?.filepath}
          size="f"
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
          height:
            data.media_orientation == "L"
              ? L
              : data.media_orientation == "P"
              ? P
              : S,
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
