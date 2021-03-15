import { gql } from "apollo-boost";
const CountryListSrcMovie = gql`
  query($continent_id: [ID], $keyword: String) {
    list_country_src_movie(continent_id: $continent_id, keyword: $keyword) {
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
export default CountryListSrcMovie;
