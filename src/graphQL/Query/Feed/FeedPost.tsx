import { gql } from 'apollo-boost';
const FeedPost = gql`
    query($offset: Int) {
        feed_post(limit: 5, offset:$offset) {
            id
            caption
            longitude
            latitude
            location_name
            liked
            comment_count
            response_count
            created_at
            updated_at
            assets {
                id
                type
                filepath
            }
            user {
                id
                username
                first_name
                last_name
                picture
                ismyfeed
            }
        }
    }
`;
export default FeedPost;