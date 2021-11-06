import { gql } from "apollo-boost";
const ItineraryFavorite = gql`
  query($keyword: String) {
    itinerary_list_favorite(keyword: $keyword) {
      id
      name
      cover
      country {
        id
        name
      }
      city {
        id
        name
        flag
      }
      buddy_count
      favorit_count
      start_date
      end_date
      isprivate
      status
      day {
        id
        day
        date
      }
      liked
      user_created {
        id
        username
        first_name
        last_name
        picture
      }
    }
  }
`;

export default ItineraryFavorite;
