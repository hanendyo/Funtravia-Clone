import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  Platform,
  ActivityIndicator,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  Text,
  Button,
  FunImage,
  FunVideo,
  Capital,
  Loading,
} from "../../../component";
import { default_image } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import {
  AcceptNotif,
  AlbumGray,
  Albumgreen,
  CalendarBiru,
  DurationGreen,
  IdcardGreen,
  LocationaoutlineGreen,
  Mark,
  Memberblue,
  PinBiru,
  UsersgroupGreen,
  Xhitam,
} from "../../../assets/svg";
import AcceptInvitation from "../../../graphQL/Mutation/Notification/AcceptInvitation";
import RejectInvitation from "../../../graphQL/Mutation/Notification/RejectInvitation";
import IsRead from "../../../graphQL/Mutation/Notification/IsRead";
import FollowMut from "../../../graphQL/Mutation/Profile/FollowMut";
import { RNToasty } from "react-native-toasty";
import IsReadAll from "../../../graphQL/Mutation/Notification/IsReadAll";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import normalize from "react-native-normalize";
import DeviceInfo from "react-native-device-info";
const deviceId = DeviceInfo.getModel();
const Notch = DeviceInfo.hasNotch();
import NotificationCursorBased from "../../../graphQL/Query/Notification/ListNotifikasiCursorBased";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
// import { useLazyQuery } from "@apollo/client";

import { useSelector } from "react-redux";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";
import {
  dateFormatBetween,
  dateFormatMDY,
  dateFormats,
} from "../../../component/src/dateformatter";
import Ripple from "react-native-material-ripple";

