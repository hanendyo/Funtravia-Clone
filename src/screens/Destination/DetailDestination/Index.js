import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import { Container, Tab, Tabs, ScrollableTab } from "native-base";
import { useLazyQuery } from "@apollo/react-hooks";
import {
  default_image,
  Ticket,
  Foto,
  Family,
  Relax,
  backpack2,
} from "../../../assets/png";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import AboutInformation from "./AboutInformation";
import GreatFor from "./GreatFor";
import InformasiUmum from "./InformasiUmum";
import HargaTiketMasuk from "./HargaTiketMasuk";
import DetailLokasi from "./DetailLokasi";
import PenilaianTempat from "./PenilaianTempat";
import OnTheSpot from "./OnTheSpot";
import ArticleView from "./ArticleView";
import Fasilitas from "./Fasilitas";
import {
  Arrowbackwhite,
  LikeEmpty,
  LikeRed,
  OptionsVertWhite,
} from "../../../assets/svg";
import { Loading } from "../../../component";
import OtherDestination from "./OtherDestination";

const btnWHalf = Dimensions.get("window").width / 2 - 20;
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight / 2,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    height: screenHeight / 2,
    alignContent: "flex-start",
  },
  textStyle: {
    marginLeft: 10,
    padding: 10,
    color: "#FFFFFF",
    alignSelf: "flex-start",
    position: "absolute",
  },
  balanceContainer: {
    padding: 10,
  },
});

//EXAMPLE DATA
const exGreat = [
  { icon: Ticket, name: "Movies" },
  { icon: backpack2, name: "Hiking" },
  { icon: Relax, name: "Relax" },
];
const exFacilities = [
  { icon: Foto, name: "Foto" },
  { icon: Family, name: "Family" },
  { icon: Relax, name: "Relax" },
];
const exRating = [
  {
    username: "Asep IM",
    rating: 4,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae ultrices consectetur arcu augue sit morbi ut. Maecenas semper porta sit a risus aliquam. Purus cursus felis malesuada...",
  },
  {
    username: "Arief",
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae ultrices consectetur arcu augue sit morbi ut. Maecenas semper porta sit a risus aliquam. Purus cursus felis malesuada...",
  },
  {
    username: "Teagan",
    rating: 4,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae ultrices consectetur arcu augue sit morbi ut. Maecenas semper porta sit a risus aliquam. Purus cursus felis malesuada...",
  },
  {
    username: "Teagan",
    rating: 4,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae ultrices consectetur arcu augue sit morbi ut. Maecenas semper porta sit a risus aliquam. Purus cursus felis malesuada...",
  },
];

