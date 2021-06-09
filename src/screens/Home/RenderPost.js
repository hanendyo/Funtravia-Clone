import React, { useRef, useState } from "react";
import { Dimensions, Image, View, TouchableOpacity } from "react-native";
import { Text, Button, Truncate, FunVideo } from "../../component";
import { CommentWhite, LikeWhite, Play } from "../../assets/svg";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("screen");
export default function RenderVideo({ data, user, navigation }) {
  let videoView = useRef(null);
  if (data.assets[0].type === "video") {
    return (
      <View>
        <FunVideo
          poster={data.assets[0].filepath.replace(
            "output.m3u8",
            "thumbnail.png"
          )}
          posterResizeMode={"cover"}
          source={{
            uri: data.assets[0].filepath,
          }}
          innerRef={(ref) => {
            videoView = ref;
          }}
          onBuffer={videoView?.current?.onBuffer}
          onError={videoView?.current?.videoError}
          repeat={true}
          style={{
            width: (width - 70) / 2,
            height: (width + 70) / 2,
            borderRadius: 5,
          }}
          resizeMode="cover"
          muted={true}
          paused={true}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginLeft: 10,
            width: "100%",
            marginTop: 10,
            alignContent: "center",
            position: "absolute",
          }}
          onPress={() => {
            data.user.id !== user?.id
              ? navigation.push("ProfileStack", {
                  screen: "otherprofile",
                  params: {
                    idUser: data.user.id,
                  },
                })
              : navigation.push("ProfileStack", {
                  screen: "ProfileTab",
                  params: { token: token },
                });
          }}
        >
          <Image
            source={
              data.user.picture ? { uri: data.user.picture } : default_image
            }
            style={{
              resizeMode: "cover",
              height: 27,
              width: 27,
              borderRadius: 15,
              zIndex: 10000,
              borderColor: "white",
              borderWidth: 1,
            }}
          />
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignSelf: "center",
              marginLeft: -10,
              backgroundColor: "rgba(0,0,0,0.4)",
              paddingHorizontal: 3,
              borderRadius: 2,
              height: 20,
            }}
          >
            <Text
              size="small"
              type="bold"
              style={{
                textAlign: "center",
                marginHorizontal: 12,
                color: "rgba(255,255,255,1)",
              }}
            >
              <Truncate text={`@${data.user.username}`} length={15} />
            </Text>
          </View>
        </TouchableOpacity>
        <LinearGradient
          // colors={["black", "transparent"]} <-- untuk IOs gabisa kaya gini
          colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0)"]}
          style={{
            height: "50%",
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderRadius: 5,
            paddingLeft: 10,
            paddingTop: 5,
          }}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 40,
            marginHorizontal: 10,
            alignContent: "flex-end",
          }}
        >
          <Text
            size="description"
            ellipsizeMode="clip"
            numberOfLines={2}
            style={{
              color: "white",
              alignSelf: "baseline",
              justifyContent: "flex-end",
            }}
          >
            {data.caption ? data.caption : null}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 5,
            marginLeft: 10,
          }}
        >
          <Button
            onPress={() => null}
            type="icon"
            variant="transparent"
            position="left"
            size="small"
            style={{
              paddingHorizontal: 2,
              marginRight: 10,
              color: "white",
            }}
          >
            <LikeWhite height={17} width={18} />
            <Text
              size="description"
              style={{
                textAlign: "center",
                marginHorizontal: 3,
                color: "white",
              }}
            >
              {data.response_count}
            </Text>
          </Button>
          <Button
            onPress={() => null}
            type="icon"
            variant="transparent"
            position="left"
            size="small"
            style={{
              paddingHorizontal: 1,
              // right: 10,
            }}
          >
            <CommentWhite
              height={17}
              width={18}
              fill={"#FFFFFF"}
              color={"white"}
            />
            <Text
              size="description"
              style={{
                textAlign: "center",
                marginHorizontal: 3,
                color: "white",
              }}
            >
              {data.comment_count}
            </Text>
          </Button>
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: (width + 70) / 5,
            left: (width - 70) / 5,
          }}
        >
          <Play width={40} height={40} />
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <Image
          style={{
            width: (width - 70) / 2,
            height: (width + 70) / 2,
            borderRadius: 5,
          }}
          source={{ uri: data.assets[0].filepath }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginLeft: 10,
            width: "100%",
            marginTop: 10,
            alignContent: "center",
            position: "absolute",
          }}
          onPress={() => {
            data.user.id !== user?.id
              ? navigation.push("ProfileStack", {
                  screen: "otherprofile",
                  params: {
                    idUser: data.user.id,
                  },
                })
              : navigation.push("ProfileStack", {
                  screen: "ProfileTab",
                  params: { token: token },
                });
          }}
        >
          <Image
            source={
              data.user.picture ? { uri: data.user.picture } : default_image
            }
            style={{
              resizeMode: "cover",
              height: 27,
              width: 27,
              borderRadius: 15,
              zIndex: 10000,
              borderColor: "white",
              borderWidth: 1,
            }}
          />
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignSelf: "center",
              marginLeft: -10,
              backgroundColor: "rgba(0,0,0,0.4)",
              paddingHorizontal: 3,
              borderRadius: 2,
              height: 20,
            }}
          >
            <Text
              size="small"
              type="bold"
              style={{
                textAlign: "center",
                marginHorizontal: 12,
                color: "rgba(255,255,255,1)",
              }}
            >
              <Truncate text={`@${data.user.username}`} length={15} />
            </Text>
          </View>
        </TouchableOpacity>
        <LinearGradient
          //   colors={["black", "transparent"]}
          colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0)"]}
          style={{
            height: "50%",
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderRadius: 5,
            paddingLeft: 10,
            paddingTop: 5,
          }}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 40,
            marginHorizontal: 10,
            alignContent: "flex-end",
          }}
        >
          <Text
            size="description"
            ellipsizeMode="clip"
            numberOfLines={2}
            style={{
              color: "white",
              alignSelf: "baseline",
              justifyContent: "flex-end",
            }}
          >
            {data.caption ? data.caption : null}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 5,
            marginLeft: 10,
          }}
        >
          <Button
            onPress={() => null}
            type="icon"
            variant="transparent"
            position="left"
            size="small"
            style={{
              paddingHorizontal: 2,
              marginRight: 10,
              color: "white",
            }}
          >
            <LikeWhite height={17} width={18} />
            <Text
              size="description"
              style={{
                textAlign: "center",
                marginHorizontal: 3,
                color: "white",
              }}
            >
              {data.response_count}
            </Text>
          </Button>
          <Button
            onPress={() => null}
            type="icon"
            variant="transparent"
            position="left"
            size="small"
            style={{
              paddingHorizontal: 1,
              // right: 10,
            }}
          >
            <CommentWhite
              height={17}
              width={18}
              fill={"#FFFFFF"}
              color={"white"}
            />
            <Text
              size="description"
              style={{
                textAlign: "center",
                marginHorizontal: 3,
                color: "white",
              }}
            >
              {data.comment_count}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}
