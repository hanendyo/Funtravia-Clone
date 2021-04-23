import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    ImageBackground,
    Dimensions,
    TextInput,
    FlatList,
    Pressable,
    Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
    Text,
    Button,
    CustomImage,
    Truncate,
    Loading,
} from "../../../component";

import { default_image } from "../../../assets/png";
import { gql } from "apollo-boost";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
    dateFormatForNotif,
    dateFormats,
} from "../../../component/src/dateformatter";
import {
    MapSVG,
    Star,
    LikeRed,
    LikeEmpty,
    Option_blue,
    Adduser,
    AlertSuccess,
    AlerIcon,
} from "../../../assets/svg";
// import InvitationNotif from '../../../graphQL/Query/Notification/InvitationNotif';
import AcceptInvitation from "../../../graphQL/Mutation/Notification/AcceptInvitation";
import RejectInvitation from "../../../graphQL/Mutation/Notification/RejectInvitation";
import IsRead from "../../../graphQL/Mutation/Notification/IsRead";
import ListNotifikasi from "../../../graphQL/Query/Notification/ListNotifikasi_";
import FollowMut from "../../../graphQL/Mutation/Profile/FollowMut";

import Ripple from "react-native-material-ripple";
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
    const { t, i18n } = useTranslation();
    let [datanotif, SetDataNotif] = useState([]);
    let [selected] = useState(new Map());
    let [dataTrans, setTrans] = useState(DataInformasi);
    let [loadings, setLoadings] = useState(false);
    // ===modalfilter===

    const CarDetail = (data, dataIten) => {
        navigation.navigate("CarDetail", {
            datacar: data,
            data_iten: dataIten,
        });
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

    const _follow = async (id, notif_id) => {
        if (data.isread == false) {
            updateisread(data.ids);
        }
        if (token) {
            var tempData = [...datanotif];
            var index = tempData.findIndex((k) => k["ids"] === notif_id);
            tempData[index].follow_user.user.status_following = true;
            SetDataNotif(tempData);
            try {
                let response = await FollowMutation({
                    variables: {
                        id: id,
                    },
                });
                console.log(response);
                if (errorFollowMut) {
                    throw new Error("Error Input");
                }
                // refetch();
                // setLoading(false);
            } catch (error) {
                var tempData = [...datanotif];
                var index = tempData.findIndex((k) => k["ids"] === notif_id);
                tempData[index].follow_user.user.status_following = true;
                SetDataNotif(tempData);
                Alert.alert("" + error);
                // setLoading(false);
            }
        } else {
            Alert.alert("Please Login");
            // setLoading(false);
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
            // console.log(response.data);
            if (response.data) {
                if (response.data.reject_buddy.code !== 200) {
                    throw new Error(response.data.reject_buddy.message);
                }

                // console.log(response.data.reject_buddy.data_itin.start_date);
                // Alert.alert('Succes');
                await GetListInvitation();
                await setLoadings(false);
            }
        } catch (error) {
            setLoadings(false);
            alert("" + error);
        }
    };
    const getdate = (start, end) => {
        // console.log(start);
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
                // console.log(response.data.confrim_buddy.data_itin.start_date);
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
        console.log(tempData[index].isread);
        tempData[index].isread = true;
        SetDataNotif(tempData);
        try {
            let response = await mutationIsRead({
                variables: {
                    notif_id: notif_id,
                },
            });

            // console.log(response);
            if (response.data) {
                if (response.data.update_read.code !== 200) {
                    // var tempData = [...datanotif];
                    // var index = tempData.findIndex((k) => k["ids"] === notif_id);
                    // tempData[index].isread = true;
                    // SetDataNotif(tempData);
                    throw new Error(response.data.reject_buddy.message);
                } else {
                    // var tempData = [...datanotif];
                    // var index = tempData.findIndex((k) => k["ids"] === notif_id);
                    // tempData[index].isread = true;
                    // SetDataNotif(tempData);
                }
            }
        } catch (error) {
            // var tempData = [...datanotif];
            // var index = tempData.findIndex((k) => k["ids"] === notif_id);
            // tempData[index].isread = false;
            // SetDataNotif(tempData);
            // alert('' + error);
        }
    };

    const handle_areaklik_comment = (data) => {
        navigation.push("FeedStack", {
            screen: "CommentsById",
            params: {
                post_id: data.comment_feed.post_id,
            },
        });
        if (data.isread == false) {
            updateisread(data.ids);
        }
    };
    const handle_areaklik_like = (data) => {
        navigation.navigate("FeedStack", {
            screen: "CommentsById",
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
    // console.log(token);
    const [
        GetListInvitation,
        { data: datasnotif, loading: loadingnotif, error: errornotif },
    ] = useLazyQuery(ListNotifikasi_, {
        fetchPolicy: "network-only",
        context: {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
        onCompleted: () => {
            SetDataNotif(datasnotif.list_notification);
        },
    });

    useEffect(() => {
        GetListInvitation();
    }, []);
    const duration = (datetime) => {
        var date1 = new Date(datetime).getTime();
        var datenow = new Date();
        var date2 = datenow.getTime();
        var msec = date2 - date1;
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        var days = Math.floor(hrs / 24);
        // var weeks = Math.floor(hrs / 7);
        var yrs = Math.floor(days / 365);
        mins = mins % 60;
        hrs = hrs % 24;
        // if (yrs > 0) {
        // 	return yrs + ' ' + t('yearsAgo');
        // }
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
    const RenderTrans = ({ item }) => {
        if (
            item.notification_type == "itinerary_buddy" &&
            item.itinerary_buddy
        ) {
            // console.log(item.created_at);
            return (
                <Pressable
                    onPress={() => handle_areaklik_buddy(item)}
                    style={{
                        backgroundColor:
                            item.isread == false ? "#EDF5F5" : "white",
                        // borderBottomWidth: 0.2,
                        // borderBottomColor: "#D1D1D1",
                        width: Dimensions.get("screen").width,
                        borderTopWidth: 0.2,
                        borderTopColor: "#D1D1D1",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            // justifyContent: '',
                            // alignItems: "center",
                            width: Dimensions.get("screen").width - 20,
                            paddingVertical: 15,
                            // borderWidth: 1,
                            marginLeft: 10,
                        }}
                    >
                        <View
                            style={{
                                width: "15%",
                                alignContent: "flex-start",
                                // borderWidth: 1,
                            }}
                        >
                            <CustomImage
                                customStyle={{
                                    height: 50,
                                    width: 50,
                                    alignSelf: "center",
                                    // borderWidth: 1,
                                    borderRadius: 25,
                                }}
                                customImageStyle={{
                                    resizeMode: "cover",
                                    borderRadius: 25,
                                }}
                                source={
                                    item.itinerary_buddy.userinvite &&
                                    item.itinerary_buddy.userinvite.picture
                                        ? {
                                              uri:
                                                  item.itinerary_buddy
                                                      .userinvite?.picture,
                                          }
                                        : default_image
                                }
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "column",
                                // borderWidth: 1,
                                width: "65%",
                                paddingLeft: 10,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    // alignItems:'flex-end'
                                    // borderWidth: 1,
                                }}
                            >
                                <Text
                                    type="bold"
                                    size="description"
                                    style={{
                                        // fontFamily: "Lato-Bold",
                                        color: "#464646",
                                        // width: "70%",
                                        // fontSize: 15,
                                        marginBottom: 5,
                                    }}
                                >
                                    Hi {item.itinerary_buddy.myuser?.first_name}
                                    , let's join my trip
                                </Text>
                                {/* <Text
                                    size="small"
                                    style={{
                                        // fontFamily: "Lato-Bold",
                                        color: "#464646",
                                        // width: '30%',
                                        // fontSize: 15,
                                        marginBottom: 5,
                                    }}
                                >
                                    {duration(item.created_at)}
                                </Text> */}
                            </View>
                            <Text
                                type="regular"
                                size="description"
                                style={{
                                    // fontFamily: "Lato-Regular",
                                    // fontSize: 15,
                                    // width: "70%",
                                    color: "#464646",
                                    marginBottom: 7,
                                }}
                            >
                                {item.itinerary_buddy.userinvite?.first_name}{" "}
                                {t("inviteToTrip")}
                            </Text>
                            {item.itinerary_buddy.isconfrim == false &&
                            item.itinerary_buddy.accepted_at == null &&
                            item.itinerary_buddy.rejected_at == null ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        // backgroundColor: '#32CD32',
                                        justifyContent: "flex-start",
                                        paddingHorizontal: 3,
                                        paddingVertical: 5,
                                        marginBottom: 5,
                                        width: "100%",
                                        alignContent: "center",
                                        borderRadius: 5,
                                        // borderWidth: 1,
                                    }}
                                >
                                    <Button
                                        onPress={() => accept(item)}
                                        size="small"
                                        style={{
                                            fontFamily: "lato-semibold",
                                            width: 100,
                                        }}
                                        color="primary"
                                        // type="circle"
                                        text="Accept"
                                    />
                                    <Button
                                        onPress={() => reject(item)}
                                        style={{
                                            width: 80,
                                            // opacity: 100,
                                        }}
                                        size="small"
                                        color="secondary"
                                        variant="transparent"
                                        text="Ignore"
                                    />
                                </View>
                            ) : item.itinerary_buddy.isconfrim == true &&
                              item.itinerary_buddy.accepted_at != null &&
                              item.itinerary_buddy.rejected_at == null ? (
                                <View>
                                    <Text
                                        size="description"
                                        style={{
                                            // fontSize: 15,
                                            fontFamily: "lato-semibold",
                                            color: "#209FAE",
                                        }}
                                    >
                                        You accepted this invitation
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                    <Text
                                        style={{
                                            color: "#D75995",
                                        }}
                                    >
                                        You have rejected this invitation
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View
                            style={{
                                flexDirection: "column",
                                alignSelf: "flex-start",
                                // justifyContent: "flex-end",
                                alignItems: "flex-end",
                                width: "20%",
                                // borderWidth: 1,
                            }}
                        >
                            <Text
                                size="small"
                                style={{
                                    // textAlign: "right",
                                    color: "#464646",
                                    // width: '30%',
                                    // fontSize: 15,
                                    marginBottom: 5,
                                }}
                            >
                                {duration(item.tgl_buat)}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            );
        } else if (
            item.notification_type == "comment_feed" &&
            item.comment_feed
        ) {
            return (
                <Pressable
                    onPress={() => handle_areaklik_comment(item)}
                    style={{
                        backgroundColor:
                            item.isread == false ? "#EDF5F5" : "white",
                        // borderBottomWidth: 0.2,
                        // borderBottomColor: "#D1D1D1",
                        borderTopWidth: 0.2,
                        borderTopColor: "#D1D1D1",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            // justifyContent: "",
                            alignItems: "center",
                            width: Dimensions.get("screen").width - 20,
                            paddingTop: 15,
                            marginLeft: 10,
                            marginBottom: 10,
                        }}
                    >
                        <View
                            style={{
                                width: "15%",
                                alignContent: "flex-start",
                                // borderWidth: 1,
                            }}
                        >
                            <CustomImage
                                customStyle={{
                                    height: 50,
                                    width: 50,
                                    alignSelf: "center",
                                    // borderWidth: 1,
                                    borderRadius: 25,
                                }}
                                customImageStyle={{
                                    resizeMode: "cover",
                                    borderRadius: 25,
                                }}
                                source={
                                    item.comment_feed.user?.picture
                                        ? {
                                              uri:
                                                  item.comment_feed.user
                                                      ?.picture,
                                          }
                                        : default_image
                                }
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "column",
                                // borderWidth: 1,
                                width: "65%",
                                paddingLeft: 10,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    // borderWidth: 1,
                                }}
                            >
                                <Text
                                    type="bold"
                                    size="description"
                                    style={{
                                        // fontFamily: "Lato-Bold",
                                        color: "#464646",
                                        // width: '100%',
                                        // fontSize: 15,
                                    }}
                                >
                                    {item.comment_feed.user?.first_name}{" "}
                                    {item.comment_feed.user?.last_name}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
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
                                        // marginRight: 10,
                                    }}
                                >
                                    {t("commentYourPost")}{" "}
                                </Text>
                                <Text
                                    size="small"
                                    style={{
                                        // textAlign: "right",
                                        color: "#464646",
                                        // width: '30%',
                                        // fontSize: 15,
                                        marginBottom: 5,
                                    }}
                                >
                                    {duration(item.tgl_buat)}
                                </Text>
                            </View>
                            {/* <View
                                style={{
                                    backgroundColor:
                                        item.isread == false
                                            ? "#FFFFFF"
                                            : "#F6F6F6",
                                    padding: 10,
                                    borderRadius: 5,
                                }}
                            >
                                <Text
                                    type="regular"
                                    size="description"
                                    numberOfLines={3}
                                    style={
                                        {
                                            // color: '#209fae',
                                        }
                                    }
                                >
                                    "{item.comment_feed.text}"
                                </Text>
                            </View> */}
                        </View>
                        <View
                            style={{
                                flexDirection: "column",
                                alignSelf: "flex-start",
                                // justifyContent: "flex-end",
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
                                <Image
                                    source={{
                                        uri:
                                            item.comment_feed?.post_asset
                                                ?.filepath,
                                    }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            // justifyContent: "",
                            width: Dimensions.get("screen").width - 20,
                            paddingBottom: 15,
                            marginLeft: 10,
                            // borderWidth: 1,
                        }}
                    >
                        <View
                            style={{
                                width: "17%",
                                // borderWidth: 1,
                            }}
                        ></View>
                        <View
                            style={{
                                backgroundColor:
                                    item.isread == false
                                        ? "#FFFFFF"
                                        : "#F6F6F6",
                                padding: 10,
                                borderRadius: 5,
                                // marginLeft: 10,
                                width: "83%",
                            }}
                        >
                            <Text
                                type="regular"
                                size="description"
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
                        backgroundColor:
                            item.isread == false ? "#EDF5F5" : "white",
                        borderTopWidth: 0.2,
                        borderTopColor: "#D1D1D1",
                        paddingHorizontal: 10,
                        width: Dimensions.get("screen").width,
                        // borderBottomWidth: 0.2,
                        // borderBottomColor: "#D1D1D1",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            // justifyContent: "space-between",
                            alignItems: "center",
                            width: Dimensions.get("screen").width - 20,
                            // width: "100%",
                            // borderWidth: 1,
                            paddingVertical: 15,
                            // borderColor: /,
                        }}
                    >
                        <View
                            style={{
                                alignContent: "flex-start",
                                // marginRight: 10,
                                width: "15%",
                                // borderWidth: 1,
                            }}
                        >
                            <CustomImage
                                customStyle={{
                                    height: 50,
                                    width: 50,
                                    // alignSelf: "center",
                                    // borderWidth: 1,
                                    borderRadius: 25,
                                }}
                                customImageStyle={{
                                    resizeMode: "cover",
                                    borderRadius: 25,
                                }}
                                source={
                                    item.like_feed.user?.picture
                                        ? { uri: item.like_feed.user?.picture }
                                        : default_image
                                }
                            />
                        </View>
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
                                    size="description"
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
                                    alignItems: "center",
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
                                    size="small"
                                    style={{
                                        // textAlign: "right",
                                        color: "#464646",
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
                                <Image
                                    source={{
                                        uri:
                                            item.like_feed?.post_asset
                                                ?.filepath,
                                    }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Pressable>
            );
        } else if (
            item.notification_type == "follow_user" &&
            item.follow_user
        ) {
            return (
                <Pressable
                    onPress={() => handle_areaklik_follow(item)}
                    style={{
                        backgroundColor:
                            item.isread == false ? "#EDF5F5" : "white",
                        // borderBottomWidth: 0.2,
                        // borderBottomColor: "#D1D1D1",
                        borderTopWidth: 0.2,
                        borderTopColor: "#D1D1D1",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            // justifyContent: '',
                            width: Dimensions.get("screen").width - 20,
                            paddingVertical: 15,
                            // borderWidth: 1,
                            marginLeft: 10,
                        }}
                    >
                        <View
                            style={{
                                width: "15%",
                                alignContent: "flex-start",
                                // borderWidth: 1,
                            }}
                        >
                            <CustomImage
                                customStyle={{
                                    height: 50,
                                    width: 50,
                                    alignSelf: "center",
                                    // borderWidth: 1,
                                    borderRadius: 25,
                                }}
                                customImageStyle={{
                                    resizeMode: "cover",
                                    borderRadius: 25,
                                }}
                                source={
                                    item.follow_user.user?.picture
                                        ? {
                                              uri:
                                                  item.follow_user.user
                                                      ?.picture,
                                          }
                                        : default_image
                                }
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "column",
                                // borderWidth: 1,
                                width: "65%",
                                paddingLeft: 10,
                            }}
                        >
                            <Adduser width={15} height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    // borderWidth: 1,
                                }}
                            >
                                <Text
                                    type="bold"
                                    size="description"
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
                                {item.follow_user.user?.status_following ==
                                false ? (
                                    <Pressable
                                        onPress={() =>
                                            _follow(
                                                item.follow_user.user.id,
                                                item.ids
                                            )
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
                                            Follow Back
                                        </Text>
                                    </Pressable>
                                ) : null}
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
                            <Text
                                size="small"
                                style={{
                                    // textAlign: "right",
                                    color: "#464646",
                                    // width: '30%',
                                    // fontSize: 15,
                                    marginBottom: 5,
                                }}
                            >
                                {duration(item.tgl_buat)}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            );
        }
        return null;
    };

    return (
        <View style={{ flex: 1 }}>
            <Loading show={loadings} />
            {datanotif && datanotif.length ? (
                <FlatList
                    contentContainerStyle={{
                        justifyContent: "space-evenly",
                    }}
                    horizontal={false}
                    data={datanotif}
                    renderItem={({ item }) => <RenderTrans item={item} />}
                    keyExtractor={(item) => item.ids}
                    showsHorizontalScrollIndicator={false}
                />
            ) : null}
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
