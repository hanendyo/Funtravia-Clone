import React, { useState, useEffect } from "react";

import {
	StyleSheet,
	View,
	Platform,
	ScrollView,
	Dimensions,
	KeyboardAvoidingView,
	Alert,
	Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { google_vektor } from "../../../assets/png";
import { loading_intertwine } from "../../../assets/gif";
import { useMutation } from "@apollo/react-hooks";
import GoogleGraph from "../../../graphQL/Mutation/Login/Google";
import { useTranslation } from "react-i18next";
import { Text, CustomImage, Peringatan } from "../../../component";
import { GoogleSignin } from "@react-native-community/google-signin";

GoogleSignin.configure({
	iosClientId:
		"com.googleusercontent.apps.292367084833-rpaqs88l0pnu8lguhushrrnimpu0tnne",
	offlineAccess: false,
});
export default function LoginGoogle({ navigation }) {
	const { t, i18n } = useTranslation();

	const [mutation, { loading, data, error }] = useMutation(GoogleGraph);
	let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
	const signInWithGoogle = async () => {
		await GoogleSignin.hasPlayServices();
		await GoogleSignin.signIn();
		const result = await GoogleSignin.getTokens();
		let response;
		let pushTkn = await AsyncStorage.getItem("token");
		if (result) {
			response = await mutation({
				variables: {
					token: result.accessToken,
					pushtoken: pushTkn,
				},
			});
		}
		if (
			response.data.login_google.code === 200 ||
			response.data.login_google.code === "200"
		) {
			await AsyncStorage.setItem(
				"access_token",
				response.data.login_google.access_token
			);
			await AsyncStorage.setItem(
				"user",
				JSON.stringify(response.data.login_google.user)
			);
			await AsyncStorage.setItem(
				"setting",
				JSON.stringify(response.data.login_google.data_setting)
			);
			navigation.navigate("HomeScreen");
		} else if (
			response.data.login_google.code === 400 ||
			response.data.login_google.code === "400"
		) {
			Alert.alert("Failed", response.data.login_google.message);
			navigation.navigate("LoginScreen");
		} else {
			Alert.alert("Failed", "Failed Login With Google");
			navigation.navigate("LoginScreen");
		}
	};
	useEffect(() => {
		signInWithGoogle();
	}, []);
	return (
		<KeyboardAvoidingView
			style={{
				flex: 1,
			}}
			behavior={Platform.OS === "ios" ? "padding" : null}
			enabled
		>
			<ScrollView
				style={{
					paddingTop: 80,
				}}
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[1]}
			>
				<Peringatan
					aler={aler}
					setClose={() =>
						showAlert({ ...aler, show: false, judul: "", detail: "" })
					}
				/>
				<View
					style={{
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
						source={google_vektor}
					/>
					<View
						style={{
							alignItems: "center",
							justifyContent: "space-evenly",
							marginVertical: 10,
						}}
					>
						<Text
							style={{ fontSize: 25, fontFamily: "lato-bold" }}
							type="bold"
							size="h5"
						>
							{t("loginUsingGoogle")}
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
							style={{
								textAlign: "center",
							}}
							type="regular"
							size="description"
						>
							{t("pleaseWait")}
						</Text>

						<Image
							source={loading_intertwine}
							style={{ alignSelf: "center", width: 100, height: 100 }}
						/>
					</View>
					<View
						style={{
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
