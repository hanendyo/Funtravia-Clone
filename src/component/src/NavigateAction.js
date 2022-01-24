import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SHARE_LINK } from "../../config";

export default async function NavigateAction(navigation, shareId) {
  let response = await fetch(`${SHARE_LINK}/getdata/${shareId}`);
  console.log("~ response Notification stack", response);
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
    case "city":
      navigation.navigate("CountryStack", {
        screen: "CityDetail",
        params: {
          data: {
            city_id: data.og_id,
            token: token,
          },
          exParam: true,
        },
      });
      break;

    case "country":
      navigation.navigate("CountryStack", {
        screen: "Country",
        params: {
          data: {
            id: data.og_id,
            // token: token,
          },
          exParam: true,
        },
      });
      break;

    case "province":
      navigation.navigate("CountryStack", {
        screen: "Province",
        params: {
          data: {
            id: data.og_id,
            // token: token,
          },
          exParam: true,
        },
      });
      break;

    case "travelgoal":
      navigation.navigate("TravelGoalDetail", {
        screen: "TravelGoalDetail",
        article_id: data.og_id,
      });
      break;

    case "event":
      navigation.navigate("eventdetail", {
        event_id: data.og_id,
        name: data.og_title,
        token: `Bearer ${token}`,
      });
      break;

    case "movie":
      navigation.navigate("TravelIdeaStack", {
        screen: "Detail_movie",
        params: {
          movie_id: data.og_id,
          name: data.og_name,
          token: token,
        },
      });
      break;

    default:
      break;
  }
}
