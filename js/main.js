jQuery(document).ready(function () {


    // toggle search form
    const searchTrigger = document.querySelector('.search-icon'),
        searchForm = document.querySelector('.search-form-wrapper');
    searchTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        this.classList.toggle('active');
        searchForm.classList.toggle('active');
    })

    // nested nav mobile
    if (jQuery(window).width() <= 992) {
        jQuery(".menu-item-has-children").click(function () {
            const $this = jQuery(this);
            $this.children(".sub-menu").slideToggle(300);
            $this.children("a").toggleClass("icon-rotate");
            jQuery(".menu-item-has-children").not($this).children(".sub-menu").slideUp(300);
            jQuery(".menu-item-has-children").not($this).children("a").removeClass("icon-rotate");
        });
    }

    // ************************************************************************************************
    // open and close sidebar

    jQuery(".bars").on("click", function () {
        jQuery(".line1").toggleClass("rotate-line1");
        jQuery(".line2").toggleClass("hide-line2");
        jQuery(".line3").toggleClass("rotate-line3");
        jQuery(".navigation").toggleClass("open-sidebar");
        jQuery("body").toggleClass("overflow-hidden");
    });


    // ************************************************************************************************
    // show and hide to top button

    jQuery(window).on("scroll", function () {
        if (jQuery(window).scrollTop() > 100) {
            jQuery(".up-btn").addClass("show");
        }
        if (jQuery(window).scrollTop() == 0) {
            jQuery(".up-btn").removeClass("show");
        }
    });

    jQuery(".up-btn").on("click", function () {
        jQuery("html , body").animate({ scrollTop: 0 }, 0);
    });



    // ************************************************************************************************
    // swiper slider


    const specialitiesSlider = new Swiper(".specialities-slider", {
        loop: true,
        draggable: true,
        autoplay: true,
        spaceBetween: 45,
        // navigation: {
        //     nextEl: ".specialities-slider .swiper-button-next",
        //     prevEl: ".specialities-slider .swiper-button-prev",
        // },
        pagination: {
            el: ".specialities-slider .swiper-pagination",
            clickable: true,
        },

        breakpoints: {
            350: {
                slidesPerView: 2,
                spaceBetween: 15,

            },
            500: {
                slidesPerView: 2,
                spaceBetween: 20,

            },
            768: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
            992: {
                slidesPerView: 4,
                spaceBetween: 24,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 24,
            },
        },

    });
    const teachersSlider = new Swiper(".teachers-slider", {
        loop: true,
        draggable: true,
        autoplay: true,
        spaceBetween: 45,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

        breakpoints: {
            350: {
                slidesPerView: 1,
                spaceBetween: 15,

            },
            500: {
                slidesPerView: 1,
                spaceBetween: 20,

            },
            768: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 24,
            },
        },


    });





    /*Faq Accordion*/

    $(".faq-title").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $this = $(this);
        const $content = $this.next('.faq-content');
        const isCurrentlyActive = $this.hasClass("active");

        // Close all other FAQ items first
        $(".faq-title").not($this).removeClass("active");
        $(".faq-content").not($content).slideUp(300);

        // Toggle current item
        if (!isCurrentlyActive) {
            $this.addClass("active");
            $content.slideDown(300);
        } else {
            $this.removeClass("active");
            $content.slideUp(300);
        }

        return false;
    });

    // Footer Accordion
    $(".footer-title").on("click", function () {
        if ($(window).width() <= 767) {
            const $this = $(this);
            $this.toggleClass("active");
            $this.next("ul").slideToggle(300);
        }
    });

    $(window).on("resize", function () {
        if ($(window).width() > 767) {
            $(".footer-title").removeClass("active");
            $(".footer-title").next("ul").removeAttr("style");
        }
    });

    // User Menu Toggle for Mobile
    $(".user-menu-toggle").on("click", function () {
        if ($(window).width() <= 991) {
            const $this = $(this);
            $this.toggleClass("active");
            $this.closest(".user-menu").find(".menu-list").slideToggle(300);
        }
    });

    $(window).on("resize", function () {
        if ($(window).width() > 991) {
            $(".user-menu-toggle").removeClass("active");
            $(".menu-list").removeAttr("style");
        }
    });

    // OTP Modal Logic
    const registerForm = document.querySelector('.login-main-form');
    const otpModal = document.getElementById('otp-modal');

    if (registerForm && otpModal) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop standard form submission
            const bsModal = new bootstrap.Modal(otpModal);
            bsModal.show();
        });
    }

    // OTP Input Auto-focus Logic
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function () {
            if (this.value.length === this.maxLength && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Handle backspace to focus previous input
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });


});
// wow animation
document.addEventListener("DOMContentLoaded", function () {

    const singleElements = document.querySelectorAll('section ,h1');
    singleElements.forEach(el => {
        el.classList.add('wow', 'fadeInUp');
    });


    const staggeredItems = document.querySelectorAll('.single-faq-item,.single-blog-card,.single-testimonial-card');

    staggeredItems.forEach((el, index) => {
        el.classList.add('wow', 'fadeInUp');

        let delayMultiplier = index % 3;

        if (delayMultiplier > 0) {
            el.setAttribute('data-wow-delay', `${delayMultiplier * 0.2}s`);
        }
    });

    if (typeof WOW !== 'undefined') {
        new WOW({
            boxClass: 'wow',
            offset: 50,
            mobile: true,
            live: true
        }).init();
    }
});

