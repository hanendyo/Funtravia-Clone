import React, { useState, useEffect } from "react";
import {
	View,
	TouchableOpacity,
	Dimensions,
	Alert,
	SafeAreaView,
	TextInput,
	Pressable,
	FlatList,
	RefreshControl,
	Keyboard,
	ActivityIndicator,
} from "react-native";
import Ripple from "react-native-material-ripple";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomImage, Text, Truncate, StatusBar } from "../../component";
import { NetworkStatus } from "@apollo/client";
import {
	Magnifying,
	OptionsVertWhite,
	Arrowbackwhite,
	Pinloc,
} from "../../assets/svg";
import { useQuery } from "@apollo/react-hooks";
import FeedPopulerPageing from "../../graphQL/Query/Home/FeedPopulerPageing";
import SearchUserQuery from "../../graphQL/Query/Search/SearchPeopleV2";
import { API_KEY } from "../../config";
import RenderGrid from "./RenderGrid";

export default function Feed(props) {
	const [active, setActive] = useState("personal");
	const [active_src, setActiveSrc] = useState("account");
	const [searchtext, SetSearchtext] = useState("");
	let [setting, setSetting] = useState();
	let [token, setToken] = useState("");
	const default_image =
		"https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909";
	let [refreshing, setRefreshing] = useState(false);
	let [aktifsearch, setAktifSearch] = useState(false);
	let { width, height } = Dimensions.get("screen");

	const spreadData = (data) => {
		let tmpData = [];
		let count = 1;
		let tmpArray = [];
		let grid = 1;
		for (let val of data) {
			if (count < 3) {
				tmpArray.push(val);
				count++;
			} else {
				tmpArray.push(val);
				tmpArray.push({ grid: grid });
				grid++;
				if (grid == 4) {
					grid = 1;
				}
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

	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		setToken(tkn);
		let setsetting = await AsyncStorage.getItem("setting");
		setSetting(JSON.parse(setsetting));
	};
	const _searchHandle = (text) => {
		SetSearchtext(text);
		_autocomplitLocation(text);
	};
	const HeaderComponent = {
		tabBarBadge: null,
		headerShown: false,
	};
	useEffect(() => {
		props.navigation.setOptions(HeaderComponent);
	}, []);

	const {
		loading: loadingPost,
		data: dataPost,
		error: errorPost,
		fetchMore,
		refetch,
		networkStatus,
	} = useQuery(FeedPopulerPageing, {
		variables: {
			limit: 30,
			offset: 0,
		},
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	let feed_post_populer_paging = [];
	if (dataPost && dataPost && "datas" in dataPost.feed_post_populer_paging) {
		feed_post_populer_paging = spreadData(
			dataPost.feed_post_populer_paging.datas
		);
	}

	const {
		loading: loadingSrcuser,
		data: dataSrcuser,
		error: errorSrcuser,
		refetch: refetchSrcuser,
		networkStatus: networkStatusSrcuser,
	} = useQuery(SearchUserQuery, {
		variables: {
			keyword: searchtext,
		},
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	let user_search_feed = [];
	if (dataSrcuser && dataSrcuser.user_search_feed) {
		user_search_feed = dataSrcuser.user_search_feed;
	}

	useEffect(() => {
		loadAsync();
	}, []);

	const refresh = networkStatus === NetworkStatus.refetch;
	const _refresh = async () => {
		setRefreshing(true);
		feed_post_populer_paging = [];
		refetch();

		wait(1000).then(() => {
			setRefreshing(false);
		});
	};
	const wait = (timeout) => {
		return new Promise((resolve) => {
			setTimeout(resolve, timeout);
		});
	};
	const onUpdate = (prev, { fetchMoreResult }) => {
		if (!fetchMoreResult) return prev;
		const { page_info } = fetchMoreResult.feed_post_populer_paging;
		const datas = [
			...prev.feed_post_populer_paging.datas,
			...fetchMoreResult.feed_post_populer_paging.datas,
		];
		return Object.assign({}, prev, {
			feed_post_populer_paging: {
				__typename: prev.feed_post_populer_paging.__typename,
				page_info,
				datas,
			},
		});
	};

	const handleOnEndReached = () => {
		if (dataPost.feed_post_populer_paging.page_info.hasNextPage) {
			return fetchMore({
				variables: {
					limit: 30,
					offset: dataPost.feed_post_populer_paging.page_info.offset + 1,
				},
				updateQuery: onUpdate,
			});
		}
	};

	const Searchbytag = (text) => {
		props.navigation.navigate("FeedStack", {
			screen: "SearchFeedByTag",
			params: {
				keyword: text,
			},
		});
	};

	const showsearchpage = () => {
		create_UUID();
		setAktifSearch(true);
	};

	const _BackHandler = () => {
		if (aktifsearch == true) {
			setAktifSearch(false);
			SetSearchtext("");
			Keyboard.dismiss();
		} else {
			props.navigation.goBack();
		}
	};
	function create_UUID() {
		var dt = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
			c
		) {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
		});
		setSessionToken(uuid);
	}
	let [sessiontoken, setSessionToken] = useState("");
	let [datalocation, setDatalocation] = useState([]);
	let [loadinglocation, setLoadinglocation] = useState(false);
	const _autocomplitLocation = async (input) => {
		setLoadinglocation(true);
		try {
			let response = await fetch(
				"https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
					input +
					"&key=" +
					API_KEY +
					"&sessiontoken=" +
					sessiontoken,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);
			let responseJson = await response.json();
			if (responseJson && responseJson.status == "OK") {
				setDatalocation(responseJson.predictions);
				setLoadinglocation(false);
			} else {
				setDatalocation(responseJson.predictions);
				setLoadinglocation(false);
			}
		} catch (error) {
			console.error(error);
			setLoadinglocation(false);
		}
	};

	const _get_search_bylocation = async (data) => {
		setLoadinglocation(true);
		try {
			let response = await fetch(
				"https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
					data.place_id +
					"&fields=geometry&key=" +
					API_KEY,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);
			let responseJson = await response.json();
			if (responseJson && responseJson.status == "OK") {
				props.navigation.navigate("FeedStack", {
					screen: "SearchFeedByLocation",
					params: {
						latitude: responseJson.result.geometry.location.lat,
						longitude: responseJson.result.geometry.location.lng,
						keyword: data.structured_formatting.main_text,
					},
				});

				setLoadinglocation(false);
			} else {
				setLoadinglocation(false);
				Alert("location not found");
			}
		} catch (error) {
			console.error(error);
			Alert("location not found");
			setLoadinglocation(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
			<StatusBar backgroundColor="#14646e" barStyle="light-content" />
			<View style={{ backgroundColor: "#209FAE" }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						width: "100%",
						justifyContent: "space-between",
					}}
				>
					<Pressable
						onPress={() => _BackHandler()}
						style={({ pressed }) => [
							{
								height: 40,
								width: 40,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 20,
								backgroundColor: pressed ? "#178b99" : "#209FAE",
							},
						]}
					>
						<Arrowbackwhite width={20} height={20} />
					</Pressable>
					<View
						style={{
							marginVertical: 10,
							backgroundColor: "#FFFFFF",
							flexDirection: "row",
							borderRadius: 3,
							alignContent: "center",
							alignItems: "center",
						}}
					>
						<Magnifying
							width={20}
							height={20}
							style={{ marginHorizontal: 10 }}
						/>
						<TextInput
							value={searchtext}
							onChangeText={(e) => _searchHandle(e)}
							onFocus={() => showsearchpage(true)}
							placeholder="Search Feed"
							placeholderTextColor="#464646"
							style={{
								color: "#000",
								height: 40,
								width: "70%",
							}}
						/>
					</View>
					<Pressable
						onPress={() => {
							console.log("Function Tri Dots Here");
						}}
						style={{
							height: 40,
							width: 35,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<OptionsVertWhite width={20} height={20} />
					</Pressable>
				</View>
			</View>

			{aktifsearch == true ? (
				<>
					<View
						style={{
							flexDirection: "row",
							backgroundColor: "#fff",
							borderWidth: 1,
							borderColor: "#EEEEEE",
							paddingHorizontal: 10,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								setActiveSrc("account");
							}}
							style={{
								// width: width / 2,
								alignContent: "center",
								alignItems: "center",
								borderBottomWidth: active_src == "account" ? 3 : 0,
								borderBottomColor:
									active_src == "account" ? "#209FAE" : "#EEEEEE",
								paddingVertical: 15,
								backgroundColor: "#FFFFFF",
								paddingHorizontal: 10,
								marginHorizontal: 10,
							}}
						>
							<Text
								size="description"
								type={active_src == "account" ? "bold" : "bold"}
								style={{
									color: active_src == "account" ? "#209FAE" : "#D1D1D1",
								}}
							>
								Account
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setActiveSrc("tag");
							}}
							style={{
								alignContent: "center",
								alignItems: "center",
								borderBottomWidth: active_src == "tag" ? 3 : 0,
								borderBottomColor: active_src == "tag" ? "#209FAE" : "#EEEEEE",
								paddingVertical: 15,
								backgroundColor: "#FFFFFF",
								paddingHorizontal: 10,
								marginHorizontal: 10,
							}}
						>
							<Text
								size="description"
								type={active_src == "tag" ? "bold" : "bold"}
								style={{
									color: active_src == "tag" ? "#209FAE" : "#D1D1D1",
								}}
							>
								Tag
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setActiveSrc("places");
							}}
							style={{
								alignContent: "center",
								alignItems: "center",
								borderBottomWidth: active_src == "places" ? 3 : 0,
								borderBottomColor:
									active_src == "places" ? "#209FAE" : "#EEEEEE",
								paddingVertical: 15,
								backgroundColor: "#FFFFFF",
								paddingHorizontal: 10,
								marginHorizontal: 10,
							}}
						>
							<Text
								size="description"
								type={active_src == "places" ? "bold" : "bold"}
								style={{
									color: active_src == "places" ? "#209FAE" : "#D1D1D1",
								}}
							>
								Places
							</Text>
						</TouchableOpacity>
					</View>
					{active_src === "account" ? (
						loadingSrcuser ? (
							<View
								style={{
									flex: 1,
									width: width,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<ActivityIndicator
									animating={loadingSrcuser}
									size="large"
									color="#209fae"
								/>
							</View>
						) : (
							<FlatList
								data={user_search_feed}
								renderItem={({ item, index }) => (
									<Pressable
										onPress={() => {
											item.id !== setting?.user?.id
												? props.navigation.push("ProfileStack", {
														screen: "otherprofile",
														params: {
															idUser: item.id,
															token: token,
														},
												  })
												: props.navigation.push("ProfileStack", {
														screen: "ProfileTab",
												  });
										}}
										style={{
											flexDirection: "row",
											paddingVertical: 15,
											marginHorizontal: 15,
											borderBottomWidth: 1,
											borderBottomColor: "#EEEEEE",
											alignContent: "center",
										}}
									>
										<CustomImage
											customStyle={{
												height: 40,
												width: 40,
												borderRadius: 15,
												alignSelf: "center",
												marginLeft: 15,
											}}
											customImageStyle={{
												resizeMode: "cover",
												borderRadius: 50,
											}}
											source={{
												uri: item.picture ? item.picture : default_image,
											}}
										/>
										<View
											style={{
												paddingHorizontal: 10,
											}}
										>
											<Text type="bold">
												{item.first_name} {item?.last_name}
											</Text>
											<Text>@{item.username}</Text>
										</View>
									</Pressable>
								)}
								keyExtractor={(item) => item.id}
								showsVerticalScrollIndicator={false}
							/>
						)
					) : null}
					{active_src === "tag" && searchtext ? (
						<Pressable
							onPress={() => {
								Searchbytag(searchtext);
							}}
							style={{
								flexDirection: "row",
								paddingVertical: 15,
								marginHorizontal: 15,
								borderBottomWidth: 1,
								borderBottomColor: "#EEEEEE",
								alignContent: "center",
								alignItems: "center",
							}}
						>
							<View
								style={{
									height: 40,
									width: 40,
									borderRadius: 20,
									alignSelf: "center",
									marginLeft: 15,
									backgroundColor: "#DAF0F2",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text size="h5">#</Text>
							</View>
							<View
								style={{
									paddingHorizontal: 10,
								}}
							>
								<Text type="bold">#{searchtext}</Text>
							</View>
						</Pressable>
					) : null}
					{active_src === "places" ? (
						loadinglocation == true ? (
							<View
								style={{
									flex: 1,
									width: width,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<ActivityIndicator
									color="#209fae"
									animating={loadingPost}
									size="large"
								/>
							</View>
						) : (
							<FlatList
								data={datalocation}
								renderItem={({ item, index }) => (
									<Pressable
										onPress={() => {
											_get_search_bylocation(item);
										}}
										style={{
											flexDirection: "row",
											paddingVertical: 15,
											marginHorizontal: 15,
											borderBottomWidth: 1,
											borderBottomColor: "#EEEEEE",
											alignContent: "center",
											alignItems: "center",
										}}
									>
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignSelf: "center",
												marginLeft: 15,
												backgroundColor: "#DAF0F2",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Pinloc width={15} height={15} />
										</View>
										<View
											style={{
												paddingHorizontal: 10,
											}}
										>
											<Text type="bold">
												{item.structured_formatting.main_text}
											</Text>
											{item.structured_formatting &&
											item.structured_formatting.secondary_text ? (
												<Text>
													<Truncate
														text={item.structured_formatting.secondary_text}
														length={50}
													/>
												</Text>
											) : null}
										</View>
									</Pressable>
								)}
								keyExtractor={(item) => item.id}
								showsVerticalScrollIndicator={false}
							/>
						)
					) : null}
				</>
			) : (
				<>
					<View
						style={{
							flexDirection: "row",
							backgroundColor: "#fff",
							borderColor: "#EEEEEE",
							paddingHorizontal: 10,
						}}
					>
						<Ripple
							onPress={() => {
								setActive("personal");
							}}
							style={{
								alignContent: "center",
								alignItems: "center",
								paddingVertical: 15,
								backgroundColor: "#FFFFFF",
								paddingHorizontal: 10,
							}}
						>
							<Text
								size="description"
								type={active == "personal" ? "bold" : "bold"}
								style={{
									color: active == "personal" ? "#209FAE" : "#D1D1D1",
								}}
							>
								All Post
							</Text>
						</Ripple>
					</View>
					<FlatList
						data={feed_post_populer_paging}
						renderItem={({ item, index }) => (
							<RenderGrid item={item} index={index} props={props} />
						)}
						style={{
							marginHorizontal: 10,
						}}
						keyExtractor={(item) => item[0].id}
						showsVerticalScrollIndicator={false}
						refreshing={refreshing}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={() => _refresh()}
							/>
						}
						onEndReachedThreshold={1}
						ListFooterComponent={
							loadingPost ? (
								<View
									style={{
										width: width,
										justifyContent: "center",
										alignItems: "center",
										marginTop: 10,
									}}
								>
									<ActivityIndicator
										color="#209fae"
										animating={loadingPost}
										size="large"
									/>
								</View>
							) : null
						}
						onEndReached={handleOnEndReached}
					/>
				</>
			)}
		</SafeAreaView>
	);
}
