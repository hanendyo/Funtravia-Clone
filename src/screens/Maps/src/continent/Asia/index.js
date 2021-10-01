import React, { useEffect, useCallback, useRef } from "react";
import { useState } from "react";
import {
  View,
  Dimensions,
  Animated,
  Pressable,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import {
  Arrowbackblack,
  Arrowbackiosblack,
  GlobeMap,
  Next,
  PinAbu,
  PinBiru,
} from "../../../../../assets/svg";
import { StatusBar, Button, Text } from "../../../../../component";
import { useTranslation } from "react-i18next";
import M035 from "./src/new/035";
import M143 from "./src/new/143";
import M034 from "./src/new/034";
import M030 from "./src/new/030";
import M145 from "./src/new/145";
import M142 from "./src/new/142";
import { ISO } from "../../../data/iso";
import Country from "../../../data/country/index.json";
import DeviceInfo from "react-native-device-info";
import Flag from "../../../data/flag";
import { Keyboard, KeyboardEvent } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
const Notch = DeviceInfo.hasNotch();

export default function Asia({ navigation }) {
  const { t } = useTranslation();

  const [changeColor, setChangeColor] = useState("#209FAE");
  const [defaultColor, setDefaultColor] = useState("#DAF0F2");
  const [subContinent, setSubContinent] = useState({
    id: "142",
    label: "All",
  });
  let [countries, setCountries] = useState([]);
  const [Idcountry, setIdcountry] = useState("");
  const BackUse = useRef(subContinent);

  //Data subcontinent
  const subContinentData = [
    {
      id: "035",
      label: t("southeasternasia"),
    },
    {
      id: "143",
      label: t("centralasia"),
    },
    {
      id: "034",
      label: t("southernasia"),
    },
    {
      id: "030",
      label: t("easternasia"),
    },
    {
      id: "145",
      label: t("westernasia"),
    },
  ];

  // component for view map
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

  const onBackPress = useCallback(() => {
    if (BackUse.current.id !== "142") {
      setSubContinent({ id: "142" });
      InitialCountry({ id: "142" });
      BackUse.current = {
        id: "142",
        label: "All",
      };
    } else {
      navigation.goBack();
    }
    return true;
  }, []);

  const InitialCountry = (item) => {
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

  // awal keyboardheight
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();

  // hardwarebackpress
  useEffect(() => {
    navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [navigation, onBackPress]);

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
  return (
    <View
      style={{
        flex: 1,

        width: Dimensions.get("screen").width,
        backgroundColor: "#FFFFFF",
      }}
    >
      <StatusBar backgroundColor="#14646E" />
      <View
        style={{
          width: Dimensions.get("screen").width,

          height: Platform.select({
            ios: Notch
              ? Dimensions.get("screen").height * 0.5
              : Dimensions.get("screen").height * 0.6,
            android: Dimensions.get("screen").height * 0.5,
          }),
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* view for map destination */}
        <View
          style={{
            backgroundColor: "#f6f6f6",
            marginHorizontal: 15,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginTop: 15,

            height: Platform.select({
              ios: Notch
                ? Dimensions.get("screen").height * 0.5 - 15
                : Dimensions.get("screen").height * 0.6 - 15,
              android: Dimensions.get("screen").height * 0.5 - 15,
            }),
          }}
        >
          {/* backhandler */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Button
                text={""}
                size="medium"
                type="circle"
                variant="transparent"
                onPress={() => onBackPress()}
                style={{
                  height: 55,
                }}
              >
                {Platform.OS == "ios" ? (
                  <Arrowbackiosblack height={15} width={15}></Arrowbackiosblack>
                ) : (
                  <Arrowbackblack height={20} width={20}></Arrowbackblack>
                )}
              </Button>
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#464646",
                    marginLeft: 10,
                    fontSize: 18,

                    fontFamily: "Lato-Bold",
                  }}
                >
                  {t("destination")}
                </Text>
              </View>
            </View>
            {subContinent.id !== "142" ? (
              <View
                style={{
                  justifyContent: "center",
                  paddingRight: 5,
                }}
              >
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{
                    // borderWidth: 1,
                    padding: 5,
                  }}
                >
                  <GlobeMap width={25} height={25} />
                </Pressable>
              </View>
            ) : null}
          </View>

          {/* FOR MAP VIEW */}
          <View
            style={{
              width: "100%",

              height: Platform.select({
                ios: Notch
                  ? Dimensions.get("screen").height * 0.35
                  : Dimensions.get("screen").height * 0.4,
                android: Dimensions.get("screen").height * 0.35,
              }),
              justifyContent: "center",
            }}
          >
            {Components[`cm${subContinent.id}`]}
          </View>
          <View
            style={{
              width: "100%",
              height: "15%",

              justifyContent: "flex-end",
            }}
          >
            <Pressable style={{}}>
              <View
                style={{
                  borderRadius: 10,
                  justifyContent: "center",
                  alignContent: "center",
                  alignSelf: "center",
                  borderColor: "#d3d3d3",
                  borderWidth: 1,
                  marginBottom: 10,
                  backgroundColor: "#FFF",
                }}
              >
                <Text
                  style={{
                    color: "#209FAE",
                    textAlign: "center",
                    fontSize: 18,
                    paddingVertical: 5,
                    paddingHorizontal: 40,
                    fontFamily: "Lato-Bold",
                  }}
                >
                  {subContinent.id != "142" ? subContinent.label : "Asia"}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* for continent list jika subcontinent == 142 */}
      {subContinent.id == "142" ? (
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height * 0.5,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d3d3d3",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              backgroundColor: "#FFFFFF",
              height: "100%",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
              }}
            >
              <Text
                size="title"
                type="regular"
                style={{
                  paddingVertical: 15,
                  color: "#209FAE",
                }}
              >
                {t("region")}
              </Text>
            </View>
            <ScrollView>
              <FlatList
                data={subContinentData}
                contentContainerStyle={{
                  paddingHorizontal: 5,
                  marginTop: 5,

                  marginBottom: 100,
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      {
                        setSubContinent(item);
                        InitialCountry(item);
                        // setHeader(item.id);
                        BackUse.current = item;
                      }
                    }}
                    style={{
                      borderBottomWidth: 1,
                      marginHorizontal: 15,
                      borderBottomColor: "#d3d3d3",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 5,
                        marginVertical: 20,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",

                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            width: 5,
                            height: "60%",
                            borderTopRightRadius: 30,
                            borderBottomRightRadius: 30,
                            marginRight: 10,
                            backgroundColor: "#209FAE",
                          }}
                        ></View>
                        <Text
                          type="regular"
                          size="readable"
                        >{`${item.label}`}</Text>
                      </View>
                      <View style={{ justifyContent: "center" }}>
                        <Next width={12} height={12} />
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            </ScrollView>
          </View>
        </View>
      ) : (
        // for region berdasarkan sub continent
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d3d3d3",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              backgroundColor: "#FFFFFF",
              height: "100%",
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",

                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
              }}
            >
              <View
                style={{
                  width: "70%",
                  paddingLeft: 50,
                  // alignItems: "center",
                  // alignContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="regular"
                  style={{
                    paddingVertical: 15,
                  }}
                >
                  {t("country")}
                </Text>
              </View>
              <View
                style={{
                  width: "30%",
                  paddingLeft: 15,
                  // alignItems: "center",
                  // alignContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="regular"
                  style={{
                    paddingVertical: 15,
                  }}
                >
                  {t("location")}
                </Text>
              </View>
            </View>
            {countries.length > 0 ? (
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
                    <Pressable
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
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          width: "70%",

                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 3,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 2.65,
                            width: 25,

                            elevation: 7,
                            marginRight: 10,
                          }}
                        >
                          <Flag
                            countryid={item["alpha-3"]}
                            style={{ width: 50, marginRight: 15 }}
                          />
                        </View>
                        <Text
                          size="label"
                          type="reguler"
                          style={{ marginLeft: 20 }}
                        >
                          {item.name}
                        </Text>
                      </View>
                    </Pressable>
                    <View
                      style={{
                        width: "30%",

                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
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
                              ? "#DAF0F2"
                              : "#F6F6F6",
                        }}
                      >
                        <Pressable
                          key={index}
                          onPress={() => {
                            {
                              setSubContinent({
                                id: item["sub-region-code"],
                                label: item["sub-region"],
                              }),
                                setIdcountry(
                                  item["alpha-3"] === Idcountry
                                    ? null
                                    : item["alpha-3"]
                                );
                              // setHeader(item["sub-region-code"]);

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
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}
              />
            ) : (
              <Text
                size="readable"
                type="regular"
                style={{
                  textAlign: "center",
                }}
              >
                {"No Data"}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
