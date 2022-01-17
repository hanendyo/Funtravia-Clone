import React, { useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Pressable,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  CalendarItinerary,
  LikeEmpty,
  LikeRed,
  Newglobe,
  Padlock,
  PeopleItinerary,
  PinHijau,
  TravelAlbum,
  TravelStoriesdis,
  TravelAlbumdis,
} from "../../assets/svg";
import { Text, Truncate, Button } from "../../component";
import { useTranslation } from "react-i18next";
import normalize from "react-native-normalize";
import { Bg_soon, default_profile, ItineraryKosong } from "../../assets/png";
import { ModalLogin } from "../../component";
import { useMutation } from "@apollo/client";
import ItineraryLiked from "../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import { RNToasty } from "react-native-toasty";
import { StackActions } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function CardItinerary({
  data,
  props,
  setData,
  // token,
  // setting,
  dataFrom,
}) {
  const { t } = useTranslation();
  const [soon, setSoon] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const token = useSelector((data) => data.token);
  const setting = useSelector((data) => data.setting);

  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return (
      <View style={{ flexDirection: "row" }}>
        <Text size="description" type="regular" numberOfLines={1}>
          {Difference_In_Days + 1 > 1
            ? Difference_In_Days + 1 + " " + t("days")
            : Difference_In_Days + 1 + " " + t("day")}{" "}
          {Difference_In_Days > 1
            ? Difference_In_Days + " " + t("nights")
            : Difference_In_Days + " " + t("night")}
        </Text>
      </View>
    );
  };

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(ItineraryLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(ItineraryUnliked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

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
              title: t("FailedLikeItinerary"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: t("FailedLikeItinerary"),
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
              title: t("somethingwrong"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: t("somethingwrong"),
          position: "bottom",
        });
      }
    } else {
      return setModalLogin(true);
    }
  };

  return (
    <>
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          marginBottom: 10,
          paddingTop: 10,
        }}
        renderItem={({ item, index }) => (
          <View
            style={{
              height: normalize(175),
              paddingHorizontal: 15,
              marginBottom: 7,
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
                  token
                    ? props.route.params?.Position
                      ? props.navigation.dispatch(
                          StackActions.replace("ItineraryStack", {
                            screen: "ItineraryChooseday",
                            params: {
                              Iditinerary: item.id,
                              Kiriman: props.route.params.idkiriman,
                              token: token,
                              Position: props.route.params.Position,
                              data_from: dataFrom,
                            },
                          })
                        )
                      : props.navigation.navigate("ItineraryStack", {
                          screen: "itindetail",
                          params: {
                            itintitle: item.name,
                            country: item.id,
                            token: token,
                            status: "favorite",
                            index: 0,
                            data_from: "setting",
                          },
                        })
                    : setModalLogin(true)
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
                    token
                      ? props.route.params.Position
                        ? props.navigation.dispatch(
                            StackActions.replace("ItineraryStack", {
                              screen: "ItineraryChooseday",
                              params: {
                                Iditinerary: item.id,
                                Kiriman: props.route.params.idkiriman,
                                token: token,
                                Position: props.route.params.Position,
                                data_from: dataFrom,
                              },
                            })
                          )
                        : props.navigation.navigate("ItineraryStack", {
                            screen: "itindetail",
                            params: {
                              itintitle: item.name,
                              country: item.id,
                              token: token,
                              status: "favorite",
                            },
                          })
                      : setModalLogin(true);
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
                      token
                        ? item.user_created.id !== setting?.user?.id
                          ? props.navigation.push("ProfileStack", {
                              screen: "otherprofile",
                              params: {
                                idUser: item.user_created.id,
                              },
                            })
                          : props.navigation.push("ProfileStack", {
                              screen: "ProfileTab",
                              params: {
                                token: token,
                              },
                            })
                        : setModalLogin(true);
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
                        {/* {Truncate({
                          text: item?.user_created?.first_name
                            ? item?.user_created?.first_name
                            : "unknown",
                          length: 13,
                        })} */}
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
                      overflow: "hidden",
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
                      {item.start_date && item.end_date
                        ? getDN(item.start_date, item.end_date)
                        : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        marginLeft: 7,
                      }}
                    >
                      <PeopleItinerary
                        width={14}
                        height={14}
                        style={{ marginRight: 5 }}
                      />
                      {item.buddy_count > 1 ? (
                        <Text
                          size="description"
                          type="regular"
                          numberOfLines={1}
                          style={{ overflow: "hidden" }}
                        >
                          {(item && item.buddy_count ? item.buddy_count : "0") +
                            " " +
                            t("persons")}
                        </Text>
                      ) : (
                        <Text size="description" type="regular">
                          {(item && item.buddy_count
                            ? item.buddy_count
                            : null) +
                            " " +
                            t("person")}
                        </Text>
                      )}
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
          </View>
        )}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1}
      />

      {/* Modal Comming Soon */}

      <Modal
        useNativeDriver={true}
        visible={soon}
        onRequestClose={() => setSoon(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
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
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 3,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              padding: 20,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <Image
              source={Bg_soon}
              style={{
                height: Dimensions.get("screen").width - 180,
                width: Dimensions.get("screen").width - 110,
                borderRadius: 10,
                position: "absolute",
              }}
            />
            <Text type="bold" size="h5">
              {t("comingSoon")}!
            </Text>
            <Text type="regular" size="label" style={{ marginTop: 5 }}>
              {t("soonUpdate")}.
            </Text>
            <Button
              text={"OK"}
              style={{
                marginTop: 20,
                width: Dimensions.get("screen").width / 5,
              }}
              type="box"
              onPress={() => setSoon(false)}
            ></Button>
          </View>
        </View>
      </Modal>
      {/* End Modal Comming Soon */}
    </>
  );
}
