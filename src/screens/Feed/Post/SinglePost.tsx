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
import { Text, Button } from '../../../Component';

import Loading from '../Loading';
import {
	Comment,
	LikeRed,
	LikeEmpty,
	PostButton,
	OptionsVertBlack,
	ShareBlack,
	Kosong,
	Arrowbackwhite,
	OptionsVertWhite,
	Search,
	CheckWhite,
	SearchWhite,
} from '../../../const/Svg';
import Ripple from 'react-native-material-ripple';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Truncate from '../../../utils/Truncate';
import { useTranslation } from 'react-i18next';
import likepost from '../../../graphQL/Mutation/Post/likepost';
import unlikepost from '../../../graphQL/Mutation/Post/unlikepost';
import Modal from 'react-native-modal';
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
const GetFeedPostSingle = gql`
	query($post_id: ID!) {
		feed_post_byid(post_id: $post_id) {
			id
			caption
			longitude
			latitude
			location_name
			liked
			comment_count
			response_count
			created_at
			updated_at
			assets {
				id
				type
				filepath
			}
			user {
				id
				username
				first_name
				last_name
				picture
				ismyfeed
			}
		}
	}
`;
const deletepost = gql`
	mutation($post_id: ID!) {
		delete_post(post_id: $post_id) {
			id
			response_time
			message
			code
		}
	}
`;

