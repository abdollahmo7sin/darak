jQuery(document).ready(function () {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

    // Unified Navbar Toggle
    const navbarMenu = document.getElementById('navbarMenu');
    const navbarItem = document.querySelector('.custom-navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');

    if (mobileMenuToggle && navbarMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = navbarMenu.classList.toggle('active');
            navbarItem.classList.toggle('mobile-active');

            // Toggle icon (optional: switch between bars and times)
            const icon = mobileMenuToggle.querySelector('i');
            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        });
    }

    // Handle Mobile Dropdowns (Links and Buttons) with Slide Effect
    const dropdownTriggers = $('.custom-dropdown > a, .custom-dropdown > button, .custom-dropdown-submenu > a');
    dropdownTriggers.on('click', function (e) {
        if (window.innerWidth < 992) {
            e.preventDefault();
            e.stopPropagation();

            const $this = $(this);
            const $parent = $this.parent();
            const $submenu = $this.next('ul');

            // Toggle the submenu slide
            $submenu.slideToggle(400);

            // Toggle active class for other styling (like chevron rotation)
            const isActive = $parent.toggleClass('active').hasClass('active');

            // Toggle rotation of chevrons
            const $icon = $this.find('i');
            if ($icon.length) {
                $icon.css({
                    'transition': 'transform 0.3s ease',
                    'transform': isActive ? 'rotate(180deg)' : ''
                });
            }
        }
    });

    // Hero Section Swiper Initialization
    if (document.querySelector('.hero-swiper')) {
        var heroSwiper = new Swiper('.hero-swiper', {
            rtl: isRtl,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1000,
            allowTouchMove: false
        });
    }
    // Best Selection Swiper
    if (document.querySelector('.best-selection-swiper')) {
        var bestSelectionSwiper = new Swiper('.best-selection-swiper', {
            rtl: isRtl,
            loop: true,
            loopedSlides: 5,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 30,
            speed: 700,
            navigation: {
                prevEl: '.bs-nav-prev',
                nextEl: '.bs-nav-next',
            },
            pagination: {
                el: '.best-selection-progressbar',
                type: 'progressbar',
            },
        });
    }

    // Testimonials Swiper
    if (document.querySelector('.testi-swiper')) {
        var testiSwiper = new Swiper('.testi-swiper', {
            rtl: isRtl,
            loop: true,
            speed: 700,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            navigation: {
                prevEl: '.testi-button-prev',
                nextEl: '.testi-button-next',
            },
            pagination: {
                el: '.testi-progressbar',
                type: 'progressbar',
            },
        });
    }
    // Counter Up Animation
    const counters = document.querySelectorAll('.counter-up');
    const speed = 200; // The lower the slower

    const startCounter = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                let currentCount = 0;
                const updateCount = () => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const inc = target / speed;

                    if (currentCount < target) {
                        currentCount += inc;

                        // Check if currentCount exceeds target due to floating point math
                        const displayValue = currentCount > target ? target : currentCount;

                        if (target % 1 !== 0) {
                            counter.innerText = displayValue.toFixed(1);
                        } else {
                            counter.innerText = Math.ceil(displayValue);
                        }

                        if (displayValue < target) {
                            setTimeout(updateCount, 1);
                        } else {
                            counter.innerText = target;
                        }
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounter, {
        threshold: 1.0
    });

    counters.forEach(counter => counterObserver.observe(counter));



    // About Hero Video Modal - Stop video when modal closes
    $('#aboutVideoModal').on('hidden.bs.modal', function () {
        var $iframe = $(this).find('iframe');
        var tempSrc = $iframe.attr('src');
        $iframe.attr('src', '');
        $iframe.attr('src', tempSrc);
    });

    // Listing View Toggle (Reusable)
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const propertiesList = document.getElementById('propertiesList');

    if (listViewBtn && gridViewBtn && propertiesList) {
        listViewBtn.addEventListener('click', function () {
            this.classList.add('active');
            gridViewBtn.classList.remove('active');
            propertiesList.classList.remove('grid-view');
            propertiesList.classList.add('list-view');
            propertiesList.classList.remove('flex-row', 'flex-wrap');
            propertiesList.classList.add('flex-column');
        });

        gridViewBtn.addEventListener('click', function () {
            this.classList.add('active');
            listViewBtn.classList.remove('active');
            propertiesList.classList.remove('list-view');
            propertiesList.classList.add('grid-view');
            propertiesList.classList.remove('flex-column');
        });
    }

    // Favourites Heart Toggle (Reusable)
    $(document).on('click', '.property-list-fav-btn, .property-action-icon', function () {
        $(this).toggleClass('active-accent');
        const heart = this.querySelector('i');
        if (heart) {
            if ($(this).hasClass('active-accent') || $(this).hasClass('active')) {
                heart.classList.remove('fal');
                heart.classList.add('fas');
            } else {
                heart.classList.remove('fas');
                heart.classList.add('fal');
            }
        }
    });

    // Price Range Sliders Initialization (Generic)
    if (typeof noUiSlider !== 'undefined') {
        const formatPrice = (val) => {
            if (val >= 1000000) return '$' + (val / 1000000).toFixed(1).replace('.0', '') + 'M';
            if (val >= 1000) return '$' + (val / 1000).toFixed(0) + 'k';
            return '$' + val;
        };

        function initSlider(id, minId, maxId, rangeMin, rangeMax, startMin, startMax) {
            const slider = document.getElementById(id);
            if (!slider) return;

            const minInput = document.getElementById(minId);
            const maxInput = document.getElementById(maxId);
            if (!minInput || !maxInput) return;

            noUiSlider.create(slider, {
                start: [startMin, startMax],
                connect: true,
                direction: isRtl ? 'rtl' : 'ltr',
                range: { 'min': rangeMin, 'max': rangeMax },
                format: {
                    to: value => Math.round(value),
                    from: value => Number(value)
                }
            });

            slider.noUiSlider.on('update', function (values, handle) {
                if (handle == 1) maxInput.value = values[handle];
                else minInput.value = values[handle];
            });

            minInput.addEventListener('change', function () { slider.noUiSlider.set([this.value, null]); });
            maxInput.addEventListener('change', function () { slider.noUiSlider.set([null, this.value]); });
        }

        // Initialize Global Sliders
        initSlider('price-range-slider', 'price-min', 'price-max', 0, 100000000, 1000000, 10000000);
        initSlider('ppf-range-slider', 'ppf-min', 'ppf-max', 0, 50000, 500, 5000);

        // Initialize Index Search Sliders
        document.querySelectorAll('.js-price-range-slider').forEach(slider => {
            const rangeMin = parseFloat(slider.dataset.min || 0);
            const rangeMax = parseFloat(slider.dataset.max || 1000000);
            const startMin = parseFloat(slider.dataset.startMin || rangeMin);
            const startMax = parseFloat(slider.dataset.startMax || rangeMax);

            noUiSlider.create(slider, {
                start: [startMin, startMax],
                connect: true,
                direction: isRtl ? 'rtl' : 'ltr',
                range: { 'min': rangeMin, 'max': rangeMax },
                format: {
                    to: value => Math.round(value),
                    from: value => Number(value)
                }
            });

            const parent = slider.closest('.price-range-wrapper');
            const minInput = parent.querySelector('.js-price-range-min-input');
            const maxInput = parent.querySelector('.js-price-range-max-input');

            slider.noUiSlider.on('update', function (values, handle) {
                if (handle === 0) {
                    if (minInput) minInput.value = values[0];
                } else {
                    if (maxInput) maxInput.value = values[1];
                }

                // Update Display Text
                const display = parent.closest('.custom-search-dropdown').querySelector('.js-current-price-display');
                if (display) {
                    display.innerText = `${formatPrice(values[0])} - ${formatPrice(values[1])}`;
                }
            });

            if (minInput) {
                minInput.addEventListener('change', function () {
                    slider.noUiSlider.set([this.value, null]);
                });
            }

            if (maxInput) {
                maxInput.addEventListener('change', function () {
                    slider.noUiSlider.set([null, this.value]);
                });
            }
        });
    }

    // Custom Search Dropdown Logic (Price)
    const priceDropdownTriggers = document.querySelectorAll('.search-dropdown-trigger');
    priceDropdownTriggers.forEach(trigger => {
        const wrapper = trigger.closest('.custom-search-dropdown');
        const menu = wrapper.querySelector('.search-dropdown-menu');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other open search dropdowns first
            $('.search-dropdown-menu').not(menu).addClass('d-none');
            $('.live-search-results').addClass('d-none');
            
            menu.classList.toggle('d-none');
        });

        // Close when clicking outside
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.custom-search-dropdown').is(wrapper)) {
                menu.classList.add('d-none');
            }
        });

        // Prevent menu close when clicking inside
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Custom Live Search Logic
    const liveSearchInputs = document.querySelectorAll('.live-search-input');
    liveSearchInputs.forEach(input => {
        const wrapper = input.closest('.custom-live-search');
        const results = wrapper.querySelector('.live-search-results');
        const hiddenInput = wrapper.querySelector('.live-search-hidden');
        const items = results.querySelectorAll('li');

        input.addEventListener('focus', () => {
            results.classList.remove('d-none');
            // Show all initially or based on current value
            filterItems(input.value);
        });

        input.addEventListener('input', () => {
            filterItems(input.value);
        });

        // Hide results when clicking outside
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.custom-live-search').is(wrapper)) {
                results.classList.add('d-none');
            }
        });

        items.forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.innerText;
                hiddenInput.value = item.dataset.value;
                results.classList.add('d-none');
            });
        });

        function filterItems(val) {
            const filter = val.toLowerCase();
            let hasVisible = false;
            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                if (text.includes(filter)) {
                    item.style.display = 'block';
                    hasVisible = true;
                } else {
                    item.style.display = 'none';
                }
            });
            if (hasVisible) results.classList.remove('d-none');
            else results.classList.add('d-none');
        }
    });

    // Star Rating Input Functionality
    const starRatingInput = $('#starRatingInput');
    if (starRatingInput.length) {
        const stars = starRatingInput.find('i');
        const ratingHiddenInput = $('#ratingValue');

        stars.on('mouseover', function () {
            const rating = $(this).data('rating');
            updateStarsDisplay(rating, true);
        });

        stars.on('mouseout', function () {
            const currentRating = ratingHiddenInput.val() || 0;
            updateStarsDisplay(currentRating, false);
        });

        stars.on('click', function () {
            const rating = $(this).data('rating');
            ratingHiddenInput.val(rating);
            updateStarsDisplay(rating, false);
        });

        function updateStarsDisplay(rating, isHover) {
            stars.each(function () {
                const starRating = $(this).data('rating');
                if (starRating <= rating) {
                    $(this).removeClass('far').addClass('fas active');
                    if (isHover) $(this).addClass('hover');
                    else $(this).removeClass('hover');
                } else {
                    $(this).removeClass('fas active hover').addClass('far');
                }
            });
        }
    }
    // Property Gallery Swiper
    if (document.querySelector(".property-gallery-swiper")) {
        const propertyGallerySwiper = new Swiper(".property-gallery-swiper", {
            loop: true,
            centeredSlides: true,
            spaceBetween: 20,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                0: {
                    slidesPerView: 1.1,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 1.2,
                    spaceBetween: 20,
                },
                1200: {
                    slidesPerView: 1.4,
                    spaceBetween: 30,
                }
            }
        });
    }

    // Video Carousel Swiper
    if (document.querySelector('.video-carousel-swiper')) {
        const videoCarouselSwiper = new Swiper('.video-carousel-swiper', {
            rtl: isRtl,
            loop: true,
            slidesPerView: 1.2,
            spaceBetween: 20,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            breakpoints: {
                576: { slidesPerView: 1.8, spaceBetween: 20 },
                992: { slidesPerView: 2.5, spaceBetween: 30 },
                1200: { slidesPerView: 3.5, spaceBetween: 30 }
            }
        });
    }

    // Top Properties Swiper (Best Property Value)
    if (document.querySelector('.bpv-swiper')) {
        const bpvSwiper = new Swiper('.bpv-swiper', {
            rtl: isRtl,
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                prevEl: '.bpv-button-prev',
                nextEl: '.bpv-button-next',
            },
            pagination: {
                el: '.bpv-pagination-fraction',
                type: 'fraction',
                formatFractionCurrent: function (number) {
                    return number < 10 ? '0' + number : number;
                },
                formatFractionTotal: function (number) {
                    return number < 10 ? '0' + number : number;
                }
            },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 20 },
                1200: { slidesPerView: 3, spaceBetween: 30 }
            },
            on: {
                slideChange: function () {
                    const progressBar = document.querySelector('.bpv-progressbar-fill');
                    if (progressBar) {
                        const realSlides = this.el.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length;
                        const percentage = realSlides > 0 ? ((this.realIndex + 1) / realSlides) * 100 : 0;
                        progressBar.style.width = percentage + '%';
                    }
                },
                init: function () {
                    const progressBar = document.querySelector('.bpv-progressbar-fill');
                    if (progressBar) {
                        const realSlides = this.el.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length;
                        const percentage = realSlides > 0 ? ((this.realIndex + 1) / realSlides) * 100 : 0;
                        progressBar.style.width = percentage + '%';
                    }
                }
            }
        });
    }
});
