import React from "react";
// import { Clipboard } from "react-native";
import { SHARE_LINK } from "../../config";
import { RNToasty } from "react-native-toasty";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";

export default async function CopyLink({ from, target }) {
  // const { t } = useTranslation();
  console.log("FROM: ", from);
  console.log("TARGET: ", target);

  // const success = (t) => {
  //   return t("linkCopiedToClipboard");
  // };
  // const failed = (t) => {
  //   return t("failedToLinkCopiedToClipboard");
  // };

  // let successCopy = t("linkCopiedToClipboard");
  // let failedCopy = t("failedToLinkCopiedToClipboard");

  try {
    let response = await fetch(`${SHARE_LINK}/getlink/${from}/${target}`, {
      method: "GET",
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    let dataResponse = await response.json();

    console.log("response", response);
    console.log("response", dataResponse);

    Clipboard.setString(dataResponse.result.link);
    RNToasty.Normal({
      // title: t("linkCopiedToClipboard"),
      title: "Link Copied To Clipboard",
      position: "bottom",
      // tintColor: rgb(32, 159, 174),
    });
  } catch (error) {
    console.log(error);
    RNToasty.Show({
      // title: t("failedToCopyLinkToClipboard"),
      title: "Failed To Copy Link To Clipboard",
      position: "bottom",
    });
  }
}
