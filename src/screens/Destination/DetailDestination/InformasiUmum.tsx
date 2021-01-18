import React from 'react';
import {
	View,
	// Text,
	Image,
	TouchableOpacity,
	Linking,
	Dimensions,
} from 'react-native';
import { normalize } from '../../../../const/PixelRatio';
import {
	InstagramGrey,
	Phone,
	OpenAt,
	Website,
	FacebookGrey,
} from '../../../../const/Png';
import { LinearGradient } from 'expo-linear-gradient';
const dimensions = Dimensions.get('window');
const barWidth = dimensions.width - normalize(60);
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../../Component';
export default function InformasiUmum({ data, tittle }) {
	const { t, i18n } = useTranslation();

	return (
		<View style={{ marginBottom: normalize(10) }}>
			<LinearGradient
				colors={['rgba(032, 159, 174,0.8)', 'rgb(255, 255, 255)']}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 1 }}
				style={{
					width: barWidth,
					marginLeft: normalize(5),
					marginBottom: normalize(10),
				}}>
				<Text
					size='title'
					type='bold'
					style={{
						// fontSize: normalize(18),
						marginVertical: normalize(10),
						paddingLeft: normalize(20),
						// fontFamily: 'lato-bold',
						color: '#FFFFFF',
					}}>
					{tittle}
				</Text>
			</LinearGradient>
			<View style={{ marginHorizontal: normalize(20) }}>
				{data && data.phone1 ? (
					<View
						style={{
							flexDirection: 'row',
							marginVertical: normalize(5),
						}}>
						<Image
							source={Phone}
							style={{
								width: normalize(15),
								height: normalize(15),
								alignSelf: 'center',
								marginHorizontal: normalize(5),
							}}
						/>
						<Text
							type='regular'
							size='description'
							style={{
								paddingHorizontal: normalize(5),
								color: '#464646',
								// fontFamily: 'lato-reg',
								// fontSize: normalize(13),
							}}>
							{data ? data.phone1 : '-'}
						</Text>
					</View>
				) : null}
				{data && data.website ? (
					<TouchableOpacity
						onPress={() => Linking.openURL(data.website)}
						style={{
							flexDirection: 'row',
							marginVertical: normalize(5),
						}}>
						<Image
							source={Website}
							style={{
								width: normalize(15),
								height: normalize(15),
								alignSelf: 'center',
								marginHorizontal: normalize(5),
							}}
						/>
						<Text
							size='description'
							type='regular'
							style={{
								paddingHorizontal: normalize(5),
								color: '#464646',
								// fontFamily: 'lato-reg',
								// fontSize: normalize(13),
							}}>
							{data ? data.website : '-'}
						</Text>
					</TouchableOpacity>
				) : null}
				{data && data.instagram ? (
					<View
						style={{
							flexDirection: 'row',
							marginVertical: normalize(5),
						}}>
						<Image
							source={InstagramGrey}
							style={{
								width: normalize(15),
								height: normalize(15),
								alignSelf: 'center',
								marginHorizontal: normalize(5),
							}}
						/>
						<Text
							type='regular'
							size='description'
							style={{
								paddingHorizontal: normalize(5),
								color: '#464646',
								// fontFamily: 'lato-reg',
								// fontSize: normalize(13),
							}}>
							{data ? data.instagram : '-'}
						</Text>
					</View>
				) : null}
				{data && data.facebook ? (
					<View
						style={{
							flexDirection: 'row',
							marginVertical: normalize(5),
						}}>
						<Image
							source={FacebookGrey}
							style={{
								width: normalize(15),
								height: normalize(15),
								alignSelf: 'center',
								marginHorizontal: normalize(5),
							}}
						/>
						<Text
							type='regular'
							size='description'
							style={{
								paddingHorizontal: normalize(5),
								color: '#464646',
								// fontFamily: 'lato-reg',
								// fontSize: normalize(13),
							}}>
							{data ? data.facebook : '-'}
						</Text>
					</View>
				) : null}
				<View
					style={{
						flexDirection: 'row',
						marginVertical: normalize(5),
					}}>
					<Image
						source={OpenAt}
						style={{
							width: normalize(15),
							height: normalize(15),
							alignSelf: 'center',
							marginHorizontal: normalize(5),
						}}
					/>
					<Text
						type='regular'
						size='description'
						style={{
							paddingHorizontal: normalize(5),
							color: '#464646',
							// fontFamily: 'lato-reg',
							// fontSize: normalize(13),
						}}>
						{data ? data.openat : '-'}
					</Text>
				</View>
			</View>
		</View>
	);
}
