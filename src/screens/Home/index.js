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

	const [
		NotifCount,
		{ data: datanotif, loading: loadingnotif, error: errornotif },
	] = useLazyQuery(CountNotif, {
		fetchPolicy: "network-only",
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

	console.log(token);

	const onScrollSearch = (e) => {
		if (e.nativeEvent.contentOffset.y <= 230) {
			setSearchBg("transparent");
			setSearchElevation(0);
		} else {
			setSearchBg("#209FAE");
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

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<StatusBar backgroundColor="transparent" barStyle="dark-content" />
			<Animated.ScrollView
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[2]}
				onScroll={onScrollSearch}
			>
				<ImageBackground
					source={sampul2}
					style={{
						width: "100%",
						height: 180,
						alignSelf: "flex-start",
						justifyContent: "flex-start",
						alignContent: "center",
						alignItems: "center",
					}}
				/>
				<RenderAccount
					props={props}
					data={data ? data : null}
					token={token}
					datanotif={datanotif ? datanotif : null}
				/>
				<View
					style={{
						marginTop: 5,
						paddingVertical: 10,
						width: width,
						justifyContent: "center",
						alignItems: "center",
						alignContent: "center",
						alignSelf: "center",
						backgroundColor: `${searchBg}`,
						borderColor: "white",
						shadowColor: "#6F7273",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 1,
						shadowRadius: 1,
						elevation: searchElevation,
					}}
				>
					<TouchableOpacity
						onPress={searchpage}
						style={{
							width: width,
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
								borderWidth: 0.5,
								borderColor: "#6F7273",
								alignSelf: "center",
								paddingHorizontal: 20,
								width: width * 0.9,
								elevation: 3,
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
		</SafeAreaView>
	);
}
