import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	StyleSheet,
	Alert,
	ImageBackground,
	Dimensions,
	FlatList,
	Text,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { Input, CustomText, CustomImage, Button } from '../../../core-ui';
import { normalize } from '../../../const/PixelRatio';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
	default_image,
	setting_icon,
	profile_hijau,
	search_button,
	back_arrow_white,
	MapIconGrey,
	CalenderGrey,
	Filterabu,
	Menuputih,
} from '../../../const/Png';
import { rupiah } from '../../../const/Rupiah';
import Truncate from '../../../utils/Truncate';
import {
	Plane,
	Ship,
	PlaneHotel,
	RentCar,
	Train,
	HotelIcon,
	Bus,
	More,
	Star,
} from '../../../const/Svg';
import { bali1, bali2, bali3, bali4 } from '../../../const/photo';
import { dateFormat, dateFormatBetween } from '../../../const/dateformatter';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckBox, Row } from 'native-base';
import { SafeAreaView } from 'react-navigation';
const numColumns = 2;

const GetImage_Popular = gql`
	query Beranda_Popular {
		beranda_popular {
			id
			name
			city
			images
		}
		beranda_package {
			id
			name
			duration
			price
			cover_image
		}
	}
`;

const dataCartEx = [
	{
		id: 1111,
		// harga: [
		// 	{
		// 		week_day: 1234,
		// 		week_end: 4321,
		// 	},
		// ],
		harga: 12324,
		name: 'Jakarta Fair Kemayoran',
		tgl_mulai: '2019-04-20',
		tgl_selesai: '2020-11-25',
		images: bali1,
		// images: 'https://fa12.funtravia.com/destination/20200613/5yE4o_d1ab2386-ad6f-450c-922c-632a49298aed',
		location: 'Jakarta',
		type: 'Fair',
	},
	{
		id: 2222,
		harga: 123245,
		name: 'Jember Carnaval 2020-2021',
		tgl_mulai: '2020/08/20',
		tgl_selesai: '2020/08/26',
		images: bali2,
		// images: 'https://fa12.funtravia.com/destination/20200613/5yE4o_d1ab2386-ad6f-450c-922c-632a49298aed',
		location: 'Bandung',
		type: 'Festival',
	},
	{
		id: 33333,
		harga: 123242,
		name: 'Jember Carnaval 2020',
		tgl_mulai: '2020-08-20',
		tgl_selesai: '2020-08-27',
		images: bali3,
		// images: 'https://fa12.funtravia.com/destination/20200613/5yE4o_d1ab2386-ad6f-450c-922c-632a49298aed',
		location: 'Bandung',
		type: 'Music',
		// organizer:[
		// 	{
		// 		id : 1,
		// 		name : 'Pemprov',
		// 		icon : '',
		// 	},
		// ],
		// gatesopen : [
		// 	{
		// 		week_day: '10:20',
		// 		week_end: '08:30',
		// 	},
		// ],
	},
	{
		id: 4444,
		harga: 123244,
		name: 'Jember Carnaval 2020',
		tgl_mulai: '2020/08/20',
		tgl_selesai: '2020/08/26',
		images: bali4,
		// images: 'https://fa12.funtravia.com/destination/20200613/5yE4o_d1ab2386-ad6f-450c-922c-632a49298aed',
		location: 'Surabaya',
		type: 'Festival',
	},
	{
		id: 5555,
		harga: 123234,
		name: 'Jember Carnaval 2020',
		tgl_mulai: '2020/08/20',
		tgl_selesai: '2020/08/26',
		images: bali1,
		// images: 'https://fa12.funtravia.com/destination/20200613/5yE4o_d1ab2386-ad6f-450c-922c-632a49298aed',
		location: 'Semarang',
		type: 'Festival',
	},
	{
		id: 6666,
		harga: 123242,
		name: 'Jember Carnaval 2020',
		tgl_mulai: '2020/08/20',
		tgl_selesai: '2020/08/26',
		images: bali2,
		// images: 'https://fa12.funtravia.com/destination/20200613/5yE4o_d1ab2386-ad6f-450c-922c-632a49298aed',
		location: 'Jakarta',
		type: 'Festival',
	},
	{
		id: 7777,
		harga: 123204,
		name: 'Jember Carnaval 2020',
		tgl_mulai: '2020/08/20',
		tgl_selesai: '2020/08/26',
		images: bali3,
		// images: 'https://fa12.funtravia.com/destination/20200613/5yE4o_d1ab2386-ad6f-450c-922c-632a49298aed',
		location: 'Jakarta',
		type: 'Festival',
	},
];

