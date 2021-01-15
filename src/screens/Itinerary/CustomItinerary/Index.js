import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Arrowbackwhite, ArrowRight, Delete } from "../../../assets/svg";
import Timeline from "../../../graphQL/Query/Itinerary/Timelinecustom";
import ListCustom from "../../../graphQL/Query/Itinerary/ListSavedCustom";
import hapuscustomsaved from "../../../graphQL/Mutation/Itinerary/Deletecustomactivitysaved";
import Swipeout from "react-native-swipeout";
import { Button, Text, Loading } from "../../../component";
import { useTranslation } from "react-i18next";

export default function CustomItinerary(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Custom Activity",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Custom Activity",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Regular",
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
  let idItin = props.route.params.idItin;
  let idDay = props.route.params.idDay;
  let itintitle = props.route.params.itintitle;
  let dateitin = props.route.params.dateitin;
  let datadayaktif = props.route.params.datadayaktif;
  let [token, setToken] = useState("");
  let [loading, setloading] = useState(false);

  const loadAsync = async () => {
    setloading(true);
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    // console.log(tkn);

    if (tkn) {
      GetTimeline();
      GetListCustom();
      setloading(false);
    }
  };

  // console.log(idDay);
  const [
    GetTimeline,
    { data: datatimeline, loading: loadingtimeline, error: errortimeline },
  ] = useLazyQuery(Timeline, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { id: idDay },
  });

  const [
    GetListCustom,
    { data: dataSaved, loading: loadingSaved, error: errorSaved },
  ] = useLazyQuery(ListCustom, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutatuindeleted,
    { loading: loadingdelete, data: datadelete, error: errordelete },
  ] = useMutation(hapuscustomsaved, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const GetDuration = ({ data }) => {
    var potong = data.split(":");
    return potong[0] + " h : " + potong[1] + " m";
  };

  // console.log(dataSaved);
  const hapus = async (id) => {
    setloading(true);
    try {
      let response = await mutatuindeleted({
        variables: {
          id: id,
        },
      });
      if (errorSaved) {
        throw new Error("Error Input");
      }
      // console.log(response.data.save_custom);
      if (response.data) {
        if (response.data.delete_activity_saved.code !== 200) {
          throw new Error(response.data.delete_activity_saved.message);
        } else {
          GetListCustom();
        }
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  const swipeoutBtn = (idItem) => {
    return [
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              hapus(idItem);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Delete height={20} width={20} />
            <Text size="small" type="regular" style={{}}>
              {t("delete")}
            </Text>
          </TouchableOpacity>
        ),
      },
    ];
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View
      style={{
        // marginTop: 70,
        flex: 1,
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}
    >
      {/* <NavigationEvents onDidFocus={() => loadAsync()} /> */}
      <Loading show={loading} />

      <View
        style={{
          // position: 'absolute',
          top: 0,
          left: 0,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").width * 0.3,
          backgroundColor: "#f3f3f3",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {/* garis .................................. */}
          <View
            style={{
              marginTop: -35,
              width: Dimensions.get("screen").width - 140,
              borderTopColor: "#646464",
              borderTopWidth: 0.5,
            }}
          ></View>
          {/* garis .................................. */}

          <View
            style={{
              position: "absolute",
              width: Dimensions.get("screen").width - 40,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ alignContent: "center", alignItems: "center" }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#209fae",
                  backgroundColor: "#209fae",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: "white",
                  }}
                >
                  1
                </Text>
              </View>
              <Text
                size="small"
                type="bold"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,
                  color: "#209fae",
                }}
              >
                {t("addCustomActivity")}
              </Text>
            </View>
            <View style={{ alignContent: "center", alignItems: "center" }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#646464",
                  backgroundColor: "#f3f3f3",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text size="description" type="regular" style={{}}>
                  2
                </Text>
              </View>
              <Text
                size="small"
                type="regular"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,
                }}
              >
                {t("inputdestinationdetail")}
              </Text>
            </View>
            <View style={{ alignContent: "center", alignItems: "center" }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#646464",
                  backgroundColor: "#f3f3f3",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text size="description" type="regular" style={{}}>
                  3
                </Text>
              </View>
              <Text
                size="small"
                type="regular"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,
                }}
              >
                {t("selectitinerary")}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 10,
        }}
      >
        <View style={{ width: Dimensions.get("screen").width, padding: 20 }}>
          <Text
            size="title"
            type="bold"
            style={{
              // width: Dimensions.get('screen').width * 0.5,
              marginBottom: 20,
            }}
          >
            {t("addCustomActivity")}
          </Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("CreateCustom", {
                token: token,
                idItin: idItin,
                idDay: idDay,
                datatimeline:
                  datatimeline &&
                  datatimeline.custome_timeline.timeline.length > 0
                    ? datatimeline.custome_timeline.timeline
                    : [],
                jammax:
                  datatimeline && datatimeline.custome_timeline.total_hours
                    ? datatimeline.custome_timeline.total_hours
                    : [],
                itintitle: itintitle,
                dateitin: dateitin,
                datadayaktif: datadayaktif,
              })
            }
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#209fae",
              borderRadius: 5,
              shadowColor: "#d3d3d3",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 2,
              height: 50,
            }}
          >
            <Text size="label" type="bold" style={{}}>
              {t("addNewActivity")}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          <Text
            size="title"
            type="bold"
            style={{
              marginBottom: 5,
            }}
          >
            {t("suggestion")}
          </Text>

          <TouchableOpacity
            // onPress={() =>
            // 	props.navigation.navigate('ChoosePosition', {
            // 		idItin: idItin,
            // 		idDay: idDay,
            // 		token: token,
            // 		datatimeline:
            // 			datatimeline &&
            // 			datatimeline.custome_timeline.timeline.length > 0
            // 				? datatimeline.custome_timeline.timeline
            // 				: [],
            // 		jammax:
            // 			datatimeline && datatimeline.custome_timeline.total_hours
            // 				? datatimeline.custome_timeline.total_hours
            // 				: [],
            // 		itintitle: itintitle,
            // 		dateitin: dateitin,
            // 		datadayaktif: datadayaktif,
            // 	})
            // }
            // disabled
            onPress={() => {
              Alert.alert("Coming soon");
            }}
            style={{
              paddingVertical: 5,

              width: Dimensions.get("screen").width,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width - 40,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#d3d3d3",
                backgroundColor: "white",
                shadowColor: "#d3d3d3",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 2,
                borderRadius: 5,
                flexDirection: "row",
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <View style={{ width: "70%" }}>
                <Text
                  size="label"
                  type="bold"
                  style={{
                    width: "50%",
                  }}
                >
                  {t("backToHotel")}
                </Text>
              </View>
              <View style={{ width: "30%" }}>
                <Text size="label" type="light" style={{}}>
                  {t("duration")}
                </Text>
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: "#209fae",
                  }}
                >
                  1 h : 30 m
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  zIndex: 1,

                  right: -15,
                  width: 25,
                  height: 25,
                  opacity: 1,
                  borderRadius: 12.5,
                  borderWidth: 0.5,
                  borderColor: "#209fae",
                  backgroundColor: "#209fae",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowRight height={10} width={10} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            width: Dimensions.get("screen").width,
            paddingLeft: 20,
          }}
        >
          <Text
            size="title"
            type="bold"
            style={{
              marginBottom: 5,
            }}
          >
            {t("savedCustomActivity")}
          </Text>

          {dataSaved && dataSaved.saved_activity_list.length > 0
            ? dataSaved.saved_activity_list.map((item, index) => {
                return (
                  <Swipeout
                    style={{ backgroundColor: "white" }}
                    left={swipeoutBtn(item.id)}
                  >
                    <View
                      style={{
                        paddingVertical: 5,

                        width: Dimensions.get("screen").width,
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate("ChoosePosition", {
                            idItin: idItin,
                            idDay: idDay,
                            token: token,
                            datatimeline:
                              datatimeline &&
                              datatimeline.custome_timeline.timeline.length > 0
                                ? datatimeline.custome_timeline.timeline
                                : [],
                            jammax:
                              datatimeline &&
                              datatimeline.custome_timeline.total_hours
                                ? datatimeline.custome_timeline.total_hours
                                : [],
                            dataCustom: item,
                            itintitle: itintitle,
                            dateitin: dateitin,
                            datadayaktif: datadayaktif,
                          })
                        }
                        style={{
                          width: Dimensions.get("screen").width - 40,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: "#d3d3d3",
                          backgroundColor: "white",
                          shadowColor: "#d3d3d3",
                          shadowOffset: { width: 2, height: 2 },
                          shadowOpacity: 1,
                          shadowRadius: 2,
                          elevation: 2,
                          borderRadius: 5,
                          flexDirection: "row",
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                        }}
                      >
                        <View style={{ width: "70%" }}>
                          <Text
                            size="label"
                            type="bold"
                            style={{
                              width: "60%",
                            }}
                          >
                            {item.title ? item.title : "-"}
                          </Text>
                        </View>
                        <View style={{ width: "30%" }}>
                          <Text
                            size="label"
                            type="light"
                            style={{
                              color: "#646464",
                            }}
                          >
                            {t("duration")}
                          </Text>
                          <Text
                            size="description"
                            type="regular"
                            style={{
                              color: "#209fae",
                            }}
                          >
                            <GetDuration
                              data={item.duration ? item.duration : "00:00"}
                            />
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        top: 25,
                        right: 7.5,
                        width: 25,
                        height: 25,
                        opacity: 1,
                        borderRadius: 12.5,
                        borderWidth: 0.5,
                        borderColor: "#209fae",
                        backgroundColor: "#209fae",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ArrowRight height={10} width={10} />
                    </View>
                  </Swipeout>
                  // </View>
                );
              })
            : null}
          {/* </View> */}
        </View>
      </ScrollView>
    </View>
  );
}
