import React, { useState } from "react";
import { Platform, Image as RNImage, View, useColorScheme } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { ICONSERVER } from "../../config";
import { SvgUri } from "react-native-svg";

export default function RenderMaps({
    icon,
    style = null,
    width = null,
    height = null,
    fill = null,
}) {
    console.log(icon);
    const variant = { mn: "map_negara", mk: "map_kota", w: "weather" };
    const url = `${ICONSERVER}${variant[icon.substring(0, 2)]}/${
        icon.split("-")[1]
    }.svg`;
    let [loading, setLoading] = useState(true);
    const extension = Platform.OS === "android" ? "file://" : "";
    const name = sh.unique(url);
    const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.svg`;
    RNFS.exists(path)
        .then((exists) => {
            if (!exists) {
                setLoading(true);
                RNFS.downloadFile({
                    fromUrl: url,
                    toFile: path,
                }).promise.then((res) => {
                    setLoading(false);
                });
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

    return (
        <View>
            <SvgUri
                style={style ? style : null}
                uri={path}
                width={width ? width : 50}
                height={height ? height : 50}
                fill={fill ? fill : "#000"}
            />
        </View>
    );
}
