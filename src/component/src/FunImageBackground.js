import React, { useState } from "react";
import { Platform, ImageBackground as RNImageBackground } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { default_image } from "../../assets/png";

export default function ImageBackground({
	children,
	style,
	source,
	imageStyle,
	...otherProps
}) {
	let [loading, setLoading] = useState(false);
	let uri = source.uri;
	let path;
	if (uri) {
		let extension = Platform.OS === "android" ? "file://" : "";
		let name = sh.unique(uri);
		path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
		RNFS.exists(path)
			.then((exists) => {
				if (!exists) {
					setLoading(true);
					RNFS.downloadFile({ fromUrl: uri, toFile: path }).promise.then(
						(res) => {
							setLoading(false);
						}
					);
				} else {
					setLoading(false);
				}
			})
			.catch((error) => {
				console.warn(error);
			});
	}

	if (loading) {
		return (
			<SkeletonPlaceholder speed={500}>
				<SkeletonPlaceholder.Item {...style} />
			</SkeletonPlaceholder>
		);
	}

	return (
		<RNImageBackground
			{...otherProps}
			imageStyle={imageStyle}
			style={style}
			source={uri ? { uri: path } : default_image}
		>
			{children}
		</RNImageBackground>
	);
}
