import { gql } from 'apollo-boost';
const ItineraryServiceList = gql`
	query($itinerary_id: ID!) {
		itinerary_service_list(itinerary_id: $itinerary_id) {
			id
			itinerary_id
			day
			date
			service {
				id
				service_id
				note
				starttime
				endtime
				order
				total_price
				latitude
				longitude
				meetingpoint_address
				core_service {
					id
					vendor_id
					name
					cover
					price
					description
					type {
						name
						icon
						description
					}
				}
			}
		}
	}
`;
export default ItineraryServiceList;
