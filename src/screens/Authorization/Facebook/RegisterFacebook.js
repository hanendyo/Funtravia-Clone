import React, { useState, useEffect } from "react";

import {
	Alert,
	StyleSheet,
	View,
	Platform,
	ScrollView,
	Dimensions,
	KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { facebook_vektor } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import Facebookgql from "../../../graphQL/Mutation/Register/Facebook";
import { Text, CustomImage } from "../../../component";
import { useTranslation } from "react-i18next";
import { LoginManager, AccessToken } from "react-native-fbsdk";

export default function RegisterFacebook({ navigation }) {
	const { t } = useTranslation();
	const [mutation, { loading, data, error }] = useMutation(Facebookgql);
	const facebookLogIn = async () => {
		let FB = await LoginManager.logInWithPermissions(["public_profile"]);

		let FB_Data = false;
		if (!FB.isCancelled) {
			FB_Data = await AccessToken.getCurrentAccessToken();
		}
		let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");
		let response;
		if (FB_Data) {
			response = await mutation({
				variables: { fbtoken: FB_Data.accessToken, notify: FCM_TOKEN },
			});
		}

		if (
			response.data.register_facebook.code === "200" ||
			response.data.register_facebook.code === 200
		) {
			await AsyncStorage.setItem(
				"access_token",
				response.data.register_facebook.access_token
			);
			await AsyncStorage.setItem(
				"setting",
				JSON.stringify(response.data.register_facebook.data_setting)
			);
			navigation.navigate("HomeScreen");
		} else if (
			(response.data.register_facebook.code === "400" ||
				response.data.register_facebook.code === 400) &&
			response.data.register_facebook.message === "Account Already Registered"
		) {
			Alert.alert("Failed", "Account Already Registered");
			navigation.navigate("LoginScreen");
		} else {
			Alert.alert("Failed", "Failed to Registrasi With Facebook");
			navigation.navigate("RegisterScreen");
		}
	};

	const NavigationComponent = {
		title: "",
		headerShown: true,
		headerMode: "screen",
		headerTransparent: true,
	};
	useEffect(() => {
		navigation.setOptions(NavigationComponent);
		navigation.addListener("focus", () => {
			facebookLogIn();
		});
	}, [navigation]);

	return (
		<KeyboardAvoidingView
			style={{
				flex: 1,
			}}
			behavior={Platform.OS === "ios" ? "padding" : null}
			// keyboardVerticalOffset={30}
			enabled
		>
			<ScrollView
				style={{
					paddingTop: 80,
				}}
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[1]}
			>
				<View
					style={{
						// flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<CustomImage
						customStyle={{
							alignSelf: "center",
							width: 200,
							height: 175,
						}}
						source={facebook_vektor}
					/>
					<View
						style={{
							alignItems: "center",
							justifyContent: "space-evenly",
							marginVertical: 10,
						}}
					>
						<Text size="h5" type="bold">
							{t("registerUsingFacebook")}
						</Text>
					</View>
					<View
						style={{
							alignContent: "center",
							justifyContent: "space-evenly",
							marginVertical: 10,
						}}
					>
						<Text
							numberOfLines={2}
							type="regular"
							size="small"
							style={{
								textAlign: "center",
							}}
						>
							{t("pleaseWait")}
						</Text>
						<Text
							numberOfLines={2}
							type="regular"
							size="small"
							style={{
								textAlign: "center",
							}}
						>
							{/* Click next to continue */}
						</Text>
					</View>
					<View
						style={{
							marginTop: 40,
							marginBottom: 80,
							alignItems: "center",
						}}
					>
						<Text>{`${t("loading")}...`}</Text>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		margin: 50,
		alignItems: "center",
	},
	inputTextStyle: {
		width: Dimensions.get("window").width / 1.2,
		fontSize: 14,
	},
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
		backgroundColor: "#D75995",
		borderRadius: 20,
		padding: 15,
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
