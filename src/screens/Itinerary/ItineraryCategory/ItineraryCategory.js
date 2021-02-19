import { useQuery, useLazyQuery } from "@apollo/client";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Picker,
  RefreshControl,
  Alert,
  ActivityIndicator,
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
} from "../../../assets/svg";
import { Text, Button, FunIcon } from "../../../component/index";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import Populer from "../../../graphQL/Query/Itinerary/ItineraryPopuler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image } from "../../../assets/png";
import { Truncate, Loading } from "../../../component";
import Ripple from "react-native-material-ripple";

export default function ItineraryCategory(props) {
  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
  let { width, height } = Dimensions.get("screen");
  let [dataType, setDataType] = useState(props.route.params.typeCategory);
  let [actives, setActives] = useState("Itinerary");
  let [order, setOrder] = useState(props.route.params.typeOrder);
  let [touch, setTouch] = useState(false);
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
    headerTitle: "New Itinerary",
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
        <SearchWhite height={20} width={20}></SearchWhite>
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
      cities: null,
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
    if (!fetchMoreResult) return prev;
    const { page_info } = fetchMoreResult.itinerary_list_populer;
    const datas = [
      ...prev.itinerary_list_populer.datas,
      ...fetchMoreResult.itinerary_list_populer.datas,
    ];
    return Object.assign({}, prev, {
      list_populer: {
        __typename: prev.itinerary_list_populer.__typename,
        page_info,
        datas,
      },
    });
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
            list_populer[index].liked = true;
          } else {
            throw new Error(response.data.setItineraryFavorit.message);
          }
        }
      } catch (error) {
        list_populer[index].liked = false;
        list_populer[index].response_count =
          list_populer[index].response_count + 1;
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
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
            list_populer[index].liked = false;
          } else {
            throw new Error(response.data.unsetItineraryFavorit.message);
          }
        }
      } catch (error) {
        list_populer[index].liked = true;
        list_populer[index].response_count =
          list_populer[index].response_count - 1;
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

  const renderPopuler = ({ item, index }) => {
    return (
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
                  item && item.cover ? { uri: item.cover } : default_image
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
                    <Text size="small" type="regular">
                      {(item && item.buddy_count ? item.buddy_count : null) +
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
              <Text size="small" type="bold" style={{ color: "#209FAE" }}>
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
              <Text size="small" type="bold" style={{ color: "#209FAE" }}>
                Travel Stories
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const RenderUtama = ({ aktif }) => {
    if (loadingPopuler) {
      <View>
        <ActivityIndicator animating={true} color="#209FAE" />
      </View>;
    }
    if (aktif == "Itinerary") {
      return (
        <FlatList
          data={list_populer}
          renderItem={renderPopuler}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 5,
          }}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => Refresh()}
            />
          }
          ListHeaderComponent={
            <>
              <View
                style={{
                  height: Dimensions.get("screen").height * 0.05,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    size="description"
                    type="bold"
                    style={{ marginRight: 5 }}
                  >
                    Show Result
                  </Text>
                  <Text size="description" type="bold">
                    {list_populer?.length}
                  </Text>
                </View>
                <View
                  style={{
                    width: Dimensions.get("screen").width * 0.35,
                    height: "100%",
                    elevation: 20,
                    justifyContent: "center",
                    backgroundColor: "white",
                    borderRadius: 2,
                  }}
                >
                  <Picker
                    mode="dropdown"
                    selectedValue={order}
                    onValueChange={(x) => setOrder(x)}
                  >
                    <Picker.Item label="New Post" value="new" />
                    <Picker.Item label="Populer" value="populer" />
                  </Picker>
                </View>
              </View>
              <View>
                {loadingPopuler ? (
                  <View style={{ paddingVertical: 20, alignItems: "center" }}>
                    <ActivityIndicator animating={true} color="#209FAE" />
                  </View>
                ) : null}
              </View>
              {/* <View>
                {list_populer?.length === 0 ? (
                  <View style={{ paddingVertical: 20, alignItems: "center" }}>
                    <Text size="title" type="bold">
                      Tidak ada Data
                    </Text>
                  </View>
                ) : null}
              </View> */}
            </>
          }
          onEndReachedThreshold={1}
          onEndReached={handleOnEndReached}
        />
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
                  <FunIcon
                    icon={item.icon}
                    height={30}
                    width={30}
                    fill={"white"}
                    style={{ marginRight: 5 }}
                  />
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
                  <FunIcon
                    icon={item.icon}
                    height={30}
                    width={30}
                    fill={"black"}
                    style={{ marginRight: 5 }}
                  />
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
              borderBottomWidth: actives == "Itinerary" ? 2 : 0,
              borderBottomColor: actives == "Itinerary" ? "#249FAE" : "#EEEEEE",
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
              type={actives == "Album" ? "bold" : "reguler"}
              style={{
                color: actives == "Album" ? "#209FAE" : "#464646",
              }}
            >
              Travel Album
            </Text>
          </Ripple>
          <Ripple
            onPress={() => setActives("Stories")}
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
              type={actives == "Stories" ? "bold" : "reguler"}
              style={{
                color: actives == "Stories" ? "#209FAE" : "#464646",
              }}
            >
              Travel Stories
            </Text>
          </Ripple>
        </View>
      </View>
      <RenderUtama aktif={actives} />
    </View>
  );
}
