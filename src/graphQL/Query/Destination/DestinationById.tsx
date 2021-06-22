import { gql } from "apollo-boost";
const DestinationById = gql`
  query DestinationById($id: ID!) {
    destinationById(id: $id) {
      id
      name
      cover
      phone1
      phone2
      email1
      email2
      latitude
      longitude
      description
      address
      weekdayprice
      weekendprice
      openat
      status
      liked
      countries {
        name
      }
      cities {
        name
      }
      facebook
      instagram
      website
      map
      created_at
      updated_at
      rating
      count_review
      images {
        image
      }
      article {
        type
        title
        text
        image
        order
      }
      greatfor {
        id
        name
        slug
        icon
      }
      review {
        id
        user {
          id
          username
          first_name
          last_name
          picture
        }
        ulasan
        rating
        created_at
        updated_at
        image {
          image
        }
      }
      movie_location {
        id
        title
        description
        cover
        is_populer
        populer_order
      }
      type {
        id
        name
        slug
        suggestion
        icon
      }
      core_facilities {
        id
        name
        icon
        slug
      }
      another_place {
        id
        name
        rating
        count_review
        liked
        cities {
          id
          name
        }
        countries {
          id
          name
        }
        greatfor {
          id
          name
          slug
          icon
        }
        images {
          image
        }
      }
      article_header {
        id
        title
        type
        position
        content {
          id
          type
          title
          text
          image
          order
        }
      }
    }
  }
`;
export default DestinationById;
