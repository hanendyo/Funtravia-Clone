import { Thumbnail, View } from "native-base";
import {
  Dimensions,
  Image,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button } from "../../component";
import { default_image, logo_funtravia } from "../../assets/png";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Arrowbackwhite, LikeEmpty, PanahBulat } from "../../assets/svg";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Truncate, Loading } from "../../component";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import JournalById from "../../graphQL/Query/Journal/JournalById";
import JournalCommentList from "../../graphQL/Query/Journal/JournalCommentList";
import {
  dateFormatForNotif,
  dateFormat,
} from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import AddCommentLike from "./AddCommentLike";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function DetailJournal(props) {
  let [dataPopuler] = useState(props.route.params.dataPopuler);
  let [token, setToken] = useState(props.route.params.token);
  let [setting, setSetting] = useState();
  let slider = useRef();
  let { width, height } = Dimensions.get("screen");
  let [y, setY] = useState(0);
  const { t } = useTranslation();
  let title = (
    <Text size="label" type="regular" style={{ color: "#FFF" }}>
      {dataPopuler?.title}
    </Text>
  );

  const HeaderComponent = {
    headerShown: true,
    title: "Journal Detail",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Journal Detail",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
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
  };

  const [fetchData, { data, loading }] = useLazyQuery(JournalById, {
    variables: { id: dataPopuler.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const afterComment = async () => {
    await refetch();
    await scroll_to();
  };

  const {
    data: dataComment,
    loading: loadingComment,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(JournalCommentList, {
    variables: {
      id: dataPopuler.id,
      limit: 4,
      offset: 0,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  let listComment = [];
  if (dataComment && "datas" in dataComment?.comment_journal_list) {
    listComment = dataComment?.comment_journal_list.datas;
  }

  const [refreshing, setRefreshing] = useState(false);

  const Refresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (
      prev.journal_list.datas.length <
      fetchMoreResult.journal_list.page_info.offset
    ) {
      if (!fetchMoreResult) return prev;
      const { page_info } = fetchMoreResult?.comment_journal_list;
      const datas = [
        ...prev?.comment_journal_list.datas,
        ...fetchMoreResult?.comment_journal_list.datas,
      ];

      return Object.assign({}, prev, {
        listComment: {
          __typename: prev?.comment_journal_list.__typename,
          page_info,
          datas,
        },
      });
    }
  };

  const handleOnEndReached = () => {
    if (dataComment?.comment_journal_list.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          id: dataPopuler.id,
          limit: 20,
          offset: dataComment?.comment_journal_list.page_info.offset,
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
    await fetchData();
    // await fetchDataComment();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    props.navigation.setOptions({ headerTitle: title });
    loadAsync();
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const scroll_to = () => {
    wait(1000).then(() => {
      slider.current.scrollTo({ y: y });
    });
  };

  const duration = (datetime) => {
    var date1 = new Date(datetime).getTime();
    var datenow = new Date();
    var date2 = datenow.getTime();
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);
    mins = mins % 60;
    hrs = hrs % 24;
    if (days > 1) {
      return dateFormatForNotif(
        datetime.slice(0, 10),
        datenow.toISOString().slice(0, 10)
      );
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

  {
    /* ==================================== Render All ============================================== */
  }
  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, backgroundColor: "white" }}>
  //       <View
  //         style={{
  //           backgroundColor: "white",
  //           alignItems: "center",
  //           paddingVertical: 20,
  //         }}
  //       >
  //         <ActivityIndicator animating={true} color="#209FAE" />
  //       </View>
  //     </View>
  //   );
  // }

  let [loadings, setLoadings] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadings(false);
    }, 2000);
  }, []);
  if (loadings) {
    return (
      <SkeletonPlaceholder>
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 40, height: 40, borderRadius: 20 }}></View>
              <View
                style={{
                  marginLeft: 5,
                  height: 40,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 10,
                    borderRadius: 4,
                    width: Dimensions.get("screen").width * 0.4,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 5,
                    height: 10,
                    borderRadius: 4,
                    width: Dimensions.get("screen").width * 0.3,
                  }}
                ></View>
              </View>
            </View>
            <View
              style={{
                height: 20,
                width: Dimensions.get("screen").width * 0.2,
                borderRadius: 10,
              }}
            ></View>
          </View>
          <View style={{ marginTop: 60, height: 60 }}>
            <View
              style={{
                height: 20,
                width: Dimensions.get("screen").width * 0.8,
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                height: 20,
                width: Dimensions.get("screen").width * 0.7,
                borderRadius: 10,
                marginTop: 10,
              }}
            ></View>
            <View
              style={{
                height: 20,
                width: Dimensions.get("screen").width * 0.6,
                borderRadius: 10,
                marginTop: 10,
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  height: 10,
                  width: Dimensions.get("screen").width * 0.1,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: Dimensions.get("screen").width * 0.1,
                  borderRadius: 5,
                }}
              ></View>
            </View>
          </View>
          <View style={{ marginTop: 60, height: 200 }}></View>
          <View
            style={{
              marginTop: 120,
              height: 20,
              borderRadius: 10,
              // width: Dimensions.get("screen").width,
            }}
          ></View>
          <View
            style={{
              marginTop: 105,
              height: 20,
              borderRadius: 10,
              // width: Dimensions.get("screen").width,
            }}
          ></View>
        </View>
      </SkeletonPlaceholder>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {data && data.journal_byid ? (
        <ScrollView ref={slider} showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
              marginVertical: 10,
              width: Dimensions.get("window").width * 0.9,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  data.journal_byid.userby
                    ? data.journal_byid.userby.id !== setting?.user?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: data.journal_byid.userby.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                        })
                    : Alert.alert("Journal By Funtravia");
                }}
              >
                <Thumbnail
                  style={{
                    height: 40,
                    width: 40,
                  }}
                  source={
                    data.journal_byid.userby
                      ? { uri: data.journal_byid.userby.picture }
                      : logo_funtravia
                  }
                />
              </TouchableOpacity>
              <View style={{ marginLeft: 10 }}>
                <Text
                  size={"label"}
                  type={"bold"}
                  onPress={() => {
                    data.journal_byid.userby
                      ? data.journal_byid.userby.id !== setting?.user?.id
                        ? props.navigation.push("ProfileStack", {
                            screen: "otherprofile",
                            params: {
                              idUser: data.journal_byid.userby.id,
                            },
                          })
                        : props.navigation.push("ProfileStack", {
                            screen: "ProfileTab",
                          })
                      : Alert.alert("Journal By Funtravia");
                  }}
                >
                  <Truncate
                    text={
                      data.journal_byid &&
                      data.journal_byid.userby &&
                      data.journal_byid.userby.first_name
                        ? data.journal_byid.userby.first_name
                        : "Funtravia"
                    }
                    length={20}
                  />
                </Text>
                <Text
                  size={"small"}
                  type={"regular"}
                  style={{ color: "#209FAE", marginTop: -2 }}
                >
                  #
                  {data &&
                  data.journal_byid &&
                  data.journal_byid.categori &&
                  data.journal_byid.categori.name
                    ? data.journal_byid.categori.name
                        .toLowerCase()
                        .replace(/ /g, "")
                    : "funtravia"}
                </Text>
              </View>
            </View>
            {data.journal_byid &&
            data.journal_byid.userby &&
            data.journal_byid.userby.id ? (
              <TouchableOpacity>
                <View
                  style={{
                    borderColor: "#209FAE",
                    borderWidth: 1,
                    borderRadius: 14,
                  }}
                >
                  <Text
                    size={"description"}
                    type={"regular"}
                    style={{
                      paddingHorizontal: 25,
                      paddingVertical: 6,
                      color: "#209FAE",
                    }}
                  >
                    {`${t("follow")}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <View>
              <Text type={"bold"} style={{ lineHeight: 26, fontSize: 20 }}>
                {data.journal_byid ? data.journal_byid.title : "Title"}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                {data && data.journal_byid && data.journal_byid.created_at ? (
                  <Text size={"description"} type={"regular"}>
                    {duration(data.journal_byid.created_at)}
                  </Text>
                ) : null}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <LikeEmpty width={10} height={10} />
                  <Text
                    size={"description"}
                    type={"bold"}
                    style={{ marginLeft: 5 }}
                  >
                    {data.journal_byid &&
                    data.journal_byid.article_response_count > 1
                      ? data.journal_byid.article_response_count +
                        " " +
                        t("likeMany")
                      : data.journal_byid.article_response_count +
                        " " +
                        t("like")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ==================================== Article ============================================== */}

          {data.journal_byid && data.journal_byid.article ? (
            <>
              {data.journal_byid.article.map((item, index) => {
                if (item.type === "image") {
                  return (
                    <View key={index}>
                      <View style={{ marginTop: 30 }}>
                        {item.image ? (
                          <Image
                            source={item.image ? { uri: item.image } : null}
                            style={{
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").height * 0.3,
                            }}
                          />
                        ) : null}
                      </View>
                      {item.title ? (
                        <View
                          style={{
                            marginTop: 20,
                            alignSelf: "center",
                            width: Dimensions.get("window").width * 0.9,
                          }}
                        >
                          <Text
                            size={"title"}
                            type={"bold"}
                            style={{ textAlign: "justify", lineHeight: 20 }}
                          >
                            {item.title ? item.title : null}
                          </Text>
                        </View>
                      ) : null}
                      {item.text ? (
                        <View
                          style={{
                            marginTop: 5,
                            alignSelf: "center",
                            width: Dimensions.get("window").width * 0.9,
                          }}
                        >
                          <Text
                            size="readable"
                            type="regular"
                            style={{ textAlign: "left", lineHeight: 20 }}
                          >
                            {item.text ? item.text : null}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  );
                } else {
                  return (
                    <View key={index}>
                      {item.text ? (
                        <View
                          style={{
                            marginTop: 1,
                            alignSelf: "center",
                            width: Dimensions.get("window").width * 0.9,
                          }}
                        >
                          <View
                            style={{
                              marginTop: 5,
                              alignSelf: "center",
                              width: Dimensions.get("window").width * 0.9,
                            }}
                          >
                            <Text
                              size="readable"
                              type="regular"
                              style={{ textAlign: "left", lineHeight: 20 }}
                            >
                              {item.text ? item.text : null}
                            </Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  );
                }
              })}
            </>
          ) : null}

          {/* ==================================== End Article ============================================== */}

          {/* ==================================== Created By ============================================== */}

          <View
            style={{
              marginTop: 20,
              marginHorizontal: 20,
              alignSelf: "auto",
              width: Dimensions.get("window").width * 0.9,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text size={"small"} type={"regular"}>
                Created By
              </Text>
              <Text
                size={"small"}
                type={"bold"}
                style={{ marginLeft: 5 }}
                onPress={() => {
                  data.journal_byid.userby
                    ? data.journal_byid.userby.id !== setting?.user?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: data.journal_byid.userby.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                        })
                    : Alert.alert("Journal By Funtravia");
                }}
              >
                {data.journal_byid && data.journal_byid.userby
                  ? data.journal_byid.userby.first_name
                  : "Funtravia"}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text size={"small"} type={"bold"}>
                Copyright
              </Text>
              <Text size={"small"} type={"bold"} style={{ marginLeft: 5 }}>
                {data.journal_byid && data.journal_byid.date
                  ? data.journal_byid.date.substring(0, 4)
                  : null}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              borderBottomColor: "#f6f6f6",
              borderBottomWidth: 0.9,
            }}
          />

          {/* ==================================== List Comment ============================================== */}

          <View
            style={{ marginHorizontal: 20, marginTop: 10 }}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setY(layout.y);
            }}
          >
            <View>
              <Text size={"label"} type={"bold"}>
                Comments
              </Text>
            </View>
          </View>
          {listComment.length ? (
            <FlatList
              data={listComment}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 20,
                    marginVertical: 5,
                    width: Dimensions.get("window").width * 0.9,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: 2,
                      minHeight: Dimensions.get("window").width * 0.05,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        item && item.user && item.user.id !== null
                          ? item?.user?.id !== setting?.user?.id
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
                              })
                          : Alert.alert("User has been deleted");
                      }}
                    >
                      <Thumbnail
                        source={
                          item.user && item.user.picture
                            ? { uri: item.user.picture }
                            : default_image
                        }
                        style={{
                          height: 35,
                          width: 35,
                        }}
                      />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 15 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          size={"description"}
                          type={"bold"}
                          onPress={() => {
                            item && item.user && item.user.id !== null
                              ? item.user.id !== setting?.user?.id
                                ? props.navigation.push("ProfileStack", {
                                    screen: "otherprofile",
                                    params: {
                                      idUser: item.user.id,
                                    },
                                  })
                                : props.navigation.push("ProfileStack", {
                                    screen: "ProfileTab",
                                  })
                              : Alert.alert("User has been deleted");
                          }}
                        >
                          {item && item.user && item.user.first_name
                            ? item.user.first_name
                            : "user_deleted"}
                        </Text>
                        {item && item.created_at ? (
                          <Text
                            size={"small"}
                            type={"light"}
                            style={{ marginLeft: 10 }}
                          >
                            {duration(item.created_at)}
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={{
                          // marginTop: 5,
                          alignSelf: "center",
                          width: Dimensions.get("window").width * 0.7,
                        }}
                      >
                        <Text
                          size={"description"}
                          type={"regular"}
                          style={{ textAlign: "left" }}
                        >
                          {item?.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(listComment) => listComment.id}
              refreshing={refreshing}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => Refresh()}
                />
              }
              ListFooterComponent={
                dataComment?.comment_journal_list?.page_info.hasNextPage ===
                true ? (
                  <View
                    style={{
                      width: Dimensions.get("screen").width,
                      paddingHorizontal: 70,
                      alignItems: "flex-start",
                      marginVertical: 5,
                    }}
                  >
                    <Pressable
                      onPress={() =>
                        props.navigation.navigate("JournalComment", {
                          dataJournalById: dataPopuler.id,
                        })
                      }
                      style={{
                        height: "100%",
                        flexDirection: "row",
                        width: "100%",
                        paddingVertical: 10,
                      }}
                    >
                      <Text size="label" type="bold">
                        View all comments
                      </Text>
                      <PanahBulat
                        height={20}
                        width={20}
                        style={{ marginLeft: 10 }}
                      />
                    </Pressable>
                    {/* <Button
                      onPress={() =>
                        props.navigation.navigate("JournalComment", {
                          dataJournalById: dataPopuler.id,
                        })
                      }
                      text={"View all comments"}
                      // type="box"
                      size="medium"
                      variant="transparent"
                      // style={{ borderColor: "#000", borderWidth: 1 }}
                    ></Button> */}
                  </View>
                ) : null
              }
              // onEndReachedThreshold={1}
              // onEndReached={handleOnEndReached}
            />
          ) : (
            <View
              style={{
                width: Dimensions.get("window").width * 0.9,
                marginHorizontal: 20,
                alignItems: "center",
              }}
            >
              <Text>{`${t("NoComment")}`}</Text>
            </View>
          )}
        </ScrollView>
      ) : null}
      {/* ==================================== Add Comment, Like and Unlike ============================================== */}
      {data && data.journal_byid && token !== null && token !== "null" ? (
        <AddCommentLike
          data={data.journal_byid}
          token={token}
          fetchData={(e) => fetchData(e)}
          listComments={() => afterComment()}
          setting={setting}
        />
      ) : null}
    </View>
  );
}
