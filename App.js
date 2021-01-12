import * as React from "react";
import "react-native-gesture-handler";
import MainStackNavigator from "./src/navigation/MainStackNavigator";
import { ApolloProvider } from "@apollo/react-hooks";
import { default as ApolloClient } from "apollo-boost";
import { API } from "./src/config";
import "./src/i18n";

function App() {
	const client = new ApolloClient({
		uri: API,
	});
	return (
		<ApolloProvider client={client}>
			<MainStackNavigator />
		</ApolloProvider>
	);
}
export default App;
