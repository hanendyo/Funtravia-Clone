import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Dimensions,
	Text,
	Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomImage, shareAction } from "../../component";
import { NetworkStatus } from "@apollo/client";
import {
	Comment,
	LikeRed,
	LikeEmpty,
	PostButton,
	OptionsVertBlack,
	ShareBlack,
	Kosong,
	SearchWhite,
} from "../../assets/svg";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import AutoHeightImage from "react-native-auto-height-image";
import likepost from "../../graphQL/Mutation/Post/likepost";
import FeedPost from "../../graphQL/Query/Feed/FeedPost";
import FeedList from "./FeedList";

export default function Feed(props) {
	const HeaderComponent = {
		headerShown: true,
		transparent: false,
		tabBarVisble: false,
		tabBarLabel: "Feed",
		headerTintColor: "white",
		headerTitle: "Fun Feed",
		headerMode: "screen",
		headerStyle: {
			backgroundColor: "#209FAE",
			elevation: 0,
			borderBottomWidth: 0,
		},
		headerTitleStyle: {
			fontFamily: "Lato-Bold",
			fontSize: 14,
			color: "white",
		},
		headerLeftContainerStyle: {
			background: "#FFF",
		},
		headerRight: () => (
			<View style={{ flexDirection: "row" }}>
				<TouchableOpacity
					style={{ marginRight: 20 }}
					onPress={() =>
						props.navigation.navigate("FeedStack", { screen: "SearchPageFeed" })
					}
				>
					<SearchWhite height={20} width={20} />
				</TouchableOpacity>
			</View>
		),
	};

	// const GetFeedPost = gql`
	// 	query($offset: Int) {
	// 		feed_post(limit: 5, offset:$offset) {
	// 			id
	// 			caption
	// 			longitude
	// 			latitude
	// 			location_name
	// 			liked
	// 			comment_count
	// 			response_count
	// 			created_at
	// 			updated_at
	// 			assets {
	// 				id
	// 				type
	// 				filepath
	// 			}
	// 			user {
	// 				id
	// 				username
	// 				first_name
	// 				last_name
	// 				picture
	// 				ismyfeed
	// 			}
	// 		}
	// 	}
	// `;

	const [token, setToken] = useState();
	// console.log(token);
	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		setToken(tkn);
		if (tkn === null) {
			Alert.alert("Silahkan Login terlebih dahulu");
			props.navigation.navigate("HomeScreen");
		}
		LoadFeed();
	};

	useEffect(() => {
		props.navigation.setOptions(HeaderComponent);
		loadAsync();
		// const unsubscribe = props.navigation.addListener("focus", (data) => {
		// });
		// return unsubscribe;
	}, [props.navigation]);

	// const eventDidFocus = (event) => {
	// 	// console.log(event);
	// 	if (event == 'Navigation/JUMP_TO' || event == 'Navigation/NAVIGATE') {
	// 		loadAsync();
	// 	}
	// };

	const [
		LoadFeed,
		{ data, loading, error, fetchMore, refetch, networkStatus },
	] = useLazyQuery(FeedPost, {
		fetchPolicy: "network-only",
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
		variables: {
			offset: 0,
		},
		notifyOnNetworkStatusChange: true,
	});

	if (networkStatus === NetworkStatus.refetch) {
		return console.log("Refetching");
	}
	const ambil_lagi = () => {
		fetchMore({
			variables: {
				offset: 10,
			},
		});
	};

	const [
		MutationLike,
		{ loading: loadingLike, data: dataLike, error: errorLike },
	] = useMutation(likepost, {
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const _liked = async (id) => {
		if (token || token !== "") {
			try {
				let response = await MutationLike({
					variables: {
						post_id: id,
					},
				});
				if (loadingLike) {
					Alert.alert("Loading!!");
				}
				if (errorLike) {
					throw new Error("Error Input");
				}

				if (response.data) {
					if (
						response.data.like_post.code === 200 ||
						response.data.like_post.code === "200"
					) {
						var tempData = [...dataEvent];
						var index = tempData.findIndex((k) => k["id"] === id);
						tempData[index].liked = true;
						setDataEvent(tempData);
					} else {
						throw new Error(response.data.setEvent_wishlist.message);
					}
				}
			} catch (error) {
				Alert.alert("" + error);
			}
		} else {
			Alert.alert("Please Login");
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
			return yrs + " tahun yang lalu";
		}
		if (days > 0) {
			return days + " hari yang lalu";
		}
		if (hrs > 0) {
			return hrs + " jam yang lalu";
		}
		if (mins > 0) {
			return mins + " menit yang lalu";
		} else {
			return "baru saja";
		}
		return days + " Days, " + hrs + " Hours, " + mins + " Minutes";
	};
	const ErrorPost = () => {
		return (
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					alignContent: "center",
					height: "100%",
				}}
			>
				<Text
					style={{ fontSize: 20, fontFamily: "Lato-Bold", color: "#646464" }}
				>
					Oopss...
				</Text>
				<Text
					style={{ fontSize: 20, fontFamily: "Lato-Regular", color: "#646464" }}
				>
					No Posts Here
				</Text>
				<Text
					style={{ fontSize: 20, fontFamily: "Lato-Regular", color: "#646464" }}
				>
					Add a Post!
				</Text>
				<Kosong
					height={Dimensions.get("screen").width * 0.6}
					width={Dimensions.get("screen").width}
				/>
				<TouchableOpacity style={styles.fab} onPress={createPost}>
					<PostButton height={50} width={50} />
				</TouchableOpacity>
			</View>
		);
	};
	// console.log(token);
	if (error) {
		console.log(error);

		// Alert.alert('please Login/Sign Up to view Profile');
	}
	if (loading) {
		console.log("is Loading Feed" + loading);
	}
	if (data) {
		console.log(data ? data.feed_post.id : "oops");
	}

	let [liked, setLiked] = useState(false);

	let data_id = data ? data.feed_post.id : "data_id";

	const createPost = () => {
		props.navigation.navigate("FeedStack", {
			screen: "Post",
		});
	};

	const likeToggle = (value) => {
		if (value === true) {
			console.log("liked: " + data_id);
		} else {
			console.log("disliked: " + data_id);
		}
	};

	const _likeChange = () => {
		onSelect(data_id), setLiked(!liked);
		likeToggle(liked);
	};

	const comment = (id_post, caption, image_post, username) => {
		props.navigation.navigate("comment", {
			id_post,
			caption,
			image_post,
			username,
		});
	};

	const [selected, setSelected] = useState(new Map());

	const onSelect = React.useCallback(
		(id_post) => {
			const newSelected = new Map(selected);
			newSelected.set(id_post, !selected.get(id_post));
			setLiked(!liked);
			likeToggle(liked);
			setSelected(newSelected);
		},
		[selected]
	);
	function Item({ selected, dataRender }) {
		// console.log(dataRender);
		return (
			<View
				style={{
					width: Dimensions.get("screen").width,
					flex: 1,
					borderBottomWidth: 1,
					borderBottomColor: "#EEEEEE",
					paddingBottom: 20,
				}}
			>
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						marginVertical: 15,
						// justifyContent: 'space-evenly',
						alignContent: "center",
					}}
				>
					<CustomImage
						isTouchable
						onPress={null}
						customStyle={{
							height: 35,
							width: 35,
							borderRadius: 15,
							alignSelf: "center",
							marginLeft: 15,
						}}
						customImageStyle={{ resizeMode: "cover", borderRadius: 50 }}
						source={{ uri: dataRender.user.picture }}
					/>
					<View
						style={{
							justifyContent: "center",
							marginHorizontal: 10,
						}}
					>
						<Text
							style={{
								fontFamily: "Lato-Bold",
								fontSize: 14,
							}}
						>
							{dataRender.user.first_name}{" "}
							{dataRender.user.first_name ? dataRender.user.last_name : null}
						</Text>
						<Text
							style={{
								fontFamily: "Lato-Regular",
								fontSize: 10,
							}}
						>
							{duration(dataRender.created_at)}
						</Text>
						<Text
							style={{
								fontFamily: "Lato-Regular",
								fontSize: 10,
							}}
						>
							{dataRender.location_name}
						</Text>
					</View>
					<TouchableOpacity
						style={{
							position: "absolute",
							right: 15,
							alignSelf: "center",
						}}
					>
						<OptionsVertBlack height={20} width={20} />
					</TouchableOpacity>
				</View>
				<AutoHeightImage
					width={Dimensions.get("window").width}
					source={{ uri: dataRender.assets[0]?.filepath }}
				/>
				<View
					style={{
						width: "100%",
					}}
				>
					<View
						style={{
							width: "100%",
							margin: 10,
						}}
					>
						<Text
							style={{
								textAlign: "left",
								fontFamily: "Lato-Regular",
								fontSize: 14,
								color: "#616161",
							}}
						>
							{dataRender.caption}
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",

							// backgroundColor: 'brown',
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "30%",
								alignSelf: "flex-start",
								alignContent: "space-between",
								alignItems: "center",
								justifyContent: "space-evenly",
							}}
						>
							<TouchableOpacity
								style={{ flexDirection: "row" }}
								onPress={() => onSelect(dataRender.id_post)}
							>
								{dataRender.liked ? (
									<LikeRed height={20} width={20} />
								) : (
									<LikeEmpty height={20} width={20} />
								)}

								<Text style={{ marginHorizontal: 3 }}>
									{dataRender.response_count}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{ flexDirection: "row" }}
								onPress={comment}
							>
								<Comment height={20} width={20} />

								<Text style={{ marginHorizontal: 3 }}>
									{dataRender.comment_count}
								</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							onPress={() =>
								shareAction({ from: "feed", target: dataRender.id })
							}
							style={{
								flexDirection: "row",
								position: "absolute",
								width: "50%",
								right: 10,
								justifyContent: "flex-end",
								alignContent: "center",
							}}
						>
							<ShareBlack height={20} width={20} />
							<Text>Share</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	const eventDidFocus = (event) => {
		// console.log(event);
		if (event == "Navigation/JUMP_TO" || event == "Navigation/NAVIGATE") {
			loadAsync();
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
			{token ? <FeedList props={props} token={token} /> : null}
			<TouchableOpacity style={styles.fab} onPress={createPost}>
				<PostButton height={50} width={50} />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "grey",
	},
	fab: {
		position: "absolute",
		bottom: 10,
		right: 10,
	},
});
