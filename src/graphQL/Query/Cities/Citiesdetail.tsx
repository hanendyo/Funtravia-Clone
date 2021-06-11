import { gql } from "apollo-boost";
const CitiesInformation = gql`
  query($id: ID!) {
    CitiesInformation(id: $id) {
      id
      name
      code
      latitude
      longitude
      description
      countries {
        id
        name
        flag
      }
      map
      cover
      image {
        image
      }
      images {
        image
      }
      article_header {
        id
        title
        type
        position
        relation_id
        content {
          id
          type
          title
          text
          image
          order
        }
      }
      destination_type {
        id_type
        name
        icon
      }
      journal {
        id
        title
        text
        picture
        liked
      }
      event {
        month
        event {
          id
          name
          category {
            id
            name
          }
          start_date
          end_date
          ticket_link
          city {
            id
            name
          }
          country {
            id
            name
          }
          description
          image
          cover
          latitude
          longitude
          address
          vendor {
            id
            name
            cover
          }
          open
          ticket {
            id
            name
            price
            description
          }
          images {
            image
          }
          liked
        }
      }
      itinerary_populer {
        id
        name
        country {
          id
          name
        }
        city {
          id
          name
          flag
        }
        start_date
        end_date
        isprivate
        status
        cover
        buddy_count
        favorit_count
        liked
        categori {
          id
          name
          slug
          icon
        }
        user_created {
          id
          username
          first_name
          last_name
          picture
        }
      }
      about {
        id
        type
        information_id
        article_id
        name
        label
        description
        icon
      }
      practical {
        id
        type
        information_id
        article_id
        name
        label
        description
        icon
      }
    }
  }
`;
export default CitiesInformation;
