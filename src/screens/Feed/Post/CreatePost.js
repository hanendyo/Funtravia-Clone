import React, { useState, useEffect } from "react";
import {
	View,
	Dimensions,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
	Alert,
	Image,
	PermissionsAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image, back_arrow_white } from "../../../assets/png";
import { CustomImage, Text, Button, Loading } from "../../../component";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import AutoHeightImage from "react-native-auto-height-image";
import Account from "../../../graphQL/Query/Home/Account";
import LocationSelector from "./LocationSelector";
import { PinHijau, Xgray } from "../../../assets/svg";
import Ripple from "react-native-material-ripple";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Geolocation from "react-native-geolocation-service";
import ImgToBase64 from "react-native-image-base64";
import { request, check, PERMISSIONS } from "react-native-permissions";

const PostMut = gql`
	mutation(
		$caption: String
		$latitude: String
		$longitude: String
		$location_name: String
		$assets: String!
	) {
		create_post(
			input: {
				caption: $caption
				latitude: $latitude
				longitude: $longitude
				location_name: $location_name
				assets: $assets
			}
		) {
			id
			response_time
			message
			code
		}
	}
`;

export default function CreatePost(props) {
	const HeaderComponent = {
		title: "New Post",
		headerTintColor: "white",
		headerTitle: "",
		headerTransparent: true,
		headerShown: true,
		headerMode: "screen",
		headerStyle: {
			backgroundColor: "#209FAE",
			elevation: 0,
			borderBottomWidth: 0,
		},
		headerTitleStyle: {
			fontFamily: "Lato-Bold",
			fontSize: 14,
			color: "white",
		},
	};
	// const HeaderComponent = {
	// 	tabBarBadge: 8,
	// };
	let [statusText, setStatusText] = useState("");
	// console.log(statusText);
	let [modellocation, setModellocation] = useState(false);
	let [Location, setLocation] = useState({
		address: "Add Location",
		latitude: "",
		longitude: "",
	});
	// console.log(Location);
	let [loadingok, setLoading] = useState(false);
	let [chosenPicture, setChosenPicture] = useState(props.route.params.image);
	let [chosenPictureBase64, setChosenPictureBase64] = useState(
		props.route.params.base64
	);
	const [token, setToken] = useState(null);
	const [datanearby, setDataNearby] = useState([]);
	const [MutationCreate, { loading, data, error }] = useMutation(PostMut, {
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});
	const [
		LoadUserProfile,
		{
			data: dataprofile,
			loading: loadingprofile,
			error: errorprofile,
			refetch,
		},
	] = useLazyQuery(Account, {
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});
	const wait = (timeout) => {
		return new Promise((resolve) => {
			setTimeout(resolve, timeout);
		});
	};
	const _setStatusText = (data) => {
		setStatusText(data);
	};
	const _setLocation = (data) => {
		setLocation(data);
	};
	// console.log(chosenPicture.base64);
	const SubmitData = async () => {
		// return false;
		setLoading(true);
		let caption = statusText ? statusText : "-";
		let latitude = Location.latitude !== "" ? Location.latitude : "0";
		let longitude = Location.longitude !== "" ? Location.longitude : "0";
		let location_name =
			Location.address == "" || Location.address == "Add Location"
				? "0"
				: Location.address;
		// console.log('BASE64'+ chosenPictureBase64);
		// console.log('BASE64');
		try {
			let response = await MutationCreate({
				variables: {
					caption: caption,
					latitude: latitude,
					longitude: longitude,
					location_name: location_name,
					assets: "data:image/png;base64," + chosenPictureBase64,
				},
			});
			console.log(response);
			if (response.data) {
				if (response.data.create_post.code === 200) {
					// console.log('ok');
					setLoading(false);
					props.navigation.navigate("FeedScreen", { isposting: true });
				} else {
					// console.log('error');
					setLoading(false);
					throw new Error(response.data.create_post.message);
				}

				// Alert.alert('Succes');
			} else {
				throw new Error("Error Input");
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			Alert.alert("" + error);
		}
	};

	const _selectLocation = (value) => {
		console.log(value.latitude);
		setLocation({
			address: value.name,
			latitude: value.latitude,
			longitude: value.longitude,
		});
		wait(1000).then(() => {
			props.navigation.setParams({
				SubmitData: SubmitData,
				text: statusText,
				location: {
					address: value.name,
					latitude: value.latitude,
					longitude: value.longitude,
				},
			});
		});
	};
	const clearLoaction = () => {
		// console.log(detail);
		setLocation({
			address: "Add Location",
			latitude: "",
			longitude: "",
		});
	};

	const loadAsync = async () => {
		let access_token = await AsyncStorage.getItem("access_token");
		setToken(access_token);
		LoadUserProfile();
	};

	useEffect(() => {
		(async () => {
			let granted = false;
			if (Platform.OS == "ios") {
				let sLocation = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
				if (sLocation === "denied") {
					granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
				}
				granted = true;
			} else {
				let sLocation = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
				if (sLocation === "denied") {
					granted = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
				}
			}
			if (granted) {
				await Geolocation.getCurrentPosition(
					(position) => _nearbyLocation(position),
					(err) => console.log(err),
					{ enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
				);
			}
		})();
		props.navigation.setOptions(HeaderComponent);
		loadAsync();
	}, []);
	const convertBase64 = () => {
		// console.log('aaa');
		ImgToBase64.getBase64String(chosenPicture.uri)
			.then((base64String) => setChosenPictureBase64(base64String))
			.catch((err) => doSomethingWith(err));
	};
	const _requestLocation = async () => {};

	const _nearbyLocation = async (position) => {
		let latitude =
			props.route.params.location && props.route.params.location.latitude
				? props.route.params.location.latitude
				: position.coords.latitude;
		let longitude =
			props.route.params.location && props.route.params.location.longitude
				? props.route.params.location.longitude
				: position.coords.longitude;
		// console.log(latitude, longitude);

		try {
			let response = await fetch(
				"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
					latitude +
					"," +
					longitude +
					"&radius=500&key=AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						// Authorization: 'Bearer ' + token,
						"Content-Type": "application/json",
					},
					// body: 'originLocationCode=SYD&destinationLocationCode=BKK',
				}
			);
			let responseJson = await response.json();
			// console.log(responseJson.results);
			if (responseJson.results && responseJson.results.length > 0) {
				let nearby = [];
				for (var i of responseJson.results) {
					let data = {
						place_id: i.place_id,
						name: i.name,
						latitude: i.geometry?.location.lat,
						longitude: i.geometry?.location.lng,
						address: i.vicinity,
						icon: i.icon,
					};
					nearby.push(data);
				}
				setDataNearby(nearby);
				// console.log(nearby);
				setLoading(false);
			} else {
				setLoading(false);
				// Alert.alert('Data Kosong');
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : null}
			style={{ flex: 1, backgroundColor: "#FFFFFF" }}
		>
			<View style={{ backgroundColor: "#209FAE", height: 55 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-end",
						alignItems: "center",
						alignContent: "center",
						height: 55,
					}}
				>
					<TouchableOpacity
						onPress={() => SubmitData()}
						style={{
							paddingRight: 10,
							paddingLeft: 20,
							height: 55,
							// borderWidth: 1,
							alignItems: "center",
							alignContent: "center",
							justifyContent: "center",
						}}
					>
						<Text
							allowFontScaling={false}
							style={{
								alignSelf: "center",
								color: "#FFF",
								fontFamily: "Lato-Bold",
								fontSize: 14,
								marginHorizontal: 5,
							}}
						>
							Post
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<ScrollView style={{}}>
				<Loading show={loadingok} />
				{/* <NavigationEvents
					onDidFocus={() =>
						props.navigation.setParams({
							SubmitData: SubmitData,
							location: Location,
							text: statusText,
						})
					}
				/> */}
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View
						style={
							{
								// flex: 1,
								// justifyContent: 'flex-start',
							}
						}
					>
						{/* <View
							style={{
								// height: Dimensions.get('screen').width,
								width: Dimensions.get('screen').width,
								// Height: Dimensions.get('screen').width,
								height: Dimensions.get('screen').width,
								backgroundColor: 'white',
								justifyContent: 'center',
							}}> */}
						<AutoHeightImage
							width={Dimensions.get("window").width}
							source={
								chosenPicture && chosenPicture.uri
									? {
											uri: chosenPicture.uri,
									  }
									: default_image
							}
						/>
						{/* </View> */}

						<View
							style={{
								flexDirection: "row",
								// marginTop: 25,
								backgroundColor: "#ffffff",
								borderBottomColor: "#f0f0f0f0",
								borderBottomWidth: 1,
								// height: Dimensions.get('screen').height / 3,
							}}
						>
							<Image
								source={
									dataprofile &&
									(dataprofile.user_profile !== undefined || null || "")
										? { uri: dataprofile.user_profile.picture }
										: default_image
								}
								style={{
									width: 50,
									height: 50,
									// padding: 10,
									borderRadius: 50,
									margin: 10,
									marginRight: 15,
								}}
							/>
							<TextInput
								multiline
								placeholder={"Write a caption.."}
								maxLength={255}
								style={{
									height: 75,
									width: Dimensions.get("screen").width - 100,
									// borderBottomColor: '#f0f0f0f0',
									// borderWidth: 1,
								}}
								onChangeText={(text) => _setStatusText(text)}
								value={statusText}
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginTop: 10,
								marginHorizontal: 15,
							}}
						>
							<Ripple
								onPress={() => setModellocation(true)}
								style={{
									flexDirection: "row",

									alignItems: "center",
								}}
							>
								{Location.latitude !== "" ? (
									<PinHijau height={15} width={15} />
								) : null}
								<Text
									type="bold"
									size="description"
									style={{
										marginHorizontal: 5,
									}}
								>
									{Location.address}
								</Text>
							</Ripple>
							{Location.latitude !== "" ? (
								<Ripple
									onPress={() => clearLoaction()}
									style={{
										padding: 5,
									}}
								>
									<Xgray height={15} width={15} />
								</Ripple>
							) : null}
						</View>
						<View
							style={{
								borderBottomColor: "#E1E1E1",
								borderBottomWidth: 1,
								width: 150,
								margin: 10,
							}}
						></View>
						{/* <FlatList
							data={datanearby}
							style={{
								marginHorizontal: 10,
							}}
							renderItem={({ item, index }) => (
								<Button
									type='box'
									variant='bordered'
									color='primary'
									size='small'
									style={{
										marginHorizontal: 2,
									}}
									text={item.name}></Button>
							)}
							horizontal
							showsHorizontalScrollIndicator={false}
							keyExtractor={(item) => item.place_id}
						/> */}
						<View
							style={{
								width: "100%",
								flexWrap: "wrap",
								flexDirection: "row",
								paddingHorizontal: 10,
							}}
						>
							{datanearby.map((value, index) => {
								return index < 5 ? (
									<Button
										onPress={() => _selectLocation(value)}
										type="box"
										variant="bordered"
										color="primary"
										size="small"
										style={{
											marginHorizontal: 2,
											marginVertical: 2,
										}}
										text={value.name}
									></Button>
								) : null;
							})}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</ScrollView>
			<LocationSelector
				modals={modellocation}
				setModellocation={(e) => setModellocation(e)}
				masukan={(e) => _setLocation(e)}
			/>
		</KeyboardAvoidingView>
	);
}
