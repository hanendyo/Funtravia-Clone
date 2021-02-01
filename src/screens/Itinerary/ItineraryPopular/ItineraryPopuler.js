import { Thumbnail, View } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Image, Platform, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Text } from "../../../component";
import {
  default_image,
  itinerary_1,
  itinerary_2
} from "../../../assets/png";
import {
  Arrowbackwhite,
  Calendargrey,
  LikeRed,
  LikeEmpty,
  PinHijau,
  User,
  TravelStories,
  TravelAlbum,
  SoloIcon,
  BussinessIcon,
  FamilyIcon,
  HoneyIcon,
  CompervanIcon
} from "../../../assets/svg";
import { Truncate, Loading } from "../../../component";
import { useTranslation } from "react-i18next";
import Fillter from "./Fillter/index";
import { useLazyQuery, useMutation } from "@apollo/client";
import Populer_ from "../../../graphQL/Query/Itinerary/ItineraryPopuler";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
export default function ItineraryPopuler(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Itinerary",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Popular Itinerary",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
  let [search, setSearch] = useState({
    keyword: "",
    type: null,
    cities: null,
    countries: null,
    orderby: null,
    rating: null,
  });
  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  const cari = async (e) => {
    console.log(e);
    await setSearch(e);
    await fetchDataListPopuler;
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    await fetchDataListPopuler();
  };

  const [
    fetchDataListPopuler,
    { data: dataPopuler, loading: loadingPopuler },
  ] = useLazyQuery(Populer_, {
    variables: {
      keyword: search.keyword,
      type: null,
      countries: null,
      cities: null,
      rating: null,
      orderby: null,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(ItineraryLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id, index) => {
    if (token || token !== "") {
      try {
        let response = await mutationliked({
          variables: {
            id: id,
            qty: 1,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.setItineraryFavorit.code === 200 ||
            response.data.setItineraryFavorit.code === "200"
          ) {
            fetchDataListPopuler();
          } else {
            throw new Error(response.data.setItineraryFavorit.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id, index) => {
    if (token || token !== "") {
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
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
            response.data.unsetItineraryFavorit.code === 200 ||
            response.data.unsetItineraryFavorit.code === "200"
          ) {
            fetchDataListPopuler();
          } else {
            throw new Error(response.data.unsetItineraryFavorit.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return (
      Difference_In_Days +
      1 +
      " " +
      "Day" +
      " " +
      Difference_In_Days +
      " " +
      "Night"
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  const renderPopuler = ({ item, index }) => {
    return (
      <View
        style={{
          height: Dimensions.get("screen").width * 0.5,
          paddingHorizontal: 10,
          alignSelf: "center",
          backgroundColor: "#F8F8F8",
          borderRadius: 15,
          shadowColor: "gray",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: arrayShadow.shadowOpacity,
          shadowRadius: arrayShadow.shadowRadius,
          elevation: arrayShadow.elevation,
          marginVertical: 10,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            height: "80%",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("ItineraryStack", {
                screen: "itindetail",
                params: {
                  itintitle: item.name,
                  country: item.id,
                  token: token,
                  status: "favorite",
                },
              })
            }
          >
            <Image
              source={item && item.cover ? { uri: item.cover } : default_image}
              style={{
                height: "100%",
                width: Dimensions.get("screen").width * 0.35,
                borderTopLeftRadius: 10,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: Dimensions.get("screen").width * 0.5,
              marginHorizontal: 10,
              backgroundColor: "#FFFFFF",
              marginVertical: 5,
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
                    borderWidth: 1,
                    borderColor: "#209FAE",
                    borderRadius: 3,
                    backgroundColor: "#DAF0F2",
                  }}
                >
                  <Text
                    style={{ color: "#209FAE", padding: 3 }}
                    size="small"
                    type="bold"
                  >
                    Family Trip
                  </Text>
                </View>
                {item.liked === false ? (
                  <TouchableOpacity onPress={() => _liked(item.id, index)}>
                    <LikeEmpty height={20} width={20} />
                  </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => _unliked(item.id, index)}>
                      <LikeRed height={20} width={20} />
                    </TouchableOpacity>
                  )}
              </View>
              <Text size="description" type="black" style={{ marginTop: 10 }}>
                <Truncate text={item.name} length={40} />
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <PinHijau width={15} height={15} />
                <Text style={{ marginLeft: 5 }} size="small" type="regular">
                  {item?.country?.name}
                </Text>
                <Text>,</Text>
                <Text size="small" type="regular" style={{ marginLeft: 3 }}>
                  {item?.city?.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Calendargrey
                    width={10}
                    height={10}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={{ marginLeft: 3 }} size="small" type="regular">
                    {item.start_date && item.end_date
                      ? getDN(item.start_date, item.end_date)
                      : null}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 15,
                  }}
                >
                  <User width={10} height={10} style={{ marginRight: 5 }} />
                  <Text size="small" type="regular">
                    {(item && item.buddy_count ? item.buddy_count : null) +
                      " " +
                      "Person"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text size="small" type="regular">
                {`${t("CreatedBy")} :`}
              </Text>
              <Text style={{ marginLeft: 5 }} size="small" type="regular">
                Asep
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            // borderWidth: 1,
            paddingTop: 10,
            height: "20%",
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            justifyContent: "space-between",
            paddingBottom: 5,
          }}
        >
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: 1,
              borderColor: "#D1D1D1",
            }}
          >
            <TravelAlbum style={{ marginRight: 5 }} />
            <Text size="small" type="bold" style={{ color: "#209FAE" }}>
              Travel Album
            </Text>
          </View>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TravelStories style={{ marginRight: 5 }} />
            <Text size="small" type="bold" style={{ color: "#209FAE" }}>
              Travel Stories
            </Text>
          </View>
        </View>
      </View>
    );
  };

  {
    /* ======================================= Render All ====================================================*/
  }
  return (
    <View style={{ flex: 1 }}>
      <Loading show={loadingPopuler} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'white' }}>
        <View
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').width * 0.3,
            paddingHorizontal: 10,
            marginTop: 10,
            flexDirection: 'row'
          }}
        >
          <Pressable style={{ marginRight: 5, borderRadius: 10 }}>
            <Image source={itinerary_1} style={{ height: "100%", width: Dimensions.get('screen').width * 0.55 }} />
            <Text
              size='description'
              type='bold'
              style={{
                position: 'absolute',
                paddingHorizontal: 10,
                marginTop: 15,
                paddingVertical: 3,
                backgroundColor: "#209FAE",
                color: "white"
              }}>New Itinerary</Text>
          </Pressable>
          <Pressable style={{ marginRight: 5, borderRadius: 10 }}>
            <Image source={itinerary_2} style={{ height: "100%", width: Dimensions.get('screen').width * 0.55 }} />
            <Text
              size='description'
              type='bold'
              style={{
                position: 'absolute',
                paddingHorizontal: 10,
                marginTop: 15,
                paddingVertical: 3,
                backgroundColor: "#209FAE",
                color: "white"
              }}>Populer</Text>
          </Pressable>
        </View>

        {/* ======================================= Category ====================================================*/}
        <View
          style={{
            width: Dimensions.get('screen').width * 0.9,
            paddingHorizontal: 10,
            marginTop: 10,
          }}>
          <Text size='title' type='bold'>
            Category Itinerary
					</Text>
        </View>
        <View
          style={{
            width: Dimensions.get('screen').width,
            paddingHorizontal: 10,
            marginTop: 10,
            flexDirection: 'row',

          }}>
          <Pressable style={{
            width: Dimensions.get('screen').width * 0.23,
            height: Dimensions.get('screen').width * 0.23,
            backgroundColor: "white",
            marginRight: 5,
            shadowColor: 'gray',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
            alignItems: 'center',
            justifyContent: "center",
            borderRadius: 5
          }}>
            <View style={{
              backgroundColor: "#f6f6f6",
              height: 50,
              width: 50,
              borderRadius: 50,
            }}>
              <CompervanIcon height={50} width={50} />
            </View>
            <Text size='small' type='regular' style={{ textAlign: 'center' }}>Compervan</Text>
          </Pressable>
          <Pressable style={{
            width: Dimensions.get('screen').width * 0.23,
            height: Dimensions.get('screen').width * 0.23,
            backgroundColor: "white",
            marginRight: 5,
            shadowColor: 'gray',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
            alignItems: 'center',
            justifyContent: "center",
            borderRadius: 5
          }}>
            <View style={{
              backgroundColor: "#f6f6f6",
              height: 50,
              width: 50,
              borderRadius: 50,
            }}>
              <BussinessIcon height={50} width={50} />
            </View>
            <Text size='small' type='regular' style={{ textAlign: 'center' }}>Bussines</Text>
          </Pressable>
          <Pressable style={{
            width: Dimensions.get('screen').width * 0.23,
            height: Dimensions.get('screen').width * 0.23,
            backgroundColor: "white",
            marginRight: 5,
            shadowColor: 'gray',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
            alignItems: 'center',
            justifyContent: "center",
            borderRadius: 5
          }}>
            <View style={{
              backgroundColor: "#f6f6f6",
              height: 50,
              width: 50,
              borderRadius: 50,
            }}>
              <SoloIcon height={50} width={50} />
            </View>
            <Text size='small' type='regular' style={{ textAlign: 'center' }}>Solo</Text>
          </Pressable>
          <Pressable style={{
            width: Dimensions.get('screen').width * 0.23,
            height: Dimensions.get('screen').width * 0.23,
            backgroundColor: "white",
            marginRight: 5,
            shadowColor: 'gray',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
            alignItems: 'center',
            justifyContent: "center",
            borderRadius: 5
          }}>
            <View style={{
              backgroundColor: "#f6f6f6",
              height: 50,
              width: 50,
              borderRadius: 50,
            }}>
              <HoneyIcon height={50} width={50} />
            </View>
            <Text size='small' type='regular' style={{ textAlign: 'center' }}>Honeymoon</Text>
          </Pressable>
        </View>

        {/* ======================================= Trending Trips ====================================================*/}
        {dataPopuler && dataPopuler.itinerary_list_populer ? (
          <>
            <FlatList
              renderItem={renderPopuler}
              data={dataPopuler.itinerary_list_populer}
              keyExtractor={(dataPopuler) => dataPopuler.id}
              nestedScrollEnabled
              ListHeaderComponent={
                <View style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  justifyContent: 'space-around',
                  shadowColor: 'gray',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: arrayShadow.shadowOpacity,
                  shadowRadius: arrayShadow.shadowRadius,
                  elevation: arrayShadow.elevation,
                  backgroundColor: "white",
                }}>
                  <Text size='label' type='bold'>Itinerary</Text>
                  <Text size='label' type='bold'>Travel Album</Text>
                  <Text size='label' type='bold'>Travel Stories</Text>
                </View>
              }
              ListFooterComponent={null}
            />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
