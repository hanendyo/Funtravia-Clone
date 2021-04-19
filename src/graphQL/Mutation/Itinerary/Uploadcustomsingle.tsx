import { gql } from "apollo-boost";
const Uplaodcover = gql`
  mutation($file: [Upload], $custom_itinerary_id: ID!) {
    upload_attach_custom(
      file: $file
      custom_itinerary_id: $custom_itinerary_id
    ) {
      id
      response_time
      message
      code
      data {
        itinerary_custom_id
        extention
        file_name
        filepath
        tiny
      }
    }
  }
`;
export default Uplaodcover;
