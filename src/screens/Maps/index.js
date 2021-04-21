import React from "react";
import { useState } from "react";
import {
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	Dimensions,
	StatusBar,
	Image,
	Alert,
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
	const HeaderHeight = (height * 34) / 100;
	const ContentHeight = (height * 66) / 100;
	const MapHeight = (ContentHeight * 22) / 100;
	const MapWidth = width / 2 - 20;
	const data = [
		{
			name: "Europe",
			screen: "Europe",
			count: 50,
			available: false,
			map: <Europe width={MapWidth} height={MapHeight} />,
		},
		{
			name: "Asia",
			screen: "Asia",
			count: 50,
			available: true,
			map: <Asia width={MapWidth} height={MapHeight} />,
		},
		{
			name: "Australia",
			screen: "Australia",
			count: 6,
			available: false,
			map: <Australia width={MapWidth} height={MapHeight} />,
		},
		{
			name: "North America",
			screen: "NorthAmerica",
			count: 31,
			available: false,
			map: <NortAmerica width={MapWidth} height={MapHeight} />,
		},
		{
			name: "South America",
			screen: "SouthAmerica",
			count: 21,
			available: false,
			map: <SouthAmerica width={MapWidth} height={MapHeight} />,
		},
		{
			name: "Africa",
			screen: "Africa",
			count: 54,
			available: false,
			map: <Africa width={MapWidth} height={MapHeight} />,
		},
	];
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
			<StatusBar backgroundColor="#14646E" barStyle="dark-content" />
			<View
				style={{
					height: HeaderHeight,
					alignItems: "center",
					backgroundColor: "#FFF",
					paddingVertical: 15,
				}}
			>
				<Text type="bold" size="title">
					World Tourism
				</Text>
				<Text type="regular" size="label">
					Get closer to your perfect destination
				</Text>
				<View style={{ marginVertical: 10 }}>
					<WorldMap width={HeaderHeight} height={HeaderHeight - 125} />
				</View>
				<Text
					type="regular"
					size="label"
					style={{ marginHorizontal: width / 6, textAlign: "center" }}
				>
					Choose your destination. Pick the best place for your holiday.
				</Text>
			</View>
			<FlatList
				key="world"
				data={data}
				numColumns={2}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					alignItems: "center",
					height: ContentHeight,
					marginVertical: 5,
				}}
				scrollEnabled={false}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							item.available
								? navigation.navigate(item.screen)
								: Alert.alert("Cooming Soon")
						}
						style={{
							borderWidth: 1,
							borderColor: "#209FAE",
							borderRadius: 5,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#FFF",
							margin: 5,
						}}
					>
						{item.map}
						{item.available ? (
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
						) : null}
						{!item.available ? (
							<View
								style={{
									position: "absolute",
									backgroundColor: "rgba(0,0,0,0.5)",
									width: "100%",
									height: "100%",
									borderRadius: 4,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text size="title" type="bold" style={{ color: "white" }}>
									Cooming Soon
								</Text>
							</View>
						) : null}
					</TouchableOpacity>
				)}
			/>
		</SafeAreaView>
	);
}
