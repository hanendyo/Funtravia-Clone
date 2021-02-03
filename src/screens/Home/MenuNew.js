import React from "react";
import {
	View,
	TouchableOpacity,
	Alert,
	StyleSheet,
	Dimensions,
} from "react-native";
import { ServiceIcon, EventIcon, DestinationIcon } from "../../assets/svg";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";
import Svg, { Use, Image } from "react-native-svg";

export default function MenuNew({ props }) {
	const { t } = useTranslation();
	const { width, height } = Dimensions.get("screen");
	return (
		<View style={styles.menuView}>
			<View
				style={{
					width: (width - 50) / 3,
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
					width: "33.3%",
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
					width: "33.3%",
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
		width: 75,
		height: 75,
		backgroundColor: "#daf0f2",
		alignItems: "center",
		justifyContent: "center",
		alignContent: "center",
		borderRadius: 75 / 2,
		shadowColor: "#464646",
		shadowOffset: { width: 0, height: 0.5 },
		shadowRadius: 0.2,
		shadowOpacity: 0.2,
		elevation: 2,
	},
	menuView: {
		flexDirection: "row",
		width: "100%",
		paddingTop: 15,
		justifyContent: "space-between",
		paddingHorizontal: 30,
	},
});
