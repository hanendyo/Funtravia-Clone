import { gql } from "apollo-boost";
const filterDestinationV2 = gql`
  query {
    destination_filter {
      type {
        id
        name
        sugestion
        checked
        show
      }
      facility {
        id
        name
        icon
        sugestion
        checked
        show
      }
      country {
        id
        name
        flag
        code
        sugestion
        checked
        show
      }
    }
  }
`;
export default filterDestinationV2;
