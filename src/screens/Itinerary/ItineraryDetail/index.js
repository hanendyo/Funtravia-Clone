import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Fragment,
} from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
  Modal as Modalss,
  Picker,
  BackHandler,
  FlatList,
  NativeModules,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { default_image, Bg_soon, ItineraryKosong } from "../../../assets/png";
import {
  Settings,
  Arrowbackwhite,
  Bottom,
  Create,
  Delete,
  Disketpink,
  Google,
  Love,
  Mobil,
  More,
  Next,
  OptionsVertWhite,
  Pencilgreen,
  Plus,
  PlusBlack,
  Plusgrey,
  Sharegreen,
  Xhitam,
  LikeEmpty,
  Reorder,
  CameraIcon,
  Stay,
  Flights,
  Chatnew,
  Play,
  PlayVideo,
  LeaveTrips,
  Help,
  Errors,
  Errorr,
  Errorx,
  CalendarIcon,
  Arrowbackios,
  ItineraryIcon,
  ItineraryIconGray,
  TravelAlbum,
  AlbumIconGray,
  TravelStories,
  TravelStoriesdis,
  TravelAlbumdis,
  Xgray,
  World,
  Lock,
  Complete,
  ChatItinerary,
  Home,
  OptionsVertBlack,
} from "../../../assets/svg";
import {
  Button,
  Capital,
  Distance,
  FunIcon,
  Text,
  Truncate,
  StatusBar as CustomStatusBar,
  shareAction,
  FunImage,
  FunVideo,
  Peringatan,
} from "../../../component";
import { rupiah } from "../../../component/src/Rupiah";

import {
  dateFormatHari,
  dateFormatMDY,
  dateFormats,
} from "../../../component/src/dateformatter";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";
import Timeline from "../../../graphQL/Query/Itinerary/Timeline";
import ItineraryDay from "./itineraryday";
import Albumheader from "./albumheader";
import Modal from "react-native-modal";
import DeleteDay from "../../../graphQL/Mutation/Itinerary/DeleteDay";
import { Textarea } from "native-base";
import moment from "moment";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import DeleteActivity from "../../../graphQL/Mutation/Itinerary/DeleteActivity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Updatecover from "../../../graphQL/Mutation/Itinerary/UpdatecoverV2";
import ChangeStatus from "../../../graphQL/Mutation/Itinerary/ChangeStatus";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import Ripple from "react-native-material-ripple";
import album from "../../../graphQL/Query/Itinerary/album";
import { MenuProvider } from "react-native-popup-menu";
import ImagePicker from "react-native-image-crop-picker";
import UploadfotoAlbum from "../../../graphQL/Mutation/Itinerary/Uploadalbum";
import LeaveItinerary from "../../../graphQL/Mutation/Itinerary/LeaveItinerary";
import ImageSlide from "../../../component/src/ImageSlide/sliderwithoutlist";
import ImageSliders from "../../../component/src/ImageSlide/sliderPost";
import Deleteitinerary from "../../../graphQL/Mutation/Itinerary/Deleteitinerary";
import { StackActions } from "@react-navigation/routers";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { ReactNativeFile } from "apollo-upload-client";
import DocumentPicker from "react-native-document-picker";
import DeviceInfo from "react-native-device-info";
import normalize from "react-native-normalize";
import { useSelector, useDispatch } from "react-redux";
import { setItinerary } from "../../../redux/action";
import { SafeAreaView } from "react-native-safe-area-context";

const Notch = DeviceInfo.hasNotch();
const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const tab1ItemSize = (width - 30) / 2;
const tab2ItemSize = (width - 17.5) / 4;
const PullToRefreshDist = 150;

const parentWidth = width;
const childrenWidth = width - 40;
const childrenHeight = 60;

