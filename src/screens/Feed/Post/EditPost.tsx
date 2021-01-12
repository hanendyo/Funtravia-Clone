import React, { useState, useEffect } from 'react';
import {
	View,
	ImageBackground,
	Dimensions,
	Image,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	SafeAreaView,
	TouchableOpacity,
	Pressable,
	Alert,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { default_image } from '../../../const/Png';
import { CustomImage } from '../../../core-ui';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import AutoHeightImage from 'react-native-auto-height-image';
import { back_arrow_white } from '../../../const/Png';
import Account from '../../../graphQL/Query/Home/Account';
import LocationSelector from './LocationSelector';
import { NavigationEvents } from 'react-navigation';
import * as Permissions from 'expo-permissions';

import Loading from '../Loading';
import {
	Arrowbackwhite,
	Xhitam,
	Pointmapblack,
	Pointmapgray,
	Pointmaprecent,
	OptionsVertWhite,
	Search,
	PinHijau,
	OptionsVertBlack,
	Xgray,
	CheckWhite,
} from '../../../const/Svg';
import { Text, Button } from '../../../Component';
import Ripple from 'react-native-material-ripple';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Truncate from '../../../utils/Truncate';
import { useTranslation } from 'react-i18next';

const PostEdit = gql`
	mutation($post_id: ID!, $caption: String) {
		edit_post(post_id: $post_id, caption: $caption) {
			id
			response_time
			message
			code
		}
	}
`;

export default function EditPost(props) {
	const { t, i18n } = useTranslation();

	let [modellocation, setModellocation] = useState(false);
	let [Location, setLocation] = useState({
		address: 'Add Location',
		latitude: '',
		longitude: '',
	});
	let [loadingok, setLoading] = useState(false);
	const chosenPicture = props.navigation.getParam('file');
	const [token, setToken] = useState(null);
	const [datapost, setDatapost] = useState(
		props.navigation.getParam('datapost'),
	);
	// console.log(datapost);
	let [statusText, setStatusText] = useState(datapost?.caption);

	const [datanearby, setDataNearby] = useState([]);
	const [MutationEdit, { loading, data, error }] = useMutation(PostEdit, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});
	const [
		LoadUserProfile,
		{
			data: dataprofile,
			loading: loadingprofile,
			error: errorprofile,
			refetch,
		},
	] = useLazyQuery(Account, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});
	const wait = (timeout) => {
		return new Promise((resolve) => {
			setTimeout(resolve, timeout);
		});
	};
	const _setStatusText = (data) => {
		setStatusText(data);
		props.navigation.setParams({
			SubmitData: SubmitData,
			text: data,
		});
		wait(1000).then(() => {
			props.navigation.setParams({
				SubmitData: SubmitData,
				text: data,
			});
		});
		// props.navigation.getParam('setText');
	};
	const _setLocation = (data) => {
		props.navigation.setParams({
			SubmitData: SubmitData,
			text: statusText,
			location: data,
		});
		setLocation(data);

		wait(1000).then(() => {
			props.navigation.setParams({
				SubmitData: SubmitData,
				text: statusText,
				location: data,
			});
		});
	};

	const duration = (datetime) => {
		var date1 = new Date(datetime).getTime();
		var date2 = new Date().getTime();
		var msec = date2 - date1;
		var mins = Math.floor(msec / 60000);
		var hrs = Math.floor(mins / 60);
		var days = Math.floor(hrs / 24);
		var yrs = Math.floor(days / 365);
		mins = mins % 60;
		hrs = hrs % 24;
		if (yrs > 0) {
			return yrs + ' ' + t('yearsAgo');
		}
		if (days > 0) {
			return days + ' ' + t('daysAgo');
		}
		if (hrs > 0) {
			return hrs + ' ' + t('hoursAgo');
		}
		if (mins > 0) {
			return mins + ' ' + t('minutesAgo');
		} else {
			return t('justNow');
		}
	};
	// console.log(chosenPicture.base64);
	const SubmitData = async (text) => {
		// return false;
		setLoading(true);
		let caption = text ? text : '-';
		// console.log(caption);
		try {
			let response = await MutationEdit({
				variables: {
					post_id: datapost.id,
					caption: caption,
				},
			});
			console.log(response);
			if (response.data) {
				if (response.data.edit_post.code === 200) {
					setLoading(false);
					props.navigation.navigate('Feed');
				} else {
					// console.log('error');
					setLoading(false);
					throw new Error(response.data.edit_post.message);
				}

				// Alert.alert('Succes');
			} else {
				throw new Error('Error Input');
			}
		} catch (error) {
			// console.log(error);
			setLoading(false);
			Alert.alert('' + error);
		}
	};
	// const submit = () => {
	// 	SubmitData();
	// 	// console.log('fungsi', props.navigation.getParam('SubmitData'));
	// 	// props.navigation.getParam('SubmitData');
	// };

	const loadAsync = async () => {
		let access_token = await AsyncStorage.getItem('access_token');
		setToken(access_token);
		LoadUserProfile();
	};

	useEffect(() => {
		loadAsync();
		props.navigation.setParams({
			SubmitData: SubmitData,
			text: statusText,
		});
	}, []);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : null}
			style={{ flex: 1 }}>
			<ScrollView style={{}}>
				<Loading show={loadingok} />
				<NavigationEvents
					onDidFocus={() =>
						props.navigation.setParams({
							SubmitData: SubmitData,
							location: Location,
							text: statusText,
						})
					}
				/>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View
						style={
							{
								// flex: 1,
								// justifyContent: 'flex-start',
							}
						}>
						<View
							style={{
								width: '100%',
								flexDirection: 'row',
								marginVertical: 15,
								// justifyContent: 'space-evenly',
								alignContent: 'center',
							}}>
							<CustomImage
								isTouchable
								onPress={null}
								customStyle={{
									height: 35,
									width: 35,
									borderRadius: 15,
									alignSelf: 'center',
									marginLeft: 15,
								}}
								customImageStyle={{ resizeMode: 'cover', borderRadius: 50 }}
								source={{ uri: datapost.user.picture }}
							/>
							<View
								style={{
									justifyContent: 'center',
									marginHorizontal: 10,
								}}>
								<Text
									style={{
										fontFamily: 'lato-bold',
										fontSize: 14,
										// marginTop: 7,
									}}>
									{datapost.user.first_name}{' '}
									{datapost.user.first_name ? datapost.user.last_name : null}
								</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
									}}>
									<Text
										style={{
											fontFamily: 'lato-reg',
											fontSize: 10,
											// marginTop: 7,
										}}>
										{duration(datapost.created_at)}
									</Text>
									{datapost.location_name ? (
										<View
											style={{
												marginHorizontal: 5,
												backgroundColor: 'black',
												height: 4,
												width: 4,
												borderRadius: 2,
											}}></View>
									) : null}
									{datapost.location_name ? (
										<Text
											style={{
												fontFamily: 'lato-reg',
												fontSize: 10,
												// marginTop: 7,
											}}>
											<Truncate text={datapost.location_name} length={40} />
										</Text>
									) : null}
								</View>
							</View>
							<TouchableOpacity
								onPress={() => console.log('datapost')}
								style={{
									position: 'absolute',
									right: 15,
									alignSelf: 'center',
								}}>
								<OptionsVertBlack height={20} width={20} />
							</TouchableOpacity>
						</View>

						<AutoHeightImage
							width={Dimensions.get('window').width}
							source={
								datapost && datapost.assets[0].filepath
									? { uri: datapost.assets[0].filepath }
									: default_image
							}
						/>
						{/* </View> */}

						<View
							style={{
								flexDirection: 'row',
								marginTop: 10,
								backgroundColor: '#ffffff',
								borderBottomColor: '#209FAE',
								borderBottomWidth: 1,
								marginHorizontal: 10,
								// height: Dimensions.get('screen').height / 3,
							}}>
							<TextInput
								multiline
								placeholder={'Write a caption..'}
								maxLength={255}
								style={{
									height: 75,
									width: (Dimensions.get('screen').width * 80) / 100,
									// borderBottomColor: '#f0f0f0f0',
									// borderBottomWidth: 1,
								}}
								onChangeText={(text) => _setStatusText(text)}
								value={statusText}
							/>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</ScrollView>
			<LocationSelector
				modals={modellocation}
				setModellocation={(e) => setModellocation(e)}
				masukan={(e) => _setLocation(e)}
			/>
		</KeyboardAvoidingView>
	);
}

