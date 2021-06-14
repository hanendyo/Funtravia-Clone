import React, { useState } from "react";
import { Platform, Image as RNImage } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { default_image } from "../../assets/png";

export default function Image({
  children,
  style,
  source,
  imageStyle,
  ...otherProps
}) {
  let [loading, setLoading] = useState(false);
  let [temp, setTemp] = useState([]);
  let isUri = source.uri ? true : false;
  let uri = source.uri + "?size=m";
  let path;
  if (uri && uri !== undefined && isUri) {
    let extension = Platform.OS === "android" ? "file://" : "";
    let name = sh.unique(uri);
    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]funtravia+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gim;
    let check = regex.test(uri);
    if (check) {
      path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
      RNFS.exists(path)
        .then((exists) => {
          if (!exists && temp.indexOf(name) === -1) {
            setLoading(true);
            setTemp([...temp, name]);
            RNFS.downloadFile({
              fromUrl: uri,
              toFile: path,
            }).promise.then((res) => {
              setTimeout(() => setLoading(false), 1000);
              // console.log("SUCCESS CACHE IMAGE", uri);
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          // console.log("ERROR CACHE", error);
        });
    } else {
      path = source.uri;
    }
  }

  if (loading) {
    return (
      <SkeletonPlaceholder speed={500}>
        <SkeletonPlaceholder.Item {...style} />
      </SkeletonPlaceholder>
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
