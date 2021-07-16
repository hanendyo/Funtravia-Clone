import React, { useState } from "react";
import { Platform } from "react-native";
import * as RNFS from "react-native-fs";
import sh from "shorthash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Image from "react-native-auto-scale-image";
import { ASSETS_SERVER } from "../../config";
import CACHE from "../cache.json";
import FastImage from "react-native-fast-image";

export default function FunImageAutoSize({
    children,
    style,
    uri,
    ...otherProps
}) {
    let url = uri + "?size=s";
    let [loading, setLoading] = useState(false);
    let [temp, setTemp] = useState([]);
    let [progress, setProgress] = useState();
    let path;
    if (url && url !== undefined) {
        let extension = Platform.OS === "android" ? "file://" : "";
        let name = sh.unique(url);
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
                        RNFS.downloadFile({
                            fromUrl: url,
                            toFile: path,
                            begin: (res: DownloadBeginCallbackResult) => {
                                // console.log("Response begin ===\n\n");
                                // console.log(res);
                            },
                            progress: (res: DownloadProgressCallbackResult) => {
                                //here you can calculate your progress for file download
                                // console.log("Response written ===\n\n");
                                let progressPercent =
                                    (res.bytesWritten / res.contentLength) *
                                    100; // to calculate in percentage
                                // console.log("\n\nprogress===", progressPercent);
                                setProgress(progressPercent.toString());
                                // item.downloadProgress = progressPercent;
                                // console.log(res);
                            },
                        })
                            .promise.then((res) => {
                                console.log("hasil", res);
                                setTimeout(() => setLoading(false), 1000);
                                // console.log("CACHED ANIMATED IMAGE", url);
                            })
                            .catch((error) => {
                                setLoading(false);
                                console.log("error", error);
                            });
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.warn(error);
                    console.log("error", error);
                });
        } else {
            path = uri;
        }
    }
    if (loading) {
        return (
            <SkeletonPlaceholder speed={500}>
                <SkeletonPlaceholder.Item {...style} height={style.width} />
            </SkeletonPlaceholder>
        );
    }

    return <Image {...otherProps} style={style} uri={path} />;
}
