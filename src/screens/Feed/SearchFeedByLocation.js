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
import Feedsearchbylocation from "../../graphQL/Query/Home/Feedsearchbylocation";
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

  let latitude = props.route.params.latitude;
  let longitude = props.route.params.longitude;
  // console.log(latitude, longitude);
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
  } = useQuery(Feedsearchbylocation, {
    variables: {
      latitude: latitude,
      longitude: longitude,
      orderby: "new",
      limit: 30,
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
  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    for (let val of data) {
      if (count < 3) {
        tmpArray.push(val);
        console.log("masuk", tmpArray);
        count++;
      } else {
        tmpArray.push(val);
        tmpData.push(tmpArray);
        count = 1;
        tmpArray = [];
      }
    }
    if (tmpArray.length) {
      tmpData.push(tmpArray);
    }
    return tmpData;
  };
  let feed_search_bylocation_paging = [];
  if (
    dataPost &&
    dataPost &&
    "datas" in dataPost.feed_search_bylocation_paging
  ) {
    feed_search_bylocation_paging = spreadData(
      dataPost.feed_search_bylocation_paging.datas
    );
  }
  // console.log(
  //   dataPost && dataPost && "datas" in dataPost.feed_search_bylocation_paging
  //     ? dataPost.feed_search_bylocation_paging.datas
  //     : null
  // );
  // console.log(feed_search_bylocation_paging);

  useEffect(() => {
    loadAsync();
  }, []);

  // let dataspred = spreadData(feed_search_bylocation_paging);

  // console.log(dataspred);

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
    feed_search_bylocation_paging = [];
    refetch();
    grid = 1;
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
    const { page_info } = fetchMoreResult.feed_search_bylocation_paging;
    const datas = [
      ...prev.feed_search_bylocation_paging.datas,
      ...fetchMoreResult.feed_search_bylocation_paging.datas,
    ];
    return Object.assign({}, prev, {
      feed_search_bylocation_paging: {
        __typename: prev.feed_search_bylocation_paging.__typename,
        page_info,
        datas,
      },
    });
  };

  const handleOnEndReached = () => {
    if (dataPost.feed_search_bylocation_paging.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          limit: 30,
          offset: dataPost.feed_search_bylocation_paging.page_info.offset,
          keyword: keyword,
          orderby: "new",
        },
        updateQuery: onUpdate,
      });
    }
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

  let grid = 1;
  // console.log(grid);
  const renderPost = ({ item, index }) => {
    if (grid == 1 && item.length == 3) {
      grid++;
      return (
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
                  post_id: item[2].id,
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
                uri: item[2].assets[0].filepath,
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
              onPress={
                () =>
                  props.navigation.navigate("FeedStack", {
                    screen: "CommentsById",
                    params: {
                      post_id: item[0].id,
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
                  uri: item[0].assets[0].filepath,
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
                    post_id: item[1].id,
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
                  uri: item[1].assets[0].filepath,
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
      );
    }
    if (grid == 2 && item.length == 3) {
      grid++;
      return (
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
                      post_id: item[0].id,
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
                  uri: item[0].assets[0].filepath,
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
                    post_id: item[1].id,
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
                  uri: item[1].assets[0].filepath,
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
                  post_id: item[2].id,
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
                uri: item[2].assets[0].filepath,
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
      );
    }
    if (grid == 3 && item.length == 3) {
      grid = 1;
      return (
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
                  post_id: item[0].id,
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
                uri: item[0].assets[0].filepath,
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
                  post_id: item[1].id,
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
                uri: item[1].assets[0].filepath,
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
                  post_id: item[2].id,
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
                uri: item[2].assets[0].filepath,
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
      );
    }
    if (item.length < 3) {
      grid = 1;
      return (
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
                  post_id: item[0].id,
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
                uri: item[0].assets[0].filepath,
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
          {item[1] ? (
            <Pressable
              onPress={() =>
                props.navigation.navigate("FeedStack", {
                  screen: "CommentsById",
                  params: {
                    post_id: item[1].id,
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
                  uri: item[0].assets[0].filepath,
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
          ) : null}
        </View>
      );
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
          <Text
            size="label"
            type="bold"
            style={{
              color: "#FFFFFF",
            }}
          >
            Search By Location
          </Text>
          <Ripple
            onPress={() => {
              // refetch();
              // setAktifSearch(false);
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
      <FlatList
        data={feed_search_bylocation_paging}
        renderItem={({ item, index }) => {
          if (grid == 1 && item.length == 3) {
            grid++;
            return (
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
                        post_id: item[2].id,
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
                      uri: item[2].assets[0].filepath,
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
                    onPress={
                      () =>
                        props.navigation.navigate("FeedStack", {
                          screen: "CommentsById",
                          params: {
                            post_id: item[0].id,
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
                        uri: item[0].assets[0].filepath,
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
                          post_id: item[1].id,
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
                        uri: item[1].assets[0].filepath,
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
            );
          }
          if (grid == 2 && item.length == 3) {
            grid++;
            return (
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
                            post_id: item[0].id,
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
                        uri: item[0].assets[0].filepath,
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
                          post_id: item[1].id,
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
                        uri: item[1].assets[0].filepath,
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
                        post_id: item[2].id,
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
                      uri: item[2].assets[0].filepath,
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
            );
          }
          if (grid == 3 && item.length == 3) {
            grid = 1;
            return (
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
                        post_id: item[0].id,
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
                      uri: item[0].assets[0].filepath,
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
                        post_id: item[1].id,
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
                      uri: item[1].assets[0].filepath,
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
                        post_id: item[2].id,
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
                      uri: item[2].assets[0].filepath,
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
            );
          }
          if (item.length < 3) {
            grid = 1;
            return (
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
                        post_id: item[0].id,
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
                      uri: item[0].assets[0].filepath,
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
                {item[1] ? (
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate("FeedStack", {
                        screen: "CommentsById",
                        params: {
                          post_id: item[1].id,
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
                        uri: item[0].assets[0].filepath,
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
                ) : null}
              </View>
            );
          }
        }}
        style={{
          marginHorizontal: 10,
          // width: '100%',
          // height: '50%'
        }}
        // horizontal
        contentContainerStyle={{
          paddingVertical: 5,
          // flexDirection: 'column',
          // flexWrap: 'wrap',
          // flexGrow:1,
          // borderWidth:1,
        }}
        keyExtractor={(item) => item.id_post}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => _refresh()}
          />
        }
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
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
      />
    </SafeAreaView>
  );
}
