import React, { useState, useEffect, useCallback } from "react";
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
  ImageBackground,
  BackHandler,
  ActivityIndicator,
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
  Star,
  LikeEmptynew,
  PinHijau,
  MapIconGreen,
  Calendargrey,
  Xhitam,
} from "../../assets/svg";
import {
  search_button,
  back_arrow_white,
  DefaultProfile,
} from "../../assets/png";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import FriendList from "../../component/src/FriendList";
import { dateFormatBetween } from "../../component/src/dateformatter";

// import SearchUserQuery from "../../graphQL/Query/Search/SearchPeopleV2";
import SearchUserQuery from "../../graphQL/Query/Search/SearchPeople";
import RekomendasiPeople from "../../graphQL/Query/Search/RekomendasiPeople";

import SearchDestinationQuery from "../../graphQL/Query/Search/SearchDestination";
import SearchEventQuery from "../../graphQL/Query/Search/SearchEvent";

import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import BerandaPopuler from "../../graphQL/Query/Home/BerandaPopuler";
import Liked from "../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../graphQL/Mutation/unliked";

import LikedEvent from "../../graphQL/Mutation/Event/likedEvent";
import UnLikedEvent from "../../graphQL/Mutation/unliked";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
const dataUser = [
  {
    first_name: "Panitan",
    last_name: "Punpuang",
    username: "PanitanPuang",
    bio: "Hal yang terindah terjadi bersama",
    status: "1",
    picture: null,
  },
];
export default function SearchPg(props, { navigation, route }) {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState("personal");
  const [active_src, setActiveSrc] = useState("destination");
  const [searchtext, SetSearchtext] = useState("");
  let [setting, setSetting] = useState();
  let [input, setInput] = useState("");

  const HeaderComponent = {
    headerTitle: "Search",
    headerTitleStyle: { color: "white" },
    headerStyle: {
      elevation: 0,
      borderBottomWidth: 0,
      backgroundColor: "#209FAE",
    },
    headerLeft: () => (
      <TouchableOpacity onPress={() => onBackPress()}>
        <Image
          style={{ width: 20, height: 20 }}
          imageStyle={{ width: 20, height: 20, resizeMode: "contain" }}
          source={back_arrow_white}
        />
      </TouchableOpacity>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 20,
    },
    headerRight: null,
  };

  let [token, setToken] = useState(props.route.params.token);
  let [recent, setRecent] = useState([]);
  const default_image =
    "https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909";
  let [idx, setIdx] = useState(2);
  let [refreshing, setRefreshing] = useState(false);
  let [aktifsearch, setAktifSearch] = useState(false);
  let { width, height } = Dimensions.get("screen");
  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    for (let val of data) {
      if (count < 3) {
        tmpArray.push(val);
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
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
    // refetch();
    let recent_src = await AsyncStorage.getItem("recent_src");
    if (recent_src) {
      setRecent(JSON.parse(recent_src));
    }
  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const myStateRef = React.useRef(aktifsearch);

  const onBackPress = useCallback(() => {
    // console.log(myStateRef.current);
    if (myStateRef.current == true) {
      setAktifSearch(false);
      myStateRef.current = false;
      SetSearchtext("");
      Keyboard.dismiss();
      setActiveSrc("destination");
    } else {
      props.navigation.goBack();
    }
    return true;
  }, []);

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      refetchRekomendasi();
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [onBackPress]);

  const showsearchpage = async () => {
    myStateRef.current = true;
    setAktifSearch(true);
  };

  const srcfromricent = async (text) => {
    console.log(text);
    SetSearchtext(text);
    myStateRef.current = true;
    setAktifSearch(true);
  };

  const hapusrecent = async (index) => {
    let arryrecent = [...recent];
    arryrecent.splice(index, 1);

    console.log(arryrecent);
    setRecent(arryrecent);
    await AsyncStorage.setItem("recent_src", JSON.stringify(arryrecent));
  };

  const clearallrecent = async () => {
    let arryrecent = [];
    setRecent(arryrecent);
    await AsyncStorage.setItem("recent_src", JSON.stringify(arryrecent));
  };
  const gotodestinasi = async (item) => {
    recent_save(searchtext);
    await BackHandler.removeEventListener("hardwareBackPress", onBackPress);

    props.navigation.navigate("detailStack", {
      id: item.id,
      name: item.name,
    });
  };
  const recent_save = async (data) => {
    let arryrecent = [...recent];
    arryrecent.splice(0, 0, data);
    var filteredArray = arryrecent.filter(function (item, pos) {
      return arryrecent.indexOf(item) == pos;
    });
    let ambil;
    if (filteredArray.length > 5) {
      ambil = filteredArray.slice(0, 5);
    } else {
      ambil = filteredArray;
    }
    setRecent(ambil);
    await AsyncStorage.setItem("recent_src", JSON.stringify(ambil));
  };

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
  // console.log(dataSrcuser);
  const {
    loading: loadingDestination,
    data: dataDestination,
    error: errorDestination,
    refetch: refetchSrcDestination,
    networkStatus: networkStatusSrcDestination,
  } = useQuery(SearchDestinationQuery, {
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

  const {
    loading: loadingEvent,
    data: dataEvent,
    error: errorEvent,
    refetch: refetchSrcEvent,
    networkStatus: networkStatusSrcEvent,
  } = useQuery(SearchEventQuery, {
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

  let event_search = [];
  if (dataEvent && dataEvent.event_search) {
    event_search = dataEvent.event_search;
  }

  let destinationSearch = [];
  if (dataDestination && dataDestination.destinationSearch) {
    destinationSearch = dataDestination.destinationSearch;
  }
  // console.log("datades", destinationSearch);

  let user_search = [];
  if (dataSrcuser && dataSrcuser.user_search) {
    user_search = dataSrcuser.user_search;
  }

  const {
    data: dataCityPopuler,
    loading: loadingCityPopuler,
    error: errorCityPopuler,
  } = useQuery(BerandaPopuler);
  let beranda_popularV2 = [];
  if (dataCityPopuler && dataCityPopuler.beranda_popularV2) {
    beranda_popularV2 = dataCityPopuler.beranda_popularV2;
  }
  // console.log(beranda_popularV2);

  useEffect(() => {
    loadAsync();
  }, []);

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
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
  ] = useMutation(UnLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id, index) => {
    if (token || token !== "") {
      destinationSearch[index].liked = true;
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
          },
        });
        // console.log(response);
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            // refetchSrcDestination();
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }
        }
      } catch (error) {
        refetch();
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id, index) => {
    if (token || token !== "") {
      destinationSearch[index].liked = false;
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
            type: "destination",
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
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            // refetchSrcDestination();
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      refetch();
      Alert.alert("Please Login");
    }
  };

  const [
    mutationlikedEvent,
    { loading: loadingLikeevent, data: dataLikeevent, error: errorLikeevent },
  ] = useMutation(LikedEvent, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUnlikedEvent,
    {
      loading: loadingUnLikeevent,
      data: dataUnLikeevent,
      error: errorUnLikeevent,
    },
  ] = useMutation(UnLikedEvent, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const eventdetail = (data) => {
    BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    recent_save(searchtext);
    props.navigation.navigate("eventdetail", {
      data: data,
      name: data.name,
      token: token,
    });
  };

  const _likedevent = async (id, index) => {
    if (token || token !== "") {
      event_search[index].liked = true;
      try {
        let response = await mutationlikedEvent({
          variables: {
            event_id: id,
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
            response.data.setEvent_wishlist.code === 200 ||
            response.data.setEvent_wishlist.code === "200"
          ) {
            // refetchSrcEvent();
          } else {
            throw new Error(response.data.setEvent_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      event_search[index].liked = false;
      Alert.alert("Please Login");
    }
  };

  const _unlikedevent = async (id, index) => {
    if (token || token !== "") {
      event_search[index].liked = false;
      try {
        let response = await mutationUnlikedEvent({
          variables: {
            id: id,
            type: "event",
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
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            // _Refresh();
            // refetchSrcEvent();
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        event_search[index].liked = true;
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

  //BUAT FOLLOW UNFOLLOW FUNCTION
  const _unfollow = async (id, index) => {
    // console.log('get rekt' + typeof status);
    if (token || token !== "") {
      user_search[index].status = "0";
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadUnfolMut) {
          // Alert.alert('Loading!!');
        }
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        console.log("for Unfollow:" + response.data.unfollow_user.message);

        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
          } else {
            throw new Error(response.data.unfollow_user.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        refetchSrcuser();
        Alert.alert("" + error);
        user_search[index].status = "1";
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _follow = async (id, index) => {
    if (token || token !== "") {
      user_search[index].status = "1";
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadFollowMut) {
          console.log("Loading!!");
        }
        <View
          style={{
            flexDirection: "row",
            // width: viewWidth + 10,
            justifyContent: "space-between",
            paddingTop: 10,
          }}
        >
          <Text type="bold" style={{ textAlign: "left" }}>
            {t("people")}
          </Text>
        </View>;

        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        refetchSrcuser();
        user_search[index].status = "0";
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const {
    loading: loadingRekomendasi,
    data: dataRekomendasi,
    error: errorRekomendasi,
    refetch: refetchRekomendasi,
    networkStatus: networkStatusRekomendasi,
  } = useQuery(RekomendasiPeople, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  let list_rekomendasi_user = [];
  if (dataRekomendasi && dataRekomendasi.list_rekomendasi_user) {
    list_rekomendasi_user = dataRekomendasi.list_rekomendasi_user;
  }
  console.log(list_rekomendasi_user);
  const _unfollow_rekomendasi = async (id, index) => {
    // console.log('get rekt' + typeof status);
    if (token || token !== "") {
      list_rekomendasi_user[index].status_following = false;
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadUnfolMut) {
          // Alert.alert('Loading!!');
        }
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        // console.log("for Unfollow:" + response.data.unfollow_user.message);

        if (response.data) {
          if (
            response.data.unfollow_user.code !== 200 ||
            response.data.unfollow_user.code !== "200"
          ) {
            list_rekomendasi_user[index].status_following = true;

            throw new Error(response.data.unfollow_user.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        refetchRekomendasi();
        list_rekomendasi_user[index].status_following = true;
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _follow_rekomendasi = async (id, index) => {
    if (token || token !== "") {
      list_rekomendasi_user[index].status_following = true;
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadFollowMut) {
          console.log("Loading!!");
        }

        if (response.data) {
          if (
            response.data.follow_user.code !== 200 ||
            response.data.follow_user.code !== "200"
          ) {
            list_rekomendasi_user[index].status_following = false;
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        refetchRekomendasi();

        list_rekomendasi_user[index].status_following = false;
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          marginTop: 10,
          width: Dimensions.get("screen").width - 30,
          flexDirection: "row",
          borderBottomWidth: 1.5,
          borderBottomColor: "#209FAE",
          justifyContent: "flex-start",
          alignSelf: "center",
        }}
      >
        <Image
          source={search_button}
          imageStyle={{ resizeMode: "cover" }}
          style={{
            height: 15,
            width: 15,
            alignSelf: "center",
            zIndex: 100,
          }}
        />
        <TextInput
          value={searchtext}
          style={{
            height: 38,
            width: Dimensions.get("window").width * 0.9,
            paddingLeft: 5,
            textAlign: "left",
            fontSize: 10,
          }}
          underlineColorAndroid="transparent"
          onKeyPress={(e) => {
            e.key === "Backspace" ? searchInput("") : null;
          }}
          onChangeText={(e) => SetSearchtext(e)}
          onFocus={() => showsearchpage()}
          enablesReturnKeyAutomatically={true}
          placeholder={t("searchHome")}
        />
      </View>
      {aktifsearch == true ? (
        <>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderBottomWidth: 1,
              borderBottomColor: "#EEEEEE",
              paddingHorizontal: 15,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setActiveSrc("destination");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: active_src == "destination" ? 2 : 0,
                borderBottomColor:
                  active_src == "destination" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                // paddingHorizontal: 10,
                marginRight: 15,
              }}
            >
              <Text
                size="description"
                type={active_src == "destination" ? "bold" : "bold"}
                style={{
                  color: active_src == "destination" ? "#209FAE" : "#D1D1D1",
                }}
              >
                {t("destination")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveSrc("people");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: active_src == "people" ? 2 : 0,
                borderBottomColor:
                  active_src == "people" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                // paddingHorizontal: 10,
                marginHorizontal: 15,
              }}
            >
              <Text
                size="description"
                type={active_src == "people" ? "bold" : "bold"}
                style={{
                  color: active_src == "people" ? "#209FAE" : "#D1D1D1",
                }}
              >
                {t("people")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveSrc("event");
              }}
              style={{
                // width: width / 2,
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: active_src == "event" ? 2 : 0,
                borderBottomColor:
                  active_src == "event" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                backgroundColor: "#FFFFFF",
                // paddingHorizontal: 10,
                marginHorizontal: 10,
              }}
            >
              <Text
                size="description"
                type={active_src == "event" ? "bold" : "bold"}
                style={{
                  color: active_src == "event" ? "#209FAE" : "#D1D1D1",
                }}
              >
                {t("event")}
              </Text>
            </TouchableOpacity>
          </View>
          {active_src === "people" ? (
            loadingSrcuser ? (
              <View
                style={{
                  // position: 'absolute',
                  // bottom:0,
                  flex: 1,
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 15,
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
              // <FriendList
              //   props={props}
              //   datanya={user_search}
              //   token={token}
              //   onBackPress={() => onBackPress()}
              //   recent_save={(searchtext) => recent_save(searchtext)}
              // />

              <FlatList
                contentContainerStyle={{
                  marginTop: 5,
                  justifyContent: "space-evenly",
                  paddingEnd: 20,
                  marginHorizontal: 15,
                }}
                data={user_search}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignContent: "center",
                      // paddingRight: 10,
                      // paddingLeft: 20,
                      paddingVertical: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={
                        () => {
                          BackHandler.removeEventListener(
                            "hardwareBackPress",
                            onBackPress
                          );
                          recent_save(searchtext);
                          props.navigation.push("ProfileStack", {
                            screen: "otherprofile",
                            params: {
                              idUser: item.id,
                              token: token,
                            },
                          });
                        }
                        // props.navigation.push("otherprofile", { idUser: item.id })
                      }
                      style={{ flexDirection: "row" }}
                    >
                      <Image
                        source={
                          item.picture ? { uri: item.picture } : DefaultProfile
                        }
                        style={{
                          resizeMode: "cover",
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                        }}
                      />
                      <View
                        style={{ marginLeft: 20, justifyContent: "center" }}
                      >
                        {item.last_name !== null ? (
                          <Text size="small" type="regular">
                            {item.first_name + "" + item.last_name}
                          </Text>
                        ) : (
                          <Text size="small" type="regular">
                            {item.first_name}
                          </Text>
                        )}
                        <Text
                          style={{ fontSize: 10, fontFamily: "lato-light" }}
                        >
                          {`@${item.username}`}
                        </Text>
                        {/* <Text style={{ fontSize: 10, fontFamily: 'lato-light' }}>
							{item.bio ? item.bio : 'Funtravia'}
						</Text> */}
                      </View>
                    </TouchableOpacity>

                    <View style={{}}>
                      {item.status === "0" ? (
                        <Button
                          size="small"
                          type="circle"
                          variant="bordered"
                          style={{ width: 100 }}
                          text={t("follow")}
                          onPress={() => {
                            _follow(item.id, index);
                          }}
                        ></Button>
                      ) : (
                        <Button
                          size="small"
                          type="circle"
                          style={{ width: 100 }}
                          onPress={() => {
                            _unfollow(item.id, index);
                          }}
                          text={t("following")}
                        ></Button>
                      )}
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )
          ) : null}
          {active_src === "destination" && searchtext ? (
            loadingDestination ? (
              <View
                style={{
                  // position: 'absolute',
                  // bottom:0,
                  flex: 1,
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 15,
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
                data={destinationSearch}
                contentContainerStyle={{ marginHorizontal: 15 }}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => {
                      gotodestinasi(item);
                    }}
                    style={{
                      // width: "100%",
                      padding: 10,
                      backgroundColor: "#FFFFFF",
                      marginBottom: 10,
                      borderRadius: 10,
                      flexDirection: "row",
                      // borderWidth: 1,
                      shadowColor: "#DFDFDF",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 2.84,
                      elevation: 3,
                      marginHorizontal: 15,
                    }}
                  >
                    <Image
                      source={{ uri: item.images.image }}
                      style={{ width: "40%", height: 145, borderRadius: 10 }}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        paddingLeft: 10,
                        paddingVertical: 5,
                        width: "60%",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#F4F4F4",
                              borderRadius: 4,
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              flexDirection: "row",
                            }}
                          >
                            <Star width={15} height={15} />
                            <Text style={{ paddingLeft: 5 }} type="bold">
                              {item.rating}
                            </Text>
                          </View>
                          {item.liked === false ? (
                            <Button
                              onPress={() => _liked(item.id, index)}
                              type="circle"
                              style={{
                                width: 25,
                                borderRadius: 19,
                                height: 25,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: "#EEEEEE",
                                zIndex: 999,
                              }}
                            >
                              <LikeEmptynew width={15} height={15} />
                            </Button>
                          ) : (
                            <Button
                              onPress={() => _unliked(item.id, index)}
                              type="circle"
                              style={{
                                width: 25,
                                borderRadius: 17.5,
                                height: 25,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: "#EEEEEE",
                                zIndex: 999,
                              }}
                            >
                              <LikeRed width={15} height={15} />
                            </Button>
                          )}
                        </View>
                        <Text
                          size="label"
                          type="bold"
                          style={{ marginBottom: 5 }}
                        >
                          {item.name}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <PinHijau width={15} height={15} />
                          <Text
                            type="regular"
                            size="description"
                            style={{ color: "#464646", marginLeft: 5 }}
                          >
                            {item.cities.name && item.countries.name
                              ? `${item.cities.name}`
                              : ""}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          marginTop: 10,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {item.greatfor && item.greatfor.length ? (
                          <View
                            style={{
                              justifyContent: "flex-start",
                              alignContent: "flex-start",
                            }}
                          >
                            <Text
                              size="description"
                              type="bold"
                              style={{
                                color: "#464646",
                              }}
                            >
                              {t("greatFor")}:
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignContent: "space-between",
                                alignItems: "stretch",
                                alignSelf: "flex-start",
                              }}
                            >
                              {item.greatfor.map((item, index) => {
                                return (
                                  <FunIcon
                                    icon={item.icon}
                                    fill="#464646"
                                    height={42}
                                    width={42}
                                    style={{}}
                                  />
                                );
                              })}
                            </View>
                          </View>
                        ) : (
                          <View
                            style={{
                              justifyContent: "flex-start",
                              alignContent: "flex-start",
                            }}
                          ></View>
                        )}
                        <Button
                          size="small"
                          text={t("addToPlan")}
                          color="primary"
                          onPress={() => {
                            props.navigation.navigate("ItineraryStack", {
                              screen: "ItineraryPlaning",
                              params: {
                                idkiriman: item.id,
                                Position: "destination",
                              },
                            });
                            BackHandler.removeEventListener(
                              "hardwareBackPress",
                              onBackPress
                            );
                          }}
                        />
                      </View>
                    </View>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                  paddingVertical: 10,
                  paddingHorizontal: 3,
                }}
                showsVerticalScrollIndicator={false}
              />
            )
          ) : null}
          {active_src === "event" ? (
            loadingEvent == true ? (
              <View
                style={{
                  // position: 'absolute',
                  // bottom:0,
                  flex: 1,
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 15,
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
                contentContainerStyle={{
                  marginBottom: 15,
                  justifyContent: "space-evenly",
                  paddingBottom: 5,
                  marginHorizontal: 15,
                }}
                horizontal={false}
                data={event_search}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      justifyContent: "center",

                      width: Dimensions.get("screen").width * 0.5 - 25,
                      height: Dimensions.get("screen").width * 0.7,
                      margin: 5,
                      flexDirection: "column",
                      backgroundColor: "white",
                      borderRadius: 5,
                      shadowColor: "gray",
                      shadowOffset: { width: 2, height: 2 },
                      shadowOpacity: 1,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 15,
                        left: 10,
                        right: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "center",
                        zIndex: 9999,
                      }}
                    >
                      <View
                        style={{
                          // bottom: (9),
                          height: 21,
                          minWidth: 60,
                          borderRadius: 11,
                          alignSelf: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(226, 236, 248, 0.85)",
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text
                          size="small"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {item.category.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 26,
                          width: 26,
                          borderRadius: 50,
                          alignSelf: "center",
                          alignItems: "center",
                          alignContent: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(226, 236, 248, 0.85)",
                          // zIndex: 999,
                        }}
                      >
                        {item.liked === false ? (
                          <TouchableOpacity
                            style={{
                              height: 26,
                              width: 26,
                              borderRadius: 50,
                              alignSelf: "center",
                              alignItems: "center",
                              alignContent: "center",
                              justifyContent: "center",

                              zIndex: 9999,
                            }}
                            onPress={() => _likedevent(item.id, index)}
                          >
                            <LikeEmpty height={13} width={13} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{
                              height: 26,
                              width: 26,
                              borderRadius: 50,
                              alignSelf: "center",
                              alignItems: "center",
                              alignContent: "center",
                              justifyContent: "center",

                              zIndex: 9999,
                            }}
                            onPress={() => _unlikedevent(item.id, index)}
                          >
                            <LikeRed height={13} width={13} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => eventdetail(item)}
                      style={{
                        height: Dimensions.get("window").width * 0.47 - 16,
                      }}
                    >
                      <ImageBackground
                        key={item.id}
                        source={
                          item.images.length
                            ? { uri: item.images[0].image }
                            : default_image
                        }
                        style={[styles.ImageView]}
                        imageStyle={[styles.Image]}
                      ></ImageBackground>
                    </TouchableOpacity>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "space-around",
                        height: 230,
                        marginVertical: 5,
                        marginHorizontal: 10,
                      }}
                    >
                      <Text
                        onPress={() => eventdetail(item)}
                        size="label"
                        type="bold"
                        style={{}}
                      >
                        <Truncate text={item.name} length={27} />
                      </Text>
                      <View
                        style={{
                          height: "50%",
                          flexDirection: "column",
                          justifyContent: "space-around",
                        }}
                      >
                        <View
                          style={{
                            // flex: 1,
                            flexDirection: "row",
                            width: "100%",
                            borderColor: "grey",
                          }}
                        >
                          <PinHijau width={15} height={15} />

                          <Text
                            size="small"
                            style={{
                              width: "100%",
                              marginLeft: 5,
                            }}
                          >
                            {item.city.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            // flex: 1,
                            flexDirection: "row",
                            width: "100%",
                            marginBottom: 3,
                          }}
                        >
                          <Calendargrey width={15} height={15} />

                          <Text
                            size="small"
                            style={{
                              paddingRight: 20,
                              width: "100%",
                              marginLeft: 5,
                            }}
                          >
                            {dateFormatBetween(item.start_date, item.end_date)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
            )
          ) : null}
        </>
      ) : (
        <View
          style={{
            paddingVertical: 20,
          }}
        >
          {/* recent */}
          {recent.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  width: width - 30,
                  justifyContent: "space-between",
                  alignContent: "flex-end",
                  marginBottom: 10,
                  paddingHorizontal: 15,
                }}
              >
                <Text
                  // size='description'
                  type="bold"
                  style={{
                    // fontFamily: "Lato-Regular",
                    textAlign: "left",
                  }}
                >
                  {t("recent")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    clearallrecent();
                  }}
                >
                  <Text
                    type="bold"
                    size="small"
                    style={{
                      // fontFamily: "Lato-Bold",
                      textAlign: "right",
                      color: "#5092D0",
                    }}
                  >
                    {t("clearAll")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "100%",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  paddingHorizontal: 15,
                }}
              >
                {recent.map((value, index) => {
                  return (
                    <View
                      // onPress={() => {
                      //   // console.log(value);
                      //   // props.navigation.navigate("detailStack", {
                      //   //   id: value.id,
                      //   //   name: value.name,
                      //   // });
                      //   // BackHandler.removeEventListener(
                      //   //   "hardwareBackPress",
                      //   //   onBackPress
                      //   // );
                      // }}
                      style={{
                        backgroundColor: "#F2FAFA",
                        borderRadius: 10,
                        paddingLeft: 10,
                        margin: 3,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        onPress={() => {
                          srcfromricent(value);
                        }}
                        size="small"
                        style={{
                          marginRight: 10,
                          paddingVertical: 5,
                        }}
                      >
                        {value}
                      </Text>

                      <Pressable
                        onPress={() => {
                          hapusrecent(index);
                        }}
                        style={{
                          // borderWidth: 1,
                          borderColor: "#464646",
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 15,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#464646",
                            padding: 3,
                            marginRight: 5,
                            borderRadius: 15,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Xhitam width={7} height={7} />
                        </View>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </>
          ) : null}

          {/* destinasi */}

          <View
            style={{
              flexDirection: "row",
              width: width - 30,
              justifyContent: "space-between",
              alignContent: "flex-end",
              marginBottom: 10,
              marginHorizontal: 15,
            }}
          >
            <Text
              // size='description'
              type="bold"
              style={{
                // fontFamily: "Lato-Regular",
                textAlign: "left",
              }}
            >
              {t("popularDestination")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("CountryStack", {
                  screen: "AllDestination",
                });
                BackHandler.removeEventListener(
                  "hardwareBackPress",
                  onBackPress
                );
              }}
            >
              <Text
                type="bold"
                size="small"
                style={{
                  // fontFamily: "Lato-Bold",
                  textAlign: "right",
                  color: "#5092D0",
                }}
              >
                {t("others")}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              flexWrap: "wrap",
              flexDirection: "row",
              marginHorizontal: 15,
            }}
          >
            {beranda_popularV2.map((value, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("detailStack", {
                      id: value.id,
                      name: value.name,
                    });
                    BackHandler.removeEventListener(
                      "hardwareBackPress",
                      onBackPress
                    );
                  }}
                  style={{
                    backgroundColor: "#F2FAFA",
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    margin: 3,
                  }}
                >
                  <Text size="small" key={value.id}>
                    {value.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* <View
            style={{
              flexDirection: "row",
              // width: viewWidth + 10,
              justifyContent: "space-between",
              paddingTop: 10,
            }}
          >
            <Text type="bold" style={{ textAlign: "left" }}>
              {t("people")}
            </Text>
          </View>
          <FriendList props={props} datanya={dataUser} token={token} /> */}
          {/* <RekomendasiUser token={token} /> */}

          <View>
            <View
              style={{
                flexDirection: "row",
                // width: viewWidth + 10,
                justifyContent: "space-between",
                paddingTop: 10,
                paddingHorizontal: 15,
              }}
            >
              <Text type="bold" style={{ textAlign: "left" }}>
                {t("people")}
              </Text>
            </View>
            {loadingRekomendasi ? (
              <ActivityIndicator
                animating={loadingRekomendasi}
                size="large"
                color="#209fae"
              />
            ) : (
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={{
                  marginTop: 5,
                  justifyContent: "space-evenly",
                  paddingEnd: 20,
                  paddingHorizontal: 10,
                }}
                data={list_rekomendasi_user}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignContent: "center",
                      // paddingRight: 10,
                      // paddingLeft: 20,
                      paddingVertical: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={
                        () => {
                          BackHandler.removeEventListener(
                            "hardwareBackPress",
                            onBackPress
                          );
                          props.navigation.push("ProfileStack", {
                            screen: "otherprofile",
                            params: {
                              idUser: item.id,
                              token: token,
                            },
                          });
                        }
                        // props.navigation.push("otherprofile", { idUser: item.id })
                      }
                      style={{ flexDirection: "row" }}
                    >
                      <Image
                        source={
                          item.picture ? { uri: item.picture } : DefaultProfile
                        }
                        style={{
                          resizeMode: "cover",
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                        }}
                      />
                      <View
                        style={{ marginLeft: 20, justifyContent: "center" }}
                      >
                        {item.last_name !== null ? (
                          <Text size="small" type="regular">
                            {item.first_name + "" + item.last_name}
                          </Text>
                        ) : (
                          <Text size="small" type="regular">
                            {item.first_name}
                          </Text>
                        )}
                        <Text
                          style={{ fontSize: 10, fontFamily: "lato-light" }}
                        >
                          {`@${item.username}`}
                        </Text>
                        {/* <Text style={{ fontSize: 10, fontFamily: 'lato-light' }}>
							{item.bio ? item.bio : 'Funtravia'}
						</Text> */}
                      </View>
                    </TouchableOpacity>

                    <View style={{}}>
                      {item.status_following === false ? (
                        <Button
                          size="small"
                          type="circle"
                          variant="bordered"
                          style={{ width: 100 }}
                          text={t("follow")}
                          onPress={() => {
                            _follow_rekomendasi(item.id, index);
                          }}
                        ></Button>
                      ) : (
                        <Button
                          size="small"
                          type="circle"
                          style={{ width: 100 }}
                          onPress={() => {
                            _unfollow_rekomendasi(item.id, index);
                          }}
                          text={t("following")}
                        ></Button>
                      )}
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    height: Dimensions.get("window").width * 0.47 - 16,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
    backgroundColor: "rgba(20,20,20,0.4)",
  },
  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
  },
});
