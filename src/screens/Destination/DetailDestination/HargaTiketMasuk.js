import React from "react";
import { View, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
type Props = {
	tittle: String,
	content: String,
	handleVisibility: () => void,
};
const dimensions = Dimensions.get("window");
const barWidth = dimensions.width - 60;
import { useTranslation } from "react-i18next";
import { Text } from "../../../component";
export default function HargaTiketMasuk({ tittle, weekday, weekend }) {
	const { t, i18n } = useTranslation();

	return (
		<View style={{ marginBottom: 20 }}>
			<LinearGradient
				colors={["rgba(032, 159, 174,0.8)", "rgb(255, 255, 255)"]}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 1 }}
				style={{
					width: barWidth,
					marginLeft: 5,
					marginBottom: 10,
				}}
			>
				<Text
					size="title"
					type="bold"
					style={{
						// fontSize: (18),
						marginVertical: 10,
						paddingLeft: 20,
						// fontFamily: "Lato-Bold",
						color: "#FFFFFF",
					}}
				>
					{tittle}
				</Text>
			</LinearGradient>
			<View style={{ marginHorizontal: 20 }}>
				<Text
					type="regular"
					size="description"
					style={{
						textAlign: "justify",
						// fontFamily: "Lato-Regular",
						// fontSize: (13),
						color: "#464646",
						marginVertical: 5,
					}}
				>
					{`${t("weekday")}: ${weekday}`}
				</Text>
				<Text
					type="regular"
					size="description"
					style={{
						textAlign: "justify",
						// fontFamily: "Lato-Regular",
						// fontSize: (13),
						color: "#464646",
						marginVertical: 5,
					}}
				>
					{`${t("weekend")} : ${weekend}`}
				</Text>
			</View>
		</View>
	);
}
