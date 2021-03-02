import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CustomImage } from "../../component";
import { LikeRed, LikeEmpty } from "../../assets/svg";
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

  const RenderDes = ({ data }) => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width - 20,
          marginTop: 10,
          paddingVertical: 10,
          flex: 1,
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("detailStack", {
              id: data.id,
              name: data.name,
            });
          }}
          style={{
            width: "30%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <ImageBackground
            key={data.id}
            source={
              data.images && data.images.image
                ? { uri: data.images.image }
                : default_image
            }
            style={[
              styles.ImageView,
              {
                width: Dimensions.get("screen").width * 0.25,
                height: Dimensions.get("screen").width * 0.25,
                backgroundColor: "white",
                borderColor: "gray",
                shadowColor: "gray",
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 3,
                elevation: 3,
              },
            ]}
            imageStyle={[
              styles.Image,
              {
                width: Dimensions.get("screen").width * 0.25,
                height: Dimensions.get("screen").width * 0.25,
              },
            ]}
          ></ImageBackground>
        </TouchableOpacity>
        <View
          style={{
            width: "70%",
            height: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              padding: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.6,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.6 - 30,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: Dimensions.get("window").width * 0.6 - 30,
                    }}
                  >
                    <Text size="label" type="bold" style={{}}>
                      {data.name}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: 5,
                      marginBottom: 10,
                    }}
                  >
                    <CustomImage
                      customStyle={{
                        width: 20,
                        height: 20,
                      }}
                      customImageStyle={{
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                      }}
                      source={MapIconGreen}
                    />
                    <Text
                      size="description"
                      style={{
                        marginLeft: 3,
                      }}
                    >
                      {data.cities && data.cities.name ? data.cities.name : "-"}
                    </Text>
                  </View>
                </View>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => _unliked(data.id)}
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 15,
                      backgroundColor: "rgb(240, 240, 240)",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    {data.liked == true ? (
                      <LikeRed height={15} width={15} />
                    ) : (
                      <LikeEmpty height={15} width={15} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  marginTop: 5,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E2ECF8",
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 5,
                    justifyContent: "center",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    flex: 1,
                    marginRight: 5,
                  }}
                >
                  <CustomImage
                    customStyle={{
                      width: 17,
                      height: 17,
                    }}
                    customImageStyle={{
                      width: 17,
                      height: 17,
                      resizeMode: "contain",
                    }}
                    source={Ticket}
                  />
                  <Text size="small" type="bold" style={{ marginLeft: 5 }}>
                    {t("findTicket")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props.route.params && props.route.params.iditinerary
                      ? props.navigation.dispatch(
                          StackActions.replace("ItineraryStack", {
                            screen: "ItineraryChooseday",
                            params: {
                              Iditinerary: props.route.params.iditinerary,
                              Kiriman: data.id,
                              token: token,
                              Position: "destination",
                              datadayaktif: props.route.params.datadayaktif,
                            },
                          })
                        )
                      : props.navigation.push("ItineraryStack", {
                          screen: "ItineraryPlaning",
                          params: {
                            idkiriman: data.id,
                            Position: "destination",
                          },
                        });
                  }}
                  style={{
                    backgroundColor: "#209fae",
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text size="small" type="bold" style={{ color: "white" }}>
                    {t("addToPlan")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
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
          <RenderDes
            data={item}
            // onSelect={onSelect}
            // selected={!!selected.get(item.id)}
          />
        )}
        // keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
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
