import React, { useEffect, useState } from "react";
import {
	View,
	TextInput,
	Dimensions,
	TouchableOpacity,
	SafeAreaView,
	FlatList,
	Image,
	Alert,
	StyleSheet,
} from "react-native";
import { NewGroup, Magnifying, NewChat, Kosong } from "../../assets/svg";
import { DefaultProfile } from "../../assets/png";
import { Text, Button, Truncate, StatusBar, Errors } from "../../component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { CHATSERVER } from "../../config";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";

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

		if (token === null) {
			Alert.alert("Silahkan login terlebih dahulu");
			navigation.navigate("HomeScreen");
		}
		let setting = JSON.parse(await AsyncStorage.getItem("setting"));
		if (setting) {
			await setUser(setting.user);
		}
	};

	const [messages, setMessages] = useState("");
	const [modalError, setModalError] = useState(false);

	const LongPressFunc = (item) => {
		Alert.alert(
			"Confirm",
			`Are you sure to delete message with ${item.first_name} ${
				item.last_name ? item.last_name : ""
			}`,
			[
				{
					text: "Cancel",
					onPress: () => console.log("Canceled"),
					style: "cancel",
				},
				{ text: "OK", onPress: () => DeleteChat(item.id) },
			]
		);
	};

	const DeleteChat = async (id) => {
		let response = await fetch(
			`${CHATSERVER}/api/personal/delete?receiver_id=${id}`,
			{
				method: "DELETE",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		getRoom(token);
		let dataResponse = await response.json();
	};

	const renderItem = ({ item }) => {
		let timeChat = new Date(item.recent?.time).toTimeString();
		let dateChateDate = new Date(item.recent?.time).getDate();
		let dateChateMonth = new Date(item.recent?.time).getMonth();
		let dateChateYear = new Date(item.recent?.time)
			.getFullYear()
			.toString()
			.substr(2, 2);
		let dateChat =
			dateChateDate + "/" + (dateChateMonth + 1) + "/" + dateChateYear;
		const dates = new Date();
		let day = dates.getDate();
		let month = dates.getMonth();
		let year = dates.getFullYear().toString().substr(2, 2);
		let date = day + "/" + (month + 1) + "/" + year;
		let change = item.sender_id === user.id ? item.receiver : item.sender;
		return (
			<View key={`${item.id}_child`}>
				{item?.recent !== null ? (
					<TouchableOpacity
						onLongPress={() => LongPressFunc(change)}
						onPress={() =>
							navigation.navigate("ChatStack", {
								screen: "RoomChat",
								params: {
									room_id: item.id,
									receiver: change.id,
									name:
										change.first_name +
										" " +
										(change.last_name ? change.last_name : ""),
									picture: change.picture,
								},
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
							<Text
								size="description"
								type="bold"
								style={{ paddingVertical: 5 }}
							>
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
									{timeChat
										? dateChat == date
											? timeChat.substring(0, 5)
											: dateChat
										: null}
								</Text>
							</View>
						) : null}
					</TouchableOpacity>
				) : null}
			</View>
		);
	};

	const renderItemGroup = ({ item }) => {
		let timeChat = new Date(item.recent?.time).toTimeString();
		let dateChat = new Date(item.recent?.time).toLocaleDateString();
		let date = new Date().toLocaleDateString();
		return (
			<View key={`${item.id}_child`}>
				<Ripple
					onPress={() =>
						navigation.navigate("ChatStack", {
							screen: "GroupRoom",
							params: {
								room_id: item.group_id,
								name: item.title,
								picture: item.picture,
								from: item.itinerary ? "itinerary" : "group",
							},
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
						source={{ uri: item.picture }}
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
							{item.title}
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
								{timeChat
									? dateChat == date
										? timeChat.substring(0, 5)
										: dateChat
									: null}
							</Text>
						</View>
					) : null}
				</Ripple>
			</View>
		);
	};

	const _searchHandle = (text) => {
		// if (active == "personal") {
		let newData = data.filter(function (str) {
			let strData = str.sender.id === user.id ? str.receiver : str.sender;
			return strData.first_name.toLowerCase().includes(text.toLowerCase());
		});
		setDataRes(newData);
		// }

		// if (active == "group") {
		let newDataGroup = dataGroup.filter(function (str) {
			return str.itinerary.title.toLowerCase().includes(text.toLowerCase());
		});
		setDataGroupRes(newDataGroup);
		// }
	};

	const Personal = () => (
		<>
			{dataRes && dataRes.length > 0 ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={dataRes}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
					/>
					<Button
						onPress={() =>
							navigation.navigate("ChatStack", { screen: "NewChat" })
						}
						type="circle"
						size="medium"
						style={{
							position: "absolute",
							bottom: 20,
							right: 20,
							elevation: 5,
						}}
					>
						<NewChat width="20" height="20" />
					</Button>
				</View>
			) : (
				<Kosong width={width} height={width} />
			)}
		</>
	);
	const Group = () => (
		<>
			{dataGroupRes && dataGroupRes.length > 0 ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={dataGroupRes}
						renderItem={renderItemGroup}
						keyExtractor={(item) => item.id}
					/>
					<Button
						onPress={() =>
							navigation.navigate("ChatStack", { screen: "NewGroup" })
						}
						type="circle"
						size="medium"
						style={{
							position: "absolute",
							bottom: 20,
							right: 20,
							elevation: 5,
						}}
					>
						<NewGroup width="20" height="20" />
					</Button>
				</View>
			) : (
				<Kosong width={width} height={width} />
			)}
		</>
	);

	const HeaderHeight = width + 5;

	const renderLabel = ({ route, focused }) => {
		return (
			<Text
				style={[
					focused ? styles.labelActive : styles.label,
					{ opacity: focused ? 1 : 0.7 },
				]}
			>
				{route.title}
			</Text>
		);
	};

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: "personal", title: "Personal" },
		{ key: "group", title: "Group" },
	]);

	const renderScene = SceneMap({
		personal: Personal,
		group: Group,
	});

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle="dark-content" />
			<Errors
				modals={modalError}
				setModals={(e) => setModalError(e)}
				message={messages}
			/>
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
					<Magnifying width="20" height="20" style={{ marginHorizontal: 10 }} />
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
			</View>
			<TabView
				lazy={true}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				renderTabBar={(props) => {
					return (
						<TabBar
							{...props}
							style={{
								backgroundColor: "white",
							}}
							renderLabel={renderLabel}
							indicatorStyle={styles.indicator}
						/>
					);
				}}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF",
	},
	header: {
		height: 100,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		backgroundColor: "#FFF",
	},
	label: {
		fontSize: 14,
		color: "#464646",
		fontFamily: "Lato-Bold",
	},
	labelActive: {
		fontSize: 14,
		color: "#209FAE",
		fontFamily: "Lato-Bold",
	},
	tab: {
		elevation: 1,
		shadowOpacity: 0.5,
		backgroundColor: "#FFF",
		height: 50,
	},
	indicator: { backgroundColor: "#209FAE", height: 3 },
});
