import React from 'react';
import {
	View,
	// Text,
	Image,
	ScrollView,
	StyleSheet,
	SafeAreaView,
	Dimensions,
} from 'react-native';
import { normalize } from '../../../../const/PixelRatio';
import { LinearGradient } from 'expo-linear-gradient';
const dimensions = Dimensions.get('window');
const barWidth = dimensions.width - normalize(60);
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../../Component';
export default function GreatFor({ data, tittle }) {
	const { t, i18n } = useTranslation();

	return (
		<SafeAreaView style={{ marginBottom: normalize(10) }}>
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
			<ScrollView
				horizontal
				scrollEnabled
				style={{ marginHorizontal: normalize(20) }}>
				{data && data.length
					? data.map((i, index) => {
							return (
								<View
									key={index}
									style={{
										marginRight: normalize(5),
										marginVertical: normalize(5),
										// backgroundColor: '#f9f9f9',
										paddingHorizontal: normalize(10),
										paddingVertical: normalize(10),
										borderRadius: 10,
									}}>
									<Image
										source={i.icon}
										style={{
											width: normalize(35),
											height: normalize(35),
											alignSelf: 'center',
											resizeMode: 'contain',
										}}
									/>
									{/* <Text
										style={{
											position: 'relative',
											bottom: 0,
											margin: normalize(10),
										}}>
										{i.name}
									</Text> */}
								</View>
							);
					  })
					: null}
			</ScrollView>
		</SafeAreaView>
	);
}
