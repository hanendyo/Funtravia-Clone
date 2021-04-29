import React from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Linking,
	Platform,
	Dimensions,
} from "react-native";
import { IconMaps, Address } from "../../../assets/png";
import LinearGradient from "react-native-linear-gradient";
const dimensions = Dimensions.get("window");
const barWidth = dimensions.width - 60;
import { useTranslation } from "react-i18next";
import { Text } from "../../../component";

export default function DetailLokasi({ tittle, data }) {
	const { t, i18n } = useTranslation();

	const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
	const latLng = `${data ? data.latitude : null},${
		data ? data.longitude : null
	}`;
	const label = "Custom Label";
	const url = Platform.select({
		ios: `${scheme}${label}@${latLng}`,
		android: `${scheme}${latLng}(${label})`,
	});

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
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<Image
						source={Address}
						style={{
							width: 15,
							height: 15,
							alignSelf: "center",
							marginHorizontal: 5,
						}}
					/>
					<Text
						type="regular"
						size="description"
						style={{
							// fontSize: (13),
							paddingHorizontal: 5,
							color: "#464646",
							// fontFamily: "Lato-Regular",
						}}
					>
						{data ? data.address : null}
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => Linking.openURL(url)}
					style={{
						flexDirection: "row",
						marginVertical: 5,
					}}
				>
					<Image
						source={IconMaps}
						style={{
							width: 15,
							height: 15,
							alignSelf: "center",
							marginHorizontal: 5,
						}}
					/>
					<Text
						type="regular"
						size="description"
						style={{
							// fontSize: (13),
							paddingHorizontal: 5,
							color: "#464646",
							// fontFamily: "Lato-Regular",
						}}
					>
						{t("viewMap")}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
