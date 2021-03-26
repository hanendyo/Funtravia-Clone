import { gql } from "apollo-boost";
const country_detail = gql`
  query($id: ID!) {
    country_detail(id: $id) {
      id
      name
      code
      description
      flag
      images {
        image
      }
      map
      city {
        id
        name
        image
        destination {
          id
          name
          review
          images {
            image
          }
        }
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
      article_type {
        id
        name
      }
      journal {
        id
        liked
        title
        text
        picture
       
      }
    }
  }
`;
export default country_detail;
