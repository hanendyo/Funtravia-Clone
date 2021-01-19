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
} from "react-native";
import { CustomImage } from "../../component";
import {
  dateFormat,
  dateFormatBetween,
} from "../../component/src/dateformatter";
import { MapSVG, Star, LikeRed, LikeEmpty } from "../../assets/svg";
import { Truncate } from "../../component";
import { MapIconGrey, CalenderGrey, default_image } from "../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import UnLiked from "../../graphQL/Mutation/unliked";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
const numColumns = 2;

export default function Event({
  props,
  dataEvent,
  token,
  Refresh,
  refreshing,
}) {
  const { t, i18n } = useTranslation();
  let [selected] = useState(new Map());
  // let [token, setToken] = useState('');
  let [dataEv, setEv] = useState(dataEvent);
  const eventdetail = (data) => {
    props.navigation.navigate("eventdetail", {
      data: data,
      name: data.name,
      token: token,
    });
  };

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

        // console.log(response.data.unset_wishlist.code);
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

  useEffect(() => {}, []);

  // console.log(dataEv);

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
          zIndex: 1,
          justifyContent: "center",
          width: Dimensions.get("screen").width * 0.5 - 16,
          height: Dimensions.get("screen").width * 0.7,
          margin: 5,
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
        <TouchableOpacity
          onPress={() => eventdetail(item)}
          style={{
            height: Dimensions.get("window").width * 0.47 - 16,
            zIndex: 999,
          }}
        >
          <ImageBackground
            key={item.id}
            source={
              item.images && item.images.length
                ? { uri: item.images[0].image }
                : default_image
            }
            style={[styles.ImageView]}
            imageStyle={[styles.Image]}
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
							type='bold'
							size='label'
							style={{
								color: 'white',
								textAlign: 'right',
								marginRight: 10,
							}}>
							{item.ticket && item.ticket.length > 0
								? `IDR ${rupiah(item.ticket[0].price)}`
								: '-'}
						</Text>
					</LinearGradient> */}
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            top: 15,
            left: 10,
            right: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            zIndex: 999,
          }}
        >
          <View
            style={{
              // bottom: (9),
              height: 21,
              minWidth: 60,
              paddingHorizontal: 10,
              borderRadius: 11,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "rgba(226, 236, 248, 0.85)",
            }}
          >
            <Text
              size="small"
              style={{
                textAlign: "center",
              }}
            >
              {item.category && item.category.name ? item.category.name : "-"}
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
              zIndex: 999,
            }}
          >
            <TouchableOpacity
              style={{
                height: 26,
                width: 26,
                borderRadius: 50,
                alignSelf: "center",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                zIndex: 999,
              }}
              onPress={() => _unliked(item.id)}
            >
              {item.liked == true ? (
                <LikeRed height={15} width={15} />
              ) : (
                <LikeEmpty height={15} width={15} />
              )}
            </TouchableOpacity>
          </View>
        </View>

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
          <Text size="label" type="bold" style={{}}>
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
              <CustomImage
                customStyle={{
                  width: 15,
                  height: 15,
                  // marginTop: (2),
                  // marginLeft: (3),
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
                {item.start_date == item.end_date
                  ? dateFormat(item.start_date)
                  : dateFormatBetween(item.start_date, item.end_date)}
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
                source={MapIconGrey}
              />
              <Text
                size="small"
                style={{
                  width: "100%",
                }}
              >
                {item.city && item.city.name ? item.city.name : "-"}
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
      {/* ======================= Bagian tengah (list) ================================ */}

      <FlatList
        contentContainerStyle={{
          marginTop: 5,
          justifyContent: "space-evenly",
          paddingHorizontal: 5,
          paddingBottom: 120,
        }}
        horizontal={false}
        data={dataEv}
        renderItem={_renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        extraData={selected}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
      />
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
