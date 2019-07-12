/** @format */

/**
 * External dependencies
 */
import debugFactory from 'debug';

const debug = debugFactory( 'calypso:stripe' );

/**
 * Create a Stripe PaymentMethod using Stripe Elements
 *
 * paymentDetails should include data not gathered by Stripe Elements. For
 * example, `name` (string), `address` (object with `country` [string] and
 * `postal_code` [string]).
 *
 * @param {object} stripe The stripe object with payment data included
 * @param {object} paymentDetails The `billing_details` field of the `createPaymentMethod()` request
 * @return {Promise} Promise that will be resolved or rejected
 */
export async function createStripePaymentMethod( stripe, paymentDetails ) {
	debug( 'creating payment method...', paymentDetails );
	const { paymentMethod, error } = await stripe.createPaymentMethod( 'card', {
		billing_details: paymentDetails,
	} );
	debug( 'payment method creation complete', paymentMethod, error );
	if ( error ) {
		// Note that this is a promise rejection
		throw new Error( error.message );
	}
	return paymentMethod;
}

/**
 * Confirm any PaymentIntent from Stripe response and carry out 3DS or
 * other next_actions if they are required.
 *
 * @param {object} stripe The stripe object with payment data included
 * @param {string} paymentIntentClientSecret The client secret of the PaymentIntent
 * @return {Promise} Promise that will be resolved or rejected
 */
export async function confirmStripePaymentIntent( stripe, paymentIntentClientSecret ) {
	const { error } = await stripe.handleCardPayment( paymentIntentClientSecret );
	if ( error ) {
		// Note that this is a promise rejection
		throw new Error( error.message );
	}
}