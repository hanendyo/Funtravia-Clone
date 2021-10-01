import { gql } from 'apollo-boost';
const Country = gql`
	query($keyword: String) {
		country_search(keyword: $keyword) {
			id
			name
			flag
			image {
				image
			}
			city {
				id
				name
				count_destination
				count_plan_tour
				image {
					image
				}
			}
		}
	}
`;
export default Country;
