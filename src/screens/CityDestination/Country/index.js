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
  AsyncStorage,
} from "react-native";
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
import { Truncate } from "../../../component";
import Ripple from "react-native-material-ripple";
import { Text, Button } from "../../../component";
import Article from "./Article";
import { FunIcon, Loading } from "../../../component";
import Sidebar from "../../../component/src/Sidebar";
import CountrisInformation from "../../../graphQL/Query/Countries/Countrydetail";
import { useTranslation } from "react-i18next";

const screenHeight = Dimensions.get("window").height;
let HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.3;
let HEADER_MIN_HEIGHT = 55;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function Country(props) {
  const { t, i18n } = useTranslation();
  const { width, height } = Dimensions.get("screen");
  const [active, setActive] = useState("Map");
  const [actives, setActives] = useState("General");
  const [actived, setActived] = useState("About");
  const [loadings, setloadings] = useState(true);
  let [search, setTextc] = useState("");
  let [showside, setshowside] = useState(false);

  let [scrollY, setscrollY] = useState(new Animated.Value(0));
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
    CountrisInformation,
    {
      variables: {
        id: props.route.params.data.id,
      },
    }
  );

  const refresh = async () => {
    await getPackageDetail();
    await setloadings(false);
  };

  useEffect(() => {
    // props.navigation.setOptions(HeaderComponent);
    refresh();
  }, []);

  const rendertabGlace = (dataaktif, kiriman) => {
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
              {t("Whentogo")}
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

  const Renderfact = ({ data }) => {
    var y = data.length;
    var x = 2;
    var z = 3;
    var remainder = y % x;
    var remainderz = y % z;
    return (
      <FlatList
        numColumns={
          data.length && data.length > 1
            ? data.length === 2 && remainder === 0
              ? 2
              : 3
            : 1
        }
        data={data}
        renderItem={({ item, index }) => {
          return (
            <Ripple
              onPress={() => {
                Alert.alert("coming soon");
              }}
              style={{
                width:
                  data.length && data.length > 1
                    ? data.length === 2 && remainder === 0
                      ? "50%"
                      : "33.33%"
                    : "100%",

                alignContent: "center",
                alignItems: "center",
                padding: 7,
                borderLeftWidth:
                  index !== 0 && index !== 3 && index !== 6 && index !== 9
                    ? 0.5
                    : 0,
                borderColor: "#209fae",
              }}
            >
              <Text
                size="description"
                type="bold"
                style={{ textAlign: "center", marginTop: 3, width: "100%" }}
              >
                {item.name}
              </Text>
            </Ripple>
          );
        }}
      />
    );
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
                    lineHeight: 21,
                  }}
                >
                  {render ? render.description : null}
                </Text>
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
              {render.name}
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
              {active ? rendertabGlace(active, render) : null}
            </View>
          </View>
          {/* Travel Jurnal */}
          {render.journal ? (
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
                {render.journal ? (
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
                          onPress={() => {
                            props.navigation.navigate("DetailJournal", {
                              dataPopuler: item,
                            });
                          }}
                          style={{
                            flexDirection: "row",
                            width: width - 80,
                            height: width * 0.2,
                          }}
                        >
                          <Image
                            source={
                              item.picture
                                ? { uri: item.picture }
                                : default_image
                            }
                            style={{
                              height: width * 0.15,
                              width: width * 0.15,
                              borderRadius: 5,
                            }}
                          ></Image>
                          <View
                            style={{ width: "100%", paddingHorizontal: 10 }}
                          >
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
                              <Text>{item.text}</Text>
                              <Love height={15} width={15} />
                            </View>
                          </View>
                        </Ripple>
                      );
                    }}
                  />
                ) : (
                  <View
                    style={{
                      height: "100%",
                      width: "100%",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Travel Journal Empty</Text>
                  </View>
                )}
              </View>
            </View>
          ) : null}
          {/* Destination */}
          {render.city ? (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                flexDirection: "column",
              }}
            >
              <View>
                <Text type="bold" size="label" style={{}}>
                  {t("popularDestination")}
                </Text>
                <Text
                  size="description"
                  style={{
                    textAlign: "justify",
                  }}
                >
                  Bali is an Indonesian island known
                </Text>
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

                    padding: 10,
                  }}
                >
                  {render.city ? (
                    <View>
                      <Text
                        size="label"
                        type="bold"
                        style={{ textAlign: "center", marginTop: 3 }}
                      >
                        {render.city[0].name}
                      </Text>
                      <Ripple
                        onPress={() => {
                          props.navigation.navigate("CityDetail", {
                            data: {
                              city_id: render.city[0].id,
                              city_name: render.city[0].name,
                            },
                            exParam: true,
                          });
                        }}
                        style={{
                          height: width * 0.4,
                          width: "100%",
                          borderRadius: 10,
                          marginVertical: 5,
                        }}
                      >
                        <Image
                          style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: 10,
                          }}
                          source={
                            render.city[0].image
                              ? { uri: render.city[0].image }
                              : default_image
                          }
                        ></Image>
                      </Ripple>
                    </View>
                  ) : null}
                  <View
                    style={{
                      width: "100%",
                      flexWrap: "wrap",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {render.city && render.city.length > 0
                      ? render.city.map((item, index) => {
                          return index > 0 ? (
                            <Ripple
                              onPress={() => {
                                props.navigation.navigate("CityDetail", {
                                  data: {
                                    city_id: item.id,
                                    city_name: item.name,
                                  },
                                  exParam: true,
                                });
                              }}
                              style={{
                                width: (width - 60) / 4,
                                alignContent: "center",
                                alignItems: "center",
                                padding: 2,
                                borderColor: "#209fae",
                              }}
                            >
                              <Image
                                style={{
                                  borderRadius: 10,
                                  height: (width - 75) / 4,
                                  width: (width - 75) / 4,
                                }}
                                source={
                                  item.image
                                    ? { uri: item.image }
                                    : default_image
                                }
                              ></Image>
                              <Text
                                size="small"
                                type="bold"
                                style={{ textAlign: "center", marginTop: 3 }}
                              >
                                <Truncate text={item.name} length={16} />
                              </Text>
                            </Ripple>
                          ) : null;
                        })
                      : null}
                  </View>
                </View>
              </View>
            </View>
          ) : null}
          {/* facts */}
          {render.article_type && render.article_type.length > 0 ? (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                flexDirection: "column",
              }}
            >
              <View>
                <Text type="bold" size="label" style={{}}>
                  {render.name} {t("unique facts")}
                </Text>
                <Text
                  size="description"
                  style={{
                    textAlign: "justify",
                  }}
                >
                  Indonesian island known
                </Text>
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
                    borderLeftWidth: 0.5,
                    borderRightWidth: 0.5,
                    borderBottomWidth: 0.5,
                    borderColor: "#209fae",
                  }}
                >
                  <Image
                    style={{
                      height: width * 0.4,
                      width: "100%",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                    source={default_image}
                  ></Image>
                  <View
                    style={{
                      width: "100%",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 40,
                      backgroundColor: "#22ba64",
                    }}
                  >
                    <Text size="label" type="bold" style={{ color: "white" }}>
                      Indonesian Facts
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      flexWrap: "wrap",
                      flexDirection: "row",
                    }}
                  >
                    <Renderfact
                      data={
                        render.article_type && render.article_type.length > 0
                          ? render.article_type
                          : []
                      }
                    />
                  </View>
                </View>
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
        </View>
      );
    } else {
      return <Article props={props} data={render.article_header[aktif]} />;
    }
  };

  return (
    <View style={styles.main}>
      <Loading show={loadings} />
      <View style={{ height: 55 }}></View>
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
                {data && data.country_detail ? (
                  <Truncate
                    text={data.country_detail.name}
                    length={20}
                  ></Truncate>
                ) : null}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
              }}
            ></View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "white",
            shadowColor: "#d3d3d3",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
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
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: actives == "General" ? 3 : 1,
                borderBottomColor: actives == "General" ? "#209FAE" : "#EEEEEE",
                paddingVertical: 15,
                paddingHorizontal: 20,
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
            {data &&
            data.country_detail &&
            data.country_detail.article_header &&
            data.country_detail.article_header.length > 0
              ? data.country_detail.article_header.map((item, index) => {
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
                        borderBottomColor:
                          actives == index ? "#209FAE" : "#EEEEEE",
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
              : null}
          </ScrollView>
        </View>
        <RenderUtama
          aktif={actives}
          render={data && data.country_detail ? data.country_detail : {}}
        />
      </ScrollView>

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
            data && data.country_detail && data.country_detail.images.length
              ? { uri: data.country_detail.images[0].image }
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
              // opacity: 0.4,
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
                fontFamily: "lato-reg",
                fontSize: 14,
                color: "white",
              }}
              placeholderTextColor={"white"}
              underlineColorAndroid="transparent"
              onChangeText={(x) => setTextc(x)}
              placeholder={t("search")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    flex: 1,
  },
  activeTextStyle: {
    fontFamily: "lato-bold",
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
    fontFamily: "lato-reg",
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
