import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Modal,
  Platform,
  Image,
} from "react-native";
import { Text, FunImage } from "../../component";
import {
  Star,
  AddHijau,
  Reupload,
  LikeBlack,
  CommentBlack,
  Arrowbackios,
  Arrowbackwhite,
} from "../../assets/svg";
import AnimatedPlayer from "react-native-animated-webp";
import Svg, { Polygon } from "react-native-svg";
import { scale, moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { RESTFULL_API } from "../../config";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";
import { dateFormatDateMonthYears } from "../../component/src/dateformatter";
import DeviceInfo from "react-native-device-info";
import { stat } from "react-native-fs";
import { TouchableHighlight } from "react-native-gesture-handler";
export default function ChatTypelayout({
  item,
  user_id,
  navigation,
  tmpRChat,
  socket,
  // _uploadimage,
  index,
  datas,
  token,
  connected,
  socket_connect,
  room,
  flatListRef,
  _sendmsg,
  type,
  from,
  user,
  setSelect,
  select,
  selectItem,
}) {
  const tokenApps = useSelector((data) => data.token);
  const [loading, setloading] = useState(true);
  let [angel, setAngel] = useState(0);
  let videoView = useRef(null);
  const { t } = useTranslation();
  const playerRef = useRef(null);
  const [modalss, setModalss] = useState(false);
  const [count, setCount] = useState(0);
  let Notch = DeviceInfo.hasNotch();
  let SafeStatusBar = Platform.select({
    ios: Notch ? 48 : 20,
    android: 0,
  });

  const rotate = (angles) => {
    const nextAngle = angel + angles;
    if (nextAngle == 360) {
      setAngel(0);
    } else {
      setAngel(nextAngle);
    }
  };

  const _uploadimages = async (image, id) => {
    try {
      setloading(true);
      image = JSON.parse(image);
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = dd + "/" + mm + "/" + yyyy;
      var formData = new FormData();
      formData.append("id", id);
      let ext = image.mime.split("/");
      let image_name = "imageChat." + ext[1];
      formData.append("img", {
        name: image_name,
        type: image.mime,
        uri:
          Platform.OS === "android"
            ? image.path
            : image.path.replace("file://", ""),
      });
      let response = await fetch(
        `${RESTFULL_API}room/personal/upload_image_chat`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: tokenApps,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      let responseJson = await response.json();
      if (responseJson.status == true) {
        // getUserAndToken();
        let dateTime = new Date();
        let chatData;
        if (type == "group") {
          chatData = {
            id: id,
            room: room,
            chat: "group",
            from: from,
            type: "att_image",
            text: responseJson.filepath,
            user_id: user.id,
            time: dateTime,
            is_send: true,
            name: `${user.first_name} ${user.last_name ? user.last_name : ""}`,
          };
        } else {
          chatData = {
            id: id,
            room: room,
            chat: "personal",
            type: "att_image",
            text: responseJson.filepath,
            user_id: user_id,
            time: dateTime,
            is_send: true,
          };
        }

        // if (socket.connected) {
        // await socket.current.emit("message", chatData);
        _sendmsg(chatData);
        // } else {
        //   sendOffline(chatData);
        // }
        // RNToasty.Show({
        //   duration: 1,
        //   title: "Success upload image",
        //   position: "bottom",
        // });
        setloading(true);

        setTimeout(function() {
          if (flatListRef !== null && flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
          }
        }, 2000);
      } else {
        setloading(false);
        //   setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      setloading(false);
      // RNToasty.Show({
      //   duration: 1,
      //   title: "error : someting wrong!",
      //   position: "bottom",
      // });
    }
  };

  // let count = 0;
  useEffect(() => {
    if (item.is_send == false && item.type !== "att_image") {
      socket.current.emit("message", item);
    }
    if (item.is_send == false && item.type == "att_image") {
      setTimeout(function() {
        _uploadimages(item.text, item.id);
      }, 1000);
    }
  }, [connected, socket_connect]);

  // sticker layout
  if (item.type == "sticker") {
    return (
      <AnimatedPlayer
        ref={playerRef}
        animatedSource={{
          uri: item.text,
        }}
        autoplay={true}
        loop={true}
        style={{ width: 100, height: 100 }}
      />
    );
  }

  //  tag city layout
  if (item.type == "tag_city") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onLongPress={() => {
          selectItem(index);
          setSelect(true);
        }}
        onPress={() => {
          select
            ? selectItem(index)
            : navigation.navigate("CountryStack", {
                screen: "CityDetail",
                params: {
                  data: {
                    city_id: data.id,
                  },
                },
              });
        }}
        style={{
          borderWidth: 1,
          borderColor: "#209FAE",
          borderRadius: 15,
          minHeight: 330,
          width: Dimensions.get("screen").width - 120,
          padding: 10,
          marginBottom: 5,
          backgroundColor: "#F6F6F6",
        }}
      >
        <FunImage
          source={{ uri: data.cover }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            marginTop: 10,
          }}
        >
          {/* Title */}
          <Text size="small" type="regular" numberOfLines={2}>
            {t("checkDestination")}
          </Text>
          <Text
            size="title"
            type="black"
            style={{ marginTop: 2 }}
            numberOfLines={2}
          >
            {data.name}
          </Text>
        </View>
        <View>
          <Pressable
            style={{
              alignContent: "center",
              alignItems: "flex-end",
            }}
            onPress={() => {
              navigation.navigate("CountryStack", {
                screen: "CityDetail",
                params: {
                  data: {
                    city_id: data.id,
                  },
                },
              });
            }}
          >
            <View
              style={{
                backgroundColor: "#DAF0F2",
                borderRadius: 3,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                marginTop: 5,
                borderRadius: 5,
              }}
            >
              <Text
                type="bold"
                size="description"
                style={{
                  color: "#209FAE",
                  margin: 5,
                }}
              >
                {t("seedetail")}
              </Text>
            </View>
          </Pressable>
        </View>
      </Pressable>
    );
  }

  // tag province layout
  if (item.type == "tag_province") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onLongPress={() => {
          selectItem(index);
          setSelect(true);
        }}
        onPress={() => {
          select
            ? selectItem(index)
            : navigation.navigate("CountryStack", {
                screen: "Province",
                params: {
                  data: {
                    id: data.id,
                  },
                },
              });
        }}
        style={{
          borderWidth: 1,
          borderColor: "#209FAE",
          backgroundColor: "#F6F6F6",
          borderRadius: 15,
          minHeight: 330,
          padding: 10,
          marginBottom: 5,
          width: Dimensions.get("screen").width - 120,
        }}
      >
        <FunImage
          source={{ uri: data.cover }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            marginTop: 10,
          }}
        >
          {/* Title */}
          <Text size="small" type="regular" numberOfLines={2}>
            {t("checkDestination")}
          </Text>
          <Text
            size="title"
            type="black"
            style={{ marginTop: 2 }}
            numberOfLines={2}
          >
            {data.name}
          </Text>
        </View>
        <View>
          <Pressable
            style={{
              alignContent: "center",
              alignItems: "flex-end",
            }}
            onPress={() => {
              navigation.navigate("CountryStack", {
                screen: "Province",
                params: {
                  data: {
                    id: data.id,
                  },
                },
              });
            }}
          >
            <View
              style={{
                backgroundColor: "#DAF0F2",
                borderRadius: 3,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                marginTop: 5,
                borderRadius: 5,
              }}
            >
              <Text
                type="bold"
                size="description"
                style={{
                  color: "#209FAE",
                  margin: 5,
                }}
              >
                {t("seedetail")}
              </Text>
            </View>
          </Pressable>
        </View>
      </Pressable>
    );
  }

  // tag country layout
  if (item.type == "tag_country") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onLongPress={() => {
          selectItem(index);
          setSelect(true);
        }}
        onPress={() => {
          select
            ? selectItem(index)
            : navigation.navigate("CountryStack", {
                screen: "Country",
                params: {
                  data: {
                    id: data.id,
                  },
                },
                exParam: true,
              });
        }}
        style={{
          borderWidth: 1,
          borderColor: "#209FAE",
          borderRadius: 15,
          minHeight: 330,
          marginVertical: 10,
          width: 250,
          backgroundColor: "#F6F6F6",
        }}
      >
        <FunImage
          source={{ uri: data.cover }}
          style={{
            width: 220,
            height: 220,
            alignSelf: "center",
            margin: 15,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            marginHorizontal: 15,
          }}
        >
          {/* Title */}
          <Text
            size="small"
            // type="black"
            // numberOfLines={1}
          >
            {t("checkDestination")}
          </Text>
          <Text
            size="title"
            type="black"
            style={{ marginTop: 2 }}
            // numberOfLines={1}
          >
            {data.name}
          </Text>
        </View>
        <View>
          <Pressable
            style={{
              alignContent: "center",
              alignItems: "flex-end",
            }}
            onPress={() => {
              navigation.navigate("CountryStack", {
                screen: "Country",
                params: {
                  data: {
                    data: data,
                    exParam: true,
                  },
                },
              });
            }}
          >
            <View
              style={{
                backgroundColor: "#DAF0F2",
                borderRadius: 3,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                marginRight: 10,
                marginBottom: 10,
                marginTop: 5,
                borderRadius: 5,
              }}
            >
              <Text
                type="bold"
                // size="label"
                style={{
                  color: "#209FAE",
                  margin: 5,
                }}
              >
                {" "}
                {t("seedetail")}
              </Text>
            </View>
          </Pressable>
        </View>
      </Pressable>
    );
  }

  // tag_destination layout
  if (item.type == "tag_destination") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onLongPress={() => {
          selectItem(index);
          setSelect(true);
        }}
        onPress={() => {
          select
            ? selectItem(index)
            : navigation.push("DestinationUnescoDetail", {
                id: data.id,
                name: data.name,
              });
        }}
        style={{
          borderWidth: 1,
          borderColor: "#209FAE",
          borderRadius: 15,
          minHeight: 330,
          marginBottom: 5,
          padding: 10,
          width: Dimensions.get("screen").width - 120,
          backgroundColor: "#F6F6F6",
        }}
      >
        <FunImage
          source={{ uri: data.cover }}
          style={{
            width: "100%",
            height: 220,
            alignSelf: "center",
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            marginTop: 10,
          }}
        >
          {/* Title */}
          <Text size="small" type="regular" numberOfLines={2}>
            {t("checkDestination")}
          </Text>
          <Text
            size="title"
            type="black"
            style={{ marginTop: 2 }}
            numberOfLines={2}
          >
            {data.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginVertical: 12,
            }}
          >
            {data.destination_type && data.destination_type.length > 0
              ? data.destination_type.map((value, i) => {
                  if (i < 3) {
                    return (
                      <View
                        key={i}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: 3,
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 5,
                          marginRight: 5,
                          marginBottom: 3,
                        }}
                      >
                        <Text
                          size="small"
                          style={{
                            margin: 5,
                          }}
                          type="bold"
                        >
                          {value.name}
                        </Text>
                      </View>
                    );
                  }
                })
              : null}
            {data.rating ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 3,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  marginRight: 5,
                  marginBottom: 3,
                }}
              >
                <Star width={15} height={15} />
                <Text
                  style={{
                    margin: 5,
                  }}
                  size="small"
                  type="bold"
                >
                  {data?.rating}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View>
          <Pressable
            style={{
              alignContent: "center",
              alignItems: "flex-end",
            }}
            onPress={() => {
              navigation.push("ItineraryStack", {
                screen: "ItineraryPlaning",
                params: {
                  idkiriman: data.id,
                  Position: "destination",
                },
              });
            }}
          >
            <View
              style={{
                backgroundColor: "#DAF0F2",
                borderRadius: 3,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                marginTop: 5,
                borderRadius: 5,
              }}
            >
              <AddHijau
                width={10}
                height={10}
                style={{ backgroundColor: "#DAF0F2" }}
              />
              <Text
                type="bold"
                size="description"
                style={{
                  margin: 5,
                  color: "#209FAE",
                }}
              >
                {t("addToPlan")}
              </Text>
            </View>
          </Pressable>
        </View>
      </Pressable>
    );
  }

  // post layout
  if (item.type == "tag_post") {
    let data = JSON.parse(item.text);
    if (data.id) {
      let scale;
      switch (data.media_orientation) {
        case "L":
          scale = 2.2 / 3;
          break;
        case "P":
          scale = 5 / 4;
          break;
        case "S":
          scale = 1 / 1;
          break;
        default:
          scale = 1 / 1;
          break;
      }
      return (
        <Pressable
          onLongPress={() => {
            selectItem(index);
            setSelect(true);
          }}
          onPress={() => {
            select
              ? selectItem(index)
              : navigation.navigate("FeedStack", {
                  screen: "CommentPost",
                  params: {
                    post_id: data.id,
                    updateDataPost: null,
                    from: "chat",
                    //   comment_id: data.comment_feed.id,
                  },
                });
          }}
          style={{
            borderWidth: 1,
            borderColor: "#209FAE",
            borderRadius: 15,
            paddingVertical: 10,
            marginBottom: 10,
            width: 250,
            backgroundColor: "#F6F6F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              alignItems: "center",
            }}
          >
            <FunImage
              source={{ uri: data?.user.picture }}
              style={{
                width: 33,
                height: 33,
                borderRadius: 18,
                marginRight: 10,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text type="bold" size="description" numberOfLines={1}>
                {data?.user.first_name} {data?.user.last_name}
              </Text>
            </View>
          </View>

          <FunImage
            source={
              data.assets[0].type === "video"
                ? {
                    uri: data?.assets[0].filepath.replace(
                      "output.m3u8",
                      "thumbnail.png"
                    ),
                  }
                : { uri: data?.assets[0].filepath }
            }
            style={{
              width: 248,
              height: 250 * scale,
              alignSelf: "center",
              marginVertical: 10,
              // borderRadius: 10,
            }}
          />

          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: 30,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <LikeBlack width="15" height="15" />
                <Text size="label" type="black" style={{ marginLeft: 5 }}>
                  {data.responseCount}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 15,
                }}
              >
                <CommentBlack width="15" height="15" />
                <Text size="label" type="black" style={{ marginLeft: 5 }}>
                  {data.commentCount}
                </Text>
              </View>
            </View>
            {/* Caption */}
            {data.caption ? (
              <Text numberOfLines={2} style={{ marginBottom: 10 }}>
                <Text size="description" type="black">
                  {data.user.first_name} {data.user.last_name}{" "}
                </Text>
                <Text size="description" type="regular" style={{}}>
                  {data.caption}
                </Text>
              </Text>
            ) : null}
          </View>
        </Pressable>
      );
    } else {
      return null;
    }
  }
  // travel goal layout
  if (item.type == "tag_travel_goal") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onLongPress={() => {
          selectItem(index);
          setSelect(true);
        }}
        onPress={() => {
          select
            ? selectItem(index)
            : navigation.navigate("TravelGoalDetail", {
                article_id: data.id,
              });
        }}
        style={{
          width: Dimensions.get("screen").width - 100,
          borderWidth: 1,
          borderColor: "#209fae",
          borderRadius: 15,
          backgroundColor: "#fff",
          marginBottom: 5,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <FunImage
            source={{ uri: data.cover }}
            style={{ height: 100, width: 100, borderTopLeftRadius: 15 }}
          ></FunImage>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f6f6f6",
              borderTopRightRadius: 15,
              // width: Dimensions.get("screen").width - 200,
              padding: 10,
              // justifyContent: "center",
            }}
          >
            <Text size="small" type="regular" style={{ marginBottom: 5 }}>
              {t("travelgoals")}
            </Text>
            <Text
              size="label"
              type="bold"
              numberOfLines={3}
              style={{ lineHeight: 18 }}
            >
              {data.name}
            </Text>
          </View>
        </View>
        <View>
          <Text
            size="description"
            type="regular"
            style={{ lineHeight: 18, padding: 10 }}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        </View>
      </Pressable>
    );
  }
  // event layout
  if (item.type == "tag_event") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onLongPress={() => {
          selectItem(index);
          setSelect(true);
        }}
        onPress={() => {
          select
            ? selectItem(index)
            : navigation.navigate("eventdetail", {
                event_id: data.id,
                name: data.name,
                token: token,
              });
        }}
        style={{
          width: Dimensions.get("screen").width - 100,
          borderWidth: 1,
          borderColor: "#209fae",
          borderRadius: 10,
          backgroundColor: "#fff",
          marginBottom: 5,
        }}
      >
        <View style={{}}>
          <FunImage
            source={{ uri: data.cover }}
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              height: normalize(150),
              width: "100%",
            }}
          ></FunImage>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f6f6f6",
              padding: 5,
              marginLeft: 5,
            }}
          >
            <Text
              size="label"
              type="bold"
              numberOfLines={1}
              style={{ lineHeight: 18 }}
            >
              {data.name}
            </Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <Text
            size="description"
            type="regular"
            style={{ lineHeight: 16, paddingTop: 10, textAlign: "left" }}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              marginRight: 5,
            }}
          >
            <Text
              size="description"
              type="regular"
              // style={{ lineHeight: 18, padding: 10 }}
              numberOfLines={2}
            >
              {t("date") + " :"}
            </Text>
            <Text
              size="description"
              type="bold"
              // style={{ lineHeight: 18, padding: 10 }}
              numberOfLines={2}
            >
              {dateFormatDateMonthYears(data.startDate)}
              {" - "}
              {dateFormatDateMonthYears(data.endDate)}
            </Text>
          </View>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#DAF0F2",
              borderRadius: 5,
              paddingHorizontal: 5,
              height: 30,
            }}
          >
            <AddHijau
              width={10}
              height={10}
              style={{ backgroundColor: "#DAF0F2", marginRight: 5 }}
            />
            <Text type="bold" size="description" style={{ color: "#209fae" }}>
              {t("seedetail")}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  }
  // journal layout
  if (item.type == "tag_journal") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onLongPress={() => {
          selectItem(index);
          setSelect(true);
        }}
        onPress={() => {
          select
            ? selectItem(index)
            : navigation.navigate("JournalStackNavigation", {
                screen: "DetailJournal",
                params: { dataPopuler: data },
              });
        }}
        style={{
          width: Dimensions.get("screen").width - 100,
          borderWidth: 1,
          borderColor: "#209fae",
          borderRadius: 15,
          backgroundColor: "#fff",
          marginBottom: 5,
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <FunImage
            source={{ uri: data.cover }}
            style={{ height: 100, width: 100, borderTopLeftRadius: 15 }}
          ></FunImage>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f6f6f6",
              borderTopRightRadius: 15,
              // width: Dimensions.get("screen").width - 200,
              padding: 10,
              // justifyContent: "center",
            }}
          >
            <Text size="small" type="regular" style={{ marginBottom: 5 }}>
              {t("traveljournal")}
            </Text>
            <Text
              size="label"
              type="bold"
              numberOfLines={3}
              style={{ lineHeight: 18 }}
            >
              {data.name}
            </Text>
          </View>
        </View>
        <View>
          <Text
            size="description"
            type="regular"
            style={{ lineHeight: 18, padding: 10 }}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        </View>
      </Pressable>
    );
  }
  // movie layout
  if (item.type == "tag_movie") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onLongPress={() => {
          selectItem(index);
          setSelect(true);
        }}
        onPress={() => {
          select
            ? selectItem(index)
            : navigation.navigate("TravelIdeaStack", {
                screen: "Detail_movie",
                params: {
                  movie_id: data.id,
                },
              });
        }}
        style={{
          width: Dimensions.get("screen").width - 100,
          borderWidth: 1,
          borderColor: "#209fae",
          borderRadius: 15,
          backgroundColor: "#fff",
          marginBottom: 5,
          // padding: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <FunImage
            source={{ uri: data.cover }}
            style={{ height: 100, width: 100, borderTopLeftRadius: 10 }}
          ></FunImage>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f6f6f6",
              borderTopRightRadius: 15,
              padding: 10,
            }}
          >
            <Text size="small" type="regular">
              Movie Location
            </Text>
            <Text
              size="label"
              type="bold"
              numberOfLines={3}
              style={{ lineHeight: 18 }}
            >
              {data.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginBottom: 10,
            marginHorizontal: 10,
          }}
        >
          <Text
            size="description"
            type="regular"
            style={{ lineHeight: 16, marginTop: 5 }}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        </View>
      </Pressable>
    );
  }

  // att_image_layout
  if (item.type == "att_image") {
    let scales = "S";
    if (item && item.text) {
      Image.getSize(item.text, (width, height) => {
        if (width > height) {
          scales = "L";
        } else if (width < height) {
          scales = "P";
        } else {
          scales = "S";
        }
      });
    }

    return (
      <>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#209fae",
            borderRadius: 15,
            width: moderateScale(215, 2),
            height: moderateScale(171, 2),
            marginBottom: 5,
            backgroundColor: "#F6F6F6",
            padding: 8,
          }}
        >
          {item.is_send ? (
            <Pressable
              onPress={() => {
                select ? selectItem(index) : setModalss(true);
              }}
              onLongPress={() => {
                selectItem(index);
                setSelect(true);
              }}
            >
              <FunImage
                source={{ uri: item.text }}
                style={{
                  width: "100%",
                  height: "100%",
                  alignSelf: "center",
                  borderRadius: 10,
                }}
              />
            </Pressable>
          ) : (
            <ImageBackground
              onPress={() => {
                select ? selectItem(index) : setModalss(true);
              }}
              onLongPress={() => {
                selectItem(index);
                setSelect(true);
              }}
              source={{ uri: JSON.parse(item.text).path }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
              imageStyle={{
                borderRadius: 10,
              }}
              blurRadius={3}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#209fae" />
              ) : (
                <Pressable
                  onPress={() => {
                    _uploadimages(item.text, item.id);
                    setloading(true);
                  }}
                  style={{
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    height: 40,
                    width: 150,
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: "100%",
                      position: "absolute",
                      backgroundColor: "#000",
                      borderRadius: 5,
                      opacity: 0.7,
                    }}
                  ></View>
                  <View
                    style={{
                      position: "absolute",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Reupload height={15} width={15} />
                    <Text
                      size="label"
                      type="regular"
                      style={{
                        color: "white",
                        marginLeft: 5,
                      }}
                    >
                      {t("reUpload")}
                    </Text>
                  </View>
                </Pressable>
              )}
              {/* <Loadingkirim loadings={loading} /> */}
            </ImageBackground>
          )}
        </Pressable>

        {/* Modal Image Viewer */}

        {/* <Modal
          visible={modalss}
          transparent={true}
          onRequestClose={() => {
            setModalss(false);
          }}
          style={{
            // flex: 1,
            // margin: 0,
            backgroundColor: "#000",
          }}
        >
          <ImageViewer
            style={{ flex: 1 }}
            imageUrls={[{ url: item.text }]}
            useNativeDriver={true}
            onSwipeDown={() => {
              setModalss(false);
            }}
            enableSwipeDown={true}
            renderHeader={() => (
              <TouchableHighlight
                onPress={() => {
                  setModalss(false);
                }}
                style={{
                  marginTop: 35,
                  marginRight: 10,
                  alignSelf: "flex-end",
                  borderWidth: 1,
                  borderColor: "red",
                }}
              >
                <Text
                  size="h5"
                  styles={{ color: "white" }}
                  onPress={() => {
                    // setModalss(false);
                    alert("text");
                  }}
                >
                  {" X "}
                </Text>
              </TouchableHighlight>
            )}
          />
        </Modal> */}

        {/* End Modal Image Viewer */}

        {/* New Image Viewer */}

        <Modal
          onBackdropPress={() => {
            setModalss(false);
            setAngel(0);
          }}
          onRequestClose={() => {
            setModalss(false);
            setAngel(0);
          }}
          onDismiss={() => {
            setModalss(false);
            setAngel(0);
          }}
          transparent={true}
          visible={modalss}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={{
              height: Dimensions.get("screen").height,
              width: Dimensions.get("screen").width,
              backgroundColor: "#000",
              position: "absolute",
              marginTop: SafeStatusBar,
            }}
          ></Pressable>
          <View
            style={{
              marginTop: SafeStatusBar,
              width: Dimensions.get("screen").width,
              height: 45,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingRight: 20,
            }}
          >
            <Pressable
              onPress={() => setModalss(false)}
              style={{
                height: "100%",
                justifyContent: "center",
                paddingLeft: 20,
              }}
            >
              {Platform.OS == "ios" ? (
                <Arrowbackios height={15} width={15}></Arrowbackios>
              ) : (
                <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
              )}
            </Pressable>
            <Pressable
              onPress={() => rotate(90)}
              style={{
                flexDirection: "row",
                height: "100%",
                alignItems: "center",
              }}
            >
              <Text
                size="description"
                type="regular"
                style={{ color: "#fff", marginRight: 10 }}
              >
                Rotate Photo
              </Text>
              <Reupload height={20} width={20}></Reupload>
            </Pressable>
          </View>
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FunImage
              source={{ uri: item.text }}
              style={{
                width:
                  (scales == "P" && angel == 90) ||
                  (scales == "P" && angel == 270)
                    ? "100%"
                    : (scales == "L" && angel == 90) ||
                      (scales == "L" && angel == 270)
                    ? Dimensions.get("screen").height - 80
                    : "100%",
                // angel == 90 || (angel == 270 && )
                //   ? "140%"
                //   : "100%",
                height:
                  (scales == "P" && angel == 90) ||
                  (scales == "P" && angel == 270)
                    ? // ? "120%"
                      Dimensions.get("screen").width
                    : (scales == "L" && angel == 90) ||
                      (scales == "L" && angel == 270)
                    ? Dimensions.get("screen").width
                    : "100%",
                // alignSelf: "center",
                resizeMode: "contain",
                alignItems: "center",
                alignContent: "center",
                transform: [{ rotate: `${angel}deg` }],
              }}
            />
          </View>

          {/* <Image
            source={{ uri: item.text }}
            style={{
              width: angel == 90 || angel == 270 ? "140%" : "100%",
              height: "100%",
              alignSelf: "center",
              resizeMode: "contain",
              transform: [{ rotate: `${angel}deg` }],
            }}
          /> */}
        </Modal>
        {/*End New Image Viewer */}
      </>
    );
  }

  return (
    <View key={item.id}>
      {item.chat == "group" ? (
        item.user_id !== user_id && tmpRChat ? (
          <View
            style={{
              width: Dimensions.get("screen").width - 100,
            }}
          >
            <Text
              numberOfLines={1}
              size="description"
              style={{ marginBottom: 5, paddingRight: 30 }}
            >
              {item.name}
            </Text>
          </View>
        ) : null
      ) : null}
      <View
        style={[
          styles.balloon,
          user_id == item.user_id
            ? {
                backgroundColor: "#DAF0F2",
                borderTopRightRadius: 0,
              }
            : {
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 0,
              },
        ]}
      >
        {/* {item.chat == "group" ? (
          item.user_id !== user_id && tmpRChat ? (
            <Text size="description" type="bold" style={{ marginBottom: 5 }}>
              {item.name}
            </Text>
          ) : null
        ) : null} */}
        <Text
          size="description"
          style={{
            color: "#464646",
            lineHeight: 18,
          }}
        >
          {item.text}
        </Text>
        {tmpRChat ? (
          <View
            style={[
              styles.arrowContainer,
              user_id == item.user_id
                ? styles.arrowRightContainer
                : styles.arrowLeftContainer,
            ]}
          >
            <Svg
              style={
                user_id == item.user_id ? styles.arrowRight : styles.arrowLeft
              }
              height="50"
              width="50"
            >
              <Polygon
                points={
                  user_id == item.user_id
                    ? "0,01 15,01 5,12"
                    : "20,01 0,01 12,12"
                }
                fill={user_id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
                stroke="#209FAE"
                strokeWidth={0.7}
              />
            </Svg>
            <Svg
              style={[
                { position: "absolute" },
                user_id == item.user_id
                  ? {
                      right: moderateScale(-5, 0.5),
                    }
                  : {
                      left: moderateScale(-5, 0.5),
                    },
              ]}
              height="50"
              width="50"
            >
              <Polygon
                points={
                  user_id == item.user_id
                    ? "0,1.3 15,1.1 5,12"
                    : "20,01 0,01 12,13"
                }
                fill={user_id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
              />
            </Svg>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: Dimensions.get("screen").height,
    // backgroundColor: "#fff",
    backgroundColor: "#F3F3F3",
    justifyContent: "space-between",
  },
  item: {
    marginVertical: moderateScale(1, 1),
    flexDirection: "row",
    alignItems: "center",
  },
  itemIn: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  balloon: {
    // maxWidth: moderateScale(230, 2),
    maxWidth:
      Platform.OS == "ios"
        ? moderateScale(Dimensions.get("screen").width - 160, 1)
        : moderateScale(Dimensions.get("screen").width - 120, 1),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 8,
    borderColor: "#209FAE",
    borderWidth: 0.7,
    marginBottom: 5,
  },
  arrowContainer: {
    position: "absolute",
    top: -1,
    zIndex: -1,
  },
  arrowLeftContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    left: -5,
  },

  arrowRightContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    right: -38.5,
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
});
