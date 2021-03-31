import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import MainStackNavigator from "./src/navigation";
import { ApolloProvider } from "@apollo/client";
import messaging from "@react-native-firebase/messaging";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, END_POINT_NOTIFY, END_POINT_INFO } from "./src/config";
import { mascot_black } from "./src/assets/png";
import { SafeAreaView, Image, Dimensions, Alert } from "react-native";
import "./src/i18n";
import { useTranslation } from "react-i18next";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

PushNotification.configure({
	onRegister: function (token) {
		console.log("TOKEN:", token);
	},
	onNotification: function (notification) {
		console.log("NOTIFICATION:", notification);
		notification.finish(PushNotificationIOS.FetchResult.NoData);
	},
	onAction: function (notification) {
		console.log("ACTION:", notification.action);
		console.log("NOTIFICATION:", notification);
	},
	onRegistrationError: function (err) {
		console.error(err.message, err);
	},
	permissions: {
		alert: true,
		badge: true,
		sound: true,
	},
	popInitialNotification: true,
	requestPermissions: true,
});

function App() {
	const { t, i18n } = useTranslation();
	const { width } = Dimensions.get("screen");
	let [authStat, setAuthStat] = useState(null);
	let [appLoading, setAppLoading] = useState(true);
	let [appToken, setAppToken] = useState(null);

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
		let setting = await AsyncStorage.getItem("setting_language");
		await i18n.changeLanguage(setting);
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
		setAppToken(token);
		let result = await fetch(END_POINT_INFO, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		let resultData = await result.json();
		if (resultData.status) {
			await setAuthStat(true);
		} else {
			await AsyncStorage.removeItem("access_token");
		}
		await setAppLoading(false);
	};

	useEffect(() => {
		checkPermission();
		initializeFunction();
		messaging().onMessage((dNotify) => {
			let { notification, data } = dNotify;
			PushNotification.localNotification({
				channelId: "default",
				id: 0,
				title: notification.title,
				message: notification.body,
				smallIcon: "ic_notification",
				largeIcon: "ic_notification",
				color: "red",
				playSound: true,
				soundName: "default",
				number: 1,
			});
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

	const client = new ApolloClient({
		cache: new InMemoryCache(),
		link: createUploadLink({ uri: API }),
	});

	return (
		<ApolloProvider client={client}>
			<MainStackNavigator authorizeStatus={authStat} />
		</ApolloProvider>
	);
}
export default App;
