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
	let uri = source.uri;
	console.log(uri);
	let [loading, setLoading] = useState(false);
	const extension = Platform.OS === "android" ? "file://" : "";
	const name = sh.unique(uri);
	const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
	if (uri) {
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
