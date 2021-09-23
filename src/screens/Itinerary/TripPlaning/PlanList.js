import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  ScrollView,
  RefreshControl,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { default_image, imgPrivate } from "../../../assets/png";
import { dateFormats } from "../../../component/src/dateformatter";
import {
  Kosong,
  PinHijau,
  Calendargrey,
  User,
  TravelAlbum,
  TravelStories,
  Xgray,
  Lock,
  World,
  GlobeWorld,
} from "../../../assets/svg";
import { Truncate, Text, Button, FunImageBackground } from "../../../component";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Ripple from "react-native-material-ripple";
import ListItinerary from "../../../graphQL/Query/Itinerary/listitinerary";
import { loadingdata_intertwine } from "../../../assets/gif";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AsyncStorage from "@react-native-async-storage/async-storage";

const arrayShadow = {
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: Platform.OS == "ios" ? 0.1 : 0.1,
  shadowRadius: Platform.OS == "ios" ? 10 : 10,
  elevation: Platform.OS == "ios" ? 3 : 3,
};

export default function ActivePlan({
  props,
  token,
  rData,
  GetCount,
  GetData,
  GetDataActive,
  GetDataFinish,
  loadingdata,
}) {
  const { t } = useTranslation();
  const [modalLogin, setModalLogin] = useState(false);
  const { width, height } = Dimensions.get("screen");

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    GetCount();
    GetData();
    GetDataActive();
    GetDataFinish();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const getdate = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");

    return dateFormats(start[0]) + " - " + dateFormats(end[0]);
  };

  const capitalizeChar = (text) => {
    let str = text.charAt(0).toUpperCase();
    let str2 = text.slice(1, text.length);

    return str + str2;
  };

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {databuddy.map((value, i) => {
          if (i < 3) {
            return (
              <View key={i}>
                <Image
                  source={
                    value.user && value.user.picture
                      ? { uri: value.user.picture }
                      : default_image
                  }
                  style={{
                    resizeMode: "cover",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    marginLeft: -10,
                  }}
                />
              </View>
            );
          }
        })}

        {databuddy.length > 1 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              size="small"
              type={"regular"}
              style={{
                color: "white",
              }}
            >
              {"    "}
              {t("with")}{" "}
              {databuddy[1].user && databuddy[1].user.first_name
                ? databuddy[1].user.first_name
                : ""}
              {databuddy.length > 2
                ? " + " + (databuddy.length - 2) + " Others"
                : " "}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return (
      <View style={{ flexDirection: "row" }}>
        <Modal
          useNativeDriver={true}
          visible={modalLogin}
          onRequestClose={() => true}
          transparent={true}
          animationType="fade"
        >
          <Pressable
            // onPress={() => setModalLogin(false)}
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              justifyContent: "center",
              opacity: 0.7,
              backgroundColor: "#000",
              position: "absolute",
            }}
          ></Pressable>
          <View
            style={{
              width: Dimensions.get("screen").width - 120,
              marginHorizontal: 60,
              backgroundColor: "#FFF",
              zIndex: 15,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: Dimensions.get("screen").height / 4,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: Dimensions.get("screen").width - 120,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f6f6f6",
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginTop: 12,
                    marginBottom: 15,
                  }}
                  size="title"
                  type="bold"
                >
                  {t("LoginFirst")}
                </Text>
                <Pressable
                  onPress={() => {
                    props.navigation.navigate("HomeScreen");
                    setModalLogin(false);
                  }}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <View
                style={{
                  alignItems: "center",
                  marginHorizontal: 30,
                  marginBottom: 15,
                  marginTop: 12,
                }}
              >
                <Text style={{ marginBottom: 5 }} size="title" type="bold">
                  {t("nextLogin")}
                </Text>
                <Text
                  style={{ textAlign: "center", lineHeight: 18 }}
                  size="label"
                  type="regular"
                >
                  {t("textLogin")}
                </Text>
              </View>
              <View style={{ marginHorizontal: 30, marginBottom: 30 }}>
                <Button
                  style={{ marginBottom: 5 }}
                  onPress={() => {
                    setModalLogin(false);
                    props.navigation.push("AuthStack", {
                      screen: "LoginScreen",
                    });
                  }}
                  type="icon"
                  text={t("signin")}
                ></Button>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginVertical: 5,
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      borderBottomWidth: 1,
                      borderBottomColor: "#d1d1d1",
                      marginHorizontal: 10,
                    }}
                  ></View>
                  <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                    {t("or")}
                  </Text>
                  <View
                    style={{
                      width: 50,
                      borderBottomWidth: 1,
                      borderBottomColor: "#d1d1d1",
                      marginHorizontal: 10,
                    }}
                  ></View>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    size="label"
                    type="bold"
                    style={{ color: "#209FAE" }}
                    onPress={() => {
                      setModalLogin(false);
                      props.navigation.push("AuthStack", {
                        screen: "RegisterScreen",
                      });
                    }}
                  >
                    {t("createAkunLogin")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Text
          type={"regular"}
          style={{
            fontSize: 12,
          }}
        >
          {Difference_In_Days + 1} {t("days")}
          {", "}
        </Text>
        <Text
          type={"regular"}
          style={{
            fontSize: 12,
          }}
        >
          {Difference_In_Days} {t("nights")}
        </Text>
      </View>
    );
  };

  if (loadingdata && rData.length < 1) {
    return (
      <SkeletonPlaceholder>
        <View
          style={{
            width: width,
            height: 155,
            paddingHorizontal: 15,
            marginTop: 15,
            // paddingVertical: 5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#efefef",
              // marginVertical: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: Dimensions.get("screen").width * 0.3,
                  height: 112.5,
                  borderTopLeftRadius: 5,
                }}
              ></View>
              <View
                style={{
                  marginLeft: 5,
                  padding: 5,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: Dimensions.get("screen").width * 0.3,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 10,
                    height: 15,
                    width: Dimensions.get("screen").width * 0.4,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 5,
                    height: 10,
                    width: Dimensions.get("screen").width * 0.3,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 10,
                    height: 15,
                    width: Dimensions.get("screen").width * 0.4,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
            </View>
            <View
              style={{
                height: 37.5,
                flexDirection: "row",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 20,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 34,
                  borderRightWidth: 1,
                  borderColor: "#efefef",
                }}
              ></View>
              <View
                style={{
                  height: 20,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 5,
                }}
              ></View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: width,
            height: 155,
            paddingHorizontal: 15,
            marginTop: 5,
            // paddingVertical: 5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#efefef",

              // marginVertical: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: Dimensions.get("screen").width * 0.3,
                  height: 112.5,
                  borderTopLeftRadius: 5,
                }}
              ></View>
              <View
                style={{
                  marginLeft: 5,
                  padding: 5,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: Dimensions.get("screen").width * 0.3,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 10,
                    height: 15,
                    width: Dimensions.get("screen").width * 0.4,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 5,
                    height: 10,
                    width: Dimensions.get("screen").width * 0.3,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 10,
                    height: 15,
                    width: Dimensions.get("screen").width * 0.4,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
            </View>
            <View
              style={{
                height: 37.5,
                flexDirection: "row",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 20,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 34,
                  borderRightWidth: 1,
                  borderColor: "#efefef",
                }}
              ></View>
              <View
                style={{
                  height: 20,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 5,
                }}
              ></View>
            </View>
          </View>
        </View>
      </SkeletonPlaceholder>
    );
  }

  if (rData?.length < 1) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_Refresh} />
          }
        >
          <View
            style={{
              height: height - 250,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Text
              size="title"
              type={"bold"}
              style={{ width: "70%", textAlign: "center" }}
            >
              {t("empty")}
            </Text>
            <Kosong height={width * 0.6} width={width} />
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 60,
            width: width,
            backgroundColor: "white",
            // marginVertical: 15,
            borderTopWidth: 1,
            borderColor: "#F0F0F0",
            shadowColor: "#F0F0F0",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            color="secondary"
            onPress={() => {
              props.navigation.push("ItineraryStack", { screen: "Trip" });
            }}
            // onPress={() => {
            //   props.route.params.token !== null
            //     ? props.navigation.push("ItineraryStack", { screen: "Trip" })
            //     : setModalLogin(true);
            // }}
            style={{
              width: width - 40,
              height: 40,
            }}
            text={t("CreateNewPlan")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_Refresh} />
        }
        contentContainerStyle={{
          justifyContent: "space-evenly",
          paddingStart: 10,
          paddingEnd: 10,
          paddingBottom: 100,
        }}
        horizontal={false}
        data={rData}
        renderItem={({ item }) => (
          <View
            style={{
              height: 157,
              marginTop: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#d1d1d1",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: arrayShadow.shadowOpacity,
              shadowRadius: arrayShadow.shadowRadius,
              elevation: arrayShadow.elevation,
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            <Ripple
              onPress={() =>
                props.navigation.push("ItineraryStack", {
                  screen: "itindetail",
                  params: {
                    itintitle: item.name,
                    country: item.id,
                    dateitin: getdate(item.start_date, item.end_date),
                    token: token,
                    status: "edit",
                  },
                })
              }
              style={{
                backgroundColor: "#FFFFFF",
                height: "75%",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                flexDirection: "row",
                zIndex: 99,
                shadowColor: "black",
                shadowOpacity: arrayShadow.shadowOpacity,
                shadowRadius: arrayShadow.shadowRadius,
                elevation: arrayShadow.elevation,
              }}
            >
              <ImageBackground
                source={
                  item && item.cover ? { uri: item.cover } : default_image
                }
                style={{
                  height: "100%",
                  width: "40%",
                  borderTopLeftRadius: 5,
                }}
                imageStyle={{
                  borderTopLeftRadius: 5,
                  borderWidth: 0.2,
                  borderColor: "#d3d3d3",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Ripple
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: 10,
                  }}
                  onPress={() =>
                    props.navigation.push("ItineraryStack", {
                      screen: "itindetail",
                      params: {
                        itintitle: item.name,
                        country: item.id,
                        dateitin: getdate(item.start_date, item.end_date),
                        token: token,
                        status: "edit",
                      },
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={
                        item.user_created
                          ? { uri: item.user_created.picture }
                          : default_image
                      }
                      style={{
                        zIndex: 2,
                        backgroundColor: "#ffff",
                        borderRadius: 15,
                        width: 30,
                        height: 30,
                        borderWidth: 1,
                        borderColor: "#ffff",
                      }}
                    ></Image>
                    <View
                      style={{
                        position: "relative",
                        marginLeft: -5,
                        zIndex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Text
                        size="small"
                        type={"regular"}
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {item.user_created
                          ? item.user_created.first_name
                          : "User_Funtravia"}
                      </Text>
                    </View>
                  </View>
                </Ripple>
              </ImageBackground>

              <View
                style={{
                  width: "60%",
                  height: "100%",
                  paddingHorizontal: 15,
                  backgroundColor: "#FFFFFF",
                  paddingVertical: 10,
                  overflow: "hidden",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#DAF0F2",
                        borderWidth: 1,
                        borderRadius: 3,
                        borderColor: "#209FAE",
                        marginRight: 10,
                        paddingHorizontal: 4,
                        paddingVertical: 1,
                      }}
                    >
                      <Text
                        type="bold"
                        style={{ color: "#209FAE", fontSize: 12 }}
                      >
                        {item?.categori?.name
                          ? item?.categori?.name
                          : "No Category"}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        alignSelf: "center",
                        backgroundColor: "#000",
                        borderRadius: 10,
                        marginRight: 9,
                      }}
                    />
                    <View>
                      {item.isprivate == true ? (
                        <Lock width={15} height={15} />
                      ) : (
                        <GlobeWorld width={15} height={15} />
                      )}
                    </View>
                  </View>

                  <Text
                    size="label"
                    type="black"
                    style={{
                      marginTop: Platform.OS === "ios" ? 5 : 3,
                      marginLeft: 2,
                      // fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    <Truncate text={capitalizeChar(item.name)} length={40} />
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: Platform.OS === "ios" ? 5 : 3,
                    }}
                  >
                    <PinHijau width={15} height={15} />
                    <Text
                      style={{ marginLeft: 3, fontSize: 12 }}
                      type="regular"
                    >
                      {item?.country?.name}
                    </Text>
                    <Text>,</Text>
                    <Text
                      type="regular"
                      style={{ marginLeft: 3, fontSize: 12 }}
                    >
                      {item?.city?.name}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    // borderWidth: 1,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 3,
                    }}
                  >
                    <Calendargrey
                      width={13}
                      height={13}
                      style={{ marginRight: 5 }}
                    />
                    {item.start_date && item.end_date
                      ? getDN(item.start_date, item.end_date)
                      : null}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 15,
                    }}
                  >
                    <User width={13} height={13} style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 12 }} type="regular">
                      {(item && item.buddy.length ? item.buddy.length : null) +
                        " "}
                      {item && item.buddy.length > 1
                        ? t("people")
                        : t("person")}
                    </Text>
                  </View>
                </View>
              </View>
            </Ripple>
            <View
              style={{
                paddingVertical: 3,
                height: "25%",
                flexDirection: "row",
                backgroundColor: "#FFFFFF",
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "50%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: 1,
                  borderColor: "#d3d3d3",
                  paddingVertical: 5,
                }}
              >
                <TravelAlbum
                  height={20}
                  width={20}
                  style={{ marginRight: 5 }}
                />
                <Text type="bold" style={{ color: "#209fae", fontSize: 12 }}>
                  Travel Album
                </Text>
              </View>
              <View
                style={{
                  width: "50%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TravelStories
                  height={20}
                  width={20}
                  style={{ marginRight: 5 }}
                />
                <Text type="bold" style={{ color: "#209fae", fontSize: 12 }}>
                  Travel Stories
                </Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => "DRAFT_" + item.id}
        showsHorizontalScrollIndicator={false}
      />
      <View
        style={{
          zIndex: 999,
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 60,
          width: Dimensions.get("window").width,
          backgroundColor: "white",
          // marginVertical: 15,
          borderTopWidth: 1,
          borderColor: "#F0F0F0",
          shadowColor: "#F0F0F0",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          color="secondary"
          onPress={() => {
            props.navigation.push("ItineraryStack", { screen: "Trip" });
          }}
          // onPress={() => {
          //   props.route.params.token != null
          //     ? props.navigation.push("ItineraryStack", { screen: "Trip" })
          //     : setModalLogin(true);
          // }}
          style={{
            width: width - 40,
            height: 40,
          }}
          text={t("CreateNewPlan")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    // marginTop: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // width: (110),
    // height: (110),
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
