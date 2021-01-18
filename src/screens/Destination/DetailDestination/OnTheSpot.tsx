import React from 'react';
import { View, Image, SafeAreaView, Dimensions } from 'react-native';
import { normalize } from '../../../../const/PixelRatio';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';

const imgSize = Dimensions.get('window').width / 2 - normalize(25);
const dimensions = Dimensions.get('window');
const barWidth = dimensions.width - normalize(60);
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../../Component';
export default function OnTheSpot({ tittle, data }) {
	const { t, i18n } = useTranslation();

	const ots = [];
	if (data && data.length) {
		ots.push(data[0]);
	}
	if (data && data.length >= 2) {
		ots.push(data[1]);
	}
	return (
		<View style={{ paddingBottom: normalize(20) }}>
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
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					marginHorizontal: normalize(20),
				}}>
				{ots && ots.length
					? ots.map((i, index) => {
							return (
								<Image
									key={index}
									source={{ uri: i.image }}
									style={{
										width: imgSize,
										height: imgSize,
										borderRadius: 10,
										marginVertical: 10,
										marginRight: 10,
									}}
								/>
							);
					  })
					: null}
			</View>
			<TouchableOpacity>
				<Text
					style={{
						color: '#209FAE',
						marginHorizontal: normalize(20),
					}}
					size='label'
					type='bold'>
					{`${t('seeMorePhotos')} >`}
				</Text>
			</TouchableOpacity>
		</View>
	);
}
