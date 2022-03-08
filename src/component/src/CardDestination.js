import React, { useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Pressable,
  Image,
  Modal,
  Platform,
} from "react-native";
import {
  LikeEmpty,
  PinHijau,
  Love,
  Star,
  BlockDestination,
  UnescoIcon,
  MovieIcon,
} from "../../assets/svg";
import { Text, Button, FunImage } from "..";
import { useTranslation } from "react-i18next";
import normalize from "react-native-normalize";
import { Bg_soon, default_profile, default_image } from "../../assets/png";
import { ModalLogin, FunIcon } from "../../component";
import { RNToasty } from "react-native-toasty";
import Liked from "../../graphQL/Mutation/Destination/Liked";
import unLiked from "../../graphQL/Mutation/Destination/UnLiked";
import { useMutation } from "@apollo/client";
import { StackActions } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";

const deviceId = DeviceInfo.getModel();

export default function CardDestination({
  data,
  props,
  setData,
  token,
  dataFrom,
  dataFromId,
  from,
  searchInput,
  sebelum,
}) {
  const { t } = useTranslation();
  const [modalLogin, setModalLogin] = useState(false);
  const [
    mutationlikedAnother,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const [
    mutationUnlikedAnother,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(unLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const _likedAnother = async (id, index) => {
    if (token) {
      try {
        const temptData = [...data];
        const temptDataLike = { ...temptData[index] };
        temptDataLike.liked = true;
        temptData.splice(index, 1, temptDataLike);
        setData(temptData);
        let response = await mutationlikedAnother({
          variables: {
            destination_id: id,
            qty: 1,
          },
        });

        if (response.data) {
          if (response.data.setDestination_wishlist.code != 200) {
            RNToasty.Show({
              title: t("FailedLikeDestination"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        const temptData = [...data];
        const temptDataLike = { ...temptData[index] };
        temptDataLike.liked = false;
        temptData.splice(index, 1, temptDataLike);
        setData(temptData);
      }
    } else {
      setModalLogin(true);
    }
  };

  const _unlikedAnother = async (id, index) => {
    if (token) {
      try {
        const temptData = [...data];
        const temptDataUnlike = { ...temptData[index] };
        temptDataUnlike.liked = false;
        temptData.splice(index, 1, temptDataUnlike);
        setData(temptData);
        let response = await mutationUnlikedAnother({
          variables: {
            destination_id: id,
          },
        });

        if (response.data) {
          if (response.data.unset_wishlist_destinasi.code != 200) {
            RNToasty.Show({
              title: t("somethingwrong"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        const temptData = [...data];
        const temptDataUnlike = { ...temptData[index] };
        temptDataUnlike.liked = true;
        temptData.splice(index, 1, temptDataUnlike);
        setData(temptData);
      }
    } else {
      setModalLogin(true);
    }
  };

  const addToPlan = (kiriman) => {
    if (token) {
      if (kiriman) {
        props?.route?.params && props?.route?.params?.IdItinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.IdItinerary,
                  Kiriman: kiriman.id,
                  token: token,
                  Position: props.route.params?.from ?? "destination",
                  datadayaktif: props.route.params.datadayaktif,
                  data_dest: props.route.params,
                  sebelum: sebelum,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: kiriman.id,
                Position: "destination",
                data_from: dataFrom,
                data_from_id: dataFromId,
                searchInput: searchInput,
              },
            });
      } else {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: data?.destinationById?.id,
                  token: token,
                  Position: props.route.params?.from ?? "destination",
                  datadayaktif: props?.route?.params?.datadayaktif,
                  searchInput: searchInput,
                  sebelum: sebelum,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: data?.id,
                Position: "destination",
                data_from: dataFrom,
                data_from_id: dataFromId,
                searchInput: searchInput,
              },
            });
      }
    } else {
      setModalLogin(true);
    }
  };

  return (
    <View
      style={{
        paddingTop:
          dataFrom === "wishlist" || props.route.params?.from ? 40 : 0,
        paddingBottom:
          dataFrom === "wishlist" || props.route.params?.from ? 0 : 40,
      }}
    >
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      {data != "" ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item?.id}
          contentContainerStyle={{
            paddingTop: 15,
            paddingBottom: 70,
            paddingHorizontal: 15,
            width: Dimensions.get("screen").width,
          }}
          renderItem={({ item, index }) => (
            <>
              {props?.route?.name == "Detail_movie" ? (
                <View
                  key={index}
                  style={{
                    marginBottom: 10,
                    marginHorizontal: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <BlockDestination height={16} width={16} />
                  <Text size="label" type="bold">
                    {t("location")} {index + 1}
                  </Text>
                </View>
              ) : null}
              <Pressable
                onPress={() =>
                  props.navigation.push("DestinationUnescoDetail", {
                    id: item?.id,
                    name: item?.name,
                    token: token,
                  })
                }
                key={"nir" + index}
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d1d1",
                  borderRadius: 10,
                  height: normalize(175),
                  marginBottom: 10,
                  width: "100%",
                  flexDirection: "row",
                  backgroundColor: "#FFF",
                }}
              >
                <View style={{ justifyContent: "center" }}>
                  {/* Image */}
                  <FunImage
                    source={item ? { uri: item?.cover } : default_image}
                    style={{
                      width: normalize(140),
                      height: "100%",
                      borderBottomLeftRadius: 10,
                      borderTopLeftRadius: 10,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "absolute",
                      top: 10,
                      right: 10,
                      left: 10,
                      width: "87%",
                      zIndex: 2,
                      borderColor: "#209fae",
                    }}
                  >
                    {item?.liked === true ? (
                      <Pressable
                        onPress={() => _unlikedAnother(item?.id, index)}
                        style={{
                          backgroundColor: "#F3F3F3",
                          height: normalize(30),
                          width: normalize(30),
                          borderRadius: normalize(30),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Love height={15} width={15} />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => _likedAnother(item?.id, index)}
                        style={{
                          backgroundColor: "#F3F3F3",
                          height: normalize(30),
                          width: normalize(30),
                          borderRadius: normalize(30),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LikeEmpty height={15} width={15} />
                      </Pressable>
                    )}
                    {item?.rating != 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "#F3F3F3",
                          borderRadius: 3,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingHorizontal: 5,
                          height: normalize(25),
                        }}
                      >
                        <Star height={normalize(15)} width={normalize(15)} />
                        <Text size="description" type="bold">
                          {item?.rating?.substr(0, 3)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {/* Keterangan */}
                {/* rating */}
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 8,
                    paddingVertical: 7,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    {/* Title */}
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 3,

                        marginBottom: 3,
                      }}
                    >
                      <BlockDestination
                        height={16}
                        width={16}
                        style={{ marginTop: 5 }}
                      />
                      <Text
                        size="title"
                        type="bold"
                        numberOfLines={2}
                        style={{
                          marginLeft: 5,
                          flexWrap: "wrap",
                          marginTop: Platform.OS === "ios" ? 3 : 5,
                          flex: 1,

                          lineHeight:
                            Platform.OS === "ios"
                              ? 20
                              : deviceId == "CPH2127"
                              ? 20
                              : 17,
                        }}
                      >
                        {item?.name}
                      </Text>
                    </View>

                    {/* Maps */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 5,
                      }}
                    >
                      <PinHijau height={15} width={15} />
                      <Text
                        size="description"
                        type="regular"
                        style={{ marginLeft: 5 }}
                        numberOfLines={1}
                      >
                        {item?.cities?.name}
                      </Text>
                    </View>
                  </View>
                  {/* Great for */}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      marginTop: 5,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        paddingHorizontal: 7,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        {item?.type?.name &&
                        item?.type?.name.toLowerCase().substr(0, 6) ==
                          "unesco" ? (
                          <UnescoIcon
                            height={normalize(33)}
                            width={normalize(33)}
                            style={{ marginRight: 8 }}
                          />
                        ) : null}
                        {item?.movie_location &&
                        item?.movie_location.length > 0 ? (
                          <MovieIcon
                            height={normalize(33)}
                            width={normalize(33)}
                          />
                        ) : null}
                      </View>
                      <View
                        style={{
                          marginBottom:
                            item?.greatfor && item?.greatfor.length > 0 ? 0 : 7,
                        }}
                      >
                        {item?.greatfor && item?.greatfor.length > 0 ? (
                          <Text
                            size="description"
                            type="bold"
                            style={{ marginTop: 0 }}
                          >
                            {t("GreatFor") + " :"}
                          </Text>
                        ) : null}
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: -5,
                          }}
                        >
                          {item?.greatfor && item?.greatfor.length > 0
                            ? item?.greatfor.map((item, index) => {
                                return index < 3 ? (
                                  <FunIcon
                                    key={"grat" + index}
                                    icon={item?.icon}
                                    fill="#464646"
                                    height={37}
                                    width={37}
                                  />
                                ) : null;
                              })
                            : null}
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        justifyContent: "flex-end",
                        paddingBottom: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => addToPlan(item)}
                        style={{
                          width: "100%",
                          height: 30,
                          borderRadius: 3,
                          paddingHorizontal: 15,
                          backgroundColor: "#209fae",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          size="description"
                          type="bold"
                          style={{ color: "#fff" }}
                        >
                          {t("add")}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Pressable>
            </>
          )}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={1}
        />
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text size="label" type="bold">
            {t("noData")}
          </Text>
        </View>
      )}
    </View>
  );
}
