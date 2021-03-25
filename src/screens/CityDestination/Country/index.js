import React, { useState, useCallback, useEffect, useRef } from "react";
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	Image,
	Animated,
	ScrollView,
	PanResponder,
	FlatList,
	Alert,
	ActivityIndicator,
	StatusBar,
	SafeAreaView,
	TouchableOpacity,
	Pressable,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import {
	Arrowbackwhite,
	OptionsVertWhite,
	Love,
	Electric,
	Emergency,
	Health,
	Lang,
	Money,
	Passport,
	Time,
	Tax,
	PinWhite,
	LikeEmpty,
	LikeRed,
} from "../../../assets/svg";
import {
	default_image,
	search_button,
	logo_funtravia,
} from "../../../assets/png";
import { Input, Tab, Tabs } from "native-base";
import { Capital, Truncate , StatusBar as StaBar} from "../../../component";
import Ripple from "react-native-material-ripple";
import { Text, Button } from "../../../component";
import Article from "./Article";
import { FunIcon, Loading, Sidebar } from "../../../component";
// import Sidebar from "../../../component/src/Sidebar";
import CountrisInformation from "../../../graphQL/Query/Countries/Countrydetail";
import { useTranslation } from "react-i18next";
import ImageSlider from "react-native-image-slider";
import { TouchableHighlight } from "react-native-gesture-handler";
import { TabBar, TabView } from "react-native-tab-view";


const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const HeaderHeight = 300;
const SafeStatusBar = Platform.select({
	ios: 44,
	android: StatusBar.currentHeight,
});

const screenHeight = Dimensions.get("window").height;

let HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.3;
let HEADER_MIN_HEIGHT = 55;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function Country(props) {
	console.log(props.route.params.data.id);
	let [token, setToken] = useState("");
	console.log("token", token);
	const { t, i18n } = useTranslation();
	const { width, height } = Dimensions.get("screen");
	const [active, setActive] = useState("Map");
	const [actives, setActives] = useState("General");
	const [actived, setActived] = useState("About");
	// const [loadings, setloadings] = useState(true);
	let [search, setTextc] = useState("");
	let [showside, setshowside] = useState(false);
	let [full, setFull] = useState(false);

	const _tabIndex = useRef(0);
	const listRefArr = useRef([]);
  	const listOffset = useRef({});
	const isListGliding = useRef(false);
	const [tabIndex, setIndex] = useState(0);
	const [routes, setRoutes] = useState([1]);
	const [canScroll, setCanScroll] = useState(true);
	const [tabGeneral] = useState(Array(1).fill(0));
	const [tab2Data] = useState(Array(1).fill(0));


	const scrollY = useRef(new Animated.Value(0)).current;
	const headerScrollY = useRef(new Animated.Value(0)).current;
	// for capturing header scroll on Android
	const headerMoveScrollY = useRef(new Animated.Value(0)).current;
	const imageOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0.5, 0],
		extrapolate: "clamp",
	});

	const imageTranslate = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [0, -50],
		extrapolate: "clamp",
	});

	const headerHeight = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
		extrapolate: "clamp",
	});

	

	const [
		getPackageDetail,
		{ loading, data, error },
	  ] = useLazyQuery(CountrisInformation, {
		 fetchPolicy: "network-only",
		variables: {
		  id: props.route.params.data.id,
		},
		context: {
		  headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		  },
		},
		onCompleted: () => {
			let tab = [{ key: "general", title: "General" }];
	  
			data.country_detail.article_header.map((item, index) => {
			  tab.push({ key: item.title, title: item.title });
			});
	  
			setRoutes(tab);
		  
		}
	  });
	

	const refresh = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		await setToken(tkn);
		await getPackageDetail();
		// await setloadings(false);
	};
	
	// tampung data country
	let dataCountry = [];
	if(data){
		dataCountry = data.country_detail;
	}
	
	

	useEffect(() => {
		// props.navigation.setOptions(HeaderComponent);
		refresh();
	}, []);

	const rendertabGlace = (dataaktif, kiriman) => {
		if (dataaktif === "Map") {
			return (
				<Image
					source={kiriman.map ? { uri: kiriman.map } : default_image}
					style={{
						width: "100%",
						height: width * 0.7,
						resizeMode: "center",
					}}
				></Image>
			);
		} else {
			return (
				<Image
					source={default_image}
					style={{
						width: "100%",
						height: width * 0.7,
						resizeMode: "center",
					}}
				></Image>
			);
		}
	};

	const rendertabEssential = (dataaktif, kiriman) => {
		if (dataaktif === "Practical") {
			return (
				<View
					style={{
						width: "100%",
						paddingVertical: 20,
						flexWrap: "wrap",
						flexDirection: "row",
					}}
				>
					<Ripple
						onPress={() => {
							props.navigation.navigate("PracticalInformation");
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Electric width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Elecricity")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("PracticalInformation");
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Emergency width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Emergency no")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("PracticalInformation");
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Health width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Health")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("PracticalInformation");
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Lang width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Language")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("PracticalInformation");
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Money width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Money")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("PracticalInformation");
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Passport width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Visa & Passport")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("PracticalInformation");
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Time width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Time Zone")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("PracticalInformation");
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Tax width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Taxes & Tipping")}
						</Text>
					</Ripple>
				</View>
			);
		} else if (dataaktif === "About") {
			return (
				<View
					style={{
						width: "100%",
						paddingVertical: 20,
						flexWrap: "wrap",
						flexDirection: "row",
					}}
				>
					<Ripple
						onPress={() => {
							props.navigation.navigate("Abouts", {
								active: "History",
							});
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Tax width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("History")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("Abouts", {
								active: "whentogo",
							});
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Tax width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("When to go")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("Abouts", {
								active: "localfood",
							});
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Tax width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Local food")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("Abouts", {
								active: "art",
							});
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Tax width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Art & Culture")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("Abouts", {
								active: "souvenir",
							});
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Tax width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Souvenir")}
						</Text>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("Abouts", {
								active: "telecomunication",
							});
						}}
						style={{
							width: "33.333%",
							alignContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Tax width={40} height={40} />
						<Text size="small" style={{ textAlign: "center", marginTop: 3 }}>
							{t("Telecomunication")}
						</Text>
					</Ripple>
				</View>
			);
		}
	};

	const Renderfact = ({ data, header, country }) => {
		var y = data.length;
		var x = 2;
		var z = 3;
		var remainder = y % x;
		var remainderz = y % z;
		return (
			<FlatList
				numColumns={
					data.length && data.length > 1
						? data.length === 2 && remainder === 0
							? 2
							: 3
						: 1
				}
				data={data}
				renderItem={({ item, index }) => {
					return (
						<Ripple
							onPress={() => {
								props.navigation.push("ArticelCategory", {
									id: item.id,
									header: header,
									country: country,
								});
							}}
							style={{
								width:
									data.length && data.length > 1
										? data.length === 2 && remainder === 0
											? "50%"
											: "33.33%"
										: "100%",

								alignContent: "center",
								alignItems: "center",
								padding: 7,
								borderRightWidth:
									index !== 8 &&
									index !== 5 &&
									index !== 2 &&
									index !== data.length
										? 0.5
										: 0,
								borderBottomWidth:
									data.length > 3
										? index !== data.length &&
										  index !== data.length - 1 &&
										  index !== data.length - 2
											? 0.5
											: 0
										: 0,

								borderColor: "#209fae",
							}}
						>
							<Text
								size="description"
								type="bold"
								style={{ textAlign: "center", marginTop: 3, width: "100%" }}
							>
								{item.name}
							</Text>
						</Ripple>
					);
				}}
			/>
		);
	};

	const spreadData = (data) => {
		let tmpData = [];
		let count = 1;
		let tmpArray = [];
		for (let val of data) {
			if (count < 2) {
				tmpArray.push(val);
				// console.log("masuk", tmpArray);
				count++;
			} else {
				tmpArray.push(val);
				tmpData.push(tmpArray);
				count = 1;
				tmpArray = [];
			}
		}
		if (tmpArray.length) {
			tmpData.push(tmpArray);
		}
		return tmpData;
	};

	const RenderUtama = ({ aktif, render }) => {
		if (aktif === "General") {
			return (
				<View>
					{/* General information */}
					{render && render.description ? (
						<View
							style={{
								paddingHorizontal: 20,
								paddingVertical: 10,
								flexDirection: "column",
							}}
						>
							<View>
								<Text type="bold" size="label" style={{}}>
									{t("generalInformation")}
								</Text>
								<Text
									size="description"
									style={{
										textAlign: "justify",
										lineHeight: 21,
									}}
								>
									{render ? render.description : null}
								</Text>
							</View>
						</View>
					) : null}
					{/* at Glance */}
					<View
						style={{
							paddingVertical: 10,
							paddingHorizontal: 20,
							width: "100%",
						}}
					>
						<Text size="label" type="bold" style={{}}>
							<Capital text={render.name} />
							{t("atGlance")}
						</Text>
						{/* <Text size="description">Good destination for your trip</Text> */}
						<View
							style={{
								marginTop: 10,
								backgroundColor: "white",
								width: "100%",
								shadowColor: "#d3d3d3",
								shadowOffset: { width: 2, height: 2 },
								shadowOpacity: 1,
								shadowRadius: 2,
								elevation: 2,
								borderRadius: 5,
								padding: 20,
							}}
						>
							<View style={{ flexDirection: "row", width: "100%" }}>
								<Ripple
									onPress={() => {
										setActive("Map");
									}}
									style={{
										width: "33.333%",
										alignContent: "center",
										alignItems: "center",
										borderBottomWidth: active == "Map" ? 3 : 1,
										borderBottomColor: active == "Map" ? "#209FAE" : "#EEEEEE",
										paddingVertical: 15,
									}}
								>
									<Text
										size="description"
										type={active == "Map" ? "bold" : "regular"}
										style={{
											color: active == "Map" ? "#209FAE" : "#464646",
										}}
									>
										{t("Map")}
									</Text>
								</Ripple>
								<Ripple
									onPress={() => {
										setActive("climate");
									}}
									style={{
										width: "33.333%",
										alignContent: "center",
										alignItems: "center",
										borderBottomWidth: active == "climate" ? 3 : 1,
										borderBottomColor:
											active == "climate" ? "#209FAE" : "#EEEEEE",
										paddingVertical: 15,
									}}
								>
									<Text
										size="description"
										type={active == "climate" ? "bold" : "regular"}
										style={{
											color: active == "climate" ? "#209FAE" : "#464646",
										}}
									>
										{t("Climate")}
									</Text>
								</Ripple>
								<Ripple
									onPress={() => {
										setActive("Religion");
									}}
									style={{
										width: "33.333%",
										alignContent: "center",
										alignItems: "center",
										borderBottomWidth: active == "Religion" ? 3 : 1,
										borderBottomColor:
											active == "Religion" ? "#209FAE" : "#EEEEEE",
										paddingVertical: 15,
									}}
								>
									<Text
										size="description"
										type={active == "Religion" ? "bold" : "regular"}
										style={{
											color: active == "Religion" ? "#209FAE" : "#464646",
										}}
									>
										{t("Religion")}
									</Text>
								</Ripple>
							</View>
							{active ? rendertabGlace(active, render) : null}
						</View>
					</View>
					{/* Travel Jurnal */}
					{render.journal ? (
						<View
							style={{
								paddingVertical: 10,
								paddingHorizontal: 20,
								width: "100%",
							}}
						>
							<Text size="label" type="bold" style={{}}>
								Travel Journal
								{/* {t("TravelJurnal")} */}
							</Text>
							<Text size="description">
								Traveller Adventures, Stories, Memories and Discovery
							</Text>
							<View
								style={{
									marginTop: 10,
									backgroundColor: "white",
									height: width * 0.52,
									width: "100%",
									shadowColor: "#d3d3d3",
									shadowOffset: { width: 2, height: 2 },
									shadowOpacity: 1,
									shadowRadius: 2,
									elevation: 2,
									borderRadius: 5,
									padding: 20,
								}}
							>
								{render.journal ? (
									<ImageSlider
										images={render.journal ? spreadData(render.journal) : []}
										style={{
											borderTopLeftRadius: 5,
											borderTopRightRadius: 5,
											backgroundColor: "#white",
										}}
										customSlide={({ index, item, style, width }) => (
											<View>
												{item.map((dataX, inde) => {
													// console.log(dataX);
													return (
														<Ripple
															onPress={() =>
																props.navigation.push(
																	"JournalStackNavigation",
																	{
																		screen: "DetailJournal",
																		params: {
																			dataPopuler: dataX,
																		},
																	}
																)
															}
															style={{
																flexDirection: "row",
																width: width - 80,
																height: width * 0.2,
															}}
														>
															<Image
																source={
																	item.picture
																		? { uri: dataX.picture }
																		: logo_funtravia
																}
																style={{
																	height: width * 0.15,
																	width: width * 0.15,
																	borderRadius: 5,
																}}
															></Image>
															<View
																style={{
																	paddingHorizontal: 10,
																	width: width - (100 + width * 0.15),
																	flexDirection: "row",
																	justifyContent: "space-between",
																}}
															>
																<View style={{ width: "100%" }}>
																	<Text style={{ width: "80%" }} type="bold">
																		<Truncate text={dataX.title} length={40} />
																	</Text>
																	<Text>
																		<Truncate text={dataX.text} length={30} />
																	</Text>
																</View>
																{/* <Love height={15} width={15} /> */}
															</View>
														</Ripple>
													);
												})}
											</View>
										)}
										customButtons={(position, move) => (
											<View
												style={{
													paddingTop: 10,
													alignContent: "center",
													alignItems: "center",
													flexDirection: "row",
													justifyContent: "center",
												}}
											>
												{(render.journal ? spreadData(render.journal) : []).map(
													(image, index) => {
														return (
															<TouchableHighlight
																key={index}
																underlayColor="#f7f7f700"
																// onPress={() => move(index)}
															>
																<View
																	style={{
																		height: position === index ? 5 : 5,
																		width: position === index ? 15 : 5,
																		borderRadius: position === index ? 7 : 3,
																		backgroundColor:
																			position === index
																				? "#209fae"
																				: "#d3d3d3",
																		marginHorizontal: 3,
																	}}
																></View>
															</TouchableHighlight>
														);
													}
												)}
											</View>
										)}
									/>
								) : (
									<View
										style={{
											height: "100%",
											width: "100%",
											justifyContent: "center",
											alignContent: "center",
											alignItems: "center",
										}}
									>
										<Text>Travel Journal Empty</Text>
									</View>
								)}
							</View>
						</View>
					) : null}
					{/* Destination */}
					{render.city ? (
						<View
							style={{
								paddingHorizontal: 20,
								paddingVertical: 10,
								flexDirection: "column",
							}}
						>
							<View>
								<Text type="bold" size="label" style={{}}>
									{t("popularDestination")}
								</Text>
								<Text
									size="description"
									style={{
										textAlign: "justify",
									}}
								>
									{t("Goodplacegoodtrip")}
								</Text>
								<View
									style={{
										marginTop: 10,
										backgroundColor: "white",
										width: "100%",
										shadowColor: "#d3d3d3",
										shadowOffset: { width: 2, height: 2 },
										shadowOpacity: 1,
										shadowRadius: 2,
										elevation: 2,
										borderRadius: 5,

										padding: 10,
									}}
								>
									<ImageSlider
										images={render.city ? render.city : []}
										style={{
											borderTopLeftRadius: 5,
											borderTopRightRadius: 5,
											backgroundColor: "#white",
											width: Dimensions.get("screen").width - 60,
										}}
										customSlide={({ index, item, style, width }) => (
											<View
												key={"kota=" + item.id}
												style={{
													width: Dimensions.get("screen").width - 60,
													alignItems: "center",
													alignContent: "center",
												}}
											>
												<Text
													size="label"
													type="bold"
													style={{ textAlign: "center", marginTop: 3 }}
												>
													<Capital text={item.name} />
												</Text>
												<Ripple
													onPress={() => {
														props.navigation.navigate("CountryStack", {
															screen: "CityDetail",
															params: {
																data: {
																	city_id: item.id,
																	city_name: item.name,
																},
																exParam: true,
															},
														});
													}}
													style={{
														height: width * 0.4,
														width: "99%",
														borderRadius: 10,
														marginVertical: 2,
													}}
												>
													<Image
														style={{
															height: "100%",
															width: "100%",
															borderRadius: 10,
														}}
														source={
															item.image ? { uri: item.image } : default_image
														}
													></Image>
												</Ripple>
												<View
													style={{
														width: "100%",
														flexWrap: "wrap",
														flexDirection: "row",
														justifyContent: "flex-start",
													}}
												>
													{item.destination && item.destination.length > 0 ? (
														<FlatList
															data={item.destination}
															numColumns={4}
															renderItem={({ item, index }) => (
																<Ripple
																	onPress={() => {
																		props.navigation.navigate("detailStack", {
																			id: item.id,
																			name: item.name,
																		});
																	}}
																	style={{
																		// width: (width - 60) / 4,
																		alignContent: "center",
																		alignItems: "center",
																		borderColor: "#209fae",
																		padding: 2,
																	}}
																>
																	<Image
																		style={{
																			borderRadius: 10,
																			height: (width - 80) / 4,
																			width: (width - 80) / 4,
																		}}
																		source={
																			item.images
																				? { uri: item.images[0].image }
																				: default_image
																		}
																	></Image>
																	<Text
																		size="small"
																		type="bold"
																		style={{
																			textAlign: "center",
																			marginTop: 3,
																		}}
																	>
																		<Truncate
																			text={Capital({ text: item.name })}
																			length={13}
																		/>
																	</Text>
																</Ripple>
															)}
														/>
													) : (
														<View
															style={{
																flex: 1,
																paddingTop: 100,
																alignContent: "center",
																alignItems: "center",
															}}
														>
															<Text>No Popular Destintation</Text>
														</View>
													)}
												</View>
											</View>
										)}
										customButtons={(position, move) => (
											<View
												style={{
													// width: width - 40,
													// position: "absolute",
													// bottom: 10,
													// left: 0,
													paddingVertical: 10,
													alignContent: "center",
													alignItems: "center",
													flexDirection: "row",
													justifyContent: "center",
												}}
											>
												{(render.city.length ? render.city : []).map(
													(image, index) => {
														return (
															<TouchableHighlight
																key={"lol" + index}
																underlayColor="#f7f7f700"
																// onPress={() => move(index)}
															>
																<View
																	style={{
																		height: position === index ? 5 : 5,
																		width: position === index ? 15 : 5,
																		borderRadius: position === index ? 7 : 3,
																		backgroundColor:
																			position === index
																				? "#209fae"
																				: "#d3d3d3",
																		marginHorizontal: 3,
																	}}
																></View>
															</TouchableHighlight>
														);
													}
												)}
											</View>
										)}
									/>
								</View>
							</View>
						</View>
					) : null}
					{/* facts */}
					{render.article_type && render.article_type.length > 0 ? (
						<View
							style={{
								paddingHorizontal: 20,
								paddingVertical: 10,
								flexDirection: "column",
							}}
						>
							<View>
								<Text type="bold" size="label" style={{}}>
									{render.name} {t("Unique Facts")}
								</Text>
								<Text
									size="description"
									style={{
										textAlign: "justify",
									}}
								>
									{t("Explorefindout")}
								</Text>
								<View
									style={{
										marginTop: 10,
										backgroundColor: "white",
										width: "100%",
										shadowColor: "#d3d3d3",
										shadowOffset: { width: 2, height: 2 },
										shadowOpacity: 1,
										shadowRadius: 2,
										elevation: 2,
										borderRadius: 5,
										borderLeftWidth: 0.5,
										borderRightWidth: 0.5,
										borderBottomWidth: 0.5,
										borderColor: "#209fae",
									}}
								>
									<Image
										style={{
											height: width * 0.4,
											width: "100%",
											borderTopLeftRadius: 5,
											borderTopRightRadius: 5,
										}}
										source={default_image}
									></Image>
									<View
										style={{
											width: "100%",
											alignContent: "center",
											alignItems: "center",
											justifyContent: "center",
											height: 40,
											backgroundColor: "#22ba64",
										}}
									>
										<Text size="label" type="bold" style={{ color: "white" }}>
											Indonesian Facts
										</Text>
									</View>
									<View
										style={{
											width: "100%",
											flexWrap: "wrap",
											flexDirection: "row",
										}}
									>
										<Renderfact
											data={
												render.article_type && render.article_type.length > 0
													? render.article_type
													: []
											}
											header={render.name + " " + t("unique facts")}
											country={props.route.params.data.id}
										/>
									</View>
								</View>
							</View>
						</View>
					) : null}
					{/* Essential */}
					<View
						style={{
							paddingVertical: 10,
							paddingHorizontal: 20,
							width: "100%",
						}}
					>
						<Text size="label" type="bold" style={{}}>
							{t("Essentials")}
						</Text>
						<Text size="description"> {t("infoHelpTrip")} </Text>
						<View
							style={{
								marginTop: 10,
								backgroundColor: "white",
								// height: 100,
								width: "100%",
								shadowColor: "#d3d3d3",
								shadowOffset: { width: 2, height: 2 },
								shadowOpacity: 1,
								shadowRadius: 2,
								elevation: 2,
								borderRadius: 5,
							}}
						>
							<View style={{ flexDirection: "row", width: "100%" }}>
								<Ripple
									onPress={() => {
										setActived("About");
									}}
									style={{
										width: "50%",
										alignContent: "center",
										alignItems: "center",
										borderBottomWidth: actived == "About" ? 3 : 1,
										borderBottomColor:
											actived == "About" ? "#209FAE" : "#EEEEEE",
										paddingVertical: 15,
									}}
								>
									<Text
										size="description"
										type={actived == "About" ? "bold" : "regular"}
										style={{
											color: actived == "About" ? "#209FAE" : "#464646",
										}}
									>
										{t("About")}
									</Text>
								</Ripple>
								<Ripple
									onPress={() => {
										setActived("Practical");
									}}
									style={{
										width: "50%",
										alignContent: "center",
										alignItems: "center",
										borderBottomWidth: actived == "Practical" ? 3 : 1,
										borderBottomColor:
											actived == "Practical" ? "#209FAE" : "#EEEEEE",
										paddingVertical: 15,
									}}
								>
									<Text
										size="description"
										type={actived == "Practical" ? "bold" : "regular"}
										style={{
											color: actived == "Practical" ? "#209FAE" : "#464646",
										}}
									>
										{t("Practical Information")}
									</Text>
								</Ripple>
							</View>
							{actived ? rendertabEssential(actived, render) : null}
						</View>
					</View>
				</View>
			);
		} else {
			return <Article props={props} data={render.article_header[aktif]} />;
		}
	};

	const listPanResponder = useRef(
		PanResponder.create({
		  onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
		  onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
		  onStartShouldSetPanResponder: (evt, gestureState) => false,
		  onMoveShouldSetPanResponder: (evt, gestureState) => {
			headerScrollY.stopAnimation();
			return false;
		  },
		  onShouldBlockNativeResponder: () => true,
		  onPanResponderGrant: (evt, gestureState) => {
			headerScrollY.stopAnimation();
		  },
		})
	  ).current;

	  const syncScrollOffset = () => {
		const curRouteKey = routes[_tabIndex.current].key;
	
		listRefArr.current.forEach((item) => {
		  if (item.key !== curRouteKey) {
			if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
			  if (item.value) {
				item.value.scrollToOffset({
				  offset: scrollY._value,
				  animated: false,
				});
				listOffset.current[item.key] = scrollY._value;
			  }
			} else if (scrollY._value >= HeaderHeight) {
			  if (
				listOffset.current[item.key] < HeaderHeight ||
				listOffset.current[item.key] == null
			  ) {
				if (item.value) {
				  item.value.scrollToOffset({
					offset: HeaderHeight,
					animated: false,
				  });
				  listOffset.current[item.key] = HeaderHeight;
				}
			  }
			}
		  }
		});
	  };

	  const startRefreshAction = () => {
		if (Platform.OS === "ios") {
		  listRefArr.current.forEach((listRef) => {
			listRef.value.scrollToOffset({
			  offset: -50,
			  animated: true,
			});
		  });
		  refresh().finally(() => {
			syncScrollOffset();
			// do not bounce back if user scroll to another position
			if (scrollY._value < 0) {
			  listRefArr.current.forEach((listRef) => {
				listRef.value.scrollToOffset({
				  offset: 0,
				  animated: true,
				});
			  });
			}
		  });
		} else if (Platform.OS === "android") {
		  Animated.timing(headerMoveScrollY, {
			toValue: -150,
			duration: 300,
			useNativeDriver: true,
		  }).start();
		  refresh().finally(() => {
			Animated.timing(headerMoveScrollY, {
			  toValue: 0,
			  duration: 300,
			  useNativeDriver: true,
			}).start();
		  });
		}
	  };
	
	  const handlePanReleaseOrEnd = (evt, gestureState) => {
		// console.log('handlePanReleaseOrEnd', scrollY._value);
		syncScrollOffset();
		headerScrollY.setValue(scrollY._value);
		if (Platform.OS === "ios") {
		  if (scrollY._value < 0) {
			if (scrollY._value < -PullToRefreshDist && !refreshStatusRef.current) {
			  startRefreshAction();
			} else {
			  // should bounce back
			  listRefArr.current.forEach((listRef) => {
				listRef.value.scrollToOffset({
				  offset: 0,
				  animated: true,
				});
			  });
			}
		  } else {
			if (Math.abs(gestureState.vy) < 0.2) {
			  return;
			}
			Animated.decay(headerScrollY, {
			  velocity: -gestureState.vy,
			  useNativeDriver: true,
			}).start(() => {
			  syncScrollOffset();
			});
		  }
		} else if (Platform.OS === "android") {
		  if (
			headerMoveScrollY._value < 0 &&
			headerMoveScrollY._value / 1.5 < -PullToRefreshDist
		  ) {
			startRefreshAction();
		  } else {
			Animated.timing(headerMoveScrollY, {
			  toValue: 0,
			  duration: 300,
			  useNativeDriver: true,
			}).start();
		  }
		}
	  };
	
	  const onMomentumScrollBegin = () => {
		isListGliding.current = true;
	  };
	
	  const onMomentumScrollEnd = () => {
		isListGliding.current = false;
		syncScrollOffset();
		// console.log('onMomentumScrollEnd');
	  };
	
	  const onScrollEndDrag = (e) => {
		syncScrollOffset();
	
		const offsetY = e.nativeEvent.contentOffset.y;
		// console.log('onScrollEndDrag', offsetY);
		// iOS only
		if (Platform.OS === "ios") {
		  if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
			startRefreshAction();
		  }
		}
	
		// check pull to refresh
	  };	
	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					alignContent: "center",
					justifyContent: "center",
				}}
			>
				<ActivityIndicator animating={true} color="#209fae" size="large" />
			</View>
		);
	}

	// renderHeader
	const renderHeader =()=>{
		const y = scrollY.interpolate({
			inputRange: [0, HeaderHeight],
			outputRange: [0, -HeaderHeight + 55],
			extrapolateRight: "clamp",
			// extrapolate: 'clamp',
		  });
		  return (
			  <Animated.View
			  style={{
				transform: [{ translateY: y }],
				top: SafeStatusBar,
				height: HeaderHeight,
				width: "100%",
				alignItems: "center",
				justifyContent: "center",
				position: "absolute",
				backgroundColor: "#209fae",
			}}
			  >
		 <Sidebar
			props={props}
			show={showside}
			Data={() => {
			return (
			<View
				style={{
					padding: 10,
					width: "100%",
					justifyContent: "flex-start",
				}}
			></View>
			);
			}}
			setClose={(e) => setshowside(false)}
			/>
		<Animated.Image
            style={{
              width: "100%",
              height: "80%",
              resizeMode: "cover",
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            }}
            source={
				data && data.country_detail && data.country_detail.images.length
				? { uri: data.country_detail.images[0].image }
				: default_image
            }
            
          />
		  <Animated.View
		   style={{
			height: 55,
			width: Dimensions.get("screen").width,
			backgroundColor: "#209fae",
			paddingHorizontal: 20,
			paddingVertical: 5,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			alignContent: "center",
			opacity: imageOpacity,
		  transform: [{ translateY: imageTranslate }]
			
		  }}
		  >
		<View>
			<Text size="title" type="black" style={{ color: "white" }}>
				{data && data.country_detail ? (
				<Truncate
					text={Capital({ text: data.country_detail.name })}
					length={20}
				></Truncate>
				) : null}
			</Text>
		</View>
		</Animated.View>
		<Animated.View style={[styles.overlay]}>
              
            <Animated.View
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                zIndex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.38)",
                top: 0,
                left: 0,
                // opacity: imageOpacity,
              }}
            >
            </Animated.View>
            
          </Animated.View>
        
		</Animated.View>
		
		)
	}
	// renderScene
	const renderScene = ({ route }) => {
		const focused = route.key === routes[tabIndex].key;
		let numCols;
		let data;
		let renderItem;
		switch (route.key) {
		  case "general":
			numCols = 2;
			data = tabGeneral;
			renderItem = RenderGeneral;
			break;
		  default:
			numCols = 3;
			data = tab2Data;
			renderItem = RenderArticle;
			break;
		}
		return (
		  <Animated.FlatList
			scrollToOverflowEnabled={true}
			scrollEnabled={canScroll}
			{...listPanResponder.panHandlers}
			numColumns={numCols}
			ref={(ref) => {
			  if (ref) {
				const found = listRefArr.current.find((e) => e.key === route.key);
				if (!found) {
				  listRefArr.current.push({
					key: route.key,
					value: ref,
				  });
				}
			  }
			}}
			scrollEventThrottle={16}
			onScroll={
			  focused
				? Animated.event(
					[
					  {
						nativeEvent: { contentOffset: { y: scrollY } },
					  },
					],
					{ useNativeDriver: true }
				  )
				: null
			}
			onMomentumScrollBegin={onMomentumScrollBegin}
			onScrollEndDrag={onScrollEndDrag}
			onMomentumScrollEnd={onMomentumScrollEnd}
			ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
			ListHeaderComponent={() => <View style={{ height: 10 }} />}
			contentContainerStyle={{
			  paddingTop: HeaderHeight + TabBarHeight,
			  paddingHorizontal: 10,
			  minHeight: height - SafeStatusBar + HeaderHeight,
			}}
			showsHorizontalScrollIndicator={false}
			data={data}
			renderItem={renderItem}
			showsVerticalScrollIndicator={false}
			keyExtractor={(item, index) => index.toString()}
		  />
		);
	  };
	
	  const renderTabBar = (props) => {
		const y = scrollY.interpolate({
		  inputRange: [0, HeaderHeight],
		  outputRange: [HeaderHeight, 55],
		  extrapolateRight: "clamp",
		});
		return (
		  
		  <Animated.View
			style={{
			  top: 0,
			  zIndex: 1,
			  position: "absolute",
			  paddingHorizontal: 15,
			  transform: [{ translateY: y }],
			  width: "100%",
			}}
		  >
			
		  <ScrollView
		  horizontal={true}
		  showsHorizontalScrollIndicator={false}
		  style={{
			backgroundColor: "white",
			borderBottomColor:"#209FAE",
			borderBottomWidth:0.5,
		  }}
	
		  >
			<TabBar
			  {...props}
			  onTabPress={({ route, preventDefault }) => {
				if (isListGliding.current) {
				  preventDefault();
				}
			  }}
			  style={{
					elevation: 0,
					shadowOpacity: 0,
					backgroundColor: "white",
					height: TabBarHeight,
				}}
			  renderLabel={renderLabel}
			  indicatorStyle={styles.indicator}
		  
			/>
			</ScrollView>
		  </Animated.View>
		);
	  };

	  const renderLabel = ({ route, focused }) => {
		return (
		<View
		style={{
		  borderBottomWidth:2,
		  borderBottomColor:focused?"#209fae":"white",
		  alignContent: "center",
						alignItems: "center",
						justifyContent: "flex-end",
		}}
		>
		  <Text
			style={[
				focused ? styles.labelActive : styles.label,
				{ opacity: focused ? 1 : 0.7 ,height:36},
			]}
		>
			{route.title}
		</Text>
		  </View>    
		);
	  };
	

	const renderCustomRefresh = () => {
		// headerMoveScrollY
		return Platform.select({
		  ios: (
			<AnimatedIndicator
			  style={{
				top: -50,
				position: "absolute",
				alignSelf: "center",
				transform: [
				  {
					translateY: scrollY.interpolate({
					  inputRange: [-100, 0],
					  outputRange: [120, 0],
					  extrapolate: "clamp",
					}),
				  },
				],
			  }}
			  animating
			/>
		  ),
		  android: (
			<Animated.View
			  style={{
				transform: [
				  {
					translateY: headerMoveScrollY.interpolate({
					  inputRange: [-300, 0],
					  outputRange: [150, 0],
					  extrapolate: "clamp",
					}),
				  },
				],
				backgroundColor: "#eee",
				height: 38,
				width: 38,
				borderRadius: 19,
				borderWidth: 2,
				borderColor: "#ddd",
				justifyContent: "center",
				alignItems: "center",
				alignSelf: "center",
				top: -50,
				position: "absolute",
			  }}
			>
			  <ActivityIndicator animating />
			</Animated.View>
		  ),
		});
	  };
	
	// Render General
	const RenderGeneral = ()=>{
	let render=[];
	render = data && data.country_detail ? data.country_detail : null;

	let renderjournal = [];
	renderjournal =  data && data.country_detail.journal ? data.country_detail.journal:null;

	return (
		<View>
			{render && render.description ? (
			<View
			style={{
				paddingHorizontal: 15,
				paddingVertical: 5,
				flexDirection: "column",
			  }}
			>
			 <Text type="bold" size="label" style={{}}>
				{t("generalInformation")}
			</Text>
			{full == false && render.description.length > 120 ?(
				<Text
				size="readable"
				type="regular"
				style={{
					textAlign: "justify",
					lineHeight: 20,
				}}
				>
				<Truncate
					text={render ? render.description : null}
					length={120}
					/> 
         		</Text>
       		 ):(
				<Text
				size="readable"
				type="regular"
				style={{
					textAlign: "justify",
					lineHeight: 20,
				}}
				>
         		 {render ? render.description : null}
       		 </Text>
         )}
         {full == false && render.description.length > 120 ?(
            <TouchableOpacity
				onPress={() => {
				setFull(true);
				}}
				style={{ 
				height: 20,
				// flexDirection: "row",
				//  borderWidth:1,
				}}
			>
				<Text  
				size="readable"
				type="regular" 
				style={{ color: "#209FAE",lineHeight: 20, marginTop:5 }}
				>
					
				{t("readMore")} 
              </Text>
  
          </TouchableOpacity>
         ):full == true && render.description.length > 120 ?(
          	<TouchableOpacity
				onPress={() => {
					setFull(false);
				}}
				>
				<Text  
				size="readable"
				type="regular" 
				style={{ color: "#209FAE"}}
				>
				
				{t("readless")} 
				</Text>
            </TouchableOpacity>
        	 ):null}

			</View>
			):null}

			{/* Glance */}
			<View
			 style={{
				paddingVertical: 10,
				paddingHorizontal: 15,
				width: "100%",
			  }}
			>
			 {i18n.language==="id" ? (
            <Text size="label" type="bold" style={{}}>
               {t("atGlance")}

              <Capital text={render.name} />
            </Text>
            ):(
              <Text size="label" type="bold" style={{}}>
              <Capital text={render.name} />
           
              {t("atGlance")}
            </Text>
            )}
			<View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                width: "100%",
                shadowColor: "#d3d3d3",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 2,
                borderRadius: 5,
                padding: 20,
              }}
            >
              <Tabs
                tabBarUnderlineStyle={{ backgroundColor: "#209FAE" }}
                tabContainerStyle={{ backgroundColor: "white", elevation: 0 }}
                // locked={false}
              >
                <Tab
                  heading={t("map")}
                  tabStyle={{ backgroundColor: "white", elevation: 0 }}
                  activeTabStyle={{ backgroundColor: "white" }}
                  textStyle={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    color: "#6C6C6C",
                  }}
                  activeTextStyle={{
                    fontFamily: "Lato-Bold",
                    fontSize: 14,
                    color: "#209FAE",
                  }}
                >
                  <Image
                    source={render.map ? { uri: render.map } : default_image}
                    style={{
                      width: "100%",
                      height: width * 0.7,
                      resizeMode: "center",
                    }}
                  ></Image>
                </Tab>
                <Tab
                  heading={t("climate")}
                  tabStyle={{ backgroundColor: "white" }}
                  activeTabStyle={{ backgroundColor: "white" }}
                  textStyle={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    color: "#6C6C6C",
                  }}
                  activeTextStyle={{
                    fontFamily: "Lato-Bold",
                    fontSize: 14,
                    color: "#209FAE",
                  }}
                >
                  <Image
                    source={default_image}
                    style={{
                      width: "100%",
                      height: width * 0.7,
                      resizeMode: "center",
                    }}
                  ></Image>
                </Tab>
                <Tab
                  heading={t("religion")}
                  tabStyle={{ backgroundColor: "white" }}
                  activeTabStyle={{ backgroundColor: "white" }}
                  textStyle={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    color: "#6C6C6C",
                  }}
                  activeTextStyle={{
                    fontFamily: "Lato-Bold",
                    fontSize: 14,
                    color: "#209FAE",
                  }}
                >
                  <Image
                    source={default_image}
                    style={{
                      width: "100%",
                      height: width * 0.7,
                      resizeMode: "center",
                    }}
                  ></Image>
                </Tab>
              </Tabs>
            </View>
			</View>

		   {/* Travel Jurnal */}
		   {renderjournal && renderjournal.length > 0 ? (
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                width: "100%",
              }}
            >
              <Text size="label" type="bold" style={{}}>
                {t("traveljournal")}
              </Text>
              <Text size="description">
                {t("traveldiscovery")}
              </Text>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "white",
                  height: width * 0.45,
                  width: "100%",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.29,
                  shadowRadius: 4.65,

                  elevation: 3,
                  borderRadius: 5,
                  padding: 10,
                }}
              >
                {renderjournal ? (
                  <ImageSlider
                    images={renderjournal ? spreadData(renderjournal) : []}
                    style={{
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      backgroundColor: "#white",
                    }}
                    customSlide={({ index, item, style, width }) => (
                      <View key={"ky" + index}>
                        {item.map((dataX, index) => {
                          return (
                            <Pressable
                              onPress={() =>
                                props.navigation.push(
                                  "JournalStackNavigation",
                                  {
                                    screen: "DetailJournal",
                                    params: {
                                      dataPopuler: dataX,
                                    },
                                  }
                                )
                              }
                              style={{
                                flexDirection: "row",
                                width: width - 70,
								
                                height: width * 0.2,
                              }}
                            >
                              <Image
                                source={
                                  item.picture
                                    ? { uri: dataX.picture }
                                    : logo_funtravia
                                }
                                style={{
                                  height: width * 0.15,
                                  width: width * 0.15,
                                  borderRadius: 5,
                                }}
                              ></Image>
                              <View
                                style={{
                                  paddingHorizontal: 10,
                                  width: width - (100 + width * 0.15),
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View style={{ width: "100%" }}>
                                  <Text style={{ width: "80%" }} type="bold">
                                    <Truncate text={dataX.title} length={60} />
                                  </Text>
                                  <Text>
                                    <Truncate text={dataX.text} length={60} />
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    zIndex: 900,
                                    marginTop:30,
                                  }}
                                >
                                  {dataX.liked === false ? (
                                    <Ripple
                                      onPress={() =>
                                        _likedjournal(dataX.id, index)
                                      }
                                    >
                                      <LikeEmpty height={15} width={15} />
                                    </Ripple>
                                  ) : (
                                    <Ripple
                                      onPress={() =>
                                        _unlikedjournal(dataX.id, index)
                                      }
                                    >
                                      <LikeRed height={15} width={15} />
                                    </Ripple>
                                  )}
                                </View>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                    customButtons={(position, move) => (
                      <View
                        style={{
                          paddingTop: 10,
                          alignContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        {(renderjournal ? spreadData(renderjournal) : []).map(
                          (image, index) => {
                            // console.log("IndexJurnal", index);
                            return (
                              <TouchableHighlight
                                key={"keys" + index}
                                underlayColor="#f7f7f700"
                                // onPress={() => move(index)}
                              >
                                <View
                                  style={{
                                    height: position === index ? 5 : 5,
                                    width: position === index ? 15 : 5,
                                    borderRadius: position === index ? 7 : 3,
                                    backgroundColor:
                                      position === index
                                        ? "#209fae"
                                        : "#d3d3d3",
                                    marginHorizontal: 3,
                                  }}
                                ></View>
                              </TouchableHighlight>
                            );
                          }
                        )}
                      </View>
                    )}
                  />
                ) : (
                  <View
                    style={{
                      height: "100%",
                      width: "100%",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Travel Journal Empty</Text>
                  </View>
                )}
              </View>
            </View>
          ) : null}
		  {render.city ?(
		  <View
		  style={{
			paddingHorizontal: 15,
			paddingVertical: 10,
			flexDirection: "column",
		  }}
		  >
			 <Text type="bold" size="label" style={{}}>
				{t("popularDestination")}
			</Text>
			<Text
				size="description"
				style={{
					textAlign: "justify",
				}}
			>
				{t("Goodplacegoodtrip")}
			</Text>
			<View
			style={{
				marginTop: 10,
				backgroundColor: "white",
				width: "100%",
				shadowColor: "#d3d3d3",
				shadowOffset: { width: 2, height: 2 },
				shadowOpacity: 1,
				shadowRadius: 2,
				elevation: 2,
				borderRadius: 5,
				padding: 10,
			}}
			>
				<ImageSlider
						images={render.city ? render.city : []}
						style={{
							borderTopLeftRadius: 5,
							borderTopRightRadius: 5,
							backgroundColor: "#white",
							width: Dimensions.get("screen").width - 69,
						}}
						customSlide={({ index, item, style, width }) => (
							<View
								key={"kota=" + item.id}
								style={{
									width: Dimensions.get("screen").width - 69,
									alignItems: "center",
									alignContent: "center",
								}}
							>
								<Text
									size="label"
									type="bold"
									style={{ textAlign: "center", marginTop: 3 }}
								>
									<Capital text={item.name} />
								</Text>
								<Ripple
									onPress={() => {
										props.navigation.navigate("CountryStack", {
											screen: "CityDetail",
											params: {
												data: {
													city_id: item.id,
													city_name: item.name,
												},
												exParam: true,
											},
										});
									}}
									style={{
										height: width * 0.4,
										width: "99%",
										borderRadius: 10,
										marginVertical: 2,
									}}
								>
									<Image
										style={{
											height: "100%",
											width: "100%",
											borderRadius: 10,
										}}
										source={
											item.image ? { uri: item.image } : default_image
										}
									></Image>
								</Ripple>
								<View
									style={{
										width: "100%",
										flexWrap: "wrap",
										flexDirection: "row",
										justifyContent: "flex-start",
									}}
								>
									{item.destination && item.destination.length > 0 ? (
										<FlatList
											data={item.destination}
											numColumns={4}
											renderItem={({ item, index }) => (
												<Ripple
													onPress={() => {
														props.navigation.navigate("detailStack", {
															id: item.id,
															name: item.name,
														});
													}}
													style={{
														// width: (width - 60) / 4,
														alignContent: "center",
														alignItems: "center",
														borderColor: "#209fae",
														padding: 2,
													}}
												>
													<Image
														style={{
															borderRadius: 10,
															height: (width - 80) / 4,
															width: (width - 80) / 4,
														}}
														source={
															item.images
																? { uri: item.images[0].image }
																: default_image
														}
													></Image>
													<Text
														size="small"
														type="bold"
														style={{
															textAlign: "center",
															marginTop: 3,
														}}
													>
														<Truncate
															text={Capital({ text: item.name })}
															length={13}
														/>
													</Text>
												</Ripple>
											)}
										/>
									) : (
										<View
											style={{
												flex: 1,
												paddingTop: 100,
												alignContent: "center",
												alignItems: "center",
											}}
										>
											<Text>No Popular Destintation</Text>
										</View>
									)}
								</View>
							</View>
						)}
						customButtons={(position, move) => (
							<View
								style={{
									// width: width - 40,
									// position: "absolute",
									// bottom: 10,
									// left: 0,
									paddingVertical: 10,
									alignContent: "center",
									alignItems: "center",
									flexDirection: "row",
									justifyContent: "center",
								}}
							>
								{(render.city.length ? render.city : []).map(
									(image, index) => {
										return (
											<TouchableHighlight
												key={"lol" + index}
												underlayColor="#f7f7f700"
												// onPress={() => move(index)}
											>
												<View
													style={{
														height: position === index ? 5 : 5,
														width: position === index ? 15 : 5,
														borderRadius: position === index ? 7 : 3,
														backgroundColor:
															position === index
																? "#209fae"
																: "#d3d3d3",
														marginHorizontal: 3,
													}}
												></View>
											</TouchableHighlight>
										);
									}
								)}
							</View>
						)}
					/>
			</View>

		  </View>
		):null}
		</View>
	)



	}
	const RenderArticle = ()=>{

	}
	// renderTabView
	const renderTabView = () => {
		return (
		  
		  <TabView
			onSwipeStart={() => setCanScroll(false)}
			onSwipeEnd={() => setCanScroll(true)}
			onIndexChange={(id) => {
			  _tabIndex.current = id;
			  setIndex(id);
			}}
			navigationState={{ index: tabIndex, routes }}
			renderScene={renderScene}
			renderTabBar={renderTabBar}
			initialLayout={{
			  height: 0,
			  width: width,
			}}
			
		  />
		);
	  };
	return (
		<View style={styles.container}>
			<StaBar backgroundColor="#14646e" barStyle="light-content" />
			<Animated.View
			 style={{
				position: "absolute",
				top: SafeStatusBar,
				zIndex: 9999,
				flexDirection: "row",
				justifyContent: "space-between",
				alignContent: "center",
				alignItems: "center",
				height: 55,
				width: Dimensions.get("screen").width,
			 }}
			>
			<Button
			 text={""}
			 size="medium"
			 type="circle"
			 variant="transparent"
			 onPress={() => props.navigation.goBack()}
			 style={{
			   height: 50,
			   marginLeft: 8,
			 }}
		   >
			  <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
			</Button>
			<View
			style={{
				width: Dimensions.get("screen").width - 90,
				backgroundColor: "rgba(0,0,0,0.2)",
				flexDirection: "row",
				alignContent: "center",
				alignItems: "center",
				padding: 10,
			  }}
			>
				<Image
				source={search_button}
				style={{
					height: 20,
					width: 20,
					resizeMode: "contain",
					marginHorizontal: 10,
				}}
			></Image>
			  <Input
                value={search}
                style={{
                  height: 20,
                  padding: 0,
                  textAlign: "left",
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "white",
                }}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(x) => setTextc(x)}
                placeholder="Search"
                returnKeyType="search"
                onSubmitEditing={(x) =>
                  props.navigation.navigate("SearchTab", {
                    searchInput: search,
                  })
                }
              />
			</View>
			<Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              onPress={() => setshowside(true)}
              style={{
                height: 50,
              }}
            >
              <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
            </Button>

			</Animated.View>
			{renderTabView()}
			{renderHeader()}
			{renderCustomRefresh()} 
		
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		height: Dimensions.get("screen").height,
		width: Dimensions.get("screen").width,
		flex: 1,
	},
	activeTextStyle: {
		fontFamily: "Lato-Bold",
		color: "#209FAE",
	},
	container: {
		flex: 1,
		height: screenHeight / 2,
	},
	// overlay: {
	// 	height: screenHeight / 2,
	// },
	textStyle: {
		marginLeft: 10,
		padding: 10,
		color: "#FFFFFF",
		fontWeight: "bold",
		alignSelf: "flex-start",
		position: "absolute",
		fontFamily: "Lato-Regular",
	},
	balanceContainer: {
		padding: 10,
	},
	ImageView: {
		height: Dimensions.get("window").width * 0.47 - 16,

		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
		overflow: "hidden",

		backgroundColor: "rgba(20,20,20,0.4)",
	},
	Image: {
		resizeMode: "cover",
		height: Dimensions.get("window").width * 0.47 - 16,

		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
		overflow: "hidden",
	},
	destinationMainImageContainer: {
		width: "100%",
		height: 150,
		borderRadius: 10,
	},
	destinationMainImage: {
		resizeMode: "cover",
		borderRadius: 10,
		backgroundColor: "black",
	},
	destinationImageView: {
		width: (Dimensions.get("window").width - 37) / 3,
		height: (Dimensions.get("window").width - 37) / 3,
		marginRight: 5,
		borderRadius: 10,
	},
	destinationImage: {
		resizeMode: "cover",
		borderRadius: 10,
	},

	fill: {
		flex: 1,
	},
	row: {
		height: 40,
		margin: 16,
		backgroundColor: "#D3D3D3",
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		position: "absolute",
		top: SafeStatusBar,
		left: 0,
		right: 0,
		backgroundColor: "#209fae",
		overflow: "hidden",
	},
	bar: {
		marginTop: 28,
		height: 32,
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		backgroundColor: "transparent",
		color: "white",
	},
	scrollViewContent: {
		marginTop: HEADER_MAX_HEIGHT,
	},
	backgroundImage: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		width: null,
		height: HEADER_MAX_HEIGHT + 55,
		resizeMode: "cover",
	},

	// Style terbaru
	container: {
		flex: 1,
		backgroundColor:"white"
	  },
});
