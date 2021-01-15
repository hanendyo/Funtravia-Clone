import React from 'react';
import {
	View,
	// Text,
	Image,
	TouchableOpacity,
	Linking,
	Platform,
	Dimensions,
} from 'react-native';
import { normalize } from '../../../../const/PixelRatio';
import { IconMaps, Address } from '../../../../const/Png';
import { LinearGradient } from 'expo-linear-gradient';
const dimensions = Dimensions.get('window');
const barWidth = dimensions.width - normalize(60);
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../../Component';

export default function DetailLokasi({ tittle, data }) {
	const { t, i18n } = useTranslation();

	const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
	const latLng = `${data ? data.latitude : null},${
		data ? data.longitude : null
	}`;
	const label = 'Custom Label';
	const url = Platform.select({
		ios: `${scheme}${label}@${latLng}`,
		android: `${scheme}${latLng}(${label})`,
	});

	return (
		<View style={{ marginBottom: normalize(20) }}>
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
				<View
					style={{
						flexDirection: 'row',
					}}>
					<Image
						source={Address}
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
							// fontSize: normalize(13),
							paddingHorizontal: normalize(5),
							color: '#464646',
							// fontFamily: 'lato-reg',
						}}>
						{data ? data.address : null}
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => Linking.openURL(url)}
					style={{
						flexDirection: 'row',
						marginVertical: normalize(5),
					}}>
					<Image
						source={IconMaps}
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
							// fontSize: normalize(13),
							paddingHorizontal: normalize(5),
							color: '#464646',
							// fontFamily: 'lato-reg',
						}}>
						{t('viewMap')}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
