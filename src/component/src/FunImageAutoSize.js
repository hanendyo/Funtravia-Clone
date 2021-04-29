import React, { useState } from "react";
import { Platform } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Image from "react-native-auto-scale-image";

export default function FunImageAutoSize({
	children,
	style,
	uri,
	...otherProps
}) {
	let url = uri;
	if (!uri) {
		console.warn("URI is required !");
	}
	let [loading, setLoading] = useState(true);
	const extension = Platform.OS === "android" ? "file://" : "";
	const name = sh.unique(url);
	const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
	RNFS.exists(path)
		.then((exists) => {
			if (!exists) {
				setLoading(true);
				RNFS.downloadFile({ fromUrl: url, toFile: path }).promise.then(
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

	return <Image {...otherProps} style={style} uri={path} />;
}
