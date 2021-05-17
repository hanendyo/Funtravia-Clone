import React, { useState } from "react";
import { Dimensions, View, Image } from "react-native";
import { OnBoard_2 } from "../../assets/png/index";
import { Arrowbackwhite, Xblue } from "../../assets/svg";
import { Text, FunImage, Button } from "../../component/index";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/routers";
import Modal from "react-native-modal";
import ScreenTwo from "./OnBoardScreenTwo";

export default function OnBoardScreenOne({ props, modals, setModalScreenOne }) {
	console.log("props", props);
	const { t, i18n } = useTranslation();
	let { height, width } = Dimensions.get("screen");
	let [modalScreenTwo, setModalScreenTwo] = useState(false);

	const lewat = async () => {
		await props.navigation.navigate("AuthStack", {
			screen: "SplashScreen",
		}),
			await setModalScreenOne(false);
	};
	const lewati = async () => {
		await setModalScreenTwo(true);
	};

	return (
		<Modal
			// onRequestClose={() => {
			// 	setModalScreenOne(false);
			// }}
			animationIn="slideInRight"
			animationOut="slideOutRight"
			isVisible={modals}
			style={{
				justifyContent: "flex-end",
				alignItems: "center",
				alignSelf: "center",
				alignContent: "center",
			}}
		>
			<View
				style={{
					flex: 1,
					width: Dimensions.get("screen").width,
					height: Dimensions.get("screen").height,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignSelf: "flex-start",
						alignItems: "center",
						alignContent: "center",
						backgroundColor: "#000",
						height: height,
						width: Dimensions.get("screen").width,
						marginTop: Platform.OS === "ios" ? 0 : -20,
					}}
				>
					<Image
						style={{
							height: height,
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
							onPress={() => lewat()}
							// onPress={
							// 	(() =>
							// 		props.navigation.navigate("AuthStack", {
							// 			screen: "SplashScreen",
							// 		}),
							// 	setModalScreenOne(false))
							// }
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
						<View
							style={{ paddingHorizontal: 15, width: width, marginTop: 20 }}
						>
							<Button
								style={{
									marginVertical: 10,
								}}
								size="medium"
								color="secondary"
								onPress={() => lewati()}
								text={t("next")}
							/>
						</View>
						<View
							style={{
								paddingHorizontal: 15,
								width: width,
								marginTop: 20,
								marginBottom: 90,
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
										borderColor: "#FFF",
										width: "32%",
									}}
								/>
							</View>
						</View>
					</View>
				</View>
			</View>
			<ScreenTwo
				modals={modalScreenTwo}
				setModalScreenTwo={() => setModalScreenTwo()}
				setModalScreenOne={() => setModalScreenOne()}
				props={props}
			/>
		</Modal>
	);
}
