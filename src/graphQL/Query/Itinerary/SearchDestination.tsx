import { gql } from "apollo-boost";
const City = gql`
  query($keyword: String, $cities_id: [ID], $province_id: [ID], $countries_id: [ID]) {
    searchlocation_populer(
      keyword: $keyword
      cities_id: $cities_id
      province_id: $province_id
      countries_id: $countries_id
    ) {
      id
      name
      cover
      type
      head1
      head2
    }
  }
`;
export default City;
