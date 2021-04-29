import React from "react";
import { Clipboard } from "react-native";
import { SHARE_LINK } from "../../config";
import { Toast, Root } from "native-base";
// import Clipboard from "@react-native-clipboard/clipboard";

export default async function CopyLink({ from, target }) {
    try {
        // console.log(`${SHARE_LINK}/getlink/${from}/${target}`);
        let response = await fetch(`${SHARE_LINK}/getlink/${from}/${target}`, {
            method: "GET",
            Accept: "application/json",
            "Content-Type": "application/json",
        });
        let dataResponse = await response.json();
        // console.log(dataResponse.result.link);
        // Clipboard.setString("hello word");
        Clipboard.setString(dataResponse.result.link);
        Toast.show({
            text: "link copied to clipboard",
            position: "bottom",
            buttonText: "Ok",
            duration: 3000,
        });
    } catch (error) {
        console.log("Error", error);
        Toast.show({
            text: "failed to link copied to clipboard",
            position: "bottom",
            buttonText: "Ok",
            duration: 3000,
        });
    }
}
