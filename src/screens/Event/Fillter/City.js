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

export default function City({ data, setId_city }) {
  const { t, i18n } = useTranslation();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  let [dataFilterCity, setFilterCity] = useState(data.get_filter_city);

  const _handleCheckcity = async (id, indexType) => {
    console.log(id);
    console.log(indexType);

    await setId_city(id);
    const tempData = [...dataFilterCity];
    tempData[indexType]["checked"] = !tempData[indexType]["checked"];

    await setFilterCity(tempData);
  };

  return (
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
        renderItem={({ item, index }) =>
          index < 6 ? (
            <TouchableOpacity
              onPress={() => _handleCheckcity(item["id"], index)}
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
                onValueChange={() => _handleCheckcity(item["id"], index)}
                value={item["checked"]}
                color="#209FAE"
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
          ) : null
        }
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        // extraData={selected}
      ></FlatList>
    </>
  );
}
