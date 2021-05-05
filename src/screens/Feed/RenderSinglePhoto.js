import React, { useRef, useState } from "react";
import { Dimensions, TouchableWithoutFeedback, View } from "react-native";
import { FunImageAutoSize, FunVideo } from "../../component";
import Video from "react-native-video";
import { Mute, Unmute } from "../../assets/svg";

const { width, height } = Dimensions.get("screen");
export default function RenderSinglePhoto({
	data,
	props,
	play,
	isFocused,
	muted,
	setMuted,
}) {
	let videoView = useRef(null);
	if (data.assets[0].type === "video") {
		return (
			<View key={`FEED_${data.id}`}>
				<TouchableWithoutFeedback onPress={() => setMuted(!muted)}>
					<FunVideo
						poster={data.assets[0].filepath.replace(
							"output.m3u8",
							"thumbnail.png"
						)}
						posterResizeMode={"cover"}
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
						paused={play === data.id && isFocused ? false : true}
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
			<FunImageAutoSize
				style={{
					width: Dimensions.get("screen").width - 40,
					borderRadius: 15,
					alignSelf: "center",
					marginHorizontal: 10,
				}}
				key={`FEED_${data.id}`}
				uri={data.assets[0].filepath}
			/>
		);
	}
}