export default function EventExamp(props) {
	let [token, setToken] = useState('');
	let [selected] = useState(new Map());
	let [dataCart, setDataCart] = useState(dataCartEx);
	const eventdetail = useCallback(
		(id, name) => {
			// let newSelected = new Map(selected);
			// newSelected.set(id, !selected.get(id));
			// setSelected(newSelected);
			props.navigation.navigate('eventdetail', {
				id: id,
				name: name,
			});
		},
		[selected],
	);
	// const eventdetail = () => {
	// 	props.navigation.navigate('eventdetail');
	// };
	const onSelect = useCallback(
		(id, name) => {
			// let newSelected = new Map(selected);
			// newSelected.set(id, !selected.get(id));
			// setSelected(newSelected);
			props.navigation.navigate('detailStack', {
				id: id,
				name: name,
			});
		},
		[selected],
	);
	const _FormatData = (dataCart, numColumns) => {
		const totalRows = Math.floor(dataCart.length / numColumns);
		let totallastRow = dataCart.length - totalRows * numColumns;

		while (totallastRow !== 0 && totallastRow !== numColumns) {
			dataCart.push({ id: 'blank', empty: true });
			totallastRow++;
		}
		return dataCart;
	};

	const _renderItem = ({ item, index }) => {
		if (item.empty) {
			return (
				<View
					style={{
						justifyContent: 'center',
						flex: 1,
						// width: normalize(110),
						width: Dimensions.get('window').width * 0.5 - normalize(16),
						height: Dimensions.get('window').width * 0.65,

						// width: normalize(200),
						// margin: normalize(8),
						// backgroundColor: 'transparent',
					}}></View>
			);
		}
		return (
			<TouchableOpacity
				onPress={() => eventdetail(item.id, item.name)}
				style={{
					justifyContent: 'center',
					flex: 1,
					// width: normalize(110),
					// height: normalize(310),

					width: Dimensions.get('screen').width * 0.5 - normalize(16),
					height: Dimensions.get('screen').width * 0.75,
					// width: normalize(200),
					margin: normalize(6),
					// marginTop: normalize(12),
					// marginBottom : normalize(5),
					borderWidth: normalize(1),
					flexDirection: 'column',
					backgroundColor: 'yellow',
					borderRadius: 5,
					overflow: 'hidden',
					// borderWidth: 2,
					borderColor: 'gray',
					shadowColor: 'gray',
					shadowOffset: { width: 2, height: 2 },
					shadowOpacity: 1,
					shadowRadius: 3,
					elevation: 3,
				}}>
				<View
					style={{
						height: Dimensions.get('window').width * 0.43,

						// width: normalize(100),
						// flex:1,
					}}>
					<ImageBackground
						key={item.id}
						// source= {{uri : item.images.toString()}}
						source={item.images}
						style={[
							styles.ImageView,
							// {
							// 	width: normalize(90),
							// 	height: normalize(90),
							// },
						]}
						imageStyle={[
							styles.Image,
							// {
							// 	width: normalize(90),
							// 	height: normalize(90),
							// },
						]}></ImageBackground>
					<View style={[styles.eventtype]}>
						<Text
							style={{
								fontFamily: 'lato-reg',
								color: '#6C6C6C',
								textAlign: 'center',
								fontSize: normalize(11),
							}}>
							{item.type}
						</Text>
					</View>
					<LinearGradient
						colors={['#209FAE', 'rgba(0, 0, 0, 0)']}
						start={{ x: 0.8, y: 1 }}
						end={{ x: 0, y: 1 }}
						style={{
							position: 'absolute',
							// top : normalize(150),
							bottom: normalize(11),
							right: normalize(0),
							height: normalize(28),
							// width: normalize(150),
							width:
								Dimensions.get('window').width * 0.5 -
								normalize(24) -
								normalize(32),
							justifyContent: 'center',
						}}>
						<Text
							style={{
								fontFamily: 'lato-bold',
								color: 'white',
								textAlign: 'right',
								marginRight: normalize(10),
								fontSize: normalize(16),
							}}>
							{item.harga ? `IDR ${rupiah(item.harga)}` : null}
						</Text>
					</LinearGradient>
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'space-between',
						height: normalize(230),
						// marginBottom : normalize(5),
						// marginTop	: normalize(5),
						marginVertical: normalize(5),
						marginHorizontal: normalize(10),
						// borderWidth : 1,
						// borderColor: 'grey',
					}}>
					<Text
						style={{
							fontFamily: 'lato-bold',
							color: '#6C6C6C',
							fontSize: normalize(16),
							// marginBottom: normalize(5),
						}}>
						<Truncate text={item.name} length={30} />
					</Text>
					<View
						style={{
							height: '60%',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							// borderWidth : 1,
							// borderColor: 'grey',
						}}>
						<View
							style={{
								// flex: 1,
								flexDirection: 'row',
								width: '100%',
								marginBottom: normalize(3),
							}}>
							<CustomImage
								customStyle={{
									width: normalize(15),
									height: normalize(15),
									// marginTop: normalize(2),
									// marginLeft: normalize(3),
									marginRight: normalize(5),
								}}
								customImageStyle={{
									width: 15,
									height: 15,
									resizeMode: 'contain',
								}}
								source={CalenderGrey}
							/>
							<CustomText
								style={{
									fontFamily: 'lato-reg',
									color: '#6C6C6C',
									fontSize: normalize(11),
									paddingRight: normalize(20),
									width: '100%',
								}}>
								{dateFormatBetween(item.tgl_mulai, item.tgl_selesai)}
							</CustomText>
						</View>

						<View
							style={{
								// flex: 1,
								flexDirection: 'row',
								width: '100%',
								borderColor: 'grey',
								// marginBottom: normalize(5),
							}}>
							<CustomImage
								customStyle={{
									width: normalize(15),
									height: normalize(15),
									// marginTop: normalize(2),
									// marginLeft: normalize(3),
									marginRight: normalize(5),
								}}
								customImageStyle={{
									width: 15,
									height: 15,
									resizeMode: 'contain',
								}}
								source={MapIconGrey}
							/>
							<CustomText
								style={{
									fontFamily: 'lato-reg',
									color: '#6C6C6C',
									fontSize: normalize(11),
									width: '100%',
								}}>
								{item.location}
							</CustomText>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem('access_token');
		setToken(tkn);
		// console.log(tkn);
	};

	useEffect(() => {
		loadAsync();
	}, []);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				flexDirection: 'row',
				// marginBottom: normalize(7),
			}}>
			{/* ======================= Bagian tengah (list) ================================ */}

			<FlatList
				contentContainerStyle={{
					// marginTop: normalize(7),
					marginBottom: normalize(15),
					justifyContent: 'space-evenly',
					paddingVertical: normalize(8),
					paddingHorizontal: normalize(4),
					// flex: 1,
					// flexDirection: 'row',
				}}
				horizontal={false}
				data={_FormatData(dataCart, numColumns)}
				renderItem={_renderItem}
				// renderItem={({ item }) => (
				// 	<RenderEvent
				// 		id={item.id}
				// 		harga = {item.harga}
				// 		name = {item.name}
				// 		tgl_mulai = {item.tgl_mulai}
				// 		tgl_selesai = {item.tgl_selesai}
				// 		images = {item.images}
				// 		localtion = {item.location}
				// 		type={item.type}

				// 		onSelect={onSelect}
				// 		selected={!!selected.get(item.id)}
				// 	/>
				// )}
				numColumns={numColumns}
				keyExtractor={(item, index) => index.toString()}
				showsVerticalScrollIndicator={false}
				extraData={selected}
			/>
		</SafeAreaView>
	);
}

