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
} from "react-native";
import { Button, Text, CustomImage, Loading } from "../../../component";
import { default_image, search_button } from "../../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import {
  Arrowbackwhite,
  CheckWhite,
  Xgray,
  ArrowRight,
} from "../../../assets/svg";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NewGroup({ navigation }) {
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState(null);
  let [search, setSearch] = useState("");
  const [user, setUser] = useState({});
  let [loading, setloading] = useState(false);
  const [
    querywith,
    { loading: loadingwith, data: DataBuddy, error: errorwith },
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
  });

  const ChatOptions = {
    headerShown: true,
    headerTitle: "New Group",
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
      marginLeft: -10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => navigation.goBack()}
        style={{
          height: 55,
          marginLeft: 10,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
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
        // borderWidth: 1,
      }}
    >
      <Loading show={loading} />
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
            position: "absolute",
            bottom: 20,
            right: 20,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <ArrowRight width={20} height={20} />
        </Pressable>
      ) : null}
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 10,
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
            width: Dimensions.get("screen").width,
          }}
        >
          <View
            style={{
              backgroundColor: "#DAF0F2",
              borderRadius: 5,
              width: "100%",
              height: 40,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <CustomImage
                source={search_button}
                customImageStyle={{ resizeMode: "cover" }}
                customStyle={{
                  height: 15,
                  width: 15,
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
                width: "100%",
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
              value={search}
              onChangeText={(text) => _setSearch(text)}
            />
          </View>
        </View>
        {userSelected && userSelected.length > 0 ? (
          <FlatList
            data={userSelected}
            keyExtractor={(item) => "SELECTED_" + item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginVertical: 10,
              paddingHorizontal: 20,
            }}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => selectUser(item)}>
                <ImageBackground
                  source={
                    item && item.picture ? { uri: item.picture } : default_image
                  }
                  style={{
                    resizeMode: "cover",
                    height: 55,
                    width: 55,
                    borderRadius: 30,
                    marginRight: 20,
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
                </ImageBackground>
              </Pressable>
            )}
          />
        ) : null}
      </View>
      <ScrollView
        style={{
          backgroundColor: "#fff",
        }}
      >
        {loadingwith ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator animating={true} color="#209FAE" />
          </View>
        ) : DataBuddy && DataBuddy.search_travelwith.length > 1 ? (
          <View style={{ width: Dimensions.get("screen").width }}>
            <FlatList
              scrollEnabled={false}
              data={DataBuddy.search_travelwith}
              keyExtractor={(item) => item.id}
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
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <ImageBackground
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
                    </ImageBackground>
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
                        size="small"
                        type="regular"
                        style={{
                          marginLeft: 20,
                        }}
                      >
                        @{item.username}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          //   <RenderBuddy databuddy={DataBuddy.search_travelwith} />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              //   marginTop: 20,
            }}
          >
            <Text size="label" type="bold">
              Tidak ada data
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