export default function SinglePost(props) {
	const { t, i18n } = useTranslation();
	let [postid, SetPostID] = useState(props.navigation.getParam('post_id'));
	let [selectedOption, SetOption] = useState({});
	let [modalmenu, setModalmenu] = useState(false);
	let [modalmenuother, setModalmenuother] = useState(false);
	let [modalhapus, setModalhapus] = useState(false);
	let [setting, setSetting] = useState();
	const [token, setToken] = useState();
	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem('access_token');
		setToken(tkn);
		let setsetting = await AsyncStorage.getItem('setting');
		setSetting(JSON.parse(setsetting));
		await LoadFeed();
	};
	const [LoadFeed, { data, loading, error }] = useLazyQuery(GetFeedPostSingle, {
		fetchPolicy: 'network-only',
		variables: { post_id: postid },
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});
	console.log(data?.feed_post_byid.user.picture);
	const [
		MutationLike,
		{ loading: loadingLike, data: dataLike, error: errorLike },
	] = useMutation(likepost, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const [
		MutationunLike,
		{ loading: loadingunLike, data: dataunLike, error: errorunLike },
	] = useMutation(unlikepost, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const [
		Mutationdeletepost,
		{ loading: loadingdelete, data: datadelete, error: errordelete },
	] = useMutation(deletepost, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const _liked = async (id) => {
		// console.log(id);
		if (token || token !== '') {
			// var tempData = [...datafeed];
			// var index = tempData.findIndex((k) => k['id'] === id);
			// tempData[index].liked = true;
			// tempData[index].response_count = tempData[index].response_count + 1;
			// SetDataFeed(tempData);
			try {
				let response = await MutationLike({
					variables: {
						post_id: id,
					},
				});
				if (loadingLike) {
					Alert.alert('Loading!!');
				}
				if (errorLike) {
					throw new Error('Error Input');
				}
				if (response.data) {
					if (
						response.data.like_post.code === 200 ||
						response.data.like_post.code === '200'
					) {
						LoadFeed();
						// _Refresh();
						// var tempData = [...datafeed];
						// var index = tempData.findIndex((k) => k['id'] === id);
						// tempData[index].liked = true;
						// tempData[index].response_count = response.data.like_post.count_like;
						// SetDataFeed(tempData);
					} else {
						LoadFeed();
						// var tempData = [...datafeed];
						// var index = tempData.findIndex((k) => k['id'] === id);
						// tempData[index].liked = false;
						// tempData[index].response_count = tempData[index].response_count - 1;
						// SetDataFeed(tempData);
						throw new Error(response.data.like_post.message);
					}

					// Alert.alert('Succes');
				}
			} catch (error) {
				// var tempData = [...datafeed];
				// var index = tempData.findIndex((k) => k['id'] === id);
				// tempData[index].liked = false;
				// tempData[index].response_count = tempData[index].response_count - 1;
				// SetDataFeed(tempData);
				// console.log(error);
				Alert.alert('' + error);
			}
		} else {
			Alert.alert('Please Login');
		}
	};

	const _unliked = async (id) => {
		// var tempData = [...datafeed];
		// var index = tempData.findIndex((k) => k['id'] === id);
		// tempData[index].liked = false;
		// tempData[index].response_count = tempData[index].response_count - 1;
		// SetDataFeed(tempData);
		if (token || token !== '') {
			try {
				let response = await MutationunLike({
					variables: {
						post_id: id,
					},
				});
				if (loadingunLike) {
					Alert.alert('Loading!!');
				}
				if (errorunLike) {
					throw new Error('Error Input');
				}

				if (response.data) {
					if (
						response.data.unlike_post.code === 200 ||
						response.data.unlike_post.code === '200'
					) {
						LoadFeed();
						// _Refresh();
						// var tempData = [...datafeed];
						// var index = tempData.findIndex((k) => k['id'] === id);
						// tempData[index].liked = false;
						// tempData[index].response_count =
						// 	response.data.unlike_post.count_like;
						// SetDataFeed(tempData);
					} else {
						throw new Error(response.data.unlike_post.message);
					}

					// Alert.alert('Succes');
				}
			} catch (error) {
				Alert.alert('' + error);
			}
		} else {
			// tempData[index].liked = true;
			// tempData[index].response_count = tempData[index].response_count + 1;
			// SetDataFeed(tempData);
			Alert.alert('Please Login');
		}
	};
	// const _alertDelete = () =>{

	// }
	const _deletepost = async (data) => {
		setModalhapus(false);
		setModalmenu(false);
		// var tempData = [...datafeed];
		// var index = tempData.findIndex((k) => k['id'] === id);

		// SetDataFeed(tempData);
		if (token || token !== '') {
			try {
				let response = await Mutationdeletepost({
					variables: {
						post_id: data.id,
					},
				});
				if (loadingunLike) {
					Alert.alert('Loading!!');
				}
				if (errorunLike) {
					throw new Error('Error Input');
				}

				// console.log(response);
				if (response.data) {
					if (
						response.data.delete_post.code === 200 ||
						response.data.delete_post.code === '200'
					) {
						props.navigation.push('Feed');
						// Refresh();
						// var tempData = [...datafeed];
						// var index = tempData.findIndex((k) => k['id'] === id);
						// tempData[index].liked = false;
						// tempData[index].response_count =
						// 	response.data.delete_post.count_like;
						// SetDataFeed(tempData);
					} else {
						throw new Error(response.data.delete_post.message);
					}

					// Alert.alert('Succes');
				}
			} catch (error) {
				Alert.alert('' + error);
			}
		} else {
			// tempData[index].liked = true;
			// tempData[index].response_count = tempData[index].response_count + 1;
			// SetDataFeed(tempData);
			Alert.alert('Please Login');
		}
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

	useEffect(() => {
		loadAsync();
	}, []);

	let [liked, setLiked] = useState(false);

	const createPost = () => {
		props.navigation.push('Post');
	};

	const viewcomment = (data) => {
		props.navigation.navigate('comment', {
			data: data.feed_post_byid,
			token: token,
		});
		// console.log(id_post);
	};

	const [selected, setSelected] = useState(new Map());

	const OptionOpen = (data) => {
		// console.log();
		SetOption(data);
		if (data.user.ismyfeed == true) {
			setModalmenu(true);
		} else {
			setModalmenuother(true);
		}
	};

	return (
		<ScrollView>
			<Modal
				onBackdropPress={() => {
					setModalmenu(false);
				}}
				onRequestClose={() => setModalmenu(false)}
				onDismiss={() => setModalmenu(false)}
				animationIn='fadeIn'
				animationOut='fadeOut'
				isVisible={modalmenu}
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					alignSelf: 'center',
					alignContent: 'center',
				}}>
				<View
					style={{
						backgroundColor: 'white',
						width: Dimensions.get('screen').width - 80,
						padding: 20,
					}}>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
						}}
						onPress={() => {
							console.log(data);
						}}>
						<Text size='description' type='regular' style={{}}>
							{t('shareTo')}...
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
						}}
						onPress={() => {
							setModalmenu(false),
								props.navigation.push('EditPost', {
									datapost: selectedOption,
								});
						}}>
						<Text size='description' type='regular' style={{}}>
							{t('edit')}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
						}}
						onPress={() => {
							setModalmenu(false), setModalhapus(true);
						}}>
						<Text
							size='description'
							type='regular'
							style={{ color: '#d75995' }}>
							{t('delete')}
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
				onBackdropPress={() => {
					setModalmenuother(false);
				}}
				onRequestClose={() => setModalmenuother(false)}
				onDismiss={() => setModalmenuother(false)}
				animationIn='fadeIn'
				animationOut='fadeOut'
				isVisible={modalmenuother}
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					alignSelf: 'center',
					alignContent: 'center',
				}}>
				<View
					style={{
						backgroundColor: 'white',
						width: Dimensions.get('screen').width - 80,
						padding: 20,
					}}>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
						}}
						onPress={() => {
							setModalmenuother(false);
						}}>
						<Text
							size='description'
							type='regular'
							style={{ color: '#d75995' }}>
							{t('reportThisPost')}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
						}}
						onPress={() => {
							setModalmenuother(false);
						}}>
						<Text size='description' type='regular' style={{}}>
							{t('blockUser')}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
						}}
						onPress={() => {}}>
						<Text size='description' type='regular' style={{}}>
							{t('copyLink')}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
						}}
						onPress={() => {
							setModalmenuother(false);
						}}>
						<Text size='description' type='regular' style={{}}>
							{t('unfollow')}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
						}}
						onPress={() => {
							setModalmenuother(false);
						}}>
						<Text size='description' type='regular' style={{}}>
							{t('hidePost')}
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
				onBackdropPress={() => {
					setModalhapus(false);
				}}
				onRequestClose={() => setModalhapus(false)}
				onDismiss={() => setModalhapus(false)}
				animationIn='fadeIn'
				animationOut='fadeOut'
				isVisible={modalhapus}
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					alignSelf: 'center',
					alignContent: 'center',
				}}>
				<View
					style={{
						backgroundColor: 'white',
						width: Dimensions.get('screen').width - 60,
						padding: 20,
					}}>
					<Text>{t('alertHapusPost')}</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingVertical: 20,
							paddingHorizontal: 40,
						}}>
						<Button
							onPress={() => {
								_deletepost(selectedOption);
							}}
							color='primary'
							text={t('delete')}></Button>
						<Button
							onPress={() => {
								setModalhapus(false);
							}}
							color='secondary'
							variant='bordered'
							text={t('cancel')}></Button>
					</View>
				</View>
			</Modal>

			<View
				style={{
					width: Dimensions.get('window').width,
					backgroundColor: '#FFFFFF',
					flex: 1,
					borderBottomWidth: 1,
					borderBottomColor: '#EEEEEE',
					paddingBottom: 20,
				}}>
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
						onPress={() => {
							data?.feed_post_byid.user.id !== setting?.user?.id
								? props.navigation.push('otherprofile', {
										idUser: data?.feed_post_byid.user.id,
								  })
								: props.navigation.push('ProfileTab');
						}}
						customStyle={{
							height: 35,
							width: 35,
							borderRadius: 15,
							alignSelf: 'center',
							marginLeft: 15,
						}}
						customImageStyle={{ resizeMode: 'cover', borderRadius: 50 }}
						source={{
							uri: data?.feed_post_byid?.user?.picture,
						}}
					/>
					<View
						style={{
							justifyContent: 'center',
							marginHorizontal: 10,
						}}>
						<Text
							onPress={() => {
								data?.feed_post_byid.user.id !== setting?.user?.id
									? props.navigation.push('otherprofile', {
											idUser: data?.feed_post_byid.user.id,
									  })
									: props.navigation.push('ProfileTab');
							}}
							style={{
								fontFamily: 'lato-bold',
								fontSize: 14,
								// marginTop: 7,
							}}>
							{data?.feed_post_byid.user.first_name}{' '}
							{data?.feed_post_byid.user.first_name
								? data?.feed_post_byid.user.last_name
								: null}
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
								{duration(data?.feed_post_byid.created_at)}
							</Text>
							{data?.feed_post_byid.location_name ? (
								<View
									style={{
										marginHorizontal: 5,
										backgroundColor: 'black',
										height: 4,
										width: 4,
										borderRadius: 2,
									}}></View>
							) : null}
							{data?.feed_post_byid.location_name ? (
								<Text
									style={{
										fontFamily: 'lato-reg',
										fontSize: 10,
										// marginTop: 7,
									}}>
									<Truncate
										text={data?.feed_post_byid.location_name}
										length={40}
									/>
								</Text>
							) : null}
						</View>
					</View>
					<TouchableOpacity
						onPress={() => OptionOpen(data?.feed_post_byid)}
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
					source={{ uri: data?.feed_post_byid.assets[0]?.filepath }}
				/>

				<View
					style={{
						width: '100%',
						backgroundColor: 'white',
					}}>
					<View
						style={{
							width: '100%',
							padding: 10,
							flexDirection: 'row',
						}}>
						{/* <Text
							style={{
								textAlign: 'left',
								fontFamily: 'lato-bold',
								fontSize: 14,
								color: '#616161',
								marginRight: 5,
							}}>
							{data?.feed_post_byid.user.first_name} {''}{' '}
							{data?.feed_post_byid.user.first_name ? data?.feed_post_byid.user.last_name : null}
						</Text> */}
						{data?.feed_post_byid.caption ? (
							<Text
								style={{
									textAlign: 'left',
									fontFamily: 'lato-reg',
									fontSize: 14,
									lineHeight: 20,
								}}>
								<Text
									style={{
										fontFamily: 'lato-bold',
										marginRight: 5,
									}}>
									{data?.feed_post_byid.user.first_name}{' '}
									{data?.feed_post_byid.user.first_name
										? data?.feed_post_byid.user.last_name
										: null}{' '}
								</Text>
								{data?.feed_post_byid.caption}
							</Text>
						) : null}
					</View>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: 'white',
							justifyContent: 'space-between',
							paddingHorizontal: 10,
						}}>
						<View
							style={{
								flexDirection: 'row',
								width: '50%',
								alignSelf: 'flex-start',
								alignContent: 'space-between',
								alignItems: 'center',
								// justifyContent: 'space-evenly',
							}}>
							{data?.feed_post_byid.liked ? (
								<Button
									onPress={() => _unliked(data?.feed_post_byid.id)}
									type='icon'
									variant='transparent'
									position='left'
									size='small'
									style={{
										paddingHorizontal: 2,
										marginRight: 10,

										// right: 10,
									}}>
									<LikeRed height={20} width={20} />
									<Text style={{ marginHorizontal: 3 }}>
										{data?.feed_post_byid.response_count}
									</Text>
								</Button>
							) : (
								<Button
									onPress={() => _liked(data?.feed_post_byid.id)}
									type='icon'
									variant='transparent'
									position='left'
									size='small'
									style={{
										paddingHorizontal: 2,
										marginRight: 10,
										// right: 10,
									}}>
									<LikeEmpty height={20} width={20} />
									<Text style={{ marginHorizontal: 3 }}>
										{data?.feed_post_byid.response_count}
									</Text>
								</Button>
							)}

							<Button
								onPress={() => viewcomment(data)}
								type='icon'
								variant='transparent'
								position='left'
								size='small'
								style={{
									paddingHorizontal: 2,

									// right: 10,
								}}>
								<Comment height={20} width={20} />
								<Text style={{ marginHorizontal: 3 }}>
									{data?.feed_post_byid.comment_count}
								</Text>
							</Button>
						</View>

						<Button
							type='icon'
							variant='transparent'
							position='left'
							size='small'
							style={{
								// right: 10,
								paddingHorizontal: 2,
							}}>
							<ShareBlack height={20} width={20} />
							<Text size='small' style={{ marginLeft: 3 }}>
								{t('share')}
							</Text>
						</Button>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

SinglePost.navigationOptions = ({ navigation }) => {
	const { params } = navigation.state;
	return {
		headerTitle: '',
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
						// params.SubmitData(navigation.getParam('text'));
					}}
					style={{
						paddingRight: 10,
						flexDirection: 'row',
						alignContent: 'center',
						alignItems: 'center',
					}}>
					{/* <Text
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
					<CheckWhite width={20} height={20} /> */}
				</TouchableOpacity>
			);
		},
		headerRightStyle: {
			marginRight: 20,
		},
	};
};
