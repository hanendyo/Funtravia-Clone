import React, { useState } from "react";
import { Platform, Image as RNImage, useColorScheme } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { ICONSERVER } from "../../config";
import { SvgUri } from "react-native-svg";

export default function FunIcon({
	icon,
	style = null,
	width = null,
	height = null,
	fill = null,
}) {
	const variant = { i: "icon", g: "icon", w: "weather", f: "flag", m: "map" };
	const url = `${ICONSERVER}${variant[icon.charAt(0)]}/${
		icon.split("-")[1]
	}.svg`;
	let [loading, setLoading] = useState(false);
	const extension = Platform.OS === "android" ? "file://" : "";
	const name = sh.unique(url);
	const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.svg`;
	console.log("ICON", url);
	// RNFS.exists(path)
	// 	.then((exists) => {
	// 		if (!exists) {
	// 			setLoading(true);
	// 			RNFS.downloadFile({
	// 				fromUrl: url,
	// 				toFile: path,
	// 			}).promise.then((res) => {
	// 				setLoading(false);
	// 			});
	// 		} else {
	// 			setLoading(false);
	// 		}
	// 	})
	// 	.catch((error) => {
	// 		console.warn(error);
	// 	});

	if (loading) {
		return (
			<SkeletonPlaceholder speed={500}>
				<SkeletonPlaceholder.Item {...style} />
			</SkeletonPlaceholder>
		);
	}

	return (
		<SvgUri
			style={style ? style : null}
			uri={url}
			width={width ? width : 50}
			height={height ? height : 50}
			fill={fill ? fill : "#000"}
		/>
	);
}
