import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Platform,
  Modal as ModalRN,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Arrowbackwhite,
  SearchWhite,
  Calendargrey,
  LikeRed,
  LikeEmpty,
  PinHijau,
  User,
  TravelStories,
  TravelAlbum,
  Star,
  Arrowbackios,
  TravelStoriesdis,
  AlbumIconGray,
  ItineraryIconGray,
  ItineraryIcon,
  Newglobe,
  Padlock,
  CalendarItinerary,
  PeopleItinerary,
} from "../../../assets/svg";
import { Text, Button, FunIcon } from "../../../component/index";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import Populer from "../../../graphQL/Query/Itinerary/ItineraryPopuler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image, Bg_soon } from "../../../assets/png";
import { Truncate, Loading } from "../../../component";
import Ripple from "react-native-material-ripple";
// import {
//   renderers,
//   Menu,
//   MenuOptions,
//   MenuOption,
//   MenuTrigger,
//   MenuProvider,
// } from "react-native-popup-menu";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { Thumbnail } from "native-base";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import { RNToasty } from "react-native-toasty";

export default function ItineraryCategory(props) {
  console.log("props category", props);
  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
  let { width, height } = Dimensions.get("screen");
  let [dataType, setDataType] = useState(props.route.params.typeCategory);
  let [actives, setActives] = useState("Itinerary");
  let [order, setOrder] = useState(props.route.params.typeOrder);
  let idcity = [];
  let [soon, setSoon] = useState(false);

  if (props.route.params.idcity) {
    idcity = props.route.params.idcity;
  }
  let [search, setSearch] = useState({
    keyword: "",
    type: null,
    cities: null,
    countries: null,
    orderby: null,
    rating: null,
  });

  // const { SlideInMenu } = renderers;
  const unSelect = (id) => {
    setDataType("");
  };
  const select = (id) => {
    setDataType(id);
  };

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("newItinerary")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
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
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
    headerRight: () => (
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
        {/* <SearchWhite height={20} width={20}></SearchWhite> */}
      </Button>
    ),
  };

  const {
    data: dataCategory,
    loading: loadingCategory,
    error: errorCategory,
    fetchMore: fetchMoreCategory,
    refetch: refetchCategory,
    networkStatus: networkStatusCategory,
  } = useQuery(Category, {
    variables: {
      category_id: null,
      order_by: null,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: dataPopuler,
    loading: loadingPopuler,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(Populer, {
    variables: {
      keyword: search.keyword,
      type: dataType,
      countries: null,
      cities: idcity,
      rating: null,
      orderby: order,
      limit: 10,
      offset: 0,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  let list_populer = [];
  if (dataPopuler && "datas" in dataPopuler.itinerary_list_populer) {
    list_populer = dataPopuler.itinerary_list_populer.datas;
  }

  const [refreshing, setRefreshing] = useState(false);

  const Refresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (
      prev.itinerary_list_populer.datas.length <
      fetchMoreResult.itinerary_list_populer.page_info.offset
    ) {
      if (!fetchMoreResult) return prev;
      const { page_info } = fetchMoreResult.itinerary_list_populer;
      const datas = [
        ...prev.itinerary_list_populer.datas,
        ...fetchMoreResult.itinerary_list_populer.datas,
      ];
      return Object.assign({}, prev, {
        itinerary_list_populer: {
          __typename: prev.itinerary_list_populer.__typename,
          page_info,
          datas,
        },
      });
    }
  };

  const handleOnEndReached = () => {
    if (dataPopuler.itinerary_list_populer.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          keyword: search.keyword,
          type: null,
          countries: null,
          cities: null,
          rating: null,
          orderby: null,
          limit: 10,
          offset: dataPopuler.itinerary_list_populer.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    // await fetchCategory();
  };

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
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
      list_populer[index].liked = true;
      list_populer[index].response_count =
        list_populer[index].response_count - 1;
      try {
        let response = await mutationliked({
          variables: {
            id: id,
            qty: 1,
          },
        });

        if (errorLike) {
          console.log(errorLike);
        }
        if (response.data) {
          if (response.data.setItineraryFavorit.code === 200) {
            list_populer[index].liked = true;
          } else {
            console.log(response.data.setItineraryFavorit.message);
            // throw new Error(response.data.setItineraryFavorit.message);
          }
        }
      } catch (error) {
        list_populer[index].liked = false;
        list_populer[index].response_count =
          list_populer[index].response_count + 1;
        RNToasty.Show({
          title: "Something wrong",
          position: "bottom",
        });
      }
    } else {
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
    }
  };

  const _unliked = async (id, index) => {
    if (token || token !== "") {
      list_populer[index].liked = false;
      list_populer[index].response_count =
        list_populer[index].response_count + 1;
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
          },
        });

        if (errorUnLike) {
          // throw new Error("Error Input");
          console.log(errorUnLike);
        }

        if (response.data) {
          if (response.data.unsetItineraryFavorit.code === 200) {
            list_populer[index].liked = false;
          } else {
            console.log(response.data.unsetItineraryFavorit.message);
            // throw new Error(response.data.unsetItineraryFavorit.message);
          }
        }
      } catch (error) {
        list_populer[index].liked = true;
        list_populer[index].response_count =
          list_populer[index].response_count - 1;
        RNToasty.Show({
          title: "Something wrong",
          position: "bottom",
        });
      }
    } else {
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
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

  const renderPopuler = ({ item, index }) => {
    return (
      <View
        style={{
          height: 145,
          paddingHorizontal: 15,
          marginTop: 5,
          zIndex: -5,
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
                  item && item.cover ? { uri: item.cover } : default_image
                }
                style={{
                  height: "100%",
                  width: Dimensions.get("screen").width * 0.33,
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
                    borderColor: "rgba(52, 52, 52, 0.8)",
                    zIndex: 1,
                  }}
                  source={
                    item && item.user_created && item.user_created.picture
                      ? { uri: item.user_created.picture }
                      : default_image
                  }
                />
                <Text
                  size="small"
                  type="bold"
                  style={{
                    zIndex: 0,
                    paddingLeft: 5,
                    backgroundColor: "rgba(52, 52, 52, 0.8)",
                    borderRadius: 2,
                    color: "white",
                    marginLeft: -5,
                    padding: 2,
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
                <Text size="label" type="black" style={{ marginTop: 5 }}>
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
                  <Text style={{ marginLeft: 5 }} size="small" type="regular">
                    {item?.country?.name}
                  </Text>
                  <Text>,</Text>
                  <Text size="small" type="regular" style={{ marginLeft: 3 }}>
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
                    <Text style={{ marginLeft: 3 }} size="small" type="regular">
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
                    <User width={10} height={10} style={{ marginRight: 5 }} />
                    {item.buddy_count > 1 ? (
                      <Text size="small" type="regular">
                        {(item && item.buddy_count ? item.buddy_count : null) +
                          " " +
                          t("persons")}
                      </Text>
                    ) : (
                      <Text size="small" type="regular">
                        {(item && item.buddy_count ? item.buddy_count : null) +
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
            </View>
          </Pressable>
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
            <Ripple
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
              <TravelAlbum style={{ marginRight: 5 }} height={10} width={10} />
              <Text size="small" type="bold" style={{ color: "#209FAE" }}>
                Travel Album
              </Text>
            </Ripple>
            <Ripple
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
                height={10}
                width={10}
              />
              <Text size="small" type="bold" style={{ color: "#209FAE" }}>
                Travel Stories
              </Text>
            </Ripple>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
      scroll_to();
    });
    return unsubscribe;
  }, [props.navigation]);

  let _menu = null;
  console.log("_menu", _menu);
  console.log("order", order);

  const RenderUtama = ({ aktif }) => {
    if (loadingPopuler) {
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <ActivityIndicator animating={true} color="#209FAE" />
      </View>;
    }
    if (aktif === "Itinerary") {
      return list_populer && list_populer.length > 0 ? (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            paddingTop: 5,
          }}
        >
          {loadingPopuler ? (
            <View style={{ flex: 1, backgroundColor: "#FFF" }}>
              <ActivityIndicator animating={true} color="#209FAE" />
            </View>
          ) : null}
          <FlatList
            data={list_populer}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              justifyContent: "space-evenly",
              marginBottom: 10,
            }}
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 15,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Text size="label" type="regular">
                    {`${t("showResult")} : ${list_populer?.length}`}
                  </Text>
                </View>
                <Menu
                  ref={(ref) => (_menu = ref)}
                  button={
                    <Pressable
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor: "#FFF",
                      }}
                      onPress={() => _menu.show()}
                    >
                      <Text height={20} width={20}>
                        {order === "new" ? "New Post" : "Populer"}
                      </Text>
                    </Pressable>
                  }
                  style={{
                    width: 200,
                  }}
                >
                  <MenuItem
                    onPress={() => {
                      setOrder("new");
                      _menu.hide();
                    }}
                  >
                    <Text type="regular" size="label">
                      {t("newPost")}
                    </Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onPress={() => {
                      setOrder("populer");
                      _menu.hide();
                    }}
                  >
                    <Text size="label" type="regular">
                      Populer
                    </Text>
                  </MenuItem>
                </Menu>
              </View>
            }
            renderItem={({ item, index }) => (
              <View
                style={{
                  height: Dimensions.get("screen").height / 4.5,
                  // height: normalize(167),
                  // minHeight: 167,
                  paddingHorizontal: 15,
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#d1d1d1",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: arrayShadow.shadowOpacity,
                    shadowRadius: arrayShadow.shadowRadius,
                    elevation: arrayShadow.elevation,
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                    overflow: "hidden",
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
                          index: 0,
                        },
                      })
                    }
                    style={{
                      backgroundColor: "#FFFFFF",
                      height: "75%",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      shadowOpacity: arrayShadow.shadowOpacity,
                      shadowRadius: arrayShadow.shadowRadius,
                      elevation: arrayShadow.elevation,
                      flexDirection: "row",
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
                          item && item.cover
                            ? { uri: item.cover }
                            : ItineraryKosong
                        }
                        style={{
                          height: "100%",
                          width: Dimensions.get("screen").width * 0.35,
                          borderTopLeftRadius: 5,
                        }}
                      />
                      <View
                        style={{
                          position: "absolute",
                          height: 30,
                          marginTop: 7,
                          marginLeft: 7,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                            borderWidth: 1,
                            borderColor: "#fff",
                            zIndex: 1,
                          }}
                          source={
                            item &&
                            item.user_created &&
                            item.user_created.picture
                              ? { uri: item.user_created.picture }
                              : default_profile
                          }
                        />
                        <Text
                          size="small"
                          type="regular"
                          style={{
                            zIndex: 0,
                            paddingLeft: 10,
                            paddingRight: 5,
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
                            marginTop: 5,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              maxWidth: Dimensions.get("screen").width / 3.5,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#DAF0F2",
                                borderRadius: 3,
                                borderColor: "#209FAE",
                                paddingHorizontal: 4,
                                paddingVertical: 1,
                              }}
                            >
                              <Text
                                type="bold"
                                size="description"
                                style={{ color: "#209FAE" }}
                                numberOfLines={1}
                              >
                                {item?.categori?.name
                                  ? item?.categori?.name
                                  : "No Category"}
                              </Text>
                            </View>
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 5,
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
                          <View style={{ overflow: "hidden" }}>
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
                          style={{}}
                          numberOfLines={2}
                          style={{ marginTop: 3 }}
                        >
                          {item.name}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: Platform.OS === "ios" ? 5 : 3,
                            width: "90%",
                            marginTop: 5,
                          }}
                        >
                          <PinHijau width={13} height={13} />
                          <Text
                            size="description"
                            type="regular"
                            numberOfLines={1}
                            style={{ marginLeft: 3 }}
                          >
                            {`${item?.country?.name}, ${item?.city?.name}`}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: 3,
                            marginRight: 10,
                          }}
                        >
                          <CalendarItinerary
                            width={14}
                            height={14}
                            style={{
                              marginRight: 5,
                            }}
                          />

                          {item.start_date && item.end_date
                            ? getDN(item.start_date, item.end_date)
                            : null}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 10,
                          }}
                        >
                          <PeopleItinerary
                            width={14}
                            height={14}
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
                  </Ripple>
                  <View
                    style={{
                      height: "25%",
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      paddingVertical: 3,
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
                        height={20}
                        width={20}
                      />
                      <Text
                        size="description"
                        type="bold"
                        style={{ color: "#209FAE" }}
                      >
                        Travel Album
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
                      <TravelStoriesdis
                        style={{ marginRight: 5 }}
                        height={20}
                        width={20}
                      />
                      <Text
                        size="description"
                        type="regular"
                        style={{
                          color: "#c7c7c7",
                        }}
                        // style={{ color: "#209FAE" }}
                      >
                        Travel Stories
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
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => Refresh()}
              />
            }
            onEndReachedThreshold={1}
            onEndReached={handleOnEndReached}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            height: "100%",
            marginTop: 20,
          }}
        >
          <Text size="label" type="bold" style={{ textAlign: "center" }}>
            {t("noItinerary")}
          </Text>
        </View>
      );
    } else if (aktif == "Album") {
      return (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            height: "100%",
            marginTop: 20,
          }}
        >
          <Text size="label" type="bold" style={{ textAlign: "center" }}>
            Tidak ada Travel Album
          </Text>
        </View>
      );
    } else if (aktif == "Stories") {
      return (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            height: "100%",
            marginTop: 20,
          }}
        >
          <Text size="label" type="bold" style={{ textAlign: "center" }}>
            Tidak ada Travel Stories
          </Text>
        </View>
      );
    } else {
      return <View></View>;
    }
  };

  let slider = useRef();

  let [y, setY] = useState(0);

  const scroll_to = () => {
    // console.log("slider :", scrollById(slider.props.id));
    // console.log("scroll :", slider.current.props.id.scrollTo({ width: y }));
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            backgroundColor: "white",
            justifyContent: "center",
          }}
        >
          <FlatList
            data={dataCategory?.category_journal}
            horizontal={true}
            initialScrollIndex={props.route.params.index}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            ListHeaderComponent={
              loadingCategory ? (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    width: Dimensions.get("screen").height * 0.23,
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator animating={true} color="#209FAE" />
                </View>
              ) : null
            }
            renderItem={({ item, index }) => {
              return dataType === item.id ? (
                <Ripple
                  id={item.name}
                  onLayout={(event) => {
                    const layout = event.nativeEvent;
                    setY(layout);
                  }}
                  style={{
                    overflow: "hidden",
                    height: "95%",
                    marginRight: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    marginTop: 1,
                    marginLeft: 1,
                    backgroundColor: "#209FAE",
                    borderColor: "#209FAE",
                    paddingHorizontal: 5,
                    marginVertical: 4,
                    borderWidth: 1,
                    flexDirection: "row",
                  }}
                  onPress={() => unSelect(item.id)}
                >
                  <View style={{ width: 30, height: 30, marginRight: 5 }}>
                    <FunIcon
                      icon={item.icon}
                      height={30}
                      width={30}
                      fill={"white"}
                      // style={{ marginRight: 5 }}
                    />
                  </View>
                  <Text
                    size="label"
                    type="bold"
                    style={{
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    {item?.name}
                  </Text>
                </Ripple>
              ) : (
                <Ripple
                  style={{
                    overflow: "hidden",
                    height: "95%",
                    marginRight: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    marginTop: 1,
                    marginLeft: 1,
                    backgroundColor: "white",
                    borderColor: "#209FAE",
                    paddingHorizontal: 5,
                    marginVertical: 4,
                    borderWidth: 1,
                    flexDirection: "row",
                  }}
                  onPress={() => select(item.id)}
                >
                  <View style={{ width: 30, height: 30, marginRight: 5 }}>
                    <FunIcon
                      icon={item.icon}
                      height={30}
                      width={30}
                      // style={{ marginRight: 5 }}
                    />
                  </View>
                  <Text
                    size="label"
                    type="bold"
                    style={{
                      textAlign: "center",
                      color: "#209FAE",
                    }}
                  >
                    {item?.name}
                  </Text>
                </Ripple>
              );
            }}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View
          style={{
            marginTop: 5,
            width: Dimensions.get("screen").width,
            flexDirection: "row",
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
            backgroundColor: "white",
            justifyContent: "space-around",
          }}
        >
          <Ripple
            onPress={() => setActives("Itinerary")}
            style={{
              width: Dimensions.get("screen").width * 0.32,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: actives == "Itinerary" ? 1 : 0,
              borderBottomColor: actives == "Itinerary" ? "#249FAE" : "#EEEEEE",
              paddingTop: 10,
              paddingBottom: 15,
              flexDirection: "row",
            }}
          >
            {actives == "Itinerary" ? (
              <ItineraryIcon
                style={{
                  marginRight: 5,
                }}
                height={20}
                width={20}
              />
            ) : (
              <ItineraryIconGray
                style={{
                  marginRight: 5,
                }}
                height={20}
                width={20}
              />
            )}
            <Text
              size="label"
              type={actives == "Itinerary" ? "bold" : "light"}
              style={{
                color: actives == "Itinerary" ? "#209FAE" : "#464646",
                paddingBottom: 3,
              }}
            >
              Itinerary
            </Text>
          </Ripple>
          <Ripple
            onPress={() => setActives("Album")}
            style={{
              width: Dimensions.get("screen").width * 0.32,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: actives == "Album" ? 1 : 0,
              borderBottomColor: actives == "Album" ? "#249FAE" : "#EEEEEE",
              paddingTop: 10,
              paddingBottom: 15,
              flexDirection: "row",
            }}
          >
            {actives == "Album" ? (
              <TravelAlbum
                style={{
                  marginRight: 5,
                }}
                height={20}
                width={20}
              />
            ) : (
              <AlbumIconGray
                style={{
                  marginRight: 5,
                }}
                height={20}
                width={20}
              />
            )}
            <Text
              size="label"
              type={actives == "Album" ? "bold" : "regular"}
              style={{
                color: actives == "Album" ? "#209FAE" : "#464646",
              }}
            >
              Album
            </Text>
          </Ripple>
          <Ripple
            onPress={() => setSoon(true)}
            style={{
              width: Dimensions.get("screen").width * 0.32,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: actives == "Stories" ? 1 : 0,
              borderBottomColor: actives == "Stories" ? "#249FAE" : "#EEEEEE",
              paddingTop: 10,
              paddingBottom: 15,
              flexDirection: "row",
            }}
          >
            <TravelStoriesdis
              style={{ marginRight: 5 }}
              height={20}
              width={20}
            />
            <Text
              size="label"
              // type={actives == "Stories" ? "bold" : "reguler"}
              // style={{
              //   color: actives == "Stories" ? "#209FAE" : "#464646",
              // }}
              type={"regular"}
              style={{
                color: "#c7c7c7",
              }}
            >
              Story
            </Text>
          </Ripple>
        </View>
      </View>
      <RenderUtama aktif={actives} />
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
            borderRadius: 3,
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
              borderRadius: 10,
            }}
          >
            <Image
              source={Bg_soon}
              style={{
                height: Dimensions.get("screen").width - 180,
                width: Dimensions.get("screen").width - 110,
                borderRadius: 10,
                position: "absolute",
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
    </View>
  );
}
