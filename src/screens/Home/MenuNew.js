import React from "react";
import { View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { ServiceIcon, EventIcon, DestinationIcon } from "../../assets/svg";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";
import Svg, { Use, Image } from "react-native-svg";

export default function MenuNew({ props }) {
  const { t } = useTranslation();

  return (
    <View style={styles.menuView}>
      <View
        style={{
          width: "25%",
          // height: 80,
          marginBottom: 5,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate("DestinationList")}
        >
          <DestinationIcon width="40" height="40" />
        </TouchableOpacity>
        <Text
          type="bold"
          size="description"
          style={{
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {t("Destination")}
        </Text>
      </View>
      <View
        style={{
          width: "25%",
          marginBottom: 5,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate("listevent")}
        >
          <EventIcon width="55" height="55" />
        </TouchableOpacity>
        <Text
          type="bold"
          size="description"
          style={{
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {t("Event")}
        </Text>
      </View>
      <View
        style={{
          width: "25%",
          marginBottom: 5,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate("TravelGoal")}
        >
          <ServiceIcon width="50" height="50" />
        </TouchableOpacity>
        <Text
          type="bold"
          size="description"
          style={{
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {t("Travel Goal")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: 80,
    height: 80,
    backgroundColor: "#daf0f2",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 80 / 2,
  },
  menuView: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 40,
    justifyContent: "space-between",
    paddingHorizontal: 35,
  },
});
