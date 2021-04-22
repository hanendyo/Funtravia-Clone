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
} from "react-native";
import { CustomImage, FunIcon } from "../../component";
import { LikeRed, LikeEmpty, Star, PinHijau, Love } from "../../assets/svg";
import { Ticket, MapIconGreen, default_image } from "../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import UnLiked from "../../graphQL/Mutation/unliked";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/native";

export default function Destination({
  props,
  destinationData,
  token,
  refreshing,
  Refresh,
}) {
  const { t, i18n } = useTranslation();
  let [dataDes, setDes] = useState(destinationData);

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

  console.log("des", destinationData);

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

  return (
    <View style={{ flex: 1 }}>
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
        renderItem={({ item }) => (
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
                // key={index}
                style={{
                  borderWidth: 1,
                  borderColor: "#F3F3F3",
                  borderRadius: 10,
                  // height: 170,
                  padding: 10,
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
                  <Image
                    source={{ uri: item.images.image }}
                    style={{
                      width: 130,
                      height: 160,
                      borderRadius: 10,
                    }}
                  />
                </View>

                {/* Keterangan */}
                {/* rating */}
                <View
                  style={{
                    flex: 1,
                    paddingLeft: 10,
                    height: 160,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
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
                          {item.rating}
                        </Text>
                      </View>
                      {item.liked === true ? (
                        <Pressable
                          onPress={() => _unliked(item.id)}
                          style={{
                            backgroundColor: "#F3F3F3",
                            height: 34,
                            width: 34,
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
                            height: 34,
                            width: 34,
                            borderRadius: 17,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LikeEmpty height={15} width={15} />
                        </Pressable>
                      )}
                    </View>

                    {/* Title */}
                    <Text
                      size="label"
                      type="bold"
                      style={{ marginTop: 2 }}
                      numberOfLines={2}
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
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
        // extraData={selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    // marginTop: 20,
    // paddingTop: (50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // width: (110),
    // height: (110),
    // marginRight: (5),
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
