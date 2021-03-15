import { gql } from "apollo-boost";
const CountryListSrcUnesco = gql`
  query($continent_id: [ID], $keyword: String) {
    list_country_src_unesco(continent_id: $continent_id, keyword: $keyword) {
      id
      name
      code
      description
      flag
      map
      created_by
      updated_by
      created_at
      updated_at
      currency {
        id
        name
        code
      }
      images {
        image
      }
    }
  }
`;
export default CountryListSrcUnesco;
