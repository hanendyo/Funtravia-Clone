import { gql } from "apollo-boost";
const FollowerQuery = gql`
    query {
        user_followers {
            id
            username
            first_name
            last_name
            picture
            bio
            status_following
        }
    }
`;
export default FollowerQuery;
