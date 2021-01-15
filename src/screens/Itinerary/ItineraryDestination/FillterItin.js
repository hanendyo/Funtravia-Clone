import React, { useState, useEffect } from "react";
import {
  View,
  // Text,
  Dimensions,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CustomImage } from "../../../component";
import { filter_blue2, search_button } from "../../../assets/png";
import FillterModal from "./FillterModal";
import { Google } from "../../../assets/svg";
import { useTranslation } from "react-i18next";
import { Text } from "../../../component";

export default function FilterItin({ fillter, sendBack }) {
  const { t, i18n } = useTranslation();

  let [selected] = useState(new Map());
  let [search, setSearch] = useState(null);
  let [dataFillter, setdataFillter] = useState([]);
  let [Filterlenght, setfilterlenght] = useState(0);
  let [modal, setModal] = useState(false);
  const compare = (a, b) => {
    return b.checked - a.checked;
  };

  const modalTogle = () => {
    setModal(!modal);
  };

  const _setSearch = (text) => {
    let tempData = [];
    for (let i of dataFillter) {
      i.checked ? tempData.push(i.id) : null;
    }
    sendBack({ type: null, tag: tempData, keyword: text });
    setSearch(text);
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
    if (item.checked == true) {
      return (
        <TouchableOpacity
          onPress={() => onSelectFilter(item.checked, item.id)}
          style={{
            marginRight: 3,
            flexDirection: "row",
            backgroundColor: "#0095A7",
            borderColor: "#0095A7",
            borderRadius: 5,
            height: 27,
            minWidth: 80,
            paddingHorizontal: 8,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Lato-Regular",
              color: "white",
              marginVertical: 4,
              fontSize: 14,
              alignSelf: "center",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    } else if (item.sugestion == true || item.show == true) {
      return (
        <TouchableOpacity
          onPress={() => onSelectFilter(item.checked, item.id)}
          style={{
            marginRight: 3,
            flexDirection: "row",
            backgroundColor: "white",
            borderColor: "#E7E7E7",
            borderRadius: 5,
            height: 27,
            minWidth: 80,
            borderWidth: 1,
            paddingHorizontal: 8,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Lato-Regular",
              color: "#0095A7",
              marginVertical: 4,
              fontSize: 14,
              alignSelf: "center",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View>
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
              onPress={() => Alert.alert("Coming soon")}
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
            marginBottom: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              modalTogle();
            }}
            style={{
              marginRight: 5,
              height: 27,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "white",
                borderColor: "#E7E7E7",
                borderRadius: 5,
                borderWidth: 1,
                minWidth: 80,
                height: 27,
                justifyContent: "center",
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
                  fontSize: 14,
                  alignSelf: "center",
                  marginRight: 3,
                }}
              >
                {t("filter")}
              </Text>
              {/* {dataFillter.length ? ( */}
              {dataFillter.length > 0 && Filterlenght > 0 ? (
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
                      fontSize: 14,
                      alignSelf: "center",
                    }}
                  >
                    {Filterlenght}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>

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
        show={modal}
        setClose={() => setModal(!modal)}
        datasfilter={fillter}
        setValueFilter={(e) => sendBackData(e)}
        setJmlFilter={(y) => setfilterlenght(y)}
      />
    </View>
  );
}
