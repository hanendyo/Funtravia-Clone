import React, { useState, useEffect } from "react";

import {
	Alert,
	StyleSheet,
	View,
	Platform,
	ScrollView,
	Dimensions,
	KeyboardAvoidingView,
	Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { facebook_vektor } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import Facebookgql from "../../../graphQL/Mutation/Register/Facebook";
import { Text, CustomImage, Errors } from "../../../component";
import { useTranslation } from "react-i18next";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { loading_intertwine } from "../../../assets/gif";

export default function RegisterFacebook({ navigation }) {
	const { t } = useTranslation();
	let [modalError, setModalError] = useState(false);
	let [message, setMessage] = useState("");
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

		if (response?.data === undefined || response?.data === "undefined") {
			setModalError(true);
			setMessage("Registration With Facebook is Failed");
			return setTimeout(() => {
				navigation.navigate("RegisterScreen");
			}, 3000);
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
			navigation.reset({
				index: 0,
				routes: [
					{
						name: "BottomStack",
						routes: [{ name: "HomeScreen" }],
					},
				],
			});
		} else if (
			(response.data.register_facebook.code === "400" ||
				response.data.register_facebook.code === 400) &&
			response.data.register_facebook.message === "Account Already Registered"
		) {
			setModalError(true);
			setMessage("Account Already Registered");
			setTimeout(() => {
				navigation.navigate("LoginScreen");
			}, 3000);
		} else {
			setModalError(true);
			setMessage("Registration With Facebook is Failed");
			setTimeout(() => {
				navigation.navigate("RegisterScreen");
			}, 3000);
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
			enabled
		>
			<Errors
				modals={modalError}
				setModals={(e) => setModalError(e)}
				message={message}
			/>
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
						<Image
							source={loading_intertwine}
							style={{
								alignSelf: "center",
								width: 100,
								height: 100,
							}}
						/>
					</View>
					<View
						style={{
							marginTop: 10,
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
