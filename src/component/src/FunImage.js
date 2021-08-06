import React, { useState } from "react";
import {
  Platform,
  Image as RNImage,
  ActivityIndicator,
  View,
} from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { default_image } from "../../assets/png";
import { ASSETS_SERVER } from "../../config";
import CACHE from "../cache.json";
import FastImage from "react-native-fast-image";

export default function Image({
  children,
  style,
  source,
  imageStyle,
  size,
  ...otherProps
}) {
  let [loading, setLoading] = useState(false);
  let [temp, setTemp] = useState([]);
  let isUri = source.uri ? true : false;
  let uri;
  if (size) {
    uri = source.uri + "?size=" + size;
  } else {
    uri = source.uri;
  }
  // let uri = source.uri + "?size=m";
  let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]funtravia+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gim;
  let hvdm = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)/gim;
  let chvdm = hvdm.test(uri);
  uri = chvdm ? uri : ASSETS_SERVER + uri;
  let check = regex.test(uri);
  let path;
  if (uri && uri !== undefined && isUri) {
    let extension = Platform.OS === "android" ? "file://" : "";
    let name = sh.unique(uri);
    if (check) {
      path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
      RNFS.exists(path)
        .then((exists) => {
          if (!exists && CACHE.indexOf(name) === -1) {
            setLoading(true);
            CACHE.push(name);
            RNFS.downloadFile({
              fromUrl: uri,
              toFile: path,
            }).promise.then((res) => {
              setTimeout(() => setLoading(false), 1000);
            });
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      path = source.uri;
    }
  }

  if (loading) {
    return (
      <View style={{ ...style, justifyContent: "center" }}>
        <ActivityIndicator animating={true} size="large" color="#d1d1d1" />
      </View>
    );
  }

  return (
    <RNImage
      {...otherProps}
      style={style}
      source={isUri ? { uri: path } : default_image}
    />
  );
}
