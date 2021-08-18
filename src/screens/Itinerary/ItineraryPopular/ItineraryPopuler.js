import { View } from "native-base";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal as ModalRN,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  FunIcon,
  FunImage,
  FunImageBackground,
  Text,
} from "../../../component";
import {
  default_image,
  itinerary_1,
  itinerary_2,
  Bg_soon,
} from "../../../assets/png";
import {
  Arrowbackwhite,
  Calendargrey,
  PinHijau,
  User,
  TravelStories,
  TravelStoriesdis,
  TravelAlbum,
  SearchWhite,
  LikeRed,
  LikeEmpty,
  Itinerary_1,
  Itinerary_2,
} from "../../../assets/svg";
import { Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Populer_ from "../../../graphQL/Query/Itinerary/ItineraryPopuler";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import Ripple from "react-native-material-ripple";
import Skeletonindex from "./Skeletonindex";
import { RNToasty } from "react-native-toasty";
import ListFotoAlbum from "../../../graphQL/Query/Itinerary/ListAlbum";
import JournalList from "../../../graphQL/Query/Journal/JournalList";
import {
  dateFormatMonthYears,
  dateFormatShortMonth,
} from "../../../component/src/dateformatter";

export default function ItineraryPopuler(props) {
  let [actives, setActives] = useState("Itinerary");
  let { width, height } = Dimensions.get("screen");
  const { t } = useTranslation();
  let [token, setToken] = useState(props?.route?.params?.token);
  let [setting, setSetting] = useState();
  let [soon, setSoon] = useState(false);

  let [search, setSearch] = useState({
    keyword: "",
    type: null,
    cities: null,
    countries: null,
    orderby: null,
    rating: null,
  });
  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 3.5,
  };

  const HeaderComponent = {
    headerShown: true,
    title: "Itinerary",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Itinerary",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      color: "white",
      alignSelf: "center",
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
  } = useQuery(Category, {
    variables: {
      category_id: null,
      order_by: null,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  let [list_populer, setlist_populer] = useState([]);

  const {
    data: dataPopuler,
    loading: loadingPopuler,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(Populer_, {
    variables: {
      keyword: search.keyword,
      type: null,
      countries: null,
      cities: null,
      rating: null,
      orderby: null,
      limit: 5,
      offset: 0,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setlist_populer(dataPopuler.itinerary_list_populer.datas);
    },
  });

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
    if (dataPopuler?.itinerary_list_populer?.page_info?.hasNextPage) {
      return fetchMore({
        variables: {
          keyword: search.keyword,
          type: null,
          countries: null,
          cities: null,
          rating: null,
          orderby: null,
          limit: 5,
          offset: dataPopuler?.itinerary_list_populer?.page_info?.offset,
        },
        updateQuery: onUpdate,
      });
    }
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

  const _liked = async (id, index, item) => {
    let items = { ...item };
    let list_populers = [...list_populer];
    // console.log(list_populers[index]);
    if (token && token !== "" && token !== null) {
      items.liked = true;
      await list_populers.splice(index, 1, items);
      await setlist_populer(list_populers);
      // list_populers[index].response_count =
      //   list_populers[index].response_count - 1;

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
            // list_populers[index].liked = true;
          } else {
            throw new Error(response.data.setItineraryFavorit.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        items.liked = false;
        await list_populers.splice(index, 1, items);
        await setlist_populer(list_populers);

        Alert.alert("" + error);
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const _unliked = async (id, index, item) => {
    let items = { ...item };
    let list_populers = [...list_populer];
    if (token && token !== "" && token !== null) {
      items.liked = false;
      await list_populers.splice(index, 1, items);
      await setlist_populer(list_populers);
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
            // list_populers[index].liked = false;
          } else {
            throw new Error(response.data.unsetItineraryFavorit.message);
          }
        }
      } catch (error) {
        items.liked = true;
        await list_populers.splice(index, 1, items);
        await setlist_populer(list_populers);
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
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
        <Text size="small">
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

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    // await fetchCategory();
    // await fetchDataListPopuler();
  };

  let [dataAlbums, setDataAlbums] = useState(null);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      refetch();
      loadAsync();
      QueryFotoAlbum();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [
    QueryFotoAlbum,
    { data: dataFotoAlbum, loading: loadingFotoAlbum, error: errorFotoAlbum },
  ] = useLazyQuery(ListFotoAlbum, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { user_id: setting?.user?.id, keyword: "" },
    onCompleted: () => setDataAlbums(dataFotoAlbum?.list_albums),
  });

  const {
    data: dataList,
    loading: loadingList,
    fetchMore: fetchMoreJournal,
    refetch: refetchJournal,
  } = useQuery(JournalList, {
    variables: {
      category_id: null,
      order_by: null,
      limit: 14,
      offset: 0,
      keyword: null,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  let journal_list = [];
  if (dataList && "datas" in dataList.journal_list) {
    journal_list = dataList.journal_list.datas;
  }

  const RefreshJournal = useCallback(() => {
    setRefreshing(true);
    refetchJournal();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const onUpdateJournal = (prev, { fetchMoreResult }) => {
    if (
      prev.journal_list.datas.length <
      fetchMoreResult.journal_list.page_info.offset
    ) {
      if (!fetchMoreResult) return prev;
      const { page_info } = fetchMoreResult.journal_list;
      const datas = [
        ...prev.journal_list.datas,
        ...fetchMoreResult.journal_list.datas,
      ];

      return Object.assign({}, prev, {
        journal_list: {
          __typename: prev.journal_list.__typename,
          page_info,
          datas,
        },
      });
    }
  };

  const handleOnEndReachedJournal = () => {
    if (dataList.journal_list.page_info.hasNextPage) {
      return fetchMoreJournal({
        variables: {
          category_id: null,
          keyword: search.keyword,
          orderby: null,
          limit: 14,
          offset: dataList.journal_list.page_info.offset,
        },
        updateQuery: onUpdateJournal,
      });
    }
  };

  const RenderUtama = ({ aktif }) => {
    if (aktif == "Itinerary") {
      return (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
          }}
        >
          <FlatList
            data={list_populer}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                style={{
                  height: 150,
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
                    backgroundColor: "#fff",
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
                            item &&
                            item.user_created &&
                            item.user_created.picture
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
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
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
                    </Pressable>
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 10,
                        backgroundColor: "#FFFFFF",
                        overflow: "hidden",
                        paddingTop: 5,
                        // borderWidth: 1,
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
                            {item.buddy_count > 1 ? (
                              <Text size="small" type="regular">
                                {(item && item.buddy_count
                                  ? item.buddy_count
                                  : null) +
                                  " " +
                                  t("persons")}
                              </Text>
                            ) : (
                              <Text size="small" type="regular">
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
                    </View>
                  </Pressable>
                  <View
                    style={{
                      height: "20%",
                      // borderWidth: 1,
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
                        height={10}
                        width={10}
                      />
                      <Text
                        size="small"
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
      );
    } else if (aktif == "Album") {
      return dataAlbums && dataAlbums.length > 0 ? (
        dataAlbums.map((item, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => {
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
                width: "100%",
                height: width * 0.55,
                paddingHorizontal: 10,
                marginVertical: 5,
              }}
            >
              <View
                style={{
                  borderRadius: 10,
                  flex: 1,
                  elevation: 1,
                  backgroundColor: "#fff",
                }}
              >
                <Image
                  style={{
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    width: "100%",
                    height: "80%",
                  }}
                  source={item?.cover ? { uri: item?.cover } : default_image}
                ></Image>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text size={"label"} type="bold">
                    {item.title}
                  </Text>
                  <Text size={"label"} type="regular">
                    {item.count_foto + " Foto"}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })
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

  useEffect(() => {
    setTimeout(() => {
      setLoadingsCategory(false);
    }, 3000);
  }),
    [];
  let [loadingsCategory, setLoadingsCategory] = useState(true);
  if (loadingsCategory) {
    return <Skeletonindex />;
  }

  {
    /* ======================================= Render All ====================================================*/
  }
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[2]}
    >
      {/* <View
        style={{
          backgroundColor: "#F0F0F0",
        }}
      > */}

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
            marginTop: Dimensions.get("screen").height / 4,
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
            }}
          >
            <Image
              source={Bg_soon}
              style={{
                height: Dimensions.get("screen").width - 180,
                width: Dimensions.get("screen").width - 110,
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
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 15,
        }}
      >
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View
            style={{
              height: Dimensions.get("screen").width * 0.3,
              paddingHorizontal: 15,
              flexDirection: "row",
              // borderWidth: 1,
            }}
          >
            <Ripple
              style={{
                marginRight: 5,
                borderRadius: 10,
                height: "100%",
                width: Dimensions.get("screen").width * 0.57,
                marginRight: 5,
                // shadowColor: "gray",
                // shadowOffset: { width: 0, height: 1 },
                // shadowOpacity: arrayShadow.shadowOpacity,
                // shadowRadius: arrayShadow.shadowRadius,
                // elevation: arrayShadow.elevation,
                // paddingVertical: 2,
              }}
              onPress={() =>
                props.navigation.navigate("ItineraryCategory", {
                  dataPopuler: dataPopuler,
                  typeOrder: "new",
                  typeCategory: [],
                })
              }
            >
              <FunImageBackground
                source={itinerary_1 ? itinerary_1 : default_image}
                style={{ width: "100%", height: "100%" }}
                imageStyle={{ borderRadius: 10 }}
              ></FunImageBackground>
              {/* <Itinerary_1 height={"100%"} width={"100%"} borderRadius={10} /> */}
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  // opacity: 0.6,
                  position: "absolute",
                  left: 10,
                  top: 10,
                  borderRadius: 2,
                }}
              >
                <Text
                  size="description"
                  type="bold"
                  style={{
                    // position: "absolute",
                    color: "#FFF",
                    marginHorizontal: 5,
                    marginVertical: 3,
                  }}
                >
                  New Itinerary
                </Text>
              </View>
            </Ripple>
            <Ripple
              style={{
                marginRight: 5,
                borderRadius: 10,
                height: "100%",
                width: Dimensions.get("screen").width * 0.57,
                marginRight: 5,
                // shadowColor: "gray",
                // shadowOffset: { width: 0, height: 1 },
                // shadowOpacity: arrayShadow.shadowOpacity,
                // shadowRadius: arrayShadow.shadowRadius,
                // elevation: arrayShadow.elevation,
                // paddingVertical: 2,
              }}
              onPress={() =>
                props.navigation.navigate("ItineraryCategory", {
                  dataPopuler: dataPopuler,
                  typeOrder: "populer",
                  typeCategory: [],
                })
              }
            >
              <FunImageBackground
                source={itinerary_2 ? itinerary_2 : default_image}
                style={{ width: "100%", height: "100%" }}
                imageStyle={{ borderRadius: 10 }}
              ></FunImageBackground>
              {/* <Itinerary_2 height={"100%"} width={"100%"} /> */}
              {/* <Image
                source={Itinerary_2}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 10,
                }}
              /> */}
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  // opacity: 0.6,
                  position: "absolute",
                  left: 10,
                  top: 10,
                  borderRadius: 2,
                }}
              >
                <Text
                  size="description"
                  type="bold"
                  style={{
                    // position: "absolute",
                    color: "#FFF",
                    marginHorizontal: 5,
                    marginVertical: 3,
                  }}
                >
                  Populer Itinerary
                </Text>
              </View>
            </Ripple>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          backgroundColor: "#FFF",
          marginTop: 5,
        }}
      >
        <Text size="label" type="bold" style={{ marginTop: 5 }}>
          Category Itinerary
        </Text>
      </View>
      <View>
        <View
          style={{
            backgroundColor: "#F6F6F6",
            flexDirection: "row",
            // borderWidth: 1,
            height: 55,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              alignItems: "center",
              flex: 1,
              paddingVertical: 5,
            }}
          >
            <FlatList
              data={dataCategory?.category_journal}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 15,
                marginBottom: 5,
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: 5,
                  }}
                ></View>
              )}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: 5,
                      backgroundColor: "#FFF",
                      paddingHorizontal: 5,
                      borderWidth: 1,
                      borderColor: "#D1D1D1",
                      flexDirection: "row",
                      marginVertical: 3,
                    }}
                    onPress={() =>
                      props.navigation.navigate("ItineraryCategory", {
                        typeCategory: item.id,
                        typeOrder: "new",
                        index: index,
                      })
                    }
                  >
                    {loadingCategory ? (
                      <ActivityIndicator animating={true} color="#209FAE" />
                    ) : (
                      <>
                        <View style={{ width: 25, height: 25, marginRight: 5 }}>
                          <FunIcon icon={item.icon} height={25} width={25} />
                        </View>

                        <Text
                          size="label"
                          type="bold"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {item?.name}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              flexDirection: "row",
              shadowColor: "gray",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: arrayShadow.shadowOpacity,
              shadowRadius: arrayShadow.shadowRadius,
              elevation: arrayShadow.elevation,
              backgroundColor: "white",
              // borderWidth: 1,
              justifyContent: "space-around",
            }}
          >
            <Ripple
              onPress={() => setActives("Itinerary")}
              style={{
                width: Dimensions.get("screen").width * 0.32,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: actives == "Itinerary" ? 2 : 0,
                borderBottomColor:
                  actives == "Itinerary" ? "#249FAE" : "#EEEEEE",
                paddingVertical: 10,
              }}
            >
              <Text
                size="description"
                type={actives == "Itinerary" ? "bold" : "regular"}
                style={{
                  color: actives == "Itinerary" ? "#209FAE" : "#464646",
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
                borderBottomWidth: actives == "Album" ? 2 : 0,
                borderBottomColor: actives == "Album" ? "#249FAE" : "#EEEEEE",
                paddingVertical: 10,
              }}
            >
              <Text
                size="description"
                type={actives == "Album" ? "bold" : "regular"}
                style={{
                  color: actives == "Album" ? "#209FAE" : "#464646",
                }}
              >
                Travel Album
              </Text>
            </Ripple>
            <Ripple
              onPress={() => setSoon(true)}
              style={{
                width: Dimensions.get("screen").width * 0.32,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: actives == "Stories" ? 2 : 0,
                borderBottomColor: actives == "Stories" ? "#249FAE" : "#EEEEEE",
                paddingVertical: 10,
              }}
            >
              <Text
                size="description"
                // type={actives == "Stories" ? "bold" : "reguler"}
                // style={{
                //   color: actives == "Stories" ? "#209FAE" : "#464646",
                // }}
                type={"regular"}
                style={{
                  color: "#c7c7c7",
                }}
              >
                Travel Stories
              </Text>
            </Ripple>
          </View>
        </View>
      </View>
      <View>
        <RenderUtama aktif={actives} />
      </View>
    </ScrollView>
  );
}
