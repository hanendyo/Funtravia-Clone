import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { default_image, love_merah } from "../../assets/png";
import { AirbnbRating } from "react-native-ratings";
import { LikeRed } from "../../assets/svg";
import { useMutation, useQuery } from "@apollo/react-hooks";
import UnLiked from "../../graphQL/Mutation/unliked";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";

export default function Service({
  props,
  serviceData,
  token,
  refreshing,
  Refresh,
}) {
  const { t, i18n } = useTranslation();
  // let [token, setToken] = useState('');
  let [dataService, setService] = useState(serviceData);
  // console.log(dataService);

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
            type: "service",
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
            var tempData = [...dataService];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData.splice(index, 1);
            setService(tempData);
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

  const RenderService = ({ data }) => {
    return (
      <View>
        <View
          style={{
            // width: (110),
            // flex: 1,
            marginTop: 5,
            marginBottom: 5,
            flex: 1,
            borderRadius: 5,
            backgroundColor: "white",
            borderColor: "gray",
            shadowColor: "gray",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 3,
            elevation: 3,
            // paddingVertical: (20),
            flexDirection: "row",
            minHeight: 130,
            width: Dimensions.get("window").width - 20,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("PhotographerDetail", {
                dataIten: {},
                service: data,
                kat_service: [],
              })
            }
            style={{
              // height: (150),
              width: Dimensions.get("window").width * 0.4,
              marginRight: 15,
            }}
          >
            <ImageBackground
              key={data.id}
              source={data.cover ? { uri: data.cover } : default_image}
              style={[
                styles.ImageView,
                {
                  width: Dimensions.get("window").width * 0.4,

                  height: "100%",
                },
              ]}
              imageStyle={[
                styles.Image,
                {
                  width: Dimensions.get("window").width * 0.4,

                  height: "100%",
                },
              ]}
            >
              <View
                style={{
                  // flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.38)",
                  width: "100%",
                  height: "100%",
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              ></View>
            </ImageBackground>
          </TouchableOpacity>
          <View
            style={{
              paddingVertical: 10,
              width: Dimensions.get("window").width * 0.5,
              height: "100%",
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.5,
                  flexDirection: "row",
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      width: Dimensions.get("window").width * 0.5 - 40,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Bold",
                        fontSize: 16,
                        // color: '#D7598F',
                        // marginLeft: (5),
                      }}
                    >
                      {data.name}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={
                    {
                      // marginTop: (-20),
                      // marginRight: (20),
                    }
                  }
                >
                  <TouchableOpacity
                    onPress={() => _unliked(data.id)}
                    style={{
                      // alignSelf: 'flex-end',
                      height: 30,
                      width: 30,
                      borderRadius: 15,
                      backgroundColor: "rgb(240, 240, 240)",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LikeRed height={15} width={15} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <AirbnbRating
                  count={5}
                  // reviews={[]}
                  showRating={false}
                  // reviewSize={0}
                  isDisabled={true}
                  defaultRating={data.rating ? data.rating : 0}
                  size={10}
                />
                <Text size="small">
                  ({data.count_review ? data.count_review : "0"} {t("reviews")})
                </Text>
              </View>

              {/* <Text
								size='small'
								style={{
									marginTop: 10,
								}}>
								{t('startFrom')}
							</Text>
							<View
								style={{
									flexDirection: 'row',
								}}>
								<View
									style={{
										// borderWidth: 1,
										// borderColor: 'red',
										alignItems: 'flex-end',
										justifyContent: 'flex-end',
									}}>
									<Text
										size='label'
										type='bold'
										style={{
											color: '#D7598F',
											// marginLeft: (5),
										}}>
										{`IDR.${rupiah(data.price ? data.price : '0')}`}
									</Text>
								</View>
								<View
									style={{
										// borderWidth: 1,
										// borderColor: 'red',
										alignItems: 'flex-end',
										justifyContent: 'flex-end',
										paddingBottom: 3,
									}}>
									<Text size='description' style={{}}>
										/{t('hours')}
									</Text>
								</View>
							</View> */}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          marginTop: 5,
          justifyContent: "space-evenly",
          paddingStart: 10,
          paddingEnd: 10,
          paddingBottom: 120,
        }}
        horizontal={false}
        data={dataService.length > 0 ? dataService : []}
        renderItem={({ item }) => (
          <RenderService
            data={item}
            // onSelect={onSelect}
            // selected={!!selected.get(item.id)}
          />
        )}
        // keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        // extraData={selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // marginRight: (5),
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  Image: {
    resizeMode: "cover",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    overflow: "hidden",
  },
});
