import { gql } from "apollo-boost";
const TravelAlbumList = gql`
query($itinerary_id: ID!){
    list_album_itinerary_with_media(itinerary_id: $itinerary_id){
      id
      name
          cover
          album {
              id
              title
              cover
              type
              media {
                  id
                  type
                  order
                  filepath
              }
          }
      }
    }
`;
export default TravelAlbumList;
