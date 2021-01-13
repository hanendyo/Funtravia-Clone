import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Dimensions,
	ImageBackground,

} from 'react-native';
import { HotelIcon, Kosong,  Sharegreen } from '../../assets/svg';

import { Button, Text } from '../../component';
import { useTranslation } from 'react-i18next';
import ImageSlide from '../../component/src/ImageSlide/index';

export default function Review({ props, token, data }) {
	const { t, i18n } = useTranslation();
	let [modal, setModal] = useState(false);
	let [dataImage, setDataImage] = useState();

	// const images = [
	// 	'https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909',
	// 	'https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909',
	// ];

	const onSelect = async (data) => {
		var tempdatas = [];
		var x = 0;
		for (var i in data) {
			tempdatas.push({
				key: i,
				selected: i === 0 ? true : false,
				url: data[i] ? data[i] : '',
				width: Dimensions.get('screen').width,
				height: 300,
				props: {
					source: data[i] ? data[i] : '',
				},
			});
			x++;
		}

		if (tempdatas.length > 0) {
			await setDataImage(tempdatas);
			setModal(true);
		}
	};

	return (
		<View>
			{/* {console.log(data)} */}
			{data && data.length > 0 ? (
				<FlatList
					nestedScrollEnabled
					style={{ height: Dimensions.get('screen').height }}
					contentContainerStyle={{ paddingBottom: 70 }}
					showsVerticalScrollIndicator={false}
					data={data ? data : null}
					renderItem={({ item }) => (
						<View
							style={{
								paddingVertical: 10,
								paddingHorizontal: 20,
								width: Dimensions.get('screen').width,
								borderBottomWidth: 1,
								borderBottomColor: '#d3d3d3',
							}}>
							<View
								style={{
									flexDirection: 'row',
									width: '100%',
									justifyContent: 'space-between',
								}}>
								<Text type={'bold'} size={'label'} style={{}}>
									{item.name}
								</Text>

								<View
									style={{
										flexDirection: 'row',
									}}>
									<HotelIcon height={20} width={20} />
									<Text style={{ color: '#209FAE' }}>></Text>
								</View>
							</View>
							<View
								style={{
									flexDirection: 'row',
									width: '100%',
									justifyContent: 'space-between',
									paddingVertical: 5,
								}}>
								<View style={{}}>
									<Text type={'regular'} size={'description'}>
										{item.create_at}
									</Text>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Text
										type={'regular'}
										size={'description'}
										style={{ color: '#209fae' }}>{`${item.rating}`}</Text>
									<Text type={'regular'} size={'description'}>{`/5`}</Text>
								</View>
							</View>
							<View style={{}}>
								<Text
									type={'regular'}
									size={'small'}
									style={{ textAlign: 'justify' }}>
									{item.ulasan}
								</Text>
							</View>
							<Button
								size='medium'
								type='icon'
								variant='transparent'
								style={{ width: '50%', marginLeft: -20 }}>
								<Sharegreen />
								<Text
									style={{ marginLeft: 5 }}
									type={'regular'}
									size={'description'}>
									{t('Sharethisreview')}
								</Text>
							</Button>
							{item.images && item.images.length > 0 ? (
								item.images.length > 1 ? (
									<View style={{ flexDirection: 'row', width: '100%' }}>
										<TouchableOpacity
											style={{ width: '60%' }}
											onPress={() => {
												onSelect(item.images);
											}}>
											<ImageBackground
												source={{ uri: item.images[0] }}
												style={{
													alignSelf: 'center',
													height: Dimensions.get('window').width / 3,
													width: '100%',
													borderRadius: 5,
													marginRight: 5,
												}}
												imageStyle={{
													resizeMode: 'cover',
													borderRadius: 5,
												}}></ImageBackground>
										</TouchableOpacity>
										<TouchableOpacity
											style={{ width: '40%' }}
											onPress={() => {
												onSelect(item.images);
											}}>
											<ImageBackground
												source={{ uri: item.images[1] }}
												style={{
													alignSelf: 'center',
													justifyContent: 'center',
													height: Dimensions.get('window').width / 3,
													width: '100%',
													borderRadius: 5,
													marginLeft: 5,
												}}
												imageStyle={{
													resizeMode: 'cover',
													borderRadius: 5,
													opacity: 0.2,
												}}>
												{/* <TouchableOpacity
												// onPress={() => onSelect(id)}
												> */}
												<Text
													type='regular'
													size='h5'
													style={{
														textAlign: 'center',
														// fontFamily: 'Lato-Regular',
														// fontSize: 25,
													}}>
													{`+ ${item.images.length - 1} `}
												</Text>
												{/* </TouchableOpacity> */}
											</ImageBackground>
										</TouchableOpacity>
									</View>
								) : (
									<TouchableOpacity
										onPress={() => {
											onSelect(item.images);
										}}>
										<ImageBackground
											source={{ uri: item.images[0] }}
											style={{
												alignSelf: 'center',
												height: Dimensions.get('window').width / 3,
												width: '100%',
												borderRadius: 5,
											}}
											imageStyle={{
												resizeMode: 'cover',
												borderRadius: 5,
											}}></ImageBackground>
									</TouchableOpacity>
								)
							) : null}
						</View>
					)}
					keyExtractor={(item) => item.id}
					// extraData={selected}
				/>
			) : (
				<View
					style={{
						paddingVertical: 40,
						justifyContent: 'flex-start',
						alignItems: 'center',
						alignContent: 'center',
						height: '100%',
					}}>
					<Text
						style={{
							fontSize: 16,
							fontFamily: 'Lato-Bold',
							color: '#646464',
							textAlign: 'center',
						}}>
						{t('noDataRecent')}
					</Text>

					<Kosong
						height={Dimensions.get('screen').width * 0.6}
						width={Dimensions.get('screen').width}
					/>
				</View>
			)}

			<ImageSlide
				show={modal}
				dataImage={dataImage}
				setClose={() => setModal(!modal)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		paddingTop: 10,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 10,
	},
	content: {
		flex: 2,
	},
	shareButtonView: {
		elevation: 3,
		alignItems: 'flex-start',

		height: 30,
		width: 30,
		shadowOpacity: 0.3,
		shadowColor: '#B8E0E5',
	},

	shareButtonImage: {
		resizeMode: 'contain',
		height: 20,
		width: 20,
	},
	statNumber: {
		fontSize: 16,
		color: '#434343',
	},
	modalScroll: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black',
		//opacity: 1,
	},
	fab: {
		position: 'absolute',
		bottom: 5,
		right: 10,
	},
});
