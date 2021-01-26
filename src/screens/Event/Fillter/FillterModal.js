import React, { useState } from "react";
import { View, Dimensions, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { CustomImage } from "../../../component";
import { CheckBox } from "native-base";

import { close } from "../../../assets/png";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
export default function FilterModal({
  show,
  datasfilter,
  datascountry,
  setClose,
  setValueFilter,
  setJmlFilter,
}) {
  const { t, i18n } = useTranslation();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  let [dataFilterCategori, setFilterCategori] = useState(datasfilter);
  let [dataFilterCountry, setFilterCountry] = useState(datascountry);
  const _handleCheck = (id, indexType) => {
    const tempData = [...dataFilterCategori];

    tempData[indexType]["checked"] = !tempData[indexType]["checked"];

    setFilterCategori(tempData);
  };

  const _handleCheckc = (id, indexType) => {
    const tempData = [...dataFilterCountry];

    tempData[indexType]["checked"] = !tempData[indexType]["checked"];

    setFilterCountry(tempData);
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

    let tempdatascountry = [...dataFilterCountry];
    for (var i in tempdatascountry) {
      tempdatascountry[i].checked = false;
      tempdatascountry[i].show = false;
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
        <ScrollView>
          <View
            style={{
              flexDirection: "column",
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
              {t("categories")}
            </Text>

            <FlatList
              contentContainerStyle={{
                marginHorizontal: 3,
                paddingVertical: 15,
                paddingRight: 10,
                width: screenWidth - 40,
              }}
              data={dataFilterCategori}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => _handleCheck(item["id"], index)}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    borderColor: "#464646",
                    width: "49%",
                    marginRight: 3,
                    marginBottom: 20,
                    justifyContent: "flex-start",
                    alignContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: "21%",
                      height: "100%",
                      justifyContent: "flex-start",
                    }}
                  >
                    <CheckBox
                      style={{
                        marginLeft: -10,
                        borderRadius: 5,
                        borderColor: "#464646",
                        alignSelf: "flex-start",
                      }}
                      onPress={() => _handleCheck(item["id"], index)}
                      checked={item["checked"]}
                      color="#209FAE"
                    />
                  </View>
                  <Text
                    size="label"
                    type="regular"
                    style={{
                      // fontFamily: "Lato-Regular",
                      // fontSize: 16,
                      // alignContent:'center',
                      textAlign: "center",

                      marginLeft: 0,
                      color: "#464646",
                    }}
                  >
                    {item["name"]}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              extraData={selected}
            ></FlatList>

            <Text
              type="bold"
              size="title"
              style={{
                // fontSize: 20,
                // fontFamily: "Lato-Bold",
                color: "#464646",
              }}
            >
              {t("country")}
            </Text>
            <FlatList
              contentContainerStyle={{
                marginHorizontal: 3,
                paddingVertical: 15,
                paddingRight: 10,
                width: screenWidth - 40,
              }}
              data={dataFilterCountry}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => _handleCheckc(item["id"], index)}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    borderColor: "#464646",
                    width: "49%",
                    marginRight: 3,
                    marginBottom: 20,
                    justifyContent: "flex-start",
                    alignContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: "21%",
                      height: "100%",
                      justifyContent: "flex-start",
                    }}
                  >
                    <CheckBox
                      style={{
                        marginLeft: -10,
                        borderRadius: 5,
                        borderColor: "#464646",
                        alignSelf: "flex-start",
                      }}
                      onPress={() => _handleCheckc(item["id"], index)}
                      checked={item["checked"]}
                      color="#209FAE"
                    />
                  </View>
                  <Text
                    size="label"
                    type="regular"
                    style={{
                      // fontFamily: "Lato-Regular",
                      // fontSize: 16,
                      // alignContent:'center',
                      textAlign: "center",

                      marginLeft: 0,
                      color: "#464646",
                    }}
                  >
                    {item["name"]}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              extraData={selected}
            ></FlatList>
          </View>
        </ScrollView>
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
            style={{ width: Dimensions.get("screen").width / 2 - 20 }}
            text={t("clearAll")}
          ></Button>
          <Button
            onPress={() => UpdateFilter()}
            style={{ width: Dimensions.get("screen").width / 2 - 20 }}
            text={t("apply")}
          ></Button>
        </View>
      </View>
    </Modal>
  );
}