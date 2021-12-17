import { useQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  ActivityIndicator,
  Platform,
  Modal as ModalRN,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import {
  Arrowbackwhite,
  TravelAlbum,
  Arrowbackios,
  TravelStoriesdis,
  AlbumIconGray,
  ItineraryIconGray,
  ItineraryIcon,
} from "../../../assets/svg";
import { Text, Button, FunIcon, CardItinerary } from "../../../component/index";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import Populer from "../../../graphQL/Query/Itinerary/ItineraryPopuler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bg_soon } from "../../../assets/png";
import Ripple from "react-native-material-ripple";
import { useSelector } from "react-redux";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import { RNToasty } from "react-native-toasty";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

export default function ItineraryCategory(props) {
  const { t } = useTranslation();
  const token = useSelector((data) => data.token);
  let [setting, setSetting] = useState();
  let [dataType, setDataType] = useState(props.route.params.typeCategory);
  let [actives, setActives] = useState("Itinerary");
  let [order, setOrder] = useState(props.route.params.typeOrder);
  let idcity = [];
  let [soon, setSoon] = useState(false);
  let [list_populer, setlist_populer] = useState([]);
  let [select, setSelect] = useState(true);
  let [idDataCategory, setidDataCategory] = useState(null);
  let [textSearch, setTextSearch] = useState("");

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

  const pilih = (id) => {
    if (idDataCategory == id) {
      setSelect(!select);
    } else {
      setSelect(true);
      setidDataCategory(id);
    }
  };

  // const unSelect = (id) => {
  //   setDataType("");
  // };
  // const select = (id) => {
  //   setDataType(id);
  // };

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {order == "populer" ? t("popularTrip") : t("newItinerary")}
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
      // keyword: search.keyword,
      // type: dataType,
      // countries: null,
      // cities: idcity,
      // rating: null,
      // orderby: order,
      // limit: 10,
      // offset: 0,
      keyword: search.keyword,
      type: select ? idDataCategory : null,
      countries: null,
      cities: null,
      rating: null,
      orderby: order,
      limit: 10,
      offset: 0,
    },

    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setlist_populer(dataPopuler.itinerary_list_populer.datas);
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const _Refresh = useCallback(() => {
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
    if (dataPopuler?.itinerary_list_populer.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          keyword: search.keyword,
          type: null,
          countries: null,
          cities: null,
          rating: null,
          orderby: null,
          limit: 10,
          offset: dataPopuler?.itinerary_list_populer.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

  const loadAsync = async () => {
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      _Refresh();
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  let _menu = null;

  // const RenderUtama = ({ aktif }) => {
  //   if (loadingPopuler) {
  //     <View style={{ flex: 1, backgroundColor: "#FFF" }}>
  //       <ActivityIndicator animating={true} color="#209FAE" />
  //     </View>;
  //   }
  //   if (aktif === "Itinerary") {
  //     return list_populer && list_populer.length > 0 ? (
  //       <>
  //         <View
  //           style={{
  //             flexDirection: "row",
  //             justifyContent: "space-between",
  //             alignItems: "center",
  //             paddingHorizontal: 15,
  //             paddingVertical: 5,
  //             backgroundColor: "#fff",
  //           }}
  //         >
  //           <View
  //             style={{
  //               flexDirection: "row",
  //               justifyContent: "center",
  //             }}
  //           >
  //             <Text size="label" type="regular">
  //               {`${t("showResult")} : ${list_populer?.length}`}
  //             </Text>
  //           </View>
  //           <Menu
  //             ref={(ref) => (_menu = ref)}
  //             button={
  //               <Pressable
  //                 style={{
  //                   paddingHorizontal: 20,
  //                   paddingVertical: 10,
  //                   backgroundColor: "#f6f6f6",
  //                 }}
  //                 onPress={() => _menu.show()}
  //               >
  //                 <Text height={20} width={20}>
  //                   {order === "new" ? "New Post" : "Populer"}
  //                 </Text>
  //               </Pressable>
  //             }
  //             style={{
  //               width: 200,
  //             }}
  //           >
  //             <MenuItem
  //               onPress={() => {
  //                 setOrder("new");
  //                 _menu.hide();
  //               }}
  //             >
  //               <Text type="regular" size="label">
  //                 {t("newPost")}
  //               </Text>
  //             </MenuItem>
  //             <MenuDivider />
  //             <MenuItem
  //               onPress={() => {
  //                 setOrder("populer");
  //                 _menu.hide();
  //               }}
  //             >
  //               <Text size="label" type="regular">
  //                 Populer
  //               </Text>
  //             </MenuItem>
  //           </Menu>
  //         </View>
  //         <View
  //           style={{
  //             paddingBottom: 150,
  //           }}
  //         >
  //           <CardItinerary
  //             data={list_populer}
  //             props={props}
  //             token={token}
  //             setting={setting}
  //             setData={(e) => setlist_populer(e)}
  //           />
  //         </View>
  //       </>
  //     ) : (
  //       <View
  //         style={{
  //           flex: 1,
  //           width: Dimensions.get("screen").width,
  //           height: Dimensions.get("screen").height,
  //           height: "100%",
  //           marginTop: 20,
  //         }}
  //       >
  //         <Text size="label" type="bold" style={{ textAlign: "center" }}>
  //           {t("noItinerary")}
  //         </Text>
  //       </View>
  //     );
  //   } else if (aktif == "Album") {
  //     return (
  //       <View
  //         style={{
  //           flex: 1,
  //           width: Dimensions.get("screen").width,
  //           height: Dimensions.get("screen").height,
  //           height: "100%",
  //           marginTop: 20,
  //         }}
  //       >
  //         <Text size="label" type="bold" style={{ textAlign: "center" }}>
  //           Tidak ada Travel Album
  //         </Text>
  //       </View>
  //     );
  //   } else if (aktif == "Stories") {
  //     return (
  //       <View
  //         style={{
  //           flex: 1,
  //           width: Dimensions.get("screen").width,
  //           height: Dimensions.get("screen").height,
  //           height: "100%",
  //           marginTop: 20,
  //         }}
  //       >
  //         <Text size="label" type="bold" style={{ textAlign: "center" }}>
  //           Tidak ada Travel Stories
  //         </Text>
  //       </View>
  //     );
  //   } else {
  //     return <View></View>;
  //   }
  // };

  const RenderUtama = ({ aktif }) => {
    if (aktif == "Itinerary") {
      return list_populer && list_populer.length > 0 ? (
        <CardItinerary
          data={list_populer}
          props={props}
          token={token}
          setting={setting}
          setData={(e) => setlist_populer(e)}
        />
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
      return dataAlbums && dataAlbums.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 15,
            justifyContent: "space-between",
            marginTop: 15,
            backgroundColor: "#f6f6f6",
          }}
        >
          {dataAlbums.map((item, index) => {
            return (
              <Pressable
                focusable={true}
                keyboardShouldPersistTaps={"handled"}
                key={index}
                onPress={() => {
                  Keyboard.dismiss();
                  props.navigation.push("ProfileStack", {
                    screen: "albumdetail",
                    params: {
                      id: item.id,
                      type: item.type,
                      token: token,
                      judul: item.title,
                    },
                  });
                }}
                style={{
                  height: 250,
                  width: "49%",
                  marginBottom: 10,
                  borderRadius: 5,
                  // borderWidth: 1,
                  backgroundColor: "#fff",
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
                <View style={{ width: "100%", height: "58%" }}>
                  <Image
                    style={{
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      width: "100%",
                      height: "100%",
                    }}
                    source={item?.cover ? { uri: item?.cover } : default_image}
                  />
                  <View
                    style={{
                      position: "absolute",
                      borderRadius: 2,
                      bottom: 10,
                      left: 10,
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#000",
                        opacity: 0.6,
                        position: "absolute",
                        borderRadius: 2,
                      }}
                    />
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        color: "#fff",
                        marginHorizontal: 10,
                        marginTop: 3,
                        marginBottom: 5,
                      }}
                    >
                      {item.count_foto}{" "}
                      {item.count_foto > 1 ? t("photos") : t("photo")}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 15,
                    // borderWidth: 1,
                    justifyContent: "space-between",
                    paddingTop: 10,
                    paddingBottom: 13,
                  }}
                >
                  <Text size={"label"} type="bold" numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Pressable
                    onPress={() =>
                      props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: item.id,
                          token: token,
                        },
                      })
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 17,
                        marginRight: 10,
                      }}
                      source={
                        item && item?.user
                          ? { uri: item?.user?.picture }
                          : default_image
                      }
                    />
                    <Text
                      size="label"
                      type="regular"
                      numberOfLines={1}
                      style={{ flex: 1 }}
                    >
                      {`${item.user.first_name} ${
                        item.user.last_name ? item.user.last_name : ""
                      }`}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
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
            Tidak ada Travel Album
          </Text>
        </View>
      );
    } else if (aktif == "Stories") {
      return journal_list && journal_list.length > 0 ? (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            paddingHorizontal: 15,
            alignContent: "center",
            marginTop: 10,
          }}
        >
          <FlatList
            data={journal_list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View>
                <Pressable
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#FFF",
                    borderRadius: 5,
                    padding: 10,
                  }}
                  onPress={() =>
                    props.navigation.push("JournalStackNavigation", {
                      screen: "DetailJournal",
                      params: {
                        dataPopuler: item,
                      },
                    })
                  }
                >
                  <Image
                    source={
                      item.firstimg ? { uri: item.firstimg } : default_image
                    }
                    style={{
                      width: "21%",
                      height: 110,
                      borderRadius: 10,
                    }}
                  />
                  <View
                    style={{
                      width: "79%",
                      marginVertical: 5,
                      paddingLeft: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={{ color: "#209FAE" }}
                        size={"small"}
                        type={"bold"}
                      >
                        #{item?.categori?.name.toLowerCase().replace(/ /g, "")}
                      </Text>
                      <Text
                        size={"label"}
                        type={"bold"}
                        style={{
                          color: "#3E3E3E",
                          marginTop: 5,
                        }}
                        numberOfLines={1}
                      >
                        {item.title}
                        {/* <Truncate
                    text={item.title ? item.title : ""}
                    length={35}
                  /> */}
                      </Text>
                      <Text
                        size={"description"}
                        type={"regular"}
                        style={{
                          textAlign: "left",
                          marginTop: 5,
                          lineHeight: 18,
                        }}
                        numberOfLines={2}
                      >
                        {item.firsttxt}
                        {/* <Truncate
                    text={item.firsttxt ? item.firsttxt : ""}
                    length={110}
                  /> */}
                      </Text>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text size={"small"} type={"regular"}>
                          {dateFormatMonthYears(item.date)}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <LikeEmpty width={10} height={10} />
                          <Text
                            style={{ marginLeft: 5 }}
                            size={"small"}
                            type={"regular"}
                          >
                            {item.article_response_count > 0
                              ? item.article_response_count +
                                " " +
                                t("likeMany")
                              : item.article_response_count + " " + t("like")}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
                <View
                  style={{
                    margin: 5,
                    borderBottomColor: "#f6f6f6",
                    borderBottomWidth: 0.9,
                  }}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => RefreshJournal()}
              />
            }
            onEndReachedThreshold={1}
            onEndReached={handleOnEndReachedJournal}
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

  const scroll_to = () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_Refresh}
            tintColor={"#209fae"}
          />
        }
        style={{ flex: 1, marginBottom: 20 }}
      >
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
                        paddingHorizontal: 5,
                        marginVertical: 4,
                        flexDirection: "row",
                        borderWidth: 1,
                        borderColor: "#209FAE",
                        backgroundColor:
                          item.id == idDataCategory && select
                            ? "#DAF0F2"
                            : "#fff",
                      }}
                      onPress={() => pilih(item.id)}
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
                  width: Dimensions.get("screen").width * 0.333,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: actives == "Itinerary" ? 2 : 1,
                  borderBottomColor:
                    actives == "Itinerary" ? "#249FAE" : "#EEEEEE",
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
                  width: Dimensions.get("screen").width * 0.333,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: actives == "Album" ? 2 : 1,
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
                  width: Dimensions.get("screen").width * 0.333,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: actives == "Stories" ? 2 : 1,
                  borderBottomColor:
                    actives == "Stories" ? "#249FAE" : "#EEEEEE",
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
                    width: Dimensions.get("screen").width / 5,
                  }}
                  type="box"
                  onPress={() => setSoon(false)}
                ></Button>
              </View>
            </View>
          </ModalRN>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
