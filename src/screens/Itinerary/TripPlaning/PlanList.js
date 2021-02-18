import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { default_image, imgPrivate } from "../../../assets/png";
import { dateFormats } from "../../../component/src/dateformatter";
import {
  LikeRed,
  LikeEmpty,
  Kosong,
  PinHijau,
  Calendargrey,
  User,
  TravelAlbum,
  TravelStories,
  TravelAlbumdis,
  TravelStoriesdis,
} from "../../../assets/svg";
import { Truncate, Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
import { useMutation, useQuery } from "@apollo/client";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import ListItinerary from "../../../graphQL/Query/Itinerary/listitinerary";

const arrayShadow = {
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
  shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
  elevation: Platform.OS == "ios" ? 3 : 3,
};

export default function PlanList({
  token,
  props,
  jumlah,
  data,
  // GetListitinplan,
}) {
  const { t, i18n } = useTranslation();
  let [tok, settok] = useState(token);
  let datalistaktif = {};

  const {
    data: datalistplan,
    loading: loadinglistplan,
    error: errorlistplan,
    refetch: GetListitinplan,
  } = useQuery(ListItinerary, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { status: "D" },
  });

  {
    datalistplan &&
    datalistplan.itinerary_list_bystatus &&
    datalistplan.itinerary_list_bystatus.length > 0
      ? (datalistaktif = datalistplan)
      : null;
  }

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    GetListitinplan();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const dateFormatr = (date) => {
    var x = date.split(" ");
    return dateFormat(x[0]);
  };

  const getdate = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");

    return dateFormats(start[0]) + " - " + dateFormats(end[0]);
  };

  const getDN = (start, end) => {
    var x = start;
    var y = end,
      start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          size="description"
          type={"regular"}
          style={
            {
              // color: "white",
            }
          }
        >
          {Difference_In_Days + 1} {t("days")}
          {", "}
        </Text>
        <Text
          size="description"
          type={"regular"}
          style={
            {
              // color: "white",
            }
          }
        >
          {Difference_In_Days} {t("nights")}
        </Text>
      </View>
    );
  };

  const RenderActive = ({ data }) => {
    return (
      <View
        style={{
          height: 150,
          marginTop: 10,
          borderRadius: 5,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: arrayShadow.shadowOpacity,
          shadowRadius: arrayShadow.shadowRadius,
          elevation: arrayShadow.elevation,
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            height: "75%",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            flexDirection: "row",
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
          }}
        >
          <ImageBackground
            source={data && data.cover ? { uri: data.cover } : default_image}
            style={{
              height: "100%",
              width: "35%",
              borderTopLeftRadius: 5,
            }}
            imageStyle={{
              borderTopLeftRadius: 5,
              borderWidth: 0.2,
              borderColor: "#d3d3d3",
              height: "100%",
              width: "100%",
            }}
          >
            <Ripple
              style={{
                width: "100%",
                height: "100%",
                padding: 10,
              }}
              onPress={() =>
                props.navigation.push("ItineraryStack", {
                  screen: "itindetail",
                  params: {
                    itintitle: data.name,
                    country: data.id,
                    dateitin: getdate(data.start_date, data.end_date),
                    token: tok,
                    status: "edit",
                  },
                })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    data.user_created
                      ? { uri: data.user_created.picture }
                      : default_image
                  }
                  style={{
                    zIndex: 2,
                    backgroundColor: "#ffff",
                    borderRadius: 15,
                    width: 30,
                    height: 30,
                    borderWidth: 1,
                    borderColor: "#ffff",
                  }}
                ></Image>
                <View
                  style={{
                    position: "relative",
                    marginLeft: -5,
                    zIndex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    paddingVertical: 3,
                    paddingHorizontal: 10,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Text
                    size="small"
                    type={"regular"}
                    style={{
                      color: "white",
                    }}
                  >
                    {data.user_created
                      ? data.user_created.first_name
                      : "User_Funtravia"}
                  </Text>
                </View>
              </View>
            </Ripple>
          </ImageBackground>

          <View
            style={{
              width: "65%",
              height: "100%",
              paddingHorizontal: 10,
              backgroundColor: "#FFFFFF",
              paddingVertical: 10,
              overflow: "hidden",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  aligndatas: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#DAF0F2",
                    borderWidth: 1,
                    borderRadius: 3,
                    borderColor: "#209FAE",
                    paddingHorizontal: 5,
                  }}
                >
                  <Text
                    type="bold"
                    size="description"
                    style={{ color: "#209FAE" }}
                  >
                    {data?.categori?.name
                      ? data?.categori?.name
                      : "No Category"}
                  </Text>
                </View>
                <View>
                  {data.isprivate == true ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={imgPrivate}
                        style={{
                          height: 10,
                          width: 10,
                          marginRight: 5,
                        }}
                      />
                      <Text
                        size="small"
                        type={"regular"}
                        style={{
                          color: "white",
                        }}
                      >
                        {t("private")}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Text size="label" type="black" style={{ marginTop: 5 }}>
                <Truncate text={data.name} length={40} />
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <PinHijau width={15} height={15} />
                <Text style={{ marginLeft: 5 }} size="small" type="regular">
                  {data?.country?.name}
                </Text>
                <Text>,</Text>
                <Text size="small" type="regular" style={{ marginLeft: 3 }}>
                  {data?.city?.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                // borderWidth: 1,
                width: "100%",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 3,
                }}
              >
                <Calendargrey
                  width={10}
                  height={10}
                  style={{ marginRight: 5 }}
                />
                {data.start_date && data.end_date
                  ? getDN(data.start_date, data.end_date)
                  : null}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 15,
                }}
              >
                <User width={10} height={10} style={{ marginRight: 5 }} />
                <Text size="small" type="regular">
                  {(data && data.buddy.length ? data.buddy.length : null) + " "}
                  {t("person")}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            paddingVertical: 3,
            height: "25%",
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: 1,
              borderColor: "#d3d3d3",
              paddingVertical: 5,
            }}
          >
            <TravelAlbumdis height={15} width={15} style={{ marginRight: 5 }} />
            <Text size="small" type="bold" style={{ color: "#d3d3d3" }}>
              Travel Album
            </Text>
          </View>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TravelStoriesdis
              height={15}
              width={15}
              style={{ marginRight: 5 }}
            />
            <Text size="small" type="bold" style={{ color: "#d3d3d3" }}>
              Travel Stories
            </Text>
          </View>
        </View>
      </View>
    );
  };
  if (loadinglistplan) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      {datalistaktif && datalistaktif.itinerary_list_bystatus.length ? (
        (jumlah(datalistaktif.itinerary_list_bystatus.length),
        (
          <View
            style={{ flex: 1, height: Dimensions.get("screen").height - 120 }}
          >
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

            <View
              style={{
                zIndex: 999,
                position: "absolute",
                left: 0,
                bottom: 0,
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
                color="secondary"
                onPress={() =>
                  props.navigation.push("ItineraryStack", { screen: "Trip" })
                }
                style={{
                  width: Dimensions.get("screen").width - 40,
                  height: 40,
                }}
                text={t("CreateNewPlan")}
              />
            </View>
          </View>
        ))
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            height: "100%",
          }}
        >
          <Text
            size="title"
            type={"bold"}
            style={{ width: "70%", textAlign: "center" }}
          >
            {t("empty")}
          </Text>
          <Kosong
            height={Dimensions.get("screen").width * 0.6}
            width={Dimensions.get("screen").width}
          />
          <Button
            color="secondary"
            onPress={() =>
              props.navigation.push("ItineraryStack", { screen: "Trip" })
            }
            style={{
              width: Dimensions.get("screen").width - 40,
              height: 40,
            }}
            text={t("CreateNewPlan")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    // marginTop: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
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
