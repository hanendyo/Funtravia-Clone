import React, { useEffect } from "react";
import {
  View,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { Kosong } from "../../../assets/svg";
import { Text, CardItinerary, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import DeviceInfo from "react-native-device-info";

export default function ActivePlan({
  token,
  props,
  AData,
  GetCount,
  GetData,
  GetDataActive,
  GetDataFinish,
  loadingdataActive,
  setDataActive,
  setting,
}) {
  const { height, width } = Dimensions.get("screen");
  const { t, i18n } = useTranslation();
  const Notch = DeviceInfo.hasNotch();

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

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
  // }, []);

  if (loadingdataActive && AData.length < 1) {
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
            height: Platform.OS === "ios" ? (Notch ? 80 : 60) : 60,
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

  if (AData?.length > 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <View
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_Refresh}
              tintColor={"#209fae"}
            />
          }
          style={{ flex: 1, paddingBottom: Platform.OS === "ios" ? 30 : 60 }}
        >
          <CardItinerary
            data={AData}
            props={props}
            token={token}
            setting={setting}
            setData={(e) => setDataActive(e)}
          />
        </View>
        <View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: Platform.OS === "ios" ? (Notch ? 80 : 60) : 60,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
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
          height: Platform.OS === "ios" ? (Notch ? 80 : 60) : 60,
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
