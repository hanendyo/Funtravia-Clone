import React from 'react';
import {
	View,
	// Text,
	ScrollView,
	SafeAreaView,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import { normalize } from '../../../../const/PixelRatio';
import Truncate from '../../../../utils/Truncate';
import { LinearGradient } from 'expo-linear-gradient';
import { Container } from 'native-base';
const dimensions = Dimensions.get('window');
const barWidth = dimensions.width - normalize(60);
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../../Component';
export default function PenilaianTempat({ tittle, data }) {
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
			<Container
				style={{
					flex: 1,
					paddingHorizontal: normalize(5),
					height: normalize(110),
				}}>
				<ScrollView
					horizontal
					nestedScrollEnabled={true}
					showsHorizontalScrollIndicator={false}>
					{data && data.length
						? data.map((i, index) => {
								return (
									<View
										key={index}
										style={{
											marginVertical: normalize(5),
											marginRight: normalize(5),
											height: normalize(100),
											width: normalize(250),
											backgroundColor: '#f6f6f6',
											borderRadius: 10,
										}}>
										<View
											style={{
												flex: 1,
												flexDirection: 'row',
												height: normalize(20),
											}}>
											<Text
												style={{
													fontSize: normalize(12),
													paddingHorizontal: normalize(5),
													color: '#464646',
													fontFamily: 'lato-bold',
													position: 'absolute',
													margin: normalize(10),
													left: normalize(0),
												}}>
												{i.username}
											</Text>
											<Text
												type='bold'
												size='small'
												style={{
													// fontSize: normalize(12),
													paddingHorizontal: normalize(5),
													color: '#209FAE',
													// fontFamily: 'lato-bold',
													position: 'absolute',
													margin: normalize(10),
													right: normalize(15),
												}}>
												{i.rating + '/5'}
											</Text>
										</View>
										<Text
											type='regular'
											size='small'
											style={{
												// fontSize: normalize(12),
												paddingHorizontal: normalize(5),
												color: '#464646',
												// fontFamily: 'lato-reg',
												textAlign: 'justify',
												position: 'absolute',
												margin: normalize(10),
												top: normalize(20),
											}}>
											<Truncate text={i.review} length={150} />
										</Text>
									</View>
								);
						  })
						: null}
				</ScrollView>
			</Container>
			<TouchableOpacity>
				<Text
					size='title'
					type='bold'
					style={{
						// fontSize: normalize(18),
						marginVertical: normalize(10),
						// fontFamily: 'lato-bold',
						color: '#209FAE',
						marginHorizontal: normalize(20),
					}}>
					{`${t('seeMoreReview')} >`}
				</Text>
			</TouchableOpacity>
		</View>
	);
}
