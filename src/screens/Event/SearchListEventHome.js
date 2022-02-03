import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Pressable,
  StyleSheet,
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
import { Button, Text, Peringatan, CardEvents, Capital } from "../../component";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import EventsPublic from "../../graphQL/Query/Event/ListEventPublic";
import EventsAll from "../../graphQL/Query/Event/ListEvent2";
import CategoryEvent from "../../graphQL/Query/Event/FilterEvent";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Destinasi from "../../graphQL/Query/Wishlist/Destination";
import { useTranslation } from "react-i18next";
import { TabBar, TabView } from "react-native-tab-view";
import Modal from "react-native-modal";
import CheckBox from "@react-native-community/checkbox";
import DeviceInfo from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";
import { setSettingUser } from "../../redux/action";

export default function SearchListEventHome(props) {
  const { t, i18n } = useTranslation();
  // const dispatch = useDispatch();
  // const setting = useSelector((data) => data.setting);
  const tokenApps = useSelector((data) => data.token);
  let [oldYear, setOldYear] = useState(
    props.route.params.year ? props.route.params.year : null
  );
  let [tempYear, setTempYear] = useState(
    props.route.params.year ? props.route.params.year : null
  );
  let [tempSelectedYear, setTempSelectedYear] = useState(0);
  let [dataEventAll, setDataEventAll] = useState([]);
  let [dataEventPublic, setDataEventPublic] = useState([]);
  let [dataDes, setdataDes] = useState([]);
  // let [setting, setSetting] = useState("");
  let [texts, setText] = useState("");
  let [index, setindex] = useState(0);
  let [show, setShow] = useState(false);
  let [dataCategoryGetOnly, setDataCategoryGetOnly] = useState([]);
  let [dataCategoryMain, setDataCategoryMain] = useState([]);
  let [tempSelectedCategory, setTempSelectedCategory] = useState([]);
  let [tempDataCategory, setTempDataCategory] = useState([]);
  let [dataCountryGetOnly, setDataCountryGetOnly] = useState([]);
  let [dataCountryMain, setDataCountryMain] = useState([]);
  let [tempDataCountry, setTempDataCountry] = useState("");
  let [selectedCountry, setSelectedCountry] = useState(
    props.route.params.idcountries ? props.route.params.idcountries : null
  );
  let [tempSelectedCountry, setTempSelectedCountry] = useState("");

  let [selectedCity, setSelectedCity] = useState(
    props.route.params.idcity ? props.route.params.idcity : null
  );
  let [selectedProvince, setSelectedProvince] = useState(
    props.route.params.idprovince ? props.route.params.idprovince : null
  );
  const [countryName, setCountryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [timeModalStartDate, setTimeModalStartDate] = useState("");
  const [timeModalEndDate, setTimeModalEndDate] = useState("");
  const [isValidDate, setIsValidDate] = useState(true);
  const [isValidPrice, setIsValidPrice] = useState(true);
  const [keyboardIsUp, setKeyboardIsUp] = useState(false);
  const Notch = DeviceInfo.hasNotch();
  const [hasApply, setHasApply] = useState(false);

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
    year: true,
    country: false,
    category: false,
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
        setDataCategoryGetOnly(dataFillter?.event_filter?.type);
        setDataCategoryMain(dataFillter?.event_filter?.type);
        setTempDataCategory(dataFillter?.event_filter?.type);
        setDataCountryGetOnly(dataFillter?.event_filter?.country);
        setDataCountryMain(dataFillter?.event_filter?.country);
        setTempDataCountry(dataFillter?.event_filter?.country);
      },
    }
  );

  const _handleCheckCountry = async (id, index, item) => {
    let xc = [];
    for (var datx of dataCountryGetOnly) {
      let item = { ...datx };
      if (item.id === id) {
        item["checked"] = true;
      } else {
        item["checked"] = false;
      }
      await xc.push(item);
    }

    // await setDataCountryMain(xc);
    await setDataCountryGetOnly(xc);
    await setSelectedCountry(id);
    // await setTempSelectedCountry(id);
  };

  const _handleCheck = async (id, index, item) => {
    let tempe = [...dataCategoryGetOnly];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setDataCategoryGetOnly(tempe);
    await setDataCategoryMain(tempe);
    // await setTempSelectedCategory(tempe);
  };

  const searchkategori = async (teks) => {
    let searching = new RegExp(teks, "i");

    let b = dataCategoryGetOnly.filter((item) => searching.test(item.name));
    setDataCategoryMain(b);
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

  const _handleYear = (item) => {
    setOldYear(item);
  };
  //! Filter tahun
  const yearFilter = () => {
    let thisyear = new Date().getFullYear();
    let threeyear = 3;
    const currentArray = [];
    for (let index = 0; index < threeyear; index++) {
      let currentyear = thisyear + index;
      currentArray.push(currentyear);
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 15,
        }}
      >
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}
        >
          {currentArray.map((item, index) => (
            <Pressable
              key={index.toString()}
              onPress={() => {
                _handleYear(item);
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    marginRight: 10,
                    borderRadius: 20,
                  }}
                >
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 10,
                      backgroundColor: oldYear == item ? "#209FAE" : "#fff",
                    }}
                  ></View>
                </View>
                <Text
                  size="label"
                  type="regular"
                  style={{
                    marginLeft: 0,
                    marginRight: -10,
                    color: "#464646",
                    marginTop: Platform.OS == "ios" ? -5 : -2,
                  }}
                >
                  {item}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  let [keywordCountry, setKeywordCountry] = useState("");
  const searchCountry = (text) => {
    setKeywordCountry(text);
    let searching = new RegExp(text, "i");
    let countries = dataCountryGetOnly.filter((item) =>
      searching.test(item.name)
    );
    setDataCountryMain(countries);
  };
  //!Filter country
  const countryFilter = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 15,
        }}
      >
        <View
          style={{
            height: 35,
            backgroundColor: "#f6f6f6",
            borderRadius: 2,

            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#e8e8e8",
            marginBottom: 10,
          }}
        >
          <Search width={15} height={15} style={{ marginRight: 5 }} />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder={t("search")}
            style={{
              width: "85%",
              marginLeft: 5,
              padding: 0,
            }}
            returnKeyType="search"
            placeholderTextColor="#464646"
            value={countryName}
            onChangeText={(x) => {
              searchCountry(x), setCountryName(x);
            }}
            onSubmitEditing={(x) => searchCountry(x)}
          />
          {countryName.length ? (
            <TouchableOpacity
              onPress={() => {
                searchCountry("");
                setCountryName("");
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
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}
        >
          {dataCountryMain.length > 0 ? (
            dataCountryMain?.map((item, index) => (
              <TouchableOpacity
                onPress={() => _handleCheckCountry(item["id"], index, item)}
                style={{
                  flexDirection: "row",
                  backgroundColor:
                    item.checked === true
                      ? "#daf0f2"
                      : selectedCountry == item.id
                      ? "#daf0f2"
                      : "#fff",
                  // borderColor: "#464646",
                  width: "100%",
                  marginRight: 3,
                  // marginBottom: 20,
                  justifyContent: "flex-start",
                  alignContent: "center",
                  alignItems: "center",
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                <Text
                  size="label"
                  type={item.checked === true ? "bold" : "regular"}
                  style={{
                    marginLeft: 0,
                    color: "#464646",
                  }}
                >
                  {Capital({ text: item?.name })}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ alignSelf: "center" }}>{t("noData")}</Text>
          )}
        </ScrollView>
      </View>
    );
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
              height: 35,
              backgroundColor: "#f6f6f6",
              borderRadius: 2,
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "#e8e8e8",
            }}
          >
            <Search width={15} height={15} style={{ marginRight: 5 }} />

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
              placeholderTextColor="#464646"
              onChangeText={(x) => {
                searchkategori(x);
                setCategoryName(x);
              }}
              onSubmitEditing={(x) => searchkategori(x)}
            />
            {dataCategoryGetOnly.length !== dataCategoryMain.length ? (
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
          {dataCategoryMain.length > 0 ? (
            dataCategoryMain.map((item, index) => (
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
                  onValueChange={() =>
                    Platform.OS == "ios"
                      ? null
                      : _handleCheck(item["id"], index, item)
                  }
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
            ))
          ) : (
            <Text style={{ alignSelf: "center" }}>{t("noData")}</Text>
          )}
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
  let [search, setSearch] = useState({
    year: oldYear ? oldYear : null,
    type: null,
    tag: null,
    keyword: null,
    countries: selectedCountry ? selectedCountry : null,
    date_from: null,
    date_until: null,
    price_start: null,
    price_end: null,
    city: selectedCity ? selectedCity : null,
    province: selectedProvince ? selectedProvince : null,
  });

  //! FUNCTION CLEAR FILTER

  const ClearAllFilter = async () => {
    let tempe = [...dataCategoryGetOnly];
    let tempes = [];
    for (var x of tempe) {
      let data = { ...x };
      data.checked = false;
      await tempes.push(data);
    }
    await setDataCategoryGetOnly(tempes);
    await setDataCategoryMain(tempes);
    await setTempSelectedCategory(tempes);
    await setDateData({
      start_date: "",
      end_date: "",
    });
    await setRenderDate({
      render_start_date: "",
      render_end_date: "",
    });
    await setOldYear(null);
    await setTempYear(null);
    await setTempSelectedYear(null);
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
    let tempCountry = [...dataCountryMain];
    let temp = [];
    for (var x of tempCountry) {
      let data = { ...x };
      if (data.checked == true) {
        data.checked = false;
      }
      await temp.push(data);
    }
    await setDataCountryMain(temp);
    await setDataCountryGetOnly(temp);
    await setTempDataCountry(temp);
    await setTempDataCategory(temp);
    await setSelectedCountry(null);
    await setSelectedCity(null);
    await setSelectedProvince(null);
    await setSearch({
      year: null,
      type: null,
      tag: null,
      keyword: null,
      countries: null,
      date_from: null,
      date_until: null,
      price_start: null,
      price_end: null,
      city: null,
      province: null,
    });
    // UpdateFilter();
  };

  //! End FUNCTION CLEAR FILTER

  //! FUNCTION UPDATE FILTER

  const UpdateFilter = async () => {
    let hasilCountry = [];
    let hasilCategory = [];
    let tempHasilCategory = [];

    if (isValidDate == true && isValidPrice == true) {
      for (var x of dataCountryMain) {
        if (x.checked === true) {
          hasilCountry.push(x.id);
        }
      }

      for (var x of dataCategoryMain) {
        if (x.checked === true) {
          hasilCategory.push(x.id);
        }
      }

      for (var x of dataCategoryMain) {
        tempHasilCategory.push(x);
      }

      let data = { ...search };
      data["type"] = hasilCategory;
      data["date_from"] = dateData.start_date;
      data["date_until"] = dateData.end_date;
      if (customPriceValues.max !== "any") {
        data["price_start"] = priceValue.min;
        data["price_end"] = priceValue.max;
      } else {
        data["price_start"] = 0;
        data["price_end"] = 0;
      }
      data["year"] = oldYear;
      data["countries"] = selectedCountry;
      await setSearch(data);
      await setShow(false);
      setTempSelectedCountry(data.countries);
      setTempSelectedYear(data.year);
      setTempDataCategory(tempHasilCategory);
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

  const loadAsync = async () => {
    await GetDataEventsAll();
    await GetDataEventsPublic();

    // let setsetting = await AsyncStorage.getItem("setting");
    // await setSetting(JSON.parse(setsetting));
    // dispatch(setSettingUser(JSON.parse(setsetting)));
  };

  const [
    GetDataEventsAll,
    { loading: loadingAll, data: dataAll, error: errorAll },
  ] = useLazyQuery(EventsAll, {
    fetchPolicy: "network-only",
    variables: {
      keyword: search.keyword,
      type: search.type,
      cities: search.city ? search.city : null,
      countries: search.countries ? search.countries : null,
      province: search.province ? search.province : null,
      price_start: search.price_start ? search.price_start : null,
      price_end: search.price_end ? search.price_end : null,
      date_from: search.date_from ? search.date_from : null,
      date_until: search.date_from ? search.date_until : null,
      years: search.year ? search.year : null,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
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
      cities: search.city ? search.city : null,
      countries: search.countries ? search.countries : null,
      province: search.province ? search.province : null,
      price_start: search.price_start ? search.price_start : null,
      price_end: search.price_end ? search.price_end : null,
      date_from: search.date_from ? search.date_from : null,
      date_until: search.date_until ? search.date_until : null,
      years: search.year ? search.year : null,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
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
        Authorization: tokenApps,
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
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 1, height: "100%", marginBottom: 2 },
        ]}
      >
        {route.title}
      </Text>
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
          token={tokenApps}
        />
      );
    } else if (route.key == "eventspublic") {
      return (
        <CardEvents
          data={dataEventPublic}
          props={props}
          setData={(e) => setDataEventPublic(e)}
          token={tokenApps}
        />
      );
    }
  };

  const cekData = (data) => {
    let array = [];
    let type = search["type"];
    let date = search["date_until"];
    let price = search["price_end"];
    let year = search["year"];
    let countries = search["countries"];
    let province = search["province"];
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

    search["year"] ? array.push(year) : null;

    search["countries"] ? array.push(countries) : null;
    search["province"] ? array.push(province) : null;

    return array?.length;
  };

  // tutup modal tanpa apply
  useEffect(() => {
    // Country
    if (!show && tempDataCountry.length != 0) {
      setDataCountryMain(tempDataCountry);
      setDataCountryGetOnly(tempDataCountry);
      if (!hasApply) {
        if (props.route.params.idcountries !== selectedCountry) {
          setSelectedCountry(props.route.params.idcountries);
        } else {
          setSelectedCountry(tempSelectedCountry);
        }
      } else {
        if (tempSelectedCountry !== props.route.params.idcountries) {
          setSelectedCountry(tempSelectedCountry);
        } else {
          setSelectedCountry(tempSelectedCountry);
        }
      }
      setCountryName("");

      // year
      if (!show && tempYear != null) {
        if (!hasApply) {
          if (oldYear !== tempYear) {
            setOldYear(props.route.params.year);
          } else {
            setOldYear(tempYear);
          }
        } else {
          if (oldYear !== tempSelectedYear) {
            setOldYear(tempSelectedYear);
          } else {
            setOldYear(tempSelectedYear);
          }
        }
      }

      // categories
      if (!show && tempDataCategory.length != 0) {
        setDataCategoryMain(tempDataCategory);
        setDataCategoryGetOnly(tempDataCategory);
        if (!hasApply) {
          if (tempSelectedCategory !== tempDataCategory) {
            setDataCategoryMain(tempDataCategory);
            setDataCategoryGetOnly(tempDataCategory);
          } else {
            setDataCategoryMain(tempDataCategory);
            setDataCategoryGetOnly(tempDataCategory);
          }
        } else {
          if (tempDataCategory !== tempSelectedCategory) {
            setDataCategoryMain(tempDataCategory);
            setDataCategoryGetOnly(tempDataCategory);
          } else {
            setDataCategoryMain(tempDataCategory);
            setDataCategoryGetOnly(tempDataCategory);
          }
        }
        setCategoryName("");
      }
    }
  }, [
    show,
    tempSelectedCountry,
    tempSelectedYear,
    // tempSelectedCategory,
    tempDataCategory,
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 15,
          paddingTop: 15,
          height: 50,
          zIndex: 5,
          flexDirection: "row",
          width: Dimensions.get("screen").width,
        }}
      >
        <Pressable
          onPress={() => {
            setShow(true);
          }}
          style={{
            borderWidth: 1,
            borderColor: "#209fae",
            height: 35,
            borderRadius: 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Filternewbiru
            width={18}
            height={18}
            style={{ marginHorizontal: 7 }}
          />
          {cekData() > 0 ? (
            <View
              style={{
                backgroundColor: "#209fae",
                borderRadius: 2,
                marginRight: 7,
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  paddingHorizontal: 5,
                  color: "#fff",
                }}
              >
                {cekData(dataCategoryMain)}
              </Text>
            </View>
          ) : null}
        </Pressable>
        <View
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            flex: 1,
            paddingHorizontal: 10,
            marginLeft: 7,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            height: 35,
            borderWidth: 1,
            borderColor: "#e8e8e8",
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
            placeholderTextColor="#464646"
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
          {(search["keyword"] !== null) & (search["keyword"] !== "") ? (
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
                  marginLeft: 5,
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
                height: 42,
                justifyContent: "center",
              }}
              renderLabel={renderLabel}
              indicatorStyle={{
                backgroundColor: "#209FAE",
                height: 2,
              }}
            />
          );
        }}
      />

      {/* END TAB VIEW */}

      {index == 0 && dataEventAll.length == 0 ? (
        <View
          style={{
            width: Dimensions.get("screen").width,
            marginTop: 110,
            zIndex: 1,
            position: "absolute",
            alignItems: "center",
          }}
        >
          <Text size="title" type="bold">
            {t("noData")}
          </Text>
        </View>
      ) : null}
      {index == 1 && dataEventPublic.length == 0 ? (
        <View
          style={{
            width: Dimensions.get("screen").width,
            marginTop: 110,
            zIndex: 1,
            position: "absolute",
            alignItems: "center",
          }}
        >
          <Text size="title" type="bold">
            {t("noData")}
          </Text>
        </View>
      ) : null}

      {/* MODAL FILTER  */}
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
                  ? Dimensions.get("screen").height * 0.51
                  : Dimensions.get("screen").height * 0.53
                : Dimensions.get("screen").height * 0.5,
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
                {/* year */}
                <View
                  style={{
                    borderLeftColor: filterCheck.year ? "#209fae" : "#f6f6f6",
                    borderLeftWidth: 5,
                    marginLeft: 5,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: filterCheck.year ? "#fff" : "#f6f6f6",
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
                          year: true,
                          country: false,
                          category: false,
                          date: false,
                          price: false,
                          location: false,
                          region: false,
                        };
                      });
                    }}
                  >
                    {t("year")}
                  </Text>
                </View>
                {/* Negara */}
                <View
                  style={{
                    borderLeftColor: filterCheck.country
                      ? "#209fae"
                      : "#f6f6f6",
                    borderLeftWidth: 5,
                    marginLeft: 5,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: filterCheck.country ? "#fff" : "#f6f6f6",
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
                          year: false,
                          country: true,
                          category: false,
                          date: false,
                          price: false,
                          location: false,
                          region: false,
                        };
                      });
                    }}
                  >
                    {t("country")}
                  </Text>
                </View>
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
                          year: false,
                          country: false,
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
                          year: false,
                          country: false,
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
                          year: false,
                          country: false,
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
            {filterCheck.year ? yearFilter() : null}
            {filterCheck.country ? countryFilter() : null}
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
              onPress={() => {
                setHasApply(true);
                UpdateFilter();
              }}
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

const styles = StyleSheet.create({
  label: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
});
