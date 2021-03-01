import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	TextInput,
	SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, CustomImage, Text, Truncate } from "../../../component";
import { default_image } from "../../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { Loading } from "../../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite, SharePutih } from "../../../assets/svg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import Ripple from "react-native-material-ripple";
import LinearGradient from "react-native-linear-gradient";

export default function ArticelDetail(props) {
	const HeaderComponent = {
		headerShown: true,
		title: "Travel Goal",
		headerTransparent: false,
		headerTintColor: "white",
		headerTitle: "Travel Goal",
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
				onPress={() => props.navigation.goBack()}
				style={{
					height: 55,
				}}
			>
				<Arrowbackwhite height={20} width={20}></Arrowbackwhite>
			</Button>
		),
	};
	const { t, i18n } = useTranslation();

	useEffect(() => {
		props.navigation.setOptions(HeaderComponent);
	}, []);

	let data = [{}, {}, {}];

	return (
		<ScrollView
			contentContainerStyle={{
				backgroundColor: "#f6f6f6",
			}}
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			style={{
				flex: 1,
				// backgroundColor: "#fff",
				// padding: 20,
			}}
		>
			<ImageBackground
				source={default_image}
				style={{
					width: "100%",
					height: Dimensions.get("screen").height * 0.4,
					justifyContent: "flex-end",
				}}
				imageStyle={{
					width: "100%",
					height: Dimensions.get("screen").height * 0.4,
				}}
			>
				<LinearGradient
					colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0)"]}
					start={{ x: 0, y: 1 }}
					end={{ x: 0, y: 0 }}
					style={{
						height: "50%",
						width: "100%",

						padding: 20,
						justifyContent: "flex-end",
						alignContent: "flex-start",
						alignItems: "flex-start",
						// backgroundColor: "rgba(0,0,0,0.2)",
						// borderRadius: 5,
						paddingBottom: 40,
					}}
					onPress={() => {
						props.navigation.navigate("ArticelDetail");
					}}
				>
					<View
						style={{
							backgroundColor: "#E2ECF8",
							paddingHorizontal: 10,
							paddingVertical: 3,
							borderRadius: 20,
							marginVertical: 10,
							// borderWidth: 1,
						}}
					>
						<Text size="small" style={{ color: "#209fae" }}>
							Tips & Trick
						</Text>
					</View>
					<Text type={"bold"} size="description" style={{ color: "white" }}>
						Hiking Beginners Guide
					</Text>
					<Text size="small" style={{ color: "white" }}>
						<Truncate
							text="we are going to show you how beautiful this world we are going to
              show you how beautiful this world show you how beautiful this world"
							length={120}
						/>
					</Text>
					<View
						style={{
							flexDirection: "row",
							alignContent: "center",
							alignItems: "center",
						}}
					>
						<Text type="light" size="small" style={{ color: "white" }}>
							Source :{" "}
						</Text>

						<Text
							type="light"
							size="small"
							style={{ color: "white", fontStyle: "italic" }}
						>
							http://id.pinterest.com/
						</Text>
					</View>
					<Text
						size="small"
						type="light"
						style={{ fontStyle: "italic", color: "#fff" }}
					>
						12 min read
					</Text>
				</LinearGradient>
			</ImageBackground>

			<View
				style={{
					width: "100%",
					height: 50,
					alignContent: "center",
					alignContent: "center",
				}}
			>
				<Button
					type="circle"
					color="secondary"
					style={{
						position: "absolute",
						top: -20,
						width: Dimensions.get("screen").width / 2.5,
						zIndex: 20,
						alignSelf: "center",
						flexDirection: "row",
					}}
				>
					<SharePutih height={20} width={20} />
					<Text style={{ color: "#fff", marginLeft: 10 }}>Share</Text>
				</Button>
			</View>
			{/* detail */}
			{data.map(({ item, index }) => {
				return (
					<View
						style={{ paddingHorizontal: 20, width: "100%", marginBottom: 20 }}
					>
						<Text size="label" type="bold" style={{ marginBottom: 10 }}>
							1. Pulau Sipora, Sumatera Barat
						</Text>
						<Image
							source={default_image}
							style={{
								width: "100%",
								height: Dimensions.get("screen").width / 2,
								borderRadius: 5,
								marginBottom: 10,
							}}
						></Image>
						<View
							style={{
								flexDirection: "row",
								alignContent: "center",
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text type="light" size="small" style={{}}>
								Source :{" "}
							</Text>

							<Text type="light" size="small" style={{ fontStyle: "italic" }}>
								http://id.pinterest.com/
							</Text>
						</View>
						<Text style={{ textAlign: "justify" }}>
							Test kata kata dengan lembut kata kata dengan lembut kata kata
							dengan lembut kata kata dengan lembut kata kata dengan lembut kata
							kata dengan lembut kata kata dengan lembut kata kata dengan lembut{" "}
						</Text>
					</View>
				);
			})}

			{/* more related */}
			<View style={{ paddingHorizontal: 20 }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						alignContent: "center",
						justifyContent: "space-between",
						marginBottom: 10,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							alignContent: "center",
						}}
					>
						<View
							style={{
								height: 20,
								marginRight: 5,
								width: 7,
								backgroundColor: "#209fae",
								borderRadius: 5,
							}}
						></View>
						<Text type="bold" size="title">
							{t("More Related Articles")}
						</Text>
					</View>
					<View></View>
				</View>

				{data.map(({ item, index }) => {
					return (
						<Ripple
							onPress={() => {
								props.navigation.push("ArticelDetail");
							}}
							style={{
								shadowOpacity: 0.5,
								shadowColor: "#d3d3d3",
								elevation: 3,
								flexDirection: "row",
								width: "100%",
								backgroundColor: "#fff",
								borderRadius: 5,
								justifyContent: "flex-start",
								padding: 10,
								marginVertical: 5,
							}}
						>
							<Image
								source={default_image}
								style={{
									height: (Dimensions.get("screen").width - 60) * 0.25,
									width: (Dimensions.get("screen").width - 60) * 0.25,
									borderRadius: 5,
								}}
							></Image>
							<View
								style={{
									paddingLeft: 10,
									width: (Dimensions.get("screen").width - 60) * 0.75,
									// borderWidth: 1,
								}}
							>
								<View
									style={{
										flexDirection: "row",
										width: "100%",
										justifyContent: "space-between",
									}}
								>
									<Text size="small">Island</Text>
									<Text size="small">12 month ago</Text>
								</View>
								<Text size="small" type="bold">
									Sunset in Bali
								</Text>
								<Text size="small">
									<Truncate
										text="we are going to show you how beautiful this world we are going to
              show you how beautiful this world"
										length={60}
									/>
								</Text>
								<Text size="small" type="light" style={{ fontStyle: "italic" }}>
									12 min read
								</Text>
							</View>
						</Ripple>
					);
				})}

				<View
					style={{
						width: "100%",
						paddingVertical: 10,
						alignContent: "center",
						alignContent: "center",
					}}
				>
					<Button
						type="box"
						color="primary"
						variant="bordered"
						text="Explore More"
						style={{
							width: Dimensions.get("screen").width / 2.5,
							alignSelf: "center",
							flexDirection: "row",
						}}
					></Button>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({});
