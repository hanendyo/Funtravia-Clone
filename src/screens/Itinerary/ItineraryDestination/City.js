import React, { useState, useEffect } from "react";
import { View, Dimensions, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Capital, CustomImage } from "../../../component";
import CheckBox from "@react-native-community/checkbox";
import { close } from "../../../assets/png";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import { Picker } from "react-native";
import { Bottom } from "../../../assets/svg";

export default function City({
  props,
  data,
  setId_city,
  setFilterCity,
  dataFilterCity,
}) {
  const { t, i18n } = useTranslation();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  useEffect(() => {
    setFilterCity(data.get_filter_city);
  }, []);

  const _handleCheckcity = async (id, indexType, item) => {
    let tempData = [...dataFilterCity];
    tempData[indexType]["checked"] = !tempData[indexType]["checked"];

    await setFilterCity([]);
    await setFilterCity(tempData);
  };

  return dataFilterCity.length > 0 ? (
    <>
      <Text
        type="bold"
        size="title"
        style={{
          // fontSize: 20,
          // fontFamily: "Lato-Bold",
          color: "#464646",
        }}
      >
        {t("region")}
      </Text>

      <FlatList
        contentContainerStyle={{
          marginHorizontal: 3,
          paddingVertical: 15,
          paddingRight: 10,
          width: screenWidth - 40,
        }}
        data={dataFilterCity}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => _handleCheckcity(item["id"], index, item)}
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              borderColor: "#464646",
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
              lineWidth={2}
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
              onValueChange={() => _handleCheckcity(item["id"], index, item)}
              value={item["checked"]}
            />

            <Text
              size="label"
              type="regular"
              style={{
                marginLeft: 0,
                color: "#464646",
              }}
            >
              <Capital text={item["name"]} />
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        // extraData={selected}
      ></FlatList>
    </>
  ) : null;
}
