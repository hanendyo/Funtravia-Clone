import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	RefreshControl,
	ImageBackground,
	Platform,
	Animated,
	SafeAreaView,
	StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, CustomImage } from "../../component";
import { Akunsaya, search_black } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import PopularDestination from "./PopularDestination";
import RenderAccount from "./RenderAccount";

import Account from "../../graphQL/Query/Home/Account";
import CountNotif from "../../graphQL/Query/Notification/CountNotif";

import { useTranslation } from "react-i18next";
import MenuNew from "./MenuNew";
import DiscoverCard from "./DiscoverCard";
import FunFeed from "./FunFeed";

export default function Home(props) {
	const { t, i18n } = useTranslation();
	let [token, setToken] = useState("");
	let [loadingall, setLoading] = useState(true);
	let [searchBg, setSearchBg] = useState("transparent");
	let [searchElevation, setSearchElevation] = useState(0);
	let [count, setCount] = useState(1);
	const [LoadUserProfile, { data, loading, error }] = useLazyQuery(Account, {
		fetchPolicy: "network-only",
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});
	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		setToken(tkn);
		if (tkn) {
			LoadUserProfile();
		}
		setLoading(loading);
	};
	const onScrollSearch = (e) => {
		if (e.nativeEvent.contentOffset.y <= 230) {
			setSearchBg("transparent");
			setSearchElevation(0);
		} else {
			setSearchBg("white");
			setSearchElevation(10);
		}
	};

	const getcount = (e) => {
		if (count === 1) {
			props.navigation.setParams({ count_notif: e });
			setCount(count + 1);
		}
	};

	const [refreshing, setRefreshing] = React.useState(false);

	const searchpage = () => {
		props.navigation.navigate("SearchPage");
	};
	const [
		NotifCount,
		{
			data: datanotif,
			loading: loadingnotif,
			error: errornotif,
			called: callednotif,
		},
	] = useLazyQuery(CountNotif, {
		fetchPolicy: "network-only",
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});
	useEffect(() => {
		loadAsync();
	}, []);

	if (
		callednotif &&
		!loadingnotif &&
		token &&
		datanotif &&
		datanotif.count_notif
	) {
		getcount(datanotif.count_notif.count);
	}

	const _Refresh = React.useCallback(() => {
		setCount(1);
		NotifCount();
		setLoading(true);
		loadAsync();
		setRefreshing(loading);
	}, []);

	function HomeTitle({ title, label, seeAll }) {
		return (
			<SafeAreaView>
				{seeAll ? (
					<View
						style={{
							alignItems: "stretch",
							alignSelf: "center",
							width: "95%",
							marginTop: 30,
						}}
					>
						<View
							style={{
								paddingHorizontal: 10,
								flexDirection: "row",
								alignItems: "stretch",
							}}
						>
							<View
								style={{
									width: 5,
									height: 40,
									backgroundColor: "#209FAE",
									borderRadius: 20,
								}}
							></View>

							<View
								style={{
									flexDirection: "row",
									// backgroundColor: 'red',
									width: "100%",
									justifyContent: "space-between",
									alignContent: "center",
									// borderBottomWidth: 1,
									// alignSelf: 'center',
								}}
							>
								<View style={{ marginLeft: 5 }}>
									<Text
										type="bold"
										size="label"
										style={{
											alignSelf: "flex-start",
										}}
									>
										{title}
									</Text>
									<Text type="regular" size="small">
										{label}
									</Text>
								</View>
								<Text
									onPress={() => props.navigation.navigate("AllDestination")}
									type="bold"
									size="small"
									style={{ color: "#209FAE", alignSelf: "baseline" }}
								>
									{t("viewAll")}
								</Text>
							</View>
						</View>
					</View>
				) : (
					<View
						style={{
							// flexDirection: 'row',
							// flex: 1,
							alignItems: "stretch",
							alignSelf: "center",
							width: "95%",

							marginTop: 30,
							// backgroundColor: 'blue',
						}}
					>
						<View
							style={{
								paddingHorizontal: 10,
								flexDirection: "row",
								alignItems: "stretch",
							}}
						>
							<View
								style={{
									width: 5,
									height: 40,
									backgroundColor: "#209FAE",
									borderRadius: 20,
								}}
							></View>

							<View
								style={{
									flexDirection: "row",
									// backgroundColor: 'red',
									width: "100%",
									justifyContent: "space-between",
									alignContent: "center",
									// borderBottomWidth: 1,
									// alignSelf: 'center',
								}}
							>
								<View style={{ marginLeft: 5 }}>
									<Text
										type="bold"
										size="label"
										style={{
											alignSelf: "flex-start",
										}}
									>
										{title}
									</Text>
									<Text type="regular" size="small">
										{label}
									</Text>
								</View>
							</View>
						</View>
					</View>
				)}
			</SafeAreaView>
		);
	}
	if (!loading) {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar color={"#14646E"} />
				<Animated.ScrollView
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={_Refresh} />
					}
					contentContainerStyle={styles.main}
					showsVerticalScrollIndicator={false}
					stickyHeaderIndices={[1]}
					onScroll={onScrollSearch}
				>
					<ImageBackground
						source={Akunsaya}
						style={{
							width: "100%",
							height: 180,
							// position: 'absolute',
							// top: 0,
							alignSelf: "flex-start",
							justifyContent: "flex-start",
							alignContent: "center",
							alignItems: "center",
						}}
					>
						{Platform.OS == "ios" ? (
							<View
								style={{
									position: "absolute",
									bottom: -Dimensions.get("window").height * 0.07,
									marginBottom: 10,
								}}
							>
								<RenderAccount
									props={props}
									navigation={props.navigation}
									data={data ? data : null}
									token={token}
								/>
							</View>
						) : (
							<View
								style={{
									position: "absolute",
									bottom: -Dimensions.get("window").height * 0.07,
								}}
							>
								<RenderAccount
									props={props}
									navigation={props.navigation}
									data={data ? data : null}
									token={token}
								/>
							</View>
						)}
					</ImageBackground>
					<View
						style={{
							// position: 'absolute',
							// left: 0,
							// top: Dimensions.get('window').width * 0.32,
							marginTop: 50,
							marginBottom: -20,
							width: Dimensions.get("window").width,
							justifyContent: "center",
							alignItems: "center",
							alignContent: "center",
							alignSelf: "center",
							backgroundColor: `${searchBg}`,
							height: 75,
							borderColor: "white",
							// borderWidth: 1,
							// overflow: 'hidden',
							// paddingBottom: 5,
							shadowColor: "#00000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 5,
							shadowRadius: 3,
							elevation: searchElevation,
						}}
					>
						<TouchableOpacity
							onPress={searchpage}
							style={{
								height: 45,
								width: Dimensions.get("window").width,
								alignSelf: "center",

								// marginVertical: 15,
								flex: 1,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								// marginVertical: 1,
								// marginLeft: 50,
								// elevation: 10,
							}}
						>
							<View
								style={{
									alignItems: "center",
									justifyContent: "center",
									height: 45,
									flexDirection: "row",
									backgroundColor: "white",
									borderRadius: 5,
									borderWidth: 1,
									borderColor: "#6F7273",
									alignSelf: "center",
									// shadowColor: '#6F7273',
									// shadowOffset: { width: 2, height: 2 },
									// shadowOpacity: 1,
									// shadowRadius: 2,
									// elevation: 3,
									width: Dimensions.get("screen").width * 0.9,
								}}
							>
								<View
									style={{
										marginRight: 8,
									}}
								>
									<CustomImage
										source={search_black}
										customImageStyle={{ resizeMode: "cover" }}
										customStyle={{
											height: 15,
											width: 15,
											alignSelf: "center",
											zIndex: 100,
											// marginLeft: 20,
										}}
									/>
								</View>
								<View>
									<Text
										size="small"
										type="bold"
										style={{
											color: "#464646",
										}}
									>
										{t("searchHome")}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>

					<MenuNew props={props} />

					<HomeTitle
						title={t("popularCityDestination")}
						label={"Good Place Good Trip"}
						seeAll={true}
					/>
					<PopularDestination props={props} />
					<HomeTitle
						title={"Discover"}
						label={"Start Your Journey Here"}
						seeAll={false}
					/>
					<DiscoverCard props={props} />
					<HomeTitle
						title={"Fun Feed"}
						label={"Collect Moments from Your Trip"}
						seeAll={false}
					/>
					<FunFeed navigation={props.navigation} props={props} />
				</Animated.ScrollView>
			</SafeAreaView>
		);
	} else {
		return <SafeAreaView></SafeAreaView>;
	}
}

