import React from "react";
import { View, Image, SafeAreaView, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Text, FunImage } from "../../../component";
import { useTranslation } from "react-i18next";
const imgSize = Dimensions.get("window").width / 3;
const dimensions = Dimensions.get("window");
const barWidth = dimensions.width - 60;

export default function OtherDestination({ tittle, data }) {
	const { t, i18n } = useTranslation();

	const destinationImage = [];
	if (data && data.length) {
		destinationImage.push(data[0]);
	}
	if (data && data.length >= 2) {
		destinationImage.push(data[1]);
	}
	return (
		<View style={{ paddingBottom: 20 }}>
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
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					marginHorizontal: 20,
					marginBottom: 20,
				}}
			>
				{destinationImage && destinationImage.length
					? destinationImage.map((i, index) => {
							return (
								<View>
									<FunImage
										key={index}
										source={{ uri: i.image }}
										style={{
											width: imgSize,
											height: imgSize,
											borderRadius: 10,
											marginBottom: 5,
											marginRight: 10,
											resizeMode: "cover",
										}}
									/>
									<FunImage
										key={index}
										source={{ uri: i.image }}
										style={{
											width: imgSize,
											height: imgSize,
											borderRadius: 10,
											marginTop: 5,
											marginRight: 10,
											resizeMode: "cover",
										}}
									/>
								</View>
							);
					  })
					: null}
			</View>
			<TouchableOpacity style={{ zIndex: 999 }}>
				<Text
					style={{
						color: "#209FAE",
						marginHorizontal: 20,
					}}
					size="label"
					type="bold"
				>
					{`${t("seeMorePhotos")} >`}
				</Text>
			</TouchableOpacity>
		</View>
	);
}
