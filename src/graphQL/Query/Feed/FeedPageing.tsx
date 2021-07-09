import { gql } from "apollo-boost";
const FeedPageing = gql`
  query($limit: Int, $offset: Int) {
    feed_post_pageing(limit: $limit, offset: $offset) {
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
        album {
          id
          title
          cover
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
  }
`;
export default FeedPageing;
