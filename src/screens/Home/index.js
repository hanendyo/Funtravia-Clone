import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Dimensions,
	TouchableOpacity,
	ImageBackground,
	Animated,
	SafeAreaView,
	StatusBar,
	RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, CustomImage } from "../../component";
import { Akunsaya, search_black, sampul2 } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import PopularDestination from "./PopularDestination";
import RenderAccount from "./RenderAccount";
import Account from "../../graphQL/Query/Home/Account";
import MenuNew from "./MenuNew";
import DiscoverCard from "./DiscoverCard";
import FunFeed from "./FunFeed";
import CountNotif from "../../graphQL/Query/Notification/CountNotif";

const { width, height } = Dimensions.get("screen");
export default function Home(props) {
	const { t } = useTranslation();
	let [token, setToken] = useState("");
	let [searchBg, setSearchBg] = useState("transparent");
	let [refresh, setRefresh] = useState(false);

	const [LoadUserProfile, { data, loading }] = useLazyQuery(Account, {
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const [
		NotifCount,
		{ data: datanotif, loading: loadingnotif, error: errornotif },
	] = useLazyQuery(CountNotif, {
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});

	// console.log(datanotif);

	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		await setToken(tkn);
		await NotifCount();
		await LoadUserProfile();
	};

	const searchPage = () => {
		props.navigation.navigate("SearchPage");
	};

	useEffect(() => {
		props.navigation.addListener("focus", () => {
			loadAsync();
		});
	}, []);

	const wait = (timeout) => {
		return new Promise((resolve) => setTimeout(resolve, timeout));
	};

	const onRefresh = React.useCallback(() => {
		setRefresh(true);
		loadAsync();
		wait(1000).then(() => setRefresh(false));
	}, []);

	function HomeTitle({ title, label, seeAll }) {
		return (
			<View
				style={{
					marginTop: 20,
					marginHorizontal: 20,
					flexDirection: "row",
					alignItems: "stretch",
				}}
			>
				<View
					style={{
						width: 5,
						height: 35,
						backgroundColor: "#209FAE",
						borderRadius: 20,
					}}
				></View>
				<View
					style={{
						flexDirection: "row",
						width: "97%",
						justifyContent: "space-between",
						alignContent: "flex-end",
						alignItems: "flex-end",
					}}
				>
					<View style={{ paddingLeft: 5 }}>
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
					{seeAll ? (
						<Text
							onPress={() =>
								props.navigation.navigate("CountryStack", {
									screen: "AllDestination",
								})
							}
							type="bold"
							size="small"
							style={{ color: "#209FAE" }}
						>
							{t("viewAll")}
						</Text>
					) : null}
				</View>
			</View>
		);
	}

	let [scrollY] = useState(new Animated.Value(0));

	const searchBG = scrollY.interpolate({
		inputRange: [0, height / 2, height],
		outputRange: [0, 1, 1],
		extrapolate: "clamp",
	});

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<View
				style={{
					backgroundColor: "#FFF",
					height: Platform.OS === "ios" ? 44 : 50,
				}}
			>
				<SafeAreaView>
					<StatusBar
						translucent
						backgroundColor={"#000"}
						barStyle="light-content"
					/>
				</SafeAreaView>
			</View>
			<StatusBar backgroundColor="transparent" barStyle="dark-content" />
			<Animated.ScrollView
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[1]}
				onScroll={Animated.event([
					{ nativeEvent: { contentOffset: { y: scrollY } } },
				])}
				refreshControl={
					<RefreshControl refreshing={refresh} onRefresh={onRefresh} />
				}
			>
				<ImageBackground
					source={sampul2}
					style={{
						width: width,
						height: width / 2,
						alignSelf: "flex-start",
						justifyContent: "flex-end",
						alignContent: "center",
						alignItems: "center",
						marginBottom: 50,
					}}
				>
					<View style={{ position: "absolute", bottom: -50 }}>
						<RenderAccount
							props={props}
							data={data ? data : null}
							token={token}
							datanotif={datanotif ? datanotif : null}
						/>
					</View>
				</ImageBackground>
				<View
					style={{
						shadowColor: "#FFF",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 1,
						shadowRadius: 1,
						marginTop: 10,
						elevation: 2,
					}}
				>
					<Animated.View
						style={{
							opacity: searchBG,
							backgroundColor: "#FFF",
							width: width,
							paddingVertical: 5,
							height: 58,
							position: "absolute",
							shadowColor: "#464646",
							shadowOffset: { width: 1, height: 1 },
							shadowOpacity: 0.5,
							elevation: 3,
						}}
					/>
					<TouchableOpacity
						onPress={() => searchPage()}
						style={{
							alignItems: "center",
							justifyContent: "flex-start",
							height: 45,
							flexDirection: "row",
							backgroundColor: "#FFF",
							borderRadius: 5,
							borderWidth: 0.5,
							borderColor: "#FFF",
							alignSelf: "center",
							paddingHorizontal: 20,
							marginVertical: 5,
							width: width * 0.9,
							shadowColor: "#464646",
							shadowOffset: { width: 0.5, height: 1 },
							shadowOpacity: 0.5,
							shadowRadius: 2,
							elevation: 4,
						}}
					>
						<View
							style={{
								marginRight: 10,
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
				<FunFeed props={props} />
			</Animated.ScrollView>
		</View>
	);
}
