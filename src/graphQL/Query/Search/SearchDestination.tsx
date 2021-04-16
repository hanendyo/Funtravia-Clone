import { gql } from 'apollo-boost';
const SearchDestinationQuery = gql`
	query($keyword: String) {
		destinationSearch(keyword: $keyword) {
			id
			name
			rating
			cover
			count_review
			cities {
				id
				name
			}
			countries {
				id
				name
			}
			greatfor {
				id
				name
				label
				icon
				slug
			}
			images {
				image
			}
			liked
		}
	}
`;
export default SearchDestinationQuery;
