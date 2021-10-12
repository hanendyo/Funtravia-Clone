import React from "react";
// import { Clipboard } from "react-native";
import { SHARE_LINK } from "../../config";
import { RNToasty } from "react-native-toasty";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";

export default async function CopyLink({ from, target }) {
  const { t } = useTranslation();

  const success = (t) => {
    return t("linkCopiedToClipboard");
  };
  const failed = (t) => {
    return t("failedToLinkCopiedToClipboard");
  };

  let successCopy = t("linkCopiedToClipboard");
  let failedCopy = t("failedToLinkCopiedToClipboard");
  try {
    let response = await fetch(`${SHARE_LINK}/getlink/${from}/${target}`, {
      method: "GET",
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    console.log("response", response);
    let dataResponse = await response.json();
    console.log("response", dataResponse);

    Clipboard.setString(dataResponse.result.link);
    RNToasty.Normal({
      title: success(t),
      title: "Link Copied To Clipboard",
      position: "bottom",
      // tintColor: rgb(32, 159, 174),
    });
  } catch (error) {
    console.log(error);
    RNToasty.Show({
      // title: "Failed To Copy Link To Clipboard",
      title: failed(t),
      title: "",
      position: "bottom",
    });
  }
}
