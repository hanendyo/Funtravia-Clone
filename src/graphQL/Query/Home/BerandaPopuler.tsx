import { gql } from "apollo-boost";
const BerandaPopuler = gql`
    query {
        beranda_popularV2(limit: 7) {
            id
            name
            count_destination
            type
            cover
        }
    }
`;
export default BerandaPopuler;
