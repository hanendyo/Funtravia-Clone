import { gql } from "apollo-boost";
const MovieLocationByIDQuery = gql`
  query($movie_id: ID!) {
    movie_detail(movie_id: $movie_id) {
      id
      title
      description
      cover
      movie_destination {
        id
        description
        image
        description_image
        list_destination {
          id
          name
          rating
          count_review
          liked
          latitude
          longitude
          description
          address
          weekdayprice
          weekendprice
          openat
          status
          countries {
            id
            name
          }
          cities {
            id
            name
          }
          review {
            id
            ulasan
            rating
            image {
              image
            }
            user {
              id
              username
              first_name
              last_name
              picture
            }
          }
          type {
            id
            name
            icon
          }
          greatfor {
            id
            name
            icon
          }
          images {
            image
          }
          destination_type {
            id
            name
            icon
          }
          movie_location {
            id
            title
            description
            cover
            is_populer
          }
        }
      }
    }
  }
`;
export default MovieLocationByIDQuery;
