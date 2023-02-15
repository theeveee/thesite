
{
    class Revealer {
        constructor(el, options) {
            this.options = {
                angle: 0
            };
            Object.assign(this.options, options);

            this.DOM = {};
            this.DOM.el = el;
            this.DOM.inner = this.DOM.el.firstElementChild;

            this.DOM.inner.style.width = `calc(100vw * ${Math.abs(Math.cos(this.options.angle * Math.PI / 180))} + 100vh * ${Math.abs(Math.sin(this.options.angle * Math.PI / 180))})`;
            this.DOM.inner.style.height = `calc(100vw * ${Math.abs(Math.sin(this.options.angle * Math.PI / 180))} + 100vh * ${Math.abs(Math.cos(this.options.angle * Math.PI / 180))})`;
            this.DOM.el.style.transform = `rotate3d(0,0,1,${this.options.angle}deg)`;

            this.DOM.reverse = this.DOM.inner.querySelector('.content__reverse');
            if (this.DOM.reverse) {
                TweenMax.set(this.DOM.reverse, { rotation: -1 * this.options.angle });
            }
        }
    }

    // Content elements
    const content = {
        first: document.querySelector('.content--first'),
        second: document.querySelector('.content--second')
    };

    // First page's content.
    const firstPageContent = {
        enter: document.querySelector('.intro__enter')
    };

    // Second page's content.
    const secondPageContent = {
        // menu (wrap) element
        menuWrap: document.querySelector('.menu-wrap'),
        // menu items
        menuItems: document.querySelector('.menu__item'),
        menuLinks: document.querySelectorAll('.menu__item ul li a'),
        backCtrl: document.querySelector('.button-close'),
    };

    // Revealer element
    const revealer = new Revealer(content.first, { angle: 110 });
    // let pageToggleTimeline;

    //載入頁面(Open)
    const loadPage = () => {
        // Pointer events related class
        content.first.classList.add('content--hidden');

        const ease = Expo.easeInOut;
        const duration = 1;
        this.pageToggleTimeline = new TimelineMax({
            onReverseComplete: () => {
                //after Close and Open
                showMenuPage();
            }
        })
            // Animate first page elements (optional)
            // "Unreveal effect" (inner moves to one direction and reverse moves to the opposite one)
            .to(revealer.DOM.el, duration, {
                ease: ease,
                rotation: '-=40',
                onComplete: () => {
                }
            }, 0)
            .to(revealer.DOM.inner, duration, {
                ease: ease,
                y: '-100%',
                onComplete: () => {
                }
            }, 0)
            .to(revealer.DOM.reverse, duration, {
                ease: ease,
                rotation: '-=-40',
                y: '100%',
                onComplete: () => {
                    // Pointer events related class
                    content.first.classList.remove('content--hidden');
                    document.querySelector('.trainsition').style.zIndex = 0;
                    // this.pageToggleTimeline.reverse();
                    if (!window.location.href.includes('designer')) {                        
                        loadLocomotiveScroll();
                    }
                }
            }, 0)
    };
    loadPage();

    //Close
    const showMenuBefore = () => {
        document.querySelector('.trainsition').style.zIndex = 17;
        this.pageToggleTimeline.reverse();
    }

    // Animate things: show revealer animation, animate first page elements out (optional) and animate second page elements in (optional)
    const showMenuPage = () => {
        // Pointer events related class
        content.first.classList.add('content--hidden');

        const ease = Expo.easeInOut;
        const duration = 1;
        this.pageToggleTimeline = new TimelineMax({
            onReverseComplete: () => {
                //after Close and Open again
                showMenuPage();
            }
        })
            // Animate first page elements (optional)
            // "Unreveal effect" (inner moves to one direction and reverse moves to the opposite one)
            .to(revealer.DOM.el, duration, {
                ease: ease,
                rotation: '-=40',
                onComplete: () => {
                }
            }, 0)
            .to(revealer.DOM.inner, duration, {
                ease: ease,
                y: '-100%',
                onComplete: () => {
                }
            }, 0)
            .to(revealer.DOM.reverse, duration, {
                ease: ease,
                rotation: '-=-40',
                y: '100%',
                onComplete: () => {
                    document.querySelector('.trainsition').style.zIndex = 0;
                }
            }, 0)
    };
    firstPageContent.enter.addEventListener('click', showMenuBefore);

    // Animate back
    const showIntro = () => {
        // Pointer events related class
        content.first.classList.remove('content--hidden');
        this.pageToggleTimeline.reverse();
        document.querySelector('.trainsition').style.zIndex = 17;
    };
    secondPageContent.backCtrl.addEventListener('click', showIntro);

    //  ---------------------------Menu----------------------------------------

    // Preload images
    const preloadImages = (selector = 'img') => {
        return new Promise((resolve) => {
            imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
        });
    };

    // preload images then remove loader (loading class) 
    preloadImages('.tiles__line-img').then(() => document.body.classList.remove('loading'));

    // frame element
    const frame = document.querySelector('.frame');

    // overlay (SVG path element)
    const overlayPath = document.querySelector('.overlay__path');

    // menu (wrap) element
    const menuWrap = document.querySelector('.menu-wrap');

    // menu (wrap) element
    const nav = document.querySelector('.nav');

    // menu items
    const menuItems = menuWrap.querySelectorAll('.menu__item');

    // open menu button
    const openMenuCtrl = document.querySelector('button.button-menu');

    // close menu button
    const closeMenuCtrl = document.querySelector('.button-close');

    // close menu button
    const subNav = menuWrap.querySelector('.subNav');


    let isAnimating = false;

    // opens the menu
    const openMenu = () => {
        // if (isAnimating) return;
        isAnimating = true;

        gsap.timeline({
            onComplete: () => {
                isAnimating = false
            }
        })
            .set(overlayPath, {
                attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' },
                onComplete: () => {
                    nav.classList.add('active');
                }
            })
            .to(overlayPath, {
                duration: 0.8,
                ease: 'power4.in',
                attr: { d: 'M 0 100 V 50 Q 50 0 100 50 V 100 z' }
            }, 0)
            .to(overlayPath, {
                duration: 0.3,
                ease: 'power2',
                attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' },
                onComplete: () => {
                    frame.classList.add('frame--menu-open');
                    // menuWrap.classList.add('menu-wrap--open');
                    if (!nav.classList.contains('active')) {
                        nav.classList.add('active');
                    }
                    document.querySelector('.hambergerTitle').textContent = "Menu";
                }
            })
           
            // now reveal
            .set(menuItems, {
                opacity: 0
            })
            .set(overlayPath, {
                attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' }
            })
            .to(overlayPath, {
                duration: 0.3,
                ease: 'power2.in',
                attr: { d: 'M 0 0 V 50 Q 50 0 100 50 V 0 z' },
                onComplete: () => {
                    menuWrap.classList.add('menu-wrap--open');
                    if (!nav.classList.contains('active')) {
                        nav.classList.add('active');
                    }
                }
            })
            .to(overlayPath, {
                duration: 0.8,
                ease: 'power4',
                attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' }
            })
            // menu items translate animation
            .to(menuItems, {
                duration: 1.1,
                ease: 'power4',
                startAt: { y: 150 },
                y: 0,
                opacity: 1,
                stagger: 0.05,
                onComplete: () => {
                    subNav.classList.add('active');
                    if (!nav.classList.contains('active')) {
                        nav.classList.add('active');
                    }
                    openMenuEvent();
                }
            }, '>-=1.1');
    }

    // closes the menu
    const closeMenu = () => {
        // if (isAnimating) return;
        isAnimating = true;
        gsap.timeline({
            onComplete: () => {
                isAnimating = false
            }
        })
            .set(overlayPath, {
                attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' }
            })
            .to(overlayPath, {
                duration: 0.8,
                ease: 'power4.in',
                attr: { d: 'M 0 0 V 50 Q 50 100 100 50 V 0 z' }
            }, 0)
            .to(overlayPath, {
                duration: 0.3,
                ease: 'power2',
                attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' },
                onComplete: () => {
                    frame.classList.remove('frame--menu-open');
                    menuWrap.classList.remove('menu-wrap--open');
                }
            })
            // now reveal
            .set(overlayPath, {
                attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' }
            })
            .to(overlayPath, {
                duration: 0.3,
                ease: 'power2.in',
                attr: { d: 'M 0 100 V 50 Q 50 100 100 50 V 100 z' }
            })
            .to(overlayPath, {
                duration: 0.8,
                ease: 'power4',
                attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' },
                onComplete: () => {
                    nav.classList.remove('active');
                }
            })
            // menu items translate animation
            .to(menuItems, {
                duration: 0.8,
                ease: 'power2.in',
                y: 100,
                opacity: 0,
                stagger: -0.05,
                onComplete: () => {
                    subNav.classList.remove('active');
                    changeSideText();
                    closeMenuEvent();
                }
            }, 0)

    }
    // click on menu button
    openMenuCtrl.addEventListener('click', openMenu);
    // click on close menu button
    closeMenuCtrl.addEventListener('click', closeMenu);

    //navigationPage
    function navigationPage(path,mainSwiperIndex) {
        if(mainSwiperIndex) {
            localStorage.setItem('mainSwiperIndex', mainSwiperIndex);
        }
        const isIndex = path.indexOf('index.html');
        if(isIndex>=0 && path.indexOf('#')>0) {
            const hash = path.substring(path.indexOf('#'));
            localStorage.setItem('indexHash', hash);
            path = path.substring(0,path.indexOf('#'));
        }
        // frame element
        const frame = document.querySelector('.frame');
        // overlay (SVG path element)
        const overlayPath = document.querySelector('.opeing__path');
        // menu (wrap) element
        const menuWrap = document.querySelector('.menu-wrap');
        // menu items
        const menuItems = menuWrap.querySelectorAll('.menu__item');
        // menu (wrap) element
        const nav = document.querySelector('.nav');
        // close menu button
        const subNav = menuWrap.querySelector('.subNav');

        document.querySelector('.trainsition').style.zIndex = 17;
        this.pageToggleTimeline.reverse();

        gsap.timeline({
            onComplete: () => {
                isAnimating = false
            }
        })
            .set(overlayPath, {
                attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' }
            })
            .to(overlayPath, {
                duration: 0.8,
                ease: 'power4.in',
                attr: { d: 'M 0 0 V 50 Q 50 100 100 50 V 0 z' }
            }, 0)
            .to(overlayPath, {
                duration: 0.3,
                ease: 'power2',
                attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' },
                onComplete: () => {
                    frame.classList.remove('frame--menu-open');
                    menuWrap.classList.remove('menu-wrap--open');
                }
            })
            // now reveal
            .set(overlayPath, {
                attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' }
            })
            .to(overlayPath, {
                duration: 0.3,
                ease: 'power2.in',
                attr: { d: 'M 0 100 V 50 Q 50 100 100 50 V 100 z' }
            })
            .to(overlayPath, {
                duration: 0.8,
                ease: 'power4',
                attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' },
                onComplete: () => {
                    nav.classList.remove('active');
                }
            })
            // menu items translate animation
            .to(menuItems, {
                duration: 0.8,
                ease: 'power2.in',
                y: 100,
                opacity: 0,
                stagger: -0.05,
                onComplete: () => {
                    subNav.classList.remove('active');
                    window.setTimeout((() => window.location = path), 400);
                }
            }, 0)
    }

    function getBroswer() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1] :
            (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
                (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;


        if (Sys.edge) return "edge";
        if (Sys.ie) return "ie";
        if (Sys.firefox) return "firefox";
        if (Sys.chrome) return "chrome";
        if (Sys.opera) return "opera";
        if (Sys.safari) return "safari";
        return "";
    }
}