import React, { useEffect, useRef, useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	Image,
	FlatList,
	StatusBar,
} from "react-native";
import io from "socket.io-client";
import { Arrowbackwhite, Send } from "../../assets/svg";
import { Button, Text } from "../../component";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../config";

export default function Room({ navigation, route }) {
	const [room, setRoom] = useState(route.params.room_id);
	const [receiver, setReceiver] = useState(route.params.receiver);
	const [user, setUser] = useState({});
	const [init, setInit] = useState(true);
	const [button, setButton] = useState(true);
	const [token, setToken] = useState(null);
	const socket = io(CHATSERVER);
	let [chat, setChat] = useState(null);
	let [message, setMessage] = useState([]);
	let flatListRef = useRef();

	const navigationOptions = {
		headerShown: true,
		headerTitle: null,
		headerMode: "screen",
		headerStyle: {
			backgroundColor: "#209FAE",
		},
		headerLeft: () => (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignContent: "center",
					alignItems: "center",
					marginVertical: 10,
				}}
			>
				<TouchableOpacity
					style={{
						height: 40,
						width: 40,
						justifyContent: "center",
						alignContent: "center",
						alignItems: "center",
					}}
					onPress={() => navigation.goBack()}
				>
					<Arrowbackwhite height={20} width={20} />
				</TouchableOpacity>
				<TouchableOpacity>
					<Image
						source={{ uri: route.params.picture }}
						style={{ width: 40, height: 40, borderRadius: 20 }}
					></Image>
				</TouchableOpacity>
				<Text
					style={{
						fontFamily: "Lato-Bold",
						fontSize: 14,
						color: "white",
						alignSelf: "center",
						paddingHorizontal: 10,
					}}
				>
					{route.params.name}
				</Text>
			</View>
		),
		headerRightStyle: {
			paddingRight: 20,
		},
	};

	useEffect(() => {
		navigation.setOptions(navigationOptions);
		if (init) {
			getUserToken();
			setConnection();
		}
		socket.on("newMessage", (data) => {
			setChatHistory(data);
		});
	}, []);

	const setConnection = () => {
		socket.emit("join", room);
	};

	const getUserToken = async () => {
		let data = await AsyncStorage.getItem("setting");
		setUser(JSON.parse(data).user);
		let token = await AsyncStorage.getItem("access_token");
		if (token) {
			await setToken(token);
			await initialHistory(token);
		}
	};

	const setChatHistory = async (data) => {
		let history = await AsyncStorage.getItem("history_" + room);
		if (data) {
			if (history) {
				let recent = JSON.parse(history);
				recent.push(data);
				await AsyncStorage.setItem("history_" + room, JSON.stringify(recent));
				setMessage(recent);
			} else {
				await AsyncStorage.setItem("history_" + room, JSON.stringify([data]));
				setMessage([data]);
			}
		}
	};

	const initialHistory = async (access_token) => {
		let response = await fetch(
			`${CHATSERVER}/api/personal/history?receiver_id=${receiver}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + access_token,
					"Content-Type": "application/json",
				},
			}
		);
		let responseJson = await response.json();
		if (responseJson.data) {
			await AsyncStorage.setItem(
				"history_" + room,
				JSON.stringify(responseJson.data)
			);
			await setMessage(responseJson.data);
			await setTimeout(function () {
				flatListRef.current.scrollToEnd({ animated: true });
			}, 500);
		}
	};

	const submitChatMessage = async () => {
		let d = new Date();
		let date = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/");
		let time = [
			d.getHours(),
			d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
		].join(":");
		if (button) {
			if (chat && chat !== "") {
				await setButton(false);
				let chatData = {
					room: room,
					text: chat,
					user_id: user.id,
					date: date,
					time: time,
				};
				await fetch(`${CHATSERVER}/api/personal/send`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: `room=${room}&text=${chat}&user_id=${user.id}&date=${date}&time=${time}`,
				});
				await socket.emit("message", chatData);
				await setChat("");
				await setTimeout(function () {
					flatListRef.current.scrollToEnd({ animated: true });
				}, 250);
				await setButton(true);
			}
		}
	};

	let tmpRChat = null;
	const RenderChat = ({ item, index }) => {
		if (item.user_id !== tmpRChat) {
			tmpRChat = item.user_id;
			return (
				<View style={{ marginTop: 20 }}>
					{user.id !== item.user_id ? (
						<Text
							size="description"
							type="bold"
							style={{
								paddingBottom: 5,
								paddingLeft: 20,
								color: "#464646",
							}}
						>
							{item.name}
						</Text>
					) : null}
					<View
						key={`chat_${index}`}
						style={[
							styles.item,
							user.id == item.user_id ? styles.itemOut : styles.itemIn,
						]}
					>
						{user.id == item.user_id ? (
							<Text size="small" style={{ marginRight: 5 }}>
								{item.time}
							</Text>
						) : null}
						<View
							style={[
								styles.balloon,
								user.id == item.user_id
									? { backgroundColor: "#DAF0F2", borderTopRightRadius: 0 }
									: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 0 },
							]}
						>
							<Text
								size="description"
								style={{
									color: "#464646",
									lineHeight: 18,
								}}
							>
								{item.text}
							</Text>
							<View
								style={[
									styles.arrowContainer,
									user.id == item.user_id
										? styles.arrowRightContainer
										: styles.arrowLeftContainer,
								]}
							>
								<Svg
									style={
										user.id == item.user_id
											? styles.arrowRight
											: styles.arrowLeft
									}
									height="50"
									width="50"
								>
									<Polygon
										points={
											user.id == item.user_id
												? "0,01 15,01 5,12"
												: "20,01 0,01 12,12"
										}
										fill={user.id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
										stroke="#209FAE"
										strokeWidth={0.7}
									/>
								</Svg>
								<Svg
									style={[
										{ position: "absolute" },
										user.id == item.user_id
											? { right: moderateScale(-5, 0.5) }
											: { left: moderateScale(-5, 0.5) },
									]}
									height="50"
									width="50"
								>
									<Polygon
										points={
											user.id == item.user_id
												? "0,1.3 15,1.1 5,12"
												: "20,01 0,01 12,13"
										}
										fill={user.id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
									/>
								</Svg>
							</View>
						</View>
						{user.id !== item.user_id ? (
							<Text size="small" style={{ marginLeft: 5 }}>
								{item.time}
							</Text>
						) : null}
					</View>
				</View>
			);
		} else {
			return (
				<View>
					<View
						key={`chat_${index}`}
						style={[
							styles.item,
							user.id == item.user_id ? styles.itemOut : styles.itemIn,
						]}
					>
						{user.id == item.user_id ? (
							<Text size="small" style={{ marginRight: 5 }}>
								{item.time}
							</Text>
						) : null}
						<View
							style={[
								styles.balloon,
								user.id == item.user_id
									? { backgroundColor: "#DAF0F2", borderTopRightRadius: 0 }
									: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 0 },
							]}
						>
							<Text
								size="description"
								style={{
									color: "#464646",
									lineHeight: 18,
								}}
							>
								{item.text}
							</Text>
							<View
								style={[
									styles.arrowContainer,
									user.id == item.user_id
										? styles.arrowRightContainer
										: styles.arrowLeftContainer,
								]}
							></View>
						</View>
						{user.id !== item.user_id ? (
							<Text size="small" style={{ marginLeft: 5 }}>
								{item.time}
							</Text>
						) : null}
					</View>
				</View>
			);
		}
	};
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#14646E" barStyle="light-content" />
			<FlatList
				ref={flatListRef}
				data={message}
				renderItem={RenderChat}
				keyExtractor={(item, index) => `render_${index}`}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				keyboardVerticalOffset={70}
			>
				<View
					style={{
						flexDirection: "row",
						paddingHorizontal: 5,
						alignContent: "center",
						alignItems: "center",
						paddingVertical: 5,
					}}
				>
					<View
						style={{
							borderColor: "#D1D1D1",
							borderWidth: 1,
							width: "90%",
							borderRadius: 25,
							paddingHorizontal: 10,
							alignSelf: "center",
						}}
					>
						<TextInput
							value={chat}
							multiline
							placeholder="Type a message"
							onChangeText={(text) => setChat(text)}
							style={
								Platform.OS == "ios"
									? { maxHeight: 100, margin: 10 }
									: {
											maxHeight: 100,
											marginVertical: 5,
											marginHorizontal: 10,
											padding: 0,
									  }
							}
						/>
					</View>
					<Button
						text=""
						type="circle"
						size="medium"
						variant="transparent"
						onPress={() => submitChatMessage()}
						style={{ marginHorizontal: 5 }}
					>
						<Send height={28} width={28} />
					</Button>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "flex-end",
	},
	item: {
		marginVertical: moderateScale(1, 1),
		flexDirection: "row",
		alignItems: "center",
	},
	itemIn: {
		alignSelf: "flex-start",
		marginLeft: 20,
	},
	itemOut: {
		alignSelf: "flex-end",
		marginRight: 20,
	},
	balloon: {
		maxWidth: moderateScale(250, 2),
		paddingHorizontal: moderateScale(10, 2),
		paddingTop: moderateScale(5, 2),
		paddingBottom: moderateScale(7, 2),
		borderRadius: 8,
		borderColor: "#209FAE",
		borderWidth: 0.7,
	},
	arrowContainer: {
		position: "absolute",
		top: -1,
		zIndex: -1,
	},
	arrowLeftContainer: {
		justifyContent: "flex-end",
		alignItems: "flex-start",
		left: -5,
	},

	arrowRightContainer: {
		justifyContent: "flex-end",
		alignItems: "flex-end",
		right: -38.5,
	},

	arrowLeft: {
		left: moderateScale(-6, 0.5),
	},

	arrowRight: {
		right: moderateScale(-6, 0.5),
	},
});
