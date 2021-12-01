import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Text, Button, Loading, FunImage } from "../../../component";
import { default_image } from "../../../assets/png";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  dateFormatForNotif,
  dateFormats,
} from "../../../component/src/dateformatter";
import { Star, Play, AcceptNotif } from "../../../assets/svg";
import AcceptInvitation from "../../../graphQL/Mutation/Notification/AcceptInvitation";
import RejectInvitation from "../../../graphQL/Mutation/Notification/RejectInvitation";
import IsRead from "../../../graphQL/Mutation/Notification/IsRead";
import FollowMut from "../../../graphQL/Mutation/Profile/FollowMut";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RNToasty } from "react-native-toasty";
import IsReadAll from "../../../graphQL/Mutation/Notification/IsReadAll";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkblok } from "../../../assets/svg";
import moment from "moment";
import normalize from "react-native-normalize";
import DeviceInfo from "react-native-device-info";
const deviceId = DeviceInfo.getModel();
const Notch = DeviceInfo.hasNotch();

const InvitationNotif = gql`
  query {
    list_notivication_invite {
      id
      user_id
      isadmin
      isconfrim
      userinvite {
        id
        username
        first_name
        last_name
        picture
      }
      myuser {
        id
        username
        first_name
        last_name
        picture
      }
      accepted_at
      rejected_at
      itinerary_id
    }
  }
`;

const ListNotifikasi_ = gql`
  query {
    list_notification {
      ids
      notification_type
      isread
      itinerary_buddy {
        id
        itinerary_id
        user_id
        isadmin
        isconfrim
        myuser {
          id
          username
          first_name
          last_name
          picture
        }
        userinvite {
          id
          username
          first_name
          last_name
          picture
        }
        accepted_at
        rejected_at
      }
      comment_feed {
        id
        post_id
        text
        user {
          id
          username
          first_name
          last_name
          picture
        }
        post {
          assets {
            filepath
          }
        }
        post_asset {
          id
          type
          filepath
        }
        created_at
        updated_at
      }
      like_feed {
        id
        post_id
        response
        user {
          id
          username
          first_name
          last_name
          picture
        }
        post_asset {
          type
          filepath
        }
      }

      follow_user {
        user_req
        user_follow
        status
        user {
          id
          username
          first_name
          last_name
          picture
          status_following
          status_follower
        }
      }
      tgl_buat
      created_at
      updated_at
    }
  }
`;

const DataInformasi = [
  {
    id: 1,
    title: "Tiket #1098987",
    value: "Bantu saya dalam hal - Transaksi saya yang gagal",
    status: "SELESAI",
    icon: Star,
    image: null,
  },
  {
    id: 2,
    title: "Tiket #1098987",
    value: "Bantu saya dalam hal - Transaksi saya yang gagal",
    status: "SELESAI",
    icon: Star,
    image: null,
  },
];

