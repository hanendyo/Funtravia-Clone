import React, { useEffect, useCallback, useRef } from "react";
import { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Pressable,
  TextInput,
  BackHandler,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import M035 from "./src/new/035";
import M143 from "./src/new/143";
import M034 from "./src/new/034";
import M030 from "./src/new/030";
import M145 from "./src/new/145";
import M142 from "./src/new/142";
import { ISO } from "../../../data/iso";
import Country from "../../../data/country/index.json";
import { Text, StatusBar, Button } from "../../../../../component";
import Flag from "../../../data/flag";
import {
  Arrowbackios,
  Arrowbackwhite,
  PinAbu,
  PinBiru,
  PinHijau,
  Search,
  Xhitam,
} from "../../../../../assets/svg";
import { Keyboard, KeyboardEvent } from "react-native";
import DeviceInfo from "react-native-device-info";

export default function Asia({ navigation }) {
  const { t, i18n } = useTranslation();
  const Notch = DeviceInfo.hasNotch();

  const [changeColor, setChangeColor] = useState("#209FAE");
  const [defaultColor, setDefaultColor] = useState("#DAF0F2");
  const [Idcountry, setIdcountry] = useState("");
  const [subContinent, setSubContinent] = useState({
    id: "142",
    label: "All",
  });
  const BackUse = useRef(subContinent);
  const HeaderComponent = {
    headerTitle: "",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 16,
      color: "white",
      position: BackUse.current.id === 142 ? null : "absolute",
      top:
        BackUse.current.id === 142 ? null : Platform.OS == "android" ? -9 : -10,
    },

    headerLeftContainerStyle: {
      paddingLeft: 10,
    },
    headerLeft: () => (
      <View style={{ flexDirection: "row" }}>
        <View>
          <TouchableOpacity onPress={() => onBackPress()}>
            {Platform.OS == "ios" ? (
              <Arrowbackios height={15} width={15}></Arrowbackios>
            ) : (
              <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            )}
          </TouchableOpacity>
        </View>
        {BackUse.current.id === "142" ? null : (
          <View
            style={{
              position: "absolute",
              left: 40,
              top: -10,

              width: 120,
            }}
          >
            <Text
              size="label"
              type="regular"
              numberOfLines={1}
              style={{
                color: "#FFF",
                flex: 1,
                fontFamily: "Lato-Bold",
                fontSize: 16,
              }}
            >
              Destination
            </Text>
            <View style={{}}>
              <Text
                style={{
                  color: "white",
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                }}
              >
                {BackUse.current.label}
              </Text>
            </View>
          </View>
        )}
      </View>
    ),

    headerRight: () => {
      return null;
    },
  };

  // awal keyboardheight
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();

  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      "keyboardWillShow",
      onKeyboardShow
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      "keyboardWillHide",
      onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);
  // akhir keyboardheight

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

  // manipulasi header
  const setHeader = (item) => {
    if (item !== "142") {
      navigation.setOptions(HeaderComponent);
    } else {
      navigation.setOptions({ headerTitle: "ASIA" });
    }
  };

  const onBackPress = useCallback(() => {
    if (BackUse.current.id !== "142") {
      setSubContinent({ id: "142" });
      InitialCountry({ id: "142" });
      setHeader("142");
      BackUse.current = {
        id: "142",
        label: "All",
      };
    } else {
      console.log("tb");
      navigation.goBack();
    }
    return true;
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [navigation, onBackPress]);

  useEffect(() => {
    InitialCountry();
  }, []);

  let [countries, setCountries] = useState([]);
  let [text, setText] = useState("");

  const handleSubmit = (x) => {
    setText(x);
    searchcountry(x);
  };

  const searchcountry = async (e) => {
    if (e) {
      let filcountry = countries.filter((item) => {
        if (item.name.toLowerCase().match(e.toLowerCase())) {
          return item;
        }
      });
      setCountries(filcountry);
    } else {
      InitialCountry(subContinent);
    }
  };

  const onClearSearch = () => {
    setText("");
    searchcountry();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={
          {
            // borderWidth: 1,
          }
        }
      >
        {/* <StatusBar backgroundColor="#14646e" barStyle="light-content" /> */}
        {/* filter region */}

        <View
          style={{
            flexWrap: "wrap",
            marginHorizontal: 15,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            alignItems: "center",
            borderColor: "#D1D1D1",
            backgroundColor: "#FFF",
            borderRadius: 5,
            flexDirection: "row",
            marginTop: 10,
            // borderWidth: 1,
            zIndex: 999999,
            elevation: 1,
            shadowColor: "#d3d3d3",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
          }}
        >
          <View
            style={{
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                paddingLeft: 5,
                paddingRight: 5,
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
              <TouchableOpacity
                key={index}
                onPress={() => {
                  {
                    setSubContinent(item);
                    InitialCountry(item);
                    setHeader(item.id);
                    BackUse.current = item;
                  }
                }}
                style={{
                  backgroundColor:
                    subContinent.id === item.id ? "#209FAE" : "#FFF",
                  borderWidth: 0.5,
                  borderColor:
                    subContinent.id === item.id ? "#209FAE" : "#D1D1D1",
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  margin: 5,
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
        <View
          style={{
            height: Platform.select({
              ios: Notch
                ? Dimensions.get("screen").height / 3
                : Dimensions.get("screen").height / 2.5,
              android: Dimensions.get("screen").height / 3,
            }),

            alignContent: "center",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Components[`cm${subContinent.id}`]}
        </View>
        <View
          style={{
            backgroundColor: "#FFF",
            shadowColor: "#d3d3d3",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            // marginTop: BackUse.current.id === "142" ? -15 : 0,
            marginTop: 0,
            margin: 15,
            borderRadius: 10,
            elevation: 1,
            bottom:
              Platform.OS === "ios" &&
              keyboardOffset < 300 &&
              keyboardOffset > 0
                ? 80
                : keyboardOffset > 300
                ? 50
                : 0,
            // marginBottom: 200,
          }}
        >
          <View
            style={{
              backgroundColor: "#f6f6f6",
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
                // borderWidth: 1,
                width: "90%",
                marginLeft: 5,
                padding: 0,
              }}
              value={text}
              returnKeyType="search"
              onChangeText={(x) => handleSubmit(x)}
              onSubmitEditing={(x) => handleSubmit(x)}
            />
            {text ? (
              <TouchableOpacity
                onPress={() => {
                  onClearSearch();
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#464646",
                    padding: 3,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Xhitam width={7} height={7} />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          <FlatList
            data={countries}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  borderBottomColor: "#dedede",
                  borderBottomWidth: index === countries.length - 1 ? 0 : 1,
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
                  <Text size="label" type="reguler" style={{ marginLeft: 20 }}>
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
                      Idcountry == item["alpha-3"] ? "#DAF0F2" : "#F6F6F6",
                  }}
                >
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      {
                        setSubContinent({ id: item["sub-region-code"] }),
                          setIdcountry(
                            item["alpha-3"] === Idcountry
                              ? null
                              : item["alpha-3"]
                          );
                        setHeader(item["sub-region-code"]);

                        BackUse.current = {
                          id: item["sub-region-code"],
                          label: item["sub-region"],
                        };
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
                    {Idcountry == item["alpha-3"] ? (
                      <PinBiru height={18} width={18} />
                    ) : (
                      <PinAbu height={18} width={18} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
            // contentContainerStyle={{ marginHorizontal: 15 }}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Notch ? 320 : 170}
          style={
            {
              // backgroundColor: "red",
            }
          }
        ></KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
