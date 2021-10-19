import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { CustomImage } from "../../component";
import {
  dateFormat,
  dateFormatBetween,
} from "../../component/src/dateformatter";
import {
  MapSVG,
  Star,
  LikeRed,
  LikeEmpty,
  PinHijau,
  Calendargrey,
  Kalenderhijau,
} from "../../assets/svg";
import { Truncate } from "../../component";
import { MapIconGrey, MapIconGreen, default_image } from "../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import { useLazyQuery } from "@apollo/client";
import UnLiked from "../../graphQL/Mutation/unliked";
import { Text, Button } from "../../component";
import Events from "../../graphQL/Query/Wishlist/Event";
import { useTranslation } from "react-i18next";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const numColumns = 2;

export default function Event({
  props,
  dataEvent,
  token,
  Textcari,
  Refresh,
  refreshing,
}) {
  const { t, i18n } = useTranslation();
  let [selected] = useState(new Map());
  let [dataEv, setEv] = useState([]);
  const eventdetail = (data) => {
    props.route.params && props.route.params.iditinerary
      ? props.navigation.navigate("eventdetail", {
          data: data,
          name: data.name,
          token: token,
          iditinerary: props.route.params.iditinerary,
          datadayaktif: props.route.params.datadayaktif,
        })
      : props.navigation.navigate("eventdetail", {
          data: data,
          name: data.name,
          token: token,
        });
  };

  const [getEvent, { loading, data: dataEven, error }] = useLazyQuery(Events, {
    fetchPolicy: "network-only",
    variables: {
      keyword: Textcari !== null ? Textcari : "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setEv(dataEven?.listevent_wishlist);
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

        if (response.data) {
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            // _Refresh();
            var tempData = [...dataEv];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData.splice(index, 1);
            setEv(tempData);
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
    getEvent();
  }, []);

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         // position: 'absolute',
  //         // bottom:0,
  //         flex: 1,
  //         width: Dimensions.get("screen").width,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         marginHorizontal: 15,
  //       }}
  //     >
  //       <ActivityIndicator animating={loading} size="large" color="#209fae" />
  //     </View>
  //     // <SkeletonPlaceholder>
  //     //   <View>
  //     //     <View style={{ flexDirection: "row" }}>
  //     //       <View
  //     //         style={{
  //     //           width: Dimensions.get("screen").width * 0.5 - 16,
  //     //           height: Dimensions.get("window").width * 0.7,
  //     //           borderWidth: 1,
  //     //           borderColor: "#dedede",
  //     //           borderRadius: 5,
  //     //           marginLeft: 10,
  //     //           marginTop: 10,
  //     //         }}
  //     //       >
  //     //         <View
  //     //           style={{
  //     //             width: "100%",
  //     //             height: 180,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 10,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "90%",
  //     //             height: 15,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 15,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "70%",
  //     //             height: 10,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 10,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "70%",
  //     //             height: 10,
  //     //           }}
  //     //         ></View>
  //     //       </View>
  //     //       <View
  //     //         style={{
  //     //           width: Dimensions.get("screen").width * 0.5 - 16,
  //     //           height: Dimensions.get("window").width * 0.7,
  //     //           borderWidth: 1,
  //     //           borderColor: "#dedede",
  //     //           borderRadius: 5,
  //     //           marginLeft: 10,
  //     //           marginTop: 10,
  //     //           marginRight: 10,
  //     //         }}
  //     //       >
  //     //         <View
  //     //           style={{
  //     //             width: "100%",
  //     //             height: 180,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 10,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "90%",
  //     //             height: 15,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 15,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "70%",
  //     //             height: 10,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 10,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "70%",
  //     //             height: 10,
  //     //           }}
  //     //         ></View>
  //     //       </View>
  //     //     </View>
  //     //     <View style={{ flexDirection: "row" }}>
  //     //       <View
  //     //         style={{
  //     //           width: Dimensions.get("screen").width * 0.5 - 16,
  //     //           height: Dimensions.get("window").width * 0.7,
  //     //           borderWidth: 1,
  //     //           borderColor: "#dedede",
  //     //           borderRadius: 5,
  //     //           marginLeft: 10,
  //     //           marginTop: 10,
  //     //         }}
  //     //       >
  //     //         <View
  //     //           style={{
  //     //             width: "100%",
  //     //             height: 180,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 10,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "90%",
  //     //             height: 15,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 15,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "70%",
  //     //             height: 10,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 10,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "70%",
  //     //             height: 10,
  //     //           }}
  //     //         ></View>
  //     //       </View>
  //     //       <View
  //     //         style={{
  //     //           width: Dimensions.get("screen").width * 0.5 - 16,
  //     //           height: Dimensions.get("window").width * 0.7,
  //     //           borderWidth: 1,
  //     //           borderColor: "#dedede",
  //     //           borderRadius: 5,
  //     //           marginLeft: 10,
  //     //           marginTop: 10,
  //     //           marginRight: 10,
  //     //         }}
  //     //       >
  //     //         <View
  //     //           style={{
  //     //             width: "100%",
  //     //             height: 180,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 10,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "90%",
  //     //             height: 15,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 15,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "70%",
  //     //             height: 10,
  //     //           }}
  //     //         ></View>
  //     //         <View
  //     //           style={{
  //     //             marginTop: 10,
  //     //             marginLeft: 5,
  //     //             marginRight: 5,
  //     //             justifyContent: "center",
  //     //             width: "70%",
  //     //             height: 10,
  //     //           }}
  //     //         ></View>
  //     //       </View>
  //     //     </View>
  //     //   </View>
  //     // </SkeletonPlaceholder>
  //   );
  // }

  const _FormatData = (dataCart, numColumns) => {
    const totalRows = Math.floor(dataCart.length / numColumns);
    let totallastRow = dataCart.length - totalRows * numColumns;

    while (totallastRow !== 0 && totallastRow !== numColumns) {
      dataCart.push({ id: "blank", empty: true });
      totallastRow++;
    }
    return dataCart;
  };

  const _renderItem = ({ item, index }) => {
    if (item.empty) {
      return (
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            width: Dimensions.get("window").width * 0.5 - 16,
            height: Dimensions.get("window").width * 0.7,
          }}
        ></View>
      );
    }

    return (
      <View
        style={{
          justifyContent: "center",

          width: Dimensions.get("screen").width * 0.5 - 16,
          height: Dimensions.get("screen").width * 0.7,
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
              minWidth: 60,
              borderRadius: 11,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "rgba(226, 236, 248, 0.85)",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="small"
              style={{
                textAlign: "center",
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
          }}
        >
          <ImageBackground
            key={item.id}
            source={
              item.images.length ? { uri: item.images[0].image } : default_image
            }
            style={[styles.ImageView]}
            imageStyle={[styles.Image]}
          ></ImageBackground>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
            height: 230,
            marginVertical: 5,
            marginHorizontal: 10,
          }}
        >
          <Text
            onPress={() => eventdetail(item)}
            size="label"
            type="bold"
            style={{}}
          >
            <Truncate text={item.name} length={27} />
          </Text>
          <View
            style={{
              height: "50%",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                width: "100%",
                borderColor: "grey",
              }}
            >
              <CustomImage
                customStyle={{
                  width: 15,
                  height: 15,
                  marginRight: 5,
                }}
                customImageStyle={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                }}
                source={MapIconGreen}
              />
              <Text
                size="small"
                style={{
                  width: "100%",
                }}
              >
                {item.city.name}
              </Text>
            </View>
            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                width: "100%",
                marginBottom: 3,
              }}
            >
              <CustomImage
                customStyle={{
                  width: 15,
                  height: 15,
                  marginRight: 5,
                }}
                customImageStyle={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                }}
                source={CalenderGrey}
              />
              <Text
                size="small"
                style={{
                  paddingRight: 20,
                  width: "100%",
                }}
              >
                {dateFormatBetween(item.start_date, item.end_date)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      {loading ? (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 15,
          }}
        >
          <ActivityIndicator animating={loading} size="large" color="#209fae" />
        </View>
      ) : (
        <View>
          {dataEv.length !== 0 ? (
            <FlatList
              contentContainerStyle={{
                marginTop: 15,
                justifyContent: "space-evenly",
                paddingHorizontal: 15,
                paddingBottom: 20,
              }}
              horizontal={false}
              data={dataEv}
              // renderItem={_renderItem}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => eventdetail(item)}
                  style={{
                    // justifyContent: "center",
                    width: (Dimensions.get("screen").width - 45) / 2,
                    height: 280,
                    flexDirection: "column",
                    backgroundColor: "#FFF",
                    shadowColor: "#FFF",
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 6.27,
                    elevation: 6,
                    marginRight: 15,
                    borderRadius: 5,
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
                        minWidth: 60,
                        borderRadius: 11,
                        alignSelf: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(226, 236, 248, 0.85)",
                        // paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        size="description"
                        style={{
                          textAlign: "center",
                          marginBottom: 2,
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
                    }}
                  >
                    <ImageBackground
                      key={item.id}
                      source={
                        item.images.length
                          ? { uri: item.images[0].image }
                          : default_image
                      }
                      style={[styles.ImageView]}
                      imageStyle={[styles.Image]}
                    ></ImageBackground>
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "space-around",
                      height: 230,
                      marginVertical: 5,
                      marginHorizontal: 10,
                    }}
                  >
                    <Text
                      onPress={() => eventdetail(item)}
                      size="label"
                      type="bold"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        height: "50%",
                        flexDirection: "column",
                        justifyContent: "space-around",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          marginBottom: 3,
                        }}
                      >
                        <Kalenderhijau width={15} height={15} />
                        <Text
                          size="description"
                          style={{
                            paddingRight: 20,
                            width: "100%",
                            marginLeft: 5,
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
                        }}
                      >
                        <PinHijau width={15} height={15} />
                        <Text
                          size="description"
                          style={{
                            width: "100%",
                            marginLeft: 5,
                          }}
                        >
                          {item.city.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}
              numColumns={numColumns}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              extraData={selected}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => Refresh()}
                />
              }
            />
          ) : (
            <View
              style={{
                flex: 1,
                width: Dimensions.get("screen").width,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 15,
              }}
            >
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="large"
                  color="#209fae"
                />
              ) : (
                <Text>{t("noData")}</Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    height: Dimensions.get("window").width * 0.47 - 16,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
    backgroundColor: "rgba(20,20,20,0.4)",
  },
  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
  },
});
