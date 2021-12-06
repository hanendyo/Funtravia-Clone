import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  Pressable,
  Alert,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import {
  Button,
  Capital,
  Distance,
  FunIcon,
  Text,
  StatusBar,
  Truncate,
} from "../../../component";
import {
  Mobil,
  More,
  Next,
  Pencilgreen,
  Arrowbackwhite,
  DisketWhite,
  Arrowbackios,
  Complete,
  Stay,
  Flights,
  SavePutih,
} from "../../../assets/svg";
import { default_image } from "../../../assets/png";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useMutation } from "@apollo/client";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/native";
import _ from "lodash";
import Modal from "react-native-modal";
import { RNToasty } from "react-native-toasty";

export default function ReoderDetail({ navigation, route }) {
  const { t } = useTranslation();
  let [headData] = useState(route.params.head);
  let [listData, setListData] = useState([...route.params.child]);
  // console.log(`LISTDATACUI: `, listData);
  let [dayData] = useState(route.params.active);
  let [startTime] = useState(
    route.params.child[0] ? route.params.child[0].time : "00:00"
  );
  let [modalSave, setModalSave] = useState(false);

  const [timeLine, { loading, data, error }] = useMutation(UpdateTimeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${route.params.token}`,
      },
    },
  });

  const saveModal = () => {
    return (
      <Modal
        useNativeDriver={true}
        visible={modalSave}
        onRequestClose={() => setModalSave(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalSave(false)}
          style={{
            width: Dimensions.get("screen").width,
            // width: "100%",
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            alignSelf: "center",
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 140,
            marginHorizontal: 50,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: "10%",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 140,
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <View
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
                backgroundColor: "#f6f6f6",
              }}
            >
              <Text style={{ marginVertical: 15 }} size="title" type="bold">
                {t("areyousure")}
              </Text>
            </View>
            {/* <Text
              style={{
                alignSelf: "center",
                textAlign: "center",
                marginTop: 20,
                marginHorizontal: 10,
              }}
              size="label"
              type="regular"
            >
              {t("alertHapusPost")}
            </Text> */}
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
              <Button
                onPress={() => {
                  saveTimeLine();
                }}
                color="secondary"
                text={t("saved")}
              ></Button>
              <Button
                onPress={() => {
                  setModalSave(false);
                  // navigation.goBack();
                }}
                style={{ marginTop: 5, marginBottom: 8 }}
                variant="transparent"
                text={t("discard")}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // console.log(`DAY--DATA: `, dayData.id);
  // console.log(`LIST--DATA: `, listData);
  // console.log(`CHILD: `, route.params.child);
  // console.log(`ACTIVE: `, route.params.active);

  const saveTimeLine = async () => {
    try {
      let response = await timeLine({
        variables: {
          idday: dayData.id,
          value: JSON.stringify(listData),
        },
      });
      // if (error) {
      //   throw new Error("Error Input");
      // }
      // console.log(`RESPONSE CUI: `, response);
      if (response.data) {
        if (response.data.update_timeline.code !== 200) {
          throw new Error(response.data.update_timeline.message);
        }
        timeLine();
      }
      navigation.dispatch(
        StackActions.replace("ItineraryStack", {
          screen: "itindetail",
          params: {
            itintitle: headData?.name,
            country: headData?.id,
            dateitin: headData?.start_date + "  -  " + headData?.end_date,
            token: token,
            datadayaktif: dayData,
            status: "edit",
          },
        })
      );
      setModalSave(false);
      RNToasty.Show({
        title: t("changeSaved"),
        position: "bottom",
      });
    } catch (error) {
      console.log(`ERROR CUI: `, error);
      setModalSave(false);
      RNToasty.Show({
        title: t("somethingWrong"),
        position: "bottom",
      });
    }
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

  const HitungWaktu = ({ lat1, lon1, lat2, lon2, unit, kecepatan }) => {
    let jarak = Distance({
      lat1: lat1,
      lon1: lon1,
      lat2: lat2,
      lon2: lon2,
      unit: unit,
    });
    let hasil = jarak / kecepatan;
    return hasil.toFixed(0) > 0 ? hasil.toFixed(0) : 1;
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    const x = listData.length - 1;
    return (
      <Pressable
        onLongPress={drag}
        style={{
          backgroundColor: isActive ? "rgba(209, 209, 209, 0.5)" : "#F6F6F6",
          marginTop: -1,
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            height: "100%",
            width: "20%",
            alignContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                height: 25,
                marginRight: 4.2,
                borderRightWidth: index > 0 ? 0.5 : 0,
                borderRightColor: "#6C6C6C",
              }}
            />

            <View
              style={{
                marginTop: -20,
                flexDirection: "row",
                position: "absolute",
                top: 25,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99,
              }}
            >
              <View
                style={{
                  width: "81%",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor: "#daf0f2",
                  borderRadius: 5,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  {item.time ? (
                    <GetStartTime startt={item.time} />
                  ) : (
                    <Text size="description" type="bold">
                      00:00
                    </Text>
                  )}
                </View>
                <View>
                  {item.duration ? (
                    <GetEndTime
                      startt={item.time ? item.time : "00:00"}
                      dur={item.duration ? item.duration : "00:00"}
                    />
                  ) : (
                    <Text size="description" type="bold">
                      00:00
                    </Text>
                  )}
                </View>
              </View>
              {index > 0 &&
              listData[index - 1] &&
              listData[index].latitude == listData[index - 1].latitude &&
              listData[index].longitude == listData[index - 1].longitude ? (
                <View style={{ width: 10, height: 10, marginLeft: 5 }}></View>
              ) : (
                <View
                  style={{
                    zIndex: 99,
                    height: 10,
                    width: 10,
                    marginLeft: 5,
                    borderRadius: 10,
                    backgroundColor: "#209fae",
                    elevation: 3,
                    shadowColor: "#d3d3d3",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                  }}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                marginRight: 4.2,
                borderRightWidth: index < x ? 0.5 : 0,
                borderRightColor: "#6C6C6C",
              }}
            ></View>
          </View>
        </View>
        <View
          style={{
            height: "100%",
            width: "80%",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              paddingLeft: 10,
              paddingRight: 2,
              paddingBottom: 1,
            }}
          >
            {index > 0 &&
            listData[index - 1] &&
            listData[index].latitude == listData[index - 1].latitude &&
            listData[index].longitude == listData[index - 1].longitude ? (
              <View
                style={{
                  width: 20,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    borderLeftWidth: 0.5,
                    borderColor: "#6C6C6C",
                    height: 30,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 25,
                    zIndex: 99,
                    height: 10,
                    width: 10,
                    left: -5,
                    borderRadius: 10,
                    backgroundColor: "#209fae",
                    elevation: 3,
                    shadowColor: "#d3d3d3",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                  }}
                />
                {listData[index + 1] &&
                listData[index].latitude == listData[index + 1].latitude &&
                listData[index].longitude == listData[index + 1].longitude ? (
                  <View
                    style={{
                      marginTop: -1,
                      borderLeftWidth: 0.5,
                      borderColor: "#6C6C6C",
                      flex: 1,
                    }}
                  />
                ) : null}
              </View>
            ) : null}
            <View
              style={{
                marginTop: 5,
                flex: 1,
                borderRadius: 5,
                marginBottom: 2,
                backgroundColor: "#fff",
                padding: 10,
                elevation: 3,
                shadowColor: "#d3d3d3",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                {item.type !== "custom" ? (
                  <Image
                    source={
                      item.images ? { uri: item.images } : { uri: item.icon }
                    }
                    defaultSource={default_image}
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: "cover",
                      borderRadius: 15,
                    }}
                  />
                ) : item.detail_flight ? (
                  <View
                    style={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    <Flights height={25} width={25} />
                  </View>
                ) : item.detail_accomodation ? (
                  <View
                    style={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    <Stay height={25} width={25} />
                  </View>
                ) : item?.icon ? (
                  <View
                    style={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    <FunIcon
                      icon={item.icon}
                      height={30}
                      width={30}
                      style={{
                        borderRadius: 15,
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: 30,
                      width: 30,
                    }}
                  >
                    <FunIcon
                      icon={"i-tour"}
                      height={30}
                      width={30}
                      style={{
                        borderRadius: 15,
                      }}
                    />
                  </View>
                )}
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text size="label" type="bold" style={{}}>
                    {item.name}
                  </Text>
                  <Text>
                    {Capital({
                      text:
                        item.type !== "custom"
                          ? item.type !== "google"
                            ? item.type
                            : "Destination from Google"
                          : "Custom Activity",
                    })}
                  </Text>
                </View>
                <Button
                  size="small"
                  text=""
                  type="circle"
                  variant="transparent"
                  style={{}}
                >
                  <More width={15} height={15} />
                </Button>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingVertical: 5,
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#daf0f2",
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    marginLeft: "15%",
                  }}
                >
                  <Text type="bold">
                    {Getdurasi(item.duration ? item.duration : "00:00:00")}
                  </Text>
                </View>
                <View>
                  <Next width={15} height={15} />
                </View>
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: "#d3d3d3",
                  marginTop: item.note ? 5 : 0,
                  paddingTop: item.note ? 5 : 0,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <Pencilgreen width={10} height={10} /> */}
                  <Text
                    size="small"
                    type="regular"
                    style={{
                      textAlign: "left",
                      marginLeft: 5,
                    }}
                  >
                    {/* {item.note ? item.note : t("addNotes")} */}
                    {item.note ? item.note : ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {index < x &&
          listData[index + 1] &&
          listData[index].latitude !== listData[index + 1].latitude &&
          listData[index].longitude !== listData[index + 1].longitude ? (
            <View
              style={{
                position: "relative",
                left: -5,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                display: isActive ? "none" : "flex",
              }}
            >
              <View
                style={{
                  width: 15,
                  borderTopWidth: 0.5,
                  borderTopColor: "#6C6C6C",
                }}
              ></View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={{
                    marginRight: 5,
                    borderRadius: 5,
                    marginVertical: 2,
                    marginLeft: 1,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    alignItems: "center",
                    elevation: 3,
                    shadowColor: "#d3d3d3",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                  }}
                >
                  <Mobil height={15} width={15} style={{ marginRight: 10 }} />
                  <Text type="bold">
                    <Distance
                      lat1={listData[index].latitude}
                      lon1={listData[index].longitude}
                      lat2={listData[index + 1].latitude}
                      lon2={listData[index + 1].longitude}
                      unit={"km"}
                    />
                  </Text>
                  <Text>km </Text>
                  <Text>- </Text>
                  <Text type="bold">
                    <HitungWaktu
                      lat1={listData[index].latitude}
                      lon1={listData[index].longitude}
                      lat2={listData[index + 1].latitude}
                      lon2={listData[index + 1].longitude}
                      unit={"km"}
                      kecepatan={50}
                    />
                  </Text>
                  <Text>{t("hours")}</Text>
                  {/* <Text>{" in "}</Text>
                  <Text type="bold">{"50"}</Text>
                  <Text>{"km/h"}</Text> */}
                </View>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const handleDrag = async (data) => {
    let tmpData = JSON.parse(JSON.stringify(data));
    tmpData[0].time = startTime;
    let x = 0;
    let order = 1;
    for (let i in tmpData) {
      tmpData[i].order = order;
      if (tmpData[i - 1]) {
        tmpData[i].time = hitungDuration({
          start: tmpData[i - 1].time,
          duration: tmpData[i - 1].duration,
        });
        // tmpData.push(order);
      }
      x++;
      order++;
    }
    isEdited = true;
    // if (x == tmpData.length) {
    setListData(tmpData);
    // }
    // saveTimeLine();
  };
  // console.log(`SATU: `, listData);
  // console.log(`DUA: `, listData[1]);

  const hitungDuration = ({ start, duration }) => {
    duration = duration ? duration.split(":") : "00:00:00";
    let starttime = start ? start.split(":") : "00:00:00";
    let jam = parseFloat(starttime[0]) + parseFloat(duration[0]);
    let menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
    if (menit > 59) {
      menit = menit - 60;
    }

    return (
      (jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam) +
      ":" +
      (menit < 10 ? "0" + menit : menit) +
      ":00"
    );
  };

  let isEdited = false;
  const _backHandler = () => {
    // console.log(isEdited);
    if (isEdited) {
      Alert.alert("Data Not Saved", "Are you sure ?", [
        {
          text: "Yes",
          onPress: () => navigation.goBack(),
        },
        { text: "No", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: () => {
      return (
        <View style={{ marginBottom: 5 }}>
          <View style={{ alignItems: "center" }}>
            <Text type="bold" size="title" style={{ color: "#FFF" }}>
              <Truncate
                length="25"
                text={headData?.name ? headData.name : ""}
              />
            </Text>

            <Text
              type="regular"
              size="label"
              style={{ color: "#FFF" }}
            >{`Day ${dayData.day}`}</Text>
          </View>
        </View>
      );
    },
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      marginLeft: 10,
    },
    headerRightContainerStyle: {
      marginRight: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => _backHandler()}
        style={{
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={20} width={20}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
    headerRight: () => (
      <Pressable
        onPress={() => setModalSave(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SavePutih width={25} height={25} />
        <Text
          style={{
            color: "#FFF",
            marginLeft: 5,
          }}
        >
          {t("save")}
        </Text>
      </Pressable>
    ),
  };
  useEffect(() => {
    navigation.setOptions(HeaderComponent);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      {/* <StatusBar backgroundColor="#209FAE" barStyle="light-content" /> */}
      <DraggableFlatList
        data={listData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.id}`}
        onDragEnd={({ data }) => handleDrag(data)}
        contentContainerStyle={{
          padding: 15,
        }}
      />
      {saveModal()}
    </SafeAreaView>
  );
}
