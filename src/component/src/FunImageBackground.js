import React, { useState } from "react";
import {
  Platform,
  ImageBackground as RNImageBackground,
  Pressable,
} from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { ASSETS_SERVER } from "../../config";
import CACHE from "../cache.json";
import { Refresh } from "../../assets/svg";

export default function ImageBackground({
  children,
  style,
  source,
  imageStyle,
  ...otherProps
}) {
  let [loading, setLoading] = useState(false);
  // let [timeout, setTimeOut] = useState(false);
  let [progress, setProgress] = useState();
  // console.log(progress);
  let [temp, setTemp] = useState([]);
  let isUri = source.uri ? true : false;
  let uri = source.uri + "?size=m";
  let path;
  if (uri && uri !== undefined && isUri) {
    let extension = Platform.OS === "android" ? "file://" : "";
    let name = sh.unique(uri);
    path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]funtravia+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gim;
    let hvdm = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)/gim;
    let chvdm = hvdm.test(uri);
    uri = chvdm ? uri : ASSETS_SERVER + uri;
    let check = regex.test(uri);
    if (check) {
      RNFS.exists(path)
        .then((exists) => {
          if (!exists && CACHE.indexOf(name) === -1) {
            setLoading(true);
            CACHE.push(name);
            // console.log("CACHE FILE", name);
            RNFS.downloadFile({
              fromUrl: uri,
              toFile: path,
              background: true,
              begin: (res: DownloadBeginCallbackResult) => {
                // console.log("Response begin ===\n\n");
                // console.log(res);
              },
              progress: (res: DownloadProgressCallbackResult) => {
                //here you can calculate your progress for file download
                // console.log("Response written ===\n\n");
                let progressPercent =
                  (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
                // console.log("\n\nprogress===", progressPercent);
                setProgress(progressPercent.toString());
                // item.downloadProgress = progressPercent;
                // console.log(res);
              },
            }).promise.then((res) => {
              console.log(res);
              setTimeout(() => {
                setLoading(false);
                // setTimeOut(true);
              }, 1000);
              // console.log("SUCCESS BACKGROUND CACHED", uri);
            });
          }
        })
        .catch((error) => {
          // setTimeOut(true);
          setLoading(false);
          console.warn(error);
        });
    } else {
      path = source.uri;
    }
  }

  const repatch = () => {
    if (uri && uri !== undefined && isUri) {
      let extension = Platform.OS === "android" ? "file://" : "";
      let name = sh.unique(uri);
      path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
      let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]funtravia+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gim;
      let hvdm = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)/gim;
      let chvdm = hvdm.test(uri);
      uri = chvdm ? uri : ASSETS_SERVER + uri;
      let check = regex.test(uri);
      if (check) {
        RNFS.exists(path)
          .then((exists) => {
            if (!exists && CACHE.indexOf(name) === -1) {
              setLoading(true);
              CACHE.push(name);
              console.log("CACHE FILE", name);
              RNFS.downloadFile({
                fromUrl: uri,
                toFile: path,
              }).promise.then((res) => {
                setTimeout(() => {
                  setLoading(false);
                  setTimeOut(true);
                }, 1000);
                // console.log("SUCCESS BACKGROUND CACHED", uri);
              });
            }
          })
          .catch((error) => {
            setTimeOut(true);
            setLoading(false);
            console.warn(error);
          });
      } else {
        path = source.uri;
      }
    }
  };

  // if (timeout) {
  //     return (
  //         <Pressable onPress={{}} {...style}>
  //             <Refresh width={20} heigth={20} />
  //         </Pressable>
  //     );
  // }
  if (loading) {
    return (
      <SkeletonPlaceholder speed={500}>
        <SkeletonPlaceholder.Item {...style} />
      </SkeletonPlaceholder>
    );
  }

  return (
    <RNImageBackground
      {...otherProps}
      imageStyle={imageStyle}
      style={style}
      source={isUri ? { uri: path } : source}
    >
      {children}
    </RNImageBackground>
  );
}
