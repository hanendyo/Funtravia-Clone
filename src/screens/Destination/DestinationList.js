import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text, Button } from "../../component";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  LikeRed,
  LikeEmptynew,
  Star,
  Arrowbackwhite,
  PinHijau,
  Love,
  LikeEmpty,
} from "../../assets/svg";
import FilterItin from "./FillterDestination";
import Listdestination from "../../graphQL/Query/Destination/ListDestinationV2";
import filterDestination from "./../../graphQL/Query/Destination/Destinasifilter";
import Liked from "../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { FunIcon } from "../../component";

const { width, height } = Dimensions.get("screen");
export default function DestinationList(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Destination",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Destination",
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

  const { t, i18n } = useTranslation();
  const [
    GetFillter,
    { data: datafilter, loading: loadingfilter, error: errorfilter },
  ] = useLazyQuery(filterDestination, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let [token, setToken] = useState();
  let [search, setSearch] = useState({
    type: null,
    keyword: null,
    countries: null,
    cities: null,
    goodfor: null,
    facilities: null,
  });

  const [GetListDestination, { data, loading, error }] = useLazyQuery(
    Listdestination,
    {
      fetchPolicy: "network-only",
      variables: {
        keyword: search.keyword ? search.keyword : null,
        type:
          search.type && search.type.length > 0
            ? search.type
            : props.route.params && props.route.params.idtype
            ? [props.route.params.idtype]
            : null,
        cities:
          search.city && search.city.length > 0
            ? search.city
            : props.route.params && props.route.params.idcity
            ? [props.route.params.idcity]
            : null,
        countries:
          search.country && search.country.length > 0
            ? search.country
            : props.route.params && props.route.params.idcountries
            ? [props.route.params.idcountries]
            : null,
        goodfor: search.goodfor ? search.goodfor : null,
        facilities: search.facilities ? search.facilities : null,
        rating: search.rating ? search.rating : null,
      },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const [
    mutationliked,
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

  const _liked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
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
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            GetListDestination();
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
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
            GetListDestination();
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

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    await GetFillter();

    await GetListDestination();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
      }}
    >
      {datafilter && datafilter.destination_filter ? (
        <FilterItin
          type={datafilter.destination_filter.type}
          country={datafilter.destination_filter.country}
          facility={datafilter.destination_filter.facility}
          sendBack={(e) => setSearch(e)}
          props={props}
        />
      ) : null}

      {data && data.destinationList_v2.length ? (
        <FlatList
          data={data.destinationList_v2}
          contentContainerStyle={{
            marginTop: 5,
            justifyContent: "space-evenly",
            paddingStart: 10,
            paddingEnd: 10,
            paddingBottom: 120,
          }}
          horizontal={false}
          renderItem={({ item, index }) => (
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
                borderColor: "#FFF000",
                borderRadius: 10,
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
                        onPress={() => _unliked(item.id, index)}
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
                        onPress={() => _liked(item.id, index)}
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
                  />
                </View>
              </View>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      ) : null}
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