EditPost.navigationOptions = ({ navigation }) => {
	const { params } = navigation.state;
	return {
		headerTitle: 'New Post',
		headerMode: 'screen',
		headerStyle: {
			zIndex: 20,
			backgroundColor: '#209FAE',
			elevation: 0,
			borderBottomWidth: 0,
			fontSize: 50,
		},
		headerTitleStyle: {
			fontFamily: 'lato-reg',
			fontSize: 14,
			color: 'white',
			alignSelf: 'center',
		},
		headerLeft: () =>
			CustomImage({
				customStyle: { width: 20, height: 20 },
				customImageStyle: { width: 20, height: 20, resizeMode: 'contain' },
				isTouchable: true,
				onPress: () => navigation.goBack(),
				source: back_arrow_white,
			}),
		headerLeftContainerStyle: {
			paddingLeft: 20,
		},
		headerRight: () => {
			return (
				<TouchableOpacity
					onPress={() => {
						params.SubmitData(navigation.getParam('text'));
					}}
					style={{
						paddingRight: 10,
						flexDirection: 'row',
						alignContent: 'center',
						alignItems: 'center',
					}}>
					<Text
						allowFontScaling={false}
						style={{
							color: '#FFF',
							// fontWeight: 'bold',
							fontFamily: 'lato-bold',
							fontSize: 14,
							marginHorizontal: 10,
							marginVertical: 10,
						}}>
						SAVE
					</Text>
					<CheckWhite width={20} height={20} />
				</TouchableOpacity>
			);
		},
		headerRightStyle: {
			marginRight: 20,
		},
	};
};
