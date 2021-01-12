import { gql } from 'apollo-boost';
const UpdatePushNotif = gql`
	mutation(
		$aktivasi_akun: Boolean!
		$price_notif: Boolean!
		$status_order_and_payment: Boolean!
		$hotels_and_flight_info: Boolean!
		$funtravia_promo: Boolean!
		$review_response: Boolean!
		$payment_remender: Boolean!
	) {
		update_notif_settings(
			input: {
				aktivasi_akun: $aktivasi_akun
				price_notif: $price_notif
				status_order_and_payment: $status_order_and_payment
				hotels_and_flight_info: $hotels_and_flight_info
				funtravia_promo: $funtravia_promo
				review_response: $review_response
				payment_remender: $payment_remender
			}
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default UpdatePushNotif;
