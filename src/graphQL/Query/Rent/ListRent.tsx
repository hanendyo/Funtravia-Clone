import { gql } from 'apollo-boost';
const ListRent = gql`
	query($type_id: [ID], $categori_id: [ID], $keyword: String, $city_id: ID) {
		transportation_list(
			key: {
				type_id: $type_id
				categori_id: $categori_id
				keyword: $keyword
				city_id: $city_id
			}
		) {
			id
			name
			passanger
			suitcases
			cover
			price
			images {
				image
			}
		}
	}
`;
export default ListRent;
