import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	FlatList,
	Image,
} from "react-native";
import { default_image } from "../../assets/png";
import User_Post from "../../graphQL/Query/Profile/post";
import { Kosong } from "../../assets/svg";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";

export default function Post({ navigation, token, datauser }) {
	console.log("this token", token);
	const { width, height } = Dimensions.get("screen");
	const { t } = useTranslation();
	const { data, loading, error, refetch } = useQuery(User_Post, {
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});

	if (loading) {
		console.log("loading");
	}

	if (error) {
		console.log("Error", error);
	}

	if (data) {
		let rData = data.user_post;
		return (
			<View>
				<FlatList
					nestedScrollEnabled
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.id}
					numColumns={3}
					data={rData}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							onPress={() =>
								navigation.push("myfeed", {
									token: token,
									data: item,
									index: index,
									datauser: datauser,
								})
							}
						>
							<Image
								style={{
									margin: 2,
									width: width * 0.322,
									height: width * 0.322,
								}}
								source={
									item.assets ? { uri: item.assets[0].filepath } : default_image
								}
							></Image>
						</TouchableOpacity>
					)}
				/>
			</View>
		);
	}

	return (
		<View
			style={{
				width: width,
				marginTop: 2,
			}}
		>
			<View
				style={{
					paddingVertical: 40,
					justifyContent: "flex-start",
					alignItems: "center",
					alignContent: "center",
					height: "100%",
				}}
			>
				<Kosong height={width * 0.6} width={width} />
				<Text
					style={{
						fontSize: 16,
						fontFamily: "Lato-Bold",
						color: "#646464",
						textAlign: "center",
					}}
				>
					{t("noPost")}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
	},
	modalScroll: {
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
		flexDirection: "row",
		alignItems: "center",
		alignContent: "center",
		alignSelf: "center",
		justifyContent: "center",
		backgroundColor: "black",
	},
	fab: {
		position: "absolute",
		bottom: 5,
		right: 10,
	},
});
