import React, { useState } from "react";
import {
  Platform,
  Image as RNImage,
  View,
  ActivityIndicator,
} from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Video from "react-native-video";
import { Play } from "../../assets/svg";

export default function FunVideo({ style, poster, grid, ...otherProps }) {
  let [loading, setLoading] = useState(false);
  let [temp, setTemp] = useState([]);
  let uri = poster;
  let path;
  if (uri && uri !== undefined) {
    let extension = Platform.OS === "android" ? "file://" : "";
    let name = sh.unique(uri);
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
            // console.log("SUCCESS CACHE IMAGE FROM VIDEO", uri);
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.warn(error);
      });
  }

  if (loading) {
    return (
      <View style={{ ...style, justifyContent: "center" }}>
        <ActivityIndicator animating={true} size="large" color="#d1d1d1" />
      </View>
    );
  }

  return (
    <>
      <Video {...otherProps} style={style} poster={path} />
      {grid && (
        <>
          <View
            style={{
              position: "absolute",
              backgroundColor: "#141414",
              opacity: 0.6,
              ...style,
            }}
          />
          <Play
            width={30}
            height={30}
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              top: 10,
              right: 10,
            }}
          />
        </>
      )}
    </>
  );
}
