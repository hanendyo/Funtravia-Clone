import React from "react";
import { View, Dimensions } from "react-native";
import Ripple from "react-native-material-ripple";
import Text from "./Text";

export default function Tabs({ data, updateState, activeTab, containerStyle }) {
	const { width, height } = Dimensions.get("screen");
	return (
		<View>
			<View
				style={{
					...containerStyle,
					flexDirection: "row",
					borderColor: "#EEEEEE",
				}}
			>
				{data.map((value, index) => {
					return (
						<Ripple
							key={index}
							onPress={() => {
								updateState(value.alias);
							}}
							style={{
								width: width / data.length,
								alignContent: "center",
								alignItems: "center",
								borderBottomWidth: activeTab == value.alias ? 3 : 1,
								borderBottomColor:
									activeTab == value.alias ? "#209FAE" : "#EEEEEE",
								paddingVertical: 15,
								backgroundColor: "#FFFFFF",
								paddingHorizontal: 25,
							}}
						>
							<Text
								size="label"
								type={activeTab == value.alias ? "bold" : "bold"}
								style={{
									color: activeTab == value.alias ? "#209FAE" : "#464646",
								}}
							>
								{value.title}
							</Text>
						</Ripple>
					);
				})}
			</View>
		</View>
	);
}
