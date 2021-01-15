import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { normalize } from '../../../../const/PixelRatio';
import { LinearGradient } from 'expo-linear-gradient';
type Props = {
	tittle: String;
	content: String;
	handleVisibility: () => void;
};
const dimensions = Dimensions.get('window');
const barWidth = dimensions.width - normalize(60);
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../../Component';
export default function HargaTiketMasuk({ tittle, weekday, weekend }) {
	const { t, i18n } = useTranslation();

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
				<Text
					type='regular'
					size='description'
					style={{
						textAlign: 'justify',
						// fontFamily: 'lato-reg',
						// fontSize: normalize(13),
						color: '#464646',
						marginVertical: normalize(5),
					}}>
					{`${t('weekday')}: ${weekday}`}
				</Text>
				<Text
					type='regular'
					size='description'
					style={{
						textAlign: 'justify',
						// fontFamily: 'lato-reg',
						// fontSize: normalize(13),
						color: '#464646',
						marginVertical: normalize(5),
					}}>
					{`${t('weekend')} : ${weekend}`}
				</Text>
			</View>
		</View>
	);
}
