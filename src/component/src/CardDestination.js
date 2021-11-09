import React, { useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Pressable,
  Image,
  Modal,
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

export default function CardDestination({ data, props, setData, token }) {
  const { t } = useTranslation();
  const [soon, setSoon] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);

  console.log("data", data);

  const [
    mutationlikedAnother,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
          if (!response.data.setDestination_wishlist.code === 200) {
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
          if (!response.data.unset_wishlist_destinasi.code === 200) {
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
      }
    } else {
      setModalLogin(true);
    }
  };

  const addToPlan = (kiriman) => {
    if (token) {
      if (kiriman) {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: kiriman.id,
                  token: token,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: kiriman.id,
                Position: "destination",
              },
            });
      } else {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: data?.destinationById.id,
                  token: token,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: data?.id,
                Position: "destination",
              },
            });
      }
    } else {
      setModalLogin(true);
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
          paddingTop: 15,
          paddingHorizontal: 15,
          width: Dimensions.get("screen").width,
        }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() =>
              props.navigation.push("DestinationUnescoDetail", {
                id: item.id,
                name: item.name,
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
                {item.liked === true ? (
                  <Pressable
                    onPress={() => _unlikedAnother(item.id, index)}
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
                    onPress={() => _likedAnother(item.id)}
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
                      marginTop: 5,
                      flex: 1,
                      lineHeight: 17,
                    }}
                  >
                    {item.name}
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
                    {item?.type?.name.toLowerCase().substr(0, 6) == "unesco" ? (
                      <UnescoIcon
                        height={normalize(33)}
                        width={normalize(33)}
                        style={{ marginRight: 8 }}
                      />
                    ) : null}
                    {item?.movie_location.length > 0 ? (
                      <MovieIcon height={normalize(33)} width={normalize(33)} />
                    ) : null}
                  </View>
                  <View
                    style={{
                      marginBottom: item.greatfor.length > 0 ? 0 : 7,
                    }}
                  >
                    {item.greatfor.length > 0 ? (
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
                      {item.greatfor.length > 0
                        ? item.greatfor.map((item, index) => {
                            return index < 3 ? (
                              <FunIcon
                                key={"grat" + index}
                                icon={item.icon}
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
                    width: 65,
                    paddingBottom: 5,
                  }}
                >
                  <Pressable
                    onPress={() => addToPlan(item)}
                    style={{
                      width: "100%",
                      height: 30,
                      borderRadius: 3,
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
                      {"add"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1}
      />
    </>
  );
}
