import React, { useState } from "react";
import { Platform, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import { ASSETS_SERVER } from "../../config";
import CACHE from "../cache.json";
import FileViewer from "react-native-file-viewer";
import Text from "./Text";
import * as Progress from "react-native-progress";
import { FileGray, PhotoGray } from "../../assets/svg";

export default function FunDocument({
  filepath,
  filename,
  format,
  style,
  size,
  progressBar,
  icon,
  children,
  ...otherProps
}) {
  const { t } = useTranslation();
  let [loading, setLoading] = useState(false);
  let [progress, setProgress] = useState(0);
  let isUri = filepath ? true : false;
  let uri;
  if (size) {
    uri = filepath + "?size=" + size;
  } else {
    uri = filepath;
  }
  let path;
  const handleAttachment = (path) => {
    setTimeout(() => {
      FileViewer.open(path, {
        showOpenWithDialog: true,
      });
    }, 350);
  };
  if (uri && uri !== undefined && isUri) {
    let extension = Platform.OS === "android" ? "file://" : "";
    let name = sh.unique(uri);
    path = `${extension}${RNFS.CachesDirectoryPath}/${name}.${format}`;
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
            RNFS.downloadFile({
              fromUrl: uri,
              toFile: path,
              background: true,
              begin: (res) => {
                // console.log("Response begin ===\n\n");
                // console.log(res);
              },
              progress: (res) => {
                setProgress(+(res.bytesWritten / res.contentLength) * 100);
              },
            }).promise.then((res) => {
              setLoading(false);
              setProgress(100);
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert(t("fileCouldNotBeDownloaded"));
        });
    } else {
      path = uri;
    }
  }

  return (
    <TouchableOpacity
      style={{ flex: 1, flexDirection: "row", ...style }}
      {...otherProps}
      onPress={() => handleAttachment(format === undefined ? filepath : path)}
    >
      {icon ? (
        format === "pdf" ? (
          <FileGray width={15} height={15} style={styles.Icon} />
        ) : (
          <PhotoGray width={15} height={15} style={styles.Icon} />
        )
      ) : null}
      <Text size="description" type="regular" style={styles.Filename}>
        {filename}
      </Text>

      {progressBar ? (
        progress !== 0 && progress !== 100 ? (
          <Progress.Bar
            width={80}
            height={10}
            color={"#209FAE"}
            progress={progress}
            borderColor={"#DAF0F2"}
            style={styles.ProgressBar}
          />
        ) : null
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  Icon: {
    marginRight: 10,
    alignSelf: "center",
  },
  Filename: { color: "#464646" },
  ProgressBar: {
    marginLeft: 10,
    height: 10,
    marginTop: 5,
  },
});
