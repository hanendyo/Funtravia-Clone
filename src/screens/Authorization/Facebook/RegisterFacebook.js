import React, { useState, useEffect } from 'react';

import {
	Alert,
	StyleSheet,
	View,
	Platform,
	ScrollView,
	Dimensions,
	KeyboardAvoidingView,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { CustomText, CustomImage } from '../../core-ui';
import { facebook_vektor } from '../../const/Png';
import { useMutation } from '@apollo/react-hooks';
import * as Facebook from 'expo-facebook';
import { FB_CLIENT_ID } from '../../config/config';
import Facebookgql from '../../graphQL/Mutation/Register/Facebook';
import { NavigationEvents } from 'react-navigation';
import { Text, Button } from '../../Component';
import { useTranslation } from 'react-i18next';
import CreateSetting from '../../graphQL/Mutation/Setting/CreateSetting';

export default function RegisterFacebook(props) {
	const { t, i18n } = useTranslation();

	const [mutation, { loading, data, error }] = useMutation(Facebookgql);
	const facebookLogIn = async () => {
		let pushTkn = await AsyncStorage.getItem('token');
		await Facebook.initializeAsync({ appId: FB_CLIENT_ID });
		const { type, token } = await Facebook.logInWithReadPermissionsAsync({
			permissions: ['public_profile', 'email'],
		});

		let response;
		if (type === 'success') {
			response = await mutation({
				variables: { fbtoken: token.toString(), notify: pushTkn },
			});
		}

		if (
			response.data.register_facebook.code === '200' ||
			response.data.register_facebook.code === 200
		) {
			await AsyncStorage.setItem(
				'access_token',
				response.data.register_facebook.access_token,
			);
			await AsyncStorage.setItem(
				'setting',
				JSON.stringify(response.data.register_facebook.data_setting),
			);
			props.navigation.navigate('Home');
		} else if (
			(response.data.register_facebook.code === '400' ||
				response.data.register_facebook.code === 400) &&
			response.data.register_facebook.message === 'Account Already Registered'
		) {
			Alert.alert('Failed', 'Account Already Registered');
			props.navigation.navigate('login');
		} else {
			Alert.alert('Failed', 'Failed to Registrasi With Facebook');
			props.navigation.navigate('register');
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
			<NavigationEvents onDidFocus={() => facebookLogIn()} />

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
						source={facebook_vektor}
					/>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'space-evenly',
							marginVertical: 10,
						}}>
						<Text size='h5' type='bold'>
							{t('registerUsingFacebook')}
						</Text>
					</View>
					<View
						style={{
							alignContent: 'center',
							justifyContent: 'space-evenly',
							marginVertical: 10,
						}}>
						<Text
							numberOfLines={2}
							type='regular'
							size='small'
							style={{
								textAlign: 'center',
							}}>
							{t('pleaseWait')}
						</Text>
						<Text
							numberOfLines={2}
							type='regular'
							size='small'
							style={{
								textAlign: 'center',
							}}>
							{/* Click next to continue */}
						</Text>
					</View>
					<View
						style={{
							marginTop: 40,
							marginBottom: 80,
							alignItems: 'center',
						}}>
						<Text>{`${t('loading')}...`}</Text>
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
