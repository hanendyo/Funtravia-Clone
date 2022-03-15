import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  // TouchableOpacity,
  Alert,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Capital, CardDestination } from "../../component";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  Arrowbackwhite,
  Search,
  Xhitam,
  Xblue,
  Filternewbiru,
  Arrowbackios,
} from "../../assets/svg";
import Listdestination from "../../graphQL/Query/Destination/ListDestinationV2";
import filterDestination from "../../graphQL/Query/Destination/Destinasifilter";
import Liked from "../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";
import Modal from "react-native-modal";
import CheckBox from "@react-native-community/checkbox";
import Searching from "../../graphQL/Query/Itinerary/SearchDestination";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";
import deviceInfoModule from "react-native-device-info";
import CityCursorBased from "../../graphQL/Query/Itinerary/CityCursorBased";
import Ripple from "react-native-material-ripple";
import { useDispatch, useSelector } from "react-redux";
import { setSearchDestinationInput } from "../../redux/action";

const deviceId = DeviceInfo.getModel();

export default function ItineraryDestination(props) {
  let [filtershow, setfiltershow] = useState([]);
  let [filtershowcity, setfiltershowcity] = useState([]);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const HeaderComponent = {
    headerShown: true,
    title: "Destination",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("destination")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
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
        Filter
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
  let [hasApply, setHasApply] = useState(1);
  const token = useSelector((data) => data.token);
  let [dataFilterCategori, setdataFilterCategori] = useState([]);
  let [dataFilterCategoris, setdataFilterCategoris] = useState([]);
  let [tempDataCategory, setTempDataCategory] = useState([]);
  let [dataFilterFacility, setdataFilterFacility] = useState([]);
  let [dataFilterFacilitys, setdataFilterFacilitys] = useState([]);
  let [tempDataFacility, setTempDataFacility] = useState([]);
  // let [dataFilterCountry, setdataFilterCountry] = useState([]);
  // let [dataFilterCountrys, setdataFilterCountrys] = useState([]);
  // let [tempDataCountry, setTempDataCountry] = useState([]);
  let [dataFilterCity, setdataFilterCity] = useState([]);
  let [dataFilterCitys, setdataFilterCitys] = useState([]);
  let [tempDataCity, setTempDataCity] = useState([]);
  let [dataDes, setdataDes] = useState([]);
  const Notch = deviceInfoModule.hasNotch();

  let [aktif, setaktif] = useState("categories");

  let [search, setSearch] = useState({
    type: props.route.params?.type ?? searchRdx?.type ?? [],
    keyword: searchRdx?.search_input ?? null,
    grouptype:
      props?.route?.params && props?.route?.params?.groupid
        ? [props.route.params?.groupid]
        : [],
    countries:
      props?.route?.params && props?.route?.params?.idcountries
        ? props.route.params.idcountries
        : [],
    provinces: props.route.params?.idprovince
      ? [props.route.params.idprovince]
      : [],
    cities:
      props?.route?.params && props?.route?.params?.idcity
        ? [props.route.params.idcity]
        : [],
    goodfor: [],
    facilities: [],
  });

  let [keyword, setkeyword] = useState("");

  const {
    data: datafilter,
    loading: loadingfilter,
    error: errorfilter,
    refetch: refetchFilterDestination,
  } = useQuery(filterDestination, {
    onCompleted: () => {
      if (datafilter) {
        let datloop = [...datafilter?.destination_filter?.type];
        let hasil = [...filtershow];
        let des = [];

        for (let idx in datloop) {
          if (search.type.includes(datloop[idx].id)) {
            let dat = { ...datloop[idx] };
            dat.checked = true;
            datloop.splice(idx, 1, dat);
            des.push(dat);
          }
        }
        hasil = hasil.concat(des);
        setdataFilterCategori(datloop);
        setdataFilterCategoris(datloop);
        setTempDataCategory(datloop);
        setdataFilterFacility(datafilter?.destination_filter?.facility);
        setdataFilterFacilitys(datafilter?.destination_filter?.facility);
        setTempDataFacility(datafilter?.destination_filter?.facility);
        //  setdataFilterCountry(datafilter?.destination_filter?.country);
        //  setdataFilterCountrys(datafilter?.destination_filter?.country);
        //  setTempDataCountry(datafilter?.destination_filter?.country);

        let dtat = datloop?.filter((item) => item?.sugestion === true);

        for (var datan of dtat) {
          let indx = hasil.findIndex((key) => key.id === datan.id);

          if (indx !== -1) {
            let dd = { ...datan };
            dd.checked = true;
            hasil.splice(indx, 1, dd);
          } else {
            hasil.push(datan);
          }
        }

        let dtf = datafilter?.destination_filter?.facility.filter(
          (item) => item.sugestion === true
        );

        for (var dataf of dtf) {
          let indxs = hasil.findIndex((key) => key.id === dataf.id);

          if (indxs !== -1) {
            let dds = { ...dataf };
            dds.checked = true;
            hasil.splice(indxs, 1, dds);
          } else {
            hasil.push(dataf);
          }
        }

        setfiltershow(hasil);
      }
    },
    //  Getsearch();
  });

  const {
    data: datasearchlocation,
    loading: loadingsearchlocation,
    error: errorsearchlocation,
    refetch: refetchLocation,
  } = useQuery(CityCursorBased, {
    variables: {
      keyword: search.keyword ? search.keyword : "",
      countries_id: search.countries,
      first: 520,
      after: "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    // pollInterval: 5500,
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      if (datasearchlocation) {
        let datloop = [...datasearchlocation?.city_search_cursor_based?.edges];
        let hasil = [...filtershowcity];
        let wle = [];

        for (var ix in datloop) {
          if (
            datloop[ix].node.id === props?.route?.params?.idcity
            // ||
            // datloop[ix].id === props?.route?.params?.idcountries ||
            // datloop[ix].id === props?.route?.params?.idprovince
          ) {
            let dat = { ...datloop[ix] };
            dat.checked = true;
            datloop.splice(ix, 1, dat);
            wle.push(dat);
          }
        }
        hasil = hasil.concat(wle);

        setfiltershowcity(hasil);

        setdataFilterCity(datloop);
        setdataFilterCitys(datloop);
        setTempDataCity(datloop);
        // await UpdateFilter();
      }
    },
  });

  const [
    GetListDestination,
    { data, loading: loadingDes, error },
  ] = useLazyQuery(Listdestination, {
    fetchPolicy: "network-only",
    variables: {
      keyword: search.keyword ? search.keyword : null,
      type: search.type ? search.type : null,
      grouptype:
        search.grouptype && search.grouptype.length ? search.grouptype : null,
      type: search.type && search.type.length > 0 ? search.type : null,
      cities: search.cities && search.cities.length > 0 ? search.cities : null,
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
    onCompleted: async () => {
      setdataDes(data?.destinationList_v2);
      let type = [];
      for (let dataType of data.destinationList_v2) {
        type = type.concat(dataType.destination_unique_type);
      }
    },
  });

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
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
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  const [filterResults, setfilterResults] = useState(null);
  // const [tempTotal, setTempTotal] = useState([]);

  // Count data filter checked//
  const cekData = async (data) => {
    let dat = dataFilterCategori?.filter((k) => k.checked === true);
    let datF = dataFilterFacility?.filter((k) => k.checked === true);
    let datL = dataFilterCity?.filter((k) => k.checked === true);
    // let datC = dataFilterCountry.filter((k) => k.checked === true);

    if (hasApply == 1) {
      let countallFil = dat.length + datF.length + datL.length;
      await setfilterResults(countallFil);
      setTimeout(() => {
        setHasApply(0);
      }, 1000);
    } else if (hasApply == 2) {
      let countallFil = dat.length + datF.length + datL.length;
      await setfilterResults(countallFil);
      await setHasApply(0);
    } else if (hasApply == 3) {
      let countallFil = dat.length + datF.length + datL.length;
      await setfilterResults(countallFil);
      await setHasApply(0);
    }
    // + datC.length;
  };

  useEffect(() => {
    cekData();
  }, [
    dataFilterCategori,
    dataFilterFacility,
    dataFilterCity,
    // dataFilterCountry,
  ]);

  // useEffect(() => {
  //   dispatch(
  //     setSearchDestinationInput({
  //       search_input: search.keyword,
  //       type: search.type,
  //     })
  //   );
  // }, [search]);

  const searchRdx = useSelector((data) => data.searchDestinationInput);

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

  // close modal tanpa apply
  useEffect(() => {
    if (!show && dataFilterCategoris?.length != 0) {
      setdataFilterCategori(tempDataCategory);
      setdataFilterCategoris(tempDataCategory);
    }
    searchCategory("");
    setSearchTextCategory("");

    if (!show && dataFilterFacilitys?.length != 0) {
      setdataFilterFacility(tempDataFacility);
      setdataFilterFacilitys(tempDataFacility);
    }
    searchFacility("");
    setSearchTextFacility("");

    if (!show && dataFilterCitys?.length != 0) {
      setdataFilterCity(tempDataCity);
      setdataFilterCitys(tempDataCity);
    }
    searchLocation("");
    setSearchTextLocation("");

    // if (!show && dataFilterCountrys.length != 0) {
    //   setdataFilterCountry(tempDataCountry);
    //   setdataFilterCountrys(tempDataCountry);
    // }
  }, [show]);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      GetListDestination();
      refetchLocation();
      refetchFilterDestination();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [searchText, setSearchText] = useState("");
  const [searchTextCategory, setSearchTextCategory] = useState("");
  const [searchTextFacility, setSearchTextFacility] = useState("");
  const [searchTextLocation, setSearchTextLocation] = useState("");

  const searchCategory = async (teks) => {
    setkeyword(teks);
    let searching = new RegExp(teks, "i");
    if (searching != `/(?:)/i`) {
      let categori = dataFilterCategori?.filter((item) =>
        searching.test(item.name)
      );
      await setdataFilterCategoris(categori);
    } else {
      await setdataFilterCategoris(dataFilterCategori);
    }
  };

  const searchFacility = async (teks) => {
    setkeyword(teks);
    let searching = new RegExp(teks, "i");
    if (searching != `/(?:)/i`) {
      let facility = dataFilterFacility?.filter((item) =>
        searching.test(item.name)
      );
      setdataFilterFacilitys(facility);
    } else {
      setdataFilterFacilitys(dataFilterFacility);
    }
  };

  const searchLocation = async (teks) => {
    setkeyword(teks);
    let searching = new RegExp(teks, "i");
    if (searching != `/(?:)/i`) {
      let cities = dataFilterCity?.filter((item) =>
        searching.test(item.node.name)
      );
      await setdataFilterCitys(cities);
    } else {
      await setdataFilterCitys(dataFilterCity);
    }

    // let countries = dataFilterCountry.filter((item) =>
    //   searching.test(item.name)
    // );
    // setdataFilterCountrys(countries);
  };

  const _handleCheck = async (id, index, item) => {
    let tempCategori = [...dataFilterCategori];
    let tempCategoris = [...dataFilterCategoris];
    let items = { ...item };
    items.checked = !items.checked;
    let indexCategori = tempCategori.findIndex((key) => key.id === id);
    let indexCategoris = tempCategoris.findIndex((key) => key.id === id);
    tempCategori.splice(indexCategori, 1, items);
    tempCategoris.splice(indexCategoris, 1, items);
    await setdataFilterCategori(tempCategori);
    await setdataFilterCategoris(tempCategoris);
  };

  const _handleCheckf = async (id, index, item) => {
    let tempFacility = [...dataFilterFacility];
    let tempFacilitys = [...dataFilterFacilitys];
    let items = { ...item };
    items.checked = !items.checked;
    let indexFacility = tempFacility.findIndex((key) => key.id === id);
    let indexFacilitys = tempFacilitys.findIndex((key) => key.id === id);
    tempFacility.splice(indexFacility, 1, items);
    tempFacilitys.splice(indexFacilitys, 1, items);
    await setdataFilterFacility(tempFacility);
    await setdataFilterFacilitys(tempFacilitys);
  };

  // const _handleCheckC = async (id, index, item) => {
  //   let tempe = [...datafilter?.destination_filter?.country];
  //   let items = { ...item };
  //   items.checked = true;

  //   let inde = tempe.findIndex((key) => key.id === id);
  //   tempe.splice(inde, 1, items);
  //   setsearcountry(items.id);
  //   await setdataFilterCountry(tempe);
  //   await setdataFilterCountrys(tempe);
  // };

  const _handleCheckCity = async (id, index, item) => {
    dataFilterCity = dataFilterCity ? dataFilterCity : [];
    dataFilterCitys = dataFilterCitys ? dataFilterCitys : [];
    let tempCitys = [...dataFilterCitys];
    let tempCity = [...dataFilterCity];
    let items = { ...item };
    items.checked = !items.checked;
    let indexCitys = tempCitys.findIndex((key) => key.node.id === id);
    let indexCity = tempCity.findIndex((key) => key.node.id === id);
    tempCity.splice(indexCity, 1, items);
    tempCitys.splice(indexCitys, 1, items);
    setdataFilterCity(tempCity);
    setdataFilterCitys(tempCitys);
  };

  const UpdateFilter = async () => {
    let data = { ...search };
    let filterz = [];
    let filterd = [];
    let Categori = [];
    let tempCategory = [];
    let fasilitas = [];
    let tempFasilitas = [];
    let Countryss = [];
    let tempCountry = [];
    let cityss = [];
    let tempCity = [];
    let province = [];

    for (var x of dataFilterCategori) {
      if (x.checked === true) {
        Categori.push(x.id);
        filterz.push(x);
      }
    }
    for (var x of dataFilterCategori) {
      tempCategory.push(x);
    }

    for (var y of dataFilterFacility) {
      if (y.checked === true) {
        fasilitas.push(y.id);
        filterz.push(y);
      }
    }
    for (var y of dataFilterFacility) {
      tempFasilitas.push(y);
    }

    // for (var c of dataFilterCity) {
    //   if (c.checked === true && c.type == "Country") {
    //     Countryss.push(c.id);
    //     filterz.push(c);
    //   }
    // }

    // for (var c of dataFilterCity) {
    //   tempCountry.push(c);
    // }

    for (var ci of dataFilterCity) {
      if (ci.checked === true && ci.__typename == "CitiesEdge") {
        cityss.push(ci.node.id);
        filterz.push(ci);
      }
    }

    for (var ci of dataFilterCity) {
      tempCity.push(ci);
    }

    // filterd = await filterd.concat(Countryss);
    // let cityss = dataFilterCity.filter(
    //   (fasc) => fasc.type === "location" && fasc.checked === true
    // );

    // for (var pr of dataFilterCity) {
    //   if (pr.checked === true && pr.type == "Province") {
    //     province.push(pr.id);
    //     filterz.push(pr);
    //   }
    // }

    // filterd = await filterd.concat(cityss);
    // let province = dataFilterCity.filter(
    //   (fasd) => fasd.type === "Province" && fasd.checked === true
    // );

    // filterd = await filterd.concat(province);

    data["type"] = await Categori;
    data["facilities"] = await fasilitas;
    data["countries"] = await Countryss;
    data["cities"] = await cityss;
    data["provinces"] = await province;

    await setTempDataCategory(tempCategory);
    await setTempDataFacility(tempFasilitas);
    // await setTempDataCountry(tempCountry);
    await setTempDataCity(tempCity);
    await setfiltershow(filterz);
    await setfiltershowcity(filterz);
    await cekData();
    await setSearch(data);
    await setshow(false);
    await GetListDestination();
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
      type: [],
      grouptype: [],
    });
    setdataFilterCategori(datafilter?.destination_filter?.type);
    setdataFilterCategoris(datafilter?.destination_filter?.type);
    setTempDataCategory(datafilter?.destination_filter?.type);
    setdataFilterFacility(datafilter?.destination_filter?.facility);
    setdataFilterFacilitys(datafilter?.destination_filter?.facility);
    setTempDataFacility(datafilter?.destination_filter?.facility);
    //  setdataFilterCountry(datafilter?.destination_filter?.country);
    //  setdataFilterCountrys(datafilter?.destination_filter?.country);
    //  setTempDataCountry(datafilter?.destination_filter?.country);

    dataFilterCity = dataFilterCity ? dataFilterCity : [];
    let tempe = [...dataFilterCity];
    let tempes = [];
    for (var x of tempe) {
      let data = { ...x };
      data.checked = false;
      tempes.push(data);
    }

    setdataFilterCity(tempes);
    setdataFilterCitys(tempes);
    setTempDataCity(tempes);

    let hasil = [];

    let dta = datafilter?.destination_filter?.type.filter(
      (item) => item.sugestion === true
    );
    hasil = hasil.concat(dta);
    let wle = datafilter?.destination_filter?.facility.filter(
      (item) => item.sugestion === true
    );
    hasil = hasil.concat(wle);

    setfiltershow(hasil);
    cekData();
    setshow(false);
  };

  const _setSearch = async (teks) => {
    let data = { ...search };

    data["keyword"] = teks;

    await setSearch(data);
  };

  // const _renderFilter = ({ item, index }) => {
  //   if (item.checked == true) {
  //     return (
  //       <Button
  //         type="box"
  //         size="small"
  //         color="primary"
  //         text={Capital({ text: item.name })}
  //         onPress={() => onSelectFilter(item.checked, item.id, item)}
  //         style={{
  //           marginRight: 3,
  //           flexDirection: "row",
  //         }}
  //       ></Button>
  //     );
  //   } else if (item.sugestion == true || item.show == true) {
  //     return (
  //       <Button
  //         type="box"
  //         size="small"
  //         color="primary"
  //         variant="bordered"
  //         text={Capital({ text: item.name })}
  //         onPress={() => onSelectFilter(item.checked, item.id, item)}
  //         style={{
  //           marginRight: 3,
  //           flexDirection: "row",
  //         }}
  //       ></Button>
  //     );
  //   }
  // };

  // const onSelectFilter = async (ceked, id, item) => {
  //   // let dat = filtershow.concat(filtershowcity);
  //   let showq = [...filtershow];
  //   let showc = [...filtershowcity];
  //   let items = { ...item };
  //   items["checked"] = !ceked;

  //   if (item.__typename === "SearchLocation") {
  //     let indek = showc.findIndex((key) => key.id === id);
  //     if (indek !== -1) {
  //       await showc.splice(indek, 1, items);
  //       await setfiltershowcity(showc);
  //     }
  //   } else {
  //     let inde = showq.findIndex((key) => key.id === id);
  //     if (inde !== -1) {
  //       await showq.splice(inde, 1, items);
  //       await setfiltershow(showq);
  //     }
  //   }

  //   let sear = { ...search };

  //   if (ceked === true) {
  //     if (item.__typename === "DestinationTypeResponse") {
  //       let indexs = sear.type.findIndex((key) => key === id);
  //       await sear.type.splice(indexs, 1);

  //       let tempe = [...dataFilterCategori];
  //       let inde = tempe.findIndex((key) => key.id === id);
  //       tempe.splice(inde, 1, items);
  //       await setdataFilterCategori(tempe);
  //       await setdataFilterCategoris(tempe);
  //     } else if (item.__typename === "DestinationFacilityResponse") {
  //       let indexs = sear.facilities.findIndex((key) => key === id);
  //       await sear.facilities.splice(indexs, 1);

  //       let tempe = [...dataFilterFacility];
  //       let inde = tempe.findIndex((key) => key.id === id);
  //       tempe.splice(inde, 1, items);
  //       await setdataFilterFacility(tempe);
  //       await setdataFilterFacilitys(tempe);
  //     } else if (item.__typename === "SearchLocation") {
  //       let indexs = sear.cities.findIndex((key) => key === id);

  //       if (item.type === "Country") {
  //         await sear.countries.splice(indexs, 1);
  //       } else if (item.type === "Province") {
  //         await sear.provinces.splice(indexs, 1);
  //       } else if (item.type === "location") {
  //         await sear.cities.splice(indexs, 1);
  //       }

  //       let tempe = [...dataFilterCity];
  //       let inde = tempe.findIndex((key) => key.id === id);
  //       tempe.splice(inde, 1, items);
  //       await setdataFilterCity(tempe);
  //       await setdataFilterCitys(tempe);
  //     }
  //   } else {
  //     if (item.__typename === "DestinationTypeResponse") {
  //       await sear.type.push(id);

  //       let tempe = [...dataFilterCategori];
  //       let inde = tempe.findIndex((key) => key.id === id);
  //       tempe.splice(inde, 1, items);
  //       await setdataFilterCategori(tempe);
  //       await setdataFilterCategoris(tempe);
  //     } else if (item.__typename === "DestinationFacilityResponse") {
  //       await sear.facilities.push(id);

  //       let tempe = [...dataFilterFacility];
  //       let inde = tempe.findIndex((key) => key.id === id);
  //       tempe.splice(inde, 1, items);
  //       await setdataFilterFacility(tempe);
  //       await setdataFilterFacilitys(tempe);
  //     } else if (item.__typename === "SearchLocation") {
  //       if (item.type === "Country") {
  //         await sear.countries.push(id);
  //       } else if (item.type === "Province") {
  //         await sear.provinces.push(id);
  //       } else if (item.type === "location") {
  //         await sear.cities.push(id);
  //       }

  //       let tempe = [...dataFilterCity];
  //       let inde = tempe.findIndex((key) => key.id === id);
  //       tempe.splice(inde, 1, items);
  //       await setdataFilterCity(tempe);
  //       await setdataFilterCitys(tempe);
  //     }
  //   }

  //   await setSearch(sear);
  //   await GetListDestination();
  // };

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,

        shadowColor: "#d3d3d3",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 3,
        marginBottom: 80,
      }}
    >
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,

          backgroundColor: "#FFFFFF",
          // borderWidth: 1,
          height: 50,
          zIndex: 5,
          flexDirection: "row",
          width: Dimensions.get("screen").width,
        }}
      >
        <Pressable
          onPress={() => {
            setshow(true);
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

          {filterResults > 0 ? (
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
                {filterResults}
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
          <Search width={15} height={15} style={{ marginRight: 5 }} />

          <TextInput
            underlineColorAndroid="transparent"
            placeholder={t("search")}
            autoCorrect={false}
            style={{
              width: "85%",
              marginLeft: 5,
              padding: 0,
            }}
            returnKeyType="search"
            placeholderTextColor="#464646"
            onChangeText={(x) => {
              _setSearch(x), setSearchText(x);
            }}
            onSubmitEditing={(x) => {
              _setSearch(x), setSearchText(x);
            }}
            value={searchText}
          />
          {searchText.length ? (
            <TouchableOpacity
              onPress={() => {
                _setSearch(""), setSearchText("");
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
      {/* modal filter */}

      {dataDes.length > 0 ? (
        <CardDestination
          data={dataDes}
          props={props}
          setData={(e) => setdataDes(e)}
          token={token}
          dataFrom="destination_list"
          dataFromId={
            props.route.params?.data_from_id
              ? props.route.params.data_from_id
              : null
          }
        />
      ) : (
        <View style={{ marginTop: 15 }}>
          {loadingDes ? (
            <ActivityIndicator color="#209FAE" size="small" />
          ) : (
            <View style={{ alignSelf: "center" }}>
              <Text>{t("noData")}</Text>
            </View>
          )}
        </View>
      )}

      <Modal
        onBackdropPress={() => {
          setshow(false);
        }}
        onRequestClose={() => setshow(false)}
        onDismiss={() => setshow(false)}
        avoidKeyboard={true}
        isVisible={show}
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
          {/* bagian atas */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 15,
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
                height: 20,
                width: 32,
                top: 0,
                right: 0,
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-start",
                zIndex: 999,
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

              <Pressable
                onPress={() => {
                  setaktif("location");
                }}
                style={{
                  backgroundColor: "#f6f6f6",
                  paddingBottom: 5,
                }}
              >
                <View
                  style={{
                    borderLeftColor:
                      aktif === "location" ? "#209fae" : "#f6f6f6",
                    borderLeftWidth: aktif === "location" ? 5 : 0,
                    marginLeft: aktif === "location" ? 5 : 10,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: aktif === "location" ? "#ffff" : "#f6f6f6",
                  }}
                >
                  <Text
                    type="bold"
                    size="title"
                    style={{
                      color: "#464646",
                    }}
                  >
                    {t("location")}
                  </Text>
                </View>
              </Pressable>
            </View>
            {/* kanan................................................................ */}
            <View style={{ flex: 1 }}>
              {/* <View
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
                    underlineColorAndroid="transparent"
                    placeholder={t("search")}
                    autoCorrect={false}
                    Text={keyword}
                    style={{
                      width: "80%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    // returnKeyType="search"
                    value={
                      aktif == "categories"
                        ? searchTextCategory
                        : aktif == "fasilities"
                        ? searchTextFacility
                        : aktif == "location"
                        ? searchTextLocation
                        : null
                    }
                    placeholderTextColor="#464646"
                    onChangeText={(x) => {
                      aktif == "categories"
                        ? searchCategory(x)
                        : aktif == "fasilities"
                        ? searchFacility(x)
                        : aktif == "location"
                        ? searchLocation(x)
                        : null;

                      aktif == "categories"
                        ? setSearchTextCategory(x)
                        : aktif == "fasilities"
                        ? setSearchTextFacility(x)
                        : aktif == "location"
                        ? setSearchTextLocation(x)
                        : null;
                    }}
                    onSubmitEditing={(x) => {
                      aktif == "categories"
                        ? searchCategory(x)
                        : aktif == "fasilities"
                        ? searchFacility(x)
                        : aktif == "location"
                        ? searchLocation(x)
                        : null;

                      aktif == "categories"
                        ? setSearchTextCategory(x)
                        : aktif == "fasilities"
                        ? setSearchTextFacility(x)
                        : aktif == "location"
                        ? setSearchTextLocation(x)
                        : null;
                    }}
                  />

                  {searchTextLocation.length ? (
                    <TouchableOpacity
                      onPress={() => {
                        aktif == "categories"
                          ? searchCategory("")
                          : aktif == "fasilities"
                          ? searchFacility("")
                          : aktif == "location"
                          ? searchLocation("")
                          : null;

                        aktif == "categories"
                          ? setSearchTextCategory("")
                          : aktif == "fasilities"
                          ? setSearchTextFacility("")
                          : aktif == "location"
                          ? setSearchTextLocation("")
                          : null;
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
              </View> */}

              {/* : aktif === "facilities" && !dataFilterFacilitys.length ? (
                <Text style={{ alignSelf: "center" }}>{t("noData")}</Text>
              ) : // : aktif === "country" && !dataFilterCountrys.length ? (
              //   <Text style={{ alignSelf: "center" }}>{t("noData")}</Text>
              // )
              aktif === "location" && !dataFilterCitys.length ? (
                <Text style={{ alignSelf: "center" }}>{t("noData")}</Text>
              ) : null} */}

              {aktif === "categories" ? (
                <>
                  <View
                    style={{
                      padding: 15,
                    }}
                  >
                    <View
                      style={{
                        height: 35,
                        width: "100%",
                        backgroundColor: "#f6f6f6",
                        borderRadius: 2,
                        alignItems: "center",
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: "#e8e8e8",
                      }}
                    >
                      <Search
                        width={15}
                        height={15}
                        style={{ marginRight: 5 }}
                      />

                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={t("search")}
                        autoCorrect={false}
                        Text={keyword}
                        style={{
                          width: "80%",
                          // borderWidth: 1,
                          marginLeft: 5,
                          padding: 0,
                        }}
                        // returnKeyType="search"
                        value={searchTextCategory}
                        placeholderTextColor="#464646"
                        onChangeText={(x) => {
                          searchCategory(x);
                          setSearchTextCategory(x);
                        }}
                        onSubmitEditing={(x) => {
                          searchCategory(x);
                          setSearchTextCategory(x);
                        }}
                      />
                      {searchTextCategory.length ? (
                        <TouchableOpacity
                          onPress={() => {
                            searchCategory("");
                            setSearchTextCategory("");
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

                  <ScrollView
                    // style={{ borderWidth: 1, height: 100 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 15,
                    }}
                  >
                    {dataFilterCategoris?.map((item, index) => (
                      <TouchableOpacity
                        key={index + `bruh`}
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
                          animationDuration={0}
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
                          onValueChange={() =>
                            _handleCheck(item["id"], index, item)
                          }
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
                    {aktif === "categories" && !dataFilterCategoris?.length ? (
                      <Text style={{ alignSelf: "center" }}>{t("noData")}</Text>
                    ) : null}

                    {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
                  </ScrollView>
                </>
              ) : aktif === "facilities" ? (
                <>
                  <View
                    style={{
                      padding: 15,
                    }}
                  >
                    <View
                      style={{
                        height: 35,
                        width: "100%",
                        backgroundColor: "#f6f6f6",
                        borderRadius: 2,
                        alignItems: "center",
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: "#e8e8e8",
                      }}
                    >
                      <Search
                        width={15}
                        height={15}
                        style={{ marginRight: 5 }}
                      />

                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={t("search")}
                        autoCorrect={false}
                        Text={keyword}
                        style={{
                          width: "80%",
                          // borderWidth: 1,
                          marginLeft: 5,
                          padding: 0,
                        }}
                        // returnKeyType="search"
                        value={searchTextFacility}
                        placeholderTextColor="#464646"
                        onChangeText={(x) => {
                          searchFacility(x);
                          setSearchTextFacility(x);
                        }}
                        onSubmitEditing={(x) => {
                          searchFacility(x);
                          setSearchTextFacility(x);
                        }}
                      />
                      {searchTextFacility.length ? (
                        <TouchableOpacity
                          onPress={() => {
                            searchFacility("");
                            setSearchTextFacility("");
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
                  <ScrollView
                    // style={{ borderWidth: 1, height: 100 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 15,
                    }}
                  >
                    {dataFilterFacilitys?.map((item, index) => (
                      <TouchableOpacity
                        key={item.id}
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
                          animationDuration={0}
                          offAnimationType="flat"
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
                          //     : _handleCheckf(item["id"], index, item)
                          // }
                          value={item["checked"]}
                          onValueChange={() =>
                            _handleCheckf(item["id"], index, item)
                          }
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
                    {aktif === "facilities" && !dataFilterFacilitys?.length ? (
                      <Text style={{ alignSelf: "center" }}>{t("noData")}</Text>
                    ) : null}
                    {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
                  </ScrollView>
                </>
              ) : //   : aktif === "country" ? (
              //     <ScrollView
              //       // style={{ borderWidth: 1, height: 100 }}
              //       nestedScrollEnabled={true}
              //       showsVerticalScrollIndicator={false}
              //       contentContainerStyle={{
              //         paddingHorizontal: 15,
              //       }}
              //     >
              //       {dataFilterCountrys.map((item, index) => (
              //         <TouchableOpacity
              //           onPress={() => _handleCheckC(item["id"], index, item)}
              //           style={{
              //             flexDirection: "row",
              //             backgroundColor: "white",
              //             // borderColor: "#464646",
              //             width: "49%",
              //             marginRight: 3,
              //             marginBottom: 20,
              //             justifyContent: "flex-start",
              //             alignContent: "center",
              //             alignItems: "center",
              //           }}
              //         >
              //           <CheckBox
              //             onCheckColor="#FFF"
              //             animationDuration={0}
              //             lineWidth={4}
              //             onFillColor="#209FAE"
              //             onTintColor="#209FAE"
              //             boxType={"square"}
              //             style={{
              //               alignSelf: "center",
              //               width: Platform.select({
              //                 ios: 30,
              //                 android: 35,
              //               }),
              //               transform: Platform.select({
              //                 ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              //                 android: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
              //               }),
              //             }}
              //             onValueChange={() =>
              //               Platform.OS == "ios"
              //                 ? null
              //                 : _handleCheckC(item["id"], index, item)
              //             }
              //             value={item["checked"]}
              //           />

              //           <Text
              //             size="label"
              //             type="regular"
              //             style={{
              //               marginLeft: 0,
              //               color: "#464646",
              //               // borderWidth: 5,
              //             }}
              //           >
              //             {Capital({ text: item.name })}
              //           </Text>
              //         </TouchableOpacity>
              //       ))}

              //       {/* <View
              //   style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
              // ></View> */}
              //     </ScrollView>
              //   )
              aktif === "location" ? (
                <>
                  <View
                    style={{
                      padding: 15,
                    }}
                  >
                    <View
                      style={{
                        height: 35,
                        width: "100%",
                        backgroundColor: "#f6f6f6",
                        borderRadius: 2,
                        alignItems: "center",
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: "#e8e8e8",
                      }}
                    >
                      <Search
                        width={15}
                        height={15}
                        style={{ marginRight: 5 }}
                      />

                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={t("search")}
                        autoCorrect={false}
                        Text={keyword}
                        style={{
                          width: "80%",
                          // borderWidth: 1,
                          marginLeft: 5,
                          padding: 0,
                        }}
                        // returnKeyType="search"
                        value={searchTextLocation}
                        placeholderTextColor="#464646"
                        onChangeText={(x) => {
                          searchLocation(x);
                          setSearchTextLocation(x);
                        }}
                        onSubmitEditing={(x) => {
                          searchLocation(x);
                          // setSearchTextLocation(x);
                        }}
                      />
                      {searchTextLocation.length ? (
                        <TouchableOpacity
                          onPress={() => {
                            searchLocation("");
                            setSearchTextLocation("");
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
                  {/* <ScrollView
                    // style={{ borderWidth: 1, height: 100 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 15,
                    }}
                  >
                    {dataFilterCitys?.map((item, index) => (
                      <TouchableOpacity
                        key={index + "bruh"}
                        onPress={() =>
                          _handleCheckCity(item.node.id, index, item)
                        }
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
                          lineWidth={4}
                          animationDuration={0}
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
                          //     : _handleCheckCity(item.node.id, index, item.node)
                          // }
                          // onValueChange={() =>
                          //   _handleCheckCity(item.node.id, index, item)
                          // }
                          // onSubmitEditing={() =>
                          //   _handleCheckCity(item.node.id, index, item)
                          // }
                          value={item?.checked}
                          onValueChange={() =>
                            _handleCheckCity(item.node.id, index, item)
                          }
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
                          {Capital({ text: item.node.name })}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {aktif === "location" && !dataFilterCitys.length ? (
                      <Text style={{ alignSelf: "center" }}>{t("noData")}</Text>
                    ) : null}
                  </ScrollView> */}

                  {/* FLATLIST */}
                  {dataFilterCitys && dataFilterCitys.length > 0 ? (
                    <>
                      <FlatList
                        // ref={slider}
                        // getItemLayout={(data, index) => ({
                        //   length: normalize(50),
                        //   offset: normalize(50),
                        //   index,
                        // })}
                        showsVerticalScrollIndicator={false}
                        data={dataFilterCitys}
                        renderItem={({ item, index }) => (
                          <Ripple
                            key={index + Math.floor(Math.random() * 1.2)}
                            // onLayout={(e) => setRippleHeight(e.nativeEvent.layout.height)}
                            onPress={() =>
                              _handleCheckCity(item.node.id, index, item)
                            }
                            style={{
                              flexDirection: "row",
                              backgroundColor: "white",
                              // borderColor: "#464646",
                              width: "49%",
                              marginLeft: 15,
                              marginBottom: 20,
                              justifyContent: "flex-start",
                              alignContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CheckBox
                              onCheckColor="#FFF"
                              lineWidth={4}
                              animationDuration={0}
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
                              //     : _handleCheckCity(item.node.id, index, item.node)
                              // }
                              // onValueChange={() =>
                              //   _handleCheckCity(item.node.id, index, item)
                              // }
                              // onSubmitEditing={() =>
                              //   _handleCheckCity(item.node.id, index, item)
                              // }
                              value={item?.checked}
                              onValueChange={() =>
                                _handleCheckCity(item.node.id, index, item)
                              }
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
                              {Capital({ text: item.node.name })}
                            </Text>
                          </Ripple>
                        )}
                        keyExtractor={(item) => item.node.id}
                        // initialNumToRender={15}
                        // onEndReachedThreshold={1}
                        // onEndReached={handleOnEndReached}
                        // ListFooterComponent={
                        //   loadingcity ? (
                        //     <View
                        //       style={{
                        //         // position: "absolute",
                        //         // bottom: 0,
                        //         // height: 20,
                        //         width: Dimensions.get("screen").width,
                        //         justifyContent: "center",
                        //         alignItems: "center",
                        //         marginTop: 30,
                        //       }}
                        //     >
                        //       <ActivityIndicator
                        //         animating={loadingcity}
                        //         size="large"
                        //         color="#209fae"
                        //       />
                        //     </View>
                        //   ) : null
                        // }
                      />
                    </>
                  ) : (
                    <View style={{ alignSelf: "center" }}>
                      <Text>{t("noData")}</Text>
                    </View>
                  )}
                </>
              ) : null}
            </View>
          </View>
          {/* bagian bawah */}
          <View
            style={{
              // borderWidth: 1,
              height: Platform.OS === "ios" ? (Notch ? 70 : 50) : 50,
              width: Dimensions.get("screen").width,
              backgroundColor: "#fff",
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingTop: 5,
              // paddingBottom: 10,
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#f6f6f6",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Button
              variant="bordered"
              color="secondary"
              onPress={() => {
                setHasApply(3);
                ClearAllFilter();
              }}
              style={{ width: "30%", borderColor: "#ffff" }}
              text={t("clearAll")}
            ></Button>
            <Button
              onPress={() => {
                UpdateFilter();
                setHasApply(2);
              }}
              style={{ width: "65%" }}
              text={t("apply")}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
