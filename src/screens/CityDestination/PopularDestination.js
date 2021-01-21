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
import { useLazyQuery } from "@apollo/react-hooks";
import Fillter from "./Fillter/index";
import { Arrowbackwhite, OptionsVertWhite } from "../../assets/svg";
import { Button, Text, Truncate } from "../../component";
export default function AllDestination(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Popular City Destination",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Popular City Destination",
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

  //   console.log(search);

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
    // console.log({ Utama: item.image })
    return (
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
                props.navigation.navigate("Country", {
                  data: item,
                  exParam: true,
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
                    {item.name}
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
                // console.log(value);
                return (
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("CityDetail", {
                        data: {
                          city_id: value.id,
                          city_name: value.name,
                          latitude: value.latitude,
                          longitude: value.longitude,
                        },
                        exParam: true,
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
                          value.image
                            ? { uri: value.image.image }
                            : default_image
                        }
                        style={[
                          styles.ImageView,
                          {
                            width: (Dimensions.get("window").width - 20) / 2,
                            height: Dimensions.get("window").width * 0.24,
                          },
                        ]}
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
                        <Text
                          style={{
                            letterSpacing: 0.5,
                            fontFamily: "Lato-Regular",
                            fontSize: 20,
                            marginBottom: 2,
                            color: "#3E3E3E",
                          }}
                        >
                          <Truncate text={value.name} length={10} />
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Lato-Regular",
                            fontSize: 14,
                            marginBottom: 2,
                            color: "#3E3E3E",
                          }}
                        >
                          {rupiah(value.count_destination)} Destination
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Lato-Regular",
                            color: "#3E3E3E",
                            marginBottom: 2,
                            fontSize: 14,
                          }}
                        >
                          {rupiah(value.count_plan_tour)} Trip
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            : null}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
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
        data={data && data.region_list.length ? data.region_list : null}
        renderItem={({ item, index }) => <RenderList item={item} />}
        showsHorizontalScrollIndicator={false}
        extraData={selected}
      />
    </View>
  );
}
