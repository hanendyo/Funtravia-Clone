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
import { LikeRed, LikeEmpty, Star, PinHijau, Love } from "../../assets/svg";
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

  console.log(Textcari);
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

  const _unliked = async (id) => {
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
            marginTop: 5,
            justifyContent: "space-evenly",
            paddingStart: 10,
            paddingEnd: 10,
            paddingBottom: 120,
          }}
          horizontal={false}
          data={dataDes}
          renderItem={({ item, index }) => (
            console.log("item", item),
            (
              <Pressable
                onPress={() => {
                  props?.route?.params && props?.route?.params?.iditinerary
                    ? props.navigation.push("DestinationUnescoDetail", {
                        id: item.id,
                        name: item.name,
                        token: token,
                        iditinerary: props.route.params.iditinerary,
                        datadayaktif: props.route.params.datadayaktif,
                      })
                    : props.navigation.push("DestinationUnescoDetail", {
                        id: item.id,
                        name: item.name,
                        token: token,
                      });
                }}
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: "#F3F3F3",
                  borderRadius: 10,
                  height: 170,
                  // padding: 10,
                  marginTop: 10,
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
                      width: 150,
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
                      width: 130,
                      zIndex: 2,
                    }}
                  >
                    {item.liked === true ? (
                      <Pressable
                        onPress={() => _unliked(item.id)}
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
                        onPress={() => _liked(item.id)}
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
                  </View>
                </View>

                {/* Keterangan */}
                {/* rating */}
                <View
                  style={{
                    flex: 1,
                    padding: 10,
                    height: 170,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    {/* Title */}
                    <Text
                      size="label"
                      type="bold"
                      style={{ marginTop: 2 }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>

                    {/* Maps */}
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 5,
                        alignItems: "center",
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
                      flexDirection: "row",
                      justifyContent: "space-between",
                      height: 50,
                      marginTop: 10,
                      alignItems: "flex-end",
                    }}
                  >
                    <View>
                      <Text size="description" type="bold">
                        Great for :
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        {/* {loadGreat ? (
                        <SkeletonPlaceholder>
                          <View style={{ flexDirection: "row" }}>
                            <View
                              style={{
                                height: 35,

                                width: 35,
                              }}
                            ></View>
                            <View
                              style={{
                                height: 35,
                                marginLeft: 2,
                                width: 35,
                              }}
                            ></View>
                            <View
                              style={{
                                height: 35,
                                marginLeft: 2,
                                width: 35,
                              }}
                            ></View>
                          </View>
                        </SkeletonPlaceholder>
                      ) : null} */}
                        {item.greatfor.length > 0 ? (
                          item.greatfor.map((item, index) => {
                            return index < 3 ? (
                              <FunIcon
                                key={index}
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
                      onPress={() => {
                        props.route.params && props.route.params.iditinerary
                          ? props.navigation.dispatch(
                              StackActions.replace("ItineraryStack", {
                                screen: "ItineraryChooseday",
                                params: {
                                  Iditinerary: props.route.params.iditinerary,
                                  Kiriman: item.id,
                                  token: token,
                                  Position: "destination",
                                  datadayaktif: props.route.params.datadayaktif,
                                },
                              })
                            )
                          : props.navigation.push("ItineraryStack", {
                              screen: "ItineraryPlaning",
                              params: {
                                idkiriman: item.id,
                                Position: "destination",
                              },
                            });
                      }}
                      size="small"
                      text={"Add"}
                      // style={{ marginTop: 15 }}
                    />
                  </View>
                </View>
              </Pressable>
            )
          )}
          // keyExtractor={(item) => item.id}
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
