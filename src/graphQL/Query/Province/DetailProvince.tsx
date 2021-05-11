import { gql } from "apollo-boost";
const province_detail = gql`
    query($id: ID!) {
        province_detail(id: $id) {
            id
            name
            code
            description
            cover
            map
            city {
                id
                name
                image
                destination {
                    id
                    name
                    cover
                    images {
                        image
                    }
                }
            }
        }
    }
`;
export default province_detail;
