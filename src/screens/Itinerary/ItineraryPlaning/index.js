import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomImage } from "../../../component";
import { default_image, imgPrivate } from "../../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import listitinerary from "../../../graphQL/Query/Itinerary/listitinerary";
import { dateFormats } from "../../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import { Text, Button, Truncate } from "../../../component";
import { Arrowbackwhite } from "../../../assets/svg";
export default function listItinPlaning(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Your Trip",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Your Trip",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Regular",
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

  let [token, setToken] = useState("");
  let idkiriman = props.route.params.idkiriman;

  const { t, i18n } = useTranslation();
  const [
    GetListitinaktif,
    { data: datalistaktif, loading: loadinglistaktif, error: errorlistaktif },
  ] = useLazyQuery(listitinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { status: "D" },
  });

  const getdate = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");

    return dateFormats(start[0]) + " - " + dateFormats(end[0]);
  };

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {databuddy.map((value, i) => {
          if (i < 3) {
            return (
              <View key={i}>
                <CustomImage
                  source={
                    value.user && value.user.picture
                      ? { uri: value.user.picture }
                      : default_image
                  }
                  customImageStyle={{
                    resizeMode: "cover",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                  }}
                  customStyle={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    marginLeft: -10,
                  }}
                />
              </View>
            );
          }
        })}

        {databuddy.length > 1 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 12,
                color: "white",
              }}
            >
              {"    "}
              {t("with")}{" "}
              {databuddy[1].user && databuddy[1].user.first_name
                ? databuddy[1].user.first_name
                : ""}
              {databuddy.length > 2
                ? " + " + (databuddy.length - 2) + " Others"
                : " "}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontFamily: "Lato-Regular",
            // fontSize:(14),
            color: "white",
          }}
        >
          {Difference_In_Days + 1} days{" "}
        </Text>
        <Text
          style={{
            fontFamily: "Lato-Regular",
            // fontSize:(14),
            color: "white",
          }}
        >
          {Difference_In_Days} night{" "}
        </Text>
      </View>
    );
  };

  const goChooseDay = (data) => {
    if (!token || token === null) {
      Alert.alert("Silahkan Login terlebih dahulu");
      props.navigation.navigate("HomeScreen");
    } else {
      props.navigation.push("ItineraryChooseday", {
        itintitle: data.name,
        Iditinerary: data.id,
        dateitin: getdate(data.start_date, data.end_date),
        token: token,
        Kiriman: idkiriman,
        Position: props.route.params.Position,
      });
    }
  };
  const RenderActive = ({ data }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => goChooseDay(data)}
          style={{
            // width: (110),
            width: Dimensions.get("window").width - 20,
            // marginTop: (3),
            // marginBottom: (5),
          }}
        >
          <ImageBackground
            // key={value.id}
            source={data.cover ? { uri: data.cover } : default_image}
            style={[
              styles.ImageView,
              {
                width: Dimensions.get("window").width - 20,
                height: Dimensions.get("window").width * 0.35,
                borderRadius: 10,
                marginVertical: 3,
                // padding: (20),
              },
            ]}
            imageStyle={[
              styles.Image,
              {
                width: Dimensions.get("window").width - 20,
                height: Dimensions.get("window").width * 0.35,
                borderRadius: 10,
              },
            ]}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.38)",
                width: Dimensions.get("window").width - 20,
                height: Dimensions.get("window").width * 0.35,
                borderRadius: 10,
                padding: 10,
              }}
            >
              {data.isprivate == true ? (
                <View
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    alignItems: "center",
                    right: 0,
                    top: 10,
                    zIndex: 999,
                    backgroundColor: "rgba(255, 255, 255, 0.39)",
                    paddingVertical: 3,
                    paddingHorizontal: 10,
                    borderTopStartRadius: 10,
                    borderBottomStartRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <CustomImage
                    source={imgPrivate}
                    customStyle={{
                      height: 12,
                      width: 12,
                      marginRight: 5,
                    }}
                  />
                  <Text
                    size="small"
                    style={{
                      color: "white",
                    }}
                  >
                    {t("private")}
                  </Text>
                </View>
              ) : null}
              <View>
                <Text
                  size="label"
                  type="bold"
                  style={{
                    color: "white",
                  }}
                >
                  {data.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: "white",
                  }}
                >
                  <Truncate
                    text={data.city ? data.city.name : null}
                    length={10}
                  />
                  ,{" "}
                </Text>
                {data.start_date && data.end_date
                  ? getDN(data.start_date, data.end_date)
                  : null}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // marginTop: (70),
                  position: "absolute",
                  bottom: 10,
                  left: 20,
                }}
              >
                {data.buddy.length ? (
                  <RenderBuddy databuddy={data.buddy} />
                ) : null}
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    GetListitinaktif();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await _Refresh();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      {datalistaktif && datalistaktif.itinerary_list_bystatus.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_Refresh} />
          }
          contentContainerStyle={{
            marginTop: 5,
            justifyContent: "space-evenly",
            paddingStart: 10,
            paddingEnd: 10,
            paddingBottom: 100,
          }}
          horizontal={false}
          data={
            datalistaktif && datalistaktif.itinerary_list_bystatus.length
              ? datalistaktif.itinerary_list_bystatus
              : null
          }
          renderItem={({ item }) => <RenderActive data={item} />}
          // keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          // extraData={selected}
        />
      ) : null}

      <View
        style={{
          height: 60,
          width: Dimensions.get("window").width,
          backgroundColor: "white",
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#F0F0F0",
          shadowColor: "#F0F0F0",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          color={"secondary"}
          onPress={() => props.navigation.push("Trip")}
          style={{
            width: Dimensions.get("window").width - 60,
          }}
          text={t("createYourPlan")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ImageView: {
    // width: (110),
    // height: (110),
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