// ==========================================
// Open Media Modal
// ==========================================
function openMediaModal(type, src) {
    const modalBody = document.getElementById('mediaModalBody');

    // Detect Content Type
    if (type === 'image') {
        modalBody.innerHTML = `<img src="${src}" class="img-fluid rounded shadow-lg" style="max-height: 80vh; object-fit: contain;">`;
    } else if (type === 'video') {
        modalBody.innerHTML = `<video src="${src}" class="w-100 rounded shadow-lg" style="max-height: 80vh;" controls autoplay></video>`;
    }

    const modalElement = document.getElementById('mediaModal');
    const mediaModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    mediaModal.show();
}

// Clean the modal and stop the video when it is closed (with confirmation that it exists first)
const mediaModalElement = document.getElementById('mediaModal');
if (mediaModalElement) {
    mediaModalElement.addEventListener('hidden.bs.modal', function () {
        const modalBody = document.getElementById('mediaModalBody');
        if (modalBody) {
            modalBody.innerHTML = '';
        }
    });
}

// ==========================================
// Play and Stop Audio (Dynamically without ID)
// ==========================================
function toggleAudio(btn) {
    // Search for the audio file for this specific button
    let audio = btn.parentElement.querySelector('audio');
    let icon = btn.querySelector('i');

    // Stop any other audio playing on the page so they don't interfere
    document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) {
            a.pause();
            let otherBtn = a.parentElement.querySelector('.play-audio-btn i');
            if (otherBtn) {
                otherBtn.classList.remove('fa-pause');
                otherBtn.classList.add('fa-play');
            }
        }
    });

    // Play or Stop Current Audio
    if (audio.paused) {
        audio.play();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        audio.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

// Return the icon to the Play shape when the sound ends
function resetAudio(audio) {
    let icon = audio.parentElement.querySelector('.play-audio-btn i');
    if (icon) {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}



// Add to fav active classs
const addToFavBtn = document.querySelectorAll('.add-to-fav');
if (addToFavBtn) {
    addToFavBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
        });
    });
}

// Scheduling Calendar Logic
const timeSlots = document.querySelectorAll('.time-slot');
if (timeSlots.length > 0) {
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function () {
            if (!this.disabled) {
                // Remove selected class from all
                timeSlots.forEach(s => s.classList.remove('selected'));
                // Add to clicked
                this.classList.add('selected');
            }
        });
    });
}
// =========================================================================
// ⚠️ تنبيه هام لفريق الباك إند (BACKEND TEAM) ⚠️
// الكود التالي هو داتا وهمية (Mock Data) لغرض المعاينة (Demo) فقط للتستر والعميل.
// يرجى مسح هذا الجزء واستبداله بـ API Calls الحقيقية لجلب المواعيد المتاحة
// وتحديث الـ DOM بناءً على التواريخ الراجعة من قاعدة البيانات.
// =========================================================================

const calendarPrev = document.querySelector('.calendar-prev');
const calendarNext = document.querySelector('.calendar-next');
const calendarTitle = document.querySelector('.calendar-title');
const dayDates = document.querySelectorAll('.day-date');
const timeSlotsContainers = document.querySelectorAll('.time-slots-container');

// تحديد تاريخ البداية بناءً على التصميم (9 مارس 2026)
let currentStartDate = new Date('2026-03-09');

function updateCalendarDemo(baseDate) {
    // جلب اسم الشهر بالعربي
    const monthName = new Intl.DateTimeFormat('ar-EG', { month: 'long' }).format(baseDate);
    const year = baseDate.getFullYear();

    // حساب تاريخ نهاية الأسبوع (بعد 6 أيام)
    const endDate = new Date(baseDate);
    endDate.setDate(baseDate.getDate() + 6);

    // تحديث العنوان الرئيسي
    if (calendarTitle) {
        calendarTitle.textContent = `${baseDate.getDate()} - ${endDate.getDate()} ${monthName} _ ${year}`;
    }

    // تحديث أرقام الأيام وتغيير حالة المواعيد عشوائياً
    dayDates.forEach((dayElement, index) => {
        const dayDate = new Date(baseDate);
        dayDate.setDate(baseDate.getDate() + index);

        // تحديث الرقم المعروض لليوم
        dayElement.textContent = dayDate.getDate();

        // تحديث الـ data-date
        const formattedDate = dayDate.toISOString().split('T')[0];

        if (timeSlotsContainers[index]) {
            const buttons = timeSlotsContainers[index].querySelectorAll('.time-slot');
            buttons.forEach(btn => {
                // 1. تحديث التاريخ في الداتا أتريبيوت للباك إند
                btn.setAttribute('data-date', formattedDate);

                // 2. إزالة أي تحديد (Active State) من الأسابيع اللي فاتت
                btn.classList.remove('selected');

                // 3. عشوائية المواعيد (تغيير المتاح والمحجوز بنسبة 40% تقريباً)
                // ده بيدي إيحاء واقعي جداً إن المواعيد بتتغير
                const isBookedRandomly = Math.random() < 0.4;
                btn.disabled = isBookedRandomly;
            });
        }
    });
}

if (calendarPrev) {
    calendarPrev.addEventListener('click', function () {
        currentStartDate.setDate(currentStartDate.getDate() - 7);
        updateCalendarDemo(currentStartDate);
    });
}

if (calendarNext) {
    calendarNext.addEventListener('click', function () {
        currentStartDate.setDate(currentStartDate.getDate() + 7);
        updateCalendarDemo(currentStartDate);
    });
}
// ======================= نهاية كود المعاينة الوهمي =======================