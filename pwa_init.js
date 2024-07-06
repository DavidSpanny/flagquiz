// neuen ServiceWorker einrichten
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register( '/serviceWorker.js' )
    .then( res=>{ console.log( 'seriveWorker registered.' ) } )
    .catch( err=>{ console.log( 'serviceWorker Error', err ); } )
}

// User ein Install-Prompt anzeigen
window.addEventListener( 'beforeinstallprompt', (e)=>{
    console.log( 'beforeinstallprompt' );
    e.userChoice.then( result => {
        console.log( result.outcome );
        if ( result.outcome == 'dismissed' ) {
            console.log( 'User nicht installiert' );
        } else {
            console.log( 'PWA auf homescreen abgelegt' );
        }
    });
});