import { gql } from "apollo-boost";
const JournalList = gql`
  query($id: ID!, $offset: Int, $limit: Int) {
    comment_journal_list(
      travel_journal_id: $id
      offset: $offset
      limit: $limit
    ) {
      page_info {
        hasNextPage
        offset
      }
      datas {
        id
        user {
          id
          username
          first_name
          last_name
          picture
        }
        text
        created_at
        updated_at
      }
    }
  }
`;
export default JournalList;
