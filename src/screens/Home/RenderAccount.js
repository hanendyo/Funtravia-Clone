import React from "react";
import { View, StyleSheet, Dimensions, Image, Pressable } from "react-native";
import { default_image } from "../../assets/png";
import { NotificationBlue } from "../../assets/svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";

export default function RenderAccount({ data, token, props }) {
  const { t } = useTranslation();

  const login = () => {
    props.navigation.navigate("login");
  };

  const signUp = () => {
    props.navigation.navigate("register");
  };

  const goToProfile = (target) => {
    props.navigation.navigate("ProfileTab");
  };
  return (
    <View
      style={{
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.14,
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
      }}
    >
      <View
        style={{
          width: Dimensions.get("window").width * 0.85,
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
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
                }}
              >
                <Image
                  style={{
                    width: Dimensions.get("window").width / 5 + 10,
                    height: Dimensions.get("window").width / 5 + 10,
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
                width: Dimensions.get("window").width / 5 + 10,
                height: Dimensions.get("window").width / 5 + 10,
                borderRadius: 10,
                shadowRadius: 20,
                shadowColor: "gray",
                shadowOffset: { width: 2, height: 2 },
                borderWidth: 3,
                borderColor: "white",
                shadowOpacity: 1,
                resizeMode: "cover",
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
              marginLeft: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "space-around",
                width: "100%",
              }}
            >
              <Text size="label" type="bold" style={{ marginLeft: 10 }}>
                {data && data.user_profile.first_name
                  ? `${data.user_profile.first_name}`
                  : "User Funtravia"}
              </Text>

              <Pressable
                onPress={() => props.navigation.navigate("Inbox")}
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  right: 0,
                }}
              >
                <View>
                  <NotificationBlue
                    height={20}
                    width={20}
                    color={"#1F99A7"}
                    fill={"#1F99A7"}
                  />
                </View>
              </Pressable>
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
                onPress={() => props.navigation.navigate("Post")}
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
              paddingTop: 15,
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
                flexWrap: "wrap",
                width: Dimensions.get("window").width / 1.4,
              }}
            >
              <Button
                size="small"
                type="box"
                color="primary"
                onPress={signUp}
                text={t("signUp")}
                style={{
                  marginRight: 5,
                }}
              />
              <Button
                size="small"
                type="box"
                color="secondary"
                onPress={login}
                text={t("signIn")}
                style={{ marginLeft: 5 }}
              />
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
