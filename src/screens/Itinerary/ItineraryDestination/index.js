import React, { useState, useEffect } from "react";
import {
  View,
  // Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { CustomImage, FunIcon, FunImage } from "../../../component";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  LikeRed,
  LikeEmpty,
  Arrowbackwhite,
  OptionsVertWhite,
  Star,
  PinHijau,
  default_image,
  LikeEmptynew,
  Love,
} from "../../../assets/svg";
import FilterItin from "./FillterItin";
import Listdestination from "../../../graphQL/Query/Destination/ListDestinationV2";
import filterDestination from "../../../graphQL/Query/Destination/Destinasifilter";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import LinearGradient from "react-native-linear-gradient";
import { StackActions } from "@react-navigation/routers";

export default function ItineraryDestination(props) {
  console.log("props", props);
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

  const {
    data: datafilter,
    loading: loadingfilter,
    error: errorfilter,
  } = useQuery(filterDestination);
  let [token, setToken] = useState(props.route.params.token);
  let [datadayaktif] = useState(props.route.params.datadayaktif);
  let [dataDes] = useState(props.route.params.dataDes);
  let [lat] = useState(props.route.params.lat);
  let [long] = useState(props.route.params.long);
  let [IdItinerary, setId] = useState(props.route.params.IdItinerary);

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
        // type: search.type ? search.type : null,
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

          // Alert.alert('Succes');
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      GetListDestination();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View
      style={{
        flex: 1,
        // alignContent: "center",
        // alignItems: "center",
        justifyContent: "flex-start",
        // paddingVertical: 10,
      }}
    >
      {datafilter && datafilter?.destination_filter ? (
        <FilterItin
          type={datafilter?.destination_filter?.type}
          country={datafilter?.destination_filter?.country}
          facility={datafilter?.destination_filter?.facility}
          sendBack={(e) => setSearch(e)}
          props={props}
          token={token}
          datadayaktif={datadayaktif}
          dataDes={dataDes}
          lat={lat}
          long={long}
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
                      props.navigation.dispatch(
                        StackActions.replace("ItineraryStack", {
                          screen: "ItineraryChooseday",
                          params: {
                            Iditinerary: props.route.params.IdItinerary,
                            Kiriman: item.id,
                            token: token,
                            Position: "destination",
                            datadayaktif: props.route.params.datadayaktif,
                          },
                        })
                      );
                    }}
                    size="small"
                    text={"Add"}
                    // style={{ marginTop: 15 }}
                  />
                </View>
              </View>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      ) : // <FlatList
      //   data={data.destinationList_v2}
      //   contentContainerStyle={{
      //     marginTop: 5,
      //     justifyContent: "space-evenly",
      //     paddingStart: 10,
      //     paddingEnd: 10,
      //     paddingBottom: 120,
      //   }}
      //   horizontal={false}
      //   // data={dataDes}
      //   renderItem={({ item, index }) => (
      //     <Pressable
      //     onPress={() => {
      //           props?.route?.params && props?.route?.params?.iditinerary
      //             ? props.navigation.push("DestinationUnescoDetail", {
      //                 id: item.id,
      //                 name: item.name,
      //                 token: token,
      //                 iditinerary: props.route.params.iditinerary,
      //                 datadayaktif: props.route.params.datadayaktif,
      //               })
      //             : props.navigation.push("DestinationUnescoDetail", {
      //                 id: item.id,
      //                 name: item.name,
      //                 token: token,
      //               });
      //         }}
      //   key={index}
      //   style={{
      //     borderWidth: 1,
      //     borderColor: "#F3F3F3",
      //     borderRadius: 10,
      //     // height: 170,
      //     padding: 10,
      //     marginTop: 10,
      //     width: "100%",
      //     flexDirection: "row",
      //     backgroundColor: "#FFF",
      //     shadowColor: "#FFF",
      //     shadowOffset: {
      //       width: 0,
      //       height: 5,
      //     },
      //     shadowOpacity: 0.1,
      //     shadowRadius: 6.27,

      //     elevation: 6,
      //   }}
      // >
      //   <View style={{ justifyContent: "center" }}>
      //     {/* Image */}
      //     <Image
      //       source={{ uri: item.images.image }}
      //       style={{
      //         width: 130,
      //         height: 160,
      //         borderRadius: 10,
      //       }}
      //     />
      //   </View>

      //   {/* Keterangan */}
      //   {/* rating */}
      //   <View
      //     style={{
      //       flex: 1,
      //       paddingLeft: 10,
      //       height: 160,
      //       justifyContent: "space-between",
      //     }}
      //   >
      //     <View>
      //       <View
      //         style={{
      //           flexDirection: "row",
      //           justifyContent: "space-between",
      //           alignItems: "center",
      //         }}
      //       >
      //         <View
      //           style={{
      //             flexDirection: "row",
      //             backgroundColor: "#F3F3F3",
      //             borderRadius: 3,
      //             justifyContent: "center",
      //             alignItems: "center",
      //             paddingHorizontal: 5,
      //             height: 25,
      //           }}
      //         >
      //           <Star height={15} width={15} />
      //           <Text size="description" type="bold">
      //             {item.rating}
      //           </Text>
      //         </View>
      //         {item.liked === true ? (
      //           <Pressable
      //             onPress={() => _unliked(item.id, index)}
      //             style={{
      //               backgroundColor: "#F3F3F3",
      //               height: 34,
      //               width: 34,
      //               borderRadius: 17,
      //               justifyContent: "center",
      //               alignItems: "center",
      //             }}
      //           >
      //             <Love height={15} width={15} />
      //           </Pressable>
      //         ) : (
      //           <Pressable
      //             onPress={() => _liked(item.id, index)}
      //             style={{
      //               backgroundColor: "#F3F3F3",
      //               height: 34,
      //               width: 34,
      //               borderRadius: 17,
      //               justifyContent: "center",
      //               alignItems: "center",
      //             }}
      //           >
      //             <LikeEmpty height={15} width={15} />
      //           </Pressable>
      //         )}
      //       </View>

      //       {/* Title */}
      //       <Text
      //         size="label"
      //         type="bold"
      //         style={{ marginTop: 2 }}
      //         numberOfLines={2}
      //       >
      //         {item.name}
      //       </Text>

      //       {/* Maps */}
      //       <View
      //         style={{
      //           flexDirection: "row",
      //           marginTop: 5,
      //           alignItems: "center",
      //         }}
      //       >
      //         <PinHijau height={15} width={15} />
      //         <Text
      //           size="description"
      //           type="regular"
      //           style={{ marginLeft: 5 }}
      //           numberOfLines={1}
      //         >
      //           {item.cities.name}
      //         </Text>
      //       </View>
      //     </View>
      //     {/* Great for */}

      //     <View
      //       style={{
      //         flexDirection: "row",
      //         justifyContent: "space-between",
      //         height: 50,
      //         marginTop: 10,
      //         alignItems: "flex-end",
      //       }}
      //     >
      //       <View>
      //         <Text size="description" type="bold">
      //           Great for :
      //         </Text>
      //         <View style={{ flexDirection: "row" }}>
      //           {item.greatfor.length > 0 ? (
      //             item.greatfor.map((item, index) => {
      //               return index < 3 ? (
      //                 <FunIcon
      //                   key={index}
      //                   icon={item.icon}
      //                   fill="#464646"
      //                   height={35}
      //                   width={35}
      //                 />
      //               ) : null;
      //             })
      //           ) : (
      //             <Text>-</Text>
      //           )}
      //         </View>
      //       </View>
      //       <Button
      //        onPress={() => {
      //             props.navigation.dispatch(
      //                   StackActions.replace("ItineraryStack", {
      //                     screen: "ItineraryChooseday",
      //                     params: {
      //                       Iditinerary: props.route.params.IdItinerary,
      //                       Kiriman: item.id,
      //                       token: token,
      //                       Position: "destination",
      //                       datadayaktif: props.route.params.datadayaktif,
      //                     },
      //                   })
      //                 )

      //           }}
      //         size="small"
      //         text={"Add"}
      //         // style={{ marginTop: 15 }}
      //       />
      //     </View>
      //   </View>
      // </Pressable>

      //   )}
      //   // keyExtractor={(item) => item.id}
      //   showsHorizontalScrollIndicator={false}

      //   // extraData={selected}
      // />

      null}
    </View>
  );
}
