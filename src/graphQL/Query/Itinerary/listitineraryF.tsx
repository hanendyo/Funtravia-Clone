import { gql } from "apollo-boost";
const ListItinerary = gql`
  query {
    #   status : A/D/F
    itinerary_list_finish {
      id
      name
      cover
      start_date
      end_date
      isprivate
      status
      liked
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
      buddy_count
      day {
        id
        day
        date
      }
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
export default ListItinerary;
