import { gql } from "apollo-boost";
const album = gql`
 query($itinerary_id:ID!){
  itinerary_album_list_v2(itinerary_id:$itinerary_id){
    id
    name
    start_date
    end_date
    status
    isprivate
    created_by
    created_at
    city{
      id
      name
      latitude
      longitude
    }
    country{
      id
      name
      latitude
      longitude
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
      media{
        id
        type
        filepath
        order
        is_posted
        post_id
        created_at
        
      }
    }
    
 }  
  
}
`;
export default album;
