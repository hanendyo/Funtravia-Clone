import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  BackHandler,
  Image,
} from "react-native";
import { Text } from "../../../component";
import { Button, Truncate, Loading } from "../../../component";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
// import { LinearGradient } from "expo-linear-gradient";
import {
  Chat,
  Disketpink,
  Create,
  Settings,
  Plus,
  OptionsVertWhite,
  Arrowbackwhite,
  Sharegreen,
  Xhitam,
  Love,
  Google,
  PlusBlack,
  Book,
  Expences,
  Delete,
  Plusgrey,
} from "../../../assets/svg";
import { default_image } from "../../../assets/png";
import Modal from "react-native-modal";
import ItineraryDay from "./itineraryday";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import Deleteitinerary from "../../../graphQL/Mutation/Itinerary/Deleteitinerary";
import ChangeStatus from "../../../graphQL/Mutation/Itinerary/ChangeStatus";
import { dateFormats } from "../../../component/src/dateformatter";
import Sidebar from "../../../component/src/Sidebar";
import { useTranslation } from "react-i18next";
import Timeline from "../../../graphQL/Query/Itinerary/Timeline";
import Uploadfoto from "../../../graphQL/Mutation/Itinerary/Uploadcover";
import ImagePicker from "react-native-image-crop-picker";
import LinearGradient from "react-native-linear-gradient";

