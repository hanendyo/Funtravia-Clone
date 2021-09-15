import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import { CustomImage, FunIcon, FunImage } from "../../component";
import {
  LikeRed,
  LikeEmpty,
  Star,
  PinHijau,
  Love,
  Newglobe,
  Calendargrey,
  User,
  TravelAlbum,
  TravelStories,
  BlockDestination,
  UnescoIcon,
  MovieIcon,
} from "../../assets/svg";
import { Ticket, MapIconGreen, default_image } from "../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import UnLiked from "../../graphQL/Mutation/unliked";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Destinasi from "../../graphQL/Query/Wishlist/Destination";
import { useLazyQuery } from "@apollo/client";

export default function Destination({
  props,
  token,
  refreshing,
  Textcari,
  Refresh,
}) {
  const { t, i18n } = useTranslation();
  let [dataDes, setDes] = useState([]);

  // get data destination
  const [
    getDes,
    { loading: loadingDes, data: dataDe, error: errorDes },
  ] = useLazyQuery(Destinasi, {
    fetchPolicy: "network-only",
    variables: {
      keyword: Textcari !== null ? Textcari : "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setDes(dataDe?.listdetination_wishlist);
    },
  });

  //Muutation unlike
  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(UnLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _unlikedAnother = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
            type: "destination",
          },
        });
        if (loadingUnLike) {
          Alert.alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            // _Refresh();
            var tempData = [...dataDes];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData.splice(index, 1);
            setDes(tempData);
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  useEffect(() => {
    getDes();
  }, []);

  const addToPlan = (kiriman) => {
    if (token && token !== null && token !== "") {
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
                idkiriman: data?.destinationById?.id,
                Position: "destination",
              },
            });
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loadingDes ? (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 15,
          }}
        >
          <ActivityIndicator
            animating={loadingDes}
            size="large"
            color="#209fae"
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            marginTop: 15,
            justifyContent: "space-evenly",
            paddingHorizontal: 15,
            paddingBottom: 20,
          }}
          horizontal={false}
          data={dataDes}
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
                borderColor: "#F3F3F3",
                borderRadius: 10,
                height: 190,
                // padding: 10,
                // marginTop: 5,
                marginBottom: 15,
                width: "100%",
                flexDirection: "row",
                backgroundColor: "#FFF",
                shadowColor: "#FFF",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6.27,
                elevation: 6,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                {/* Image */}
                <FunImage
                  source={{ uri: item.images.image }}
                  style={{
                    width: 160,
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
                    // borderWidth: 3,
                    borderColor: "#209fae",
                  }}
                >
                  {item.liked === true ? (
                    <Pressable
                      onPress={() => _unlikedAnother(item.id)}
                      style={{
                        backgroundColor: "#F3F3F3",
                        height: 30,
                        width: 30,
                        borderRadius: 17,
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
                        height: 30,
                        width: 30,
                        borderRadius: 17,
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
                        height: 25,
                      }}
                    >
                      <Star height={15} width={15} />
                      <Text size="description" type="bold">
                        {item.rating.substr(0, 3)}
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
                  // height: 170,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ borderWidth: 0 }}>
                  {/* Title */}
                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 3,
                      // alignItems: "center",
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
                        marginBottom: 2,
                        flexWrap: "wrap",
                        width: "90%",
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
                      {item.cities.name}
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
                      // borderWidth: 1,
                      paddingHorizontal: 7,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        {item.movie_location?.length > 0 ? (
                          <UnescoIcon
                            height={33}
                            width={33}
                            style={{ marginRight: 5 }}
                          />
                        ) : null}
                        {item.type?.name.toLowerCase().substr(0, 6) ==
                        "unesco" ? (
                          <MovieIcon height={33} width={33} />
                        ) : null}
                      </View>
                      {dataDes?.destinationById?.movie_location?.length > 0 ? (
                        <UnescoIcon
                          height={33}
                          width={33}
                          style={{ marginRight: 5 }}
                        />
                      ) : null}
                      {dataDes?.destinationById?.type?.name
                        .toLowerCase()
                        .substr(0, 6) == "unesco" ? (
                        <MovieIcon height={33} width={33} />
                      ) : null}
                    </View>
                    <View
                      style={{
                        marginBottom: item.greatfor.length > 0 ? 0 : 7,
                      }}
                    >
                      {item.greatfor.length > 0 ? (
                        <Text
                          size="label"
                          type="bold"
                          // style={{ marginLeft: 5 }}
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
                                  height={40}
                                  width={40}
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
                      width: 70,
                      paddingBottom: 5,
                      paddingRight: 5,
                    }}
                  >
                    <Button
                      onPress={() => addToPlan(item)}
                      size="small"
                      text={"Add"}
                      // style={{ marginTop: 15 }}
                    />
                  </View>
                </View>

                {/* <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 50,
                        marginTop: 10,
                        alignItems: "flex-end",
                        borderWidth: 1,
                      }}
                    >
                      {dataDes?.destinationById?.movie_location?.length > 0 ||
                      dataDes?.destinationById?.type?.name
                        .toLowerCase()
                        .substr(0, 6) == "unesco" ? (
                        <View>
                          <Text>test</Text>
                        </View>
                      ) : null}
                      <View style={{ borderWidth: 1 }}>
                        <Text size="description" type="bold">
                          Great for :
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          {item.greatfor.length > 0 ? (
                            item.greatfor.map((item, index) => {
                              return index < 3 ? (
                                <FunIcon
                                  key={"grat" + index}
                                  icon={item.icon}
                                  fill="#464646"
                                  height={35}
                                  width={35}
                                />
                              ) : null;
                            })
                          ) : (
                            <Text>-</Text>
                          )}
                        </View>
                      </View>
                      <Button
                        onPress={() => addToPlan(item)}
                        size="small"
                        text={"Add"}
                        // style={{ marginTop: 15 }}
                      />
                    </View> */}
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => Refresh()}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  Image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
