import React, { useState, useEffect } from "react";
import {
  View,
  // Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { Capital, CustomImage } from "../../../component";
import { filter_blue2, search_button } from "../../../assets/png";
import FillterModal from "./FillterModal";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import { useLazyQuery } from "@apollo/client";
import Getcity from "../../../graphQL/Query/Destination/Getcityfilter";
import { Google } from "../../../assets/svg";

export default function Fillter({
  type,
  country,
  sendBack,
  props,
  token,
  datadayaktif,
  dataDes,
  lat,
  long,
}) {
  const { t, i18n } = useTranslation();
  let [selected] = useState(new Map());
  let [search, setSearch] = useState(null);
  let [dataFillter, setdataFillter] = useState(type);
  let [datacountry, setdatacountry] = useState(country);
  let [Filterlenght, setfilterlenght] = useState(0);
  let [modal, setModal] = useState(false);
  let [id_country, setId_country] = useState(null);

  const [
    Getcityfilter,
    { data: datacity, loading: loadingcity, error: errorcity },
  ] = useLazyQuery(Getcity, {
    fetchPolicy: "network-only",
    variables: {
      country_id: id_country,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    },
  });

  const getDatacity = async (id) => {
    await setId_country(id);
    await Getcityfilter();
  };

  const compare = (a, b) => {
    return b.checked - a.checked;
  };

  const modalTogle = () => {
    setModal(!modal);
  };

  const _setSearch = (x) => {
    // console.log(x);
    let tempData = [];
    for (let i of dataFillter) {
      i.checked ? tempData.push(i.id) : null;
    }
    sendBack({ type: null, tag: tempData, keyword: search });
    setSearch(search);
  };

  const onSelectFilter = (status, id) => {
    const tempDataPg = [...dataFillter];
    let index = tempDataPg.findIndex((x) => x.id === id);
    tempDataPg[index]["checked"] = !status;
    tempDataPg[index]["show"] = true;
    sendBackData(tempDataPg);
    hitungfilter();
  };

  const sendBackData = (data) => {
    // console.log(data);
    let temptag = [];
    let tempcity = [];
    let tempcountry = [];
    for (let i of data) {
      if (i.__typename == "EventTypeResponse") {
        i.checked ? temptag.push(i.id) : null;
      }
      if (i.__typename == "CityFitlterResponse") {
        i.checked ? tempcity.push(i.id) : null;
      }
      if (i.__typename == "DestinationCountryResponse") {
        i.checked ? tempcountry.push(i.id) : null;
      }
    }
    sendBack({
      type: null,
      tag: temptag,
      city: tempcity,
      keyword: search,
      country: tempcountry,
    });
    setdataFillter(data);
  };

  const hitungfilter = () => {
    let jml = 0;
    for (var i of dataFillter) {
      if (i.checked == true) {
        jml++;
      }
    }
    setfilterlenght(jml);
  };

  const _renderFilter = ({ item, index }) => {
    // console.log(item);
    if (item.checked == true) {
      return (
        <Button
          type="box"
          size="small"
          color="primary"
          text={Capital({ text: item.name })}
          onPress={() => onSelectFilter(item.checked, item.id)}
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
          onPress={() => onSelectFilter(item.checked, item.id)}
          style={{
            marginRight: 3,
            flexDirection: "row",
          }}
        ></Button>
      );
    }
  };

  return (
    <SafeAreaView>
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
            padding: 10,
            height: 50,
            zIndex: 5,
            flexDirection: "row",
            width: Dimensions.get("screen").width,
          }}
        >
          <View
            style={{
              backgroundColor: "#F0F0F0",
              borderRadius: 5,
              width: "69%",
              height: 40,
              // flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <CustomImage
                source={search_button}
                customImageStyle={{ resizeMode: "cover" }}
                customStyle={{
                  height: 15,
                  width: 15,
                  alignSelf: "center",
                  zIndex: 100,
                  marginHorizontal: 5,
                }}
              />
            </View>

            <TextInput
              underlineColorAndroid="transparent"
              placeholder={t("search")}
              style={{
                width: "100%",
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
              onChangeText={(text) => _setSearch(text)}
            />
          </View>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              borderWidth: 1,
              width: "30%",
              borderColor: "#F0F0F0",
              height: 40,
              alignItems: "flex-start",
              justifyContent: "center",
              // flex: 1,
            }}
          >
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
                height: "100%",
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Google height={15} width={15} />
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "#646464",
                }}
              >
                {t("search")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            zIndex: 5,
            marginHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <Button
            size="small"
            type="icon"
            variant="bordered"
            color="primary"
            onPress={() => {
              modalTogle();
            }}
            style={{
              marginRight: 5,
              // paddingHorizontal: 10,
            }}
          >
            <CustomImage
              customStyle={{
                width: 14,
                height: 14,
                alignSelf: "center",
                marginRight: 5,
              }}
              customImageStyle={{ resizeMode: "contain" }}
              source={filter_blue2}
            />
            <Text
              style={{
                fontFamily: "Lato-Regular",
                color: "#0095A7",
                fontSize: 13,
                alignSelf: "center",
                marginRight: 3,
              }}
            >
              {t("filter")}
            </Text>
            {dataFillter.length && Filterlenght > 0 ? (
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
            ) : null}
          </Button>

          <FlatList
            contentContainerStyle={{
              justifyContent: "space-evenly",
              marginHorizontal: 3,
            }}
            horizontal={true}
            data={dataFillter.sort(compare)}
            renderItem={_renderFilter}
            showsHorizontalScrollIndicator={false}
            extraData={selected}
          ></FlatList>
        </View>
      </View>
      <FillterModal
        props={props}
        show={modal}
        setClose={() => setModal(!modal)}
        datasfilter={dataFillter}
        datascountry={datacountry}
        setValueFilter={(e) => sendBackData(e)}
        setJmlFilter={(y) => setfilterlenght(y)}
        getDatacity={(id) => {
          getDatacity(id);
        }}
        datacity={datacity}
      />
    </SafeAreaView>
  );
}

