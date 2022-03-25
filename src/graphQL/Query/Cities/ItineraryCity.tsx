import { gql } from "apollo-boost";
const CityItinerary = gql`
  query($city_id: ID!) {
    itinerary_populer_by_city(city_id: $city_id) {
      id
      name
      country {
        id
        name
      }
      city {
        id
        name
        flag
      }
      start_date
      end_date
      isprivate
      status
      cover
      buddy_count
      favorit_count
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
export default CityItinerary;
