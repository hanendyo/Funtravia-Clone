import { gql } from 'apollo-boost';
const Destination = gql`
	query($keyword: String) {
		listdetination_wishlist(keyword: $keyword) {
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
export default Destination;
