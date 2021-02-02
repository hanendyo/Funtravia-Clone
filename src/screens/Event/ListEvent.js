import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image, MapIconGrey, CalenderGrey } from "../../assets/png";
import { Truncate } from "../../component";
import {
  LikeRed,
  LikeEmpty,
  Arrowbackwhite,
  OptionsVertWhite,
} from "../../assets/svg";
import { dateFormatBetween } from "../../component/src/dateformatter";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import ListEventGQL from "../../graphQL/Query/Event/ListEvent2";
import Liked from "../../graphQL/Mutation/Event/likedEvent";
import UnLiked from "../../graphQL/Mutation/unliked";
import CategoryEvent from "../../graphQL/Query/Event/FilterEvent";
import Fillter from "./Fillter/index";
import List from "./List";
import { Text, Button } from "../../component";

const numColumns = 2;

export default function ListEvent(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "List Event",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "List Event",
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

  let [token, setToken] = useState("");
  let [selected] = useState(new Map());
  let [search, setSearch] = useState({ type: null, tag: null, keyword: null });

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

  const [GetListEvent, { data, loading, error }] = useLazyQuery(ListEventGQL, {
    fetchPolicy: "network-only",
    variables: {
      keyword: search.keyword,
      type: search.tag,
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
      price_start: null,
      price_end: null,
      date_from: null,
      date_until: null,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    GetEventCategory,
    { data: dataFillter, loading: loadingcat, error: errorcat },
  ] = useLazyQuery(CategoryEvent);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  const [refreshing, setRefreshing] = React.useState(
    props.route.params && props.route.params.refresh
      ? props.route.params.refresh
      : false
  );

  const _setSearch = (datasearch) => {
    setSearch(datasearch);
    GetListEvent();
  };

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    GetListEvent();
    GetEventCategory();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const eventdetail = (data) => {
    props.navigation.navigate("eventdetail", {
      data: data,
      name: data.name,
    });
  };

  const _liked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationliked({
          variables: {
            event_id: id,
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
            response.data.setEvent_wishlist.code === 200 ||
            response.data.setEvent_wishlist.code === "200"
          ) {
            _Refresh();
          } else {
            throw new Error(response.data.setEvent_wishlist.message);
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
            type: "event",
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
            _Refresh();
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

  const _renderItem = ({ item, index }) => {
    // console.log(item);
    return (
      <View
        style={{
          // zIndex: 22,
          justifyContent: "center",
          // flex: 1,
          // width: (110),
          // height: (310),

          width: Dimensions.get("screen").width * 0.5 - 16,
          height: Dimensions.get("screen").width * 0.7,
          // width: (200),
          margin: 6,
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: 5,
          shadowColor: "gray",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 15,
            left: 10,
            right: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            zIndex: 9999,
          }}
        >
          <View
            style={{
              // bottom: (9),
              height: 21,
              width: 60,
              borderRadius: 11,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "rgba(226, 236, 248, 0.85)",
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Regular",
                color: "#464646",
                textAlign: "center",
                fontSize: 12,
              }}
            >
              {item.category.name}
            </Text>
          </View>
          <View
            style={{
              height: 26,
              width: 26,
              borderRadius: 50,
              alignSelf: "center",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: "rgba(226, 236, 248, 0.85)",
              // zIndex: 999,
            }}
          >
            {item.liked === false ? (
              <TouchableOpacity
                style={{
                  height: 26,
                  width: 26,
                  borderRadius: 50,
                  alignSelf: "center",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",

                  zIndex: 9999,
                }}
                onPress={() => _liked(item.id)}
              >
                <LikeEmpty height={13} width={13} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  height: 26,
                  width: 26,
                  borderRadius: 50,
                  alignSelf: "center",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",

                  zIndex: 9999,
                }}
                onPress={() => _unliked(item.id)}
              >
                <LikeRed height={13} width={13} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => eventdetail(item)}
          style={{
            height: Dimensions.get("window").width * 0.47 - 16,
            // zIndex: 999,
            // width: (100),
            // flex:1,
          }}
        >
          <ImageBackground
            key={item.id}
            // source= {{uri : item.images.toString()}}
            source={
              item.images.length ? { uri: item.images[0].image } : default_image
            }
            style={{
              resizeMode: "cover",
              height: Dimensions.get("window").width * 0.47 - 16,
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5,
              overflow: "hidden",
            }}
          ></ImageBackground>

          {/* <LinearGradient
						colors={['#209FAE', 'rgba(0, 0, 0, 0)']}
						start={{ x: 0.8, y: 1 }}
						end={{ x: 0.2, y: 1 }}
						style={{
							position: 'absolute',
							// top : (150),
							bottom: 11,
							right: 0,
							height: 27,
							// width: (150),
							width: Dimensions.get('screen').width * 0.5 - 16,
							justifyContent: 'center',
							alignContent: 'flex-end',
							alignItems: 'flex-end',
						}}>
						<Text
							style={{
								fontFamily: "Lato-Bold",
								color: 'white',
								textAlign: 'right',
								marginRight: 10,
								fontSize: 17,
							}}>
							{item.price
								? `IDR ${rupiah(item.price)}`
								: `IDR ${rupiah(125000)}`}
						</Text>
					</LinearGradient> */}
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
            height: 230,
            // marginBottom : (5),
            // marginTop	: (5),
            marginVertical: 5,
            marginHorizontal: 10,
            // borderWidth: 1,
            // borderColor: 'grey',
          }}
        >
          <Text
            onPress={() => eventdetail(item)}
            style={{
              fontFamily: "Lato-Bold",
              color: "#464646",
              fontSize: 17,
              // marginBottom: (5),
            }}
          >
            <Truncate text={item.name} length={27} />
          </Text>
          <View
            style={{
              height: "50%",
              flexDirection: "column",
              justifyContent: "space-around",
              // borderWidth: 1,
              // borderColor: 'grey',
            }}
          >
            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                width: "100%",
                marginBottom: 3,
                // borderColor: 'grey',
                // borderWidth: 1,
              }}
            >
              <Image
                customStyle={{
                  width: 15,
                  height: 15,
                  // marginTop: (2),
                  // marginLeft: (3),
                  marginRight: 5,
                }}
                style={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                }}
                source={CalenderGrey}
              />
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  color: "#464646",
                  fontSize: 11,
                  paddingRight: 20,
                  width: "100%",
                }}
              >
                {dateFormatBetween(item.start_date, item.end_date)}
              </Text>
            </View>

            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                width: "100%",
                borderColor: "grey",
                // marginBottom: (5),
              }}
            >
              <Image
                customStyle={{
                  width: 15,
                  height: 15,
                  // marginTop: (2),
                  // marginLeft: (3),
                  marginRight: 5,
                }}
                style={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                }}
                source={MapIconGrey}
              />
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  color: "#464646",
                  fontSize: 11,
                  width: "100%",
                }}
              >
                {item.city.name}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const _renderFilter = ({ item, index }) => {
    if (item.checked == true && item.tampil == true) {
      return (
        <TouchableOpacity
          // onPress={() => onSelectFilter(item.checked, item.id)}
          style={{
            // flex: 1,
            marginRight: 3,
            flexDirection: "row",
            backgroundColor: "#0095A7",
            borderColor: "#0095A7",
            borderRadius: 5,
            height: 27,
            minWidth: 80,
            paddingHorizontal: 8,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Lato-Regular",
              color: "white",
              marginVertical: 4,
              fontSize: 13,
              alignSelf: "center",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    } else if (item.tampil == true) {
      return (
        <TouchableOpacity
          // onPress={() => onSelectFilter(item.checked, item.id)}
          style={{
            // flex: 1,
            marginRight: 3,
            flexDirection: "row",
            backgroundColor: "white",
            borderColor: "#E7E7E7",
            borderRadius: 5,
            height: 27,
            minWidth: 80,
            borderWidth: 1,
            // paddingRight: (3),
            // paddingBottom: (3),
            paddingHorizontal: 8,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Lato-Regular",
              color: "#0095A7",
              marginVertical: 4,
              fontSize: 13,
              alignSelf: "center",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await _Refresh();
    // console.log(tkn);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        // marginBottom: (7),
      }}
    >
      {/* ======================= Bagian tengah (list) ================================ */}
      {dataFillter && dataFillter.event_filter ? (
        <Fillter
          type={dataFillter.event_filter.type}
          country={dataFillter.event_filter.country}
          sendBack={(e) => _setSearch(e)}
          props={props}
        />
      ) : null}
      {data && data.event_list_v2.length ? (
        <List
          props={props}
          datanya={data.event_list_v2}
          Refresh={(e) => _Refresh()}
          refreshing={refreshing}
          token={token}
        />
      ) : null}
    </View>
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
