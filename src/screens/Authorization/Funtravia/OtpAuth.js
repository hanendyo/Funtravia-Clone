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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {  } from '../../const/PixelRatio';

import { CustomText, CustomImage, Input } from "../../core-ui";
import { gql } from "apollo-boost";
import { sms_otp } from "../../const/Png";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import Otpgql from "../../graphQL/Mutation/Register/OtpAuth";
import RESEND from "../../graphQL/Mutation/Register/ResendOtpRegEmail";
import Peringatan from "../Main/Components/Peringatan";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../Component";
import CreateSetting from "../../graphQL/Mutation/Setting/CreateSetting";
import {
	DEFAULT_COUNTRY_SETTING,
	DEFAULT_CURRENCY_SETTING,
} from "../../config/config";
import GetSetting from "../../graphQL/Query/Settings/GetSetting";

export default function OtpAuth(props) {
	const { t, i18n } = useTranslation();
	let [token, setToken] = useState("");
	const [resend] = useMutation(RESEND);
	let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
	let email = props.navigation.getParam("email");
	let [state, setState] = useState({
		onebox: null,
		twobox: null,
		threebox: null,
		fourbox: null,
		fivebox: null,
		sixbox: null,
	});

	const [mutation, { loading, data, error }] = useMutation(Otpgql);

	const [
		GetDataSetting,
		{ data: datas, loading: loadings, error: errors },
	] = useLazyQuery(GetSetting, {
		fetchPolicy: "network-only",
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});

	let refBox1 = useRef(null);
	let refBox2 = useRef(null);
	let refBox3 = useRef(null);
	let refBox4 = useRef(null);
	let refBox5 = useRef(null);
	let refBox6 = useRef(null);

	const onHandleChange = (e, rName, pName, next = null, prev = null) => {
		if (e.nativeEvent.key === "Backspace") {
			if (state[rName] === null) {
				prev ? prev.current.focus() : null;
				setState({ ...state, [pName]: null });
			} else {
				setState({ ...state, [rName]: null });
			}
		} else {
			next ? next.current.focus() : null;
			setState({ ...state, [rName]: e.nativeEvent.key });
		}
	};

	const settingcreate = async () => {
		GetDataSetting();
		await GetDataSetting();
		if (datas && datas.setting_data) {
			await AsyncStorage.setItem("setting", JSON.stringify(datas.setting_data));
		}
	};

	const signin = async () => {
		try {
			let response = await mutation({
				variables: {
					user_id: props.navigation.getParam("userId"),
					otp_code:
						state.onebox +
						state.twobox +
						state.threebox +
						state.fourbox +
						state.fivebox +
						state.sixbox,
				},
			});
			// console.log(response);
			if (response.data.verification.access_token) {
				try {
					console.log(response.data.verification.data_setting);
					setToken(response.data.verification.access_token);
					await AsyncStorage.setItem(
						"access_token",
						response.data.verification.access_token
					);
					await AsyncStorage.setItem(
						"setting",
						JSON.stringify(response.data.verification.data_setting)
					);
					props.navigation.navigate("Home");

					// settingcreate();
				} catch (error) {
					// Alert.alert('failed to login');
					showAlert({
						...aler,
						show: true,
						judul: "Sorry..",
						detail: response.data.verification.message,
					});
				}
			} else {
				showAlert({
					...aler,
					show: true,
					judul: "Sorry..",
					detail: response.data.verification.message,
				});
			}
		} catch (error) {
			showAlert({
				...aler,
				show: true,
				judul: "Verification Failed",
				detail: "",
			});
			// Alert.alert('verification error');
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

	const resendOTP = async () => {
		try {
			console.log("response");
			let response = await resend({
				variables: {
					user_id: props.navigation.getParam("userId"),
					email: props.navigation.getParam("email"),
				},
			});
			console.log(response);
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
						source={sms_otp}
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
							style={{
								textAlign: "center",
							}}
							type="regular"
							size="description"
						>
							{t("weJustSend")}
						</Text>
					</View>
					<View
						style={{
							alignContent: "center",
							justifyContent: "space-evenly",
							marginVertical: 5,
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
							{email}
						</Text>
					</View>

					<View
						style={{
							flexDirection: "row",
							paddingTop: 10,
							justifyContent: "space-evenly",
							alignContent: "center",
							marginVertical: 25,
						}}
					>
						<Input
							ref={refBox1}
							customStyle={styles.numberInputView}
							autoFocus={true}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) => onHandleChange(e, "onebox", null, refBox2)}
						/>
						<Input
							ref={refBox2}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) =>
								onHandleChange(e, "twobox", "onebox", refBox3, refBox1)
							}
						/>
						<Input
							ref={refBox3}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) =>
								onHandleChange(e, "threebox", "twobox", refBox4, refBox2)
							}
						/>
						<Input
							ref={refBox4}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) =>
								onHandleChange(e, "fourbox", "threebox", refBox5, refBox3)
							}
						/>
						<Input
							ref={refBox5}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) =>
								onHandleChange(e, "fivebox", "fourbox", refBox6, refBox4)
							}
						/>
						<Input
							ref={refBox6}
							customStyle={styles.numberInputView}
							customTextStyle={styles.numberInputText}
							keyboardType="number-pad"
							maxLength={1}
							blurOnSubmit={false}
							onKeyPress={(e) =>
								onHandleChange(e, "sixbox", "fivebox", null, refBox5)
							}
						/>
					</View>
					<Button onPress={signin} text={t("verify")} />
					<View
						style={{
							marginTop: 20,
							marginBottom: 30,
							flexDirection: "column",
						}}
					>
						<Text style={styles.beforeSpecialText}>{t('"didntReceive"')}</Text>
						<TouchableOpacity
							onPress={() => resendOTP()}
							disabled={Timer === 0 ? false : true}
						>
							<Text style={styles.specialTextButton}>
								{`${t("resend")} ${Timer > 0 ? Timer : ""}`}
							</Text>
						</TouchableOpacity>
					</View>
					{/* </View> */}
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
		fontFamily: "Lato-Regular",
		alignSelf: "flex-end",
	},
	beforeSpecialText: {
		fontSize: 12,
		fontFamily: "Lato-Regular",
		alignSelf: "center",
	},
	welcomeText: {
		height: 50,
		width: 500,
		alignSelf: "center",
	},
	specialTextButton: {
		fontFamily: "Lato-Bold",
		fontSize: 14,
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
		fontFamily: "Lato-Bold",
		alignContent: "center",
		justifyContent: "center",
		borderBottomWidth: 0,
		fontSize: 25,
		paddingLeft: 15,
	},
});
