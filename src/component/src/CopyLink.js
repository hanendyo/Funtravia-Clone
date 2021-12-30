import React from "react";
// import { Clipboard } from "react-native";
import { SHARE_LINK } from "../../config";
import { RNToasty } from "react-native-toasty";
import Clipboard from "@react-native-clipboard/clipboard";

export default async function CopyLink({ from, target, success, failed }) {
  try {
    let response = await fetch(`${SHARE_LINK}/getlink/${from}/${target}`, {
      method: "GET",
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    let dataResponse = await response.json();
    Clipboard.setString(dataResponse.result.link);

    RNToasty.Normal({
      title: success ? success : "Success Copy link to Clipboard",
      position: "bottom",
    });
  } catch (error) {
    console.log(error);
    RNToasty.Show({
      // title: t("failedToCopyLinkToClipboard"),
      title: failed ? failed : "Failed To Copy Link To Clipboard",
      position: "bottom",
    });
  }
}
