import { gql } from "apollo-boost";
const AddFlight = gql`
  mutation(
    $day_id: [ID]!
    $title: String!
    $icon: String!
    $qty: String
    $address: String!
    $latitude: String!
    $longitude: String!
    $note: String
    $time: String
    $duration: String
    $status: Boolean!
    $order: [String]!
    $total_price: String
    $departure: String
    $arrival: String
    $from: String
    $destination: String
    $guest_name: String
    $booking_ref: String
    $carrier: String
    $file: [Upload]
  ) {
    add_custom_flight(
      input: {
        day_id: $day_id
        title: $title
        icon: $icon
        qty: $qty
        address: $address
        latitude: $latitude
        longitude: $longitude
        note: $note
        time: $time
        duration: $duration
        status: $status
        order: $order
        total_price: $total_price
        departure: $departure
        arrival: $arrival
        from: $from
        destination: $destination
        guest_name: $guest_name
        booking_ref: $booking_ref
        carrier: $carrier
        file: $file
      }
    ) {
      data {
        id
        day_id
        title
        icon
        latitude
        longitude
        address
        order
        qty
        time
        duration
        status
      }
      response_time
      message
      code
    }
  }
`;
export default AddFlight;
