import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	FlatList,
	Button,
	TouchableOpacity,
	Image,
	Dimensions,
	Alert,
	TextInput,
	Pressable,
	Keyboard,
	AsyncStorage,
} from 'react-native';
import { Input, CustomText, Calendar, CustomImage } from '../../../core-ui';
import { Text } from 'native-base';
import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import CommentList from '../../../graphQL/Query/Feed/CommentList';
import { NavigationEvents, SafeAreaView } from 'react-navigation';
import commentpost from '../../../graphQL/Mutation/Post/commentpost';
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
} from '../../../const/Svg';
export default function Comments(props) {
	let [statusText, setStatusText] = useState('');
	let [selected, setSelected] = useState(new Map());
	let [dataPost, setDataPost] = useState(props.navigation.getParam('data'));
	let [token, setToken] = useState(props.navigation.getParam('token'));
	let slider = useRef();
	let [setting, setSetting] = useState();
	// console.log(setting?.user?.first_name);
	const onSelect = useCallback(
		(id) => {
			let newSelected = new Map(selected);
			newSelected.set(id, !selected.get(id));
			setLiked(!liked);
			likeToggle(liked);
			setSelected(newSelected);
		},
		[selected],
	);

	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem('access_token');
		setToken(tkn);

		// await GetDataSetting();
		// if (datas && datas.setting_data) {
		// 	await AsyncStorage.setItem('setting', JSON.stringify(datas.setting_data));
		// }

		let setsetting = await AsyncStorage.getItem('setting');
		setSetting(JSON.parse(setsetting));
	};

	useEffect(() => {
		loadAsync();
	}, []);

	const [
		MutationComment,
		{ loading: loadingLike, data: dataLike, error: errorLike },
	] = useMutation(commentpost, {
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const comment = async (id, text) => {
		Keyboard.dismiss();
		if ((token || token !== '') && text !== '') {
			try {
				let response = await MutationComment({
					variables: {
						post_id: id,
						text: text,
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
						response.data.comment_post.code === 200 ||
						response.data.comment_post.code === '200'
					) {
						setStatusText('');

						GetCommentList();
						scroll_to();
					} else {
						throw new Error(response.data.comment_post.message);
					}

					// Alert.alert('Succes');
				}
			} catch (error) {
				// console.log(error);
				Alert.alert('' + error);
			}
		} else {
			Alert.alert('Please Insert a Text');
		}
	};

	const scroll_to = () => {
		// GetCommentList();
		if (loading == true) {
			// console.log(loading);
			scroll_to();
		}
		if (loading == false) {
			// console.log(loading);
			wait(1000).then(() => {
				slider.current.scrollToEnd();
			});
		}
	};

	const wait = (timeout) => {
		return new Promise((resolve) => {
			setTimeout(resolve, timeout);
		});
	};

	// console.log(props.navigation.getParam('post_id'));
	const [GetCommentList, { data, loading, error }] = useLazyQuery(CommentList, {
		fetchPolicy: 'network-only',
		variables: { post_id: dataPost.id },
		context: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	});

	// console.log(loading);

	if (data) {
		// console.log(data.comment[0].text);
	}

	let [liked, setLiked] = useState(false);

	const likeToggle = (value) => {
		if (value == true) {
			console.log('liked: ');
		} else {
			console.log('unliked: ');
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
			return yrs + ' tahun yang lalu';
		}
		if (days > 0) {
			return days + ' hari yang lalu';
		}
		if (hrs > 0) {
			return hrs + ' jam yang lalu';
		}
		if (mins > 0) {
			return mins + ' menit yang lalu';
		} else {
			return 'baru saja';
		}
		return days + ' Days, ' + hrs + ' Hours, ' + mins + ' Minutes';
	};

	// const likeChange = () => {
	// 	onSelect('selected'), setLiked(!liked);
	// 	likeToggle(liked);
	// };

	const Item = ({ dataComment }) => {
		return (
			<View
				style={{
					// width: Dimensions.get('window').width,
					backgroundColor: '#FFFFFF',
					// flex: 1,
					// borderBottomWidth: 1,
					// borderBottomColor: '#EEEEEE',
					marginHorizontal: 15,
					marginVertical: 10,
				}}>
				<View
					style={{
						width: '100%',
						flexDirection: 'row',
						// marginVertical: 10,
						alignContent: 'center',
					}}>
					<View
						style={{
							flexDirection: 'row',
						}}>
						<CustomImage
							isTouchable
							onPress={() => {
								dataComment.user.id !== setting?.user?.id
									? props.navigation.push('otherprofile', {
											idUser: dataComment.user.id,
									  })
									: props.navigation.push('ProfileTab');
							}}
							customStyle={{
								height: 35,
								width: 35,
								borderRadius: 15,
								alignSelf: 'center',
							}}
							customImageStyle={{ resizeMode: 'cover', borderRadius: 50 }}
							source={{ uri: dataComment.user?.picture }}
						/>
						<View
							style={{
								justifyContent: 'center',
								marginHorizontal: 10,
							}}>
							<Text
								onPress={() => {
									dataComment.user.id !== setting?.user?.id
										? props.navigation.push('otherprofile', {
												idUser: dataComment.user.id,
										  })
										: props.navigation.push('ProfileTab');
								}}
								allowFontScaling={false}
								style={{
									fontFamily: 'lato-bold',
									fontSize: 14,
									// marginTop: 7,
								}}>
								{dataComment.user?.first_name} {dataComment.user?.last_name}
							</Text>
							<Text
								allowFontScaling={false}
								style={{
									fontFamily: 'lato-reg',
									fontSize: 10,
									// marginTop: 7,
								}}>
								{duration(dataComment.created_at)}
							</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						width: '100%',
						marginVertical: 5,
						// marginLeft: 45,
					}}>
					<Text
						allowFontScaling={false}
						style={{
							textAlign: 'left',
							fontFamily: 'lato-reg',
							fontSize: 14,
							color: '#616161',
						}}>
						{dataComment.text}
					</Text>
				</View>
			</View>
		);
	};

	return (
		<View
			style={{
				flex: 1,
			}}>
			<NavigationEvents onDidFocus={() => GetCommentList()} />
			<View
				style={{
					// width: Dimensions.get('window').width,
					backgroundColor: '#FFFFFF',
					// flex: 1,
					borderBottomWidth: 1,
					borderBottomColor: '#EEEEEE',
					marginHorizontal: 15,
					marginTop: 15,
				}}>
				<View
					style={{
						width: '100%',
						flexDirection: 'row',
						marginVertical: 10,
						alignContent: 'center',
					}}>
					<View
						style={{
							flexDirection: 'row',
						}}>
						<CustomImage
							isTouchable
							onPress={() => {
								dataPost.user.id !== setting?.user?.id
									? props.navigation.push('otherprofile', {
											idUser: dataPost.user.id,
									  })
									: props.navigation.push('ProfileTab');
							}}
							customStyle={{
								height: 35,
								width: 35,
								borderRadius: 15,
								alignSelf: 'center',
							}}
							customImageStyle={{ resizeMode: 'cover', borderRadius: 50 }}
							source={{ uri: dataPost.user.picture }}
						/>
						<View
							style={{
								justifyContent: 'center',
								marginHorizontal: 10,
							}}>
							<Text
								onPress={() => {
									dataPost.user.id !== setting?.user?.id
										? props.navigation.push('otherprofile', {
												idUser: dataPost.user.id,
										  })
										: props.navigation.push('ProfileTab');
								}}
								allowFontScaling={false}
								style={{
									fontFamily: 'lato-bold',
									fontSize: 14,
									// marginTop: 7,
								}}>
								{dataPost.user.first_name}{' '}
								{dataPost.user.first_name ? dataPost.user.last_name : null}
							</Text>
							<Text
								allowFontScaling={false}
								style={{
									fontFamily: 'lato-reg',
									fontSize: 10,
									// marginTop: 7,
								}}>
								{duration(dataPost.created_at)}
							</Text>
						</View>
					</View>
					<TouchableOpacity
						style={{
							position: 'absolute',
							right: 0,
							alignSelf: 'center',
						}}>
						<OptionsVertBlack height={20} width={20} />
					</TouchableOpacity>
				</View>
				<View
					style={{
						width: '100%',
						marginVertical: 15,
					}}>
					<Text
						allowFontScaling={false}
						style={{
							textAlign: 'left',
							fontFamily: 'lato-reg',
							fontSize: 14,
							color: '#616161',
						}}>
						{dataPost.caption}
					</Text>
				</View>
			</View>

			{/* <View> */}
			<FlatList
				ref={slider}
				data={data ? data.comment : null}
				renderItem={({ item }) => {
					return <Item dataComment={item} />;
				}}
				keyExtractor={(item) => item.id}
				extraData={selected}
			/>
			{/* <View
					style={{
						flex: 1,
						flexDirection: 'row',
						height: 60,
						width: Dimensions.get('screen').width,
					}}
				/> */}
			{/* </View> */}
			<View
				style={{
					flexDirection: 'row',
					// marginTop: 25,
					backgroundColor: '#F0F0F0',
					// height: 100,
					width: Dimensions.get('screen').width,
					// position: 'absolute',
					// bottom: 0,
					alignItems: 'center',
					// justifyContent: 'space-around',
				}}>
				<TextInput
					allowFontScaling={false}
					multiline
					placeholder={'Comment as ' + setting?.user?.first_name + '...'}
					maxLength={255}
					style={{
						height: 60,
						width: (Dimensions.get('screen').width * 80) / 100,
						// borderBottomColor: '#f0f0f0f0',
						// borderWidth: 1,
						marginLeft: 20,
					}}
					onChangeText={(text) => setStatusText(text)}
					value={statusText}
				/>
				<Pressable
					onPress={() => comment(dataPost.id, statusText)}
					style={{
						flex: 1,
						// borderWidth: 1,
						height: 60,
						// alignSelf: 'center',
						alignItems: 'center',
						justifyContent: 'center',
						paddingRight: 10,
					}}>
					<Text
						allowFontScaling={false}
						style={{
							alignSelf: 'center',
							fontFamily: 'lato-bold',
							fontSize: 15,
							color: '#209fae',
						}}>
						Post
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

Comments.navigationOptions = ({ navigation }) => ({
	headerTitle: 'Comments',
	headerMode: 'screen',
	headerStyle: {
		backgroundColor: '#209FAE',
		elevation: 0,
		borderBottomWidth: 0,
		fontSize: 50,
		// justifyContent: 'center',
		// flex:1,
		// zIndex: 30,
	},
	headerTitleStyle: {
		fontFamily: 'lato-reg',
		fontSize: 14,
		color: 'white',
		alignSelf: 'center',
	},
	headerLeft: (
		<TouchableOpacity
			style={{
				height: 40,
				width: 40,
				// borderWidth:1,
				justifyContent: 'center',
				alignContent: 'center',
				alignItems: 'center',
				// backgroundColor:'white'
			}}
			onPress={() => navigation.goBack()}>
			<Arrowbackwhite height={20} width={20}></Arrowbackwhite>
		</TouchableOpacity>
	),
	headerLeftContainerStyle: {
		// paddingLeft: 20,
	},
	headerRight: (
		<View style={{ flexDirection: 'row' }}>
			{/* <TouchableOpacity
				style={{ marginRight: 20 }}
				onPress={() => Alert.alert('Coming soon')}>
				<OptionsVertWhite height={20} width={20} />
			</TouchableOpacity> */}
		</View>
	),
	headerRightStyle: {
		paddingRight: 20,
	},
});

const styles = StyleSheet.create({
	main: {
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'grey',
	},
	captionFont: { fontSize: 12 },
});
