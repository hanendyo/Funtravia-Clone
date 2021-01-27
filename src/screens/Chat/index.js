import React, { useEffect, useRef, useState } from "react";
import {
	View,
	TextInput,
	Dimensions,
	TouchableOpacity,
	SafeAreaView,
	FlatList,
	Image,
	_ScrollView,
	Alert,
	StatusBar,
} from "react-native";
import { Delete, Magnifying, NewChat } from "../../assets/svg";
import { Text, Button, Truncate } from "../../component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";
import Swipeout from "react-native-swipeout";
import { useTranslation } from "react-i18next";
import { CHATSERVER } from "../../config";

export default function Message({ navigation }) {
	const { width, height } = Dimensions.get("screen");
	const { t } = useTranslation();
	const [user, setUser] = useState({});
	const [token, setToken] = useState(null);
	const [data, setData] = useState([]);
	const [dataRes, setDataRes] = useState([]);
	const [dataGroup, setDataGroup] = useState([]);
	const [dataGroupRes, setDataGroupRes] = useState([]);
	const [active, setActive] = useState("personal");

	const HeaderComponent = {
		tabBarBadge: null,
	};

	useEffect(() => {
		navigation.setOptions(HeaderComponent);
		getUserAndToken();
		const unsubscribe = navigation.addListener("focus", () => {
			getUserAndToken();
		});
		return unsubscribe;
	}, []);

	const getRoom = async (access_token) => {
		let response = await fetch(`${CHATSERVER}/api/personal/list`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${access_token}`,
				"Content-Type": "application/json",
			},
		});
		let dataResponse = await response.json();
		for (let i in dataResponse) {
			let recent = JSON.parse(
				await AsyncStorage.getItem("history_" + dataResponse[i].id)
			);
			dataResponse[i]["recent"] = recent ? recent[recent.length - 1] : null;
		}
		await setData(dataResponse);
		await setDataRes(dataResponse);
	};

	const getRoomGroup = async (access_token) => {
		let response = await fetch(`${CHATSERVER}/api/group/list`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${access_token}`,
				"Content-Type": "application/json",
			},
		});
		let dataResponse = await response.json();
		for (let i in dataResponse) {
			let recent = JSON.parse(
				await AsyncStorage.getItem("history_" + dataResponse[i].itinerary_id)
			);
			dataResponse[i]["recent"] = recent ? recent[recent.length - 1] : null;
		}
		await setDataGroup(dataResponse);
		await setDataGroupRes(dataResponse);
	};

	const getUserAndToken = async () => {
		let token = await AsyncStorage.getItem("access_token");
		if (token) {
			await setToken(token);
			await getRoom(token);
			await getRoomGroup(token);
		}

		if (token === null) {
			Alert.alert("Silahkan login terlebih dahulu");
			navigation.navigate("HomeScreen");
		}
		let setting = JSON.parse(await AsyncStorage.getItem("setting"));
		if (setting) {
			await setUser(setting.user);
		}
	};

	const swipeoutBtn = (id) => {
		return [
			{
				backgroundColor: "#F6F6F6",
				component: (
					<TouchableOpacity
						onPress={() => {
							console.log(id);
						}}
						style={{
							height: "100%",
							width: "100%",
							justifyContent: "center",
							alignContent: "center",
							alignItems: "center",
							borderBottomWidth: 0.5,
							borderBottomColor: "#EEEEEE",
						}}
					>
						<Delete height={20} width={20} />
						<Text
							size="small"
							type="regular"
							style={{ paddingTop: 5, color: "#E65D79" }}
						>
							{t("delete")}
						</Text>
					</TouchableOpacity>
				),
			},
		];
	};

	const renderItem = ({ item }) => {
		let d = new Date();
		let date = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/");
		let change = item.sender_id == user.id ? item.receiver : item.sender;
		return (
			<Swipeout right={swipeoutBtn(item.id)} key={`${item.id}_child`}>
				<Ripple
					onPress={() =>
						navigation.navigate("RoomChat", {
							room_id: item.id,
							receiver: change.id,
							name:
								change.first_name +
								" " +
								(change.last_name ? change.last_name : ""),
							picture: change.picture,
						})
					}
					style={{
						backgroundColor: "white",
						paddingVertical: 10,
						paddingHorizontal: 10,
						flexDirection: "row",
						borderBottomWidth: 1,
						borderBottomColor: "#EEEEEE",
						alignContent: "center",
						alignItems: "center",
					}}
				>
					<Image
						source={{ uri: change.picture }}
						style={{
							width: 50,
							height: 50,
							borderRadius: 25,
							borderWidth: 1,
							borderColor: "#EEEEEE",
						}}
					/>
					<View style={{ width: width - 160, paddingHorizontal: 10 }}>
						<Text size="description" type="bold" style={{ paddingVertical: 5 }}>
							{`${change.first_name} ${
								change.last_name ? change.last_name : ""
							}`}
						</Text>
						{item.recent ? (
							<Text size="small">
								<Truncate text={item.recent.text} length={80} />
							</Text>
						) : null}
					</View>
					{item.recent ? (
						<View
							style={{ width: 100, alignItems: "flex-end", paddingRight: 10 }}
						>
							<Text size="small">
								{item.recent.date == date ? item.recent.time : item.recent.date}
							</Text>
						</View>
					) : null}
				</Ripple>
			</Swipeout>
		);
	};

	const renderItemGroup = ({ item }) => {
		let d = new Date();
		let date = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/");
		return (
			<Swipeout right={swipeoutBtn(item.id)} key={`${item.id}_child`}>
				<Ripple
					onPress={() =>
						navigation.navigate("GroupRoom", {
							room_id: item.itinerary.id,
							name: item.itinerary.name,
							picture: item.itinerary.cover,
						})
					}
					style={{
						backgroundColor: "white",
						paddingVertical: 10,
						paddingHorizontal: 10,
						flexDirection: "row",
						borderBottomWidth: 1,
						borderBottomColor: "#EEEEEE",
						alignContent: "center",
						alignItems: "center",
					}}
				>
					<Image
						source={{ uri: item.itinerary.cover }}
						style={{
							width: 50,
							height: 50,
							borderRadius: 25,
							borderWidth: 1,
							borderColor: "#EEEEEE",
						}}
					/>
					<View style={{ width: width - 160, paddingHorizontal: 10 }}>
						<Text size="description" type="bold" style={{ paddingVertical: 5 }}>
							{item.itinerary.name}
						</Text>
						{item.recent ? (
							<Text size="small">
								<Truncate text={item.recent.text} length={80} />
							</Text>
						) : null}
					</View>
					{item.recent ? (
						<View
							style={{ width: 100, alignItems: "flex-end", paddingRight: 10 }}
						>
							<Text size="small">
								{item.recent.date == date ? item.recent.time : item.recent.date}
							</Text>
						</View>
					) : null}
				</Ripple>
			</Swipeout>
		);
	};

	const _searchHandle = (text) => {
		if (active == "personal") {
			let newData = data.filter(function (str) {
				let strData = str.sender.id === user.id ? str.receiver : str.sender;
				return strData.first_name.toLowerCase().includes(text.toLowerCase());
			});
			setDataRes(newData);
		}

		if (active == "group") {
			let newDataGroup = dataGroup.filter(function (str) {
				return str.itinerary.name.toLowerCase().includes(text.toLowerCase());
			});
			setDataGroupRes(newDataGroup);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle="dark-content" />
			<FlatList
				data={active == "personal" ? dataRes : dataGroupRes}
				renderItem={active == "personal" ? renderItem : renderItemGroup}
				keyExtractor={(item) => item.id}
				stickyHeaderIndices={[0]}
				ListHeaderComponent={
					<View style={{ backgroundColor: "#209FAE" }}>
						<View
							style={{
								margin: 15,
								backgroundColor: "#FFFFFF",
								flexDirection: "row",
								borderRadius: 3,
								alignContent: "center",
								alignItems: "center",
							}}
						>
							<Magnifying
								width="20"
								height="20"
								style={{ marginHorizontal: 10 }}
							/>
							<TextInput
								onChangeText={(e) => _searchHandle(e)}
								placeholder="Search Chat"
								style={{
									color: "#464646",
									height: 40,
									width: "100%",
								}}
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								backgroundColor: "#fff",
								borderWidth: 1,
								borderColor: "#EEEEEE",
							}}
						>
							<Ripple
								onPress={() => {
									setActive("personal");
								}}
								style={{
									// width: width / 2,
									alignContent: "center",
									alignItems: "center",
									borderBottomWidth: active == "personal" ? 3 : 1,
									borderBottomColor:
										active == "personal" ? "#209FAE" : "#EEEEEE",
									paddingVertical: 15,
									backgroundColor: "#FFFFFF",
									paddingHorizontal: 25,
								}}
							>
								<Text
									size="description"
									type={active == "personal" ? "bold" : "bold"}
									style={{
										color: active == "personal" ? "#209FAE" : "#464646",
									}}
								>
									Personal
								</Text>
							</Ripple>
							<Ripple
								onPress={() => {
									setActive("group");
								}}
								style={{
									// width: width / 2,
									alignContent: "center",
									alignItems: "center",
									borderBottomWidth: active == "group" ? 3 : 1,
									borderBottomColor: active == "group" ? "#209FAE" : "#EEEEEE",
									paddingVertical: 15,
									backgroundColor: "#FFFFFF",
									paddingHorizontal: 25,
								}}
							>
								<Text
									size="description"
									type={active == "group" ? "bold" : "bold"}
									style={{
										color: active == "group" ? "#209FAE" : "#464646",
									}}
								>
									Trip Group
								</Text>
							</Ripple>
						</View>
					</View>
				}
			/>
			<Button
				onPress={() => navigation.navigate("NewChat")}
				type="circle"
				size="medium"
				style={{ position: "absolute", bottom: 20, right: 20, elevation: 5 }}
			>
				<NewChat width="20" height="20" />
			</Button>
		</SafeAreaView>
	);
}
