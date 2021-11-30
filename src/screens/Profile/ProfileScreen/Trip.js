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

const Notch = DeviceInfo.hasNotch();
const arrayShadow = {
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
  shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
  elevation: Platform.OS == "ios" ? 3 : 3,
};

export default function Trip(
  { item, props, token, position },
  capHeight,
  setting,
  data,
  modalLogin,
  setModalLogin,
  soon,
  setSoon
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
    if (token) {
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
            setData(tempData);
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
    if (token) {
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
            setData(tempData);
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
        marginTop:
          capHeight == 10
            ? Platform.OS === "ios"
              ? Notch
                ? 0
                : -10
              : -10
            : capHeight == 20
            ? Platform.OS === "ios"
              ? Notch
                ? 50
                : 20
              : 55
            : capHeight == 30
            ? Platform.OS === "ios"
              ? Notch
                ? 0
                : 5
              : 25
            : capHeight == 40
            ? Platform.OS === "ios"
              ? Notch
                ? 65
                : 20
              : 60
            : capHeight == 50
            ? Platform.OS === "ios"
              ? Notch
                ? 0
                : 0
              : 25
            : capHeight == 60
            ? Platform.OS === "ios"
              ? Notch
                ? 75
                : 25
              : 95
            : capHeight == 70
            ? Platform.OS === "ios"
              ? Notch
                ? 0
                : 0
              : 45
            : capHeight == 80
            ? Platform.OS === "ios"
              ? Notch
                ? 95
                : 10
              : 95
            : capHeight == 90
            ? Platform.OS === "ios"
              ? Notch
                ? 115
                : 45
              : 105
            : 50,
        marginBottom:
          capHeight == 10
            ? Platform.OS === "ios"
              ? Notch
                ? 15
                : 25
              : 30
            : capHeight == 20
            ? Platform.OS === "ios"
              ? Notch
                ? -35
                : 15
              : -35
            : capHeight == 30
            ? Platform.OS === "ios"
              ? Notch
                ? 15
                : 10
              : -10
            : capHeight == 40
            ? Platform.OS === "ios"
              ? Notch
                ? -45
                : 0
              : -40
            : capHeight == 50
            ? Platform.OS === "ios"
              ? Notch
                ? 15
                : 15
              : -10
            : capHeight == 60
            ? Platform.OS === "ios"
              ? Notch
                ? -60
                : -10
              : -80
            : capHeight == 70
            ? Platform.OS === "ios"
              ? Notch
                ? 5
                : 5
              : -30
            : capHeight == 80
            ? Platform.OS === "ios"
              ? Notch
                ? -75
                : 10
              : -80
            : capHeight == 90
            ? Platform.OS === "ios"
              ? Notch
                ? -95
                : -30
              : -75
            : 30,
        borderRadius: 5,
        shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: arrayShadow.shadowOpacity,
        // shadowRadius: arrayShadow.shadowRadius,
        // elevation: arrayShadow.elevation,
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
          // shadowOpacity: arrayShadow.shadowOpacity,
          // shadowRadius: arrayShadow.shadowRadius,
          // elevation: arrayShadow.elevation,
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
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
          }}
        >
          <View>
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
                  {item?.categori?.name ? item?.categori?.name : "No Category"}
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
            token
              ? props.navigation.navigate("ItineraryStack", {
                  screen: "itindetail",
                  params: {
                    itintitle: item.name,
                    country: item.id,
                    token: token,
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

    // <FlatList
    //   // data={dataTrip}
    //   keyExtractor={(item) => item.id}
    //   contentContainerStyle={{
    //     marginBottom: 10,
    //     paddingTop: 10,
    //   }}
    //   renderItem={({ item, index }) => (
    //     <View
    //       style={{
    //         height: normalize(175),
    //         paddingHorizontal: 15,
    //         marginBottom: 7,
    //       }}
    //     >
    //       <View
    //         style={{
    //           borderRadius: 5,
    //           borderWidth: 1,
    //           borderColor: "#d1d1d1",
    //           justifyContent: "space-between",
    //           backgroundColor: "#fff",
    //           overflow: "hidden",
    //         }}
    //       >
    //         <Pressable
    //           onPress={() =>
    //             props.navigation.navigate("ItineraryStack", {
    //               screen: "itindetail",
    //               params: {
    //                 itintitle: item.name,
    //                 country: item.id,
    //                 token: token,
    //                 status: "favorite",
    //                 index: 0,
    //               },
    //             })
    //           }
    //           style={{
    //             backgroundColor: "#FFFFFF",
    //             height: "75%",
    //             borderTopLeftRadius: 5,
    //             borderTopRightRadius: 5,
    //             flexDirection: "row",
    //           }}
    //         >
    //           <Pressable
    //             onPress={() =>
    //               props.navigation.navigate("ItineraryStack", {
    //                 screen: "itindetail",
    //                 params: {
    //                   itintitle: item.name,
    //                   country: item.id,
    //                   token: token,
    //                   status: "favorite",
    //                 },
    //               })
    //             }
    //           >
    //             <Image
    //               source={
    //                 item && item.cover ? { uri: item.cover } : ItineraryKosong
    //               }
    //               style={{
    //                 height: "100%",
    //                 width: Dimensions.get("screen").width * 0.35,
    //                 borderTopLeftRadius: 5,
    //               }}
    //             />
    //             <Pressable
    //               onPress={() => {
    //                 token
    //                   ? item.user_created.id !== setting?.user?.id
    //                     ? props.navigation.push("ProfileStack", {
    //                         screen: "otherprofile",
    //                         params: {
    //                           idUser: item.user_created.id,
    //                         },
    //                       })
    //                     : props.navigation.push("ProfileStack", {
    //                         screen: "ProfileTab",
    //                         params: {
    //                           token: token,
    //                         },
    //                       })
    //                   : setModalLogin(true);
    //               }}
    //               style={{
    //                 position: "absolute",
    //                 height: 30,
    //                 marginTop: 7,
    //                 marginLeft: 7,
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //               }}
    //             >
    //               <Image
    //                 style={{
    //                   height: 30,
    //                   width: 30,
    //                   borderRadius: 15,
    //                   borderWidth: 1,
    //                   borderColor: "#fff",
    //                   zIndex: 1,
    //                 }}
    //                 source={
    //                   item && item.user_created && item.user_created.picture
    //                     ? { uri: item.user_created.picture }
    //                     : default_profile
    //                 }
    //               />
    //               <Text
    //                 size="small"
    //                 type="regular"
    //                 style={{
    //                   zIndex: 0,
    //                   paddingLeft: 10,
    //                   paddingRight: 5,
    //                   backgroundColor: "rgba(0, 0, 0, 0.6)",
    //                   borderRadius: 2,
    //                   color: "white",
    //                   marginLeft: -5,
    //                   padding: 2,
    //                   paddingBottom: 5,
    //                 }}
    //               >
    //                 {Truncate({
    //                   text: item?.user_created?.first_name
    //                     ? item?.user_created?.first_name
    //                     : "unknown",
    //                   length: 13,
    //                 })}
    //               </Text>
    //             </Pressable>
    //           </Pressable>
    //           <View
    //             style={{
    //               flex: 1,
    //               paddingHorizontal: 10,
    //               backgroundColor: "#FFFFFF",
    //               overflow: "hidden",
    //               borderTopRightRadius: 3,
    //               justifyContent: "space-between",
    //               borderBottomWidth: 1,
    //               borderBottomColor: "#d1d1d1",
    //             }}
    //           >
    //             <View style={{ justifyContent: "flex-start" }}>
    //               <View
    //                 style={{
    //                   flexDirection: "row",
    //                   justifyContent: "space-between",
    //                   alignItems: "center",
    //                   marginTop: 10,
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flexDirection: "row",
    //                     alignItems: "center",
    //                     maxWidth: Dimensions.get("screen").width / 3.5,
    //                   }}
    //                 >
    //                   <View
    //                     style={{
    //                       backgroundColor: "#DAF0F2",
    //                       borderRadius: 3,
    //                       borderColor: "#209FAE",
    //                       paddingHorizontal: 4,
    //                       paddingVertical: 1,
    //                     }}
    //                   >
    //                     <Text
    //                       type="bold"
    //                       size="description"
    //                       style={{ color: "#209FAE" }}
    //                       numberOfLines={1}
    //                     >
    //                       {item?.categori?.name
    //                         ? item?.categori?.name
    //                         : "No Category"}
    //                     </Text>
    //                   </View>
    //                   <View
    //                     style={{
    //                       height: 5,
    //                       width: 5,
    //                       borderRadius: 5,
    //                       marginHorizontal: 10,
    //                       backgroundColor: "#000",
    //                     }}
    //                   />
    //                   {item?.isprivate ? (
    //                     <Padlock height={20} width={20} />
    //                   ) : (
    //                     <Newglobe height={20} width={20} />
    //                   )}
    //                 </View>
    //                 {item?.status == "F" &&
    //                 !item?.isprivate &&
    //                 item?.user_created?.id !== setting?.user_id ? (
    //                   item.liked === false ? (
    //                     <TouchableOpacity
    //                       style={{
    //                         padding: 5,
    //                       }}
    //                       onPress={() => _liked(item.id, index, item)}
    //                     >
    //                       <LikeEmpty height={15} width={15} />
    //                     </TouchableOpacity>
    //                   ) : (
    //                     <TouchableOpacity
    //                       style={{
    //                         padding: 5,
    //                       }}
    //                       onPress={() => _unliked(item.id, index, item)}
    //                     >
    //                       <LikeRed height={15} width={15} />
    //                     </TouchableOpacity>
    //                   )
    //                 ) : null}
    //               </View>
    //               <Text
    //                 size="title"
    //                 type="black"
    //                 style={{}}
    //                 numberOfLines={2}
    //                 style={{ marginTop: 3 }}
    //               >
    //                 {item.name}
    //               </Text>
    //               <View
    //                 style={{
    //                   flexDirection: "row",
    //                   alignItems: "center",
    //                   marginTop: Platform.OS === "ios" ? 5 : 3,
    //                   width: "90%",
    //                   marginTop: 5,
    //                 }}
    //               >
    //                 <PinHijau width={13} height={13} />
    //                 <Text
    //                   size="description"
    //                   type="regular"
    //                   numberOfLines={1}
    //                   style={{ marginLeft: 3 }}
    //                 >
    //                   {`${item?.country?.name}, ${item?.city?.name}`}
    //                 </Text>
    //               </View>
    //             </View>
    //             <View
    //               style={{
    //                 flexDirection: "row",
    //                 justifyContent: "flex-start",
    //                 marginBottom: 8,
    //                 overflow: "hidden",
    //               }}
    //             >
    //               <View
    //                 style={{
    //                   flexDirection: "row",
    //                   alignItems: "center",
    //                   justifyContent: "flex-start",
    //                 }}
    //               >
    //                 <CalendarItinerary
    //                   width={14}
    //                   height={14}
    //                   style={{
    //                     marginRight: 5,
    //                   }}
    //                 />
    //                 {item.start_date && item.end_date
    //                   ? getDN(item.start_date, item.end_date)
    //                   : null}
    //               </View>
    //               <View
    //                 style={{
    //                   flexDirection: "row",
    //                   alignItems: "flex-start",
    //                   marginLeft: 7,
    //                 }}
    //               >
    //                 <PeopleItinerary
    //                   width={14}
    //                   height={14}
    //                   style={{ marginRight: 5 }}
    //                 />
    //                 {item.buddy_count > 1 ? (
    //                   <Text
    //                     size="description"
    //                     type="regular"
    //                     numberOfLines={1}
    //                     style={{ overflow: "hidden" }}
    //                   >
    //                     {(item && item.buddy_count ? item.buddy_count : "0") +
    //                       " " +
    //                       "persons"}
    //                   </Text>
    //                 ) : (
    //                   <Text size="description" type="regular">
    //                     {(item && item.buddy_count ? item.buddy_count : null) +
    //                       " " +
    //                       "person"}
    //                   </Text>
    //                 )}
    //               </View>
    //             </View>
    //           </View>
    //         </Pressable>
    //         <View
    //           style={{
    //             height: "25%",
    //             flexDirection: "row",
    //             backgroundColor: "#fff",
    //             borderBottomLeftRadius: 5,
    //             borderBottomRightRadius: 5,
    //             paddingVertical: 5,
    //             justifyContent: "space-between",
    //           }}
    //         >
    //           <Pressable
    //             disabled={item?.status == "D" ? true : false}
    //             onPress={() =>
    //               token
    //                 ? props.navigation.navigate("ItineraryStack", {
    //                     screen: "itindetail",
    //                     params: {
    //                       itintitle: item.name,
    //                       country: item.id,
    //                       token: token,
    //                       status: "favorite",
    //                       index: 1,
    //                     },
    //                   })
    //                 : setModalLogin(true)
    //             }
    //             style={{
    //               width: "50%",
    //               flexDirection: "row",
    //               alignItems: "center",
    //               justifyContent: "center",
    //               borderRightWidth: 1,
    //               borderColor: "#D1D1D1",
    //             }}
    //           >
    //             {item?.status == "D" ? (
    //               <>
    //                 <TravelAlbumdis
    //                   style={{ marginRight: 5 }}
    //                   height={20}
    //                   width={20}
    //                 />
    //                 <Text
    //                   size="description"
    //                   type="regular"
    //                   style={{ color: "#c7c7c7" }}
    //                 >
    //                   Travel Album
    //                 </Text>
    //               </>
    //             ) : (
    //               <>
    //                 <TravelAlbum
    //                   style={{ marginRight: 5 }}
    //                   height={20}
    //                   width={20}
    //                 />
    //                 <Text
    //                   size="description"
    //                   type="bold"
    //                   style={{ color: "#209FAE" }}
    //                 >
    //                   Travel Album
    //                 </Text>
    //               </>
    //             )}
    //           </Pressable>
    //           <Pressable
    //             onPress={() => setSoon(true)}
    //             style={{
    //               width: "50%",
    //               flexDirection: "row",
    //               alignItems: "center",
    //               justifyContent: "center",
    //               marginBottom: 5,
    //             }}
    //           >
    //             <TravelStoriesdis
    //               style={{ marginRight: 5 }}
    //               height={20}
    //               width={20}
    //             />
    //             <Text
    //               size="description"
    //               type="regular"
    //               style={{
    //                 color: "#c7c7c7",
    //               }}
    //             >
    //               Travel Stories
    //             </Text>
    //           </Pressable>
    //         </View>
    //       </View>
    //     </View>
    //   )}
    //   showsVerticalScrollIndicator={false}
    //   onEndReachedThreshold={1}
    // />
  );
}
