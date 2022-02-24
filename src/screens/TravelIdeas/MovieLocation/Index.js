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
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from "react-native";
import { default_image } from "../../../assets/png";
import {
  Select,
  Arrowbackwhite,
  Arrowbackios,
  BlockDestination,
} from "../../../assets/svg";
import { Text, StatusBar as Satbar } from "../../../component";
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
const deviceId = DeviceInfo.getModel();
import normalize from "react-native-normalize";

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
import { useSelector } from "react-redux";

export default function MovieLocation({ navigation, route }) {
  const NotchAndro = StatusBar.currentHeight > 24;
  let [destinationMovie, setDestinationMovie] = useState();
  const { t } = useTranslation();
  let tokenApps = useSelector((data) => data.token);
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

  const {
    data: datacountry,
    loading: loadingcountry,
    error: errorcountry,
    refetch: refetchcountry,
  } = useQuery(CountryListSrcMovie, {
    fetchPolicy: "network-only",
    variables: {
      continent_id: null,
      keyword: "",
    },
    onCompleted: () => {
      SetselectedCountry({
        id: datacountry?.list_country_src_movie[0].id,
        name: datacountry?.list_country_src_movie[0].name,
      });
    },
  });

  const [getMovie, { data, loading, error, refetch }] = useLazyQuery(
    MovieLocationQuery,
    {
      variables: {
        countries_id: selectedCountry.id,
      },
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenApps,
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
        Authorization: tokenApps,
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
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  let movie_most_populer = [];
  if (datafirst && datafirst.movie_most_populer) {
    movie_most_populer = datafirst.movie_most_populer;
  }

  const [Banner, SetDataBanner] = useState();
  const {
    data: dataBanner,
    loading: loadingBanner,
    error: errorBanner,
  } = useQuery(BannerApps, {
    variables: {
      page_location: "Movie",
    },
    fetchPolicy: "network-only",
    onCompleted: () => {
      SetDataBanner(dataBanner?.get_banner);
    },
  });

  useEffect(() => {
    GetDestinationMovieMovie();
    if (selectedCountry) {
      getMovie();
      getMovie_First();
    }
  }, [route]);

  const HEADER_MAX_HEIGHT = normalize(200);
  const HEADER_MIN_HEIGHT = normalize(50);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  let [scrollY] = useState(new Animated.Value(0));

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });
  const shareTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE + 5],
    outputRange: [0, -HEADER_SCROLL_DISTANCE, -HEADER_SCROLL_DISTANCE - 100],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 1.2],
    extrapolate: "clamp",
  });
  const titleTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 20, 50],
    extrapolate: "clamp",
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 0],
    extrapolate: "clamp",
  });

  let imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });
  const backOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const backOpacitySecond = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE - 100, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Satbar backgroundColor="#14646E" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: HEADER_MAX_HEIGHT - normalize(15),
          // marginTop: HEADER_MAX_HEIGHT + normalize(30),
          backgroundColor: "#fff",
          paddingBottom: normalize(230),
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <CountrySrc
          selectedCountry={selectedCountry}
          SetselectedCountry={(e) => SetselectedCountry(e)}
          modalshown={modalcountry}
          setModelCountry={(e) => setModelCountry(e)}
          navigation={navigation}
        />
        <View
          style={{
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: "#f6f6f6",
            paddingTop: 40,
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
            {t("subTitleMovie")}
          </Text>
        </View>
        {loadingDestinationMovie ? (
          <View
            style={{
              height: 220,
              width: Dimensions.get("screen").width - 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#209fae" />
          </View>
        ) : null}
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
            <BlockDestination
              height={20}
              width={20}
              style={{ marginLeft: -7 }}
            />
            <Text size="title" type="bold" style={{ paddingBottom: 3 }}>
              {t("insirationTravel")}
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
            {t("subInspirasiMovie")}
          </Text>
          {loadingfirst ? (
            <View
              style={{
                height: 220,
                width: Dimensions.get("screen").width - 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#209fae" />
            </View>
          ) : null}
          {movie_most_populer &&
            movie_most_populer.length > 0 &&
            movie_most_populer.map((item, index) => {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate("TravelIdeaStack", {
                      screen: "Detail_movie",
                      params: {
                        movie_id: item.id,
                      },
                    });
                  }}
                  key={"key detail" + index}
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
                    source={item ? { uri: item?.cover } : null}
                    style={{
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      height: "70%",
                    }}
                  />
                  <View style={{ flex: 1, padding: 10 }}>
                    <Text
                      size="title"
                      type="bold"
                      numberOfLines={2}
                      style={{ lineHeight: 20 }}
                    >
                      {t("titleInspirasiMovie1")} '{item?.title}'
                      {t("titleInspirasiMovie2")}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
        </View>
      </Animated.ScrollView>
      {/* Button Country */}
      <Animated.View
        style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          zIndex: 2,
          position: "absolute",
          marginTop:
            Platform.OS == "ios"
              ? Notch
                ? HEADER_MAX_HEIGHT + normalize(15)
                : HEADER_MAX_HEIGHT - normalize(10)
              : deviceId == "LYA-L29"
              ? HEADER_MAX_HEIGHT - normalize(8)
              : NotchAndro
              ? HEADER_MAX_HEIGHT + normalize(15)
              : HEADER_MAX_HEIGHT + normalize(5),
          opacity: backOpacity,
          transform: [{ translateY: shareTranslateY }],
        }}
      >
        <TouchableOpacity
          type="circle"
          color="secondary"
          style={{
            position: "absolute",
            // width: Dimensions.get("screen").width / 2.5,
            // right: 20,
            zIndex: 20,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#fff",
            // height: 30,
            // width: 100,
            borderRadius: 30,
            borderColor: "#d8d8d8",
            borderWidth: 1,
          }}
          onPress={() => setModelCountry(true)}
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
                marginVertical: 10,
              }}
            >
              {selectedCountry?.name}
            </Text>
          )}

          <Select height={10} width={10} style={{ marginRight: 20 }} />
        </TouchableOpacity>
      </Animated.View>
      {/* End Button Country */}
      {/* Title Middle */}
      <Animated.View
        style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          zIndex: 2,
          position: "absolute",
          marginTop:
            Platform.OS == "ios"
              ? Notch
                ? HEADER_MAX_HEIGHT / 2
                : HEADER_MAX_HEIGHT / 2
              : deviceId == "LYA-L29"
              ? HEADER_MAX_HEIGHT / 2
              : HEADER_MAX_HEIGHT / 2,
          opacity: backOpacity,
          transform: [{ translateY: shareTranslateY }],
        }}
      >
        <Text size="h5" type="black">
          {t("filmLocation")}
        </Text>
        <Text size="description" type="regular">
          {t("getVacation")}
        </Text>
      </Animated.View>
      {/* End Title Middle */}
      {/* Image Background */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          backgroundColor: "#14646e",
          overflow: "hidden",
          height:
            Platform.OS == "ios"
              ? HEADER_MAX_HEIGHT - 8
              : HEADER_MAX_HEIGHT - 5,
          transform: [{ translateY: headerTranslateY }],
          zIndex: 1,
          top: SafeStatusBar,
        }}
      >
        <Animated.Image
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: null,
            height: HEADER_MAX_HEIGHT,
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslateY }],
            zIndex: 1,
          }}
          source={
            Banner?.banner_asset[0].filepath
              ? { uri: Banner?.banner_asset[0].filepath }
              : default_image
          }
        />
      </Animated.View>
      {/*End Image Background */}
      {/* Title Header */}
      <Animated.View
        style={{
          transform: [{ translateY: titleTranslateY }],
          height: Platform.OS === "ios" ? normalize(55) : normalize(50),
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "center",
          position: "absolute",
          left: 0,
          right: -10,
          bottom: 0,
          zIndex: 999,
          paddingLeft: 60,
          backgroundColor: "#209FAE",
          opacity: titleOpacity,
          top:
            Platform.OS == "ios"
              ? SafeStatusBar
              : NotchAndro
              ? SafeStatusBar + 8
              : SafeStatusBar,
        }}
      >
        <Text
          size="title"
          type="bold"
          style={{
            color: "#fff",
            marginBottom: NotchAndro ? 5 : 0,
          }}
          numberOfLines={1}
        >
          {t("filmLocation")}
        </Text>
      </Animated.View>
      {/*End Title Header */}
      {/* Back Arrow One */}
      <Animated.View
        style={{
          transform: [{ translateY: titleTranslateY }],
          height: 100,
          width: 100,
          position: "absolute",
          zIndex: 999,
          top:
            Platform.OS == "ios"
              ? Notch
                ? SafeStatusBar + 3
                : SafeStatusBar
              : NotchAndro
              ? SafeStatusBar + 3
              : SafeStatusBar,
          left: 2,
          opacity: backOpacity,
        }}
      >
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            marginTop: 10,
            marginLeft: 15,
            backgroundColor: "rgba(0,0,0, 0.5)",
            borderRadius: 35,
            height: 35,
            width: 35,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Pressable>
      </Animated.View>
      {/* End Back Arrow One */}
      {/* Back Arrow Two */}
      <Animated.View
        style={{
          transform: [{ translateY: titleTranslateY }],
          height: 100,
          width: 100,
          position: "absolute",
          zIndex: 999,
          top:
            Platform.OS == "ios"
              ? Notch
                ? SafeStatusBar + 1
                : SafeStatusBar - 3
              : NotchAndro
              ? SafeStatusBar + 3
              : SafeStatusBar - 3,
          opacity: backOpacitySecond,
        }}
      >
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            marginTop: 10,
            marginLeft: 15,
            borderRadius: 40,
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Pressable>
      </Animated.View>
      {/* End Back Arrow Two */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
