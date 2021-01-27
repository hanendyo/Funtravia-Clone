import React, { useState, useEffect } from "react";
import {
	View,
	ImageBackground,
	Dimensions,
	Alert,
	Pressable,
	Image,
	Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import { Akunsaya, default_image, SettingPutih } from "../../assets/png";
import Ripple from "react-native-material-ripple";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Next, Help, Arrowbackwhite } from "../../assets/svg";
import Logout from "../../graphQL/Mutation/Login/Logout";
import Count_Notification from "../../component/src/Count_Notification";
import { useTranslation } from "react-i18next";
import { Button, Text, Truncate } from "../../component";
import Account from "../../graphQL/Query/Home/Account";

export default function MyAccount(props) {
<<<<<<< Updated upstream
	const { width } = Dimensions.get("screen");
	const { t } = useTranslation();
	let [token, setToken] = useState("");
=======
  const { t, i18n } = useTranslation();
  let [token, setToken] = useState("");
  let [count, setCount] = useState(1);
  const screenWidth = Dimensions.get("window").width;

  const HeaderComponent = {
    headerTransparent: true,
    headerTitle: t("myProfile"),
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
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
    headerRight: () => (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={() =>
            props.navigation.navigate("settings", { datauser: datauser })
          }
          style={{
            marginHorizontal: 10,
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              marginHorizontal: 10,
            }}
            imageStyle={{
              width: 25,
              height: 25,
              resizeMode: "contain",
            }}
            source={setting_icon}
          />
        </Pressable>
        <Pressable
          onPress={() => props.navigation.navigate("Inbox")}
          style={{
            marginHorizontal: 10,
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
            }}
            imageStyle={{
              width: 25,
              height: 25,
              resizeMode: "contain",
            }}
            source={BelPutih}
          />
>>>>>>> Stashed changes

	const HeaderComponent = {
		headerTransparent: true,
		headerTitle: null,
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
			marginLeft: 10,
		},

		headerLeft: () => (
			<Button
				text={""}
				size="medium"
				type="circle"
				variant="transparent"
				onPress={() => props.navigation.goBack()}
				style={{
					height: 55,
				}}
			>
				<Arrowbackwhite height={20} width={20}></Arrowbackwhite>
			</Button>
		),

		headerRight: () => (
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Pressable
					onPress={() =>
						props.navigation.navigate("settings", { datauser: datauser })
					}
					style={{
						marginHorizontal: 10,
					}}
				>
					<Image
						style={{
							width: 25,
							height: 25,
							marginHorizontal: 10,
						}}
						imageStyle={{
							width: 25,
							height: 25,
							resizeMode: "contain",
						}}
						source={SettingPutih}
					/>
				</Pressable>
			</View>
		),
		headerRightStyle: {},
	};

	const [mutationlogout, { loading, data, error }] = useMutation(Logout, {
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
		if (tkn === null) {
			Alert.alert("Silahkan Login terlebih dahulu");
			props.navigation.navigate("HomeScreen");
		} else {
			await LoadUserProfile();
		}
	};

	const [
		LoadUserProfile,
		{ data: datauser, loading: loadinguser, error: erroruser },
	] = useLazyQuery(Account, {
		fetchPolicy: "network-only",
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});

	useEffect(() => {
		props.navigation.setOptions(HeaderComponent);
		const unsubscribe = props.navigation.addListener("focus", () => {
			loadAsync();
		});
		return unsubscribe;
	}, [props.navigation]);

	const arrayShadow = {
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
		shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
		elevation: Platform.OS == "ios" ? 3 : 1.5,
	};

	return (
		<View style={{ zIndex: -1 }}>
			<View
				style={{
					flexDirection: "row",
					height: 130,
					position: "absolute",
					top: 0,
					justifyContent: "space-between",
					width: width,
					zIndex: 1,
				}}
			>
				<LinearGradient
					colors={["rgba(34, 34, 34, 1)", "rgba(34, 34, 34, 0)"]}
					start={{ x: 1, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{
						height: 130,
						width: width,
					}}
				></LinearGradient>
			</View>
			<ScrollView style={{ backgroundColor: "#F6F6F7" }}>
				<View
					style={{
						justifyContent: "center",
						alignContent: "center",
						alignItems: "center",
						marginBottom: 20,
					}}
				>
					<ImageBackground
						source={Akunsaya}
						imageStyle={{
							width: width,
							height: 250,
							resizeMode: "cover",
						}}
						style={{
							width: width,
							height: 250,
						}}
					></ImageBackground>
					<View
						style={{
							zIndex: 999,
							shadowOpacity: 0.5,
							shadowColor: "#d3d3d3",
							elevation: 4,
							alignSelf: "center",
							borderColor: "white",
							borderRadius: 60,
							borderWidth: 3,
							backgroundColor: "#B8E0E5",
							height: 120,
							width: 120,
							marginTop: -60,
							marginBottom: 10,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Image
							source={
								datauser && datauser.user_profile.picture
									? { uri: datauser.user_profile.picture }
									: default_image
							}
							style={{
								borderRadius: 60,
								resizeMode: "cover",
								height: "100%",
								width: "100%",
							}}
						/>
					</View>
					<Text type="bold" size="label">
						{datauser && datauser.user_profile.first_name
							? datauser.user_profile.first_name
							: null}{" "}
						{datauser && datauser.user_profile.last_name
							? datauser.user_profile.last_name
							: null}
					</Text>
					<Text>
						@
						{datauser && datauser.user_profile.username
							? datauser.user_profile.username
							: null}
					</Text>
				</View>
				<View
					style={{
						backgroundColor: "#FFFFFF",
						margin: 10,
						padding: 20,
						borderRadius: 10,
						shadowColor: "gray",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: arrayShadow.shadowOpacity,
						shadowRadius: arrayShadow.shadowRadius,
						elevation: arrayShadow.elevation,
					}}
				>
					<Text type="bold" size="label" style={{ marginBottom: 10 }}>
						{t("accountInformation")}
					</Text>
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							paddingVertical: 10,
							borderBottomWidth: 0.5,
							borderBottomColor: "#d3d3d3",
						}}
					>
						<Text>{t("fullName")}</Text>
						<Text>
							{datauser && datauser.user_profile.first_name
								? datauser.user_profile.first_name
								: null}{" "}
							{datauser && datauser.user_profile.last_name
								? datauser.user_profile.last_name
								: null}
						</Text>
					</View>
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							paddingVertical: 10,
							borderBottomWidth: 0.5,
							borderBottomColor: "#d3d3d3",
						}}
					>
						<Text>{t("emailAddress")}</Text>
						<Text>
							<Truncate
								text={
									datauser &&
									datauser.user_profile &&
									datauser.user_profile.email
										? datauser.user_profile.email
										: "Not Set"
								}
								length={30}
							/>
						</Text>
					</View>
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							paddingVertical: 10,
							borderBottomWidth: 0.5,
							borderBottomColor: "#d3d3d3",
						}}
					>
						<Text>{t("phoneNumber")}</Text>
						<Text>
							{datauser && datauser.user_profile && datauser.user_profile.phone
								? datauser.user_profile.phone
								: "Not Set"}
						</Text>
					</View>
				</View>
				<View
					style={{
						backgroundColor: "#FFFFFF",
						margin: 10,
						padding: 20,
						borderRadius: 10,
						shadowColor: "gray",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: arrayShadow.shadowOpacity,
						shadowRadius: arrayShadow.shadowRadius,
						elevation: arrayShadow.elevation,
					}}
				>
					<Text type="bold" size="label" style={{ marginBottom: 10 }}>
						{t("favourites")}
					</Text>
					<Ripple
						onPress={() => props.navigation.navigate("Wishlist")}
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							paddingVertical: 10,
							borderBottomWidth: 0.5,
							borderBottomColor: "#d3d3d3",
						}}
					>
						<Text>{t("wishlist")}</Text>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text type="bold" style={{ marginRight: 10 }}>
								{datauser &&
								datauser.user_profile &&
								datauser.user_profile.count_wishlist
									? datauser.user_profile.count_wishlist + " " + "Wishlist"
									: "No Wishlist"}
							</Text>
							<Next width={15} height={15} />
						</View>
					</Ripple>
					<Ripple
						onPress={() => {
							props.navigation.navigate("ItineraryFavorite");
						}}
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							paddingVertical: 10,
							borderBottomWidth: 0.5,
							borderBottomColor: "#d3d3d3",
						}}
					>
						<Text>{t("itenerariFavorit")}</Text>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text type="bold" style={{ marginRight: 10 }}>
								{datauser &&
								datauser.user_profile &&
								datauser.user_profile.count_itinerary_favorit
									? datauser.user_profile.count_itinerary_favorit +
									  " " +
									  "Itinerary"
									: "No Itinerary"}
							</Text>
							<Next width={15} height={15} />
						</View>
					</Ripple>
				</View>
				<View
					style={{
						flexDirection: "row",
						paddingVertical: 20,
						paddingHorizontal: 20,
					}}
				>
					<Help />
					<Text type="bold" style={{ marginLeft: 5 }}>
						Help
					</Text>
				</View>
				<View
					style={{
						alignItems: "center",
						marginBottom: 10,
					}}
				>
					<Button
						variant="bordered"
						color="secondary"
						text={t("logout")}
						onPress={async () => {
							let pushTkn = await AsyncStorage.getItem("token");
							try {
								let response = await mutationlogout({
									variables: { token: pushTkn },
								});
								if (loading) {
									Alert.alert("Loading!!");
								}
								if (error) {
									throw new Error("Error Input");
								}

								if (response) {
									await AsyncStorage.setItem("access_token", "");
									await LoadUserProfile();
									props.navigation.navigate("SplashScreen");
								}
							} catch (error) {
								Alert.alert("" + error);
								await AsyncStorage.setItem("access_token", "");
								await LoadUserProfile();
								props.navigation.navigate("SplashScreen");
							}
						}}
						style={{
							width: Dimensions.get("window").width - 20,
							marginVertical: 10,
						}}
					></Button>
				</View>
			</ScrollView>
		</View>
	);
}
