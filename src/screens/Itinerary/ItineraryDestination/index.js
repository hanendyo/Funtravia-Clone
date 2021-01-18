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
} from "react-native";
import { CustomImage, FunIcon } from "../../../component";
import {
  Ticket,
  star_yellow,
  MapIconWhite,
  comedi_putih,
  default_image,
} from "../../../assets/png";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  LikeRed,
  LikeEmpty,
  Arrowbackwhite,
  OptionsVertWhite,
  Star,
  PinHijau,
  LikeEmptynew,
} from "../../../assets/svg";
import FilterItin from "./FillterItin";
import Listdestination from "../../../graphQL/Query/Destination/ListDestination";
import filterDestination from "../../../graphQL/Query/Destination/filterDestination";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import LinearGradient from "react-native-linear-gradient";

export default function ItineraryDestination(props) {
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
  const { t, i18n } = useTranslation();

  const {
    data: datafilter,
    loading: loadingfilter,
    error: errorfilter,
  } = useQuery(filterDestination);
  let [token, setToken] = useState(props.route.params.token);
  let [datadayaktif, setdatadayaktif] = useState(
    props.route.params.datadayaktif
  );
  let [search, setSearch] = useState({ type: null, tag: null, keyword: null });
  let [IdItinerary, setId] = useState(props.route.params.IdItinerary);

  const [GetListDestination, { data, loading, error }] = useLazyQuery(
    Listdestination,
    {
      fetchPolicy: "network-only",
      variables: { keyword: search.keyword, type: search.tag },
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
  // console.log(token);-

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

        // console.log(response);
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
                  width: 25,
                  borderRadius: 19,
                  height: 25,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
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
                  width: 25,
                  borderRadius: 17.5,
                  height: 25,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
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
                props.navigation.push("ItineraryChooseday", {
                  Iditinerary: IdItinerary,
                  Kiriman: data.id,
                  token: token,
                  Position: "destination",
                  datadayaktif: datadayaktif,
                });
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      GetListDestination();
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
            // paddingVertical: 10,
          }}
        >
          {datafilter && datafilter.destination_type.length ? (
            <FilterItin
              style={{}}
              fillter={
                datafilter && datafilter.destination_type.length
                  ? datafilter.destination_type
                  : []
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
            {data && data.destinationList.length ? (
              <FlatList
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
                data={data.destinationList}
                renderItem={({ item }) => <RenderDes data={item} />}
                key={""}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
