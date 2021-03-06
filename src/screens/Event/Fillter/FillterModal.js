import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import { Capital, CustomImage } from "../../../component";
import CheckBox from "@react-native-community/checkbox";
import { close } from "../../../assets/png";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import { Picker } from "react-native";
import { Bottom, Search } from "../../../assets/svg";
import RenderCity from "./City";
import DropDownPicker from "react-native-dropdown-picker";

export default function FilterModal({
  props,
  show,
  datasfilter,
  datascountry,
  setClose,
  setValueFilter,
  setJmlFilter,
  getDatacity,
  datacity,
}) {
  const { t, i18n } = useTranslation();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  let [dataFilterCategori, setFilterCategori] = useState(datasfilter);
  let [dataFilterCountry, setFilterCountry] = useState([]);
  let [dataFilterCity, setFilterCity] = useState([]);
  let [id_country, setId_country] = useState(null);

  let [opens, setOpens] = useState(10);

  // const _handleCheck = (id, indexType) => {
  //   const tempData = [...dataFilterCategori];

  //   tempData[indexType]["checked"] = !tempData[indexType]["checked"];

  //   setFilterCategori(tempData);
  // };

  const _handleCheck = async (id, index, item) => {
    let tempe = [...dataFilterCategori];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    // console.log(inde);
    tempe.splice(inde, 1, items);
    await setFilterCategori(tempe);
  };

  const searchkategori = async (teks) => {
    let searching = new RegExp(teks, "i");

    let b = datasfilter.filter((item) => searching.test(item.name));

    setFilterCategori(b);
  };

  const dataCountrySelect = () => {
    let temp = [];
    {
      datascountry.map((item, index) => {
        temp.push({ value: item?.id, label: item?.name, checked: false });
      });
    }
    setFilterCountry(temp);
  };

  const _handleCheckc = async (id, indexType) => {
    await setFilterCity([]);
    await setId_country(id);
    await getDatacity(id);
    const tempData = [...dataFilterCountry];
    for (var i in tempData) {
      tempData[i]["checked"] = false;
    }
    tempData[indexType]["checked"] = !tempData[indexType]["checked"];
    await setFilterCountry(tempData);
  };

  const UpdateFilter = async () => {
    // let tempdata = [];

    let tempdatasfilter = [...dataFilterCategori];
    for (var i in tempdatasfilter) {
      if (tempdatasfilter[i].checked == true) {
        tempdatasfilter[i].show = true;
        // tempdata.push(tempdatasfilter[i]);
      }
    }
    let tempdatasfiltercountry = [...dataFilterCountry];
    for (var i in tempdatasfiltercountry) {
      if (tempdatasfiltercountry[i].checked == true) {
        tempdatasfiltercountry[i].show = true;
        tempdatasfilter.push(tempdatasfiltercountry[i]);
      }
    }

    let tempdatasfiltercity = [...dataFilterCity];
    for (var i in tempdatasfiltercity) {
      if (tempdatasfiltercity[i].checked == true) {
        tempdatasfiltercity[i].show = true;
        tempdatasfilter.push(tempdatasfiltercity[i]);
      }
    }

    await setValueFilter(tempdatasfilter);
    await hitungfilter(tempdatasfilter);
    await setClose();
  };

  const ClearAllFilter = () => {
    // let tempdatasfilter = [...dataFilterCategori];
    // for (var i in tempdatasfilter) {
    //   tempdatasfilter[i].checked = false;
    //   tempdatasfilter[i].show = false;
    // }

    let tempe = [...dataFilterCategori];
    let tempes = [];
    for (var x of tempe) {
      let data = { ...x };
      data.checked = false;
      data.show = false;
      tempes.push(data);
    }

    // let tempdatascountry = [...dataFilterCountry];
    // for (var i in tempdatascountry) {
    //   tempdatascountry[i].checked = false;
    //   tempdatascountry[i].show = false;
    // }

    setFilterCity([]);
    setValueFilter(tempes);
    hitungfilter(tempes);
    setFilterCategori(tempes);
    setClose();
  };

  const hitungfilter = (dataFillter) => {
    let jml = 0;
    for (var i of dataFillter) {
      if (i.checked == true) {
        jml++;
      }
    }
    setJmlFilter(jml);
  };

  let [selected] = useState(new Map());

  return (
    <Modal
      onBackdropPress={() => {
        setClose();
      }}
      onRequestClose={() => setClose()}
      onDismiss={() => setClose()}
      onLayout={() => dataCountrySelect()}
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
            onPress={() => setClose()}
          >
            <CustomImage
              customStyle={{
                height: 13,
                width: 13,
                alignSelf: "flex-start",
              }}
              customImageStyle={{ resizeMode: "contain" }}
              source={close}
            />
          </TouchableOpacity>
        </View>
        {/* ==================garis========================= */}
        <View
          style={{
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 1,
          }}
        />
        {/* ==================garis========================= */}

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            borderTopWidth: 0.5,
            borderColor: "#d1d1d1",
          }}
        >
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
                  {t("categories")}
                </Text>
              </View>
            </View>
          </View>
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
                  style={{
                    width: "100%",
                    // borderWidth: 1,
                    marginLeft: 5,
                    padding: 0,
                  }}
                  // returnKeyType="search"
                  onChangeText={(x) => searchkategori(x)}
                  onSubmitEditing={(x) => searchkategori(x)}
                />
              </View>
            </View>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 15,
              }}
            >
              {dataFilterCategori.map((item, index) => (
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
                    {item["name"]}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
            </ScrollView>
          </View>
        </View>

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
        </View>
      </View>
    </Modal>
  );
}
