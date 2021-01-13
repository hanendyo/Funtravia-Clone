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
} from "react-native";
import { Arrowbackwhite, Delete, Magnifying, NewChat } from "../../assets/svg";
import { Text } from "../../component";
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
		title: "Messages",
		headerTintColor: "white",
		headerTitle: "Message",
		headerMode: "screen",
		headerStyle: {
			backgroundColor: "#209FAE",
			elevation: 0,
			borderBottomWidth: 0,
		},
		headerTitleStyle: {
			fontFamily: "Lato-Regular",
			fontSize: 14,
			color: "white",
		},
		headerLeftContainerStyle: {
			background: "#FFF",
		},
		headerRight: () => (
			<TouchableOpacity
				style={{
					height: 40,
					width: 40,
					justifyContent: "center",
					alignContent: "center",
					alignItems: "center",
				}}
				onPress={() => navigation.navigate("NewChat")}
			>
				<NewChat height={20} width={20} />
			</TouchableOpacity>
		),
		tabBarBadge: 9,
	};

	useEffect(() => {
		navigation.setOptions(HeaderComponent);
		getUserAndToken();
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
		let setting = await AsyncStorage.getItem("setting");
		if (setting) {
			await setUser(JSON.parse(setting).user);
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
		let change = item.sender.id == user.id ? item.receiver : item.sender;
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
						paddingVertical: 15,
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
						{/* <Text size='small'>{item.recent_chat.text}</Text>
						<Text size='small' type='bold'>
							This Is Current Message
						</Text> */}
					</View>
					{/* <View
						style={{ width: 100, alignItems: 'flex-end', paddingRight: 10 }}>
						<Text size='small'>{duration(item.recent_chat.created_at)}</Text>
					</View> */}
				</Ripple>
			</Swipeout>
		);
	};

	const renderItemGroup = ({ item }) => {
		return (
			<Swipeout right={swipeoutBtn(item.id)} key={`${item.id}_child`}>
				<Ripple
					onPress={() =>
						navigation.navigate("GroupChat", {
							room_id: item.itinerary.id,
							name: item.itinerary.name,
							picture: item.itinerary.cover,
						})
					}
					style={{
						backgroundColor: "white",
						paddingVertical: 15,
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
						{/* <Text size='small'>{item.recent_chat.text}</Text>
						<Text size='small' type='bold'>
							This Is Current Message
						</Text> */}
					</View>
					{/* <View
						style={{ width: 100, alignItems: 'flex-end', paddingRight: 10 }}>
						<Text size='small'>{duration(item.recent_chat.created_at)}</Text>
					</View> */}
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
			<FlatList
				data={active == "personal" ? dataRes : dataGroupRes}
				renderItem={active == "personal" ? renderItem : renderItemGroup}
				keyExtractor={(item) => item.id}
				stickyHeaderIndices={[0]}
				ListHeaderComponent={
					<View style={{ backgroundColor: "#fff" }}>
						<View
							style={{
								marginHorizontal: 15,
								marginTop: 15,
								backgroundColor: "#E2ECF8",
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
						<View style={{ flexDirection: "row" }}>
							<Ripple
								onPress={() => {
									setActive("personal");
								}}
								style={{
									width: width / 2,
									alignContent: "center",
									alignItems: "center",
									borderBottomWidth: active == "personal" ? 3 : 1,
									borderBottomColor:
										active == "personal" ? "#209FAE" : "#EEEEEE",
									paddingVertical: 15,
								}}
							>
								<Text
									size="description"
									type={active == "personal" ? "bold" : "regular"}
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
									width: width / 2,
									alignContent: "center",
									alignItems: "center",
									borderBottomWidth: active == "group" ? 3 : 1,
									borderBottomColor: active == "group" ? "#209FAE" : "#EEEEEE",
									paddingVertical: 15,
								}}
							>
								<Text
									size="description"
									type={active == "group" ? "bold" : "regular"}
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
		</SafeAreaView>
	);
}
