import { gql } from "apollo-boost";
const itinerary = gql`
  query {
    user_trip {
      id
      name
      cover
      like_show
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
          id
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
    }
  }
`;
export default itinerary;
