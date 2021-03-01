import React from "react";
import { useState } from "react";
import { SafeAreaView, FlatList, TouchableOpacity, View } from "react-native";
import Maps from "./maps";
import { Text } from "../../../../../component";
export default function Australia() {
	const [changeColor, setChangeColor] = useState("#209FAE");
	const [defaultColor, setDefaultColor] = useState("#DAF0F2");
	const [change, setChange] = useState(null);
	const data = [
		{ id: "south", label: "South Asia" },
		{ id: "southeast", label: "Southeast Asia" },
		{ id: "north", label: "North Asia" },
		{ id: "east", label: "East Asia" },
		{ id: "western", label: "Western Asia" },
		{ id: "all", label: "All" },
	];
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ backgroundColor: "#FFF" }}>
				<Maps
					changeId={change}
					colorChange={changeColor}
					defaultColor={defaultColor}
					setChange={(id) => setChange(id)}
				/>
			</View>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					marginHorizontal: 15,
					padding: 5,
					alignItems: "center",
					borderWidth: 1,
					borderColor: "#D1D1D1",
					backgroundColor: "#FFF",
					borderRadius: 5,
					margin: 10,
				}}
			>
				{data.map((item, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => setChange(item.id)}
						style={{
							backgroundColor: change === item.id ? "#209FAE" : "#FFF",
							borderWidth: 0.5,
							borderColor: change === item.id ? "#209FAE" : "#D1D1D1",
							paddingVertical: 8,
							paddingHorizontal: 15,
							borderRadius: 5,
							margin: 5,
						}}
					>
						<Text
							type="bold"
							size="description"
							style={{
								color: change === item.id ? "#FFF" : "#464646",
							}}
						>{`${item.label}`}</Text>
					</TouchableOpacity>
				))}
			</View>
			{/* <FlatList
				data={data}
				horizontal
				renderItem={({ item }) => (

				)}
			/> */}
		</SafeAreaView>
	);
}
