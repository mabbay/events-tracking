const params = new URLSearchParams(window.location.search);
const selectionMode = params.has('x-selection-mode');
if (selectionMode) enableSelectionMode();
else enableTrackingMode();

function enableSelectionMode() {
    console.log('--selection-mode');
    let targetWindow;
    window.addEventListener('message', (e) => {
        if (typeof e.data !== "string") return;
        console.log('--source received');
        const data = JSON.parse(e.data);
        if (!data.target) return;
        targetWindow = e.source;
    });

    document.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const target = e.target;

        if (target.nodeName.toLowerCase() === 'a') {
            const url = target.attributes.href.value;
            const data = { url };
            targetWindow.postMessage(JSON.stringify(data), '*'); // inform 
            const joinChar = url.indexOf('?') !== -1 ? '&' : '?';
            window.open(`${url}${joinChar}x-selection-mode=true`, 'selection-window');

            // we can ask: selection or navigation
        } else {
            const path = getPath(target);
            const data = { path };
            targetWindow.postMessage(JSON.stringify(data), '*'); // we will replace '*' with our origin
        }
    }, { capture: true });

    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        const border = target.style.border;
        // to remember the original border
        if (border) target.style.origBorder = border;
        target.style.border = '3px dashed black';
    });
    document.addEventListener('mouseout', (e) => {
        const target = e.target;
        const origBorder = target.style.origBorder;
        if (origBorder)
            target.style.border = origBorder;
        else
            target.style.border = 'none';
    });


    function getPath(el) {
        if (el.id) return el.nodeName.toLowerCase() + '#' + el.id;
        const stack = [];
        while (el.parentNode != null) {
            // console.log(el.nodeName);
            let sibCount = 0;
            let sibIndex = 0;
            for (let i = 0; i < el.parentNode.childNodes.length; i++) {
                const sib = el.parentNode.childNodes[i];
                if (sib.nodeName.toLowerCase() === el.nodeName.toLowerCase()) {
                    sibCount++;
                    if (sib === el) {
                        sibIndex = sibCount;
                    }
                }
            }
            if (el.hasAttribute('id') && el.id != '') {
                stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
            } else if (sibCount > 1) {
                stack.unshift(el.nodeName.toLowerCase() + ':nth-of-type' + '(' + sibIndex + ')');
            } else {
                stack.unshift(el.nodeName.toLowerCase());
            }
            el = el.parentNode;
        }
        return stack.slice(1).join('>'); // removes the html element
    }
}

