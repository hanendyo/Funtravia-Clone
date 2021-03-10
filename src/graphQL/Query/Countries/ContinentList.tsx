import { gql } from "apollo-boost";
const ContinentList = gql`
  query($keyword: String) {
    continent_list(keyword: $keyword) {
      id
      name
      code
      description
      suggestion
    }
  }
`;
export default ContinentList;
