import { gql } from "apollo-boost";
const SearchUserQueryNew = gql`
    query($keyword: String, $cities_id: ID, $countries_id: ID) {
        user_searchv2(
            key: {
                keyword: $keyword
                cities_id: $cities_id
                countries_id: $countries_id
            }
        ) {
            id
            username
            first_name
            last_name
            picture
            status_follower
            status_following
        }
    }
`;
export default SearchUserQueryNew;
