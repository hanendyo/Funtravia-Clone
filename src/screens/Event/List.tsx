import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	FlatList,
	TextInput,
	TouchableOpacity,
	RefreshControl,
	Alert,
} from 'react-native';
import { Input, CustomImage } from '../../../core-ui';
import {} from '../../../const/PixelRatio';
import {
	default_image,
	MapIconGrey,
	CalenderGrey,
	MapIconGreen,
} from '../../../const/Png';
import { rupiah } from '../../../const/Rupiah';
import Truncate from '../../../utils/Truncate';
import { LikeRed, LikeEmpty } from '../../../const/Svg';
import { dateFormat, dateFormatBetween } from '../../../const/dateformatter';
import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import Liked from '../../../graphQL/Mutation/Event/likedEvent';
import UnLiked from '../../../graphQL/Mutation/unliked';

import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../Component';
const numColumns = 2;

export default function List({ props, datanya, Refresh, refreshing, token }) {
	// let [token, setToken] = useState('');
	const { t, i18n } = useTranslation();
	let [selected] = useState(new Map());
	let [dataEvent, setDataEvent] = useState(datanya);

	const [
		mutationliked,
		{ loading: loadingLike, data: dataLike, error: errorLike },
	] = useMutation(Liked, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});
	// console.log(token);-

	const [
		mutationUnliked,
		{ loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
	] = useMutation(UnLiked, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const eventdetail = (data) => {
		props.navigation.navigate('eventdetail', {
			data: data,
			name: data.name,
			token: token,
		});
	};

	const _liked = async (id) => {
		if (token || token !== '') {
			try {
				let response = await mutationliked({
					variables: {
						event_id: id,
					},
				});
				if (loadingLike) {
					Alert.alert('Loading!!');
				}
				if (errorLike) {
					throw new Error('Error Input');
				}

				// console.log(response);
				if (response.data) {
					if (
						response.data.setEvent_wishlist.code === 200 ||
						response.data.setEvent_wishlist.code === '200'
					) {
						// _Refresh();
						var tempData = [...dataEvent];
						var index = tempData.findIndex((k) => k['id'] === id);
						tempData[index].liked = true;
						setDataEvent(tempData);
					} else {
						throw new Error(response.data.setEvent_wishlist.message);
					}

					// Alert.alert('Succes');
				}
			} catch (error) {
				Alert.alert('' + error);
			}
		} else {
			Alert.alert('Please Login');
		}
	};

	const _unliked = async (id) => {
		if (token || token !== '') {
			try {
				let response = await mutationUnliked({
					variables: {
						id: id,
						type: 'event',
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
						var tempData = [...dataEvent];
						var index = tempData.findIndex((k) => k['id'] === id);
						tempData[index].liked = false;
						setDataEvent(tempData);
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

	const _renderItem = ({ item, index }) => {
		// console.log(item);
		return (
			<View
				style={{
					// zIndex: 22,
					justifyContent: 'center',
					// flex: 1,
					// width: (110),
					// height: (310),

					width: Dimensions.get('screen').width * 0.5 - 16,
					height: Dimensions.get('screen').width * 0.7,
					// width: (200),
					margin: 6,
					flexDirection: 'column',
					backgroundColor: 'white',
					borderRadius: 5,
					shadowColor: 'gray',
					shadowOffset: { width: 2, height: 2 },
					shadowOpacity: 1,
					shadowRadius: 3,
					elevation: 3,
				}}>
				<View
					style={{
						position: 'absolute',
						top: 15,
						left: 10,
						right: 10,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignContent: 'center',
						zIndex: 9999,
					}}>
					<View
						style={{
							// bottom: (9),
							height: 21,
							minWidth: 60,
							borderRadius: 11,
							alignSelf: 'center',
							justifyContent: 'center',
							backgroundColor: 'rgba(226, 236, 248, 0.85)',
							paddingHorizontal: 10,
						}}>
						<Text
							size='small'
							style={{
								textAlign: 'center',
							}}>
							{item.category.name}
						</Text>
					</View>
					<View
						style={{
							height: 26,
							width: 26,
							borderRadius: 50,
							alignSelf: 'center',
							alignItems: 'center',
							alignContent: 'center',
							justifyContent: 'center',
							backgroundColor: 'rgba(226, 236, 248, 0.85)',
							// zIndex: 999,
						}}>
						{item.liked === false ? (
							<TouchableOpacity
								style={{
									height: 26,
									width: 26,
									borderRadius: 50,
									alignSelf: 'center',
									alignItems: 'center',
									alignContent: 'center',
									justifyContent: 'center',

									zIndex: 9999,
								}}
								onPress={() => _liked(item.id)}>
								<LikeEmpty height={13} width={13} />
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={{
									height: 26,
									width: 26,
									borderRadius: 50,
									alignSelf: 'center',
									alignItems: 'center',
									alignContent: 'center',
									justifyContent: 'center',

									zIndex: 9999,
								}}
								onPress={() => _unliked(item.id)}>
								<LikeRed height={13} width={13} />
							</TouchableOpacity>
						)}
					</View>
				</View>

				<TouchableOpacity
					onPress={() => eventdetail(item)}
					style={{
						height: Dimensions.get('window').width * 0.47 - 16,
						// zIndex: 999,
						// width: (100),
						// flex:1,
					}}>
					<ImageBackground
						key={item.id}
						// source= {{uri : item.images.toString()}}
						source={
							item.images.length ? { uri: item.images[0].image } : default_image
						}
						style={[
							styles.ImageView,
							// {
							// 	width: (90),
							// 	height: (90),
							// },
						]}
						imageStyle={[
							styles.Image,
							// {
							// 	width: (90),
							// 	height: (90),
							// },
						]}></ImageBackground>

					{/* <LinearGradient
						colors={['#209FAE', 'rgba(0, 0, 0, 0)']}
						start={{ x: 0.8, y: 1 }}
						end={{ x: 0.2, y: 1 }}
						style={{
							position: 'absolute',
							// top : (150),
							bottom: 11,
							right: 0,
							height: 27,
							// width: (150),
							width: Dimensions.get('screen').width * 0.5 - 16,
							justifyContent: 'center',
							alignContent: 'flex-end',
							alignItems: 'flex-end',
						}}>
						<Text
							size='label'
							type='bold'
							style={{
								color: 'white',
								textAlign: 'right',
								marginRight: 10,
							}}>
							{item.ticket && item.ticket.length > 0
								? `IDR ${rupiah(item.ticket[0].price)}`
								: 'Free'}
						</Text>
					</LinearGradient> */}
				</TouchableOpacity>
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'space-around',
						height: 230,
						// marginBottom : (5),
						// marginTop	: (5),
						marginVertical: 5,
						marginHorizontal: 10,
						// borderWidth: 1,
						// borderColor: 'grey',
					}}>
					<Text
						onPress={() => eventdetail(item)}
						size='label'
						type='bold'
						style={
							{
								// marginBottom: (5),
							}
						}>
						<Truncate text={item.name} length={27} />
					</Text>
					<View
						style={{
							height: '50%',
							flexDirection: 'column',
							justifyContent: 'space-around',
							// borderWidth: 1,
							// borderColor: 'grey',
						}}>
						<View
							style={{
								// flex: 1,
								flexDirection: 'row',
								width: '100%',
								borderColor: 'grey',
								// marginBottom: (5),
							}}>
							<CustomImage
								customStyle={{
									width: 15,
									height: 15,
									// marginTop: (2),
									// marginLeft: (3),
									marginRight: 5,
								}}
								customImageStyle={{
									width: 15,
									height: 15,
									resizeMode: 'contain',
								}}
								source={MapIconGreen}
							/>
							<Text
								size='small'
								style={{
									width: '100%',
								}}>
								{item.city.name}
							</Text>
						</View>
						<View
							style={{
								// flex: 1,
								flexDirection: 'row',
								width: '100%',
								marginBottom: 3,
								// borderColor: 'grey',
								// borderWidth: 1,
							}}>
							<CustomImage
								customStyle={{
									width: 15,
									height: 15,
									// marginTop: (2),
									// marginLeft: (3),
									marginRight: 5,
								}}
								customImageStyle={{
									width: 15,
									height: 15,
									resizeMode: 'contain',
								}}
								source={CalenderGrey}
							/>
							<Text
								size='small'
								style={{
									paddingRight: 20,
									width: '100%',
								}}>
								{dateFormatBetween(item.start_date, item.end_date)}
							</Text>
						</View>
					</View>
				</View>
			</View>
		);
	};

	return (
		<FlatList
			contentContainerStyle={{
				// marginTop: (7),
				marginBottom: 15,
				justifyContent: 'space-evenly',
				// paddingVertical: (5),
				paddingBottom: 5,
				paddingHorizontal: 4,
			}}
			horizontal={false}
			// data={_FormatData(dataEvent, numColumns)}
			data={dataEvent}
			renderItem={_renderItem}
			numColumns={numColumns}
			keyExtractor={(item, index) => index.toString()}
			showsVerticalScrollIndicator={false}
			extraData={selected}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
			}
		/>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		flexDirection: 'row',
		// marginTop: 20,
		// paddingTop: (50),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFF',
	},
	ImageView: {
		// flex:1,
		// width: Dimensions.get('window').width - (Dimensions.get('window').width * 0.62),
		// height: (187),
		height: Dimensions.get('window').width * 0.47 - 16,
		// marginRight: (5),
		// marginLeft: (5),
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
		height: Dimensions.get('window').width * 0.47 - 16,
		// height: (187),
		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
		overflow: 'hidden',
		// borderBottomStartRadius: 0,
	},
});
