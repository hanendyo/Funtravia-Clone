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
  NativeModules,
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
import DeviceInfo from "react-native-device-info";
import { default_image } from "../../../assets/png";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useMutation } from "@apollo/client";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/native";
import _ from "lodash";
import Modal from "react-native-modal";
import { RNToasty } from "react-native-toasty";
import { useSelector } from "react-redux";

export default function ReoderDetail({ navigation, route }) {
  const { t } = useTranslation();
  let [headData] = useState(route.params.head);
  let [listData, setListData] = useState([...route.params.child]);
  const token = useSelector((data) => data.token);
  const Notch = DeviceInfo.hasNotch();
  const deviceId = DeviceInfo.getModel();
  const NotchAndro = NativeModules.StatusBarManager
    ? NativeModules.StatusBarManager.HEIGHT > 24
    : false;
  let [dayData] = useState(route.params.active);
  let [startTime] = useState(
    route.params.child[0] ? route.params.child[0].time : "00:00"
  );
  let [modalSave, setModalSave] = useState(false);

  const [timeLine, { loading, data, error }] = useMutation(UpdateTimeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
    let hasils = parseFloat(hasil).toFixed(2);

    let bahan = hasils.split(".");

    let jam = parseFloat(bahan[1]);

    return (
      (hasil.toFixed(0) > 1 ? hasil.toFixed(0) + " " + t("hr") : "") +
      (jam > 0 && jam < 60
        ? " " + jam + " " + t("min")
        : hasil > 0.6
        ? "1" + t("hr") + " " + (bahan[1] - 60) + " " + t("min")
        : jam
        ? " " + (jam - 60) + " " + t("min")
        : "1" + " " + t("min"))
    );
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
              {item.detail_accomodation ? null : (
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
              )}
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
              {item.detail_accomodation ? null : (
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
              )}

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
                  {/* <Text>{t("hours")}</Text> */}
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
    let tempdata = JSON.parse(JSON.stringify(data));

    tempdata[0].time = startTime;
    let x = 0;
    let order = 1;
    if (spliceDataStay.length > 0) {
      order = 2;
    }

    for (let y in tempdata) {
      tempdata[y].order = order;
      if (tempdata[y - 1]) {
        // longitude & latitude index sebelum custom
        let LongBefore = tempdata[y - 1].longitude;
        let LatBefore = tempdata[y - 1].latitude;
        // longitude & latitude index custom
        let LongCurrent = tempdata[y].longitude;
        let LatCurrent = tempdata[y].latitude;
        if (LongBefore == LongCurrent || LatBefore == LatCurrent) {
          var newtime = tempdata[y - 1].time;
        } else {
          // rumus hitung jarak
          let jarak = Distance({
            lat1: LatBefore,
            lon1: LongBefore,
            lat2: LatCurrent,
            lon2: LongCurrent,
            unit: "km",
          });
          // rumus hitung waktu
          let waktutemp = jarak / 50;
          let waktu = parseFloat(waktutemp).toFixed(2);
          // pecah hasil waktu
          let split = waktu.split(".");

          let jamtemp = "";
          let menittemp = "";

          if (split[0] > 1) {
            jamtemp = split[1];
            if (split[1] > 0 && split[1] < 60) {
              menittemp = split[1];
            } else {
              jamtemp = split[0] + 1;
              menittemp = split[1] - 60;
            }
          } else {
            if (waktu > 0.6) {
              jamtemp = 1;
              menittemp = split[1] > 60 ? split[1] - 60 : split[1];
            } else {
              jamtemp = 0;
              menittemp = split[1] ? split[1] : 1;
            }
          }
          let time = tempdata[y - 1].time;
          let splittime = time.split(":");
          // let durasitemp = `${jamtemp}:${menittemp}`;
          let durationold = tempdata[y - 1].duration;
          let splitdurations = durationold.split(":");

          //menit total untuk mendapatkan menit yang lebih dari 59
          let menitotal =
            parseFloat(splittime[1]) +
            parseFloat(splitdurations[1]) +
            parseFloat(menittemp);

          let newjam = parseFloat(jamtemp) + parseFloat(splittime[0]);
          let newmenit = parseFloat(menittemp) + parseFloat(splittime[1]);
          var newtime =
            menitotal > 59
              ? `${newjam + 1}:${newmenit - 60}`
              : `${newjam}:${newmenit}`;
          if (jamtemp > 23) {
            Alert.alert("Opss", t("AktivitasFull"), [
              {
                text: "OK",
                onPress: () =>
                  navigation.dispatch(
                    StackActions.replace("ItineraryStack", {
                      screen: "ReorderDetail",
                      params: {
                        head: route.params.head,
                        child: route.params.child,
                        active: route.params.active,
                        token: token,
                      },
                    })
                  ),
              },
            ]);
          }
        }

        tempdata[y].time = hitungDuration({
          start: newtime,
          duration: tempdata[y - 1].duration,
        });
        // tmpData.push(order);
      }
      x++;
      order++;
    }
    isEdited = true;
    // if (x == tmpData.length) {
    setListData(tempdata);
    // }
    // saveTimeLine();
  };

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

  // const HeaderComponent = {
  //   headerShown: true,
  //   headerTransparent: false,
  //   headerTintColor: "white",
  //   headerTitle: () => {
  //     return (
  //       <View style={{ marginBottom: 5 }}>
  //         {Platform.OS === "ios" ? (
  //           <View
  //             style={{
  //               alignItems: "center",
  //               width: 200,
  //             }}
  //           >
  //             <Text
  //               type="bold"
  //               size="title"
  //               style={{ color: "#FFF" }}
  //               numberOfLines={1}
  //             >
  //               {headData?.name ? headData.name : ""}
  //             </Text>

  //             <Text
  //               type="regular"
  //               size="label"
  //               style={{ color: "#FFF" }}
  //             >{`Day ${dayData.day}`}</Text>
  //           </View>
  //         ) : null}
  //       </View>
  //     );
  //   },
  //   headerMode: "screen",
  //   headerStyle: {
  //     backgroundColor: "#209FAE",
  //     elevation: 0,
  //     borderBottomWidth: 0,
  //   },
  //   headerLeftContainerStyle: {
  //     background: "#FFF",
  //     marginLeft: 10,
  //   },
  //   headerRightContainerStyle: {
  //     marginRight: 10,
  //   },
  //   headerLeft: () => (
  //     <View style={{ flexDirection: "row" }}>
  //       <Button
  //         text={""}
  //         size="medium"
  //         type="circle"
  //         variant="transparent"
  //         onPress={() => _backHandler()}
  //         style={{
  //           height: 55,
  //         }}
  //       >
  //         {Platform.OS == "ios" ? (
  //           <Arrowbackios height={20} width={20}></Arrowbackios>
  //         ) : (
  //           <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
  //         )}
  //       </Button>
  //       <>
  //         {Platform.OS === "ios" ? null : (
  //           <View
  //             style={{
  //               marginLeft: 15,
  //               marginTop: 5,
  //             }}
  //           >
  //             <Text
  //               type="bold"
  //               size="title"
  //               style={{ color: "#FFF", marginBottom: -3 }}
  //               numberOfLines={1}
  //             >
  //               {headData?.name ? headData.name : ""}
  //             </Text>

  //             <Text
  //               type="regular"
  //               size="label"
  //               style={{ color: "#FFF" }}
  //             >{`Day ${dayData.day}`}</Text>
  //           </View>
  //         )}
  //       </>
  //     </View>
  //   ),
  //   headerRight: () => (
  //     <Pressable
  //       onPress={() => setModalSave(true)}
  //       style={{
  //         flexDirection: "row",
  //         alignItems: "center",
  //       }}
  //     >
  //       <SavePutih width={25} height={25} />
  //       <Text
  //         style={{
  //           color: "#FFF",
  //           marginLeft: 5,
  //         }}
  //       >
  //         {t("save")}
  //       </Text>
  //     </Pressable>
  //   ),
  // };

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <View
        style={{
          marginBottom: 5,
          width: Dimensions.get("screen").width,
          alignItems: "center",
        }}
      >
        {Platform.OS === "ios" ? (
          <View
            style={{
              alignItems: "center",
              width: 200,
              marginTop: Platform.OS === "ios" ? (Notch ? 5 : 5) : null,
            }}
          >
            <Text
              type="bold"
              size="label"
              style={{ color: "#FFF" }}
              numberOfLines={1}
            >
              {headData?.name ? headData.name : ""}
            </Text>

            <Text
              type="regular"
              size="description"
              style={{ color: "#FFF" }}
            >{`Day ${dayData.day}`}</Text>
          </View>
        ) : null}
      </View>
    ),

    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <View style={{ flexDirection: "row" }}>
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
        <>
          {Platform.OS === "ios" ? null : (
            <View
              style={{
                marginLeft: 15,
                marginTop: deviceId == "LYA-L29" ? 10 : NotchAndro ? 2 : 5,
              }}
            >
              <Text
                type="bold"
                size="title"
                style={{ color: "#FFF", marginBottom: -3 }}
                numberOfLines={1}
              >
                {headData?.name ? headData.name : ""}
              </Text>

              <Text
                type="regular"
                size="label"
                style={{ color: "#FFF" }}
              >{`Day ${dayData.day}`}</Text>
            </View>
          )}
        </>
      </View>
    ),
    headerRight: () => (
      <Pressable
        onPress={() => setModalSave(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: 5,
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

  let [spliceDataStay, setSpliceDataStay] = useState([]);
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
