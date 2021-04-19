import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { default_image } from "../../assets/png";
import Continent from "../../graphQL/Query/Countries/Continent";
import RegionList from "../../graphQL/Query/Countries/RegionList";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/react-hooks";
import Fillter from "./Fillter/index";
import { Arrowbackwhite, OptionsVertWhite } from "../../assets/svg";
import { Button, Text, Truncate, Capital } from "../../component";
export default function AllDestination(props) {
  const { t } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    title: "Popular Destination",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Popular Destination",
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

  let [selected] = useState(new Map());
  let [search, setSearch] = useState({ type: null, tag: null, keyword: null });

  const [GetRegionList, { data, loading, error }] = useLazyQuery(RegionList, {
    variables: {
      keyword: search.keyword ? search.keyword : "",
      type: search.tag ? search.tag : "",
    },
  });
  console.log("data", data);
  const [
    GetContinent,
    { data: dataFillter, loading: loadingcat, error: errorcat },
  ] = useLazyQuery(Continent, {
    fetchPolicy: "network-only",
  });

  const rupiah = (nilai) => {
    let number_string = typeof nilai == "number" ? nilai.toString() : nilai,
      sisa = number_string.length % 3,
      jumlah = number_string.substr(0, sisa),
      ribuan = number_string.substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      let separator = sisa ? "." : "";
      jumlah += separator + ribuan.join(".");
    }

    return jumlah;
  };

  // console.log(dataFillter);
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    GetRegionList();
    GetContinent();
  }, []);

  const RenderList = ({ item }) => {
    return item && item.city.length > 0 ? (
      <View>
        {item ? (
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                height: Dimensions.get("window").width * 0.29,
              }}
              onPress={() =>
                props.navigation.navigate("CountryStack", {
                  screen: "Country",
                  params: {
                    data: item,
                    exParam: true,
                  },
                })
              }
            >
              <ImageBackground
                source={item.image ? { uri: item.image.image } : default_image}
                style={{
                  width: Dimensions.get("window").width - 20,
                  height: Dimensions.get("window").width * 0.29,
                }}
                imageStyle={[
                  styles.destinationMainImage,
                  { height: Dimensions.get("window").width * 0.29 },
                ]}
              >
                <View
                  style={[
                    styles.destinationMainImageContainer,
                    {
                      height: Dimensions.get("window").width * 0.29,

                      flexDirection: "row",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    },
                  ]}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "#ffffff",
                      zIndex: 2,
                      shadowRadius: 2,
                      shadowColor: "#000",
                      elevation: 5,
                      opacity: 1,
                      fontFamily: "Lato-Bold",
                      fontSize: 21,
                    }}
                  >
                    <Truncate text={Capital({ text: item.name })} length={10} />
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        ) : null}
        <View
          style={{
            marginVertical: 10,
            borderBottomWidth: 1,
            borderColor: "#F0F0F0",
          }}
        >
          {item.city && item.city.length
            ? item.city.map((value, i) => {
                console.log("value", value);
                return (
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("CountryStack", {
                        screen: "CityDetail",
                        params: {
                          data: {
                            city_id: value.id,
                            city_name: value.name,
                            latitude: value.latitude,
                            longitude: value.longitude,
                          },
                          exParam: true,
                        },
                      })
                    }
                    style={{
                      height: Dimensions.get("window").width * 0.24,
                      width: Dimensions.get("window").width - 20,
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        height: Dimensions.get("window").width * 0.24,

                        width: (Dimensions.get("window").width - 20) / 2,
                      }}
                    >
                      <ImageBackground
                        key={value.id}
                        source={
                          value.cover ? { uri: value.cover } : default_image
                        }
                        style={{
                          width: (Dimensions.get("window").width - 20) / 2,
                          height: Dimensions.get("window").width * 0.24,
                        }}
                        imageStyle={[
                          styles.Image,
                          {
                            width: (Dimensions.get("window").width - 20) / 2,
                            height: Dimensions.get("window").width * 0.24,
                          },
                        ]}
                      ></ImageBackground>
                    </View>
                    <View
                      style={{
                        width: (Dimensions.get("window").width - 20) / 2,
                        height: Dimensions.get("window").width * 0.24,

                        paddingVertical: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <View>
                        <Text type="bold" size="title" style={{}}>
                          <Truncate
                            text={Capital({ text: value.name })}
                            length={20}
                          />
                        </Text>
                        <Text type="" size="label" style={{}}>
                          {rupiah(value.count_destination)} {t("destination")}
                        </Text>
                        <Text type="" size="label" style={{}}>
                          {rupiah(value.count_plan_tour)} {t("trip")}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            : null}
        </View>
      </View>
    ) : null;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {dataFillter && dataFillter.continent_type.length ? (
        <Fillter
          fillter={dataFillter.continent_type}
          sendBack={(e) => setSearch(e)}
        />
      ) : null}

      <FlatList
        contentContainerStyle={{
          marginTop: 5,
          justifyContent: "space-evenly",
          paddingStart: 10,
        }}
        horizontal={false}
        data={
          data && data.populer_city_destination.length
            ? data.populer_city_destination
            : null
        }
        renderItem={({ item, index }) => <RenderList item={item} />}
        showsHorizontalScrollIndicator={false}
        extraData={selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
  },
  destinationMainImageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  destinationMainImage: {
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "black",
  },
  destinationImageView: {
    width: (Dimensions.get("window").width - 37) / 3,
    height: (Dimensions.get("window").width - 37) / 3,
    marginRight: 5,
    borderRadius: 10,
  },
  destinationImage: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
