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

export default function MenuNew({ props }) {
	const { t } = useTranslation();
	const { width, height } = Dimensions.get("screen");
	return (
		// <View style={styles.menuView}>
		<LinearGradient
			colors={["rgba(255, 255, 255, 0)", "rgba(218, 240, 242, 100)"]}
			start={{ x: 0, y: 1 }}
			end={{ x: 0, y: 0 }}
			style={{
				flexDirection: "row",
				width: "100%",
				paddingTop: 15,
				justifyContent: "space-between",
				paddingHorizontal: 30,
			}}
		>
			<View
				style={{
					width: (width - 50) / 3,
					marginBottom: 5,
					alignItems: "center",
				}}
			>
				<TouchableOpacity
					style={styles.menu}
					onPress={() => props.navigation.navigate("DestinationMaps")}
				>
					<DestinationHome width="65" height="65" />
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
					width: "33.3%",
					marginBottom: 5,
					alignItems: "center",
				}}
			>
				<TouchableOpacity
					style={styles.menu}
					onPress={() => props.navigation.navigate("listevent")}
				>
					<EventHome width="65" height="65" />
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
					width: "33.3%",
					marginBottom: 5,
					alignItems: "center",
				}}
			>
				<TouchableOpacity
					style={styles.menu}
					onPress={() => props.navigation.navigate("TravelGoal")}
				>
					<TravelJournal width="65" height="65" />
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
