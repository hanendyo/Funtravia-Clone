import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  FlatList,
  SafeAreaView,
} from "react-native";
import { CustomImage } from "../../../component";
import { filter_blue2, search_button } from "../../../assets/png";
import FillterModal from "./FillterModal";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import { Filternewbiru, Search } from "../../../assets/svg";

export default function Fillter({ fillter, sendBack }) {
  const { t, i18n } = useTranslation();
  let [selected] = useState(new Map());
  let [search, setSearch] = useState(null);
  let [dataFillter, setdataFillter] = useState([...fillter]);
  let [Filterlenght, setfilterlenght] = useState(0);
  let [modal, setModal] = useState(false);
  const compare = (a, b) => {
    return b.checked - a.checked;
  };

  const modalTogle = () => {
    setModal(!modal);
  };

  const _setSearch = async (x) => {
    // console.log(x);
    let tempData = [];
    for (let i of dataFillter) {
      i.checked ? tempData.push(i.id) : null;
    }
    await setSearch(x);
    await sendBack({ type: null, tag: tempData, keyword: search });
  };

  const onSelectFilter = (status, id) => {
    const tempDataPg = [...dataFillter];
    let index = tempDataPg.findIndex((x) => x.id === id);
    tempDataPg[index]["checked"] = !status;
    tempDataPg[index]["show"] = true;
    sendBackData(tempDataPg);
    hitungfilter();
  };

  console.log("data", dataFillter);

  //count data filter
  const cekData = (data) => {
    let dat = dataFillter.filter((k) => k.checked === true);

    return dat.length;
  };

  const sendBackData = (data) => {
    // console.log(data);
    let tempData = [];
    for (let i of data) {
      i.checked ? tempData.push(i.id) : null;
    }
    sendBack({ type: null, tag: tempData, keyword: search });
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
          text={item.name}
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
          text={item.name}
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
            flexDirection: "row",
            zIndex: 5,
            paddingHorizontal: 15,
            paddingVertical: 10,
            // paddingTop: 10,
            // paddingBottom: 10,
            backgroundColor: "#fff",
          }}
        >
          {/* <View
            style={{
              flexDirection: "row",
              zIndex: 5,
              marginHorizontal: 10,
              marginBottom: 10,
            }} */}
          {/* > */}
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
              borderRadius: 3,
              paddingHorizontal: 10,
              borderColor: "#209FAE",
              paddingBottom: 1,
            }}
          >
            <Filternewbiru width={18} height={18} />
            {/* <Text
              style={{
                fontFamily: "Lato-Regular",
                color: "#0095A7",
                fontSize: 13,
                alignSelf: "center",
                marginRight: 3,
              }}
            >
              {t("filter")}
            </Text> */}
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
                    fontSize: 15,
                    // alignSelf: "center",
                  }}
                >
                  {cekData(dataFillter)}
                </Text>
              </View>
            ) : null}
          </Button>
          {/* <FlatList
              contentContainerStyle={{
                justifyContent: "space-evenly",
                marginHorizontal: 3,
              }}
              horizontal={true}
              data={dataFillter.sort(compare)}
              renderItem={_renderFilter}
              showsHorizontalScrollIndicator={false}
              extraData={selected}
            ></FlatList> */}
          {/* </View> */}
          <View
            style={{
              backgroundColor: "#F0F0F0",
              borderRadius: 3,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",

              paddingHorizontal: 15,
            }}
          >
            <Search width={15} height={15} />

            <TextInput
              underlineColorAndroid="transparent"
              placeholder={t("search")}
              style={{
                width: "100%",
                // borderWidth: 1,
                marginLeft: 10,
                padding: 0,
              }}
              returnKeyType="search"
              onChangeText={(x) => setSearch(x)}
              onSubmitEditing={(x) => _setSearch(x)}
            />
          </View>
        </View>

        {/* <View
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
            {dataFillter.length ? (
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
      */}
      </View>
      <FillterModal
        show={modal}
        setClose={() => setModal(!modal)}
        datasfilter={dataFillter}
        setValueFilter={(e) => sendBackData(e)}
        setJmlFilter={(y) => setfilterlenght(y)}
      />
    </SafeAreaView>
  );
}
