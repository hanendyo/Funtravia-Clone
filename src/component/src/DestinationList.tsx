import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
//data_bg nanti itu Profile Picture, data_pic itu avatar
import { MapIconGreen } from "../../assets/png";
import { Star, LikeEmptynew, LikeRed, TicketAvailable } from "../../assets/svg";
import { Container, Header, Tab, Tabs, ScrollableTab } from "native-base";

import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { Source } from "graphql";
import { useTranslation } from "react-i18next";
// import SearchDestinationQuery from '../../../graphQL/Query/Search/SearchDestination';
import { FunIcon, Text, Button } from "../../component";
import Liked from "../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../graphQL/Mutation/unliked";

export default function ListRenderDestination({
  props,
  route,
  datanya,
  token,
  itin,
}) {
  const { t, i18n } = useTranslation();
  // let [datadayaktif, setdatadayaktif] = useState(
  //   route.params && route.params.datadayaktif ? route.params.datadayaktif : null
  // );
  // let [IdItinerary, setId] = useState(
  //   route.params && route.params.IdItinerary ? route.params.IdItinerary : null
  // );
  // let [token, setToken] = useState('');
  let [selected] = useState(new Map());
  let [dataDestination, setDataDestination] = useState(datanya);
  // console.log('DATANYA: ', datanya);
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

  const addToPlanNo = (id) => {
    props.navigation.navigate("ItineraryPlaning", {
      idkiriman: id,
      token: token,
      dataItin: dataDestination,
      Position: "destination",
    });
  };
  // console.log('TOKEN: ', token);

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

  const straightToItin = (data) => {
    props.navigation.push("ItineraryChooseday", {
      Iditinerary: IdItinerary,
      Kiriman: data.id,
      token: token,
      Position: "destination",
      datadayaktif: datadayaktif,
    });
  };
  // console.log(data.name);

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

        // console.log(response);
        if (response.data) {
          if (
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            // _Refresh();
            var tempData = [...dataDestination];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = true;
            setDataDestination(tempData);
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
        // console.log(' ' + error);
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

        // console.log(response.data.unset_wishlist.code);
        if (response.data) {
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            // _Refresh();
            var tempData = [...dataDestination];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = false;
            setDataDestination(tempData);
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
        // console.log(' ' + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  let DestinationCards = ({ item, index }) => {
    return (
      <View
        style={{
          height: 280,
          borderWidth: 1,
          borderColor: "#D8D8D8",
          marginBottom: 5,
          alignContent: "center",
          alignItems: "center",
          width: Dimensions.get("window").width * 0.95,
          borderRadius: 5,
        }}
      >
        <TouchableOpacity
          style={{
            alignContent: "center",
            // marginBottom: normalize(5),
            // marginLeft: 5,
          }}
          onPress={() => eventdetail(item)}
        >
          <Image
            // source={bali1}
            source={{ uri: item.images.image }}
            style={{
              height: 145,
              alignSelf: "center",
              width: Dimensions.get("window").width * 0.95,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              marginBottom: 5,
            }}
            resizeMode="cover"
          />
          <View style={{ marginLeft: 15 }}>
            <View
              style={{
                flexDirection: "row",
                // alignContent: 'center',
                // justifyContent: 'space-around',
              }}
            >
              <Text type="bold" size="title">
                {item.name}
              </Text>

              {item.liked === false ? (
                <Button
                  onPress={() => _liked(item.id)}
                  type="circle"
                  style={{
                    position: "absolute",
                    // bottom: 10,
                    right: 17,
                    width: 25,
                    borderRadius: 19,
                    // borderWidth: 1,
                    height: 25,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    // flexDirection: 'row',
                    backgroundColor: "#EEEEEE",
                    zIndex: 999,
                    top: 3,
                  }}
                >
                  <LikeEmptynew width={15} height={15} />
                </Button>
              ) : (
                <Button
                  onPress={() => _unliked(item.id)}
                  type="circle"
                  style={{
                    position: "absolute",
                    // bottom: 10,
                    right: 17,
                    width: 25,
                    borderRadius: 17.5,
                    // borderWidth: 1,
                    height: 25,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    // flexDirection: 'row',
                    backgroundColor: "#EEEEEE",
                    zIndex: 999,
                    top: 3,
                  }}
                >
                  <LikeRed width={15} height={15} />
                </Button>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                // justifyContent: 'space-between',
                marginTop: 7,
                alignContent: "flex-start",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "flex-start",
                  // backgroundColor: 'green',
                }}
              >
                <Image
                  source={MapIconGreen}
                  style={{
                    height: 13,
                    width: 13,
                    resizeMode: "contain",
                    marginLeft: -3,
                  }}
                />
                <Text type="regular" size="small" style={{ color: "#464646" }}>
                  {item.cities.name && item.countries.name
                    ? `${item.cities.name}`
                    : "Somewhere, Over The Rainbow"}
                </Text>
              </View>
              <View
                style={{
                  // position: 'absolute',
                  // right: 15,
                  // top: 15,
                  marginLeft: 15,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Star height={15} width={15} />
                <View style={{ marginLeft: 3 }}>
                  <Text size="small" type="bold" style={{ color: "#000000" }}>
                    {item.rating !== null ? `${item.rating}` : 5}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <TicketAvailable
                  height={15}
                  width={15}
                  style={{
                    alignSelf: "center",
                    marginLeft: 15,
                    marginRight: 5,
                  }}
                />
                {/* <Image
									source={Ticket}
									style={{
										height: 15,
										width: 15,
										marginLeft: 15,
										marginRight: 5,
										alignSelf: 'center',
									}}
									resizeMode='contain'
								/> */}
                <Text
                  size="small"
                  style={{ textAlign: "center", textAlignVertical: "center" }}
                >
                  {t("availableTicket")}
                </Text>
              </View>
            </View>
            {/* belum implementasi dari graphql karena masih null dari db buat iconnya*/}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <View
                style={{
                  // position: 'absolute',
                  // bottom: normalize(0),
                  // left: normalize(15),
                  paddingTop: 10,
                  marginRight: 150,
                  justifyContent: "flex-start",
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                  // alignSelf: 'flex-end',
                  // flexDirection: 'row',
                }}
              >
                <Text
                  size="small"
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
                    // backgroundColor: 'cyan',
                    marginLeft: -7,
                  }}
                >
                  <FunIcon
                    icon="i-bowling"
                    fill="#464646"
                    height={42}
                    width={42}
                    style={{}}
                  />
                  <FunIcon
                    icon="i-catering_service"
                    fill="#464646"
                    height={42}
                    width={42}
                  />
                </View>
              </View>

              <Button
                text={t("addToPlan")}
                style={{
                  // width: Dimensions.get('screen').width * 0.3,
                  // height: normalize(39),
                  alignSelf: "center",
                  // borderColor: '#B8E0E5',
                  // backgroundColor: '#209FAE',

                  position: "absolute",
                  right: 20,
                  bottom: 5,
                }}
                color="primary"
                onPress={() => addToPlanNo(item.id)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  let DestinationCardsItin = ({ item, index }) => {
    return (
      <View
        style={{
          height: 280,
          borderWidth: 1,
          borderColor: "#D8D8D8",
          marginBottom: 5,
          alignContent: "center",
          alignItems: "center",
          width: Dimensions.get("window").width * 0.95,
          borderRadius: 5,
        }}
      >
        <TouchableOpacity
          style={{
            alignContent: "center",
            // marginBottom: normalize(5),
            // marginLeft: 5,
          }}
          onPress={() => eventdetail(item)}
        >
          <Image
            // source={bali1}
            source={{ uri: item.images.image }}
            style={{
              height: 145,
              alignSelf: "center",
              width: Dimensions.get("window").width * 0.95,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              marginBottom: 5,
            }}
            resizeMode="cover"
          />
          <View style={{ marginLeft: 15 }}>
            <View
              style={{
                flexDirection: "row",
                // alignContent: 'center',
                // justifyContent: 'space-around',
              }}
            >
              <Text type="bold" size="title">
                {item.name}
              </Text>

              {item.liked === false ? (
                <Button
                  onPress={() => _liked(item.id)}
                  type="circle"
                  style={{
                    position: "absolute",
                    // bottom: 10,
                    right: 17,
                    width: 25,
                    borderRadius: 19,
                    // borderWidth: 1,
                    height: 25,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    // flexDirection: 'row',
                    backgroundColor: "#EEEEEE",
                    zIndex: 999,
                    top: 3,
                  }}
                >
                  <LikeEmptynew width={15} height={15} />
                </Button>
              ) : (
                <Button
                  onPress={() => _unliked(item.id)}
                  type="circle"
                  style={{
                    position: "absolute",
                    // bottom: 10,
                    right: 17,
                    width: 25,
                    borderRadius: 17.5,
                    // borderWidth: 1,
                    height: 25,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    // flexDirection: 'row',
                    backgroundColor: "#EEEEEE",
                    zIndex: 999,
                    top: 3,
                  }}
                >
                  <LikeRed width={15} height={15} />
                </Button>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                // justifyContent: 'space-between',
                marginTop: 7,
                alignContent: "flex-start",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "flex-start",
                  // backgroundColor: 'green',
                }}
              >
                <Image
                  source={MapIconGreen}
                  style={{
                    height: 13,
                    width: 13,
                    resizeMode: "contain",
                    marginLeft: -3,
                  }}
                />
                <Text type="regular" size="small" style={{ color: "#464646" }}>
                  {item.cities.name && item.countries.name
                    ? `${item.cities.name}`
                    : "Somewhere, Over The Rainbow"}
                </Text>
              </View>
              <View
                style={{
                  // position: 'absolute',
                  // right: 15,
                  // top: 15,
                  marginLeft: 15,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Star height={15} width={15} />
                <View style={{ marginLeft: 3 }}>
                  <Text size="small" type="bold" style={{ color: "#000000" }}>
                    {item.rating !== null ? `${item.rating}` : 5}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <TicketAvailable
                  height={15}
                  width={15}
                  style={{
                    alignSelf: "center",
                    marginLeft: 15,
                    marginRight: 5,
                  }}
                />
                {/* <Image
									source={Ticket}
									style={{
										height: 15,
										width: 15,
										marginLeft: 15,
										marginRight: 5,
										alignSelf: 'center',
									}}
									resizeMode='contain'
								/> */}
                <Text
                  size="small"
                  style={{ textAlign: "center", textAlignVertical: "center" }}
                >
                  {t("availableTicket")}
                </Text>
              </View>
            </View>
            {/* belum implementasi dari graphql karena masih null dari db buat iconnya*/}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <View
                style={{
                  // position: 'absolute',
                  // bottom: normalize(0),
                  // left: normalize(15),
                  paddingTop: 10,
                  marginRight: 150,
                  justifyContent: "flex-start",
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                  // alignSelf: 'flex-end',
                  // flexDirection: 'row',
                }}
              >
                <Text
                  size="small"
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
                    // backgroundColor: 'cyan',
                    marginLeft: -7,
                  }}
                >
                  <FunIcon
                    icon="i-bowling"
                    fill="#464646"
                    height={40}
                    width={40}
                    style={{}}
                  />
                  <FunIcon
                    icon="i-catering_service"
                    fill="#464646"
                    height={40}
                    width={40}
                  />
                </View>
              </View>

              <Button
                text={t("addToPlan")}
                style={{
                  // width: Dimensions.get('screen').width * 0.3,
                  // height: normalize(39),
                  alignSelf: "center",
                  // borderColor: '#B8E0E5',
                  // backgroundColor: '#209FAE',

                  position: "absolute",
                  right: 20,
                  bottom: 5,
                }}
                color="primary"
                onPress={() => straightToItin(item)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return itin ? (
    <ScrollView
      contentContainerStyle={{ justifyContent: "space-evenly", marginTop: 10 }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      // stickyHeaderIndices={[0]}
    >
      <View style={{ alignSelf: "center" }}>
        <FlatList
          data={dataDestination}
          contentContainerStyle={{
            flexDirection: "column",
            borderRadius: 50,
          }}
          renderItem={DestinationCardsItin}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          extraData={selected}
        />
      </View>
    </ScrollView>
  ) : (
    <ScrollView
      contentContainerStyle={{ justifyContent: "space-evenly", marginTop: 10 }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      // stickyHeaderIndices={[0]}
    >
      <View style={{ alignSelf: "center" }}>
        <FlatList
          data={dataDestination}
          contentContainerStyle={{
            flexDirection: "column",
            borderRadius: 50,
          }}
          renderItem={DestinationCards}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          extraData={selected}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },

  languageButton: {
    height: 30,
    width: 100,
    marginRight: 5,
    backgroundColor: "#F1F1F1",
    borderColor: "#F1F1F1",
    borderWidth: 1,
  },
  langButtonFont: {
    fontSize: 12,
  },
});