function enableTrackingMode() {
    console.log('--tracking script loaded');
    const websiteId = '$websiteId';
    const token = '$token';
    const total = $total; // total number of elements

    // get elements and add event listener
    (async () => {
        const response = await fetch(`http://localhost:3077/api/elements/search?website=${websiteId}&limit=${total}`, {
            headers: { 'x-auth-token': token }
        });
        const { results: elements } = await response.json();
        elements.forEach(({ path, events, _id }) => {
            const nodes = document.querySelectorAll(path);
            if (nodes.length === 0) return; // path in DB, but not in HTML
            // listen for the events on each node
            nodes.forEach(node => {
                node.setAttribute('data-ele-id', _id);
                events.forEach(event => {
                    node.addEventListener(event, register);
                });
            });
        });
    })();

    // register page view
    const pageViewsContainer = getContainer('page-views');
    //! we should use origin to get website-id (on the backend), it's more secure this way
    //! we will base on the origin when: getting the script, creating actions, and creating pageViews
    (function registerPageView() {
        const page = location.pathname;
        const pageViews = pageViewsContainer.get(page);
        if (!pageViews) {
            pageViewsContainer.set(page, [{ pagePath: page, views: 1, date: new Date().getTime(), website: websiteId }]);
            pageViewsContainer.set('size', pageViewsContainer.get('size') + 1);
        }
        else {
            const recentPageView = pageViews[pageViews.length - 1];
            const date = new Date(recentPageView.date); // date of the recent page view 
            if (date.getUTCHours() !== new Date().getUTCHours()) {
                //! for now we set website on the client side
                //! this will be changed as soon as we are in a real environement, website will be set on backend based on origin header
                pageViews.push({ pagePath: page, views: 1, date: new Date().getTime(), website: websiteId });
                pageViewsContainer.set('size', pageViewsContainer.get('size') + 1);
            } else {
                recentPageView.views++;
            }
        }

        const maxSize = 10; console.log('--pvs-container-size', pageViewsContainer.get('size'));
        if (pageViewsContainer.get('size') >= maxSize) {
            send({ module: 'pageViews', container: pageViewsContainer });
        }
    })();


    // container: is map where we store tracking data + related data like size & time
    // this way we don't read/write all the time from localStorage
    // when necessary we presist the container to localStorage (when user is leaving the page)
    function initContainer(container) {
        if (!container.has('size')) container.set('size', 0);
        // time: represents the last time we sent tracking data to the server
        if (!container.has('time')) container.set('time', new Date().getTime());
        return container;
    }

    function getContainer(name) {
        let container = localStorage.getItem(name);
        if (!container) container = new Map;
        else container = new Map(JSON.parse(container));
        return initContainer(container);
    }

    const trackingDataContainer = getContainer('tracking-data');

    // save data about an event in the conatiner
    function register(e) {
        console.log('--registering event');
        const page = location.pathname; //! replacing / -> -, not working when querying data
        const eleId = e.target.getAttribute('data-ele-id');
        const event = e.type;
        const key = eleId + event + page;

        let data = trackingDataContainer.get(key);
        if (!data) { // the first time
            data = [{ element: eleId, event, page, frequency: 1, date: new Date().getTime() }];
            trackingDataContainer.set(key, data);
            trackingDataContainer.set('size', trackingDataContainer.get('size') + 1);
        } else {
            // two or more actions that happened in the same hour are considered the same
            // otherwise they are considered differente
            const date = new Date(data[data.length - 1].date); // date of the recent action 
            if (date.getUTCHours() !== new Date().getUTCHours()) {
                data.push({ element: eleId, event, page, frequency: 1, date: new Date().getTime() });
                trackingDataContainer.set('size', trackingDataContainer.get('size') + 1);
            }
            else {
                data[data.length - 1].frequency++;
            }
        }
        //! should be 20 (changed for test)
        const maxSize = 10; console.log('--container-size', trackingDataContainer.get('size'));
        if (trackingDataContainer.get('size') >= maxSize) {
            send();
        }
    }

    //send tracking data
    async function send({ module = 'actions', container = trackingDataContainer } = {}) {
        const what = module === 'actions' ? 'tracking data' : 'page views data';
        console.log(`--sending ${what}`);
        let data = Array.from(container.values());
        data = data.reduce((cum, curr) => {
            if (curr instanceof Array) return cum.concat(curr);
            return cum;
        }, []);
        try {
            const response = await fetch(`http://localhost:3077/api/${module}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ [module]: data })
            });
            // data sent
            if (response.ok) {
                console.log(`--${what} sent`);
                container.clear();
                initContainer(container);
            }
        } catch (ex) { // not necessary
            console.log(ex);
        }
    }

    // when the user is leaving, presist the conatiner
    const terminationEvent = 'onpagehide' in self ? 'pagehide' : 'unload';
    addEventListener(terminationEvent, () => {
        localStorage.setItem('tracking-data', JSON.stringify(Array.from(trackingDataContainer)));
        localStorage.setItem('page-views', JSON.stringify(Array.from(pageViewsContainer)));
    });

    // send tracking data based on the difference between now and the last time we send data to the server
    //! to set the correct value to these variables (changed for test purposes)
    const _15min = 15 * 1000, _1h = 15 * 1000;
    setInterval(() => {
        if (trackingDataContainer.get('size') > 0 && (new Date()).getTime() - trackingDataContainer.get('time') >= _1h) {
            send();
        }
        if (pageViewsContainer.get('size') > 0 && (new Date()).getTime() - pageViewsContainer.get('time') >= _1h) {
            send({ module: 'pageViews', container: pageViewsContainer });
        }
    }, _15min);
}
