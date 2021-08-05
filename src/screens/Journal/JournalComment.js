import { useQuery, useLazyQuery } from "@apollo/client";
import { Thumbnail } from "native-base";
import {
  View,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { dateFormatForNotif } from "../../component/src/dateformatter";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Arrowbackwhite } from "../../assets/svg";
import { Text, Button } from "../../component";
import JournalCommentList from "../../graphQL/Query/Journal/JournalCommentList";
import AddComment from "./AddComment";
import JournalById from "../../graphQL/Query/Journal/JournalById";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

export default function JournalComment(props) {
  const [dataById] = useState(props.route.params.dataJournalById);
  const [setting, setSetting] = useState("");
  const [token, setToken] = useState("");
  const { t } = useTranslation();
  let slider = useRef();
  let { width, height } = Dimensions.get("screen");
  let [y, setY] = useState(0);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  console.log("keyboardOffset", keyboardOffset);
  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();
  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      "keyboardWillShow",
      onKeyboardShow
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      "keyboardWillHide",
      onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: t("comments"),
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
    variables: { id: dataById },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    await fetchData();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const scroll_to = () => {
    wait(1000).then(() => {
      // slider.current.scrollTo({ y: y });
      scrollToEnd();
    });
  };

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
      id: dataById,
      limit: 100,
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
  if (dataComment && "datas" in dataComment.comment_journal_list) {
    listComment = dataComment.comment_journal_list.datas;
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
    if (!fetchMoreResult) return prev;
    const { page_info } = fetchMoreResult.comment_journal_list;
    const datas = [
      ...prev.comment_journal_list.datas,
      ...fetchMoreResult.comment_journal_list.datas,
    ];

    return Object.assign({}, prev, {
      listComment: {
        __typename: prev.comment_journal_list.__typename,
        page_info,
        datas,
      },
    });
  };

  const handleOnEndReached = () => {
    if (dataComment.comment_journal_list.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          id: dataById,
          limit: 20,
          offset: dataComment.comment_journal_list.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        marginBottom:
          Platform.OS === "ios" && keyboardOffset < 300 && keyboardOffset > 0
            ? 260
            : keyboardOffset > 300
            ? 340
            : 0,
      }}
    >
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
                    marginTop: 5,
                    alignSelf: "center",
                    width: Dimensions.get("window").width * 0.7,
                  }}
                >
                  <Text
                    size={"description"}
                    type={"regular"}
                    style={{ textAlign: "justify" }}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(listComment) => listComment.id}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
        ListFooterComponent={
          loadingComment ? (
            <View
              style={{
                width: width,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <ActivityIndicator color="#209FAE" animating />
            </View>
          ) : null
        }
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
      />
      {token !== null && token !== "null" ? (
        <AddComment
          data={data?.journal_byid}
          token={token}
          fetchData={(e) => fetchData(e)}
          listComments={() => afterComment()}
          setting={setting}
        />
      ) : null}
    </View>
  );
}
