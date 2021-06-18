import { gql } from "apollo-boost";
const uploadalbums = gql`

  mutation($file: [Upload]!, $itinerary_id: ID!, $album_id: ID!) {
      uploadalbums(file: $file,itinerary_id:$itinerary_id,album_id:$album_id){
          id
    response_time
    message
    code}}



`;
export default uploadalbums;