Home.navigationOptions = (props) => ({
	headerShown: false,
	// headerTitle: 'Travel Never Been This Easy',
	// // headerMode: 'screen',
	// headerMode: 'none',
	// headerStyle: {
	// 	backgroundColor: '#209FAE',
	// 	elevation: 0,
	// 	borderBottomWidth: 0,
	// },
	// headerTitleStyle: {
	// 	fontFamily: 'lato-reg',
	// 	fontSize: 14,
	// 	color: 'white',
	// 	alignSelf: 'center',
	// },
	// headerLeft: '',
	// headerLeftContainerStyle: {
	// 	paddingLeft: 20,
	// },
	// headerRight: (
	// 	<Pressable
	// 		onPress={() => props.navigation.navigate('Inbox')}
	// 		style={{
	// 			flex: 1,
	// 			flexDirection: 'row',
	// 		}}>
	// 		<View
	// 			style={{
	// 				marginHorizontal: 10,
	// 			}}>
	// 			<CustomImage
	// 				customStyle={{
	// 					width: 25,
	// 					height: 25,
	// 				}}
	// 				customImageStyle={{
	// 					width: 25,
	// 					height: 25,
	// 					resizeMode: 'contain',
	// 				}}
	// 				source={BelPutih}
	// 			/>
	// 			{props.navigation.getParam('count_notif') > 0 ? (
	// 				<View
	// 					style={{
	// 						position: 'absolute',
	// 						top: 1,
	// 						right: 0,
	// 						backgroundColor: '#D75995',
	// 						borderColor: '#209FAE',
	// 						borderWidth: 1,
	// 						paddingHorizontal: 1,
	// 						minWidth: 15,
	// 						height: 15,
	// 						borderRadius: 8,
	// 					}}>
	// 					<Text
	// 						style={{
	// 							fontFamily: 'lato-bold',
	// 							fontSize: 9,
	// 							color: 'white',
	// 							alignSelf: 'center',
	// 						}}>
	// 						{props.navigation.getParam('count_notif')}
	// 					</Text>
	// 				</View>
	// 			) : null}
	// 		</View>
	// 	</Pressable>
	// ),
	// headerRightStyle: {
	// 	paddingRight: 20,
	// },
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#E5E5E5',
	},
	main: {
		// margin: 0,
	},
});
