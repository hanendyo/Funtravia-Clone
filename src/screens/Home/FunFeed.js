import React, { useState, useRef, useEffect } from "react";
import {
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery } from "@apollo/react-hooks";
import FeedPopuler from "../../graphQL/Query/Home/FeedPopuler";
import RenderPost from "./RenderPost";

const { width, height } = Dimensions.get("screen");
export default function SearchFeed({ props }) {
	let [token, setToken] = useState("");
	let [users, setuser] = useState(null);

	const [
		querySearchPost,
		{ loading: loadingPost, data: dataPost, error: errorPost },
	] = useLazyQuery(FeedPopuler, {
		variables: {
			limit: 5,
			offset: null,
		},
		fetchPolicy: "network-only",
	});

	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		setToken(tkn);
		let user = await AsyncStorage.getItem("setting");
		user = JSON.parse(user);
		setuser(user.user);

		querySearchPost();
	};
	useEffect(() => {
		loadAsync();
	}, []);

	return (
		<>
			{dataPost && dataPost.feed_post_populer.length > 0 ? (
				<FlatList
					contentContainerStyle={{
						marginTop: 10,
						marginBottom: 30,
						paddingStart: 20,
						paddingEnd: 15,
					}}
					horizontal
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					data={dataPost ? dataPost.feed_post_populer : null}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							style={{
								marginRight: 7,
								marginLeft: 0,
								borderRadius: 5,
							}}
							onPress={() =>
								props.navigation.navigate("FeedStack", {
									screen: "CommentsById",
									params: {
										post_id: item.id,
										token: token,
									},
								})
							}
						>
							<RenderPost
								data={item}
								user={users}
								navigation={props.navigation}
							/>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => "FUNFEED_" + item.id}
				/>
			) : null}
		</>
	);
}

const styles = StyleSheet.create({
	main: {
		height: (width / 2 - 20) * 1.5,
		width: width / 2 - 20,
		backgroundColor: "white",
		borderRadius: 5,
		marginLeft: 10,
		flexDirection: "row",
		shadowColor: "#6F7273",
		shadowOffset: { width: 3, height: 3 },
		shadowOpacity: 1,
		shadowRadius: 10,
		elevation: 3,
	},
	modalScroll: {
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
		flexDirection: "row",
		alignItems: "center",
		alignContent: "center",
		alignSelf: "center",
		justifyContent: "center",
		backgroundColor: "black",
	},
});
