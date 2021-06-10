import React from "react";
import { useState } from "react";
import { SafeAreaView, FlatList, TouchableOpacity, View } from "react-native";
import M035 from "./src/new/035";
import M143 from "./src/143";
import M034 from "./src/034";
import M030 from "./src/030";
import M145 from "./src/145";
import M142 from "./src/142";
import { ISO } from "../../../data/iso";
import Country from "../../../data/country/index.json";
import { Text, StatusBar } from "../../../../../component";
import Flag from "../../../data/flag";
export default function Asia({ navigation }) {
  const [changeColor, setChangeColor] = useState("#209FAE");
  const [defaultColor, setDefaultColor] = useState("#DAF0F2");
  const [subContinent, setSubContinent] = useState({
    id: "142",
    label: "All",
  });
  const subContinentData = [
    {
      id: "142",
      label: "All",
    },
    {
      id: "035",
      label: "South-eastern Asia",
    },
    {
      id: "143",
      label: "Central Asia",
    },
    {
      id: "034",
      label: "Southern Asia",
    },
    {
      id: "030",
      label: "Eastern Asia",
    },
    {
      id: "145",
      label: "Western Asia",
    },
  ];

  const Components = {
    cm035: (
      <M035
        subContinent={subContinent}
        colorChange={changeColor}
        defaultColor={defaultColor}
        setChange={(data) => setSubContinent(data)}
      />
    ),
    cm143: (
      <M143
        subContinent={subContinent}
        colorChange={changeColor}
        defaultColor={defaultColor}
        setChange={(data) => setSubContinent(data)}
      />
    ),
    cm034: (
      <M034
        subContinent={subContinent}
        colorChange={changeColor}
        defaultColor={defaultColor}
        setChange={(data) => setSubContinent(data)}
      />
    ),
    cm030: (
      <M030
        subContinent={subContinent}
        colorChange={changeColor}
        defaultColor={defaultColor}
        setChange={(data) => setSubContinent(data)}
      />
    ),
    cm145: (
      <M145
        subContinent={subContinent}
        colorChange={changeColor}
        defaultColor={defaultColor}
        setChange={(data) => setSubContinent(data)}
      />
    ),
    cm142: (
      <M142
        subContinent={subContinent}
        colorChange={changeColor}
        defaultColor={defaultColor}
        setChange={(data) => setSubContinent(data)}
      />
    ),
  };

  const getCountry = (data) => {
    if (subContinent.id === "142") {
      return (
        data["region-code"] === subContinent.id &&
        Country[data["alpha-3"]].available
      );
    } else {
      return (
        data["sub-region-code"] === subContinent.id &&
        Country[data["alpha-3"]].available
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <StatusBar backgroundColor="#14646e" barStyle="light-content" /> */}
      <View style={{ backgroundColor: "#FFF", padding: 15 }}>
        {Components[`cm${subContinent.id}`]}
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginHorizontal: 15,
          padding: 5,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#D1D1D1",
          backgroundColor: "#FFF",
          borderRadius: 5,
          margin: 10,
          borderWidth: 3,
          elevation: 1,
          shadowColor: "#d3d3d3",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
        }}
      >
        {subContinentData.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSubContinent(item)}
            style={{
              backgroundColor: subContinent.id === item.id ? "#209FAE" : "#FFF",
              borderWidth: 0.5,
              borderColor: subContinent.id === item.id ? "#209FAE" : "#D1D1D1",
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 5,
              margin: 5,
              elevation: 1,
              shadowColor: "#d3d3d3",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 2,
            }}
          >
            <Text
              type="bold"
              size="description"
              style={{
                color: subContinent.id === item.id ? "#FFF" : "#464646",
              }}
            >{`${item.label}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={ISO.filter(getCountry)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CountryStack", {
                screen: "Country",
                params: {
                  data: { id: Country[item["alpha-3"]].id },
                },
              })
            }
            key={index}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 15,
              backgroundColor: "#FFF",
              marginVertical: 5,
              borderRadius: 5,
              elevation: 1,
              shadowColor: "#d3d3d3",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ width: 50, marginRight: 15 }}>
              <Flag countryid={item["alpha-3"]} />
            </View>
            <Text size="label" type="bold">
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ marginHorizontal: 15 }}
      />
    </SafeAreaView>
  );
}
