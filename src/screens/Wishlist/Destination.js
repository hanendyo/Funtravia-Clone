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
  Pressable,
} from "react-native";
import { CustomImage, FunIcon } from "../../component";
import { LikeRed, LikeEmpty, Star, PinHijau } from "../../assets/svg";
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
  
  const RenderDes = ({ item,index }) => {
    return (
      <Pressable
      onPress={() => {
        props.navigation.navigate("detailStack", {
          id: item.id,
          name: item.name,
        });
      }}
      style={{
        width: "100%",
        padding: 10,
        elevation:2,
        backgroundColor: "#FFFFFF",
        marginBottom: 10,
        borderRadius: 10,
        marginTop:10,
        flexDirection: "row",
      }}
    >
      <Image
        source={item.images && item.images.image
          ? { uri: item.images.image }
          : default_image}
        style={{ width: "40%", height: 145, borderRadius: 10 }}
        resizeMode="cover"
      />
      <View
        style={{
          paddingLeft: 10,
          paddingVertical: 5,
          width: "60%",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 3,
                flexDirection: "row",
              }}
            >
              <Star width={15} height={15} />
              <Text style={{ paddingLeft: 5 }} type="bold">
                {item.rating}
              </Text>
            </View>
            {item.liked === false ? (
              <Button
                onPress={() => _liked(item.id, index)}
                type="circle"
                style={{
                  width: 25,
                  borderRadius: 19,
                  height: 25,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "#EEEEEE",
                  zIndex: 999,
                }}
              >
                <LikeEmptynew width={15} height={15} />
              </Button>
            ) : (
              <Button
                onPress={() => _unliked(item.id, index)}
                type="circle"
                style={{
                  width: 25,
                  borderRadius: 17.5,
                  height: 25,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "#EEEEEE",
                  zIndex: 999,
                }}
              >
                <LikeRed width={15} height={15} />
              </Button>
            )}
          </View>
          <Text size="title" type="bold" style={{ marginBottom: 5 }}>
            {item.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "flex-start",
            }}
          >
            <PinHijau width={15} height={15} />
            <Text
              type="regular"
              size="description"
              style={{ color: "#464646", marginLeft: 5 }}
            >
              {item.cities.name && item.countries.name
                ? `${item.cities.name}`
                : ""}
            </Text>
          </View>
        </View>
        {/* icon great for */}
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent:"center",
            alignItems:"center",
            width: "100%",
            padding:0
            // width: (Dimensions.get("screen").width - 100) * 0.5 ,
          }}

        >
          <View>
          {item.greatfor && item.greatfor.length ? (
        <View
          style={{
            justifyContent: "flex-start",
            alignContent: "flex-start",
          }}
        >
          <Text
            size="description"
            type="bold"
            style={{
              color: "#464646",
            }}
          >
            {t("greatFor")}:
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignContent: "space-between",
              alignItems: "stretch",
              alignSelf: "flex-start",
            }}
          >
            {item.greatfor.map((item, index) => {
              return (
                <FunIcon
                  icon={item.icon}
                  fill="#464646"
                  height={42}
                  width={42}
                  style={{}}
                />
              );
            })}
          </View>
        </View>
      ) : (
        <View
          style={{
            justifyContent: "flex-start",
            alignContent: "flex-start",
          }}
        ></View>
      )}
      <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
    >
          {item.greatfor && item.greatfor.length ? (
            <View
              style={{
                justifyContent: "flex-start",
                alignContent: "flex-start",
              }}
            >
              <Text
                size="description"
                type="bold"
                style={{
                  color: "#464646",
                }}
              >
                {t("greatFor")}:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignContent: "space-between",
                  alignItems: "stretch",
                  alignSelf: "flex-start",
                }}
              >
                {item.greatfor.map((item, index) => {
                  return (
                    <FunIcon
                      icon={item.icon}
                      fill="#464646"
                      height={42}
                      width={42}
                      style={{}}
                    />
                  );
                })}
              </View>
            </View>
          ) : (
            <View
              style={{
                justifyContent: "flex-start",
                alignContent: "flex-start",
              }}
            >
              <Text
            size="description"
            type="bold"
            style={{
              color: "#464646",
            }}
          >
            {t("greatFor")}:
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignContent: "space-between",
              alignItems: "stretch",
              alignSelf: "flex-start",
            }}
          >
           
                <FunIcon
                  icon="i-4wd" 
                  fill="#464646"
                  height={42}
                  width={42}
                  style={{}} />
                   <FunIcon
                  icon="i-family_room" 
                  fill="#464646"
                  height={42}
                  width={42}
                  style={{}} />
                  
              {/* );
            })} */}
          </View>
        </View>
      )}
      </View>
          </View>
         
          <Button
            size="small"
            text={t("adddeswishlist")}
            color="primary"
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
            style={{
              marginTop:10,
            }}
          />
        </View>
      </View>
    </Pressable>
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
            item={item}
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
