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
import { Text } from "../../component";
import { default_image } from "../../assets/png";

const defaultImage =
	"https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909";
export default function PopularDestination({ props }) {
	let [selected] = useState(new Map());
	const { data, loading, error } = useQuery(BerandaPopuler);
	const onSelect = (item) => {
		props.navigation.navigate("CityDetail", {
			data: {
				city_id: item.id,
				city_name: item.name,
				latitude: null,
				longitude: null,
			},
			exParam: true,
		});
	};

	const RenderDesImg = ({ item }) => {
		return (
			<TouchableOpacity key={item.id} onPress={() => onSelect(item)}>
				<ImageBackground
					key={item.id}
					source={
						item && item.image && item.image.image
							? { uri: item.image.image }
							: { uri: defaultImage }
					}
					style={{
						width: (Dimensions.get("screen").width - 37) / 3,
						height: (Dimensions.get("screen").width - 37) / 3,
						marginHorizontal: 2,
						borderRadius: 10,
					}}
					imageStyle={styles.destinationImage}
				>
					<View
						style={[
							styles.destinationImageView,
							{
								flexDirection: "row",
								alignItems: "center",
								alignContent: "center",
								justifyContent: "center",
								flexWrap: "wrap",
							},
						]}
					>
						<Text
							size="label"
							type="black"
							style={{
								flex: 0.75,
								flexWrap: "wrap",
								textAlign: "center",
								color: "#ffff",
								letterSpacing: 0.5,
								textShadowOffset: { width: 1, height: 3 },
								textShadowRadius: 8.3,
								textShadowColor: "#000",
								elevation: 13,
							}}
						>
							{item.name}
						</Text>
					</View>
				</ImageBackground>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView>
			<View style={{ marginHorizontal: 20 }}>
				{/* <View
					style={{
						flex: 1,
						alignItems: 'center',
						marginTop: 30,
					}}>
					<Text
					type='bold'
					size='label'
					style={{
						alignSelf: 'flex-start',
					}}>
					{t('popularCityDestination')}
					</Text>
				</View> */}
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					{/* <Text type='regular' size='description'>
						{t('popularTourism')}
						</Text>
						<Text
						onPress={() => props.navigation.navigate('AllDestination')}
						type='regular'
						size='description'
						style={{ color: '#209FAE' }}>
						{t('viewAll')}
					</Text> */}
				</View>
			</View>
			<TouchableOpacity
				style={{
					width: Dimensions.get("screen").width,
					marginTop: 10,
					height: 150,
					paddingHorizontal: 20,
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
						width: Dimensions.get("screen").width - 35,
						height: Dimensions.get("screen").width - 35,
					}}
					imageStyle={[styles.destinationMainImage, { height: 150 }]}
				>
					<View
						style={[
							styles.destinationMainImageContainer,
							{
								height: 150,
								flexDirection: "row",
								alignItems: "center",
								alignContent: "center",
								justifyContent: "center",
								flexWrap: "wrap",
							},
						]}
					>
						<Text
							size="title"
							type="black"
							style={{
								zIndex: 2,
								color: "#fff",
								textShadowOffset: { width: 1, height: 3 },
								textShadowRadius: 8.3,
								textShadowColor: "#000",
								elevation: 13,
							}}
						>
							{data && data.beranda_popularV2[0]
								? data.beranda_popularV2[0].name
								: "BEAUTIFUL VIEW"}
						</Text>
					</View>
				</ImageBackground>
			</TouchableOpacity>
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
		borderRadius: 10,
	},
	destinationMainImage: {
		resizeMode: "cover",
		borderRadius: 10,
		backgroundColor: "black",
	},
	destinationImageView: {
		width: (Dimensions.get("screen").width - 37) / 3,
		height: (Dimensions.get("screen").width - 37) / 3,
		marginRight: 5,
		borderRadius: 10,
	},
	destinationImage: {
		resizeMode: "cover",
		borderRadius: 10,
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
