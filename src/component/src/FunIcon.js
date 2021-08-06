import React, { useState } from "react";
import { Platform, ActivityIndicator } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { ICONSERVER } from "../../config";
import { SvgCssUri } from "react-native-svg";

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
    return <ActivityIndicator animating={true} size="small" color="#d1d1d1" />;
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
    console.log("masukoke");
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
