(function () {
    if (document.location.hostname.indexOf('pdfshift.io') > -1) {
        return
    }
    if (document.location.search.indexOf('debug') === -1) {
        return
    }

    // Reload the css file when it has changed. In debug mode
    let lastModified = null
    const cssUrl = document.getElementsByTagName('head')[0].querySelector('#stylesheet').href
    setInterval(() => {
        fetch(cssUrl, { method: 'HEAD' }).then(response => {
            if (!lastModified) {
                lastModified = new Date(response.headers.get('Last-Modified'))
                return
            }

            const recentModified = new Date(response.headers.get('Last-Modified'))

            if (recentModified.getTime() != lastModified.getTime()) {
                lastModified = recentModified
                document.getElementsByTagName('head')[0].querySelector('#stylesheet').href= cssUrl + '?t=' + (recentModified.getTime());
            }
        })
    }, 1000)
})();

(function () {
    let isScrolling = false
    let scrollTimeout = null
    let lastScrollPos = null
    let isGoingDown = false

    function isElementVisible(element, container) {
        const elementRect = element.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        if ((elementRect.top + elementRect.height) > containerRect.bottom) {
            console.log('not visible')
            return false
        } else if ((elementRect.bottom - elementRect.height) < containerRect.top) {
            console.log('not visible')
            return false
        }
        console.log('VIsible')
        return true
    }

    // API references properties
    function setActiveMenuItem() {
        const items = document.querySelectorAll('.main>aside nav a')

        for (let i = 0; i < items.length; i++) {
            const hashtag = items[i].getAttribute('href').substring(1)
            let targetElement = document.getElementById(hashtag)
            if (!targetElement) {
                continue
            }

            const clientTop = document.documentElement.clientTop || document.body.clientTop || 0;

            if (targetElement.getBoundingClientRect().top - clientTop > 0) {
                const activeLi = document.querySelector('.main>aside nav li.active')
                if (activeLi) {
                    activeLi.classList.remove('active')
                }

                let index = i - 1
                if (index < 0) {
                    index = 0;
                }

                const nextActiveLi = items[index].closest('li')
                nextActiveLi.classList.add('active')

                if (scrollTimeout) {
                    clearTimeout(scrollTimeout)
                    scrollTimeout = null
                }

                // We wait a bit, to improve perforances
                const navbar = document.querySelector('.main>aside nav')
                if (!isElementVisible(nextActiveLi, navbar)) {
                    scrollTimeout = setTimeout(function () {
                        // Scroll to make it visible if it isn't
                        nextActiveLi.scrollIntoView({
                            behavior: 'smooth',
                            block: isGoingDown ? 'end' : 'start'
                        })
                    }, 10)
                }

                break
            }
        }
    }

    window.addEventListener('scroll', function (event) {
        if (isScrolling) { return }
        if (lastScrollPos) {
            isGoingDown = (lastScrollPos - window.pageYOffset) < 0
        }
        lastScrollPos = window.pageYOffset

        setActiveMenuItem()
        return true
    });

    // Scroll the window to the appropriate element when clicking on the menu
    document.querySelectorAll('.main>aside nav a').forEach(function (item) {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            const hashtag = item.getAttribute('href').substring(1)
            const targetElement = document.getElementById(hashtag)
            if (targetElement) {
                isScrolling = true
                scrollToPosition(window, getOffsetTop(targetElement), 'smooth').then(function () {
                    isScrolling = false
                })
            }
        })
    })

    // Load the code styles
    document.addEventListener('DOMContentLoaded', (event) => {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    });

    function scrollToPosition(container, position, behavior) {
        if (!behavior) behavior = 'auto'

        // custom code to handle promise on scroll ending with failing mode
        position = Math.round(position)

        if (container.scrollTop === position) return

        let resolveFn
        let timeoutId
        const promise = new Promise(function (resolve) {
            resolveFn = resolve
        })

        function scrollListener () {
            clearTimeout(timeoutId)

            // scroll is finished when either the position has been reached, or 100ms have elapsed since the last scroll event
            if (container.scrollTop === position) finished()
            else timeoutId = setTimeout(finished, 100)
        }

        function finished () {
            container.removeEventListener('scroll', scrollListener)
            resolveFn()
        }

        container.addEventListener('scroll', scrollListener)

        container.scrollTo({
            top: position,
            behavior: behavior
        })

        return promise
    }

    function getOffsetTop(element) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const clientTop = document.documentElement.clientTop || document.body.clientTop || 0;

        return element.getBoundingClientRect().top + scrollTop - clientTop;
    }

    if (window.location.hash) {
        const targetElement = document.getElementById(window.location.hash.substr(1))
        if (targetElement) {
            isScrolling = true
            scrollToPosition(window, getOffsetTop(targetElement), 'smooth').then(function () {
                setActiveMenuItem()
                isScrolling = false
            })
        }
    }

    // Toggle system for tabs
    document.querySelectorAll('section .method-examples .code-sample>ul a').forEach(function (item) {
        item.addEventListener('click', function (event) {
            event.preventDefault()
            // We remove the active state on the previous for **all** items
            document.querySelectorAll('section .method-examples .code-sample>ul li.active').forEach(function (item) {
                item.classList.remove('active')
            })
            document.querySelectorAll('section .method-examples .code-sample>div .active').forEach(function (item) {
                item.classList.remove('active')
            })

            document.querySelectorAll('section .method-examples .code-sample .language-' + item.dataset.language).forEach(function (item) {
                item.classList.add('active')
            })
        })
    })

    document.querySelectorAll('section .method-examples .code-sample>ul').forEach(function (item) {
        const firstItem = item.querySelector('li')
        firstItem.classList.add('active')
        const language = firstItem.querySelector('a').dataset.language
        item.closest('div').querySelector('div.language-' + language).classList.add('active')
    })
    document.querySelectorAll('section .method-examples .code-sample').forEach(function (item) {
        item.classList.add('visible')
    })
})();
