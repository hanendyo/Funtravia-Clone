import React, { useState, useEffect } from "react";
import {
  View,
  // Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Capital, CustomImage, FunIcon, FunImage } from "../../../component";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  LikeRed,
  LikeEmpty,
  Arrowbackwhite,
  OptionsVertWhite,
  Star,
  PinHijau,
  default_image,
  LikeEmptynew,
  Love,
  FilterIcon,
  Search,
  Google,
  Xhitam,
  Select,
  Filternewbiru,
  Arrowbackios,
  Xblue,
} from "../../../assets/svg";
// import FilterItin from "./FillterItin";
import Listdestination from "../../../graphQL/Query/Destination/ListDestinationV2";
import filterDestination from "../../../graphQL/Query/Destination/Destinasifilter";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import LinearGradient from "react-native-linear-gradient";
import { StackActions } from "@react-navigation/routers";
import Modal from "react-native-modal";
import CheckBox from "@react-native-community/checkbox";
import Searching from "../../../graphQL/Query/Itinerary/SearchDestination";
import Continent from "../../../graphQL/Query/Countries/Continent";
import Countryss from "../../../graphQL/Query/Countries/CountryListSrc";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";

export default function ItineraryDestination(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("Destination")}
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
    headerLRightContainerStyle: {
      background: "#FFF",
      marginRight: 10,
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

  let [show, setshow] = useState(false);
  let [showCountry, setshowCountry] = useState(false);
  let [showCity, setshowCity] = useState(false);
  let [keyword, setkeyword] = useState("");
  let [dataKota, setdataKota] = useState();
  let [dataNegara, setdataNegara] = useState();

  const {
    data: datafilter,
    loading: loadingfilter,
    error: errorfilter,
  } = useQuery(filterDestination, {
    onCompleted: () => {
      setdataFilterCategori(datafilter.destination_filter.type);
      setdataFilterCategoris(datafilter.destination_filter.type);
      setdataFilterFacility(datafilter.destination_filter.facility);
      setdataFilterFacilitys(datafilter.destination_filter.facility);
      setdataFilterCountry(datafilter.destination_filter.country);
      setdataFilterCountrys(datafilter.destination_filter.country);
    },
  });

  const {
    data: dataContinen,
    loading: loadingcontinen,
    error: errorcontinen,
  } = useQuery(Continent, {
    onCompleted: async () => {
      let dats = [...dataContinen?.continent_type];
      let ind = dats.findIndex((k) => k.name === "Asia");
      let x = { ...dats[ind] };
      x["checked"] = true;
      await dats.splice(ind, 1, x);
      await setdataContinent(dats);
    },
  });

  const {
    data: dataCountry,
    loading: loadingcountry,
    error: errorcountry,
  } = useQuery(Countryss, {
    variables: {
      continent_id: null,
      keyword: keyword,
    },
    onCompleted: async () => {
      let xc = [];
      for (var datx of dataCountry?.list_country_src) {
        let item = { ...datx };
        if (item.id === props?.route?.params?.idcountries) {
          item["checked"] = true;
          setdataNegara(item);
          // setdataKota(item);
        } else {
          item["checked"] = false;
        }
        await xc.push(item);
      }
      await setdataCountrys(xc);
    },
  });

  let [token, setToken] = useState(props.route.params.token);
  let [datadayaktif] = useState(props.route.params.datadayaktif);
  let [dataDes] = useState(props.route.params.dataDes);
  let [lat] = useState(props.route.params.lat);
  let [long] = useState(props.route.params.long);
  let [IdItinerary, setId] = useState(props.route.params.IdItinerary);
  let [dataFilterCategori, setdataFilterCategori] = useState([]);
  let [dataFilterCategoris, setdataFilterCategoris] = useState([]);
  let [dataFilterFacility, setdataFilterFacility] = useState([]);
  let [dataFilterFacilitys, setdataFilterFacilitys] = useState([]);
  let [dataFilterCountry, setdataFilterCountry] = useState([]);
  let [dataFilterCountrys, setdataFilterCountrys] = useState([]);
  let [dataFilterCity, setdataFilterCity] = useState([]);
  let [dataFilterCityfull, setdataFilterCityfull] = useState([]);
  let [dataFilterCitys, setdataFilterCitys] = useState([]);
  let [dataDestination, setdataDestination] = useState([]);
  let [datafilterAll, setdatafilterAll] = useState([]);
  let [dataContinent, setdataContinent] = useState([]);
  let [dataCountrys, setdataCountrys] = useState([]);

  let [aktif, setaktif] = useState("categories");

  let [search, setSearch] = useState({
    type:
      props.route.params && props.route.params.idtype
        ? [props.route.params.idtype]
        : [],
    keyword: null,
    countries:
      props.route.params && props.route.params.idcountries
        ? [props.route.params.idcountries]
        : [],
    provinces: [],
    cities:
      props.route.params && props.route.params.idcity
        ? [props.route.params.idcity]
        : [],
    goodfor: [],
    facilities: [],
  });

  let [searcountry, setsearcountry] = useState(null);

  const {
    data: datasearchlocation,
    loading: loadingsearchlocation,
    error: errorsearchlocation,
  } = useQuery(Searching, {
    variables: {
      keyword: keyword,
      cities_id: null,
      province_id: null,
      countries_id: dataNegara?.id ? dataNegara?.id : null,
    },
    onCompleted: async () => {
      // console.log("masukkk", dataKota);
      // console.log("masukkk", datasearchlocation);

      let datloop = [...datasearchlocation.searchlocation_populer];

      for (var ix in datloop) {
        if (
          datloop[ix].id === props?.route?.params?.idcity
          // || datloop[ix].id === props?.route?.params?.idcountries
        ) {
          let dat = { ...datloop[ix] };
          dat.checked = true;
          await setdataKota(dat);
          await datloop.splice(ix, 1, dat);
        }
      }

      await setdataFilterCityfull(datasearchlocation.searchlocation_populer);
      await setdataFilterCity(datloop);
      await setdataFilterCitys(datloop);
    },
  });

  const [GetListDestination, { data, loading, error }] = useLazyQuery(
    Listdestination,
    {
      fetchPolicy: "network-only",
      variables: {
        keyword: search.keyword ? search.keyword : null,
        // type: search.type ? search.type : null,
        grouptype: props.route?.params?.idgroup
          ? [props.route?.params?.idgroup]
          : [],
        type: search.type && search.type.length > 0 ? search.type : null,
        cities:
          search.cities && search.cities.length > 0 ? search.cities : null,
        countries:
          search.countries && search.countries.length > 0
            ? search.countries
            : null,
        provinces:
          search.provinces && search.provinces.length > 0
            ? search.provinces
            : null,
        goodfor: search.goodfor ? search.goodfor : null,
        facilities: search.facilities ? search.facilities : null,
        rating: search.rating ? search.rating : null,
      },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      onCompleted: () => {
        setdataDestination(data.destinationList_v2);
      },
    }
  );

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

  const _liked = async (id) => {
    if (token && token !== "" && token !== null) {
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
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
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            GetListDestination();
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
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

  const _unliked = async (id) => {
    if (token && token !== "" && token !== null) {
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
            GetListDestination();
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      GetListDestination();
    });
    return unsubscribe;
  }, [props.navigation]);

  const searchs = async (teks) => {
    setkeyword(teks);
    let searching = new RegExp(teks, "i");

    let Categori = dataFilterCategori.filter((item) =>
      searching.test(item.name)
    );
    setdataFilterCategoris(Categori);

    let Facility = dataFilterFacility.filter((item) =>
      searching.test(item.name)
    );
    setdataFilterFacilitys(Facility);

    let countries = dataFilterCountry.filter((item) =>
      searching.test(item.name)
    );
    setdataFilterCountrys(countries);
  };

  const _handleCheck = async (id, index, item) => {
    let tempe = [...dataFilterCategori];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setdataFilterCategori(tempe);
    await setdataFilterCategoris(tempe);
  };

  const _handleCheckf = async (id, index, item) => {
    let tempe = [...dataFilterFacility];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setdataFilterFacility(tempe);
    await setdataFilterFacilitys(tempe);
  };

  const _handleCheckC = async (id, index, item) => {
    let tempe = [...datafilter.destination_filter.country];
    let items = { ...item };
    items.checked = true;

    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    setsearcountry(items.id);
    await setdataFilterCountry(tempe);
    await setdataFilterCountrys(tempe);
  };

  const _handleCheckCity = async (id, index, item) => {
    let tempe = [...dataFilterCity];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setdataFilterCity(tempe);
    await setdataFilterCitys(tempe);
  };

  const _handleCheckCitySingle = async (id, index, item) => {
    // console.log("masuk", dataFilterCityfull);
    let tempe = [...dataFilterCityfull];
    // return false;

    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setdataFilterCity(tempe);
    await setdataFilterCitys(tempe);
  };

  const UpdateFilter = async () => {
    let data = { ...search };

    let Categori = [];
    for (var x of dataFilterCategori) {
      if (x.checked === true) {
        Categori.push(x.id);
      }
    }

    let fasilitas = [];
    for (var y of dataFilterFacility) {
      if (y.checked === true) {
        fasilitas.push(y.id);
      }
    }

    let Countryss = [];

    // for (var t of dataFilterCountry) {
    //   if (t.checked === true) {
    //     Countryss.push(t.id);
    //   }
    // }

    let cityss = [];
    let province = [];

    for (var u of dataFilterCity) {
      if (u.checked === true) {
        if (u.type === "Province") {
          province.push(u.id);
        } else if (u.type === "City") {
          cityss.push(u.id);
        } else if (u.type === "Country") {
          Countryss.push(u.id);
        }
      }
    }

    data["type"] = await Categori;
    data["facilities"] = await fasilitas;
    data["countries"] = await Countryss;
    data["cities"] = await cityss;
    data["provinces"] = await province;

    let dats = [];
    dats = await dats.concat(Categori);
    dats = await dats.concat(fasilitas);

    await setdatafilterAll(dats);

    await setSearch(data);
    await setshow(false);
  };

  const ClearAllFilter = () => {
    setSearch({
      type:
        props.route.params && props.route.params.idtype
          ? [props.route.params.idtype]
          : [],
      keyword: null,
      countries:
        props.route.params && props.route.params.idcountries
          ? [props.route.params.idcountries]
          : [],
      provinces: [],
      cities:
        props.route.params && props.route.params.idcity
          ? [props.route.params.idcity]
          : [],
      goodfor: [],
      facilities: [],
    });
    setdataFilterCategori(datafilter?.destination_filter.type);
    setdataFilterCategoris(datafilter?.destination_filter.type);
    setdataFilterFacility(datafilter?.destination_filter.facility);
    setdataFilterFacilitys(datafilter?.destination_filter.facility);
    setdataFilterCountry(datafilter?.destination_filter.country);
    setdataFilterCountrys(datafilter?.destination_filter.country);
    setdataFilterCity(datasearchlocation?.searchlocation_populer);
    setdataFilterCitys(datasearchlocation?.searchlocation_populer);
    setdatafilterAll([]);
  };

  const _setSearch = async (teks) => {
    let data = { ...search };

    data["keyword"] = teks;

    await setSearch(data);
  };

  const _handleCheckCountry = async (id, index, item) => {
    let xc = [];
    for (var datx of dataCountry?.list_country_src) {
      let item = { ...datx };
      if (item.id === id) {
        item["checked"] = true;
      } else {
        item["checked"] = false;
      }
      await xc.push(item);
    }
    console.log(xc);
    await setdataCountrys(xc);
  };

  const ApplyCountry = async () => {
    let index = dataCountrys.findIndex((key) => key.checked === true);
    let item = { ...dataCountrys[index] };
    let ser = { ...search };
    ser["countries"] = [item.id];
    await setSearch(ser);
    await setshowCountry(false);
    await setdataNegara(item);
  };

  const ApplyCity = async () => {
    let index = dataFilterCitys.findIndex((key) => key.checked === true);
    let item = { ...dataFilterCitys[index] };
    let ser = { ...search };

    console.log(item);
    ser["countries"] = [];
    ser["provinces"] = [];
    ser["cities"] = [];

    if (item.type === "Province") {
      ser["provinces"] = [item.id];
    } else if (item.type === "City") {
      ser["cities"] = [item.id];
    } else if (item.type === "Country") {
      ser["countries"] = [item.id];
    }

    await setSearch(ser);
    await setshowCity(false);
    await setdataKota(item);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          width: Dimensions.get("screen").width,
          zIndex: 5,
        }}
      >
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            height: 50,
            zIndex: 5,
            flexDirection: "row",
            width: Dimensions.get("screen").width,
          }}
        >
          <Button
            size="small"
            type="icon"
            variant="bordered"
            color="primary"
            onPress={() => {
              setshow(true), searchs("");
            }}
            style={{
              marginRight: 5,

              paddingHorizontal: 10,
            }}
          >
            <Filternewbiru width={18} height={18} />
            {datafilterAll.length > 0 ? (
              <View
                style={{
                  backgroundColor: "#209fae",
                  marginLeft: 5,
                  paddingHorizontal: 5,
                  borderRadius: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    color: "#ffff",
                    fontSize: 13,
                    // alignSelf: "center",
                  }}
                >
                  {datafilterAll?.length}
                </Text>
              </View>
            ) : null}
          </Button>

          <View
            style={{
              backgroundColor: "#F0F0F0",
              borderRadius: 5,
              flex: 1,
              paddingHorizontal: 10,
              marginLeft: 5,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              height: 35,
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
              value={search["keyword"]}
              onChangeText={(x) => _setSearch(x)}
              onSubmitEditing={(x) => _setSearch(x)}
            />
            {search["keyword"] !== null ? (
              <TouchableOpacity
                onPress={() => setSearch({ ...search, keyword: null })}
              >
                <Xblue
                  width="20"
                  height="20"
                  style={{
                    alignSelf: "center",
                    // marginRight: 20,
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() =>
              props.navigation.push("ItinGoogle", {
                dataDes: dataDes,
                token: token,
                datadayaktif: datadayaktif,
                lat: lat,
                long: long,
              })
            }
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              borderWidth: 1,
              width: "10%",
              borderColor: "#F0F0F0",
              paddingVertical: 10,
              alignItems: "flex-start",
              justifyContent: "center",
              flexDirection: "row",
              marginLeft: 10,
            }}
          >
            <Google height={15} width={15} />
            {/* <Text
              style={{
                marginLeft: 5,
                fontFamily: "Lato-Regular",
                fontSize: 14,
                color: "#646464",
              }}
            >
              {t("search")}
            </Text> */}
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderTopWidth: 0.5,
            borderTopColor: "#d3d3d3",
            // height: 50,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <Text>Explore :</Text>
          <TouchableOpacity
            onPress={() => {
              setshowCountry(true), searchs("");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              marginLeft: 5,
            }}
          >
            <Text type="bold">
              <Capital text={dataNegara?.name ? dataNegara?.name : ""} />
            </Text>
            <View
              style={{
                paddingVertical: 6,
                paddingHorizontal: 5,
                backgroundColor: "#dae0f2",
                borderRadius: 30,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <Select width="10" height="10" style={{ marginBottom: -2 }} />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              paddingHorizontal: 5,
            }}
            type="bold"
          >
            -
          </Text>
          <TouchableOpacity
            onPress={() => {
              setshowCity(true), searchs("");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              // marginLeft: 5,
            }}
          >
            <Text type="bold">
              <Capital text={dataKota?.name ? dataKota?.name : ""} />
            </Text>
            <View
              style={{
                paddingVertical: 6,
                paddingHorizontal: 5,
                backgroundColor: "#dae0f2",
                borderRadius: 30,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <Select width="10" height="10" style={{ marginBottom: -2 }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        onBackdropPress={() => {
          setshow(false);
        }}
        onRequestClose={() => setshow(false)}
        onDismiss={() => setshow(false)}
        isVisible={show}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height: Dimensions.get("screen").height * 0.6,
            width: Dimensions.get("screen").width,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: "white",
          }}
        >
          {/* bagian atas */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: 15,
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
              onPress={() => setshow(false)}
            >
              <Xhitam height={13} width={13} />
            </TouchableOpacity>
          </View>
          {/* bagian side */}
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              borderTopWidth: 0.5,
              borderColor: "#d1d1d1",
            }}
          >
            {/* kiri ..................................................... */}
            <View
              style={{
                width: "35%",
                borderRightWidth: 0.5,
                borderColor: "#d1d1d1",
              }}
            >
              <Pressable
                onPress={() => {
                  setaktif("categories");
                }}
                style={{
                  backgroundColor: "#f6f6f6",
                  paddingBottom: 5,
                }}
              >
                <View
                  style={{
                    borderLeftColor:
                      aktif === "categories" ? "#209fae" : "#f6f6f6",
                    borderLeftWidth: aktif === "categories" ? 5 : 0,
                    marginLeft: aktif === "categories" ? 5 : 10,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor:
                      aktif === "categories" ? "#ffff" : "#f6f6f6",
                  }}
                >
                  <Text
                    type="bold"
                    size="title"
                    style={{
                      // fontSize: 20,
                      // fontFamily: "Lato-Bold",
                      color: "#464646",
                      // marginTop: 10,
                    }}
                  >
                    {t("categories")}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  setaktif("facilities");
                }}
                style={{
                  backgroundColor: "#f6f6f6",
                  paddingBottom: 5,
                }}
              >
                <View
                  style={{
                    borderLeftColor:
                      aktif === "facilities" ? "#209fae" : "#f6f6f6",
                    borderLeftWidth: aktif === "facilities" ? 5 : 0,
                    marginLeft: aktif === "facilities" ? 5 : 10,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor:
                      aktif === "facilities" ? "#ffff" : "#f6f6f6",
                  }}
                >
                  <Text
                    type="bold"
                    size="title"
                    style={{
                      // fontSize: 20,
                      // fontFamily: "Lato-Bold",
                      color: "#464646",
                      // marginTop: 10,
                    }}
                  >
                    {t("facilities")}
                  </Text>
                </View>
              </Pressable>
            </View>
            {/* kanan................................................................ */}
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
                    underlineColorAndroid="transparent"
                    placeholder={t("search")}
                    Text={keyword}
                    style={{
                      width: "80%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    // returnKeyType="search"
                    value={keyword}
                    onChangeText={(x) => searchs(x)}
                    onSubmitEditing={(x) => searchs(x)}
                  />

                  {keyword.length !== 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setkeyword("");
                        searchs("");
                      }}
                    >
                      <Xblue
                        width="15"
                        height="15"
                        style={{
                          alignSelf: "center",
                          // marginRight: 20,
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              {aktif === "categories" ? (
                <ScrollView
                  // style={{ borderWidth: 1, height: 100 }}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 15,
                  }}
                >
                  {dataFilterCategoris.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => _handleCheck(item["id"], index, item)}
                      style={{
                        flexDirection: "row",
                        backgroundColor: "white",
                        // borderColor: "#464646",
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
                        lineWidth={1}
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
                        onChange={() => _handleCheck(item["id"], index, item)}
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
                          color: "#464646",
                          // borderWidth: 5,
                        }}
                      >
                        {Capital({ text: item?.name })}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
                </ScrollView>
              ) : aktif === "facilities" ? (
                <ScrollView
                  // style={{ borderWidth: 1, height: 100 }}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 15,
                  }}
                >
                  {dataFilterFacilitys.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => _handleCheckf(item["id"], index, item)}
                      style={{
                        flexDirection: "row",
                        backgroundColor: "white",
                        // borderColor: "#464646",
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
                        lineWidth={1}
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
                        onChange={() => _handleCheckf(item["id"], index, item)}
                        onValueChange={() =>
                          Platform.OS == "ios"
                            ? null
                            : _handleCheckf(item["id"], index, item)
                        }
                        value={item["checked"]}
                      />

                      <Text
                        size="label"
                        type="regular"
                        style={{
                          marginLeft: 0,
                          color: "#464646",
                          // borderWidth: 5,
                        }}
                      >
                        {Capital({ text: item?.name })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : aktif === "country" ? (
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 15,
                  }}
                >
                  {dataFilterCountrys.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => _handleCheckC(item["id"], index, item)}
                      style={{
                        flexDirection: "row",
                        backgroundColor: "white",
                        // borderColor: "#464646",
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
                        lineWidth={1}
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
                        onChange={() => _handleCheckC(item["id"], index, item)}
                        onValueChange={() =>
                          _handleCheckC(item["id"], index, item)
                        }
                        value={item["checked"]}
                      />

                      <Text
                        size="label"
                        type="regular"
                        style={{
                          marginLeft: 0,
                          color: "#464646",
                          // borderWidth: 5,
                        }}
                      >
                        {Capital({ text: item?.name })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : aktif === "City" ? (
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 15,
                  }}
                >
                  {dataFilterCitys.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => _handleCheckCity(item["id"], index, item)}
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
                        lineWidth={1}
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
                        onChange={() =>
                          _handleCheckCity(item["id"], index, item)
                        }
                        onValueChange={() =>
                          _handleCheckCity(item["id"], index, item)
                        }
                        value={item["checked"]}
                      />

                      <Text
                        size="label"
                        type="regular"
                        style={{
                          marginLeft: 0,
                          color: "#464646",
                          // borderWidth: 5,
                        }}
                      >
                        {Capital({ text: item?.name })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : null}
            </View>
          </View>
          {/* bagian bawah */}
          <View
            style={{
              // flex: 1,
              zIndex: 6,
              flexDirection: "row",
              height: 70,

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
          </View>
        </View>
      </Modal>

      {dataDestination.length > 0 ? (
        <FlatList
          data={dataDestination}
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
                props?.route?.params && props?.route?.params?.IdItinerary
                  ? props.navigation.push("DestinationUnescoDetail", {
                      id: item.id,
                      name: item.name,
                      token: token,
                      iditinerary: props.route.params.IdItinerary,
                      datadayaktif: props.route.params.datadayaktif,
                    })
                  : props.navigation.push("DestinationUnescoDetail", {
                      id: item.id,
                      name: item.name,
                      token: token,
                    });
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
              <View style={{ justifyContent: "center" }}>
                {/* Image */}
                <FunImage
                  source={{ uri: item.images.image }}
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
                      onPress={() => _unliked(item.id)}
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
                      onPress={() => _liked(item.id)}
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
                    <Text size="description" type="bold">
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
                    size="label"
                    type="bold"
                    style={{ marginTop: 2 }}
                    numberOfLines={1}
                  >
                    {Capital({ text: item?.name })}
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
                      size="description"
                      type="regular"
                      style={{ marginLeft: 5 }}
                      numberOfLines={1}
                    >
                      {Capital({ text: item?.cities.name })}
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
                    <Text size="description" type="bold">
                      Great for :
                    </Text>
                    <View style={{ flexDirection: "row" }}>
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
                      props.navigation.dispatch(
                        StackActions.replace("ItineraryStack", {
                          screen: "ItineraryChooseday",
                          params: {
                            Iditinerary: props.route.params.IdItinerary,
                            Kiriman: item.id,
                            token: token,
                            Position: "destination",
                            datadayaktif: props.route.params.datadayaktif,
                          },
                        })
                      );
                    }}
                    size="small"
                    text={"Add"}
                    // style={{ marginTop: 15 }}
                  />
                </View>
              </View>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      ) : null}

      {/* // modalcountry */}

      <Modal
        onBackdropPress={() => {
          setshowCountry(false);
        }}
        onRequestClose={() => setshowCountry(false)}
        onDismiss={() => setshowCountry(false)}
        isVisible={showCountry}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height: Dimensions.get("screen").height * 0.6,
            width: Dimensions.get("screen").width,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: "white",
          }}
        >
          {/* bagian atas */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: 15,
            }}
          >
            <Text
              type="bold"
              size="title"
              style={{
                // fontSize: 20,
                // fontFamily: "Lato-Bold",
                color: "#464646",
              }}
            >
              {"Filter"} {t("country")}
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
              onPress={() => setshowCountry(false)}
            >
              <Xhitam height={15} width={15} />
            </TouchableOpacity>
          </View>

          {/* bagian side */}

          <View
            style={{
              flexDirection: "row",
              flex: 1,
              borderTopWidth: 0.5,
              borderColor: "#d1d1d1",
            }}
          >
            {/* kiri ..................................................... */}
            <View
              style={{
                width: "35%",
                borderRightWidth: 0.5,
                borderColor: "#d1d1d1",
              }}
            >
              {dataContinent?.map((item, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      setaktif("categories");
                    }}
                    style={{
                      backgroundColor: "#f6f6f6",
                      paddingBottom: 5,
                    }}
                  >
                    <View
                      style={{
                        borderLeftColor:
                          item.checked === true ? "#209fae" : "#f6f6f6",
                        borderLeftWidth: item.checked === true ? 5 : 0,
                        marginLeft: item.checked === true ? 5 : 10,
                        justifyContent: "center",
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        backgroundColor:
                          item.checked === true ? "#ffff" : "#f6f6f6",
                      }}
                    >
                      <Text
                        type="bold"
                        size="title"
                        style={{
                          // fontSize: 20,
                          // fontFamily: "Lato-Bold",
                          color: "#464646",
                          // marginTop: 10,
                        }}
                      >
                        <Capital text={item?.name} />
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            {/* kanan................................................................ */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  padding: 15,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F0F0F0",
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
                    underlineColorAndroid="transparent"
                    placeholder={t("search")}
                    Text={keyword}
                    style={{
                      width: "80%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    // returnKeyType="search"
                    value={keyword}
                    onChangeText={(x) => searchs(x)}
                    onSubmitEditing={(x) => searchs(x)}
                  />
                  {keyword.length !== 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setkeyword("");
                        searchs("");
                      }}
                    >
                      <Xblue
                        width="15"
                        height="15"
                        style={{
                          alignSelf: "center",
                          // marginRight: 20,
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              <ScrollView
                // style={{ borderWidth: 1, height: 100 }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                }}
              >
                {dataCountrys.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => _handleCheckCountry(item["id"], index, item)}
                    style={{
                      flexDirection: "row",
                      backgroundColor:
                        item.checked === true ? "#daf0f2" : "#ffff",
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
                        // borderWidth: 5,
                      }}
                    >
                      {Capital({ text: item?.name })}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
              </ScrollView>
            </View>
          </View>
          {/* bagian bawah */}
          <View
            style={{
              // flex: 1,
              zIndex: 6,
              flexDirection: "row",
              height: 70,
              // borderWidth: 1,
              // position: "absolute",
              // bottom: 0,
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
              paddingHorizontal: 15,
            }}
          >
            <Button
              onPress={() => ApplyCountry()}
              style={{ width: "100%" }}
              text={t("apply")}
            ></Button>
          </View>
        </View>
      </Modal>

      {/* modalcity */}

      <Modal
        onBackdropPress={() => {
          setshowCity(false);
        }}
        onRequestClose={() => setshowCity(false)}
        onDismiss={() => setshowCity(false)}
        isVisible={showCity}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height: Dimensions.get("screen").height * 0.6,
            width: Dimensions.get("screen").width,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: "white",
          }}
        >
          {/* bagian atas */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 20,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text
              type="bold"
              size="title"
              style={{
                // fontSize: 20,
                // fontFamily: "Lato-Bold",
                color: "#464646",
              }}
            >
              {"Filter"} <Capital text={t("city")} />
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
              onPress={() => setshowCity(false)}
            >
              <Xhitam height={15} width={15} />
            </TouchableOpacity>
          </View>

          {/* bagian side */}

          <View
            style={{
              flexDirection: "row",
              flex: 1,
              borderTopWidth: 0.5,
              borderColor: "#d1d1d1",
            }}
          >
            {/* kiri ..................................................... */}
            <View
              style={{
                width: "35%",
                borderRightWidth: 0.5,
                borderColor: "#d1d1d1",
              }}
            >
              {dataNegara ? (
                <Pressable
                  style={{
                    backgroundColor: "#f6f6f6",
                    paddingBottom: 5,
                  }}
                >
                  <View
                    style={{
                      borderLeftColor: "#209fae",
                      borderLeftWidth: 5,
                      marginLeft: 5,
                      justifyContent: "center",
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                      backgroundColor: "#ffff",
                    }}
                  >
                    <Text
                      type="bold"
                      size="title"
                      style={{
                        // fontSize: 20,
                        // fontFamily: "Lato-Bold",
                        color: "#464646",
                        // marginTop: 10,
                      }}
                    >
                      <Capital text={dataNegara?.name} />
                    </Text>
                  </View>
                </Pressable>
              ) : null}
            </View>
            {/* kanan................................................................ */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  padding: 15,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F0F0F0",
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
                    underlineColorAndroid="transparent"
                    placeholder={t("search")}
                    Text={keyword}
                    style={{
                      width: "80%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    // returnKeyType="search"
                    value={keyword}
                    onChangeText={(x) => searchs(x)}
                    onSubmitEditing={(x) => searchs(x)}
                  />
                  {keyword.length !== 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setkeyword("");
                        searchs("");
                      }}
                    >
                      <Xblue
                        width="15"
                        height="15"
                        style={{
                          alignSelf: "center",
                          // marginRight: 20,
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              <ScrollView
                // style={{ borderWidth: 1, height: 100 }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                  paddingTop: 10,
                }}
              >
                {dataFilterCitys.map((item, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      _handleCheckCitySingle(item["id"], index, item)
                    }
                    style={{
                      flexDirection: "row",
                      backgroundColor:
                        item.checked === true ? "#daf0f2" : "#ffff",
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
                        // borderWidth: 5,
                      }}
                    >
                      {Capital({ text: item?.name })}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
              </ScrollView>
            </View>
          </View>
          {/* bagian bawah */}
          <View
            style={{
              // flex: 1,
              zIndex: 6,
              flexDirection: "row",
              height: 70,
              // borderWidth: 1,
              // position: "absolute",
              // bottom: 0,
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
              paddingHorizontal: 15,
            }}
          >
            <Button
              onPress={() => ApplyCity()}
              style={{ width: "100%" }}
              text={t("apply")}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
