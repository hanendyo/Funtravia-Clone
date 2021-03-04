import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Pressable } from "react-native";
import { default_image, DefaultProfileSquare } from "../../assets/png";
import { NotificationBlue } from "../../assets/svg";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
import User_Post from "../../graphQL/Query/Profile/post";
import { useLazyQuery } from "@apollo/client";
// import CountNotif from "../../graphQL/Query/Notification/CountNotif";

export default function RenderAccount({ data, token, props, datanotif }) {
  const { t } = useTranslation();

  const [
    LoadPost,
    { data: datapost, loading: loadingpost, error: errorpost },
  ] = useLazyQuery(User_Post, {
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
        // NotifCount();
      }
    });
    return unsubscribe;
  }, [props.navigation]);

  const login = () => {
    props.navigation.navigate("AuthStack", { screen: "LoginScreen" });
  };

  const signUp = () => {
    props.navigation.navigate("AuthStack", { screen: "RegisterScreen" });
  };

  const goToProfile = (target) => {
    props.navigation.navigate("ProfileStack", {
      screen: "ProfileTab",
      params: { token: token },
    });
  };

  const ukuran = 100;

  return (
    <View
      style={{
        width: Dimensions.get("window").width - 40,
        height: ukuran,
        borderRadius: 5,
        borderColor: "#209FAE",
        borderWidth: 1,
        backgroundColor: "#FFFFFF",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        shadowColor: "#6F7273",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 6,
        padding: 10,
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
            <TouchableOpacity
              onPress={goToProfile}
              style={{
                elevation: 2,
                shadowColor: "#464646",
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 0.5,
                shadowOpacity: 0.5,
                borderRadius: 10,
              }}
            >
              <Image
                style={{
                  width: ukuran - 15,
                  height: ukuran - 15,
                  borderRadius: 10,
                  borderWidth: 3,
                  borderColor: "#fff",
                  resizeMode: "cover",
                }}
                // defaultSource={DefaultProfileSquare}
                source={
                  data && data.user_profile.picture
                    ? { uri: data.user_profile.picture }
                    : DefaultProfileSquare
                }
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                elevation: 2,
                shadowColor: "#464646",
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 0.5,
                shadowOpacity: 0.5,
                borderRadius: 10,
              }}
            >
              <Image
                style={{
                  width: ukuran - 15,
                  height: ukuran - 15,
                  borderRadius: 10,
                  resizeMode: "cover",
                  borderWidth: 3,
                  borderColor: "white",
                }}
                defaultSource={DefaultProfileSquare}
                source={DefaultProfileSquare}
              />
            </TouchableOpacity>
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
              <Text size="label" type="black" style={{ marginLeft: 10 }}>
                {data && data.user_profile.first_name
                  ? `${data.user_profile.first_name}`
                  : "User Funtravia"}
                {data && data.user_profile.last_name
                  ? ` ${data.user_profile.last_name}`
                  : null}
              </Text>
              <Pressable
                onPress={() => props.navigation.navigate("Notification")}
                style={{
                  paddingRight: 10,
                }}
              >
                <NotificationBlue
                  height={20}
                  width={20}
                  color={"#1F99A7"}
                  fill={"#1F99A7"}
                  style={{
                    shadowColor: "#464646",
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowRadius: 0.2,
                    shadowOpacity: 0.2,
                  }}
                />
                {datanotif && datanotif.count_notif.count > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      right: 5,
                      backgroundColor: "#D75995",
                      minWidth: 14,
                      borderWidth: 0.5,
                      borderColor: "white",
                      height: 14,
                      borderRadius: 7,
                    }}
                  >
                    {datanotif.count_notif.count > 100 ? (
                      <Text
                        type="bold"
                        style={{
                          fontSize: 10,
                          color: "white",
                          alignSelf: "center",
                          paddingHorizontal: 2,
                        }}
                      >
                        99+
                      </Text>
                    ) : (
                      <Text
                        type="bold"
                        style={{
                          fontSize: 10,
                          color: "white",
                          alignSelf: "center",
                          paddingHorizontal: 2,
                        }}
                      >
                        {datanotif.count_notif.count}
                      </Text>
                    )}
                  </View>
                ) : null}
              </Pressable>
              {/* ) : null} */}
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
                <Text size="label" type="black" style={styles.statNumber}>
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
                <Text size="label" type="black" style={styles.statNumber}>
                  {data ? data.user_profile.count_my_itinerary : 0}
                </Text>
                <Text size="small" type="regular" style={styles.statLabel}>
                  {t("trip")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statView}
                onPress={() =>
                  props.navigation.navigate("ProfileStack", {
                    screen: "FollowerPage",
                  })
                }
              >
                <Text size="label" type="black" style={styles.statNumber}>
                  {data ? data.user_profile.count_follower : 0}
                </Text>
                <Text size="small" type="regular" style={styles.statLabel}>
                  {t("followers")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statView}
                onPress={() =>
                  props.navigation.navigate("ProfileStack", {
                    screen: "FollowingPage",
                  })
                }
              >
                <Text size="label" type="black" style={styles.statNumber}>
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
              paddingTop: 5,
              height: "100%",
              width: "100%",
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
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => signUp()}
                style={{
                  paddingVertical: 7,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  backgroundColor: "#209fae",
                }}
              >
                <Text type="bold" style={{ color: "#FFF" }}>
                  {t("signUp")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => login()}
                style={{
                  marginLeft: 10,
                  paddingVertical: 7,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  backgroundColor: "#D75995",
                }}
              >
                <Text type="bold" style={{ color: "#FFF" }}>
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
