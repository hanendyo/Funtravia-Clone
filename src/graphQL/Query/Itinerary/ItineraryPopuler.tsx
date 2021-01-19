import { gql } from 'apollo-boost';
const ListPopulerGQL = gql`
	query(
		$keyword: String
		$type: [ID]
		$countries: [ID]
		$cities: [ID]
		$rating: [Int]
		$orderby: String
	) {
		itinerary_list_populer(
			key: {
				keyword: $keyword
				type: $type
				countries: $countries
				cities: $cities
				orderby: $orderby
				rating: $rating
			}
		) {
			id
			name
			cover
			country {
				id
				name
			}
			city {
				id
				name
				flag
			}
			buddy_count
			favorit_count
			start_date
			end_date
			isprivate
			status
			day {
				id
				day
				date
			}
			liked
		}
	}
`;
export default ListPopulerGQL;
