import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TextInput,
	FlatList,
	Alert,
} from 'react-native';
import { CustomImage } from '../../../core-ui';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
	bali1,
	bali2,
	bali3,
	bali4,
	avanza,
	xenia,
	motor,
} from '../../../const/photo';
import {
	Group,
	card_travel,
	Love,
	Ticket,
	MapIconGrey,
	MapIconWhite,
	Foto,
	star_yellow,
	star_grey,
	love_merah,
	foto_putih,
	comedi_putih,
	default_image,
} from '../../../const/Png';
import { rupiah } from '../../../const/Rupiah';

import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Right } from 'native-base';
import { MapSVG, Star, LikeRed, LikeEmpty } from '../../../const/Svg';
import unliked from '../../../graphQL/Mutation/unliked';
import { Text, Button } from '../../../Component';
import { useTranslation } from 'react-i18next';
export default function Transportation({
	props,
	transData,
	token,
	refreshing,
	Refresh,
}) {
	const { t, i18n } = useTranslation();

	// let [token, setToken] = useState('');
	let [dataTrans, setTrans] = useState(transData);

	console.log(dataTrans);

	const [
		mutationUnliked,
		{ loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
	] = useMutation(unliked, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const _unliked = async (id) => {
		if (token || token !== '') {
			try {
				let response = await mutationUnliked({
					variables: {
						id: id,
						type: 'transportation',
					},
				});
				if (loadingUnLike) {
					Alert.alert('Loading!!');
				}
				if (errorUnLike) {
					throw new Error('Error Input');
				}

				// console.log(response.data.unset_wishlist.code);
				if (response.data) {
					if (
						response.data.unset_wishlist.code === 200 ||
						response.data.unset_wishlist.code === '200'
					) {
						// _Refresh();
						var tempData = [...dataTrans];
						var index = tempData.findIndex((k) => k['id'] === id);
						tempData.splice(index, 1);
						setTrans(tempData);
					} else {
						throw new Error(response.data.unset_wishlist.message);
					}
				}
			} catch (error) {
				Alert.alert('' + error);
			}
		} else {
			Alert.alert('Please Login');
		}
	};

	const RenderTrans = ({ data }) => {
		return (
			<View>
				<View
					style={{
						// width: (110),

						marginTop: 5,
						marginBottom: 5,
						flex: 1,
						borderRadius: 5,
						backgroundColor: 'white',
						borderColor: 'gray',
						shadowColor: 'gray',
						shadowOffset: { width: 2, height: 2 },
						shadowOpacity: 1,
						shadowRadius: 3,
						elevation: 3,
						paddingVertical: 10,
						flexDirection: 'row',
						width: Dimensions.get('window').width - 20,
						minHeight: 100,
					}}>
					<TouchableOpacity
						onPress={() =>
							props.navigation.navigate('CarDetail', {
								datacar: data,
								data_iten: [],
							})
						}
						style={{
							width: Dimensions.get('window').width * 0.4,
							alignItems: 'center',
							justifyContent: 'center',
							height: '100%',
							// marginBottom: (10),
						}}>
						<ImageBackground
							key={data.id}
							source={data.cover ? { uri: data.cover } : default_image}
							style={[
								styles.ImageView,
								{
									width: Dimensions.get('window').width * 0.25,
									height: Dimensions.get('window').width * 0.25,
									// height: (110),
								},
							]}
							imageStyle={[
								styles.Image,
								{
									width: Dimensions.get('window').width * 0.25,
									height: Dimensions.get('window').width * 0.25,
									// height: (110),
								},
							]}></ImageBackground>
					</TouchableOpacity>
					<View
						style={{
							// zIndex: 99,
							width: Dimensions.get('window').width * 0.5,
							height: '100%',
							justifyContent: 'space-between',
							// height: (100),
						}}>
						<View
							style={{
								width: Dimensions.get('window').width * 0.5,
								flexDirection: 'row',
							}}>
							<View>
								<TouchableOpacity
									onPress={() =>
										props.navigation.navigate('CarDetail', {
											datacar: data,
											data_iten: [],
										})
									}
									style={{
										width: Dimensions.get('window').width * 0.5 - 30,
										// width: '90%',
									}}>
									<Text size='label' type='bold' style={{}}>
										{data.name}
									</Text>
								</TouchableOpacity>

								<View
									style={{
										flexDirection: 'row',
										marginVertical: 3,
									}}>
									<CustomImage
										customStyle={{
											width: 15,
											height: 15,
										}}
										customImageStyle={{
											width: 15,
											height: 15,
											resizeMode: 'contain',
										}}
										// isTouchable={true}
										// onPress={() => props.navigation.navigate('Home')}
										source={Group}
									/>
									<Text
										size='description'
										style={{
											marginLeft: 5,
										}}>
										{data.passanger}
									</Text>
									<CustomImage
										customStyle={{
											// alignItems: 'center',
											marginLeft: 10,
											width: 15,
											height: 15,
										}}
										customImageStyle={{
											width: 10,
											height: 10,
											resizeMode: 'contain',
										}}
										// isTouchable={true}
										// onPress={() => props.navigation.navigate('Home')}
										source={card_travel}
									/>
									<Text
										size='description'
										style={{
											marginLeft: 3,
										}}>
										{data.suitcases}
									</Text>
								</View>
							</View>
							<View style={{}}>
								<TouchableOpacity
									onPress={() => _unliked(data.id)}
									style={{
										// alignSelf: 'flex-end',
										height: 30,
										width: 30,
										borderRadius: 15,
										backgroundColor: 'rgb(240, 240, 240)',
										alignItems: 'center',
										alignContent: 'center',
										justifyContent: 'center',
									}}>
									<LikeRed height={15} width={15} />
								</TouchableOpacity>
							</View>
						</View>
						<Text size='small' style={{}}>
							{t('startFrom')}
						</Text>
						<View
							style={{
								flexDirection: 'row',
							}}>
							<View
								style={{
									// borderWidth: 1,
									// borderColor: 'red',
									alignItems: 'flex-end',
									justifyContent: 'flex-end',
								}}>
								<Text
									size='label'
									type='bold'
									style={{
										color: '#D7598F',
										// marginLeft: (5),
									}}>
									{`Rp.${rupiah(data.price)}`}
								</Text>
							</View>
							<View
								style={{
									// borderWidth: 1,
									// borderColor: 'red',
									alignItems: 'flex-end',
									justifyContent: 'flex-end',
									paddingBottom: 3,
								}}>
								<Text size='small' style={{}}>
									/{t('day')}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				contentContainerStyle={{
					marginTop: 5,
					justifyContent: 'space-evenly',
					paddingStart: 10,
					paddingEnd: 10,
					paddingBottom: 120,
				}}
				horizontal={false}
				data={dataTrans}
				renderItem={({ item }) => (
					<RenderTrans
						data={item}
						// onSelect={onSelect}
						// selected={!!selected.get(item.id)}
					/>
				)}
				// keyExtractor={(item) => item.id}
				showsHorizontalScrollIndicator={false}
				// extraData={selected}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		// flex: 1,
		// marginTop: 20,
		paddingTop: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFF',
	},
	ImageView: {
		// width: (110),
		// height: (110),
		marginRight: 5,
		borderRadius: 10,
		backgroundColor: 'rgba(0, 0, 0, 0)',
		// borderColor: 'gray',
		// shadowColor: 'gray',
		// shadowOffset: { width: 3, height: 3 },
		// shadowOpacity: 1,
		// shadowRadius: 3,
		// elevation: 3,
		// opacity: 0.4,
		// elevation: 1,
	},
	Image: {
		resizeMode: 'contain',
		borderRadius: 10,
	},
});
