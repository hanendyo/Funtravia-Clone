import { useLazyQuery } from '@apollo/react-hooks';
import React, { useEffect } from 'react';
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { bali1, bali2 } from '../../../const/photo';
import { default_image } from '../../../const/Png';
import Article from '../../../graphQL/Query/Cities/Article';
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../Component';

const dimensions = Dimensions.get('screen');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function ArticleView({ props, data }) {
	const { t, i18n } = useTranslation();

	return (
		<View style={{ padding: 20 }}>
			{data && data.content.length ? (
				data.content.map((i, index) => {
					return (
						<View key={index}>
							{i.type === 'image' ? (
								<View>
									{i.title ? (
										<Text
											size='label'
											type='bold'
											style={{
												marginBottom: 5,
												// fontFamily: 'lato-bold',
											}}>
											{i.title}
										</Text>
									) : null}
									<Text
										size='description'
										type='regular'
										style={{
											textAlign: 'justify',
											lineHeight: 21,
											// fontFamily: 'lato-reg',
											// fontSize: 13,
											color: '#464646',
										}}>
										{i.text ? i.text : '-'}
									</Text>
									<View style={{ alignItems: 'center' }}>
										<Image
											source={i.image ? { uri: i.image } : default_image}
											resizeMode={'cover'}
											style={{
												borderWidth: 0.4,
												borderColor: '#d3d3d3',
												marginVertical: 10,
												height: Dimensions.get('screen').width * 0.4,
												width: '100%',
											}}
										/>
									</View>
								</View>
							) : (
								<View>
									{i.title ? (
										<Text
											size='label'
											type='bold'
											style={{
												marginBottom: 10,

												// marginVertical: 10,

												color: '#464646',
											}}>
											{i.title}
										</Text>
									) : null}
									<Text
										size='description'
										type='regular'
										style={{
											lineHeight: 21,
											textAlign: 'justify',
											// fontFamily: 'lato-reg',
											// fontSize: 13,
											color: '#464646',
										}}>
										{i.text ? i.text : '-'}
									</Text>
								</View>
							)}
						</View>
					);
				})
			) : (
				<View style={{ alignItems: 'center' }}>
					<Text
						type='regular'
						size='title'
						style={{
							textAlign: 'justify',
							// fontFamily: 'lato-reg',
							// fontSize: 18,
							color: '#464646',
						}}>
						{t('noArticle')}
					</Text>
				</View>
			)}
		</View>
	);
}
