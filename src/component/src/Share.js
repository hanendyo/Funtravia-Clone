import React from "react";
import { Share } from "react-native";
import { SHARE_LINK } from "../../config";

export default async function shareAction({ from, target }) {
	try {
		let data;
		switch (from) {
			case "feed":
				data = {
					message: `${SHARE_LINK}/${from}/${target}`,
					url: `${SHARE_LINK}/${from}/${target}`,
				};
				break;
			default:
				data = {
					message: `${SHARE_LINK}/${from}/${target}`,
					url: `${SHARE_LINK}/${from}/${target}`,
				};
				break;
		}
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
