import React, {
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
  Alert,
  RefreshControl,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
  TouchableHighlight,
} from "react-native";

import { Item, Right } from "native-base";
import { Rating, AirbnbRating } from "react-native-ratings";
import addToWishlistAccommodation from "../../../graphQL/Mutation/Accommodation/AddToWishlist";
//data_bg nanti itu Profile Picture, data_pic itu avatar
import { MapIconGreen } from "../../../assets/png";
import { LikeRed, LikeEmptynew } from "../../../assets/svg";
import { Container, Header, Tab, Tabs, ScrollableTab } from "native-base";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { rupiah } from "../../../const/Rupiah";

import SearchAccommodationQuery from "../../../graphQL/Query/Search/SearchAccommodation";
import { numColumns } from "../ServiceDetail/TourGuideList";
import { ImageSlide } from "..";
import ImageViewer from "react-native-image-zoom-viewer";
import ImageSlider from "react-native-image-slider";
import Loading from "../Loading";
import Liked from "../../../graphQL/Mutation/Rent/liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import unliked from "../../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";

export default function ListRenderAccom({
  props,
  datanya,
  Refresh,
  refreshing,
  token,
}) {
  const { t, i18n } = useTranslation();

  // let [token, setToken] = useState('');
  let [selected] = useState(new Map());
  let [dataAccommodation, setDataAccommodation] = useState(datanya);

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(addToWishlistAccommodation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token?`Bearer ${token}`:null,
      },
    },
  });
  // console.log(token);-

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(UnLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token?`Bearer ${token}`:null,
      },
    },
  });

  const eventdetail = (data) => {
    props.navigation.navigate("eventdetail", {
      data: data,
      name: data.name,
      token: token,
    });
  };

  const _liked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationliked({
          variables: {
            id: id,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }

        // console.log(response);
        if (response.data) {
          if (
            response.data.setAccomodation_wishlist.code === 200 ||
            response.data.setAccomodation_wishlist.code === "200"
          ) {
            // _Refresh();
            var tempData = [...dataAccommodation];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = true;
            setDataAccommodation(tempData);
          } else {
            throw new Error(response.data.setAccomodation_wishlist.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
        console.log(" " + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
            type: "accomodation",
          },
        });
        if (loadingUnLike) {
          Alert.alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }

        // console.log(response.data.unset_wishlist.code);
        if (response.data) {
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            // _Refresh();
            var tempData = [...dataAccommodation];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = false;
            setDataAccommodation(tempData);
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
        console.log(" " + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _renderItem = ({ item, index }) => {
    // console.log(item);
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.95,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
          marginBottom: 15,
        }}
      >
        {/* <ImageSlide
					show={modal}
					dataImage={dataImage}
					setClose={() => setModal(!modal)}
				/> */}
        <View>
          {/* <TouchableOpacity onPress={() => getdataImage()}> */}
          <ImageBackground
            // key={id}
            source={{ uri: item.images.image }}
            style={[
              styles.ImageView,
              {
                width: Dimensions.get("screen").width * 0.9,
                height: Dimensions.get("screen").height * 0.2,
                backgroundColor: "white",
                borderColor: "gray",
                shadowColor: "gray",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 3,
                elevation: 3,
                alignSelf: "center",
              },
            ]}
            imageStyle={styles.Image}
          >
            {item.liked === false ? (
              <Button
                onPress={() => _liked(item.id)}
                type="circle"
                style={{
                  alignSelf: "flex-end",
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: "transparent",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <LikeEmptynew width={20} height={20} />
              </Button>
            ) : (
              <Button
                onPress={() => _unliked(item.id)}
                type="circle"
                style={{
                  alignSelf: "flex-end",
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: "transparent",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <LikeRed width={20} height={20} />
              </Button>
            )}
          </ImageBackground>
          {/* </TouchableOpacity> */}
        </View>
        <View
          style={{
            // flexDirection: 'row',
            flex: 1,
            width: Dimensions.get("screen").width * 0.9,
            // backgroundColor: 'red',
            alignSelf: "center",
            // marginBottom: (10),
          }}
        >
          <View
            style={{
              justifyContent: "space-evenly",
              width: Dimensions.get("window").width * 0.9,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => console.log("name pressed")}>
                <Text type="bold" size="label">
                  {item.name}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    paddingRight: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <AirbnbRating
                    count={5}
                    // reviews={[]}
                    showRating={false}
                    // reviewSize={0}
                    isDisabled={true}
                    defaultRating={item.rating / 2}
                    size={10}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: 15,
                  height: 15,
                }}
                imageStyle={{
                  resizeMode: "contain",
                }}
                // isTouchable={true}
                // onPress={() => props.navigation.navigate('Home')}
                source={MapIconGreen}
              />
              <Text
                size="small"
                type="regular"
                style={{
                  // fontFamily: "Lato-Regular",
                  color: "#A4A4A4",
                  marginLeft: 3,
                  // fontSize: 10,
                }}
              >
                {item.city_name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  // borderWidth: 1,
                  // borderColor: 'red',
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  type="bold"
                  size="title"
                  style={{
                    // fontFamily: "Lato-Bold",
                    // fontSize: 18,
                    color: "#2763AA",
                    // marginLeft: (5),
                  }}
                >
                  {`IDR ${rupiah(item.pricerange)}`}
                </Text>
              </View>
              <View
                style={{
                  // borderWidth: 1,
                  // borderColor: 'red',
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  paddingBottom: 3,
                }}
              >
                <Text size="small" type="regular">
                  {t("roomNight")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignSelf: "flex-end",
                  alignItems: "center",
                  alignContent: "flex-end",
                  position: "absolute",
                  right: 0,
                  width: 50,
                }}
              >
                <Text
                  type="bold"
                  size="small"
                  style={{
                    // fontFamily: "Lato-Bold",
                    // fontSize: 10,
                    color: "#2763AA",
                  }}
                >
                  {item.rating}
                </Text>
                <Text
                  size="small"
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    // fontSize: 10,
                    color: "#209FAE",
                  }}
                >
                  {item.count_review}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            backgroundColor: "rgb(240, 240, 240)",
            marginBottom: 10,
            marginTop: 5,

            borderRadius: 5,
            height: 20,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignSelf: "center",
          }}
        >
          <View
            style={{
              minWidth: (Dimensions.get("window").width - 40) / 3,
              flexDirection: "row",
              alignContent: "flex-end",
              justifyContent: "flex-end",
              alignItems: "center",
              // borderColor: 'red',
              // borderWidth: 1,
            }}
          >
            <Text
              size="small"
              type="regular"
              style={{
                // fontFamily: "Lato-Regular",
                // fontSize: 10,
                marginHorizontal: 3,
                marginLeft: 20,
              }}
            >
              100 km
            </Text>
            <Text
              size="small"
              type="regular"
              style={{
                // fontFamily: "Lato-Regular",
                // fontSize: 10,
                marginHorizontal: 3,
              }}
            >
              {t("fromYourLocation")}
            </Text>
          </View>
          <View
            style={{
              minWidth: (Dimensions.get("window").width - 40) / 3,
              flexDirection: "row",
              alignContent: "flex-end",
              justifyContent: "flex-end",
              alignItems: "center",

              // borderColor: 'red',
              // borderWidth: 1,
            }}
          >
            <Text
              size="small"
              type="regular"
              style={{
                // fontFamily: "Lato-Regular",
                // fontSize: 10,
                marginHorizontal: 3,
              }}
            >
              {item.name_type}
            </Text>
            <Text
              size="small"
              type="regular"
              style={{
                // fontFamily: "Lato-Regular",
                // fontSize: 10,
                marginHorizontal: 3,
                marginRight: 20,
              }}
            >
              {t("roomClass")}
            </Text>
          </View>
          <View
            style={{
              minWidth: (Dimensions.get("window").width - 40) / 3,
              flexDirection: "row",
              alignContent: "flex-end",
              justifyContent: "flex-end",
              alignItems: "center",

              // borderColor: 'red',
              // borderWidth: 1,
            }}
          >
            <Text
              size="small"
              type="regular"
              style={{
                // fontFamily: "Lato-Regular",
                // fontSize: 10,
                marginHorizontal: 3,
              }}
            >
              {item.facilities_count}
            </Text>
            <Text
              size="small"
              type="regular"
              style={{
                // fontFamily: "Lato-Regular",
                // fontSize: 10,
                marginHorizontal: 3,
                marginRight: 20,
              }}
            >
              {t("facilities")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{
        // marginTop: (7),
        marginBottom: 15,
        justifyContent: "space-evenly",
        // paddingVertical: (5),
        paddingBottom: 5,
        paddingHorizontal: 4,
      }}
      horizontal={false}
      // data={_FormatData(dataEvent, numColumns)}
      data={dataAccommodation}
      renderItem={_renderItem}
      numColumns={numColumns}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      extraData={selected}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
      }
    />
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "row",
    // marginTop: 20,
    // paddingTop: (50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // flex:1,
    // width: Dimensions.get('window').width - (Dimensions.get('window').width * 0.62),
    // height: (187),
    height: Dimensions.get("window").width * 0.47 - 16,
    // marginRight: (5),
    // marginLeft: (5),
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",

    // borderBottomStartRadius: 0,
    backgroundColor: "rgba(20,20,20,0.4)",
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,
    // height: (187),
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
    // borderBottomStartRadius: 0,
  },
});
