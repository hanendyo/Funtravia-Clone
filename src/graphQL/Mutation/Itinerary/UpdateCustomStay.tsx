import { gql } from "apollo-boost";
const UpdateCustomStay = gql`
  mutation(
    $id: ID!
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
    $hotel_name: String
    $guest_name: String
    $booking_ref: String
    $checkin: String
    $checkout: String
    $file: [Upload]
  ) {
    update_custom_accomodation(
      input: {
        id: $id
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
        hotel_name: $hotel_name
        guest_name: $guest_name
        booking_ref: $booking_ref
        checkin: $checkin
        checkout: $checkout
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

export default UpdateCustomStay;
