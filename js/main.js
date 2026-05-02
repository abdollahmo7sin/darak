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
            on: {
                init: function () {
                    const swiper = this;
                    // Bind custom click events for multiple prev/next buttons
                    document.querySelectorAll('.testi-button-prev').forEach(btn => {
                        btn.addEventListener('click', () => swiper.slidePrev());
                    });
                    document.querySelectorAll('.testi-button-next').forEach(btn => {
                        btn.addEventListener('click', () => swiper.slideNext());
                    });
                    
                    // Manually init progress bars
                    document.querySelectorAll('.testi-progressbar').forEach(pb => {
                        pb.innerHTML = '<div class="swiper-pagination-progressbar-fill" style="transform: scaleX(0); transform-origin: left center; transition: transform 300ms;"></div>';
                    });
                    updateTestiProgress(swiper);
                },
                slideChange: function () {
                    updateTestiProgress(this);
                }
            }
        });

        function updateTestiProgress(swiper) {
            const realSlides = swiper.el.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length;
            const percentage = realSlides > 0 ? ((swiper.realIndex + 1) / realSlides) : 0;
            document.querySelectorAll('.testi-progressbar .swiper-pagination-progressbar-fill').forEach(fill => {
                // Adjust transform-origin for RTL support
                fill.style.transformOrigin = isRtl ? 'right center' : 'left center';
                fill.style.transform = `scaleX(${percentage})`;
            });
        }
    }

    // ─── Cities Section: Responsive Swiper (mobile only) ───────────────────────
    const CITIES_BREAKPOINT = 768; // Bootstrap md
    const citySwipersMap = new Map(); // key: row element, value: Swiper instance

    function initCitySwipers() {
        const rows = document.querySelectorAll('#cities-tabContent .tab-pane .row');
        rows.forEach(function (row) {
            if (citySwipersMap.has(row)) return; // already initialised

            // Add required Swiper classes
            row.classList.add('swiper-wrapper', 'cities-swiper-wrapper', 'flex-nowrap');
            row.querySelectorAll(':scope > [class*="col-"]').forEach(function (col) {
                col.classList.add('swiper-slide');
            });

            // Create a container div wrapping the row (Swiper needs it)
            const container = document.createElement('div');
            container.className = 'swiper cities-mobile-swiper';

            // Pagination element
            const pagination = document.createElement('div');
            pagination.className = 'swiper-pagination cities-swiper-pagination';

            row.parentNode.insertBefore(container, row);
            container.appendChild(row);
            container.appendChild(pagination);

            const swiper = new Swiper(container, {
                rtl: isRtl,
                slidesPerView: 1,
                spaceBetween: 16,
                centeredSlides: false,
                loop: false,
                pagination: {
                    el: pagination,
                    clickable: true,
                },
            });

            citySwipersMap.set(row, { swiper, container, pagination });
        });
    }

    function destroyCitySwipers() {
        citySwipersMap.forEach(function ({ swiper, container, pagination }, row) {
            swiper.destroy(true, true);

            // Remove swiper wrapper classes from row
            row.classList.remove('swiper-wrapper', 'cities-swiper-wrapper', 'flex-nowrap');
            row.querySelectorAll(':scope > [class*="col-"]').forEach(function (col) {
                col.classList.remove('swiper-slide');
            });

            // Unwrap: move row back before container, remove container
            container.parentNode.insertBefore(row, container);
            if (pagination.parentNode) pagination.parentNode.removeChild(pagination);
            container.parentNode.removeChild(container);
        });
        citySwipersMap.clear();
    }

    function handleCitiesResize() {
        if (window.innerWidth < CITIES_BREAKPOINT) {
            if (citySwipersMap.size === 0) initCitySwipers();
        } else {
            if (citySwipersMap.size > 0) destroyCitySwipers();
        }
    }

    // ─── Blogs Section: Responsive Swiper (mobile only) ───────────────────────
    const blogSwipersMap = new Map(); // key: row element, value: Swiper instance

    function initBlogSwipers() {
        const rows = document.querySelectorAll('.blog-section .row');
        rows.forEach(function (row) {
            if (blogSwipersMap.has(row)) return; // already initialised

            // Add required Swiper classes
            row.classList.add('swiper-wrapper', 'blog-swiper-wrapper', 'flex-nowrap');
            row.querySelectorAll(':scope > [class*="col-"]').forEach(function (col) {
                col.classList.add('swiper-slide');
            });

            // Create a container div wrapping the row (Swiper needs it)
            const container = document.createElement('div');
            container.className = 'swiper blog-mobile-swiper';

            // Pagination element
            const pagination = document.createElement('div');
            pagination.className = 'swiper-pagination blog-swiper-pagination';

            row.parentNode.insertBefore(container, row);
            container.appendChild(row);
            container.appendChild(pagination);

            const swiper = new Swiper(container, {
                rtl: isRtl,
                slidesPerView: 1.1,
                spaceBetween: 16,
                centeredSlides: false,
                loop: false,
                pagination: {
                    el: pagination,
                    clickable: true,
                },
                breakpoints: {
                    576: {
                        slidesPerView: 1.5,
                        spaceBetween: 20
                    }
                }
            });

            blogSwipersMap.set(row, { swiper, container, pagination });
        });
    }

    function destroyBlogSwipers() {
        blogSwipersMap.forEach(function ({ swiper, container, pagination }, row) {
            swiper.destroy(true, true);

            // Remove swiper wrapper classes from row
            row.classList.remove('swiper-wrapper', 'blog-swiper-wrapper', 'flex-nowrap');
            row.querySelectorAll(':scope > [class*="col-"]').forEach(function (col) {
                col.classList.remove('swiper-slide');
            });

            // Unwrap: move row back before container, remove container
            container.parentNode.insertBefore(row, container);
            if (pagination.parentNode) pagination.parentNode.removeChild(pagination);
            container.parentNode.removeChild(container);
        });
        blogSwipersMap.clear();
    }

    function handleBlogResize() {
        if (window.innerWidth < CITIES_BREAKPOINT) {
            if (blogSwipersMap.size === 0) initBlogSwipers();
        } else {
            if (blogSwipersMap.size > 0) destroyBlogSwipers();
        }
    }

    // Initial call
    handleCitiesResize();
    handleBlogResize();

    // Re-check on resize (debounced)
    let responsiveSwipersTimer;
    window.addEventListener('resize', function () {
        clearTimeout(responsiveSwipersTimer);
        responsiveSwipersTimer = setTimeout(function() {
            handleCitiesResize();
            handleBlogResize();
        }, 150);
    });

    // Re-init Swiper when a cities tab is shown (Swiper can't measure hidden panes)
    document.querySelectorAll('#cities-tab button[data-bs-toggle="pill"]').forEach(function (btn) {
        btn.addEventListener('shown.bs.tab', function () {
            if (window.innerWidth < CITIES_BREAKPOINT) {
                citySwipersMap.forEach(function ({ swiper }) {
                    swiper.update();
                });
            }
        });
    });
    // ───────────────────────────────────────────────────────────────────────────

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

    // ── Custom Search Dropdown Logic (Price) ────────────────────────────────
    function initSearchDropdowns(context) {
        const triggers = (context || document).querySelectorAll('.search-dropdown-trigger');
        triggers.forEach(trigger => {
            if (trigger._dropdownInited) return; // avoid double-binding
            trigger._dropdownInited = true;

            const wrapper = trigger.closest('.custom-search-dropdown');
            const menu    = wrapper.querySelector('.search-dropdown-menu');

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other open search dropdowns & live searches first
                $(context || document).find('.search-dropdown-menu').not(menu).addClass('d-none');
                $(context || document).find('.live-search-results').addClass('d-none');
                menu.classList.toggle('d-none');
            });

            // Close when clicking outside
            $(document).on('click', function (e) {
                if (!$(e.target).closest('.custom-search-dropdown').is(wrapper)) {
                    menu.classList.add('d-none');
                }
            });

            // Prevent menu close when clicking inside
            menu.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    // ── Custom Live Search Logic ────────────────────────────────────────────
    function initLiveSearch(context) {
        const liveSearchInputs = (context || document).querySelectorAll('.live-search-input');
        liveSearchInputs.forEach(input => {
            if (input._liveSearchInited) return; // avoid double-binding
            input._liveSearchInited = true;

            const wrapper       = input.closest('.custom-live-search');
            const results       = wrapper.querySelector('.live-search-results');
            const items         = results.querySelectorAll('li');
            const isMulti       = wrapper.classList.contains('custom-live-search-multi');

            if (isMulti) {
                const tagsContainer = wrapper.querySelector('.live-search-tags');

                input.addEventListener('focus', () => {
                    results.classList.remove('d-none');
                    filterItems(input.value);
                });

                input.addEventListener('input', () => filterItems(input.value));

                $(document).on('click', function (e) {
                    if (!$(e.target).closest('.custom-live-search').is(wrapper)) {
                        results.classList.add('d-none');
                    }
                });

                items.forEach(item => {
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        checkbox.checked = !checkbox.checked;
                        item.classList.toggle('checked', checkbox.checked);
                        renderTags();
                        input.value = '';
                        filterItems('');
                    });
                });

                function renderTags() {
                    tagsContainer.innerHTML = '';
                    const checkedItems = results.querySelectorAll('li input[type="checkbox"]:checked');
                    checkedItems.forEach(cb => {
                        const li    = cb.closest('li');
                        const text  = li.textContent.trim();
                        const value = li.dataset.value;

                        const tag = document.createElement('span');
                        tag.className    = 'live-search-tag';
                        tag.dataset.value = value;
                        tag.innerHTML = `${text}<button type="button" class="live-search-tag-remove"><i class="fal fa-times"></i></button>`;

                        tag.querySelector('.live-search-tag-remove').addEventListener('click', (e) => {
                            e.stopPropagation();
                            cb.checked = false;
                            li.classList.remove('checked');
                            renderTags();
                        });

                        tagsContainer.appendChild(tag);
                    });

                    input.placeholder = checkedItems.length > 0 ? '' : 'Select Your City';
                }

                function filterItems(val) {
                    const filter = val.toLowerCase();
                    let hasVisible = false;
                    items.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        const visible = text.includes(filter);
                        item.style.display = visible ? 'block' : 'none';
                        if (visible) hasVisible = true;
                    });
                    results.classList.toggle('d-none', !hasVisible);
                }

            } else {
                // Single-select mode
                const hiddenInput = wrapper.querySelector('.live-search-hidden');

                input.addEventListener('focus', () => {
                    results.classList.remove('d-none');
                    filterItems(input.value);
                });

                input.addEventListener('input', () => filterItems(input.value));

                $(document).on('click', function (e) {
                    if (!$(e.target).closest('.custom-live-search').is(wrapper)) {
                        results.classList.add('d-none');
                    }
                });

                items.forEach(item => {
                    item.addEventListener('click', () => {
                        input.value = item.innerText;
                        if (hiddenInput) hiddenInput.value = item.dataset.value;
                        results.classList.add('d-none');
                    });
                });

                function filterItems(val) {
                    const filter = val.toLowerCase();
                    let hasVisible = false;
                    items.forEach(item => {
                        const text    = item.innerText.toLowerCase();
                        const visible = text.includes(filter);
                        item.style.display = visible ? 'block' : 'none';
                        if (visible) hasVisible = true;
                    });
                    results.classList.toggle('d-none', !hasVisible);
                }
            }
        });
    }

    // Initialise on page load for the main hero form
    initSearchDropdowns(document);
    initLiveSearch(document);


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

    // ── Mobile Filter Drawer ────────────────────────────────────────────────
    const filterBtn         = document.querySelector('.mobile-filter-btn');
    const filterDrawer      = document.getElementById('mobileFilterDrawer');
    const filterBackdrop    = document.getElementById('mobileFilterBackdrop');
    const filterClose       = document.getElementById('mobileFilterClose');
    const drawerContent     = document.getElementById('drawerSearchContent');
    const drawerTabBtns     = document.querySelectorAll('#drawerSearchTab [data-drawer-tab]');

    let drawerInitialised = false;

    function openFilterDrawer() {
        // Clone the hero search form panels into the drawer on first open
        if (!drawerInitialised) {
            drawerInitialised = true;
            const tabOrder = ['buy-pane', 'rent-pane', 'investment-pane', 'project-pane'];
            tabOrder.forEach((paneId, index) => {
                const heroPane = document.getElementById(paneId);
                if (!heroPane) return;
                const panel = heroPane.querySelector('.search-form-panel');
                if (!panel) return;

                // Deep-clone the panel and strip noUiSlider elements to avoid conflicts
                const clone = panel.cloneNode(true);
                clone.querySelectorAll('.js-price-range-slider').forEach(s => {
                    s.innerHTML = '';
                    s.removeAttribute('style');
                });

                // Wrap in a visible pane div
                const paneDiv = document.createElement('div');
                paneDiv.className = 'drawer-tab-pane' + (index === 0 ? ' active' : '');
                paneDiv.dataset.pane = paneId;
                paneDiv.appendChild(clone);
                drawerContent.appendChild(paneDiv);

                // Init sliders inside drawer if noUiSlider available
                if (typeof noUiSlider !== 'undefined') {
                    clone.querySelectorAll('.js-price-range-slider').forEach(sliderEl => {
                        const rangeMin  = parseFloat(sliderEl.dataset.min      || 0);
                        const rangeMax  = parseFloat(sliderEl.dataset.max      || 1000000);
                        const startMin  = parseFloat(sliderEl.dataset.startMin || rangeMin);
                        const startMax  = parseFloat(sliderEl.dataset.startMax || rangeMax);

                        noUiSlider.create(sliderEl, {
                            start: [startMin, startMax],
                            connect: true,
                            direction: isRtl ? 'rtl' : 'ltr',
                            range: { 'min': rangeMin, 'max': rangeMax },
                            format: { to: v => Math.round(v), from: v => Number(v) }
                        });

                        const fmt = v => {
                            if (v >= 1000000) return '$' + (v/1000000).toFixed(1).replace('.0','') + 'M';
                            if (v >= 1000)    return '$' + (v/1000).toFixed(0) + 'k';
                            return '$' + v;
                        };

                        const priceWrapper = sliderEl.closest('.price-range-wrapper');
                        const minInput  = priceWrapper ? priceWrapper.querySelector('.js-price-range-min-input') : null;
                        const maxInput  = priceWrapper ? priceWrapper.querySelector('.js-price-range-max-input') : null;
                        const display   = sliderEl.closest('.custom-search-dropdown') ?
                                          sliderEl.closest('.custom-search-dropdown').querySelector('.js-current-price-display') : null;

                        sliderEl.noUiSlider.on('update', (values, handle) => {
                            if (handle === 0 && minInput) minInput.value = values[0];
                            if (handle === 1 && maxInput) maxInput.value = values[1];
                            if (display) display.innerText = `${fmt(values[0])} - ${fmt(values[1])}`;
                        });
                        if (minInput) minInput.addEventListener('change', function() { sliderEl.noUiSlider.set([this.value, null]); });
                        if (maxInput) maxInput.addEventListener('change', function() { sliderEl.noUiSlider.set([null, this.value]); });
                    });
                }
            });

            // Inject pane visibility styles once
            const style = document.createElement('style');
            style.textContent = '.drawer-tab-pane{display:none}.drawer-tab-pane.active{display:block}';
            document.head.appendChild(style);

            // Wire up price dropdowns and live search for the cloned drawer content
            initSearchDropdowns(drawerContent);
            initLiveSearch(drawerContent);
        }

        filterDrawer.classList.add('open');
        filterBackdrop.style.display = 'block';
        requestAnimationFrame(() => filterBackdrop.classList.add('open'));
        document.body.style.overflow = 'hidden';
        if (filterBtn) filterBtn.classList.add('active');
    }

    function closeFilterDrawer() {
        filterDrawer.classList.remove('open');
        filterBackdrop.classList.remove('open');
        setTimeout(() => { filterBackdrop.style.display = 'none'; }, 300);
        document.body.style.overflow = '';
        if (filterBtn) filterBtn.classList.remove('active');
    }

    if (filterBtn)      filterBtn.addEventListener('click', openFilterDrawer);
    if (filterClose)    filterClose.addEventListener('click', closeFilterDrawer);
    if (filterBackdrop) filterBackdrop.addEventListener('click', closeFilterDrawer);

    // Drawer tab switching
    drawerTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            drawerTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.drawerTab;
            document.querySelectorAll('.drawer-tab-pane').forEach(p => {
                p.classList.toggle('active', p.dataset.pane === target);
            });
        });
    });

    // Close drawer on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && filterDrawer && filterDrawer.classList.contains('open')) {
            closeFilterDrawer();
        }
    });
    // ───────────────────────────────────────────────────────────────────────────
});
