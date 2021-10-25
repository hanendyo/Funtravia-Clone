import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import {
  Button,
  Text,
  CustomImage,
  Loading,
  FunImageBackground,
  FunImage,
} from "../../../component";
import { default_image, search_button } from "../../../assets/png";
import { useLazyQuery } from "@apollo/client";
import {
  Arrowbackwhite,
  CheckWhite,
  Xgray,
  Xblue,
  ArrowRight,
} from "../../../assets/svg";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";

export default function NewGroup({ navigation }) {
  const Notch = DeviceInfo.hasNotch();
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState(null);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({});
  let [loading, setloading] = useState(false);
  let [DataBuddy, setDataBuddy] = useState([]);

  const [
    querywith,
    { loading: loadingwith, data: DataBuddys, error: errorwith },
  ] = useLazyQuery(TravelWith, {
    fetchPolicy: "network-only",
    variables: {
      keyword: search,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setDataBuddy(DataBuddys.search_travelwith);
    },
  });

  const ChatOptions = {
    headerShown: true,
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
      marginLeft: -10,
    },
    headerLeft: () => (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => props.navigation.goBack()}
          style={{
            height: 55,
            marginLeft: 10,
          }}
        >
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        </Button>
        <View>
          <Text size="label" style={{ color: "white" }}>
            {t("newGroupChat")}
          </Text>
          <Text style={{ color: "white" }}>{t("addParticipants")}</Text>
        </View>
      </View>
    ),
    headerRight: () => (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      ></View>
    ),
  };

  useEffect(() => {
    getUserAndToken();
    navigation.setOptions(ChatOptions);
  }, []);

  const getUserAndToken = async () => {
    let token = await AsyncStorage.getItem("access_token");
    if (token) {
      await setToken(token);
      await _setSearch(null);
      await querywith();
    }

    let data = await AsyncStorage.getItem("setting");
    if (data) {
      await setUser(JSON.parse(data).user);
    }
  };

  const _setSearch = async (text) => {
    setSearch(text);
    querywith();
  };

  const [userSelected, setUserSelected] = useState([]);
  const selectUser = (data) => {
    let tempData = [...userSelected];
    let index = tempData.findIndex((k) => k["id"] === data.id);
    if (index !== -1) {
      tempData.splice(index, 1);
      setUserSelected(tempData);
    } else {
      tempData.splice(0, 0, data);
      setUserSelected(tempData);
    }
  };

  const next_createGrup = (userSelected) => {
    navigation.navigate("ChatStack", {
      screen: "CraeteGrup",
      params: {
        userSelected: userSelected,
      },
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 10,
        margin: 15,
        // backgroundColor: "white",
        // borderWidth: 1,
      }}
    >
      {/* <Loading show={loading} /> */}
      <View
        style={{
          flex: 1,
          // margin: 10,
          borderRadius: 15,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            paddingTop: 10,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20,
              height: 50,
              zIndex: 5,
              flexDirection: "row",
              width: Dimensions.get("screen").width - 30,
            }}
          >
            <View
              style={{
                backgroundColor: "#F6F6F6",
                borderRadius: 5,
                width: "100%",
                height: 40,
                paddingHorizontal: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View>
                <CustomImage
                  source={search_button}
                  customImageStyle={{ resizeMode: "cover" }}
                  customStyle={{
                    height: 17,
                    width: 17,
                    alignSelf: "center",
                    zIndex: 100,
                    marginHorizontal: 5,
                  }}
                />
              </View>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder={t("search")}
                style={{
                  width: "85%",
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                }}
                value={search}
                onChangeText={(text) => _setSearch(text)}
                onSubmitEditing={(text) => _setSearch(text)}
              />
              {search ? (
                <TouchableOpacity onPress={() => _setSearch("")}>
                  <Xblue
                    width="20"
                    height="20"
                    style={{
                      alignSelf: "center",
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          {userSelected && userSelected.length > 0 ? (
            <FlatList
              data={userSelected}
              keyExtractor={(item) => "SELECTED_" + item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
              style={{ borderBottomColor: "#F6F6F6", borderBottomWidth: 1 }}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => selectUser(item)}
                  style={{
                    // borderRadius: 15,
                    // margin: 10,
                    // justifyContent: "center",
                    alignItems: "center",
                    marginRight: 20,
                  }}
                >
                  <FunImageBackground
                    size="xs"
                    source={
                      item && item.picture
                        ? { uri: item.picture }
                        : default_image
                    }
                    style={{
                      resizeMode: "cover",
                      height: 55,
                      width: 55,
                      borderRadius: 30,
                      marginBottom: 5,
                    }}
                    imageStyle={{
                      height: 55,
                      width: 55,
                      borderRadius: 30,
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: "#D1D1D1",
                        position: "absolute",
                        bottom: 0,
                        right: -5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Xgray width={10} height={10} />
                    </View>
                  </FunImageBackground>
                  <Text>{item.first_name}</Text>
                </Pressable>
              )}
            />
          ) : null}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : null}
          keyboardVerticalOffset={Notch ? 90 : 65}
          style={{
            backgroundColor: "#fff",
            flex: 1,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <FlatList
            style={{}}
            data={DataBuddy}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{}}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => selectUser(item)}
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F6F6F6",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <FunImageBackground
                    size="xs"
                    source={
                      item && item.picture
                        ? { uri: item.picture }
                        : default_image
                    }
                    style={{
                      resizeMode: "cover",
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                    }}
                    imageStyle={{
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                    }}
                  >
                    {userSelected.findIndex((k) => k["id"] === item.id) !==
                    -1 ? (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 1.5,
                          borderColor: "#FFF",
                          backgroundColor: "#209fae",
                          position: "absolute",
                          bottom: 0,
                          right: -5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CheckWhite width={10} height={10} />
                      </View>
                    ) : null}
                  </FunImageBackground>
                  <View>
                    <Text
                      size="label"
                      type="bold"
                      style={{
                        marginLeft: 20,
                      }}
                      numberOfLines={1}
                    >
                      {item.first_name} {item.last_name ? item.last_name : ""}
                    </Text>

                    <Text
                      size="description"
                      type="regular"
                      style={{
                        marginLeft: 20,
                        marginTop: 5,
                      }}
                    >
                      @{item.username}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* tombol */}
          {userSelected.length > 0 ? (
            <Pressable
              onPress={() => next_createGrup(userSelected)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 1.5,
                borderColor: "#FFF",
                backgroundColor: "#209FAE",
                position: "relative",
                bottom: 75,
                marginBottom: -60,
                right: 15,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-end",
                zIndex: 1,
              }}
            >
              <ArrowRight width={20} height={20} />
            </Pressable>
          ) : null}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
