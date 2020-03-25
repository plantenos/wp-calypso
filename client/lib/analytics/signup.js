/**
 * External dependencies
 */
import debug from 'debug';

/**
 * Internal dependencies
 */
import analytics from 'lib/analytics';
import {
	adTrackSignupStart,
	adTrackSignupComplete,
	adTrackRegistration,
} from 'lib/analytics/ad-tracking';

const signupDebug = debug( 'calypso:analytics:signup' );

export function recordSignupStart( flow, ref ) {
	// Tracks
	analytics.tracks.recordEvent( 'calypso_signup_start', { flow, ref } );
	// Google Analytics
	analytics.ga.recordEvent( 'Signup', 'calypso_signup_start' );
	// Marketing
	adTrackSignupStart( flow );
}

export function recordSignupComplete(
	{ flow, isNewUser, isNewSite, hasCartItems, isNew7DUserSite },
	now
) {
	if ( ! now ) {
		// Delay using the analytics localStorage queue.
		return analytics.queue.add(
			'recordSignupComplete',
			{ flow, isNewUser, isNewSite, hasCartItems, isNew7DUserSite },
			true
		);
	}

	// Tracks
	analytics.tracks.recordEvent( 'calypso_signup_complete', {
		flow,
		is_new_user: isNewUser,
		is_new_site: isNewSite,
		has_cart_items: hasCartItems,
	} );

	// Google Analytics
	const flags = [
		isNewUser && 'is_new_user',
		isNewSite && 'is_new_site',
		hasCartItems && 'has_cart_items',
	].filter( Boolean );

	analytics.ga.recordEvent( 'Signup', 'calypso_signup_complete:' + flags.join( ',' ) );

	if ( isNew7DUserSite ) {
		// Tracks
		analytics.tracks.recordEvent( 'calypso_new_user_site_creation', { flow } );

		// Google Analytics
		analytics.ga.recordEvent( 'Signup', 'calypso_new_user_site_creation' );
	}

	adTrackSignupComplete( { isNewUserSite: isNewUser && isNewSite } );
}

export function recordSignupStep( flow, step ) {
	analytics.tracks.recordEvent( 'calypso_signup_step_start', { flow, step } );
}

export function recordSignupInvalidStep( flow, step ) {
	analytics.tracks.recordEvent( 'calypso_signup_goto_invalid_step', { flow, step } );
}

export function recordRegistration( { userData, flow, type } ) {
	signupDebug( 'recordRegistration:', { userData, flow, type } );

	// Tracks user identification
	analytics.identifyUser( userData );
	// Tracks
	analytics.tracks.recordEvent( 'calypso_user_registration_complete', { flow, type } );
	// Google Analytics
	analytics.ga.recordEvent( 'Signup', 'calypso_user_registration_complete' );
	// Marketing
	adTrackRegistration();
}
