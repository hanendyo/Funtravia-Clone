import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import MainStackNavigator from "./src/navigation/MainStackNavigator";
import { ApolloProvider } from "@apollo/react-hooks";
import { default as ApolloClient } from "apollo-boost";
import messaging from "@react-native-firebase/messaging";
import { API } from "./src/config";
import "./src/i18n";

function App() {
	const [loading, setLoading] = useState(true);
	const client = new ApolloClient({
		uri: API,
	});

	useEffect(() => {
		// Assume a message-notification contains a "type" property in the data payload of the screen to open
		messaging().onNotificationOpenedApp((remoteMessage) => {
			console.log(
				"Notification caused app to open from background state:",
				remoteMessage.notification
			);
			navigation.navigate(remoteMessage.data.type);
		});

		// Check whether an initial notification is available
		messaging()
			.getInitialNotification()
			.then((remoteMessage) => {
				if (remoteMessage) {
					console.log(
						"Notification caused app to open from quit state:",
						remoteMessage.notification
					);
					setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
				}
				setLoading(false);
			});
	}, []);
	return (
		<ApolloProvider client={client}>
			<MainStackNavigator />
		</ApolloProvider>
	);
}
export default App;
