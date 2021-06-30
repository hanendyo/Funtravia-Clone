import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions } from "react-native";
import * as RNFS from "react-native-fs";
import AnimatedPlayer from "react-native-animated-webp";
const { width, height } = Dimensions.get("screen");

export default function StickerScreen({ navigation, route }) {
	const playerRef = useRef(null);
	const [sticker, setSticker] = useState([]);
	let path = `${RNFS.DocumentDirectoryPath}/sticker/S001CATS`;
	let extension = Platform.OS === "android" ? "file://" : "";
	let size = width / 5 - 5;

	const getStickerLocal = () => {
		RNFS.mkdir(path);
		RNFS.downloadFile({
			fromUrl: "https://fa12.funtravia.com/sticker/S001CAT/010.webp",
			toFile: path + "/010.webp",
		});
		RNFS.readDir(path).then((result) => {
			setSticker(result);
		});
	};

	useEffect(() => {
		getStickerLocal();
	}, []);

	return (
		<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/001.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/002.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/003.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/004.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/005.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/006.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/007.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/008.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/009.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
			<AnimatedPlayer
				ref={playerRef}
				thumbnailSource={
					"https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
				}
				animatedSource={{
					uri: `${extension}/Users/asepim/Library/Developer/CoreSimulator/Devices/155DE985-76D5-4FD7-A4C1-1721F660D1AE/data/Containers/Data/Application/F0B923EF-AEA8-4371-92AE-9CF2D48CDB02/Documents/sticker/S001CATS/010.webp`,
				}}
				duration={500}
				autoplay={true}
				loop={false}
				style={{ width: size, height: size }}
			/>
		</View>
	);
}
