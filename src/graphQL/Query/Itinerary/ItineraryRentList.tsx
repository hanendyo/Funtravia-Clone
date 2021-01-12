import { gql } from 'apollo-boost';
const ItineraryRentList = gql`
	query($itinerary_id: ID!) {
		itinerary_rent_list(itinerary_id: $itinerary_id) {
			id
			itinerary_id
			day
			date
			rent {
				id
				trans_id
				core_trans {
					name
					latitude
					longitude
					status
					description
					address
					price
					with_driver
					drive_price
					passanger
					suitcases
					cover
					images {
						image
					}
				}
				qty
				note
				order
				total_price
				latitude
				longitude
				address_pickup
				with_driver
				starttime
				endtime
			}
		}
	}
`;
export default ItineraryRentList;
