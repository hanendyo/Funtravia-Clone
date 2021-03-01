import React from "react";
import { useState } from "react";
import {
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Dimensions,
	StatusBar,
	Image,
} from "react-native";
import WorldMap from "./src/world/world.svg";
import Europe from "./src/world/europe.svg";
import Asia from "./src/world/asia.svg";
import Australia from "./src/world/australia.svg";
import NortAmerica from "./src/world/north_america.svg";
import SouthAmerica from "./src/world/south_america.svg";
import Africa from "./src/world/africa.svg";
import { Text } from "../../component";
import { View } from "native-base";
import { SvgCss } from "react-native-svg";
export default function World({ navigation }) {
	const { width, height } = Dimensions.get("screen");
	const data = [
		{
			name: "Europe",
			screen: "Europe",
			count: 50,
			map: <Europe width={width / 2 - 40} height={width / 2 - 80} />,
		},
		{
			name: "Asia",
			screen: "Asia",
			count: 50,
			map: <Asia width={width / 2 - 40} height={width / 2 - 80} />,
		},
		{
			name: "Australia",
			screen: "Australia",
			count: 6,
			map: <Australia width={width / 2 - 40} height={width / 2 - 80} />,
		},
		{
			name: "North America",
			screen: "NorthAmerica",
			count: 31,
			map: <NortAmerica width={width / 2 - 40} height={width / 2 - 80} />,
		},
		{
			name: "South America",
			screen: "SouthAmerica",
			count: 21,
			map: <SouthAmerica width={width / 2 - 40} height={width / 2 - 80} />,
		},
		{
			name: "Africa",
			screen: "Africa",
			count: 54,
			map: <Africa width={width / 2 - 40} height={width / 2 - 80} />,
		},
	];
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
			<StatusBar backgroundColor="#14646E" barStyle="dark-content" />
			<FlatList
				key="world"
				data={data}
				numColumns={2}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={() => (
					<View
						style={{
							padding: 20,
							alignItems: "center",
							backgroundColor: "#FFF",
						}}
					>
						<Text type="bold" size="title">
							World Tourism
						</Text>
						<Text type="regular" size="label">
							Get closer to your perfect destination
						</Text>
						<View style={{ marginVertical: 30 }}>
							<WorldMap width={width - 30} height={width / 2 - 50} />
						</View>
						<Text
							type="regular"
							size="label"
							style={{ marginHorizontal: width / 6, textAlign: "center" }}
						>
							Choose your destination. Pick the best place for your holiday.
						</Text>
					</View>
				)}
				contentContainerStyle={{ alignItems: "center" }}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => navigation.navigate(item.screen)}
						style={{
							padding: 5,
							borderWidth: 1,
							borderColor: "#209FAE",
							borderRadius: 10,
							margin: 5,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#FFF",
						}}
					>
						{item.map}
						<View style={{ position: "absolute" }}>
							<Text
								type="bold"
								size="title"
								style={{
									color: "#464646",
									textAlign: "center",
								}}
							>{`${item.name}`}</Text>
							<Text
								type="regular"
								size="label"
								style={{
									color: "#464646",
									textAlign: "center",
								}}
							>{`${item.count} Country`}</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
		</SafeAreaView>
	);
}
