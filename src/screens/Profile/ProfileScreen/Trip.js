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
  Pressable,
} from "react-native";
import { default_image, imgPrivate } from "../../../assets/png";

import User_Post from "../../../graphQL/Query/Profile/post";
import {
  Calendargrey,
  Kosong,
  LikeEmpty,
  LikeRed,
  Newglobe,
  Padlock,
  PinHijau,
  TravelAlbum,
  TravelAlbumdis,
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
import normalize from "react-native-normalize";
import { RNToasty } from "react-native-toasty";

const Notch = DeviceInfo.hasNotch();
const arrayShadow = {
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
  shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
  elevation: Platform.OS == "ios" ? 3 : 3,
};

export default function Trip(
  { position, tokenApps, props, item, index },
  capHeight,
  setting,
  data,
  modalLogin,
  setModalLogin,
  soon,
  setSoon,
  dataTrip,
  setdataTrip,
  mutationliked,
  mutationUnliked
) {
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

  const _liked = async (id, index) => {
    if (tokenApps) {
      try {
        let response = await mutationliked({
          variables: {
            id: id,
            qty: 1,
          },
        });

        if (response.data) {
          if (
            response.data.setItineraryFavorit.code === 200 ||
            response.data.setItineraryFavorit.code === "200"
          ) {
            const tempData = [...data];
            const tempDataDetail = { ...tempData[index] };
            tempDataDetail.liked = true;
            tempData.splice(index, 1, tempDataDetail);
            setdataTrip(tempData);
          } else {
            RNToasty.Show({
              title: "FailedLikeItinerary",
              position: "bottom",
            });
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: "FailedLikeItinerary",
          position: "bottom",
        });
      }
    } else {
      return setModalLogin(true);
    }
  };
  const _unliked = async (id, index) => {
    if (tokenApps) {
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
            qty: 1,
          },
        });

        if (response.data) {
          if (
            response.data.unsetItineraryFavorit.code === 200 ||
            response.data.unsetItineraryFavorit.code === "200"
          ) {
            const tempData = [...data];
            const tempDataDetail = { ...tempData[index] };
            tempDataDetail.liked = false;
            tempData.splice(index, 1, tempDataDetail);
            setdataTrip(tempData);
          } else {
            RNToasty.Show({
              title: "somethingwrong",
              position: "bottom",
            });
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: "somethingwrong",
          position: "bottom",
        });
      }
    } else {
      return setModalLogin(true);
    }
  };

  return (
    <View
      style={{
        height: normalize(175),
        marginTop: index == 0 ? 40 : 20,

        borderRadius: 5,
        shadowOffset: { width: 0, height: 1 },
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
              token: tokenApps,
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
        }}
      >
        <ImageBackground
          source={item && item.cover ? { uri: item.cover } : default_image}
          style={{
            height: "100%",
            width: Dimensions.get("screen").width * 0.3,
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
                  token: tokenApps,
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
                  width: "70%",
                }}
              >
                <Text
                  size="small"
                  type={"regular"}
                  style={{
                    color: "white",
                  }}
                  numberOfLines={1}
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
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            borderTopRightRadius: 3,
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
          }}
        >
          <View style={{ justifyContent: "flex-start" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // marginTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  maxWidth: Dimensions.get("screen").width / 3.5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#DAF0F2",
                    borderRadius: 3,
                    borderColor: "#209FAE",
                    paddingHorizontal: 4,
                    paddingVertical: 1,
                  }}
                >
                  <Text
                    type="bold"
                    size="description"
                    style={{ color: "#209FAE" }}
                    numberOfLines={1}
                  >
                    {item?.categori?.name
                      ? item?.categori?.name
                      : "No Category"}
                  </Text>
                </View>
                <View
                  style={{
                    height: 5,
                    width: 5,
                    borderRadius: 5,
                    marginHorizontal: 10,
                    backgroundColor: "#000",
                  }}
                />
                {item?.isprivate ? (
                  <Padlock height={20} width={20} />
                ) : (
                  <Newglobe height={20} width={20} />
                )}
              </View>
              {item?.status == "F" &&
              !item?.isprivate &&
              item?.user_created?.id !== setting?.user_id ? (
                item.liked === false ? (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                    }}
                    onPress={() => _liked(item.id, index, item)}
                  >
                    <LikeEmpty height={15} width={15} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                    }}
                    onPress={() => _unliked(item.id, index, item)}
                  >
                    <LikeRed height={15} width={15} />
                  </TouchableOpacity>
                )
              ) : null}
            </View>
            <Text
              size="label"
              type="black"
              style={{ marginTop: 5 }}
              numberOfLines={1}
            >
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
              <Text size="description" type="regular">
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
          shadowOpacity: 0,
        }}
      >
        <Pressable
          disabled={item?.status == "D" ? true : false}
          onPress={() =>
            tokenApps
              ? props.navigation.navigate("ItineraryStack", {
                  screen: "itindetail",
                  params: {
                    itintitle: item.name,
                    country: item.id,
                    token: tokenApps,
                    status: "favorite",
                    index: 1,
                  },
                })
              : setModalLogin(true)
          }
          style={{
            width: "50%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRightWidth: 1,
            borderColor: "#D1D1D1",
          }}
        >
          {item?.status == "D" ? (
            <>
              <TravelAlbumdis
                style={{ marginRight: 5 }}
                height={20}
                width={20}
              />
              <Text
                size="description"
                type="regular"
                style={{ color: "#c7c7c7" }}
              >
                Travel Album
              </Text>
            </>
          ) : (
            <>
              <TravelAlbum style={{ marginRight: 5 }} height={20} width={20} />
              <Text size="description" type="bold" style={{ color: "#209FAE" }}>
                Travel Album
              </Text>
            </>
          )}
        </Pressable>
        <Pressable
          // onPress={() =>
          //   props.navigation.push("tripalbum", {
          //     iditinerary: item.id,
          //     token: token,
          //     position: position,
          //   })
          // }
          onPress={() => setSoon(true)}
          style={{
            width: "50%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TravelStoriesdis height={20} width={20} style={{ marginRight: 5 }} />
          <Text size="description" type="regular" style={{ color: "#d3d3d3" }}>
            Travel Stories
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
