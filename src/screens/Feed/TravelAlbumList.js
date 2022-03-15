import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import { useSelector } from "react-redux";
import {
  Arrowbackios,
  Arrowbackwhite,
  ArrowRightHome,
  PlayVideo,
} from "../../assets/svg";
import { Button, FunVideo, Text } from "../../component";
import TravelAlbumListQuery from "../../graphQL/Query/Album/TravelAlbumList";
import { useTranslation } from "react-i18next";

export default function TravelAlbumList(props) {
  const { t } = useTranslation();
  const tokenApps = useSelector((data) => data.token);
  const [dataTravelAlbum, setDataTravelAlbum] = useState([]);

  const [travelAlbum] = useLazyQuery(TravelAlbumListQuery, {
    variables: {
      itinerary_id: props?.route?.params?.itinerary_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    // pollInterval: 5500,
    notifyOnNetworkStatusChange: true,
    onCompleted: (dataAlbum) => {
      if (dataAlbum) {
        setDataTravelAlbum(dataAlbum?.list_album_itinerary_with_media);
      }
    },
  });

  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarBadge: null,
    tabBarLabel: "Message",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        Travel Album
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    travelAlbum();
  }, [props.navigation]);

  return (
    <View style={styles.main}>
      {/* VIEW TRIP */}
      <View style={styles.viewTripParent}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between", //Centered horizontally
            alignItems: "center", //Centered vertically
            paddingHorizontal: 20,
            width: Dimensions.get("screen").width,
          }}
        >
          <Text
            numberOfLines={2}
            size={"label"}
            type={"bold"}
            style={{
              marginRight: 10,
              flex: 1,
            }}
          >
            {dataTravelAlbum?.name}
          </Text>
          <TouchableHighlight
            onPress={() => {
              props.navigation.navigate("ItineraryStack", {
                screen: "itindetail",
                params: {
                  itintitle: dataTravelAlbum?.name,
                  country: props?.route?.params?.itinerary_id,
                  index: 0,
                  data_from: "travelAlbumList",
                },
              });
            }}
            underlayColor="white"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Text
                size={"label"}
                style={{
                  color: "#209fae",
                  marginRight: 5,
                }}
              >
                {t("viewTrip")}
              </Text>
              <ArrowRightHome height={12} width={12}></ArrowRightHome>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      {/* LIST ALBUM */}
      <Animated.View style={styles.listAlbumParent}>
        <FlatList
          data={dataTravelAlbum?.album}
          keyExtractor={(item, index) => `${item}-${index}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return item && item.media.length > 0 ? (
              <View
                style={{
                  height: 380,
                  width: Dimensions.get("screen").width,
                  backgroundColor: "white",
                  justifyContent: "space-evenly",
                }}
              >
                <Text size={"label"} type={"bold"} style={{ paddingLeft: 15 }}>
                  {item.title}
                </Text>
                {/* IMAGE PARENT */}
                <View
                  style={{
                    height: 285,
                    width: Dimensions.get("screen").width - 50,
                    backgroundColor: "white",
                    alignSelf: "center",
                    borderRadius: 5,
                    justifyContent: "space-evenly",
                    paddingVertical: 6,
                    marginBottom: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  {/* BIG IMAGE */}
                  {item && item.media[0] && item?.media[0].filepath ? (
                    <TouchableHighlight
                      underlayColor="white"
                      onPress={() =>
                        props.navigation.push("FeedStack", {
                          screen: "AlbumDetailItinerary",
                          params: {
                            id: item?.id,
                            type: null,
                            judul: item?.title,
                          },
                        })
                      }
                    >
                      <>
                        {item.media[0].type == "image" ? (
                          <Image
                            source={{ uri: item.media[0].filepath }}
                            style={{
                              height: 150,
                              width: Dimensions.get("screen").width - 65,
                              justifyContent: "space-evenly",
                              alignSelf: "center",
                              borderRadius: 5,
                            }}
                          ></Image>
                        ) : (
                          <>
                            <FunVideo
                              source={{
                                uri: item.media[0].filepath,
                              }}
                              posterResizeMode={"cover"}
                              poster={item.media[0].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              paused={true}
                              style={{
                                width: Dimensions.get("screen").width - 65,
                                height: 150,
                                alignSelf: "center",
                                borderRadius: 5,
                              }}
                              resizeMode="cover"
                            />
                            <View
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "95%",
                                borderRadius: 5,
                                alignSelf: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                // opacity: 0.3,
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 0,
                              }}
                            >
                              <PlayVideo
                                height={40}
                                width={40}
                                style={{ position: "relative", zIndex: 1 }}
                              />
                            </View>
                          </>
                        )}
                      </>
                    </TouchableHighlight>
                  ) : (
                    <View
                      style={{
                        alignSelf: "center",
                        height: 150,
                        width: Dimensions.get("screen").width - 65,
                        backgroundColor: "#e1e1e1",
                        borderRadius: 5,
                      }}
                    ></View>
                  )}

                  {/* SMALL IMAGE */}

                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center",
                      justifyContent: "space-between",
                      width: Dimensions.get("screen").width - 65,
                      borderRadius: 5,
                    }}
                  >
                    {item && item.media[1] && item?.media[1].filepath ? (
                      <TouchableHighlight
                        underlayColor="white"
                        style={{ width: "32.5%" }}
                        onPress={() =>
                          props.navigation.push("FeedStack", {
                            screen: "AlbumDetailItinerary",
                            params: {
                              id: item?.id,
                              type: null,
                              judul: item?.title,
                            },
                          })
                        }
                      >
                        <>
                          {item.media[1].type == "image" ? (
                            <Image
                              source={{ uri: item.media[1].filepath }}
                              style={{
                                height: 110,
                                width: "100%",
                                justifyContent: "space-evenly",
                                alignSelf: "center",
                                borderRadius: 5,
                              }}
                            ></Image>
                          ) : (
                            <>
                              <FunVideo
                                source={{
                                  uri: item.media[1].filepath,
                                }}
                                posterResizeMode={"cover"}
                                poster={item.media[1].filepath.replace(
                                  "output.m3u8",
                                  "thumbnail.png"
                                )}
                                paused={true}
                                style={{
                                  alignSelf: "center",
                                  height: 110,
                                  width: "100%",
                                  borderRadius: 5,
                                }}
                                resizeMode="cover"
                              />
                              <View
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "95%",
                                  borderRadius: 5,
                                  alignSelf: "center",
                                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  zIndex: 0,
                                }}
                              >
                                <PlayVideo
                                  height={25}
                                  width={25}
                                  style={{ position: "relative", zIndex: 1 }}
                                />
                              </View>
                            </>
                          )}
                        </>
                      </TouchableHighlight>
                    ) : (
                      <View
                        style={{
                          alignSelf: "center",
                          height: 110,
                          width: "32.5%",
                          backgroundColor: "#e1e1e1",
                          borderRadius: 5,
                        }}
                      ></View>
                    )}
                    {item && item.media[2] && item?.media[2].filepath ? (
                      <TouchableHighlight
                        underlayColor="white"
                        style={{ width: "32.5%" }}
                        onPress={() =>
                          props.navigation.push("FeedStack", {
                            screen: "AlbumDetailItinerary",
                            params: {
                              id: item?.id,
                              type: null,
                              judul: item?.title,
                            },
                          })
                        }
                      >
                        <>
                          {item.media[2].type == "image" ? (
                            <Image
                              source={{ uri: item.media[2].filepath }}
                              style={{
                                height: 110,
                                width: "100%",
                                justifyContent: "space-evenly",
                                alignSelf: "center",
                                borderRadius: 5,
                              }}
                            ></Image>
                          ) : (
                            <>
                              <FunVideo
                                source={{
                                  uri: item.media[2].filepath,
                                }}
                                posterResizeMode={"cover"}
                                poster={item.media[2].filepath.replace(
                                  "output.m3u8",
                                  "thumbnail.png"
                                )}
                                paused={true}
                                style={{
                                  alignSelf: "center",
                                  height: 110,
                                  width: "100%",
                                  borderRadius: 5,
                                }}
                                resizeMode="cover"
                              />
                              <View
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "95%",
                                  borderRadius: 5,
                                  alignSelf: "center",
                                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  zIndex: 0,
                                }}
                              >
                                <PlayVideo
                                  height={25}
                                  width={25}
                                  style={{ position: "relative", zIndex: 1 }}
                                />
                              </View>
                            </>
                          )}
                        </>
                      </TouchableHighlight>
                    ) : (
                      <View
                        style={{
                          alignSelf: "center",
                          height: 110,
                          backgroundColor: "#e1e1e1",
                          borderRadius: 5,
                          width: "32.5%",
                        }}
                      ></View>
                    )}
                    {item && item.media[3] && item?.media[3].filepath ? (
                      <TouchableHighlight
                        underlayColor="white"
                        style={{ width: "32.5%" }}
                        onPress={() =>
                          props.navigation.push("FeedStack", {
                            screen: "AlbumDetailItinerary",
                            params: {
                              id: item?.id,
                              type: null,
                              judul: item?.title,
                            },
                          })
                        }
                      >
                        <>
                          {item.media[3].type == "image" ? (
                            <Image
                              source={{ uri: item.media[3].filepath }}
                              style={{
                                height: 110,
                                width: "100%",
                                justifyContent: "space-evenly",
                                alignSelf: "center",
                                borderRadius: 5,
                              }}
                            ></Image>
                          ) : (
                            <>
                              <FunVideo
                                source={{
                                  uri: item.media[3].filepath,
                                }}
                                posterResizeMode={"cover"}
                                poster={item.media[3].filepath.replace(
                                  "output.m3u8",
                                  "thumbnail.png"
                                )}
                                paused={true}
                                style={{
                                  alignSelf: "center",
                                  height: 110,
                                  width: "100%",
                                  borderRadius: 5,
                                }}
                                resizeMode="cover"
                              />
                              <View
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "95%",
                                  borderRadius: 5,
                                  alignSelf: "center",
                                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  zIndex: 0,
                                }}
                              >
                                <PlayVideo
                                  height={25}
                                  width={25}
                                  style={{ position: "relative", zIndex: 1 }}
                                />
                              </View>
                            </>
                          )}

                          {item.media.length > 4 ? (
                            <Text
                              style={{
                                position: "absolute",
                                alignSelf: "center",
                                top: 45,
                              }}
                            >
                              View all
                            </Text>
                          ) : null}
                        </>
                      </TouchableHighlight>
                    ) : (
                      <View
                        style={{
                          alignSelf: "center",
                          height: 110,
                          backgroundColor: "#e1e1e1",
                          borderRadius: 5,
                          width: "32.5%",
                        }}
                      ></View>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    width: Dimensions.get("screen").width - 50,
                    borderBottomWidth: 1,
                    alignSelf: "center",
                    borderBottomEndRadius: 10,
                    borderColor: "#d1d1d1",
                  }}
                ></View>
              </View>
            ) : null;
          }}
        />
        <View style={{ height: Platform.OS == "ios" ? 140 : 170 }}></View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#f6f6f6",
    height: Dimensions.get("screen").height,
  },
  viewTripParent: {
    height: 50,
    backgroundColor: "white",
  },
  listAlbumParent: {
    height: Dimensions.get("screen").height,
    marginTop: 5,
    backgroundColor: "#f6f6f6",
  },
});
