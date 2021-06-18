import { gql } from "apollo-boost";
const ItineraryDetails = gql`
  query($id: ID!) {
    itinerary_detail(id: $id) {
      id
      name
      start_date
      end_date
      status
      isprivate
      created_by
      created_at
      cover
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
      buddy {
        id
        user_id
        isadmin
        isconfrim
        accepted_at
        rejected_at
        user {
          id
          first_name
          picture
          username
        }
        
      }
      day {
        id
        itinerary_id
        day
        date
        total_hours
      }
      album{
      id
      title
      cover
      user{
        id
        username
        first_name
        last_name
        picture
      }
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
export default ItineraryDetails;
