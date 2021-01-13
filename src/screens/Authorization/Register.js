import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Dimensions,
	Alert,
	ScrollView,
	Platform,
	TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@apollo/react-hooks";
import {
	mascot_black,
	show_password,
	hide_password,
	logo_google,
	logo_facebook,
} from "../../assets/png";
import Email from "../../graphQL/Mutation/Register/Email";
import {
	Text,
	Button,
	CustomImage,
	FloatingInput,
	Peringatan,
	PhoneCodeSelector,
} from "../../component";
import { useTranslation } from "react-i18next";

export default function Register({ navigation }) {
	const { t, i18n } = useTranslation();
	let [region, setRegion] = useState("+62");
	let [selector, setSelector] = useState(false);
	let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
	let [state, setState] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		password: "",
		password_confirmation: "",
	});

	let [itemvalid, setItemValid] = useState({
		first_name: true,
		last_name: true,
		email: true,
		phone: true,
		password: true,
		password_confirmation: true,
	});

	let [hidePasswd, setHidePasswd] = useState(true);
	let [hidePasswdCnfrm, setHidePasswdCnfrm] = useState(true);

	const validation = (name, value) => {
		var emailRegx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!value || value === "") {
			return false;
		} else if (name === "email") {
			return value.match(emailRegx) ? true : false;
		} else if (name === "password") {
			return value.length >= 8 ? true : false;
		} else if (name === "password_confirmation") {
			return value.length >= 8 && value === state.password ? true : false;
		} else if (name === "phone" || name === "phone1" || name === "phone2") {
			return value.length <= 13 && value.length >= 6 ? true : false;
		} else {
			return true;
		}
	};

	const [mutation, { loading, data, error }] = useMutation(Email);

	const register = async () => {
		// console.log(state);
		let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");
		for (let i in state) {
			// console.log(i, state[i]);
			let check = validation(i, state[i]);
			if (!check) {
				if (i == "password") {
					setItemValid({
						...itemvalid,
						[i]: check,
						["password_confirmation"]: check,
					});
				} else {
					setItemValid({ ...itemvalid, [i]: check });
				}
				showAlert({
					...aler,
					show: true,
					judul: "Some Form Field Empty",
					detail: "" + error,
				});
				return false;
			}
		}
		try {
			let response = await mutation({
				variables: {
					first_name: state.first_name,
					last_name: state.last_name,
					email: state.email,
					phone: region + state.phone,
					password: state.password,
					password_confirmation: state.password_confirmation,
					token: FCM_TOKEN,
				},
			});

			if (loading) {
				Alert.alert("Loading!!");
			}
			if (error) {
				throw new Error("Error Input");
			}
			if (response.data) {
				if (
					response.data.register.code === 200 ||
					response.data.register.code === "200"
				) {
					navigation.navigate("otp", {
						userId: response.data.register.id,
						email: state.email,
					});
				} else {
					throw new Error(response.data.register.message);
				}
			}
		} catch (error) {
			showAlert({
				...aler,
				show: true,
				judul: "Register Failed",
				detail: "" + error,
			});
		}
	};

	const login = () => {
		navigation.navigate("LoginScreen");
	};
	const togglePasswordTop = () => {
		setHidePasswd(!hidePasswd);
	};
	const togglePasswordBottom = () => {
		setHidePasswdCnfrm(!hidePasswdCnfrm);
	};
	const onChange = (name) => (text) => {
		let check = validation(name, text);
		setState({ ...state, [name]: name == "email" ? text.toLowerCase() : text });
		if (name == "password") {
			setItemValid({
				...itemvalid,
				[name]: check,
				["password_confirmation"]: check,
			});
		} else {
			setItemValid({ ...itemvalid, [name]: check });
		}
	};

	const externalRegister = (index) => {
		navigation.navigate(index);
	};

	const NavigationComponent = {
		title: "",
		headerShown: true,
		headerMode: "screen",
		headerTransparent: true,
	};

	useEffect(() => {
		navigation.setOptions(NavigationComponent);
	}, []);

	return (
		<KeyboardAvoidingView
			style={{
				flex: 1,
			}}
			behavior={Platform.OS === "ios" ? "padding" : null}
			// keyboardVerticalOffset={30}
			enabled
		>
			<Peringatan
				aler={aler}
				setClose={() =>
					showAlert({ ...aler, show: false, judul: "", detail: "" })
				}
			/>
			<ScrollView
				style={[
					styles.root,
					{
						paddingTop: 40,
					},
				]}
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[1]}
			>
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						paddingBottom: 20,
					}}
				>
					<View>
						<CustomImage
							source={mascot_black}
							customStyle={{
								height: 180,
								width: 180,
								marginTop: 30,
								alignSelf: "center",
							}}
						/>

						<View style={styles.welcomeText}>
							<Text type="bold" size="h5">
								{t("createYourAccount")}
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								maxWidth: Dimensions.get("window").width / 1.2,
							}}
						>
							<View>
								<FloatingInput
									customTextStyle={styles.halfTextInput}
									value={state.first_name}
									onChangeText={onChange("first_name")}
									label={t("firstName")}
								/>
								{itemvalid.first_name === false ? (
									<Text
										type="regular"
										size="small"
										style={{
											color: "#D75995",
											position: "absolute",
											bottom: -15,
										}}
									>
										{`${t("inputWarningName")}${t("firstName")}`}
									</Text>
								) : null}
							</View>
							<View>
								<FloatingInput
									customTextStyle={styles.halfTextInput}
									value={state.last_name}
									onChangeText={onChange("last_name")}
									label={t("lastName")}
								/>
							</View>
						</View>
						<View>
							<FloatingInput
								customTextStyle={styles.TextInput}
								value={state.email}
								keyboardType="email-address"
								onChangeText={onChange("email")}
								label="Email"
							/>
							{itemvalid.email === false ? (
								<Text
									type="regular"
									size="small"
									style={{
										color: "#D75995",

										position: "absolute",
										bottom: -15,
									}}
								>
									{`${t("inputWarningEmail")}`}
								</Text>
							) : null}
						</View>
						<View
							style={{
								marginBottom: 20,
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<TouchableOpacity
								onPress={() => setSelector(true)}
								style={{
									width: Dimensions.get("screen").width * 0.15,
									borderBottomWidth: StyleSheet.hairlineWidth,
									marginTop: 15,
								}}
							>
								<Text
									size="small"
									style={{
										color: "#030303",
										paddingTop: 5,
										marginTop: 10,
										alignSelf: "center",
										height: 29,
									}}
								>
									{region}
								</Text>
							</TouchableOpacity>
							<View>
								<FloatingInput
									value={state.phone}
									onChangeText={onChange("phone")}
									customTextStyle={{
										width: Dimensions.get("screen").width * 0.6,
										fontSize: 12,
									}}
									keyboardType="number-pad"
									label={t("phoneNumber")}
								/>
								{itemvalid.phone === false ? (
									<Text
										type="regular"
										size="small"
										style={{
											color: "#D75995",

											position: "absolute",
											bottom: -15,
										}}
									>
										{t("inputWarningPhone")}
									</Text>
								) : null}
							</View>
						</View>

						<View>
							<View style={{ flexDirection: "row" }}>
								<FloatingInput
									customTextStyle={styles.TextInput}
									value={state.password}
									onChangeText={onChange("password")}
									label={t("password")}
									secureTextEntry={hidePasswd}
								/>
								<CustomImage
									source={hidePasswd ? show_password : hide_password}
									isTouchable={true}
									onPress={togglePasswordTop}
									customStyle={{
										height: 35,
										width: 35,
										position: "absolute",
										top: 15,
										right: 5,
									}}
									customImageStyle={{
										height: 25,
										width: 25,
									}}
								/>
							</View>
							{itemvalid.password === false ? (
								<Text
									type="regular"
									size="small"
									style={{
										color: "#D75995",

										position: "absolute",
										bottom: -15,
									}}
								>
									{t("inputWarningPassword")}
								</Text>
							) : null}
						</View>
						<View>
							<View style={{ flexDirection: "row" }}>
								<FloatingInput
									customTextStyle={styles.TextInput}
									value={state.password_confirmation}
									onChangeText={onChange("password_confirmation")}
									label={t("reEnterPassword")}
									secureTextEntry={hidePasswdCnfrm}
								/>
								<CustomImage
									source={hidePasswdCnfrm ? show_password : hide_password}
									isTouchable={true}
									onPress={togglePasswordBottom}
									customStyle={{
										height: 35,
										width: 35,
										position: "absolute",
										top: 15,
										right: 5,
									}}
									customImageStyle={{
										height: 25,
										width: 25,
									}}
								/>
							</View>
							{itemvalid.password_confirmation === false ? (
								<Text
									type="regular"
									size="small"
									style={{
										color: "#D75995",

										position: "absolute",
										bottom: -15,
									}}
								>
									{t("inputWarningRepeatPassword")}
								</Text>
							) : null}
						</View>
						<Button
							style={{
								alignSelf: "center",
								width: Dimensions.get("window").width / 1.2,
								height: Dimensions.get("window").height / 15,
								marginVertical: 20,
							}}
							color="secondary"
							onPress={() => register()}
							text={t("createYourAccount")}
						/>
						<View
							style={{
								alignItems: "center",
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignContent: "center",
									alignItems: "center",
								}}
							>
								<View
									style={{
										width: 50,
										borderBottomWidth: 1,
										borderBottomColor: "#d1d1d1",
										marginHorizontal: 10,
									}}
								></View>
								<Text style={styles.dividerText}>{t("or")}</Text>
								<View
									style={{
										width: 50,
										borderBottomWidth: 1,
										borderBottomColor: "#d1d1d1",
										marginHorizontal: 10,
									}}
								></View>
							</View>

							<View style={{ flexDirection: "row" }}>
								<CustomImage
									source={logo_google}
									isTouchable
									onPress={() => externalRegister("RegisterGoogleScreen")}
									customStyle={{
										marginHorizontal: 15,
										width: 50,
										height: 50,
									}}
								/>
								<CustomImage
									source={logo_facebook}
									isTouchable
									onPress={() => externalRegister("RegisterFacebookScreen")}
									customStyle={{
										marginHorizontal: 15,
										width: 50,
										height: 50,
									}}
								/>
							</View>
						</View>

						<View
							style={{
								marginTop: 20,
								marginBottom: 40,
								flexDirection: "column",
							}}
						>
							<TouchableOpacity onPress={login}>
								<Text style={styles.beforeSpecialText}>
									{`${t("alreadyHave")} `}
								</Text>
								<Text style={styles.specialTextButton}>{t("signIn")}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<PhoneCodeSelector
					show={selector}
					close={() => setSelector(false)}
					callBack={(e) => setRegion(e)}
					value={region}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

//needfix
const styles = StyleSheet.create({
	dividerText: {
		fontSize: 14,
		fontFamily: "Lato-Regular",
		alignSelf: "flex-end",
		marginVertical: 10,
	},
	root: {
		width: Dimensions.get("window").width,
		// flex: 1,
	},
	halfTextInput: {
		width: Dimensions.get("window").width / 2.7,
		borderBottomWidth: StyleSheet.hairlineWidth,
		fontFamily: "Lato-Regular",
	},
	beforeSpecialText: {
		fontSize: 14,
		fontFamily: "Lato-Regular",
		alignSelf: "center",
	},
	specialTextButton: {
		fontFamily: "Lato-Bold",
		marginTop: 5,
		fontSize: 14,
		color: "#27958B",
		alignSelf: "center",
	},
	logoView: {
		height: 180,
		width: 180,
		alignSelf: "flex-start",
	},
	welcomeText: { alignSelf: "flex-start", marginVertical: 10 },
	TextInput: {
		width: Dimensions.get("window").width / 1.2,
	},
});
