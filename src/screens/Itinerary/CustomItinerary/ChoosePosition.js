import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Textarea,
} from "react-native";
import { default_image } from "../../../assets/png";
import Modal from "react-native-modal";
import { useMutation } from "@apollo/react-hooks";
import {
  Arrowbackwhite,
  Delete,
  Pencilgreen,
  Xhitam,
} from "../../../assets/svg";
import SaveCustom from "../../../graphQL/Mutation/Itinerary/AddCustomNew";
// import SaveCustom from "../../../graphQL/Mutation/Itinerary/AddCustom";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import Swipeout from "react-native-swipeout";
import { Button, Text, Loading, FunIcon } from "../../../component";
import { useTranslation } from "react-i18next";

export default function ChoosePosition(props) {
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
  let [cheked, setcheck] = useState(false);
  let idItin = props.route.params.idItin;
  let idDay = props.route.params.idDay;
  let token = props.route.params.token;
  let itintitle = props.route.params.itintitle;
  let dateitin = props.route.params.dateitin;
  let datadayaktif = props.route.params.datadayaktif;
  let [datatimeline, setDatatimeline] = useState(
    props.route.params.datatimeline
  );

  let [loading, setLoading] = useState(false);
  let [modal, setModal] = useState(false);
  let [textinput, setInput] = useState("");
  let [indexinput, setIndexInput] = useState("");
  let [jammax, setjammax] = useState(props.route.params.jammax);

  let [dataAkhir, setData] = useState([]);
  let [dataInput, setDataInput] = useState(props.route.params.dataCustom);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);

    // const unsubscribe = props.navigation.addListener("focus", () => {
    //   loadAsync();
    // });
    // return unsubscribe;
  }, [props.navigation]);

  const saveNotes = () => {
    var tempData = [...datatimeline];
    tempData[indexinput].note = textinput;
    setDatatimeline(tempData);
    setModal(false);
  };

  const GetStartTime = ({ startt }) => {
    var starttime = startt.split(":");

    return (
      <Text size="description" type="regular" style={{}}>
        {starttime[0]}:{starttime[1]}
      </Text>
    );
  };

  // console.log(datatimeline);

  const bukaModal = (text = null, index) => {
    if (text) {
      setInput(text);
    } else {
      setInput("");
    }
    setIndexInput(index);
    setModal(true);
  };

  const GetEndTime = ({ startt, dur }) => {
    var duration = dur.split(":");
    var starttime = startt.split(":");

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);
    // if (jam > 23) {
    // 	jam = 24 - jam;
    // }
    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
    if (menit > 59) {
      menit = 60 - menit;
    }

    return (
      <Text size="description" type="regular" style={{}}>
        {jam < 10 ? "0" + (jam < 0 ? "0" : jam) : jam}:
        {menit < 10 ? "0" + menit : menit}
      </Text>
    );
  };

  const hapus = (id) => {
    let tempData = [...datatimeline];
    let inde = tempData.findIndex((k) => k["id"] === id);
    tempData.splice(inde, 1);
    setDatatimeline(tempData);
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

  const RenderItinerary = ({ item, index }) => {
    const x = datatimeline.length - 1;
    if (item.stat === "new") {
      return (
        <Swipeout
          style={{ backgroundColor: "white" }}
          left={swipeoutBtn(item.id)}
        >
          <View>
            <View
              style={{
                marginVertical: 5,
                paddingBottom: 10,

                width: Dimensions.get("screen").width - 40,
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ height: "100%", width: "30%", paddingTop: 10 }}>
                <TouchableOpacity
                  style={{
                    alignItems: "flex-start",
                    paddingRight: 10,
                    justifyContent: "flex-start",
                  }}
                >
                  {item.type !== "custom" ? (
                    <Image
                      source={
                        item.images
                          ? { uri: item.images }
                          : item.icon
                          ? { uri: item.icon }
                          : default_image
                      }
                      style={{
                        height: 75,
                        width: 75,
                        resizeMode: "cover",
                        borderRadius: 5,
                      }}
                    />
                  ) : item.icon ? (
                    <FunIcon icon={item.icon} height={50} width={50} />
                  ) : (
                    <FunIcon icon={"i-tour"} height={50} width={50} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ height: "100%", width: "70%", paddingTop: 10 }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  <TouchableOpacity>
                    {item.time ? (
                      <GetStartTime startt={item.time} />
                    ) : (
                      <Text>00:00</Text>
                    )}
                  </TouchableOpacity>
                  <Text> - </Text>
                  <TouchableOpacity>
                    {item.duration ? (
                      <GetEndTime
                        startt={item.time ? item.time : "00:00"}
                        dur={item.duration ? item.duration : "00:00"}
                      />
                    ) : (
                      <Text>00:00</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{ width: "100%", paddingHorizontal: 10 }}
                >
                  <Text
                    size="label"
                    type="bold"
                    style={{
                      width: Dimensions.get("screen").width * 0.6,
                    }}
                  >
                    {item.name ? item.name : item.title ? item.title : "-"}
                  </Text>
                  {item.note ? (
                    <View>
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          marginVertical: 5,
                          width: Dimensions.get("screen").width * 0.55,

                          textAlign: "justify",
                        }}
                      >
                        {item.note}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 10 }}>
                  {item.note ? (
                    <TouchableOpacity
                      onPress={() => bukaModal(item.note, index)}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Pencilgreen width={10} height={10} />
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          marginLeft: 5,
                          marginVertical: 5,

                          color: "#209fae",
                        }}
                      >
                        Edit notes
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => bukaModal(null, index)}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Pencilgreen width={10} height={10} />
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          marginLeft: 5,
                          marginVertical: 5,

                          color: "#209fae",
                        }}
                      >
                        Add notes
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                borderStyle: "dashed",
                borderRadius: 1,
                borderWidth: 1,
                borderColor: "#f3f3f3",
              }}
            ></View>
          </View>
        </Swipeout>
      );
    } else {
      return (
        <View>
          <View
            style={{
              marginVertical: 5,
              paddingBottom: 10,

              width: Dimensions.get("screen").width - 40,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <View style={{ height: "100%", width: "30%", paddingTop: 10 }}>
              <TouchableOpacity
                style={{
                  alignItems: "flex-start",
                  paddingRight: 10,
                  justifyContent: "flex-start",
                }}
              >
                {item.type !== "custom" ? (
                  <Image
                    source={
                      item.images
                        ? { uri: item.images }
                        : item.icon
                        ? { uri: item.icon }
                        : default_image
                    }
                    style={{
                      height: 75,
                      width: 75,
                      resizeMode: "cover",
                      borderRadius: 5,
                    }}
                  />
                ) : item.icon ? (
                  <FunIcon icon={item.icon} height={50} width={50} />
                ) : (
                  <FunIcon icon={"i-tour"} height={50} width={50} />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ height: "100%", width: "70%", paddingTop: 10 }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                }}
              >
                <TouchableOpacity>
                  {item.time ? (
                    <GetStartTime startt={item.time} />
                  ) : (
                    <Text>00:00</Text>
                  )}
                </TouchableOpacity>
                <Text> - </Text>
                <TouchableOpacity>
                  {item.duration ? (
                    <GetEndTime
                      startt={item.time ? item.time : "00:00"}
                      dur={item.duration ? item.duration : "00:00"}
                    />
                  ) : (
                    <Text>00:00</Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{ width: "100%", paddingHorizontal: 10 }}
              >
                <Text
                  size="label"
                  type="bold"
                  style={{
                    width: Dimensions.get("screen").width * 0.6,
                  }}
                >
                  {item.name ? item.name : item.title ? item.title : "-"}
                </Text>
                {item.note ? (
                  <View>
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginVertical: 5,
                        width: Dimensions.get("screen").width * 0.55,

                        textAlign: "justify",
                      }}
                    >
                      {item.note}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
              <View style={{ paddingHorizontal: 10 }}>
                {item.note ? (
                  <TouchableOpacity
                    onPress={() => bukaModal(item.note, index)}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Pencilgreen width={10} height={10} />
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginLeft: 5,
                        marginVertical: 5,

                        color: "#209fae",
                      }}
                    >
                      Edit notes
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => bukaModal(null, index)}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Pencilgreen width={10} height={10} />
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginLeft: 5,
                        marginVertical: 5,

                        color: "#209fae",
                      }}
                    >
                      Add notes
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              borderStyle: "dashed",
              borderRadius: 1,
              borderWidth: 1,
              borderColor: "#f3f3f3",
            }}
          ></View>
        </View>
      );
    }
  };

  const addHere = (index) => {
    var inputan = { ...dataInput };
    let jam = jammax.split(":");
    let jambaru = inputan.duration.split(":");
    let jumlah = parseFloat(jam[0]) + parseFloat(jambaru[0]);
    if (jumlah <= 23) {
      inputan["stat"] = "new";
      inputan["type"] = "custom";
      inputan["name"] = inputan["title"];
      inputan["status"] = false;

      var tempdata = [...datatimeline];
      tempdata.splice(index, 0, inputan);

      var x = 0;
      var order = 1;
      for (var y in tempdata) {
        tempdata[y].order = order;
        if (tempdata[y].stat && tempdata[y].stat === "new") {
          var z = [...dataAkhir];
          z.push(order);
          setData(z);
        }

        if (tempdata[y - 1]) {
          tempdata[y].time = hitungDuration({
            startt: tempdata[y - 1].time,
            dur: tempdata[y - 1].duration,
          });
        }
        x++;
        order++;
      }
      if ((x = tempdata.length)) {
        setDatatimeline(tempdata);
      }
      setjammax(jumlah + ":00:00");
    } else {
      Alert.alert("Waktu sudah melewati batas maksimal");
    }
  };

  const hitungDuration = ({ startt, dur }) => {
    var duration = dur ? dur.split(":") : "00:00:00";
    var starttime = startt ? startt.split(":") : "00:00:00";

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);
    // if (jam > 23) {
    // 	jam = 24 - jam;
    // }
    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
    if (menit > 59) {
      menit = 60 - menit;
    }

    return (
      (jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam) +
      ":" +
      (menit < 10 ? "0" + menit : menit) +
      ":00"
    );
  };

  const [
    mutationSaved,
    { loading: loadingSaved, data: dataSaved, error: errorSaved },
  ] = useMutation(SaveCustom, {
    context: {
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",

        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationSaveTimeline,
    { loading: loadingSave, data: dataSave, error: errorSave },
  ] = useMutation(UpdateTimeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const saveToItinerary = async () => {
    console.log(props.route.params.file);

    setLoading(true);
    // console.log(token);
    if (dataAkhir.length < 1) {
      setLoading(false);

      Alert.alert("Please Choose position");
      return false;
    } else {
      var datas = [];
      datas.push(idDay);

      try {
        let response = await mutationSaved({
          variables: {
            day_id: datas,
            title: dataInput.title,
            icon: "i-tour",
            qty: "1",
            address: dataInput.address,
            latitude: dataInput.latitude,
            longitude: dataInput.longitude,
            note: " ",
            time: dataInput.time,
            duration: dataInput.duration,
            status: false,
            order: dataAkhir,
            total_price: "0",
            file: props.route.params.file,
          },
        });
        if (loadingSaved) {
          Alert.alert("Loading!!");
        }
        if (errorSaved) {
          throw new Error("Error Input");
        }
        console.log(response);
        if (response.data) {
          if (response.data.add_custom_withattach.code !== 200) {
            setLoading(false);

            throw new Error(response.data.add_custom_withattach.message);
          } else {
            var tempdatas = [...datatimeline];
            var jum = 0;
            for (var i of response.data.add_custom_withattach.data) {
              var inde = tempdatas.findIndex(
                (k) => k["order"] === parseInt(i.order)
              );
              tempdatas[inde].id = i.id;
              jum++;
            }

            if (jum === response.data.add_custom_withattach.data.length) {
              setDatatimeline(tempdatas);
              try {
                let responsed = await mutationSaveTimeline({
                  variables: {
                    idday: idDay,
                    value: JSON.stringify(tempdatas),
                  },
                });
                if (loadingSave) {
                  Alert.alert("Loading!!");
                }
                if (errorSave) {
                  throw new Error("Error Input");
                }

                if (responsed.data) {
                  if (responsed.data.update_timeline.code !== 200) {
                    throw new Error(responsed.data.update_timeline.message);
                  }

                  props.navigation.push("ItineraryStack", {
                    screen: "itindetail",
                    params: {
                      country: idItin,
                      token: token,
                      itintitle: itintitle,
                      dateitin: dateitin,
                      datadayaktif: datadayaktif,
                      status: "edit",
                    },
                  });
                }
                setLoading(false);
              } catch (error) {
                setLoading(false);

                Alert.alert("" + error);
              }
            }
          }
        }
      } catch (error) {
        console.log(error);

        setLoading(false);

        Alert.alert("" + error);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}
    >
      <Loading show={loading} />

      <View
        style={{
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
              borderTopColor: "#209fae",
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
                  2
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
                    // fontFamily: 'Lato-Regular',
                    // color: '#646464',
                    color: "white",
                  }}
                >
                  3
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
                {t("selectitinerary")}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <Text
            size="title"
            type="bold"
            style={{
              width: Dimensions.get("screen").width * 0.5,
            }}
          >
            {t("selectitinerary")}
          </Text>
        </View>
        <View style={{ width: Dimensions.get("screen").width, padding: 20 }}>
          {datatimeline.length > 0 ? (
            datatimeline.map((item, index) => {
              // console.log(item);
              if (props.route.params.dataParent) {
                return props.route.params.dataParent.id === item.id ||
                  props.route.params.dataParent.id === item.parent_id ||
                  item.stat === "new" ? (
                  <View>
                    {/* {(index !== 0 && !item.stat) ||
                    (item.stat && item.stat !== "new") ? (
                      datatimeline[index - 1] &&
                      datatimeline[index - 1].stat &&
                      datatimeline[index - 1].stat === "new" ? null : (
                        <View>
                          <TouchableOpacity
                            onPress={() => addHere(index)}
                            style={{
                              marginVertical: 5,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              paddingVertical: 10,
                              // borderBottomWidth: 1,
                            }}
                          >
                            <View
                              style={{
                                height: 40,
                                width: 40,
                                backgroundColor: "#f3f3f3",
                                borderRadius: 5,
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                size="small"
                                type="regular"
                                style={{
                                  fontFamily: "Lato-Regular",
                                  fontSize: 30,
                                }}
                              >
                                +
                              </Text>
                            </View>
                            <Text
                              // size='small'
                              type="regular"
                              style={{
                                // fontFamily: 'Lato-Regular',
                                // fontSize: 30,
                                marginLeft: 10,
                              }}
                            >
                              {t("addHere")}
                            </Text>
                          </TouchableOpacity>
                          <View
                            style={{
                              width: "100%",
                              borderStyle: "dashed",
                              borderRadius: 1,
                              borderWidth: 1,
                              borderColor: "#f3f3f3",
                            }}
                          ></View>
                        </View>
                      )
                    ) : null} */}
                    <RenderItinerary key={item.id} item={item} index={index} />
                    {!item.stat || (item.stat && item.stat !== "new") ? (
                      <View>
                        <TouchableOpacity
                          onPress={() => addHere(index + 1)}
                          style={{
                            marginVertical: 5,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            paddingVertical: 10,
                            // borderBottomWidth: 1,
                          }}
                        >
                          <View
                            style={{
                              height: 40,
                              width: 40,
                              backgroundColor: "#f3f3f3",
                              borderRadius: 5,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              size="h4"
                              type="regular"
                              style={{
                                // fontFamily: 'Lato-Regular',
                                fontSize: 30,
                              }}
                            >
                              +
                            </Text>
                          </View>
                          <Text
                            // size='h4'
                            type="regular"
                            style={{
                              // fontFamily: 'Lato-Regular',
                              // fontSize: 30,
                              marginLeft: 10,
                            }}
                          >
                            {t("addHere")}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: "100%",
                            borderStyle: "dashed",
                            borderRadius: 1,
                            borderWidth: 1,
                            borderColor: "#f3f3f3",
                          }}
                        ></View>
                      </View>
                    ) : null}
                  </View>
                ) : null;
              } else {
                return (
                  <View>
                    {(index !== 0 && !item.stat) ||
                    (item.stat && item.stat !== "new") ? (
                      datatimeline[index - 1] &&
                      datatimeline[index - 1].stat &&
                      datatimeline[index - 1].stat === "new" ? null : (
                        <View>
                          <TouchableOpacity
                            onPress={() => addHere(index)}
                            style={{
                              marginVertical: 5,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              paddingVertical: 10,
                              // borderBottomWidth: 1,
                            }}
                          >
                            <View
                              style={{
                                height: 40,
                                width: 40,
                                backgroundColor: "#f3f3f3",
                                borderRadius: 5,
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                size="small"
                                type="regular"
                                style={{
                                  fontFamily: "Lato-Regular",
                                  fontSize: 30,
                                }}
                              >
                                +
                              </Text>
                            </View>
                            <Text
                              // size='small'
                              type="regular"
                              style={{
                                // fontFamily: 'Lato-Regular',
                                // fontSize: 30,
                                marginLeft: 10,
                              }}
                            >
                              {t("addHere")}
                            </Text>
                          </TouchableOpacity>
                          <View
                            style={{
                              width: "100%",
                              borderStyle: "dashed",
                              borderRadius: 1,
                              borderWidth: 1,
                              borderColor: "#f3f3f3",
                            }}
                          ></View>
                        </View>
                      )
                    ) : null}
                    <RenderItinerary key={item.id} item={item} index={index} />
                    {index === datatimeline.length - 1 &&
                    (!item.stat || (item.stat && item.stat !== "new")) ? (
                      <View>
                        <TouchableOpacity
                          onPress={() => addHere(index + 1)}
                          style={{
                            marginVertical: 5,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            paddingVertical: 10,
                            // borderBottomWidth: 1,
                          }}
                        >
                          <View
                            style={{
                              height: 40,
                              width: 40,
                              backgroundColor: "#f3f3f3",
                              borderRadius: 5,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              size="h4"
                              type="regular"
                              style={{
                                // fontFamily: 'Lato-Regular',
                                fontSize: 30,
                              }}
                            >
                              +
                            </Text>
                          </View>
                          <Text
                            // size='h4'
                            type="regular"
                            style={{
                              // fontFamily: 'Lato-Regular',
                              // fontSize: 30,
                              marginLeft: 10,
                            }}
                          >
                            {t("addHere")}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: "100%",
                            borderStyle: "dashed",
                            borderRadius: 1,
                            borderWidth: 1,
                            borderColor: "#f3f3f3",
                          }}
                        ></View>
                      </View>
                    ) : null}
                  </View>
                );
              }
            })
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => addHere(0)}
                style={{
                  marginVertical: 5,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  paddingVertical: 10,
                  // borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: "#f3f3f3",
                    borderRadius: 5,
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    size="h4"
                    type="regular"
                    style={
                      {
                        // fontFamily: 'Lato-Regular',
                        // fontSize: 30,
                      }
                    }
                  >
                    +
                  </Text>
                </View>
                <Text
                  // size='h4'
                  type="regular"
                  style={{
                    // fontFamily: 'Lato-Regular',
                    // fontSize: 30,
                    marginLeft: 10,
                  }}
                >
                  {t("addHere")}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: "100%",
                  borderStyle: "dashed",
                  borderRadius: 1,
                  borderWidth: 1,
                  borderColor: "#f3f3f3",
                }}
              ></View>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#f3f3f3",
        }}
      >
        <View
          style={{
            height: 60,
            width: Dimensions.get("screen").width,
            alignContent: "center",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopWidth: 1,
            borderTopColor: "#f3f3f3",
            backgroundColor: "white",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.push("ItineraryStack", {
                screen: "itindetail",
                params: {
                  country: idItin,
                  token: token,
                  itintitle: itintitle,
                  dateitin: dateitin,
                  datadayaktif: datadayaktif,
                  status: "edit",
                },
              });
            }}
            style={{
              height: 40,
              width: Dimensions.get("screen").width * 0.2,
              backgroundColor: "white",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{
                color: "#D75995",
              }}
            >
              {t("cancel")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              saveToItinerary();
            }}
            style={{
              height: 40,
              width: Dimensions.get("screen").width * 0.6,
              backgroundColor: "#209fae",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text size="label" type="regular" style={{ color: "white" }}>
              {t("save")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        onBackdropPress={() => {
          setModal(false);
        }}
        onRequestClose={() => {
          setModal(false);
        }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modal}
        style={{
          // backgroundColor: 'rgba(0, 0, 0, 0.25)',
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            width: Dimensions.get("screen").width - 20,
            backgroundColor: "white",
            marginBottom: 70,
            paddingTop: 60,
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 20,
              left: 20,
            }}
            onPress={() => setModal(false)}
          >
            <Xhitam width={15} height={15} />
          </TouchableOpacity>
          <Text size="label" type="bold" style={{}}>
            {t("EditNotes")}
          </Text>
          <Textarea
            style={{
              width: "100%",
              borderRadius: 5,
              fontFamily: "Lato-Regular",
            }}
            rowSpan={5}
            placeholder="Input Notes"
            value={textinput}
            bordered
            maxLength={160}
            onChangeText={(text) => setInput(text)}
          />
          <TouchableOpacity
            onPress={() => saveNotes()}
            style={{
              marginTop: 15,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: "#209fae",
              paddingHorizontal: 40,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{
                // marginLeft: 5,
                // marginVertical: 5,

                color: "white",
              }}
            >
              {t("save")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
