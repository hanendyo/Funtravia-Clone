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
} from "../../assets/svg";
import FilterItin from "./FillterDestination";
import Listdestination from "../../graphQL/Query/Destination/ListDestinationV2";
import filterDestination from "./../../graphQL/Query/Destination/filterDestination";
import Liked from "../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { FunIcon } from "../../component";

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

  console.log("testing", {
    keyword: search.keyword ? search.keyword : null,
    type: search.type ? search.type : null,
    countries: search.countries ? search.countries : null,
    cities: search.cities ? search.cities : null,
    goodfor: search.goodfor ? search.goodfor : null,
    facilities: search.facilities ? search.facilities : null,
  });

  const [GetListDestination, { data, loading, error }] = useLazyQuery(
    Listdestination,
    {
      fetchPolicy: "network-only",
      variables: {
        keyword: search.keyword ? search.keyword : null,
        type: search.type ? search.type : null,
        countries: search.countries ? search.countries : null,
        cities: search.cities ? search.cities : null,
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

  const RenderDes = ({ data }) => {
    return (
      <View
        style={{
          // height: 280,
          borderWidth: 1,
          borderColor: "#D8D8D8",
          marginBottom: 10,
          alignContent: "center",
          alignItems: "center",
          width: Dimensions.get("screen").width - 30,
          borderRadius: 5,
          shadowColor: "#646464",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 5,
          shadowRadius: 3,
          elevation: 3,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
          }}
          onPress={() => {
            props.navigation.navigate("detailStack", {
              id: data.id,
              name: data.name,
            });
          }}
        >
          <Image
            // source={bali1}
            source={{ uri: data.images.image }}
            style={{
              height: 145,
              alignSelf: "center",
              width: "100%",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              marginBottom: 5,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View
          style={{ paddingHorizontal: 15, width: "100%", marginBottom: 15 }}
        >
          <View
            style={{
              flexDirection: "row",
              // alignContent: 'center',
              justifyContent: "space-between",
            }}
          >
            <Text type="bold" size="label" style={{ width: "80%" }}>
              {data.name}
            </Text>

            {data.liked === false ? (
              <Button
                onPress={() => _liked(data.id)}
                type="circle"
                style={{
                  // position: 'absolute',
                  // bottom: 10,
                  // right: 0,
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
                onPress={() => _unliked(data.id)}
                type="circle"
                style={{
                  // position: 'absolute',
                  // bottom: 10,
                  // right: 17,
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
              marginTop: 5,
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
              <PinHijau width={15} height={15} />
              <Text
                type="regular"
                size="description"
                style={{ color: "#464646", marginLeft: 5 }}
              >
                {data.cities.name && data.countries.name
                  ? `${data.cities.name}`
                  : ""}
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
              <View style={{ marginLeft: 5 }}>
                <Text
                  size="description"
                  type="bold"
                  style={{ color: "#000000" }}
                >
                  {data.rating !== null ? `${data.rating}` : 5}
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
              {/* <TicketAvailable
								height={15}
								width={15}
								style={{
									alignSelf: 'center',
									marginLeft: 15,
									marginRight: 5,
								}}
							/> */}
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
              {/* <Text
								size='description'
								style={{ textAlign: 'center', textAlignVertical: 'center' }}>
								{t('availableTicket')}
							</Text> */}
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              // width: '100%',
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                // position: 'absolute',
                // bottom: normalize(0),
                // left: normalize(15),
                // paddingTop: 10,
                // marginRight: 150,
                justifyContent: "flex-start",
                alignContent: "flex-start",
                alignItems: "flex-start",
                // alignSelf: 'flex-end',
                // flexDirection: 'row',
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
                  // backgroundColor: 'cyan',
                  // marginLeft: -7,
                }}
              >
                {data.greatfor.map((item, index) => {
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
            <Button
              text={t("addToPlan")}
              style={{}}
              color="primary"
              onPress={() => {
                props.navigation.navigate("ItineraryPlaning", {
                  idkiriman: data.id,
                  Position: "destination",
                });
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    await GetFillter();

    await GetListDestination();
    // }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {datafilter && datafilter.destination_type.length ? (
            <FilterItin
              fillter={
                datafilter && datafilter.destination_type.length
                  ? datafilter.destination_type
                  : []
              }
              filterawal={
                props.route.params !== undefined
                  ? props.route.params.idtype
                  : null
              }
              idcity={
                props.route.params !== undefined
                  ? props.route.params.idcity
                  : null
              }
              sendBack={(e) => setSearch(e)}
            />
          ) : null}

          <View
            style={
              {
                // paddingVertical: 10,
              }
            }
          >
            {data && data.destinationList_v2.length ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{
                  paddingTop: 5,
                }}
                contentContainerStyle={{
                  // marginTop: 5,
                  justifyContent: "space-evenly",
                  paddingStart: 10,
                  paddingEnd: 10,
                  // paddingBottom: 250,
                }}
                horizontal={false}
                data={data.destinationList_v2}
                renderItem={({ item }) => <RenderDes data={item} />}
                key={""}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
              />
            ) : null}
          </View>
        </View>
      </View>
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
