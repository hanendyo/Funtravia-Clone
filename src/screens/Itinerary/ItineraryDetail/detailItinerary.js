import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Platform,
} from "react-native";
import { Capital, Text } from "../../../component";
import { Button } from "../../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite } from "../../../assets/svg";
import { default_image } from "../../../assets/png";
import { dateFormats } from "../../../component/src/dateformatter";

export default function DetailItinerary(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {"" + t("Tripdetail")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  const dateFormatr = (date) => {
    var x = date.split(" ");
    return dateFormats(x[0]);
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
          size="label"
          type={"bold"}
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
          size="label"
          type={"bold"}
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: "100%",
                width: 7,
                borderRadius: 5,
                backgroundColor: "#209fae",
              }}
            ></View>
            <Text type="regular" size="label" style={{ marginLeft: 5 }}>
              {t("title") + " " + t("trip")}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 5,
              marginLeft: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text type="bold" size="label">
              {props?.route?.params?.data?.itinerary_detail?.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: "100%",
                width: 7,
                borderRadius: 5,
                backgroundColor: "#209fae",
              }}
            ></View>
            <Text type="regular" size="label" style={{ marginLeft: 5 }}>
              {t("destination")}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 5,
              marginLeft: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text type="bold" size="label">
              {props?.route?.params?.data?.itinerary_detail?.country?.name
                ? Capital({
                    text:
                      props?.route?.params?.data?.itinerary_detail?.country
                        ?.name,
                  })
                : ""}
              {props?.route?.params?.data?.itinerary_detail?.province?.name
                ? " , " +
                  Capital({
                    text:
                      props?.route?.params?.data?.itinerary_detail?.province
                        ?.name,
                  })
                : ""}
              {props?.route?.params?.data?.itinerary_detail?.city?.name
                ? " , " +
                  Capital({
                    text:
                      props?.route?.params?.data?.itinerary_detail?.city?.name,
                  })
                : ""}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: "100%",
                width: 7,
                borderRadius: 5,
                backgroundColor: "#209fae",
              }}
            ></View>
            <Text type="regular" size="label" style={{ marginLeft: 5 }}>
              {t("dates")}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 5,
              marginLeft: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text type="bold" size="label">
              {dateFormatr(
                props?.route?.params?.data?.itinerary_detail?.start_date
              ) +
                "  -  " +
                dateFormatr(
                  props?.route?.params?.data?.itinerary_detail?.end_date
                )}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: "100%",
                width: 7,
                borderRadius: 5,
                backgroundColor: "#209fae",
              }}
            ></View>
            <Text type="regular" size="label" style={{ marginLeft: 5 }}>
              {t("duration")}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 5,
              marginLeft: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text type="bold" size="label">
              {props?.route?.params?.data?.itinerary_detail?.start_date
                ? getDN(
                    props?.route?.params?.data?.itinerary_detail?.start_date,
                    props?.route?.params?.data?.itinerary_detail?.end_date
                  )
                : null}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: "100%",
                width: 7,
                borderRadius: 5,
                backgroundColor: "#209fae",
              }}
            ></View>
            <Text type="regular" size="label" style={{ marginLeft: 5 }}>
              {t("travelBuddy")}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 5,
              marginLeft: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <FlatList
              scrollEnabled={false}
              data={props?.route?.params?.data?.itinerary_detail?.buddy}
              numColumns={2}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    marginVertical: 5,
                    flex: 1,
                    flexDirection: "row",
                    paddingHorizontal: 2,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={
                      item?.user?.picture
                        ? { uri: item?.user?.picture }
                        : default_image
                    }
                    style={{
                      height: 25,
                      width: 25,
                      borderRadius: 15,
                    }}
                  />
                  <Text
                    size="label"
                    type="bold"
                    style={{ marginLeft: 5, width: 130 }}
                    numberOfLines={1}
                  >
                    {item?.user?.first_name
                      ? Capital({ text: item?.user?.first_name })
                      : "User Funtravia"}
                  </Text>
                </View>
              )}
              keyExtractor={(d) => "buddy" + d?.id}
            />
          </View>
        </View>
        <View
          style={{
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: "100%",
                width: 7,
                borderRadius: 5,
                backgroundColor: "#209fae",
              }}
            ></View>
            <Text type="regular" size="label" style={{ marginLeft: 5 }}>
              {t("privacy")}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 5,
              marginLeft: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text type="bold" size="label">
              {props?.route?.params?.data?.itinerary_detail?.isprivate === true
                ? t("private")
                : t("public (shared)")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
