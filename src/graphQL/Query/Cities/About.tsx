import { gql } from "apollo-boost";
const About = gql`
  query($id: ID!) {
    list_about_article_city(cities_id: $id) {
      id
      name
      information_id
      article_id
      name
      description
      icon
      information_article_detail {
        id
        type
        title
        text
        image
        order
      }
    }
  }
`;
export default About;
