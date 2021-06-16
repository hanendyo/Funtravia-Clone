import { gql } from "apollo-boost";
const listitineraryAll = gql`
  query($status: String, $keyword: String) {
    #   status : A/D/F
    itinerary_list_all(status: $status, keyword: $keyword) {
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
      buddy {
        id
        user {
          username
          first_name
          picture
        }
      }
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
      categori {
        id
        name
        slug
        icon
      }
      user_created {
        id
        username
        first_name
        last_name
        picture
      }
      album_count
    }
  }
`;
export default listitineraryAll;
