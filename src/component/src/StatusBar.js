import React from "react";
import {
	StyleSheet,
	View,
	StatusBar as RNStatusBar,
	Platform,
	SafeAreaView,
} from "react-native";

const STATUSBAR_HEIGHT = RNStatusBar.currentHeight;
export default function StatusBar({ backgroundColor, ...props }) {
	return (
		<View
			style={[
				styles.statusBar,
				{ backgroundColor: backgroundColor ? backgroundColor : "#14646e" },
			]}
		>
			<SafeAreaView>
				<RNStatusBar translucent backgroundColor={backgroundColor} {...props} />
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	statusBar: {
		height: STATUSBAR_HEIGHT,
	},
	content: {
		flex: 1,
		backgroundColor: "#33373B",
	},
});
