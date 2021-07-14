import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
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
} from "../../../assets/svg";
import { Truncate, Text, FunImageBackground } from "../../../component";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client";
import Ripple from "react-native-material-ripple";
import ListItinerary from "../../../graphQL/Query/Itinerary/listitineraryA";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const arrayShadow = {
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
  shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
  elevation: Platform.OS == "ios" ? 3 : 3,
};

export default function ActivePlan({
  token,
  props,
  rData,
  GetDataActive,
  loading,
}) {
  const { height, width } = Dimensions.get("screen");
  const { t, i18n } = useTranslation();

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    GetDataActive();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const getdate = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");

    return dateFormats(start[0]) + " - " + dateFormats(end[0]);
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
    var x = start;
    var y = end,
      start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          size="description"
          type={"regular"}
          style={
            {
              // color: "white",
            }
          }
        >
          {Difference_In_Days + 1} {t("days")}
          {", "}
        </Text>
        <Text
          size="description"
          type={"regular"}
          style={
            {
              // color: "white",
            }
          }
        >
          {Difference_In_Days} {t("nights")}
        </Text>
      </View>
    );
  };

  if (loading && rData.length < 1) {
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

  if (rData?.length > 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_Refresh} />
          }
          contentContainerStyle={{
            marginTop: 5,
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
                height: 150,
                marginTop: 10,
                borderRadius: 5,
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
                      status: "saved",
                    },
                  })
                }
                style={{
                  backgroundColor: "#FFFFFF",
                  height: "75%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  flexDirection: "row",
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
                    width: "35%",
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
                          status: "saved",
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
                    width: "65%",
                    height: "100%",
                    paddingHorizontal: 10,
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
                        justifyContent: "space-between",
                        aligndatas: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#DAF0F2",
                          borderWidth: 1,
                          borderRadius: 3,
                          borderColor: "#209FAE",
                          paddingHorizontal: 5,
                        }}
                      >
                        <Text
                          type="bold"
                          size="small"
                          style={{ color: "#209FAE" }}
                        >
                          {item?.categori?.name
                            ? item?.categori?.name
                            : "No Category"}
                        </Text>
                      </View>
                      <View>
                        {item.isprivate == true ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              paddingVertical: 3,
                              paddingHorizontal: 10,
                              borderRadius: 3,
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              source={imgPrivate}
                              style={{
                                height: 10,
                                width: 10,
                                marginRight: 5,
                              }}
                            />
                            <Text
                              size="small"
                              type={"regular"}
                              style={{
                                color: "white",
                              }}
                            >
                              {t("private")}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <Text size="label" type="black" style={{ marginTop: 5 }}>
                      <Truncate text={item.name} length={40} />
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <PinHijau width={15} height={15} />
                      <Text
                        style={{ marginLeft: 5 }}
                        size="small"
                        type="regular"
                      >
                        {item?.country?.name}
                      </Text>
                      <Text>,</Text>
                      <Text
                        size="small"
                        type="regular"
                        style={{ marginLeft: 3 }}
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
                        width={10}
                        height={10}
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
                      <User width={10} height={10} style={{ marginRight: 5 }} />
                      <Text size="small" type="regular">
                        {(item && item.buddy.length
                          ? item.buddy.length
                          : null) + " "}
                        {t("person")}
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
                <Ripple
                  onPress={() =>
                    props.navigation.push("ItineraryStack", {
                      screen: "itindetail",
                      params: {
                        itintitle: item.name,
                        country: item.id,
                        dateitin: getdate(item.start_date, item.end_date),
                        token: token,
                        status: "saved",
                        index: 1,
                      },
                    })
                  }
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
                    height={15}
                    width={15}
                    style={{ marginRight: 5 }}
                  />
                  <Text size="small" type="bold" style={{ color: "#209fae" }}>
                    Travel Album
                  </Text>
                </Ripple>
                <Ripple
                  onPress={() =>
                    props.navigation.push("ItineraryStack", {
                      screen: "itindetail",
                      params: {
                        itintitle: item.name,
                        country: item.id,
                        dateitin: getdate(item.start_date, item.end_date),
                        token: token,
                        status: "saved",
                        index: 2,
                      },
                    })
                  }
                  style={{
                    width: "50%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TravelStories
                    height={15}
                    width={15}
                    style={{ marginRight: 5 }}
                  />
                  <Text size="small" type="bold" style={{ color: "#209fae" }}>
                    Travel Stories
                  </Text>
                </Ripple>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

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
    </SafeAreaView>
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
