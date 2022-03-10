import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from "react-native";
import { Text, FunImageBackground, FunImage, FunVideo } from "../../component";
import { AllPostWhite, AlbumFeed, Mute, Unmute } from "../../assets/svg";
import { default_image } from "../../assets/png";
const { width, height } = Dimensions.get("screen");
import { useTranslation } from "react-i18next";
import Video from "react-native-video";

export default function RenderAlbum({
  itinerary_id,
  data,
  props,
  play,
  muted,
  isFocused,
  setMuted,
  isComment,
  token,
  setModalLogin,
}) {
  let videoView = useRef(null);
  const [indexAktif, setIndexAktive] = useState(0);
  const { t } = useTranslation();
  const goToItinerary = (data) => {
    token
      ? props.navigation.push("ItineraryStack", {
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
        })
      : setModalLogin(true);
  };

  const [time, setTime] = useState(false);

  const durationTime = (data) => {
    data.currentTime < 60.0 ? setTime(false) : setTime(true);
  };

  const L = (2.2 / 3) * Dimensions.get("screen").width - 40;
  const P = (5 / 4) * Dimensions.get("screen").width - 40;
  const S = Dimensions.get("screen").width - 40;

  let opacity = useRef(0);
  const onLoadStart = () => {
    opacity.current = 1;
  };

  const onLoad = () => {
    opacity.current = 0;
  };

  const onBuffer = ({ isBuffering }) => {
    isBuffering ? (opacity.current = 1) : (opacity.current = 0);
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
              onBuffer={(e) => onBuffer(e)}
              onLoadStart={() => onLoadStart()}
              onLoad={() => onLoad()}
              poster={data?.assets[0]?.filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              // source={{
              //   uri: data?.assets[0]?.filepath,
              // }}
              source={{ uri: data.assets[indexAktif].filepath }}
              innerRef={(ref) => {
                videoView = ref;
              }}
              onError={videoView?.current?.videoError}
              onProgress={durationTime}
              repeat={true}
              style={{
                width: width - 40,
                // height: width,
                height:
                  data.media_orientation == "L"
                    ? L
                    : data.media_orientation == "P"
                    ? P
                    : S,
                borderRadius: 15,
                alignSelf: "center",
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
              // opacity: opacity,
              position: "absolute",
              borderColor: "#209fae",
              height: "100%",
              width: "102%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              opacity: opacity.current == 1 ? 0.5 : 0,
            }}
          >
            <ActivityIndicator
              animating
              size="large"
              color={"#209fae"}
              style={{
                opacity: opacity.current,
                // opacity: 1,
                position: "absolute",
                borderColor: "#209fae",
              }}
            />
          </View>
          <Pressable
            onPress={() => setMuted(!muted)}
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
          </Pressable>
          {data.album ? (
            <Pressable
              // onPress={() =>
              //   data.itinerary !== null ? goToItinerary(data) : null
              // }
              // onPress={() => {
              //   token
              //     ? props.navigation.push("ProfileStack", {
              //         screen: " ",
              //         params: {
              //           id: data?.album?.id,
              //           type: null,
              //           token: token,
              //           judul: data?.album?.title,
              //         },
              //       })
              //     : setModalLogin(true);
              // }}
              onPress={() =>
                data.itinerary !== null ? goToItinerary(data) : null
              }
              onPress={() => {
                token
                  ? props.navigation.push("FeedStack", {
                      screen: "TravelAlbumList",
                      params: {
                        itinerary_id,
                        id: data?.album?.id,
                        type: null,
                        judul: data?.album?.title,
                      },
                    })
                  : setModalLogin(true);
              }}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  top: 15,
                  right: 20,
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
                height={15}
                width={15}
                style={{
                  marginHorizontal: 15,
                  marginVertical: 5,
                }}
              />
            </Pressable>
          ) : null}
          <View
            style={{
              position: "absolute",
              top: 15,
              // right: 25,
              right: data.album ? 70 : 20,
              backgroundColor: "#040404",
              opacity: 0.8,
              borderRadius: 14,
              height: 28,
              width: 50,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {/* <AllPostWhite width={13} height={13} /> */}
            <Text
              type="bold"
              size="description"
              style={{
                color: "white",
              }}
            >
              {indexAktif + 1} {"/"} {data?.assets.length}
            </Text>
          </View>
        </>
      ) : (
        <FunImageBackground
          style={{
            width: Dimensions.get("window").width - 40,
            // height: Dimensions.get("window").width - 110,
            // height: width,
            height:
              data.media_orientation == "L"
                ? L
                : data.media_orientation == "P"
                ? P
                : S,
            borderRadius: 15,
            alignSelf: "center",
            // height: Dimensions.get("window").width - 40,
          }}
          imageStyle={{
            borderRadius: 15,
            resizeMode: "cover",
          }}
          size="f"
          source={{ uri: data.assets[indexAktif].filepath }}
        >
          {data.album ? (
            <Pressable
              // onPress={() => {
              //   token
              //     ? props.navigation.push("ProfileStack", {
              //         screen: "albumdetail",
              //         params: {
              //           id: data?.album?.id,
              //           type: null,
              //           token: token,
              //           judul: data?.album?.title,
              //         },
              //       })
              //     : setModalLogin(true);
              // }}
              onPress={() => {
                token
                  ? props.navigation.push("FeedStack", {
                      screen: "TravelAlbumList",
                      params: {
                        itinerary_id,
                        id: data?.album?.id,
                        type: null,
                        judul: data?.album?.title,
                      },
                    })
                  : setModalLogin(true);
              }}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  top: 15,
                  right: 10,
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
                height={15}
                width={15}
                style={{
                  marginHorizontal: 15,
                  marginVertical: 5,
                }}
              />
            </Pressable>
          ) : null}

          <View
            style={{
              position: "absolute",
              top: 15,
              right: data.album ? 60 : 20,
              backgroundColor: "#040404",
              opacity: 0.8,
              borderRadius: 14,
              height: 28,
              width: 50,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {/* <AllPostWhite width={13} height={13} /> */}
            <Text
              type="bold"
              size="description"
              style={{
                color: "white",
                // marginLeft: 5,
              }}
            >
              {indexAktif + 1} {"/"} {data?.assets.length}
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
            key={item.id}
            onPress={() => setIndexAktive(index)}
            style={{
              marginRight: data.assets.length == index + 1 ? 0 : 5,
            }}
          >
            {item.type === "video" ? (
              <Video
                poster={item.filepath.replace("output.m3u8", "thumbnail.png")}
                posterResizeMode={"cover"}
                source={{
                  uri: item?.filepath,
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
              <Image
                resizeMode="cover"
                size="f"
                source={item.filepath ? { uri: item.filepath } : default_image}
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
