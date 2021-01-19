import { Thumbnail, View } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Image, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Text } from "../../../component";
import { default_image } from "../../../assets/png";
import {
  Arrowbackwhite,
  Calendargrey,
  LikeRed,
  LikeEmpty,
  PinHijau,
  User,
  TravelStories,
  TravelAlbum,
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
    title: "Popular Itinerary",
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
      fontFamily: "Lato-Regular",
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

  console.log(token);

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
          width: Dimensions.get("screen").width * 0.9,
          height: Dimensions.get("screen").width * 0.5,
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
              props.navigation.navigate("itindetail", {
                itintitle: item.name,
                country: item.id,
                token: token,
                status: "favorite",
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

      <ScrollView stickyHeaderIndices={[0]}>
        <View
          style={{
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
            backgroundColor: "#FFFFFF",
          }}
        >
          {dataPopuler && dataPopuler.itinerary_list_populer.length ? (
            <Fillter
              fillter={dataPopuler.itinerary_list_populer}
              sendBack={(e) => cari(e)}
            />
          ) : null}
        </View>

        {/* ======================================= Category ====================================================*/}
        {/* <View
					style={{
						width: Dimensions.get('screen').width * 0.9,
						marginTop: 20,
						alignSelf: 'center',
					}}>
					<Text size='title' type='bold'>
						Category
					</Text>
				</View>
				<View
					style={{
						height: Dimensions.get('screen').width * 0.3,
						marginTop: 15,
						marginHorizontal: 20,
						flexDirection: 'row',
					}}>
					<TouchableOpacity
						style={{
							width: Dimensions.get('screen').width * 0.3,
							height: Dimensions.get('screen').width * 0.3,
							borderRadius: 5,
							borderWidth: 1,
							borderColor: '#E2E2E2',
							backgroundColor: '#FFFFFF',
							marginRight: 5,
							alignItems: 'center',
							justifyContent: 'center',
							marginBottom: 50,
							shadowColor: 'gray',
							shadowOffset: { width: 0, height: 1 },
							shadowOpacity: arrayShadow.shadowOpacity,
							shadowRadius: arrayShadow.shadowRadius,
							elevation: arrayShadow.elevation,
						}}>
						<View>
							<Thumbnail
								source={default_image}
								style={{ alignSelf: 'center' }}
							/>
							<View>
								<Text
									size='description'
									type='regular'
									style={{
										textAlign: 'center',
										marginTop: 4,
										paddingHorizontal: 5,
									}}>
									<Truncate text={'Solo'} length={30} />
								</Text>
							</View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							width: Dimensions.get('screen').width * 0.3,
							height: Dimensions.get('screen').width * 0.3,
							borderRadius: 5,
							borderWidth: 1,
							borderColor: '#E2E2E2',
							backgroundColor: '#FFFFFF',
							marginRight: 5,
							alignItems: 'center',
							justifyContent: 'center',
							marginBottom: 50,
							shadowColor: 'gray',
							shadowOffset: { width: 0, height: 1 },
							shadowOpacity: arrayShadow.shadowOpacity,
							shadowRadius: arrayShadow.shadowRadius,
							elevation: arrayShadow.elevation,
						}}>
						<View>
							<Thumbnail
								source={default_image}
								style={{ alignSelf: 'center' }}
							/>
							<View>
								<Text
									size='description'
									type='regular'
									style={{
										textAlign: 'center',
										marginTop: 4,
										paddingHorizontal: 5,
									}}>
									<Truncate text={'TripFamily'} length={30} />
								</Text>
							</View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							width: Dimensions.get('screen').width * 0.3,
							height: Dimensions.get('screen').width * 0.3,
							borderRadius: 5,
							borderWidth: 1,
							borderColor: '#E2E2E2',
							backgroundColor: '#FFFFFF',
							marginRight: 5,
							alignItems: 'center',
							justifyContent: 'center',
							marginBottom: 50,
							shadowColor: 'gray',
							shadowOffset: { width: 0, height: 1 },
							shadowOpacity: arrayShadow.shadowOpacity,
							shadowRadius: arrayShadow.shadowRadius,
							elevation: arrayShadow.elevation,
						}}>
						<View>
							<Thumbnail
								source={default_image}
								style={{ alignSelf: 'center' }}
							/>
							<View>
								<Text
									size='description'
									type='regular'
									style={{
										textAlign: 'center',
										marginTop: 4,
										paddingHorizontal: 5,
									}}>
									<Truncate text={'Honeymoon'} length={30} />
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View> */}

        {/* ======================================= Trending Trips ====================================================*/}
        {dataPopuler && dataPopuler.itinerary_list_populer ? (
          <>
            <View
              style={{
                width: Dimensions.get("screen").width * 0.9,
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <Text size="title" type="bold">
                Trending Trips
              </Text>
            </View>
            <FlatList
              renderItem={renderPopuler}
              data={dataPopuler.itinerary_list_populer}
              keyExtractor={(dataPopuler) => dataPopuler.id}
              nestedScrollEnabled
              ListHeaderComponent={null}
              ListFooterComponent={null}
            />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

ItineraryPopuler.navigationOptions = (props) => ({
  headerTitle: "Popular Itinerary",
  headerMode: "screen",
  headerStyle: {
    backgroundColor: "#209FAE",
    elevation: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    fontFamily: "lato-reg",
    fontSize: 14,
    color: "white",
    alignSelf: "center",
  },
  headerLeft: (
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
  headerLeftContainerStyle: {},
  headerRight: <View style={{ flexDirection: "row" }}></View>,
  headerRightStyle: {},
});
