import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
  Image,
  Keyboard,
  BackHandler,
  ActivityIndicator,
  ScrollView,
  Alert,
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
  CardEvents,
  CardDestination,
} from "../../component";
import {
  LikeRed,
  LikeEmpty,
  Star,
  PinHijau,
  Calendargrey,
  Xhitam,
  Xblue,
  Love,
  Arrowbackwhite,
  Arrowbackios,
} from "../../assets/svg";
import { search_button, DefaultProfile, default_image } from "../../assets/png";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import SearchUserQueryNew from "../../graphQL/Query/Search/SearchPeopleNew";
import RekomendasiPeople from "../../graphQL/Query/Search/RekomendasiPeople";
import SearchDestinationQuery from "../../graphQL/Query/Search/SearchDestination";
import SearchEventQuery from "../../graphQL/Query/Search/SearchEvent";
import SearchLocationQuery from "../../graphQL/Query/Search/SearchLocation";
import { useTranslation } from "react-i18next";
import BerandaPopuler from "../../graphQL/Query/Home/BerandaPopuler";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";
import { setSettingUser } from "../../redux/action";

export default function SearchPg(props, { navigation, route }) {
  const tokenApps = useSelector((data) => data.token);
  const setting = useSelector((data) => data.setting);
  const searchRdx = useSelector((data) => data.searchInput);
  const { t, i18n } = useTranslation();
  const [active_src, setActiveSrc] = useState(
    searchRdx && searchRdx.active_src.length ? searchRdx.active_src : "location"
  );
  let [list_rekomendasi_user, SetListrequser] = useState([]);

  const [searchtext, SetSearchtext] = useState(
    props.route.params?.searchInput ?? searchRdx.search_input ?? ""
  );
  const [locationname, setLocationname] = useState(
    props.route.params?.locationname ?? null
  );

  const myStateRef = React.useRef(aktifsearch);
  const fromotherpage = React.useRef(
    searchRdx.aktifsearch ?? props.route.params?.aktifsearch ?? null
  );
  let [recent, setRecent] = useState([]);
  let [aktifsearch, setAktifSearch] = useState(
    searchRdx.aktifsearch ?? props.route.params.aktifsearch ?? null
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

  const loadAsync = async () => {
    try {
      let setsetting = await AsyncStorage.getItem("setting");
      if (searchtext) {
        await refetchSrcuser();
        await refetchSrcLocation();
      }
      // setSetting(JSON.parse(setsetting));
      // dispatch(setSettingUser(setsetting));
      let recent_src = await AsyncStorage.getItem("recent_src");
      if (recent_src) {
        setRecent(JSON.parse(recent_src));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error: ", error);
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
    try {
      let arryrecent = [...recent];
      arryrecent.splice(index, 1);
      setRecent(arryrecent);
      await AsyncStorage.setItem("recent_src", JSON.stringify(arryrecent));
    } catch (error) {
      console.log(error);
      Alert.alert("Error: ", error);
    }
  };

  const clearallrecent = async () => {
    try {
      let arryrecent = [];
      setRecent(arryrecent);
      await AsyncStorage.setItem("recent_src", JSON.stringify(arryrecent));
    } catch (error) {
      console.log(error);
      Alert.alert("Error: ", error);
    }
  };

  const recent_save = async (data) => {
    try {
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
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Error: ", error);
    }
  };

  let countries_id = props.route.params?.idcountry
    ? props.route.params.idcountry
    : null;
  let cities_id = props.route.params?.idcity ? props.route.params.idcity : null;
  let province_id = props.route.params?.province_id
    ? props.route.params.province_id
    : null;

  let [user_search, Setuser_search] = useState([]);
  const {
    loading: loadingSrcuser,
    data: dataSrcuser,
    error: errorSrcuser,
    refetch: refetchSrcuser,
    fetchMore: fetchMoreSrcuser,
    networkStatus: networkStatusSrcuser,
  } = useQuery(SearchUserQueryNew, {
    variables: {
      keyword: searchtext,
      cities_id: cities_id,
      countries_id: countries_id,
      first: 10,
      after: "",
    },
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      Setuser_search(dataSrcuser?.user_searchv2_cursor_based?.edges);
    },
  });

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    const { pageInfo } = fetchMoreResult.user_searchv2_cursor_based;

    const edges = [
      ...prev?.user_searchv2_cursor_based?.edges,
      ...fetchMoreResult?.user_searchv2_cursor_based?.edges,
    ];

    const feedback = Object.assign({}, prev, {
      user_searchv2_cursor_based: {
        __typename: prev.user_searchv2_cursor_based.__typename,
        pageInfo,
        edges,
      },
    });
    return feedback;
  };

  const handleOnEndReached = () => {
    if (
      dataSrcuser?.user_searchv2_cursor_based?.pageInfo.hasNextPage &&
      !loadingSrcuser
    ) {
      return fetchMoreSrcuser({
        updateQuery: onUpdate,
        variables: {
          first: 10,
          after: dataSrcuser?.user_searchv2_cursor_based.pageInfo?.endCursor,
          // limit: dataSrcuser?.user_searchv2_cursor_based.node?.length,
        },
      });
    }
  };

  const handleOnEndReachedLocation = () => {
    if (
      dataLocation?.search_location_cursor_based.page_info.hasNextPage &&
      !loadingLocation
    ) {
      return fetchMoreLocation({
        updateQuery: onUpdateLocation,
        variables: {
          limit: 10,
          offset: dataLocation.search_location_cursor_based.page_info.offset,
        },
      });
    }
  };
  const onUpdateLocation = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    const { page_info } = fetchMoreResult.search_location_cursor_based;
    const datas = [
      ...prev.search_location_cursor_based.datas,
      ...fetchMoreResult.search_location_cursor_based.datas,
    ];

    return Object.assign({}, prev, {
      search_location_cursor_based: {
        __typename: prev.search_location_cursor_based.__typename,
        page_info,
        datas,
      },
    });
  };

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
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      SetdestinationSearch(dataDestination?.destinationSearch);
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
        Authorization: tokenApps,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (dataEvent) => {
      SetEventSearch(dataEvent?.event_search);
    },
  });

  let [search_location, setSearch_location] = useState([]);

  const {
    loading: loadingLocation,
    data: dataLocation,
    error: errorLocation,
    refetch: refetchSrcLocation,
    fetchMore: fetchMoreLocation,
  } = useQuery(SearchLocationQuery, {
    variables: {
      keyword: searchtext,
      cities_id: cities_id,
      province_id: province_id,
      countries_id: countries_id,
      limit: 10,
      offset: 0,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setSearch_location(dataLocation.search_location_cursor_based.datas);
    },
  });

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

  useEffect(() => {
    refetchSrcuser();
  }, [searchtext]);

  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
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
        Authorization: tokenApps,
      },
    },
  });

  //BUAT FOLLOW UNFOLLOW FUNCTION
  const _unfollow = async (id, index) => {
    if (tokenApps) {
      let tempUser = [...user_search];
      let _temStatus = { ...tempUser[index].node };
      let _cursor = tempUser[index].cursor;
      _temStatus.status_following = false;
      let _temData = {
        __typename: "FollowingEdge",
        cursor: _cursor,
        node: _temStatus,
      };
      tempUser.splice(index, 1, _temData);
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
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        let tempUser = [...user_search];
        let _temStatus = { ...tempUser[index].node };
        let _cursor = tempUser[index].cursor;
        _temStatus.status_following = true;
        let _temData = {
          __typename: "FollowingEdge",
          cursor: _cursor,
          node: _temStatus,
        };
        tempUser.splice(index, 1, _temData);
        Setuser_search(tempUser);
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
    if (tokenApps) {
      let tempUser = [...user_search];
      let _temStatus = { ...tempUser[index].node };
      let _cursor = tempUser[index].cursor;
      _temStatus.status_following = true;
      let _temData = {
        __typename: "FollowingEdge",
        cursor: _cursor,
        node: _temStatus,
      };
      tempUser.splice(index, 1, _temData);
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
          }
        }
      } catch (error) {
        let tempUser = [...user_search];
        let _temStatus = { ...tempUser[index].node };
        let _cursor = tempUser[index].cursor;
        _temStatus.status_following = false;
        let _temData = {
          __typename: "FollowingEdge",
          cursor: _cursor,
          node: _temStatus,
        };
        tempUser.splice(index, 1, _temData);
        Setuser_search(tempUser);
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
        Authorization: tokenApps,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      SetListrequser(dataRekomendasi?.list_rekomendasi_user);
    },
  });

  const _unfollow_rekomendasi = async (id, index) => {
    if (tokenApps) {
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

        if (response.data) {
          if (response.data.unfollow_user.code !== 200) {
            throw new Error(response.data.unfollow_user.message);
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
    if (tokenApps) {
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
        if (response.data) {
          if (response.data.follow_user.code !== 200) {
            throw new Error(response.data.unfollow_user.message);
          } else {
            // refetchRekomendasi();
          }
        }
      } catch (error) {
        // refetchRekomendasi();
        let temStatus = [...list_rekomendasi_user];
        let _temStatus = { ...temStatus[index] };
        _temStatus.status_following = false;
        temStatus.splice(index, 1, _temStatus);
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
            source={search_button ? search_button : DefaultProfile}
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
          tokenApps ? (
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
                      color:
                        active_src == "destination" ? "#209FAE" : "#464646",
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
              {active_src === "people" && (
                <FlatList
                  key={"search"}
                  contentContainerStyle={{
                    marginTop: 5,
                    justifyContent: "space-evenly",
                    marginHorizontal: 15,
                  }}
                  data={user_search}
                  onEndReached={handleOnEndReached}
                  onEndReachedThreshold={0.5}
                  initialNumToRender={10}
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
                                idUser: item.node.id,
                                token: tokenApps,
                              },
                            });
                          }
                          // props.navigation.push("otherprofile", { idUser: item.id })
                        }
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={
                            item.node.picture
                              ? {
                                  uri: item.node.picture,
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
                            marginHorizontal: 15,
                            justifyContent: "center",
                            flex: 1,
                          }}
                        >
                          <Text size="label" type="bold" numberOfLines={2}>
                            {item.node.first_name ? item.node.first_name : ""}{" "}
                            {item.node.last_name ? item.node.last_name : ""}
                          </Text>
                          <Text size="label" type="regular">
                            {`@${item.node.username}`}test
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={{}}>
                        {item.node.status_following === false ? (
                          <Button
                            size="small"
                            type="circle"
                            variant="bordered"
                            style={{ width: 100 }}
                            text={t("follow")}
                            onPress={() => {
                              _follow(item.node.id, index);
                            }}
                          ></Button>
                        ) : (
                          <Button
                            size="small"
                            type="circle"
                            style={{ width: 100 }}
                            onPress={() => {
                              _unfollow(item.node.id, index);
                            }}
                            text={t("following")}
                          ></Button>
                        )}
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.node.id}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={
                    searchtext !== "" && user_search?.length <= 0 ? (
                      <View
                        style={{
                          alignItems: "center",
                          marginTop: 30,
                        }}
                      >
                        <Text size="label" type="regular">
                          {t("noData")}
                        </Text>
                      </View>
                    ) : loadingSrcuser ? (
                      <View
                        style={{
                          width: Dimensions.get("screen").width,
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 30,
                        }}
                      >
                        <ActivityIndicator
                          animateing={loadingSrcuser}
                          size="large"
                          color="#209FAE"
                        />
                      </View>
                    ) : null
                  }
                />
              )}
              {active_src === "location" && (
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
                  onEndReachedThreshold={0.7}
                  onEndReached={handleOnEndReachedLocation}
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
                    searchtext !== "" && search_location?.length <= 0 ? (
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
                    ) : loadingLocation ? (
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
                    ) : null
                  }
                />
              )}
              {active_src === "destination" && searchtext ? (
                loadingDestination == true ? (
                  <View
                    style={{
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
                ) : destinationSearch.length > 0 ? (
                  <CardDestination
                    data={destinationSearch}
                    props={props}
                    setData={(e) => SetdestinationSearch(e)}
                    token={tokenApps}
                    dataFrom="search"
                    searchInput={searchtext ? searchtext : null}
                  />
                ) : (
                  <View style={{ marginTop: 30, alignItems: "center" }}>
                    <Text type="regular" size="label">
                      {t("noData")}
                    </Text>
                  </View>
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
                    <ActivityIndicator
                      animating={loadingDestination}
                      size="large"
                      color="#209fae"
                    />
                  </View>
                ) : event_search.length > 0 ? (
                  <CardEvents
                    data={event_search}
                    props={props}
                    setData={(e) => SetEventSearch(e)}
                    token={tokenApps}
                    dataFrom="search"
                    searchInput={searchtext ? searchtext : null}
                  />
                ) : null
              ) : null}
            </>
          ) : (
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
                    // width: width / 3,
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
                      color:
                        active_src == "destination" ? "#209FAE" : "#464646",
                    }}
                  >
                    {t("destination")}
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
                loadingSrcuser ? null : ( // </View> //   /> //     color="#209fae" //     size="large" //     animating={loadingSrcuser} //   <ActivityIndicator // > //   }} //     marginHorizontal: 15, //     alignItems: "center", //     justifyContent: "center", //     width: width, //     flex: 1, //     // bottom:0, //     // position: 'absolute', //   style={{ // <View
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
                                  token: tokenApps,
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
                            alignItems: "center",
                            marginTop: 30,
                          }}
                        >
                          <Text size="label" type="regular">
                            {t("noData")}
                          </Text>
                        </View>
                      ) : loadingSrcuser ? (
                        <View
                          style={{
                            width: Dimensions.get("screen").width,
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 30,
                          }}
                        >
                          <ActivityIndicator
                            animateing={loadingSrcuser}
                            size="large"
                            color="#209FAE"
                          />
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
                            alignItems: "center",
                            marginTop: 30,
                          }}
                        >
                          <Text size="label" type="regular">
                            {t("noData")}
                          </Text>
                        </View>
                      ) : loadingLocation ? (
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
                      ) : null
                    }
                    // extraData={selected}
                  />
                )
              ) : null}
              {active_src === "destination" && searchtext ? (
                loadingDestination == true ? (
                  <View
                    style={{
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
                  <CardDestination
                    data={destinationSearch}
                    props={props}
                    setData={(e) => SetdestinationSearch(e)}
                    token={tokenApps}
                    dataFrom="search"
                  />
                )
              ) : null}
              {active_src === "event" ? (
                loadingEvent == true ? (
                  <View
                    style={{
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
                ) : event_search.length > 0 ? (
                  <CardEvents
                    data={event_search}
                    props={props}
                    setData={(e) => SetEventSearch(e)}
                    token={tokenApps}
                  />
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      marginTop: 30,
                      width: Dimensions.get("screen").width,
                    }}
                  >
                    <Text size="label" type="regular">
                      {t("noData")}
                    </Text>
                  </View>
                )
              ) : null}
            </>
          )
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
                      size="description"
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
                          size="label"
                          type="regular"
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
                    params: {
                      token: tokenApps,
                    },
                  });
                  BackHandler.removeEventListener(
                    "hardwareBackPress",
                    onBackPress
                  );
                }}
              >
                <Text
                  type="bold"
                  size="description"
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
                width: Dimensions.get("screen").width - 30,
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
                      value.type == "city"
                        ? props.navigation.navigate("CountryStack", {
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
                          })
                        : props.navigation.navigate("CountryStack", {
                            screen: "Province",
                            params: {
                              data: value,
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
                    <Text size="label" type="regular" key={value.id}>
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

            {tokenApps ? (
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
                <FlatList
                  contentContainerStyle={{
                    marginTop: 5,
                    // justifyContent: "space-evenly",
                    paddingHorizontal: 15,
                  }}
                  data={list_rekomendasi_user}
                  renderItem={({ item, index }) =>
                    setting?.user_id != item.id && (
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
                                  token: tokenApps,
                                },
                              });
                            }
                            // props.navigation.push("otherprofile", { idUser: item.id })
                          }
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            marginRight: 10,
                            alignItems: "center",
                          }}
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
                              flex: 1,
                            }}
                          >
                            <Text size="label" type="bold" numberOfLines={2}>
                              {item.first_name ? item.first_name : ""}{" "}
                              {item.last_name ? item.last_name : ""}
                            </Text>
                            <Text size="label" type="regular">
                              {`@${item.username}`}
                            </Text>
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
                    )
                  }
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : null}
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
