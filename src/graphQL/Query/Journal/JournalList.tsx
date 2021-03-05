import { gql } from "apollo-boost";
const JournalList = gql`
<<<<<<< Updated upstream
  query(
    $category_id: [ID]
    $order_by: String
    $limit: Int
    $offset: Int
    $keyword: String
  ) {
    journal_list(
      category_id: $category_id
      order_by: $order_by
      limit: $limit
      offset: $offset
      keyword: $keyword
    ) {
      page_info {
        hasNextPage
        offset
      }
      datas {
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
        article {
          id
          type
          title
          text
          image
          order
        }
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
=======
	query {
		journal_list {
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
			article {
				id
				type
				title
				text
				image
				order
			}
			userby {
				id
				first_name
				last_name
				username
				bio
				created_at
				status_follower
				status_following
				picture
			}
			cities {
				id
				name
				code
>>>>>>> Stashed changes

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
export default JournalList;
