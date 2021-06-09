import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  NewAlbum,
  ExitingAlbum,
  Arrowbackwhite,
  Select,
  Check,
} from "../../../assets/svg";
import { Text, Button, Loading, FunImage } from "../../../component";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
import Album from "./Album";
import { RNToasty } from "react-native-toasty";
import CreateAlbumFeed from "../../../graphQL/Mutation/Post/CreateAlbumFeed";
import { useMutation } from "@apollo/react-hooks";
const { width, height } = Dimensions.get("screen");
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
  MenuProvider,
} from "react-native-popup-menu";
import ChooseDay from "./ChooseDay";
import ListItinerary from "../../../graphQL/Query/Itinerary/listitineraryA";
import ListAlbum from "../../../graphQL/Query/Itinerary/ListAlbum";
import { default_image } from "../../../assets/png";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";

export default function CreateAlbum({
  modalCreate,
  setModalCreate,
  props,
  user_id,
  setAlbum,
  token,
  setIdAlbums,
}) {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState(token);
  const [modalAlbum, setModalAlbum] = useState(false);
  const [modalAlbumCreate, setModalAlbumCreate] = useState(false);
  const [text, setText] = useState("");
  const [select, setSelect] = useState("Itinerary Album");
  const [idItinerary, setIdItinerary] = useState("");
  const [modalDay, setModalDay] = useState(false);
  const [data, setData] = useState();
  const [listAlbums, setListAlbums] = useState();
  const [choose, setChoose] = useState();
  const [datas, setDatas] = useState();
  let [loadings, setLoadings] = useState(false);

  const {
    data: dataItinerary,
    loading: loadingItinerary,
    error,
    refetch,
  } = useQuery(ListItinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens}`,
      },
    },
    variables: { status: "A" },
    onCompleted: () => setData(dataItinerary.itinerary_list_active),
  });

  const {
    data: listAlbum,
    loading: loadingAlbum,
    error: errorAlbum,
  } = useQuery(ListAlbum, {
    variables: { user_id: user_id },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => setListAlbums(listAlbum.list_albums),
  });

  const {
    data: dataItineraryChoose,
    loading: loadingdetail,
    error: errordetail,
  } = useQuery(ItineraryDetails, {
    fetchPolicy: "network-only",
    variables: { id: idItinerary },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => setDatas(dataItineraryChoose.itinerary_detail),
  });

  const [
    MutationCreateAlbumFeed,
    { loading: loadingMutation, data: dataMutation, error: errorMutation },
  ] = useMutation(CreateAlbumFeed, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const Choose = (id) => {
    setIdItinerary(id);
    setModalDay(true);
  };

  const pilih = (id) => {
    const tempData = [...datas.day];
    const index = tempData.findIndex((k) => k["id"] === id);
    setChoose(tempData[index].id);
  };

  const modal = () => {
    setModalAlbumCreate(true);
    setModalCreate(false);
  };
  const modalExiting = async () => {
    await setModalAlbum(true);
    await setModalCreate(false);
  };

  const submitAlbum = async () => {
    setLoadings(true);
    if (text === "" || text === null) {
      return RNToasty.Show({
        title: t("emptyAlbumTitle"),
        position: "bottom",
      });
    }

    try {
      let response = await MutationCreateAlbumFeed({
        variables: {
          title: text,
        },
      });

      if (response.data) {
        if (
          (response &&
            response.data &&
            response.data.create_albums.code === 200) ||
          (response &&
            response.data &&
            response.data.create_albums.code === "200")
        ) {
          setIdAlbums(response.data.create_albums.id);
          setAlbum(text);
          setModalAlbumCreate(false);
          setText("");
          setLoadings(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View
      style={{
        zIndex: modalCreate || modalAlbumCreate === true ? 1 : -2,
        opacity: 0.6,
        position: "absolute",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        backgroundColor:
          modalCreate || modalAlbumCreate === true ? "#000" : null,
      }}
    >
      <Loading show={loadings} />

      {/* Modal Popup */}

      <Modal
        useNativeDriver={true}
        visible={modalCreate}
        onRequestClose={() => setModalCreate(false)}
        transparent={true}
        animationType="slide"
      >
        <Pressable
          onPress={() => setModalCreate(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width,
            backgroundColor: "#FFF",
            position: "absolute",
            bottom: 0,
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => modalExiting()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 50,
            }}
          >
            <ExitingAlbum height="60" width="60" />
            <Text>Add to exiting album</Text>
          </Pressable>
          <Pressable
            onPress={() => modal()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 50,
            }}
          >
            <NewAlbum height="60" width="60" />
            <Text>Create new album</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Modal Create New Album */}
      <Modal
        useNativeDriver={true}
        visible={modalAlbumCreate}
        onRequestClose={() => setModalAlbumCreate(false)}
        transparent={true}
        animationType="slide"
      >
        <Pressable
          onPress={() => setModalAlbumCreate(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            // height: 200,
            width: Dimensions.get("screen").width,
            top: Dimensions.get("screen").height / 3,
            position: "absolute",
            zIndex: 15,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "#FFF",
              borderRadius: 5,
              paddingBottom: 15,
            }}
          >
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
              }}
            >
              <Text type="bold" size="title" style={{ marginVertical: 10 }}>
                New Album
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
              }}
            >
              <TextInput
                multiline
                placeholder={t("untitle")}
                maxLength={1000}
                placeholderStyle={{ fontSize: 50 }}
                placeholderTextColor="#6C6C6C"
                style={
                  Platform.OS == "ios"
                    ? {
                        height: 75,
                        maxHeight: 100,
                        marginVertical: 10,
                        marginHorizontal: 10,
                        paddingTop: 10,
                        fontSize: 14,
                        fontFamily: "Lato-Regular",
                      }
                    : {
                        height: 50,
                        borderRadius: 5,
                        backgroundColor: "#f6f6f6",
                        paddingHorizontal: 10,
                        fontSize: 14,
                        marginVertical: 10,
                        fontFamily: "Lato-Regular",
                      }
                }
                onChangeText={(text) => setText(text)}
                value={text}
              />
            </View>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >
              <Button
                onPress={() => {
                  setModalAlbumCreate(false), setModalCreate(true), setText("");
                }}
                size="medium"
                color="transparant"
                text={t("cancel")}
              ></Button>
              <Button
                onPress={() => submitAlbum()}
                size="medium"
                color="primary"
                text={t("create") + " " + "Album"}
              ></Button>
            </View>
          </View>
        </KeyboardAvoidingView>
        {/* <Album
          modals={modalAlbum}
          setModalAlbum={(e) => setModalAlbum(e)}
          props={props}
          user_id={user_id}
        /> */}
      </Modal>

      {/* Modal List Album */}

      <Modal
        animationType="fade"
        visible={modalAlbum}
        onRequestClose={() => setModalAlbum(false)}
        onDismiss={() => setModalAlbum(false)}
        style={{
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-start",
              alignItems: "center",
              alignContent: "center",
              backgroundColor: "#209fae",
              height: 55,
              width: Dimensions.get("screen").width,
              marginTop: Platform.OS === "ios" ? 0 : 0,
            }}
          >
            <TouchableOpacity
              style={{
                height: 55,
                width: 55,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                paddingTop: 20,
              }}
              onPress={() => setModalAlbum(false)}
            >
              <Arrowbackwhite width={20} height={20} />
            </TouchableOpacity>
            <View
              style={{
                top: 0,
                left: 60,
                height: 50,
                // position: "absolute",
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <Text size="label" type="regular" style={{ color: "#FFF" }}>
                Post
              </Text>
              <Text size="description" type="light" style={{ color: "#FFF" }}>
                {`${t("Select") + " Album"}`}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              // height: 300,
              backgroundColor: "white",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width,
                // height: 150,

                height: height - 130,
              }}
            >
              <MenuProvider>
                <Menu
                  renderer={renderers.ContextMenu}
                  style={{
                    width: width,
                    paddingHorizontal: 15,
                  }}
                >
                  <MenuTrigger
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 15,
                      width: 150,
                      borderRadius: 10,
                    }}
                  >
                    <Text size="description" type="regular">
                      {select ? select : "Feed Album"}
                    </Text>
                    <Select height="10" width="10" style={{ marginLeft: 5 }} />
                  </MenuTrigger>
                  <MenuOptions
                    optionsContainerStyle={{
                      // paddingBottom: 50,
                      height: 50,
                      // marginBottom: 10,
                    }}
                  >
                    <MenuOption onSelect={() => setSelect("Itinerary Album")}>
                      <Text size="description" type="regular">
                        Itinerary Album
                      </Text>
                    </MenuOption>
                    <MenuOption onSelect={() => setSelect("Feed Album")}>
                      <Text size="description" type="regular">
                        Feed Album
                      </Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
                <View
                  style={{
                    borderBottomColor: 10,
                    width: width,
                    height: 1,
                    opacity: 0.1,
                    backgroundColor: "#000",
                  }}
                ></View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    // flex: 1,
                    borderBottomColor: 10,
                    width: width,
                    paddingHorizontal: 15,
                    backgroundColor: "#FFF",
                    marginVertical: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {select === "Itinerary Album"
                      ? data &&
                        data.map((item, index) => (
                          <Pressable
                            key={index}
                            style={{
                              marginTop: 10,
                              width: (width - 30) / 3,
                              // borderWidth: 1,
                            }}
                            onPress={() => Choose(item?.id)}
                          >
                            <View
                              style={{
                                height: 130,
                                width: "98%",
                                // backgroundColor: "#F6F6F6",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                              }}
                            >
                              <FunImage
                                source={
                                  item && item.cover
                                    ? { uri: item?.cover }
                                    : default_image
                                }
                                style={{
                                  resizeMode: "cover",
                                  height: "100%",
                                  width: "100%",
                                }}
                              />
                            </View>
                            <View style={{ paddingLeft: 5, marginTop: 10 }}>
                              <Text size="label" type="regular">
                                {item.name}
                              </Text>
                              <Text size="description" type="light">
                                {item.count_album_post}
                              </Text>
                            </View>
                          </Pressable>
                        ))
                      : listAlbums.map((item, index) => (
                          <Pressable
                            key={index}
                            style={{
                              marginTop: 10,
                              width: (width - 30) / 3,
                              // borderWidth: 1,
                            }}
                          >
                            <View
                              style={{
                                height: 130,
                                width: "98%",
                                backgroundColor: "#F6F6F6",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                              }}
                            >
                              <FunImage
                                source={
                                  item && item.cover
                                    ? { uri: item?.cover }
                                    : default_image
                                }
                                style={{
                                  resizeMode: "cover",
                                  height: "100%",
                                  width: "100%",
                                }}
                              />
                            </View>
                            <View style={{ paddingLeft: 5, marginTop: 10 }}>
                              <Text size="label" type="regular">
                                {item.title}
                              </Text>
                              <Text size="description" type="light">
                                {item.count_foto}
                              </Text>
                            </View>
                          </Pressable>
                        ))}
                  </View>
                </ScrollView>
              </MenuProvider>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Choose Day */}

      <Modal
        visible={modalDay}
        animationType="fade"
        onRequestClose={() => {
          setModalDay(false);
        }}
        onDismiss={() => setModalDay(false)}
        style={{
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-start",
              alignItems: "center",
              alignContent: "center",
              backgroundColor: "#209fae",
              height: 55,
              width: Dimensions.get("screen").width,
              marginTop: Platform.OS === "ios" ? 0 : 0,
            }}
          >
            <TouchableOpacity
              style={{
                height: 55,
                width: 55,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                paddingTop: 20,
              }}
              onPress={() => setModalDay(false)}
            >
              <Arrowbackwhite width={20} height={20} />
            </TouchableOpacity>
            <View
              style={{
                top: 0,
                left: 60,
                height: 50,
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <Text size="label" type="regular" style={{ color: "#FFF" }}>
                {datas?.name}
              </Text>
              <Text size="description" type="light" style={{ color: "#FFF" }}>
                {t("selecDay")}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              backgroundColor: "white",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width,
                position: "absolute",
                top: Dimensions.get("screen").height - 200,
                // bottom: 200 - 55,
                paddingHorizontal: 15,
              }}
            >
              <Button
                size="medium"
                text={t("next")}
                onPress={() => {
                  setModalAlbum(false);
                  setModalDay(false);
                }}
              ></Button>
            </View>
            {datas &&
              datas?.day.map((item, index) => (
                <Ripple
                  key={index}
                  onPress={() => pilih(item.id)}
                  style={{
                    // width: width,
                    marginHorizontal: 15,
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    // borderColor: "rgb(80,80,80)",
                    borderColor: "#f1f1f1",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      marginLeft: 10,
                    }}
                  >
                    {choose === item.id ? (
                      <Check height="15" width="15" />
                    ) : null}
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ marginLeft: 10 }}>Day</Text>
                    <Text style={{ marginLeft: 10 }}>{item.day}</Text>
                  </View>
                </Ripple>
              ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
