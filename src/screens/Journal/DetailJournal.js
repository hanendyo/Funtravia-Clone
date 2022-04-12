import { Thumbnail, View } from "native-base";
import {
  Dimensions,
  Image,
  FlatList,
  Alert,
  RefreshControl,
  Keyboard,
  StatusBar as StatsBar,
  Modal,
  Platform,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  Button,
  StatusBar,
  shareAction,
  CopyLink,
  ModalLogin,
  Truncate,
} from "../../component";
import { default_image, logo_funtravia } from "../../assets/png";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Arrowbackios,
  Arrowbackwhite,
  Backtotop,
  LikeEmpty,
  PanahBulat,
  Xgray,
} from "../../assets/svg";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import JournalById from "../../graphQL/Query/Journal/JournalById";
import JournalCommentList from "../../graphQL/Query/Journal/JournalCommentList";
import { useTranslation } from "react-i18next";
import AddCommentLike from "./AddCommentLike";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import DeviceInfo from "react-native-device-info";
const Notch = DeviceInfo.hasNotch();
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});
import { RNToasty } from "react-native-toasty";
import { useDispatch, useSelector } from "react-redux";
import { setSettingUser } from "../../redux/action";
import { Bg_soon } from "../../assets/png";
import { useScrollToTop } from "@react-navigation/native";

