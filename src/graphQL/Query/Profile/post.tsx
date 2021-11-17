import { gql } from "apollo-boost";
const post = gql`
  query($limit: Int, $offset: Int, $user_id: ID!) {
    user_post_paging(limit: $limit, offset: $offset, user_id: $user_id) {
      page_info {
        hasNextPage
        offset
      }
      datas {
        id
        caption
        longitude
        latitude
        location_name
        liked
        media_orientation
        comment_count
        response_count
        created_at
        updated_at
        album {
          id
          title
          cover
          itinerary {
            id
            name
          }
          user {
            id
            username
            first_name
            last_name
            picture
          }
        }
        assets {
          id
          type
          filepath
        }
        user {
          id
          username
          first_name
          last_name
          picture
          ismyfeed
        }
        is_single
        itinerary {
          id
          name
          country {
            id
            name
          }
          city {
            id
            name
          }
          start_date
          end_date
          isprivate
          status
          cover
          liked
          categori {
            id
            name
            icon
            slug
          }
          user_created {
            id
            username
            first_name
            last_name
            picture
          }
        }
        day {
          id
          date
          day
          total_hours
        }
      }
    }
  }
`;
export default post;
