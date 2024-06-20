import { select as d3_select } from 'd3-selection';

import { t, localizer } from '../core/localizer';
import { uiTooltip } from './tooltip';
import { geoExtent } from '../geo';
import { svgIcon } from '../svg/icon';

export function uiBJlocate(context) {
    var _geolocationOptions = {
        // prioritize speed and power usage over precision
        enableHighAccuracy: false,
        // don't hang indefinitely getting the location
        timeout: 6000 // 6sec
    };
    var _position;
    var _extent;
    var _button = d3_select(null);

    function click() {
        navigator.geolocation.getCurrentPosition(success, error, _geolocationOptions);
    }

    function zoomTo() {
        var map = context.map();
        map.centerZoomEase([116.39702,39.91799], 17.00);
    }

    function success(geolocation) {
        _position = geolocation;
        var coords = _position.coords;
        _extent = geoExtent([coords.longitude, coords.latitude]).padByMeters(coords.accuracy);
        zoomTo();
    }

    function error() {
        zoomTo();
    }
    // favorite
    return function(selection) {
        if (!navigator.geolocation || !navigator.geolocation.getCurrentPosition) return;
        _button = selection
            .append('button')
            .on('click', click)
            .attr('aria-pressed', false)
            .call(svgIcon('#iD-icon-favorite', 'light'))
            .call(uiTooltip()
                .placement((localizer.textDirection() === 'rtl') ? 'right' : 'left')
                .title(() => t.append('BJlocate.title'))
                .keys([t('BJlocate.key')])
            );

        context.keybinding().on(t('BJlocate.key'), click);
    };
}
