import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import { default_image } from "../../../assets/png";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Select,
  Arrowbackwhite,
  Arrowbackios,
  LikeRed,
  Logofuntravianew,
  BlockDestination,
} from "../../../assets/svg";
import { Button, FunImage, Text, Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import MovieLocationQuery from "../../../graphQL/Query/TravelIdeas/MovieLocation";
import MovieLocationFirstQuery from "../../../graphQL/Query/TravelIdeas/MovieLocationFirst";
import CountrySrc from "./CountrySrc";
import CountryListSrcMovie from "../../../graphQL/Query/Countries/CountryListSrcMovie";
import DeviceInfo from "react-native-device-info";
import BannerApps from "../../../graphQL/Query/Home/BannerApps";
import DestinationMoviePopuler from "../../../graphQL/Query/TravelIdeas/DestinationMoviePopuler";
import ImageSlider from "react-native-image-slider";
import Ripple from "react-native-material-ripple";
import { TouchableHighlight } from "react-native-gesture-handler";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
// const HeaderHeight = width - 100;
const Notch = DeviceInfo.hasNotch();
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});
const HeaderHeight = Platform.select({
  ios: Notch ? 335 - 48 : 335 - 20,
  android: 305 - StatusBar.currentHeight,
});

export default function MovieLocation({ navigation, route }) {
  let [token, setToken] = useState(route.params.token);
  let [destinationMovie, setDestinationMovie] = useState();
  const { t } = useTranslation();
  let [modalcountry, setModelCountry] = useState(false);
  let [selectedCountry, SetselectedCountry] = useState({
    // id: "98b224d6-6df0-4ea7-94c3-dbeb607bea1f",
    // name: "Indonesia",
  });

  let renderDestinationMovie = [];
  renderDestinationMovie = destinationMovie;

  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    for (let val of data) {
      if (count < 3) {
        tmpArray.push(val);
        count++;
      } else {
        tmpArray.push(val);
        tmpData.push(tmpArray);
        count = 1;
        tmpArray = [];
      }
    }
    if (tmpArray.length) {
      tmpData.push(tmpArray);
    }
    return tmpData;
  };
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "Unesco",
    headerTintColor: "white",
    headerTitle: "Movie Location",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
      color: "white",
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 10,
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  const {
    data: datacountry,
    loading: loadingcountry,
    error: errorcountry,
    refetch: refetchcountry,
  } = useQuery(CountryListSrcMovie, {
    variables: {
      continent_id: null,
      keyword: "",
    },
    onCompleted: () => {
      SetselectedCountry({
        id: datacountry.list_country_src_movie[0].id,
        name: datacountry.list_country_src_movie[0].name,
      });
      if (selectedCountry) {
        getMovie();
        getMovie_First();
      }
    },
  });

  const [getMovie, { data, loading, error, refetch }] = useLazyQuery(
    MovieLocationQuery,
    {
      variables: {
        countries_id: selectedCountry.id,
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
    GetDestinationMovieMovie,
    {
      data: dataDestinationMovie,
      loading: loadingDestinationMovie,
      error: errorDestinationMovie,
    },
  ] = useLazyQuery(DestinationMoviePopuler, {
    fetchPolicy: "network-only",
    variables: {
      countries_id: selectedCountry.id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () =>
      setDestinationMovie(dataDestinationMovie?.destination_populer_with_movie),
  });

  let movie_rekomendasi = [];
  if (data && data.movie_rekomendasi) {
    movie_rekomendasi = data.movie_rekomendasi;
  }
  const [
    getMovie_First,
    {
      data: datafirst,
      loading: loadingfirst,
      error: errorfirst,
      refetch: refetchfirst,
    },
  ] = useLazyQuery(MovieLocationFirstQuery, {
    variables: {
      countries_id: selectedCountry.id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let movie_most_populer = [];
  if (datafirst && datafirst.movie_most_populer) {
    movie_most_populer = datafirst.movie_most_populer;
  }

  console.log("movie_most_populer", movie_most_populer);

  const [Banner, SetDataBanner] = useState();
  const {
    data: dataBanner,
    loading: loadingBanner,
    error: errorBanner,
  } = useQuery(BannerApps, {
    variables: {
      page_location: "Movie",
    },
    // fetchPolicy: "network-only",
    onCompleted: () => {
      SetDataBanner(dataBanner.get_banner);
    },
  });

  useEffect(() => {
    loadAsync();
    GetDestinationMovieMovie();
    navigation.setOptions(HeaderComponent);
  }, [route]);
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
  };
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      stickyHeaderIndices={[2]}
    >
      <CountrySrc
        selectedCountry={selectedCountry}
        SetselectedCountry={(e) => SetselectedCountry(e)}
        modalshown={modalcountry}
        setModelCountry={(e) => setModelCountry(e)}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: width,
          height: HeaderHeight - 150,
        }}
      >
        {Banner && Banner.banner_asset.length > 0 ? (
          <ImageBackground
            source={{ uri: Banner.banner_asset[0].filepath }}
            style={{
              width: width,
              height: HeaderHeight - 150,
              paddingTop: 30,
              alignItems: "center",
            }}
            resizeMode="cover"
          >
            <Text size="h5" type="black">
              {t("filmLocation")}
            </Text>
            <Text size="description" type="regular">
              {t("getVacation")}
            </Text>
          </ImageBackground>
        ) : (
          <View />
          // <ImageBackground
          //     source={bg_movielocation}
          //     style={{
          //         width: width,
          //         height: HeaderHeight - 100,
          //         justifyContent: "center",
          //         padding: 20,
          //     }}
          //     resizeMode="cover"
          // >
          //     <Text size="label" style={{ marginBottom: 20 }}>
          //         Get inspired #movielocation
          //     </Text>
          //     <Text size="h5" type="black">
          //         Movie Location
          //     </Text>
          //     <Text size="label">
          //         Explore Indonesia Movie Location
          //     </Text>
          // </ImageBackground>
        )}
      </View>
      <View
        style={{
          alignItems: "center",
          alignSelf: "center",
          top: HeaderHeight - 185,
          position: "absolute",
          paddingTop: 30,
        }}
      >
        <Pressable
          onPress={() => setModelCountry(true)}
          style={({ pressed }) => [
            {
              height: 50,
              borderRadius: 25,
              borderColor: "grey",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: pressed ? "#F6F6F7" : "white",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.22,
              shadowRadius: 1.46,
              elevation: 3,
              flexDirection: "row",
              marginTop: -22,
            },
          ]}
        >
          {loadingcountry ? (
            <ActivityIndicator
              animating
              size="small"
              color="#209fae"
              style={{
                paddingTop: 10,
                paddingHorizontal: 10,
              }}
            />
          ) : (
            <Text
              size="label"
              type="bold"
              style={{
                marginRight: 10,
                marginLeft: 20,
              }}
            >
              {selectedCountry?.name}
            </Text>
          )}

          <Select height={10} width={10} style={{ marginRight: 20 }} />
        </Pressable>
      </View>

      <View
        style={{
          paddingTop: 40,
          paddingBottom: 20,
          paddingHorizontal: 20,
          backgroundColor: "#f6f6f6",
        }}
      >
        <Text
          size="title"
          type="bold"
          style={{
            textAlign: "left",
          }}
        >
          {t("textRecommendation")} {selectedCountry?.name}
        </Text>
        <Text
          size="label"
          type="regular"
          style={{
            textAlign: "left",
          }}
        >
          This top movie location for you, get inspired for your next trip.
        </Text>
      </View>
      <ImageSlider
        key={"imagesliderjournalsdsd"}
        images={
          renderDestinationMovie ? spreadData(renderDestinationMovie) : []
        }
        style={{
          backgroundColor: "#f6f6f6",
        }}
        customSlide={({ index, item, style, width }) => (
          <View key={"ky" + index}>
            {item.map((dataX, indeks) => {
              return (
                <Pressable
                  key={"jrnla" + indeks}
                  onPress={() => {
                    navigation.navigate("CountryStack", {
                      screen: "CityDetail",
                      params: {
                        data: {
                          city_id: dataX.id,
                          city_name: dataX.name,
                        },
                        exParam: true,
                      },
                    });
                  }}
                  style={{
                    marginHorizontal: 15,
                    marginBottom: 10,
                    flexDirection: "row",
                    borderRadius: 5,
                    width: width - 30,
                    height: width * 0.22,
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                    padding: 10,
                  }}
                >
                  <Image
                    style={{
                      height: "100%",
                      width: 70,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                    source={dataX ? { uri: dataX.cover } : null}
                  />
                  <View style={{ flex: 1, justifyContent: "space-around" }}>
                    <Text
                      size="title"
                      type="bold"
                      numberOfLines={1}
                      style={{ lineHeight: 20 }}
                    >
                      {dataX.name}
                    </Text>
                    <Text
                      size="label"
                      type="regular"
                      numberOfLines={2}
                      style={{ lineHeight: 20 }}
                    >
                      {dataX.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
        customButtons={(position, move) => (
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 15,
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {(renderDestinationMovie
              ? spreadData(renderDestinationMovie)
              : []
            ).map((image, index) => {
              return (
                <TouchableHighlight
                  key={"keys" + index}
                  underlayColor="#f7f7f700"
                >
                  <View
                    style={{
                      height: position === index ? 5 : 5,
                      width: position === index ? 5 : 5,
                      borderRadius: position === index ? 7 : 3,
                      backgroundColor:
                        position === index ? "#209fae" : "#d3d3d3",
                      marginHorizontal: 3,
                    }}
                  ></View>
                </TouchableHighlight>
              );
            })}
          </View>
        )}
      />
      <View style={{ backgroundColor: "#fff", paddingVertical: 20 }}>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BlockDestination height={20} width={20} style={{ marginLeft: -7 }} />
          <Text size="title" type="bold" style={{ paddingBottom: 3 }}>
            Travel Inspiration
          </Text>
        </View>
        <Text
          size="label"
          type="regular"
          style={{
            marginHorizontal: 20,
            lineHeight: 20,
            textAlign: "left",
            marginTop: 15,
          }}
        >
          Many famous movie locations are real and you can visit them. So,
          although you might not actually be a wizard or an archaeologist
          searching hidden treasure, you can relive the movie magic yourself.
        </Text>
        <Pressable
          style={{
            height: 220,
            width: Dimensions.get("screen").width - 30,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
            marginHorizontal: 15,
            marginTop: 20,
            borderRadius: 5,
          }}
        >
          <Image
            source={
              movie_most_populer ? { uri: movie_most_populer?.cover } : null
            }
            style={{
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              height: "70%",
            }}
          />
          <View style={{ flex: 1, padding: 10 }}>
            <Text size="title" type="bold" style={{ lineHeight: 20 }}>
              Visit the beatiful location from '{movie_most_populer?.title}' on
              a short trip
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
