import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  Arrowbackwhite,
  ArrowRight,
  Delete,
  More,
  New,
  Xhitam,
} from "../../../assets/svg";
import Timeline from "../../../graphQL/Query/Itinerary/Timelinecustom";
import ListCustom from "../../../graphQL/Query/Itinerary/ListSavedCustom";
import hapuscustomsaved from "../../../graphQL/Mutation/Itinerary/Deletecustomactivitysaved";
import Swipeout from "react-native-swipeout";
import { Button, Text, Loading, FunIcon, Capital } from "../../../component";
import { useTranslation } from "react-i18next";
import MapView, { Marker } from "react-native-maps";

export default function detailCustomItinerary(props) {
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: () => (
      <View>
        <Text type="bold" size="title" style={{ color: "#fff" }}>
          Activity Details
        </Text>
        <Text
          style={{
            color: "#fff",
          }}
        >
          {props.route.params.nameitin}
        </Text>
      </View>
    ),
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
  let [dataParent, setDataParent] = useState({});
  let [dataChild, setDataChild] = useState([]);

  const pecahData = async (data, id) => {
    let dataX = [];
    let parent = null;
    let dataparents = {};
    // console.log(data);
    let index = await data.findIndex((key) => key.id === id);
    if (data[index].parent === true) {
      parent = data[index].id;
    } else {
      parent = data[index].parent_id;
    }
    for (var i of data) {
      if (i.id === parent) {
        //   dataX.push(i);
        dataparents = { ...i };
      } else if (i.parent_id === parent) {
        dataX.push(i);
      }
    }

    await setDataParent(dataparents);
    await setDataChild(dataX);
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      pecahData(props.route.params.data, props.route.params.id);
    });
    return unsubscribe;
  }, [props.navigation]);

  console.log(dataParent);

  const Getdurasi = (durasi) => {
    durasi = durasi.split(":");
    return (
      parseFloat(durasi[0]) +
      " " +
      t("hours") +
      " " +
      (parseFloat(durasi[1]) > 0
        ? parseFloat(durasi[1]) + " " + t("minutes")
        : " ")
    );
  };

  const GetStartTime = ({ startt }) => {
    var starttime = startt.split(":");

    return (
      <Text size="description" type="bold" style={{}}>
        {starttime[0]}:{starttime[1]}
      </Text>
    );
  };

  const GetEndTime = ({ startt, dur }) => {
    var duration = dur.split(":");
    var starttime = startt.split(":");

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
    if (menit > 59) {
      menit = menit - 60;
    }

    return (
      <Text size="description" type="bold" style={{}}>
        {jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam}:
        {menit < 10 ? "0" + menit : menit}
      </Text>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: "#fff",
      }}
    >
      <FlatList
        data={dataChild}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}
        ListHeaderComponent={() => (
          <View
            style={{
              borderRadius: 5,
              backgroundColor: "#fff",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderBottomColor: "#f1f1f1",
                borderBottomWidth: 0.5,
              }}
            >
              {dataParent.icon ? (
                <FunIcon
                  icon={dataParent.icon}
                  height={30}
                  width={30}
                  style={{
                    borderRadius: 15,
                  }}
                />
              ) : (
                <FunIcon
                  icon={"i-tour"}
                  height={30}
                  width={30}
                  style={{
                    borderRadius: 15,
                  }}
                />
              )}
              <TouchableOpacity
                style={{ flex: 1, paddingHorizontal: 10 }}
                // onLongPress={status !== "saved" ? drag : null}
              >
                <Text size="label" type="bold" style={{}}>
                  {dataParent.name}
                </Text>
                <Text>
                  {Capital({
                    text:
                      dataParent.type !== "custom"
                        ? dataParent.type !== "google"
                          ? dataParent.type
                          : "Destination from Google"
                        : "Custom Activity",
                  })}
                </Text>
              </TouchableOpacity>
              <Button
                size="small"
                text=""
                type="circle"
                variant="transparent"
                style={{}}
                // onPress={() => {
                //   bukamodalmenu(item.id, item.type);
                // }}
              >
                <More width={15} height={15} />
              </Button>
            </View>
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,

                borderBottomColor: "#f1f1f1",
                borderBottomWidth: 0.5,
              }}
            >
              <Text>Location</Text>
              <MapView
                style={{
                  // flex: 1,
                  marginTop: 10,
                  width: "100%",
                  marginBottom: 10,
                  height: 80,
                  //   borderRadius: 10,
                }} //window pake Dimensions
                region={{
                  latitude: parseFloat(dataParent.latitude),
                  longitude: parseFloat(dataParent.longitude),
                  latitudeDelta: 0.007,
                  longitudeDelta: 0.007,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(dataParent.latitude),
                    longitude: parseFloat(dataParent.longitude),
                  }}
                  title={dataParent.name}
                  description={dataParent.address}
                  onPress={() => {
                    Linking.openURL(
                      Platform.OS == "ios"
                        ? "maps://app?daddr=" +
                            dataParent.latitude +
                            "+" +
                            dataParent.longitude
                        : "google.navigation:q=" +
                            dataParent.latitude +
                            "+" +
                            dataParent.longitude
                    );
                  }}
                />
              </MapView>
              <Text>{dataParent.address}</Text>
            </View>
            <View
              style={{
                paddingVertical: 10,

                paddingHorizontal: 15,
                borderBottomColor: "#f1f1f1",
                borderBottomWidth: 0.5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    marginRight: 40,
                  }}
                >
                  <Text>Duration :</Text>
                  <View
                    style={{
                      marginTop: 10,
                      //   width: "80%",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      backgroundColor: "#daf0f2",
                      borderRadius: 5,
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text type="bold">
                      {Getdurasi(
                        dataParent.duration ? dataParent.duration : "00:00:00"
                      )}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text>Time :</Text>
                  <View
                    style={{
                      marginTop: 10,
                      //   width: "80%",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      backgroundColor: "#daf0f2",
                      borderRadius: 5,
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity>
                      {dataParent.time ? (
                        <GetStartTime startt={dataParent.time} />
                      ) : (
                        <Text size="description" type="bold">
                          00:00
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity>
                      {dataParent.duration ? (
                        <GetEndTime
                          startt={dataParent.time ? dataParent.time : "00:00"}
                          dur={
                            dataParent.duration ? dataParent.duration : "00:00"
                          }
                        />
                      ) : (
                        <Text size="description" type="bold">
                          00:00
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,

                borderBottomColor: "#f1f1f1",
                borderBottomWidth: 0.5,
              }}
            >
              <Text>Notes</Text>
              <Text style={{ marginTop: 10 }}>{dataParent.note}</Text>
            </View>
            <View
              style={{
                paddingVertical: 10,

                paddingHorizontal: 15,
                borderBottomColor: "#f1f1f1",
                borderBottomWidth: 0.5,
              }}
            >
              <View style={{}}>
                <Text
                  size="label"
                  type="bold"
                  style={
                    {
                      // marginTop: 20,
                    }
                  }
                >
                  {t("Attachment")}
                </Text>
                <View
                  style={{
                    paddingTop: 5,
                  }}
                >
                  {dataChild.map((data, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          <Text>{index + 1}. </Text>
                          <Text>{data.name}</Text>
                        </View>
                        <Xhitam
                          style={{
                            marginRight: 10,
                          }}
                          width={5}
                          height={5}
                        />
                      </View>
                    );
                  })}
                </View>

                <View style={{ flex: 1, marginVertical: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      //   pickFile();
                    }}
                    style={{
                      width: "100%",
                      // borderColor: "black",
                      borderWidth: 1,
                      borderStyle: "dashed",
                      borderRadius: 5,
                      borderColor: "#d3d3d3",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      paddingVertical: 10,
                      flexDirection: "row",
                      marginBottom: 5,
                    }}
                  >
                    <New height={15} width={15} />
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#d1d1d1",
                      }}
                    >
                      Choose File
                    </Text>
                  </TouchableOpacity>
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#d1d1d1",
                    }}
                  >
                    {t("Upload your flight ticket, hotel voucher, etc.")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        renderItem={({ item, index }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
