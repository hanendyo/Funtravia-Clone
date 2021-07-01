import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Svg, { Path } from "react-native-svg";
import { ASSETS_SERVER } from "../../../config";
import StickerScreen from "./StickerScreen";
const Tab = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get("screen");

const Recent = () => {
	return (
		<Svg
			width="20"
			height="20"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1Z"
				stroke="#DADADA"
			/>
			<Path d="M4 7.65631H8.66667V8.65631H4V7.65631Z" fill="#DADADA" />
			<Path d="M7.66602 2H8.66602V8.31267H7.66602V2Z" fill="#DADADA" />
		</Svg>
	);
};

const Star = () => {
	return (
		<Svg
			width="20"
			height="20"
			viewBox="0 0 16 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M9.16499 1.22588C8.68755 0.261734 7.31245 0.261733 6.83501 1.22588L5.38212 4.15989C5.33843 4.24812 5.25423 4.3093 5.15681 4.32359L1.91743 4.79871C0.852938 4.95484 0.428005 6.26265 1.19743 7.01465L3.53887 9.30309C3.60928 9.37191 3.64145 9.4709 3.62493 9.56796L3.07578 12.7956C2.89532 13.8563 4.0078 14.6645 4.96077 14.1651L7.86075 12.6455C7.94796 12.5998 8.05204 12.5998 8.13925 12.6455L11.0392 14.1651C11.9922 14.6645 13.1047 13.8563 12.9242 12.7956L12.3751 9.56796C12.3586 9.4709 12.3907 9.37191 12.4611 9.30309L14.8026 7.01465C15.572 6.26265 15.1471 4.95484 14.0826 4.79871L10.8432 4.32359C10.7458 4.3093 10.6616 4.24812 10.6179 4.15989L9.16499 1.22588Z"
				stroke="#D1D1D1"
			/>
		</Svg>
	);
};

export default function StickerModal({ visible, setVisible }) {
	const [tabData, setTabData] = useState([
		{ key: "recent", icon: <Recent /> },
		{ key: "favorite", icon: <Star /> },
	]);

	const getListSticker = async () => {
		let data = await fetch(`${ASSETS_SERVER}/list_icon/sticker`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		let dataJson = await data.json();
		console.log(dataJson);
	};

	useEffect(() => {
		getListSticker();
	}, []);

	return (
		<View
			style={{
				backgroundColor: "rgba(0,0,0,0)",
				justifyContent: "flex-end",
				flex: 1,
			}}
		>
			<View
				style={{
					width: width,
					height: (width * 2) / 3,
					backgroundColor: "white",
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.25,
					shadowRadius: 3.84,

					elevation: 5,
				}}
			>
				<Tab.Navigator
					tabBarOptions={{
						indicatorStyle: { backgroundColor: "#209FAE" },
						tabStyle: { width: width / 10 },
					}}
				>
					{tabData.map((data, index) => {
						return (
							<Tab.Screen
								key={data.key + "_" + index}
								name={data.key}
								component={StickerScreen}
								options={{
									tabBarLabel: () => data.icon,
								}}
							/>
						);
					})}
				</Tab.Navigator>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		height: 100,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		backgroundColor: "#FFF",
	},
	label: {
		fontSize: 14,
		color: "#464646",
		fontFamily: "Lato-Bold",
	},
	labelActive: {
		fontSize: 14,
		color: "#209FAE",
		fontFamily: "Lato-Bold",
	},
	tab: {
		elevation: 1,
		shadowOpacity: 0.5,
		backgroundColor: "#FFF",
		height: 50,
	},
	indicator: { backgroundColor: "#209FAE", height: 3 },
});
