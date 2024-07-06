// serviceWorker Script!!!
console.log( 'ServiceWorker running...' );

// APP offline nutzen!

const STATICPWA = 'Quizapp';

const assets = [
    '/',
];

self.addEventListener( 'install', installEvent => {
    installEvent.waitUntil(
        caches.open( STATICPWA ).then( cache => {
            cache.addAll( assets );
        })
    );
} );

self.addEventListener( 'fetch', fetchEvent => {
    fetchEvent.respondWith(
        caches.match( fetchEvent.request ).then( res => {
            return res || fetch( fetchEvent.request );
        })
    );
});