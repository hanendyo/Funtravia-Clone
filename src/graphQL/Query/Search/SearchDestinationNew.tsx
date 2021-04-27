import { gql } from "apollo-boost";
const SearchDestinationQueryNew = gql`
    query($keyword: String, $cities_id: ID, $countries_id: ID) {
        destinationSearchv2(
            keyword: $keyword
            cities_id: $cities_id
            countries_id: $countries_id
        ) {
            id
            name
            rating
            cover
            count_review
            cities {
                id
                name
            }
            countries {
                id
                name
            }
            greatfor {
                id
                name
                label
                icon
                slug
            }
            images {
                image
            }
            liked
        }
    }
`;
export default SearchDestinationQueryNew;
