import { gql } from "apollo-boost";
const JournalFavorite = gql`
  query($keyword: String) {
    list_journal_favorite(keyword: $keyword) {
      id
      travel_journal_id
      user_id
      response
      travel_journal {
        id
        title
        date
        firstimg
        firsttxt
        article_comment_count
        article_response_count
        created_at
        updated_at
        liked
        userby {
          id
          first_name
          last_name
          username
          bio
          created_at
          status_follower
          status_following
        }
        cities {
          id
          name
          code
          latitude
          longitude
          description
        }
        countries {
          id
          name
          code
          description
          flag
          capital
          currency_name
          currency_symbol
          currency_code
          flag
          map
        }
        province {
          id
          code
          name
          description
          map
        }
        destination {
          id
          name
          latitude
          longitude
        }
        categori {
          id
          name
          slug
          icon
        }
      }
    }
  }
`;
export default JournalFavorite;
