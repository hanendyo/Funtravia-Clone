import { gql } from 'apollo-boost';
const ListPopulerGQL = gql`
	query(
		$keyword: String
		$type: [ID]
		$countries: [ID]
		$cities: [ID]
		$rating: [Int]
		$orderby: String
		$limit: Int
		$offset: Int
	) {
		itinerary_list_populer(
			key: {
				keyword: $keyword
				type: $type
				countries: $countries
				cities: $cities
				orderby: $orderby
				rating: $rating
				limit: $limit
				offset: $offset
			}
		) {
			page_info{
      hasNextPage
      offset
    }
    datas{
      id
      name
      cover
      country{
        id
        name
      }
      city{
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
      day{
        id
        day
        date
      }
      liked
      categori{
        id
        name
        slug
        icon
      }
      }
		}
	}
`;
export default ListPopulerGQL;
