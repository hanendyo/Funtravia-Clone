import React from "react";
import {
	Modal,
	Picker,
	View,
	StyleSheet,
	Dimensions,
	Platform,
	TouchableOpacity,
	Text,
} from "react-native";
const DurationValue = [
	{ name: "1 Hours", code: "1" },
	{ name: "2 Hours", code: "2" },
	{ name: "3 Hours", code: "3" },
	{ name: "4 Hours", code: "4" },
	{ name: "5 Hours", code: "5" },
	{ name: "6 Hours", code: "6" },
	{ name: "7 Hours", code: "7" },
	{ name: "8 Hours", code: "8" },
	{ name: "9 Hours", code: "9" },
	{ name: "10 Hours", code: "10" },
	{ name: "11 Hours", code: "11" },
	{ name: "12 Hours", code: "12" },
	// { name: '13 Hours', code: '13' },
	// { name: '14 Hours', code: '14' },
	// { name: '15 Hours', code: '15' },
	// { name: '16 Hours', code: '16' },
	// { name: '17 Hours', code: '17' },
	// { name: '18 Hours', code: '18' },
	// { name: '19 Hours', code: '19' },
	// { name: '20 Hours', code: '20' },
	// { name: '21 Hours', code: '21' },
	// { name: '22 Hours', code: '22' },
	// { name: '23 Hours', code: '23' },
];
export default function DurationSelector({ show, close, callBack, value }) {
	const screen = Dimensions.get("screen");
	const styles = StyleSheet.create({
		centeredView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			marginTop: 22,
		},
		modalView: {
			margin: 20,
			backgroundColor: "white",
			borderRadius: 20,
			padding: 35,
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
		openButton: {
			backgroundColor: "#F194FF",
			borderRadius: 20,
			padding: 10,
			elevation: 2,
		},
		textStyle: {
			color: "white",
			fontWeight: "bold",
			textAlign: "center",
		},
		modalText: {
			marginBottom: 15,
			textAlign: "center",
		},
	});
	return (
		<View style={styles.centeredView}>
			<Modal animationType="slide" transparent={true} visible={show}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={{ color: "black", fontWeight: "500", fontSize: 20 }}>
							Select Duration
						</Text>
						<Picker
							selectedValue={value}
							style={{
								height: Platform.OS === "ios" ? screen.height / 3 : 75,
								width: screen.width / 1.5,
							}}
							onValueChange={(itemValue, itemIndex) => callBack(itemValue)}
						>
							{DurationValue.map((value, index) => {
								return (
									<Picker.Item
										key={index}
										label={value.name}
										value={value.code}
									/>
								);
							})}
						</Picker>
						<TouchableOpacity
							onPress={close}
							style={{
								paddingHorizontal: 25,
								paddingVertical: 10,
								backgroundColor: "#D75995",
								borderRadius: 5,
							}}
						>
							<Text style={{ color: "white" }}>Select</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}
