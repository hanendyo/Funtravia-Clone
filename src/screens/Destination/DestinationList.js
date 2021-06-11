import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Capital, CustomImage, FunIcon, FunImage } from "../../component";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  LikeEmpty,
  Arrowbackwhite,
  Star,
  PinHijau,
  Love,
  FilterIcon,
  Search,
  Google,
  Xhitam,
} from "../../assets/svg";
import Listdestination from "../../graphQL/Query/Destination/ListDestinationV2";
import filterDestination from "../../graphQL/Query/Destination/Destinasifilter";
import Liked from "../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";
import { StackActions } from "@react-navigation/routers";
import Modal from "react-native-modal";
import CheckBox from "@react-native-community/checkbox";
import Searching from "../../graphQL/Query/Itinerary/SearchDestination";

export default function ItineraryDestination(props) {
  console.log(props.route?.params);
  let [filtershow, setfiltershow] = useState([]);

  const HeaderComponent = {
    headerShown: true,
    title: "Destination",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Destination",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };
  const { t, i18n } = useTranslation();

  let [show, setshow] = useState(false);

  let [token, setToken] = useState(props.route.params.token);
  let [dataFilterCategori, setdataFilterCategori] = useState([]);
  let [dataFilterCategoris, setdataFilterCategoris] = useState([]);
  let [dataFilterFacility, setdataFilterFacility] = useState([]);
  let [dataFilterFacilitys, setdataFilterFacilitys] = useState([]);
  let [dataFilterCountry, setdataFilterCountry] = useState([]);
  let [dataFilterCountrys, setdataFilterCountrys] = useState([]);
  let [dataFilterCity, setdataFilterCity] = useState([]);
  let [dataFilterCitys, setdataFilterCitys] = useState([]);
  let [dataDestination, setdataDestination] = useState([]);

  let [aktif, setaktif] = useState("categories");

  let [search, setSearch] = useState({
    type: [],
    keyword: null,
    countries: [],
    provinces: [],
    cities: [],
    goodfor: [],
    facilities: [],
  });

  let [keyword, setkeyword] = useState("");
  let [searcountry, setsearcountry] = useState(null);

  const {
    data: datafilter,
    loading: loadingfilter,
    error: errorfilter,
  } = useQuery(filterDestination, {
    onCompleted: async () => {
      let datloop = [...datafilter.destination_filter.type];
      let hasil = [...filtershow];
      console.log(hasil);
      let des = [];

      for (var ix in datloop) {
        // console.log(datloop[ix].id);

        if (datloop[ix].id === props?.route?.params?.idtype) {
          let dat = { ...datloop[ix] };
          dat.checked = true;
          await datloop.splice(ix, 1, dat);
          await des.push(dat);
        }
      }
      // console.log(datloop);

      hasil = await hasil.concat(des);

      await setdataFilterCategori(datloop);
      await setdataFilterCategoris(datloop);
      await setdataFilterFacility(datafilter.destination_filter.facility);
      await setdataFilterFacilitys(datafilter.destination_filter.facility);
      await setdataFilterCountry(datafilter.destination_filter.country);
      await setdataFilterCountrys(datafilter.destination_filter.country);

      let dta = datafilter.destination_filter.type.filter(
        (item) => item.sugestion === true
      );
      hasil = hasil.concat(dta);
      let wle = datafilter.destination_filter.facility.filter(
        (item) => item.sugestion === true
      );
      hasil = await hasil.concat(wle);

      await setfiltershow(hasil);
      // await UpdateFilter();
    },
  });

  const {
    data: datasearchlocation,
    loading: loadingsearchlocation,
    error: errorsearchlocation,
  } = useQuery(Searching, {
    variables: {
      keyword: keyword,
      cities_id: props?.route?.params?.idcity
        ? props?.route?.params?.idcity
        : null,
      province_id: props?.route?.params?.idprovince
        ? props?.route?.params?.idprovince
        : null,
      countries_id: searcountry ? searcountry : null,
    },
    onCompleted: async () => {
      let datloop = [...datasearchlocation.searchlocation_populer];
      let hasil = [...filtershow];
      let wle = [];

      for (var ix in datloop) {
        if (
          datloop[ix].id === props?.route?.params?.idcity ||
          datloop[ix].id === props?.route?.params?.idcountries ||
          datloop[ix].id === props?.route?.params?.idprovince
        ) {
          let dat = { ...datloop[ix] };
          dat.checked = true;
          await datloop.splice(ix, 1, dat);
          await wle.push(dat);
        }
      }
      hasil = hasil.concat(wle);

      await setfiltershow(hasil);

      await setdataFilterCity(datloop);
      await setdataFilterCitys(datloop);

      // await UpdateFilter();
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
        type:
          search.type && search.type.length > 0
            ? search.type
            : props.route.params && props.route.params.idtype
            ? [props.route.params.idtype]
            : null,
        cities:
          search.cities && search.cities.length > 0
            ? search.cities
            : props.route.params && props.route.params.idcity
            ? [props.route.params.idcity]
            : null,
        countries:
          search.countries && search.countries.length > 0
            ? search.countries
            : props.route.params && props.route.params.idcountries
            ? [props.route.params.idcountries]
            : null,
        provinces:
          search.provinces && search.provinces.length > 0
            ? search.provinces
            : props.route.params && props.route.params.idprovince
            ? [props.route.params.idprovince]
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
    if (token || token !== "") {
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
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    if (token || token !== "") {
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
      Alert.alert("Please Login");
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

  const UpdateFilter = async () => {
    let data = { ...search };
    let filterz = [];

    let Categori = [];
    for (var x of dataFilterCategori) {
      if (x.checked === true) {
        Categori.push(x.id);
        filterz.push(x);
      }
    }

    let fasilitas = [];
    for (var y of dataFilterFacility) {
      if (y.checked === true) {
        fasilitas.push(y.id);
        filterz.push(y);
      }
    }

    let Countryss = [];

    let cityss = [];
    let province = [];

    for (var u of dataFilterCity) {
      if (u.checked === true) {
        if (u.type === "Province") {
          province.push(u.id);
          filterz.push(u);
        } else if (u.type === "City") {
          cityss.push(u.id);
          filterz.push(u);
        } else if (u.type === "Country") {
          Countryss.push(u.id);
          filterz.push(u);
        }
      }
    }

    data["type"] = await Categori;
    data["facilities"] = await fasilitas;
    data["countries"] = await Countryss;
    data["cities"] = await cityss;
    data["provinces"] = await province;

    await setfiltershow(filterz);
    await setSearch(data);
    await setshow(false);
  };

  const ClearAllFilter = () => {
    setSearch({
      type: [],
      keyword: null,
      countries: [],
      provinces: [],
      cities: [],
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

    let hasil = [];

    let dta = datafilter.destination_filter.type.filter(
      (item) => item.sugestion === true
    );
    hasil = hasil.concat(dta);
    let wle = datafilter.destination_filter.facility.filter(
      (item) => item.sugestion === true
    );
    hasil = hasil.concat(wle);

    setfiltershow(hasil);
  };

  const _setSearch = async (teks) => {
    let data = { ...search };

    data["keyword"] = teks;

    await setSearch(data);
  };

  const _renderFilter = ({ item, index }) => {
    if (item.checked == true) {
      return (
        <Button
          type="box"
          size="small"
          color="primary"
          text={Capital({ text: item.name })}
          onPress={() => onSelectFilter(item.checked, item.id, item)}
          style={{
            marginRight: 3,
            flexDirection: "row",
          }}
        ></Button>
      );
    } else if (item.sugestion == true || item.show == true) {
      return (
        <Button
          type="box"
          size="small"
          color="primary"
          variant="bordered"
          text={Capital({ text: item.name })}
          onPress={() => onSelectFilter(item.checked, item.id, item)}
          style={{
            marginRight: 3,
            flexDirection: "row",
          }}
        ></Button>
      );
    }
  };

  const onSelectFilter = async (ceked, id, item) => {
    let dat = [...filtershow];
    let items = { ...item };
    items["checked"] = !ceked;
    let inde = dat.findIndex((key) => key.id === id);
    await dat.splice(inde, 1, items);
    await setfiltershow(dat);

    let sear = { ...search };

    if (ceked === true) {
      if (item.__typename === "DestinationTypeResponse") {
        let indexs = sear.type.findIndex((key) => key === id);
        await sear.type.splice(indexs, 1);

        let tempe = [...dataFilterCategori];
        let inde = tempe.findIndex((key) => key.id === id);
        tempe.splice(inde, 1, items);
        await setdataFilterCategori(tempe);
        await setdataFilterCategoris(tempe);
      } else if (item.__typename === "DestinationFacilityResponse") {
        let indexs = sear.facilities.findIndex((key) => key === id);
        await sear.facilities.splice(indexs, 1);

        let tempe = [...dataFilterFacility];
        let inde = tempe.findIndex((key) => key.id === id);
        tempe.splice(inde, 1, items);
        await setdataFilterFacility(tempe);
        await setdataFilterFacilitys(tempe);
      } else if (item.__typename === "SearchLocation") {
        let indexs = sear.cities.findIndex((key) => key === id);

        if (item.type === "Country") {
          await sear.countries.splice(indexs, 1);
        } else if (item.type === "Province") {
          await sear.provinces.splice(indexs, 1);
        } else if (item.type === "City") {
          await sear.cities.splice(indexs, 1);
        }

        let tempe = [...dataFilterCity];
        let inde = tempe.findIndex((key) => key.id === id);
        tempe.splice(inde, 1, items);
        await setdataFilterCity(tempe);
        await setdataFilterCitys(tempe);
      }
    } else {
      if (item.__typename === "DestinationTypeResponse") {
        await sear.type.push(id);

        let tempe = [...dataFilterCategori];
        let inde = tempe.findIndex((key) => key.id === id);
        tempe.splice(inde, 1, items);
        await setdataFilterCategori(tempe);
        await setdataFilterCategoris(tempe);
      } else if (item.__typename === "DestinationFacilityResponse") {
        await sear.facilities.push(id);

        let tempe = [...dataFilterFacility];
        let inde = tempe.findIndex((key) => key.id === id);
        tempe.splice(inde, 1, items);
        await setdataFilterFacility(tempe);
        await setdataFilterFacilitys(tempe);
      } else if (item.__typename === "SearchLocation") {
        if (item.type === "Country") {
          await sear.countries.push(id);
        } else if (item.type === "Province") {
          await sear.provinces.push(id);
        } else if (item.type === "City") {
          await sear.cities.push(id);
        }

        let tempe = [...dataFilterCity];
        let inde = tempe.findIndex((key) => key.id === id);
        tempe.splice(inde, 1, items);
        await setdataFilterCity(tempe);
        await setdataFilterCitys(tempe);
      }
    }

    await setSearch(sear);
    await GetListDestination();
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
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "#F0F0F0",
            borderRadius: 5,
            marginVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            padding: 5,
          }}
        >
          <Search width={15} height={15} />

          <TextInput
            underlineColorAndroid="transparent"
            placeholder={t("search")}
            style={{
              width: "100%",
              // borderWidth: 1,
              padding: 0,
              marginLeft: 10,
            }}
            returnKeyType="search"
            onChangeText={(x) => _setSearch(x)}
            onSubmitEditing={(x) => _setSearch(x)}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            zIndex: 5,
            marginBottom: 10,
          }}
        >
          <Button
            size="small"
            type="icon"
            variant="bordered"
            color="primary"
            onPress={() => {
              setshow(true);
            }}
            style={{
              marginRight: 5,
              // paddingHorizontal: 10,
            }}
          >
            <FilterIcon width={15} height={15} />

            <Text
              style={{
                fontFamily: "Lato-Regular",
                color: "#0095A7",
                fontSize: 13,
                alignSelf: "center",
                marginLeft: 5,
                // marginRight: 3,
              }}
            >
              {t("filter")}
            </Text>
            {/* {dataFillter.length && Filterlenght > 0 ? (
                    <View
                        style={{
                            borderRadius: 3,
                            width: 14,
                            height: 14,
                            backgroundColor: "#0095A7",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Lato-Regular",
                                color: "white",
                                fontSize: 13,
                                alignSelf: "center",
                            }}
                        >
                            {Filterlenght}
                        </Text>
                    </View>
                ) : null} */}
          </Button>

          <FlatList
            contentContainerStyle={{
              justifyContent: "space-evenly",
              marginHorizontal: 3,
            }}
            horizontal={true}
            data={filtershow}
            renderItem={_renderFilter}
            showsHorizontalScrollIndicator={false}
          ></FlatList>
        </View>
      </View>

      <Modal
        // onLayout={() => dataCountrySelect()}
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
            backgroundColor: "white",
            // borderTopLeftRadius: 15,
            // borderTopRightRadius: 15,
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
              {/* 
              <Pressable
                onPress={() => {
                  setaktif("country");
                }}
                style={{
                  backgroundColor: "#f6f6f6",
                  paddingBottom: 5,
                }}
              >
                <View
                  style={{
                    borderLeftColor:
                      aktif === "country" ? "#209fae" : "#f6f6f6",
                    borderLeftWidth: aktif === "country" ? 5 : 0,
                    marginLeft: aktif === "country" ? 5 : 10,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: aktif === "country" ? "#ffff" : "#f6f6f6",
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
                    {t("country")}
                  </Text>
                </View>
              </Pressable> */}

              <Pressable
                onPress={() => {
                  setaktif("City");
                }}
                style={{
                  backgroundColor: "#f6f6f6",
                  paddingBottom: 5,
                }}
              >
                <View
                  style={{
                    borderLeftColor: aktif === "City" ? "#209fae" : "#f6f6f6",
                    borderLeftWidth: aktif === "City" ? 5 : 0,
                    marginLeft: aktif === "City" ? 5 : 10,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: aktif === "City" ? "#ffff" : "#f6f6f6",
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
                    {t("location")}
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
                    backgroundColor: "#daf0f2",
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
                      width: "100%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    // returnKeyType="search"
                    onChangeText={(x) => searchs(x)}
                    onSubmitEditing={(x) => searchs(x)}
                  />
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
                        onValueChange={() =>
                          _handleCheck(item["id"], index, item)
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
                        {Capital({ text: item.name })}
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
                        onValueChange={() =>
                          _handleCheckf(item["id"], index, item)
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
                        {Capital({ text: item.name })}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
                </ScrollView>
              ) : aktif === "country" ? (
                <ScrollView
                  // style={{ borderWidth: 1, height: 100 }}
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
                        {Capital({ text: item.name })}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
                </ScrollView>
              ) : aktif === "City" ? (
                <ScrollView
                  // style={{ borderWidth: 1, height: 100 }}
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
                        {Capital({ text: item.name })}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
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
                props?.route?.params && props?.route?.params?.iditinerary
                  ? props.navigation.push("DestinationUnescoDetail", {
                      id: item.id,
                      name: item.name,
                      token: token,
                      iditinerary: props.route.params.iditinerary,
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
                    {Capital({ text: item.name })}
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
                      {Capital({ text: item.cities.name })}
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
                      props.route.params && props.route.params.iditinerary
                        ? props.navigation.dispatch(
                            StackActions.replace("ItineraryStack", {
                              screen: "ItineraryChooseday",
                              params: {
                                Iditinerary: props.route.params.iditinerary,
                                Kiriman: item.id,
                                token: token,
                                Position: "destination",
                                datadayaktif: props.route.params.datadayaktif,
                              },
                            })
                          )
                        : props.navigation.push("ItineraryStack", {
                            screen: "ItineraryPlaning",
                            params: {
                              idkiriman: item.id,
                              Position: "destination",
                            },
                          });
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
    </View>
  );
}
