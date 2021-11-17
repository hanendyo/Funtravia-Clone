import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  Image,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@apollo/react-hooks";
import {
  Arrowbackios,
  Arrowbackwhite,
  More,
  New,
  Xhitam,
  Xgray,
} from "../../../assets/svg";
import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
import DeleteAttachcustom from "../../../graphQL/Mutation/Itinerary/DeleteAttachcustom";
import {
  Button,
  Text,
  FunIcon,
  Capital,
  FunImage,
  FunDocument,
} from "../../../component";
import { useTranslation } from "react-i18next";
import MapView, { Marker } from "react-native-maps";
import DocumentPicker from "react-native-document-picker";
import { ReactNativeFile } from "apollo-upload-client";
import ImageSlide from "../../../component/src/ImageSlide";
import DeleteActivity from "../../../graphQL/Mutation/Itinerary/DeleteActivity";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import { StackActions } from "@react-navigation/native";
import { RNToasty } from "react-native-toasty";

export default function detailCustomItinerary(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "",
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
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
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
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Button>

        <View
          style={{
            marginLeft: 10,
          }}
        >
          <Text type="bold" size="title" style={{ color: "#fff" }}>
            {t("activityDetails")}
          </Text>
          <Text
            style={{
              color: "#fff",
            }}
          >
            {props.route.params.nameitin}
          </Text>
        </View>
      </View>
    ),
  };

  let [dataParent, setDataParent] = useState({});
  console.log("dataParent", dataParent);
  let [dataChild, setDataChild] = useState([]);
  let [modalmenu, setModalmenu] = useState(false);

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
    // await FunAttachment(dataparents);
    await setDataChild(dataX);
  };

  // useEffect(() => {
  //   FunAttachment(dataParent);
  // }, [dataParent]);

  const hitungDuration = ({ startt, dur }) => {
    var duration = dur ? dur.split(":") : "00:00:00";
    var starttime = startt ? startt.split(":") : "00:00:00";

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
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

  const [
    mutationDeleteActivity,
    {
      loading: Loadingdeleteactivity,
      data: datadeleteactivity,
      error: errordeleteactivity,
    },
  ] = useMutation(DeleteActivity, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const deleteactivity = async () => {
    try {
      let response = await mutationDeleteActivity({
        variables: {
          itinerary_id: props.route.params.idItin,
          id_activity: props.route.params.id,
          type: "custom",
        },
      });
      if (errordeleteactivity) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.delete_activity.code !== 200) {
          throw new Error(response.data.delete_activity.message);
        }

        var Xdata = [...props.route.params.data];
        var inde = Xdata.findIndex((k) => k["id"] === props.route.params.id);

        if (inde !== -1) {
          Xdata.splice(inde, 1);

          var x = 0;
          var order = 1;
          for (var y in Xdata) {
            Xdata[y].order = order;

            if (Xdata[y - 1]) {
              Xdata[y].time = hitungDuration({
                startt: Xdata[y - 1].time,
                dur: Xdata[y - 1].duration,
              });
            }
            x++;
            order++;
          }

          if ((x = Xdata.length)) {
            try {
              let response = await mutationSaveTimeline({
                variables: {
                  idday: props.route.params.datadayaktif.id,
                  value: JSON.stringify(Xdata),
                },
              });

              if (errorSave) {
                throw new Error("Error Input");
              }
              if (response.data) {
                if (response.data.update_timeline.code !== 200) {
                  throw new Error(response.data.update_timeline.message);
                }
                props.navigation.dispatch(
                  StackActions.replace("ItineraryStack", {
                    screen: "itindetail",
                    params: {
                      itintitle: props.route.params.nameitin,
                      country: props.route.params.idItin,
                      token: token,
                      status: "edit",
                    },
                  })
                );
              }
            } catch (error) {
              Alert.alert("" + error);
            }
          }
          await props.navigation.goBack();
        }

        setModalDeleteActivity(false);
      }
    } catch (error) {
      Alert.alert("" + error);
      setModalDeleteActivity(false);
    }
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

  const handleEdit = () => {
    // if (dataParent.detail_flight !== null) {
    //   props.navigation.navigate("ItineraryStack"),
    //     {
    //       screen: "customFlight",
    //       params: {
    //         itineraryId: props.route.params.idItin,
    //         idDay: props.route.params.idDay,
    //         startDate: props.route.params.startDate,
    //         endDate: props.route.params.startDate,
    //       },
    //     };
    // } else if (dataParent.detail_accomodation !== null) {
    //   props.navigation.navigate("ItineraryStack"),
    //     {
    //       screen: "customStay",
    //       params: {
    //         itineraryId: props.route.params.idItin,
    //         idDay: props.route.params.idDay,
    //         startDate: props.route.params.startDate,
    //         endDate: props.route.params.startDate,
    //       },
    //     };
    // } else {
    //   setModalMore(false);
    // }
    RNToasty.Show({
      title: "Sorry, feature is not available yet",
      position: "bottom",
    });
    setModalMore(false);
  };

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
          throw new Error(
            "error 200",
            response.data.upload_attach_custom.message
          );
        } else {
          if (sumber === "parent") {
            let datan = { ...dataParent };
            let tempes = [];
            if (datan.attachment?.length > 0) {
              tempes = [...datan.attachment];
            }
            let init = {
              __typename: "AttachmentCustom",
              itinerary_custom_id:
                response.data.upload_attach_custom.data[0].itinerary_custom_id,
              extention: response.data.upload_attach_custom.data[0].extention,
              file_name: response.data.upload_attach_custom.data[0].file_name,
              filepath: response.data.upload_attach_custom.data[0].filepath,
              tiny: response.data.upload_attach_custom.data[0].tiny,
            };
            tempes.push(init);
            let datas = { ...dataParent };
            datas["attachment"] = tempes;
            setDataParent(datas);
          } else if (sumber !== "parent") {
            let datan = [...dataChild];
            let inde = await datan.findIndex((key) => key.id === id);
            let tempes = [];
            if (datan[inde]?.attachment?.length > 0) {
              tempes = [...datan[inde].attachment];
            }

            let init = {
              __typename: "AttachmentCustom",
              itinerary_custom_id:
                response.data.upload_attach_custom.data[0].itinerary_custom_id,
              extention: response.data.upload_attach_custom.data[0].extention,
              file_name: response.data.upload_attach_custom.data[0].file_name,
              filepath: response.data.upload_attach_custom.data[0].filepath,
              tiny: response.data.upload_attach_custom.data[0].tiny,
            };
            tempes.push(init);
            datan[inde]["attachment"] = tempes;
            setDataChild(datan);
          }
        }
      }
    } catch (error) {
      Alert.alert("error upload" + error);
    }
  };

  const [
    mutationdelete,
    { loading: loadingdelete, data: datadelete, error: errordelete },
  ] = useMutation(DeleteAttachcustom, {
    context: {
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",

        Authorization: `Bearer ${props.route.params.token}`,
      },
    },
  });

  const _handle_hapusParent = async (data, index, dataParents) => {
    try {
      let response = await mutationdelete({
        variables: {
          itinerary_custom_id: data.itinerary_custom_id,
          tiny: data.tiny,
        },
      });

      if (errordelete) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.delete_attach_custom.code !== 200) {
          throw new Error(response.data.delete_attach_custom.message);
        } else {
          let tempes = [...dataParents.attachment];
          tempes.splice(index, 1);
          let datas = { ...dataParents };
          datas["attachment"] = tempes;
          setDataParent(datas);
        }
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const _handle_hapusChild = async (item, index, indah, dataChild) => {
    try {
      let response = await mutationdelete({
        variables: {
          itinerary_custom_id: item?.attachment[indah]?.itinerary_custom_id,
          tiny: item?.attachment[indah]?.tiny,
        },
      });

      if (errordelete) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.delete_attach_custom.code !== 200) {
          throw new Error(response.data.delete_attach_custom.message);
        } else {
          let tempes = [...item.attachment];
          tempes.splice(indah, 1);
          let datas = { ...item };
          datas["attachment"] = tempes;
          let datan = [...dataChild];
          datan[index] = datas;
          setDataChild(datan);
        }
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const x = dataChild.length - 1;

  let [indeks, setIndeks] = useState(0);
  let [gambar, setGambar] = useState([]);
  let [modalss, setModalss] = useState(false);
  const [modalMore, setModalMore] = useState(false);
  const [modalDeleteActivity, setModalDeleteActivity] = useState(false);

  const ImagesSlider = async (index, data) => {
    // console.log(index, data, "masuk paji masuk");
    // return false;

    var tempdatas = [];
    var x = 0;

    for (var i in data) {
      let wid = 0;
      let hig = 0;
      Image.getSize(data[i].filepath, (width, height) => {
        wid = width;
        hig = height;
      });
      tempdatas.push({
        key: i,
        url: data[i].filepath ? data[i].filepath : "",
        width: wid,
        height: hig,
        props: { source: data[i].filepath ? data[i].filepath : "" },
      });
      x++;
    }

    await setIndeks(index);
    await setGambar(tempdatas);
    await setModalss(true);
  };

  const bukamodalmenu = (id, type) => {
    setModalMore(true);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        // backgroundColor: "#fff",
      }}
    >
      <ImageSlide
        index={indeks}
        show={modalss}
        dataImage={gambar}
        setClose={() => setModalss(false)}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={dataChild}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 15,
          // minHeight: Dimensions.get("screen").height,
        }}
        keyExtractor={(item, index) => index.toString()}
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
                            : t("destinationFromGoogle")
                          : t("customActivity"),
                    })}
                  </Text>
                </TouchableOpacity>
                <Button
                  size="small"
                  text=""
                  type="circle"
                  variant="transparent"
                  style={{}}
                  onPress={() => {
                    bukamodalmenu(item.id, item.type);
                  }}
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
                    <Text>{t("duration")} :</Text>
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
                    <Text>{t("time")} :</Text>
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
                  <Text>{t("notes")}</Text>
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
                                paddingVertical: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: "#d1d1d1",
                              }}
                            >
                              <Text style={{ width: 30 }}>{index + 1}.</Text>
                              <FunDocument
                                filename={data.file_name}
                                filepath={data.filepath}
                                format={data.extention}
                                progressBar
                                style={{ flex: 1, flexDirection: "row" }}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  _handle_hapusChild(
                                    data,
                                    index,
                                    indah,
                                    dataChild
                                  );
                                }}
                                style={{
                                  flexDirection: "row",
                                  paddingRight: 10,
                                  paddingLeft: 25,
                                  paddingVertical: 5,
                                  height: "100%",
                                  alignItems: "center",
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
                        {t("ChooseFile")}
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
                {t("addActivityAtThisLocation")}
              </Text>
              <Button
                text={t("addActivity")}
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
              {/* {dataParent.icon ? (
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
              )} */}
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
                          : t("destinationFromGoogle")
                        : t("customActivity"),
                  })}
                </Text>
              </TouchableOpacity>
              <Button
                size="small"
                text=""
                type="circle"
                variant="transparent"
                style={{}}
                onPress={() => {
                  bukamodalmenu(dataParent.id, dataParent.type);
                }}
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
              <Text>{t("location")}</Text>
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
                  latitude: parseFloat(
                    dataParent?.latitude ? dataParent?.latitude : 0
                  ),
                  longitude: parseFloat(
                    dataParent?.longitude ? dataParent?.longitude : 0
                  ),
                  latitudeDelta: 0.007,
                  longitudeDelta: 0.007,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(
                      dataParent?.latitude ? dataParent?.latitude : 0
                    ),
                    longitude: parseFloat(
                      dataParent?.longitude ? dataParent?.longitude : 0
                    ),
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
                  <Text>{t("duration")} :</Text>
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
                  <Text>{t("time")} :</Text>
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
                <Text>{t("notes")}</Text>
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
                              paddingVertical: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: "#d1d1d1",
                            }}
                          >
                            <Text style={{ width: 30 }}>{index + 1}.</Text>
                            <FunDocument
                              filename={data.file_name}
                              filepath={data.filepath}
                              format={data.extention}
                              progressBar
                              style={{ flex: 1, flexDirection: "row" }}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                _handle_hapusParent(data, index, dataParent);
                              }}
                              style={{
                                flexDirection: "row",
                                paddingRight: 10,
                                paddingLeft: 25,
                                paddingVertical: 5,
                                height: "100%",
                                alignItems: "center",
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
                      {t("ChooseFile")}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#d1d1d1",
                    }}
                  >
                    {t("uploadFlightTicket")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      {/* Modal edit activity */}
      <Modal
        onBackdropPress={() => {
          setModalMore(false);
        }}
        onRequestClose={() => setModalMore(false)}
        onDismiss={() => setModalMore(false)}
        animationType="fade"
        visible={modalMore}
        transparent={true}
      >
        <Pressable
          onPress={() => setModalMore(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            alignSelf: "center",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            // backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignSelf: "center",
            marginTop: Dimensions.get("screen").height / 2.5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 60,
              // paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                alignItems: "center",
                backgroundColor: "#f6f6f6",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text style={{ marginVertical: 15 }} type="bold" size="title">
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalMore(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 55,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                handleEdit();
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  color: "#464646",
                  marginVertical: 15,
                }}
              >
                {t("edit")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              onPress={() => {
                setModalMore(false);
                setModalDeleteActivity(true);
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  color: "#d75995",
                  marginVertical: 15,
                }}
              >
                {t("delete")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Delete Activity */}
      <Modal
        useNativeDriver={true}
        visible={modalDeleteActivity}
        onRequestClose={() => setModalDeleteActivity(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalDeleteActivity(false)}
          style={{
            width: Dimensions.get("screen").width + 25,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            left: -21,
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 140,
            // marginHorizontal: 70,
            alignSelf: "center",
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 2.5,
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
                {t("deleteActivity")}
              </Text>
            </View>
            <Text
              style={{
                alignSelf: "center",
                textAlign: "center",
                marginTop: 20,
                marginHorizontal: 10,
              }}
              size="label"
              type="regular"
            >
              {t("DeleteActivityfromItinerary")}
            </Text>
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
              <Button
                onPress={() => {
                  // _handledeleteDay(
                  //   datadayaktif?.itinerary_id,
                  //   datadayaktif?.id
                  // );
                  // setModalDeleteActivity(false);
                  deleteactivity();
                }}
                color="secondary"
                text={t("delete")}
              ></Button>
              <Button
                onPress={() => {
                  setModalDeleteActivity(false);
                }}
                style={{ marginVertical: 5 }}
                variant="transparent"
                text={t("discard")}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
