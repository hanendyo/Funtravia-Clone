import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Keyboard,
  ImageBackground,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { Toast, Root } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  Button,
  Truncate,
  FunIcon,
  FunImage,
  FunImageBackground,
} from "../../component";
import {
  LikeRed,
  LikeEmpty,
  Star,
  PinHijau,
  Calendargrey,
  Xhitam,
  Xblue,
  Xgrey,
  Xgray,
  Xwhite,
  Love,
  Arrowbackwhite,
  Arrowbackios,
} from "../../assets/svg";
import {
  search_button,
  back_arrow_white,
  DefaultProfile,
} from "../../assets/png";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { dateFormatBetween } from "../../component/src/dateformatter";
import SearchUserQueryNew from "../../graphQL/Query/Search/SearchPeopleNew";
import RekomendasiPeople from "../../graphQL/Query/Search/RekomendasiPeople";
import SearchDestinationQuery from "../../graphQL/Query/Search/SearchDestination";
import SearchEventQuery from "../../graphQL/Query/Search/SearchEvent";
import SearchLocationQuery from "../../graphQL/Query/Search/SearchLocation";
import { useTranslation } from "react-i18next";
import BerandaPopuler from "../../graphQL/Query/Home/BerandaPopuler";
import Liked from "../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../graphQL/Mutation/unliked";
import LikedEvent from "../../graphQL/Mutation/Event/likedEvent";
import UnLikedEvent from "../../graphQL/Mutation/unliked";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";

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
  const [active_src, setActiveSrc] = useState("location");
  const [searchtext, SetSearchtext] = useState(
    props.route.params.searchInput ? props.route.params.searchInput : ""
  );
  const [locationname, setLocationname] = useState(
    props.route.params.locationname ? props.route.params.locationname : null
  );
  const default_image =
    "https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909";
  const myStateRef = React.useRef(aktifsearch);
  const fromotherpage = React.useRef(
    props.route.params.aktifsearch ? props.route.params.aktifsearch : false
  );
  let [setting, setSetting] = useState();
  let [input, setInput] = useState("");
  let IdSearch = [];
  let [token, setToken] = useState(props.route.params.token);
  let [recent, setRecent] = useState([]);
  let [idx, setIdx] = useState(2);
  let [refreshing, setRefreshing] = useState(false);
  let [aktifsearch, setAktifSearch] = useState(
    props.route.params.aktifsearch ? props.route.params.aktifsearch : false
  );

  let { width, height } = Dimensions.get("screen");

  const HeaderComponent = {
    headerTitle: locationname ? (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("searchin")}
        {locationname}
      </Text>
    ) : (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("search")}
      </Text>
    ),
    headerStyle: {
      elevation: 0,
      borderBottomWidth: 0,
      backgroundColor: "#209FAE",
    },
    headerLeft: () => (
      <TouchableOpacity onPress={() => onBackPress()}>
        {/* <Arrowbackwhite width={20} height={20} /> */}
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </TouchableOpacity>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 20,
    },
    headerRight: null,
  };

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

  const onBackPress = useCallback(() => {
    if (myStateRef.current == true && !fromotherpage.current) {
      setAktifSearch(false);
      myStateRef.current = false;
      SetSearchtext("");
      Keyboard.dismiss();
      setActiveSrc("location");
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
    SetSearchtext(text);
    myStateRef.current = true;
    setAktifSearch(true);
  };

  const gotoLocation = (data) => {
    BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    recent_save(searchtext);
    if (data.type == "Country") {
      props.navigation.navigate("CountryStack", {
        screen: "Country",
        params: {
          data: data,
          exParam: true,
        },
      });
    }
    if (data.type == "Province") {
      props.navigation.navigate("CountryStack", {
        screen: "Province",
        params: {
          data: data,
          exParam: true,
        },
      });
    }

    if (data.type == "City") {
      props.navigation.navigate("CountryStack", {
        screen: "CityDetail",
        params: {
          data: {
            city_id: data.id,
            city_name: data.name,
            latitude: null,
            longitude: null,
          },
          exParam: true,
        },
      });
    }
  };

  const hapusrecent = async (index) => {
    let arryrecent = [...recent];
    arryrecent.splice(index, 1);
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

    props.navigation.push("DestinationUnescoDetail", {
      id: item.id,
      name: item.name,
      token: token,
    });
  };

  const recent_save = async (data) => {
    let arryrecent = [...recent];
    arryrecent.splice(0, 0, data);
    var filteredArray = arryrecent.filter(function(item, pos) {
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

  let countries_id = props.route.params.idcountry
    ? props.route.params.idcountry
    : null;
  let cities_id = props.route.params.idcity ? props.route.params.idcity : null;
  let province_id = props.route.params.province_id
    ? props.route.params.province_id
    : null;

  let [user_search, Setuser_search] = useState([]);
  const {
    loading: loadingSrcuser,
    data: dataSrcuser,
    error: errorSrcuser,
    refetch: refetchSrcuser,
    networkStatus: networkStatusSrcuser,
  } = useQuery(SearchUserQueryNew, {
    variables: {
      keyword: searchtext,
      cities_id: cities_id,
      countries_id: countries_id,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (dataSrcuser) => {
      Setuser_search(dataSrcuser.user_searchv2);
    },
  });

  let [destinationSearch, SetdestinationSearch] = useState([]);

  const [
    GetListDestination,
    {
      data: dataDestination,
      loading: loadingDestination,
      error: errorDestination,
    },
  ] = useLazyQuery(SearchDestinationQuery, {
    fetchPolicy: "network-only",
    variables: {
      keyword: searchtext,
      cities_id: cities_id,
      countries_id: countries_id,
      province_id: province_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      SetdestinationSearch(dataDestination.destinationSearch);
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      GetListDestination();
    });
    return unsubscribe;
  }, [props.navigation]);

  let [event_search, SetEventSearch] = useState([]);
  const {
    loading: loadingEvent,
    data: dataEvent,
    error: errorEvent,
    refetch: refetchSrcEvent,
    networkStatus: networkStatusSrcEvent,
  } = useQuery(SearchEventQuery, {
    variables: {
      keyword: searchtext,
      cities_id: cities_id,
      countries_id: countries_id,
      province_id: province_id,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (dataEvent) => {
      SetEventSearch(dataEvent.event_search);
    },
  });

  const {
    loading: loadingLocation,
    data: dataLocation,
    error: errorLocation,
    refetch: refetchSrcLocation,
    networkStatus: networkStatusSrcLocation,
  } = useQuery(SearchLocationQuery, {
    variables: {
      keyword: searchtext,
      cities_id: cities_id,
      province_id: province_id,
      countries_id: countries_id,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  // if (dataEvent && dataEvent.event_searchv2) {
  //     event_search = dataEvent.event_searchv2;
  // }

  let search_location = [];
  if (dataLocation && dataLocation.search_location) {
    search_location = dataLocation.search_location;
  }
  // console.log(search_location);
  const {
    data: dataCityPopuler,
    loading: loadingCityPopuler,
    error: errorCityPopuler,
  } = useQuery(BerandaPopuler);
  let beranda_popularV2 = [];
  if (dataCityPopuler && dataCityPopuler.beranda_popularV2) {
    beranda_popularV2 = dataCityPopuler.beranda_popularV2;
  }

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
    if (loadingLike == false) {
      if (token && token !== null && token !== "") {
        try {
          let response = await mutationliked({
            variables: {
              destination_id: id,
            },
          });
          // console.log(response);
          if (errorLike) {
            throw new Error("Error Input");
          }

          if (response.data) {
            GetListDestination();
            if (response.data.setDestination_wishlist.code === "200") {
              // console.log("berhasil");
            } else {
              throw new Error(response.data.setDestination_wishlist.message);
            }
          }
        } catch (error) {
          GetListDestination();
          // RNToasty.Show({
          //   title: "Failed add to favorit Destination!",
          //   position: "bottom",
          // });
        }
      } else {
        props.navigation.navigate("AuthStack", {
          screen: "LoginScreen",
        });
        RNToasty.Show({
          title: t("pleaselogin"),
          position: "bottom",
        });
      }
    }
  };

  console.log("loadingunlike", loadingUnLike);

  const _unliked = async (id, index) => {
    if (loadingUnLike == false) {
      if (token && token !== null && token !== "") {
        try {
          let response = await mutationUnliked({
            variables: {
              id: id,
              type: "destination",
            },
          });
          // console.log(response);
          if (errorUnLike) {
            throw new Error("Error Input");
          }

          if (response.data) {
            GetListDestination();
            if (response.data.unset_wishlist.code === "200") {
              // console.log("berhasil");
            } else {
              throw new Error(response.data.unset_wishlist.message);
            }
          }
        } catch (error) {
          GetListDestination();
          // let tempdestination = [...destinationSearch];
          // let _temStatus = { ...tempdestination[index] };
          // _temStatus.liked = true;
          // tempdestination.splice(index, 1, _temStatus);
          // SetdestinationSearch(tempdestination);
          // RNToasty.Show({
          //   title: "Failed remove favorit Destination!",
          //   position: "bottom",
          // });
        }
      } else {
        props.navigation.navigate("AuthStack", {
          screen: "LoginScreen",
        });
        RNToasty.Show({
          title: t("pleaselogin"),
          position: "bottom",
        });
      }
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
    if (token && token !== null && token !== "") {
      let tempEvent = [...event_search];
      let _temStatus = { ...tempEvent[index] };
      _temStatus.liked = true;
      tempEvent.splice(index, 1, _temStatus);
      SetEventSearch(tempEvent);
      try {
        let response = await mutationlikedEvent({
          variables: {
            event_id: id,
          },
        });
        if (errorLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (response.data.setEvent_wishlist.code === "200") {
            // refetchSrcEvent();
          } else {
            throw new Error(response.data.setEvent_wishlist.message);
          }
        }
      } catch (error) {
        let tempEvent = [...event_search];
        let _temStatus = { ...tempEvent[index] };
        _temStatus.liked = true;
        tempEvent.splice(index, 1, _temStatus);
        SetEventSearch(tempEvent);
        RNToasty.Show({
          title: "Failed add favorit Event!",
          position: "bottom",
        });
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const _unlikedevent = async (id, index) => {
    if (token && token !== null && token !== "") {
      let tempEvent = [...event_search];
      let _temStatus = { ...tempEvent[index] };
      _temStatus.liked = false;
      tempEvent.splice(index, 1, _temStatus);
      SetEventSearch(tempEvent);
      try {
        let response = await mutationUnlikedEvent({
          variables: {
            id: id,
            type: "event",
          },
        });

        if (errorUnLike) {
          throw new Error("Error Input");
        }
        console.log(response);
        if (response.data.unset_wishlist.code === "200") {
          console.log("berhasil");
        } else {
          throw new Error(response.data.unset_wishlist.message);
        }
      } catch (error) {
        let tempEvent = [...event_search];
        let _temStatus = { ...tempEvent[index] };
        _temStatus.liked = true;
        tempEvent.splice(index, 1, _temStatus);
        SetEventSearch(tempEvent);
        RNToasty.Show({
          title: "Failed remove favorit Event!",
          position: "bottom",
        });
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
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
    if (token && token !== null && token !== "") {
      let tempUser = [...user_search];
      let _temStatus = { ...tempUser[index] };
      _temStatus.status_following = false;
      tempUser.splice(index, 1, _temStatus);
      Setuser_search(tempUser);
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });

        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (response.data.unfollow_user.code !== 200) {
            throw new Error(response.data.unfollow_user.message);
          } else {
            console.log("berhasil");
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        let temStatus = [...user_search];
        let _temStatus = { ...temStatus[index] };
        _temStatus.status_following = true;
        temStatus.splice(index, 1, _temStatus);
        Setuser_search(_temStatus);
        RNToasty.Show({
          title: "Failed To unFollow This User!",
          position: "bottom",
        });
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const _follow = async (id, index) => {
    if (token && token !== null && token !== "") {
      let tempUser = [...user_search];
      let _temStatus = { ...tempUser[index] };
      _temStatus.status_following = true;
      tempUser.splice(index, 1, _temStatus);
      Setuser_search(tempUser);
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (errorFollowMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (response.data.follow_user.code !== 200) {
            throw new Error(response.data.follow_user.message);
          } else {
            console.log("berhasil");
          }
        }
      } catch (error) {
        let temStatus = [...user_search];
        let _temStatus = { ...temStatus[index] };
        _temStatus.status_following = false;
        temStatus.splice(index, 1, _temStatus);
        Setuser_search(_temStatus);
        RNToasty.Show({
          title: "Failed To Follow This User!",
          position: "bottom",
        });
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const prepercase = (str) => {
    if (str === null || str === "") {
      return false;
    } else {
      str = str.toString();
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
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
    onCompleted: (dataRekomendasi) => {
      SetListrequser(dataRekomendasi.list_rekomendasi_user);
    },
  });
  let [list_rekomendasi_user, SetListrequser] = useState([]);
  const _unfollow_rekomendasi = async (id, index) => {
    if (token && token !== null && token !== "") {
      let temStatus = [...list_rekomendasi_user];
      let _temStatus = { ...temStatus[index] };
      _temStatus.status_following = false;
      temStatus.splice(index, 1, _temStatus);
      SetListrequser(temStatus);
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });

        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (response.data.unfollow_user.code !== 200) {
            throw new Error(response.data.unfollow_user.message);
          } else {
            console.log("berhasil");
            // refetchRekomendasi();
          }
        }
      } catch (error) {
        let temStatus = [...list_rekomendasi_user];
        let _temStatus = { ...temStatus[index] };
        _temStatus.status_following = true;
        temStatus.splice(index, 1, _temStatus);
        SetListrequser(list_rekomendasi_user);
        RNToasty.Show({
          title: "Failed To unFollow This User!",
          position: "bottom",
        });
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const _follow_rekomendasi = async (id, index) => {
    if (token && token !== null && token !== "") {
      let temStatus = [...list_rekomendasi_user];
      let _temStatus = { ...temStatus[index] };
      _temStatus.status_following = true;
      temStatus.splice(index, 1, _temStatus);
      SetListrequser(temStatus);
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }
        // console.log(response);
        if (response.data) {
          if (response.data.follow_user.code !== 200) {
            throw new Error(response.data.unfollow_user.message);
          } else {
            // console.log("berhasil");
            // refetchRekomendasi();
          }
        }
      } catch (error) {
        // refetchRekomendasi();
        let temStatus = [...list_rekomendasi_user];
        let _temStatus = { ...temStatus[index] };
        _temStatus.status_following = false;
        temStatus.splice(index, 1, _temStatus);
        console.log(error);
        SetListrequser(list_rekomendasi_user);
        RNToasty.Show({
          title: "Failed To Follow This User!",
          position: "bottom",
        });
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Root>
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
              width: Dimensions.get("window").width * 0.83,
              paddingLeft: 5,
              textAlign: "left",
              fontSize: normalize(14),
              fontFamily: "Lato-Regular",
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
          {searchtext.length > 0 ? (
            <TouchableOpacity onPress={() => SetSearchtext("")}>
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
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
                  setActiveSrc("location");
                }}
                style={{
                  // width: width / 2,
                  alignContent: "center",
                  alignItems: "center",
                  borderBottomWidth: active_src == "location" ? 2 : 0,
                  borderBottomColor:
                    active_src == "location" ? "#209FAE" : "#EEEEEE",
                  paddingVertical: 15,
                  backgroundColor: "#FFFFFF",
                  // paddingHorizontal: 10,
                  marginRight: 15,
                }}
              >
                <Text
                  size="label"
                  type={active_src == "location" ? "bold" : "bold"}
                  style={{
                    color: active_src == "location" ? "#209FAE" : "#464646",
                  }}
                >
                  {t("location")}
                </Text>
              </TouchableOpacity>
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
                  marginHorizontal: 15,
                }}
              >
                <Text
                  size="label"
                  type={active_src == "destination" ? "bold" : "bold"}
                  style={{
                    color: active_src == "destination" ? "#209FAE" : "#464646",
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
                  size="label"
                  type={active_src == "people" ? "bold" : "bold"}
                  style={{
                    color: active_src == "people" ? "#209FAE" : "#464646",
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
                  size="label"
                  // type={
                  //     active_src == "event" ? "bold" : "reg"
                  // }
                  type="bold"
                  style={{
                    color: active_src == "event" ? "#209FAE" : "#464646",
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
                  <ActivityIndicator
                    animating={loadingSrcuser}
                    size="large"
                    color="#209fae"
                  />
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
                  key={"search"}
                  contentContainerStyle={{
                    marginTop: 5,
                    justifyContent: "space-evenly",
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
                        paddingVertical: 15,
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
                            item.picture
                              ? {
                                  uri: item.picture,
                                }
                              : DefaultProfile
                          }
                          style={{
                            resizeMode: "cover",
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                          }}
                        />
                        <View
                          style={{
                            marginLeft: 20,
                            justifyContent: "center",
                          }}
                        >
                          {item.last_name !== null ? (
                            <Text size="label" type="bold">
                              {item.first_name + "" + item.last_name}
                            </Text>
                          ) : (
                            <Text size="label" type="bold">
                              {item.first_name}
                            </Text>
                          )}
                          <Text size="label" type="regular">
                            {`@${item.username}`}test
                          </Text>
                          {/* <Text
                                                        style={{
                                                            fontSize: 10,
                                                            fontFamily:
                                                                "lato-light",
                                                        }}
                                                    >
                                                        {item.bio
                                                            ? item.bio
                                                            : "Funtravia"}
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
                  ListFooterComponent={
                    searchtext !== "" && user_search.length <= 0 ? (
                      <View
                        style={{
                          // position: 'absolute',
                          // bottom:0,
                          width: width,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 30,
                          marginLeft: -15,
                          // borderWidth: 1,
                        }}
                      >
                        <Text size="label" type="regular">
                          {t("noData")}
                        </Text>
                      </View>
                    ) : null
                  }
                />
              )
            ) : null}
            {active_src === "location" && searchtext ? (
              loadingLocation ? (
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
                  <ActivityIndicator
                    animating={loadingLocation}
                    size="large"
                    color="#209fae"
                  />
                </View>
              ) : (
                <FlatList
                  data={search_location}
                  contentContainerStyle={{
                    marginTop: 5,
                    justifyContent: "space-evenly",
                    paddingStart: 10,
                    paddingEnd: 10,
                    paddingBottom: 120,
                  }}
                  horizontal={false}
                  renderItem={({ item, index }) => (
                    <Pressable
                      onPress={() => gotoLocation(item)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 15,
                      }}
                    >
                      <FunImage
                        source={
                          item.cover ? { uri: item.cover } : default_image
                        }
                        style={{
                          width: width / 3,
                          height: 85,
                          borderRadius: 7,
                        }}
                      />
                      <View
                        style={{
                          width: width / 2,
                          marginLeft: 20,
                        }}
                      >
                        <Text
                          size="bold"
                          style={{
                            marginBottom: 5,
                          }}
                        >
                          {prepercase(item.name)}
                        </Text>
                        <Text>
                          {item.type}{" "}
                          {item.head1 ? "of " + prepercase(item.head1) : null}
                          {item.head2 ? ", " + prepercase(item.head2) : null}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                  showsHorizontalScrollIndicator={false}
                  ListFooterComponent={
                    searchtext !== "" && search_location.length <= 0 ? (
                      <View
                        style={{
                          // position: 'absolute',
                          // bottom:0,
                          width: width,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 30,
                          marginLeft: -15,
                          // borderWidth: 1,
                        }}
                      >
                        <Text size="label" type="regular">
                          {t("noData")}
                        </Text>
                      </View>
                    ) : null
                  }
                  // extraData={selected}
                />
              )
            ) : null}
            {active_src === "destination" && searchtext ? (
              // loadingDestination ? (
              //   <View
              //     style={{
              //       // position: 'absolute',
              //       // bottom:0,
              //       flex: 1,
              //       width: width,
              //       justifyContent: "center",
              //       alignItems: "center",
              //       marginHorizontal: 15,
              //     }}
              //   >
              //     <ActivityIndicator
              //       animating={loadingDestination}
              //       size="large"
              //       color="#209fae"
              //     />
              //   </View>
              // ) : (
              <FlatList
                data={destinationSearch}
                contentContainerStyle={{
                  marginTop: 5,
                  justifyContent: "space-evenly",
                  paddingStart: 10,
                  paddingEnd: 10,
                  paddingBottom: 120,
                }}
                horizontal={false}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => {
                      gotodestinasi(item);
                    }}
                    key={index}
                    style={{
                      borderWidth: 1,
                      borderColor: "#F3F3F3",
                      borderRadius: 10,
                      height: 170,
                      // padding: 10,
                      marginTop: 10,
                      width: "100%",
                      flexDirection: "row",
                      backgroundColor: "#FFF",
                      shadowColor: "#FFF",
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 6.27,

                      elevation: 6,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      {/* Image */}
                      <FunImage
                        source={{
                          uri: item.images.image,
                        }}
                        style={{
                          width: 150,
                          height: "100%",
                          borderBottomLeftRadius: 10,
                          borderTopLeftRadius: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          position: "absolute",
                          top: 10,
                          right: 10,
                          left: 10,
                          width: 130,
                          zIndex: 2,
                        }}
                      >
                        {item.liked === true ? (
                          <Pressable
                            onPress={() => _unliked(item.id, index)}
                            style={{
                              backgroundColor: "#F3F3F3",
                              height: 30,
                              width: 30,
                              borderRadius: 17,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Love height={15} width={15} />
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={() =>
                              loadingLike ? null : _liked(item.id, index)
                            }
                            style={{
                              backgroundColor: "#F3F3F3",
                              height: 30,
                              width: 30,
                              borderRadius: 17,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <LikeEmpty height={15} width={15} />
                          </Pressable>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            backgroundColor: "#F3F3F3",
                            borderRadius: 3,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 5,
                            height: 25,
                          }}
                        >
                          <Star height={15} width={15} />
                          <Text size="label" type="bold">
                            {item.rating.substr(0, 3)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Keterangan */}
                    {/* rating */}
                    <View
                      style={{
                        flex: 1,
                        padding: 10,
                        height: 170,
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        {/* Title */}
                        <Text
                          size="title"
                          type="bold"
                          style={{ marginTop: 2 }}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>

                        {/* Maps */}
                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: 5,
                            alignItems: "center",
                          }}
                        >
                          <PinHijau height={15} width={15} />
                          <Text
                            size="label"
                            type="regular"
                            style={{
                              marginLeft: 5,
                            }}
                            numberOfLines={1}
                          >
                            {item.cities.name}
                          </Text>
                        </View>
                      </View>
                      {/* Great for */}

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          height: 50,
                          marginTop: 10,
                          alignItems: "flex-end",
                        }}
                      >
                        <View>
                          <Text size="label" type="bold">
                            {t("GreatFor")} :
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            {item.greatfor.length > 0 ? (
                              item.greatfor.map((item, index) => {
                                return index < 3 ? (
                                  <FunIcon
                                    key={index}
                                    icon={item.icon}
                                    fill="#464646"
                                    height={35}
                                    width={35}
                                  />
                                ) : null;
                              })
                            ) : (
                              <Text>-</Text>
                            )}
                          </View>
                        </View>
                        <Button
                          onPress={() => {
                            BackHandler.removeEventListener(
                              "hardwareBackPress",
                              onBackPress
                            );
                            recent_save(searchtext);
                            props.navigation.push("ItineraryStack", {
                              screen: "ItineraryPlaning",
                              params: {
                                idkiriman: item.id,
                                Position: "destination",
                              },
                            });
                          }}
                          size="small"
                          text={t("add")}
                          // style={{ marginTop: 15 }}
                        />
                      </View>
                    </View>
                  </Pressable>
                )}
                ListFooterComponent={
                  searchtext !== "" && destinationSearch.length <= 0 ? (
                    <View
                      style={{
                        // position: 'absolute',
                        // bottom:0,
                        width: width,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 30,
                        marginLeft: -15,
                        // borderWidth: 1,
                      }}
                    >
                      <Text size="label" type="regular">
                        {t("noData")}
                      </Text>
                    </View>
                  ) : null
                }
                showsHorizontalScrollIndicator={false}
              />
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
                  <ActivityIndicator
                    animating={loadingDestination}
                    size="large"
                    color="#209fae"
                  />
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
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
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
                            size="readable"
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
                        <FunImageBackground
                          key={item.id}
                          source={
                            item.images.length
                              ? {
                                  uri: item.images[0].image,
                                }
                              : default_image
                          }
                          style={[styles.ImageView]}
                          imageStyle={[styles.Image]}
                        ></FunImageBackground>
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
                          size="title"
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
                              size="readable"
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
                              size="readable"
                              style={{
                                paddingRight: 20,
                                width: "100%",
                                marginLeft: 5,
                              }}
                            >
                              {dateFormatBetween(
                                item.start_date,
                                item.end_date
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={
                    searchtext !== "" && event_search.length <= 0 ? (
                      <View
                        style={{
                          // position: 'absolute',
                          // bottom:0,
                          width: width,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 30,
                          marginLeft: -15,
                          // borderWidth: 1,
                        }}
                      >
                        <Text size="label" type="regular">
                          {t("noData")}
                        </Text>
                      </View>
                    ) : null
                  }
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
                    marginHorizontal: 15,
                  }}
                >
                  <Text
                    size="label"
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
                      size="readable"
                      style={{
                        // fontFamily: "Lato-Bold",
                        textAlign: "right",
                        color: "#209fae",
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
                        key={index}
                        // onPress={() => {
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
                          size="readable"
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
                size="label"
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
                  size="readable"
                  style={{
                    // fontFamily: "Lato-Bold",
                    textAlign: "right",
                    color: "#209fae",
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
                    key={index}
                    onPress={() => {
                      props.navigation.navigate("CountryStack", {
                        screen: "CityDetail",
                        params: {
                          data: {
                            city_id: value.id,
                            city_name: value.name,
                            latitude: null,
                            longitude: null,
                          },
                          exParam: true,
                        },
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
                    <Text size="readable" key={value.id}>
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
                <Text size="label" type="bold" style={{ textAlign: "left" }}>
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
                    paddingHorizontal: 15,
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
                        <FunImage
                          source={
                            item.picture
                              ? {
                                  uri: item.picture,
                                }
                              : DefaultProfile
                          }
                          style={{
                            resizeMode: "cover",
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                          }}
                        />
                        <View
                          style={{
                            marginLeft: 20,
                            justifyContent: "center",
                          }}
                        >
                          {item.last_name !== null ? (
                            <Text size="label" type="bold">
                              {item.first_name + "" + item.last_name}
                            </Text>
                          ) : (
                            <Text size="label" type="bold">
                              {item.first_name}
                            </Text>
                          )}
                          <Text size="label" type="regular">
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
      </Root>
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
