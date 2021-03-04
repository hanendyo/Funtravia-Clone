import React, { useEffect, useRef, useState } from "react";
import {
	ScrollView,
	View,
	SafeAreaView,
	StatusBar,
	Text,
	Dimensions,
} from "react-native";
export default function OtherProfiles() {
	return (
		<View>
			<View
				style={{
					backgroundColor: "#FFF",
					height: Platform.OS === "ios" ? 44 : 50,
				}}
			>
				<SafeAreaView>
					<StatusBar
						translucent
						backgroundColor={"#000"}
						barStyle="dark-content"
					/>
				</SafeAreaView>
			</View>
			<ScrollView>
				<View>
					<Text>PROFILE</Text>
				</View>
				<View>
					<Text>CONTENT</Text>
				</View>
			</ScrollView>
		</View>
	);
}
