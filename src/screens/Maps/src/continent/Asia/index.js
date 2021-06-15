import React, { useEffect } from "react";
import { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Pressable,
  TextInput,
} from "react-native";
import { useTranslation } from "react-i18next";
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
import { PinHijau, Search } from "../../../../../assets/svg";
export default function Asia({ navigation }) {
  const { t, i18n } = useTranslation();
  const [changeColor, setChangeColor] = useState("#209FAE");
  const [defaultColor, setDefaultColor] = useState("#DAF0F2");
  const [Idcountry, setIdcountry] = useState("");
  const [subContinent, setSubContinent] = useState({
    id: "142",
    label: "All",
  });
  // console.log("sub", subContinent);
  const subContinentData = [
    // {
    //   id: "142",
    //   label: "All",
    // },
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
        Idcountry={Idcountry}
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

  const InitialCountry = (item) => {
    // console.log(item);
    let data = ISO.filter((data) => {
      if (item) {
        if (item.id === "142") {
          return (
            data["region-code"] === item.id &&
            Country[data["alpha-3"]].available
          );
        } else {
          return (
            data["sub-region-code"] === item.id &&
            Country[data["alpha-3"]].available
          );
        }
      } else {
        return (
          data["region-code"] === "142" && Country[data["alpha-3"]].available
        );
      }
    });
    // console.log("d", data);
    setCountries(data);
  };

  useEffect(() => {
    InitialCountry();
  }, []);

  let [countries, setCountries] = useState([]);

  const searchcountry = async (e) => {
    let filcountry = countries.filter((item) => {
      if (item.name.toLowerCase().match(e.toLowerCase())) {
        return item;
      }
    });
    console.log("fill", filcountry);
    setCountries(filcountry);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <StatusBar backgroundColor="#14646e" barStyle="light-content" /> */}
      {/* filter region */}
      <View
        style={{
          // flexDirection: "row",
          flexWrap: "wrap",
          marginHorizontal: 15,
          padding: 10,
          alignItems: "center",
          borderColor: "#D1D1D1",
          backgroundColor: "#FFF",
          borderRadius: 5,
          margin: 10,
          // borderWidth: 3,
          elevation: 1,
          shadowColor: "#d3d3d3",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Text
            style={{
              paddingLeft: 10,
            }}
            size={"description"}
            type={"regular"}
          >
            Region :
          </Text>
        </View>
        <FlatList
          data={subContinentData}
          contentContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 5,
            marginTop: 5,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            // console.log("itemcontinent", item),
            <TouchableOpacity
              key={index}
              onPress={() => {
                {
                  setSubContinent(item);
                  InitialCountry(item);
                }
              }}
              style={{
                backgroundColor:
                  subContinent.id === item.id ? "#209FAE" : "#FFF",
                borderWidth: 0.5,
                borderColor:
                  subContinent.id === item.id ? "#209FAE" : "#D1D1D1",
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
          )}
        />
      </View>
      {/* akhir filter region */}
      <View style={{ padding: 15 }}>{Components[`cm${subContinent.id}`]}</View>
      <View
        style={{
          backgroundColor: "#FFF",
          shadowColor: "#d3d3d3",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          margin: 15,
          borderRadius: 10,
          elevation: 1,
        }}
      >
        <View
          style={{
            backgroundColor: "#daf0f2",
            borderRadius: 5,
            margin: 15,
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
              marginLeft: 5,
              padding: 0,
            }}
            returnKeyType="search"
            onChangeText={(x) => searchcountry(x)}
            onSubmitEditing={(x) => searchcountry(x)}
          />
        </View>
        <FlatList
          data={countries}
          renderItem={({ item, index }) => (
            // console.log("itemcountry", item),
            <View
              style={{
                paddingVertical: 15,
                paddingHorizontal: 15,
                borderBottomColor: "#dedede",
                borderBottomWidth: 1,
                marginVertical: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
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
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <Flag
                  countryid={item["alpha-3"]}
                  style={{ width: 50, marginRight: 15 }}
                />
                <Text size="label" type="reguler">
                  {item.name}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 50,
                  alignSelf: "center",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  // backgroundColor: "rgba(226, 236, 248, 0.85)",
                  backgroundColor:
                    Idcountry == item["alpha-3"]
                      ? "#FF0000"
                      : "rgba(226, 236, 248, 0.85)",
                }}
              >
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    {
                      setSubContinent({ id: item["sub-region-code"] }),
                        setIdcountry(
                          item["alpha-3"] === Idcountry ? null : item["alpha-3"]
                        );
                    }
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 50,
                    alignSelf: "center",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                  }}
                >
                  <PinHijau height={18} width={18} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          // contentContainerStyle={{ marginHorizontal: 15 }}
        />
      </View>
    </SafeAreaView>
  );
}
