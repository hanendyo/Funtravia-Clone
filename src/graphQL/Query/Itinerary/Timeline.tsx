import { gql } from "apollo-boost";
const Timeline = gql`
  query($id: ID!) {
    day_timeline(day_id: $id) {
      id
      destination_id
      event_id
      type
      name
      time
      note
      order
      duration
      address
      latitude
      longitude
      total_price
      city
      id_city
      images
      status
      icon
      attachment {
        itinerary_custom_id
        extention
        filepath
        file_name
        tiny
      }
    }
  }
`;
export default Timeline;