export default function DetailJournal(props) {
  let [soon, setSoon] = useState(false);
  let [modalShare, setModalShare] = useState(false);
  let [refY, setRefY] = useState(0);
  const tokenApps = useSelector((data) => data.token);
  const setting = useSelector((data) => data.setting);
  const dispatch = useDispatch();
  let [modalLogin, setModalLogin] = useState(false);
  let [dataPopuler] = useState(props.route.params.dataPopuler);
  let slider = useRef();
  const [keyboardOffset, setKeyboardOffset] = useState(0);
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

  let { width, height } = Dimensions.get("screen");
  let [y, setY] = useState(0);
  const { t } = useTranslation();
  // let title = () => (
  //   <View
  //     style={{
  //       flexDirection: "row",
  //       alignItems: "center",
  //       alignContent: "center",
  //       // justifyContent: "center",
  //       // borderWidth: 1,
  //       width: Dimensions.get("screen").width - 70,
  //     }}
  //   >
  //     {/* <Text>test</Text> */}
  //     <Button
  //       text={""}
  //       size="medium"
  //       type="circle"
  //       variant="transparent"
  //       onPress={() => props.navigation.goBack()}
  //       style={{
  //         height: 55,
  //       }}
  //     >
  //       {Platform.OS == "ios" ? (
  //         <Arrowbackios height={15} width={15}></Arrowbackios>
  //       ) : (
  //         <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
  //       )}
  //     </Button>
  //     <Text
  //       size="title"
  //       type="bold"
  //       numberOfLines={1}
  //       style={{ color: "#FFF", flex: 1 }}
  //     >
  //       {dataPopuler?.title ? dataPopuler?.title : dataPopuler?.name}
  //     </Text>
  //   </View>
  // );

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text
        size={Platform.OS == "ios" ? "title" : "header"}
        type="bold"
        style={{ color: "#fff" }}
      >
        {/* <Truncate
          text={dataPopuler?.title ? dataPopuler?.title : dataPopuler?.name}
          length={Platform.OS === "ios" ? 30 : 30}
        /> */}
        {dataPopuler?.title ?? dataPopuler?.name}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",

      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209FAE" : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : "left",
      paddingTop: Platform.OS == "ios" ? (Notch ? 10 : 11) : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
      left: Platform.OS == "ios" ? 0 : -10,
      paddingLeft:
        Platform.OS == "ios" ? (dataPopuler?.title.length > 50 ? 60 : 45) : 0,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
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

  const [fetchData, { data, loading }] = useLazyQuery(JournalById, {
    variables: { id: props.route.params.dataPopuler?.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
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
      id: dataPopuler?.id,
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
          id: dataPopuler?.id,
          limit: 20,
          offset: dataComment?.comment_journal_list.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

  const loadAsync = async () => {
    await fetchData();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // props.navigation.setOptions({ headerLeft: title });
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
    datetime = datetime.replace(" ", "T");
    var date1 = new Date(datetime).getTime();
    var datenow = new Date();
    var date2 = datenow.getTime();
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var weeks = Math.floor(days / 7);
    var month = Math.floor(days / 30);
    var yrs = Math.floor(days / 365);
    mins = mins % 60;
    hrs = hrs % 24;

    if (yrs > 0) {
      return yrs + " " + t("yearsAgo");
    } else if (month > 0) {
      return month + " " + t("monthAgo");
    } else if (weeks > 0) {
      return weeks + " " + t("weeekago");
    } else if (days > 0) {
      return days + " " + t("daysAgo");
    } else if (hrs > 0) {
      return hrs + " " + t("hoursAgo");
    } else if (mins > 0) {
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

  if (loading) {
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

  const scrolTop = () => {
    slider.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  const handleScroll = (e) => {
    setRefY(e.nativeEvent.contentOffset.y);
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        marginBottom:
          Platform.OS === "ios" && keyboardOffset < 300 && keyboardOffset > 0
            ? 260
            : keyboardOffset > 300
            ? 340
            : 0,
      }}
    >
      {refY > 200 ? (
        <Pressable
          onPress={() => scrolTop()}
          style={{
            position: "absolute",
            bottom: 80,
            right: 15,
            // backgroundColor: "#fff",
            zIndex: 1,
          }}
        >
          <Backtotop height="50" width="50" />
        </Pressable>
      ) : null}
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      <Modal
        useNativeDriver={true}
        visible={modalShare}
        onRequestClose={() => setModalShare(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalShare(false)}
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
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 4,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 100,
              // paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
                alignItems: "center",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                backgroundColor: "#f6f6f6",
                justifyContent: "center",
              }}
            >
              <Text size="title" type="bold" style={{ marginVertical: 15 }}>
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalShare(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 60,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <Pressable
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalShare(false);
                props.navigation.navigate("ChatStack", {
                  screen: "SendToChat",
                  params: {
                    dataSend: {
                      id: data?.journal_byid?.id,
                      name: data?.journal_byid?.title,
                      cover: data?.journal_byid?.firstimg,
                      description: data?.journal_byid?.firsttxt,
                    },
                    title: "Journal",
                    tag_type: "tag_journal",
                  },
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("Send")}...
              </Text>
            </Pressable>
            <Pressable
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                // height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalShare(false);
                shareAction({
                  from: "journal",
                  target: data?.journal_byid?.id,
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("shareTo")}...
              </Text>
            </Pressable>
            <Pressable
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalShare(false);
                CopyLink({
                  from: "journal",
                  target: data?.journal_byid?.id,
                  success: t("successCopyLink"),
                  failed: t("failedCopyLink"),
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("copyLink")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {data && data?.journal_byid ? (
        <ScrollView
          ref={slider}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => handleScroll(e)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
              marginVertical: 20,
              width: Dimensions.get("window").width - 40,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  tokenApps
                    ? data.journal_byid.userby
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
                      : RNToasty.Show({
                          title: `${t("createdBy")} funtravia`,
                          position: "bottom",
                        })
                    : setModalLogin(true);
                }}
              >
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                  }}
                  source={
                    data.journal_byid.userby
                      ? { uri: data.journal_byid.userby.picture }
                      : logo_funtravia
                  }
                />
              </TouchableOpacity>
              <View style={{ marginLeft: 15 }}>
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
                  <Text size="title" type="bold">
                    {data.journal_byid &&
                    data.journal_byid.userby &&
                    data.journal_byid.userby.first_name
                      ? data.journal_byid.userby.first_name
                      : "Funtravia"}
                  </Text>
                </Text>
                <Text
                  size={"description"}
                  type={"regular"}
                  style={{ color: "#209FAE", marginTop: 0 }}
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
              <TouchableOpacity
                onPress={() =>
                  tokenApps ? setSoon(true) : setModalLogin(true)
                }
              >
                <View
                  style={{
                    borderColor: "#209FAE",
                    borderWidth: 1,
                    borderRadius: 5,
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
          <Modal
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
                    width: Dimensions.get("screen").width - 300,
                  }}
                  type="box"
                  onPress={() => setSoon(false)}
                ></Button>
              </View>
            </View>
          </Modal>

          <View
            style={{
              marginHorizontal: 20,
              width: Dimensions.get("screen").width - 40,
            }}
          >
            <View style={{ marginBottom: 3 }}>
              <Text type={"bold"} style={{ lineHeight: 26, fontSize: 20 }}>
                {data.journal_byid ? data.journal_byid.title : "Title"}
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
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
                      <View style={{}}>
                        {item.title ? (
                          <View
                            style={{
                              marginBottom: 10,
                              width: Dimensions.get("window").width - 40,
                              marginHorizontal: 20,
                            }}
                          >
                            <Text
                              size={"title"}
                              type={"bold"}
                              style={{ textAlign: "left", lineHeight: 20 }}
                            >
                              {item.title ? item.title : null}
                            </Text>
                          </View>
                        ) : null}
                        {item.image ? (
                          <Image
                            source={item.image ? { uri: item.image } : null}
                            style={{
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").height * 0.3,
                              marginBottom: 5,
                            }}
                          />
                        ) : null}
                      </View>
                      {item.text ? (
                        <View
                          style={{
                            alignSelf: "center",
                            width: Dimensions.get("window").width - 40,
                            marginHorizontal: 20,
                            marginBottom: 10,
                          }}
                        >
                          <Text
                            size="description"
                            type="light"
                            style={{
                              textAlign: "left",
                              // marginTop: 5,
                              color: "#616161",
                            }}
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
                      {item?.title ? (
                        <View
                          style={{
                            width: Dimensions.get("screen").width - 40,
                            marginHorizontal: 20,
                            marginBottom: 5,
                          }}
                        >
                          <Text size="readable" type="bold">
                            {item?.title}
                          </Text>
                        </View>
                      ) : null}
                      {item.text ? (
                        <View
                          style={{
                            width: Dimensions.get("window").width - 40,
                            marginHorizontal: 20,
                            marginBottom: 10,
                          }}
                        >
                          <Text
                            size="readable"
                            type="regular"
                            style={{
                              textAlign: "left",
                              color: "#464646",
                            }}
                          >
                            {item.text ? item.text : null}
                          </Text>
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
              // marginTop: 20,
              marginHorizontal: 20,
              alignSelf: "auto",
              width: Dimensions.get("window").width * 0.9,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text size={"label"} type={"regular"}>
                {t("createdBy")}
              </Text>
              <Text
                size={"label"}
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
              marginTop: 20,
              marginHorizontal: 20,
              borderBottomColor: "#f6f6f6",
              borderBottomWidth: 1,
            }}
          />

          {/* ==================================== List Comment ============================================== */}

          <View
            style={{ marginHorizontal: 20, marginTop: 20 }}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setY(layout.y);
            }}
          >
            <View>
              <Text size={"label"} type={"bold"}>
                {t("comments")}
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
                    // marginTop: 20,
                    width: Dimensions.get("window").width * 0.9,
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderColor: "#f1f1f1",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: 10,
                      minHeight: Dimensions.get("window").width * 0.05,
                      // borderWidth: 1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        tokenApps
                          ? item && item.user && item.user.id !== null
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
                                    token: tokenApps,
                                  },
                                })
                            : RNToasty.Show({
                                title: t("somethingwrong"),
                                position: "bottom",
                              })
                          : setModalLogin(true);
                      }}
                    >
                      <Thumbnail
                        source={
                          item.user && item.user.picture
                            ? { uri: item.user.picture }
                            : default_image
                        }
                        style={{
                          height: 40,
                          width: 40,
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
                          size={"label"}
                          type={"bold"}
                          onPress={() => {
                            tokenApps
                              ? item && item.user && item.user.id !== null
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
                                : Alert.alert("User has been deleted")
                              : setModalLogin(true);
                          }}
                        >
                          {item && item.user && item.user.first_name
                            ? item.user.first_name
                            : "user_deleted"}
                        </Text>
                        {item && item.created_at ? (
                          <Text
                            size={"description"}
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
                          size={"label"}
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
                        tokenApps
                          ? props.navigation.navigate("JournalComment", {
                              dataJournalById: dataPopuler?.id,
                            })
                          : setModalLogin(true)
                      }
                      style={{
                        height: "100%",
                        flexDirection: "row",
                        width: "100%",
                        paddingVertical: 10,
                      }}
                    >
                      <Text size="label" type="bold">
                        {t("ViewAll")}
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
                width: Dimensions.get("window").width - 40,
                marginHorizontal: 20,
                alignItems: "center",
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              <Text>{`${t("NoComment")}`}</Text>
            </View>
          )}
        </ScrollView>
      ) : null}
      {/* ==================================== Add Comment, Like and Unlike ============================================== */}
      {data && data.journal_byid ? (
        <AddCommentLike
          data={data.journal_byid}
          fetchData={(e) => fetchData(e)}
          listComments={() => afterComment()}
          setting={setting}
          setModalShare={(e) => setModalShare(e)}
          props={props}
        />
      ) : null}
    </View>
  );
}
