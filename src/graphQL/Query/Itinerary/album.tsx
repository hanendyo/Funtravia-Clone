import { gql } from "apollo-boost";
const album = gql`
  query($itinerary_id: ID!) {
    itinerary_album_list(itinerary_id: $itinerary_id) {
      id
      name
      start_date
      end_date
      status
      isprivate
      created_by
      created_at
      city {
        id
        name
        latitude
        longitude
      }
      country {
        id
        name
        latitude
        longitude
      }
      day_album {
        id
        day
        date
        album {
          id
          day_id
          assets
          description
          created_by
          is_posted
          photoby {
            id
            username
            first_name
            last_name
            picture
          }
          created_at
        }
      }
    }
  }
`;
export default album;