EventExamp.navigationOptions = ({ navigation }) => ({
	headerTitle: 'Event List',
	headerMode: 'screen',
	headerStyle: {
		backgroundColor: '#209FAE',
		elevation: 0,
		borderBottomWidth: 0,
		fontSize: 50,
		// justifyContent: 'center',
		// flex:1,
	},
	headerTitleStyle: {
		fontFamily: 'lato-reg',
		fontSize: 14,
		color: 'white',
		alignSelf: 'center',
	},
	headerLeft: () =>
		CustomImage({
			customStyle: { width: normalize(20), height: normalize(20) },
			customImageStyle: { width: 20, height: 20, resizeMode: 'contain' },
			isTouchable: true,
			onPress: () => navigation.goBack(),
			source: back_arrow_white,
		}),
	headerLeftContainerStyle: {
		paddingLeft: normalize(20),
	},
	headerRight: (
		<View
			style={{
				flex: 1,
				flexDirection: 'row',
			}}>
			<CustomImage
				customStyle={{
					width: normalize(20),
					height: normalize(20),
					marginHorizontal: normalize(10),
				}}
				customImageStyle={{ width: 20, height: 20, resizeMode: 'contain' }}
				isTouchable={true}
				// onPress={() => props.navigation.navigate('Home')}
				source={Filterabu}
			/>
			<CustomImage
				customStyle={{
					width: normalize(20),
					height: normalize(20),
					marginHorizontal: normalize(10),
				}}
				customImageStyle={{ width: 20, height: 20, resizeMode: 'contain' }}
				isTouchable={true}
				// onPress={() => props.navigation.navigate('Home')}
				source={Menuputih}
			/>
		</View>
	),
	headerRightStyle: {
		paddingRight: normalize(20),
	},
});

const styles = StyleSheet.create({
	main: {
		flex: 1,
		flexDirection: 'row',
		// marginTop: 20,
		// paddingTop: normalize(50),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFF',
	},
	ImageView: {
		// flex:1,
		// width: Dimensions.get('window').width - (Dimensions.get('window').width * 0.62),
		// height: normalize(187),
		height: Dimensions.get('window').width * 0.43,
		// marginRight: normalize(5),
		// marginLeft: normalize(5),
		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
		overflow: 'hidden',

		// borderBottomStartRadius: 0,
		backgroundColor: 'rgba(20,20,20,0.4)',
		// opacity: 0.4,
		// elevation: 1,
	},
	Image: {
		resizeMode: 'cover',
		height: Dimensions.get('window').width * 0.43,
		// height: normalize(187),
		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
		overflow: 'hidden',
		// borderBottomStartRadius: 0,
	},
	eventtype: {
		position: 'absolute',
		top: normalize(21),
		// bottom: normalize(9),
		left: normalize(10),
		height: normalize(21),
		width: normalize(70),
		borderRadius: normalize(11),
		justifyContent: 'center',
		backgroundColor: 'rgba(226, 236, 248, 0.85)',
	},
});
