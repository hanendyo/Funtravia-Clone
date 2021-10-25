import React from "react";
// import { Clipboard } from "react-native";
import { SHARE_LINK } from "../../config";
import { RNToasty } from "react-native-toasty";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { Text } from "../../component";

export default async function CopyLink({ from, target }) {
  const sukses = () => {
    return RNToasty.Normal({
      title: "Success Copy Link To Clipboard",
      position: "bottom",
    });
  };
  try {
    let response = await fetch(`${SHARE_LINK}/getlink/${from}/${target}`, {
      method: "GET",
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    let dataResponse = await response.json();
    Clipboard.setString(dataResponse.result.link);
    sukses();
    // RNToasty.Normal({
    //   title: "Success Copy Link To Clipboard",
    //   position: "bottom",
    // });
  } catch (error) {
    console.log(error);
    RNToasty.Show({
      // title: t("failedToCopyLinkToClipboard"),
      title: "Failed To Copy Link To Clipboard",
      position: "bottom",
    });
  }
}
