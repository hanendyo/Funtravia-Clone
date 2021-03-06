import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Platform,
  BackHandler,
  Modal as Modalss,
  Pressable,
  StatusBar,
} from "react-native";
import { back_arrow_white, default_image } from "../../assets/png";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import CheckBox from "@react-native-community/checkbox";
import ItineraryDetails from "../../graphQL/Query/Itinerary/ItineraryDetails";
import { dateFormat, dateFormats } from "../../component/src/dateformatter";
import AddDay from "../../graphQL/Mutation/Itinerary/AddDay";
import AddDestination from "../../graphQL/Mutation/Itinerary/AddDestination";
import AddGoogle from "../../graphQL/Mutation/Itinerary/AddGoogle";
import AddEvent from "../../graphQL/Mutation/Itinerary/AddEvent";
import { Button, Text, Truncate, Loading } from "../../component";
import { Arrowbackios, Arrowbackwhite, Errors } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setSearchInput } from "../../redux/action";
import DeviceInfo from "react-native-device-info";

export default function ItineraryChooseday(props) {
  const Notch = DeviceInfo.hasNotch();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  let [modalAlert, setmodalAlert] = useState(false);
  let [textAlert, settextAlert] = useState("");
  const handlerBack = () => {
    if (props.route.params.Position === "itinerary_destination") {
      return props.navigation.goBack();
    }
    if (props.route.params.data_from) {
      props.navigation.push("ItineraryStack", {
        screen: "ItineraryPlaning",
        params: {
          idkiriman: props.route.params.Kiriman,
          Position: "destination",
          data_from: props.route.params.data_from,
          token: props.route.params.token,
          onbackhandler: "chooseDay",
          IdItinerary: props.route.params.Iditinerary,
          data_from_id: props.route.params.data_from_id,
        },
      });
    } else {
      if (
        props.route.params.Position == "google" ||
        props.route.params.Position == "Google"
      ) {
        props.navigation.push("ItinGoogle", {
          dataDes: props?.route?.params?.dataDes,
          token: props?.route?.params?.token,
          datadayaktif: props?.route?.params?.datadayaktif,
          lat: props?.route?.params?.lat,
          long: props?.route?.params?.long,
          from: "choose_day_back_to_google",
          onbackhandler: "chooseDay",
        });
      } else if (props.route.params.Position === "itinerary_wishlist") {
        props.navigation.push("AccountStack", {
          screen: "Wishlist",
          params: {
            token: props.route.params.token,
            onbackhandler: "chooseDay",
            tabIndex: props.route.params.data_dest.event_id ? 1 : 0,
          },
        });
      } else {
        props.navigation.push("ItineraryStack", {
          screen: "itindest",
          params: {
            IdItinerary: props?.route?.params?.data_dest?.IdItinerary,
            token: props?.route?.params?.token,
            datadayaktif: props?.route?.params?.data_dest?.datadayaktif,
            dataDes: props?.route?.params?.data_dest?.dataDes,
            lat: props?.route?.params?.data_dest?.lat,
            long: props?.route?.params?.data_dest?.long,
            idcity: props?.route?.params?.data_dest?.idcity,
            idcountries: props?.route?.params?.data_dest?.idcountries,
            onbackhandler: "chooseDay",
          },
        });
      }
    }
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handlerBack);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handlerBack);
  }, [handlerBack]);

  useEffect(() => {
    props.navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", handlerBack);
    });
  }, [handlerBack]);

  //function hardwareBack
  const hardwareBack = useCallback(() => {
    handlerBack();

    return true;
  }, []);

  const HeaderComponent = {
    headerShown: true,
    title: "Choose day",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="title" type="bold" style={{ color: "#fff" }}>
        {t("chooseDay")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      marginLeft: Platform.OS == "ios" ? null : -15,
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? (Notch ? 9 : 11) : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
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
        onPress={() => handlerBack()}
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

  // with hardwareBackPress
  useEffect(() => {
    props.navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", hardwareBack);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", hardwareBack);
    };
  }, [props.navigation, hardwareBack]);

  const [Iditinerary, setId] = useState(props.route.params.Iditinerary);
  const [Kiriman, setIdDes] = useState(props.route.params.Kiriman);
  const [token, setToken] = useState(props.route.params.token);
  const [dataSelected, setDataSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ArrayDay, setArrayDay] = useState([]);

  const searchInput = useSelector((data) => data);

  const [
    GetListEvent,
    { data: dataItinerary, loading: loadingdetail, error: errordetail },
  ] = useLazyQuery(ItineraryDetails, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    variables: { id: Iditinerary },
  });

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    let datadayaktif = props.route.params.datadayaktif;
    if (datadayaktif) {
      let tempdata = { ...datadayaktif };
      tempdata["checked"] = true;
      tempdata["daywajib"] = true;
      let datasel = [...dataSelected];
      datasel.push(tempdata);

      setDataSelected(datasel);
    }
    setRefreshing(true);
    GetListEvent();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  let [Position, setPosition] = useState(props.route.params.Position);

  const dateFormatr = (date) => {
    var x = date.split(" ");
    return dateFormat(x[0]);
  };

  const [
    mutationAddDay,
    { loading: Loadingday, data: dataAddDay, error: errorday },
  ] = useMutation(AddDay, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const [
    mutationSave,
    { loading: LoadingSave, data: dataSave, error: errorSave },
  ] = useMutation(AddDestination, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const [
    mutationSaveGoogle,
    {
      loading: LoadingSavegoogle,
      data: dataSavegoogle,
      error: errorSavegoogle,
    },
  ] = useMutation(AddGoogle, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const [
    mutationSaveEvent,
    { loading: LoadingSaveEvent, data: dataSaveEvent, error: errorSaveEvent },
  ] = useMutation(AddEvent, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const getdatebaru = (dateakhir) => {
    dateakhir = dateakhir.split(" ");
    var tomorrow = new Date(dateakhir[0]);
    tomorrow.setDate(tomorrow.getDate());
    return tomorrow;
  };

  const tambahHari = async (dataDay) => {
    setLoading(true);
    var datebaru = getdatebaru(dataDay[dataDay.length - 1].date);
    var urutanbaru = parseInt(dataDay[dataDay.length - 1].day);

    try {
      let response = await mutationAddDay({
        variables: {
          id: Iditinerary,
          date: datebaru,
          day: urutanbaru,
        },
      });
      if (Loadingday) {
        Alert.alert("Loading!!");
      }
      if (errorday) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.add_dayitinerary.code !== 200) {
          throw new Error(response.data.add_dayitinerary.message);
        }

        setArrayDay(response.data.add_dayitinerary.dataday);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("" + error);
    }
  };

  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days + 1 + "D" + Difference_In_Days + "N";
  };
  const _handleCheck = (id, day, total_hours, date, itinerary_id) => {
    var tempdata = [...dataSelected];
    var index = tempdata.findIndex((k) => k["id"] === id);
    if (index !== -1) {
      tempdata.splice(index, 1);
    } else {
      tempdata.push({
        id: id,
        day: day,
        checked: true,
        total_hours: total_hours,
        date: date,
        itinerary_id: itinerary_id,
      });
    }
    setDataSelected(tempdata);
    getchecked(id);
  };

  const dataFromPicker = {
    search: {
      index: 2,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "SearchPg",
          state: {
            routes: {
              name: "SearchPg",
            },
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  dataFrom: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    movie: {
      index: 4,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "TravelIdeaStack",
          state: {
            routes: [
              {
                name: "TravelIdeas",
              },
            ],
          },
        },
        {
          name: "TravelIdeaStack",
          state: {
            routes: [
              {
                name: "MovieLocation",
                params: {
                  token: props.route.params.token,
                  from: "movie_detail",
                },
              },
            ],
          },
        },
        {
          name: "TravelIdeaStack",
          state: {
            routes: [
              {
                name: "Detail_movie",
                params: {
                  movie_id: props.route.params.data_from_id,
                  token: props.route.params.token,
                },
              },
            ],
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    destination_list: {
      index: 3,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "CountryStack",
          state: {
            routes: [
              {
                name: "CityDetail",
                params: {
                  data: {
                    city_id: props.route.params.data_from_id,
                    token: token ? token : props.route.params.token,
                  },
                },
              },
            ],
          },
        },
        {
          name: "DestinationList",
          params: {
            idcity: props.route.params?.data_from_id,
            token: token ? token : props.route.params.token,
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    unesco: {
      index: 4,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "TravelIdeaStack",
          state: {
            routes: [
              {
                name: "TravelIdeas",
              },
            ],
          },
        },
        {
          name: "TravelIdeaStack",
          state: {
            routes: [
              {
                name: "Unesco",
                params: {
                  token: token,
                  from: "unesco_detail",
                },
              },
            ],
          },
        },
        {
          name: "DestinationUnescoDetail",
          params: {
            token: token,
            id: props.route.params.Kiriman,
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    detail_destination: {
      index: 4,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "TravelIdeaStack",
          state: {
            routes: [
              {
                name: "TravelIdeas",
              },
            ],
          },
        },
        {
          name: "TravelIdeaStack",
          state: {
            routes: [
              {
                name: "Unesco",
                params: {
                  token: token,
                  from: "unesco_detail",
                },
              },
            ],
          },
        },
        {
          name: "DestinationUnescoDetail",
          params: {
            token: token,
            id: props.route.params.Kiriman,
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    wishlist: {
      index: 2,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "AccountBottomScreen" }],
          },
        },
        {
          name: "AccountStack",
          state: {
            routes: [
              {
                name: "Wishlist",
              },
            ],
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    itinerary: {
      index: 3,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "TripBottomPlaning" }],
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
  };

  const dataFromEventPicker = {
    search: {
      index: 2,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "SearchPg",
          state: {
            routes: {
              name: "SearchPg",
            },
          },
        },
        {
          name: "eventdetail",
          params: {
            event_id: props.route.params.Kiriman,
            token: token,
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  dataFrom: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    wishlist: {
      index: 3,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "AccountBottomScreen" }],
          },
        },
        {
          name: "AccountStack",
          state: {
            routes: [
              {
                name: "Wishlist",
                params: {
                  tabIndex: props.route.params.Position === "Event" ? 1 : 0,
                },
              },
            ],
          },
        },
        {
          name: "eventdetail",
          params: {
            event_id: props.route.params.Kiriman,
            token: token,
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    searchEvent: {
      index: 2,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "listEventHome",
          state: {
            routes: [
              {
                name: "listEventHome",
                params: {
                  token: token,
                },
              },
            ],
          },
        },
        {
          name: "searchListEventHome",
        },
        {
          name: "eventdetail",
          params: {
            event_id: props.route.params.Kiriman,
            token: token,
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
    eventdetail: {
      index: 2,
      routes: [
        {
          name: "BottomStack",
          state: {
            routes: [{ name: "HomeScreen" }],
          },
        },
        {
          name: "listEventHome",
          state: {
            routes: [
              {
                name: "listEventHome",
                params: {
                  token: token,
                },
              },
            ],
          },
        },
        {
          name: "eventdetail",
          params: {
            event_id: props.route.params.Kiriman,
            token: token,
          },
        },
        {
          name: "ItineraryStack",
          state: {
            routes: [
              {
                name: "itindetail",
                params: {
                  itintitle: dataItinerary?.itinerary_detail?.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary?.itinerary_detail
                      ? dateFormatr(
                          dataItinerary?.itinerary_detail?.start_date
                        ) +
                        "  -  " +
                        dateFormatr(dataItinerary?.itinerary_detail?.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected?.[0],
                  status: "edit",
                  index: 0,
                  onbackhandler: "list",
                  data_from: props?.route?.params?.data_from,
                  idKiriman: props?.route?.params?.Kiriman,
                },
              },
            ],
          },
        },
      ],
    },
  };

  const BackToDetail = () => {
    if (props.route.params.from == "after_choose_day") {
      props.navigation.dispatch(
        StackActions.replace("ItineraryStack", {
          screen: "itindetail",
          params: {
            itintitle: props?.route?.params?.dataDes?.itinerary_detail?.name,
            country: props?.route?.params?.dataDes?.itinerary_detail?.id,
            dateitin: props?.route?.params?.dataDes?.itinerary_detail
              ? dateFormatr(
                  props?.route?.params?.dataDes?.itinerary_detail?.start_date
                ) +
                "  -  " +
                dateFormatr(
                  props?.route?.params?.dataDes?.itinerary_detail.end_date
                )
              : null,
            // token: token,
            datadayaktif: props?.route?.params?.dataDes?.datadayaktif,
            Kiriman: props?.route?.params?.Kiriman,
            data_from: props.route.params.data_from,
            from: "after_choose_day",
          },
        })
      );
    } else {
      props.navigation.dispatch(
        StackActions.replace("ItineraryStack", {
          screen: "itindetail",
          params: {
            itintitle: dataItinerary.itinerary_detail.name,
            country: Iditinerary,
            dateitin:
              dataItinerary && dataItinerary.itinerary_detail
                ? dateFormatr(dataItinerary.itinerary_detail.start_date) +
                  "  -  " +
                  dateFormatr(dataItinerary.itinerary_detail.end_date)
                : null,
            token: token,
            datadayaktif: dataSelected[0],
            status: "edit",
            Kiriman: Kiriman,
            data_from: props.route.params.data_from,
          },
        })
      );
    }
  };

  const saveData = async () => {
    if (dataSelected.length > 0) {
      setLoading(true);
      if (
        Position === "destination" ||
        Position === "Destination" ||
        Position === "itinerary_destination"
      ) {
        var datas = [];
        var x = 0;

        for (var i in dataSelected) {
          datas.push(dataSelected[i].id);
          x++;
        }

        if (x == dataSelected.length) {
          try {
            let response = await mutationSave({
              variables: {
                day: datas,
                idDestination: Kiriman,
              },
            });
            if (LoadingSave) {
              Alert.alert("Loading!!");
            }
            if (errorSave) {
              throw new Error("Error Input");
            }
            if (response.data) {
              if (response.data.add_destination.code !== 200) {
                if (response.data.add_destination.message == "Failed") {
                  settextAlert("FailedUpdate");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("FailedUpdate"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                }
                if (response.data.add_destination.message == "Full") {
                  settextAlert("AktivitasFull");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("AktivitasFull"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                  // throw new Error("Destinasi sudah full");
                }
              } else {
                dataItinerary.itinerary_detail
                  ? !props.route.params.data_from
                    ? props.navigation.reset({
                        index: 2,
                        routes: [
                          {
                            name: "BottomStack",
                            state: {
                              routes: [{ name: "HomeScreen" }],
                            },
                          },
                          {
                            name: "BottomStack",
                            state: {
                              routes: [{ name: "TripPlaning" }],
                            },
                          },
                          {
                            name: "ItineraryStack",
                            state: {
                              routes: [
                                {
                                  name: "itindetail",
                                  params: {
                                    itintitle:
                                      dataItinerary.itinerary_detail.name,
                                    country: Iditinerary,
                                    dateitin:
                                      dataItinerary &&
                                      dataItinerary.itinerary_detail
                                        ? dateFormatr(
                                            dataItinerary.itinerary_detail
                                              .start_date
                                          ) +
                                          "  -  " +
                                          dateFormatr(
                                            dataItinerary.itinerary_detail
                                              .end_date
                                          )
                                        : null,
                                    token: token,
                                    datadayaktif: dataSelected[0],
                                    status: "edit",
                                    Kiriman: Kiriman,
                                    data_from: props.route.params.data_from,
                                    index: 0,
                                    from: "after_choose_day",
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      })
                    : props.navigation.reset({
                        index:
                          dataFromPicker[props.route.params.data_from].index,
                        routes:
                          dataFromPicker[props.route.params.data_from].routes,
                      })
                  : null;
              }
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);

            Alert.alert("Error " + error);
          }
        }
      } else if (Position === "google" || Position === "Google") {
        var datas = [];
        var x = 0;
        for (var i in dataSelected) {
          datas.push(dataSelected[i].id);
          x++;
        }

        if (x == dataSelected.length) {
          try {
            let response = await mutationSaveGoogle({
              variables: {
                id: datas,
                title: Kiriman.name,
                icon: Kiriman.photos
                  ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
                    Kiriman.photos[0].photo_reference +
                    "&key=AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg"
                  : "i-tour",
                address: Kiriman.formatted_address,
                latitude: Kiriman.geometry.location.lat,
                longitude: Kiriman.geometry.location.lng,
              },
            });
            if (LoadingSavegoogle) {
              Alert.alert("Loading!!");
            }
            if (errorSavegoogle) {
              throw new Error("Error Input");
            }

            if (response.data) {
              if (response.data.add_google.code !== 200) {
                if (response.data.add_google.message == "Failed") {
                  settextAlert("FailedUpdate");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("FailedUpdate"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                }
                if (response.data.add_google.message == "Full") {
                  settextAlert("AktivitasFull");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("AktivitasFull"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                  // throw new Error("Destinasi sudah full");
                }
                setLoading(false);
              } else {
                dataItinerary.itinerary_detail
                  ? props.route.params.sebelum
                    ? props.navigation.dispatch(
                        StackActions.replace("ItineraryStack", {
                          screen: "itindetail",
                          params: {
                            itintitle: dataItinerary.itinerary_detail.name,
                            country: Iditinerary,
                            dateitin:
                              dataItinerary && dataItinerary.itinerary_detail
                                ? dateFormatr(
                                    dataItinerary.itinerary_detail.start_date
                                  ) +
                                  "  -  " +
                                  dateFormatr(
                                    dataItinerary.itinerary_detail.end_date
                                  )
                                : null,
                            token: token,
                            datadayaktif: dataSelected[0],
                            status: "edit",
                            Kiriman: Kiriman,
                            data_from: props.route.params.data_from,
                          },
                        })
                      )
                    : props.navigation.reset({
                        index: 2,
                        routes: [
                          {
                            name: "BottomStack",
                            state: {
                              routes: [{ name: "HomeScreen" }],
                            },
                          },
                          {
                            name: "BottomStack",
                            state: {
                              routes: [{ name: "TripPlaning" }],
                            },
                          },
                          {
                            name: "ItineraryStack",
                            state: {
                              routes: [
                                {
                                  name: "itindetail",
                                  params: {
                                    itintitle:
                                      dataItinerary.itinerary_detail.name,
                                    country: Iditinerary,
                                    dateitin:
                                      dataItinerary &&
                                      dataItinerary.itinerary_detail
                                        ? dateFormatr(
                                            dataItinerary.itinerary_detail
                                              .start_date
                                          ) +
                                          "  -  " +
                                          dateFormatr(
                                            dataItinerary.itinerary_detail
                                              .end_date
                                          )
                                        : null,
                                    token: token,
                                    datadayaktif: dataSelected[0],
                                    status: "edit",
                                    Kiriman: Kiriman,
                                    data_from: props.route.params.data_from,
                                    index: 0,
                                    from: "after_choose_day",
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      })
                  : null;
              }
            }
            setLoading(false);
          } catch (error) {
            Alert.alert("error : " + error);
          }
        }
      } else if (Position === "Event" || Position === "event") {
        var datas = [];
        var x = 0;
        for (var i in dataSelected) {
          datas.push(dataSelected[i].id);
          x++;
        }
        if (x == dataSelected.length) {
          try {
            let responseevent = await mutationSaveEvent({
              variables: {
                day_id: datas,
                event_id: Kiriman,
              },
            });
            if (LoadingSaveEvent) {
              Alert.alert("Loading!!");
            }
            if (errorSaveEvent) {
              throw new Error("Error Input");
            }

            if (responseevent.data) {
              if (responseevent.data.add_event.code !== 200) {
                if (responseevent.data.add_event.message == "Failed") {
                  settextAlert("FailedUpdate");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("FailedUpdate"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                }
                if (responseevent.data.add_event.message == "Full") {
                  settextAlert("AktivitasFull");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("AktivitasFull"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                }
              }
              {
                dataItinerary.itinerary_detail
                  ? props.route.params.sebelum
                    ? props.navigation.dispatch(
                        StackActions.replace("ItineraryStack", {
                          screen: "itindetail",
                          params: {
                            itintitle: dataItinerary.itinerary_detail.name,
                            country: Iditinerary,
                            dateitin:
                              dataItinerary && dataItinerary.itinerary_detail
                                ? dateFormatr(
                                    dataItinerary.itinerary_detail.start_date
                                  ) +
                                  "  -  " +
                                  dateFormatr(
                                    dataItinerary.itinerary_detail.end_date
                                  )
                                : null,
                            token: token,
                            datadayaktif: dataSelected[0],
                            status: "edit",
                            Kiriman: Kiriman,
                            data_from: props.route.params.data_from,
                          },
                        })
                      )
                    : props.navigation.reset({
                        index:
                          dataFromEventPicker[props.route.params.data_from]
                            .index,
                        routes:
                          dataFromEventPicker[props.route.params.data_from]
                            .routes,
                      })
                  : null;
              }
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            Alert.alert("" + error);
          }
        }
      } else if (Position === "itinerary_wishlist") {
        var datas = [];
        var x = 0;

        for (var i in dataSelected) {
          datas.push(dataSelected[i].id);
          x++;
        }
        if (x == dataSelected.length) {
          try {
            let response = props.route.params.data_dest.event_id
              ? await mutationSaveEvent({
                  variables: {
                    day_id: datas,
                    event_id: Kiriman,
                  },
                })
              : await mutationSave({
                  variables: {
                    day: datas,
                    idDestination: Kiriman,
                  },
                });

            if (LoadingSave) {
              Alert.alert("Loading!!");
            }
            if (errorSave) {
              throw new Error("Error Input");
            }
            if (response.data?.add_destination) {
              if (response.data?.add_destination?.code !== 200) {
                if (response.data?.add_destination?.message == "Failed") {
                  settextAlert("FailedUpdate");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("FailedUpdate"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                }
                if (response.data?.add_destination?.message == "Full") {
                  settextAlert("AktivitasFull");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("AktivitasFull"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                }
              } else {
                dataItinerary.itinerary_detail
                  ? props.navigation.reset({
                      index: 2,
                      routes: [
                        {
                          name: "BottomStack",
                          state: {
                            routes: [{ name: "HomeScreen" }],
                          },
                        },
                        {
                          name: "BottomStack",
                          state: {
                            routes: [{ name: "TripPlaning" }],
                          },
                        },
                        {
                          name: "ItineraryStack",
                          state: {
                            routes: [
                              {
                                name: "itindetail",
                                params: {
                                  itintitle:
                                    dataItinerary.itinerary_detail.name,
                                  country: Iditinerary,
                                  dateitin:
                                    dataItinerary &&
                                    dataItinerary.itinerary_detail
                                      ? dateFormatr(
                                          dataItinerary.itinerary_detail
                                            .start_date
                                        ) +
                                        "  -  " +
                                        dateFormatr(
                                          dataItinerary.itinerary_detail
                                            .end_date
                                        )
                                      : null,
                                  token: token,
                                  datadayaktif: dataSelected[0],
                                  status: "edit",
                                  Kiriman: Kiriman,
                                  data_from: props.route.params.data_from,
                                  index: 0,
                                  from: "after_choose_day",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    })
                  : null;
              }
            }
            if (response.data.add_event) {
              if (response.data.add_event.code !== 200) {
                if (response.data.add_event.message == "Failed") {
                  settextAlert("FailedUpdate");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("FailedUpdate"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                }
                if (response.data.add_event.message == "Full") {
                  settextAlert("AktivitasFull");
                  if (Platform.OS == "android") {
                    setmodalAlert(true);
                  } else {
                    Alert.alert(t("FailedUpdate"), t("AktivitasFull"), [
                      { text: "OK", onPress: () => BackToDetail() },
                    ]);
                  }
                }
              } else {
                dataItinerary.itinerary_detail
                  ? props.navigation.reset({
                      index: 2,
                      routes: [
                        {
                          name: "BottomStack",
                          state: {
                            routes: [{ name: "HomeScreen" }],
                          },
                        },
                        {
                          name: "BottomStack",
                          state: {
                            routes: [{ name: "TripPlaning" }],
                          },
                        },
                        {
                          name: "ItineraryStack",
                          state: {
                            routes: [
                              {
                                name: "itindetail",
                                params: {
                                  itintitle:
                                    dataItinerary.itinerary_detail.name,
                                  country: Iditinerary,
                                  dateitin:
                                    dataItinerary &&
                                    dataItinerary.itinerary_detail
                                      ? dateFormatr(
                                          dataItinerary.itinerary_detail
                                            .start_date
                                        ) +
                                        "  -  " +
                                        dateFormatr(
                                          dataItinerary.itinerary_detail
                                            .end_date
                                        )
                                      : null,
                                  token: token,
                                  datadayaktif: dataSelected[0],
                                  status: "edit",
                                  Kiriman: Kiriman,
                                  data_from: props.route.params.data_from,
                                  index: 0,
                                  from: "after_choose_day",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    })
                  : null;
              }
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);

            Alert.alert("Error " + error);
          }
        }
      } else {
        Alert.alert("Fungsi belum ada untuk type " + Position);

        setLoading(false);
      }
    } else {
      Alert.alert("Please Choose a day!");
    }
  };

  const getchecked = (id) => {
    let tempData = [...dataSelected];
    var index = tempData.findIndex((k) => k["id"] === id);
    if (index != -1) {
      return true;
    } else {
      return false;
    }
  };

  const cek = (total, id) => {
    var index = dataSelected.findIndex((k) => k["id"] === id && k["daywajib"]);
    if (index >= 0) {
      return true;
    } else {
      total = total.split(":");
      let jam = total[0];
      let menit = total[1];

      if (jam < 24) {
        if (jam < 23) {
          return false;
        } else if (jam === 23 && menit === 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  };

  const RenderActive = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          _handleCheck(
            item.id,
            item.day,
            item.total_hours ? item.total_hours : "00:00:00",
            item.date,
            item.itinerary_id
          )
        }
        // disabled={cek(
        //   item.total_hours ? item.total_hours : "00:00:00",
        //   item.id
        // )}
        style={{
          // opacity:
          //   cek(item.total_hours ? item.total_hours : "00:00:00", item.id) ===
          //   true
          //     ? 0.5
          //     : 1,
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#f3f3f3",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <CheckBox
          onCheckColor="#fff"
          lineWidth={2}
          onFillColor="#209FAE"
          onTintColor="#209FAE"
          boxType={"square"}
          style={{
            alignSelf: "center",
            width: Platform.select({
              ios: 30,
              android: 35,
            }),
            transform: Platform.select({
              ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              android: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
            }),
          }}
          // onChange={() =>
          //   _handleCheck(
          //     item.id,
          //     item.day,
          //     item.total_hours ? item.total_hours : "00:00:00",
          //     item.date,
          //     item.itinerary_id
          //   )
          // }
          onValueChange={() => {
            _handleCheck(
              item.id,
              item.day,
              item.total_hours ? item.total_hours : "00:00:00",
              item.date,
              item.itinerary_id
            );
          }}
          value={getchecked(item.id)}
        />
        <Text
          style={{
            fontFamily: "Lato-Bold",
            fontSize: 16,
            marginLeft: 20,
          }}
        >
          {t("day")} {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      _Refresh();
    });
    // props.route.params

    dispatch(
      setSearchInput({
        search_input: props.route.params.search_input,
        aktifsearch: true,
        active_src:
          props.route.params.Position === "Event" ? "event" : "destination",
      })
    );
    return unsubscribe;
  }, [props.navigation]);

  let [checked, setChecked] = useState(true);

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
        paddingHorizontal: 20,
      }}
    >
      {/* modal alert */}
      <Modalss
        onBackdropPress={() => {
          setmodalAlert(false);
          props.navigation.dispatch(
            StackActions.replace("ItineraryStack", {
              screen: "itindetail",
              params: {
                itintitle: dataItinerary.itinerary_detail.name,
                country: Iditinerary,
                dateitin:
                  dataItinerary && dataItinerary.itinerary_detail
                    ? dateFormatr(dataItinerary.itinerary_detail.start_date) +
                      "  -  " +
                      dateFormatr(dataItinerary.itinerary_detail.end_date)
                    : null,
                token: token,
                datadayaktif: dataSelected[0],
                status: "edit",
                Kiriman: Kiriman,
                data_from: props.route.params.data_from,
              },
            })
          );
        }}
        onRequestClose={() => setmodalAlert(false)}
        onDismiss={() => setmodalAlert(false)}
        visible={modalAlert}
        transparent={true}
      >
        <Pressable
          onPress={() => {
            setmodalAlert(false);
            props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "itindetail",
                params: {
                  itintitle: dataItinerary.itinerary_detail.name,
                  country: Iditinerary,
                  dateitin:
                    dataItinerary && dataItinerary.itinerary_detail
                      ? dateFormatr(dataItinerary.itinerary_detail.start_date) +
                        "  -  " +
                        dateFormatr(dataItinerary.itinerary_detail.end_date)
                      : null,
                  token: token,
                  datadayaktif: dataSelected[0],
                  status: "edit",
                  Kiriman: Kiriman,
                  data_from: props.route.params.data_from,
                },
              })
            );
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
              {t("FailedUpdate")}
            </Text>

            <View
              style={{
                marginTop: 20,
                backgroundColor: "#f3f3f3",
                padding: 20,
              }}
            >
              <Text size="label" style={{ textAlign: "center" }}>
                {t(textAlert)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setmodalAlert(false);
                props.navigation.dispatch(
                  StackActions.replace("ItineraryStack", {
                    screen: "itindetail",
                    params: {
                      itintitle: dataItinerary.itinerary_detail.name,
                      country: Iditinerary,
                      dateitin:
                        dataItinerary && dataItinerary.itinerary_detail
                          ? dateFormatr(
                              dataItinerary.itinerary_detail.start_date
                            ) +
                            "  -  " +
                            dateFormatr(dataItinerary.itinerary_detail.end_date)
                          : null,
                      token: token,
                      datadayaktif: dataSelected[0],
                      status: "edit",
                      Kiriman: Kiriman,
                      data_from: props.route.params.data_from,
                    },
                  })
                );
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

      {/* modal alert */}
      <Loading show={loading}></Loading>
      {/* <NavigationEvents onDidFocus={() => _Refresh()} /> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_Refresh} />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {dataItinerary && dataItinerary.itinerary_detail ? (
          <View>
            <ImageBackground
              source={
                dataItinerary.itinerary_detail.cover
                  ? { uri: dataItinerary.itinerary_detail.cover }
                  : default_image
              }
              style={{
                width: Dimensions.get("screen").width - 40,
                height: Dimensions.get("screen").width * 0.2,
                borderRadius: 10,
                marginVertical: 10,
              }}
              imageStyle={{
                width: Dimensions.get("screen").width - 40,
                height: Dimensions.get("screen").width * 0.2,
                borderRadius: 10,
                resizeMode: "cover",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.38)",
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                  padding: 10,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    // height: '100%',
                    width: "100%",
                  }}
                  // onPress={() => {
                  // 	props.navigation.navigate('detailStack', {
                  // 		id: 'ca1657c4-306c-45b1-aa0b-4e7edd236d8f',
                  // 		name: 'test',
                  // 	});
                  // }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                      // height:'100%'
                    }}
                  >
                    <View
                      style={
                        {
                          // width: '50%',
                        }
                      }
                    >
                      <Text
                        style={{
                          fontFamily: "Lato-Bold",
                          fontSize: 18,
                          color: "white",
                          // marginLeft: (5),
                        }}
                      >
                        <Truncate
                          text={dataItinerary.itinerary_detail.name}
                          length={30}
                        />
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        color: "white",
                        marginLeft: 3,
                      }}
                    >
                      {getDN(
                        dataItinerary.itinerary_detail.start_date,
                        dataItinerary.itinerary_detail.end_date
                      )}
                      {" - "}
                      {dataItinerary && dataItinerary.itinerary_detail
                        ? dateFormatr(
                            dataItinerary.itinerary_detail.start_date
                          ) +
                          "  /  " +
                          dateFormatr(dataItinerary.itinerary_detail.end_date)
                        : null}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 14,
              }}
            >
              {t("chooseDay")} :{" "}
            </Text>
            {ArrayDay.length
              ? ArrayDay.map((item, i) => {
                  return <RenderActive item={item} index={i} key={i} />;
                })
              : dataItinerary.itinerary_detail.day.map((item, i) => {
                  return <RenderActive item={item} index={i} key={i} />;
                })}
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderColor: "#D75995",
                borderRadius: 5,
                borderWidth: 1,
                width: 150,
                marginTop: 10,
                marginLeft: 20,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                tambahHari(
                  ArrayDay.length
                    ? ArrayDay
                    : dataItinerary.itinerary_detail.day
                )
              }
            >
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "#D75995",
                }}
              >
                {t("addMoreDay")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={{ height: 70 }}></View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: Platform.OS === "ios" ? (Notch ? 75 : 60) : 60,
          backgroundColor: "#FFF",
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
          shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
          elevation: Platform.OS == "ios" ? 3 : 3.5,
          flexDirection: "row",
          borderTopWidth: 1,
          borderColor: "#F1F1F1",
          justifyContent: "space-between",
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? (Notch ? 20 : 10) : 10,
        }}
      >
        <Button
          onPress={() => saveData()}
          style={{ height: "100%", width: "100%" }}
          text={t("next")}
        />
      </View>
    </View>
  );
}
