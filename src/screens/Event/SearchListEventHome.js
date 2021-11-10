import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Xblue,
  Arrowbackios,
  Arrowbackwhite,
  Search,
  Filternewbiru,
  Xhitam,
} from "../../assets/svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text, Peringatan, CardEvents } from "../../component";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import EventsPublic from "../../graphQL/Query/Event/ListEventPublic";
import EventsAll from "../../graphQL/Query/Event/ListEvent2";
import CategoryEvent from "../../graphQL/Query/Event/FilterEvent";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Destinasi from "../../graphQL/Query/Wishlist/Destination";
import { useTranslation } from "react-i18next";
import { TabBar, TabView } from "react-native-tab-view";
import { RNToasty } from "react-native-toasty";
import UnLiked from "../../graphQL/Mutation/unliked";
import Modal from "react-native-modal";
import CheckBox from "@react-native-community/checkbox";
import DeviceInfo from "react-native-device-info";

export default function SearchListEventHome(props) {
  console.log(`DATA SEARCH LIST: `, props);
  const { t, i18n } = useTranslation();
  let [dataEventAll, setDataEventAll] = useState([]);
  let [dataEventPublic, setDataEventPublic] = useState([]);
  let [dataDes, setdataDes] = useState([]);
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState("");
  let [texts, setText] = useState("");
  let [index, setindex] = useState(0);
  let [show, setShow] = useState(false);
  let [dataFilterCategori, setdataFilterCategori] = useState([]);
  let [datacountry, setdatacountry] = useState([]);
  let [dataFilterCategoris, setdataFilterCategoris] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [timeModalStartDate, setTimeModalStartDate] = useState("");
  const [timeModalEndDate, setTimeModalEndDate] = useState("");
  const [isValidDate, setIsValidDate] = useState(true);
  const [isValidPrice, setIsValidPrice] = useState(true);
  const [keyboardIsUp, setKeyboardIsUp] = useState(false);
  const Notch = DeviceInfo.hasNotch();

  useEffect(() => {
    dateUseEffect();
    priceUseEffect();
  });

  const dateUseEffect = () => {
    if (+dateValidations.start_date > +dateValidations.end_date) {
      return setIsValidDate(false);
    } else {
      return setIsValidDate(true);
    }
  };

  const priceUseEffect = () => {
    if (+priceValue.min > +priceValue.max) {
      return setIsValidPrice(false);
    } else {
      return setIsValidPrice(true);
    }
  };

  const [dateData, setDateData] = useState({
    start_date: "",
    end_date: "",
  });

  const [renderDate, setRenderDate] = useState({
    render_start_date: "",
    render_end_date: "",
  });

  const [dateValidations, setDateValidations] = useState({
    start_date: 0,
    end_date: 0,
  });

  const [filterCheck, setFilterCheck] = useState({
    category: true,
    date: false,
    price: false,
    location: false,
    region: false,
  });

  const [priceValue, setPriceValue] = useState({
    min: 0,
    max: 0,
  });

  const [customPriceValues, setCustomPriceValues] = useState({
    min: 0,
    max: "any",
  });

  function numberWithDot(x) {
    if (x === "" || x === undefined) {
      if (priceValue.min === "" || priceValue.min === undefined) {
        setPriceValue({ ...priceValue, min: 0 });
      } else if (priceValue.max === "" || priceValue.max === undefined) {
        setPriceValue({ ...priceValue, max: 0 });
      }
    } else {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }

  let [alertPopUp, setAlertPopUp] = useState({
    show: false,
    judul: "",
    detail: "",
  });

  const { data: dataFillter, loading: loadingcat, error: errorcat } = useQuery(
    CategoryEvent,
    {
      fetchPolicy: "network-only",
      onCompleted: () => {
        setdataFilterCategori(dataFillter.event_filter.type);
        setdataFilterCategoris(dataFillter.event_filter.type);
        setdatacountry(dataFillter.event_filter.country);
      },
    }
  );

  const _handleCheck = async (id, index, item) => {
    let tempe = [...dataFilterCategori];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setdataFilterCategori(tempe);
    await setdataFilterCategoris(tempe);
  };

  const searchkategori = async (teks) => {
    let searching = new RegExp(teks, "i");

    let b = dataFilterCategori.filter((item) => searching.test(item.name));
    setdataFilterCategoris(b);
  };

  const timeConverter = (date) => {
    const checkTime = (time) => {
      if (time < 10) {
        time = "0" + time;
      }
      return time;
    };
    let year = date.getFullYear();
    let months = checkTime(date.getMonth() + 1);
    let monthStringify = months.toString();
    let day = checkTime(date.getDate());
    let h = checkTime(date.getHours());
    let m = checkTime(date.getMinutes());
    let s = checkTime(date.getSeconds());

    switch (monthStringify) {
      case "01":
        monthStringify = "Jan";
        break;
      case "02":
        monthStringify = "Feb";
        break;
      case "03":
        monthStringify = "Mar";
        break;
      case "04":
        monthStringify = "Apr";
        break;
      case "05":
        monthStringify = "Mei";
        break;
      case "06":
        monthStringify = "Jun";
        break;
      case "07":
        monthStringify = "Jul";
        break;
      case "08":
        monthStringify = "Agu";
        break;
      case "09":
        monthStringify = "Sep";
        break;
      case "10":
        monthStringify = "Okt";
        break;
      case "11":
        monthStringify = "Nov";
        break;
      case "12":
        monthStringify = "Des";
        break;

      default:
        break;
    }

    let formattedDate = `${year}-${months}-${day}`;
    let formatForScreen = `${day} ${monthStringify} ${year}`;

    // start
    if (timeModalStartDate) {
      setDateData((prevCin) => {
        return {
          ...prevCin,
          ["start_date"]: formattedDate,
        };
      });

      setRenderDate((prev) => {
        return { ...prev, ["render_start_date"]: formatForScreen };
      });

      setDateValidations({ ...dateValidations, ["start_date"]: date * 1000 });
    }

    // end
    if (timeModalEndDate) {
      setDateData((prevCout) => {
        return {
          ...prevCout,
          ["end_date"]: formattedDate,
        };
      });

      setRenderDate((prev) => {
        return { ...prev, ["render_end_date"]: formatForScreen };
      });

      setDateValidations({ ...dateValidations, ["end_date"]: date * 1000 });
    }
  };

  //! Filter Category

  const categoryFilter = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            padding: 15,
          }}
        >
          <View
            style={{
              backgroundColor: "#f6f6f6",
              borderRadius: 5,
              // flex: 1,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Search width={15} height={15} />

            <TextInput
              value={categoryName}
              underlineColorAndroid="transparent"
              placeholder={t("search")}
              style={{
                width: "85%",
                marginLeft: 5,
                padding: 0,
              }}
              returnKeyType="search"
              onChangeText={(x) => {
                searchkategori(x);
                setCategoryName(x);
              }}
              onSubmitEditing={(x) => searchkategori(x)}
            />
            {dataFilterCategori.length !== dataFilterCategoris.length ? (
              <TouchableOpacity
                onPress={() => {
                  searchkategori("");
                  setCategoryName("");
                }}
              >
                <Xblue
                  width="15"
                  height="15"
                  style={{
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}
        >
          {dataFilterCategoris.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => _handleCheck(item["id"], index, item)}
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                width: "49%",
                marginRight: 3,
                marginBottom: 20,
                justifyContent: "flex-start",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <CheckBox
                onCheckColor="#FFF"
                lineWidth={4}
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
                // onValueChange={() =>
                //   Platform.OS == "ios"
                //     ? null
                //     : _handleCheck(item["id"], index, item)
                // }
                value={item["checked"]}
              />

              <Text
                size="label"
                type="regular"
                style={{
                  marginLeft: 0,
                  marginRight: -10,
                  color: "#464646",
                  marginTop: Platform.OS == "ios" ? -5 : -2,
                  // borderWidth: 5,
                }}
              >
                {item["name"]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  //! End Filter Category

  //! Filter DATE

  const dateFilter = () => {
    return (
      <View
        style={{ width: "65%", height: Platform.OS == "ios" ? "25%" : "30%" }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 15,
            paddingHorizontal: 5,
          }}
        >
          {/* start */}
          <View style={{ width: "45%" }}>
            <Text
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                paddingTop: 10,
                marginBottom: 10,
                width: 100,
              }}
            >
              {t("From")}
            </Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TextInput
                placeholder={t("startDate")}
                autoCorrect={false}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  fontFamily: "Lato-Regular",
                  borderColor: "#d3d3d3",
                  fontSize: 14,
                  borderWidth: 1,
                }}
                value={renderDate.render_start_date}
              />
              <TouchableOpacity
                onPress={() => setTimeModalStartDate(true)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  align: "center",
                  width: "100%",
                  height: "100%",
                }}
              />
              <DateTimePickerModal
                isVisible={timeModalStartDate}
                mode="date"
                // display="inline"
                locale="en_id"
                onConfirm={(date) => {
                  timeConverter(date);
                  setTimeModalStartDate(false);
                }}
                onCancel={() => setTimeModalStartDate(false)}
              />
            </View>
          </View>
          {/* DASH */}
          <View
            style={
              {
                // paddingTop: 45,
                // paddingLeft: 10,
                // flexDirection: "row",
                // justifyContent: "center",
                // alignContent: "center",
                // alignItems: "center",
                // marginBottom: 10,
                // marginRight: 10,
              }
            }
          >
            <View
              style={{
                backgroundColor: "#d3d3d3",
                width: 10,
                height: 2,
                marginTop: Platform.OS == "ios" ? (Notch ? 60 : 55) : 60,
              }}
            ></View>
          </View>
          {/* end */}
          <View style={{ width: "45%" }}>
            <Text
              style={{
                paddingTop: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginBottom: 10,
                // marginRight: 65,
              }}
            >
              {t("until")}
            </Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TextInput
                placeholder={t("endDate")}
                autoCorrect={false}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  fontFamily: "Lato-Regular",
                  borderColor: "#d3d3d3",
                  fontSize: 14,
                  borderWidth: 1,
                }}
                value={renderDate.render_end_date}
              />
              <TouchableOpacity
                onPress={() => setTimeModalEndDate(true)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  align: "center",
                  width: "100%",
                  height: "100%",
                }}
              />
              <DateTimePickerModal
                isVisible={timeModalEndDate}
                mode="date"
                // display="inline"
                locale="en_id"
                onConfirm={async (date) => {
                  timeConverter(date);
                  setTimeModalEndDate(false);
                  dateUseEffect();
                }}
                onCancel={() => setTimeModalEndDate(false)}
              />
            </View>
          </View>
        </View>
        {dateValidations.start_date != 0 &&
        dateValidations.end_date == 0 ? null : dateValidations.start_date >
          dateValidations.end_date ? (
          <View style={{ width: "90%" }}>
            <Text
              type="regular"
              size="medium"
              style={{
                color: "#D75995",
                position: "absolute",
                left: 10,
              }}
            >
              {"*" + t("dateWarning")}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  //! End Filter DATE

  //! Filter PRICE

  const PriceFilter = () => {
    return (
      <View
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: Platform.OS == "ios" ? (Notch ? 15 : 15) : 15,
          paddingVertical: 15,
          height: "80%",
          width: "65%",
        }}
      >
        <View
          style={{
            marginBottom: Platform.OS == "ios" ? (Notch ? 10 : 0) : 10,
            marginTop: Platform.OS == "ios" ? (Notch ? -5 : -5) : -5,
          }}
        >
          <Text>{t("price")}</Text>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {`IDR ${numberWithDot(priceValue.min)} - ${numberWithDot(
              customPriceValues.max
            )}`}
          </Text>
        </View>
        {/* start */}
        <View
          keyboardShouldPersistTaps="handled"
          style={{
            marginBottom: Platform.OS == "ios" ? (Notch ? -40 : -30) : -40,
          }}
        >
          <Text
            style={{
              paddingTop: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {t("minCost")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: Platform.OS == "ios" ? 10 : null,
              borderWidth: 1,
              borderColor: "#d3d3d3",
              alignItems: "center",
              height: "30%",
              width: "100%",
            }}
          >
            <TextInput
              value={priceValue.min}
              placeholder={t("minCostEx")}
              autoCorrect={false}
              keyboardType="numeric"
              type="number"
              // keyboardType="decimal-pad"
              style={{
                flex: 1,
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
              // value={priceValue.min}
              onChangeText={(x) => {
                if (x === null) {
                  setPriceValue({ ...priceValue, min: 0 });
                  setCustomPriceValues({ ...customPriceValues, min: 0 });
                } else {
                  setPriceValue({ ...priceValue, min: x });
                  setCustomPriceValues({ ...customPriceValues, min: x });
                }
                setKeyboardIsUp(true);
              }}
            />
            {priceValue.min !== 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setPriceValue({ ...priceValue, min: 0 });
                  setCustomPriceValues({ ...customPriceValues, min: 0 });
                }}
              >
                <Xblue
                  width="15"
                  height="15"
                  style={{
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {/* DASH */}
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            marginBottom: Platform.OS == "ios" ? (Notch ? 5 : -20) : -10,
          }}
        >
          <View
            style={{
              backgroundColor: "#d3d3d3",
              width: 2,
              height: Platform.OS == "ios" ? (Notch ? 30 : 20) : 30,
            }}
          ></View>
        </View>
        {/* end */}
        <View>
          <Text
            style={{
              paddingTop: 15,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {t("maxCost")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: Platform.OS == "ios" ? 10 : null,
              borderWidth: 1,
              borderColor: "#d3d3d3",
              alignItems: "center",
              height: "30%",
              width: "100%",
            }}
          >
            <TextInput
              value={priceValue.max}
              placeholder={t("maxCostEx")}
              autoCorrect={false}
              // keyboardVerticalOffset={
              //   Platform.OS == "ios" ? (Notch ? 100 : 150) : null
              // }
              keyboardType="numeric"
              style={{
                flex: 1,
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
              // value={priceValue.max}
              onChangeText={async (x) => {
                if (x === null || x === undefined || x === "") {
                  setPriceValue({ ...priceValue, max: 0 });
                  setCustomPriceValues({ ...customPriceValues, max: "any" });
                } else {
                  setPriceValue({ ...priceValue, max: x });
                  setCustomPriceValues({ ...customPriceValues, max: x });
                }

                setKeyboardIsUp(true);
              }}
            />
            {priceValue.max !== 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setPriceValue({ ...priceValue, max: 0 });
                  setCustomPriceValues({ ...customPriceValues, max: "any" });
                }}
              >
                <Xblue
                  width="15"
                  height="15"
                  style={{
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {(priceValue.min != "" ||
          priceValue.min != 0 ||
          priceValue.min != null ||
          priceValue.min != undefined) &&
        (priceValue.max == "" ||
          priceValue.max == null ||
          priceValue.max == undefined) ? null : parseInt(priceValue.min) >
          parseInt(priceValue.max) ? (
          <View
            style={{
              width: "100%",
              marginTop:
                Platform.OS == "ios" ? (Notch ? "-20%" : "-15%") : "-20%",
            }}
          >
            <Text
              type="regular"
              size="medium"
              style={{
                color: "#D75995",
                position: "absolute",
              }}
            >
              {"*" + t("priceWarning")}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  //! End Filter PRICE

  //! FUNCTION CLEAR FILTER

  const ClearAllFilter = async () => {
    let tempe = [...dataFilterCategori];
    let tempes = [];
    for (var x of tempe) {
      let data = { ...x };
      data.checked = false;
      await tempes.push(data);
    }
    await setdataFilterCategori(tempes);
    await setdataFilterCategoris(tempes);
    await setSearch({
      type: null,
      tag: null,
      keyword: null,
      countries: null,
      date_from: null,
      date_until: null,
      price_start: null,
      price_end: null,
    });
    await setDateData({
      start_date: "",
      end_date: "",
    });
    await setRenderDate({
      render_start_date: "",
      render_end_date: "",
    });
    await setPriceValue({ min: 0, max: 0 });
    await setCustomPriceValues({ ...customPriceValues, max: "any" });
    // await setshow(false);
    await setDateValidations({ ["start_date"]: 0, ["end_date"]: 0 });
    if (
      dateData.start_date == "" &&
      dateData.end_date == "" &&
      priceValue.min == 0 &&
      priceValue.max == 0
    ) {
      await setIsValidDate(true);
      await setIsValidPrice(true);
    } else if (
      dateData.start_date == "" &&
      dateData.end_date == "" &&
      priceValue.min !== 0 &&
      priceValue.max !== 0
    ) {
      await setIsValidDate(true);
    } else if (
      dateData.start_date !== "" &&
      dateData.end_date !== "" &&
      priceValue.min == 0 &&
      priceValue.max == 0
    ) {
      await setIsValidPrice(true);
    }
  };

  //! End FUNCTION CLEAR FILTER

  //! FUNCTION UPDATE FILTER

  const UpdateFilter = async () => {
    let hasil = [];

    if (isValidDate == true && isValidPrice == true) {
      for (var x of dataFilterCategori) {
        if (x.checked === true) {
          hasil.push(x.id);
        }
      }

      let data = { ...search };
      data["type"] = hasil;
      data["date_from"] = dateData.start_date;
      data["date_until"] = dateData.end_date;
      if (customPriceValues.max !== "any") {
        data["price_start"] = priceValue.min;
        data["price_end"] = priceValue.max;
      } else {
        data["price_start"] = 0;
        data["price_end"] = 0;
      }

      await setSearch(data);
      await setShow(false);
      GetDataEventsAll();
      GetDataEventsPublic();
    } else {
      setAlertPopUp({
        ...alertPopUp,
        show: true,
        judul: warningAlert(),
        detail: "",
      });
    }
  };

  //! End FUNCTION UPDATE FILTER

  console.log("dataEventAll", dataEventAll);
  console.log("dataEventPublic", dataEventPublic);

  const HeaderComponent = {
    headerShown: true,
    title: "Wishlist",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text style={{ color: "#fff" }} size="header" type="bold">
        {`${t("search")} ${t("event")}`}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
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

  let [search, setSearch] = useState({
    type: null,
    tag: null,
    keyword: null,
    countries: null,
    date_from: null,
    date_until: null,
    price_start: null,
    price_end: null,
  });

  console.log("search", search);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    await GetDataEventsAll();
    await GetDataEventsPublic();

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  const [
    GetDataEventsAll,
    { loading: loadingAll, data: dataAll, error: errorAll },
  ] = useLazyQuery(EventsAll, {
    fetchPolicy: "network-only",
    variables: {
      keyword: search.keyword,
      type: search.type,
      cities:
        search.city && search.city.length > 0
          ? search.city
          : props.route.params && props.route.params.idcity
          ? [props.route.params.idcity]
          : null,
      countries:
        search.country && search.country.length > `0`
          ? search.country
          : props.route.params && props.route.params.idcountries
          ? [props.route.params.idcountries]
          : null,
      price_start: search.price_start,
      price_end: search.price_end,
      date_from: search.date_from,
      date_until: search.date_until,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setDataEventAll(dataAll?.event_list_v2);
    },
  });

  const [
    GetDataEventsPublic,
    { loading: loadingPublic, data: dataPublic, error: errorPublic },
  ] = useLazyQuery(EventsPublic, {
    fetchPolicy: "network-only",
    variables: {
      keyword: search.keyword,
      type: search.type,
      cities:
        search.city && search.city.length > 0
          ? search.city
          : props.route.params && props.route.params.idcity
          ? [props.route.params.idcity]
          : null,
      countries:
        search.country && search.country.length > 0
          ? search.country
          : props.route.params && props.route.params.idcountries
          ? [props.route.params.idcountries]
          : null,
      price_start: search.price_start,
      price_end: search.price_end,
      date_from: search.date_from,
      date_until: search.date_until,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setDataEventPublic(dataPublic?.event_list_public);
    },
  });

  const [
    getDes,
    { loading: loadingDes, data: dataDe, error: errorDes },
  ] = useLazyQuery(Destinasi, {
    fetchPolicy: "network-only",
    variables: {
      keyword: texts,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataDes(dataDe?.listdetination_wishlist);
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    props.navigation.addListener("focus", () => {
      loadAsync();
    });
  }, []);

  const renderLabel = ({ route, focused }) => {
    return (
      <View
        style={{
          width: Dimensions.get("screen").width / 2,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          marginTop: -10,
        }}
      >
        <Text
          style={{
            opacity: focused ? 1 : 0.7,
            color: focused ? "#209fae" : "#464646",
          }}
          size="title"
          type={focused ? "bold" : "regular"}
        >
          {route.title}
        </Text>
      </View>
    );
  };

  const [routes] = React.useState([
    { key: "eventsall", title: "All Events" },
    { key: "eventspublic", title: "Public Events" },
  ]);

  const renderScene = ({ route }) => {
    if (route.key == "eventsall") {
      return (
        <CardEvents
          data={dataEventAll}
          props={props}
          setData={(e) => setDataEventAll(e)}
          token={token}
        />
      );
    } else if (route.key == "eventspublic") {
      return (
        <CardEvents
          data={dataEventPublic}
          props={props}
          setData={(e) => setDataEventPublic(e)}
          token={token}
        />
      );
    }
  };

  const cekData = (data) => {
    let array = [];
    let type = search["type"];
    let date = search["date_until"];
    let price = search["price_end"];

    search["type"]?.length > 0
      ? search["type"].map((x) => {
          array.push(x);
        })
      : null;

    search["date_until"]?.length > 0 ? array.push(date) : null;

    (search["price_start"] > 0 && search["price_end"] > 0) ||
    (search["price_start"] == 0 && search["price_end"] > 0) ||
    (search["price_start"] == null && search["price_end"] != null)
      ? array.push(price)
      : null;

    return array?.length;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          zIndex: 5,
          paddingHorizontal: 15,
          paddingTop: 15,
          backgroundColor: "white",
        }}
      >
        <Button
          size="small"
          type="icon"
          variant="bordered"
          color="primary"
          onPress={() => {
            setShow(true);
          }}
          style={{
            marginRight: 5,
            borderRadius: 3,
            paddingHorizontal: 10,
            borderColor: "#209fae",
          }}
        >
          <Filternewbiru width={18} height={18} />
          {cekData() > 0 ? (
            <View
              style={{
                backgroundColor: "#209fae",
                marginLeft: 10,
                width: 20,
                paddingHorizontal: 5,
                borderRadius: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  color: "#ffff",
                  fontSize: 14,
                }}
              >
                {cekData(dataFilterCategori)}
              </Text>
            </View>
          ) : null}
        </Button>
        <View
          style={{
            backgroundColor: "#F0F0F0",
            borderRadius: 3,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Search width={15} height={15} />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder={t("search")}
            style={{
              width: "85%",
              marginLeft: 5,
              padding: 0,
            }}
            returnKeyType="search"
            value={search.keyword}
            onKeyPress={(e) => {
              e.key === "Backspace"
                ? setSearch({ ...search, ["keyword"]: e })
                : null;
            }}
            onChangeText={(x) => setSearch({ ...search, ["keyword"]: x })}
            onSubmitEditing={(x) => setSearch({ ...search, ["keyword"]: x })}
          />
          {search["keyword"] !== null ? (
            <TouchableOpacity
              onPress={() => {
                setSearch({ ...search, ["keyword"]: null });
              }}
            >
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* TAB VIEW */}

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setindex}
        renderTabBar={(props) => {
          return (
            <TabBar
              {...props}
              style={{
                backgroundColor: "white",
              }}
              renderLabel={renderLabel}
              indicatorStyle={{ backgroundColor: "#209FAE", height: 2 }}
            />
          );
        }}
      />

      {/* END TAB VIEW */}

      <Modal
        onBackdropPress={() => {
          setShow(false);
        }}
        onRequestClose={() => setShow(false)}
        onDismiss={() => setShow(false)}
        isVisible={show}
        avoidKeyboard={true}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height:
              Platform.OS == "ios"
                ? Notch
                  ? Dimensions.get("screen").height * 0.6
                  : Dimensions.get("screen").height * 0.63
                : Dimensions.get("screen").height * 0.6,
            width: Dimensions.get("screen").width,
            backgroundColor: "white",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
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
              Filter
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
              onPress={() => setShow(false)}
            >
              <Xhitam height={15} width={15} />
            </TouchableOpacity>
          </View>
          {/* Content */}
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              borderTopWidth: 0.5,
              borderColor: "#d1d1d1",
            }}
          >
            {/* badan A */}
            <View
              style={{
                width: "35%",
                borderRightWidth: 0.5,
                borderColor: "#d1d1d1",
              }}
            >
              <View
                style={{
                  backgroundColor: "#f6f6f6",
                  paddingBottom: 5,
                }}
              >
                {/* map */}
                {/* category */}
                <View
                  style={{
                    borderLeftColor: filterCheck.category
                      ? "#209fae"
                      : "#f6f6f6",
                    borderLeftWidth: 5,
                    marginLeft: 5,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: filterCheck.category ? "#fff" : "#f6f6f6",
                  }}
                >
                  <Text
                    type="bold"
                    size="title"
                    style={{
                      color: "#464646",
                    }}
                    onPress={() => {
                      setFilterCheck((prev) => {
                        return {
                          ...prev,
                          category: true,
                          date: false,
                          price: false,
                          location: false,
                          region: false,
                        };
                      });
                    }}
                  >
                    {t("categories")}
                  </Text>
                </View>
                {/* date */}

                <View
                  style={{
                    borderLeftColor: filterCheck.date ? "#209fae" : "#f6f6f6",
                    borderLeftWidth: 5,
                    marginLeft: 5,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: filterCheck.date ? "#fff" : "#f6f6f6",
                  }}
                >
                  <Text
                    type="bold"
                    size="title"
                    style={{
                      color: "#464646",
                    }}
                    onPress={() => {
                      setFilterCheck((prev) => {
                        return {
                          ...prev,
                          category: false,
                          date: true,
                          price: false,
                          location: false,
                          region: false,
                        };
                      });
                    }}
                  >
                    {t("date")}
                  </Text>
                </View>
                {/* price */}

                <View
                  style={{
                    borderLeftColor: filterCheck.price ? "#209fae" : "#f6f6f6",
                    borderLeftWidth: 5,
                    marginLeft: 5,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: filterCheck.price ? "#fff" : "#f6f6f6",
                  }}
                >
                  <Text
                    type="bold"
                    size="title"
                    style={{
                      color: "#464646",
                    }}
                    onPress={() => {
                      setFilterCheck((prev) => {
                        return {
                          ...prev,
                          category: false,
                          date: false,
                          price: true,
                          location: false,
                          region: false,
                        };
                      });
                    }}
                  >
                    {t("price")}
                  </Text>
                </View>
              </View>
            </View>
            {/* badan B */}
            {filterCheck.category ? categoryFilter() : null}
            {filterCheck.date ? dateFilter() : null}
            {filterCheck.price ? PriceFilter() : null}
          </View>
          {/* button */}
          <View
            style={{
              flex: 1,
              zIndex: 6,
              flexDirection: "row",
              height: 80,
              position: "absolute",
              bottom: 0,
              justifyContent: "space-around",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff",
              width: Dimensions.get("screen").width,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 10,
              paddingHorizontal: 10,
            }}
          >
            <Button
              variant="bordered"
              color="secondary"
              onPress={() => ClearAllFilter()}
              style={{ width: "30%", borderColor: "#ffff" }}
              text={t("clearAll")}
            ></Button>
            <Button
              onPress={() => UpdateFilter()}
              style={{ width: "65%" }}
              text={t("apply")}
            ></Button>
            <Peringatan
              aler={alertPopUp}
              setClose={() =>
                setAlertPopUp({
                  ...alertPopUp,
                  show: false,
                })
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
