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
import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
import Swipeout from "react-native-swipeout";
import { Button, Text, Loading, FunIcon, Capital } from "../../../component";
import { useTranslation } from "react-i18next";
import MapView, { Marker } from "react-native-maps";
import DocumentPicker from "react-native-document-picker";
import { ReactNativeFile } from "apollo-upload-client";

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

  let [dataUpload, setdataUpload] = useState([]);

  const pickFile = async (id, sumber) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      let files = new ReactNativeFile({
        uri: res.uri,
        type: res.type,
        name: res.name,
      });

      let tempe = [...dataUpload];
      tempe.push(files);
      // await setdataUpload(tempe);
      await handleUpload(tempe, id, sumber, res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
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

  const [
    mutationUpload,
    { loading: loadingSaved, data: dataSaved, error: errorSaved },
  ] = useMutation(Upload, {
    context: {
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",

        Authorization: `Bearer ${props.route.params.token}`,
      },
    },
  });

  const handleUpload = async (files, id, sumber, res) => {
    try {
      let response = await mutationUpload({
        variables: {
          file: files,
          custom_itinerary_id: id,
        },
      });

      if (errorSaved) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.upload_attach_custom.code !== 200) {
          throw new Error(response.data.upload_attach_custom.message);
        } else {
          // Alert.alert("Succes");
          if (sumber === "parent") {
            let tempes = [...dataParent.attachment];
            let init = {
              __typename: "AttachmentCustom",
              extention: null,
              file_name: res.name,
              filepath: res.uri,
              itinerary_custom_id: id,
            };

            tempes.push(init);
            let datas = { ...dataParent };
            datas["attachment"] = tempes;
            setDataParent(datas);
          } else {
            let datan = [...dataChild];
            let inde = await datan.findIndex((key) => key.id === id);
            let tempes = [...datan[inde].attachment];

            let init = {
              __typename: "AttachmentCustom",
              extention: null,
              file_name: res.name,
              filepath: res.uri,
              itinerary_custom_id: id,
            };

            tempes.push(init);
            datan[inde]["attachment"] = tempes;
            setDataChild(datan);
          }
        }
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const x = dataChild.length - 1;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        // backgroundColor: "#fff",
      }}
    >
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={dataChild}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 15,
          // minHeight: Dimensions.get("screen").height,
        }}
        ListFooterComponent={() => (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                marginTop: 15,
                marginLeft: 40,
                borderRadius: 5,
                backgroundColor: "#fff",
                elevation: 3,
                shadowColor: "#d3d3d3",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  width: "50%",
                }}
              >
                Add activity at this location
              </Text>
              <Button
                text={"Add Activity"}
                onPress={() => {
                  props.navigation.push("CustomItinerary", {
                    idItin: props.route.params.idItin,
                    idDay: props.route.params.datadayaktif.id,
                    itintitle: props.route.params.nameitin,
                    // dateitin: props.route.params.dateitin,
                    datadayaktif: props.route.params.datadayaktif,
                    dataParent: dataParent,
                  });
                }}
              ></Button>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View
            style={{
              borderRadius: 5,
              backgroundColor: "#fff",
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
            {dataParent.note ? (
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
            ) : null}
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                // borderBottomColor: "#f1f1f1",
                // borderBottomWidth: 0.5,
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
                  {dataParent?.attachment?.length > 0
                    ? dataParent.attachment.map((data, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text style={{ width: 30 }}>{index + 1}. </Text>
                            <Text style={{ flex: 1, paddingBottom: 5 }}>
                              {data.file_name}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                let tempes = [...dataParent.attachment];
                                tempes.splice(index, 1);
                                let datas = { ...dataParent };
                                datas["attachment"] = tempes;
                                setDataParent(datas);
                              }}
                              style={{
                                flexDirection: "row",
                                paddingRight: 10,
                                paddingLeft: 25,
                                height: "100%",
                              }}
                            >
                              <Xhitam style={{}} width={10} height={10} />
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    : null}
                </View>

                <View style={{ flex: 1, marginVertical: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      pickFile(dataParent.id, "parent");
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
          <View
            style={{
              flexDirection: "row",
              // borderWidth: 1,
              // height: 200,
            }}
          >
            {/* garis======================= */}
            <View
              style={{
                marginLeft: 15,
              }}
            >
              <View
                style={{
                  height: 35,
                  marginRight: 4.5,
                  borderRightWidth: 0.5,
                  borderRightColor: "#6C6C6C",
                }}
              ></View>
              <View
                style={{
                  zIndex: 99,
                  height: 10,
                  width: 10,
                  borderRadius: 10,
                  backgroundColor: "#209fae",
                  elevation: 3,
                  shadowColor: "#d3d3d3",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                }}
              />
              <View
                style={{
                  flex: 1,
                  marginRight: 4.5,
                  borderRightWidth: index < x ? 0.5 : 0,
                  borderRightColor: "#6C6C6C",
                }}
              ></View>
            </View>
            {/* garis======================= */}

            <View
              style={{
                flex: 1,
                marginTop: 15,
                marginLeft: 15,
                borderRadius: 5,
                backgroundColor: "#fff",
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
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderBottomColor: "#f1f1f1",
                  borderBottomWidth: 0.5,
                }}
              >
                {item.icon ? (
                  <FunIcon
                    icon={item.icon}
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
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderBottomColor: "#f1f1f1",
                  borderBottomWidth: item.notes ? 0.5 : 0,
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
                        {Getdurasi(item.duration ? item.duration : "00:00:00")}
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
                        {item.time ? (
                          <GetStartTime startt={item.time} />
                        ) : (
                          <Text size="description" type="bold">
                            00:00
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity>
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
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {item.note ? (
                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 10,

                    borderBottomColor: "#f1f1f1",
                    borderBottomWidth: 0.5,
                  }}
                >
                  <Text>Notes</Text>
                  <Text style={{ marginTop: 10 }}>{item.note}</Text>
                </View>
              ) : null}

              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  // borderBottomColor: "#f1f1f1",
                  // borderBottomWidth: 0.5,
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
                    {item?.attachment?.length > 0
                      ? item.attachment.map((data, indah) => {
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                alignContent: "flex-start",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text style={{ width: 30 }}>{indah + 1}. </Text>
                              <Text style={{ flex: 1, paddingBottom: 5 }}>
                                {data.file_name}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  let tempes = [...item.attachment];
                                  tempes.splice(indah, 1);
                                  let datas = { ...item };
                                  datas["attachment"] = tempes;
                                  let datan = [...dataChild];
                                  datan[index] = datas;
                                  setDataChild(datan);
                                }}
                                style={{
                                  flexDirection: "row",
                                  paddingRight: 10,
                                  paddingLeft: 25,
                                  height: "100%",
                                }}
                              >
                                <Xhitam style={{}} width={10} height={10} />
                              </TouchableOpacity>
                            </View>
                          );
                        })
                      : null}
                  </View>

                  <View style={{ flex: 1, marginVertical: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        pickFile(item.id, "child");
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
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
