import { gql } from "apollo-boost";
const ListAlbumItineraryHome = gql`
  query($user_id: ID!, $keyword: String, $limit: Int, $offset: Int) {
    albums_itinerary_home(
      user_id: $user_id
      keyword: $keyword
      limit: $limit
      offset: $offset
    ) {
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
export default ListAlbumItineraryHome;
