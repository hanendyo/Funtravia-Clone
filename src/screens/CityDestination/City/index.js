import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  Animated,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery } from "@apollo/react-hooks";
import {
  Arrowbackwhite,
  OptionsVertWhite,
  Love,
  Electric,
  Emergency,
  Health,
  Lang,
  Money,
  Passport,
  Time,
  Tax,
  PinWhite,
  LikeEmpty,
} from "../../../assets/svg";
import { default_image, search_button } from "../../../assets/png";
import { Input } from "native-base";
import CitiesInformation from "../../../graphQL/Query/Cities/Citiesdetail";
import LinearGradient from "react-native-linear-gradient";
import { Capital, Truncate } from "../../../component";
import Ripple from "react-native-material-ripple";
import ImageSlider from "react-native-image-slider";
const screenHeight = Dimensions.get("window").height;
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import Article from "./Article";
import { FunIcon, Loading } from "../../../component";
import { TouchableHighlight } from "react-native-gesture-handler";
import Sidebar from "../../../component/src/Sidebar";

let HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.3;
let HEADER_MIN_HEIGHT = 55;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function CityDetail(props) {
  const { t, i18n } = useTranslation();
  const { width, height } = Dimensions.get("screen");
  const [active, setActive] = useState("Map");
  const [actives, setActives] = useState("General");
  const [actived, setActived] = useState("About");
  const [loadings, setloadings] = useState(true);
  let [token, setToken] = useState("");
  let [scrollY, setscrollY] = useState(new Animated.Value(0));
  let [dataevent, setdataevent] = useState({ event: [], month: "" });
  let [showside, setshowside] = useState(false);

  let [search, setTextc] = useState("");
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });
  const [getPackageDetail, { loading, data, error }] = useLazyQuery(
    CitiesInformation,
    {
      fetchPolicy: "network-only",
      variables: {
        id: props.route.params.data.city_id,
      },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const bulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Des",
  ];
  const RendertabGlace = ({ dataaktif, kiriman }) => {
    if (dataaktif === "Map") {
      return (
        <Image
          source={kiriman.map ? { uri: kiriman.map } : default_image}
          style={{
            width: "100%",
            height: width * 0.7,
            resizeMode: "center",
          }}
        ></Image>
      );
    } else {
      return (
        <Image
          source={default_image}
          style={{
            width: "100%",
            height: width * 0.7,
            resizeMode: "center",
          }}
        ></Image>
      );
    }
  };

  const rendertabEssential = (dataaktif, kiriman) => {
    if (dataaktif === "Practical") {
      return (
        <View
          style={{
            width: "100%",
            paddingVertical: 20,
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          <Ripple
            onPress={() => {
              props.navigation.navigate("PracticalInformation");
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Electric width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Elecricity")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("PracticalInformation");
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Emergency width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Emergency no")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("PracticalInformation");
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Health width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Health")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("PracticalInformation");
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Lang width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Language")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("PracticalInformation");
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Money width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Money")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("PracticalInformation");
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Passport width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Visa & Passport")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("PracticalInformation");
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Time width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Time Zone")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("PracticalInformation");
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Tax width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Taxes & Tipping")}
            </Text>
          </Ripple>
        </View>
      );
    } else if (dataaktif === "About") {
      return (
        <View
          style={{
            width: "100%",
            paddingVertical: 20,
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          <Ripple
            onPress={() => {
              props.navigation.navigate("Abouts", {
                active: "History",
              });
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Tax width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("History")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("Abouts", {
                active: "whentogo",
              });
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Tax width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Whentogo")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("Abouts", {
                active: "localfood",
              });
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Tax width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("LocalFood")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("Abouts", {
                active: "art",
              });
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Tax width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Art & Culture")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("Abouts", {
                active: "souvenir",
              });
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Tax width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Souvenir")}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("Abouts", {
                active: "telecomunication",
              });
            }}
            style={{
              width: "33.333%",
              alignContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Tax width={40} height={40} />
            <Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
              {t("Telecomunication")}
            </Text>
          </Ripple>
        </View>
      );
    }
  };

  const Gettahun = () => {
    let x = new Date();
    x = x.getFullYear();
    return x;
  };

  const Goto = (item) => {
    if (item.id) {
      props.navigation.navigate("eventdetail", {
        data: item,
        name: item.name,
        token: token,
      });
    }
  };

  const RenderUtama = ({ aktif, render }) => {
    if (aktif === "General") {
      return (
        <View>
          {/* General information */}
          {render && render.description ? (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                flexDirection: "column",
              }}
            >
              <View>
                <Text type="bold" size="label" style={{}}>
                  {t("generalInformation")}
                </Text>
                <Text
                  size="description"
                  style={{
                    textAlign: "justify",
                  }}
                >
                  {render ? render.description : null}
                </Text>
              </View>
            </View>
          ) : null}
          {/* Activities */}
          {render.destination_type && render.destination_type.length > 0 ? (
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: "100%",
              }}
            >
              <Text size="label" type="bold" style={{}}>
                {t("Activities & Experience")}
              </Text>
              <Text size="description">Good destination for your trip</Text>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "white",
                  // height: 100,
                  width: "100%",
                  shadowColor: "#d3d3d3",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 2,
                  borderRadius: 5,
                  padding: 20,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    // borderWidth: 1,
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  {render.destination_type.map((item, index) => {
                    // console.log(item);
                    return (
                      <Ripple
                        onPress={() => {
                          props.navigation.push("DestinationList", {
                            idtype: item.id,
                            idcity: render.id,
                          });
                        }}
                        style={{
                          // borderWidth: 1,
                          width: "25%",
                          // justifyContent: '',
                          alignContent: "center",
                          alignItems: "center",
                          padding: 5,
                        }}
                      >
                        <FunIcon
                          icon={item.icon ? item.icon : "w-fog"}
                          height={50}
                          width={50}
                          style={{
                            bottom: -3,
                          }}
                        />
                        <Text
                          size="small"
                          style={{ textAlign: "center", marginTop: 3 }}
                        >
                          {item.name}
                        </Text>
                      </Ripple>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : null}
          {/* at Glance */}
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              width: "100%",
            }}
          >
            <Text size="label" type="bold" style={{}}>
              <Capital text={render.name} />
              {t("atGlance")}
            </Text>
            <Text size="description">Good destination for your trip</Text>
            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                width: "100%",
                shadowColor: "#d3d3d3",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 2,
                borderRadius: 5,
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", width: "100%" }}>
                <Ripple
                  onPress={() => {
                    setActive("Map");
                  }}
                  style={{
                    width: "33.333%",
                    alignContent: "center",
                    alignItems: "center",
                    borderBottomWidth: active == "Map" ? 3 : 1,
                    borderBottomColor: active == "Map" ? "#209FAE" : "#EEEEEE",
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    size="description"
                    type={active == "Map" ? "bold" : "regular"}
                    style={{
                      color: active == "Map" ? "#209FAE" : "#464646",
                    }}
                  >
                    {t("Map")}
                  </Text>
                </Ripple>
                <Ripple
                  onPress={() => {
                    setActive("climate");
                  }}
                  style={{
                    width: "33.333%",
                    alignContent: "center",
                    alignItems: "center",
                    borderBottomWidth: active == "climate" ? 3 : 1,
                    borderBottomColor:
                      active == "climate" ? "#209FAE" : "#EEEEEE",
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    size="description"
                    type={active == "climate" ? "bold" : "regular"}
                    style={{
                      color: active == "climate" ? "#209FAE" : "#464646",
                    }}
                  >
                    {t("Climate")}
                  </Text>
                </Ripple>
                <Ripple
                  onPress={() => {
                    setActive("Religion");
                  }}
                  style={{
                    width: "33.333%",
                    alignContent: "center",
                    alignItems: "center",
                    borderBottomWidth: active == "Religion" ? 3 : 1,
                    borderBottomColor:
                      active == "Religion" ? "#209FAE" : "#EEEEEE",
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    size="description"
                    type={active == "Religion" ? "bold" : "regular"}
                    style={{
                      color: active == "Religion" ? "#209FAE" : "#464646",
                    }}
                  >
                    {t("Religion")}
                  </Text>
                </Ripple>
              </View>

              <RendertabGlace dataaktif={active} kiriman={render} />
            </View>
          </View>
          {/* Travel Jurnal */}
          {render.journal && render.journal.length > 0 ? (
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: "100%",
              }}
            >
              <Text size="label" type="bold" style={{}}>
                {t("TravelJurnal")}
              </Text>
              <Text size="description">Good destination for your trip</Text>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "white",
                  height: width * 0.52,
                  width: "100%",
                  shadowColor: "#d3d3d3",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 2,
                  borderRadius: 5,
                  padding: 20,
                }}
              >
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  scrollEnabled
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  contentContainerStyle={{
                    flexDirection: "column",
                    flexWrap: "wrap",
                  }}
                  data={render.journal}
                  renderItem={({ item, index }) => {
                    return (
                      <Ripple
                        onPress={props.navigation.navigate(
                          "JournalStackNavigation",
                          {
                            screen: "Journal",
                            params: {
                              dataPopuler: item,
                            },
                          }
                        )}
                        style={{
                          flexDirection: "row",
                          // borderWidth: 1,
                          width: width - 80,
                          height: width * 0.2,
                        }}
                      >
                        <Image
                          source={
                            item.picture ? { uri: item.picture } : default_image
                          }
                          style={{
                            height: width * 0.15,
                            width: width * 0.15,
                            borderRadius: 5,
                          }}
                        ></Image>
                        <View style={{ width: "100%", paddingHorizontal: 10 }}>
                          <Text type="bold">{item.title}</Text>
                          <View
                            style={{
                              width: width - (100 + width * 0.15),
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              alignContent: "center",
                            }}
                          >
                            <Text>
                              <Truncate text={item.text} length={30} />
                            </Text>
                            {item.liked === true ? (
                              <Love height={15} width={15} />
                            ) : (
                              <LikeEmpty height={15} width={15} />
                            )}
                          </View>
                        </View>
                      </Ripple>
                    );
                  }}
                />
              </View>
            </View>
          ) : null}
          {/* Essential */}
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              width: "100%",
            }}
          >
            <Text size="label" type="bold" style={{}}>
              {t("Essentials")}
            </Text>
            <Text size="description">Good destination for your trip</Text>
            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                // height: 100,
                width: "100%",
                shadowColor: "#d3d3d3",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 2,
                borderRadius: 5,
              }}
            >
              <View style={{ flexDirection: "row", width: "100%" }}>
                <Ripple
                  onPress={() => {
                    setActived("About");
                  }}
                  style={{
                    width: "50%",
                    alignContent: "center",
                    alignItems: "center",
                    borderBottomWidth: actived == "About" ? 3 : 1,
                    borderBottomColor:
                      actived == "About" ? "#209FAE" : "#EEEEEE",
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    size="description"
                    type={actived == "About" ? "bold" : "regular"}
                    style={{
                      color: actived == "About" ? "#209FAE" : "#464646",
                    }}
                  >
                    {t("About")}
                  </Text>
                </Ripple>
                <Ripple
                  onPress={() => {
                    setActived("Practical");
                  }}
                  style={{
                    width: "50%",
                    alignContent: "center",
                    alignItems: "center",
                    borderBottomWidth: actived == "Practical" ? 3 : 1,
                    borderBottomColor:
                      actived == "Practical" ? "#209FAE" : "#EEEEEE",
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    size="description"
                    type={actived == "Practical" ? "bold" : "regular"}
                    style={{
                      color: actived == "Practical" ? "#209FAE" : "#464646",
                    }}
                  >
                    {t("Practical Information")}
                  </Text>
                </Ripple>
              </View>
              {actived ? rendertabEssential(actived, render) : null}
            </View>
          </View>
          {/* Event */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              flexDirection: "column",
            }}
          >
            <View>
              <Text type="bold" size="label" style={{}}>
                {"Festival and Event"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  size="description"
                  style={{
                    textAlign: "justify",
                  }}
                >
                  Bali is an Indonesian island known
                </Text>
                <Ripple
                  onPress={() => {
                    props.navigation.navigate("listevent", {
                      idcity: render.id,
                      // idcountries:
                    });
                  }}
                >
                  <Text
                    type="bold"
                    size="description"
                    style={{
                      color: "#209fae",
                    }}
                  >
                    View All
                  </Text>
                </Ripple>
              </View>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "white",
                  // height: 100,
                  width: "100%",
                  shadowColor: "#d3d3d3",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 2,
                  borderRadius: 5,
                }}
              >
                {/* {console.log(dataevent)} */}
                <ImageSlider
                  images={
                    dataevent.event.length > 0
                      ? dataevent.event
                      : [default_image]
                  }
                  style={{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    // width: Dimensions.get('screen').width - 40,
                  }}
                  customSlide={({ index, item, style, width }) => (
                    <Ripple
                      onPress={() => {
                        Goto(item);
                      }}
                      key={index}
                      style={{
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}
                    >
                      <ImageBackground
                        source={
                          item.images && item.images.length
                            ? { uri: item.images[0].image }
                            : default_image
                        }
                        style={{
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          height: Dimensions.get("screen").width * 0.4,
                          width: Dimensions.get("screen").width - 40,
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                        imageStyle={{
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          height: Dimensions.get("screen").width * 0.4,
                          width: Dimensions.get("screen").width - 40,
                          resizeMode: "cover",
                        }}
                      >
                        <LinearGradient
                          colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          style={{
                            height: "50%",
                            width: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            padding: 25,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            {item.name ? item.name : ""}
                          </Text>
                        </LinearGradient>
                      </ImageBackground>
                    </Ripple>
                  )}
                  customButtons={(position, move) => (
                    <View
                      style={{
                        width: width - 40,
                        position: "absolute",
                        bottom: 10,
                        left: 0,
                        alignContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      {(dataevent.event.length > 0
                        ? dataevent.event
                        : [default_image]
                      ).map((image, index) => {
                        return (
                          <TouchableHighlight
                            key={index}
                            underlayColor="#f7f7f700"
                            onPress={() => move(index)}
                          >
                            <View
                              style={{
                                height: position === index ? 7 : 5,
                                width: position === index ? 7 : 5,
                                borderRadius: position === index ? 7 : 3,
                                backgroundColor:
                                  position === index ? "#209fae" : "white",
                                marginHorizontal: 2,
                              }}
                            ></View>
                          </TouchableHighlight>
                        );
                      })}
                    </View>
                  )}
                />
                <View
                  style={{
                    width: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    backgroundColor: "#209fae",
                  }}
                >
                  <Text size="label" type="bold" style={{ color: "white" }}>
                    <Gettahun />
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  {render.event
                    ? render.event.map((item, index) => {
                        return (
                          <Ripple
                            onPress={() => {
                              setdataevent(item);
                            }}
                            style={{
                              backgroundColor:
                                dataevent.month === item.month
                                  ? "#DAF0F2"
                                  : null,
                              // borderWidth: 1,
                              width: "25%",
                              // justifyContent: '',
                              alignContent: "center",
                              alignItems: "center",
                              padding: 7,
                              borderTopWidth: 0.5,
                              borderLeftWidth:
                                index !== 0 && index !== 4 && index !== 8
                                  ? 0.5
                                  : 0,
                              // borderRightWidth: 0.5,
                              borderColor: "#209fae",
                            }}
                          >
                            <Text
                              size="description"
                              type="bold"
                              style={{
                                color:
                                  dataevent.month === item.month
                                    ? "#209fae"
                                    : "#646464",
                                textAlign: "center",
                                marginTop: 3,
                              }}
                            >
                              {bulan[index]}
                            </Text>
                          </Ripple>
                        );
                      })
                    : bulan.map((item, index) => {
                        return (
                          <Ripple
                            style={{
                              width: "25%",
                              alignContent: "center",
                              alignItems: "center",
                              padding: 7,
                              borderTopWidth: 0.5,
                              borderLeftWidth:
                                index !== 0 && index !== 4 && index !== 8
                                  ? 0.5
                                  : 0,
                              borderColor: "#209fae",
                            }}
                          >
                            <Text
                              size="description"
                              type="bold"
                              style={{
                                textAlign: "center",
                                marginTop: 3,
                              }}
                            >
                              {item}
                            </Text>
                          </Ripple>
                        );
                      })}
                </View>
              </View>
            </View>
          </View>

          {/* Itinerary */}
          {/* <View
						style={{
							paddingHorizontal: 20,
							paddingVertical: 10,
							flexDirection: 'column',
						}}>
						<View>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}>
								<Text type='bold' size='label' style={{}}>
									{t("Itinerary")}
								</Text>

								<Ripple>
									<Text
										type='bold'
										size='description'
										style={{
											color: '#209fae',
										}}>
										View All
									</Text>
								</Ripple>
							</View>
							<Text
								size='description'
								style={{
									textAlign: 'justify',
								}}>
								Bali is an Indonesian island known for its forested volcanic
								mountains, iconic rice paddies, mountains, iconic rice
							</Text>
						</View>
					</View>
					<View>
						<FlatList
							key={''}
							style={{
								marginBottom: 30,
								// paddingHorizontal: 20,
							}}
							contentContainerStyle={{
								paddingStart: 20,
								paddingEnd: 20,
								// justifyContent: 'space-evenly',
							}}
							horizontal={true}
							data={activitas}
							renderItem={({ item, index }) => (
								<View
									style={{
										// borderWidth: 1,
										borderRadius: 5,
										margin: 2.5,
										width: width - 40,
										// height: width * 0.5,
										shadowColor: '#d3d3d3',
										shadowOffset: { width: 2, height: 2 },
										shadowOpacity: 1,
										shadowRadius: 2,
										elevation: 2,
									}}>
									<ImageBackground
										source={bali2}
										style={{
											height: width * 0.3,
											width: '100%',
											borderTopLeftRadius: 5,
											borderTopRightRadius: 5,
											justifyContent: 'flex-end',
										}}
										imageStyle={{
											height: '100%',
											width: '100%',
											borderTopLeftRadius: 5,
											borderTopRightRadius: 5,
										}}>
										<LinearGradient
											colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.7)']}
											start={{ x: 0, y: 0 }}
											end={{ x: 0, y: 1 }}
											style={{
												width: '100%',
												flexDirection: 'row',
											}}>
											<Text
												style={{
													marginHorizontal: 10,
													marginVertical: 5,
													color: 'white',
												}}>
												Created by : AsepIM
											</Text>
										</LinearGradient>
									</ImageBackground>
									<View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
										<View
											style={{
												flexDirection: 'row',
												alignContent: 'center',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}>
											<Text type='bold' size='label'>
												Sultan jalan-jalan
											</Text>
											<View
												style={{
													flexDirection: 'row',
													alignContent: 'center',
													alignItems: 'center',
												}}>
												<Love
													style={{ marginHorizontal: 2.5 }}
													height={15}
													width={15}
												/>
												<Shareout
													style={{ marginHorizontal: 2.5 }}
													height={15}
													width={15}
												/>
											</View>
										</View>
										<Text>4 day, 3 night</Text>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												alignContent: 'center',
											}}>
											<PinWhite height={15} width={15} />
											<Text style={{ marginLeft: 5 }}>Banten</Text>
										</View>
									</View>
								</View>
							)}
							keyExtractor={(item, index) => index.toString()}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							// extraData={selected}
						/>
					</View>
				 */}
        </View>
      );
    } else {
      return <Article props={props} data={render.article_header[aktif]} />;
    }
  };

  const [dataweather, setData] = useState({});
  const [icons, setIcons] = useState({
    "01d": "w-sunny",
    "02d": "w-partly_cloudy",
    "03d": "w-cloudy",
    "04d": "w-fog",
    "09d": "w-fog_rain",
    "10d": "w-sunny_rainy",
    "11d": "w-thunderstorm",
    "13d": "w-snowflakes",
    "50d": "w-windy",
    "01n": "w-sunny",
    "02n": "w-partly_cloudy",
    "03n": "w-cloudy",
    "04n": "w-fog",
    "09n": "w-fog_rain",
    "10n": "w-sunny_rainy",
    "11n": "w-thunderstorm",
    "13n": "w-snowflakes",
    "50n": "w-windy",
  });

  const _fetchItem = async () => {
    var lat = props.route.params.data.latitude;
    var long = props.route.params.data.longitude;
    var kotanya = props.route.params.data.city_name;

    try {
      if (lat && long) {
        let response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?lat=" +
            lat +
            "&lon=" +
            long +
            "&appid=366be4c20ca623155ffc0175772909bf"
        );
        let responseJson = await response.json();

        setData(responseJson);
      } else {
        let response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            kotanya.toLowerCase() +
            "&appid=366be4c20ca623155ffc0175772909bf"
        );
        let responseJson = await response.json();

        setData(responseJson);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refresh = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await getPackageDetail();
    // await _fetchItem();
    await setloadings(false);
  };

  const Renderheader = ({ dataheader, actives }) => {
    return dataheader &&
      dataheader.CitiesInformation &&
      dataheader.CitiesInformation.article_header &&
      dataheader.CitiesInformation.article_header.length > 0
      ? dataheader.CitiesInformation.article_header.map((item, index) => {
          return (
            <Ripple
              onPress={() => {
                setActives(index);
              }}
              style={{
                // width: '33.333%',
                paddingHorizontal: 20,
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: actives == index ? 3 : 1,
                borderBottomColor: actives == index ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
              }}
            >
              <Text
                size="description"
                type={actives == index ? "bold" : "regular"}
                style={{
                  color: actives == index ? "#209FAE" : "#464646",
                }}
              >
                {item.title}
              </Text>
            </Ripple>
          );
        })
      : null;
  };

  useEffect(() => {
    // props.navigation.setOptions(HeaderComponent);
    refresh();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Loading show={loadings} />
      {/* <NavigationEvents onDidFocus={() => refresh()} /> */}
      <View style={{ height: 55 }}></View>
      {data && data.CitiesInformation ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          stickyHeaderIndices={[2]}
          nestedScrollEnabled={true}
          onScroll={Animated.event([
            {
              nativeEvent: { contentOffset: { y: scrollY } },
            },
          ])}
        >
          <View
            style={{
              height: HEADER_MAX_HEIGHT - 55,
              backgroundColor: "#209fae",
            }}
          ></View>
          <View>
            <View
              style={{
                height: 55,
                width: Dimensions.get("screen").width,
                backgroundColor: "#209fae",
                paddingHorizontal: 20,
                paddingVertical: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <View>
                <Text size="title" type="black" style={{ color: "white" }}>
                  {data && data.CitiesInformation ? (
                    <Truncate
                      text={Capital({ text: data.CitiesInformation.name })}
                      length={20}
                    ></Truncate>
                  ) : null}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PinWhite height={15} width={15} />
                  <Text
                    size="description"
                    type="regular"
                    style={{ marginLeft: 5, color: "white" }}
                  >
                    {data && data.CitiesInformation
                      ? data.CitiesInformation.countries.name.toUpperCase()
                      : "-"}
                  </Text>
                </View>
              </View>
              {dataweather && dataweather.weather ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <FunIcon
                    icon={icons[dataweather.weather[0].icon]}
                    height={50}
                    width={50}
                    style={{
                      bottom: -3,
                    }}
                  />
                  <Text type="bold" size="h5" style={{ color: "white" }}>
                    {(dataweather.main.temp / 10).toFixed(1)}
                  </Text>
                  <View
                    style={{
                      marginTop: 15,
                      alignSelf: "flex-start",
                      height: 6,
                      width: 6,
                      borderWidth: 2,
                      borderRadius: 4,
                      borderColor: "white",
                    }}
                  ></View>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={{
              // height: Dimensions.get('screen').height,
              backgroundColor: "white",
              shadowColor: "#d3d3d3",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 3,
              // zIndex: 99999999,
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                width: "100%",
              }}
            >
              <Ripple
                onPress={() => {
                  setActives("General");
                }}
                style={{
                  // width: '33.333%',
                  paddingHorizontal: 20,
                  alignContent: "center",
                  alignItems: "center",
                  borderBottomWidth: actives == "General" ? 3 : 1,
                  borderBottomColor:
                    actives == "General" ? "#209FAE" : "#EEEEEE",
                  paddingVertical: 15,
                }}
              >
                <Text
                  size="description"
                  type={actives == "General" ? "bold" : "regular"}
                  style={{
                    color: actives == "General" ? "#209FAE" : "#464646",
                  }}
                >
                  {t("General")}
                </Text>
              </Ripple>
              <Renderheader dataheader={data ? data : null} actives={actives} />
            </ScrollView>
          </View>
          <RenderUtama
            aktif={actives}
            render={
              data && data.CitiesInformation ? data.CitiesInformation : {}
            }
          />
        </ScrollView>
      ) : null}
      <Sidebar
        props={props}
        show={showside}
        Data={() => {
          return (
            <View
              style={{
                padding: 10,
                width: "100%",
                justifyContent: "flex-start",
              }}
            ></View>
          );
        }}
        setClose={(e) => setshowside(false)}
      />
      {data && data.CitiesInformation ? (
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Animated.Image
            style={[
              styles.backgroundImage,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslate }],
              },
            ]}
            source={
              data && data.CitiesInformation.cover
                ? { uri: data.CitiesInformation.cover.image }
                : default_image
            }
          />
          <Animated.View style={[styles.overlay]}>
            <Animated.View
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                zIndex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.38)",
                top: 0,
                left: 0,
                opacity: imageOpacity,
              }}
            ></Animated.View>
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              // top: 20,
              zIndex: 9999,
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              height: 55,
              width: Dimensions.get("screen").width,
            }}
          >
            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              onPress={() => props.navigation.goBack()}
              style={{
                height: 50,
              }}
            >
              <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            </Button>

            <View
              style={{
                width: Dimensions.get("screen").width - 90,
                backgroundColor: "rgba(0,0,0,0.2)",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Image
                source={search_button}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  marginHorizontal: 10,
                }}
              ></Image>
              <Input
                value={search}
                style={{
                  height: 20,
                  padding: 0,
                  textAlign: "left",
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "white",
                }}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(x) => setTextc(x)}
                placeholder="Search"
                returnKeyType="search"
                onSubmitEditing={(x) =>
                  props.navigation.navigate("SearchTab", {
                    searchInput: search,
                  })
                }
              />
            </View>

            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              onPress={() => setshowside(true)}
              style={{
                height: 50,
              }}
            >
              <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
            </Button>
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    // backgroundColor: '#f3f3f3',
    flex: 1,
  },
  activeTextStyle: {
    fontFamily: "Lato-Bold",
    color: "#209FAE",
  },
  container: {
    flex: 1,
    height: screenHeight / 2,
  },
  overlay: {
    height: screenHeight / 2,
  },
  textStyle: {
    marginLeft: 10,
    padding: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
    alignSelf: "flex-start",
    position: "absolute",
    fontFamily: "Lato-Regular",
  },
  balanceContainer: {
    padding: 10,
  },
  ImageView: {
    height: Dimensions.get("window").width * 0.47 - 16,

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",

    backgroundColor: "rgba(20,20,20,0.4)",
  },
  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
  },
  destinationMainImageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  destinationMainImage: {
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "black",
  },
  destinationImageView: {
    width: (Dimensions.get("window").width - 37) / 3,
    height: (Dimensions.get("window").width - 37) / 3,
    marginRight: 5,
    borderRadius: 10,
  },
  destinationImage: {
    resizeMode: "cover",
    borderRadius: 10,
  },

  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#209fae",
    overflow: "hidden",
  },
  bar: {
    marginTop: 28,
    height: 32,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    backgroundColor: "transparent",
    color: "white",
    // fontSize: 18,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT + 55,
    resizeMode: "cover",
  },
});
