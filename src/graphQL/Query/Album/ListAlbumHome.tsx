import { gql } from "apollo-boost";
const AlbumItinerary = gql`
  query($keyword: String, $limit: Int, $offset: Int) {
    albums_itinerary_home(keyword: $keyword, limit: $limit, offset: $offset) {
      page_info {
        hasNextPage
        offset
      }
      datas {
        id
        title
        cover
        count_foto
        itinerary_id
        user {
          id
          username
          first_name
          last_name
          picture
        }
      }
    }
  }
`;
export default AlbumItinerary;
