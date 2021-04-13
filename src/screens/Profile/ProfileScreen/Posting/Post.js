import React from "react";
import { View, Dimensions, Image, Pressable } from "react-native";
import { default_image } from "../../../../assets/png";
const { width, height } = Dimensions.get("screen");
import Video from "react-native-video";

export default function Posts({ item, index, navigation }) {
	if (item.length > 2) {
		if (item[3].grid == 1) {
			return (
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						justifyContent: "flex-start",
						paddingHorizontal: 2.5,
					}}
				>
					<Pressable
						onPress={() => {
							navigation.push("FeedStack", {
								screen: "CommentsById",
								params: {
									post_id: item[0].id,
								},
							});
						}}
						style={{
							width: ((width - 12) / 3) * 2,
							height: ((width - 12) / 3) * 2,
							margin: 2.5,
						}}
					>
						{item[0].assets[0].type === "video" ? (
							<Video
								poster={
									"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
								}
								source={{
									uri: item[0].assets[0].filepath,
								}}
								repeat={true}
								style={{
									width: "100%",
									height: "100%",
									backgroundColor: "#fff",
								}}
								resizeMode="cover"
								muted={true}
								paused={false}
							/>
						) : (
							<Image
								style={{
									width: "100%",
									height: "100%",
									borderRadius: 5,
								}}
								source={
									item[0].assets[0].filepath
										? { uri: item[0].assets[0].filepath }
										: default_image
								}
							/>
						)}
					</Pressable>
					<View>
						<Pressable
							onPress={() => {
								navigation.push("FeedStack", {
									screen: "CommentsById",
									params: {
										post_id: item[1].id,
									},
								});
							}}
							style={{
								width: (width - 20) / 3,
								height: (width - 20) / 3,
								margin: 2.5,
							}}
						>
							{item[1].assets[0].type === "video" ? (
								<Video
									poster={
										"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
									}
									source={{
										uri: item[1].assets[0].filepath,
									}}
									repeat={true}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: "#fff",
									}}
									resizeMode="cover"
									muted={true}
									paused={false}
								/>
							) : (
								<Image
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 5,
									}}
									source={
										item[1].assets[0].filepath
											? { uri: item[1].assets[0].filepath }
											: default_image
									}
								/>
							)}
						</Pressable>
						<Pressable
							onPress={() => {
								navigation.push("FeedStack", {
									screen: "CommentsById",
									params: {
										post_id: item[2].id,
									},
								});
							}}
							style={{
								width: (width - 20) / 3,
								height: (width - 20) / 3,
								margin: 2.5,
							}}
						>
							{item[2].assets[0].type === "video" ? (
								<Video
									poster={
										"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
									}
									source={{
										uri: item[2].assets[0].filepath,
									}}
									repeat={true}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: "#fff",
									}}
									resizeMode="cover"
									muted={true}
									paused={false}
								/>
							) : (
								<Image
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 5,
									}}
									source={
										item[2].assets[0].filepath
											? { uri: item[2].assets[0].filepath }
											: default_image
									}
								/>
							)}
						</Pressable>
					</View>
				</View>
			);
		} else if (item[3].grid == 2) {
			return (
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						justifyContent: "flex-start",
						paddingHorizontal: 2.5,
					}}
				>
					<View>
						<Pressable
							onPress={() => {
								navigation.push("FeedStack", {
									screen: "CommentsById",
									params: {
										post_id: item[0].id,
									},
								});
							}}
							style={{
								width: (width - 20) / 3,
								height: (width - 20) / 3,
								margin: 2.5,
							}}
						>
							{item[0].assets[0].type === "video" ? (
								<Video
									source={{
										uri: item[0].assets[0].filepath,
									}}
									repeat={true}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: "#fff",
									}}
									resizeMode="cover"
									muted={true}
									paused={false}
								/>
							) : (
								<Image
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 5,
									}}
									source={
										item[0].assets[0].filepath
											? { uri: item[0].assets[0].filepath }
											: default_image
									}
								/>
							)}
						</Pressable>
						<Pressable
							onPress={() => {
								navigation.push("FeedStack", {
									screen: "CommentsById",
									params: {
										post_id: item[1].id,
									},
								});
							}}
							style={{
								width: (width - 20) / 3,
								height: (width - 20) / 3,
								margin: 2.5,
							}}
						>
							{item[1].assets[0].type === "video" ? (
								<Video
									source={{
										uri: item[1].assets[0].filepath,
									}}
									repeat={true}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: "#fff",
									}}
									resizeMode="cover"
									muted={true}
									paused={false}
								/>
							) : (
								<Image
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 5,
									}}
									source={
										item[1].assets[0].filepath
											? { uri: item[1].assets[0].filepath }
											: default_image
									}
								/>
							)}
						</Pressable>
					</View>
					<Pressable
						onPress={() => {
							navigation.push("FeedStack", {
								screen: "CommentsById",
								params: {
									post_id: item[2].id,
								},
							});
						}}
						style={{
							width: ((width - 12) / 3) * 2,
							height: ((width - 12) / 3) * 2,
							margin: 2.5,
						}}
					>
						{item[2].assets[0].type === "video" ? (
							<Video
								source={{
									uri: item[2].assets[0].filepath,
								}}
								repeat={true}
								style={{
									width: "100%",
									height: "100%",
								}}
								resizeMode="cover"
								muted={true}
								paused={false}
							/>
						) : (
							<Image
								style={{
									width: "100%",
									height: "100%",
									borderRadius: 5,
								}}
								source={
									item[2].assets[0].filepath
										? { uri: item[2].assets[0].filepath }
										: default_image
								}
							/>
						)}
					</Pressable>
				</View>
			);
		} else {
			return (
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						justifyContent: "flex-start",
						paddingHorizontal: 2.5,
					}}
				>
					{item.map((data, index) => {
						if (index < 3) {
							return (
								<Pressable
									onPress={() => {
										navigation.push("FeedStack", {
											screen: "CommentsById",
											params: {
												post_id: data.id,
											},
										});
									}}
									style={{
										width: (width - 20) / 3,
										height: (width - 20) / 3,
										margin: 2.5,
									}}
								>
									{data.assets[0].type === "video" ? (
										<Video
											source={{
												uri: data.assets[0].filepath,
											}}
											repeat={true}
											style={{
												width: "100%",
												height: "100%",
											}}
											resizeMode="cover"
											muted={true}
											paused={false}
										/>
									) : (
										<Image
											style={{
												width: "100%",
												height: "100%",
												borderRadius: 5,
											}}
											source={
												data.assets[0].filepath
													? { uri: data.assets[0].filepath }
													: default_image
											}
										/>
									)}
								</Pressable>
							);
						} else {
							null;
						}
					})}
				</View>
			);
		}
	} else {
		return (
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					justifyContent: "flex-start",
					paddingHorizontal: 2.5,
				}}
			>
				{item.map((data, index) => {
					return (
						<Pressable
							onPress={() => {
								navigation.push("FeedStack", {
									screen: "CommentsById",
									params: {
										post_id: data.id,
									},
								});
							}}
							style={{
								width: (width - 20) / 3,
								height: (width - 20) / 3,
								margin: 2.5,
							}}
						>
							{data.assets[0].type === "video" ? (
								<Video
									source={{
										uri: data.assets[0].filepath,
									}}
									repeat={true}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: "#fff",
									}}
									resizeMode="cover"
									muted={true}
									paused={false}
								/>
							) : (
								<Image
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 5,
									}}
									source={
										data.assets[0].filepath
											? { uri: data.assets[0].filepath }
											: default_image
									}
								/>
							)}
						</Pressable>
					);
				})}
			</View>
		);
	}
}
