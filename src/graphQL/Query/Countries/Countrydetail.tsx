import { gql } from "apollo-boost";
const country_detail = gql`
  query($id: ID!) {
    country_detail(id: $id) {
			id
			name
			code
			description
      cover
			flag
			images {
				image
			}
			map
			city {
				id
				name
				image
        destination{
          id
          name
          cover
          images{
            image
          }
        }
			}
			article_header {
				id
				title
				type
				position
				relation_id
				content {
					id
					type
					title
					text
					image
					order
				}
			}
			article_type {
				id
				name
			}
			journal {
				id
				title
				text
				picture
        liked
			}
      about{
        id
        type
        information_id
        article_id
        name
        label
        description
        icon
      }
      practical{
        id
        type
        information_id
        article_id
        name
        label
        description
        icon
      }
		}
  }
`;
export default country_detail;
