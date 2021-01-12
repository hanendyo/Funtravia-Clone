import React, { useState } from 'react';

import {
	Alert,
	Modal,
	StyleSheet,
	TouchableHighlight,
	View,
	Platform,
	ScrollView,
	Dimensions,
	KeyboardAvoidingView,
	TouchableOpacity,
} from 'react-native';
// import {  } from '../../const/PixelRatio';
import { CustomText, CustomImage, FloatingInput } from '../../core-ui';
import { Text, Button } from '../../Component';
import { lupass_satu, phone_vektor } from '../../const/Png';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useTranslation } from 'react-i18next';

const FORGOT = gql`
	mutation Login($number: String!) {
		forgotPassword(input: { number: $number }) {
			code
			status
			message
			response_time
			number
		}
	}
`;
export default function ConfirmNumber(props) {
	const { t, i18n } = useTranslation();

	let [region, setRegion] = useState(
		props.navigation.state.params ? props.navigation.state.params.region : null,
	);
	let [number, setNumber] = useState(
		props.navigation.state.params ? props.navigation.state.params.number : null,
	);

	let [modalVisible, setModalVisible] = useState(false);
	let [sendForgot] = useMutation(FORGOT);

	const requestForgot = async () => {
		props.navigation.navigate('OtpPhone', {
			userId: 'kiriman',
			number: number,
			region: region,
		});

		// try {
		// 	let { data } = await sendForgot({ variables: { number: number } });
		// 	props.navigation.navigate('otpOtpPhone', {
		// 		userId: 'kiriman',
		// 		number: number,
		// 	});
		// } catch (error) {
		// 	setModalVisible(true);
		// }
	};
	return (
		<KeyboardAvoidingView
			style={{
				flex: 1,
			}}
			behavior={Platform.OS === 'ios' ? 'padding' : null}
			// keyboardVerticalOffset={30}
			enabled>
			<ScrollView
				style={{
					paddingTop: 80,
				}}
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[1]}>
				<View
					style={{
						// flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<CustomImage
						customStyle={{
							alignSelf: 'center',
							width: 200,
							height: 175,
						}}
						source={phone_vektor}
					/>
					<Text type='bold' size='h3'>
						Do you have this phone?
					</Text>
					<View style={{ width: 220 }}>
						<Text
							numberOfLines={2}
							style={{
								textAlign: 'center',
							}}
							type='regular'
							size='description'>
							{t('weJustSend')}
						</Text>
					</View>
					<View
						style={{
							flexDirection: 'row',
							marginBottom: 40,
							marginTop: 40,
						}}>
						<Text type='bold' size='h3'>
							{region}
						</Text>
						<Text type='bold' size='h3'>
							{number}
						</Text>
					</View>
					<View
						style={{
							marginBottom: 80,
							alignItems: 'center',
						}}>
						<Button
							onPress={requestForgot}
							text={t('resend')}
							style={{ width: Dimensions.get('window').width / 1.2 }}
						/>
						<TouchableOpacity
							onPress={() => props.navigation.navigate('login')}>
							<Text
								style={{
									marginTop: 10,
									// color: '#27958B',
								}}
								size='description'
								type='regular'>
								{t('messageRates')}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => props.navigation.navigate('login')}>
							<Text
								style={{
									marginTop: 40,
									color: '#27958B',
								}}
								type='bold'>
								Try another way to sign in
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		margin: 50,
		alignItems: 'center',
	},
	inputTextStyle: {
		width: Dimensions.get('window').width / 1.2,
		fontSize: 14,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: '#D75995',
		borderRadius: 20,
		padding: 15,
		elevation: 2,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
});
