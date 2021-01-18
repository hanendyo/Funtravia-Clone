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
import { LikeRed, LikeEmpty, Kosong } from "../../../assets/svg";
import { Truncate, Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";

export default function PlanList({
  token,
  props,
  jumlah,
  data,
  GetListitinplan,
}) {
  const { t, i18n } = useTranslation();
  let [tok, settok] = useState(token);
  let [datalistaktif, setdatalistaktif] = useState(data);

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

  const handler_liked = (id) => {};

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
                <Image
                  source={
                    value.user && value.user.picture
                      ? { uri: value.user.picture }
                      : default_image
                  }
                  style={{
                    resizeMode: "cover",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
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
              size="small"
              type={"regular"}
              style={{
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
          style={{
            color: "white",
          }}
        >
          {Difference_In_Days + 1}D
        </Text>
        <Text
          size="description"
          type={"regular"}
          style={{
            color: "white",
          }}
        >
          {Difference_In_Days}N
        </Text>
        <Text
          size="description"
          type={"regular"}
          style={{
            color: "white",
          }}
        >
          {" ("}
          {getdate(x, y)}
          {")"}
        </Text>
      </View>
    );
  };

  const RenderActive = ({ data }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            props.navigation.push("itindetail", {
              itintitle: data.name,
              country: data.id,
              dateitin: getdate(data.start_date, data.end_date),
              token: tok,
              // status: 'saved',
            })
          }
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
                    alignItems: "center",
                    position: "absolute",
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
              ) : (
                <TouchableOpacity
                  onPress={() => handler_liked(data.id)}
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    right: 10,
                    top: 10,
                    zIndex: 999,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Lato-Regular",
                      color: "white",
                    }}
                  >
                    {data.likers}{" "}
                  </Text>
                  <View>
                    {data.liked == true ? (
                      <LikeRed height={20} width={20} />
                    ) : (
                      <LikeEmpty height={20} width={20} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              <View>
                <Text
                  size="label"
                  type={"bold"}
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
                  size={"description"}
                  type={"regular"}
                  style={{ color: "white" }}
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

  return (
    <View style={{ flex: 1 }}>
      {/* <NavigationEvents onDidFocus={() => _Refresh()} /> */}

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
                onPress={() => props.navigation.push("Trip")}
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
            onPress={() => props.navigation.push("Trip")}
            customStyle={{
              width: Dimensions.get("window").width - 60,
              height: 40,
              // marginVertical: (5),
              // borderWidth: 1,
            }}
            customTextStyle={{
              fontSize: 13,
            }}
            // onPress={login}
            text={t("createYourPlan")}
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
