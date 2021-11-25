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
      type_custom
      detail_type_id
      detail_flight {
        id
        title
        departure
        arrival
        from
        destination
        guest_name
        booking_ref
        carrier
        latitude_departure
        longitude_departure
        latitude_arrival
        longitude_arrival
      }
      detail_accomodation {
        id
        hotel_name
        address
        checkin
        checkout
        guest_name
        booking_ref
      }
    }
  }
`;
export default Timeline;
