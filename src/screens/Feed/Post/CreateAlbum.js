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
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  NewAlbum,
  ExitingAlbum,
  Arrowbackwhite,
  Select,
  Check,
  Down,
  SearchWhite,
  Search,
} from "../../../assets/svg";
import { Text, Button, Loading, FunImage } from "../../../component";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
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
import ListItinerary from "../../../graphQL/Query/Itinerary/listitineraryAll";
import ListAlbum from "../../../graphQL/Query/Itinerary/ListAlbum";
import { default_image } from "../../../assets/png";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";
import ItineraryListAlbum from "../../../graphQL/Query/Itinerary/ListAlbumItinerary";
import ChooseAlbumItinerary from "./ChooseAlbumItinerary";
import LinearGradient from "react-native-linear-gradient";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";

export default function CreateAlbum({
  modalAlbum,
  setModalAlbum,
  props,
  user_id,
  setAlbum,
  token,
  setIdAlbums,
}) {
  const { t } = useTranslation();
  const [newFeedAlbums, setNewFeedAlbums] = useState(false);
  const [select, setSelect] = useState("Itinerary Album");
  const [idItinerary, setIdItinerary] = useState("");
  const [modalDay, setModalDay] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [newTextFeed, setNewTextFeed] = useState("");
  let [loadings, setLoadings] = useState(false);

  const [
    QueryAlbums,
    { data: dataItinerary, loading: loadingItinerary, error },
  ] = useLazyQuery(ListItinerary, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { status: "A", keyword: searchText },
  });

  const [
    QueryFeed,
    { data: listAlbum, loading: loadingAlbum, error: errorAlbum },
  ] = useLazyQuery(ListAlbum, {
    fetchPolicy: "network-only",
    variables: { user_id: user_id, keyword: searchText },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  useEffect(() => {
    QueryAlbums();
    QueryFeed();
  }, []);

  const Choose = (id) => {
    setIdItinerary(id);
    setModalDay(true);
  };

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

  const SubmitAddFeed = async (newTextFeed) => {
    // setLoadings(true);
    if (newTextFeed === "" || newTextFeed === null) {
      return RNToasty.Show({
        title: t("emptyAlbumTitle"),
        position: "bottom",
      });
    }

    try {
      let response = await MutationCreateAlbumFeed({
        variables: {
          title: newTextFeed,
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
          QueryFeed();
          setNewFeedAlbums(false);
          setNewTextFeed("");
        }
      }
    } catch (e) {
      RNToasty.Show({
        title: t("failedCreateAlbum"),
        position: "bottom",
      });
    }
  };

  const _searchHandle = (e) => {
    setSearchText(e);
    if (index === 0) {
      QueryAlbums();
    } else {
      QueryFeed();
    }
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 0.7 },
        ]}
      >
        {route.title}
      </Text>
    );
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "itinerary", title: "Itinerary Album" },
    { key: "feed", title: "Feed Album" },
  ]);

  const renderScene = ({ route }) => {
    if (route.key == "itinerary") {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            width: width,
            height: Dimensions.get("screen").height - 190,
            paddingHorizontal: 15,
            backgroundColor: "#FFF",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: width - 30,
              marginBottom: 20,
            }}
          >
            {loadingItinerary ? (
              <View
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("screen").width - 30,
                  marginTop: 20,
                }}
              >
                <ActivityIndicator size="small" color="#209fae" />
              </View>
            ) : (
              dataItinerary &&
              dataItinerary?.itinerary_list_all.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    marginTop: 10,
                    width: width - 33,
                    alignItems: "center",
                  }}
                  onPress={() => Choose(item?.id)}
                >
                  <View
                    style={{
                      height: width / 2.5,
                      width: width - 33,
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
                        borderRadius: 5,
                      }}
                    />
                    <LinearGradient
                      colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0)"]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={{
                        height: "100%",
                        width: "100%",
                        alignItems: "flex-start",
                        alignContent: "flex-start",
                        justifyContent: "flex-end",
                        borderRadius: 5,
                        position: "absolute",
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 15,
                          paddingVertical: 15,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          size="title"
                          type="bold"
                          style={{
                            lineHeight: 20,
                            color: "#FFF",
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          size="label"
                          type="regular"
                          style={{ color: "#FFF" }}
                        >
                          {item.album_count}{" "}
                          {item.album_count > 1 ? "albums" : "album"}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      );
    } else if (route.key == "feed") {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            width: width,
            height: Dimensions.get("screen").height - 190,
            paddingHorizontal: 15,
            backgroundColor: "#FFF",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: width - 30,
              marginBottom: 20,
              // flex: 1,
              // borderWidth: 5,
            }}
          >
            <Pressable
              onPress={() => setNewFeedAlbums(true)}
              style={{
                marginTop: 20,
                width: (width - 33) / 3,
                // borderWidth: 1,
              }}
            >
              <View
                style={{
                  height: (width - 33) / 3 - 10,
                  width: (width - 33) / 3 - 10,
                  backgroundColor: "#F6F6F6",
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  borderRadius: 5,
                }}
              >
                <NewAlbum height={60} width={60} />
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
              >
                <Text size="label" type="regular">
                  {t("create") + " " + "Album"}
                </Text>
              </View>
            </Pressable>

            {loadingAlbum ? (
              <View
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("screen").width - 30,
                  marginTop: 20,
                }}
              >
                <ActivityIndicator size="small" color="#209fae" />
              </View>
            ) : (
              listAlbum &&
              listAlbum?.list_albums.map((item, index) => (
                <Pressable
                  onPress={() => {
                    setModalAlbum(false);
                    setIdAlbums(item.id);
                    setAlbum("Feed"),
                      setTimeout(() => {
                        props.navigate("CreatePostScreen", {
                          token: token,
                          id_album: item.id,
                          title_album: item.title,
                        });
                      }, 500);
                  }}
                  key={index}
                  style={{
                    marginTop: 20,
                    width: (width - 33) / 3,
                  }}
                >
                  <View
                    style={{
                      height: (width - 33) / 3 - 10,
                      width: (width - 33) / 3 - 10,
                      backgroundColor: "#F6F6F6",
                      justifyContent: "center",
                      alignSelf: "center",
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
                        borderRadius: 3,
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
              ))
            )}
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}
    >
      <Loading show={loadings} />

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
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              backgroundColor: "#209fae",
              height: 55,
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              // marginTop: Platform.OS === "ios" ? 0 : 0,
            }}
          >
            <View
              style={{
                height: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: "100%",
                  justifyContent: "center",
                }}
                onPress={() => setModalAlbum(false)}
              >
                <Arrowbackwhite
                  width={20}
                  height={20}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
              <View
                style={{
                  height: 50,
                  justifyContent: "center",
                }}
              >
                <Text size="label" type="regular" style={{ color: "#FFF" }}>
                  Post
                </Text>
                <Text size="description" type="light" style={{ color: "#FFF" }}>
                  {t("Select") + " "}
                  {select == "Itinerary Album" ? "Itinerary" : "Album"}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ width: width, paddingHorizontal: 15 }}>
            <View
              style={{
                height: 40,
                width: "100%",
                marginVertical: 10,
                borderRadius: 5,
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                paddingHorizontal: 10,
                flexDirection: "row",
              }}
            >
              <Search height={18} width={18} />
              <TextInput
                value={searchText}
                onChangeText={(text) => _searchHandle(text)}
                placeholder={t("lookFor")}
                placeholderTextColor="#464646"
                style={{
                  flex: 1,
                  color: "#000",
                  height: 40,
                  // width: "70%",
                  width: "77%",
                }}
              />
            </View>
          </View>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => {
              return (
                <TabBar
                  {...props}
                  style={{
                    backgroundColor: "white",
                  }}
                  renderLabel={renderLabel}
                  indicatorStyle={styles.indicator}
                />
              );
            }}
          />
          {/* <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  width: width,
                  height: Dimensions.get("screen").height - 190,
                  paddingHorizontal: 15,
                  backgroundColor: "#FFF",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: width - 30,
                    marginBottom: 20,
                    // flex: 1,
                    // borderWidth: 5,
                  }}
                >
                  {select !== "Itinerary Album" ? (
                    <Pressable
                      onPress={() => setNewFeedAlbums(true)}
                      style={{
                        marginTop: 20,
                        width: (width - 33) / 3,
                        // borderWidth: 1,
                      }}
                    >
                      <View
                        style={{
                          height: (width - 33) / 3 - 10,
                          width: (width - 33) / 3 - 10,
                          backgroundColor: "#F6F6F6",
                          justifyContent: "center",
                          alignSelf: "center",
                          alignItems: "center",
                          alignSelf: "center",
                          borderRadius: 5,
                        }}
                      >
                        <NewAlbum height={60} width={60} />
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          marginTop: 10,
                        }}
                      >
                        <Text size="label" type="regular">
                          {t("create") + " " + "Album"}
                        </Text>
                      </View>
                    </Pressable>
                  ) : null}
                  {select === "Itinerary Album" ? (
                    loadingItinerary ? (
                      <View
                        style={{
                          alignSelf: "center",
                          width: Dimensions.get("screen").width - 30,
                          marginTop: 20,
                        }}
                      >
                        <ActivityIndicator size="small" color="#209fae" />
                      </View>
                    ) : (
                      dataItinerary &&
                      dataItinerary?.itinerary_list_all.map((item, index) => (
                        <Pressable
                          key={index}
                          style={{
                            marginTop: 10,
                            width: width - 33,
                            alignItems: "center",
                          }}
                          onPress={() => Choose(item?.id)}
                        >
                          <View
                            style={{
                              height: width / 2.5,
                              width: width - 33,
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
                                borderRadius: 5,
                              }}
                            />
                            <LinearGradient
                              colors={[
                                "rgba(0, 0, 0, 0.7)",
                                "rgba(0, 0, 0, 0)",
                              ]}
                              start={{ x: 0, y: 1 }}
                              end={{ x: 0, y: 0 }}
                              style={{
                                height: "100%",
                                width: "100%",
                                alignItems: "flex-start",
                                alignContent: "flex-start",
                                justifyContent: "flex-end",
                                borderRadius: 5,
                                position: "absolute",
                              }}
                            >
                              <View
                                style={{
                                  paddingHorizontal: 15,
                                  paddingVertical: 15,
                                }}
                              >
                                <Text
                                  numberOfLines={2}
                                  size="title"
                                  type="bold"
                                  style={{
                                    lineHeight: 20,
                                    color: "#FFF",
                                  }}
                                >
                                  {item.name}
                                </Text>
                                <Text
                                  size="label"
                                  type="regular"
                                  style={{ color: "#FFF" }}
                                >
                                  {item.album_count}{" "}
                                  {item.album_count > 1 ? "albums" : "album"}
                                </Text>
                              </View>
                            </LinearGradient>
                          </View>
                        </Pressable>
                      ))
                    )
                  ) : loadingAlbum ? (
                    <View
                      style={{
                        alignSelf: "center",
                        width: Dimensions.get("screen").width - 30,
                        marginTop: 20,
                      }}
                    >
                      <ActivityIndicator size="small" color="#209fae" />
                    </View>
                  ) : (
                    listAlbum &&
                    listAlbum?.list_albums.map((item, index) => (
                      <Pressable
                        onPress={() => {
                          setModalAlbum(false);
                          setIdAlbums(item.id);
                          setAlbum("Feed"),
                            setTimeout(() => {
                              props.navigate("CreatePostScreen", {
                                token: token,
                                id_album: item.id,
                                title_album: item.title,
                              });
                            }, 500);
                        }}
                        key={index}
                        style={{
                          marginTop: 20,
                          width: (width - 33) / 3,
                        }}
                      >
                        <View
                          style={{
                            height: (width - 33) / 3 - 10,
                            width: (width - 33) / 3 - 10,
                            backgroundColor: "#F6F6F6",
                            justifyContent: "center",
                            alignSelf: "center",
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
                              borderRadius: 3,
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
                    ))
                  )}
                </View>
              </ScrollView> */}
        </View>
      </Modal>

      {/* <Modal
        animationType="fade"
        visible={modalAlbum}
        onRequestClose={() => setModalAlbum(false)}
        onDismiss={() => setModalAlbum(false)}
        style={{
          alignSelf: "center",
        }}
      >
        <MenuProvider
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              backgroundColor: "#209fae",
              height: 55,
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              marginTop: Platform.OS === "ios" ? 0 : 0,
            }}
          >
            <View
              style={{
                height: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: "100%",
                  justifyContent: "center",
                }}
                onPress={() => setModalAlbum(false)}
              >
                <Arrowbackwhite
                  width={20}
                  height={20}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
              <View
                style={{
                  height: 50,
                  justifyContent: "center",
                }}
              >
                <Text size="label" type="regular" style={{ color: "#FFF" }}>
                  Post
                </Text>
                <Text size="description" type="light" style={{ color: "#FFF" }}>
                  {t("Select") + " "}
                  {select == "Itinerary Album" ? "Itinerary" : "Album"}
                </Text>
              </View>
            </View>
            <Menu
              renderer={renderers.ContextMenu}
              style={{
                justifyContent: "center",
              }}
            >
              <MenuTrigger
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  color: "#FFF",
                  height: "100%",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{ color: "#FFF" }}
                >
                  {select ? select : "Feed Album"}
                </Text>
                <Down height="10" width="10" style={{ marginLeft: 5 }} />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  height: 80,
                  marginTop: 40,
                  paddingHorizontal: 10,
                }}
              >
                <MenuOption
                  onSelect={() => {
                    setSelect("Itinerary Album");
                    setSearchText("");
                  }}
                  style={{
                    height: 40,
                    justifyContent: "center",
                  }}
                >
                  <Text size="description" type="regular">
                    Itinerary Album
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setSelect("Feed Album");
                    setSearchText("");
                  }}
                  style={{
                    height: 40,
                    justifyContent: "center",
                  }}
                >
                  <Text size="description" type="regular">
                    Feed Album
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
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
                // height: height - 130,
              }}
            >
              <View style={{ width: width, paddingHorizontal: 15 }}>
                <View
                  style={{
                    height: 40,
                    width: "100%",
                    marginVertical: 10,
                    borderRadius: 5,
                    backgroundColor: "#f6f6f6",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    flexDirection: "row",
                  }}
                >
                  <Search height={18} width={18} />
                  <TextInput
                    value={searchText}
                    onChangeText={(text) => _searchHandle(text)}
                    placeholder={t("lookFor")}
                    placeholderTextColor="#464646"
                    style={{
                      flex: 1,
                      color: "#000",
                      height: 40,
                      // width: "70%",
                      width: "77%",
                    }}
                  />
                </View>
              </View>
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
                  // height: Dimensions.get("screen").height - 100,
                  paddingHorizontal: 15,
                  backgroundColor: "#FFF",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: width - 30,
                    marginBottom: 20,
                    flex: 1,
                    // borderWidth: 5,
                  }}
                >
                  {select !== "Itinerary Album" ? (
                    <Pressable
                      onPress={() => setNewFeedAlbums(true)}
                      style={{
                        marginTop: 20,
                        width: (width - 33) / 3,
                        // borderWidth: 1,
                      }}
                    >
                      <View
                        style={{
                          height: (width - 33) / 3 - 10,
                          width: (width - 33) / 3 - 10,
                          backgroundColor: "#F6F6F6",
                          justifyContent: "center",
                          alignSelf: "center",
                          alignItems: "center",
                          alignSelf: "center",
                          borderRadius: 5,
                        }}
                      >
                        <NewAlbum height={60} width={60} />
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          marginTop: 10,
                        }}
                      >
                        <Text size="label" type="regular">
                          {t("create") + " " + "Album"}
                        </Text>
                      </View>
                    </Pressable>
                  ) : null}
                  {select === "Itinerary Album" ? (
                    loadingItinerary ? (
                      <View
                        style={{
                          alignSelf: "center",
                          width: Dimensions.get("screen").width - 30,
                          marginTop: 20,
                        }}
                      >
                        <ActivityIndicator size="small" color="#209fae" />
                      </View>
                    ) : (
                      dataItinerary &&
                      dataItinerary?.itinerary_list_all.map((item, index) => (
                        <Pressable
                          key={index}
                          style={{
                            marginTop: 20,
                            width: (width - 33) / 2,
                            alignItems: "center",
                          }}
                          onPress={() => Choose(item?.id)}
                        >
                          <View
                            style={{
                              height: (width - 33) / 2 - 30,
                              // width: "90%",
                              width: (width - 33) / 2 - 30,
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
                                borderRadius: 5,
                              }}
                            />
                          </View>
                          <View
                            style={{
                              paddingLeft: 5,
                              marginTop: 10,
                              alignSelf: "flex-start",
                              marginLeft: 8,
                            }}
                          >
                            <Text
                              numberOfLines={2}
                              size="label"
                              type="bold"
                              style={{
                                height: 45,
                                lineHeight: 20,
                              }}
                            >
                              {item.name}
                            </Text>
                            <Text size="description" type="regular">
                              {item.album_count}{" "}
                              {item.album_count > 1 ? "albums" : "album"}
                            </Text>
                          </View>
                        </Pressable>
                      ))
                    )
                  ) : loadingAlbum ? (
                    <View
                      style={{
                        alignSelf: "center",
                        width: Dimensions.get("screen").width - 30,
                        marginTop: 20,
                      }}
                    >
                      <ActivityIndicator size="small" color="#209fae" />
                    </View>
                  ) : (
                    listAlbum &&
                    listAlbum?.list_albums.map((item, index) => (
                      <Pressable
                        onPress={() => {
                          setModalAlbum(false);
                          setIdAlbums(item.id);
                          setAlbum("Feed"),
                            setTimeout(() => {
                              props.navigate("CreatePostScreen", {
                                token: token,
                                id_album: item.id,
                                title_album: item.title,
                              });
                            }, 500);
                        }}
                        key={index}
                        style={{
                          marginTop: 20,
                          width: (width - 33) / 3,
                        }}
                      >
                        <View
                          style={{
                            height: (width - 33) / 3 - 10,
                            width: (width - 33) / 3 - 10,
                            backgroundColor: "#F6F6F6",
                            justifyContent: "center",
                            alignSelf: "center",
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
                              borderRadius: 3,
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
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </MenuProvider>
      </Modal> */}

      {/* create new album feed exiting */}

      <Modal
        useNativeDriver={true}
        visible={newFeedAlbums}
        onRequestClose={() => setNewFeedAlbums(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setNewFeedAlbums(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            alignSelf: "center",
            backgroundColor: "#000000",
            opacity: 0.7,
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            width: Dimensions.get("screen").width - 30,
            top: Dimensions.get("screen").height / 3,
            position: "absolute",
            zIndex: 15,
            alignSelf: "center",
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
                onChangeText={(text) => setNewTextFeed(text)}
                value={newTextFeed}
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
                  setNewFeedAlbums(false);
                  setNewTextFeed("");
                }}
                size="medium"
                color="transparant"
                text={t("cancel")}
              ></Button>
              <Button
                onPress={() => SubmitAddFeed(newTextFeed)}
                size="medium"
                color="primary"
                text={t("create") + " " + "Album"}
              ></Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Choose Day */}
      {!idItinerary ? null : (
        <ChooseAlbumItinerary
          modalDay={modalDay}
          setModalDay={(e) => setModalDay(e)}
          setModalAlbum={(e) => {
            setModalAlbum(e);
          }}
          idItinerary={idItinerary}
          token={token}
          props={props}
          setAlbum={(e) => setAlbum(e)}
          setIdAlbums={(e) => setIdAlbums(e)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: 14,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: 14,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    height: 50,
  },
  indicator: { backgroundColor: "#209FAE", height: 3 },
});
