import { useLazyQuery, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	View,
	Dimensions,
	Animated,
	PanResponder,
	Platform,
	TouchableOpacity,
	Alert,
	StatusBar,
	ActivityIndicator,
	SafeAreaView,
	Image,
	Pressable,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { Button, Sidebar, StatusBar as StaBar, Text } from "../../../component";
import {
	Akunsaya,
	default_image,
	DefaultProfileSquare,
} from "../../../assets/png";
import Account from "../../../graphQL/Query/Profile/Other";
import User_Post from "../../../graphQL/Query/Profile/otherpost";

import { useTranslation } from "react-i18next";
import { Google, OptionsVertWhite, Sharegreen } from "../../../assets/svg";
import Post from "./Post";
import Review from "./Review";
import Trip from "./Trip";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const SafeStatusBar = Platform.select({
	ios: 44,
	android: StatusBar.currentHeight,
});
const HeaderHeight = 320 - SafeStatusBar;
const PullToRefreshDist = 150;

export default function OtherProfile(props) {
	const { t } = useTranslation();
	let [showside, setshowside] = useState(false);
	let [token, setToken] = useState(null);
	const [dataPost, setdataPost] = useState([]);
	const [dataReview, setdataReview] = useState([]);
	const [dataTrip, setdataTrip] = useState([]);
	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		await setToken(tkn);
		await LoadUserProfile();
		await Getdatapost();
	};

	const [
		Getdatapost,
		{
			data: dataposting,
			loading: loadingpost,
			error: errorpost,
			refetch: refetchpost,
		},
	] = useLazyQuery(User_Post, {
		fetchPolicy: "network-only",
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
		variables: {
			id: props.route.params.idUser,
		},
		onCompleted: (data) => {
			setdataPost(spreadData(data.user_postbyid));
		},
	});

	const spreadData = (data) => {
		let tmpData = [];
		let count = 1;
		let tmpArray = [];
		for (let val of data) {
			if (count < 3) {
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

	const [tabIndex, setIndex] = useState(0);
	const [routes] = useState([
		{ key: "tab1", title: "Post" },
		{ key: "tab2", title: "Review" },
		{ key: "tab3", title: "Trip" },
	]);
	const [canScroll, setCanScroll] = useState(true);
	const scrollY = useRef(new Animated.Value(0)).current;
	const headerScrollY = useRef(new Animated.Value(0)).current;
	const headerMoveScrollY = useRef(new Animated.Value(0)).current;
	const listRefArr = useRef([]);
	const listOffset = useRef({});
	const isListGliding = useRef(false);
	const headerScrollStart = useRef(0);
	const _tabIndex = useRef(0);
	const refreshStatusRef = useRef(false);
	let HEADER_MAX_HEIGHT = HeaderHeight;
	let HEADER_MIN_HEIGHT = 55;
	let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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
	const opacityto1 = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	const opacityfrom1 = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	const headerPanResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
			onStartShouldSetPanResponder: (evt, gestureState) => {
				headerScrollY.stopAnimation();
				syncScrollOffset();
				return false;
			},

			onMoveShouldSetPanResponder: (evt, gestureState) => {
				headerScrollY.stopAnimation();
				return Math.abs(gestureState.dy) > 5;
			},
			onPanResponderEnd: (evt, gestureState) => {
				handlePanReleaseOrEnd(evt, gestureState);
			},
			onPanResponderMove: (evt, gestureState) => {
				const curListRef = listRefArr.current.find(
					(ref) => ref.key === routes[_tabIndex.current].key
				);
				const headerScrollOffset = -gestureState.dy + headerScrollStart.current;
				if (curListRef.value) {
					// scroll up
					if (headerScrollOffset > 0) {
						curListRef.value.scrollToOffset({
							offset: headerScrollOffset,
							animated: false,
						});
						// start pull down
					} else {
						if (Platform.OS === "ios") {
							curListRef.value.scrollToOffset({
								offset: headerScrollOffset / 3,
								animated: false,
							});
						} else if (Platform.OS === "android") {
							if (!refreshStatusRef.current) {
								headerMoveScrollY.setValue(headerScrollOffset / 1.5);
							}
						}
					}
				}
			},
			onShouldBlockNativeResponder: () => true,
			onPanResponderGrant: (evt, gestureState) => {
				headerScrollStart.current = scrollY._value;
			},
		})
	).current;

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

	const HeaderComponent = {
		headerShown: true,
		title: "",
		headerTransparent: true,
		headerTintColor: "white",
		headerTitle: "",
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
		headerLeftContainerStyle: {
			background: "#FFF",

			marginLeft: 10,
		},

		headerRight: () => (
			<Button
				text={""}
				size="medium"
				type="circle"
				variant="transparent"
				onPress={() => setshowside(true)}
				style={{
					// backgroundColor: "rgba(0,0,0,0.3)",
					marginRight: 10,
				}}
			>
				<OptionsVertWhite height={15} width={15}></OptionsVertWhite>
			</Button>
		),
	};

	useEffect(() => {
		props.navigation.setOptions(HeaderComponent);
		loadAsync();

		scrollY.addListener(({ value }) => {
			const curRoute = routes[tabIndex].key;
			listOffset.current[curRoute] = value;
		});

		headerScrollY.addListener(({ value }) => {
			listRefArr.current.forEach((item) => {
				if (item.key !== routes[tabIndex].key) {
					return;
				}
				if (value > HeaderHeight || value < 0) {
					headerScrollY.stopAnimation();
					syncScrollOffset();
				}
				if (item.value && value <= HeaderHeight) {
					item.value.scrollToOffset({
						offset: value,
						animated: false,
					});
				}
			});
		});
		return () => {
			scrollY.removeAllListeners();
			headerScrollY.removeAllListeners();
		};
	}, [routes, tabIndex]);

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

	const refresh = async () => {
		// console.log("-- start refresh");
		loadAsync();
		refreshStatusRef.current = true;
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("done");
			}, 2000);
		}).then((value) => {
			// console.log("-- refresh done!");
			refreshStatusRef.current = false;
		});
	};

	const renderHeader = (data) => {
		const y = scrollY.interpolate({
			inputRange: [0, HeaderHeight],
			outputRange: [0, -HeaderHeight + 55],
			extrapolateRight: "clamp",
			// extrapolate: 'clamp',
		});
		return (
			<Animated.View
				{...headerPanResponder.panHandlers}
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
				<Animated.Image
					style={{
						// position: "absolute",
						// top: 0,
						// left: 0,
						// right: 0,
						width: "100%",
						height: "50%",
						resizeMode: "cover",
						opacity: imageOpacity,
						transform: [{ translateY: imageTranslate }],
					}}
					source={Akunsaya}
				/>

				<View
					style={{
						flexDirection: "row",
						width: "100%",
						justifyContent: "space-between",
						position: "absolute",
						top: "32%",
						zIndex: 1,
						paddingHorizontal: 20,
					}}
				>
					<Image
						source={data.picture ? { uri: data.picture } : DefaultProfileSquare}
						style={{
							width: width / 4,
							height: width / 4,
							borderRadius: width / 8,
							borderWidth: 2,
							borderColor: "#FFF",
						}}
					/>
					<View
						style={{
							width: width / 2,
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						{data.status_following === true ? (
							<Button
								text={t("unfollow")}
								variant="bordered"
								size="small"
								color="black"
								style={{
									width: "48%",
									borderColor: "#464646",
									alignSelf: "flex-end",
									// margin: 15,
								}}
							/>
						) : (
							<Button
								text={t("follow")}
								size="small"
								color={"secondary"}
								variant={"normal"}
								text={t("follow")}
								style={{
									width: "48%",
									alignSelf: "flex-end",
									// margin: 15,
								}}
							/>
						)}

						<Button
							text={t("Message")}
							variant="bordered"
							size="small"
							color="black"
							style={{
								width: "48%",
								// width: width / 2,
								borderColor: "#464646",
								alignSelf: "flex-end",
								// margin: 15,
							}}
						/>
					</View>
				</View>

				<Animated.View
					style={{
						width: "100%",
						height: "50%",
						backgroundColor: "#fff",
						opacity: imageOpacity,
						// transform: [{ translateY: imageTranslate }],
						paddingTop: 45,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							width: Dimensions.get("screen").width,
							justifyContent: "space-between",
							paddingHorizontal: 20,
							alignItems: "center",
							alignContent: "center",
							marginTop: 5,
							// borderWidth: 1,
						}}
					>
						<Animated.View style={{ width: "50%", opacity: opacityfrom1 }}>
							<Text type="bold" size="label" style={{ marginRight: 10 }}>
								{`${data.first_name ? data.first_name : ""} ` +
									`${data.last_name ? data.last_name : ""}`}
							</Text>
							<Text type="regular" size="description">{`@${
								data.username ? data.username : ""
							} `}</Text>
						</Animated.View>

						<View
							style={{
								width: "50%",
								// marginTop: 10,
								flexDirection: "row",
								justifyContent: "space-evenly",
								alignItems: "baseline",
								// width: Dimensions.get('window').width,
							}}
						>
							<TouchableOpacity
								style={{
									alignItems: "center",
									alignContent: "center",
								}}
								onPress={() =>
									props.navigation.push("otherFollower", {
										idUser: idUser,
									})
								}
							>
								<Text type="black" size="label">
									{`${data.count_follower ? data.count_follower : ""} `}
								</Text>
								<Text
									type="regular"
									size="description"
									// style={{ color: '#B0B0B0' }}
								>
									{t("followers")}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									alignItems: "center",
									alignContent: "center",
								}}
								onPress={() =>
									props.navigation.push("otherFollowing", {
										idUser: idUser,
									})
								}
							>
								<Text type="black" size="label">
									{`${data.count_following ? data.count_following : ""} `}
								</Text>
								<Text
									type="regular"
									size="description"
									// style={{ color: '#B0B0B0' }}
								>
									{t("following")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View
						style={{
							marginTop: 10,
							width: Dimensions.get("screen").width,
							paddingHorizontal: 20,
						}}
					>
						<Text
							type="regular"
							size="description"
							style={{ textAlign: "justify" }}
						>
							{data.bio ? data.bio : "-"}
						</Text>
					</View>
				</Animated.View>
			</Animated.View>
		);
	};

	const renderLabel = ({ route, focused }) => {
		return (
			<View
				style={{
					alignContent: "center",
					alignItems: "center",
					justifyContent: "flex-end",
					width: Dimensions.get("screen").width / 3,
				}}
			>
				<Text
					type={focused ? "bold" : "regular"}
					size="label"
					style={{
						color: focused ? "#209FAE" : "#464646",
					}}
				>
					{route.title}
				</Text>
			</View>
		);
	};

	const renderScene = ({ route }) => {
		const focused = route.key === routes[tabIndex].key;
		let numCols;
		let data;
		let renderItem;
		switch (route.key) {
			case "tab1":
				numCols = tabPost === 2 ? 3 : 1;
				data = dataPost;
				renderItem = Post;
				break;
			case "tab2":
				numCols = 3;
				data = dataReview;
				renderItem = Review;
				break;
			case "tab3":
				numCols = 3;
				data = dataTrip;
				renderItem = Trip;
				break;
			default:
				return null;
		}
		return (
			<Animated.FlatList
				scrollToOverflowEnabled={true}
				// scrollEnabled={canScroll}
				{...listPanResponder.panHandlers}
				key={"#" + numCols}
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
				ListHeaderComponent={() => <View style={{ height: 10 }}></View>}
				contentContainerStyle={{
					paddingTop:
						tabIndex === 0
							? HeaderHeight + TabBarHeight + 55
							: HeaderHeight + TabBarHeight,
					paddingHorizontal: 10,
					minHeight: height - SafeStatusBar + HeaderHeight,
				}}
				showsHorizontalScrollIndicator={false}
				data={data}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item, index) => index.toString()}
				style={{}}
			/>
		);
	};

	let [tabPost, settabPost] = useState(0);

	const renderTabBar = (props) => {
		const y = scrollY.interpolate({
			inputRange: [0, HeaderHeight],
			outputRange: [HeaderHeight, 55],
			// extrapolate: 'clamp',
			extrapolateRight: "clamp",
		});
		return (
			<Animated.View
				style={{
					top: 0,
					zIndex: 1,
					position: "absolute",
					transform: [{ translateY: y }],
					width: "100%",
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
						borderBottomWidth: 2,
						borderBottomColor: "#daf0f2",
					}}
					renderLabel={renderLabel}
					indicatorStyle={{
						backgroundColor: "#209fae",
					}}
				/>
				{tabIndex === 0 ? (
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-around",
							backgroundColor: "#fff",
							borderBottomColor: "#d3d3d3",
							borderBottomWidth: 0.5,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								settabPost(0);
							}}
							style={{
								padding: 10,
								width: "33.3%",
								alignItems: "center",
							}}
						>
							<Google height={15} width={15} />
							<Text
								style={{
									marginTop: 3,
									color: tabPost === 0 ? "#209fae" : "#464646",
								}}
							>
								All Post
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								settabPost(1);
							}}
							style={{
								padding: 10,
								width: "33.3%",
								alignItems: "center",
							}}
						>
							<Google height={15} width={15} />
							<Text
								style={{
									marginTop: 3,
									color: tabPost === 1 ? "#209fae" : "#464646",
								}}
							>
								Album
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								settabPost(2);
							}}
							style={{
								padding: 10,
								width: "33.3%",
								alignItems: "center",
							}}
						>
							<Google height={15} width={15} />
							<Text
								style={{
									marginTop: 3,
									color: tabPost === 2 ? "#209fae" : "#464646",
								}}
							>
								Trip
							</Text>
						</TouchableOpacity>
					</View>
				) : null}
			</Animated.View>
		);
	};

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

	const renderCustomRefresh = () => {
		// headerMoveScrollY
		return (
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
				<ActivityIndicator animating={true} color="#209fae" size="large" />
			</Animated.View>
		);
	};

	let [dataUser, setDataUser] = useState({});

	const [LoadUserProfile, { data, loading, error, refetch }] = useLazyQuery(
		Account,
		{
			fetchPolicy: "network-only",
			context: {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
			variables: {
				id: props.route.params.idUser,
			},
			onCompleted: (data) => {
				setDataUser(data.user_profilebyid);
			},
		}
	);

	return (
		<SafeAreaView style={styles.container}>
			<StaBar backgroundColor="#14646e" barStyle="light-content" />
			{renderTabView()}
			{renderHeader(dataUser)}
			{renderCustomRefresh()}

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
						>
							<TouchableOpacity
								onPress={() => Alert.alert("coming soon")}
								style={{
									marginVertical: 5,
									flexDirection: "row",
									width: "100%",
									paddingVertical: 2,
									alignItems: "center",
								}}
							>
								<Sharegreen height={15} width={15} />

								<Text
									size="label"
									type="regular"
									style={{
										marginLeft: 10,
									}}
								>
									{t("share")}
								</Text>
							</TouchableOpacity>
						</View>
					);
				}}
				setClose={(e) => setshowside(false)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		height: HeaderHeight,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		backgroundColor: "#FFA088",
	},
	label: { fontSize: 16, color: "#222" },
	tab: {
		elevation: 0,
		shadowOpacity: 0,
		backgroundColor: "#FFCC80",
		height: TabBarHeight,
	},
	indicator: { backgroundColor: "#222" },
});
