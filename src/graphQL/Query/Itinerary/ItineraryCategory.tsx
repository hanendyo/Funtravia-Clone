import { gql } from 'apollo-boost';
const ItineraryCategory = gql`
query{
  category_journal{
    id
    name
    slug
    icon
  }
}
`;
export default ItineraryCategory;