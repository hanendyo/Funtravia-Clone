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
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import { RNToasty } from "react-native-toasty";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

export default function ItineraryCategory(props) {
  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
  let [dataType, setDataType] = useState(props.route.params.typeCategory);
  let [actives, setActives] = useState("Itinerary");
  let [order, setOrder] = useState(props.route.params.typeOrder);
  let idcity = [];
  let [soon, setSoon] = useState(false);
  let [list_populer, setlist_populer] = useState([]);

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
      keyword: search.keyword,
      type: dataType,
      countries: null,
      cities: idcity,
      rating: null,
      orderby: order,
      limit: 10,
      offset: 0,
    },
    onCompleted: () => {
      setlist_populer(dataPopuler?.itinerary_list_populer?.datas);
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  console.log("dataPopuler", dataPopuler?.itinerary_list_populer?.datas);

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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation, order]);

  let _menu = null;

  const RenderUtama = ({ aktif }) => {
    if (loadingPopuler) {
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <ActivityIndicator animating={true} color="#209FAE" />
      </View>;
    }
    if (aktif === "Itinerary") {
      return list_populer && list_populer.length > 0 ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: "#fff",
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
                    backgroundColor: "#f6f6f6",
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
          <CardItinerary
            data={list_populer}
            props={props}
            token={token}
            setting={setting}
            setData={(e) => setlist_populer(e)}
          />
        </>
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
                width: Dimensions.get("screen").width / 5,
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
