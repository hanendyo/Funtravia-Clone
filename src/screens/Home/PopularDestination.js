import React, { useState, useEffect } from "react";
import {
	View,
	ImageBackground,
	Dimensions,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
} from "react-native";
import BerandaPopuler from "../../graphQL/Query/Home/BerandaPopuler";
import { useQuery } from "@apollo/react-hooks";
import { Capital, Text, Truncate } from "../../component";
import { default_image } from "../../assets/png";
import LinearGradient from "react-native-linear-gradient";

const defaultImage =
	"https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909";

const { width, height } = Dimensions.get("screen");
export default function PopularDestination({ props }) {
	let [selected] = useState(new Map());
	const { data, loading, error } = useQuery(BerandaPopuler);
	const onSelect = (item) => {
		props.navigation.navigate("CountryStack", {
			screen: "CityDetail",
			params: {
				data: {
					city_id: item.id,
					city_name: item.name,
					latitude: null,
					longitude: null,
				},
				exParam: true,
			},
		});
	};

	const RenderDesImg = ({ item }) => {
		return (
			<TouchableOpacity
				key={item.id}
				onPress={() => onSelect(item)}
				style={{
					shadowColor: "#464646",
					shadowOffset: { width: 0.5, height: 0.5 },
					shadowRadius: 0.5,
					shadowOpacity: 0.5,
					elevation: 2,
				}}
			>
				<ImageBackground
					key={item.id}
					source={
						item && item.image && item.image.image
							? { uri: item.image.image }
							: { uri: defaultImage }
					}
					style={{
						width: (width - 50) / 3,
						height: (width - 50) / 3,
						marginHorizontal: 3,
						borderRadius: 5,
						justifyContent: "flex-end",
					}}
					imageStyle={styles.destinationImage}
				>
					<LinearGradient
						colors={["rgba(0, 0, 0, 0.75)", "rgba(0, 0, 0, 0)"]}
						start={{ x: 0, y: 1 }}
						end={{ x: 0, y: 0 }}
						style={{
							height: "50%",
							width: "100%",
							alignItems: "flex-start",
							alignContent: "flex-start",
							justifyContent: "flex-end",
							borderRadius: 5,
							paddingHorizontal: 10,
							paddingVertical: 15,
						}}
					>
						<Text
							size="label"
							type="black"
							style={{
								// flex: 0.75,
								// flexWrap: "wrap",
								// textAlign: "center",
								color: "#ffff",
								letterSpacing: 0.5,
							}}
						>
							{Capital({ text: item.name })}
						</Text>
					</LinearGradient>
				</ImageBackground>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView>
			{data && data.beranda_popularV2.length ? (
				<TouchableOpacity
					style={{
						width: width,
						marginTop: 10,
						// height: 150,
						paddingHorizontal: 20,
						shadowColor: "#464646",
						shadowOffset: { width: 0.5, height: 0.5 },
						shadowRadius: 0.5,
						shadowOpacity: 0.5,
						elevation: 2,
					}}
					onPress={() =>
						onSelect(
							data && data.beranda_popularV2 ? data.beranda_popularV2[0] : null
						)
					}
				>
					<ImageBackground
						source={
							data &&
							data.beranda_popularV2[0] &&
							data.beranda_popularV2[0].image?.image
								? { uri: data.beranda_popularV2[0].image?.image }
								: default_image
						}
						style={{
							width: width - 40,
							height: 134,
							justifyContent: "flex-end",
						}}
						imageStyle={[styles.destinationMainImage, { height: 134 }]}
					>
						<LinearGradient
							colors={["rgba(0, 0, 0, 0.75)", "rgba(0, 0, 0, 0)"]}
							start={{ x: 0, y: 1 }}
							end={{ x: 0, y: 0 }}
							style={{
								height: "50%",
								width: "100%",
								alignItems: "flex-start",
								alignContent: "flex-start",
								justifyContent: "flex-end",
								borderRadius: 5,
								paddingHorizontal: 10,
								paddingVertical: 15,
							}}
						>
							<Text
								size="title"
								type="black"
								style={{
									zIndex: 2,
									color: "#fff",
								}}
							>
								{data && data.beranda_popularV2[0]
									? Capital({ text: data.beranda_popularV2[0].name })
									: ""}
							</Text>
						</LinearGradient>
					</ImageBackground>
				</TouchableOpacity>
			) : null}
			{data && data.beranda_popularV2.length ? (
				<FlatList
					contentContainerStyle={{
						marginTop: 5,
						justifyContent: "space-evenly",
						paddingStart: 18,
						paddingEnd: 18,
					}}
					horizontal={true}
					data={data.beranda_popularV2}
					renderItem={({ item, index }) =>
						index !== 0 ? <RenderDesImg key={index} item={item} /> : null
					}
					keyExtractor={(item) => item.id}
					showsHorizontalScrollIndicator={false}
					extraData={selected}
				/>
			) : null}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	destinationMainImageContainer: {
		width: "100%",
		height: 150,
		borderRadius: 5,
	},
	destinationMainImage: {
		resizeMode: "cover",
		borderRadius: 5,
		backgroundColor: "black",
	},
	destinationImageView: {
		width: (width - 37) / 3,
		height: (width - 37) / 3,
		marginRight: 5,
		borderRadius: 5,
	},
	destinationImage: {
		resizeMode: "cover",
		borderRadius: 5,
	},
});

const destinationImageView = [
	{
		id: "1234",
		name: " TEBING BALI CLIFF",
		location: "Bali Cliff",
		images: defaultImage,
	},
	{
		id: "5678",
		name: "VILLA BALI CLIFF ",
		location: "Bali Cliff",
		images: defaultImage,
	},
	{ id: "9101", name: "BALI RESORT", city: "Bali Cliff", images: defaultImage },
	{ id: "1213", name: "GREEN BROWN", city: "Ungasan", images: defaultImage },
];
