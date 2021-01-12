import { gql } from 'apollo-boost';
const SearchAccommodationQuery = gql`
	query($keyword: String) {
		accomodationSearch(key: { keyword: $keyword }) {
			id
			name
			rating
			name_type
			latitude
			longitude
			pricerange
			count_review
			facilities_count
			class_count
			cities {
				name
			}
			countries {
				name
			}
			images {
				image
			}
			liked
		}
	}
`;
export default SearchAccommodationQuery;
