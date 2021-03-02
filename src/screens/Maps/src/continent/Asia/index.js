import React from "react";
import { useState } from "react";
import { SafeAreaView, FlatList, TouchableOpacity, View } from "react-native";
import Maps from "./maps";
import { Country } from "../../../data/country";
import { Text } from "../../../../../component";
export default function Asia() {
	const [changeColor, setChangeColor] = useState("#209FAE");
	const [defaultColor, setDefaultColor] = useState("#DAF0F2");
	const [subContinent, setSubContinent] = useState({});
	const subContinentData = [
		{ id: "035", label: "South-eastern Asia" },
		{ id: "143", label: "Central Asia" },
		{ id: "034", label: "Southern Asia" },
		{ id: "030", label: "Eastern Asia" },
		{ id: "145", label: "Western Asia" },
		{ id: "142", label: "All" },
	];

	const getCountry = (data) => {
		if (subContinent.id === "142") {
			return data["region-code"] === subContinent.id;
		} else {
			return data["sub-region-code"] === subContinent.id;
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ backgroundColor: "#FFF" }}>
				<Maps
					subContinent={subContinent}
					colorChange={changeColor}
					defaultColor={defaultColor}
					setChange={(data) => setSubContinent(data)}
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
				{subContinentData.map((item, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => setSubContinent(item)}
						style={{
							backgroundColor: subContinent.id === item.id ? "#209FAE" : "#FFF",
							borderWidth: 0.5,
							borderColor: subContinent.id === item.id ? "#209FAE" : "#D1D1D1",
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
								color: subContinent.id === item.id ? "#FFF" : "#464646",
							}}
						>{`${item.label}`}</Text>
					</TouchableOpacity>
				))}
			</View>
			<FlatList
				data={Country.filter(getCountry)}
				renderItem={({ item }) => (
					<View
						style={{
							paddingVertical: 15,
							paddingHorizontal: 15,
							backgroundColor: "#FFF",
							marginVertical: 5,
							borderRadius: 5,
						}}
					>
						<Text>{item.name}</Text>
					</View>
				)}
				contentContainerStyle={{ marginHorizontal: 15 }}
			/>
		</SafeAreaView>
	);
}
