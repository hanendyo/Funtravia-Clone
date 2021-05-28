import { gql } from "apollo-boost";
const ListDestination = gql`
    query(
        $keyword: String
        $type: [ID]
        $countries: [ID]
        $cities: [ID]
        $provinces: [ID]
        $goodfor: [ID]
        $facilities: [ID]
        $rating: [Int]
    ) {
        destinationList_v2(
            key: {
                keyword: $keyword
                type: $type
                countries: $countries
                cities: $cities
                provinces: $provinces
                goodfor: $goodfor
                facilities: $facilities
                rating: $rating
            }
        ) {
            id
            name
            rating
            cover
            count_review
            liked
            cities {
                id
                name
            }
            countries {
                id
                name
            }
            greatfor {
                label
                icon
            }
            images {
                image
            }
        }
    }
`;
export default ListDestination;