export default function Invitation({ navigation, token }) {
  let videoView = useRef(null);
  const { t, i18n } = useTranslation();
  let [datanotif, SetDataNotif] = useState([]);
  let [selected] = useState(new Map());
  let [dataTrans, setTrans] = useState(DataInformasi);
  let [loadings, setLoadings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  let [readall, setreadall] = useState(true);

  const CarDetail = (data, dataIten) => {
    navigation.navigate("CarDetail", {
      datacar: data,
      data_iten: dataIten,
    });
  };

  const [
    mutationAllIsRead,
    { loading: loadingisallread, data: dataisallread, error: errorisallread },
  ] = useMutation(IsReadAll, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _readAll = async () => {
    if (readall) {
      try {
        setreadall(false);
        let response = await mutationAllIsRead();

        if (response.data) {
          if (response.data.read_all_notif.code == 200) {
            GetListInvitation();
            RNToasty.Show({
              title: t("successMarkAllNotification"),
              position: "bottom",
            });
            setreadall(false);
          } else {
            throw new Error(response?.data?.read_all_notif?.message);
          }
        }
      } catch (error) {
        setreadall(true);
        RNToasty.Show({
          title: "Something wrong",
          position: "bottom",
        });
      }
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

  const _follow = async (data, id, notif_id) => {
    if (token) {
      var tempData = [...datanotif];
      var index = tempData.findIndex((k) => k["ids"] === notif_id);
      var _tempData = { ...tempData[index] };
      var _tempFollow = { ..._tempData.follow_user };
      var _tempUser = { ..._tempFollow.user };
      _tempUser.status_following = true;
      _tempFollow.user = _tempUser;
      _tempData.follow_user = _tempFollow;
      _tempData.isread = true;
      tempData.splice(index, 1, _tempData);
      SetDataNotif(tempData);
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (errorFollowMut) {
          throw new Error("Error Input");
        }
      } catch (error) {
        var tempData = [...datanotif];
        var index = tempData.findIndex((k) => k["ids"] === notif_id);
        var _tempData = { ...tempData[index] };
        var _tempFollow = { ..._tempData.follow_user };
        var _tempUser = { ..._tempFollow.user };
        _tempUser.status_following = false;
        _tempFollow.user = _tempUser;
        _tempData.follow_user = _tempFollow;
        tempData.splice(index, 1, _tempData);
        SetDataNotif(tempData);
        RNToasty.Show({
          title: "Something wrong",
          position: "bottom",
        });
      }
    } else {
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
    }
  };

  const [
    mutationAcceptInvitation,
    { loading: loadingInvit, data: dataInvit, error: errorInvit },
  ] = useMutation(AcceptInvitation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationRejectInvitation,
    { loading: loadingReject, data: dataReject, error: errorReject },
  ] = useMutation(RejectInvitation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationIsRead,
    { loading: loadingisread, data: dataisread, error: errorisread },
  ] = useMutation(IsRead, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const reject = async (data) => {
    setLoadings(true);
    if (data.isread == false) {
      updateisread(data.ids);
    }
    try {
      let response = await mutationRejectInvitation({
        variables: {
          buddy_id: data.itinerary_buddy.id,
        },
      });
      if (dataInvit) {
        // Alert.alert('Loading!!');
      }
      if (errorInvit) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.reject_buddy.code !== 200) {
          throw new Error(response.data.reject_buddy.message);
        }
        await GetListInvitation();
        await setLoadings(false);
      }
    } catch (error) {
      setLoadings(false);
      alert("" + error);
    }
  };
  const getdate = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");

    return dateFormats(start[0]) + " - " + dateFormats(end[0]);
  };

  const accept = async (data) => {
    setLoadings(true);

    try {
      let response = await mutationAcceptInvitation({
        variables: {
          buddy_id: data.itinerary_buddy.id,
        },
      });
      if (dataInvit) {
        // Alert.alert('Loading!!');
      }
      if (errorInvit) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.confrim_buddy.code !== 200) {
          throw new Error(response.data.confrim_buddy.message);
        }
        // Alert.alert('Succes');
        await GetListInvitation();
        await setLoadings(false);
      }
    } catch (error) {
      setLoadings(false);
      alert("" + error);
    }
    if (data.isread == false) {
      updateisread(data.ids);
    }
  };

  const updateisread = async (notif_id) => {
    var tempData = [...datanotif];
    var index = tempData.findIndex((k) => k["ids"] === notif_id);
    var _tempRead = { ...tempData[index] };
    _tempRead.isread = true;
    tempData.splice(index, 1, _tempRead);
    SetDataNotif(tempData);
    try {
      let response = await mutationIsRead({
        variables: {
          notif_id: notif_id,
        },
      });

      if (response.data) {
        if (response.data.update_read.code !== 200) {
          // var tempData = [...datanotif];
          // var index = tempData.findIndex((k) => k["ids"] === notif_id);
          // tempData[index].isread = true;
          // SetDataNotif(tempData);
          // throw new Error(response?.data?.reject_buddy?.message);
        } else {
          // var tempData = [...datanotif];
          // var index = tempData.findIndex((k) => k["ids"] === notif_id);
          // tempData[index].isread = true;
          // SetDataNotif(tempData);
        }
      }
    } catch (error) {
      var tempData = [...datanotif];
      var index = tempData.findIndex((k) => k["ids"] === notif_id);
      var _tempRead = { ...tempData[index] };
      _tempRead.isread = false;
      tempData.splice(index, 1, _tempRead);
      SetDataNotif(tempData);
      RNToasty.Show({
        title: "Something wrong",
        position: "bottom",
      });
    }
  };

  const handle_areaklik_comment = (data) => {
    // navigation.push("FeedStack", {
    //   screen: "CommentsById",
    //   params: {
    //     post_id: data.comment_feed.post_id,
    //     comment_id: data.comment_feed.id,
    //   },
    // });
    navigation.push("FeedStack", {
      screen: "CommentPost",
      params: {
        post_id: data.comment_feed.post_id,
        comment_id: data.comment_feed.id,
        countKoment: null,
      },
    });
    if (data.isread == false) {
      updateisread(data.ids);
    }
  };

  const handle_areaklik_like = (data) => {
    navigation.navigate("FeedStack", {
      // screen: "CommentsById",
      screen: "CommentPost",
      params: {
        post_id: data.like_feed.post_id,
      },
    });
    if (data.isread == false) {
      updateisread(data.ids);
    }
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
    data.itinerary_buddy.isconfrim == true &&
    data.itinerary_buddy.accepted_at != null
      ? navigation.navigate("ItineraryStack", {
          screen: "itindetail",
          params: {
            itintitle: "",
            country: data.itinerary_buddy.itinerary_id,
            dateitin: "",
            token: token,
            status: "saved",
          },
        })
      : "";
    if (data.isread == false) {
      updateisread(data.ids);
    }
  };

  const [
    GetListInvitation,
    { data: datasnotif, loading: loadingnotif, error: errornotif },
  ] = useLazyQuery(ListNotifikasi_, {
    fetchPolicy: "network-only",
    pollInterval: 1000,
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      SetDataNotif(datasnotif.list_notification);
      let status = 0;
      for (var x of datasnotif.list_notification) {
        if (x.isread === false) {
          status = 1;
        }
      }
      if (status === 1) {
        setreadall(true);
      } else {
        setreadall(false);
      }
    },
  });

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      GetListInvitation();
      setRefreshing(false);
    });
  }, []);

  const [setting, setSetting] = useState(null);

  const loadAsync = async () => {
    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    await GetListInvitation();
  };

  useEffect(() => {
    // GetListInvitation();
    loadAsync();
    const unsubscribe = navigation.addListener("focus", () => {
      GetListInvitation();
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

  if (loadingnotif && datanotif.length < 1) {
    return (
      // <SkeletonPlaceholder
      //   speed={1000}
      //   // backgroundColor="#FFFFFF"
      //   // highlightColor="#D1D1D1"
      // >
      //   <SkeletonPlaceholder.Item
      //     flexDirection="row"
      //     justifyContent="space-between"
      //     alignItems="flex-start"
      //     marginTop={20}
      //     marginHorizontal={15}
      //   >
      //     <SkeletonPlaceholder.Item flexDirection="row">
      //       <SkeletonPlaceholder.Item
      //         width={40}
      //         height={40}
      //         borderRadius={20}
      //       />
      //       <SkeletonPlaceholder.Item marginLeft={20}>
      //         <SkeletonPlaceholder.Item
      //           width={80}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={120}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={60}
      //           height={10}
      //           borderRadius={4}
      //         />
      //       </SkeletonPlaceholder.Item>
      //     </SkeletonPlaceholder.Item>
      //     <SkeletonPlaceholder.Item width={30} height={15} borderRadius={4} />
      //   </SkeletonPlaceholder.Item>
      //   <SkeletonPlaceholder.Item
      //     flexDirection="row"
      //     justifyContent="space-between"
      //     alignItems="flex-start"
      //     marginTop={20}
      //     marginHorizontal={15}
      //   >
      //     <SkeletonPlaceholder.Item flexDirection="row">
      //       <SkeletonPlaceholder.Item
      //         width={40}
      //         height={40}
      //         borderRadius={20}
      //       />
      //       <SkeletonPlaceholder.Item marginLeft={20}>
      //         <SkeletonPlaceholder.Item
      //           width={80}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={120}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={60}
      //           height={10}
      //           borderRadius={4}
      //         />
      //       </SkeletonPlaceholder.Item>
      //     </SkeletonPlaceholder.Item>
      //     <SkeletonPlaceholder.Item width={30} height={15} borderRadius={4} />
      //   </SkeletonPlaceholder.Item>
      //   <SkeletonPlaceholder.Item
      //     flexDirection="row"
      //     justifyContent="space-between"
      //     alignItems="flex-start"
      //     marginTop={20}
      //     marginHorizontal={15}
      //   >
      //     <SkeletonPlaceholder.Item flexDirection="row">
      //       <SkeletonPlaceholder.Item
      //         width={40}
      //         height={40}
      //         borderRadius={20}
      //       />
      //       <SkeletonPlaceholder.Item marginLeft={20}>
      //         <SkeletonPlaceholder.Item
      //           width={80}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={120}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={60}
      //           height={10}
      //           borderRadius={4}
      //         />
      //       </SkeletonPlaceholder.Item>
      //     </SkeletonPlaceholder.Item>
      //     <SkeletonPlaceholder.Item width={30} height={15} borderRadius={4} />
      //   </SkeletonPlaceholder.Item>
      //   <SkeletonPlaceholder.Item
      //     flexDirection="row"
      //     justifyContent="space-between"
      //     alignItems="flex-start"
      //     marginTop={20}
      //     marginHorizontal={15}
      //   >
      //     <SkeletonPlaceholder.Item flexDirection="row">
      //       <SkeletonPlaceholder.Item
      //         width={40}
      //         height={40}
      //         borderRadius={20}
      //       />
      //       <SkeletonPlaceholder.Item marginLeft={20}>
      //         <SkeletonPlaceholder.Item
      //           width={80}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={120}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={60}
      //           height={10}
      //           borderRadius={4}
      //         />
      //       </SkeletonPlaceholder.Item>
      //     </SkeletonPlaceholder.Item>
      //     <SkeletonPlaceholder.Item width={30} height={15} borderRadius={4} />
      //   </SkeletonPlaceholder.Item>
      //   <SkeletonPlaceholder.Item
      //     flexDirection="row"
      //     justifyContent="space-between"
      //     alignItems="flex-start"
      //     marginTop={20}
      //     marginHorizontal={15}
      //   >
      //     <SkeletonPlaceholder.Item flexDirection="row">
      //       <SkeletonPlaceholder.Item
      //         width={40}
      //         height={40}
      //         borderRadius={20}
      //       />
      //       <SkeletonPlaceholder.Item marginLeft={20}>
      //         <SkeletonPlaceholder.Item
      //           width={80}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={120}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={60}
      //           height={10}
      //           borderRadius={4}
      //         />
      //       </SkeletonPlaceholder.Item>
      //     </SkeletonPlaceholder.Item>
      //     <SkeletonPlaceholder.Item width={30} height={15} borderRadius={4} />
      //   </SkeletonPlaceholder.Item>
      //   <SkeletonPlaceholder.Item
      //     flexDirection="row"
      //     justifyContent="space-between"
      //     alignItems="flex-start"
      //     marginTop={20}
      //     marginHorizontal={15}
      //   >
      //     <SkeletonPlaceholder.Item flexDirection="row">
      //       <SkeletonPlaceholder.Item
      //         width={40}
      //         height={40}
      //         borderRadius={20}
      //       />
      //       <SkeletonPlaceholder.Item marginLeft={20}>
      //         <SkeletonPlaceholder.Item
      //           width={80}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={120}
      //           height={10}
      //           borderRadius={4}
      //         />
      //         <SkeletonPlaceholder.Item
      //           marginTop={6}
      //           width={60}
      //           height={10}
      //           borderRadius={4}
      //         />
      //       </SkeletonPlaceholder.Item>
      //     </SkeletonPlaceholder.Item>
      //     <SkeletonPlaceholder.Item width={30} height={15} borderRadius={4} />
      //   </SkeletonPlaceholder.Item>
      // </SkeletonPlaceholder>
      null
    );
  }
  const RenderTrans = ({ item }) => {
    //  notif for invite itinerary_buddy
    if (item.notification_type == "itinerary_buddy" && item.itinerary_buddy) {
      return (
        <Pressable
          onPress={() => handle_areaklik_buddy(item)}
          style={{
            backgroundColor: item.isread == false ? "#EDF5F5" : "white",
            borderBottomWidth: 0.5,
            // borderWidth: 1,
            borderBottomColor: "#D1D1D1",
            width: Dimensions.get("screen").width,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 0.5,
              borderBottomColor: "#D1D1D1",
              width: Dimensions.get("screen").width,
              paddingHorizontal: normalize(20),
              paddingVertical: normalize(20),
            }}
          >
            <Pressable
              style={{
                width: "15%",
                alignContent: "flex-start",
                marginLeft: Platform.select({
                  ios: Notch ? -3 : 5,
                  android: deviceId == "LYA-L29" ? -2 : 0,
                }),
              }}
              onPress={() => {
                item?.itinerary_buddy?.userinvite?.id !== setting?.user?.id
                  ? navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: item?.itinerary_buddy?.userinvite?.id,
                      },
                    })
                  : null;
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
                  item.itinerary_buddy.userinvite &&
                  item.itinerary_buddy.userinvite.picture
                    ? {
                        uri: item.itinerary_buddy.userinvite?.picture,
                      }
                    : default_image
                }
              />
            </Pressable>
            <View
              style={{
                flexDirection: "column",
                width: "83%",
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
                    marginBottom: 2,
                  }}
                >
                  {t("hi")} {item.itinerary_buddy.myuser?.first_name},{" "}
                  {t("hiJoinTrip")}
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
                  {item.itinerary_buddy.userinvite?.first_name}{" "}
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

              {item.itinerary_buddy.isconfrim == false &&
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
              ) : item.itinerary_buddy.isconfrim == true &&
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
                <View>
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
            {/* <View
              style={{
                flexDirection: "column",
                alignSelf: "flex-start",
                alignItems: "flex-end",
                width: "17%",
              }}
            >
              <Text
                size="description"
                style={{
                  color: "#6c6c6c",

                  marginBottom: 5,
                }}
              >
                {duration(item.tgl_buat)}
              </Text>
            </View> */}
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
            // borderWidth: 1,
            borderBottomColor: "#D1D1D1",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // borderWidth: 1,
              width: Dimensions.get("screen").width,
              paddingHorizontal: normalize(20),
              paddingTop: normalize(20),
              paddingBottom: normalize(8),
            }}
          >
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
                width: "15%",

                marginLeft: Platform.select({
                  ios: Notch ? -3 : 5,
                  android: deviceId == "LYA-L29" ? -2 : 0,
                }),
                // alignContent: "flex-start",
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
            <View
              style={{
                flexDirection: "column",

                width: "65%",
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
                width: "20%",
                // borderWidth: 1,
              }}
            >
              <View
                styles={{
                  width: 50,
                  height: 50,
                  borderWidth: 1,
                  backgroundColor: "#F6F6F6",
                }}
              >
                {item.comment_feed &&
                item.comment_feed.post_asset &&
                item.comment_feed.post_asset.type == "video" ? (
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 5,
                    }}
                  >
                    <FunImage
                      source={{
                        uri: item.comment_feed.post_asset.filepath.replace(
                          "output.m3u8",
                          "thumbnail.png"
                        ),
                      }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 5,
                      }}
                    />
                    <Play
                      width={20}
                      height={20}
                      style={{
                        position: "absolute",
                        top: 15,
                        left: 15,
                        alignSelf: "center",
                      }}
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
              // justifyContent: "",

              width: Dimensions.get("screen").width,
              paddingBottom: 15,
            }}
          >
            <View
              style={{
                width: "20%",
              }}
            ></View>
            <View
              style={{
                backgroundColor: item.isread == false ? "#FFFFFF" : "#F6F6F6",
                padding: 10,
                borderRadius: 5,
                width: deviceId == "LYA-L29" ? "75%" : "74%",
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
              // borderWidth: 1,
              width: Dimensions.get("screen").width,
              paddingVertical: normalize(20),
              paddingHorizontal: normalize(20),
            }}
          >
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
                width: "15%",

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
            <View
              style={{
                flexDirection: "column",
                width: "65%",
                paddingLeft: 10,
                // borderWidth: 1,
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
                width: "20%",
              }}
            >
              <View
                styles={{
                  width: 50,
                  height: 50,
                  borderWidth: 1,
                  backgroundColor: "#F6F6F6",
                }}
              >
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
              </View>
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
            // borderBottomWidth: 0.5,
            // borderBottomColor: "#D1D1D1",
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
            <View
              style={{
                width: "15%",
                alignContent: "flex-start",
                // borderWidth: 1,
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
            <View
              style={{
                flexDirection: "column",
                // borderWidth: 1,
                justifyContent: "center",
                width: "65%",
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
                      // fontFamily: "Lato-Regular",
                      // fontSize: 15,
                      // width: '100%',
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

                {item?.follow_user.user?.status_following == false ? (
                  <Pressable
                    onPress={() =>
                      _follow(item, item.follow_user.user.id, item.ids)
                    }
                    style={{
                      paddingVertical: 5,

                      // borderWidth: 1,
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
            {/* <View
              style={{
                flexDirection: "column",
                alignSelf: "flex-start",
                // justifyContent: "flex-end",
                alignItems: "flex-end",
                width: "17%",
              }}
            >
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
            </View> */}
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
        marginTop: normalize(45),
        // borderWidth: 1,
      }}
    >
      <Loading show={loadings} />
      {datanotif && datanotif.length ? (
        <FlatList
          contentContainerStyle={{
            justifyContent: "space-evenly",
            // flex: 1,
          }}
          horizontal={false}
          data={datanotif}
          renderItem={({ item }) => <RenderTrans item={item} />}
          keyExtractor={(item) => item.ids}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => Refresh()}
            />
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
              // borderWidth: 1,
              // borderColor: "#c7c7c7",
              backgroundColor: "#f6f6f6",
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    // marginTop: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // width: (110),
    // height: (110),
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // borderColor: 'gray',
    // shadowColor: 'gray',
    // shadowOffset: { width: 3, height: 3 },
    // shadowOpacity: 1,
    // shadowRadius: 3,
    // elevation: 3,
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "contain",
    borderRadius: 10,
  },
});
