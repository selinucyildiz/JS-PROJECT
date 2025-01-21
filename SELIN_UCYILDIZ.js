/**
 * Project: JS project
 * Description: This JavaScript module creates a dynamic, responsive product carousel for an e-commerce website.
 *              It displays products under the "You Might Also Like" section and supports features like 
 *              navigation arrows, favorites functionality, and responsive design.
 * Developer: Selin Üçyıldız
 * Date: 05/01/2025
 * Contact: ucyildizselin@gmail.com
 */
(() => {

    // constants to store SVG markup for arrow and heart icons

    const leftArrowSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
            <path d="M15 19L8 12l7-7" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

    const rightArrowSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

    const heartSVG = (filled) => filled
        ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="blue" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.01 4.01 4 6.5 4c1.74 0 3.41 1.01 4.5 2.09C12.09 5.01 13.76 4 15.5 4 17.99 4 20 6.01 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>`
        : `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.01 4.01 4 6.5 4c1.74 0 3.41 1.01 4.5 2.09C12.09 5.01 13.76 4 15.5 4 17.99 4 20 6.01 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#000" stroke-width="0.8"/>
        </svg>`;
    

    // Initializes the carousel functionality only if the '.product-detail' element exists on the page
    const init = () => {
        if (!$('.product-detail').length) return;

        buildHTML(); // Injects the required HTML structure for the carousel
        buildCSS(); // Injects the CSS styles for the carousel
        setEvents(); // Sets up event listeners for interactivity
        loadProducts(); // Loads the product data to populate the carousel
    };

    // Builds the HTML structure for the custom carousel and appends it after '.product-detail'
    const buildHTML = () => {
        const html = `
        <div class="custom-carousel-container">     
            <div class="custom-carousel">
                <h2>You Might Also Like</h2>
                <button class="custom-carousel-arrow left">${leftArrowSVG}</button>
                <div class="carousel-wrapper">
                    <div class="carousel-track"></div>
                </div>
                <button class="custom-carousel-arrow right">${rightArrowSVG}</button> 
            </div>  
        </div>
        `;
        $('.product-detail').after(html);
    };

    // Adds the required CSS styles for the carousel dynamically
    const buildCSS = () => {
        const css = `
        /* Styling for the carousel container */

        .custom-carousel-container {
            position: relative;
            padding: 20px;
            background-color: #f4f5f7;
            border-style: none;
            font-family: 'Open Sans', sans-serif;
            overflow: hidden;
        }
        
        .custom-carousel{
            position: relative;
            width: 80%; /* carousel takes 80% of the screen */
            margin: 20px auto; /* center the carousel horizontally */
            align-items: center;
        }

        .custom-carousel h2{
            padding-bottom: 10px;
            font-family: 'Open Sans', sans-serif;
            font-size: 32px;
            line-height: 43px;
            color: #29323b;
            font-weight: lighter;
        }

        /* Carousel Wrapper */

        .carousel-wrapper {
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: flex-start; 
            align-items: center;
        }

        /* Carousel Track */

        .carousel-track {
            display: flex;
            transition: transform 0.3s ease-in-out;
            width: max-content;
            align-items: stretch;
        }
        
        /* Carousel Items */

        .carousel-item {
            flex: 0 0 calc(100% / 6.5); /* display 6.5 items */
            max-width: calc(100% / 6.5); /* ensure consistent width */
            margin: 4px;
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 0px;
            overflow: hidden;
            position: relative;
            justify-content: space-between; 
        }

        .carousel-item img {
            width: 100%;
            height: auto;
            object-fit: cover;
            cursor: pointer;
        }

        .carousel-item .product-name {
            font-size: 13px;
            margin: 10px 8px 4px;
            text-align: left;
            flex-grow: 1; 
            cursor: pointer;
            color: #302e2b;
        }

        .carousel-item .price {
            font-size: 18px;
            color: #223ca9;
            margin: 5px 8px 10px;
            text-align: left;
        }

        /* Heart */
        .carousel-item .heart {
            position: absolute;
            top: 12px;
            right: 14px;
            width: 30px;
            height: 30px;
            background: #fff;
            border-radius: 10%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            font-size: 18px;
            color: #ccc;
            transition: color 0.3s;
        }


        /* Arrows */
        .custom-carousel-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            border: none;
            color: #373737;
            font-size: 20px;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 10;
            background: none;
        }
    
        .custom-carousel-arrow.left {
            left: -40px; /* Align arrow next to the .carousel-wrapper */
        }
        
        .custom-carousel-arrow.right {
            right: -40px; /* Align arrow next to the .carousel-wrapper */
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .carousel-item {
                flex: 0 0 calc(100% / 2); /* Show 2 items */
            }

            .custom-carousel h2{
                font-size: 27px;
            }

            .custom-carousel {
                margin: 0;
                align-items: left;
            }
        
        }
        
        @media (min-width: 769px) and (max-width: 1200px) {
            .carousel-item {
                flex: 0 0 calc(100% / 4); /* Show 4 items */
            }

        }
        
        @media (min-width: 1201px) {
            .carousel-item {
                flex: 0 0 calc(100% / 6.5); /* Show 6.5 items */
            }
        }
        `;
        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };

    // Sets up event listeners for carousel arrows, product images, and favorite hearts
    const setEvents = () => {
        let isDragging = false; // flag to track if the user is currently dragging
        let startX = 0; // Stores the starting X-coordinate of the drag
        let currentTransform = 0;
        let previousTransform = 0;
    
        const track = $('.carousel-track'); // Select the carousel track element
    
        // Mouse down / touch start event
        track.on('mousedown touchstart', (e) => {
            isDragging = true;
            startX = e.pageX || e.originalEvent.touches[0].pageX; // Record the starting X-coordinate of the drag
            previousTransform = parseFloat(track.css('transform').split(',')[4]) || 0; // Get the current transform value or default to 0 if not set
            track.css('transition', 'none'); // Disable transition for real-time dragging
        });
    
        // Mouse move / touch move event
        track.on('mousemove touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.pageX || e.originalEvent.touches[0].pageX;
            const diffX = currentX - startX;
            currentTransform = previousTransform + diffX;
            track.css('transform', `translateX(${currentTransform}px)`);
        });
    
        // Mouse up / touch end event
        track.on('mouseup touchend', () => {
            if (!isDragging) return;
            isDragging = false;
    
            // Get the dimensions of the wrapper and carousel items
            const wrapperWidth = $('.carousel-wrapper').outerWidth();
            const itemWidth = $('.carousel-item').outerWidth(true);
            const maxTransform = -(track[0].scrollWidth - wrapperWidth); // Calculate the maximum negative transform value (scroll limit)
    
            // Calculate the nearest item index
            const nearestItemIndex = Math.round(Math.abs(currentTransform) / itemWidth);
            const nearestItemTransform = -(nearestItemIndex * itemWidth);
    
            // Restrict the transform value within bounds
            if (nearestItemTransform > 0) {
                currentTransform = 0;
            } else if (nearestItemTransform < maxTransform) {
                currentTransform = maxTransform;
            } else {
                currentTransform = nearestItemTransform;
            }
    
            // Snap to the nearest item
            track.css({
                transition: 'transform 0.3s ease-in-out',
                transform: `translateX(${currentTransform}px)`,
            });
        });
    
        // Prevent default behavior to avoid unwanted text selection during drag
        track.on('dragstart', (e) => e.preventDefault());
    
        // Event listener for left arrow click to slide the carousel left
        $(document).on('click', '.custom-carousel-arrow.left', () => slideCarousel('left'));

        // Event listener for right arrow click to slide the carousel right
        $(document).on('click', '.custom-carousel-arrow.right', () => slideCarousel('right'));

        // Event listener for clicking a product image to open its URL in a new tab
        $(document).on('click', '.carousel-item img', (e) => {
            const url = $(e.target).closest('.carousel-item').data('url');
            window.open(url, '_blank');
        });

        // Event listener for clicking a product image to open its URL in a new tab
        $(document).on('click', '.carousel-item .product-name', (e) => {
            const url = $(e.target).closest('.carousel-item').data('url');
            window.open(url, '_blank');
        });
        // Toggles the favorite status of a product when the heart icon is clicked
        $(document).on('click', '.carousel-item .heart', (e) => {
            const heart = $(e.target).closest('.heart'); // Get the clicked heart
            const productId = heart.closest('.carousel-item').data('id'); // Get the product ID
            let favorites = JSON.parse(localStorage.getItem('favorites') || '[]'); // Load favorites from localStorage
        
            if (heart.hasClass('filled')) {
                // Remove from favorites
                heart.removeClass('filled').html(heartSVG(false)); // Update SVG
                favorites = favorites.filter(id => id !== productId); // Remove productId from favorites
            } else {
                // Add to favorites
                heart.addClass('filled').html(heartSVG(true)); // Update SVG
                favorites.push(productId); // Add productId to favorites
            }
        
            // Update localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
        
    };

    // Loads product data from localStorage or fetches it from an external source
    const loadProducts = () => {
        const cachedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        if (cachedProducts.length > 0) {
            renderProducts(cachedProducts); // Renders cached products if available
        } else {
            fetchProducts(); // Fetches products from the external API if cache is empty
        }
    };

    // Fetches product data from an external URL and caches it in localStorage
    const fetchProducts = () => {
        const url = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc823a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f37/products.json';
        fetch(url)
            .then(response => response.json())
            .then(products => {
                localStorage.setItem('products', JSON.stringify(products)); // Caches the fetched products
                renderProducts(products); // Renders the fetched products
            })
            .catch(err => console.error('Failed to fetch products:', err));
    };

    // Renders the product items inside the carousel track based on the product data
    const renderProducts = (products) => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const productHTML = products.map(product => `
            <div class="carousel-item" data-id="${product.id}" data-url="${product.url}">
                <img src="${product.img}" alt="${product.name}">
                <div class="heart ${favorites.includes(product.id) ? 'filled' : ''}">
                    ${heartSVG(favorites.includes(product.id))}
                </div>
                <div class="product-name">${product.name}</div>
                <div class="price">${product.price} TL</div>
            </div>
        `).join('');
        $('.carousel-track').html(productHTML);
    };
    

    // Handles sliding the carousel track left or right based on user interaction
    const slideCarousel = (direction) => {
        const track = $('.carousel-track');
        const wrapperWidth = $('.carousel-wrapper').outerWidth(); // Width of the visible area
        const itemWidth = $('.carousel-item').outerWidth(true); // Includes margins
        const currentTransform = parseFloat(track.css('transform').split(',')[4]) || 0;

        // Calculates the maximum transform value to prevent overflowing the track
        let maxTransform = -(track[0].scrollWidth - wrapperWidth);
        let newTransform = direction === 'left'
            ? currentTransform + itemWidth // Slide left
            : currentTransform - itemWidth; // Slide right

        // Restricts the transform value within allowed bounds
        if (newTransform > 0) newTransform = 0;
        if (newTransform < maxTransform) newTransform = maxTransform;

        track.css('transform', `translateX(${newTransform}px)`); // Applies the transform to slide the track
    };

    init(); // Entry point to initialize the carousel
})();
