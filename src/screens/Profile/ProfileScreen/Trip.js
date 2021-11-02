import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { default_image, imgPrivate } from "../../../assets/png";

import User_Post from "../../../graphQL/Query/Profile/post";
import {
  Calendargrey,
  Kosong,
  PinHijau,
  TravelAlbum,
  TravelStories,
  TravelStoriesdis,
  User,
} from "../../../assets/svg";
import { Text, Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import Ripple from "react-native-material-ripple";
import { dateFormats } from "../../../component/src/dateformatter";
import DeviceInfo from "react-native-device-info";

const Notch = DeviceInfo.hasNotch();
const arrayShadow = {
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
  shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
  elevation: Platform.OS == "ios" ? 3 : 3,
};

export default function Trip({ item, props, token, position }) {
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
          {Difference_In_Days + 1} days
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
          {Difference_In_Days} nights
        </Text>
      </View>
    );
  };

  const getdate = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");

    return dateFormats(start[0]) + " - " + dateFormats(end[0]);
  };

  return (
    <View
      style={{
        height: 150,
        marginTop: Platform.OS === "ios" ? (Notch ? 15 : -35) : -25,
        marginBottom: Platform.OS === "ios" ? (Notch ? 0 : 50) : 40,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: arrayShadow.shadowOpacity,
        shadowRadius: arrayShadow.shadowRadius,
        elevation: arrayShadow.elevation,
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        marginHorizontal: 15,
        // width: "50%",
      }}
    >
      <TouchableOpacity
        onPress={() =>
          props.navigation.push("ItineraryStack", {
            screen: "itindetail",
            params: {
              itintitle: item.name,
              country: item.id,
              dateitin: getdate(item.start_date, item.end_date),
              token: token,
              status: "favorite",
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
          source={item && item.cover ? { uri: item.cover } : default_image}
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
          <TouchableOpacity
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
                  status: "favorite",
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
          </TouchableOpacity>
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
                  size="description"
                  style={{ color: "#209FAE" }}
                >
                  {item?.categori?.name ? item?.categori?.name : "No Category"}
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
                      private
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
              <Text style={{ marginLeft: 5 }} size="small" type="regular">
                {item?.country?.name}
              </Text>
              <Text>,</Text>
              <Text size="small" type="regular" style={{ marginLeft: 3 }}>
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
              <Calendargrey width={10} height={10} style={{ marginRight: 5 }} />
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
                {(item && item.buddy.length ? item.buddy.length : null) + " "}
                person
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
            props.navigation.push("tripalbum", {
              iditinerary: item.id,
              token: token,
              position: position,
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
          <TravelAlbum height={15} width={15} style={{ marginRight: 5 }} />
          <Text size="small" type="bold" style={{ color: "#209fae" }}>
            Travel Album
          </Text>
        </Ripple>
        <Ripple
          // onPress={() =>
          //   props.navigation.push("tripalbum", {
          //     iditinerary: item.id,
          //     token: token,
          //     position: position,
          //   })
          // }
          style={{
            width: "50%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TravelStoriesdis height={15} width={15} style={{ marginRight: 5 }} />
          <Text size="small" type="bold" style={{ color: "#d3d3d3" }}>
            Travel Stories
          </Text>
        </Ripple>
      </View>
    </View>
  );
}
