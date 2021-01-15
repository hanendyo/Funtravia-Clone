import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { normalize } from '../../../../const/PixelRatio';
import { useTranslation } from 'react-i18next';
import { Text, Button } from '../../../../Component';
type Props = {
	tittle: String;
	content: String;
	maps: Image;
	handleVisibility: () => void;
};
const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width - 50;
export default function AboutInformation({ tittle, content, maps }) {
	const { t, i18n } = useTranslation();

	return (
		<View style={{ padding: normalize(20) }}>
			<Text
				type='bold'
				size='title'
				style={{
					backgroundColor: 'transparent',
					// fontSize: normalize(18),
					marginVertical: normalize(10),
					fontFamily: 'lato-bold',
					// color: '#464646',
				}}>
				{tittle}
			</Text>
			<Text
				size='small'
				type='regular'
				style={{
					textAlign: 'justify',
					// fontFamily: 'lato-reg',
					fontSize: normalize(13),
					// color: '#464646',
				}}>
				{content}
			</Text>
			{maps && maps !== '' ? (
				<View style={{ alignItems: 'center' }}>
					<Image
						source={{
							uri: maps + `?width=${imageWidth}&height=${imageHeight}`,
						}}
						resizeMode={'cover'}
						style={{
							marginVertical: normalize(20),
							height: imageHeight,
							width: imageWidth,
						}}
					/>
				</View>
			) : null}
		</View>
	);
}
