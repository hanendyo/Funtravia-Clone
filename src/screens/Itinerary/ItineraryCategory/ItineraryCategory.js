import { useQuery } from "@apollo/client";
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
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Arrowbackwhite,
  SearchWhite,
  Calendargrey,
  //   LikeRed,
  //   LikeEmpty,
  PinHijau,
  User,
  TravelStories,
  TravelAlbum,
  SoloIcon,
  BussinessIcon,
  FamilyIcon,
  HoneyIcon,
  CompervanIcon,
  Star,
} from "../../../assets/svg";
import { Text, Button } from "../../../component/index";
import Category from "../../../graphQL/Query/Itinerary/ItineraryPopuler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image } from "../../../assets/png";
import { Truncate, Loading } from "../../../component";

export default function ItineraryCategory(props) {
  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
  let { width, height } = Dimensions.get("screen");
  // let [dataPop, setDataPop] = useState(props.route.params.dataPopuler);
  let [search, setSearch] = useState({
    keyword: "",
    type: null,
    cities: null,
    countries: null,
    orderby: null,
    rating: null,
  });

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
    data: dataPopuler,
    loading: loadingPopuler,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(Category, {
    variables: {
      keyword: search.keyword,
      type: null,
      countries: null,
      cities: null,
      rating: null,
      orderby: null,
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
    await fetchDataCategory();
  };

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
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

  const renderCategory = ({ item, index }) => {
    return (
      <View
        style={{
          // height: Dimensions.get("screen").width * 0.48,
          height: 160,
          paddingHorizontal: 10,
          marginTop: 5,
        }}
      >
        <View
          style={{
            borderRadius: 10,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
            justifyContent: "space-between",
            backgroundColor: "#F7F7F7",
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
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
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
                  borderTopLeftRadius: 10,
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                width: Dimensions.get("screen").width * 0.6,
                paddingHorizontal: 10,
                backgroundColor: "#FFFFFF",
                marginVertical: 5,
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
                      borderColor: "#209FAE",
                      borderRadius: 3,
                      backgroundColor: "#DAF0F2",
                    }}
                  >
                    <Text
                      style={{ color: "#209FAE", padding: 3 }}
                      size="small"
                      type="bold"
                    >
                      Family Trip
                    </Text>
                  </View>
                  {/* {item.liked === false ? (
                    <TouchableOpacity onPress={() => _liked(item.id, index)}>
                      <LikeEmpty height={20} width={20} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => _unliked(item.id, index)}>
                      <LikeRed height={20} width={20} />
                    </TouchableOpacity>
                  )} */}
                </View>
                <Text size="description" type="black" style={{ marginTop: 5 }}>
                  <Truncate text={item.name} length={40} />
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // marginTop: 3,
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
                    marginTop: 10,
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
                <View
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
                </View>
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

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={list_populer}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
        ListHeaderComponent={
          <View style={{ flex: 1 }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                paddingHorizontal: 10,
                height: 30,
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              <Pressable
                style={{
                  // height: "100%",
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#209FAE",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                <CompervanIcon height={20} width={20} />
                <Text
                  size="description"
                  type="bold"
                  style={{ marginLeft: 5, color: "#209FAE" }}
                >
                  Compervan
                </Text>
              </Pressable>
              <Pressable
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#209FAE",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: "#209FAE",
                }}
              >
                <SoloIcon height={20} width={20} />
                <Text
                  size="description"
                  type="bold"
                  style={{ marginLeft: 5, color: "white" }}
                >
                  Solo
                </Text>
              </Pressable>
              <Pressable
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#209FAE",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                <BussinessIcon height={20} width={20} />
                <Text
                  size="description"
                  type="bold"
                  style={{ marginLeft: 5, color: "#209FAE" }}
                >
                  Bussiness
                </Text>
              </Pressable>
              <Pressable
                style={{
                  // height: "100%",
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#209FAE",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                <FamilyIcon height={20} width={20} />
                <Text
                  size="description"
                  type="bold"
                  style={{ marginLeft: 5, color: "#209FAE" }}
                >
                  Family
                </Text>
              </Pressable>
            </ScrollView>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                paddingHorizontal: 10,
                shadowColor: "gray",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: arrayShadow.shadowOpacity,
                shadowRadius: arrayShadow.shadowRadius,
                elevation: arrayShadow.elevation,
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width * 0.31,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: 2,
                  borderBottomColor: "#249FAE",
                  paddingVertical: 10,
                }}
              >
                <Text
                  size="description"
                  type="bold"
                  style={{ color: "#209FAE" }}
                >
                  Itinerary
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.get("screen").width * 0.31,
                  alignItems: "center",
                  justifyContent: "center",
                  // borderBottomWidth: 2,
                  borderBottomColor: "#249FAE",
                  paddingVertical: 10,
                }}
              >
                <Text size="description" type="bold">
                  Travel Album
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.get("screen").width * 0.31,
                  alignItems: "center",
                  justifyContent: "center",
                  // borderBottomWidth: 2,
                  borderBottomColor: "#249FAE",
                  paddingVertical: 10,
                }}
              >
                <Text size="description" type="bold">
                  Travel Stories
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                paddingHorizontal: 10,
                height: 50,
                justifyContent: "center",
                // borderWidth: 1,
              }}
            >
              <View
                style={{
                  shadowColor: "gray",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: arrayShadow.shadowOpacity,
                  shadowRadius: arrayShadow.shadowRadius,
                  elevation: arrayShadow.elevation,
                  backgroundColor: "white",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 15,
                  height: "100%",
                  justifyContent: "space-between",
                  borderRadius: 5,
                  // borderWidth: 1,
                }}
              >
                <Text size="description" type="bold">
                  Show Result
                </Text>
                <View
                  style={{
                    height: 30,
                    width: 100,
                    backgroundColor: "#F3F3F3",
                    borderRadius: 5,
                  }}
                >
                  <Picker
                    mode="dropdown"
                    style={{
                      fontSize: 7,
                      fontFamily: "Lato-Regular",
                      // elevation: 20,
                      height: "100%",
                      width: "100%",
                    }}
                    // selectedValue={genders}
                    // onValueChange={(x) => setGender(x)}
                  >
                    <Picker.Item
                      style={{ fontSize: 12 }}
                      label="New Post"
                      value="M"
                    />
                    <Picker.Item label="Populer" value="F" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          loadingPopuler ? (
            <View
              style={{
                // position: 'absolute',
                // bottom:0,
                width: width,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                size="title"
                type="bold"
                // style={{ color:'#209fae'}}
              >
                Loading...
              </Text>
            </View>
          ) : null
        }
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
      />
    </View>
  );
}
