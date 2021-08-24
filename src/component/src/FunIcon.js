import React, { useState } from "react";
import { Platform, ActivityIndicator } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { ICONSERVER } from "../../config";
import { SvgCssUri } from "react-native-svg";
import CACHE from "../cache.json";

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
  RNFS.exists(path)
    .then((exists) => {
      if (!exists && CACHE.indexOf(name) === -1) {
        setLoading(true);
        CACHE.push(name);
        setLoading(true);
        RNFS.downloadFile({
          fromUrl: url,
          toFile: path,
        }).promise.then((res) => {
          setLoading(false);
          if (res.statusCode === "200") {
            setTimeout(() => setLoading(false), 3000);
          } else {
            setError(true);
          }
        });
      }
    })
    .catch((error) => {
      setLoading(false);
    });

  if (loading) {
    return <ActivityIndicator animating={true} size="small" color="#d1d1d1" />;
  }

  if (error) {
    return (
      <SvgCssUri
        uri={url}
        width={width ? width : 50}
        height={height ? height : 50}
        fill={fill ? fill : "#464646"}
      />
    );
  } else {
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
