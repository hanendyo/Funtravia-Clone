import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	Dimensions,
	TouchableOpacity,
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
import { useTranslation } from "react-i18next";
import PopularDestination from "./PopularDestination";
import RenderAccount from "./RenderAccount";
import Account from "../../graphQL/Query/Home/Account";
import MenuNew from "./MenuNew";
import DiscoverCard from "./DiscoverCard";
import FunFeed from "./FunFeed";

export default function Home(props) {
	const { t } = useTranslation();
	let [token, setToken] = useState("");
	let [searchBg, setSearchBg] = useState("transparent");
	let [searchElevation, setSearchElevation] = useState(0);

	const [LoadUserProfile, { data, loading }] = useLazyQuery(Account, {
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
		await setToken(tkn);
		await LoadUserProfile();
	};

	console.log(token);

	const onScrollSearch = (e) => {
		if (e.nativeEvent.contentOffset.y <= 230) {
			setSearchBg("transparent");
			setSearchElevation(0);
		} else {
			setSearchBg("white");
			setSearchElevation(10);
		}
	};

	const searchpage = () => {
		props.navigation.navigate("SearchPage");
	};

	useEffect(() => {
		const unsubscribe = props.navigation.addListener("focus", (data) => {
			loadAsync();
		});
		return unsubscribe;
	}, [props.navigation]);

	function HomeTitle({ title, label, seeAll }) {
		return (
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
							width: "100%",
							justifyContent: "space-between",
							alignContent: "center",
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
						{seeAll ? (
							<Text
								onPress={() => props.navigation.navigate("AllDestination")}
								type="bold"
								size="small"
								style={{ color: "#209FAE", alignSelf: "baseline" }}
							>
								{t("viewAll")}
							</Text>
						) : null}
					</View>
				</View>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<StatusBar backgroundColor="#14646E" barStyle="light-content" />
			<Animated.ScrollView
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[1]}
				onScroll={onScrollSearch}
			>
				<ImageBackground
					source={Akunsaya}
					style={{
						width: "100%",
						height: 180,
						alignSelf: "flex-start",
						justifyContent: "flex-start",
						alignContent: "center",
						alignItems: "center",
					}}
				>
					<View
						style={{
							position: "absolute",
							bottom: -Dimensions.get("window").height * 0.07,
							marginBottom: 10,
						}}
					>
						<RenderAccount
							props={props}
							data={data ? data : null}
							token={token}
						/>
					</View>
				</ImageBackground>
				<View
					style={{
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
						shadowColor: "#6F7273",
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
							flex: 1,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								alignItems: "center",
								justifyContent: "flex-start",
								height: 45,
								flexDirection: "row",
								backgroundColor: "white",
								borderRadius: 5,
								borderWidth: 1,
								borderColor: "#6F7273",
								alignSelf: "center",
								paddingHorizontal: 20,
								width: Dimensions.get("screen").width * 0.9,
								shadowColor: "#6F7273",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 5,
								shadowRadius: 3,
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
