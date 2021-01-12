import { gql } from 'apollo-boost';
const ListDestination = gql`
	query($keyword: String, $type: [ID]) {
		destinationList(key: { keyword: $keyword, type: $type }) {
			id
			name
			liked
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
		}
	}
`;
export default ListDestination;
