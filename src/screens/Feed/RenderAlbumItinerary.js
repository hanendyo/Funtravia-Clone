import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, FunImageBackground, FunImage, FunVideo } from "../../component";
import { AllPostWhite, AlbumFeed, Album, Mute, Unmute } from "../../assets/svg";
import { default_image } from "../../assets/png";
const { width, height } = Dimensions.get("screen");
import { useTranslation } from "react-i18next";
import AutoHeightImage from "react-native-auto-height-image";

export default function RenderAlbum({
  data,
  props,
  play,
  muted,
  isFocused,
  setMuted,
  isComment,
}) {
  let videoView = useRef(null);
  const [Img, setImg] = useState("");
  const [ImgFilepath, setImgFilepath] = useState("");
  const [indexAktif, setIndexAktive] = useState(0);
  const { t } = useTranslation();
  const goToItinerary = (data) => {
    props.navigation.push("ItineraryStack", {
      screen: "itindetail",
      params: {
        itintitle: data.itinerary.name,
        country: data.itinerary.id,
        dateitin: "",
        token: token,
        status: "",
        index: 1,
        datadayaktif: data.day,
      },
    });
  };

  const onBuffer = (isBuffer) => {
    console.log(isBuffer);
  };

  return (
    <View
      style={{
        marginHorizontal: -10,
      }}
    >
      {data.assets[indexAktif].type === "video" ? (
        <>
          <TouchableWithoutFeedback onPress={() => setMuted(!muted)}>
            <FunVideo
              poster={data?.assets[0]?.filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"contain"}
              // source={{
              //   uri: data?.assets[0]?.filepath,
              // }}
              source={{ uri: data.assets[indexAktif].filepath }}
              innerRef={(ref) => {
                videoView = ref;
              }}
              // onBuffer={videoView?.current?.onBuffer}
              onBuffer={() => onBuffer()}
              onError={videoView?.current?.videoError}
              repeat={true}
              style={{
                width: width - 40,
                height: width,
                borderRadius: 15,
                marginHorizontal: 10,
              }}
              resizeMode="contain"
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
              bottom: 100,
              right: 30,
              borderRadius: 15,
            }}
          >
            {muted ? (
              <Mute width="15" height="15" />
            ) : (
              <Unmute width="15" height="15" />
            )}
          </View>
          <View
            style={{
              position: "absolute",
              top: 15,
              right: 25,
              backgroundColor: "#040404",
              opacity: 0.8,
              paddingHorizontal: 15,
              borderRadius: 14,
              height: 28,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <AllPostWhite width={13} height={13} />
            <Text
              type="bold"
              style={{
                color: "white",
                marginLeft: 5,
              }}
            >
              {data.assets.length}
            </Text>
          </View>
        </>
      ) : (
        <FunImageBackground
          style={{
            width: Dimensions.get("window").width - 40,
            // height: Dimensions.get("window").width - 110,
            height: width,
            borderRadius: 15,
            alignSelf: "center",
            // height: Dimensions.get("window").width - 40,
          }}
          imageStyle={{
            borderRadius: 15,
            resizeMode: "cover",
          }}
          source={{ uri: data.assets[indexAktif].filepath }}
        >
          {data.itinerary !== null ? (
            <Pressable
              onPress={() => goToItinerary(data)}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  top: 15,
                  right: 70,
                  backgroundColor: "#040404",
                  opacity: pressed ? 1 : 0.8,
                  //   paddingHorizontal: 15,
                  borderRadius: 14,
                  height: 28,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                },
              ]}
            >
              <AlbumFeed
                height={17}
                width={17}
                style={{ marginHorizontal: 15, marginVertical: 10 }}
              />
            </Pressable>
          ) : null}
          <View
            style={{
              position: "absolute",
              top: 15,
              right: 10,
              backgroundColor: "#040404",
              opacity: 0.8,
              paddingHorizontal: 15,
              borderRadius: 14,
              height: 28,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <AllPostWhite width={13} height={13} />
            <Text
              type="bold"
              style={{
                color: "white",
                marginLeft: 5,
              }}
            >
              {data.assets.length}
            </Text>
          </View>
        </FunImageBackground>
      )}
      <FlatList
        // onLayout={() => setImg(data.assets[0])}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          marginVertical: 5,
        }}
        keyExtractor={(item) => item.id}
        data={data.assets}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setIndexAktive(index)}
            style={{
              marginRight: data.assets.length == index + 1 ? 0 : 5,
            }}
          >
            {item.type === "video" ? (
              <FunVideo
                poster={item.filepath.replace("output.m3u8", "thumbnail.png")}
                posterResizeMode={"cover"}
                source={{
                  uri: item.filepath,
                }}
                innerRef={(ref) => {
                  videoView = ref;
                }}
                onBuffer={videoView?.current?.onBuffer}
                onError={videoView?.current?.videoError}
                repeat={false}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 10,
                  opacity: index == indexAktif ? 1 : 0.5,
                }}
                resizeMode="cover"
                muted={muted}
                paused={play === data.id && isFocused ? true : true}
              />
            ) : (
              <FunImage
                resizeMode="cover"
                source={{ uri: item.filepath }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 10,
                  opacity: index == indexAktif ? 1 : 0.5,
                }}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
