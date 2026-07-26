( function () {
	'use strict';

	const toggle = document.querySelector( '.nl-nav-toggle' );
	const menu = document.getElementById( 'nl-mobile-nav' );

	if ( ! toggle || ! menu ) {
		// The navigation may not be present in embedded previews.
	} else {
		toggle.addEventListener( 'click', function () {
			const isOpen = toggle.getAttribute( 'aria-expanded' ) === 'true';
			toggle.setAttribute( 'aria-expanded', String( ! isOpen ) );
			menu.hidden = isOpen;
			menu.classList.toggle( 'is-open', ! isOpen );
		} );
	}

	document.querySelectorAll( '.nl-service-tabs' ).forEach( function ( tabs ) {
		const buttons = Array.from( tabs.querySelectorAll( '[role="tab"]' ) );
		const panels = Array.from( tabs.querySelectorAll( '[role="tabpanel"]' ) );

		if ( ! buttons.length || ! panels.length ) {
			return;
		}

		tabs.classList.add( 'is-enhanced' );

		function activateTab( activeButton ) {
			buttons.forEach( function ( button ) {
				const isActive = button === activeButton;
				button.classList.toggle( 'is-active', isActive );
				button.setAttribute( 'aria-selected', String( isActive ) );
				button.setAttribute( 'tabindex', isActive ? '0' : '-1' );
			} );

			panels.forEach( function ( panel ) {
				const isActive = panel.id === activeButton.getAttribute( 'aria-controls' );
				panel.classList.toggle( 'is-active', isActive );
				panel.hidden = ! isActive;
			} );
		}

		buttons.forEach( function ( button, index ) {
			button.addEventListener( 'click', function () {
				activateTab( button );
			} );

			button.addEventListener( 'keydown', function ( event ) {
				if ( event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' ) {
					return;
				}

				event.preventDefault();
				const direction = event.key === 'ArrowRight' ? 1 : -1;
				const nextIndex = ( index + direction + buttons.length ) % buttons.length;
				activateTab( buttons[ nextIndex ] );
				buttons[ nextIndex ].focus();
			} );
		} );

		activateTab( buttons[ 0 ] );
	} );
}() );
