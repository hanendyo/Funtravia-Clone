import React, { useState, useEffect } from "react";
import {
	View,
	Dimensions,
	SafeAreaView,
	Pressable,
	FlatList,
	RefreshControl,
	Keyboard,
	ActivityIndicator,
} from "react-native";
import Ripple from "react-native-material-ripple";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, StatusBar } from "../../component";
import { Arrowbackwhite } from "../../assets/svg";
import { useQuery } from "@apollo/react-hooks";
import Feedsearchbylocation from "../../graphQL/Query/Home/Feedsearchbylocation";
import RenderGrid from "./RenderGrid";

export default function Feed(props) {
	const [searchtext, SetSearchtext] = useState("");
	let [setting, setSetting] = useState();
	let latitude = props.route.params.latitude;
	let longitude = props.route.params.longitude;
	let keyword = props.route.params.keyword;
	let [token, setToken] = useState("");
	let [refreshing, setRefreshing] = useState(false);
	let [aktifsearch, setAktifSearch] = useState(false);
	let { width, height } = Dimensions.get("screen");
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
	} = useQuery(Feedsearchbylocation, {
		variables: {
			latitude: latitude,
			longitude: longitude,
			orderby: "new",
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
	const spreadData = (data) => {
		let tmpData = [];
		let count = 1;
		let tmpArray = [];
		for (let val of data) {
			if (count < 3) {
				tmpArray.push(val);
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
	let feed_search_bylocation_paging = [];
	if (
		dataPost &&
		dataPost &&
		"datas" in dataPost.feed_search_bylocation_paging
	) {
		feed_search_bylocation_paging = spreadData(
			dataPost.feed_search_bylocation_paging.datas
		);
	}

	useEffect(() => {
		loadAsync();
	}, []);

	const _refresh = async () => {
		setRefreshing(true);
		feed_search_bylocation_paging = [];
		refetch();
		grid = 1;
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
		const { page_info } = fetchMoreResult.feed_search_bylocation_paging;
		const datas = [
			...prev.feed_search_bylocation_paging.datas,
			...fetchMoreResult.feed_search_bylocation_paging.datas,
		];
		return Object.assign({}, prev, {
			feed_search_bylocation_paging: {
				__typename: prev.feed_search_bylocation_paging.__typename,
				page_info,
				datas,
			},
		});
	};

	const handleOnEndReached = () => {
		if (dataPost.feed_search_bylocation_paging.page_info.hasNextPage) {
			return fetchMore({
				variables: {
					limit: 30,
					offset: dataPost.feed_search_bylocation_paging.page_info.offset,
					keyword: keyword,
					orderby: "new",
				},
				updateQuery: onUpdate,
			});
		}
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

	let grid = 1;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
			<StatusBar backgroundColor="#14646e" barStyle="light-content" />

			<View
				style={{
					backgroundColor: "#209FAE",
					height: 55,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
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
					<Text
						size="label"
						type="bold"
						style={{
							color: "#FFFFFF",
						}}
					>
						Search By Location : {keyword}
					</Text>
					<Ripple
						onPress={() => {}}
						style={{
							height: 70,
							width: 35,
							justifyContent: "center",
							alignItems: "center",
						}}
					></Ripple>
				</View>
			</View>
			<FlatList
				data={feed_search_bylocation_paging}
				renderItem={({ item, index }) => (
					<RenderGrid item={item} index={index} props={props} />
				)}
				style={{
					marginHorizontal: 10,
				}}
				contentContainerStyle={{
					paddingVertical: 5,
				}}
				keyExtractor={(item) => item.id_post}
				showsVerticalScrollIndicator={false}
				refreshing={refreshing}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => _refresh()}
					/>
				}
				ListFooterComponent={
					loadingPost ? (
						<View
							style={{
								width: width,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<ActivityIndicator
								animating={loadingPost}
								size="large"
								color="#209fae"
							/>
						</View>
					) : null
				}
				onEndReachedThreshold={1}
				onEndReached={handleOnEndReached}
			/>
		</SafeAreaView>
	);
}
