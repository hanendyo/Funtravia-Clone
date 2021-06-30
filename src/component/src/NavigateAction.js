import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SHARE_LINK } from "../../config";

export default async function NavigateAction(navigation, shareId) {
  console.log("DATA FROM", shareId);
  let response = await fetch(`${SHARE_LINK}/getdata/${shareId}`);
  let token = await AsyncStorage.getItem("access_token");
  response = await response.json();
  let data = response.result;
  switch (data.og_from) {
    case "journal":
      navigation.navigate("JournalStackNavigation", {
        screen: "DetailJournal",
        params: {
          dataPopuler: { id: data.og_id, title: data.og_title },
        },
      });
      break;
    case "feed":
      navigation.push("FeedStack", {
        screen: "CommentPost",
        params: {
          post_id: data.og_id,
          //   comment_id: data.comment_feed.id,
        },
      });
      // navigation.navigate("FeedStack", {
      // 	screen: "CommentsById",
      // 	params: {
      // 		post_id: data.og_id,
      // 	},
      // });
      break;
    // case "event":
    // 	// MUST REPAIR GET DATA
    // 	navigation.navigate("FeedStack", {
    // 		screen: "CommentsById",
    // 		params: {
    // 			post_id: data.og_id,
    // 		},
    // 	});
    // 	break;
    case "destination":
      navigation.navigate("DestinationUnescoDetail", {
        id: data.og_id,
        token: token,
      });
      break;
    case "itinerary":
      navigation.navigate("ItineraryStack", {
        screen: "itindetail",
        params: {
          country: data.og_id,
          token: token,
          index: 0,
        },
      });
      break;
    default:
      break;
  }
}
