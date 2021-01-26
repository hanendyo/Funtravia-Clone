import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Pressable } from "react-native";
import { default_image } from "../../assets/png";
import { NotificationBlue } from "../../assets/svg";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
import User_Post from "../../graphQL/Query/Profile/post";
import { useLazyQuery } from "@apollo/client";
import CountNotif from "../../graphQL/Query/Notification/CountNotif";

export default function RenderAccount({ data, token, props }) {
  const { t } = useTranslation();

  const [
    LoadPost,
    { data: datapost, loading: loadingpost, error: errorpost },
  ] = useLazyQuery(User_Post, {
    fetchPolicy: "network-only",

    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", (data) => {
      if (token) {
        LoadPost();
        NotifCount();
      }
    });
    return unsubscribe;
  }, [props.navigation]);

  const [
    NotifCount,
    { data: datanotif, loading: loadingnotif, error: errornotif },
  ] = useLazyQuery(CountNotif, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const login = () => {
    props.navigation.navigate("LoginScreen");
  };

  const signUp = () => {
    props.navigation.navigate("RegisterScreen");
  };

  const goToProfile = (target) => {
    props.navigation.navigate("ProfileTab");
  };

  const ukuran = 100;

  return (
    <View
      style={{
        width: Dimensions.get("window").width - 40,
        height: ukuran,
        borderRadius: 5,
        borderColor: "#209FAE",
        borderWidth: 1.5,
        backgroundColor: "#FFFFFF",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        shadowColor: "#6F7273",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 6,
        padding: 5,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {token !== null && token !== "" ? (
            <TouchableOpacity onPress={goToProfile}>
              <View
                style={{
                  elevation: 10,
                  shadowRadius: 20,
                  shadowColor: "gray",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  elevation: 1,
                }}
              >
                <Image
                  style={{
                    width: ukuran - 10,
                    height: ukuran - 10,
                    borderRadius: 10,

                    borderWidth: 3,
                    borderColor: "white",
                    resizeMode: "cover",
                  }}
                  source={
                    data && data.user_profile.picture
                      ? { uri: data.user_profile.picture }
                      : default_image
                  }
                />
              </View>
            </TouchableOpacity>
          ) : (
            <Image
              style={{
                width: ukuran - 10,
                height: ukuran - 10,
                borderRadius: 10,
                shadowRadius: 20,
                shadowColor: "gray",
                shadowOffset: { width: 2, height: 2 },
                borderWidth: 3,
                borderColor: "white",
                shadowOpacity: 1,
                resizeMode: "cover",
                elevation: 1,
              }}
              source={default_image}
            />
          )}
        </View>
        {token !== null && token !== "" ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              // marginLeft: 10,
              height: "100%",
              width: "100%",
              // borderWidth: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "space-around",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text size="label" type="bold" style={{ marginLeft: 10 }}>
                {data && data.user_profile.first_name
                  ? `${data.user_profile.first_name}`
                  : "User Funtravia"}
              </Text>
              {datanotif && datanotif.count_notif ? (
                <Pressable
                  onPress={() => props.navigation.navigate("Notification")}
                  style={{
                    paddingRight: 10,
                    // borderWidth: 1,
                  }}
                >
                  <NotificationBlue
                    height={25}
                    width={25}
                    color={"#1F99A7"}
                    fill={"#1F99A7"}
                  />
                  {datanotif.count_notif.count ? (
                    <View
                      style={{
                        position: "absolute",
                        left: 12,
                        top: 5,
                        backgroundColor: "#D75995",
                        padding: 2,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        // width: 20,
                        borderWidth: 1,
                        borderColor: "white",
                        height: 13,
                        borderRadius: 10,
                      }}
                    >
                      {datanotif.count_notif.count > 100 ? (
                        <Text
                          type="bold"
                          style={{ fontSize: 10, color: "white" }}
                        >
                          99+
                        </Text>
                      ) : (
                        <Text
                          type="bold"
                          style={{ fontSize: 10, color: "white" }}
                        >
                          {datanotif.count_notif.count}
                        </Text>
                      )}
                    </View>
                  ) : null}
                </Pressable>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                width: Dimensions.get("window").width,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.statView}
                onPress={() =>
                  props.navigation.navigate("myfeed", {
                    token: token,
                    datauser:
                      data && data.user_profile ? data.user_profile : null,
                    data:
                      datapost && datapost.user_post
                        ? datapost.user_post
                        : null,
                  })
                }
              >
                <Text size="description" type="bold" style={styles.statNumber}>
                  {data ? data.user_profile.count_post : 0}
                </Text>
                <Text size="small" type="regular" style={styles.statLabel}>
                  {t("post")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statView}
                onPress={() => props.navigation.navigate("TripPlaning")}
              >
                <Text size="description" type="bold" style={styles.statNumber}>
                  {data ? data.user_profile.count_my_itinerary : 0}
                </Text>
                <Text size="small" type="regular" style={styles.statLabel}>
                  {t("trip")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statView}
                onPress={() => props.navigation.navigate("FollowerPage")}
              >
                <Text size="description" type="bold" style={styles.statNumber}>
                  {data ? data.user_profile.count_follower : 0}
                </Text>
                <Text size="small" type="regular" style={styles.statLabel}>
                  {t("followers")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statView}
                onPress={() => props.navigation.navigate("FollowingPage")}
              >
                <Text size="description" type="bold" style={styles.statNumber}>
                  {data ? data.user_profile.count_following : 0}
                </Text>
                <Text size="small" type="regular" style={styles.statLabel}>
                  {t("following")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              paddingLeft: 12,
              // paddingTop: 15,
              height: "100%",
              width: "100%",
              // borderWidth: 1,
            }}
          >
            <Text size="description" type="bold">
              {t("createAnAccount")}
            </Text>
            <Text size="description" type="bold">
              {t("enjoyTheTrip")}
            </Text>
            <View
              style={{
                marginTop: 10,
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                // flexWrap: "wrap",
                // borderWidth: 1,
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => signUp()}
                style={{
                  paddingVertical: 7,
                  paddingHorizontal: 17,
                  borderRadius: 5,
                  backgroundColor: "#209fae",
                }}
              >
                <Text type="bold" size="small" style={{ color: "white" }}>
                  {t("signUp")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => login()}
                style={{
                  marginLeft: 10,
                  paddingVertical: 7,
                  paddingHorizontal: 17,
                  borderRadius: 5,
                  backgroundColor: "#D75995",
                }}
              >
                <Text type="bold" size="small" style={{ color: "white" }}>
                  {t("signIn")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountButton: {
    width: Dimensions.get("window").width / 4,
    borderRadius: 5,
    height: 30,
  },
  pointButtonView: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 20,
    width: 100,
    backgroundColor: "#B8E0E5",
    borderRadius: 5,
  },
  pointButtonStyle: {
    alignSelf: "center",
    height: "100%",
    width: "80%",
    backgroundColor: "#B8E0E5",
  },
  pointButtonText: {
    fontSize: 13,
    color: "#464646",
  },
  statNumber: {
    textAlign: "left",
    color: "#434343",
  },
  statLabel: {
    // color: '#B0B0B0',
  },
  statView: {
    width: (Dimensions.get("window").width - 30) / 6,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
