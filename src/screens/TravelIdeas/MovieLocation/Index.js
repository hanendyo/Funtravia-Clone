import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import {
  bg_movielocation,
  laskar_pelangi,
  hit_n_run,
  serigala_terakhir,
  night_bus,
  gundala,
  headshot,
  wiro_sableng,
  the_raid_2,
  merantau,
  the_raid,
  default_image,
} from "../../../assets/png";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Kosong,
  Select,
  LocationBlack,
  Arrowbackwhite,
} from "../../../assets/svg";
import { Button, Text, Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import MovieLocationQuery from "../../../graphQL/Query/TravelIdeas/MovieLocation";
import MovieLocationFirstQuery from "../../../graphQL/Query/TravelIdeas/MovieLocationFirst";
import { TabBar, TabView } from "react-native-tab-view";
import Ripple from "react-native-material-ripple";
import CountrySrc from "./CountrySrc";
import CountryListSrcMovie from "../../../graphQL/Query/Countries/CountryListSrcMovie";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
const HeaderHeight = width - 100;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

const data_movielocation_utama = {
  id: "1",
  judul: "Laskar Pelangi",
  sinopsis:
    "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
  cover: laskar_pelangi,
};
const data_film = [
  {
    id: "1",
    judul: "The Raid",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: the_raid,
  },
  {
    id: "2",
    judul: "Merantau",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: merantau,
  },
  {
    id: "3",
    judul: "The Raid 2",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: the_raid_2,
  },
  {
    id: "4",
    judul: "Wiro Sableng",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: wiro_sableng,
  },
  {
    id: "5",
    judul: "Headshot",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: headshot,
  },
  {
    id: "6",
    judul: "Gundala",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: gundala,
  },
  {
    id: "7",
    judul: "Night Bus",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: night_bus,
  },
  {
    id: "8",
    judul: "Serigala Terakhir",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: serigala_terakhir,
  },
  {
    id: "9",
    judul: "Hit & Run",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: hit_n_run,
  },
];

export default function MovieLocation({ navigation, route }) {
  let [token, setToken] = useState(route.params.token);
  let [canScroll, setCanScroll] = useState(true);
  const { t } = useTranslation();
  let [modalcountry, setModelCountry] = useState(false);
  let [selectedCountry, SetselectedCountry] = useState({
    // id: "98b224d6-6df0-4ea7-94c3-dbeb607bea1f",
    // name: "Indonesia",
  });
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
      fontSize: 14,
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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
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

  let movie_rekomendasi = [];
  if (data && data.movie_rekomendasi) {
    movie_rekomendasi = data.movie_rekomendasi;
  }
  // console.log(movie_rekomendasi);
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

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadAsync();
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
          height: HeaderHeight - 100,
        }}
      >
        <ImageBackground
          source={bg_movielocation}
          style={{
            width: width,
            height: HeaderHeight - 100,
            justifyContent: "center",
            padding: 20,
          }}
          resizeMode="cover"
        >
          <Text size="label" style={{ marginBottom: 20 }}>
            Get inspired #movielocation
          </Text>
          <Text size="h5" type="black">
            Movie Location
          </Text>
          <Text size="label">Explore Indonesia Movie Location</Text>
        </ImageBackground>
      </View>
      <View
        style={{
          alignItems: "center",
          alignSelf: "center",
          // backgroundColor: "#FFFFFF",
          // paddingBottom: 2,
          top: HeaderHeight - 130,
          position: "absolute",
          paddingTop: 30,
        }}
      >
        <Pressable
          onPress={() => setModelCountry(true)}
          style={({ pressed }) => [
            {
              height: 44,
              borderRadius: 20,
              borderColor: "grey",
              // paddingVertical: 20,
              paddingHorizontal: 30,
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
              }}
            >
              {selectedCountry?.name}
            </Text>
          )}

          <Select height={10} width={10} />
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          padding: 15,
          // shadowColor: "#DFDFDF",
          // shadowOffset: {
          //   width: 0,
          //   height: 1,
          // },
          // shadowOpacity: 0.25,
          // shadowRadius: 2.84,
          // elevation: 3,
        }}
      >
        <View
          style={{
            justifyContent: "flex-start",
            // paddingHorizontal: 20,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginVertical: 20,
            }}
          >
            <Text
              size="description"
              style={{
                textAlign: "justify",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae
              ultrices consectetur arcu augue sit morbi ut. Maecenas semper
              porta sit a risus aliquam.
            </Text>
          </View>
          <Text size="title" type="black">
            Top Movie Location
          </Text>
          {loadingfirst ? (
            <View
              style={{
                width: width,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <ActivityIndicator
                animating={loadingfirst}
                size="large"
                color="#209fae"
              />
            </View>
          ) : (
            <Pressable
              onPress={() => {
                navigation.navigate("TravelIdeaStack", {
                  screen: "Detail_movie",
                  params: {
                    movie_id: movie_most_populer.id,
                    token: token,
                  },
                });
              }}
              style={{
                flexDirection: "row",
                marginVertical: 15,
                width: width - 40,
              }}
            >
              <View style={{ width: "30%", height: 140 }}>
                <Image
                  source={
                    movie_most_populer.cover
                      ? { uri: movie_most_populer?.cover }
                      : default_image
                  }
                  style={{ width: "100%", height: 140, borderRadius: 10 }}
                  resizeMode="cover"
                />
              </View>
              <View
                style={{
                  paddingLeft: 15,
                  marginVertical: 5,
                  justifyContent: "space-between",
                  width: "70%",
                }}
              >
                <View>
                  <Text
                    size="title"
                    type="bold"
                    style={{
                      marginBottom: 5,
                    }}
                  >
                    {movie_most_populer.title
                      ? movie_most_populer.title
                      : "No Movie"}
                  </Text>
                  <Text
                    style={{
                      // textAlign: "justify",
                      width: "100%",
                    }}
                  >
                    {movie_most_populer.description}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#DAF0F2",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <LocationBlack width={15} height={15} />
                    <Text type="bold" style={{ marginLeft: 5 }}>
                      {movie_most_populer.destination_count
                        ? movie_most_populer.destination_count
                        : 0}
                      {" Locations"}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        </View>
      </View>
      <View
        style={{
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 20,
              width: 6,
              borderRadius: 3,
              backgroundColor: "#209fae",
              marginRight: 10,
            }}
          />
          <Text size="title" type="bold">
            Recommendation
          </Text>
        </View>
        <FlatList
          data={movie_rekomendasi}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                navigation.navigate("TravelIdeaStack", {
                  screen: "Detail_movie",
                  params: {
                    movie_id: item.id,
                    token: token,
                  },
                });
              }}
              style={{
                width: "33.3333%",
                paddingBottom: 15,
              }}
            >
              <Image
                source={item.cover ? { uri: item.cover } : default_image}
                // source={item.cover}
                style={{ width: "92%", height: 150, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text type="bold">{item.title}</Text>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{
            paddingVertical: 10,
          }}
          ListFooterComponent={
            loading ? (
              <View
                style={{
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <ActivityIndicator
                  animating={loading}
                  size="large"
                  color="#209fae"
                />
              </View>
            ) : null
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
