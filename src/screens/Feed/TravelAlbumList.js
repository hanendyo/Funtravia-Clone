import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";
import {
  Arrow,
  Arrowbackios,
  Arrowbackwhite,
  ArrowRight,
  ArrowRightBlue,
  ArrowRightHome,
} from "../../assets/svg";
import { Button, Text } from "../../component";
import TravelAlbumListQuery from "../../graphQL/Query/Album/TravelAlbumList";

export default function TravelAlbumList(props) {
  const tokenApps = useSelector((data) => data.token);
  const [dataTravelAlbum, setDataTravelAlbum] = useState([]);

  const [
    travelAlbum,
    {
      loading: loadingAlbum,
      data: dataAlbum,
      error: errorAlbum,
      networkStatus,
    },
  ] = useLazyQuery(TravelAlbumListQuery, {
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
    // headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {`Travel Album`}
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
            flex: 1,
            paddingHorizontal: 20,
            width: Dimensions.get("screen").width,
          }}
        >
          <Text
            numberOfLines={2}
            size={"label"}
            type={"bold"}
            style={{
              width: Dimensions.get("screen").width - 120,
              marginRight: 10,
            }}
          >
            {dataTravelAlbum?.name}
          </Text>
          <Button
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
            text={""}
            size="medium"
            type="circle"
            variant="transparent"
            //   onPress={() => props.navigation.goBack()}
            style={{
              height: 55,
              flexDirection: "row",
              alignItems: "center", //Centered vertically
              width: 90,
              height: 30,
            }}
          >
            <Text
              size={"label"}
              style={{
                color: "#209fae",
                paddingRight: 15,
              }}
            >
              View Trip
            </Text>
            <ArrowRightHome
              height={12}
              width={12}
              style={{ left: -10 }}
            ></ArrowRightHome>
          </Button>
        </View>
      </View>
      {/* LIST ALBUM */}
      <Animated.View style={styles.listAlbumParent}>
        <FlatList
          data={dataTravelAlbum?.album}
          keyExtractor={(item, index) => `${item}-${index}`}
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
                    justifyContent: "space-evenly",
                    alignSelf: "center",
                    borderRadius: 5,
                    marginBottom: 10,
                    borderWidth: 0.5,
                    borderColor: "#d1d1d1",
                    paddingVertical: 6,
                    // shadow
                    backgroundColor: Platform.OS === "ios" ? "#fff" : null,
                    borderColor: "#ddd",
                    shadowColor: Platform.OS === "ios" ? "#ddd" : "#fff",
                    shadowOffset: {
                      width: Platform.OS === "ios" ? 3 : 0,
                      height: Platform.OS === "ios" ? 3 : 2,
                    },
                    shadowOpacity: Platform.OS === "ios" ? 1 : 0.8,
                    shadowRadius: Platform.OS === "ios" ? null : 40,
                    elevation: Platform.OS === "ios" ? null : 4,
                  }}
                >
                  {/* BIG IMAGE */}
                  {item && item.media[0] && item?.media[0].filepath ? (
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.push("ProfileStack", {
                          screen: "albumdetail",
                          params: {
                            id: item?.id,
                            type: null,
                            judul: item?.title,
                          },
                        })
                      }
                    >
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
                    </TouchableOpacity>
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
                      <TouchableOpacity
                        style={{ width: "32.5%" }}
                        onPress={() =>
                          props.navigation.push("ProfileStack", {
                            screen: "albumdetail",
                            params: {
                              id: item?.id,
                              type: null,
                              judul: item?.title,
                            },
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.media[1].filepath }}
                          style={{
                            alignSelf: "center",
                            height: 110,
                            width: "100%",
                            borderRadius: 5,
                          }}
                        ></Image>
                      </TouchableOpacity>
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
                      <TouchableOpacity
                        style={{ width: "32.5%" }}
                        onPress={() =>
                          props.navigation.push("ProfileStack", {
                            screen: "albumdetail",
                            params: {
                              id: item?.id,
                              type: null,
                              judul: item?.title,
                            },
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.media[2].filepath }}
                          style={{
                            alignSelf: "center",
                            height: 110,
                            width: "100%",
                            borderRadius: 5,
                          }}
                        ></Image>
                      </TouchableOpacity>
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
                      <TouchableOpacity
                        style={{ width: "32.5%" }}
                        onPress={() =>
                          props.navigation.push("ProfileStack", {
                            screen: "albumdetail",
                            params: {
                              id: item?.id,
                              type: null,
                              judul: item?.title,
                            },
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.media[3].filepath }}
                          style={{
                            alignSelf: "center",
                            height: 110,
                            width: "100%",
                            borderRadius: 5,
                            opacity: item.media.length > 4 ? 0.2 : null,
                          }}
                        ></Image>
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
                      </TouchableOpacity>
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
    backgroundColor: "#e1e1e1",
    height: Dimensions.get("screen").height,
  },
  viewTripParent: {
    height: 50,
    backgroundColor: "white",
  },
  listAlbumParent: {
    height: Dimensions.get("screen").height,
    marginTop: 5,
    backgroundColor: "#e1e1e1",
  },
});
