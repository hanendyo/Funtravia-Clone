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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, FunIcon, Text } from "../../../component";
import { default_image, itinerary_1, itinerary_2 } from "../../../assets/png";
import {
  Arrowbackwhite,
  Calendargrey,
  PinHijau,
  User,
  TravelStories,
  TravelAlbum,
  SearchWhite,
  LikeRed,
  LikeEmpty,
} from "../../../assets/svg";
import { Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Populer_ from "../../../graphQL/Query/Itinerary/ItineraryPopuler";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import Ripple from "react-native-material-ripple";

export default function ItineraryPopuler(props) {
  let [actives, setActives] = useState("Itinerary");
  let { width, height } = Dimensions.get("screen");

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
        <SearchWhite height={20} width={20}></SearchWhite>
      </Button>
    ),
  };

  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
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

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    await fetchCategory();
    // await fetchDataListPopuler();
  };

  const [
    fetchCategory,
    { data: dataCategory, loading: loadingCategory, error: errorCategory },
  ] = useLazyQuery(Category, {
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

          // Alert.alert('Succes');
        }
      } catch (error) {
        feed_post_pageing[index].liked = false;
        feed_post_pageing[index].response_count =
          feed_post_pageing[index].response_count + 1;
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
            renderItem={renderPopuler}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => Refresh()}
              />
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
    } else if (aktif == "Album") {
      return (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          {loadingPopuler ? (
            <View
              style={{
                paddingHorizontal: 15,
                height: "100%",
                marginTop: 20,
                flex: 1,
                backgroundColor: "white",
              }}
            >
              <Text size="label" type="bold" style={{ textAlign: "center" }}>
                Loading...
              </Text>
            </View>
          ) : dataPopuler && dataPopuler.itinerary_list_populer ? (
            <FlatList
              data={dataPopuler.itinerary_list_populer}
              renderItem={renderPopuler}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View
              style={{
                paddingHorizontal: 15,
                marginTop: 20,
                flex: 1,
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <Text size="label" type="bold" style={{ textAlign: "center" }}>
                Tidak ada Travel Album
              </Text>
            </View>
          )}
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

  {
    /* ======================================= Render All ====================================================*/
  }
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
    >
      <View style={{ backgroundColor: "white" }}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              height: Dimensions.get("screen").width * 0.3,
              paddingHorizontal: 15,
              marginTop: 10,
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
                shadowColor: "gray",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: arrayShadow.shadowOpacity,
                shadowRadius: arrayShadow.shadowRadius,
                elevation: arrayShadow.elevation,
                paddingVertical: 2,
              }}
            >
              <Image
                source={itinerary_1}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 10,
                }}
              />
              <Text
                size="description"
                type="bold"
                style={{
                  position: "absolute",
                  paddingHorizontal: 5,
                  marginHorizontal: 5,
                  borderRadius: 3,
                  marginTop: 15,
                  backgroundColor: "#DAF0F2",
                  color: "#209FAE",
                  borderWidth: 1,
                  borderColor: "#209FAE",
                }}
              >
                New Itinerary
              </Text>
            </Ripple>
            <Ripple
              style={{
                marginRight: 5,
                borderRadius: 10,
                height: "100%",
                width: Dimensions.get("screen").width * 0.57,
                marginRight: 5,
                shadowColor: "gray",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: arrayShadow.shadowOpacity,
                shadowRadius: arrayShadow.shadowRadius,
                elevation: arrayShadow.elevation,
                paddingVertical: 2,
              }}
            >
              <Image
                source={itinerary_2}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 10,
                }}
              />
              <Text
                size="description"
                type="bold"
                style={{
                  position: "absolute",
                  paddingHorizontal: 5,
                  marginHorizontal: 5,
                  borderRadius: 3,
                  marginTop: 15,
                  backgroundColor: "#DAF0F2",
                  color: "#209FAE",
                  borderWidth: 1,
                  borderColor: "#209FAE",
                }}
              >
                Populer Itinerary
              </Text>
            </Ripple>
          </View>
        </ScrollView>
        <View
          style={{
            width: Dimensions.get("screen").width * 0.9,
            paddingHorizontal: 15,
            marginTop: 10,
          }}
        >
          <Text size="title" type="bold">
            Category Itinerary
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            marginTop: 5,
            flexDirection: "row",
            height: Dimensions.get("screen").width * 0.24,
          }}
        >
          <FlatList
            data={dataCategory?.category_journal}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Ripple
                  style={{
                    overflow: "hidden",
                    width: Dimensions.get("screen").width * 0.23,
                    height: Dimensions.get("screen").width * 0.23,
                    backgroundColor: "white",
                    marginRight: 5,
                    shadowColor: "gray",
                    // shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: arrayShadow.shadowOpacity,
                    shadowRadius: arrayShadow.shadowRadius,
                    elevation: arrayShadow.elevation,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    marginTop: 1,
                    marginLeft: 1,
                  }}
                  onPress={() =>
                    props.navigation.navigate("ItineraryCategory", {
                      dataPopuler: dataPopuler,
                      typeCategory: item.id,
                    })
                  }
                >
                  <View
                    style={{
                      backgroundColor: "#f6f6f6",
                      height: 50,
                      width: 50,
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FunIcon icon={item.icon} />
                  </View>
                  <Text
                    size="small"
                    type="regular"
                    style={{ textAlign: "center" }}
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
      <View>
        <RenderUtama aktif={actives} />
      </View>
      {/* ) : null} */}
    </ScrollView>
  );
}
