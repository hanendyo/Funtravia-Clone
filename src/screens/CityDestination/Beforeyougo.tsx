import React, { useState, useCallback, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	Image,
	Platform,
	Animated,
	Alert,
} from 'react-native';

import FunIcon from '../../../utils/FunIcon';
import { CustomText, CustomImage } from '../../../core-ui';
import { useLazyQuery } from '@apollo/react-hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { rupiah } from '../../../const/Rupiah';
import { Arrowbackwhite, TypeC, TypeF } from '../../../const/Svg';

import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import ImageSlide from '../ImageSlide';
import Truncate from '../../../utils/Truncate';
import { dateFormat, dateFormatBetween } from '../../../const/dateformatter';
import { bali1, bali2, bali3, bali4 } from '../../../const/photo';
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../Component';

export default function Beforeyougo(props) {
	const { t, i18n } = useTranslation();
	useEffect(() => {}, []);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView
				nestedScrollEnabled={true}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				style={{
					marginTop: 10,
					// borderWidth: 1,
					// borderColor: 'red',
					paddingHorizontal: 20,
				}}>
				<View
					style={{
						width: '100%',
						borderBottomWidth: 1,
						borderBottomColor: '#d1d1d1',
						paddingVertical: 10,
					}}>
					<Text size='label' type='bold' style={{ marginBottom: 5 }}>
						{`${t('passport')} ${'&'} ${t('visa')}`}
					</Text>
					<Text size='description' type='regular' style={{ color: '#d1d1d1' }}>
						{t('forUpToDate')}
					</Text>
					<Text size='description' type='bold'>
						www.imigrasi.co.id
					</Text>
				</View>
				<View
					style={{
						width: '100%',
						borderBottomWidth: 1,
						borderBottomColor: '#d1d1d1',
						paddingVertical: 10,
					}}>
					<Text type='bold' size='label' style={{ marginBottom: 5 }}>
						{t('currency')}
					</Text>
					<Text type='regular' size='description' style={{ color: '#d1d1d1' }}>
						Indonesia Rupiah (IDR)
					</Text>
				</View>

				<View
					style={{
						width: '100%',
						borderBottomWidth: 1,
						borderBottomColor: '#d1d1d1',
						paddingVertical: 10,
					}}>
					<Text type='bold' size='label' style={{ marginBottom: 5 }}>
						{t('climate')}
					</Text>
					<View
						style={{
							width: '100%',
							justifyContent: 'space-between',
							flexDirection: 'row',
						}}>
						<FunIcon icon='w-rain_heavy' height={60} width={60} />
						<Text
							type='regular'
							size='description'
							style={{
								width: '80%',

								textAlign: 'justify',
								color: '#6c6c6c',
							}}>
							Lorem ipsum adipiscing turpis dolor elit. nunc id sit Tortor nec
							amet, consectetur varius ermentum ut cursus at. Vitae habitant id
							lorem amet aliquam
						</Text>
					</View>
					<View
						style={{
							width: '100%',
							justifyContent: 'space-between',
							flexDirection: 'row',
						}}>
						<FunIcon icon='w-sunny' height={60} width={60} />
						<Text
							size='description'
							type='regular'
							style={{
								width: '80%',
								// fontFamily: 'lato-reg',
								// fontSize: 14,
								textAlign: 'justify',
								color: '#6c6c6c',
							}}>
							Lorem ipsum adipiscing turpis dolor elit. nunc id sit Tortor nec
							amet, consectetur varius ermentum ut cursus at. Vitae habitant id
							lorem amet aliquam
						</Text>
					</View>
				</View>
				<View
					style={{
						width: '100%',
						borderBottomWidth: 1,
						borderBottomColor: '#d1d1d1',
						paddingVertical: 10,
					}}>
					<Text size='label' type='bold' style={{ marginBottom: 5 }}>
						{t('electricity')}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-around',
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<TypeC height={60} width={60} />

							<Text
								size='description'
								type='regular'
								style={{
									// fontFamily: 'lato-reg',
									// fontSize: 14,
									color: '#6c6c6c',
								}}>
								Type C
							</Text>
						</View>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<TypeF height={60} width={60} />

							<Text
								size='description'
								type='regular'
								style={{
									// fontFamily: 'lato-reg',
									// fontSize: 14,
									color: '#6c6c6c',
								}}>
								Type F
							</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						width: '100%',
						borderBottomWidth: 1,
						borderBottomColor: '#d1d1d1',
						paddingVertical: 10,
					}}>
					<Text type='bold' size='label' style={{ marginBottom: 5 }}>
						Money
					</Text>
					<Text
						size='description'
						type='regular'
						style={{
							// fontFamily: 'lato-reg',
							// fontSize: 14,
							textAlign: 'justify',
							color: '#6c6c6c',
						}}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor
						varius fermentum turpis nunc id nec ut cursus at. Vitae habitant id
						lorem amet aliquam.
					</Text>
				</View>
				<View
					style={{
						width: '100%',
						borderBottomWidth: 1,
						borderBottomColor: '#d1d1d1',
						paddingVertical: 10,
					}}>
					<Text type='bold' size='label' style={{ marginBottom: 5 }}>
						Custom informtion
					</Text>
					<Text
						size='description'
						type='regular'
						style={{
							// fontFamily: 'lato-reg',
							// fontSize: 14,
							textAlign: 'justify',
							color: '#6c6c6c',
						}}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor
						varius fermentum turpis nunc id nec ut cursus at. Vitae habitant id
						lorem amet aliquam.
					</Text>
				</View>
				<View
					style={{
						width: '100%',
						borderBottomWidth: 1,
						borderBottomColor: '#d1d1d1',
						paddingVertical: 10,
					}}>
					<Text type='bold' size='label' style={{ marginBottom: 5 }}>
						{t('smoke')} {'&'} {t('alcohol')}
					</Text>
					<Text
						size='description'
						type='regular'
						style={{
							// fontFamily: 'lato-reg',
							// fontSize: 14,
							textAlign: 'justify',
							color: '#6c6c6c',
						}}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor
						varius fermentum turpis nunc id nec ut cursus at. Vitae habitant id
						lorem amet aliquam.
					</Text>
				</View>
				<View
					style={{
						width: '100%',
						borderBottomWidth: 1,
						borderBottomColor: '#d1d1d1',
						paddingVertical: 10,
					}}>
					<Text type='bold' size='label' style={{ marginBottom: 5 }}>
						{t('accommodation')}
					</Text>
					<Text
						size='description'
						type='regular'
						style={{
							// fontFamily: 'lato-reg',
							// fontSize: 14,
							textAlign: 'justify',
							color: '#6c6c6c',
						}}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor
						varius fermentum turpis nunc id nec ut cursus at. Vitae habitant id
						lorem amet aliquam.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

Beforeyougo.navigationOptions = ({ navigation }) => ({
	headerTitle: 'Before You Go',
	headerMode: 'screen',
	headerStyle: {
		backgroundColor: '#209FAE',
		elevation: 0,
		borderBottomWidth: 0,
		fontSize: 50,
	},
	headerTitleStyle: {
		fontFamily: 'lato-reg',
		fontSize: 14,
		color: 'white',
	},
	headerLeft: (
		<TouchableOpacity onPress={() => navigation.goBack()}>
			<Arrowbackwhite height={20} width={20}></Arrowbackwhite>
		</TouchableOpacity>
	),
	headerLeftContainerStyle: {
		paddingLeft: 20,
	},
	headerRight: <View style={{ flexDirection: 'row' }}></View>,
	headerRightStyle: {
		paddingRight: 20,
	},
});
