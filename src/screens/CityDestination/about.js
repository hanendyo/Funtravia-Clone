import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";

import { Arrowbackwhite, Garuda, Calendargreen } from "../../assets/svg";
import { default_image } from "../../assets/png";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";

export default function about(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "About",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "About",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const { t, i18n } = useTranslation();
  const [actives, setActives] = useState("History");
  const [index, setindex] = useState(0);

  let [Event, setEvent] = useState([
    {
      id: 1,
      event: ["Java Jass festival"],
      month: "Juni",
    },
    {
      id: 2,
      event: ["Jember carnaval", "Tour De Ijen Malang"],
      month: "Juli",
    },
  ]);

  let [Transportation, setTransportation] = useState([
    {
      name: "Mass Rapid Transportation (MRT)",
      desc: "Transportasi umum kereta",
    },
    {
      name: "Trans Jakarta",
      desc: "Transportasi umum bus",
    },
    {
      name: "Light Rail Trans (LRT)",
      desc: "Transportasi umum kereta",
    },
    {
      name: "Bajaj",
      desc: "Transportasi umum kendaraan roda tiga",
    },
    {
      name: "Commuter Line (KRL)",
      desc: "Transportasi umum kereta",
    },
    {
      name: "Bus",
      desc: "Transportasi umum bus",
    },
    {
      name: "Taxi",
      desc: "Transportasi umum mobil",
    },
    {
      name: "Online Transportation",
      desc: "Transportasi umum online mobil dan motor",
    },
  ]);

  const Rendercontent = ({ active }) => {
    if (active === "History") {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
          >
            <View>
              <Text
                size="h5"
                type="bold"
                style={{
                  // fontSize: 24,
                  // fontFamily: "Lato-Bold",
                  color: "#464646",
                }}
              >
                INDONESIA
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text>bendera</Text>
                <Text
                  size="label"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 16,
                    color: "#464646",
                  }}
                >
                  ID
                </Text>
              </View>
            </View>
            <Garuda height={50} width={50}></Garuda>
          </View>
          <View>
            <Text
              size="label"
              type="regular"
              style={{
                paddingHorizontal: 20,
                marginTop: 20,
                // fontFamily: "Lato-Regular",
                // fontSize: 16,
                textAlign: "justify",
                color: "#464646",
              }}
            >
              Jika kamu menyukai berkunjung ke pantai maka Serang merupakan
              destinasi wisata favorit untuk anda kunjungi karena lorem ipsu
              dolor sit amet koko ni wa restu ning omegawo inaike kko lorem
              dolor buvak zlatko kovac lorem pisum sokil gob kane betul ini
              bikin nagih ke serang dengan mengunjungi pantai nya yg amat
              cantik.
            </Text>
            <View
              style={{
                paddingHorizontal: 20,
                marginVertical: 15,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "50%",
                  // borderBottomWidth: 1,
                  // borderBottomColor: '#d1d1d1',
                  paddingVertical: 10,
                }}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 14,
                    color: "#464646",
                  }}
                >
                  {t("area")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#464646",
                  }}
                >
                  2.000.000 Ha
                </Text>
                <Text
                  size="label"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 14,
                    color: "#464646",
                  }}
                >
                  {t("provinceNumber")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#464646",
                  }}
                >
                  {`34 ${t("province")}`}
                </Text>
              </View>
              <View
                style={{
                  width: "50%",
                  // borderBottomWidth: 1,
                  // borderBottomColor: '#d1d1d1',
                  paddingVertical: 10,
                }}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 14,
                    color: "#464646",
                  }}
                >
                  {t("headOfState")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#464646",
                  }}
                >
                  President
                </Text>
                <Text
                  size="label"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 14,
                    color: "#464646",
                  }}
                >
                  {t("anthem")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#464646",
                  }}
                >
                  Indonesia Raya
                </Text>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                width: "100%",
                borderWidth: 1,
                borderColor: "#d1d1d1",
                borderRadius: 5,
                padding: 20,
              }}
            >
              <View
                style={{
                  width: "100%",
                  borderBottomWidth: 1,
                  borderBottomColor: "#d1d1d1",
                  paddingVertical: 10,
                }}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 14,
                    color: "#d1d1d1",
                    marginBottom: 10,
                  }}
                >
                  {t("timezone")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#464646",
                  }}
                >
                  GMT + 08:00
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  borderBottomWidth: 1,
                  borderBottomColor: "#d1d1d1",
                  paddingVertical: 10,
                }}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 14,
                    color: "#d1d1d1",
                    marginBottom: 10,
                  }}
                >
                  {t("currency")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#464646",
                  }}
                >
                  Rupiah {"("}IDR{")"}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  // borderBottomWidth: 1,
                  // borderBottomColor: '#d1d1d1',
                  paddingVertical: 10,
                }}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 14,
                    color: "#d1d1d1",
                    marginBottom: 5,
                  }}
                >
                  {t("language")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#464646",
                  }}
                >
                  Bahasa Indonesia, Bahasa Daerah
                </Text>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
              }}
            >
              <Text
                type="bold"
                size="description"
                style={{
                  // fontFamily: "Lato-Bold",
                  // fontSize: 14,
                  // color: '#d1d1d1',
                  marginTop: 15,
                  marginBottom: 10,
                  color: "#464646",
                }}
              >
                {t("bestTime")}
              </Text>
              {Event && Event.length > 0 ? (
                <View>
                  {Event.map((value, i) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Calendargreen
                          height={10}
                          width={10}
                          style={{ marginRight: 10 }}
                        />
                        <Text
                          type="bold"
                          size="description"
                          style={{
                            // fontFamily: "Lato-Bold",
                            // fontSize: 14,
                            color: "#464646",
                            // color: '#d1d1d1',
                            // marginTop:15,
                            // marginBottom:10
                          }}
                        >
                          {value.month}{" "}
                        </Text>
                        <Text
                          type="regular"
                          size="description"
                          style={{
                            // fontFamily: "Lato-Regular",
                            // fontSize: 14,
                            color: "#464646",
                            // color: '#d1d1d1',
                            // marginTop:15,
                            // marginBottom:10
                          }}
                        >
                          {"("}{" "}
                          {value.event.map((x, y) => {
                            if (y !== value.event.length - 1) {
                              return x + " & ";
                            } else {
                              return x;
                            }
                          })}{" "}
                          {")"}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </View>
            <View
              style={{
                paddingHorizontal: 20,
              }}
            >
              <Text
                type="bold"
                size="description"
                style={{
                  // fontFamily: "Lato-Bold",
                  // fontSize: 14,
                  // color: '#d1d1d1',
                  color: "#464646",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                {t("transportation")}
              </Text>
              {Transportation && Transportation.length ? (
                <FlatList
                  key={""}
                  contentContainerStyle={{ justifyContent: "space-between" }}
                  horizontal={false}
                  data={Transportation}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        marginVertical: 10,
                        flexDirection: "row",
                        width: (Dimensions.get("screen").width - 40) / 2,
                      }}
                    >
                      <Image
                        source={default_image}
                        style={{
                          height: 40,
                          width: 40,
                          resizeMode: "cover",
                          marginRight: 10,
                        }}
                      ></Image>
                      <View>
                        <Text
                          type="bold"
                          size="small"
                          style={{
                            fontFamily: "Lato-Bold",
                            fontSize: 10,
                            width: "70%",
                            color: "#464646",
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Lato-Regular",
                            fontSize: 10,
                            color: "#464646",
                            width: "70%",
                          }}
                        >
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                  )}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              ) : null}
              <View style={{ height: 30 }}></View>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);

    if (props.route.params.active) {
      setActives(props.route.params.active);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        // scrol
        style={
          {
            // marginTop: 10,
            // borderWidth: 1,
            // borderColor: 'red',
            // paddingHorizontal: 20,
          }
        }
        contentContainerStyle={
          {
            // paddingHorizontal: 20,
          }
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "#DAF0F2",
            width: "100%",
          }}
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
        >
          <Ripple
            onPress={() => {
              setActives("History");
            }}
            style={{
              // width: '33.333%',
              paddingHorizontal: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type={actives == "History" ? "bold" : "regular"}
              style={{
                paddingVertical: 15,
                borderBottomWidth: actives == "History" ? 3 : 1,
                borderBottomColor: actives == "History" ? "#14646E" : "#DAF0F2",
                color: actives == "History" ? "#14646E" : "#464646",
              }}
            >
              History
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("whentogo");
            }}
            style={{
              // width: '33.333%',
              paddingHorizontal: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type={actives == "whentogo" ? "bold" : "regular"}
              style={{
                paddingVertical: 15,
                borderBottomWidth: actives == "whentogo" ? 3 : 1,
                borderBottomColor:
                  actives == "whentogo" ? "#14646E" : "#DAF0F2",
                color: actives == "whentogo" ? "#14646E" : "#464646",
              }}
            >
              When to go
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("localfood");
            }}
            style={{
              // width: '33.333%',
              paddingHorizontal: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type={actives == "localfood" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "localfood" ? 3 : 1,
                borderBottomColor:
                  actives == "localfood" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "localfood" ? "#14646E" : "#464646",
              }}
            >
              Local food
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("art");
            }}
            style={{
              // width: '33.333%',
              paddingHorizontal: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type={actives == "art" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "art" ? 3 : 1,
                borderBottomColor: actives == "art" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "art" ? "#14646E" : "#464646",
              }}
            >
              Art & Culture
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("souvenir");
            }}
            style={{
              // width: '33.333%',
              paddingHorizontal: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type={actives == "souvenir" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "souvenir" ? 3 : 1,
                borderBottomColor:
                  actives == "souvenir" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "souvenir" ? "#14646E" : "#464646",
              }}
            >
              Souvenir
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("telecomunication");
            }}
            style={{
              // width: '33.333%',
              paddingHorizontal: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type={actives == "telecomunication" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "telecomunication" ? 3 : 1,
                borderBottomColor:
                  actives == "telecomunication" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "telecomunication" ? "#14646E" : "#464646",
              }}
            >
              Telecomunication
            </Text>
          </Ripple>
        </ScrollView>
        <Rendercontent active={actives} />
      </ScrollView>
    </SafeAreaView>
  );
}
