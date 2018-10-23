/** @format */

/**
 * External dependencies
 */

import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */

import { settings } from './settings.js';

class MapSave extends Component {
	render() {
		const { className, attributes } = this.props;
		const { map_style, points, zoom, map_center, marker_color } = attributes;
		return (
			<div
				className={ className }
				data-map_style={ map_style }
				data-points={ JSON.stringify( points ) }
				data-zoom={ zoom }
				data-map_center={ JSON.stringify( map_center ) }
				data-marker_color={ marker_color }
				data-api_key={ settings.GOOGLE_MAPS_API_KEY }
			/>
		);
	}
}

export default MapSave;
