import { gql } from "apollo-boost";
const SearchLocationQuery = gql`
    query(
        $keyword: String
        $cities_id: ID
        $province_id: ID
        $countries_id: ID
    ) {
        search_location(
            keyword: $keyword
            cities_id: $cities_id
            province_id: $province_id
            countries_id: $countries_id
        ) {
            id
            name
            cover
            type
        }
    }
`;
export default SearchLocationQuery;
