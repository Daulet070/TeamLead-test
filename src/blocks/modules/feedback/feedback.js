
document.addEventListener( 'DOMContentLoaded', function () {
    console.log('ok');
    new Splide( '#card-slider', {
        type: 'loop',
        autoplay: true,
        perPage    : 1,
        breakpoints: {
            600: {
                perPage: 1,
            }
        }
    }).mount();

});