const Info = ({ data, onScroll }) => {
  var { t, i18n } = useTranslation();
  const handleScroll = (e) => {
    if (e.nativeEvent.contentOffset.y !== 0) {
      onScroll();
    }
  };
  return (
    <Container
      style={
        Platform.OS === "ios" ? { paddingBottom: 140 } : { paddingBottom: 90 }
      }
    >
      <ScrollView
        onScrollEndDrag={handleScroll}
        style={{
          flex: 1,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <AboutInformation
          tittle={data ? data.name : null}
          maps={data ? data.map : null}
          content={data ? data.description : null}
        />
        <GreatFor tittle={t("greatFor")} data={exGreat} />
        <InformasiUmum
          tittle={t("generalInformation")}
          data={data ? data : null}
        />
        <HargaTiketMasuk
          tittle={t("admissionFee")}
          weekend={data ? data.weekendprice : null}
          weekday={data ? data.weekdayprice : null}
        />
        <DetailLokasi tittle={t("locationDetail")} data={data ? data : null} />
        <PenilaianTempat tittle={t("rating")} data={exRating} />
        <OnTheSpot
          tittle={t(`popularPhotoSpot`)}
          data={data ? data.images : null}
        />
        <Fasilitas tittle={t("facilities")} data={exFacilities} />
        <OtherDestination
          tittle={t("otherDestination")}
          data={data ? data.images : null}
        />
        <View style={{ height: 70 }}></View>
      </ScrollView>
    </Container>
  );
};

const Article = ({ data, onScroll }) => {
  const handleScroll = (e) => {
    if (e.nativeEvent.contentOffset.y !== 0) {
      onScroll();
    }
  };
  return (
    <Container
      style={
        Platform.OS === "ios" ? { paddingBottom: 140 } : { paddingBottom: 90 }
      }
    >
      <ScrollView
        onScrollEndDrag={handleScroll}
        style={{
          flex: 1,
          margin: 20,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <ArticleView data={data ? data.article : []} />
      </ScrollView>
    </Container>
  );
};

export default function DestinationDetail(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "" + props.route.params.name.toUpperCase(),
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "" + props.route.params.name.toUpperCase(),
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

  const { t, i18n } = useTranslation();

  let detailId = props.route.params.id;
  let [token, setToken] = useState("");

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    // console.log(tkn);
    if (tkn !== null) {
      setToken(tkn);
      loadDetail();
    } else {
      setToken("");
    }
    // LoadFollower();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);

    loadAsync();
  }, []);

  const [loadDetail, { data, loading, error }] = useLazyQuery(DestinationById, {
    fetchPolicy: "network-only",
    variables: { id: detailId },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // if (loading) {
  // 	Alert.alert('Loading');
  // }

  if (error) {
    Alert.alert(`Error ${error}`);
  }

  if (data) {
    // console.log('YAYAYAAYAYAY: ' + data.destinationById.cities.name);
  }

  // const scrollRef = useRef<ScrollView>();

  const onFabPress = () => {
    // scrollRef.current?.scrollTo({
    //   y: screenHeight / 2,
    //   animated: true,
    // });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading show={loading} />
      <ScrollView
        // ref={scrollRef}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        stickyHeaderIndices={[1]}
      >
        <ImageBackground
          source={
            data &&
            data.destinationById &&
            data.destinationById.images.length > 0
              ? {
                  uri: data.destinationById.images[0].image.toString(),
                }
              : default_image
          }
          style={styles.container}
        >
          <View style={styles.overlay}>
            <Text
              style={[
                styles.textStyle,
                {
                  bottom: 150,
                  fontSize: 32,
                  fontWeight: "900",
                },
              ]}
              type="bold"
              size="title"
            >
              {data && data.destinationById
                ? data.destinationById.name.toUpperCase()
                : null}
            </Text>
            <Text
              style={[styles.textStyle, { bottom: 100, fontSize: 24 }]}
              type="regular"
              size="label"
            >
              {data && data.destinationById
                ? data.destinationById.cities.name.toUpperCase()
                : null}
            </Text>
            <TouchableOpacity
              style={{
                bottom: 50,
                backgroundColor: "rgba(32, 159, 174, 0.5);",
                // marginLeft: 30,
                paddingHorizontal: 30,
                marginLeft: 18,
                padding: 10,
                alignSelf: "flex-start",
                position: "absolute",
              }}
            >
              <Text
                style={{
                  // fontSize: 18,
                  color: "#FFFFFF",
                  // fontWeight: 'bold',
                  // fontFamily: "Lato-Regular",
                }}
                type="bold"
                size="label"
              >
                {data && data.destinationById
                  ? "About " + data.destinationById.name
                  : ""}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                position: "absolute",
                backgroundColor: "#EEEEEE",
                borderRadius: 50,
                bottom: 50,
                right: 20,
              }}
            >
              {data && data.destinationById.liked == true ? (
                <TouchableOpacity
                  onPress={() => _unliked(data.destinationById.id)}
                  style={{
                    // alignSelf: 'flex-end',
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: "rgb(240, 240, 240)",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <LikeRed height={20} width={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  // onPress={() => Alert.alert('coming soon')}
                  onPress={() => _liked(data.destinationById.id)}
                  style={{
                    // alignSelf: 'flex-end',
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: "rgb(240, 240, 240)",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <LikeEmpty height={20} width={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ImageBackground>
        <Tabs
          tabBarUnderlineStyle={{ backgroundColor: "#209FAE" }}
          locked={true}
          renderTabBar={() => (
            <ScrollableTab style={{ backgroundColor: "white" }} />
          )}
        >
          <Tab
            heading="General Information"
            tabStyle={{ backgroundColor: "white" }}
            activeTabStyle={{ backgroundColor: "white" }}
            textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
            activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
          >
            <Info
              data={data && data.destinationById ? data.destinationById : null}
              onScroll={onFabPress}
            />
          </Tab>
          <Tab
            heading="Article"
            tabStyle={{ backgroundColor: "white" }}
            activeTabStyle={{ backgroundColor: "white" }}
            textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
            activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
          >
            <Article
              data={data && data.destinationById ? data.destinationById : null}
              onScroll={onFabPress}
            />
          </Tab>
        </Tabs>
      </ScrollView>
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: "#ffffff",
          width: screenWidth,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          padding: 15,
        }}
      >
        {/* <TouchableOpacity
					onPress={() => Alert.alert('Find Ticket')}
					style={{ marginLeft: 15, marginRight: 5 }}>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: '#E2ECF8',
							borderRadius: 5,
							width: btnWHalf,
							alignItems: 'center',
						}}>
						<Image
							source={Ticket}
							style={{
								width: 25,
								height: 17,
								marginVertical: 10,
								marginLeft: 25,
							}}
						/>
						<Text
							style={{
								fontFamily: "Lato-Bold",
								color: '#565656',
								marginVertical: 10,
								marginRight: 20,
								marginLeft: 10,
							}}>
							Find Ticket
						</Text>
					</View>
				</TouchableOpacity> */}
        <Button
          text="Find Ticket"
          size="medium"
          color="primary"
          type="icon"
          onPress={() => Alert.alert("Find Ticket")}
          style={{ width: (Dimensions.get("screen").width - 48) * 0.5 }}
        >
          <Image
            source={Ticket}
            style={{
              width: 20,
              resizeMode: "contain",
            }}
          />
        </Button>
        <Button
          text="Add To Plan"
          size="medium"
          color="primary"
          type="box"
          onPress={() => Alert.alert("Added To Plan")}
          style={{ width: (Dimensions.get("screen").width - 48) * 0.5 }}
        />
        {/* <TouchableOpacity
					onPress={() => Alert.alert('Added To Plan')}
					style={{ marginLeft: 5, marginRight: 15 }}>
					<View
						style={{
							backgroundColor: '#209FAE',
							borderRadius: 5,
							width: btnWHalf,
							alignItems: 'center',
						}}>
						<Text
							style={{
								fontFamily: "Lato-Bold",
								color: '#FFFFFF',
								marginVertical: 10,
								marginHorizontal: 20,
							}}>
							Add To Plan
						</Text>
					</View>
				</TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}
