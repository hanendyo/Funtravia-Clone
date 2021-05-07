import React from "react";
import { Dimensions, View, Image } from "react-native";
import { OnBoard_2 } from "../../assets/png/index";
import { Xblue } from "../../assets/svg";
import { Text, FunImage, Button } from "../../component/index";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/routers";

export default function OnBoardScreenOne(props) {
	const { t, i18n } = useTranslation();
	let { height, width } = Dimensions.get("screen");
	return (
		<View style={{ backgroundColor: "#000" }}>
			<Image
				style={{
					height: height * 0.92,
					width: width,
					resizeMode: "cover",
					backgroundColor: "#000",
					opacity: 0.25,
				}}
				source={OnBoard_2}
			/>
			<View
				style={{
					position: "absolute",
					alignSelf: "flex-end",
					top: 50,
					right: 25,
					zIndex: 1,
				}}
			>
				<Button
					type="icon"
					position="right"
					size="medium"
					style={{
						flexDirection: "row",
						backgroundColor: "#D1D1D1",
						opacity: 0.45,
					}}
					onPress={() =>
						props.navigation.navigate("AuthStack", { screen: "SplashScreen" })
					}
				>
					<Text
						style={{
							color: "white",
							marginRight: 10,
							justifyContent: "center",
							marginBottom: 1,
						}}
					>{`${t("skip")}`}</Text>
					<Xblue height={20} width={20} />
				</Button>
			</View>
			<View
				style={{
					// flex: 1,
					height: height * 0.91,
					width: width,
					position: "absolute",
					justifyContent: "flex-end",
					borderColor: "#000",
				}}
			>
				<View style={{ paddingHorizontal: 14, width: width }}>
					<Text size="h4" type="bold" style={{ color: "#FFFF" }}>
						{`Travel with\nfriends.	`}
					</Text>
				</View>
				<View
					style={{
						paddingHorizontal: 15,
						width: width,
						marginTop: 10,
					}}
				>
					<Text
						size="label"
						type="regular"
						style={{ color: "#FFFF", lineHeight: 20 }}
					>
						{t("description")}
					</Text>
				</View>
				<View style={{ paddingHorizontal: 15, width: width, marginTop: 20 }}>
					<Button
						style={{
							marginVertical: 10,
						}}
						size="medium"
						color="secondary"
						onPress={() =>
							props.navigation.push("AuthStack", {
								screen: "OnBoardScreenTwo",
							})
						}
						text={t("next")}
					/>
				</View>
				<View
					style={{
						paddingHorizontal: 15,
						width: width,
						marginTop: 20,
						marginBottom: 50,
					}}
				>
					<View
						style={{ flexDirection: "row", justifyContent: "space-around" }}
					>
						<View
							style={{
								borderWidth: 1,
								borderColor: "#FFF",
								width: "32%",
							}}
						/>
						<View
							style={{
								borderWidth: 1,
								borderColor: "#D75995",
								width: "32%",
							}}
						/>
						<View
							style={{
								borderWidth: 1,
								borderColor: "#FFFF",
								width: "32%",
							}}
						/>
					</View>
				</View>
			</View>
		</View>
	);
}
