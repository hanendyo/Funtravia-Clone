import { gql } from "apollo-boost";
const AddCustom = gql`
  mutation(
    $day_id: [ID]!
    $title: String!
    $icon: String!
    # $qty: String!
    $address: String!
    $latitude: String!
    $longitude: String!
    # $note: String
    $time: String
    $duration: String!
    # $status: Boolean!
    $order: [String]! # $total_price: String!
    $file: [Upload]
  ) {
    add_custom_withattach(
      input: {
        day_id: $day_id
        title: $title
        icon: $icon
        qty: "1"
        address: $address
        latitude: $latitude
        longitude: $longitude
        note: ""
        time: $time
        duration: $duration
        status: false
        order: $order
        total_price: "100000"
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
        # file
      }
      response_time
      message
      code
    }
  }
`;
export default AddCustom;
