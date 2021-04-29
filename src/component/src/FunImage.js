import React, { useState } from "react";
import { Platform, Image as RNImage } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function Image({
	children,
	style,
	source,
	imageStyle,
	...otherProps
}) {
	let uri = source.uri;
	if (!uri) {
		console.warn("URI is required !");
	}
	let [loading, setLoading] = useState(true);
	const extension = Platform.OS === "android" ? "file://" : "";
	const name = sh.unique(uri);
	const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
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

	if (loading) {
		return (
			<SkeletonPlaceholder speed={500}>
				<SkeletonPlaceholder.Item {...style} />
			</SkeletonPlaceholder>
		);
	}

	return <RNImage {...otherProps} style={style} source={{ uri: path }} />;
}
