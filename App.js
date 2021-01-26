import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import MainStackNavigator from "./src/navigation";
import { ApolloProvider } from "@apollo/react-hooks";
import { default as ApolloClient } from "apollo-boost";
import messaging from "@react-native-firebase/messaging";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, END_POINT_NOTIFY } from "./src/config";
import "./src/i18n";
import { mascot_black } from "./src/assets/png";
import { SafeAreaView, Image, Dimensions } from "react-native";

function App() {
	const { width } = Dimensions.get("screen");
	let [accessToken, setAccessToken] = useState(null);
	let [appLoading, setAppLoading] = useState(true);
	const client = new ApolloClient({
		uri: API,
	});

	const checkPermission = async () => {
		const enabled = await messaging().hasPermission();
		if (enabled && enabled !== -1) {
			await getToken();
		} else {
			await requestPermission();
		}
	};

	const getToken = async () => {
		let fcmToken = await AsyncStorage.getItem("FCM_TOKEN");
		console.log("FCM_TOKEN", fcmToken);
		if (!fcmToken) {
			await messaging().registerDeviceForRemoteMessages();
			fcmToken = await messaging().getToken();
			if (fcmToken) {
				await fetch(END_POINT_NOTIFY, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						token: fcmToken,
					}),
				});
				await AsyncStorage.setItem("FCM_TOKEN", fcmToken);
			}
		}
	};

	const requestPermission = async () => {
		try {
			await messaging().requestPermission();
			await getToken();
		} catch (error) {
			console.log("permission rejected");
		}
	};

	const initializeFunction = async () => {
		token = await AsyncStorage.getItem("access_token");
		await setAccessToken(token);
		await setAppLoading(false);
	};

	useEffect(() => {
		checkPermission();
		initializeFunction();
		messaging().onMessage((notification) => {
			console.log("FG_NF", notification);
		});

		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			console.log("BG_NF", remoteMessage);
		});
		SplashScreen.hide();
	}, []);

	if (appLoading) {
		return (
			<SafeAreaView
				style={{
					flex: 1,
					backgroundColor: "#FFF",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Image
					style={{
						resizeMode: "contain",
						width: width / 1.5,
						height: width / 1.5,
					}}
					source={mascot_black}
				/>
			</SafeAreaView>
		);
	}

	return (
		<ApolloProvider client={client}>
			<MainStackNavigator authorizeToken={accessToken} />
		</ApolloProvider>
	);
}
export default App;
