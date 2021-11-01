import { Thumbnail, View } from "native-base";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
  Pressable,
  Modal as ModalRN,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Button, Text } from "../../../component";
import { default_image, Bg_soon } from "../../../assets/png";
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
  Newglobe,
  Padlock,
  Xblue,
  Arrowbackios,
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
  const { t } = useTranslation();
  let [soon, setSoon] = useState(false);
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("itineraryFavorite")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
      color: "white",
      marginLeft: -10,
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={20} width={20}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
  let [textInput, setTextInput] = useState("");
  let [text, setText] = useState("");
  let { width, height } = Dimensions.get("screen");
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
      <View style={{ flexDirection: "row" }}>
        <Text size="description">
          {Difference_In_Days + 1 > 1
            ? Difference_In_Days + 1 + " " + t("days")
            : Difference_In_Days + 1 + " " + t("day")}{" "}
          {Difference_In_Days > 1
            ? Difference_In_Days + " " + t("nights")
            : Difference_In_Days + " " + t("night")}
        </Text>
      </View>
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
      <ModalRN
        useNativeDriver={true}
        visible={soon}
        onRequestClose={() => setSoon(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          // onPress={() => setModalLogin(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            borderRadius: 5,
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              // backgroundColor: "white",
              // width: Dimensions.get("screen").width - 100,
              padding: 20,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Image
              source={Bg_soon}
              style={{
                height: Dimensions.get("screen").width - 180,
                width: Dimensions.get("screen").width - 110,
                position: "absolute",
                borderRadius: 5,
              }}
            />
            <Text type="bold" size="h5">
              {t("comingSoon")}!
            </Text>
            <Text type="regular" size="label" style={{ marginTop: 5 }}>
              {t("soonUpdate")}.
            </Text>
            <Button
              text={"OK"}
              style={{
                marginTop: 20,
                width: Dimensions.get("screen").width - 300,
              }}
              type="box"
              onPress={() => setSoon(false)}
            ></Button>
          </View>
        </View>
      </ModalRN>
      <View
        style={{
          backgroundColor: "#fff",
          backgroundColor: "#FFF",
          shadowColor: "#FFF",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,
          elevation: 6,
        }}
      >
        <View
          style={{
            marginVertical: 15,
            marginHorizontal: 15,
            width: Dimensions.get("screen").width - 30,
            height: 40,
            backgroundColor: "#f6f6f6",
            borderRadius: 5,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Search height={20} width={20} style={{ marginHorizontal: 10 }} />
          <TextInput
            style={{ flex: 1, borderRadius: 5, marginRight: 5 }}
            value={textInput}
            underlineColorAndroid="transparent"
            onChangeText={(x) => setTextInput(x)}
            placeholder={t("search")}
            placeholderTextColor="#464646"
            returnKeyType="search"
            // autoFocus={true}
            fontSize={16}
          />
          {textInput.length !== 0 ? (
            <TouchableOpacity
              onPress={() => {
                setTextInput("");
              }}
            >
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {data?.itinerary_list_favorite.length > 0 ? (
        <FlatList
          renderItem={({ item, index }) => (
            <View
              style={{
                height: 200,
                paddingHorizontal: 15,
                marginTop: 15,
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
                  backgroundColor: "#f6f6f6",
                  overflow: "hidden",
                }}
              >
                <Pressable
                  onPress={() =>
                    props.navigation.navigate("ItineraryStack", {
                      screen: "itindetail",
                      params: {
                        itintitle: item.name,
                        country: item.id,
                        token: token,
                        status: "favorite",
                        index: 0,
                      },
                    })
                  }
                  style={{
                    backgroundColor: "#FFFFFF",
                    height: "77%",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    flexDirection: "row",
                    zIndex: -1,
                  }}
                >
                  <Pressable
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
                        item && item.cover ? { uri: item.cover } : default_image
                      }
                      style={{
                        height: "100%",
                        width: Dimensions.get("screen").width * 0.37,
                        borderTopLeftRadius: 5,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        height: 30,
                        marginTop: 10,
                        margin: 5,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          height: 32,
                          width: 32,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: "rgba(52, 52, 52, 0.75)",
                          zIndex: 1,
                        }}
                        source={
                          item && item.user_created && item.user_created.picture
                            ? { uri: item.user_created.picture }
                            : default_image
                        }
                      />
                      <Text
                        size="description"
                        type="bold"
                        style={{
                          zIndex: 0,
                          paddingLeft: 5,
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          borderRadius: 2,
                          color: "white",
                          marginLeft: -5,
                          padding: 2,
                          paddingBottom: 5,
                        }}
                      >
                        {Truncate({
                          text: item?.user_created?.first_name
                            ? item?.user_created?.first_name
                            : "unknown",
                          length: 13,
                        })}
                      </Text>
                    </View>
                  </Pressable>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      backgroundColor: "#FFFFFF",
                      overflow: "hidden",
                      paddingVertical: 10,
                      borderRadius: 3,
                      justifyContent: "space-between",
                      // borderWidth: 1,
                    }}
                  >
                    <View style={{ justifyContent: "flex-start" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
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
                              style={{ color: "#209FAE", paddingBottom: 3 }}
                            >
                              {item?.categori?.name
                                ? item?.categori?.name
                                : "No Category"}
                            </Text>
                          </View>
                          <View
                            style={{
                              height: 6,
                              width: 6,
                              borderRadius: 3,
                              marginHorizontal: 10,
                              backgroundColor: "#000",
                            }}
                          />
                          {item?.isprivate ? (
                            <Padlock height={20} width={20} />
                          ) : (
                            <Newglobe height={20} width={20} />
                          )}
                        </View>
                        <View>
                          {item.liked === false ? (
                            <TouchableOpacity
                              style={{
                                padding: 5,
                              }}
                              onPress={() => _liked(item.id, index, item)}
                            >
                              <LikeEmpty height={15} width={15} />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{
                                padding: 5,
                              }}
                              onPress={() => _unliked(item.id, index, item)}
                            >
                              <LikeRed height={15} width={15} />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      <Text
                        size="title"
                        type="black"
                        style={{ marginTop: 5 }}
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <PinHijau width={13} height={13} />
                        <Text
                          style={{ marginLeft: 5 }}
                          size="description"
                          type="regular"
                        >
                          {item?.country?.name}
                        </Text>
                        <Text>,</Text>
                        <Text
                          size="description"
                          type="regular"
                          style={{ marginLeft: 3 }}
                        >
                          {item?.city?.name}
                        </Text>
                      </View>
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
                          marginRight: 10,
                        }}
                      >
                        <Calendargrey
                          width={12}
                          height={12}
                          style={{ marginRight: 5 }}
                        />

                        {item.start_date && item.end_date ? (
                          <Text
                            // style={{ marginLeft: 3 }}
                            size="description"
                            type="regular"
                          >
                            {getDN(item.start_date, item.end_date)}
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          // marginLeft: 10,
                        }}
                      >
                        <User
                          width={12}
                          height={12}
                          style={{ marginRight: 5 }}
                        />
                        {item.buddy_count > 1 ? (
                          <Text size="description" type="regular">
                            {(item && item.buddy_count
                              ? item.buddy_count
                              : null) +
                              " " +
                              t("persons")}
                          </Text>
                        ) : (
                          <Text size="description" type="regular">
                            {(item && item.buddy_count
                              ? item.buddy_count
                              : null) +
                              " " +
                              t("person")}
                          </Text>
                        )}
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
                </Pressable>
                <View
                  style={{
                    height: "20%",
                    flexDirection: "row",
                    backgroundColor: "#FFFFFF",
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate("ItineraryStack", {
                        screen: "itindetail",
                        params: {
                          itintitle: item.name,
                          country: item.id,
                          token: token,
                          status: "favorite",
                          index: 1,
                        },
                      })
                    }
                    style={{
                      width: "50%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRightWidth: 1,
                      borderColor: "#D1D1D1",
                      marginBottom: 5,
                    }}
                  >
                    <TravelAlbum
                      style={{ marginRight: 5 }}
                      height={13}
                      width={13}
                    />
                    <Text
                      size="description"
                      type="bold"
                      style={{ color: "#209FAE" }}
                    >
                      {t("travelAlbum")}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSoon(true)}
                    // onPress={() =>
                    //   props.navigation.navigate("ItineraryStack", {
                    //     screen: "itindetail",
                    //     params: {
                    //       itintitle: item.name,
                    //       country: item.id,
                    //       token: token,
                    //       status: "favorite",
                    //       index: 2,
                    //     },
                    //   })
                    // }
                    style={{
                      width: "50%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 5,
                    }}
                  >
                    <TravelStories
                      style={{ marginRight: 5 }}
                      height={13}
                      width={13}
                    />
                    <Text
                      size="description"
                      type="regular"
                      style={{
                        color: "#c7c7c7",
                      }}
                      // style={{ color: "#209FAE" }}
                    >
                      {t("travelStories")}
                    </Text>
                    {/* <TravelStories
                        style={{ marginRight: 5 }}
                        height={10}
                        width={10}
                      />
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          color: "#c7c7c7",
                        }}
                        // style={{ color: "#209FAE" }}
                      >
                        Travel Stories
                      </Text> */}
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
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
                <ActivityIndicator
                  animating={true}
                  size="small"
                  color="#209FAE"
                />
              </View>
            ) : null
          }
          data={data?.itinerary_list_favorite}
          keyExtractor={(data) => data.id}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            backgroundColor: "white",
            alignItems: "center",
            paddingTop: 10,
            flex: 1,
          }}
        >
          {loadingPopuler ? (
            <View
              style={{
                width: width,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator color="#209FAE" animating={true} />
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "white",
                paddingVertical: 20,
                flex: 1,
              }}
            >
              <Text size="label" type="bold">
                {t("noData")}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
