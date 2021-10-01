import React from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { TravelJournal, DestinationHome, EventHome } from "../../assets/svg";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";

export default function MenuNew({ props }) {
  const { t } = useTranslation();
  const { width, height } = Dimensions.get("screen");
  return (
    // <View style={styles.menuView}>
    <LinearGradient
      colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          width: (width - 20) / 3,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate("DestinationMaps")}
        >
          <DestinationHome width={normalize(50)} height={normalize(50)} />
        </TouchableOpacity>
        <Text
          type="regular"
          size="label"
          style={{
            marginTop: Platform.OS === "ios" ? 5 : -9,
            textAlign: "center",
          }}
        >
          {t("destination")}
        </Text>
      </View>
      <View
        style={{
          width: (width - 20) / 3,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate("listEventHome")}
        >
          <EventHome width={normalize(50)} height={normalize(50)} />
        </TouchableOpacity>
        <Text
          type="regular"
          size="label"
          style={{
            marginTop: Platform.OS === "ios" ? 5 : -9,
            textAlign: "center",
          }}
        >
          {t("event")}
        </Text>
      </View>
      <View
        style={{
          width: (width - 20) / 3,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate("TravelGoal")}
        >
          <TravelJournal width={normalize(50)} height={normalize(50)} />
        </TouchableOpacity>
        <Text
          type="regular"
          size="label"
          style={{
            marginTop: Platform.OS === "ios" ? 5 : -9,
            textAlign: "center",
          }}
        >
          {t("travelgoals")}
        </Text>
      </View>
    </LinearGradient>
    // </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: 75,
    height: 75,
    // backgroundColor: "#daf0f2",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 75 / 2,
    shadowColor: "#464646",
    // shadowOffset: { width: 0, height: 0.5 },
    // shadowRadius: 0.2,
    // shadowOpacity: 0.2,
    // elevation: 2,
  },
  menuView: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 15,
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
});
