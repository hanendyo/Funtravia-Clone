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
  TextInput,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, FunIcon, Text, CardItinerary } from "../../../component";
import { default_image, Bg_soon } from "../../../assets/png";
import {
  Arrowbackwhite,
  TravelStoriesdis,
  TravelAlbum,
  SearchWhite,
  LikeEmpty,
  Xblue,
  ItineraryIcon,
  ItineraryIconGray,
  AlbumIconGray,
  Arrowbackios,
} from "../../../assets/svg";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Populer_ from "../../../graphQL/Query/Itinerary/ItineraryPopuler";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import Ripple from "react-native-material-ripple";
import Skeletonindex from "./Skeletonindex";
import { RNToasty } from "react-native-toasty";
import ListFotoAlbum from "../../../graphQL/Query/Album/ListAlbumHome";
import JournalList from "../../../graphQL/Query/Journal/JournalList";
import { dateFormatMonthYears } from "../../../component/src/dateformatter";

export default function ItinerarySearchCategory(props) {
  let [actives, setActives] = useState("Itinerary");
  let { width, height } = Dimensions.get("screen");
  const { t } = useTranslation();
  let [token, setToken] = useState(props?.route?.params?.token);
  let [setting, setSetting] = useState();
  let [soon, setSoon] = useState(false);
  let [idDataCategory, setidDataCategory] = useState(null);
  let [list_populer, setlist_populer] = useState([]);
  let [textSearch, setTextSearch] = useState("");
  let [select, setSelect] = useState(true);
  let [labelCategory, setLabelCategory] = useState(true);
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
    elevation: Platform.OS == "ios" ? 3 : 2.5,
  };

  const HeaderComponent = {
    headerShown: true,
    title: "Itinerary",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        Itinerary
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

  const {
    data: dataPopuler,
    loading: loadingPopuler,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(Populer_, {
    variables: {
      keyword: textSearch,
      type: select ? idDataCategory : null,
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

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    // await fetchCategory();
    // await fetchDataListPopuler();
  };

  let [dataAlbums, setDataAlbums] = useState(null);
  console.log("dataAlbums search", dataAlbums);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      refetch();
      refetchAlbum();
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const {
    data: dataAlbum,
    loading: loadingFotoAlbum,
    refetch: refetchAlbum,
  } = useQuery(ListFotoAlbum, {
    fetchPolicy: "network-only",
    variables: {
      keyword: textSearch,
      limit: 100,
      offset: 0,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props?.route?.params?.token}`,
      },
    },
    onCompleted: () => setDataAlbums(dataAlbum?.albums_itinerary_home?.datas),
    notifyOnNetworkStatusChange: true,
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

  useEffect(() => {
    setTimeout(() => {
      setLoadingsCategory(false);
    }, 3000);
  }),
    [];
  let [loadingsCategory, setLoadingsCategory] = useState(true);
  if (loadingsCategory) {
    return (
      <View style={{ marginTop: 20 }}>
        <ActivityIndicator size="small" color="#209fae" />
      </View>
    );
  }

  {
    /* ======================================= Render All ====================================================*/
  }

  const pilih = (id) => {
    if (idDataCategory == id) {
      setSelect(!select);
    } else {
      setSelect(true);
      setidDataCategory(id);
    }
  };
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
    >
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
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            width: Dimensions.get("screen").width - 30,
            marginHorizontal: 15,
          }}
        >
          <View
            style={{
              height: 40,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f6f6f6",
              // marginVertical: 10,
              // width: "80%",
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "#209fae",
                borderBottomLeftRadius: 5,
                borderTopLeftRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: 40,
              }}
            >
              <SearchWhite height={20} width={20} />
            </View>
            <TextInput
              fontSize={16}
              value={textSearch}
              placeholder={t("search")}
              onChangeText={(x) => setTextSearch(x)}
              onSubmitEditing={(x) => setTextSearch(x)}
              style={{ marginHorizontal: 10, flex: 1 }}
            />
            {textSearch.length !== 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setTextSearch("");
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
          <Pressable
            focusable={true}
            keyboardShouldPersistTaps={"handled"}
            style={{
              height: 40,
              marginLeft: 5,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={async () => {
              await Keyboard.dismiss();
              await props.navigation.goBack();
            }}
          >
            <Text size="label" type="regular">
              {t("cancel")}
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            width: Dimensions.get("screen").width,
            // paddingHorizontal: 15,
            backgroundColor: "#FFF",
            paddingTop: 15,
          }}
        >
          {actives === "Itinerary" || actives === "Album" ? (
            <Pressable
              onPress={() => {
                setLabelCategory(!labelCategory);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{ marginLeft: 20, marginRight: 10 }}
              >
                {t("CategoryItin")}
              </Text>
            </Pressable>
          ) : null}

          <View style={{ backgroundColor: "#fff" }}>
            {actives === "Itinerary" || actives === "Album" ? (
              <FlatList
                data={dataCategory?.category_journal}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                  marginTop: 10,
                }}
                ItemSeparatorComponent={() => (
                  <View
                    style={
                      {
                        // width: 5,
                      }
                    }
                  ></View>
                )}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      style={{
                        borderRadius: 3,
                        backgroundColor: "#FFF",
                        height: 65,
                        width: 78,
                        borderWidth:
                          item.id == idDataCategory && select ? 1 : 0,
                        borderColor:
                          item.id == idDataCategory && select
                            ? "#209FAE"
                            : "#fff",
                        backgroundColor:
                          item.id == idDataCategory && select
                            ? "#DAF0F2"
                            : "#fff",
                      }}
                      onPress={() => {
                        pilih(item.id);
                      }}
                    >
                      {loadingCategory ? (
                        <ActivityIndicator animating={true} color="#209FAE" />
                      ) : (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "space-around",
                            height: 65,
                            width: 78,
                          }}
                        >
                          <FunIcon icon={item.icon} height={45} width={45} />
                          <Text
                            size="description"
                            type="regular"
                            style={{
                              textAlign: "center",
                              padding: 5,
                            }}
                            numberOfLines={1}
                          >
                            {item?.name}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : null}
            <View>
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  flexDirection: "row",
                  // shadowColor: "gray",
                  // shadowOffset: { width: 0, height: 1 },
                  // shadowOpacity: arrayShadow.shadowOpacity,
                  // shadowRadius: arrayShadow.shadowRadius,
                  // elevation: arrayShadow.elevation,
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
                    borderBottomWidth: actives == "Itinerary" ? 1 : 0,
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
                    width: Dimensions.get("screen").width * 0.32,
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottomWidth: actives == "Album" ? 1 : 0,
                    borderBottomColor:
                      actives == "Album" ? "#249FAE" : "#EEEEEE",
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
          </View>
        </View>
      </View>
      <View>
        <RenderUtama aktif={actives} />
      </View>
    </ScrollView>
  );
}
