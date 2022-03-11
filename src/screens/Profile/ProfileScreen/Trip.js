import React from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import {
  LikeEmpty,
  LikeRed,
  Newglobe,
  Padlock,
  PinHijau,
  TravelAlbum,
  TravelAlbumdis,
  TravelStoriesdis,
  CalendarItinerary,
  PeopleItinerary,
} from "../../../assets/svg";
import { ItineraryKosong } from "../../../assets/png";
import { Text } from "../../../component";
import normalize from "react-native-normalize";
import { RNToasty } from "react-native-toasty";
// import { useSelector } from "react-redux";

export default function Trip(
  { tokenApps, props, item, index },
  undefined,
  setting,
  data,
  modalLogin,
  setModalLogin,
  setSoon,
  dataTrip,
  setdataTrip,
  mutationliked,
  mutationUnliked,
  users
) {
  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return (
      <View style={{ flexDirection: "row" }}>
        <Text size="description" type={"regular"}>
          {Difference_In_Days + 1} days
          {", "}
        </Text>
        <Text size="description" type={"regular"}>
          {Difference_In_Days} nights
        </Text>
      </View>
    );
  };

  const _liked = async (id, index) => {
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
  };
  const _unliked = async (id, index) => {
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
  };

  return (
    <View
      style={{
        height: normalize(175),
        marginTop: index == 0 ? 40 : 10,
        marginHorizontal: 15,
      }}
    >
      <View
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#d1d1d1",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <Pressable
          onPress={() =>
            props.route.params && props.route.params.Position
              ? props.navigation.dispatch(
                  StackActions.replace("ItineraryStack", {
                    screen: "ItineraryChooseday",
                    params: {
                      Iditinerary: item.id,
                      Kiriman: props.route.params.idkiriman,
                      token: token,
                      Position: props.route.params.Position,
                      data_from: dataFrom,
                      data_from_id: dataFromId,
                      search_input: searchInput,
                    },
                  })
                )
              : props.navigation.navigate("ItineraryStack", {
                  screen: "itindetail",
                  params: {
                    itintitle: item.name,
                    country: item.id,
                    token: tokenApps,
                    status: "favorite",
                    index: 0,
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
          <Pressable
            onPress={() => {
              props.route.params && props.route.params.Position
                ? props.navigation.dispatch(
                    StackActions.replace("ItineraryStack", {
                      screen: "ItineraryChooseday",
                      params: {
                        Iditinerary: item.id,
                        Kiriman: props.route.params.idkiriman,
                        token: token,
                        Position: props.route.params.Position,
                        data_from: dataFrom,
                        search_input: searchInput,
                      },
                    })
                  )
                : props.navigation.navigate("ItineraryStack", {
                    screen: "itindetail",
                    params: {
                      itintitle: item.name,
                      country: item.id,
                      token: tokenApps,
                      status: "favorite",
                    },
                  });
            }}
          >
            <Image
              source={
                item && item.cover ? { uri: item.cover } : ItineraryKosong
              }
              style={{
                height: "100%",
                width: Dimensions.get("screen").width * 0.32,
                borderTopLeftRadius: 5,
              }}
            />
            <Pressable
              onPress={() => {
                item.user_created.id !== users?.id
                  ? props.navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: item.user_created.id,
                      },
                    })
                  : props.navigation.push("ProfileStack", {
                      screen: "ProfileTab",
                      params: {
                        token: tokenApps,
                      },
                    });
              }}
              style={{
                position: "absolute",
                height: 30,
                marginTop: 7,
                marginLeft: 7,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: "#fff",
                  zIndex: 1,
                }}
                source={
                  item && item.user_created && item.user_created.picture
                    ? { uri: item.user_created.picture }
                    : default_profile
                }
              />
              <View
                style={{
                  maxWidth: "70%",
                }}
              >
                <Text
                  size="small"
                  type="regular"
                  style={{
                    zIndex: 0,
                    paddingLeft: 10,
                    paddingRight: 5,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    borderRadius: 2,
                    color: "white",
                    marginLeft: -8,
                    padding: 2,
                    paddingBottom: 5,
                  }}
                  numberOfLines={1}
                >
                  {item?.user_created?.first_name}
                </Text>
              </View>
            </Pressable>
          </Pressable>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              backgroundColor: "#FFFFFF",
              borderTopRightRadius: 3,
              justifyContent: "space-between",
              borderBottomColor: "#d1d1d1",
            }}
          >
            <View style={{ justifyContent: "flex-start" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
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
                      style={{ color: "#209FAE", marginBottom: 3 }}
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
                {item.like_show ? (
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
                size="title"
                type="black"
                style={{}}
                numberOfLines={2}
                style={{ marginTop: 3 }}
              >
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 5 : 3,
                  width: "90%",
                  marginTop: 5,
                }}
              >
                <PinHijau width={13} height={13} />
                <Text
                  size="description"
                  type="regular"
                  numberOfLines={1}
                  style={{ marginLeft: 3 }}
                >
                  {`${item?.country?.name}, ${item?.city?.name}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <CalendarItinerary
                  width={14}
                  height={14}
                  style={{
                    marginRight: 5,
                  }}
                />
                <Text
                  size="description"
                  type="regular"
                  style={{
                    marginRight: 5,
                  }}
                >
                  {item.start_date && item.end_date
                    ? getDN(item.start_date, item.end_date, null, "date")
                    : null}
                </Text>
              </View>
              {/* RENDER PERSON */}
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <PeopleItinerary
                  width={14}
                  height={14}
                  style={{ marginRight: 5 }}
                />
                <Text size="description" type="regular">
                  {item && item.buddy ? item.buddy.length : "0"} person
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
        <View
          style={{
            height: "25%",
            flexDirection: "row",
            backgroundColor: "#fff",
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            paddingVertical: 5,
            justifyContent: "space-between",
          }}
        >
          <Pressable
            disabled={item?.status == "D" ? true : false}
            onPress={() =>
              props.navigation.navigate("ItineraryStack", {
                screen: "itindetail",
                params: {
                  itintitle: item.name,
                  country: item.id,
                  token: tokenApps,
                  status: "favorite",
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
                <TravelAlbum
                  style={{ marginRight: 5 }}
                  height={20}
                  width={20}
                />
                <Text
                  size="description"
                  type="bold"
                  style={{ color: "#209FAE" }}
                >
                  Travel Album
                </Text>
              </>
            )}
          </Pressable>
          <Pressable
            onPress={() => setSoon(true)}
            style={{
              width: "50%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 5,
            }}
          >
            <TravelStoriesdis
              style={{ marginRight: 5 }}
              height={20}
              width={20}
            />
            <Text
              size="description"
              type="regular"
              style={{
                color: "#c7c7c7",
              }}
            >
              Travel Stories
            </Text>
          </Pressable>
        </View>
      </View>

      {/* batas asli */}
    </View>
  );
}
