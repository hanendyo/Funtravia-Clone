import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
  Image,
  RefreshControl,
  Keyboard,
} from "react-native";
import Ripple from "react-native-material-ripple";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CustomImage,
  Text,
  Button,
  FloatingInput,
  Peringatan,
  Loading,
  Truncate,
} from "../../component";
import { NetworkStatus } from "@apollo/client";
import {
  Comment,
  LikeRed,
  LikeEmpty,
  PostButton,
  OptionsVertBlack,
  ShareBlack,
  Kosong,
  SearchWhite,
  Magnifying,
  OptionsVertWhite,
  Arrowbackwhite,
  Pinloc,
} from "../../assets/svg";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import likepost from "../../graphQL/Mutation/Post/likepost";
import FeedPost from "../../graphQL/Query/Feed/FeedPost";
import FeedList from "./FeedList";
import FeedPopuler from "../../graphQL/Query/Home/FeedPopuler";
import FeedPopulerPageing from "../../graphQL/Query/Home/FeedPopulerPageing";
// import SearchUserQuery from "../../graphQL/Query/Search/SearchPeople";
import SearchUserQuery from "../../graphQL/Query/Search/SearchPeopleV2";
import FeedPageing from "../../graphQL/Query/Feed/FeedPageing";
import Modal from "react-native-modal";
import { API_KEY } from "../../config";
export default function Feed(props) {
  const [active, setActive] = useState("personal");
  const [active_src, setActiveSrc] = useState("account");
  const [searchtext, SetSearchtext] = useState("");
  let [setting, setSetting] = useState();

  // let [token, setToken] = useState(props.route.params.token);
  let [token, setToken] = useState("");
  const default_image =
    "https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909";
  // console.log(props.route.params.token);
  let [idx, setIdx] = useState(2);
  let [refreshing, setRefreshing] = useState(false);
  let [aktifsearch, setAktifSearch] = useState(false);
  let { width, height } = Dimensions.get("screen");
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
    // refetch();
  };
  const _searchHandle = (text) => {
    SetSearchtext(text);
    _autocomplitLocation(text);
  };
  const HeaderComponent = {
    tabBarBadge: null,
    headerShown: false,
  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);
  const {
    loading: loadingPost,
    data: dataPost,
    error: errorPost,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(FeedPopulerPageing, {
    variables: {
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
  // console.log(dataPost);
  let feed_post_populer_paging = [];
  if (dataPost && dataPost && "datas" in dataPost.feed_post_populer_paging) {
    feed_post_populer_paging = dataPost.feed_post_populer_paging.datas;
  }

  const {
    loading: loadingSrcuser,
    data: dataSrcuser,
    error: errorSrcuser,
    refetch: refetchSrcuser,
    networkStatus: networkStatusSrcuser,
  } = useQuery(SearchUserQuery, {
    variables: {
      keyword: searchtext,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  // // console.log(dataPost);
  let user_search_feed = [];
  if (dataSrcuser && dataSrcuser.user_search_feed) {
    user_search_feed = dataSrcuser.user_search_feed;
  }
  // console.log(user_search_feed);

  useEffect(() => {
    loadAsync();
  }, []);

  if (errorPost) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={{ backgroundColor: "#209FAE" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                // borderWidth:1,
                margin: 15,
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                borderRadius: 3,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Magnifying
                width="20"
                height="20"
                style={{ marginHorizontal: 10 }}
              />
              <TextInput
                value={searchtext}
                onChangeText={(e) => _searchHandle(e)}
                placeholder="Search Feed"
                style={{
                  color: "#464646",
                  height: 40,
                  width: "80%",
                }}
              />
            </View>
            <Pressable
              style={{
                height: 70,
                paddingRight: 5,
                // borderWidth:1,
                justifyContent: "center",
              }}
            >
              <OptionsVertWhite width={20} height={20} />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#EEEEEE",
              paddingHorizontal: 10,
            }}
          >
            <Ripple
              onPress={() => {
                setActive("personal");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                // borderBottomWidth: active == "personal" ? 3 : 1,
                // borderBottomColor:
                //   active == "personal" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
              }}
            >
              <Text
                size="description"
                type={active == "personal" ? "bold" : "bold"}
                style={{
                  color: active == "personal" ? "#209FAE" : "#D1D1D1",
                }}
              >
                All Post
              </Text>
            </Ripple>
            <Ripple
              onPress={() => {
                setActive("group");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                // borderBottomWidth: active == "group" ? 3 : 1,
                // borderBottomColor: active == "group" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
              }}
            >
              <Text
                size="description"
                type={active == "group" ? "bold" : "bold"}
                style={{
                  color: active == "group" ? "#209FAE" : "#D1D1D1",
                }}
              >
                Travel
              </Text>
            </Ripple>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text size="title">Error...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const refresh = networkStatus === NetworkStatus.refetch;
  const _refresh = async () => {
    setRefreshing(true);
    feed_post_populer_paging = [];
    refetch();

    wait(1000).then(() => {
      setRefreshing(false);
    });
  };
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onUpdate = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    const { page_info } = fetchMoreResult.feed_post_populer_paging;
    const datas = [
      ...prev.feed_post_populer_paging.datas,
      ...fetchMoreResult.feed_post_populer_paging.datas,
    ];
    return Object.assign({}, prev, {
      feed_post_populer_paging: {
        __typename: prev.feed_post_populer_paging.__typename,
        page_info,
        datas,
      },
    });
  };

  const handleOnEndReached = () => {
    // console.log('test');
    if (dataPost.feed_post_populer_paging.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          limit: 10,
          offset: dataPost.feed_post_populer_paging.page_info.offset + 1,
        },
        updateQuery: onUpdate,
      });
    }
  };

  const Searchbytag = (text) => {
    props.navigation.navigate("FeedStack", {
      screen: "SearchFeedByTag",
      params: {
        keyword: text,
      },
    });
  };

  const showsearchpage = () => {
    create_UUID();
    setAktifSearch(true);
  };

  const _BackHandler = () => {
    if (aktifsearch == true) {
      setAktifSearch(false);
      SetSearchtext("");
      Keyboard.dismiss();
    } else {
      props.navigation.goBack();
    }
  };
  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    setSessionToken(uuid);
  }
  let [sessiontoken, setSessionToken] = useState("");
  let [datalocation, setDatalocation] = useState([]);
  let [loadinglocation, setLoadinglocation] = useState(false);
  // console.log(sessiontoken);
  const _autocomplitLocation = async (input) => {
    setLoadinglocation(true);
    try {
      let response = await fetch(
        "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
          input +
          "&key=" +
          API_KEY +
          "&sessiontoken=" +
          sessiontoken,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      let responseJson = await response.json();
      if (responseJson && responseJson.status == "OK") {
        setDatalocation(responseJson.predictions);
        setLoadinglocation(false);
      } else {
        setDatalocation(responseJson.predictions);
        setLoadinglocation(false);
      }
    } catch (error) {
      console.error(error);
      setLoadinglocation(false);
    }
  };

  const _get_search_bylocation = async (data) => {
    setLoadinglocation(true);
    try {
      let response = await fetch(
        "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
          data.place_id +
          "&fields=geometry&key=" +
          API_KEY,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      let responseJson = await response.json();
      if (responseJson && responseJson.status == "OK") {
        console.log(responseJson.result.geometry.location);
        // setDatalocation(responseJson.predictions);
        setLoadinglocation(false);
      } else {
        // setDatalocation(responseJson.predictions);
        setLoadinglocation(false);
        Alert("location not found");
      }
    } catch (error) {
      console.error(error);
      Alert("location not found");
      setLoadinglocation(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ backgroundColor: "#209FAE" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "center"
            paddingHorizontal: 10,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Ripple
            onPress={() => _BackHandler()}
            style={{
              height: 70,
              width: 35,
              justifyContent: "center",
            }}
          >
            <Arrowbackwhite width={20} height={20} />
          </Ripple>
          <View
            style={{
              // borderWidth:1,
              marginVertical: 15,
              backgroundColor: "#FFFFFF",
              flexDirection: "row",
              borderRadius: 3,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Magnifying
              width="20"
              height="20"
              style={{ marginHorizontal: 10 }}
            />
            <TextInput
              value={searchtext}
              onChangeText={(e) => _searchHandle(e)}
              onFocus={() => showsearchpage(true)}
              placeholder="Search Feed"
              style={{
                color: "#464646",
                height: 40,
                width: "70%",
              }}
            />
          </View>
          <Ripple
            onPress={() => {
              // refetch();
              setAktifSearch(false);
            }}
            style={{
              height: 70,
              width: 35,
              // paddingRight: 5,
              // borderWidth:1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <OptionsVertWhite width={20} height={20} />
          </Ripple>
        </View>
      </View>

      {aktifsearch == true ? (
        <>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#EEEEEE",
              paddingHorizontal: 10,
            }}
          >
            <Ripple
              onPress={() => {
                setActiveSrc("account");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: active_src == "account" ? 3 : 0,
                borderBottomColor:
                  active_src == "account" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
                marginHorizontal: 10,
              }}
            >
              <Text
                size="description"
                type={active_src == "account" ? "bold" : "bold"}
                style={{
                  color: active_src == "account" ? "#209FAE" : "#D1D1D1",
                }}
              >
                Account
              </Text>
            </Ripple>
            <Ripple
              onPress={() => {
                setActiveSrc("tag");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: active_src == "tag" ? 3 : 0,
                borderBottomColor: active_src == "tag" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
                marginHorizontal: 10,
              }}
            >
              <Text
                size="description"
                type={active_src == "tag" ? "bold" : "bold"}
                style={{
                  color: active_src == "tag" ? "#209FAE" : "#D1D1D1",
                }}
              >
                Tag
              </Text>
            </Ripple>
            <Ripple
              onPress={() => {
                setActiveSrc("places");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: active_src == "places" ? 3 : 0,
                borderBottomColor:
                  active_src == "places" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
                marginHorizontal: 10,
              }}
            >
              <Text
                size="description"
                type={active_src == "places" ? "bold" : "bold"}
                style={{
                  color: active_src == "places" ? "#209FAE" : "#D1D1D1",
                }}
              >
                Places
              </Text>
            </Ripple>
          </View>
          {active_src === "account" ? (
            loadingSrcuser ? (
              <View
                style={{
                  // position: 'absolute',
                  // bottom:0,
                  flex: 1,
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
            ) : (
              <FlatList
                data={user_search_feed}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => {
                      item.id !== setting?.user?.id
                        ? props.navigation.push("ProfileStack", {
                            screen: "otherprofile",
                            params: {
                              idUser: item.id,
                            },
                          })
                        : props.navigation.push("ProfileStack", {
                            screen: "ProfileTab",
                          });
                    }}
                    style={{
                      flexDirection: "row",
                      paddingVertical: 15,
                      marginHorizontal: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#EEEEEE",
                      alignContent: "center",
                    }}
                  >
                    <CustomImage
                      // isTouchable
                      // onPress={() => {
                      //   item.id !== setting?.user?.id
                      //     ? props.navigation.push("ProfileStack", {
                      //         screen: "otherprofile",
                      //         params: {
                      //           idUser: item.id,
                      //         },
                      //       })
                      //     : props.navigation.push("ProfileStack", {
                      //         screen: "ProfileTab",
                      //       });
                      // }}
                      customStyle={{
                        height: 40,
                        width: 40,
                        borderRadius: 15,
                        alignSelf: "center",
                        marginLeft: 15,
                      }}
                      customImageStyle={{
                        resizeMode: "cover",
                        borderRadius: 50,
                      }}
                      source={{
                        uri: item.picture ? item.picture : default_image,
                      }}
                    />
                    <View
                      style={{
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text type="bold">
                        {item.first_name} {item?.last_name}
                      </Text>
                      <Text>@{item.username}</Text>
                      {/* <Text>{item.bio}</Text> */}
                    </View>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )
          ) : null}
          {active_src === "tag" && searchtext ? (
            <Pressable
              onPress={() => {
                Searchbytag(searchtext);
              }}
              style={{
                flexDirection: "row",
                paddingVertical: 15,
                marginHorizontal: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#EEEEEE",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  alignSelf: "center",
                  marginLeft: 15,
                  backgroundColor: "#DAF0F2",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text size="h5">#</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                }}
              >
                <Text type="bold">#{searchtext}</Text>
              </View>
            </Pressable>
          ) : null}
          {active_src === "places" ? (
            loadinglocation == true ? (
              <View
                style={{
                  // position: 'absolute',
                  // bottom:0,
                  flex: 1,
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
            ) : (
              <FlatList
                data={datalocation}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => {
                      _get_search_bylocation(item);
                    }}
                    style={{
                      flexDirection: "row",
                      paddingVertical: 15,
                      marginHorizontal: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#EEEEEE",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        alignSelf: "center",
                        marginLeft: 15,
                        backgroundColor: "#DAF0F2",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Pinloc width={15} height={15} />
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text type="bold">
                        {item.structured_formatting.main_text}
                      </Text>
                      {item.structured_formatting &&
                      item.structured_formatting.secondary_text ? (
                        <Text>
                          <Truncate
                            text={item.structured_formatting.secondary_text}
                            length={50}
                          />
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )
          ) : null}
        </>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#EEEEEE",
              paddingHorizontal: 10,
            }}
          >
            <Ripple
              onPress={() => {
                setActive("personal");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                // borderBottomWidth: active == "personal" ? 3 : 1,
                // borderBottomColor:
                //   active == "personal" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
              }}
            >
              <Text
                size="description"
                type={active == "personal" ? "bold" : "bold"}
                style={{
                  color: active == "personal" ? "#209FAE" : "#D1D1D1",
                }}
              >
                All Post
              </Text>
            </Ripple>
            <Ripple
              onPress={() => {
                setActive("group");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                // borderBottomWidth: active == "group" ? 3 : 1,
                // borderBottomColor: active == "group" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
              }}
            >
              <Text
                size="description"
                type={active == "group" ? "bold" : "bold"}
                style={{
                  color: active == "group" ? "#209FAE" : "#D1D1D1",
                }}
              >
                Travel
              </Text>
            </Ripple>
          </View>
          <FlatList
            data={feed_post_populer_paging}
            renderItem={({ item, index }) =>
              (index + 1) % 9 == 0 ? (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View style={{}}>
                      <Pressable
                        onPress={
                          () =>
                            props.navigation.navigate("FeedStack", {
                              screen: "CommentsById",
                              params: {
                                post_id: feed_post_populer_paging[index - 8].id,
                              },
                            })
                          // teststate(index-8)
                        }
                        style={
                          {
                            // height: width/3 - 10,
                            // width: width/3 - 10,
                          }
                        }
                      >
                        <Image
                          source={{
                            uri:
                              feed_post_populer_paging[index - 8].assets[0]
                                .filepath,
                          }}
                          style={{
                            height: width / 3 - 10,
                            width: width / 3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          props.navigation.navigate("FeedStack", {
                            screen: "CommentsById",
                            params: {
                              post_id: feed_post_populer_paging[index - 7].id,
                            },
                          })
                        }
                        style={
                          {
                            // height: width/3 - 10,
                            // width: width/3 - 10,
                          }
                        }
                      >
                        <Image
                          source={{
                            uri:
                              feed_post_populer_paging[index - 7].assets[0]
                                .filepath,
                          }}
                          style={{
                            height: width / 3 - 10,
                            width: width / 3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                      </Pressable>
                    </View>
                    <Pressable
                      onPress={() =>
                        props.navigation.navigate("FeedStack", {
                          screen: "CommentsById",
                          params: {
                            post_id: feed_post_populer_paging[index - 6].id,
                          },
                        })
                      }
                      style={
                        {
                          // height: (width + width)/3 -15,
                          // width: (width + width)/3 -20,
                        }
                      }
                    >
                      <Image
                        source={{
                          uri:
                            feed_post_populer_paging[index - 6].assets[0]
                              .filepath,
                        }}
                        style={{
                          height: (width + width) / 3 - 15,
                          width: (width + width) / 3 - 20,
                          borderRadius: 5,
                          margin: 2,
                          alignSelf: "center",
                          resizeMode: "cover",
                        }}
                      />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Pressable
                      onPress={() =>
                        props.navigation.navigate("FeedStack", {
                          screen: "CommentsById",
                          params: {
                            post_id: feed_post_populer_paging[index - 5].id,
                          },
                        })
                      }
                      style={
                        {
                          // height: (width + width)/3 -15,
                          // width: (width + width)/3 -20,
                        }
                      }
                    >
                      <Image
                        source={{
                          uri:
                            feed_post_populer_paging[index - 5].assets[0]
                              .filepath,
                        }}
                        style={{
                          height: (width + width) / 3 - 15,
                          width: (width + width) / 3 - 20,
                          borderRadius: 5,
                          margin: 2,
                          alignSelf: "center",
                          resizeMode: "cover",
                        }}
                      />
                    </Pressable>

                    <View style={{}}>
                      <Pressable
                        onPress={() =>
                          props.navigation.navigate("FeedStack", {
                            screen: "CommentsById",
                            params: {
                              post_id: feed_post_populer_paging[index - 4].id,
                            },
                          })
                        }
                        style={
                          {
                            // height: width/3 - 10,
                            // width: width/3 - 10,
                          }
                        }
                      >
                        <Image
                          source={{
                            uri:
                              feed_post_populer_paging[index - 4].assets[0]
                                .filepath,
                          }}
                          style={{
                            height: width / 3 - 10,
                            width: width / 3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          props.navigation.navigate("FeedStack", {
                            screen: "CommentsById",
                            params: {
                              post_id: feed_post_populer_paging[index - 3].id,
                            },
                          })
                        }
                        style={
                          {
                            // height: width/3 - 10,
                            // width: width/3 - 10,
                          }
                        }
                      >
                        <Image
                          source={{
                            uri:
                              feed_post_populer_paging[index - 3].assets[0]
                                .filepath,
                          }}
                          style={{
                            height: width / 3 - 10,
                            width: width / 3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                      </Pressable>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Pressable
                      onPress={() =>
                        props.navigation.navigate("FeedStack", {
                          screen: "CommentsById",
                          params: {
                            post_id: feed_post_populer_paging[index - 2].id,
                          },
                        })
                      }
                      style={
                        {
                          // height: width/3 - 10,
                          // width: width/3 - 10,
                        }
                      }
                    >
                      <Image
                        source={{
                          uri:
                            feed_post_populer_paging[index - 2].assets[0]
                              .filepath,
                        }}
                        style={{
                          height: width / 3 - 10,
                          width: width / 3 - 10,
                          borderRadius: 5,
                          margin: 2,
                          alignSelf: "center",
                          resizeMode: "cover",
                        }}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        props.navigation.navigate("FeedStack", {
                          screen: "CommentsById",
                          params: {
                            post_id: feed_post_populer_paging[index - 1].id,
                          },
                        })
                      }
                      style={
                        {
                          // height: width/3 - 10,
                          // width: width/3 - 10,
                        }
                      }
                    >
                      <Image
                        source={{
                          uri:
                            feed_post_populer_paging[index - 1].assets[0]
                              .filepath,
                        }}
                        style={{
                          height: width / 3 - 10,
                          width: width / 3 - 10,
                          borderRadius: 5,
                          margin: 2,
                          alignSelf: "center",
                          resizeMode: "cover",
                        }}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        props.navigation.navigate("FeedStack", {
                          screen: "CommentsById",
                          params: {
                            post_id: item.id,
                          },
                        })
                      }
                      style={
                        {
                          // height: width/3 - 10,
                          // width: width/3 - 10,
                        }
                      }
                    >
                      <Image
                        source={{
                          uri:
                            feed_post_populer_paging[index].assets[0].filepath,
                        }}
                        style={{
                          height: width / 3 - 10,
                          width: width / 3 - 10,
                          borderRadius: 5,
                          margin: 2,
                          alignSelf: "center",
                          resizeMode: "cover",
                        }}
                      />
                    </Pressable>
                  </View>
                </View>
              ) : null
            }
            style={{
              marginHorizontal: 10,
              // width: '100%',
              // height: '50%'
            }}
            // horizontal
            contentContainerStyle={
              {
                // flexDirection: 'column',
                // flexWrap: 'wrap',
                // flexGrow:1,
                // borderWidth:1,
              }
            }
            keyExtractor={(item) => item.id_post}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => _refresh()}
              />
            }
            onEndReachedThreshold={1}
            ListFooterComponent={
              loadingPost ? (
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
            onEndReached={handleOnEndReached}
          />
        </>
      )}
    </SafeAreaView>
  );
}
