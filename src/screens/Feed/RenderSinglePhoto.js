import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  TouchableWithoutFeedback,
  View,
  PanResponder,
  Animated,
  useWindowDimensions,
} from "react-native";
import { FunImageAutoSize, FunVideo } from "../../component";
import { Mute, Unmute, AlbumFeed } from "../../assets/svg";
import { PinchGestureHandler } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
export default function RenderSinglePhoto({
  itinerary_id,
  has_itinerary,
  data,
  props,
  play,
  isFocused,
  muted,
  setMuted,
  isComment,
  token,
  setModalLogin,
}) {
  let videoView = useRef(null);
  const dimensions = useWindowDimensions();
  const [heightScaled, setHeightScaled] = useState(width);
  const [oriented, setOriented] = useState("");
  const [time, setTime] = useState(false);

  const durationTime = (data) => {
    data.currentTime < 60.0 ? setTime(false) : setTime(true);
  };

  const L = (2.2 / 3) * Dimensions.get("screen").width - 40;
  const P = (5 / 4) * Dimensions.get("screen").width - 40;
  const S = Dimensions.get("screen").width - 40;

  useEffect(() => {
    onLoadStart();
    onLoad();
  });

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

  // ! GESTURE HANDLERS

  const pointsDistance = ([xA, yA], [xB, yB]) => {
    return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2));
  };

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        const activeTouches = evt.nativeEvent.changedTouches.length;
        // if (activeTouches === 1) {
        //   pan.setValue({
        //     x: gestureState.dx,
        //     y: gestureState.dy,
        //   });
        // }
        if (activeTouches >= 2) {
          const touches = evt.nativeEvent.changedTouches;
          const touchA = touches[0];
          const touchB = touches[1];

          const distance = pointsDistance(
            [touchA.pageX, touchA.pageY],
            [touchB.pageX, touchB.pageY]
          );
          const screenMovedPercents = distance / dimensions.width;
          // scale.setValue(1 + screenMovedPercents * 1);
          scale.setValue(0.6 + screenMovedPercents);
          pan.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(pan, {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  // ! END GESTURE HANDLERS

  if (data?.assets[0]?.type === "video") {
    return (
      <View
        key={`FEED_${data.id}`}
        style={{
          borderWidth: 1,
          borderColor: "#f6f6f6",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <TouchableWithoutFeedback onPress={() => setMuted(!muted)}>
          <FunVideo
            onBuffer={(e) => onBuffer(e)}
            onLoadStart={() => onLoadStart()}
            onLoad={() => onLoad()}
            hideShutterView={true}
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
            onProgress={durationTime}
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
            resizeMode={"cover"}
            muted={muted}
            // paused={false}
            paused={
              isComment ? false : play === data.id && isFocused ? false : true
            }
          />
        </TouchableWithoutFeedback>
        <View
          style={{
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
              onPress={() => {
                token
                  ? has_itinerary
                    ? props.navigation.push("FeedStack", {
                        screen: "AlbumTravelList",
                        params: {
                          itinerary_id,
                          id: data?.album?.id,
                          type: null,
                          judul: data?.album?.title,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "albumdetail",
                        params: {
                          id: data?.album?.id,
                          type: null,
                          token: token,
                          judul: data?.album?.title,
                        },
                      })
                  : setModalLogin(true);
              }}
              style={{
                backgroundColor: "#040404",
                position: "absolute",
                right: 10,
                top: 10,
                borderRadius: 15,
                opacity: 0.6,
                height: 30,
                width: 45,
              }}
            ></Pressable>
            <AlbumFeed
              onPress={() => {
                token
                  ? has_itinerary
                    ? props.navigation.push("FeedStack", {
                        screen: "AlbumTravelList",
                        params: {
                          itinerary_id,
                          id: data?.album?.id,
                          type: null,
                          judul: data?.album?.title,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "albumdetail",
                        params: {
                          id: data?.album?.id,
                          type: null,
                          token: token,
                          judul: data?.album?.title,
                        },
                      })
                  : setModalLogin(true);
              }}
              height={15}
              width={15}
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
      <Animated.View
      // pointerEvents="none"

      // {...panResponder.panHandlers}
      // style={{
      //   transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
      // }}
      >
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
              onPress={() => {
                token
                  ? has_itinerary
                    ? props.navigation.push("FeedStack", {
                        screen: "AlbumTravelList",
                        params: {
                          itinerary_id,
                          id: data?.album?.id,
                          type: null,
                          judul: data?.album?.title,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "albumdetail",
                        params: {
                          id: data?.album?.id,
                          type: null,
                          token: token,
                          judul: data?.album?.title,
                        },
                      })
                  : setModalLogin(true);
              }}
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
              onPress={() => {
                token
                  ? has_itinerary
                    ? props.navigation.push("FeedStack", {
                        screen: "AlbumTravelList",
                        params: {
                          itinerary_id,
                          id: data?.album?.id,
                          type: null,
                          judul: data?.album?.title,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "albumdetail",
                        params: {
                          id: data?.album?.id,
                          type: null,
                          token: token,
                          judul: data?.album?.title,
                        },
                      })
                  : setModalLogin(true);
              }}
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
      </Animated.View>
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
