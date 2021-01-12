import { gql } from 'apollo-boost';
const RegionList = gql`
	query($keyword: String, $type: [ID]) {
		region_list(key: { keyword: $keyword, type: $type }) {
			id
			name
			image {
				image
			}
			city {
				id
				name
				latitude
				longitude
				count_plan_tour
				count_destination
				image {
					image
				}
			}
		}
	}
`;
export default RegionList;
