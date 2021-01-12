import { gql } from 'apollo-boost';
const SearchDestinationQuery = gql`
	query($keyword: String) {
		destinationSearch(keyword: $keyword) {
			id
			name
			rating
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
				label
				icon
			}
			images {
				image
			}
			liked
		}
	}
`;
export default SearchDestinationQuery;