export default function Invitation({
  navigation,
  token,
  readall,
  setreadall,
  setshowSideModal,
}) {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const tokenApps = useSelector((data) => data.token);
  let [datanotif, SetDataNotif] = useState([]);
  let [dataNotifFailed, setDataNotifFailed] = useState([]);
  let [itineraryId, setItineraryId] = useState(null);
  let [showside, setshowside] = useState(false);
  let [dataItinerary, setDataItinerary] = useState({});
  let [dataItem, setdataItem] = useState({});
  let [loading, setLoading] = useState(false);

  const {
    data: datasnotif,
    loading: loadingnotif,
    error: errornotif,
    refetch: refetchnotif,
    fetchMore,
  } = useQuery(NotificationCursorBased, {
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    variables: {
      first: 10,
      after: "",
    },
    // pollInterval: 100,
    notifyOnNetworkStatusChange: true,
    context: {
      headers: {
        "Content-Type": "application/json",
        // Authorization: token,
        Authorization: tokenApps,
      },
    },
    onCompleted: (datasnotif) => {
      SetDataNotif(datasnotif?.list_notification_cursor_based.edges);
      setDataNotifFailed(datasnotif?.list_notification_cursor_based.edges);
      let status = 0;
      for (var x of datasnotif?.list_notification_cursor_based.edges) {
        if (x.node.isread == false) {
          status = 1;
          break;
        }
      }
      if (status == 1) {
        setreadall(true);
      } else {
        setreadall(false);
      }
    },
  });

  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    refetchnotif();
    wait(1000).then(() => {
      setRefreshing(false);
      // refetchnotif();
    });
  }, []);

  const [mutationAllIsRead] = useMutation(IsReadAll, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const _readAll = async () => {
    try {
      setLoading(true);
      let response = await mutationAllIsRead();
      if (response.data.read_all_notif.code != 200) {
        await setLoading(false);
        throw new Error(response.data.read_all_notif.message);
      } else {
        // let tempDataNotif = [...datanotif];
        // let tempData = [];
        // for (var i in tempDataNotif) {
        //   let tempDataIndex = { ...tempDataNotif[i] };
        //   let tempDataNode = { ...tempDataIndex.node };
        //   tempDataNode.isread = true;
        //   tempDataIndex.node = tempDataNode;
        //   tempData.push(tempDataIndex);
        // }
        setreadall(false);
        // SetDataNotif(tempData);
        refetchnotif();
        setLoading(false);
      }
    } catch (error) {
      SetDataNotif(dataNotifFailed);
      setreadall(true);
      RNToasty.Show({
        title: "Something wrong",
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const [FollowMutation] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const _follow = async (id, notif_id) => {
    try {
      setLoading(true);
      let response = await FollowMutation({
        variables: {
          id: id,
        },
      });
      if (response.data.follow_user.code != 200) {
        await setLoading(false);
        throw new Error(response.data.follow_user.message);
      } else {
        // let tempDataNotif = [...datanotif];
        // let index = tempDataNotif.findIndex((k) => k.node["ids"] === notif_id);
        // let tempData = { ...tempDataNotif[index] };
        // let tempDataNode = { ...tempDataNotif[index].node };
        // let tempDataFollow = { ...tempDataNode.follow_user };
        // let tempDataUser = { ...tempDataFollow.user };
        // tempDataUser.status_following = true;
        // tempDataFollow.user = tempDataUser;
        // tempDataNode.follow_user = tempDataFollow;
        // tempDataNode.isread = true;
        // tempData.node = tempDataNode;
        // tempDataNotif.splice(index, 1, tempData);
        // SetDataNotif(tempDataNotif);
        refetchnotif();
        setLoading(false);
      }
    } catch (error) {
      let tempDataNotif = [...datanotif];
      let index = tempDataNotif.findIndex((k) => k.node["ids"] === notif_id);
      let tempData = { ...tempDataNotif[index] };
      let tempDataNode = { ...tempDataNotif[index].node };
      let tempDataFollow = { ...tempDataNode.follow_user };
      let tempDataUser = { ...tempDataFollow.user };
      tempDataUser.status_following = false;
      tempDataFollow.user = tempDataUser;
      tempDataNode.follow_user = tempDataFollow;
      tempDataNode.isread = true;
      tempData.node = tempDataNode;
      tempDataNotif.splice(index, 1, tempData);
      SetDataNotif(tempDataNotif);
      RNToasty.Show({
        title: t("failFollow") + tempDataUser.first_name,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const [mutationAcceptInvitation] = useMutation(AcceptInvitation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const [mutationRejectInvitation] = useMutation(RejectInvitation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const [mutationIsRead] = useMutation(IsRead, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const reject = async (data) => {
    try {
      setLoading(true);
      let response = await mutationRejectInvitation({
        variables: {
          buddy_id: data?.itinerary_buddy?.id,
        },
      });
      if (response.data.reject_buddy.code != 200) {
        await setLoading(false);
        throw new Error(response.data.reject_buddy.message);
      } else {
        if (data.isread == false) {
          updateisread(data.ids);
        }
        // updateisread(data.ids);
        // var dt = new Date();
        // let rejected_at = `${dt
        //   .getFullYear()
        //   .toString()
        //   .padStart(4, "0")}-${(dt.getMonth() + 1)
        //   .toString()
        //   .padStart(2, "0")}-${dt
        //   .getDate()
        //   .toString()
        //   .padStart(2, "0")} ${dt
        //   .getHours()
        //   .toString()
        //   .padStart(2, "0")}:${dt
        //   .getMinutes()
        //   .toString()
        //   .padStart(2, "0")}:${dt
        //   .getSeconds()
        //   .toString()
        //   .padStart(2, "0")}`;
        // let tempDataNotif = [...datanotif];
        // let index = tempDataNotif.findIndex((k) => k.node["ids"] == data.ids);
        // let tempDataIndex = { ...tempDataNotif[index] };
        // let tempDataNode = { ...tempDataIndex.node };
        // let tempDataBuddy = { ...tempDataNode.itinerary_buddy };
        // tempDataBuddy.isconfrim = true;
        // tempDataBuddy.rejected_at = rejected_at;
        // tempDataNode.itinerary_buddy = tempDataBuddy;
        // tempDataNode.isread = true;
        // tempDataIndex.node = tempDataNode;
        // tempDataNotif.splice(index, 1, tempDataIndex);
        // SetDataNotif(tempDataNotif);
        refetchnotif();
        setLoading(false);
      }
    } catch (error) {
      let tempDataNotif = [...datanotif];
      let index = tempDataNotif.findIndex((k) => k.node["ids"] == data.ids);
      let tempDataIndex = { ...tempDataNotif[index] };
      let tempDataNode = { ...tempDataIndex.node };
      let tempDataBuddy = { ...tempDataNode.itinerary_buddy };
      tempDataBuddy.isconfrim = false;
      tempDataBuddy.rejected_at = null;
      tempDataNode.itinerary_buddy = tempDataBuddy;
      tempDataNode.isread = true;
      tempDataIndex.node = tempDataNode;
      tempDataNotif.splice(index, 1, tempDataIndex);
      SetDataNotif(tempDataNotif);
      RNToasty.Show({
        title: t("failSomethingwrong"),
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const accept = async (data) => {
    try {
      setLoading(true);
      let response = await mutationAcceptInvitation({
        variables: {
          buddy_id: data?.itinerary_buddy?.id,
        },
      });

      if (response.data.confrim_buddy.code != 200) {
        await setLoading(false);
        throw new Error(response.data.confrim_buddy.message);
      } else {
        if (data.isread == false) {
          updateisread(data.ids);
        }
        // updateisread(data.ids);
        // var dt = new Date();
        // let accepted_at = `${dt
        //   .getFullYear()
        //   .toString()
        //   .padStart(4, "0")}-${(dt.getMonth() + 1)
        //   .toString()
        //   .padStart(2, "0")}-${dt
        //   .getDate()
        //   .toString()
        //   .padStart(2, "0")} ${dt
        //   .getHours()
        //   .toString()
        //   .padStart(2, "0")}:${dt
        //   .getMinutes()
        //   .toString()
        //   .padStart(2, "0")}:${dt
        //   .getSeconds()
        //   .toString()
        //   .padStart(2, "0")}`;
        // let tempDataNotif = [...datanotif];
        // let index = tempDataNotif.findIndex((k) => k.node["ids"] == data.ids);
        // let tempDataIndex = { ...tempDataNotif[index] };
        // let tempDataNode = { ...tempDataIndex.node };
        // let tempDataBuddy = { ...tempDataNode.itinerary_buddy };
        // tempDataBuddy.isconfrim = true;
        // tempDataBuddy.accepted_at = accepted_at;
        // tempDataNode.itinerary_buddy = tempDataBuddy;
        // tempDataNode.isread = true;
        // tempDataIndex.node = tempDataNode;
        // tempDataNotif.splice(index, 1, tempDataIndex);
        // SetDataNotif(tempDataNotif);
        refetchnotif();
        setLoading(false);
      }
    } catch (error) {
      let tempDataNotif = [...datanotif];
      let index = tempDataNotif.findIndex((k) => k.node["ids"] == data.ids);
      let tempDataIndex = { ...tempDataNotif[index] };
      let tempDataNode = { ...tempDataIndex.node };
      let tempDataBuddy = { ...tempDataNode.itinerary_buddy };
      tempDataBuddy.isconfrim = false;
      tempDataBuddy.accepted_at = null;
      tempDataNode.itinerary_buddy = tempDataBuddy;
      tempDataNode.isread = true;
      tempDataIndex.node = tempDataNode;
      tempDataNotif.splice(index, 1, tempDataIndex);
      SetDataNotif(tempDataNotif);
      RNToasty.Show({
        title: t("failSomethingwrong"),
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const updateisread = async (notif_id) => {
    try {
      setLoading(true);
      let response = await mutationIsRead({
        variables: {
          notif_id: notif_id,
        },
      });
      if (response.data.update_read.code != 200) {
        await setLoading(false);
        throw new Error(response.data.update_read.message);
      } else {
        await setLoading(false);
      }
    } catch (error) {
      RNToasty.Show({
        title: "Something wrong",
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handle_areaklik_comment = (data) => {
    if (data.isread == false) {
      updateisread(data.ids);
    }
    navigation.push("FeedStack", {
      screen: "CommentPost",
      params: {
        post_id: data.comment_feed.post_id,
        comment_id: data.comment_feed.id,
        countKoment: null,
        from: "notification",
      },
    });
  };

  const handle_areaklik_like = (data) => {
    navigation.navigate("FeedStack", {
      // screen: "CommentsById",
      screen: "CommentPost",
      params: {
        post_id: data.like_feed.post_id,
        from: "notification",
      },
    });
    if (data.isread == false) {
      updateisread(data.ids);
    }
  };
  const handle_areaklik_like_itinerary = (data) => {
    if (data.isread == false) {
      updateisread(data.ids);
    }
    if (data.like_itinerary.itinerary) {
      navigation.navigate("ItineraryStack", {
        screen: "itindetail",
        params: {
          itintitle: data.like_itinerary.itinerary.name,
          country: data.like_itinerary.itinerary.id,
          token: tokenApps,
          status: "favorite",
          index: 0,
          data_from: "setting",
        },
      });
    }

    // navigation.navigate("FeedStack", {
    //   // screen: "CommentsById",
    //   screen: "CommentPost",
    //   params: {
    //     post_id: data.like_feed.post_id,
    //     from: "notification",
    //   },
    // });
    // if (data.isread == false) {
    //   updateisread(data.ids);
    // }
  };

  const handle_areaklik_follow = (data) => {
    navigation.push("ProfileStack", {
      screen: "otherprofile",
      params: {
        idUser: data.follow_user.user.id,
      },
    });
    if (data.isread == false) {
      updateisread(data.ids);
    }
  };

  const handle_areaklik_buddy = (data) => {
    console.log("~ data", data);
    console.log("area klik");
    data?.itinerary_buddy
      ? data.itinerary_buddy.isconfrim == true &&
        data.itinerary_buddy.accepted_at != null
        ? navigation.navigate("ItineraryStack", {
            screen: "itindetail",
            params: {
              itintitle: "",
              country: data.itinerary_buddy.itinerary_id,
              dateitin: "",
              token: tokenApps,
              status: "saved",
            },
          })
        : data.itinerary_buddy.isconfrim == true &&
          data.itinerary_buddy.rejected_at != null
        ? RNToasty.Show({
            title: t("youReject"),
            position: "bottom",
          })
        : data.itinerary_buddy.isconfrim == false &&
          data.itinerary_buddy.rejected_at == null &&
          data.itinerary_buddy.accepted_at == null
        ? showModalTrip(data?.itinerary_buddy?.itinerary_id, data)
        : null
      : RNToasty.Show({
          title: t("youReject"),
          position: "bottom",
        });

    // RNToasty.Show({
    //     title: t("notRespondInvit"),
    //     position: "bottom",
    //   });
    if (data.isread == false) {
      updateisread(data.ids);
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [setting, setSetting] = useState(null);

  const loadAsync = async () => {
    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    loadAsync();
    let tempDataRead = [];
    let tempdata = [...datanotif];
    for (var i of tempdata) {
      tempDataRead.push(i.node.isread == false);
    }
    if (tempDataRead.length == 0) {
      setreadall(false);
    }
    const unsubscribe = navigation.addListener("blur", () => {
      refetchnotif();
    });
    return unsubscribe;
  }, [navigation]);

  const duration = (datetime) => {
    datetime = datetime.replace(" ", "T");
    var date1 = new Date(datetime).getTime();
    var date2 = moment().format();
    date2 = new Date(date2.slice(0, 19)).getTime();
    // var date2 = new Date().getTime();
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

  // const {
  //   data: datadetail,
  //   loading: loadingdetail,
  //   error: errordetail,
  //   refetch: refetchItinerary,
  // } = useQuery(ItineraryDetails, {
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token,
  //     },
  //   },
  //   variables: { id: itineraryId },
  //   onCompleted: (res) => {
  //     if (res) {
  //   setshowside(true);
  //     }
  //   },
  // });

  const [
    refetchItinerary,
    { data: datadetail, loading: loadingdetail, error: errordetail },
  ] = useLazyQuery(ItineraryDetails, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    variables: { id: itineraryId },
    onCompleted: (res) => {
      if (res) {
        setDataItinerary(res);
      }
    },
  });

  // set to show modal detail trip
  const showModalTrip = async (itinerary_id, item) => {
    await setItineraryId(itinerary_id);
    await refetchItinerary();
    await setshowside(true);
    await setdataItem(item);
    await setshowSideModal(true);
  };

  const dateFormatr = (date) => {
    var x = date?.split(" ");
    return date ? dateFormats(x[0]) : null;
  };

  const getDN = (start, end) => {
    var x = start;
    var y = end,
      start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          size="label"
          type={"bold"}
          style={
            {
              // color: "white",
            }
          }
        >
          {Difference_In_Days + 1} {t("days")}
          {", "}
        </Text>
        <Text
          size="label"
          type={"bold"}
          style={
            {
              // color: "white",
            }
          }
        >
          {Difference_In_Days} {t("nights")}
        </Text>
      </View>
    );
  };

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    const { pageInfo } = fetchMoreResult.list_notification_cursor_based;
    const edges = [
      ...prev.list_notification_cursor_based.edges,
      ...fetchMoreResult.list_notification_cursor_based.edges,
    ];
    const feedback = Object.assign({}, prev, {
      list_notification_cursor_based: {
        __typename: prev.list_notification_cursor_based.__typename,
        pageInfo,
        edges,
      },
    });

    return feedback;
  };
  const handleOnEndReached = () => {
    if (
      datasnotif?.list_notification_cursor_based.pageInfo.hasNextPage &&
      !loadingnotif
    ) {
      return fetchMore({
        variables: {
          first: 10,
          after: datasnotif?.list_notification_cursor_based.pageInfo.endCursor,
        },
        updateQuery: onUpdate,
      });
    }
  };

  const RenderTrans = ({ item }) => {
    if (item.notification_type == "itinerary_buddy") {
      return (
        <Pressable
          onPress={() => handle_areaklik_buddy(item)}
          style={{
            backgroundColor: item.isread == false ? "#EDF5F5" : "white",
            borderBottomWidth: 1,
            borderBottomColor: "#D1D1D1",
            width: Dimensions.get("screen").width,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // borderBottomWidth: 0,
              borderBottomColor: "#D1D1D1",
              width: Dimensions.get("screen").width,
              paddingHorizontal: normalize(20),
              paddingVertical: normalize(20),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
              }}
            >
              {/* Profil */}
              <Pressable
                style={{
                  alignContent: "flex-start",
                  marginLeft: Platform.select({
                    ios: Notch ? -3 : 5,
                    android: deviceId == "LYA-L29" ? -2 : 0,
                  }),
                }}
                onPress={() => {
                  navigation.push("ProfileStack", {
                    screen: "otherprofile",
                    params: {
                      idUser: item?.itinerary_buddy?.userinvite?.id,
                    },
                  });
                }}
              >
                <FunImage
                  style={{
                    height: 45,
                    width: 45,
                    alignSelf: "center",
                    borderRadius: 25,
                    resizeMode: "cover",
                  }}
                  source={
                    item &&
                    item.itinerary_buddy &&
                    item?.itinerary_buddy?.userinvite &&
                    item?.itinerary_buddy?.userinvite?.picture
                      ? {
                          uri: item?.itinerary_buddy?.userinvite?.picture,
                        }
                      : default_image
                  }
                />
              </Pressable>

              {/* End Profil */}

              <View
                style={{
                  flexDirection: "column",
                  paddingLeft: 10,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    type="bold"
                    size="label"
                    style={{
                      color: "#464646",
                      marginBottom: 2,
                    }}
                  >
                    {t("hi")} {setting?.user?.first_name}, {t("hiJoinTrip")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    type="regular"
                    size="description"
                    style={{
                      color: "#464646",
                      marginBottom: 2,
                      marginRight: 5,
                    }}
                  >
                    {item?.itinerary_buddy?.userinvite?.first_name}{" "}
                    {t("inviteToTrip")}
                  </Text>
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      // textAlign: "right",
                      color: "#6c6c6c",

                      // width: '30%',
                      // fontSize: 15,
                    }}
                  >
                    {duration(item.tgl_buat)}
                  </Text>
                </View>

                {item.itinerary_buddy &&
                item.itinerary_buddy.isconfrim == false &&
                item.itinerary_buddy.accepted_at == null &&
                item.itinerary_buddy.rejected_at == null ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingHorizontal: deviceId == "LYA-L29" ? 0 : 3,
                      paddingTop: 5,
                      marginBottom: 5,
                      width: "100%",
                      alignContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Button
                      onPress={() => accept(item)}
                      size="medium"
                      style={{
                        fontFamily: "Lato-Regular",
                        width: 100,
                        height: 30,
                      }}
                      color="primary"
                      text={t("accept")}
                    />
                    <Button
                      onPress={() => reject(item)}
                      style={{
                        width: 80,
                        height: 30,
                        // opacity: 100,
                      }}
                      size="medium"
                      color="secondary"
                      variant="transparent"
                      text={t("reject")}
                    />
                  </View>
                ) : item.itinerary_buddy &&
                  item.itinerary_buddy.isconfrim == true &&
                  item.itinerary_buddy.accepted_at != null &&
                  item.itinerary_buddy.rejected_at == null ? (
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <AcceptNotif width="20" height="20" />
                    <Text
                      size="description"
                      type="regular"
                      style={{
                        color: "#209FAE",
                        marginLeft: 5,
                      }}
                    >
                      {t("youAccept")}
                    </Text>
                  </View>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <Text
                      size="description"
                      type="regular"
                      style={{
                        color: "#D75995",
                      }}
                    >
                      {t("youReject")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {item.itinerary_buddy &&
            // item.itinerary_buddy.isconfrim == false &&
            item.itinerary_buddy.accepted_at == null &&
            item.itinerary_buddy.rejected_at == null ? (
              <View
                style={{
                  width: 60,
                }}
              >
                <Pressable
                  onPress={() => {
                    showModalTrip(item?.itinerary_buddy?.itinerary_id, item);
                  }}
                  style={{
                    width: "100%",
                    alignItems: "flex-end",
                    // borderWidth: 1,
                    height: 80,
                  }}
                >
                  <Text
                    size="description"
                    type="bold"
                    style={{
                      color: "#209FAE",
                    }}
                  >
                    {t("Detail")}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </Pressable>
      );
    } else if (item.notification_type == "comment_feed" && item.comment_feed) {
      return (
        <Pressable
          onPress={() => handle_areaklik_comment(item)}
          style={{
            backgroundColor: item.isread == false ? "#EDF5F5" : "white",
            borderBottomWidth: 0.5,
            borderBottomColor: "#D1D1D1",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: Dimensions.get("screen").width,
              paddingHorizontal: normalize(20),
              paddingTop: normalize(20),
              paddingBottom: normalize(8),
            }}
          >
            {/* profil */}
            <Pressable
              onPress={() => {
                item.comment_feed.user.id !== setting?.user?.id
                  ? navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: item.comment_feed.user.id,
                      },
                    })
                  : null;
              }}
              style={{
                marginLeft: Platform.select({
                  ios: Notch ? -3 : 5,
                  android: deviceId == "LYA-L29" ? -2 : 0,
                }),
              }}
            >
              <FunImage
                style={{
                  height: 45,
                  width: 45,
                  alignSelf: "center",

                  borderRadius: 25,
                  resizeMode: "cover",
                  borderRadius: 25,
                }}
                source={
                  item.comment_feed.user?.picture
                    ? {
                        uri: item.comment_feed.user?.picture,
                      }
                    : default_image
                }
              />
            </Pressable>

            {/* End profil */}

            <View
              style={{
                flexDirection: "column",
                flex: 1,
                paddingLeft: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  type="bold"
                  size="label"
                  style={{
                    color: "#464646",
                  }}
                >
                  {item.comment_feed.user?.first_name}{" "}
                  {item.comment_feed.user?.last_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",

                  flexWrap: "wrap",
                }}
              >
                <Text
                  type="regular"
                  size="description"
                  style={{
                    color: "#464646",
                    marginBottom: 7,
                    marginRight: 5,
                  }}
                >
                  {t("commentPost")}{" "}
                </Text>
                <Text
                  size="description"
                  type="regular"
                  style={{
                    // textAlign: "right",

                    color: "#6c6c6c",

                    // width: '30%',
                    // fontSize: 15,
                    marginBottom: 5,
                  }}
                >
                  {duration(item.tgl_buat)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignSelf: "flex-start",
                alignItems: "flex-end",
              }}
            >
              <View
                styles={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#F6F6F6",
                }}
              >
                {item.comment_feed &&
                item.comment_feed.post_asset &&
                item.comment_feed.post_asset.type == "video" ? (
                  <View>
                    <FunVideo
                      hideShutterView={true}
                      poster={item.comment_feed?.post_asset?.filepath.replace(
                        "output.m3u8",
                        "thumbnail.png"
                      )}
                      posterResizeMode={"cover"}
                      source={{
                        uri: item.comment_feed?.post_asset?.filepath,
                      }}
                      repeat={false}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 5,
                      }}
                      resizeMode={"cover"}
                      muted={true}
                      paused={true}
                    />
                  </View>
                ) : (
                  <View>
                    <FunImage
                      source={{
                        uri: item.comment_feed?.post_asset?.filepath,
                      }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 5,
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: Dimensions.get("screen").width,
              paddingBottom: 15,
            }}
          >
            <View
              style={{
                width: 70,
              }}
            ></View>
            <View
              style={{
                backgroundColor: item.isread == false ? "#FFFFFF" : "#F6F6F6",
                padding: 10,
                borderRadius: 5,
                flex: 1,
                marginRight: 20,
              }}
            >
              <Text
                type="regular"
                size="label"
                numberOfLines={2}
                style={
                  {
                    // color: '#209fae',
                  }
                }
              >
                "{item.comment_feed.text}"
              </Text>
            </View>
          </View>
        </Pressable>
      );
    } else if (item.notification_type == "like_feed" && item.like_feed) {
      return (
        <Pressable
          onPress={() => handle_areaklik_like(item)}
          style={{
            backgroundColor: item.isread == false ? "#EDF5F5" : "white",
            width: Dimensions.get("screen").width,
            borderBottomWidth: 0.5,
            borderBottomColor: "#D1D1D1",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: Dimensions.get("screen").width,
              paddingVertical: normalize(20),
              paddingHorizontal: normalize(20),
            }}
          >
            {/* Profil */}
            <Pressable
              onPress={() => {
                item?.like_feed?.user?.id !== setting?.user?.id
                  ? navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: item?.like_feed?.user?.id,
                      },
                    })
                  : null;
              }}
              style={{
                alignContent: "flex-start",
                marginLeft: Platform.select({
                  ios: Notch ? -3 : 5,
                  android: deviceId == "LYA-L29" ? -2 : 0,
                }),
              }}
            >
              <FunImage
                style={{
                  height: 45,
                  width: 45,
                  alignSelf: "center",
                  borderRadius: 25,
                  resizeMode: "cover",
                  borderRadius: 25,
                }}
                source={
                  item.like_feed.user?.picture
                    ? { uri: item.like_feed.user?.picture }
                    : default_image
                }
              />
            </Pressable>
            {/*End Profil */}

            <View
              style={{
                flexDirection: "column",
                // width: "65%",
                paddingLeft: 10,
                flex: 1,
              }}
            >
              {/* <Adduser width={20} height={20} /> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // borderWidth: 1,
                }}
              >
                <Text
                  type="bold"
                  size="label"
                  style={{
                    // fontFamily: "Lato-Bold",
                    color: "#464646",
                    width: "70%",
                    // fontSize: 15,
                  }}
                >
                  {item.like_feed.user?.first_name}{" "}
                  {item.like_feed.user?.last_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",

                  // alignItems: "center",
                }}
              >
                <Text
                  type="regular"
                  size="description"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 15,
                    // width: '100%',
                    color: "#464646",
                    marginBottom: 7,
                    marginRight: 10,
                  }}
                >
                  {t("likeYourPost")}
                </Text>
                <Text
                  size="description"
                  style={{
                    // textAlign: "right",
                    color: "#6c6c6c",
                    // width: '30%',
                    // fontSize: 15,
                    marginBottom: 5,
                  }}
                >
                  {duration(item.tgl_buat)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignSelf: "flex-start",
                // justifyContent: "flex-end",
                alignItems: "flex-end",
                marginLeft: 10,
                // width: "20%",
              }}
            >
              {/* <View
                styles={{
                  width: 50,
                  height: 50,
                  borderWidth: 2,
                  borderColor: "#F6F6F6",
                  backgroundColor: "#F6F6F6",
                }}
              > */}
              {item.like_feed?.post_asset?.type == "video" ? (
                <FunVideo
                  hideShutterView={true}
                  poster={item.like_feed?.post_asset?.filepath.replace(
                    "output.m3u8",
                    "thumbnail.png"
                  )}
                  posterResizeMode={"cover"}
                  source={{
                    uri: item.like_feed?.post_asset?.filepath,
                  }}
                  repeat={false}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 5,
                  }}
                  resizeMode={"cover"}
                  muted={true}
                  paused={true}
                />
              ) : (
                <FunImage
                  source={{
                    uri: item.like_feed?.post_asset?.filepath,
                  }}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 5,
                  }}
                />
              )}
              {/* </View> */}
            </View>
          </View>
        </Pressable>
      );
    } else if (item.notification_type == "follow_user" && item.follow_user) {
      return (
        <Pressable
          onPress={() => handle_areaklik_follow(item)}
          style={{
            backgroundColor: item?.isread == false ? "#EDF5F5" : "white",
            borderBottomWidth: 0.5,
            borderBottomColor: "#D1D1D1",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 0.5,
              borderBottomColor: "#D1D1D1",
              width: Dimensions.get("screen").width,
              paddingVertical: normalize(20),
              paddingHorizontal: normalize(20),
            }}
          >
            {/* profile */}
            <View
              style={{
                alignContent: "flex-start",
                marginLeft: Platform.select({
                  ios: Notch ? -3 : 5,
                  android: deviceId == "LYA-L29" ? -2 : 0,
                }),
              }}
            >
              <FunImage
                style={{
                  height: 45,
                  width: 45,
                  alignSelf: "center",

                  borderRadius: 25,
                  resizeMode: "cover",
                  borderRadius: 25,
                }}
                source={
                  item.follow_user.user?.picture
                    ? {
                        uri: item.follow_user.user?.picture,
                      }
                    : default_image
                }
              />
            </View>
            {/* End profile */}

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                paddingLeft: 10,
              }}
            >
              {/* <Adduser width={15} height={15} /> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // borderWidth: 1,
                }}
              >
                <Text
                  type="bold"
                  size="label"
                  style={{
                    // fontFamily: "Lato-Bold",
                    color: "#464646",
                    // width: '100%',
                    // fontSize: 15,
                  }}
                >
                  {item.follow_user.user?.first_name}{" "}
                  {item.follow_user.user?.last_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#ffffff",
                  flexWrap: "wrap",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    // alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    type="regular"
                    size="description"
                    style={{
                      color: "#464646",
                      marginBottom: 7,
                      marginRight: 10,
                    }}
                  >
                    {t("startedFollowingYou")}
                  </Text>
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#6c6c6c",
                      marginBottom: 5,
                    }}
                  >
                    {duration(item.tgl_buat)}
                  </Text>
                </View>

                {item?.follow_user.user?.status_following == false ? (
                  <Pressable
                    onPress={() => _follow(item.follow_user.user.id, item.ids)}
                    style={{
                      paddingVertical: 5,
                    }}
                  >
                    <Text
                      type="regular"
                      size="description"
                      style={{
                        color: "#209fae",
                      }}
                    >
                      {t("followBack")}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        </Pressable>
      );
    } else if (
      item.notification_type == "like_itinerary" &&
      item.like_itinerary
    ) {
      return (
        <Pressable
          onPress={() => handle_areaklik_like_itinerary(item)}
          style={{
            backgroundColor: item?.isread == false ? "#EDF5F5" : "white",
            borderBottomWidth: 1,
            borderBottomColor: "#D1D1D1",
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingVertical: normalize(20),
              paddingHorizontal: normalize(20),
              flexDirection: "row",
            }}
          >
            {/* Profil */}
            <Pressable
              onPress={() => {
                item?.like_itinerary?.user_like?.id !== setting?.user?.id
                  ? navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: item?.like_itinerary?.user_like?.id,
                      },
                    })
                  : null;
              }}
              style={{
                marginLeft: Platform.select({
                  ios: Notch ? -3 : 5,
                  android: deviceId == "LYA-L29" ? -2 : 0,
                }),
              }}
            >
              <FunImage
                style={{
                  height: 45,
                  width: 45,
                  alignSelf: "center",
                  borderRadius: 25,
                  resizeMode: "cover",
                }}
                source={
                  item.like_itinerary.user_like?.picture
                    ? { uri: item.like_itinerary.user_like?.picture }
                    : default_image
                }
              />
            </Pressable>
            {/* End Profil */}

            <Pressable
              style={{
                flex: 1,
                marginLeft: 10,
              }}
              onPress={() => handle_areaklik_like_itinerary(item)}
            >
              <Text size="label" type="bold" numberOfLines={2}>
                {`${item.like_itinerary.user_like?.first_name} ${
                  item.like_itinerary.user_like?.last_name != null
                    ? item.like_itinerary.user_like?.last_name
                    : ""
                }`}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                <Text size="description" type="regular">
                  {t("likeYourItinerary")}
                </Text>

                {item.like_itinerary.itinerary ? (
                  <Text type="bold" size="description">
                    {` "${item?.like_itinerary?.itinerary?.name}" `}
                  </Text>
                ) : null}

                <Text
                  type="regular"
                  size="description"
                  style={{ color: "#6C6C6C" }}
                >
                  {`${duration(item?.tgl_buat)}`}
                </Text>

                {!item.like_itinerary.itinerary && (
                  <View
                    style={{
                      backgroundColor:
                        item.isread == false ? "#FFFFFF" : "#F6F6F6",
                      padding: 10,
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 15,
                    }}
                  >
                    <Mark width={17} height={17} />
                    <Text
                      style={{
                        marginLeft: 5,
                      }}
                    >
                      {t("thisTripHasBeenDeleted")}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </View>
        </Pressable>
      );
    }
    return null;
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#f6f6f6",
      }}
    >
      <Loading show={loading} />
      {/* modal detail trip */}
      <Modal
        animationType="slide"
        onBackdropPress={() => {
          setshowside(false), setshowSideModal(false);
        }}
        onRequestClose={() => {
          setshowside(false), setshowSideModal(false);
        }}
        onDismiss={() => {
          setshowside(false), setshowSideModal(false);
        }}
        visible={showside}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
        transparent={true}
      >
        <View
          style={{
            flexDirection: "column",
            marginTop: "auto",
            // height:
            //   Platform.OS === "ios"
            //     ? Notch
            //       ? Dimensions.get("screen").height * 0.7
            //       : Dimensions.get("screen").height * 0.55
            //     : Dimensions.get("screen").height * 0.45,
            width: Dimensions.get("screen").width,
            backgroundColor: "white",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          {/* title */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: Dimensions.get("screen").width - 16,

              paddingHorizontal: 30,
              paddingVertical: 20,
            }}
          >
            <Text
              type="bold"
              size="title"
              style={{
                color: "#464646",
              }}
            >
              {t("hi")} {setting?.user?.first_name}, {t("hiJoinTrip")}
            </Text>
            <TouchableOpacity
              style={{
                position: "absolute",
                backgroundColor: "with",
                height: 35,
                width: 32,
                top: 0,
                right: 0,
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-start",
              }}
              onPress={() => {
                setshowside(false), setshowSideModal(false);
              }}
            >
              <Xhitam height={15} width={15} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width - 40,
              height: 1,
              borderWidth: 0.5,
              borderColor: "#d1d1d1",
              marginHorizontal: 20,
            }}
          />
          {/* title */}
          {/* isi */}
          <View
            style={{
              paddingHorizontal: 30,
              width: "100%",
            }}
          >
            {/* judul trip */}
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                paddingVertical: 10,
                borderBottomColor: "#d1d1d1",
              }}
            >
              <View
                style={{
                  marginRight: 15,
                }}
              >
                <IdcardGreen width={30} height={30} />
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-start",
                }}
              >
                <Text type="regular" size="label" style={{ marginBottom: 5 }}>
                  {t("title") + " " + t("trip")}
                </Text>
                <Text type="bold" size="label">
                  {dataItinerary?.itinerary_detail?.name}
                </Text>
              </View>
            </View>

            {/* kota destinasi */}
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                paddingVertical: 10,
                borderBottomColor: "#d1d1d1",
              }}
            >
              <View
                style={{
                  marginRight: 15,
                }}
              >
                <LocationaoutlineGreen width={30} height={30} />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text type="regular" size="label">
                  {t("City") + " " + t("destination")}
                </Text>
                <Text type="bold" size="label">
                  {dataItinerary?.itinerary_detail?.city?.name}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                paddingVertical: 10,
                borderBottomColor: "#d1d1d1",
              }}
            >
              <View
                style={{
                  marginRight: 15,
                }}
              >
                <CalendarBiru width={30} height={30} />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text type="regular" size="label">
                  {t("date")}
                </Text>
                <Text type="bold" size="label">
                  {dateFormatr(dataItinerary?.itinerary_detail?.start_date) +
                    "  -  " +
                    dateFormatr(dataItinerary?.itinerary_detail?.end_date)}
                </Text>
              </View>
            </View>

            {/* Duration */}
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                paddingVertical: 10,
                borderBottomColor: "#d1d1d1",
              }}
            >
              <View
                style={{
                  marginRight: 15,
                }}
              >
                <DurationGreen width={30} height={30} />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text type="regular" size="label">
                  {t("duration")}
                </Text>
                <Text type="bold" size="label">
                  {dataItinerary?.itinerary_detail?.start_date
                    ? getDN(
                        dataItinerary?.itinerary_detail?.start_date,
                        dataItinerary?.itinerary_detail?.end_date
                      )
                    : null}
                </Text>
              </View>
            </View>

            {/* Travel Buddy */}
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  marginRight: 15,
                }}
              >
                <UsersgroupGreen width={30} height={30} />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text type="regular" size="label">
                  {t("travelBuddy")}
                </Text>
                <View
                  style={{
                    paddingVertical: 5,
                  }}
                >
                  <FlatList
                    scrollEnabled={false}
                    data={dataItinerary?.itinerary_detail?.buddy}
                    numColumns={2}
                    renderItem={({ item, index }) =>
                      index <= 3 ? (
                        <View
                          style={{
                            marginVertical: 5,
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 5,
                          }}
                        >
                          <Image
                            source={
                              item?.user?.picture
                                ? { uri: item?.user?.picture }
                                : default_image
                            }
                            style={{
                              height: 30,
                              width: 30,
                              borderRadius: 15,
                            }}
                          />
                          <Text
                            size="label"
                            type="bold"
                            style={{ marginLeft: 5, flex: 1 }}
                            numberOfLines={1}
                          >
                            {item?.user?.first_name
                              ? Capital({ text: item?.user?.first_name })
                              : "User Funtravia"}
                          </Text>
                        </View>
                      ) : null
                    }
                    keyExtractor={(d) => "buddy" + d?.id}
                    ListFooterComponent={
                      dataItinerary?.itinerary_detail?.buddy.length >= 5 ? (
                        <View
                          style={{
                            width: "100%",
                            alignItems: "flex-start",
                            marginVertical: 10,
                          }}
                        >
                          <Text size="label" type="bold">
                            {`${"+"} ${dataItinerary?.itinerary_detail?.buddy
                              .length - 4} ${t("more")}`}
                          </Text>
                        </View>
                      ) : null
                    }
                  />
                </View>
              </View>
            </View>
          </View>
          {/* button */}
          {dataItem.itinerary_buddy &&
          dataItem.itinerary_buddy.isconfrim == false &&
          dataItem.itinerary_buddy.accepted_at == null &&
          dataItem.itinerary_buddy.rejected_at == null ? (
            <View
              style={{
                paddingTop: 12,
                paddingBottom: Platform.select({
                  ios: Notch ? 25 : 12,
                  android: 12,
                }),
                backgroundColor: "#FFFFFF",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                shadowColor: "#6F7273",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3,
                borderTopWidth: 1,
                borderTopColor: "#f6f6f6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingHorizontal: deviceId == "LYA-L29" ? 0 : 3,
                  paddingTop: 5,

                  marginBottom: 5,
                  width: "100%",
                  alignContent: "center",
                  justifyContent: "space-evenly",
                  borderRadius: 5,
                }}
              >
                <Button
                  onPress={() => {
                    reject(dataItem),
                      setshowside(false),
                      setshowSideModal(false);
                  }}
                  style={{
                    width: Dimensions.get("screen").width / 2.5,
                    height: 40,
                    // opacity: 100,
                  }}
                  size="medium"
                  color="secondary"
                  variant="transparent"
                  text={t("reject")}
                />
                <Button
                  onPress={() => {
                    accept(dataItem),
                      setshowside(false),
                      setshowSideModal(false);
                  }}
                  size="medium"
                  style={{
                    fontFamily: "Lato-Regular",
                    width: Dimensions.get("screen").width / 2.5,
                    height: 40,
                  }}
                  color="primary"
                  text={t("accept")}
                />
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
      {/* end modal detail trip */}
      {datanotif && datanotif.length > 0 ? (
        <FlatList
          contentContainerStyle={{
            justifyContent: "space-evenly",
            // flex: 1,
          }}
          horizontal={false}
          data={datanotif}
          renderItem={({ item }) => <RenderTrans item={item.node} />}
          keyExtractor={(item) => item.cursor}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => Refresh()}
            />
          }
          initialNumToRender={20}
          onEndReachedThreshold={1}
          onEndReached={handleOnEndReached}
          ListFooterComponent={
            loadingnotif ? (
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                  marginTop: 20,
                }}
              >
                <ActivityIndicator size="small" color="#209fae" />
              </View>
            ) : null
          }
        />
      ) : (
        <View />
      )}
      <View
        style={{
          paddingTop: 12,
          paddingBottom: Platform.select({
            ios: Notch ? 25 : 12,
            android: 12,
          }),
          paddingHorizontal: 34,
          backgroundColor: "#FFFFFF",
          shadowColor: "#6F7273",

          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          borderTopWidth: 1,
          borderTopColor: "#f6f6f6",
        }}
      >
        {readall ? (
          <Button
            onPress={() => _readAll()}
            text={t("readAll")}
            size="large"
            type="box"
            variant="transparent"
            style={{
              borderWidth: 1,
              borderColor: "#209FAE",
              backgroundColor: "#daf0f2",
            }}
          />
        ) : (
          <Button
            text={<Text style={{ color: "#c7c7c7" }}>{t("readAll")}</Text>}
            size="large"
            type="box"
            variant="transparent"
            style={{
              backgroundColor: "#f6f6f6",
            }}
          />
        )}
      </View>
    </View>
  );
}
