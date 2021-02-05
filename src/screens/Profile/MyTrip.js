import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
	FlatList,
} from "react-native";
import { CustomImage } from "../../component";

import { default_image } from "../../assets/png";

import { Kosong } from "../../assets/svg";
import { Truncate } from "../../component";
import { dateFormats } from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import { Text } from "../../component";
export default function MyTrip({ props, token, data, position }) {
	const { t, i18n } = useTranslation();

	const getdate = (start, end) => {
		start = start.split(" ");
		end = end.split(" ");

		return dateFormats(start[0]) + " - " + dateFormats(end[0]);
	};

	const RenderBuddy = ({ databuddy }) => {
		return (
			<View
				style={{
					flexDirection: "row",
				}}
			>
				{databuddy.map((value, i) => {
					if (i < 3) {
						return (
							<View key={i}>
								<CustomImage
									source={
										value.user && value.user.picture
											? { uri: value.user.picture }
											: default_image
									}
									customImageStyle={{
										resizeMode: "cover",
										height: 20,
										width: 20,
										borderRadius: 15,
									}}
									customStyle={{
										height: 20,
										width: 20,
										borderRadius: 15,
										marginLeft: -10,
									}}
								/>
							</View>
						);
					}
				})}

				{databuddy.length > 1 ? (
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text
							{...props}
							style={{
								fontFamily: "Lato-Regular",
								fontSize: 12,
								color: "white",
							}}
						>
							{" "}
							{/* {t('with')}{' '} */}
							With{" "}
							<Truncate
								text={
									databuddy[1].user && databuddy[1].user.first_name
										? databuddy[1].user.first_name
										: ""
								}
								length={5}
							/>
							{databuddy.length > 2
								? " + " + (databuddy.length - 2) + " Others"
								: " "}
						</Text>
					</View>
				) : null}
			</View>
		);
	};

	const getDN = (start, end) => {
		var x = start;
		var y = end,
			start = start.split(" ");
		end = end.split(" ");
		var date1 = new Date(start[0]);
		var date2 = new Date(end[0]);
		var Difference_In_Time = date2.getTime() - date1.getTime();
		var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

		return (
			<View style={{ flexDirection: "row" }}>
				<Text
					{...props}
					style={{
						fontFamily: "Lato-Regular",
						color: "white",
					}}
				>
					{Difference_In_Days + 1} days{" "}
				</Text>
				<Text
					{...props}
					style={{
						fontFamily: "Lato-Regular",
						color: "white",
					}}
				>
					{Difference_In_Days} night
				</Text>
			</View>
		);
	};

	return (
		<View
			style={{
				width: Dimensions.get("window").width,
				marginTop: 2,
			}}
		>
			{data && data.length > 0 ? (
				<FlatList
					contentContainerStyle={{
						paddingHorizontal: 5,
						width: Dimensions.get("screen").width,
						paddingBottom: 70,
					}}
					nestedScrollEnabled
					showsVerticalScrollIndicator={false}
					style={{ height: Dimensions.get("screen").height }}
					data={data}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() =>
								props.navigation.push("tripalbum", {
									iditinerary: item.id,
									token: token,
									position: position,
								})
							}
							style={{
								width: (Dimensions.get("screen").width - 15) * 0.5,
								margin: 2,
							}}
						>
							<ImageBackground
								source={item.cover ? { uri: item.cover } : default_image}
								style={[
									{
										borderRadius: 5,
									},
								]}
								imageStyle={[
									{
										borderRadius: 5,
									},
								]}
							>
								<View
									style={{
										backgroundColor: "rgba(0, 0, 0, 0.38)",
										height: Dimensions.get("window").width * 0.25,
										borderRadius: 5,
										padding: 10,
									}}
								>
									<View>
										<Text
											style={{
												fontFamily: "Lato-Bold",
												fontSize: 16,
												color: "white",
											}}
										>
											<Truncate text={item.name} length={17} />
										</Text>
									</View>
									<View
										style={{
											flexDirection: "row",
										}}
									>
										<Text
											{...props}
											style={{
												fontFamily: "Lato-Regular",
												fontSize: 14,
												color: "white",
											}}
										>
											<Truncate
												text={item.city ? item.city.name : ""}
												length={7}
											/>
											,{" "}
										</Text>
										{item.start_date && item.end_date
											? getDN(item.start_date, item.end_date)
											: null}
									</View>
									<View
										style={{
											flexDirection: "row",
											position: "absolute",
											bottom: 10,
											left: 20,
										}}
									>
										{item.buddy.length ? (
											<RenderBuddy databuddy={item.buddy} />
										) : null}
									</View>
								</View>
							</ImageBackground>
						</TouchableOpacity>
					)}
					numColumns={2}
					keyExtractor={(item) => item.id}
				/>
			) : (
				<View
					style={{
						paddingVertical: 40,
						justifyContent: "flex-start",
						alignItems: "center",
						alignContent: "center",
						height: "100%",
					}}
				>
					<Kosong
						height={Dimensions.get("screen").width * 0.6}
						width={Dimensions.get("screen").width}
					/>
					<Text
						{...props}
						style={{
							fontSize: 16,
							fontFamily: "Lato-Bold",
							color: "#646464",
							textAlign: "center",
						}}
					>
						{t("noPlan")}
					</Text>
				</View>
			)}
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
