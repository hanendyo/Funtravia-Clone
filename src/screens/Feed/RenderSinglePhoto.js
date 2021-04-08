import React, { useRef, useState } from "react";
import { Dimensions, TouchableWithoutFeedback, View } from "react-native";
import Image from "react-native-auto-scale-image";
import Video from "react-native-video";
import { Mute, Unmute } from "../../assets/svg";

const { width, height } = Dimensions.get("screen");

export default function RenderSinglePhoto({ data, props, separators }) {
	let videoView = useRef(null);
	let [muted, setMuted] = useState(true);
	if (data.assets[0].type === "video") {
		return (
			<View>
				<TouchableWithoutFeedback onPress={() => setMuted(!muted)}>
					<Video
						source={{
							uri: data.assets[0].filepath,
						}}
						ref={(ref) => {
							videoView = ref;
						}}
						onBuffer={videoView?.current?.onBuffer}
						onError={videoView?.current?.videoError}
						repeat={true}
						style={{
							width: width - 40,
							height: width,
							borderRadius: 15,
						}}
						resizeMode="cover"
						muted={muted}
					/>
				</TouchableWithoutFeedback>
				<View
					style={{
						padding: 5,
						position: "absolute",
						backgroundColor: "rgba(0, 0, 0, 0.50)",
						bottom: 10,
						right: 10,
						borderRadius: 15,
					}}
				>
					{muted ? (
						<Mute width="15" height="15" />
					) : (
						<Unmute width="15" height="15" />
					)}
				</View>
			</View>
		);
	} else {
		return (
			<Image
				style={{
					width: Dimensions.get("screen").width - 40,
					borderRadius: 15,
					alignSelf: "center",
					marginHorizontal: 10,
				}}
				uri={data.assets[0].filepath}
			/>
		);
	}
}
