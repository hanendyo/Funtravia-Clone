import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Kosong } from "../../../assets/svg";
import { Text, Button, CardItinerary } from "../../../component";
import { useTranslation } from "react-i18next";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ListItinerary from "../../../graphQL/Query/Itinerary/listitinerary";
import { useLazyQuery } from "@apollo/client";
import ItineraryCount from "../../../graphQL/Query/Itinerary/ItineraryCount";

export default function ActivePlan({
  props,
  token,
  rData,
  GetCount,
  GetData,
  GetDataActive,
  GetDataFinish,
  loadingdata,
  setData,
  setting,
  autoRefetch,
}) {
  const { t } = useTranslation();
  const { width, height } = Dimensions.get("screen");
  // let [rData, setData] = useState([]);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const [planCount, setPlancount] = useState({
    count_active: 0,
    count_draf: 0,
    count_finish: 0,
  });

  // const [
  //   GetCount,
  //   { data: dataCount, loading: loadingCount, error: errorCount },
  // ] = useLazyQuery(ItineraryCount, {
  //   fetchPolicy: "network-only",
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token?`Bearer ${token}`:null,
  //     },
  //   },
  //   onCompleted: () => {
  //     setPlancount(dataCount.count_myitinerary);
  //   },
  // });

  // const [
  //   GetData,
  //   { data, loading: loadingdata, error: errordata },
  // ] = useLazyQuery(ListItinerary, {
  //   fetchPolicy: "network-only",
  //   // pollInterval: 500,
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token?`Bearer ${token}`:null,
  //     },
  //   },
  // });

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    GetCount();
    GetData();
    GetDataActive();
    GetDataFinish();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  // useEffect(() => {
  //   const willFocusSubscription = props.navigation.addListener("focus", () => {
  //     _Refresh();
  //   });

  //   return willFocusSubscription;
  // }, [props.navigation]);

  if (loadingdata && rData.length < 1) {
    return (
      <SkeletonPlaceholder>
        <View
          style={{
            width: width,
            height: 155,
            paddingHorizontal: 15,
            marginTop: 15,
            // paddingVertical: 5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#efefef",
              // marginVertical: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: Dimensions.get("screen").width * 0.3,
                  height: 112.5,
                  borderTopLeftRadius: 5,
                }}
              ></View>
              <View
                style={{
                  marginLeft: 5,
                  padding: 5,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: Dimensions.get("screen").width * 0.3,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 10,
                    height: 15,
                    width: Dimensions.get("screen").width * 0.4,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 5,
                    height: 10,
                    width: Dimensions.get("screen").width * 0.3,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 10,
                    height: 15,
                    width: Dimensions.get("screen").width * 0.4,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
            </View>
            <View
              style={{
                height: 37.5,
                flexDirection: "row",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 20,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 34,
                  borderRightWidth: 1,
                  borderColor: "#efefef",
                }}
              ></View>
              <View
                style={{
                  height: 20,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 5,
                }}
              ></View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: width,
            height: 155,
            paddingHorizontal: 15,
            marginTop: 5,
            // paddingVertical: 5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#efefef",

              // marginVertical: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: Dimensions.get("screen").width * 0.3,
                  height: 112.5,
                  borderTopLeftRadius: 5,
                }}
              ></View>
              <View
                style={{
                  marginLeft: 5,
                  padding: 5,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: Dimensions.get("screen").width * 0.3,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 10,
                    height: 15,
                    width: Dimensions.get("screen").width * 0.4,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 5,
                    height: 10,
                    width: Dimensions.get("screen").width * 0.3,
                    borderRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 10,
                    height: 15,
                    width: Dimensions.get("screen").width * 0.4,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
            </View>
            <View
              style={{
                height: 37.5,
                flexDirection: "row",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 20,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 34,
                  borderRightWidth: 1,
                  borderColor: "#efefef",
                }}
              ></View>
              <View
                style={{
                  height: 20,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 5,
                }}
              ></View>
            </View>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 60,
            width: width,
            backgroundColor: "white",
            // marginVertical: 15,
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
            onPress={() => {
              props.navigation.push("ItineraryStack", { screen: "Trip" });
            }}
            // onPress={() => {
            //   props.route.params.token !== null
            //     ? props.navigation.push("ItineraryStack", { screen: "Trip" })
            //     : setModalLogin(true);
            // }}
            style={{
              width: width - 40,
              height: 40,
            }}
            text={t("CreateNewPlan")}
          />
        </View>
      </SkeletonPlaceholder>
    );
  }

  if (rData?.length < 1) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_Refresh}
              tintColor={"#209fae"}
            />
          }
        >
          <View
            style={{
              height: height - 250,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Text
              size="title"
              type={"bold"}
              style={{ width: "70%", textAlign: "center" }}
            >
              {t("empty")}
            </Text>
            <Kosong height={width * 0.6} width={width} />
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 60,
            width: width,
            backgroundColor: "white",
            // marginVertical: 15,
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
            onPress={() => {
              props.navigation.push("ItineraryStack", { screen: "Trip" });
            }}
            // onPress={() => {
            //   props.route.params.token !== null
            //     ? props.navigation.push("ItineraryStack", { screen: "Trip" })
            //     : setModalLogin(true);
            // }}
            style={{
              width: width - 40,
              height: 40,
            }}
            text={t("CreateNewPlan")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_Refresh}
            tintColor={"#209fae"}
          />
        }
        style={{ flex: 1, marginBottom: 20 }}
      >
        <CardItinerary
          data={rData}
          props={props}
          token={token}
          setting={setting}
          setData={(e) => setData(e)}
        />
      </ScrollView>
      <View
        style={{
          zIndex: 999,
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 60,
          width: Dimensions.get("window").width,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderColor: "#F0F0F1",
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
          onPress={() => {
            props.navigation.push("ItineraryStack", { screen: "Trip" });
          }}
          style={{
            width: width - 40,
            height: 40,
          }}
          text={t("CreateNewPlan")}
        />
      </View>
    </SafeAreaView>
  );
}