export default function ItineraryDetail(props) {
  let { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const setting = useSelector((data) => data.setting);
  const NotchAndro = NativeModules.StatusBarManager
    ? NativeModules.StatusBarManager.HEIGHT > 24
    : false;
  let [tambahan, setTambahan] = useState(55);
  let [HeaderHeight, setHeaderHeight] = useState(
    Dimensions.get("screen").height * (Notch ? 0.3 : 0.35)
  );
  const deviceId = DeviceInfo.getModel();
  const SafeStatusBar = Platform.select({
    ios: Notch ? 48 : 20,
    android: NativeModules.StatusBarManager.HEIGHT,
  });
  /**
   * stats
   */

  let [Cover, setCover] = useState(null);
  const [optionModal, setOptionModal] = useState(false);

  const [tabIndex, setIndex] = useState(
    props.route.params.index ? props.route.params.index : 0
  );
  const [routes] = useState([
    { key: "tab1", title: "Itinerary", active: true },
    { key: "tab2", title: t("album"), active: true },
    { key: "tab3", title: t("story"), active: false },
  ]);
  const [canScroll, setCanScroll] = useState(true);
  let [dataList, setDataListItem] = useState([]);
  const [tab3Data] = useState([]);
  let itineraryId = props.route.params.country;
  const token = useSelector((data) => data.token);

  let [statusKiriman, setStatusKiriman] = useState(
    props.route.params.status ? props.route.params.status : "kosong"
  );
  let [status, setStatus] = useState("edit");
  let [idDay, setidDay] = useState(null);

  let [dataAkhir, setDataAkhir] = useState();
  let [indexnya, setIndexnya] = useState(0);
  const [textLayoutLength, settextLayoutLength] = useState(false);
  let [datadayaktif, setdatadayaktifs] = useState(
    props.route.params.datadayaktif ? props.route.params.datadayaktif : {}
  );
  let [dataalbumaktif, setdataalbumaktif] = useState({});
  const [dataweather, setData] = useState({});
  const [icons, setIcons] = useState({
    "01d": "w-sunny",
    "02d": "w-partly_cloudy",
    "03d": "w-cloudy",
    "04d": "w-fog",
    "09d": "w-fog_rain",
    "10d": "w-sunny_rainy",
    "11d": "w-thunderstrom",
    "13d": "w-snowflakes",
    "50d": "w-windy",
    "01n": "w-sunny",
    "02n": "w-partly_cloudy",
    "03n": "w-cloudy",
    "04n": "w-fog",
    "09n": "w-fog_rain",
    "10n": "w-sunny_rainy",
    "11n": "w-thunderstrom",
    "13n": "w-snowflakes",
    "50n": "w-windy",
  });

  const type = {
    custom: t("customActivity"),
    event: t("event"),
    google: t("destinationFromGoogle"),
    destination: t("destination"),
  };

  // const jams = [
  //   "00",
  //   "01",
  //   "02",
  //   "03",
  //   "04",
  //   "05",
  //   "06",
  //   "07",
  //   "08",
  //   "09",
  //   "10",
  //   "11",
  //   "12",
  //   "13",
  //   "14",
  //   "15",
  //   "16",
  //   "17",
  //   "18",
  //   "19",
  //   "20",
  //   "21",
  //   "22",
  //   "23",
  //   "24",
  // ];
  // const menits = [
  //   "00",
  //   "05",
  //   "15",
  //   "20",
  //   "25",
  //   "30",
  //   "35",
  //   "40",
  //   "45",
  //   "50",
  //   "59",
  // ];

  const jams = [...Array(24).keys()]
    .map((x) => `${x}`)
    .map((y) => (y.length === 1 ? `0${y}` : y));
  const menits = [...Array(60).keys()]
    .map((x) => `${x}`)
    .map((y) => (y.length === 1 ? `0${y}` : y));

  const jamsindex = [...Array(12).keys()]
    .map((x) => `${x}`)
    .map((y) => (y.length === 1 ? `0${y}` : y));

  let [modalmenuday, setModalmenuday] = useState(false);
  let [Modalcustom, setModalcustom] = useState(false);
  let [textinput, setInput] = useState("");
  let [indexinput, setIndexInput] = useState("");
  let [positiondate, setPositiondate] = useState("");
  let [modal, setModal] = useState(false);
  let [modaldate, setModaldate] = useState(false);
  let [jamer, setjamer] = useState("00");
  let [menor, setmenor] = useState("00");
  let [idactivity, setidactivity] = useState("");
  let [types, settypes] = useState("");
  let [modalmenu, setModalmenu] = useState(false);
  let [showside, setshowside] = useState(false);
  let [modalcover, setmodalcover] = useState(false);
  let [modalAlbum, setmodalAlbum] = useState(false);
  let [modalTrip, setmodalTrip] = useState(false);
  let [modalDelete, setModalDelete] = useState(false);
  let [modalLeaveTrip, setModalLeaveTrip] = useState(false);
  let [modalDeleteTrip, setModalDeleteTrip] = useState(false);
  let [soon, setSoon] = useState(false);
  const ref = React.useRef(null);

  let [users, setuser] = useState(setting.user);
  const loadasync = async () => {
    try {
      await _Refresh();
    } catch (error) {
      Alert.alert("Error:", "No Internet Connection");
    }
  };
  let [Anggota, setAnggota] = useState(null);

  let [loading, setloading] = useState(false);
  let [statusUsers, setStatusUsers] = useState("");
  let [backStatus, setBackStatus] = useState(true);

  const {
    data: datadetail,
    loading: loadingdetail,
    error: errordetail,
    refetch: _Refresh,
  } = useQuery(ItineraryDetails, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    pollInterval: 500,
    variables: { id: itineraryId },
  });

  const {
    data: dataAlbum,
    loading: loadingAlbum,
    error: errorAlbum,
    refetch: GetAlbum,
  } = useQuery(album, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    variables: { itinerary_id: itineraryId },
  });

  const GetTimeline = async (id) => {
    try {
      setidDay(id ? id : idDay);
      await GetTimelin();
    } catch (error) {
      Alert.alert("Error: ", error);
    }
  };

  const EndTimeConverter = (datetime) => {
    let date = datetime.split(" ")[0];
    return `${date} 23:59:59`;
  };

  const [
    mutationdeleteItinerary,
    { loading: loadingdelete, data: datadelete, error: errordelete },
  ] = useMutation(Deleteitinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

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

        props.navigation.navigate("BottomStack", {
          screen: "TripBottomPlaning",
          params: { screen: "TripPlaning" },
        });
      }

      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  const [
    mutationleaveitinerary,
    { loading: loadingleave, data: dataleave, error: errorleave },
  ] = useMutation(LeaveItinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const _handleLeave = async (id) => {
    setloading(true);
    try {
      let response = await mutationleaveitinerary({
        variables: {
          itinerary_id: id,
        },
      });
      if (errorleave) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.left_itinerary_buddy.code !== 200) {
          throw new Error(response.data.left_itinerary_buddy.message);
        }

        props.navigation.dispatch(
          StackActions.replace("BottomStack", {
            screen: "TripPlaning",
            params: {
              index: status === "saved" ? 1 : 0,
            },
          })
        );

        props.navigation.navigate("BottomStack", {
          screen: "TripBottomPlaning",
          params: { screen: "TripPlaning" },
        });
      }

      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  let [dataSpreadtimeline, setDataSpread] = useState([]);
  const spreadtimeline = async (req) => {
    let xdata = [];
    let parent_id = null;

    for (var index in req) {
      let datas = { ...req[index] };
      // datas["id"] = req[index].name;
      if (
        req[index - 1] &&
        req[index].latitude == req[index - 1].latitude &&
        req[index].longitude == req[index - 1].longitude
      ) {
        datas["parent"] = false;
        datas["parent_id"] = parent_id;
      } else {
        datas["parent"] = true;
        datas["parent_id"] = null;
        parent_id = req[index].id;
      }

      xdata.push(datas);
    }
    await setDataSpread(xdata);
  };

  const [
    GetTimelin,
    { data: datatimeline, loading: loadingtimeline, error: errortimeline },
  ] = useLazyQuery(Timeline, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    variables: { id: idDay },
    onCompleted: (res) => {
      if (res) {
        setDataListItem(res?.day_timeline);
        spreadtimeline(res?.day_timeline);
      }
    },
  });

  // if (datatimeline && datatimeline?.day_timeline.length) {
  //   dataList = datatimeline.day_timeline;
  // }

  const setdatadayaktif = (data) => {
    setdatadayaktifs(data);
    props.navigation.setParams({ datadayaktif: data });
  };

  const GetStartTime = ({ startt, type = "bold", size = "description" }) => {
    var starttime = startt.split(":");

    return (
      <Text size={size} type={type} style={{}}>
        {starttime[0]}:{starttime[1]}
      </Text>
    );
  };

  const GetEndTime = ({ startt, dur, type = "bold", size = "description" }) => {
    var duration = dur.split(":");
    var starttime = startt.split(":");

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
    if (menit == 60 && menit > 59) {
      jam = jam + 1;
      menit = menit - 60;
    } else if (menit != 60 && menit > 59) {
      jam = jam + 1;
      menit = menit - 60;
    }

    return (
      <Text size={size} type={type} style={{}}>
        {jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam}:
        {menit < 10 ? "0" + menit : menit}
      </Text>
    );
  };

  const Getdurasi = (durasi) => {
    durasi = durasi.split(":");
    return (
      parseFloat(durasi[0]) +
      " " +
      t("hours") +
      " " +
      (parseFloat(durasi[1]) > 0
        ? parseFloat(durasi[1]) + " " + t("minutes")
        : " ")
    );
  };

  const HitungWaktu = ({ lat1, lon1, lat2, lon2, unit, kecepatan }) => {
    let jarak = Distance({
      lat1: lat1,
      lon1: lon1,
      lat2: lat2,
      lon2: lon2,
      unit: unit,
    });
    let hasil = jarak / kecepatan;
    let hasils = parseFloat(hasil).toFixed(2);

    let bahan = hasils.split(".");

    let jam = parseFloat(bahan[1]);

    return (
      (hasil.toFixed(0) >= 1 ? hasil.toFixed(0) + " " + t("hr") : "") +
      (jam > 0 && jam < 60
        ? " " + jam + " " + t("min")
        : hasil > 0.6 && hasil.toFixed(0) < 1
        ? "1" + t("hr") + " " + (bahan[1] - 60) + " " + t("min")
        : jam
        ? " " + (jam - 60) + " " + t("min")
        : "1" + " " + t("min"))
    );
  };

  const dateFormatr = (date) => {
    var x = date.split(" ");
    return dateFormats(x[0]);
  };

  const cekAnggota = (dta) => {
    setStatus(
      dta.status === "D" ? "edit" : dta.status === "F" ? "finish" : "saved"
    );
    datadetail?.itinerary_detail?.buddy.map((item, index) => {
      if (item.user_id === users?.id) {
        setStatusUsers(item.isadmin);
      }
    });
    let anggota = dta.buddy.findIndex((k) => k["user_id"] === users?.id);
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          {anggota !== -1 ? (
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
          ) : null}
        </View>
      ),
    });
    if (anggota !== -1) {
      setAnggota(true);
      return true;
    } else {
      setAnggota(false);
      return false;
    }
  };

  const [
    mutationUploadCover,
    { loading: loadingupload, data: dataupload, error: errorupload },
  ] = useMutation(Updatecover, {
    context: {
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    },
  });

  const upload = async (data) => {
    setloading(true);

    if (data) {
      let files = new ReactNativeFile({
        uri: data.path,
        type: data.mime,
        name: "cover.jpeg",
      });

      try {
        let response = await mutationUploadCover({
          variables: {
            itinerary_id: itineraryId,
            file: files,
          },
        });
        if (errorupload) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (response.data.upload_cover_itinerary_v2.code !== 200) {
            throw new Error(response.data.upload_cover_itinerary_v2.message);
          }
          startRefreshAction();
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
      setmodalcover(false), upload(image);
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
      setmodalcover(false), upload(image);
    });
  };

  const [
    mutationUploadAlbum,
    {
      loading: loadinguploadAlbum,
      data: datauploadAlbum,
      error: erroruploadAlbum,
    },
  ] = useMutation(UploadfotoAlbum, {
    context: {
      headers: {
        "Content-Type": "multipart/form-data",

        // "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const pickcameraAlbum = async () => {
    ImagePicker.openCamera({
      cropping: true,
      freeStyleCropEnabled: true,
      // includeBase64: true,
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      // compressImageQuality: 0.7,
    }).then((image) => {
      let hasil = [];

      let files = new ReactNativeFile({
        uri: image.path,
        type: image.mime,
        name: image.modificationDate,
      });

      hasil.push(files);
      setmodalAlbum(false);

      uploadAlbum(hasil);
    });
  };

  const pickGalleryAlbum = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });
      let hasil = [];
      for (const res of results) {
        let files = new ReactNativeFile({
          uri: res.uri,
          type: res.type,
          name: res.name,
        });
        hasil.push(files);
      }
      await setmodalAlbum(false);
      await uploadAlbum(hasil);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  let [idupload, setidupload] = useState(null);

  const uploadAlbum = async (data) => {
    // return false;
    setmodalAlbum(false);
    setloading(true);

    try {
      let response = await mutationUploadAlbum({
        variables: {
          album_id: dataalbumaktif?.id,
          itinerary_id: itineraryId,
          file: data,
        },
      });

      if (erroruploadAlbum) {
        throw new Error("Error Input");
      }

      if (response.data) {
        if (response.data.uploadalbums.code !== 200) {
          throw new Error(response.data.uploadalbums.message);
        }
        // Alert.alert(t('success'));
        startRefreshAction();
        loadasync();
        // props.navigation.goBack();
      }
      setloading(false);
    } catch (error) {
      Alert.alert("" + error);
      setloading(false);
    }
  };

  const getcity = (data, city) => {
    var namakota = "";
    var hasil = "";
    // for (var x of data) {
    //   if (x.city !== namakota && x.city !== null) {
    //     namakota = x.city;
    //     hasil += Capital({ text: namakota }) + " - ";
    //   }
    // }
    hasil += Capital({ text: data[0]?.city ? data[0]?.city : city });
    return hasil;
  };

  const _fetchItem = async (kota, lat, long) => {
    try {
      if (lat && long) {
        let response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?lat=" +
            lat +
            "&lon=" +
            long +
            "&appid=366be4c20ca623155ffc0175772909bf"
        );
        let responseJson = await response.json();
        setData(responseJson);
      } else {
        let response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            kota.toLowerCase() +
            "&appid=366be4c20ca623155ffc0175772909bf"
        );
        let responseJson = await response.json();
        setData(responseJson);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [
    mutationDeleteDay,
    { loading: Loadingdeleteday, data: datadeleteDay, error: errordeleteday },
  ] = useMutation(DeleteDay, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const _handledeleteDay = async (iditinerary, idDay) => {
    if (datadetail?.itinerary_detail?.day?.length > 1) {
      try {
        let response = await mutationDeleteDay({
          variables: {
            itinerary_id: iditinerary,
            day_id: idDay,
          },
        });
        if (errordeleteday) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.delete_day.code !== 200) {
            throw new Error(response.data.delete_day.message);
          }

          setdatadayaktif(
            indexnya !== 0
              ? datadetail?.itinerary_detail?.day[indexnya - 1]
              : datadetail?.itinerary_detail?.day[indexnya]
          );
          setidDay(
            indexnya !== 0
              ? datadetail?.itinerary_detail?.day[indexnya - 1].id
              : datadetail?.itinerary_detail?.day[indexnya].id
          );

          setIndexnya(indexnya !== 0 ? indexnya - 1 : indexnya);
          setModalmenuday(false);
          _Refresh();
        }
      } catch (error) {
        await setModalmenuday(false);
        Alert.alert("Error: " + error);
      }
    } else {
      await setModalmenuday(false);
      Alert.alert(t("alertdaynot"));
    }
  };

  const saveNotes = async () => {
    var tempData = [...dataList];
    let x = { ...tempData[indexinput] };
    x.note = textinput;
    tempData.splice(indexinput, 1, x);
    await setDataListItem(tempData);
    await setModal(false);
    await setidDay(idDay);
    savetimeline(tempData);
  };

  const bukaModal = (text = null, index) => {
    if (text) {
      setInput(text);
    } else {
      setInput("");
    }
    setIndexInput(index);
    setModal(true);
  };

  const openModaldate = async (index, starts, durati) => {
    let indexBefore = index - 1;

    if (indexBefore == 0) {
      setTypeactivity(
        dataList[0].detail_accomodation ? dataList[0].detail_accomodation : ""
      );
    } else {
      setTypeactivity("");
    }

    var duration = durati.split(":");
    var starttime = starts.split(":");

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);

    if (menit > 59) {
      jam = jam + 1;
      menit -= 60;
    }

    await setIndexdate(index);

    await setjamstart(starttime[0]);
    await setmenitstart(starttime[1]);

    await setjamend(jam < 10 ? "0" + (jam < 0 ? 0 : jam) : "" + jam);
    await setmenitend(menit < 10 ? "0" + menit : "" + menit);

    await setModaldate(true);
    await setIndexInput(index);
  };

  const caridurasi = (startt, end) => {
    var endtmine = end ? end.split(":") : "00:00:00".split(":");
    var starttime = startt ? startt.split(":") : "00:00:00".split(":");

    var jam = parseFloat(endtmine[0]) - parseFloat(starttime[0]);

    var menit = parseFloat(endtmine[1]) - parseFloat(starttime[1]);
    if (menit > 59) {
      menit = menit - 60;
    }

    return (
      (jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam) +
      ":" +
      (menit < 10 ? "0" + menit : menit) +
      ":00"
    );
  };

  const setTime = async (
    jamstarts,
    menitstarts,
    jamends,
    menitends,
    dataLists,
    ordercurrent
  ) => {
    await setModaldate(false);

    let starttimes = jamstarts + ":" + menitstarts + ":00";

    let jams = parseFloat(jamends) - parseFloat(jamstarts);

    let menits = parseFloat(menitends) + 60 - parseFloat(menitstarts);

    if (menits > 59) {
      menits = menits - 60;
    }

    let jamakhirs = jams < 10 ? "0" + (jams < 0 ? 0 : jams) : jams;
    let menitakhirs = menits < 10 ? "0" + menits : menits;
    let durations = jamakhirs + ":" + menitakhirs + ":00";

    let datax = [...dataLists];

    let dataganti = { ...datax[indexinput] };

    dataganti.time = starttimes;
    dataganti.duration = durations;

    if (dataganti.detail_flight) {
      let dateArr = dataganti.detail_flight.arrival.split(" ")[0];
      let timeArr = dataganti.detail_flight.arrival.split(" ")[1];
      let timeFinal = `${dateArr} ${jamends}:${menitends}:00`;

      dataganti.detail_flight = {
        ...dataganti.detail_flight,
        arrival: timeFinal,
      };
    }

    if (datax[parseFloat(indexinput) - 1]) {
      let timesebelum = hitungDuration({
        startt: datax[parseFloat(indexinput) - 1].time,
        dur: datax[parseFloat(indexinput) - 1].duration,
      });

      let timestartsebelum = datax[parseFloat(indexinput) - 1].time.split(":");

      timesebelum = timesebelum.split(":");
      let bandingan = starttimes.split(":");

      timestartsebelum = parseFloat(timestartsebelum[0]);
      let jamsebelum = parseFloat(timesebelum[0]);
      let jamsesesudah = parseFloat(bandingan[0]);

      if (jamsesesudah > timestartsebelum) {
        dataganti.time = hitungDuration({
          startt: datax[parseFloat(indexinput) - 1].time,
          dur: datax[parseFloat(indexinput) - 1].duration,
        });
        // let a = caridurasi(datax[parseFloat(indexinput) - 1].time, starttimes);

        // let dataset = { ...datax[parseFloat(indexinput) - 1] };
        // dataset.duration = a;
        // datax.splice(parseFloat(indexinput) - 1, 1, dataset);
      } else {
        dataganti.time = hitungDuration({
          startt: datax[parseFloat(indexinput) - 1].time,
          dur: datax[parseFloat(indexinput) - 1].duration,
        });
      }
    }

    datax.splice(indexinput, 1, dataganti);

    var x = 0;
    var order = 1;

    for (var y in datax) {
      let datareplace = { ...datax[y] };
      datareplace.order = order;
      if (datax[y - 1]) {
        if (datax[y - 1].detail_flight) {
          // longitude & latitude index sebelum custom
          var LongBefore = datax[y - 1].detail_flight.longitude_arrival;
          var LatBefore = datax[y - 1].detail_flight.latitude_arrival;
        } else {
          var LongBefore = datax[y - 1].longitude;
          var LatBefore = datax[y - 1].latitude;
        }

        if (datax[y].detail_flight) {
          var LongCurrent = datax[y].detail_flight.longitude_departure;
          var LatCurrent = datax[y].detail_flight.latitude_departure;
        } else {
          // longitude & latitude index custom
          var LongCurrent = datax[y].longitude;
          var LatCurrent = datax[y].latitude;
        }
        // // longitude & latitude index sebelum custom
        // let LongBefore = datax[y - 1].longitude;
        // let LatBefore = datax[y - 1].latitude;
        // // longitude & latitude index custom
        // let LongCurrent = datax[y].longitude;
        // let LatCurrent = datax[y].latitude;
        // kondisi jika lokasi yang sama dan aktivitas berbeda
        if (LongBefore == LongCurrent || LatBefore == LatCurrent) {
          var newtime = datax[y - 1].time;
        } else {
          // rumus hitung jarak
          let jarak = Distance({
            lat1: LatBefore,
            lon1: LongBefore,
            lat2: LatCurrent,
            lon2: LongCurrent,
            unit: "km",
          });
          // rumus hitung waktu
          let waktutemp = jarak / 50;
          let waktu = parseFloat(waktutemp).toFixed(2);
          // pecah hasil waktu
          let split = waktu.split(".");
          let jamtemp = "";
          let menittemp = "";

          if (split[0] > 1) {
            jamtemp = split[1];
            if (split[1] > 0 && split[1] < 60) {
              menittemp = split[1];
            } else {
              jamtemp = split[0] + 1;
              menittemp = split[1] - 60;
            }
          } else {
            if (waktu > 0.6) {
              jamtemp = 1;
              menittemp = split[1] > 60 ? split[1] - 60 : split[1];
            } else {
              jamtemp = 0;
              menittemp = split[1];
            }
          }
          let time = datax[y - 1].time;
          let splittime = time.split(":");
          let durationold = datax[y - 1].duration;
          let splitdurations = durationold.split(":");
          //menit total untuk mendapatkan menit yang lebih dari 59
          let menitotal =
            parseFloat(splittime[1]) +
            parseFloat(splitdurations[1]) +
            parseFloat(menittemp);
          // let durasitemp = `${jamtemp}:${menittemp}`;
          let newjam = parseFloat(jamtemp) + parseFloat(splittime[0]);
          let newmenit = parseFloat(menittemp) + parseFloat(splittime[1]);
          var newtime =
            menitotal > 59
              ? `${newjam + 1}:${newmenit - 60}`
              : `${newjam}:${newmenit}`;
        }

        datareplace.time = await hitungDuration({
          startt: newtime,
          dur: datax[y - 1].duration,
        });
        await datax.splice(y, 1, datareplace);
      }

      x++;
      order++;
    }

    let sum = datax.reduce(
      (itinerary, item) => itinerary.add(moment.duration(item.duration)),
      moment.duration()
    );

    let jampert = datax[0].time.split(":");
    let jampertama = parseFloat(jampert[0]);
    let menitpertama = parseFloat(jampert[1]);
    let durjam = Math.floor(sum.asHours());
    let durmin = sum.minutes();
    let hasiljam = jampertama + durjam;
    let hasilmenit = menitpertama + durmin;

    let lastTime = datax[datax.length - 1].time;
    let lastDuration = datax[datax.length - 1].duration;
    let splitLastTime = lastTime.split(":");
    let splitDuration = lastDuration.split(":");

    let AlertTime = parseFloat(splitLastTime[0]) + parseFloat(splitDuration[0]);

    if (AlertTime <= 23) {
      let dataday = { ...datadayaktif };

      if (AlertTime === 23 && splitLastTime[1] <= 59) {
        savetimeline(datax);
        dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        await setdatadayaktif(dataday);
      } else if (AlertTime <= 23) {
        savetimeline(datax);
        dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        await setdatadayaktif(dataday);
      } else {
        Alert.alert(t("AktivitasFull"));
      }
    } else {
      Alert.alert(t("AktivitasFull"));
    }
  };

  const hitungDuration = ({ startt, dur }) => {
    var duration = dur ? dur.split(":") : "00:00:00";
    var starttime = startt ? startt.split(":") : "00:00:00";

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);

    if (menit == 60 && menit > 59) {
      jam = jam + 1;
      menit = menit - 60;
    } else if (menit != 60 && menit > 59) {
      jam = jam + 1;
      menit = menit - 60;
    }

    return (
      (jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam) +
      ":" +
      (menit < 10 ? "0" + menit : menit) +
      ":00"
    );
  };

  const [
    mutationSaveTimeline,
    { loading: loadingSave, data: dataSave, error: errorSave },
  ] = useMutation(UpdateTimeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const savetimeline = async (datakiriman) => {
    setloading(true);
    try {
      let response = await mutationSaveTimeline({
        variables: {
          idday: idDay,
          value: JSON.stringify(datakiriman),
        },
      });

      if (loadingSave) {
        // Alert.alert("Loading!!");
      }
      if (errorSave) {
        throw new Error("Error Input");
      }

      if (response.data) {
        if (response.data.update_timeline.code !== 200) {
          throw new Error(response.data.update_timeline.message);
        }
        setloading(false);
        startRefreshAction();
        GetTimelin();
      }
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  let [idTarget, setIdtarget] = useState(null);

  const bukamodalmenu = (id, type, item) => {
    setidactivity(id);
    settypes(type);

    if (item.destination_id) {
      setIdtarget(item.destination_id);
    } else if (item.event_id) {
      setIdtarget(item.event_id);
    } else {
      setIdtarget(null);
    }
    // setModalDelete(true);
    setModalmenu(true);
  };

  const [
    mutationDeleteActivity,
    {
      loading: Loadingdeleteactivity,
      data: datadeleteactivity,
      error: errordeleteactivity,
    },
  ] = useMutation(DeleteActivity, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const deleteactivity = async (iditinerarys, idactivitys, typess) => {
    try {
      setloading(true);
      let response = await mutationDeleteActivity({
        variables: {
          itinerary_id: iditinerarys,
          id_activity: idactivitys,
          type: typess,
        },
      });
      if (errordeleteactivity) {
        throw new Error("Error Input");
      }
      if (response.data) {
        setloading(false);
        if (response.data.delete_activity.code !== 200) {
          console.log(
            "Error Delete Activity",
            response.data.delete_activity.message
          );
          // throw new Error(response.data.delete_activity.message);
        }

        var Xdata = [...dataList];
        var inde = Xdata.findIndex((k) => k["id"] === idactivitys);

        if (inde !== -1) {
          Xdata.splice(inde, 1);

          var x = 0;
          var order = 1;
          for (var y in Xdata) {
            Xdata[y].order = order;

            if (Xdata[y - 1]) {
              if (Xdata[y - 1].detail_flight) {
                // longitude & latitude index sebelum custom
                var LongBefore = Xdata[y - 1].detail_flight.longitude_arrival;
                var LatBefore = Xdata[y - 1].detail_flight.latitude_arrival;
              } else {
                var LongBefore = Xdata[y - 1].longitude;
                var LatBefore = Xdata[y - 1].latitude;
              }

              if (Xdata[y].detail_flight) {
                var LongCurrent = Xdata[y].detail_flight.longitude_departure;
                var LatCurrent = Xdata[y].detail_flight.latitude_departure;
              } else {
                // longitude & latitude index custom
                var LongCurrent = Xdata[y].longitude;
                var LatCurrent = Xdata[y].latitude;
              }

              // // longitude & latitude index sebelum custom
              // let LongBefore = Xdata[y - 1].longitude;
              // let LatBefore = Xdata[y - 1].latitude;
              // // longitude & latitude index custom
              // let LongCurrent = Xdata[y].longitude;
              // let LatCurrent = Xdata[y].latitude;

              if (LongBefore == LongCurrent || LatBefore == LatCurrent) {
                var newtime = Xdata[y - 1].time;
              } else {
                // rumus hitung jarak
                let jarak = Distance({
                  lat1: LatBefore,
                  lon1: LongBefore,
                  lat2: LatCurrent,
                  lon2: LongCurrent,
                  unit: "km",
                });
                // rumus hitung waktu
                let waktutemp = jarak / 50;
                let waktu = parseFloat(waktutemp).toFixed(2);
                // pecah hasil waktu
                let split = waktu.split(".");

                let jamtemp = "";
                let menittemp = "";

                if (split[0] > 1) {
                  jamtemp = split[1];
                  if (split[1] > 0 && split[1] < 60) {
                    menittemp = split[1];
                  } else {
                    jamtemp = split[0] + 1;
                    menittemp = split[1] - 60;
                  }
                } else {
                  if (waktu > 0.6) {
                    jamtemp = 1;
                    menittemp = split[1] > 60 ? split[1] - 60 : split[1];
                  } else {
                    jamtemp = 0;
                    menittemp = split[1];
                  }
                }
                let time = Xdata[y - 1].time;
                let splittime = time.split(":");
                // let durasitemp = `${jamtemp}:${menittemp}`;
                let durationold = Xdata[y - 1].duration;
                let splitdurations = durationold.split(":");

                //menit total untuk mendapatkan menit yang lebih dari 59
                let menitotal =
                  parseFloat(splittime[1]) +
                  parseFloat(splitdurations[1]) +
                  parseFloat(menittemp);

                let newjam = parseFloat(jamtemp) + parseFloat(splittime[0]);
                let newmenit = parseFloat(menittemp) + parseFloat(splittime[1]);
                var newtime =
                  menitotal > 59
                    ? `${newjam + 1}:${newmenit - 60}`
                    : `${newjam}:${newmenit}`;
              }

              Xdata[y].time = hitungDuration({
                startt: newtime,
                dur: Xdata[y - 1].duration,
              });
            }
            x++;
            order++;
          }

          if ((x = Xdata.length)) {
            try {
              let response = await mutationSaveTimeline({
                variables: {
                  idday: idDay,
                  value: JSON.stringify(Xdata),
                },
              });

              if (errorSave) {
                throw new Error("Error Input");
              }
              if (response.data) {
                if (response.data.update_timeline.code !== 200) {
                  console.log(
                    "Error Save Time line pada delete activity",
                    response.data.update_timeline.message
                  );
                  // throw new Error(response.data.update_timeline.message);
                }
                GetTimelin();
              }
            } catch (error) {
              console.log("errorTimeline", error);
              Alert.alert("" + error);
            }
          }
          await GetTimelin();
        }

        setModalDelete(false);
      }
    } catch (error) {
      setloading(false);
      console.log("errorXdata", error);
      Alert.alert("" + error);
      setModalDelete(false);
    }
  };

  const _handlerBack = async () => {
    props.route.params.onbackhandler === "chooseDay"
      ? props.navigation.navigate("TripBottomPlaning")
      : props.route.params.from == "itin_detail_back_to_itin_destination"
      ? props.navigation.navigate("TripBottomPlaning")
      : props.route.params.from == "after_choose_day"
      ? props.navigation.navigate("TripBottomPlaning")
      : props.navigation.goBack();
  };

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", hardwareBack);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", hardwareBack);
    };
  }, [props.navigation, hardwareBack]);

  const hardwareBack = useCallback(() => {
    _handlerBack();
    return true;
  }, []);

  const [
    mutationChangestatus,
    { loading: loadingchange, data: datachange, error: errorchange },
  ] = useMutation(ChangeStatus, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  let [errors, seterrors] = useState(false);
  let [modalerrors, setmodalerrors] = useState(false);

  const completePlan = async () => {
    _Refresh();
    setloading(true);
    for (var i of datadetail?.itinerary_detail?.day) {
      let x = i.total_hours.split(":");
      let y = parseFloat(x[0]);
      if (y < 1) {
        setloading(false);
        seterrors(true);
        setmodalerrors(true);
        // Alert.alert(
        //   "" + t("Activity") + " " + t("day") + " " + i.day + " " + t("emptys")
        // );
        return false;
      }
    }

    try {
      let response = await mutationChangestatus({
        variables: {
          id: itineraryId,
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

        setStatus("saved");
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(ItineraryLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(ItineraryUnliked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const _liked = async (id, index) => {
    try {
      let response = await mutationliked({
        variables: {
          id: itineraryId,
          qty: 1,
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
          response.data.setItineraryFavorit.code === 200 ||
          response.data.setItineraryFavorit.code === "200"
        ) {
          // Alert.alert("succes");
          _Refresh();
        } else {
          throw new Error(response.data.setItineraryFavorit.message);
        }
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const _unliked = async (id, index) => {
    try {
      let response = await mutationUnliked({
        variables: {
          id: itineraryId,
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
          response.data.unsetItineraryFavorit.code === 200 ||
          response.data.unsetItineraryFavorit.code === "200"
        ) {
          // Alert.alert("succes");
          _Refresh();
        } else {
          throw new Error(response.data.unsetItineraryFavorit.message);
        }
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };
  // ===============================================================================================================================================================================
  /** ---------------------------------------------------------------------------------------------------------------
   * ref
   */
  // const HeaderComponent = {
  //   headerShown: true,
  //   title: "",
  //   headerTransparent: true,
  //   headerTintColor: "white",
  //   headerTitle: "",
  //   headerMode: "screen",
  //   headerStyle: {
  //     backgroundColor: "#146463",
  //     elevation: 0,
  //     borderBottomWidth: 0,
  //   },
  //   headerTitleStyle: {
  //     fontFamily: "Lato-Bold",
  //     fontSize: 14,
  //     color: "white",
  //   },
  //   headerLeftContainerStyle: {
  //     background: "#FFF",

  //     marginLeft: 10,
  //   },

  //   headerRightStyle: {},
  //   headerLeft: () => (
  //     <Button
  //       text={""}
  //       size="medium"
  //       type="circle"
  //       variant="transparent"
  //       onPress={() => {
  //         _handlerBack();
  //       }}
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
  //   ),
  // };

  let scrollY = useRef(new Animated.Value(0)).current;

  const headerScrollY = useRef(new Animated.Value(0)).current;
  // for capturing header scroll on Android
  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);
  const refreshStatusRef = useRef(false);

  //   let HeaderHeight = HeaderHeight;
  let HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 75 : 60;
  let HEADER_SCROLL_DISTANCE = HeaderHeight - HEADER_MIN_HEIGHT;

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });
  const textOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });
  const textOpacitys = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const headerHeights = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HeaderHeight, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const contentTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 50],
    extrapolate: "clamp",
  });

  const warna = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ["#464646", "#fff"],
    // extrapolate: "clamp",
  });
  const warna2 = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: ["#838383", "#fff", "#fff"],
    extrapolate: "clamp",
  });

  const textLeft = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 50, 50],
    extrapolate: "clamp",
  });

  const textLefts = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [27, 0, 0],
    extrapolate: "clamp",
  });

  const textTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 20, 50],
    extrapolate: "clamp",
  });

  const textTops = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [-15, -10, -15],
    extrapolate: "clamp",
  });

  const textSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1.3, 1, 1],
    extrapolate: "clamp",
  });

  /**
   * PanResponder for header
   */
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        syncScrollOffset();
        return false;
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderEnd: (evt, gestureState) => {
        handlePanReleaseOrEnd(evt, gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        const curListRef = listRefArr.current.find(
          (ref) => ref.key === routes[_tabIndex.current].key
        );
        const headerScrollOffset = -gestureState.dy + headerScrollStart.current;
        if (curListRef.value) {
          // scroll up
          if (headerScrollOffset > 0) {
            curListRef.value.scrollToOffset({
              offset: headerScrollOffset,
              animated: false,
            });
            // start pull down
          } else {
            if (Platform.OS === "ios") {
              curListRef.value.scrollToOffset({
                offset: headerScrollOffset / 3,
                animated: false,
              });
            } else if (Platform.OS === "android") {
              if (!refreshStatusRef.current) {
                headerMoveScrollY.setValue(headerScrollOffset / 1.5);
              }
            }
          }
        }
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollStart.current = scrollY._value;
      },
    })
  ).current;

  /**
   * PanResponder for list in tab scene
   */
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return false;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation();
      },
    })
  ).current;

  /**
   * effect
   */
  useEffect(() => {
    loadasync();
    scrollY.addListener(({ value }) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });
    headerScrollY.addListener(({ value }) => {
      listRefArr.current.forEach((item) => {
        if (item.key !== routes[tabIndex].key) {
          return;
        }
        if (value > HeaderHeight || value < 0) {
          headerScrollY.stopAnimation();
          syncScrollOffset();
        }
        if (item.value && value <= HeaderHeight) {
          item.value.scrollToOffset({
            offset: value,
            animated: false,
          });
        }
      });
    });
    return () => {
      scrollY.removeAllListeners();
      headerScrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      // startRefreshAction();
      GetTimelin();
    });
    return unsubscribe;
  }, [props.navigation]);

  /**
   *  helper functions
   */
  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex.current].key;

    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              });
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };

  const startRefreshAction = () => {
    if (Platform.OS === "ios") {
      listRefArr.current.forEach((listRef) => {
        listRef.value.scrollToOffset({
          offset: -50,
          animated: true,
        });
      });
      refresh().finally(() => {
        syncScrollOffset();
        // do not bounce back if user scroll to another position
        if (scrollY._value < 0) {
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      });
    } else if (Platform.OS === "android") {
      Animated.timing(headerMoveScrollY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
      refresh().finally(() => {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePanReleaseOrEnd = (evt, gestureState) => {
    syncScrollOffset();
    headerScrollY.setValue(scrollY._value);
    if (Platform.OS === "ios") {
      if (scrollY._value < 0) {
        if (scrollY._value < -PullToRefreshDist && !refreshStatusRef.current) {
          startRefreshAction();
          _Refresh();
          GetTimelin();
        } else {
          // should bounce back
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      } else {
        if (Math.abs(gestureState.vy) < 0.2) {
          return;
        }
        Animated.decay(headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          syncScrollOffset();
        });
      }
    } else if (Platform.OS === "android") {
      if (
        headerMoveScrollY._value < 0 &&
        headerMoveScrollY._value / 1.5 < -PullToRefreshDist
      ) {
        startRefreshAction();
        _Refresh();
        GetTimelin();
      } else {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };

  const onScrollEndDrag = (e) => {
    syncScrollOffset();

    const offsetY = e.nativeEvent.contentOffset.y;
    // iOS only
    if (Platform.OS === "ios") {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }

    // check pull to refresh
  };

  const refresh = async () => {
    refreshStatusRef.current = true;
    await new Promise((resolve, reject) => {
      _Refresh();
      GetAlbum();
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      refreshStatusRef.current = false;
    });
  };

  const cekTanggal = (starts) => {
    var start = "";
    var date1 = new Date(),
      start = starts.split(" ");
    var date2 = new Date(start[0]);
    // var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  };

  /**
   * render Helper
   */

  let statususer = "";

  let [aler, showAlert] = useState({
    show: false,
    judul: t("editPrivacyDisabled"),
    judulDetail: t("canNotChangePrivacy"),
    detail: t("notAdminTrip"),
  });

  const renderHeader = (rD) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 40],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    datadetail
      ? datadetail?.itinerary_detail?.buddy.map((item, index) => {
          if (item.user_id === users?.id) {
            statususer = item.isadmin;
          }
        })
      : null;

    return (
      <Animated.View
        onLayout={() => cekAnggota(rD ? rD : "D")}
        {...headerPanResponder.panHandlers}
        style={{
          transform: [{ translateY: y }],
          height: HeaderHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          backgroundColor: "#14646e",
        }}
      >
        {/* image animated */}

        <Animated.Image
          source={rD?.cover ? { uri: rD?.cover } : ItineraryKosong}
          style={{
            // opacity: imageOpacity,
            width: "100%",
            resizeMode: "cover",
            flex: 1,
          }}
        />

        <Animated.View
          style={{
            width: Dimensions.get("screen").width,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingBottom: 5,
            paddingTop: 10,
            backgroundColor: "#fff",
            // opacity: textOpacity,
            // alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                size="header"
                type="black"
                numberOfLines={2}
                onTextLayout={(x) => {
                  let lineFixed = (x.nativeEvent.lines.length - 1) * 10;

                  if (x.nativeEvent.lines.length > 1 && HeaderHeight < 320) {
                    setHeaderHeight(lineFixed + HeaderHeight);
                  }
                  setTambahan((x.nativeEvent.lines.length - 1) * 20 + 55);
                  if (x.nativeEvent.lines.length > 1) {
                    settextLayoutLength(true);
                  }
                }}
              >
                {datadetail?.itinerary_detail?.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 5,
                }}
              >
                {cekTanggal(
                  datadetail?.itinerary_detail?.start_date
                    ? datadetail?.itinerary_detail?.start_date
                    : "1999-01-01"
                ) <= 180 ? (
                  <Errorr width={15} height={15} style={{ marginRight: 5 }} />
                ) : null}
                <Text
                  size="small"
                  type="bold"
                  style={{
                    color:
                      cekTanggal(
                        datadetail?.itinerary_detail?.start_date
                          ? datadetail?.itinerary_detail?.start_date
                          : "1999-01-01"
                      ) <= 180
                        ? "#D75995"
                        : "#6c6c6c",
                  }}
                >
                  {/* {t("dates")} :{" "} */}
                  {datadetail && datadetail?.itinerary_detail
                    ? dateFormatr(datadetail?.itinerary_detail?.start_date) +
                      "  -  " +
                      dateFormatr(datadetail?.itinerary_detail?.end_date)
                    : null}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 60,
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >
              {/* <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: "#000",
                  marginRight: 6,
                }}
              ></View> */}
              <Ripple
                style={{
                  marginRight:
                    datadetail?.itinerary_detail?.isprivate === false ? 10 : 6,
                }}
                onPress={() =>
                  statususer
                    ? props.navigation.push("ItineraryStack", {
                        screen: "editprivacy",
                        params: {
                          isprivate: datadetail?.itinerary_detail?.isprivate,
                          id: datadetail?.itinerary_detail?.id,
                          token: token,
                        },
                      })
                    : showAlert({ ...aler, show: true })
                }
              >
                {datadetail?.itinerary_detail?.isprivate == false ? (
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      borderRadius: 30,
                      backgroundColor: "#daf0f2",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <World width={15} height={15} />
                  </View>
                ) : (
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      borderRadius: 30,
                      backgroundColor: "#daf0f2",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Lock width={15} height={15} />
                  </View>
                )}
              </Ripple>
            </View>
          </View>
          {datadetail &&
          datadetail?.itinerary_detail &&
          datadetail?.itinerary_detail?.isprivate === false ? (
            <Button
              onPress={() =>
                shareAction({
                  from: "itinerary",
                  target: itineraryId,
                })
              }
              type="circle"
              variant="bordered"
              size="small"
              style={{
                flexDirection: "row",
                width: 80,
                alignContent: "center",
                alignItems: "center",
                marginRight: 5,
              }}
            >
              <Sharegreen height={14} width={14} />
              <Text size="small" style={{ marginLeft: 5, color: "#209fae" }}>
                {t("share")}
              </Text>
            </Button>
          ) : null}
        </Animated.View>
        <Animated.View
          style={{
            // opacity: imageOpacity,
            // transform: [{ translateY: contentTranslate }],
            paddingVertical: 5,
            paddingHorizontal: 15,
            width: "100%",
            height: 55,
            backgroundColor: "white",
          }}
        >
          {datadetail && datadetail?.itinerary_detail ? (
            <TouchableOpacity
              onPress={() => {
                props.navigation.push("ItineraryBuddy", {
                  iditin:
                    datadetail && datadetail?.itinerary_detail
                      ? datadetail?.itinerary_detail?.id
                      : null,
                  token: token ? token : null,
                  dataitin:
                    datadetail && datadetail?.itinerary_detail
                      ? datadetail
                      : null,
                  databuddy:
                    datadetail && datadetail?.itinerary_detail
                      ? datadetail?.itinerary_detail?.buddy
                      : null,
                  created_by:
                    datadetail && datadetail?.itinerary_detail
                      ? datadetail?.itinerary_detail?.created_by
                      : null,
                });
              }}
              style={{
                flexDirection: "row",
                // marginTop: 5,
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: "center",
                alignContent: "center",
                justifyContent: "flex-start",
                borderRadius: 5,
                backgroundColor: "#daf0f2",
              }}
            >
              <View
                style={{
                  backgroundColor: "#209fae",
                  width: 5,
                  height: 15,
                  borderRadius: 5,
                  marginRight: 5,
                }}
              ></View>
              <Text
                size="small"
                type="bold"
                style={{
                  marginRight: 15,
                }}
              >
                {t("travelBuddy")} :
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                {datadetail
                  ? datadetail?.itinerary_detail?.buddy.map((value, i) => {
                      if (i < 4) {
                        return (
                          <View key={i}>
                            <Image
                              source={
                                value.user && value.user.picture
                                  ? {
                                      uri: value.user.picture,
                                    }
                                  : default_image
                              }
                              defaultSource={default_image}
                              style={{
                                resizeMode: "cover",
                                height: 30,
                                width: 30,
                                borderRadius: 15,
                                marginLeft: -10,
                                borderWidth: 1.5,
                                borderColor: "#fff",
                              }}
                            />
                          </View>
                        );
                      }
                    })
                  : null}

                {datadetail?.itinerary_detail?.buddy.length > 1 ? (
                  <View
                    style={{
                      paddingLeft: 5,
                      // alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <Text size="small" type="bold" numberOfLines={1}>
                      {Anggota
                        ? t("you") +
                          " + " +
                          (parseFloat(
                            datadetail?.itinerary_detail?.buddy.length
                          ) -
                            1)
                        : datadetail?.itinerary_detail?.buddy[0]?.user
                            ?.first_name +
                          " + " +
                          (parseFloat(
                            datadetail?.itinerary_detail?.buddy.length
                          ) -
                            1)}{" "}
                      {t("others")}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      paddingLeft: 5,
                      // alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <Text size="small" type="bold" numberOfLines={1}>
                      {Anggota
                        ? "You"
                        : datadetail?.itinerary_detail?.buddy[0]?.user
                            ?.first_name}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ) : null}
        </Animated.View>
      </Animated.View>
    );
  };

  const Formattime = (berangkat, tiba) => {
    let awal = berangkat.split(" ");
    let akhir = tiba.split(" ");
    return "" + awal[1].substring(0, 5) + " - " + akhir[1].substring(0, 5);
  };

  const RenderItinerary = ({ item, index }) => {
    const x = dataList && dataList.length - 1;

    return (
      <View
        style={{
          marginTop: -1,
          // height: item.note ? 210 : 170,
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            height: "100%",
            width: "20%",
            alignContent: "flex-end",
            alignItems: "flex-end",

            // paddingTop: 10,
            // paddingRight: 10,
          }}
        >
          {/* garis======================= */}

          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              // borderWidth: 1,
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                height: 25,
                marginRight: 4.2,

                // borderBottomWidth: 1,
                // borderRightWidth: index && index > 0 ? 1 : 0,
                borderRightWidth: index > 0 ? 0.5 : 0,
                borderRightColor: "#6C6C6C",
              }}
            ></View>

            <View
              style={{
                marginTop: -20,
                flexDirection: "row",
                position: "absolute",
                top: 25,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99,
              }}
            >
              {item.detail_accomodation ? null : (
                <View
                  style={{
                    width: "80%",
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    backgroundColor: "#daf0f2",

                    borderRadius: 5,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      status !== "saved" && Anggota
                        ? openModaldate(
                            index,
                            item.time ? item.time : "00:00:00",
                            item.duration ? item.duration : "00:00:00"
                          )
                        : null
                    }
                  >
                    {item.time ? (
                      <GetStartTime startt={item.time} />
                    ) : (
                      <Text size="description" type="bold">
                        00:00
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      status !== "saved" && Anggota
                        ? openModaldate(
                            index,
                            item.time ? item.time : "00:00:00",
                            item.duration ? item.duration : "00:00:00"
                          )
                        : null;
                    }}
                  >
                    {item.duration ? (
                      <GetEndTime
                        startt={item.time ? item.time : "00:00"}
                        dur={item.duration ? item.duration : "00:00"}
                      />
                    ) : (
                      <Text size="description" type="bold">
                        00:00
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {index > 0 &&
              dataList[index - 1] &&
              dataList[index].latitude == dataList[index - 1].latitude &&
              dataList[index].longitude == dataList[index - 1].longitude ? (
                <View
                  style={{
                    width: 10,
                    height: 10,

                    marginLeft: 5,
                  }}
                ></View>
              ) : (
                <View
                  style={{
                    zIndex: 99,
                    height: 10,
                    width: 10,

                    marginLeft: 5,
                    marginTop: item.detail_accomodation ? 20 : 0,
                    borderRadius: 10,
                    backgroundColor: "#209fae",

                    elevation: 3,
                    shadowColor: "#d3d3d3",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                  }}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                marginRight: 4.2,
                borderRightWidth: index < x ? 0.5 : 0,
                borderRightColor: "#6C6C6C",
              }}
            ></View>
          </View>

          {/* garis======================= */}
        </View>

        <View
          style={{
            height: "100%",
            width: "80%",

            paddingBottom: x == index ? 70 : 0,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              paddingLeft: 10,
              paddingRight: 2,
              paddingBottom: 1,
            }}
          >
            {index > 0 &&
            dataList[index - 1] &&
            dataList[index].latitude == dataList[index - 1].latitude &&
            dataList[index].longitude == dataList[index - 1].longitude ? (
              <View
                style={{
                  width: 20,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    borderLeftWidth: 0.5,
                    // borderBottomWidth: 0.5,
                    borderColor: "#6C6C6C",
                    height: 30,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 25,
                    zIndex: 99,
                    height: 10,
                    width: 10,

                    left: -5,
                    borderRadius: 10,
                    backgroundColor: "#209fae",
                    elevation: 3,
                    shadowColor: "#d3d3d3",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                  }}
                />
                {dataList[index + 1] &&
                dataList[index].latitude == dataList[index + 1].latitude &&
                dataList[index].longitude == dataList[index + 1].longitude ? (
                  <View
                    style={{
                      marginTop: -1,
                      borderLeftWidth: 0.5,
                      borderColor: "#6C6C6C",
                      flex: 1,
                    }}
                  />
                ) : null}
              </View>
            ) : null}
            <View
              style={{
                marginTop: 5,
                flex: 1,
                borderRadius: 5,
                marginBottom: 2,
                backgroundColor: "#fff",
                padding: 10,
                elevation: 3,
                shadowColor: "#d3d3d3",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",

                  justifyContent: "space-between",
                }}
              >
                {item.type !== "custom" ? (
                  <Image
                    source={
                      item.images ? { uri: item.images } : { uri: item.icon }
                    }
                    defaultSource={default_image}
                    style={{
                      height: 30,
                      width: 30,

                      resizeMode: "cover",
                      borderRadius: 15,
                    }}
                  />
                ) : item.detail_flight ? (
                  <View
                    style={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    <Flights height={25} width={25} />
                  </View>
                ) : item.detail_accomodation ? (
                  <View
                    style={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    <Stay height={25} width={25} />
                  </View>
                ) : item?.icon ? (
                  <View
                    style={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    <FunIcon
                      icon={"gb-tour"}
                      height={30}
                      width={30}
                      style={{
                        borderRadius: 15,
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    <FunIcon
                      icon={"i-tour"}
                      height={30}
                      width={30}
                      style={{
                        borderRadius: 15,
                      }}
                    />
                  </View>
                )}
                <View
                  style={{
                    flex: 1,

                    // borderWidth: 1,
                    // borderColor: "red",
                  }}
                >
                  <TouchableOpacity
                    style={{ flex: 1, paddingHorizontal: 10 }}
                    // onLongPress={status !== "saved" ? drag : null}
                    onPress={() => {
                      item.type === "custom"
                        ? props.navigation.navigate("detailCustomItinerary", {
                            data: dataSpreadtimeline,
                            dataList: dataList,
                            token: token,
                            idItin: itineraryId,
                            id: item.id,
                            idDay: idDay,
                            nameitin: datadetail?.itinerary_detail?.name,
                            startDate: datadetail?.itinerary_detail?.start_date,
                            endDate: EndTimeConverter(
                              datadetail?.itinerary_detail?.end_date
                            ),
                            datadayaktif: datadayaktif,
                            indexdata: index,
                            time: item.time,
                          })
                        : null;
                    }}
                  >
                    <Text size="label" type="bold" style={{}}>
                      {item.name}
                    </Text>
                    {!item?.type_custom ? (
                      <Text>
                        {Capital({
                          text: type[item.type],
                        })}
                      </Text>
                    ) : null}
                    {item?.type_custom ? (
                      item?.type_custom === "flight_outside" ? (
                        <View>
                          <Text>
                            {item?.detail_flight?.from} -{" "}
                            {item?.detail_flight?.destination}
                          </Text>
                          {item?.detail_flight?.departure &&
                          item?.detail_flight?.arrival ? (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <CalendarIcon
                                width={15}
                                height={15}
                                style={{ marginRight: 5 }}
                              />
                              {/* <Text>
                                {Formattime(
                                  item?.detail_flight?.departure,
                                  item?.detail_flight?.arrival
                                )}
                              </Text> */}
                              {item.time ? (
                                <GetStartTime
                                  startt={
                                    item?.detail_flight?.departure.split(" ")[1]
                                  }
                                  type="regular"
                                  size="description"
                                />
                              ) : (
                                <Text size="description" type="regular">
                                  00:00
                                </Text>
                              )}
                              <Text> - </Text>
                              {item.duration ? (
                                <GetEndTime
                                  startt={item.time ? item.time : "00:00"}
                                  dur={item.duration ? item.duration : "00:00"}
                                  type="regular"
                                  size="description"
                                />
                              ) : (
                                <Text size="small" type="regular">
                                  00:00
                                </Text>
                              )}
                            </View>
                          ) : null}
                          {/* <Text>flight_outside</Text> */}
                        </View>
                      ) : item?.type_custom === "flight_inside" ? (
                        <Text>flight_inside</Text>
                      ) : item?.type_custom === "accomodation_outside" ? (
                        <View>
                          {item?.detail_accomodation?.checkin ? (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <CalendarIcon
                                width={10}
                                height={10}
                                style={{ marginRight: 5 }}
                              />
                              <Text>
                                {dateFormatMDY(
                                  item?.detail_accomodation?.checkin
                                )}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      ) : item?.type_custom === "accomodation_inside" ? (
                        <Text>accomodation_inside</Text>
                      ) : null
                    ) : null}
                  </TouchableOpacity>
                </View>
                {status !== "saved" && Anggota ? (
                  <Button
                    size="small"
                    text=""
                    type="circle"
                    variant="transparent"
                    style={{}}
                    onPress={() => {
                      bukamodalmenu(item.id, item.type, item);
                    }}
                  >
                    <More width={15} height={15} />
                  </Button>
                ) : null}
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingLeft: 40,
                  paddingVertical: 5,
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  // borderWidth: 1,
                }}
              >
                <View>
                  {item?.type_custom ? (
                    item?.type_custom === "flight_outside" &&
                    item?.detail_flight?.booking_ref ? (
                      <View
                        style={{
                          flexDirection: "row",
                          width: normalize(100),
                        }}
                      >
                        <Text style={{ marginBottom: 5 }}>
                          {t("bookingRef")}
                        </Text>
                        <Text> : </Text>
                        <Text type="bold">
                          {item?.detail_flight?.booking_ref}
                        </Text>
                      </View>
                    ) : null
                  ) : null}

                  {item?.type_custom ? (
                    item?.type_custom === "accomodation_outside" &&
                    item?.detail_accomodation?.guest_name ? (
                      <View
                        style={{
                          flexDirection: "row",
                          width: normalize(100),
                        }}
                      >
                        <Text style={{ marginBottom: 5 }}>
                          {t("Guest Name")} :{" "}
                        </Text>
                        <Text type="bold">
                          {item?.detail_accomodation?.guest_name}
                        </Text>
                      </View>
                    ) : null
                  ) : null}
                  {item?.type_custom ? (
                    item?.type_custom === "accomodation_outside" &&
                    item?.detail_accomodation?.booking_ref ? (
                      <View
                        style={{
                          flexDirection: "row",

                          width: normalize(80),
                        }}
                      >
                        <Text style={{ marginBottom: 5, flexWrap: "wrap" }}>
                          {t("bookingRef")}
                        </Text>
                        <Text> : </Text>
                        <Text type="bold">
                          {item?.detail_accomodation?.booking_ref}
                        </Text>
                      </View>
                    ) : null
                  ) : null}
                  {item?.detail_accomodation ? null : (
                    <View
                      style={{
                        // width: 100,
                        backgroundColor: "#daf0f2",
                        paddingVertical: 5,
                        paddingHorizontal: 15,
                        borderRadius: 5,

                        alignItems: "center",
                      }}
                    >
                      <Text type="bold">
                        {Getdurasi(item.duration ? item.duration : "00:00:00")}
                      </Text>
                    </View>
                  )}
                </View>

                {item.type === "custom" && Anggota ? (
                  // custom detail
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: 40,
                      marginLeft: -10,

                      justifyContent: "center",
                      alignItems: "flex-end",
                      alignContent: "flex-end",
                    }}
                    onPress={() => {
                      props.navigation.navigate("detailCustomItinerary", {
                        data: dataSpreadtimeline,
                        dataList: dataList,
                        token: token,
                        idItin: itineraryId,
                        id: item.id,
                        idDay: idDay,
                        nameitin: datadetail?.itinerary_detail?.name,
                        startDate: datadetail?.itinerary_detail?.start_date,
                        endDate: EndTimeConverter(
                          datadetail?.itinerary_detail?.end_date
                        ),
                        datadayaktif: datadayaktif,
                        indexdata: index,
                        time: item.time,
                      });
                    }}
                  >
                    <Next width={15} height={15} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: "#d3d3d3",
                  marginTop: 5,
                  paddingTop: 5,
                }}
              >
                {item.note ? (
                  <TouchableOpacity
                    onPress={() =>
                      status == "edit" && Anggota
                        ? bukaModal(item.note, index)
                        : null
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Pencilgreen width={10} height={10} />
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        textAlign: "left",
                        marginLeft: 5,
                      }}
                    >
                      {item.note}
                    </Text>
                  </TouchableOpacity>
                ) : status == "edit" && Anggota ? (
                  <TouchableOpacity
                    onPress={() =>
                      status == "edit" && Anggota
                        ? bukaModal(null, index)
                        : null
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Pencilgreen width={10} height={10} />
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginLeft: 5,
                        color: "#209fae",
                      }}
                    >
                      {t("addNotes")}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
          {index < x &&
          dataList[index + 1] &&
          dataList[index].latitude !== dataList[index + 1].latitude &&
          dataList[index].longitude !== dataList[index + 1].longitude ? (
            <View
              style={{
                position: "relative",
                left: -5,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  width: 15,
                  borderTopWidth: 0.5,
                  borderTopColor: "#6C6C6C",
                }}
              ></View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={{
                    marginRight: 5,
                    borderRadius: 5,
                    marginVertical: 2,
                    marginLeft: 1,
                    // borderWidth: 5,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    alignItems: "center",
                    elevation: 3,
                    shadowColor: "#d3d3d3",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                  }}
                >
                  <Mobil height={15} width={15} style={{ marginRight: 10 }} />

                  <Text type="bold">
                    {dataList[index + 1].detail_flight
                      ? Distance({
                          lat1: dataList[index].latitude,
                          lon1: dataList[index].longitude,
                          lat2:
                            dataList[index + 1].detail_flight
                              .latitude_departure,
                          lon2:
                            dataList[index + 1].detail_flight
                              .longitude_departure,
                        })
                      : Distance({
                          lat1: dataList[index].latitude,
                          lon1: dataList[index].longitude,
                          lat2: dataList[index + 1].latitude,
                          lon2: dataList[index + 1].longitude,
                          unit: "km",
                        })}
                  </Text>
                  <Text> km </Text>
                  <Text>- </Text>
                  <Text type="bold">
                    {dataList[index + 1].detail_flight ? (
                      <HitungWaktu
                        lat1={dataList[index].latitude}
                        lon1={dataList[index].longitude}
                        lat2={
                          dataList[index + 1].detail_flight.latitude_departure
                        }
                        lon2={
                          dataList[index + 1].detail_flight.longitude_departure
                        }
                        unit={"km"}
                        kecepatan={50}
                      />
                    ) : (
                      <HitungWaktu
                        lat1={dataList[index].latitude}
                        lon1={dataList[index].longitude}
                        lat2={dataList[index + 1].latitude}
                        lon2={dataList[index + 1].longitude}
                        unit={"km"}
                        kecepatan={50}
                      />
                    )}
                  </Text>
                </View>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const RenderAlbum = ({ item, index }) => {
    return grid !== 1 ? (
      item?.id === dataalbumaktif?.id ? (
        <View
          style={{
            width: "100%",
          }}
        >
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10,
                paddingRight: 10,
              }}
            >
              <Text type="bold">
                {item.count} {item.count > 1 ? "photos" : "photo"}
              </Text>
              {Anggota ? (
                <TouchableOpacity onPress={() => setOptionModal(true)}>
                  <OptionsVertBlack width={15} height={15} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "102%",
                paddingBottom: 10,
                marginTop: 10,
              }}
            >
              {Anggota ? (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("FeedStack", {
                      screen: "Post",
                      params: {
                        id_album: item.id,
                        id_itin: itineraryId,
                        title_album: item.title,

                        album: "Itinerary",
                      },
                    });
                  }}
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "#d0d0d0",
                    alignItems: "center",
                    width: tab2ItemSize,
                    height: tab2ItemSize,
                    borderWidth: item.posted.length < 1 ? 1 : 0,
                    borderColor: "#d1d1d1",

                    marginRight: 2.5,
                    marginBottom: 2.5,
                  }}
                >
                  <CameraIcon height={35} width={35} />
                </TouchableOpacity>
              ) : null}

              {item.posted.length > 0
                ? item.posted.map((data, i) => {
                    return data.is_posted === true ? (
                      data.type === "video" ? (
                        <TouchableOpacity
                          onPress={() => {
                            setdataimagepost(item.posted, i);
                          }}
                        >
                          <FunVideo
                            poster={data.filepath.replace(
                              "output.m3u8",
                              "thumbnail.png"
                            )}
                            paused={true}
                            key={"posted" + data.id}
                            source={
                              data.filepath ? { uri: data.filepath } : null
                            }
                            muted={true}
                            // defaultSource={default_image}
                            style={{
                              width: tab2ItemSize,
                              height: tab2ItemSize,
                              marginRight: 2.5,
                              marginBottom: 2.5,
                              backgroundColor: "#f6f6f6",
                              justifyContent: "center",
                              alignItems: "center",
                              resizeMode: "cover",
                            }}
                          />
                          <View
                            style={{
                              // flexDirection: "row",
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0,0,0,0.6)",
                              justifyContent: "flex-end",
                              // borderRadius: 5,

                              // bottom: "35%",
                              // left: "35%",
                            }}
                          >
                            <PlayVideo
                              width={15}
                              height={15}
                              style={{ margin: 10 }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setdataimagepost(item.posted, i);
                          }}
                        >
                          <FunImage
                            key={"posted" + data.id}
                            source={
                              data.filepath
                                ? { uri: data.filepath }
                                : default_image
                            }
                            // defaultSource={default_image}
                            style={{
                              width: tab2ItemSize,
                              height: tab2ItemSize,
                              marginRight: 2.5,
                              marginBottom: 2.5,
                              backgroundColor: "#f6f6f6",
                              justifyContent: "center",
                              alignItems: "center",
                              resizeMode: "cover",
                            }}
                          />
                        </TouchableOpacity>
                      )
                    ) : null;
                  })
                : null}
            </View>
          </>
        </View>
      ) : null
    ) : (
      <View
        style={{
          width: "100%",
          borderWidth: 1,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text type="bold" style={{ paddingVertical: 10 }}>
            {item.title}
          </Text>
          <Text type="bold" style={{ paddingVertical: 10, marginRight: 5 }}>
            {item.count} {item.count > 1 ? "photos" : "photo"}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: "102%",
            paddingBottom: 10,
          }}
        >
          {loadinguploadAlbum === true ? (
            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                backgroundColor: "#d0d0d0",
                alignItems: "center",
                width: tab2ItemSize,
                height: tab2ItemSize,
                marginRight: 2.5,
                marginBottom: 2.5,
              }}
            >
              <ActivityIndicator
                animating={true}
                color="#209fae"
                size="small"
              />
            </View>
          ) : item.album.length - 1 > 0 ? (
            item.album.map((data, i) => {
              if (data.id === "camera") {
                if (Anggota) {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate("FeedStack", {
                          screen: "Post",
                          params: {
                            id_album: item.id,
                            id_itin: itineraryId,
                            title_album: item.title,

                            album: "Itinerary",
                          },
                        });
                      }}
                      style={{
                        alignContent: "center",
                        justifyContent: "center",
                        backgroundColor: "#d0d0d0",
                        alignItems: "center",
                        width: tab2ItemSize,
                        height: tab2ItemSize,
                        marginRight: 2.5,
                        marginBottom: 2.5,
                      }}
                    >
                      <CameraIcon height={30} width={30} />
                    </TouchableOpacity>
                  );
                } else {
                  return null;
                }
              } else {
                return data.type === "video" ? (
                  <TouchableOpacity
                    onPress={() => {
                      setdataimage(item.album, i - 1);
                    }}
                  >
                    <FunVideo
                      poster={data.filepath.replace(
                        "output.m3u8",
                        "thumbnail.png"
                      )}
                      paused={true}
                      key={"album" + data.id}
                      source={data.filepath ? { uri: data.filepath } : null}
                      muted={true}
                      style={{
                        width: tab2ItemSize,
                        height: tab2ItemSize,
                        marginRight: 2.5,
                        marginBottom: 2.5,
                        backgroundColor: "#f6f6f6",
                        justifyContent: "center",
                        alignItems: "center",
                        resizeMode: "cover",
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        justifyContent: "flex-end",
                      }}
                    >
                      <PlayVideo
                        width={15}
                        height={15}
                        style={{ margin: 10 }}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setdataimage(item.album, i - 1);
                    }}
                  >
                    <FunImage
                      key={"album" + data.id}
                      source={
                        data.filepath ? { uri: data.filepath } : default_image
                      }
                      // defaultSource={default_image}
                      style={{
                        width: tab2ItemSize,
                        height: tab2ItemSize,
                        marginRight: 2.5,
                        marginBottom: 2.5,
                        backgroundColor: "#f6f6f6",
                        justifyContent: "center",
                        alignItems: "center",
                        resizeMode: "cover",
                      }}
                    />
                  </TouchableOpacity>
                );
              }
            })
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("FeedStack", {
                    screen: "Post",
                    params: {
                      id_album: item.id,
                      id_itin: itineraryId,
                      title_album: item.title,
                      album: "Itinerary",
                    },
                  });
                }}
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  backgroundColor: "#d0d0d0",
                  alignItems: "center",
                  width: tab2ItemSize,
                  height: tab2ItemSize,
                  marginRight: 2.5,
                  marginBottom: 2.5,
                }}
              >
                <CameraIcon height={30} width={30} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const RenderTab3Item = ({ item, index }) => {
    return (
      <View
        style={{
          marginLeft: index % 3 === 0 ? 0 : 10,
          borderRadius: 16,
          width: tab2ItemSize,
          height: tab2ItemSize,
          backgroundColor: "#f6f6f6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{index}</Text>
      </View>
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <Pressable
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          width: Dimensions.get("screen").width / 3,
        }}
      >
        {route.key == "tab1" && focused ? (
          <ItineraryIcon
            style={{
              marginRight: 5,
            }}
            height={20}
            width={20}
          />
        ) : route.key == "tab2" && focused ? (
          <TravelAlbum
            style={{
              marginRight: 5,
            }}
            height={20}
            width={20}
          />
        ) : route.key == "tab3" && focused ? (
          <TravelStories
            style={{
              marginRight: 5,
            }}
            height={20}
            width={20}
          />
        ) : null}
        {route.key == "tab1" && !focused ? (
          <ItineraryIconGray
            style={{
              marginRight: 5,
            }}
            height={20}
            width={20}
          />
        ) : route.key == "tab2" && !focused && status !== "edit" ? (
          <AlbumIconGray
            style={{
              marginRight: 5,
            }}
            height={20}
            width={20}
          />
        ) : null}

        {route.key == "tab2" && !focused && status == "edit" ? (
          <TravelAlbumdis
            style={{
              marginRight: 5,
            }}
            height={20}
            width={20}
          />
        ) : null}

        {route.key == "tab3" && !focused ? (
          <TravelStoriesdis
            style={{
              marginRight: 5,
            }}
            height={20}
            width={20}
          />
        ) : null}

        <Text
          type={focused ? "bold" : "regular"}
          size="label"
          style={{
            color: focused
              ? "#209FAE"
              : status === "edit"
              ? "#d3d3d3"
              : route.active === false
              ? "#d3d3d3"
              : "#464646",
          }}
        >
          {route.title}
        </Text>
      </Pressable>
    );
  };
  let [grid, setgrid] = useState(4);

  const spreadData = (rData) => {
    let result = [];
    rData?.itinerary_album_list_v2?.album?.map((dataS, index) => {
      let tempdata = {
        posted: [],
        unposted: [{ id: "camera" }],
        album: [{ id: "camera" }],
        day: "",
        id: "",
        count: 0,
      };
      tempdata["title"] = dataS.title;
      tempdata["id"] = dataS.id;
      if (dataS.media.length > 0) {
        dataS.media.map((item, ind) => {
          if (item.is_posted === true) {
            tempdata["posted"].push(item);
            tempdata["count"] += 1;
          } else {
            tempdata["unposted"].push(item);
          }
          tempdata["album"].push(item);
        });
      }
      result.push(tempdata);
    });

    return result;
  };

  const spreadDatas = (rData) => {
    let result = [];
    rData.itinerary_album_list_v2.album.map((dataS, index) => {
      let tempdata = {
        posted: [],
        unposted: [],
        album: [],
        day: "",
        id: "",
      };
      tempdata["title"] = dataS.title;
      tempdata["id"] = dataS.id;
      tempdata["album_id"] = dataS.id;
      if (dataS.media.length > 0) {
        dataS.media.map((item, ind) => {
          if (item.is_posted === true) {
            tempdata["posted"].push(item);
          } else {
            tempdata["unposted"].push(item);
          }
          tempdata["album"].push(item);
        });
      }
      result.push(tempdata);
    });
    return result;
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    let y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, 50],
      extrapolateRight: "clamp",
    });
    switch (route.key) {
      case "tab1":
        numCols = 1;
        data = dataList ? dataList : [1, 2, 3];
        renderItem = (e) => (
          <Animated.View style={{ transform: [{ translateY: y }] }}>
            <RenderItinerary item={e.item} index={e.index} />
          </Animated.View>
        );
        break;
      case "tab2":
        numCols = 1;
        data = dataAlbum ? spreadData(dataAlbum) : [];
        renderItem = (e) => (
          <Animated.View style={{ transform: [{ translateY: y }] }}>
            <RenderAlbum item={e.item} index={e.index} />
          </Animated.View>
        );
        break;
      case "tab3":
        numCols = 3;
        data = tab3Data;
        renderItem = (e) => (
          <Animated.View style={{ transform: [{ translateY: y }] }}>
            <RenderTab3Item item={e.item} index={e.index} />{" "}
          </Animated.View>
        );
        break;
      default:
        return null;
    }
    return (
      <>
        <Animated.FlatList
          scrollToOverflowEnabled={true}
          scrollEnabled={canScroll}
          {...listPanResponder.panHandlers}
          numColumns={numCols}
          key={numCols}
          ref={(ref) => {
            if (ref) {
              const found = listRefArr.current.find((e) => e.key === route.key);
              if (!found) {
                listRefArr.current.push({
                  key: route.key,
                  value: ref,
                });
              }
            }
          }}
          scrollEventThrottle={16}
          onScroll={
            focused
              ? Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: { y: scrollY },
                      },
                    },
                  ],
                  { useNativeDriver: true }
                )
              : null
          }
          onMomentumScrollBegin={onMomentumScrollBegin}
          onScrollEndDrag={onScrollEndDrag}
          onMomentumScrollEnd={onMomentumScrollEnd}
          // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{
            paddingTop: HeaderHeight + TabBarHeight + 60,
            paddingHorizontal: tabIndex == 1 ? 5 : 15,
            minHeight: height + HeaderHeight + 60,

            paddingBottom: 70,
            backgroundColor: "#F6F6F6",
          }}
          ListFooterComponent={() => (
            <View>
              {loadingtimeline ? (
                tabIndex === 0 ? (
                  <SkeletonPlaceholder>
                    <View
                      style={{
                        justifyContent: "space-around",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          height: 40,
                          width: (Dimensions.get("screen").width - 30) * 0.15,
                          // margin: 5,
                          borderRadius: 5,
                        }}
                      ></View>
                      <View
                        style={{
                          marginTop: 15,
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            marginHorizontal: 5,
                          }}
                        ></View>
                        <View
                          style={{
                            height: 180,
                            borderRightWidth: 1,
                            borderColor: "#efefef",
                          }}
                        ></View>
                      </View>
                      <View>
                        <View
                          style={{
                            width: (Dimensions.get("screen").width - 30) * 0.8,
                            borderRadius: 5,
                            // height: 100,
                            borderWidth: 1,
                            borderColor: "#efefef",
                            padding: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderRadius: 15,
                              }}
                            ></View>
                            <View style={{ paddingHorizontal: 5 }}>
                              <View
                                style={{
                                  width: 100,
                                  height: 20,
                                  borderRadius: 5,
                                  marginBottom: 5,
                                }}
                              ></View>
                              <View
                                style={{
                                  height: 10,
                                  width: 95,
                                  borderRadius: 5,
                                }}
                              ></View>
                            </View>
                          </View>
                          <View
                            style={{
                              height: 25,
                              width: 50,
                              borderRadius: 5,
                              marginVertical: 5,
                            }}
                          ></View>
                          <View
                            style={{
                              width: "100%",
                              borderBottomWidth: 1,
                              borderColor: "#efefef",
                            }}
                          ></View>
                          <View
                            style={{
                              marginVertical: 5,
                              width: "100%",
                              height: 10,
                              borderRadius: 5,
                            }}
                          ></View>
                          <View
                            style={{
                              marginVertical: 5,
                              width: "50%",
                              height: 10,
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <View
                          style={{
                            height: 40,
                            width: 130,
                            marginTop: 5,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: "#efefef",
                            padding: 10,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              width: 110,
                              height: 15,
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        // paddingHorizontal: 15,
                        justifyContent: "space-around",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          height: 40,
                          width: (Dimensions.get("screen").width - 30) * 0.15,
                          // margin: 5,
                          borderRadius: 5,
                        }}
                      ></View>
                      <View
                        style={{
                          // marginTop: 15,
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
                        <View
                          style={{
                            height: 15,
                            borderRightWidth: 1,
                            borderColor: "#efefef",
                          }}
                        ></View>
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            marginHorizontal: 5,
                          }}
                        ></View>
                        <View
                          style={{
                            height: 400,
                            borderRightWidth: 1,
                            borderColor: "#efefef",
                          }}
                        ></View>
                      </View>
                      <View>
                        <View
                          style={{
                            width: (Dimensions.get("screen").width - 30) * 0.8,
                            borderRadius: 5,
                            // height: 100,
                            borderWidth: 1,
                            borderColor: "#efefef",
                            padding: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderRadius: 15,
                              }}
                            ></View>
                            <View style={{ paddingHorizontal: 5 }}>
                              <View
                                style={{
                                  width: 100,
                                  height: 20,
                                  borderRadius: 5,
                                  marginBottom: 5,
                                }}
                              ></View>
                              <View
                                style={{
                                  height: 10,
                                  width: 95,
                                  borderRadius: 5,
                                }}
                              ></View>
                            </View>
                          </View>
                          <View
                            style={{
                              height: 25,
                              width: 50,
                              borderRadius: 5,
                              marginVertical: 5,
                            }}
                          ></View>
                          <View
                            style={{
                              width: "100%",
                              borderBottomWidth: 1,
                              borderColor: "#efefef",
                            }}
                          ></View>
                          <View
                            style={{
                              marginVertical: 5,
                              width: "100%",
                              height: 10,
                              borderRadius: 5,
                            }}
                          ></View>
                          <View
                            style={{
                              marginVertical: 5,
                              width: "50%",
                              height: 10,
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <View
                          style={{
                            height: 40,
                            width: 80,
                            marginTop: 5,
                            borderRadius: 5,
                          }}
                        ></View>
                      </View>
                    </View>
                  </SkeletonPlaceholder>
                ) : (
                  <View></View>
                )
              ) : dataList && dataList.length == 0 && tabIndex == 0 ? (
                <Text></Text>
              ) : (
                <View
                //  onLayout={() => handlecover()}
                ></View>
              )}
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          ListHeaderComponent={
            tabIndex == 0 && datadayaktif && datadayaktif.date ? (
              <Animated.View style={{ transform: [{ translateY: y }] }}>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderTopColor: "#d3d3d3",
                    borderBottomColor: "#d3d3d3",
                    borderRightColor: "#d3d3d3",
                    borderLeftColor: "#209fae",
                    borderLeftWidth: 5,
                    padding: 10,
                    height: 60,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View
                    onLayout={() => {
                      _fetchItem(
                        dataList[0]
                          ? dataList[0].city
                          : datadetail?.itinerary_detail?.city.name,
                        dataList[0]
                          ? dataList[0].latitude
                          : datadetail?.itinerary_detail?.city.latitude,
                        dataList[0]
                          ? dataList[0].longitude
                          : datadetail?.itinerary_detail?.city.longitude
                      );
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text type={"bold"} size="label">
                        {dateFormatHari(datadayaktif.date).toUpperCase()}
                      </Text>
                      <View
                        style={{
                          marginTop: 3,
                          backgroundColor: "#464646",
                          borderRadius: 2,
                          width: 4,
                          height: 4,
                          marginHorizontal: 5,
                        }}
                      />
                      <Text type={"bold"} size="label">
                        {dateFormatMDY(datadayaktif.date).toUpperCase()}
                      </Text>
                    </View>
                    <Text>
                      {dataList && dataList.length > 0 ? (
                        <Truncate
                          text={getcity(
                            dataList,
                            datadetail?.itinerary_detail?.city.name
                          ).toUpperCase()}
                          length={35}
                        />
                      ) : (
                        <Capital
                          text={
                            datadetail?.itinerary_detail
                              ? datadetail?.itinerary_detail?.city?.name.toUpperCase()
                              : "A"
                          }
                          length={35}
                        />
                      )}
                    </Text>
                  </View>
                  {dataweather &&
                  dataweather.cod === 200 &&
                  dataweather.weather ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "flex-end",
                          height: "100%",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              height: 35,
                              width: 35,
                            }}
                          >
                            <FunIcon
                              icon={
                                icons[
                                  dataweather.weather[0].icon
                                    ? dataweather.weather[0].icon
                                    : "01d"
                                ]
                              }
                              height={35}
                              width={35}
                              style={{
                                bottom: -3,
                              }}
                            />
                          </View>
                          <View
                            style={{
                              paddingTop: 5,
                              flexDirection: "row",
                            }}
                          >
                            <Text size="title" type="bold" style={{}}>
                              {(dataweather.main.temp / 10).toFixed(1)}
                            </Text>
                            <View
                              style={{
                                marginTop: 7,
                                alignSelf: "flex-start",
                                height: 5,
                                width: 5,
                                borderWidth: 1,
                                borderRadius: 2.5,
                              }}
                            ></View>
                          </View>
                        </View>
                        <Text size="small" type="regular" style={{}}>
                          {dataweather.weather[0].description.toUpperCase()}
                        </Text>
                      </View>

                      {dataweather.main.temp / 10 > 27.2 ? (
                        <View
                          style={{
                            height: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <View
                            style={{
                              height: 35,
                              width: 35,
                            }}
                          >
                            <FunIcon
                              icon={"w-hot"}
                              height={35}
                              style={{
                                bottom: -3,
                              }}
                            />
                          </View>
                          <Text size="small" type="regular" style={{}}>
                            HOT
                          </Text>
                        </View>
                      ) : null}

                      {dataweather.main.temp / 10 > 25.8 &&
                      dataweather.main.temp / 10 < 27.3 ? (
                        <View
                          style={{
                            height: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <View
                            style={{
                              height: 50,
                              width: 50,
                            }}
                          >
                            <FunIcon icon={"w-warm"} height={50} width={50} />
                          </View>
                          <Text size="small" type="regular" style={{}}>
                            WARM
                          </Text>
                        </View>
                      ) : null}

                      {dataweather.main.temp / 10 > 22.8 &&
                      dataweather.main.temp / 10 < 25.9 ? (
                        <View
                          style={{
                            height: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <View
                            style={{
                              height: 50,
                              width: 50,
                            }}
                          >
                            <FunIcon icon={"w-humid"} height={50} width={50} />
                          </View>
                          <Text size="small" type="regular" style={{}}>
                            HUMID
                          </Text>
                        </View>
                      ) : null}

                      {dataweather.main.temp / 10 > 20.5 &&
                      dataweather.main.temp / 10 < 22.9 ? (
                        <View
                          style={{
                            height: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <View
                            style={{
                              height: 50,
                              width: 50,
                            }}
                          >
                            <FunIcon icon={"w-cold"} height={50} width={50} />
                          </View>
                          <Text size="small" type="regular" style={{}}>
                            COLD
                          </Text>
                        </View>
                      ) : null}

                      {dataweather.main.temp / 10 < 20.6 ? (
                        <View
                          style={{
                            height: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <View
                            style={{
                              height: 50,
                              width: 50,
                            }}
                          >
                            <FunIcon icon={"w-freezing"} height={50} />
                          </View>
                          <Text size="small" type="regular" style={{}}>
                            FREEZING
                          </Text>
                        </View>
                      ) : null}
                      {status == "edit" && Anggota ? (
                        <Button
                          size="small"
                          text=""
                          type="circle"
                          variant="transparent"
                          style={{}}
                          onPress={() => {
                            setModalmenuday(true);
                          }}
                        >
                          <Delete width={15} height={15} />
                        </Button>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </Animated.View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          initialScrollIndex={0}
        />
        {route.key === "tab1" &&
        status === "edit" &&
        Anggota &&
        dataList &&
        dataList.length > 0 ? (
          <Animated.View
            style={{
              zIndex: 99,
              position: "absolute",
              right: 10,
              bottom: 70,
            }}
          >
            <Button
              onPress={() =>
                props.navigation.navigate("ReorderDetail", {
                  head: datadetail?.itinerary_detail,
                  child: dataList,
                  active: datadayaktif,
                  token: token,
                })
              }
              type="circle"
              style={{
                shadowColor: "#464646",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3,
              }}
            >
              <Reorder width={20} height={20} />
            </Button>
          </Animated.View>
        ) : null}
      </>
    );
  };

  let scrollRef = useRef();

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 50],
      // extrapolate: 'clamp',
      extrapolateRight: "clamp",
    });

    const scrollToIndexFailed = (error) => {
      const offset = error.averageItemLength * error.index;
      ref.current.scrollToOffset({ offset });
      setTimeout(
        () =>
          ref?.current?.scrollToIndex({
            index: error.index,
          }),
        500
      );
    };

    return (
      <Animated.View
        style={{
          zIndex: 1,
          position: "absolute",
          transform: [{ translateY: y }],
          width: "100%",
        }}
      >
        <FlatList
          key={"listtabbar"}
          ref={scrollRef}
          data={props.navigationState.routes}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "white",
          }}
          onScrollToIndexFailed={(e) => {
            scrollToIndexFailed(e);
          }}
          renderItem={({ item, index }) => (
            <Ripple
              key={"tabx" + index}
              onPress={() => {
                status === "edit" && index === 1
                  ? setmodalTrip(true)
                  : item.active == false
                  ? setSoon(true)
                  : null;
                status === "edit"
                  ? status === "edit" && index !== 0
                    ? null
                    : setIndex(index)
                  : status === "saved"
                  ? status === "saved" && index > 1
                    ? null
                    : setIndex(index)
                  : status === "finish"
                  ? status === "finish" && index > 1
                    ? null
                    : setIndex(index)
                  : null;
              }}
            >
              <View
                style={{
                  borderBottomWidth: index == tabIndex ? 2 : 1,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#d1d1d1",
                  alignContent: "center",
                  flexDirection: "row",
                  width:
                    props.navigationState.routes.length <= 2
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length > 2
                      ? Dimensions.get("screen").width * 0.333
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingHorizontal: Platform.OS === "ios" ? 15 : null,
                }}
              >
                {index === tabIndex ? (
                  index === 0 ? (
                    <ItineraryIcon
                      style={{
                        marginRight: 5,
                      }}
                      height={20}
                      width={20}
                    />
                  ) : index === 1 ? (
                    <TravelAlbum
                      style={{
                        marginRight: 5,
                      }}
                      height={20}
                      width={20}
                    />
                  ) : (
                    <TravelStories
                      style={{
                        marginRight: 5,
                      }}
                      height={20}
                      width={20}
                    />
                  )
                ) : index === 0 ? (
                  <ItineraryIconGray
                    style={{
                      marginRight: 5,
                    }}
                    height={20}
                    width={20}
                  />
                ) : index === 1 ? (
                  <AlbumIconGray
                    style={{
                      marginRight: 5,
                    }}
                    height={20}
                    width={20}
                  />
                ) : (
                  <TravelStoriesdis
                    style={{
                      marginRight: 5,
                    }}
                    height={20}
                    width={20}
                  />
                )}
                <Text
                  style={[
                    index == tabIndex
                      ? styles.labelActive
                      : index === 2
                      ? styles.labelDisabled
                      : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 1,
                      borderBottomWidth: 0,
                      // borderWidth: 1,
                      marginBottom: index == tabIndex ? 0 : 1,
                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  <Truncate
                    text={item?.title ? item.title : ""}
                    length={Platform.OS === "ios" ? 13 : 15}
                  />
                </Text>
              </View>
            </Ripple>
          )}
        />
        {/* <TabBar
          {...props}
          onTabPress={({ route, preventDefault }) => {
            status === "edit"
              ? setmodalTrip(true)
              : route.active === false
              ? setSoon(true)
              : null;
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={{
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderBottomColor: route.active == tabIndex ? "#209FAE" : "#d1d1d1",
            height: TabBarHeight,
          }}
          renderLabel={renderLabel}
          indicatorStyle={{
            backgroundColor: "#FFFFFF",
          }}
        /> */}
        <View
          style={{
            backgroundColor: "white",
          }}
        >
          {loadingdetail ? (
            <View
              style={{
                height: 47,
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator
                animating={true}
                color="#209fae"
                size="large"
              />
            </View>
          ) : tabIndex === 1 ? (
            <Albumheader
              dataAlbum={datadetail?.itinerary_detail?.album}
              grid={grid}
              setgrid={(e) => setgrid(e)}
              Anggota={Anggota}
              token={token}
              props={props}
              itineraryId={itineraryId}
              startRefreshAction={(e) => startRefreshAction(e)}
              dataalbumaktif={dataalbumaktif}
              setdataalbumaktif={(e) => setdataalbumaktif(e)}
              optionModal={optionModal}
              setOptionModal={() => setOptionModal(!optionModal)}
            />
          ) : (
            <ItineraryDay
              dataitin={datadetail?.itinerary_detail}
              dataDay={datadetail?.itinerary_detail?.day}
              props={props}
              token={token}
              lat={datadetail?.itinerary_detail?.city.latitude}
              long={datadetail?.itinerary_detail?.city.longitude}
              kota={datadetail?.itinerary_detail?.city.name}
              iditinerary={itineraryId}
              getdata={() => setParamAdd(true)}
              dataAkhir={dataAkhir}
              setAkhir={(e) => setDataAkhir(e)}
              setidDayz={(e) => setidDay(e)}
              GetTimeline={(e) => GetTimeline(e)}
              setCover={(e) => setCover(e)}
              cover={datadetail?.itinerary_detail?.cover}
              datadayaktif={datadayaktif}
              setdatadayaktif={(e) => setdatadayaktif(e)}
              setLoading={(e) => setloading(e)}
              Refresh={(e) => _Refresh(e)}
              status={status}
              indexnya={indexnya}
              setIndex={(e) => setIndexnya(e)}
              Anggota={Anggota}
              tabIndex={tabIndex}
              grid={grid}
              setgrid={(e) => setgrid(e)}
              errors={errors}
            />
          )}
        </View>
      </Animated.View>
    );
  };

  const _handletab = (i) => {
    if (status === "saved" || status === "finish") {
      setIndex(i);
    }
  };

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          _handletab(id);
        }}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: width,
        }}
      />
    );
  };

  const renderCustomRefresh = () => {
    // headerMoveScrollY
    return Platform.select({
      ios: (
        <AnimatedIndicator
          style={{
            top: -50,
            position: "absolute",
            alignSelf: "center",
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [120, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
          color="#209fae"
          animating={true}
        />
      ),
      android: (
        <Animated.View
          style={{
            transform: [
              {
                translateY: headerMoveScrollY.interpolate({
                  inputRange: [-300, 0],
                  outputRange: [150, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
            backgroundColor: "#eee",
            height: 38,
            width: 38,
            borderRadius: 19,
            borderWidth: 2,
            borderColor: "#ddd",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            top: -50,
            position: "absolute",
          }}
        >
          <ActivityIndicator animating={true} color="#209fae" />
        </Animated.View>
      ),
    });
  };

  const goToSelectPhoto = async (album, dayaktif, tkn) => {
    let data = await spreadDatas(album);

    let index = data.findIndex((k) => k["id"] === dayaktif.id);
    let albumselected = data[index].unposted;
    if (albumselected.length > 0) {
      await props.navigation.navigate("ItineraryStack", {
        screen: "SelectAlbumsPost",
        params: {
          data_album: albumselected,
          itinerary_id: itineraryId,
          album_id: data[index].album_id,
          token: tkn,
        },
      });
    } else {
      Alert.alert("", "Album kosong");
    }
  };

  const renderMenuBottom = (dta) => {
    switch (Anggota) {
      case true:
        return status && status === "saved" ? (
          tabIndex == 0 ? (
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
                color="tertiary"
                type="circle"
                style={{
                  borderRadius: 0,
                  width: "15%",
                  height: 56,
                  fontSize: 18,
                }}
                onPress={() => {
                  props.navigation.navigate("ChatStack", {
                    screen: "GroupRoom",
                    params: {
                      room_id: itineraryId,
                      name: dta ? dta.name : null,
                      picture: Cover,
                      is_itinerary: true,
                      from: "itinerary",
                    },
                  });
                }}
              >
                <ChatItinerary width={20} height={20} />
                <Text size="small" style={{ color: "#209FAE" }}>
                  {t("Chat")}
                </Text>
              </Button>
              <Button
                disabled
                text={t("addDestination")}
                size="large"
                style={{
                  backgroundColor: "#d3d3d3",
                  borderRadius: 0,
                  width: "40%",
                  height: 56,
                  fontSize: 18,
                }}
              ></Button>

              <View
                style={{
                  height: "100%",
                  width: "45%",
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
                    setStatus("edit"), setshowside(false);
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
          ) : null
        ) : status == "edit" ? (
          tabIndex == 0 ? (
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
                // shadowColor: "#F0F0F0",
                // shadowOffset: { width: 2, height: 2 },
                // shadowOpacity: 1,
                // shadowRadius: 2,
                // elevation: 3,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                color="tertiary"
                type="circle"
                style={{
                  borderRadius: 0,
                  width: "15%",
                  height: 56,
                  fontSize: 18,
                }}
                onPress={() => {
                  props.navigation.navigate("ChatStack", {
                    screen: "GroupRoom",
                    params: {
                      room_id: itineraryId,
                      name: dta ? dta.name : null,
                      picture: Cover,
                      is_itinerary: true,
                      from: "itinerary",
                    },
                  });
                }}
              >
                <ChatItinerary width={20} height={20} />
                <Text size="small" style={{ color: "#209FAE" }}>
                  {t("Chat")}
                </Text>
              </Button>
              <Button
                onPress={() => {
                  let maxjam = datadayaktif.total_hours.split(":");
                  let jam = parseFloat(maxjam[0]);
                  let menit = parseFloat(maxjam[1]);
                  if (jam < 24) {
                    if (jam < 23) {
                      dispatch(
                        setItinerary({
                          ...props.route.params,
                          id_city: dataList.length
                            ? dataList[dataList.length - 1].id_city
                            : null,
                          city_name: dataList.length
                            ? dataList[dataList.length - 1].city
                            : null,
                        })
                      );
                      props.navigation.push("itindest", {
                        IdItinerary: itineraryId,
                        token: token,
                        datadayaktif: datadayaktif,
                        dataDes:
                          datadetail && datadetail?.itinerary_detail
                            ? datadetail
                            : null,
                        lat: datadetail?.itinerary_detail?.city.latitude,
                        long: datadetail?.itinerary_detail?.city.longitude,
                        idcity:
                          dataList &&
                          dataList?.length > 0 &&
                          dataList[dataList.length - 1].id_city
                            ? dataList[dataList.length - 1].id_city
                            : datadetail?.itinerary_detail?.city.id,
                        idcountries: datadetail?.itinerary_detail?.country.id,
                      });
                    } else if (jam === 23 && menit === 0) {
                      dispatch(
                        setItinerary({
                          ...props.route.params,
                          id_city: dataList
                            ? dataList[dataList.length - 1].id_city
                            : null,
                          city_name: dataList
                            ? dataList[dataList.length - 1].city
                            : null,
                        })
                      );
                      props.navigation.push("itindest", {
                        IdItinerary: itineraryId,
                        token: token,
                        datadayaktif: datadayaktif,
                        dataDes:
                          datadetail && datadetail?.itinerary_detail
                            ? datadetail
                            : null,
                        lat: datadetail?.itinerary_detail?.city.latitude,
                        long: datadetail?.itinerary_detail?.city.longitude,
                        idcity:
                          dataList &&
                          dataList?.length > 0 &&
                          dataList[dataList.length - 1].id_city
                            ? dataList[dataList.length - 1].id_city
                            : datadetail?.itinerary_detail?.city.id,
                        idcountries: datadetail?.itinerary_detail?.country.id,
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
                  width: "40%",
                  height: 56,
                  fontSize: 18,
                }}
              />

              <View
                style={{
                  height: "100%",
                  width: "45%",
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
                  color="#FFF"
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
                  <Complete width={20} height={20} />
                  <Text size="small" style={{ color: "#d75995" }}>
                    {t("completePlan")}
                  </Text>
                </Button>
              </View>
            </View>
          ) : null //tab bukan 0 status edit
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
              // shadowOffset: { width: 2, height: 2 },
              // shadowOpacity: 1,
              // shadowRadius: 2,
              // elevation: 3,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                height: "100%",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              {datadetail &&
              datadetail?.itinerary_detail &&
              props.route.params?.like_show ? (
                datadetail?.itinerary_detail?.liked == true ? (
                  <Button
                    onPress={() => _unliked()}
                    text=""
                    size="medium"
                    color="tertiary"
                    type="circle"
                    style={{
                      borderRadius: 5,
                      backgroundColor: "#f2dae5",
                      marginVertical: 10,
                      marginRight: 10,
                    }}
                  >
                    <Love width={20} height={20} />
                  </Button>
                ) : (
                  <Button
                    onPress={() => _liked()}
                    text=""
                    size="medium"
                    color="tertiary"
                    type="circle"
                    style={{
                      backgroundColor: "#f6f6f6",
                      borderRadius: 5,
                      marginVertical: 10,
                      marginRight: 10,
                    }}
                  >
                    <LikeEmpty width={20} height={20} />
                  </Button>
                )
              ) : null}
              <Button
                onPress={() => {
                  props.navigation.navigate("copyItinerary", {
                    idiItin: itineraryId,
                    datadetail: datadetail?.itinerary_detail,
                    token: token,
                  });
                }}
                text={t("CopyTrip")}
                size="medium"
                style={{
                  flex: 1,
                  borderRadius: 5,
                  marginVertical: 10,
                }}
              ></Button>
            </View>
          </View>
        );
      case false:
        return (
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
            <View
              style={{
                height: "100%",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              {datadetail && datadetail?.itinerary_detail ? (
                datadetail?.itinerary_detail?.liked == true ? (
                  <Button
                    onPress={() => _unliked()}
                    text=""
                    size="medium"
                    color="tertiary"
                    type="circle"
                    style={{
                      backgroundColor: "#f6f6f6",
                      borderRadius: 5,
                      marginVertical: 10,
                      marginRight: 10,
                    }}
                  >
                    <Love width={20} height={20} />
                  </Button>
                ) : (
                  <Button
                    onPress={() => _liked()}
                    text=""
                    size="medium"
                    color="tertiary"
                    type="circle"
                    style={{
                      backgroundColor: "#f6f6f6",
                      borderRadius: 5,
                      marginVertical: 10,
                      marginRight: 10,
                    }}
                  >
                    <LikeEmpty width={20} height={20} />
                  </Button>
                )
              ) : null}
              <Button
                onPress={() => {
                  props.navigation.navigate("copyItinerary", {
                    idiItin: itineraryId,
                    datadetail: datadetail?.itinerary_detail,
                  });
                }}
                text={t("CopyTrip")}
                size="medium"
                style={{
                  flex: 1,
                  borderRadius: 5,
                  marginVertical: 10,
                }}
              ></Button>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // ============================== RRRR   EEEE  N     N DDD   EEEEE RRRR   ===============
  // ============================== R   R  E     N N   N D  D  E     R   R  ===============
  // ============================== RRRR   EEE   N  N  N D   D EEE   RRRR   ===============
  // ============================== render utama  ===============
  // ============================== RENDER DATA VIEW  ===============

  let [indexs, setIndexs] = useState(0);
  let [dataImage, setImage] = useState([]);
  let [modalss, setModalss] = useState(false);
  let [modalsss, setModalsss] = useState(false);
  let judul = "";

  let [jamstart, setjamstart] = useState("00");
  let [indexdate, setIndexdate] = useState(0);
  let [typeactivity, setTypeactivity] = useState("");
  let [menitstart, setmenitstart] = useState("00");
  let [jamend, setjamend] = useState("00");
  let [menitend, setmenitend] = useState("00");

  const setdataimage = async (data, inde) => {
    setIndexs(inde);
    var tempdatas = [];
    var x = 0;
    for (var i in data) {
      if (data[i].id !== "camera") {
        let wid = 0;
        let hig = 0;
        if (data[i].type !== "video") {
          Image.getSize(data[i].filepath, (width, height) => {
            wid = width;
            hig = height;
          });
        } else {
          wid = 500;
          hig = 500;
        }

        tempdatas.push({
          key: i,
          selected: i === inde ? true : false,
          url: data[i]?.filepath ? data[i]?.filepath : "",
          width: wid,
          height: hig,
          props: {
            source: data[i]?.filepath ? data[i]?.filepath : "",
            type: data[i]?.type,
          },
          by: data[i]?.upload_by?.first_name
            ? data[i]?.upload_by?.first_name
            : "",
        });
        x++;
      }
    }
    await setImage(tempdatas);
    await setModalss(true);
  };

  const setdataimagepost = async (data, inde) => {
    setIndexs(inde);
    var tempdatas = [];
    var x = 0;
    for (var i in data) {
      if (data[i].id !== "camera") {
        let wid = 0;
        let hig = 0;
        if (data[i].type !== "video") {
          Image.getSize(data[i].filepath, (width, height) => {
            wid = width;
            hig = height;
          });
        } else {
          wid = 500;
          hig = 500;
        }

        tempdatas.push({
          key: i,
          id: data[i].post_id,
          selected: i === inde ? true : false,
          url: data[i]?.filepath ? data[i]?.filepath : "",
          width: wid,
          height: hig,
          props: {
            source: data[i]?.filepath ? data[i]?.filepath : "",
            type: data[i]?.type,
          },
          by: data[i]?.upload_by?.first_name
            ? data[i]?.upload_by?.first_name
            : "",
        });
        x++;
      }
    }
    await setImage(tempdatas);
    await setModalsss(true);
  };

  if (loadingdetail) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator animating={true} color="#209fae" size="large" />
      </View>
    );
  }

  // if (loading) {
  //   return (
  //     <View
  //       // style={{
  //       //   flex: 1,

  //       //   alignItems: "center",
  //       //   alignContent: "center",
  //       //   justifyContent: "center",
  //       // }}
  //       style={{
  //         width: Dimensions.get("screen").width + 25,
  //         height: Dimensions.get("screen").height,
  //         justifyContent: "center",
  //         opacity: 0.7,
  //         zIndex: 99999999,
  //         backgroundColor: "#000",
  //         position: "absolute",
  //       }}
  //     >
  //       <ActivityIndicator animating={true} color="#209fae" size="large" />
  //     </View>
  //   );
  // }

  if (datadetail) {
    let rData = datadetail?.itinerary_detail
      ? datadetail?.itinerary_detail
      : null;
    const yHeader = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 60],
      // extrapolate: 'clamp',
      extrapolateRight: "clamp",
    });

    return (
      <Fragment>
        {/* loading indikator */}
        {loading ? (
          <View
            style={{
              width: Dimensions.get("screen").width + 25,
              height: Dimensions.get("screen").height,
              justifyContent: "center",
              opacity: 0.7,
              zIndex: 99999999,
              backgroundColor: "#000",
              position: "absolute",
            }}
          >
            <ActivityIndicator animating={true} color="#209fae" size="large" />
          </View>
        ) : null}
        <CustomStatusBar backgroundColor="#14646e" barStyle="light-content" />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#FFF",
            paddingTop: -50,
            // paddingBottom: -13,
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              top:
                Platform.OS == "ios"
                  ? null
                  : deviceId == "LYA-L29"
                  ? -2
                  : NotchAndro
                  ? -2
                  : 0,
              zIndex: 99,
              opacity: textOpacity,
              flexDirection: "row",
              justifyContent: "space-between",
              // borderWidth: 1,
              alignContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              height: 55,
              width: Dimensions.get("screen").width,
            }}
          >
            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              onPress={() => _handlerBack()}
              style={{
                height: 50,
                // marginLeft: 8,
              }}
            >
              <Animated.View
                style={{
                  height: 35,
                  width: 35,

                  borderRadius: 30,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {Platform.OS == "ios" ? (
                  <Arrowbackios height={15} width={15}></Arrowbackios>
                ) : (
                  <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
                )}
              </Animated.View>
            </Button>

            <Button
              text={""}
              onPress={() => setshowside(true)}
              size="medium"
              type="circle"
              variant="transparent"
              style={{
                height: 50,
              }}
            >
              <Animated.View
                style={{
                  height: 35,
                  width: 35,

                  borderRadius: 30,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
              </Animated.View>
            </Button>
          </Animated.View>

          {Platform.OS === "ios" ? (
            <View
              style={{
                position: "absolute",
                top: -50,
                width: Dimensions.get("screen").width,
                height: 50,
                backgroundColor: "#14646E",
                zIndex: 100,
              }}
            />
          ) : null}

          {/* jika scrollheader, animated show */}
          <Animated.View
            style={{
              position: "absolute",
              zIndex: 99,
              opacity: textOpacitys,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingTop: Platform.OS == "ios" ? 3 : null,
              height: 55,
              width: Dimensions.get("screen").width,
              backgroundColor: "#209fae",
            }}
          >
            <Animated.View
              style={{
                flexDirection: "row",
                // marginBottom: Platform.OS == "ios" ? 5 : null,
              }}
            >
              <Button
                text={""}
                size="medium"
                type="circle"
                variant="transparent"
                onPress={() => _handlerBack()}
                style={{
                  height: 50,
                  // marginLeft: 8,
                }}
              >
                <Animated.View
                  style={{
                    height: 35,
                    width: 35,

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {Platform.OS == "ios" ? (
                    <Arrowbackios height={15} width={15}></Arrowbackios>
                  ) : (
                    <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
                  )}
                </Animated.View>
              </Button>
              <Animated.View
                style={{
                  // flexDirection: "row",
                  marginTop: Platform.OS == "ios" ? 2 : 6,
                  marginLeft: 5,
                  paddingRight: 20,
                  width: Dimensions.get("screen").width / 1.5,
                }}
              >
                <Animated.Text
                  allowFontScaling={false}
                  style={{
                    opacity: textOpacitys,
                    fontFamily: "Lato-Black",
                    color: "#ffff",
                    textAlign: "left",
                    fontSize: normalize(16),
                  }}
                  numberOfLines={1}
                >
                  {datadetail?.itinerary_detail?.name}
                </Animated.Text>
                <Animated.View
                  style={{
                    flexDirection: "row",
                    marginTop: Platform.OS == "ios" ? 2 : 5,
                    paddingRight: 20,
                  }}
                >
                  {cekTanggal(
                    datadetail?.itinerary_detail?.start_date
                      ? datadetail?.itinerary_detail?.start_date
                      : "1999-01-01"
                  ) <= 180 ? (
                    <Errorx width={18} height={18} style={{ marginRight: 5 }} />
                  ) : null}

                  <Animated.Text
                    size="small"
                    type="bold"
                    style={{
                      color: "#ffffff",
                      opacity: textOpacitys,
                    }}
                    numberOfLines={1}
                  >
                    {/* {t("dates")} :{" "} */}
                    {datadetail && datadetail?.itinerary_detail
                      ? dateFormatr(datadetail?.itinerary_detail?.start_date) +
                        "  -  " +
                        dateFormatr(datadetail?.itinerary_detail?.end_date)
                      : null}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            </Animated.View>

            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              onPress={() => setshowside(true)}
              style={{
                height: 50,
              }}
            >
              <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
            </Button>
          </Animated.View>

          <MenuProvider>
            {renderTabView()}
            {renderHeader(rData)}
            {renderCustomRefresh()}
            {renderMenuBottom(rData)}
          </MenuProvider>

          <ImageSlide
            index={indexs}
            name="Funtravia Images"
            location={judul}
            // {...props}
            show={modalss}
            dataImage={dataImage}
            setClose={() => setModalss(false)}
          />

          <ImageSliders
            index={indexs}
            name="Funtravia Images"
            location={datadetail?.itinerary_detail?.name}
            // {...props}
            show={modalsss}
            dataImage={dataImage}
            props={props}
            token={token}
            setClose={() => setModalsss(false)}
          />

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
            style={{
              justifyContent: "flex-end",
              padding: 0,
              margin: 0,
            }}
          >
            <SafeAreaView
              style={{
                backgroundColor: "white",
                width: "100%",
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#d1d1d1",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  size="title"
                  type="bold"
                  style={{ marginBottom: 15, marginTop: 13 }}
                >
                  {t("addDestinationForm")}
                </Text>
                <Pressable
                  style={{
                    height: 60,
                    width: 60,
                    justifyContent: "center",
                    marginRight: -20,
                  }}
                  onPress={() => {
                    setModalcustom(false);
                  }}
                >
                  <Xhitam
                    width={15}
                    height={15}
                    style={{ alignSelf: "center" }}
                  />
                </Pressable>
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
                        idItin: itineraryId,
                        idDay: datadayaktif.id,
                        itintitle: props.route.params.itintitle,
                        dateitin: props.route.params.datadayaktif.date,
                        datadayaktif: datadayaktif,
                        dataList: dataList,
                      });
                    } else if (jam === 23 && menit === 0) {
                      props.navigation.push("CustomItinerary", {
                        idItin: itineraryId,
                        idDay: datadayaktif.id,
                        itintitle: props.route.params.itintitle,
                        dateitin: props.route.params.datadayaktif.date,
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
                <View style={{ marginBottom: 5 }}>
                  <Text size="label" type="bold">
                    {t("createActivity")}
                  </Text>
                  <Text size="description" type="regular">
                    {t("addCustomActivity")}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalcustom(false);
                  props.navigation.push("ItineraryStack", {
                    screen: "customFlight",
                    params: {
                      itineraryId: itineraryId,
                      dayId: idDay,
                      startDate: datadetail?.itinerary_detail?.start_date,
                      endDate: EndTimeConverter(
                        datadetail?.itinerary_detail?.end_date
                      ),
                    },
                  });
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
                  <Flights height={25} width={25} />
                </View>
                <View style={{ marginBottom: 5 }}>
                  <Text size="label" type="bold">
                    {t("Flight")}
                  </Text>
                  <Text size="description" type="regular">
                    {t("addFlightDetail")}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalcustom(false);
                  props.navigation.push("ItineraryStack", {
                    screen: "customStay",
                    params: {
                      itineraryId: itineraryId,
                      dayId: idDay,
                      startDate: datadetail?.itinerary_detail?.start_date,
                      endDate: EndTimeConverter(
                        datadetail?.itinerary_detail?.end_date
                      ),
                    },
                  });
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
                  <Stay height={25} width={25} />
                </View>
                <View>
                  <Text size="label" type="bold">
                    {t("Stay")}
                  </Text>
                  <Text size="description" type="regular">
                    {t("addPlaceName")}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalcustom(false);
                  let maxjam = datadayaktif.total_hours.split(":");
                  let jam = parseFloat(maxjam[0]);
                  let menit = parseFloat(maxjam[1]);
                  dispatch(setItinerary(props.route.params));
                  if (jam < 24) {
                    if (jam < 23) {
                      props.navigation.push("AccountStack", {
                        screen: "Wishlist",
                        params: {
                          IdItinerary: itineraryId,
                          datadayaktif: datadayaktif,
                          dataDes:
                            datadetail && datadetail?.itinerary_detail
                              ? datadetail
                              : null,
                          datadayaktif: datadayaktif,
                          lat: datadetail?.itinerary_detail?.city.latitude,
                          long: datadetail?.itinerary_detail?.city.longitude,
                          from: "itinerary_wishlist",
                        },
                      });
                    } else if (jam === 23 && menit === 0) {
                      props.navigation.push("AccountStack", {
                        screen: "Wishlist",
                        params: {
                          IdItinerary: itineraryId,
                          datadayaktif: datadayaktif,
                          dataDes:
                            datadetail && datadetail?.itinerary_detail
                              ? datadetail
                              : null,
                          datadayaktif: datadayaktif,
                          lat: datadetail?.itinerary_detail?.city.latitude,
                          long: datadetail?.itinerary_detail?.city.longitude,
                          from: "itinerary_wishlist",
                        },
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
                  <Love height={15} width={15} />
                </View>
                <View style={{ marginBottom: 5 }}>
                  <Text size="label" type="bold">
                    {t("myWishlist")}
                  </Text>
                  <Text size="description" type="regular">
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
                          datadetail && datadetail?.itinerary_detail
                            ? datadetail
                            : null,
                        token: token,
                        datadayaktif: datadayaktif,
                        lat: datadetail?.itinerary_detail?.city.latitude,
                        long: datadetail?.itinerary_detail?.city.longitude,
                      });
                    } else if (jam === 23 && menit === 0) {
                      props.navigation.push("ItinGoogle", {
                        dataDes:
                          datadetail && datadetail?.itinerary_detail
                            ? datadetail
                            : null,
                        token: token,
                        datadayaktif: datadayaktif,
                        lat: datadetail?.itinerary_detail?.city.latitude,
                        long: datadetail?.itinerary_detail?.city.longitude,
                      });
                    } else {
                      Alert.alert(t("alertjam"));
                    }
                  } else {
                    Alert.alert(t("alertjam"));
                  }
                }}
                style={{
                  // marginVertical: 2.5,
                  width: "100%",
                  height: Dimensions.get("screen").width * 0.2,
                  // borderBottomWidth: 1,
                  // borderBottomColor: "#d1d1d1",
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
                <View style={{ marginBottom: 5 }}>
                  <Text size="label" type="bold">
                    {t("searchFromGoogle")}
                  </Text>
                  <Text size="description" type="regular">
                    {t("addDestinationGoogle")}
                  </Text>
                </View>
              </TouchableOpacity>
            </SafeAreaView>
            {/* <View
              style={{
                width: Dimensions.get("window").width,
                backgroundColor: "white",
                borderTopWidth: 1,
                borderColor: "#F0F0F0",
                shadowColor: "#F0F0F0",
                shadowOffset: {width: 2, height: 2},
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: Platform.OS === "ios" ? (Notch ? 20 : 0) : 0,
              }}
            >
              <Button
                color="tertiary"
                type="circle"
                style={{
                  borderRadius: 0,
                  width: "15%",
                  height: 56,
                  fontSize: 18,
                }}
                onPress={() => {
                  props.navigation.navigate("ChatStack", {
                    screen: "GroupRoom",
                    params: {
                      room_id: itineraryId,
                      name: dta ? dta.name : null,
                      picture: Cover,
                      is_itinerary: true,
                    },
                  });
                }}
              >
                <Chatnew width={20} height={20} />
                <Text size="small" style={{color: "black"}}>
                  {t("Chat")}
                </Text>
              </Button>
              <Button
                onPress={() => {
                  setModalcustom(false);
                  let maxjam = datadayaktif.total_hours.split(":");
                  let jam = parseFloat(maxjam[0]);
                  let menit = parseFloat(maxjam[1]);
                  if (jam < 24) {
                    if (jam < 23) {
                      dispatch(
                        setItinerary({
                          ...props.route.params,
                          id_city: dataList
                            ? dataList[dataList.length - 1].id_city
                            : null,
                          city_name: dataList
                            ? dataList[dataList.length - 1].city
                            : null,
                        })
                      );
                      props.navigation.push("itindest", {
                        IdItinerary: itineraryId,
                        token: token,
                        datadayaktif: datadayaktif,
                        dataDes:
                          datadetail && datadetail?.itinerary_detail
                            ? datadetail
                            : null,
                        lat: datadetail?.itinerary_detail?.city.latitude,
                        long: datadetail?.itinerary_detail?.city.longitude,
                        idcity:
                          dataList &&
                          dataList?.length > 0 &&
                          dataList[dataList.length - 1].id_city
                            ? dataList[dataList.length - 1].id_city
                            : datadetail?.itinerary_detail?.city.id,
                        idcountries: datadetail?.itinerary_detail?.country.id,
                      });
                    } else if (jam === 23 && menit === 0) {
                      dispatch(
                        setItinerary({
                          ...props.route.params,
                          id_city: dataList
                            ? dataList[dataList.length - 1].id_city
                            : null,
                          city_name: dataList
                            ? dataList[dataList.length - 1].city
                            : null,
                        })
                      );
                      props.navigation.push("itindest", {
                        IdItinerary: itineraryId,
                        token: token,
                        datadayaktif: datadayaktif,
                        dataDes:
                          datadetail && datadetail?.itinerary_detail
                            ? datadetail
                            : null,
                        lat: datadetail?.itinerary_detail?.city.latitude,
                        long: datadetail?.itinerary_detail?.city.longitude,
                        idcity:
                          dataList &&
                          dataList?.length > 0 &&
                          dataList[dataList.length - 1].id_city
                            ? dataList[dataList.length - 1].id_city
                            : datadetail?.itinerary_detail?.city.id,
                        idcountries: datadetail?.itinerary_detail?.country.id,
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
                  width: "40%",
                  height: 56,
                  fontSize: 18,
                }}
              ></Button>

              <View
                style={{
                  height: "100%",
                  width: "45%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
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
                  <Text size="small" style={{color: "#209fae"}}>
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
                  <Text size="small" style={{color: "#d75995"}}>
                    {t("completePlan")}
                  </Text>
                </Button>
              </View>
            </View> */}
          </Modal>

          <Modal
            onBackdropPress={() => {
              setModal(false);
            }}
            avoidKeyboard={true}
            onRequestClose={() => setModal(false)}
            onDismiss={() => setModal(false)}
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={modal}
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              alignContent: "center",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width - 100,
                marginHorizontal: 50,
                backgroundColor: "#FFF",
                borderRadius: 5,
                marginTop: Dimensions.get("screen").height / 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingHorizontal: 20,
                  backgroundColor: "#f6f6f6",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="bold"
                  style={{ marginTop: 13, marginBottom: 15 }}
                >
                  {t("EditNotes")}
                </Text>
                <Pressable
                  onPress={() => setModal(false)}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <View
                style={{
                  // borderColor: "#D1D1D1",
                  // width: width - 140,
                  marginVertical: 20,
                  // alignSelf: "center",
                  // // borderRadius: 5,
                  // backgroundColor: "#f6f6f6",
                }}
              >
                <Textarea
                  style={{
                    width: width - 140,
                    marginVertical: 20,
                    borderRadius: 5,
                    fontFamily: "Lato-Regular",
                    backgroundColor: "#f6f6f6",
                    alignSelf: "center",
                  }}
                  rowSpan={5}
                  placeholder={t("inputNotes")}
                  value={textinput}
                  bordered
                  maxLength={160}
                  onChangeText={(text) => setInput(text)}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingHorizontal: 15,
                  marginBottom: 20,
                }}
              >
                <Button
                  onPress={() => setModal(false)}
                  size="medium"
                  color="transparant"
                  text={t("cancel")}
                ></Button>
                <Button
                  onPress={() => saveNotes()}
                  style={{
                    marginLeft: 10,
                  }}
                  color="primary"
                  text={t("submit")}
                ></Button>
              </View>
            </View>

            {/* <View
            style={{
              width: Dimensions.get("screen").width - 20,
              backgroundColor: "white",
              marginBottom: 70,
              paddingTop: 60,
              paddingHorizontal: 20,
              paddingBottom: 30,
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 20,
                left: 20,
              }}
              onPress={() => setModal(false)}
            >
              <Xhitam width={15} height={15} />
            </TouchableOpacity>
            <Text size="label" type="bold" style={{}}>
              {t("EditNotes")}
            </Text>
            <Textarea
              style={{
                width: "100%",
                borderRadius: 5,
                fontFamily: "Lato-Regular",
              }}
              rowSpan={5}
              placeholder="Input Notes"
              value={textinput}
              bordered
              maxLength={160}
              onChangeText={(text) => setInput(text)}
            />
            <TouchableOpacity
              onPress={() => saveNotes()}
              style={{
                marginTop: 15,
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                backgroundColor: "#209fae",
                paddingHorizontal: 40,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  color: "white",
                }}
              >
                {t("save")}
              </Text>
            </TouchableOpacity>
          </View> */}
          </Modal>

          {/* modaldates */}
          <Modal
            onBackdropPress={() => {
              setModaldate(false);
            }}
            onRequestClose={() => setModaldate(false)}
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={modaldate}
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              alignContent: "center",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width - 80,
                backgroundColor: "white",
                paddingVertical: Platform.OS === "ios" ? 10 : 30,
                paddingHorizontal: 20,
                alignContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <Text size="label">{t("setTimeForActivity")}</Text>
              <Text size="title" type="bold">
                {dataList[indexinput]?.name}
              </Text>

              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "#f3f3f3",
                  padding: 15,
                  borderRadius: 5,
                }}
              >
                <Text
                  size="label"
                  // type="bold"
                  style={{ alignSelf: "center" }}
                >
                  {t("From")}
                </Text>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <Picker
                      iosIcon={
                        <View>
                          <Bottom />
                        </View>
                      }
                      iosHeader="Select Hours"
                      note
                      mode="dropdown"
                      selectedValue={jamstart}
                      textStyle={{ fontFamily: "Lato-Regular" }}
                      itemTextStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      itemStyle={{ fontFamily: "Lato-Regular" }}
                      placeholderStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      headerTitleStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      style={{
                        color: "#209fae",
                        fontFamily: "Lato-Regular",
                      }}
                      onValueChange={
                        (itemValue, itemIndex) => (
                          setjamstart(itemValue), setjamend(itemValue)
                        )
                        // setjamend(itemValue))
                      }
                    >
                      {indexdate == 0 ? (
                        jams.map((item, index) => {
                          return (
                            <Picker.Item key={item} label={item} value={item} />
                          );
                        })
                      ) : (
                        <Picker.Item
                          key={jamstart}
                          label={jamstart}
                          value={jamstart}
                        />
                      )}
                    </Picker>
                  </View>

                  <View
                    style={{
                      width: "5%",
                      alignItems: "center",
                      // alignContent: "flex-end",
                    }}
                  >
                    <Text size="description" type="bold" style={{}}>
                      :
                    </Text>
                  </View>
                  <View style={{ width: "40%" }}>
                    <Picker
                      iosHeader="Select Minutes"
                      headerBackButtonTextStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      note
                      mode="dropdown"
                      selectedValue={menitstart}
                      textStyle={{ fontFamily: "Lato-Regular" }}
                      itemTextStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      itemStyle={{ fontFamily: "Lato-Regular" }}
                      placeholderStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      iosIcon={
                        <View>
                          <Bottom />
                        </View>
                      }
                      headerTitleStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      style={{
                        color: "#209fae",
                        fontFamily: "Lato-Regular",
                      }}
                      onValueChange={(itemValue, itemIndex) =>
                        setmenitstart(itemValue)
                      }
                    >
                      {indexdate == 0 ? (
                        menits.map((item, index) => {
                          return (
                            <Picker.Item
                              key={""}
                              label={item + ""}
                              value={item}
                            />
                          );
                        })
                      ) : (
                        <Picker.Item
                          key={menitstart}
                          label={menitstart + ""}
                          value={menitstart}
                        />
                      )}
                    </Picker>
                  </View>
                </View>

                <Text size="label" style={{ alignSelf: "center" }}>
                  {t("To")}
                </Text>

                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <Picker
                      iosIcon={
                        <View>
                          <Bottom />
                        </View>
                      }
                      iosHeader="Select Hours"
                      note
                      mode="dropdown"
                      selectedValue={jamend}
                      textStyle={{ fontFamily: "Lato-Regular" }}
                      itemTextStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      itemStyle={{ fontFamily: "Lato-Regular" }}
                      placeholderStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      headerTitleStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      style={{
                        color: "#209fae",
                        fontFamily: "Lato-Regular",
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        itemValue <= jamstart
                          ? Alert.alert("Opss", t("AlertTime"), [
                              {
                                text: "OK",
                                onPress: () => console.log("OK Pressed"),
                              },
                            ])
                          : null,
                          setjamend(
                            itemValue >= jamstart ? itemValue : jamstart
                          );
                      }}
                    >
                      {jams.map((item, index) => {
                        return (
                          <Picker.Item key={item} label={item} value={item} />
                        );
                      })}
                    </Picker>
                  </View>

                  <View
                    style={{
                      width: "5%",
                      alignItems: "center",
                      // alignContent: "flex-end",
                    }}
                  >
                    <Text size="description" type="bold" style={{}}>
                      :
                    </Text>
                  </View>
                  <View style={{ width: "40%" }}>
                    <Picker
                      iosHeader="Select Minutes"
                      headerBackButtonTextStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      note
                      mode="dropdown"
                      selectedValue={menitend}
                      textStyle={{ fontFamily: "Lato-Regular" }}
                      itemTextStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      itemStyle={{ fontFamily: "Lato-Regular" }}
                      placeholderStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      iosIcon={
                        <View>
                          <Bottom />
                        </View>
                      }
                      headerTitleStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      style={{
                        color: "#209fae",
                        fontFamily: "Lato-Regular",
                      }}
                      onValueChange={(itemValue, itemIndex) =>
                        setmenitend(itemValue)
                      }
                    >
                      {menits.map((item, index) => {
                        return (
                          <Picker.Item
                            key={""}
                            label={item + ""}
                            value={item}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setTime(
                    jamstart,
                    menitstart,
                    jamend,
                    menitend,
                    dataList,
                    dataList[indexinput]?.order
                  )
                }
                style={{
                  marginTop: 20,
                  backgroundColor: "#209fae",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: "white",
                  }}
                >
                  {t("save")}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Modal Hapus Day */}
          <Modalss
            useNativeDriver={true}
            visible={modalDelete}
            onRequestClose={() => false}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalDelete(false)}
              style={{
                width: Dimensions.get("screen").width + 25,
                height: Dimensions.get("screen").height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
                left: -21,
              }}
            />
            <View
              style={{
                width: Dimensions.get("screen").width - 140,
                // marginHorizontal: 70,
                alignSelf: "center",
                backgroundColor: "#FFF",
                zIndex: 15,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignContent: "center",
                borderRadius: 5,
                marginTop: Dimensions.get("screen").height / 2.5,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: Dimensions.get("screen").width - 140,
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: 1,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <Text style={{ marginVertical: 15 }} size="title" type="bold">
                    {t("deleteActivity")}
                  </Text>
                </View>
                <Text
                  style={{
                    alignSelf: "center",
                    textAlign: "center",
                    marginTop: 20,
                    marginHorizontal: 10,
                  }}
                  size="label"
                  type="regular"
                >
                  {t("DeleteActivityfromItinerary")}
                </Text>
                <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                  <Button
                    onPress={() => {
                      deleteactivity(itineraryId, idactivity, types),
                        setModalDelete(false);
                    }}
                    color="secondary"
                    text={t("delete")}
                  ></Button>
                  <Button
                    onPress={() => {
                      setModalDelete(false);
                    }}
                    style={{ marginVertical: 7 }}
                    variant="transparent"
                    text={t("discard")}
                  ></Button>
                </View>
              </View>
            </View>
          </Modalss>
          {/* End of Modal Hapus */}

          {/* Modal Hapus Aktifitas */}
          <Modalss
            useNativeDriver={true}
            visible={modalmenuday}
            onRequestClose={() => setModalmenuday(false)}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalmenuday(false)}
              style={{
                width: Dimensions.get("screen").width + 25,
                height: Dimensions.get("screen").height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
                left: -21,
              }}
            />
            <View
              style={{
                width: Dimensions.get("screen").width - 140,
                // marginHorizontal: 70,
                alignSelf: "center",
                backgroundColor: "#FFF",
                zIndex: 15,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignContent: "center",
                borderRadius: 5,
                marginTop: Dimensions.get("screen").height / 2.5,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: Dimensions.get("screen").width - 140,
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: 1,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <Text style={{ marginVertical: 15 }} size="title" type="bold">
                    {t("deleteDay")}
                  </Text>
                </View>
                <Text
                  style={{
                    alignSelf: "center",
                    textAlign: "center",
                    marginTop: 20,
                    marginHorizontal: 10,
                  }}
                  size="label"
                  type="regular"
                >
                  {`${t("deleteDay")} ${datadayaktif?.day} ${t(
                    "fromItinerary"
                  )}`}
                </Text>
                <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                  <Button
                    onPress={() => {
                      _handledeleteDay(
                        datadayaktif?.itinerary_id,
                        datadayaktif?.id
                      );
                    }}
                    color="secondary"
                    text={t("delete")}
                  ></Button>
                  <Button
                    onPress={() => {
                      setModalmenuday(false);
                    }}
                    style={{ marginVertical: 7 }}
                    variant="transparent"
                    text={t("discard")}
                  ></Button>
                </View>
              </View>
            </View>
          </Modalss>
          {/* End of Modal Hapus */}

          {/* Modal Delete Option Aktifitas */}

          <Modalss
            onBackdropPress={() => {
              setModalmenu(false);
            }}
            onRequestClose={() => setModalmenu(false)}
            onDismiss={() => setModalmenu(false)}
            // animationIn="fadeIn"
            // animationOut="fadeOut"
            visible={modalmenu}
            transparent={true}
          >
            <Pressable
              onPress={() => setModalmenu(false)}
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
                alignSelf: "center",
              }}
            ></Pressable>
            <View
              style={{
                width: Dimensions.get("screen").width - 100,
                marginHorizontal: 50,
                // backgroundColor: "#FFF",
                zIndex: 15,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignSelf: "center",
                marginTop: Dimensions.get("screen").height / 2.5,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: Dimensions.get("screen").width - 60,
                  // paddingHorizontal: 20,

                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    alignItems: "center",
                    backgroundColor: "#f6f6f6",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
                >
                  <Text style={{ marginVertical: 15 }} type="bold" size="title">
                    {t("option")}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setModalmenu(false)}
                  style={{
                    position: "absolute",
                    right: 0,
                    width: 55,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 55,
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
                {types !== "custom" && types !== "google" ? (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 15,
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "#d1d1d1",
                    }}
                    onPress={() => {
                      // add to itin
                      setModalmenu(false);
                      props.navigation.push("ItineraryStack", {
                        screen: "ItineraryPlaning",
                        params: {
                          idkiriman: idTarget,
                          Position: types,
                          data_from: "itinerary",
                        },
                      });
                    }}
                  >
                    <Text size="label" type="regular">
                      {t("addActivityToItinerary")}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setModalmenu(false);
                    setModalDelete(true);
                  }}
                >
                  <Text
                    size="label"
                    type="regular"
                    style={{
                      color: "#d75995",
                      marginVertical: 15,
                    }}
                  >
                    {t("delete")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modalss>
          {/* End of Modal Delete Option  */}

          {/* Modal Gallery/photo */}
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
            <Pressable
              onPress={() => setmodalcover(false)}
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
                alignSelf: "center",
              }}
            ></Pressable>
            <View
              style={{
                width: Dimensions.get("screen").width - 100,
                marginHorizontal: 50,
                // backgroundColor: "#FFF",
                zIndex: 15,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignSelf: "center",
                marginTop: Dimensions.get("screen").height / 10,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    alignItems: "center",
                    backgroundColor: "#f6f6f6",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
                >
                  <Text style={{ marginVertical: 15 }} type="bold" size="title">
                    {t("option")}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setmodalcover(false)}
                  style={{
                    position: "absolute",
                    right: 0,
                    width: 55,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 55,
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
                <View
                  style={{
                    backgroundColor: "white",
                    width: Dimensions.get("screen").width - 100,
                    borderBottomRightRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingVertical: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      borderBottomWidth: 1,
                      borderBottomColor: "#d1d1d1",
                    }}
                    onPress={() => {
                      pickcamera();
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
                      paddingVertical: 20,
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      pickGallery();
                    }}
                  >
                    <Text size="description" type="regular" style={{}}>
                      {t("OpenGallery")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            onBackdropPress={() => {
              setmodalAlbum(false);
            }}
            onRequestClose={() => setmodalAlbum(false)}
            onDismiss={() => setmodalAlbum(false)}
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={modalAlbum}
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
                  pickcameraAlbum();
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
                  pickGalleryAlbum();
                }}
              >
                <Text size="description" type="regular" style={{}}>
                  {t("OpenGallery")}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modalss
            onBackdropPress={() => {
              setmodalerrors(false);
            }}
            onRequestClose={() => setmodalerrors(false)}
            onDismiss={() => setmodalerrors(false)}
            // animationIn="fadeIn"
            // animationOut="fadeOut"
            visible={modalerrors}
            transparent={true}
          >
            <Pressable
              onPress={() => {
                setmodalerrors(false);
              }}
              style={{
                height: Dimensions.get("screen").height,
                width: Dimensions.get("screen").width,
                backgroundColor: "'rgba(0, 0, 0, 0.7)'",
                // opacity: 0.7,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                alignContent: "center",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width - 100,
                  backgroundColor: "#F6F6F6",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="label"
                  type="bold"
                  style={{
                    marginTop: 13,
                    marginBottom: 15,
                  }}
                >
                  Oops
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "white",
                  alignItems: "center",
                  alignContent: "center",
                  // height: 100,
                  width: Dimensions.get("screen").width - 100,
                  padding: 20,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                <Errors height={100} width={100} />
                <Text
                  type="bold"
                  size="label"
                  style={{
                    marginTop: 20,
                  }}
                >
                  {t("yourTripIsNotComplete")}
                </Text>
                <Text
                  // textAlign={"center"}
                  size="label"
                  style={{
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {t("dayEmptyTrip")}
                </Text>
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: "#f3f3f3",
                    padding: 15,
                    borderRadius: 5,
                  }}
                >
                  <Text size="label" style={{ textAlign: "center" }}>
                    {t("activateThisTrip")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setmodalerrors(false);
                  }}
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <Text
                    type="bold"
                    size="label"
                    style={{
                      color: "#209fae",
                    }}
                  >
                    {t("understand")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modalss>

          {/* modal alert trip belum aktif */}
          <Modalss
            onBackdropPress={() => {
              setIndex(0);
              setmodalTrip(false);
            }}
            onRequestClose={() => setmodalTrip(false)}
            onDismiss={() => setmodalTrip(false)}
            visible={modalTrip}
            transparent={true}
          >
            <Pressable
              onPress={() => {
                setIndex(0);
                setmodalTrip(false);
              }}
              style={{
                height: Dimensions.get("screen").height,
                width: Dimensions.get("screen").width,
                backgroundColor: "'rgba(0, 0, 0, 0.7)'",
                // opacity: 0.7,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                alignContent: "center",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width - 100,
                  backgroundColor: "#F6F6F6",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="label"
                  type="bold"
                  style={{
                    marginTop: 13,
                    marginBottom: 15,
                  }}
                >
                  Oops
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "white",
                  alignItems: "center",
                  alignContent: "center",
                  // height: 100,
                  width: Dimensions.get("screen").width - 100,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                }}
              >
                <Errors height={80} width={80} />
                <Text
                  type="bold"
                  size="title"
                  style={{
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  {t("TripnotStarted")}
                </Text>
                <Text
                  // textAlign={"center"}
                  size="label"
                  style={{
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {t("dayEmptyTrip")}
                </Text>
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: "#f3f3f3",
                    padding: 20,
                  }}
                >
                  <Text size="label" style={{ textAlign: "center" }}>
                    {t("dayEmptyTrip")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setIndex(0);
                    setmodalTrip(false);
                  }}
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <Text
                    type="bold"
                    size="label"
                    style={{
                      color: "#209fae",
                    }}
                  >
                    {t("understand")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modalss>

          {/* modal alert trip belum aktif */}
          <Modalss
            onBackdropPress={() => {
              setmodalerrors(false);
            }}
            onRequestClose={() => setmodalTrip(false)}
            onDismiss={() => setmodalTrip(false)}
            visible={modalTrip}
            transparent={true}
          >
            <Pressable
              onPress={() => {
                setmodalTrip(false);
              }}
              style={{
                height: Dimensions.get("screen").height,
                width: Dimensions.get("screen").width,
                backgroundColor: "'rgba(0, 0, 0, 0.7)'",
                // opacity: 0.7,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                alignContent: "center",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width - 100,
                  backgroundColor: "#F6F6F6",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="label"
                  type="bold"
                  style={{
                    marginTop: 13,
                    marginBottom: 15,
                  }}
                >
                  Oops
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "white",
                  alignItems: "center",
                  alignContent: "center",
                  // height: 100,
                  width: Dimensions.get("screen").width - 100,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                }}
              >
                <Errors height={80} width={80} />
                <Text
                  type="bold"
                  size="title"
                  style={{
                    marginTop: 20,
                  }}
                >
                  {t("TripnotStarted")}
                </Text>
                <Text
                  // textAlign={"center"}
                  size="label"
                  style={{
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {t("waittripongoing")}
                </Text>
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: "#f3f3f3",
                    padding: 20,
                  }}
                >
                  <Text
                    size="label"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {t("addphotototrip")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setmodalTrip(false);
                  }}
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <Text
                    type="bold"
                    size="label"
                    style={{
                      color: "#209fae",
                    }}
                  >
                    {t("understand")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modalss>

          <Modalss
            onBackdropPress={() => {
              setSoon(false);
            }}
            onRequestClose={() => setSoon(false)}
            onDismiss={() => setSoon(false)}
            visible={soon}
            transparent={true}
          >
            <Pressable
              onPress={() => setSoon(false)}
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
                borderRadius: 5,
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
                borderRadius: 5,
                marginTop: Dimensions.get("screen").height / 2.5,
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
                  borderRadius: 5,
                }}
              >
                <Image
                  source={Bg_soon}
                  style={{
                    height: Dimensions.get("screen").width - 180,
                    width: Dimensions.get("screen").width - 110,
                    position: "absolute",
                    borderRadius: 5,
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
          </Modalss>

          {/* Modal Leave Trip */}
          <Modal
            useNativeDriver={true}
            visible={modalLeaveTrip}
            onRequestClose={() => setModalLeaveTrip(false)}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalLeaveTrip(false)}
              style={{
                width: Dimensions.get("screen").width + 25,
                height: Dimensions.get("screen").height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
                left: -21,
              }}
            />
            <View
              style={{
                width: Dimensions.get("screen").width - 140,
                alignSelf: "center",
                backgroundColor: "#FFF",
                zIndex: 15,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignContent: "center",
                borderRadius: 5,
                marginTop: Dimensions.get("screen").height / 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: Dimensions.get("screen").width - 140,
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: 1,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <Text style={{ marginVertical: 15 }} size="title" type="bold">
                    {t("leave")} {t("trip")}
                  </Text>
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                  <Button
                    onPress={() => {
                      _handleLeave(itineraryId), setModalLeaveTrip(false);
                    }}
                    color="secondary"
                    text={t("leave")}
                  ></Button>
                  <Button
                    onPress={() => {
                      setModalLeaveTrip(false);
                    }}
                    style={{ marginVertical: 7 }}
                    variant="transparent"
                    text={t("discard")}
                  ></Button>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal Delete Trip */}
          <Modal
            useNativeDriver={true}
            visible={modalDeleteTrip}
            onRequestClose={() => setModalDeleteTrip(false)}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalDeleteTrip(false)}
              style={{
                width: Dimensions.get("screen").width + 25,
                height: Dimensions.get("screen").height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
                left: -21,
              }}
            />
            <View
              style={{
                width: Dimensions.get("screen").width - 140,
                alignSelf: "center",
                backgroundColor: "#FFF",
                zIndex: 15,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignContent: "center",
                borderRadius: 5,
                marginTop: Dimensions.get("screen").height / 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: Dimensions.get("screen").width - 140,
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: 1,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <Text style={{ marginVertical: 15 }} size="title" type="bold">
                    {t("delete")} {t("trip")}
                  </Text>
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                  <Button
                    onPress={() => {
                      _handlehapus(itineraryId), setModalDeleteTrip(false);
                    }}
                    color="secondary"
                    text={t("delete")}
                  ></Button>
                  <Button
                    onPress={() => {
                      setModalDeleteTrip(false);
                    }}
                    style={{ marginVertical: 7 }}
                    variant="transparent"
                    text={t("discard")}
                  ></Button>
                </View>
              </View>
            </View>
          </Modal>
          {/* modal titik tiga header */}
          <Modalss
            animationType="slide"
            onBackdropPress={() => {
              setshowside(false);
            }}
            onRequestClose={() => setshowside(false)}
            onDismiss={() => setshowside(false)}
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
                  width: Dimensions.get("screen").width - 15,

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
                  {t("option")}
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
                  onPress={() => setshowside(false)}
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
                  paddingTop: 10,
                  // paddingVertical: 20,
                  width: "100%",
                  // justifyContent: "flex-start",
                }}
              >
                <View>
                  {Anggota && statusUsers == true ? (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        paddingVertical: 5,
                        alignItems: "center",
                        marginVertical: 5,
                      }}
                      onPress={() => {
                        props.navigation.push("SettingItin", {
                          token: token,
                          iditin: itineraryId,
                          isPrivate:
                            datadetail && datadetail?.itinerary_detail
                              ? datadetail?.itinerary_detail?.isprivate
                              : false,
                        }),
                          setshowside(false);
                      }}
                    >
                      <Settings height={20} width={20} />
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
                  ) : null}
                  {Anggota ? (
                    <TouchableOpacity
                      style={{
                        marginVertical: 5,
                        flexDirection: "row",
                        width: "100%",
                        paddingVertical: 5,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setshowside(false), setmodalcover(true);
                      }}
                    >
                      <Create height={20} width={20} />

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
                  ) : null}

                  <TouchableOpacity
                    style={{
                      marginVertical: 5,
                      flexDirection: "row",
                      width: "100%",
                      paddingVertical: 5,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setshowside(false);
                      props.navigation.navigate("detailItinerary", {
                        data: datadetail,
                      });
                    }}
                  >
                    <Help height={25} width={25} style={{ marginLeft: -5 }} />

                    <Text
                      size="label"
                      type="regular"
                      style={{
                        marginLeft: 10,
                      }}
                    >
                      {t("Tripdetail")}
                    </Text>
                  </TouchableOpacity>

                  {Anggota ? (
                    <TouchableOpacity
                      style={{
                        marginVertical: 5,
                        flexDirection: "row",
                        width: "100%",
                        paddingVertical: 5,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setModalLeaveTrip(true), setshowside(false);
                      }}
                    >
                      <LeaveTrips height={20} width={20} />

                      <Text
                        size="label"
                        type="regular"
                        style={{
                          marginLeft: 10,
                        }}
                      >
                        {t("leave")} {t("trip")}
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {Anggota && statusUsers == true ? (
                    <TouchableOpacity
                      style={{
                        marginVertical: 5,
                        flexDirection: "row",
                        width: "100%",
                        paddingVertical: 5,
                        marginBottom: 10,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setModalDeleteTrip(true), setshowside(false);
                      }}
                    >
                      <Delete height={20} width={20} />

                      <Text
                        size="label"
                        type="regular"
                        style={{
                          marginLeft: 10,
                          color: "#D75995",
                        }}
                      >
                        {t("delete")} {t("trip")}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View
                  style={{
                    width: Dimensions.get("screen").width - 60,
                    height: 1,
                    marginTop: 10,
                    marginBottom: 10,
                    borderWidth: 0.5,
                    borderColor: "#d1d1d1",
                    // paddingHorizontal: 20,
                  }}
                />
                <TouchableOpacity
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    width: "100%",
                    paddingVertical: 5,
                    marginBottom: Platform.OS === "ios" && Notch ? 40 : 20,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    props.navigation.push("BottomStack"), setshowside(false);
                  }}
                >
                  <Home height={20} width={20} />

                  <Text
                    size="label"
                    type="regular"
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    {t("backToHome")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modalss>

          <Modalss
            useNativeDriver={true}
            visible={aler.show}
            onRequestClose={() => true}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setClose()}
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
              }}
            />
            <View
              style={{
                width: Dimensions.get("screen").width - 100,
                alignSelf: "center",
                zIndex: 100,
                marginTop: Dimensions.get("screen").height / 3,
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width - 100,
                  backgroundColor: "#F6F6F6",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="label"
                  type="bold"
                  style={{
                    marginTop: 13,
                    marginBottom: 15,
                  }}
                >
                  Oops
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.get("screen").width - 100,
                  backgroundColor: "white",
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  // borderWidth: 1,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-evenly",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Errors width={70} height={70} style={{ marginBottom: 15 }} />
                  <Text
                    size="label"
                    type="bold"
                    style={{ marginBottom: 5, textAlign: "center" }}
                  >
                    {t(aler.judul)}
                  </Text>
                  <Text
                    size="label"
                    type="regular"
                    style={{ marginBottom: 15, textAlign: "center" }}
                  >
                    {t(aler.judulDetail)}
                  </Text>
                  {aler?.detail?.length !== 0 && aler?.detail !== 0 ? (
                    <View
                      style={{
                        backgroundColor: "#F6F6F6",
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        size="label"
                        type="regular"
                        style={{
                          color: "#464646",
                          textAlign: "center",
                          marginTop: 5,
                          marginBottom: 7,
                          marginHorizontal: 10,
                        }}
                      >
                        {t(aler?.detail)}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Pressable
                onPress={() => showAlert({ ...aler, show: false })}
                underlayColor="#F6F6F6"
                style={{
                  width: Dimensions.get("screen").width - 100,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  paddingBottom: 5,
                  // paddingVertical: 15,
                  paddingTop: aler.detail.length === 0 ? 5 : 0,
                }}
              >
                <Text
                  size="label"
                  type="bold"
                  style={{
                    marginTop: aler.detail.length > 0 ? 13 : 0,
                    marginBottom: 15,
                    color: "#209fae",
                  }}
                >
                  {t("understand")}
                </Text>
              </Pressable>
            </View>
          </Modalss>
          {showside ? (
            <Pressable
              onPress={() => setshowside(false)}
              style={{
                width: Dimensions.get("screen").width + 25,
                height: Dimensions.get("screen").height,
                justifyContent: "center",
                opacity: 0.7,
                zIndex: 99999999,
                backgroundColor: "#000",
                position: "absolute",
              }}
            ></Pressable>
          ) : null}
        </SafeAreaView>
      </Fragment>
    );
  }

  return <View></View>;
}
const styles = StyleSheet.create({
  label: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelDisabled: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#c7c7c7",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "#FFCC80",
    height: TabBarHeight,
  },

  indicatormax: { backgroundColor: "#209FAE", height: 0 },
  indicatormin: { backgroundColor: "#209FAE", height: 2 },
});
