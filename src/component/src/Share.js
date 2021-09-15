import React from "react";
import { Share } from "react-native";
import { SHARE_LINK } from "../../config";

export default async function shareAction({ from, target }) {
  try {
    let response = await fetch(`${SHARE_LINK}/getlink/${from}/${target}`, {
      method: "GET",
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    let dataResponse = await response.json();
    const data = {
      message: `Hi Travelers, visit this ${from}${
        from == "movie" ? " location" : ""
      } from funtravia ${dataResponse?.result?.link}`,
      url: dataResponse?.result?.link,
    };
    const result = await Share.share(data);
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("ACTIVITY", result.activityType);
      } else {
        console.log("Shared");
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Dismiss");
    }
  } catch (error) {
    console.log("Error", error);
  }
}
