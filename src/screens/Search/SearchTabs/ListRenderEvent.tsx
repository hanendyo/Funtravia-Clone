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
import AsyncStorage from "@react-native-async-storage/async-storage";

//data_bg nanti itu Profile Picture, data_pic itu avatar
import { MapIconBlue, CalenderGrey } from "../../../assets/png";
import { LikeRed, LikeEmpty } from "../../../assets/svg";

import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";

import { useTranslation } from "react-i18next";
import { Text, Button, FunIcon } from "../../../component";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
// import { NavigationEvents } from "react-navigation";
import Fillter from "../Components/Fillter";
// import List from "../Event/List";
import CategoryEvent from "../../../graphQL/Query/Event/CategoryEvent";

export default function ListRenderEvent({ props, datanya }) {
  let [token, setToken] = useState("");
  let [selected] = useState(new Map());
  let [dataEvent, setDataEvent] = useState(datanya);
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
    loadAsync();
    // GetListEvent();
  }, []);
  const [refreshing, setRefreshing] = React.useState(
    props.route.params.refresh ? props.route.params.refresh : false
  );

  const _setSearch = (datasearch) => {
    setSearch(datasearch);
    // GetListEvent();
  };

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    // GetListEvent();
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
            style={[
              styles.ImageView,
              // {
              // 	width: (90),
              // 	height: (90),
              // },
            ]}
            imageStyle={[
              styles.Image,
              // {
              // 	width: (90),
              // 	height: (90),
              // },
            ]}
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
                style={{
                  width: 15,
                  height: 15,
                  // marginTop: (2),
                  // marginLeft: (3),
                  marginRight: 5,
                }}
                imageStyle={{
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
                style={{
                  width: 15,
                  height: 15,
                  // marginTop: (2),
                  // marginLeft: (3),
                  marginRight: 5,
                }}
                imageStyle={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                }}
                source={MapIconBlue}
              />
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#464646",

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
  console.log(dataEvent);
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
    setToken(tkn);
    // console.log(tkn);
  };

  // console.log(dataFillter);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        // marginBottom: (7),
      }}
    >
      {/* <NavigationEvents onDidFocus={() => _Refresh()} /> */}

      {/* ======================= Bagian tengah (list) ================================ */}

      {dataEvent && dataEvent.length > 1 ? (
        // <List
        //   props={props}
        //   datanya={dataEvent}
        //   Refresh={(e) => _Refresh()}
        //   refreshing={refreshing}
        //   token={token}
        // />
        <View></View>
      ) : dataEvent && dataEvent.length == 1 ? (
        <View style={{ position: "absolute", right: 0 }}>
          {/* <List
            props={props}
            datanya={dataEvent}
            Refresh={(e) => _Refresh()}
            refreshing={refreshing}
            token={token}
          /> */}
        </View>
      ) : null}
    </View>
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
