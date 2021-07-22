import React, { useState } from "react";
import {
  Platform,
  Image as RNImage,
  View,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { ICONSERVER } from "../../config";
import { SvgCssUri } from "react-native-svg";

export default function RenderMaps({
  icon,
  style = null,
  width = null,
  height = null,
  fill = null,
}) {
  const variant = { mn: "map_negara", mk: "map_kota", w: "weather" };
  const url = `${ICONSERVER}${variant[icon.substring(0, 2)]}/${
    icon.split("-")[1]
  }.svg`;
  console.log("url", url);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);
  const extension = Platform.OS === "android" ? "file://" : "";
  const name = sh.unique(url);
  const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.svg`;
  // console.log(url);
  RNFS.exists(path)
    .then((exists) => {
      if (!exists) {
        setLoading(true);
        RNFS.downloadFile({
          fromUrl: url,
          toFile: path,
        }).promise.then((res) => {
          if (res.statusCode === "200") {
            setTimeout(() => setLoading(false), 1000);
            console.log("SUCCESS CACHE ICON", url);
          } else {
            setLoading(false);
            setError(true);
          }
        });
      }
    })
    .catch((error) => {
      setLoading(false);
      console.log("ERROR CACHE", error);
    });

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    console.log("masukerror");
    return (
      <SvgCssUri
        uri={url}
        width={width ? width : 50}
        height={height ? height : 50}
        fill={fill ? fill : "#464646"}
      />
    );
  } else {
    console.log("masuk");
    return (
      <SvgCssUri
        uri={error ? url : path}
        width={width ? width : 50}
        height={height ? height : 50}
        fill={fill ? fill : "#464646"}
      />
    );
  }
}
