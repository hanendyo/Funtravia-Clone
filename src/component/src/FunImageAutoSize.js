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
	let [loading, setLoading] = useState(false);
	let [temp, setTemp] = useState([]);
	let path;
	if (url && url !== undefined) {
		let extension = Platform.OS === "android" ? "file://" : "";
		let name = sh.unique(url);
		path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
		RNFS.exists(path)
			.then((exists) => {
				if (!exists && temp.indexOf(name) === -1) {
					setLoading(true);
					setTemp([...temp, name]);
					RNFS.downloadFile({ fromUrl: url, toFile: path }).promise.then(
						(res) => {
							setTimeout(() => setLoading(false), 1000);
							console.log("CACHED ANIMATED IMAGE", url);
						}
					);
				}
			})
			.catch((error) => {
				setLoading(false);
				console.warn(error);
			});
	}
	if (loading) {
		return (
			<SkeletonPlaceholder speed={500}>
				<SkeletonPlaceholder.Item {...style} height={style.width} />
			</SkeletonPlaceholder>
		);
	}

	return <Image {...otherProps} style={style} uri={path} />;
}