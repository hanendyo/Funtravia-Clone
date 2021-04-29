import React from "react";
import {
	View,
	Image,
	ScrollView,
	SafeAreaView,
	Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
const dimensions = Dimensions.get("window");
const barWidth = dimensions.width - 60;
import { Text } from "../../../component";
export default function GreatFor({ data, tittle }) {
	return (
		<SafeAreaView style={{ marginBottom: 10 }}>
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
						marginVertical: 10,
						paddingLeft: 20,
						color: "#FFFFFF",
					}}
				>
					{tittle}
				</Text>
			</LinearGradient>
			<ScrollView horizontal scrollEnabled style={{ marginHorizontal: 20 }}>
				{data && data.length
					? data.map((i, index) => {
							return (
								<View
									key={index}
									style={{
										marginRight: 5,
										marginVertical: 5,
										// backgroundColor: '#f9f9f9',
										paddingHorizontal: 10,
										paddingVertical: 10,
										borderRadius: 10,
									}}
								>
									<Image
										source={i.icon}
										style={{
											width: 35,
											height: 35,
											alignSelf: "center",
											resizeMode: "contain",
										}}
									/>
								</View>
							);
					  })
					: null}
			</ScrollView>
		</SafeAreaView>
	);
}
