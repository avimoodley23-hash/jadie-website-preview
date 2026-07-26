( function () {
	'use strict';

	const toggle = document.querySelector( '.nl-nav-toggle' );
	const menu = document.getElementById( 'nl-mobile-nav' );

	if ( ! toggle || ! menu ) {
		// The navigation may not be present in embedded previews.
	} else {
		const menuLabel = toggle.querySelector( '.screen-reader-text' );

		function setMenuState( isOpen ) {
			toggle.setAttribute( 'aria-expanded', String( isOpen ) );
			toggle.setAttribute( 'aria-label', isOpen ? 'Close menu' : 'Open menu' );
			if ( menuLabel ) {
				menuLabel.textContent = isOpen ? 'Close menu' : 'Menu';
			}
			menu.hidden = ! isOpen;
			menu.classList.toggle( 'is-open', isOpen );
		}

		toggle.addEventListener( 'click', function () {
			const isOpen = toggle.getAttribute( 'aria-expanded' ) === 'true';
			setMenuState( ! isOpen );
		} );

		menu.querySelectorAll( 'a' ).forEach( function ( link ) {
			link.addEventListener( 'click', function () {
				setMenuState( false );
			} );
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Escape' && toggle.getAttribute( 'aria-expanded' ) === 'true' ) {
				setMenuState( false );
				toggle.focus();
			}
		} );
	}

	function routeName( pathname ) {
		const part = pathname.replace( /\/+$/, '' ).split( '/' ).pop();
		return ( part || 'index.html' ).replace( /\.html$/, '' );
	}

	const currentFile = routeName( window.location.pathname );
	document.querySelectorAll( '.nl-nav-list a, .nl-mobile-nav-list a' ).forEach( function ( link ) {
		const linkFile = routeName( new URL( link.href, window.location.href ).pathname );
		if ( linkFile === currentFile ) {
			link.classList.add( 'is-current' );
			link.setAttribute( 'aria-current', 'page' );
		}
	} );

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
				const previousKeys = [ 'ArrowLeft', 'ArrowUp' ];
				const nextKeys = [ 'ArrowRight', 'ArrowDown' ];

				if ( ! previousKeys.includes( event.key ) && ! nextKeys.includes( event.key ) && event.key !== 'Home' && event.key !== 'End' ) {
					return;
				}

				event.preventDefault();
				let nextIndex;
				if ( event.key === 'Home' ) {
					nextIndex = 0;
				} else if ( event.key === 'End' ) {
					nextIndex = buttons.length - 1;
				} else {
					const direction = nextKeys.includes( event.key ) ? 1 : -1;
					nextIndex = ( index + direction + buttons.length ) % buttons.length;
				}
				activateTab( buttons[ nextIndex ] );
				buttons[ nextIndex ].focus();
			} );
		} );

		activateTab( buttons[ 0 ] );
	} );

	const reducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	const revealItems = document.querySelectorAll( 'main > .nl-section:not(.nl-section-navy), .nl-process-step' );

	if ( ! reducedMotion && 'IntersectionObserver' in window && revealItems.length ) {
		document.documentElement.classList.add( 'nl-motion-ready' );
		revealItems.forEach( function ( item ) {
			item.classList.add( 'nl-reveal' );
		} );

		const revealObserver = new IntersectionObserver(
			function ( entries, observer ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-visible' );
						observer.unobserve( entry.target );
					}
				} );
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
		);

		revealItems.forEach( function ( item ) {
			revealObserver.observe( item );
		} );
	}
}() );
