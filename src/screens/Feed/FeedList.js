import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Image as ImageRN,
  ImageBackground,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { CustomImage } from "../../component";
import {
  LikeRed,
  ShareBlack,
  More,
  LikeBlack,
  CommentBlack,
} from "../../assets/svg";
import { gql } from "apollo-boost";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import likepost from "../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../graphQL/Mutation/Post/unlikepost";
import { Text, Button, shareAction } from "../../component";
import { Truncate } from "../../component";
import { useTranslation } from "react-i18next";
import FeedPageing from "../../graphQL/Query/Feed/FeedPageing";
import ReadMore from "react-native-read-more-text";
import { useScrollToTop } from "@react-navigation/native";
import { NetworkStatus } from "@apollo/client";
import RenderAlbum from "./RenderAlbumItinerary";
import RenderSinglePhoto from "./RenderSinglePhoto";
import { useIsFocused } from "@react-navigation/native";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import FollowingQuery from "../../graphQL/Query/Profile/Following";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";

const deletepost = gql`
  mutation($post_id: ID!) {
    delete_post(post_id: $post_id) {
      id
      response_time
      message
      code
    }
  }
`;

export default function FeedList({ props, token }) {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const isFocused = useIsFocused();
  let [selectedOption, SetOption] = useState({});
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [setting, setSetting] = useState();
  let [dataUser, setDataUser] = useState();
  let [activelike, setactivelike] = useState(true);
  console.log("selectedOption :", selectedOption);

  const { t, i18n } = useTranslation();
  let { width, height } = Dimensions.get("screen");
  const [
    MutationLike,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(likepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    MutationunLike,
    { loading: loadingunLike, data: dataunLike, error: errorunLike },
  ] = useMutation(unlikepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    Mutationdeletepost,
    { loading: loadingdelete, data: datadelete, error: errordelete },
  ] = useMutation(deletepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id, index) => {
    if (activelike) {
      if (token) {
        setactivelike(false);
        feed_post_pageing[index].liked = true;
        feed_post_pageing[index].response_count =
          feed_post_pageing[index].response_count + 1;
        try {
          let response = await MutationLike({
            variables: {
              post_id: id,
            },
          });
          // if (loadingLike) {
          //   Alert.alert("Loading!!");
          // }
          if (errorLike) {
            throw new Error("Error");
          }
          if (response.data) {
            if (
              response.data.like_post.code === 200 ||
              response.data.like_post.code === "200"
            ) {
              feed_post_pageing[index].liked = true;
              setactivelike(true);

              // feed_post_pageing[index].response_count = feed_post_pageing[index].response_count +1;
            } else {
              throw new Error(response.data.like_post.message);
            }

            // Alert.alert('Succes');
          }
        } catch (error) {
          feed_post_pageing[index].liked = false;
          feed_post_pageing[index].response_count =
            feed_post_pageing[index].response_count - 1;
          setactivelike(true);
          // Alert.alert("" + error);
        }
      } else {
        Alert.alert("Please Login");
      }
    }
  };

  const _unliked = async (id, index) => {
    if (activelike) {
      if (token || token !== "") {
        setactivelike(false);
        feed_post_pageing[index].liked = false;
        feed_post_pageing[index].response_count =
          feed_post_pageing[index].response_count - 1;
        try {
          let response = await MutationunLike({
            variables: {
              post_id: id,
            },
          });
          // if (loadingunLike) {
          //   Alert.alert("Loading!!");
          // }
          if (errorunLike) {
            throw new Error("Error");
          }

          if (response.data) {
            if (
              response.data.unlike_post.code === 200 ||
              response.data.unlike_post.code === "200"
            ) {
              // _Refresh();
              feed_post_pageing[index].liked = false;
              setactivelike(true);
            } else {
              throw new Error(response.data.unlike_post.message);
            }

            // Alert.alert('Succes');
          }
        } catch (error) {
          setactivelike(true);
          feed_post_pageing[index].response_count =
            feed_post_pageing[index].response_count + 1;
          feed_post_pageing[index].liked = true;
        }
      } else {
        Alert.alert("Please Login");
      }
    }
  };

  const {
    loading: loadingPost,
    data: dataPost,
    error: errorPost,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(FeedPageing, {
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
    onCompleted: () => {
      dataPost?.feed_post_pageing?.datas.map((item, index) => {
        setDataUser(item.user);
      });
    },
    // pollInterval: 5500,
    notifyOnNetworkStatusChange: true,
  });
  let feed_post_pageing = [];
  if (dataPost && dataPost && "datas" in dataPost.feed_post_pageing) {
    feed_post_pageing = dataPost.feed_post_pageing.datas;
  }

  const [refreshing, setRefreshing] = useState(false);
  const refresstatus = networkStatus === NetworkStatus.refetch;
  const Refresh = React.useCallback(() => {
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
      prev.feed_post_pageing.datas.length <
      fetchMoreResult.feed_post_pageing.page_info.offset
    ) {
      if (!fetchMoreResult) return prev;
      const { page_info } = fetchMoreResult.feed_post_pageing;
      const datas = [
        ...prev.feed_post_pageing.datas,
        ...fetchMoreResult.feed_post_pageing.datas,
      ];
      return Object.assign({}, prev, {
        feed_post_pageing: {
          __typename: prev.feed_post_pageing.__typename,
          page_info,
          datas,
        },
      });
    }
  };
  const handleOnEndReached = () => {
    if (dataPost.feed_post_pageing.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          limit: 10,
          offset: dataPost.feed_post_pageing.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

  const _deletepost = async (data) => {
    setModalhapus(false);
    setModalmenu(false);

    if (token || token !== "") {
      try {
        let response = await Mutationdeletepost({
          variables: {
            post_id: data.id,
          },
        });
        // if (loadingdelete) {
        //   Alert.alert("Loading!!");
        // }
        // if (errordelete) {
        //   throw new Error("Error Input");
        // }

        if (response.data) {
          if (
            response.data.delete_post.code === 200 ||
            response.data.delete_post.code === "200"
          ) {
            Refresh();
            // var tempData = [...datafeed];
            // var index = tempData.findIndex((k) => k['id'] === id);
            // tempData[index].liked = false;
            // tempData[index].response_count =
            // 	response.data.delete_post.count_like;
            // SetDataFeed(tempData);
          } else {
            throw new Error(response.data.delete_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      // tempData[index].liked = true;
      // tempData[index].response_count = tempData[index].response_count + 1;
      // SetDataFeed(tempData);
      Alert.alert("Please Login");
    }
  };
  const duration = (datetime) => {
    var date1 = new Date(datetime).getTime();
    var date2 = new Date().getTime();
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);
    mins = mins % 60;
    hrs = hrs % 24;
    if (yrs > 0) {
      return yrs + " " + t("yearsAgo");
    }
    if (days > 0) {
      return days + " " + t("daysAgo");
    }
    if (hrs > 0) {
      return hrs + " " + t("hoursAgo");
    }
    if (mins > 0) {
      return mins + " " + t("minutesAgo");
    } else {
      return t("justNow");
    }
  };

  const loadAsync = async () => {
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
    await LoadFollowing();
  };

  useEffect(() => {
    loadAsync();
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", (data) => {
      // if (
      //   props.route.params.isposting &&
      //   props.route.params.isposting == true
      // ) {
      //   Refresh();
      // }
    });
    return unsubscribe;
  }, [props.navigation]);

  let [liked, setLiked] = useState(false);

  const createPost = () => {
    props.navigation.push("FeedStack", {
      screen: "Post",
    });
  };

  const viewcomment = (data) => {
    props.navigation.navigate("FeedStack", {
      screen: "CommentPost",
      params: {
        data: data,
        token: token,
      },
    });
  };

  const [selected, setSelected] = useState(new Map());

  const OptionOpen = (data) => {
    SetOption(data);
    if (data.user.ismyfeed == true) {
      setModalmenu(true);
    } else {
      setModalmenuother(true);
    }
  };

  const ReadMorehendle = (handlePress) => {
    return (
      <Text
        onPress={handlePress}
        type="bold"
        style={{
          color: "#209fae",
        }}
      >
        Read More
      </Text>
    );
  };

  const ReadLesshendle = (handlePress) => {
    return (
      <Text
        onPress={handlePress}
        type="bold"
        style={{
          color: "#209fae",
        }}
      >
        Read Less
      </Text>
    );
  };

  const goToItinerary = (data) => {
    props.navigation.push("ItineraryStack", {
      screen: "itindetail",
      params: {
        itintitle: data.itinerary.name,
        country: data.itinerary.id,
        dateitin: "",
        token: token,
        status: "",
        index: 1,
        datadayaktif: data.day,
      },
    });
  };

  let [play, setPlay] = useState(null);
  let [muted, setMuted] = useState(true);
  const onViewRef = React.useRef(({ viewableItems, changed }) => {
    if (viewableItems) {
      setPlay(viewableItems[0].key);
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  const [datasFollow, setDatasFollow] = useState();

  const [LoadFollowing, { data: dataFollow, loading, error }] = useLazyQuery(
    FollowingQuery,
    {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      onCompleted: () => {
        setDatasFollow(dataFollow.user_following);
      },
    }
  );

  const [
    UnfollowMutation,
    { loading: loadUnfolMut, data: dataUnfolMut, error: errorUnfolMut },
  ] = useMutation(UnfollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _unfollow = async (id, status) => {
    setModalmenuother(false);

    if (token || token !== "") {
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadUnfolMut) {
          Alert.alert("Loading!!");
        }
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            LoadFollowing();
          } else {
            throw new Error(response.data.unfollow_user.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _follow = async (id, status) => {
    setModalmenuother(false);
    if (token || token !== "") {
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadFollowMut) {
          Alert.alert("Loading!!");
        }
        if (errorFollowMut) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            LoadFollowing();
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  return (
    <View>
      <Modal
        onBackdropPress={() => {
          setModalmenu(false);
        }}
        onRequestClose={() => setModalmenu(false)}
        // onDismiss={() => setModalmenu(false)}
        animationIn="fadeInDown"
        animationOut="fadeInDown"
        isVisible={modalmenu}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 80,
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() =>
              shareAction({ from: "feed", target: selectedOption.id })
            }
          >
            <Text size="description" type="regular" style={{}}>
              {t("shareTo")}...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenu(false),
                props.navigation.push("FeedStack", {
                  screen: "EditPost",
                  params: {
                    datapost: selectedOption,
                  },
                });
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("edit")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalhapus(true);
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#d75995" }}
            >
              {t("delete")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModalmenuother(false);
        }}
        onRequestClose={() => setModalmenuother(false)}
        onDismiss={() => setModalmenuother(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalmenuother}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 80,
            padding: 20,
          }}
        >
          {/* <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenuother(false);
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#d75995" }}
            >
              {t("reportThisPost")}
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenuother(false);
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("blockUser")}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {}}
          >
            <Text size="description" type="regular" style={{}}>
              {t("copyLink")}
            </Text>
          </TouchableOpacity>
          {datasFollow &&
          selectedOption &&
          selectedOption.user &&
          datasFollow.findIndex((k) => k["id"] == selectedOption?.user?.id) ==
            -1 ? (
            <TouchableOpacity
              style={{
                paddingVertical: 10,
              }}
              onPress={() => _follow(selectedOption.user.id)}
            >
              <Text size="description" type="regular" style={{}}>
                {t("follow")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                paddingVertical: 10,
              }}
              onPress={() => _unfollow(selectedOption.user.id)}
            >
              <Text size="description" type="regular" style={{}}>
                {t("unfollow")}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenuother(false);
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("hidePost")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModalhapus(false);
        }}
        onRequestClose={() => setModalhapus(false)}
        onDismiss={() => setModalhapus(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalhapus}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
          }}
        >
          <Text>{t("alertHapusPost")}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
              paddingHorizontal: 40,
            }}
          >
            <Button
              onPress={() => {
                _deletepost(selectedOption);
              }}
              color="primary"
              text={t("delete")}
            ></Button>
            <Button
              onPress={() => {
                setModalhapus(false);
              }}
              color="secondary"
              variant="bordered"
              text={t("cancel")}
            ></Button>
          </View>
        </View>
      </Modal>

      <FlatList
        ref={ref}
        data={feed_post_pageing}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: Dimensions.get("window").width - 20,
              backgroundColor: "#FFFFFF",
              // flex: 1,
              marginHorizontal: 10,
              marginVertical: 5,
              borderRadius: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#EEEEEE",
              paddingBottom: 25,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                marginVertical: 15,
                // justifyContent: 'space-evenly',
                alignContent: "center",
              }}
            >
              <CustomImage
                isTouchable
                onPress={() => {
                  item.user.id !== setting?.user?.id
                    ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: item.user.id,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "ProfileTab",
                        params: {
                          token: token,
                        },
                      });
                }}
                customStyle={{
                  height: 40,
                  width: 40,
                  borderRadius: 15,
                  alignSelf: "center",
                  marginLeft: 15,
                }}
                customImageStyle={{ resizeMode: "cover", borderRadius: 50 }}
                source={{ uri: item.user.picture }}
              />
              <View
                style={{
                  justifyContent: "center",
                  marginHorizontal: 10,
                }}
              >
                <Text
                  onPress={() => {
                    item.user.id !== setting?.user?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: item.user.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                          params: {
                            token: token,
                          },
                        });
                  }}
                  size="description"
                  style={{
                    fontFamily: "Lato-Bold",
                    // marginTop: 7,
                  }}
                >
                  {item.user.first_name}{" "}
                  {item.user.first_name ? item.user.last_name : null}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    size="small"
                    style={{
                      fontFamily: "Lato-Regular",
                      // marginTop: 7,
                    }}
                  >
                    {duration(item.created_at)}
                  </Text>
                  {item.location_name ? (
                    <View
                      style={{
                        marginHorizontal: 5,
                        backgroundColor: "black",
                        height: 4,
                        width: 4,
                        borderRadius: 2,
                      }}
                    ></View>
                  ) : null}
                  {item.location_name ? (
                    <Text
                      size="small"
                      style={{
                        fontFamily: "Lato-Regular",
                        // marginTop: 7,
                      }}
                    >
                      <Truncate text={item.location_name} length={40} />
                    </Text>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => OptionOpen(item)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: 2,
                  alignSelf: "center",
                }}
              >
                <More height={20} width={20} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginHorizontal: 10,
                alignContent: "center",
                justifyContent: "center",
                // alignItems: "center",
                width: Dimensions.get("window").width - 40,
                // height: Dimensions.get("window").width - 40,
                minHeight: Dimensions.get("window").width - 155,
                // borderWidth: 0.5,
                borderColor: "#EEEEEE",
                borderRadius: 15,
              }}
            >
              {item.is_single == false && item.itinerary !== null ? (
                <RenderAlbum data={item} props={props} />
              ) : (
                <RenderSinglePhoto
                  data={item}
                  props={props}
                  play={play}
                  muted={muted}
                  setMuted={(e) => setMuted(e)}
                  isFocused={isFocused}
                />
              )}
            </View>

            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                marginTop: 17,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "50%",
                    alignSelf: "flex-start",
                    alignContent: "space-between",
                    alignItems: "center",
                    // justifyContent: 'space-evenly',
                  }}
                >
                  {item.liked ? (
                    <Button
                      onPress={() => _unliked(item.id, index)}
                      type="icon"
                      // variant="transparent"
                      position="left"
                      size="small"
                      style={{
                        paddingHorizontal: 10,
                        marginRight: 15,
                        borderRadius: 16,
                        backgroundColor: "#F2DAE5",
                        // minidth: 70,
                        // right: 10,
                      }}
                    >
                      <LikeRed height={15} width={15} />
                      <Text
                        type="black"
                        size="label"
                        style={{ marginHorizontal: 5, color: "#BE3737" }}
                      >
                        {item.response_count}
                      </Text>
                    </Button>
                  ) : (
                    <Button
                      onPress={() => _liked(item.id, index)}
                      type="icon"
                      position="left"
                      size="small"
                      color="tertiary"
                      style={{
                        paddingHorizontal: 10,
                        marginRight: 15,
                        borderRadius: 16,
                        // right: 10,
                      }}
                    >
                      <LikeBlack height={15} width={15} />
                      <Text
                        type="black"
                        size="label"
                        style={{ marginHorizontal: 7 }}
                      >
                        {item.response_count}
                      </Text>
                    </Button>
                  )}

                  <Button
                    onPress={() => viewcomment(item)}
                    type="icon"
                    variant="transparent"
                    position="left"
                    size="small"
                    style={{
                      paddingHorizontal: 2,

                      // right: 10,
                    }}
                  >
                    <CommentBlack height={15} width={15} />
                    <Text
                      type="black"
                      size="label"
                      style={{ marginHorizontal: 7 }}
                    >
                      {item.comment_count}
                    </Text>
                  </Button>
                </View>

                <Button
                  onPress={() => shareAction({ from: "feed", target: item.id })}
                  type="icon"
                  variant="transparent"
                  position="left"
                  size="small"
                  style={{
                    right: 10,
                    paddingHorizontal: 2,
                  }}
                >
                  <ShareBlack height={17} width={17} />
                  {/* <Text size="small" style={{ marginLeft: 3 }}>
										{t("share")}
									</Text> */}
                </Button>
              </View>
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                }}
                More
              >
                {item.is_single == false && item.itinerary !== null ? (
                  <View>
                    <Pressable
                      onPress={() => goToItinerary(item)}
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#209fae",
                          height: 23,
                          width: 7,
                          borderRadius: 4,
                          marginRight: 10,
                          marginLeft: 2,
                        }}
                      />
                      <Text type="bold" size="title">
                        {item.itinerary.name}
                      </Text>
                    </Pressable>
                    {item.caption ? (
                      <ReadMore
                        numberOfLines={3}
                        renderTruncatedFooter={ReadMorehendle}
                        renderRevealedFooter={ReadLesshendle}
                        // onReady={this._handleTextReady}
                      >
                        <Text
                          size="label"
                          style={{
                            textAlign: "left",
                            lineHeight: 20,
                          }}
                        >
                          {item.caption}
                        </Text>
                      </ReadMore>
                    ) : null}
                  </View>
                ) : item.caption ? (
                  <ReadMore
                    numberOfLines={3}
                    renderTruncatedFooter={ReadMorehendle}
                    renderRevealedFooter={ReadLesshendle}
                    // onReady={this._handleTextReady}
                  >
                    <Text
                      size="label"
                      style={{
                        textAlign: "left",
                        lineHeight: 20,
                      }}
                    >
                      <Text
                        type="bold"
                        size="label"
                        style={{
                          marginRight: 5,
                        }}
                      >
                        {item.user.first_name}{" "}
                        {item.user.first_name ? item.user.last_name : null}{" "}
                      </Text>
                      {item.caption}
                    </Text>
                  </ReadMore>
                ) : null}
              </View>
            </View>
          </View>

          // <Item item={item} selected={selected} index={index} />
        )}
        style={{
          paddingVertical: 7,
        }}
        // initialNumToRender={7}
        keyExtractor={(item) => item.id}
        // extraData={liked}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
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
                marginBottom: 30,
              }}
            >
              <ActivityIndicator
                animating={loadingPost}
                size="large"
                color="#209fae"
              />
            </View>
          ) : null
        }
        // initialNumToRender={1}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
        onEndThreshold={3000}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  fab: {
    position: "absolute",
    bottom: 5,
    right: 10,
  },
});
