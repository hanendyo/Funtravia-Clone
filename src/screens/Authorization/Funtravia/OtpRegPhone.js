import React, {
	useState,
	useEffect,
	useRef,
	MutableRefObject,
	forwardRef,
} from "react";
import {
	View,
	StyleSheet,
	Image,
	KeyboardAvoidingView,
	TextInput,
	Alert,
	Dimensions,
	ScrollView,
	Platform,
	TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {  } from '../../const/PixelRatio';

import { CustomText, CustomImage, Input } from "../../core-ui";
import { gql } from "apollo-boost";
import { phone_vektor } from "../../const/Png";
import { useMutation } from "@apollo/react-hooks";

import Peringatan from "../Main/Components/Peringatan";
import OTP from "../../graphQL/Mutation/Register/OtpRegPhone";
import RESEND from "../../graphQL/Mutation/Register/ResenOtpRegPhone";
import { Text, Button } from "../../Component";
import { useTranslation } from "react-i18next";

export default function OtpRegPhone(props) {
	const { t, i18n } = useTranslation();

	let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
	let [region, setRegion] = useState(
		props.navigation.state.params ? props.navigation.state.params.region : null
	);
	let [number, setNumber] = useState(
		props.navigation.state.params ? props.navigation.state.params.number : null
	);

	let [state, setState] = useState({
		onebox: "",
		twobox: "",
		threebox: "",
		fourbox: "",
		fivebox: "",
		sixbox: "",
	});

	const [mutation, { loading, data, error }] = useMutation(OTP);
	const [resend] = useMutation(RESEND);

	let refBox1 = useRef(null);
	let refBox2 = useRef(null);
	let refBox3 = useRef(null);
	let refBox4 = useRef(null);
	let refBox5 = useRef(null);
	let refBox6 = useRef(null);

	const onChange = (name, ref?: MutableRefObject<TextInput>) => (
		text: string
	) => {
		if (text.trim() !== "") {
			setState({ ...state, [name]: text });
			// console.log('name: ' + name.value);
			ref && ref.current && ref.current.focus();
		} else {
			return;
		}
	};

	const resendOTP = async () => {
		let phoneNumber =
			props.navigation.getParam("region") + props.navigation.getParam("number");
		try {
			let response = await resend({
				variables: {
					nomor: phoneNumber,
				},
			});
			hitungMundur();
			// Alert.alert('Success Send OTP');
		} catch (error) {
			showAlert({
				...aler,
				show: true,
				judul: "Failed Send OTP",
				detail: "",
			});
			// Alert.alert('Failed Send OTP');
		}
	};

	const signin = async () => {
		let OTP =
			state.onebox +
			state.twobox +
			state.threebox +
			state.fourbox +
			state.fivebox +
			state.sixbox;
		try {
			let response = await mutation({
				variables: {
					user_id: props.navigation.getParam("userId"),
					otp_code: OTP,
				},
			});
			if (response && response.data.verification.access_token) {
				try {
					// console.log('access_token=', response.data.verification.access_token);
					await AsyncStorage.setItem(
						"access_token",
						response.data.verification.access_token
					);
					props.navigation.navigate("Home");
				} catch (error) {
					showAlert({
						...aler,
						show: true,
						judul: "Failed to login",
						detail: "",
					});
					// Alert.alert('Failed', 'failed to login');
				}
			} else {
				showAlert({
					...aler,
					show: true,
					judul: "Failed to login",
					detail: "Please check your OTP code",
				});
			}
		} catch (error) {
			showAlert({
				...aler,
				show: true,
				judul: "Failed to login",
				detail: "verification error",
			});
			// Alert.alert('Failed', 'verification error');
		}
	};

	let [Timer, setTimer] = useState(0);
	const hitungMundur = () => {
		var timeleft = 30;
		var downloadTimer = setInterval(function () {
			timeleft -= 1;
			setTimer(timeleft);
			if (timeleft === 0) {
				clearInterval(downloadTimer);
				return false;
			}
		}, 1000);
	};

	useEffect(() => {
		hitungMundur();
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
				style={{
					paddingTop: 40,
				}}
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[1]}
			>
				<View style={styles.main}>
					{/* <View> */}
					<CustomImage
						customStyle={{
							alignSelf: "center",
							width: 150,
							height: 150,
						}}
						source={phone_vektor}
					/>
					<View
						style={{
							alignItems: "center",
							justifyContent: "space-evenly",
							marginVertical: 10,
						}}
					>
						<Text size="h5" type="bold">
							{t("enterVerificationCode")}
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
							size="description"
							style={{
								textAlign: "center",
							}}
						>
							{t("weJustSend")}
						</Text>

						<View
							style={{
								flexDirection: "row",
								// marginBottom: (40),
								marginTop: 20,
							}}
						>
							<Text size="h5" type="bold">
								{`${region}  `}
							</Text>
							<Text size="h5" type="bold">
								{number}
							</Text>
						</View>
					</View>

					<View
						style={{
							flexDirection: "row",
							// paddingTop: 10,
							justifyContent: "space-evenly",
							alignContent: "center",
							marginVertical: 20,
						}}
					>
						<Input
							ref={refBox1}
							onChangeText={onChange("onebox", refBox2)}
							customStyle={styles.numberInputView}
							autoFocus={true}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) => {
								if (e.nativeEvent.key === " ") {
									return false;
								}
							}}
						/>
						<Input
							ref={refBox2}
							onChangeText={onChange("twobox", refBox3)}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) => {
								if (e.nativeEvent.key === "Backspace") {
									refBox1 && refBox1.current && refBox1.current.focus();
								}
							}}
						/>
						<Input
							ref={refBox3}
							onChangeText={onChange("threebox", refBox4)}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) => {
								if (e.nativeEvent.key === "Backspace") {
									refBox2 && refBox2.current && refBox2.current.focus();
								}
							}}
						/>
						<Input
							ref={refBox4}
							onChangeText={onChange("fourbox", refBox5)}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) => {
								if (e.nativeEvent.key === "Backspace") {
									refBox3 && refBox3.current && refBox3.current.focus();
								}
							}}
						/>
						<Input
							ref={refBox5}
							onChangeText={onChange("fivebox", refBox6)}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) => {
								if (e.nativeEvent.key === "Backspace") {
									refBox4 && refBox4.current && refBox4.current.focus();
								}
							}}
						/>
						<Input
							ref={refBox6}
							onChangeText={onChange("sixbox")}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) => {
								if (e.nativeEvent.key === "Backspace") {
									refBox5 && refBox5.current && refBox5.current.focus();
								}
							}}
						/>
					</View>
					<Button
						style={{
							alignSelf: "center",
							width: Dimensions.get("window").width / 1.2,
						}}
						onPress={signin}
						text={t("verify")}
					/>
					<View
						style={{
							marginTop: 20,
							marginBottom: 60,
							flexDirection: "column",
						}}
					>
						<TouchableOpacity
							onPress={() => resendOTP()}
							disabled={Timer === 0 ? false : true}
						>
							<Text style={styles.specialTextButton}>
								{`${t("resend")} ${Timer > 0 ? Timer : ""}`}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	main: {
		// flex: 1,
		marginHorizontal: 48,
		marginVertical: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	dividerText: {
		fontSize: 16,
		fontFamily: "lato-reg",
		alignSelf: "flex-end",
	},
	beforeSpecialText: {
		fontSize: 12,
		fontFamily: "lato-reg",
		alignSelf: "center",
	},
	welcomeText: {
		height: 50,
		width: 500,
		alignSelf: "center",
	},
	specialTextButton: {
		fontFamily: "lato-bold",
		fontSize: 18,
		color: "#27958B",
		alignSelf: "center",
	},
	logoView: {
		height: 200,
		width: 200,
		alignSelf: "flex-start",
	},
	numberInputView: {
		marginHorizontal: 10,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
		width: (Dimensions.get("window").width - 100) / 6,
		height: (Dimensions.get("window").width - 100) / 6,
		backgroundColor: "#F2F2F2",
		justifyContent: "center",
		alignContent: "center",
		// alignItems: 'center',
	},
	numberInputText: {
		fontFamily: "lato-bold",
		alignContent: "center",
		justifyContent: "center",
		borderBottomWidth: 0,
		fontSize: 25,
		paddingLeft: 15,
	},
});
