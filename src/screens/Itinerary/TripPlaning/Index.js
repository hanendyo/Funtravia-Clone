import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActivePlan from "./ActivePlan";
import FinishTrip from "./FinishTrip";
import PlanList from "./PlanList";
import { Arrowbackwhite } from "../../../assets/svg";
import { useLazyQuery, useQuery } from "@apollo/client";
import listitinerary from "../../../graphQL/Query/Itinerary/listitinerary";
import { useTranslation } from "react-i18next";
import { Button, Loading, Text } from "../../../component";
import Animated from "react-native-reanimated";
import Ripple from "react-native-material-ripple";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function TripPlaning(props) {
	const HeaderComponent = {
		title: "Your Trip",
		headerTransparent: false,
		headerTintColor: "white",
		headerTitle: "Your Trip",
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
		headerLeft: () => (
			<Button
				text={""}
				size="medium"
				type="circle"
				variant="transparent"
				onPress={() => props.navigation.navigate("HomeScreen")}
				style={{
					height: 55,
				}}
			>
				<Arrowbackwhite height={20} width={20}></Arrowbackwhite>
			</Button>
		),
	};

	const { t, i18n } = useTranslation();
	let [token, setToken] = useState(null);
	let [DataPlan, setDataPlan] = useState(0);
	let [DataActive, setDataActive] = useState(0);
	let [DataFinish, setDataFinish] = useState(0);
	let [loading, setloading] = useState(false);
	const loadAsync = async () => {
		setloading(true);
		let tkn = await AsyncStorage.getItem("access_token");
		setToken(tkn);
		if (tkn === null) {
			Alert.alert("Silahkan Login terlebih dahulu");
			props.navigation.navigate("HomeScreen");
		} else {
			null;
		}
		await setloading(false);
	};

	useEffect(() => {
		props.navigation.setOptions(HeaderComponent);
		const unsubscribe = props.navigation.addListener("focus", () => {
			loadAsync();
		});
		return unsubscribe;
	}, [props.navigation]);

	function MyTabBar({ state, descriptors, navigation, position }) {
		return (
			<View
				style={{
					flexDirection: "row",
					borderBottomWidth: 1,
					borderBottomColor: "#d3d3d3",
				}}
			>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					const label =
						options.tabBarLabel !== undefined
							? options.tabBarLabel
							: options.title !== undefined
							? options.title
							: route.name;

					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
						});

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name);
						}
					};

					const onLongPress = () => {
						navigation.emit({
							type: "tabLongPress",
							target: route.key,
						});
					};
					// modify inputRange for custom behavior
					const inputRange = state.routes.map((_, i) => i);
					const opacity = Animated.interpolate(position, {
						inputRange,
						outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
					});

					return (
						<Ripple
							key={route.name}
							accessibilityRole="button"
							accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							testID={options.tabBarTestID}
							onPress={onPress}
							onLongPress={onLongPress}
							style={{
								borderBottomWidth: isFocused ? 2 : 0,
								paddingVertical: 10,
								borderBottomColor: "#209fae",
								flex: 1,
								alignContent: "center",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								type={isFocused ? "bold" : "regular"}
								size="label"
								style={{
									color: isFocused ? "#209fae" : "#646464",
								}}
							>
								1
							</Text>
							<Text
								type={isFocused ? "bold" : "regular"}
								size="label"
								style={{
									color: isFocused ? "#209fae" : "#646464",
								}}
							>
								{label}
							</Text>
						</Ripple>
					);
				})}
			</View>
		);
	}

	if (token !== null) {
		return (
			<Tab.Navigator
				backBehavior="none"
				initialRouteName="Edit"
				// tabBarOptions={{
				//   activeTintColor: "#209fae",
				//   labelStyle: {
				//     fontFamily: "Lato-Bold",
				//   },
				//   style: {
				//     backgroundColor: "#ffff",
				//   },
				// }}
				tabBar={(props) => <MyTabBar {...props} />}
			>
				<Tab.Screen
					name="Edit"
					component={() => <PlanList props={props} token={token} />}
					options={{ tabBarLabel: "Plan" }}
				/>
				<Tab.Screen
					name="Save"
					component={() => <ActivePlan props={props} token={token} />}
					options={{ tabBarLabel: "Ongoing" }}
				/>
				<Tab.Screen
					name="Finish"
					component={() => <FinishTrip props={props} token={token} />}
					options={{ tabBarLabel: "Finish" }}
				/>
			</Tab.Navigator>
		);
	} else {
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
}

const styles = StyleSheet.create({});
