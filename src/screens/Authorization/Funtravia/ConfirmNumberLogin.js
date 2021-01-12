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
import Phonegql from '../../graphQL/Mutation/Login/Phone';
import { useTranslation } from 'react-i18next';

export default function ConfirmNumberLogin(props) {
	const { t, i18n } = useTranslation();

	let [sendNumber, { loading, data, error }] = useMutation(Phonegql);
	let [region, setRegion] = useState(
		props.navigation.state.params ? props.navigation.state.params.region : null,
	);
	let [number, setNumber] = useState(
		props.navigation.state.params ? props.navigation.state.params.number : null,
	);

	let [modalVisible, setModalVisible] = useState(false);

	const requestOTP = async () => {
		let response = await sendNumber({ variables: { phone: region + number } });
		if (loading) {
			Alert.alert('Loading!!');
		}
		if (error) {
			throw new Error('Failed Send OTP');
		}

		if (
			response.data.login_phone.code === 200 ||
			response.data.login_phone.code === '200'
		) {
			props.navigation.navigate('OtpLoginPhone', {
				userId: response.data.login_phone.id,
				number: number,
				region: region,
			});
		} else if (
			response.data.login_phone.code === 400 ||
			response.data.login_phone.code === '400'
		) {
			props.navigation.navigate('LoginPhone', {
				error: response.data.login_phone.message,
			});
		} else {
			props.navigation.navigate('login', {
				error: 'Failed Login With Phone Number',
			});
		}
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
							onPress={requestOTP}
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
