import React, { useState } from "react";
import {
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import { CustomImage } from "../../../component";
import CheckBox from "@react-native-community/checkbox";
import { close } from "../../../assets/png";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import { Search } from "../../../assets/svg";

export default function FilterModal({
  show,
  datasfilter,
  setClose,
  setValueFilter,
  setJmlFilter,
}) {
  const { t, i18n } = useTranslation();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  let [dataFilterCategori, setFilterCategori] = useState(datasfilter);
  const _handleCheck = (id, indexType) => {
    const tempData = [...dataFilterCategori];

    tempData[indexType]["checked"] = !tempData[indexType]["checked"];

    setFilterCategori(tempData);
  };

  const UpdateFilter = () => {
    let tempdatasfilter = [...dataFilterCategori];
    for (var i in tempdatasfilter) {
      if (tempdatasfilter[i].checked == true) {
        tempdatasfilter[i].show = true;
      }
    }

    setValueFilter(tempdatasfilter);
    hitungfilter(tempdatasfilter);
    setClose();
  };

  const ClearAllFilter = () => {
    let tempdatasfilter = [...dataFilterCategori];
    for (var i in tempdatasfilter) {
      tempdatasfilter[i].checked = false;
      tempdatasfilter[i].show = false;
    }
    // console.log(tempdatasfilter);
    setValueFilter(tempdatasfilter);
    hitungfilter(tempdatasfilter);
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
      isVisible={show}
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
    >
      <View
        style={{
          height: 10,

          backgroundColor: "#209fae",
        }}
      ></View>
      <View
        style={{
          flexDirection: "column",
          height: Dimensions.get("screen").height * 0.75,
          width: Dimensions.get("screen").width,
          backgroundColor: "white",
          // borderTopLeftRadius: 15,
          // borderTopRightRadius: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 15,
            paddingVertical: 20,
            borderWidth: 1,
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
            <View style={{ padding: 15 }}>
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
            ></ScrollView>
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