// let HEADER_MAX_HEIGHT = 200;
let HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.2;
let HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 75 : 55;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function ItineraryDetail(props) {
  const { t, i18n } = useTranslation();
  let [Modalcustom, setModalcustom] = useState(false);
  let [modalcover, setmodalcover] = useState(false);
  let [loading, setloading] = useState(false);
  let [showside, setshowside] = useState(false);
  let [isPrivate, setPrivate] = useState();
  let [datadayaktif, setdatadayaktifs] = useState(
    props.route.params.datadayaktif
  );

  const setdatadayaktif = (data) => {
    setdatadayaktifs(data);
    props.navigation.setParams({ datadayaktif: data });
  };

  let [scrollY, setscrollY] = useState(new Animated.Value(0));

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });
  const textLeft = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 40, 55],
    extrapolate: "clamp",
  });

  const textTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 50, 0],
    extrapolate: "clamp",
  });

  const textTops = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [
      Platform.OS === "ios" ? 20 : 0,
      Platform.OS === "ios" ? 20 : 0,
    ],
    extrapolate: "clamp",
  });

  const textSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 20, 14],
    extrapolate: "clamp",
  });
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT + 55, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  let [dataAkhir, setDataAkhir] = useState(null);
  let [Cover, setCover] = useState(null);
  let [idDay, setidDay] = useState(null);

  let itincountries = props.route.params.country;
  let [status, setStatus] = useState(props.route.params.status);
  let token = props.route.params.token;

  const [
    mutationdeleteItinerary,
    { loading: loadingdelete, data: datadelete, error: errordelete },
  ] = useMutation(Deleteitinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationChangestatus,
    { loading: loadingchange, data: datachange, error: errorchange },
  ] = useMutation(ChangeStatus, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationSaveTimeline,
    { loading: loadingSave, data: dataSave, error: errorSave },
  ] = useMutation(UpdateTimeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUpload,
    { loading: loadingupload, data: dataupload, error: errorupload },
  ] = useMutation(Uploadfoto, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const upload = async (data) => {
    setloading(true);
    // console.log(data);

    if (data) {
      // console.log(tmpFile.base64);
      try {
        let response = await mutationUpload({
          variables: {
            itinerary_id: itincountries,
            cover: "data:image/jpeg;base64," + data,
          },
        });
        if (errorupload) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.upload_cover_itinerary.code !== 200) {
            throw new Error(response.data.upload_cover_itinerary.message);
          }
          // Alert.alert(t('success'));
          _Refresh();
          // props.navigation.goBack();
        }
        setloading(false);
      } catch (error) {
        Alert.alert("" + error);
        setloading(false);
      }
    }
  };

  const pickcamera = async () => {
    ImagePicker.openCamera({
      width: 600,
      height: 400,
      cropping: true,
      // freeStyleCropEnabled: true,
      includeBase64: true,
    }).then((image) => {
      upload(image.data);
    });
  };
  const pickGallery = async () => {
    ImagePicker.openPicker({
      width: 600,
      height: 400,
      cropping: true,
      // freeStyleCropEnabled: true,
      includeBase64: true,
    }).then((image) => {
      upload(image.data);
    });
  };

  const savetimeline = async () => {
    try {
      let response = await mutationSaveTimeline({
        variables: {
          idday: idDay,
          value: JSON.stringify(dataAkhir),
        },
      });
      if (loadingSave) {
        Alert.alert("Loading!!");
      }
      if (errorSave) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.update_timeline.code !== 200) {
          throw new Error(response.data.update_timeline.message);
        }
        props.navigation.push("MainTripPlaning", {
          index: status === "saved" ? 1 : 0,
        });
      }
      setDataAkhir([]);

      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
    setModalsave(false);
  };

  const _handlerBack = async () => {
    // await console.log(status);
    if (dataAkhir && dataAkhir.length > 0) {
      setModalsave(true);
    } else {
      // status = '';
      props.navigation.navigate("TripPlaning", {
        index: status === "saved" ? 1 : 0,
      });
    }
  };

  let [modalsave, setModalsave] = useState(false);
  let [modal, setModal] = useState(false);

  const completePlan = async () => {
    setloading(true);
    for (var i of datadetail.itinerary_detail.day) {
      let x = i.total_hours.split(":");
      let y = parseFloat(x[0]);
      if (y < 1) {
        setloading(false);
        Alert.alert(
          "" + t("Activity") + " " + t("day") + " " + i.day + " " + t("emptys")
        );
        return false;
      }
    }

    if (dataAkhir && dataAkhir.length > 0) {
      try {
        let response = await mutationSaveTimeline({
          variables: {
            idday: idDay,
            value: JSON.stringify(dataAkhir),
          },
        });
        if (loadingSave) {
          Alert.alert("Loading!!");
        }
        if (errorSave) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.update_timeline.code !== 200) {
            throw new Error(response.data.update_timeline.message);
          }
          setDataAkhir([]);
          try {
            let response = await mutationChangestatus({
              variables: {
                id: itincountries,
                status: "A",
              },
            });
            if (loadingchange) {
              Alert.alert("Loading!!");
            }
            if (errorchange) {
              throw new Error("Error Input");
            }
            if (response.data) {
              if (response.data.change_status.code !== 200) {
                throw new Error(response.data.change_status.message);
              }
              setDataAkhir([]);
              // status = '';
              setStatus("saved");
            }
            setloading(false);
          } catch (error) {
            setloading(false);
            Alert.alert("" + error);
            // throw new Error(error);
          }
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        Alert.alert("" + error);
      }
    } else {
      try {
        let response = await mutationChangestatus({
          variables: {
            id: itincountries,
            status: "A",
          },
        });
        if (loadingchange) {
          Alert.alert("Loading!!");
        }
        if (errorchange) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.change_status.code !== 200) {
            throw new Error(response.data.change_status.message);
          }
          setDataAkhir([]);
          // status = '';
          setStatus("saved");
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        Alert.alert("" + error);
        // throw new Error(error);
      }
    }
  };

  const [
    GetListEvent,
    { data: datadetail, loading: loadingdetail, error: errordetail },
  ] = useLazyQuery(ItineraryDetails, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { id: itincountries },
  });

  const dateFormatr = (date) => {
    var x = date.split(" ");
    return dateFormats(x[0]);
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    setloading(true);
    GetListEvent();
    // GetTimeline();
    wait(2000).then(() => {
      setRefreshing(false);
      setloading(false);
    });
  }, []);

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {databuddy.map((value, i) => {
          if (i < 4) {
            return (
              <View key={i}>
                <Image
                  source={
                    value.user && value.user.picture
                      ? { uri: value.user.picture }
                      : default_image
                  }
                  style={{
                    resizeMode: "cover",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    marginLeft: -10,
                  }}
                />
              </View>
            );
          }
        })}

        {databuddy.length > 1 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* '' +
										databuddy.length >
									2
										? ' + ' + (databuddy.length - 2) + ' ' + t('others')
										: ' ' */}

            <Text size="small" type="regular">
              <Truncate
                text={
                  " " +
                  t("with") +
                  " " +
                  databuddy[1].user.first_name +
                  " " +
                  (databuddy.length > 2
                    ? " + " + (databuddy.length - 2) + " " + t("others")
                    : " ")
                }
                length={25}
              />
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const _handlehapus = async (id) => {
    setloading(true);
    try {
      let response = await mutationdeleteItinerary({
        variables: {
          id: id,
        },
      });
      if (errordelete) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.delete_itinerary.code !== 200) {
          throw new Error(response.data.delete_itinerary.message);
        }
        props.navigation.push("TripPlaning", {
          index: status === "saved" ? 1 : 0,
        });
      }
      // setDataAkhir([]);

      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  const GetTimeline = async (id) => {
    setidDay(id);
    // console.log('panggil mas');
    await GetTimelin();
  };

  const [
    GetTimelin,
    { data: datatimeline, loading: loadingtimeline, error: errortimeline },
  ] = useLazyQuery(Timeline, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { id: idDay },
  });

  useEffect(() => {
    // props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      _Refresh();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View
      style={{
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
        backgroundColor: "#f3f3f3",
        flex: 1,
      }}
    >
      <Loading show={loading} />

      <ScrollView
        style={{
          marginTop: 55,
        }}
        contentContainerStyle={{}}
        onScroll={Animated.event([
          {
            nativeEvent: { contentOffset: { y: scrollY } },
          },
        ])}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        stickyHeaderIndices={[2]}
        nestedScrollEnabled={true}
      >
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: HEADER_MAX_HEIGHT,
            backgroundColor: "white",
          }}
        ></View>
        <View>
          <View
            style={{
              paddingVertical: 5,
              paddingHorizontal: 20,
              width: "100%",
              backgroundColor: "white",
              borderTopWidth: 0,
              borderColor: "#F0F0F0",
              shadowColor: "#F0F0F0",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 1,
              elevation: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text size="small" type="bold" style={{}}>
                {t("dates")} :{" "}
                {datadetail && datadetail.itinerary_detail
                  ? dateFormatr(datadetail.itinerary_detail.start_date) +
                    "  -  " +
                    dateFormatr(datadetail.itinerary_detail.end_date)
                  : null}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.push("ItineraryBuddy", {
                  iditin:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail.itinerary_detail.id
                      : null,
                  token: token ? token : null,
                  dataitin:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail
                      : null,
                  databuddy:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail.itinerary_detail.buddy
                      : null,
                  created_by:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail.itinerary_detail.created_by
                      : null,
                });
              }}
              style={{
                flexDirection: "row",
                paddingVertical: 5,
                alignItems: "center",
              }}
            >
              <Text
                size="small"
                type="bold"
                style={{
                  marginRight: 20,
                }}
              >
                {t("travelBuddy")}
              </Text>
              {datadetail && datadetail.itinerary_detail ? (
                <RenderBuddy databuddy={datadetail.itinerary_detail.buddy} />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>

        {datadetail && datadetail.itinerary_detail.day.length ? (
          <ItineraryDay
            dataitin={datadetail.itinerary_detail}
            dataday={datadetail.itinerary_detail.day}
            props={props}
            token={token}
            lat={datadetail.itinerary_detail.city.latitude}
            long={datadetail.itinerary_detail.city.longitude}
            kota={datadetail.itinerary_detail.city.name}
            iditinerary={itincountries}
            getdata={() => setParamAdd(true)}
            setAkhir={(e) => setDataAkhir(e)}
            setidDayz={(e) => setidDay(e)}
            GetTimeline={(e) => GetTimeline(e)}
            setCover={(e) => setCover(e)}
            cover={datadetail.itinerary_detail.cover}
            datadayaktif={
              datadayaktif ? datadayaktif : props.route.params.datadayaktif
            }
            setdatadayaktif={(e) => setdatadayaktif(e)}
            setLoading={(e) => setloading(e)}
            Refresh={(e) => _Refresh(e)}
            status={status && status === "saved" ? "saved" : "notsaved"}
          />
        ) : null}
      </ScrollView>
      {/* ======================== (Panel bawah) ========================= */}
      {status && status === "saved" ? (
        <View
          style={{
            zIndex: 999999,
            position: "absolute",
            left: 0,
            bottom: 0,
            width: Dimensions.get("window").width,
            backgroundColor: "white",
            borderTopWidth: 1,
            borderColor: "#F0F0F0",
            shadowColor: "#F0F0F0",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            disabled
            text={t("addDestination")}
            size="large"
            style={{
              backgroundColor: "#d3d3d3",
              borderRadius: 0,
              width: "50%",
              height: 56,
              fontSize: 18,
            }}
          ></Button>

          <View
            style={{
              height: "100%",
              width: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              disabled
              text=""
              size="large"
              color="tertiary"
              type="circle"
              style={{
                backgroundColor: "#f3f3f3",
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            >
              <Plusgrey width={20} height={20} />
              <Text size="small" style={{ color: "#d3d3d3" }}>
                {t("addOption")}
              </Text>
            </Button>
            <Button
              onPress={() => {
                setStatus("Edit"), setshowside(false);
              }}
              text=""
              size="large"
              variant="transparent"
              type="circle"
              style={{
                backgroundColor: "white",
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            >
              <Create width={20} height={20} />
              <Text
                size="small"
                style={
                  {
                    // color: '#d75995'
                  }
                }
              >
                {t("edit")}
              </Text>
            </Button>
          </View>
        </View>
      ) : (
        <View
          style={{
            zIndex: 999999,
            position: "absolute",
            left: 0,
            bottom: 0,
            width: Dimensions.get("window").width,
            backgroundColor: "white",
            borderTopWidth: 1,
            borderColor: "#F0F0F0",
            shadowColor: "#F0F0F0",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            onPress={() => {
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("itindest", {
                    IdItinerary: itincountries,
                    token: token,
                    datadayaktif: datadayaktif,
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("itindest", {
                    IdItinerary: itincountries,
                    token: token,
                    datadayaktif: datadayaktif,
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            text={t("addDestination")}
            size="large"
            style={{
              borderRadius: 0,
              width: "50%",
              height: 56,
              fontSize: 18,
            }}
          ></Button>

          <View
            style={{
              height: "100%",
              width: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onPress={() => {
                setModalcustom(true);
              }}
              text=""
              size="large"
              color="tertiary"
              type="circle"
              style={{
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            >
              <Plus width={20} height={20} />
              <Text size="small" style={{ color: "#209fae" }}>
                {t("addOption")}
              </Text>
            </Button>
            <Button
              onPress={() => {
                completePlan();
              }}
              text=""
              size="large"
              variant="transparent"
              type="circle"
              style={{
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            >
              <Disketpink width={20} height={20} />
              <Text size="small" style={{ color: "#d75995" }}>
                {t("completePlan")}
              </Text>
            </Button>
          </View>
        </View>
      )}

      <Modal
        onRequestClose={() => {
          setModalcustom(false);
        }}
        onBackdropPress={() => {
          setModalcustom(false);
        }}
        onSwipeComplete={() => {
          setModalcustom(false);
        }}
        swipeDirection={"down"}
        isVisible={Modalcustom}
        style={{ justifyContent: "flex-end", padding: 0, margin: 0 }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            // borderWidth: 1,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#209FAE",
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text
              size="label"
              type="bold"
              style={{
                color: "white",
              }}
            >
              {t("addDestinationForm")}
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                setModalcustom(false);
              }}
            >
              <Xhitam width={20} height={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              setModalcustom(false);
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("CustomItinerary", {
                    idItin: itincountries,
                    idDay: datadayaktif.id,
                    itintitle: props.route.params.itintitle,
                    dateitin: props.route.params.dateitin,
                    datadayaktif: datadayaktif,
                  });
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("CustomItinerary", {
                    idItin: itincountries,
                    idDay: datadayaktif.id,
                    itintitle: props.route.params.itintitle,
                    dateitin: props.route.params.dateitin,
                    datadayaktif: datadayaktif,
                  });
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            style={{
              marginVertical: 2.5,
              width: "100%",
              height: Dimensions.get("screen").width * 0.2,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 25,
                backgroundColor: "#f3f3f3",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <PlusBlack height={15} width={15} />
            </View>
            <View>
              <Text size="description" type="bold">
                {t("createActivity")}
              </Text>
              <Text size="small" type="regular">
                {t("addCustomActivity")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalcustom(false);
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("Wishlist");
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("Wishlist");
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            style={{
              marginVertical: 2.5,
              width: "100%",
              height: Dimensions.get("screen").width * 0.2,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
              borderRadius: 5,
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 25,
                backgroundColor: "#f3f3f3",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Love height={15} width={15} />
            </View>
            <View>
              <Text size="description" type="bold">
                {t("myWishlist")}
              </Text>
              <Text size="small" type="regular">
                {t("addFromWishtlist")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalcustom(false);
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("ItinGoogle", {
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    token: token,
                    datadayaktif: datadayaktif,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("ItinGoogle", {
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    token: token,
                    datadayaktif: datadayaktif,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            style={{
              marginVertical: 2.5,
              width: "100%",
              height: Dimensions.get("screen").width * 0.2,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
              borderRadius: 5,
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 25,
                backgroundColor: "#f3f3f3",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Google height={15} width={15} />
            </View>
            <View>
              <Text size="description" type="bold">
                {t("searchFromGoogle")}
              </Text>
              <Text size="small" type="regular">
                {t("addDestinationGoogle")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            backgroundColor: "white",
            borderTopWidth: 1,
            borderColor: "#F0F0F0",
            shadowColor: "#F0F0F0",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            onPress={() => {
              setModalcustom(false);
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("itindest", {
                    IdItinerary: itincountries,
                    token: token,
                    datadayaktif: datadayaktif,
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("itindest", {
                    IdItinerary: itincountries,
                    token: token,
                    datadayaktif: datadayaktif,
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            text={t("addDestination")}
            size="large"
            style={{
              borderRadius: 0,
              width: "50%",
              height: 56,
              fontSize: 18,
            }}
          ></Button>

          <View
            style={{
              height: "100%",
              width: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              // onPress={() => {
              // 	setModalcustom(false);
              // }}
              text=""
              size="large"
              color="tertiary"
              type="circle"
              style={{
                opacity: 0.5,
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            >
              <Plus width={20} height={20} />
              <Text size="small" style={{ color: "#209fae" }}>
                {t("addOption")}
              </Text>
            </Button>
            <Button
              onPress={() => {
                completePlan();
                setModalcustom(false);
              }}
              text=""
              size="large"
              variant="transparent"
              type="circle"
              style={{
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            >
              <Disketpink width={20} height={20} />
              <Text size="small" style={{ color: "#d75995" }}>
                {t("completePlan")}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
      <Animated.View style={[styles.header, { height: headerHeight, top: 0 }]}>
        <Animated.View
          style={{
            position: "absolute",
            top: textTops,
            zIndex: 9999,
            flexDirection: "row",
            justifyContent: "space-between",
            width: Dimensions.get("screen").width,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            text={""}
            size="medium"
            type="circle"
            variant="transparent"
            onPress={() => _handlerBack()}
            style={{
              height: 55,
            }}
          >
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          </Button>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              style={{
                height: 55,
              }}
              onPress={() => Alert.alert("coming soon")}
            >
              <Book height={20} width={20} />
            </Button>
            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              style={{ height: 55 }}
              onPress={() => Alert.alert("coming soon")}
            >
              <Expences height={20} width={20} />
            </Button>
            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              style={{ height: 55 }}
              onPress={() => Alert.alert("coming soon")}
            >
              <Chat height={20} width={20} />
            </Button>
            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              style={{ height: 55 }}
              onPress={() => setshowside(true)}
            >
              <OptionsVertWhite height={20} width={20} />
            </Button>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            height: 90,
            width: "100%",
            position: "absolute",
            zIndex: 1,

            top: 0,
            left: 0,
            opacity: imageOpacity,
          }}
        >
          <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(34, 34, 34, 0)"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 90,
              width: "100%",
            }}
          ></LinearGradient>
        </Animated.View>

        <Animated.Image
          source={Cover ? { uri: Cover } : default_image}
          style={[
            styles.backgroundImage,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            },
          ]}
        />
        <Animated.View
          style={{
            width: "100%",
            backgroundColor: "white",
            transform: [{ translateY: imageTranslate }],
          }}
        >
          {/* LinearGradient */}
          <LinearGradient
            colors={["rgba(032, 159, 174,0.8)", "rgba(0, 0, 0, 0)"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 55,

              paddingHorizontal: 20,
              paddingVertical: 10,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="title"
              type="black"
              style={{
                color: "white",
              }}
            ></Text>
            {datadetail &&
            datadetail.itinerary_detail &&
            datadetail.itinerary_detail.isprivate === true ? (
              <TouchableOpacity
                onPress={() => Alert.alert("coming soon")}
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Sharegreen height={20} width={20} />
                <Text size="small" type="regular" style={{}}>
                  {t("share")}
                </Text>
              </TouchableOpacity>
            ) : null}
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.bar,
            {
              left: textLeft,
              bottom: textTop,
              height: 55,
            },
          ]}
        >
          <Animated.Text
            allowFontScaling={false}
            style={[
              styles.title,
              { fontSize: textSize, fontFamily: "Lato-Bold" },
            ]}
          >
            {datadetail && datadetail.itinerary_detail ? (
              <Truncate text={datadetail.itinerary_detail.name} length={30} />
            ) : null}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
      <Sidebar
        props={props}
        show={showside}
        Data={() => {
          return (
            <View
              style={{
                padding: 10,
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <TouchableOpacity
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  width: "100%",
                  paddingVertical: 2,
                  alignItems: "center",
                }}
                onPress={() => {
                  setmodalcover(true), setshowside(false);
                }}
              >
                <Create height={15} width={15} />

                <Text
                  size="label"
                  type="regular"
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {t("EditCover")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingVertical: 2,
                  alignItems: "center",
                  marginVertical: 5,
                }}
                onPress={() => {
                  props.navigation.push("SettingItin", {
                    token: token,
                    iditin: itincountries,
                    isPrivate:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail.itinerary_detail.isprivate
                        : false,
                  }),
                    setshowside(false);
                }}
              >
                <Settings height={15} width={15} />
                <Text
                  size="label"
                  type="regular"
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {t("setting")}
                </Text>
              </TouchableOpacity>

              {status === "saved" ? (
                <TouchableOpacity
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    width: "100%",
                    paddingVertical: 2,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setStatus("Edit"), setshowside(false);
                  }}
                >
                  <Create height={15} width={15} />
                  <Text
                    size="label"
                    type="regular"
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    {t("edit")}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  width: "100%",
                  paddingVertical: 2,
                  alignItems: "center",
                }}
                onPress={() => {
                  _handlehapus(itincountries), setshowside(false);
                }}
              >
                <Delete height={15} width={15} />

                <Text
                  size="label"
                  type="regular"
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {t("delete")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        setClose={(e) => setshowside(false)}
      />

      <Modal
        onBackdropPress={() => {
          setModalsave(false);
        }}
        onRequestClose={() => setModalsave(false)}
        onDismiss={() => setModalsave(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalsave}
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
          <Text>{t("alertsave")}</Text>
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
                savetimeline();
              }}
              color="primary"
              text={t("save")}
            ></Button>
            <Button
              onPress={() => {
                props.navigation.push("MainTripPlaning", {
                  index: status === "saved" ? 1 : 0,
                });
              }}
              color="secondary"
              variant="bordered"
              text={t("delete")}
            ></Button>
          </View>
        </View>
      </Modal>
      <Modal
        onBackdropPress={() => {
          setmodalcover(false);
        }}
        onRequestClose={() => setmodalcover(false)}
        onDismiss={() => setmodalcover(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalcover}
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
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setmodalcover(false), pickcamera();
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#d75995" }}
            >
              {t("OpenCamera")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setmodalcover(false), pickGallery();
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenGallery")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: Dimensions.get("window").width - 10,
  },
  dayButton: {
    height: 30,
    width: 75,
    marginHorizontal: 5,
    backgroundColor: "#209FAE",
  },
  dayHalfButton: {
    height: 30,
    width: 150,
    backgroundColor: "#209FAE",
  },
  dayButtonFont: { fontSize: 12, fontFamily: "Lato-Regular" },

  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#209fae",
    overflow: "hidden",
  },
  bar: {
    marginTop: 28,
    height: 32,
    zIndex: 999,
    position: "absolute",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    backgroundColor: "transparent",
    color: "white",
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
});
