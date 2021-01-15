import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import MainStackNavigator from "./src/navigation";
import { ApolloProvider } from "@apollo/react-hooks";
import { default as ApolloClient } from "apollo-boost";
import messaging from "@react-native-firebase/messaging";
import SplashScreen from "react-native-splash-screen";
import { API } from "./src/config";
import "./src/i18n";

function App() {
	const [loading, setLoading] = useState(true);
	const [accessToken, setAccessToken] = useState(null);
	const client = new ApolloClient({
		uri: API,
	});

	const initializeFunction = async () => {
		await messaging().onNotificationOpenedApp((remoteMessage) => {
			console.log("Background", remoteMessage.notification);
			navigation.navigate(remoteMessage.data.type);
		});

		await messaging()
			.getInitialNotification()
			.then((remoteMessage) => {
				if (remoteMessage) {
					console.log("Open", remoteMessage.notification);
					setInitialRoute(remoteMessage.data.type);
				}
			});
		await setLoading(false);
		await SplashScreen.hide();
	};

	useEffect(() => {
		initializeFunction();
	}, []);

	return (
		<ApolloProvider client={client}>
			<MainStackNavigator authorizeToken={accessToken} />
		</ApolloProvider>
	);
}
export default App;
