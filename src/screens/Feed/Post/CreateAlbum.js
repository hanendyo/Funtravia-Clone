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
  SafeAreaView,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import {
  NewAlbum,
  Arrowbackwhite,
  Search,
  Xgray,
  Arrowbackios,
} from "../../../assets/svg";
import { Text, Button, Loading, FunImage } from "../../../component";
import { useTranslation } from "react-i18next";
import { RNToasty } from "react-native-toasty";
import CreateAlbumFeed from "../../../graphQL/Mutation/Post/CreateAlbumFeed";
import { useMutation } from "@apollo/react-hooks";
const { width } = Dimensions.get("screen");
import ListItinerary from "../../../graphQL/Query/Itinerary/listitineraryAll";
import ListAlbum from "../../../graphQL/Query/Itinerary/ListAlbum";
import { default_image } from "../../../assets/png";
import LinearGradient from "react-native-linear-gradient";
import { TabBar, TabView } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateAlbum(props) {
  const { t } = useTranslation();
  const [newFeedAlbums, setNewFeedAlbums] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [newTextFeed, setNewTextFeed] = useState("");
  const [index, setIndex] = React.useState(0);
  const [token, setToken] = useState(props?.route?.params?.token);
  let [loadings, setLoadings] = useState(false);

  const loadAsync = async () => {
    const tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
  };

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
      fontSize: 18,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
    },
    headerLeft: () => (
      <View style={{ flexDirection: "row" }}>
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => props.navigation.goBack()}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Button>
        <View style={{ marginLeft: 5 }}>
          <Text size="label" type="bold" style={{ color: "#FFF" }}>
            Post
          </Text>
          <Text size="description" type="regular" style={{ color: "#FFF" }}>
            {t("Select") + " Album"}
          </Text>
        </View>
      </View>
    ),
  };

  useEffect(() => {
    loadAsync();
    props.navigation.setOptions(HeaderComponent);
  }, []);

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
    variables: { status: ["A", "F"], keyword: searchText },
  });

  const [
    QueryFeed,
    { data: listAlbum, loading: loadingAlbum, error: errorAlbum },
  ] = useLazyQuery(ListAlbum, {
    fetchPolicy: "network-only",
    variables: { user_id: props?.route?.params?.user_id, keyword: searchText },
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
    props.route.params.isAlbum === true
      ? props.navigation.navigate("FeedStack", {
          screen: "ChooseAlbumItinerary",
          params: {
            idItinerary: id,
            token: token,
            file: props.route.params.file,
            type: props.route.params.type,
            location: props.route.params.location,
            post_id: props.route.params.post_id,
            isAlbum: true,
            from: props.route.params.from,
            data_post: props.route.params.data_post,
          },
        })
      : props.navigation.navigate("FeedStack", {
          screen: "ChooseAlbumItinerary",
          params: {
            idItinerary: id,
            file: props.route.params.file,
            type: props.route.params.type,
            location: props.route.params.location,
            token: token,
            post_id: props.route.params.post_id,
            isAlbum: false,
            from: props.route.params.from,
            data_post: props.route.params.data_post,
          },
        });
    // setIdItinerary(id);
    // setModalDay(true);
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
          { opacity: focused ? 1 : 0.7, marginBottom: 3 },
        ]}
      >
        {route.title}
      </Text>
    );
  };

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
            {loadingAlbum ? null : (
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
            )}

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
                    props.route.params.isAlbum === false
                      ? props.navigation.navigate("FeedStack", {
                          screen: "CreatePostScreen",
                          params: {
                            token: token,
                            id_album: item.id,
                            title_album: item.title,
                            album: "Feed",
                            file: props.route.params.file,
                            type: props.route.params.type,
                            location: props.route.params.location,
                          },
                        })
                      : props.navigation.navigate("FeedStack", {
                          screen: "ListFotoAlbums",
                          params: {
                            token: token,
                            id_album: item.id,
                            title_album: item.title,
                            album: "Feed",
                            file: props.route.params.file,
                            type: props.route.params.type,
                            location: props.route.params.location,
                            post_id: props.route.params.post_id,
                            from: props.route.params.from,
                          },
                        });
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
                      {item.count_foto} {t("photo")}
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
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Loading show={loadings} />
      <View
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            height: 40,
            marginTop: 15,
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
                height: 50,
              }}
              renderLabel={renderLabel}
              indicatorStyle={styles.indicator}
            />
          );
        }}
      />

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
            width: Dimensions.get("screen").width - 100,
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
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
                backgroundColor: "#f6f6f6",
                borderRadius: 5,
                flexDirection: "row",
              }}
            >
              <Text
                type="bold"
                size="title"
                style={{ marginBottom: 15, marginTop: 13 }}
              >
                New Album
              </Text>
              <Pressable
                onPress={() => setNewFeedAlbums(false)}
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
            </View>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                // backgroundColor: "#f6f6f6",
                marginVertical: 10,
              }}
            >
              <TextInput
                multiline
                placeholder={t("untitle")}
                maxLength={1000}
                placeholderStyle={{ fontSize: 50 }}
                placeholderTextColor="#6C6C6C"
                style={{
                  height: 50,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  fontSize: 14,
                  marginVertical: 10,
                  fontFamily: "Lato-Regular",
                  backgroundColor: "#f6f6f6",
                }}
                onChangeText={(text) => setNewTextFeed(text)}
                onSubmitEditing={(text) => setNewTextFeed(text)}
                value={newTextFeed}
              />
            </View>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
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
      {/* {!idItinerary ? null : (
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
      )} */}
    </SafeAreaView>
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
