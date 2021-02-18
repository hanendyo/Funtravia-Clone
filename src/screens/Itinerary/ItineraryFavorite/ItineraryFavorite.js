import { Thumbnail, View } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Image, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Button, Text } from "../../../component";
import { default_image } from "../../../assets/png";
import {
  Arrowbackwhite,
  Calendargrey,
  LikeRed,
  LikeEmpty,
  PinHijau,
  User,
  TravelStories,
  TravelAlbum,
  Search,
} from "../../../assets/svg";
import { Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation } from "@apollo/client";
import Favorite from "../../../graphQL/Query/Itinerary/ItineraryFavorite";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import { Loading } from "../../../component";
import Ripple from "react-native-material-ripple";
export default function ItineraryFavorite(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Itinerary Favorite",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Itinerary Favorite",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };
  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
  let [textInput, setTextInput] = useState("");
  let [text, setText] = useState("");
  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  const cari = async (x) => {
    await setText(textInput);
    await fetchDataListFavorite();
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    await fetchDataListFavorite();
  };

  const [
    fetchDataListFavorite,
    { data: data, loading: loadingPopuler, error: errorFavorite },
  ] = useLazyQuery(Favorite, {
    variables: {
      keyword: textInput,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationliked,
    { loading: loadingLike, error: errorLike },
  ] = useMutation(ItineraryLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(ItineraryUnliked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id, index) => {
    if (token || token !== "") {
      try {
        let response = await mutationliked({
          variables: {
            id: id,
            qty: 1,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.setItineraryFavorit.code === 200 ||
            response.data.setItineraryFavorit.code === "200"
          ) {
            fetchDataListFavorite();
          } else {
            throw new Error(response.data.setItineraryFavorit.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id, index) => {
    if (token || token !== "") {
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
          },
        });
        if (loadingUnLike) {
          Alert.alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unsetItineraryFavorit.code === 200 ||
            response.data.unsetItineraryFavorit.code === "200"
          ) {
            fetchDataListFavorite();
          } else {
            throw new Error(response.data.unsetItineraryFavorit.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return (
      Difference_In_Days +
      1 +
      " " +
      "Day" +
      " " +
      Difference_In_Days +
      " " +
      "Night"
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);
  {
    /* ======================================= Render All ====================================================*/
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width,
            zIndex: 5,
          }}
        >
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              height: 50,
              zIndex: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#F0F0F0",
                borderRadius: 5,
                width: Dimensions.get("window").width - 20,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Search style={{ marginHorizontal: 20 }} />
              <TextInput
                underlineColorAndroid="transparent"
                placeholder={t("search")}
                style={{
                  width: "100%",
                  padding: 0,
                }}
                returnKeyType="search"
                onChangeText={(x) => setTextInput(x)}
              />
            </View>
          </View>
        </View>
        <FlatList
          ListHeaderComponent={() =>
            loadingPopuler ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  height: Dimensions.get("screen").height,
                  alignItems: "center",
                  paddingVertical: 20,
                }}
              >
                <Text size="title" type="bold">
                  Loading ...
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item, index }) =>
            data?.itinerary_list_favorite.length ? (
              <View
                style={{
                  height: 145,
                  paddingHorizontal: 15,
                  marginTop: 5,
                }}
              >
                <View
                  style={{
                    borderRadius: 5,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: arrayShadow.shadowOpacity,
                    shadowRadius: arrayShadow.shadowRadius,
                    elevation: arrayShadow.elevation,
                    justifyContent: "space-between",
                    backgroundColor: "#F7F7F7",
                    overflow: "hidden",
                  }}
                >
                  <View
                    // onPress={() =>
                    //   props.navigation.navigate("ItineraryStack", {
                    //     screen: "itindetail",
                    //     params: {
                    //       itintitle: item.name,
                    //       country: item.id,
                    //       token: token,
                    //       status: "favorite",
                    //     },
                    //   })
                    // }
                    style={{
                      backgroundColor: "#FFFFFF",
                      height: "77%",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      flexDirection: "row",
                    }}
                  >
                    <Ripple
                      onPress={() =>
                        props.navigation.navigate("ItineraryStack", {
                          screen: "itindetail",
                          params: {
                            itintitle: item.name,
                            country: item.id,
                            token: token,
                            status: "favorite",
                          },
                        })
                      }
                    >
                      <Image
                        source={
                          item && item.cover
                            ? { uri: item.cover }
                            : default_image
                        }
                        style={{
                          height: "100%",
                          width: Dimensions.get("screen").width * 0.33,
                          borderTopLeftRadius: 5,
                        }}
                      />
                    </Ripple>
                    <View
                      style={{
                        width: Dimensions.get("screen").width * 0.58,
                        paddingHorizontal: 10,
                        backgroundColor: "#FFFFFF",
                        marginVertical: 5,
                        overflow: "hidden",
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#DAF0F2",
                              borderWidth: 1,
                              borderRadius: 3,
                              borderColor: "#209FAE",
                              paddingHorizontal: 5,
                            }}
                          >
                            <Text
                              type="bold"
                              size="description"
                              style={{ color: "#209FAE" }}
                            >
                              {item?.categori?.name
                                ? item?.categori?.name
                                : "No Category"}
                            </Text>
                          </View>
                          <View>
                            {item.liked === false ? (
                              <Ripple onPress={() => _liked(item.id, index)}>
                                <LikeEmpty height={15} width={15} />
                              </Ripple>
                            ) : (
                              <Ripple onPress={() => _unliked(item.id, index)}>
                                <LikeRed height={15} width={15} />
                              </Ripple>
                            )}
                          </View>
                        </View>
                        <Text
                          size="label"
                          type="black"
                          style={{ marginTop: 5 }}
                        >
                          <Truncate text={item.name} length={40} />
                        </Text>
                        <View></View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <PinHijau width={15} height={15} />
                          <Text
                            style={{ marginLeft: 5 }}
                            size="small"
                            type="regular"
                          >
                            {item?.country?.name}
                          </Text>
                          <Text>,</Text>
                          <Text
                            size="small"
                            type="regular"
                            style={{ marginLeft: 3 }}
                          >
                            {item?.city?.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: 20,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginLeft: 3,
                            }}
                          >
                            <Calendargrey
                              width={10}
                              height={10}
                              style={{ marginRight: 5 }}
                            />
                            <Text
                              style={{ marginLeft: 3 }}
                              size="small"
                              type="regular"
                            >
                              {item.start_date && item.end_date
                                ? getDN(item.start_date, item.end_date)
                                : null}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginLeft: 15,
                            }}
                          >
                            <User
                              width={10}
                              height={10}
                              style={{ marginRight: 5 }}
                            />
                            <Text size="small" type="regular">
                              {(item && item.buddy_count
                                ? item.buddy_count
                                : null) +
                                " " +
                                "Person"}
                            </Text>
                          </View>
                        </View>
                        {/* <View
                          style={{
                            marginTop: 3,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Star height={15} width={15} style={{}} />
                          <Text
                            style={{ marginLeft: 5, color: "#249FAE" }}
                            size="small"
                            type="bold"
                          >
                            4,1
                          </Text>
                          <Text style={{ marginLeft: 5 }} size="small" type="regular">
                            (283 reviews)
                          </Text>
                        </View> */}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      // borderWidth: 1,
                      height: "20%",
                      flexDirection: "row",
                      backgroundColor: "#FFFFFF",
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#D1D1D1",
                        paddingVertical: 5,
                      }}
                    >
                      <TravelAlbum style={{ marginRight: 5 }} />
                      <Text
                        size="small"
                        type="bold"
                        style={{ color: "#209FAE" }}
                      >
                        Travel Album
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TravelStories style={{ marginRight: 5 }} />
                      <Text
                        size="small"
                        type="bold"
                        style={{ color: "#209FAE" }}
                      >
                        Travel Stories
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  height: Dimensions.get("screen").height,
                  backgroundColor: "white",
                  zIndex: 99,
                }}
              >
                <Text>tidak ada data</Text>
              </View>
            )
          }
          ListFooterComponent={
            data === null ? (
              <View>
                <Text>Tidak ada data</Text>
              </View>
            ) : null
          }
          data={data?.itinerary_list_favorite}
          keyExtractor={(data) => data.id}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
