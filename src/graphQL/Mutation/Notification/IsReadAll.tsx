import { gql } from "apollo-boost";
const IsReadAll = gql`
    mutation {
        read_all_notif {
            id
            response_time
            message
            code
        }
    }
`;
export default IsReadAll;
