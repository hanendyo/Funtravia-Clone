import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Modal,
} from "react-native";
import { Text, FunImage, FunImageAutoSize, FunVideo } from "../../component";
import {
  Star,
  AddHijau,
  Reupload,
  Xwhite,
  LikeBlack,
  CommentBlack,
} from "../../assets/svg";
import AnimatedPlayer from "react-native-animated-webp";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../config";
import normalize from "react-native-normalize";
import ImageView from "react-native-image-viewing";
import ImageViewer from "react-native-image-zoom-viewer";

const { width, height } = Dimensions.get("screen");
export default function ChatTypelayout({
  item,
  user_id,
  navigation,
  tmpRChat,
  socket,
  _uploadimage,
  index,
  datas,
  token,
  connected,
  socket_connect,
}) {
  // useEffect(() => {
  //   if (item.chat == "group") {
  //     for (let i of dataMember.buddy) {
  //       item.user_id == i.user_id ? (item.user = i) : null;
  //     }
  //   }
  // }, []);
  let videoView = useRef(null);
  const { t } = useTranslation();
  const playerRef = useRef(null);
  const [loading, setloading] = useState(true);
  const [modalss, setModalss] = useState(false);
  const Loadingkirim = () => {
    setTimeout(() => {
      setloading(false);
    }, 5000);
    if (loading) {
      return <ActivityIndicator size="large" color="#209fae" />;
    } else {
      return (
        <Pressable
          onPress={() => {
            _uploadimage(item.text, item.id);
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
              opacity: 0.3,
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
      );
    }
  };

  let count = 0;
  useEffect(() => {
    if (item.is_send == false && item.type !== "att_image") {
      socket.current.emit("message", item);
    }
    if (item.is_send == false && item.type == "att_image" && count == 0) {
      count = 1;
      setloading(true);
      _uploadimage(item.text, item.id);
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
        style={{
          borderWidth: 1,
          borderColor: "#209FAE",
          borderRadius: 10,
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

  // tag province layout
  if (item.type == "tag_province") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
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
        style={{
          borderWidth: 1,
          borderColor: "#209FAE",
          borderRadius: 10,
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

  // tag country layout
  if (item.type == "tag_country") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
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
        style={{
          borderWidth: 1,
          borderColor: "#209FAE",
          borderRadius: 10,
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
        onPress={() => {
          navigation.push("DestinationUnescoDetail", {
            id: data.id,
            name: data.name,
          });
        }}
        style={{
          borderWidth: 1,
          borderColor: "#209FAE",
          borderRadius: 10,
          minHeight: 330,

          marginBottom: 10,
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
            // width: "100%",
            // alignSelf: "center",
            // borderBottomWidth: 1,
            // borderBottomColor: "d75995",
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
                marginRight: 10,
                marginBottom: 10,
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
          onPress={() => {
            navigation.push("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: data.id,
                //   comment_id: data.comment_feed.id,
              },
            });
          }}
          style={{
            borderWidth: 1,
            borderColor: "#209FAE",
            borderRadius: 10,
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
                  15
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
                  15
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
        onPress={() => {
          navigation.navigate("TravelGoalDetail", {
            article_id: data.id,
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
        <View style={{ flexDirection: "row" }}>
          <FunImage
            source={{ uri: data.cover }}
            style={{ height: 100, width: 100, borderTopLeftRadius: 10 }}
          ></FunImage>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f6f6f6",
              borderTopRightRadius: 10,
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
        onPress={() => {
          navigation.navigate("eventdetail", {
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
              borderTopRightRadius: 10,
              padding: 5,
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
        <View>
          <Text
            size="description"
            type="regular"
            style={{ lineHeight: 16, padding: 10, textAlign: "left" }}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        </View>
      </Pressable>
    );
  }
  // journal layout
  if (item.type == "tag_journal") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onPress={() => {
          navigation.navigate("JournalStackNavigation", {
            screen: "DetailJournal",
            params: { dataPopuler: data },
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
        <View style={{ flexDirection: "row" }}>
          <FunImage
            source={{ uri: data.cover }}
            style={{ height: 100, width: 100, borderTopLeftRadius: 10 }}
          ></FunImage>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f6f6f6",
              borderTopRightRadius: 10,
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
        onPress={() => {
          navigation.navigate("TravelIdeaStack", {
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
          borderRadius: 10,
          backgroundColor: "#fff",
          marginBottom: 5,
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
              borderTopRightRadius: 10,
              // width: Dimensions.get("screen").width - 200,
              padding: 10,
              // justifyContent: "center",
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

  if (item.type == "att_image") {
    // att_image_layout

    return (
      <>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#209fae",
            justifyContent: "center",
            alignContent: "center",
            borderRadius: 10,
            borderTopRightRadius: item.user_id == user_id ? 0 : 10,
            borderTopLeftRadius: item.user_id == user_id ? 10 : 0,
            width: moderateScale(201, 2),
            height: moderateScale(171, 2),
            marginVertical: 5,
            backgroundColor: "#F6F6F6",
          }}
        >
          {item.is_send ? (
            <Pressable onPress={() => setModalss(true)}>
              <FunImage
                source={{ uri: item.text }}
                style={{
                  width: moderateScale(200, 2),
                  height: moderateScale(170, 2),
                  borderTopRightRadius: item.user_id == user_id ? 0 : 10,
                  borderTopLeftRadius: item.user_id == user_id ? 10 : 0,
                  // height: 200,
                  alignSelf: "center",
                  // marginVertical: 10,
                  borderRadius: 10,
                }}
              />
            </Pressable>
          ) : (
            <ImageBackground
              source={{ uri: JSON.parse(item.text).path }}
              style={{
                width: moderateScale(200, 2),
                height: moderateScale(170, 2),
                // maxHeight: 400,
                borderRadius: 10,
                borderTopRightRadius: item.user_id == user_id ? 0 : 10,
                borderTopLeftRadius: item.user_id == user_id ? 10 : 0,
                alignSelf: "center",
                flexDirection: "row",
                // marginVertical: 10,
                // borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
              imageStyle={{
                borderRadius: 10,
                borderTopRightRadius: item.user_id == user_id ? 0 : 10,
                borderTopLeftRadius: item.user_id == user_id ? 10 : 0,
              }}
              blurRadius={3}
            >
              <Loadingkirim />
            </ImageBackground>
          )}
        </Pressable>
        {/* <ImageSlide
        index={index}
        name="Funtravia Chat Images"
        location={""}
        show={modalss}
        dataImage={dataImage}
        setClose={() => setModalss(!modalss)}
      /> */}
        {/* <ImageView
          images={[{ uri: item.text }]}
          imageIndex={0}
          visible={modalss}
          onRequestClose={() => setModalss(false)}
          doubleTapToZoomEnabled={true}
        
        /> */}
        <Modal
          visible={modalss}
          transparent={true}
          onRequestClose={() => {
            setModalss(false);
          }}
        >
          <ImageViewer
            imageUrls={[{ url: item.text }]}
            useNativeDriver={true}
            onSwipeDown={() => {
              setModalss(false);
            }}
            enableSwipeDown={true}
            renderHeader={() => (
              <Pressable
                onPress={() => {
                  setModalss(false);
                }}
              >
                {/* <Xwhite width={20} height={20} styles={{ margin: 10 }} /> */}
                <Text size="h5" styles={{ color: "white" }}>
                  {" X "}
                </Text>
              </Pressable>
            )}
          />
        </Modal>
      </>
    );
  }

  return (
    <View>
      {item.chat == "group" ? (
        item.user_id !== user_id && tmpRChat ? (
          <Text style={{ marginBottom: 5 }}>{item.name}</Text>
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
    maxWidth: moderateScale(230, 2),
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
