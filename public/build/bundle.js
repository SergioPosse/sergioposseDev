
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\About.svelte generated by Svelte v3.25.0 */

    const file = "src\\About.svelte";

    function create_fragment(ctx) {
    	let about;
    	let div0;
    	let section0;
    	let h20;
    	let t1;
    	let p0;
    	let t2;
    	let a;
    	let t4;
    	let t5;
    	let section1;
    	let h21;
    	let t7;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let strong0;
    	let p1;
    	let t11;
    	let strong1;
    	let p2;
    	let t14;
    	let div1;
    	let section2;
    	let h22;
    	let t16;
    	let img1;
    	let img1_src_value;
    	let t17;
    	let p3;
    	let t19;
    	let p4;
    	let t21;
    	let section3;
    	let h23;
    	let t23;
    	let p5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			about = element("about");
    			div0 = element("div");
    			section0 = element("section");
    			h20 = element("h2");
    			h20.textContent = "Who i am?";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Hello friend! My name is Sergio Posse, im a simple guy interested by every kind of programming but experienced in web development. In my free time i play the guitar and write music, i like experimental or underground bands that blows your mind! Check my \n\t\t\t\t\t");
    			a = element("a");
    			a.textContent = "Soundcloud";
    			t4 = text(" if you feel curious.");
    			t5 = space();
    			section1 = element("section");
    			h21 = element("h2");
    			h21.textContent = "Formation";
    			t7 = space();
    			img0 = element("img");
    			t8 = space();
    			strong0 = element("strong");
    			strong0.textContent = "High School:";
    			p1 = element("p");
    			p1.textContent = "IPEM 259 Ambrosio Olmos - INDUSTRIAL (graduated as metalworking speciality)";
    			t11 = space();
    			strong1 = element("strong");
    			strong1.textContent = "Tertiary Studies:";
    			p2 = element("p");
    			p2.textContent = "ITec Instituto Tecnológico Río Cuarto (graduated as Superior techichian in soft development)";
    			t14 = space();
    			div1 = element("div");
    			section2 = element("section");
    			h22 = element("h2");
    			h22.textContent = "Working Experience";
    			t16 = space();
    			img1 = element("img");
    			t17 = space();
    			p3 = element("p");
    			p3.textContent = "Practices when i was studying, like scrum simulations, QA Testing and frontend/backend basics";
    			t19 = space();
    			p4 = element("p");
    			p4.textContent = "Amateur projects for friends and family";
    			t21 = space();
    			section3 = element("section");
    			h23 = element("h2");
    			h23.textContent = "Main skills";
    			t23 = space();
    			p5 = element("p");
    			p5.textContent = "Global vision - Selflearning - Modeling (UML) - Control versioning (Git) - Operative Systems & Virtual Machines config - Hardware - UX Design (Figma)";
    			add_location(h20, file, 25, 97, 657);
    			set_style(a, "z-index", "120");
    			set_style(a, "color", "#F2E6FC");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", "https://soundcloud.com/kumikobox");
    			attr_dev(a, "class", "svelte-9kzlea");
    			add_location(a, file, 27, 5, 943);
    			add_location(p0, file, 26, 4, 680);
    			attr_dev(section0, "class", "card-simple svelte-9kzlea");
    			add_location(section0, file, 25, 3, 563);
    			add_location(h21, file, 31, 5, 1131);
    			attr_dev(img0, "alt", "graduatedImage");
    			attr_dev(img0, "class", "img-fluid svelte-9kzlea");
    			if (img0.src !== (img0_src_value = "/images/graduated.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 32, 5, 1155);
    			attr_dev(strong0, "class", "svelte-9kzlea");
    			add_location(strong0, file, 33, 5, 1235);
    			attr_dev(p1, "class", "svelte-9kzlea");
    			add_location(p1, file, 33, 34, 1264);
    			attr_dev(strong1, "class", "svelte-9kzlea");
    			add_location(strong1, file, 34, 6, 1353);
    			attr_dev(p2, "class", "svelte-9kzlea");
    			add_location(p2, file, 34, 40, 1387);
    			attr_dev(section1, "class", "card-over svelte-9kzlea");
    			add_location(section1, file, 30, 4, 1097);
    			attr_dev(div0, "class", "row svelte-9kzlea");
    			add_location(div0, file, 24, 2, 542);
    			add_location(h22, file, 40, 32, 1574);
    			attr_dev(img1, "alt", "programmerImage");
    			attr_dev(img1, "class", "img-fluid svelte-9kzlea");
    			if (img1.src !== (img1_src_value = "/images/work.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 41, 4, 1606);
    			attr_dev(p3, "class", "svelte-9kzlea");
    			add_location(p3, file, 43, 4, 1682);
    			attr_dev(p4, "class", "svelte-9kzlea");
    			add_location(p4, file, 44, 5, 1789);
    			attr_dev(section2, "class", "card-over svelte-9kzlea");
    			add_location(section2, file, 40, 3, 1545);
    			add_location(h23, file, 47, 103, 1956);
    			add_location(p5, file, 48, 4, 1981);
    			attr_dev(section3, "class", "card-simple svelte-9kzlea");
    			add_location(section3, file, 47, 3, 1856);
    			attr_dev(div1, "class", "row svelte-9kzlea");
    			add_location(div1, file, 38, 2, 1520);
    			attr_dev(about, "class", "about svelte-9kzlea");
    			add_location(about, file, 23, 1, 518);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, about, anchor);
    			append_dev(about, div0);
    			append_dev(div0, section0);
    			append_dev(section0, h20);
    			append_dev(section0, t1);
    			append_dev(section0, p0);
    			append_dev(p0, t2);
    			append_dev(p0, a);
    			append_dev(p0, t4);
    			/*section0_binding*/ ctx[3](section0);
    			append_dev(div0, t5);
    			append_dev(div0, section1);
    			append_dev(section1, h21);
    			append_dev(section1, t7);
    			append_dev(section1, img0);
    			append_dev(section1, t8);
    			append_dev(section1, strong0);
    			append_dev(section1, p1);
    			append_dev(section1, t11);
    			append_dev(section1, strong1);
    			append_dev(section1, p2);
    			append_dev(about, t14);
    			append_dev(about, div1);
    			append_dev(div1, section2);
    			append_dev(section2, h22);
    			append_dev(section2, t16);
    			append_dev(section2, img1);
    			append_dev(section2, t17);
    			append_dev(section2, p3);
    			append_dev(section2, t19);
    			append_dev(section2, p4);
    			append_dev(div1, t21);
    			append_dev(div1, section3);
    			append_dev(section3, h23);
    			append_dev(section3, t23);
    			append_dev(section3, p5);
    			/*section3_binding*/ ctx[5](section3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(section0, "mousemove", /*mousemove_handler*/ ctx[4], false, false, false),
    					listen_dev(section3, "mousemove", /*mousemove_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(about);
    			/*section0_binding*/ ctx[3](null);
    			/*section3_binding*/ ctx[5](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);
    	let { skillsEl } = $$props;
    	let { whoEl } = $$props;

    	const handleMousemove = (event, element) => {
    		let rect = event.target.getBoundingClientRect();
    		let x = event.clientX - rect.left;
    		let y = event.clientY - rect.top;

    		if (element === "skills") {
    			skillsEl.style.setProperty("--x", x + "px");
    			skillsEl.style.setProperty("--y", y + "px");
    		}

    		if (element === "who") {
    			whoEl.style.setProperty("--x", x + "px");
    			whoEl.style.setProperty("--y", y + "px");
    		}
    	};

    	const writable_props = ["skillsEl", "whoEl"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	function section0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			whoEl = $$value;
    			$$invalidate(1, whoEl);
    		});
    	}

    	const mousemove_handler = e => handleMousemove(e, "who");

    	function section3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			skillsEl = $$value;
    			$$invalidate(0, skillsEl);
    		});
    	}

    	const mousemove_handler_1 = e => handleMousemove(e, "skills");

    	$$self.$$set = $$props => {
    		if ("skillsEl" in $$props) $$invalidate(0, skillsEl = $$props.skillsEl);
    		if ("whoEl" in $$props) $$invalidate(1, whoEl = $$props.whoEl);
    	};

    	$$self.$capture_state = () => ({ skillsEl, whoEl, handleMousemove });

    	$$self.$inject_state = $$props => {
    		if ("skillsEl" in $$props) $$invalidate(0, skillsEl = $$props.skillsEl);
    		if ("whoEl" in $$props) $$invalidate(1, whoEl = $$props.whoEl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		skillsEl,
    		whoEl,
    		handleMousemove,
    		section0_binding,
    		mousemove_handler,
    		section3_binding,
    		mousemove_handler_1
    	];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { skillsEl: 0, whoEl: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*skillsEl*/ ctx[0] === undefined && !("skillsEl" in props)) {
    			console.warn("<About> was created without expected prop 'skillsEl'");
    		}

    		if (/*whoEl*/ ctx[1] === undefined && !("whoEl" in props)) {
    			console.warn("<About> was created without expected prop 'whoEl'");
    		}
    	}

    	get skillsEl() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skillsEl(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get whoEl() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set whoEl(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Nav.svelte generated by Svelte v3.25.0 */
    const file$1 = "src\\Nav.svelte";

    // (5:8) {#if (!hideMenu)}
    function create_if_block(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let span0;
    	let t3;
    	let span1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Sergio David Posse";
    			t1 = space();
    			span0 = element("span");
    			span0.textContent = "Leave a message in this site";
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "View my formal resume";
    			attr_dev(h4, "class", "menu-modal-item svelte-f2nbkd");
    			set_style(h4, "color", "white");
    			set_style(h4, "background-color", "black");
    			add_location(h4, file$1, 6, 12, 109);
    			attr_dev(span0, "class", "menu-modal-item svelte-f2nbkd");
    			set_style(span0, "background-color", "rgb(158, 226, 242,0)");
    			set_style(span0, "color", "rgb(224, 255, 255,0.7)");
    			add_location(span0, file$1, 7, 12, 217);
    			attr_dev(span1, "class", "menu-modal-item svelte-f2nbkd");
    			attr_dev(span1, "style", "background-color:rgb(224, 100, 100,0);color:rgb(224, 255, 255,0.7););");
    			add_location(span1, file$1, 8, 12, 372);
    			attr_dev(div, "class", "menu-modal svelte-f2nbkd");
    			add_location(div, file$1, 5, 8, 49);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, span0);
    			append_dev(div, t3);
    			append_dev(div, span1);
    			/*div_binding*/ ctx[4](div);

    			if (!mounted) {
    				dispose = listen_dev(span1, "click", /*handlePdfClick*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(5:8) {#if (!hideMenu)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let nav;
    	let t0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div0;
    	let t3;
    	let div1;
    	let mounted;
    	let dispose;
    	let if_block = !/*hideMenu*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if (if_block) if_block.c();
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "About";
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = "Portfolio";
    			if (img.src !== (img_src_value = "/images/menu.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "menu");
    			attr_dev(img, "class", "svelte-f2nbkd");
    			add_location(img, file$1, 11, 8, 577);
    			attr_dev(div0, "class", "about svelte-f2nbkd");
    			add_location(div0, file$1, 12, 8, 648);
    			attr_dev(div1, "class", "portfolio svelte-f2nbkd");
    			add_location(div1, file$1, 15, 8, 712);
    			attr_dev(nav, "class", "svelte-f2nbkd");
    			add_location(nav, file$1, 3, 1, 7);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if (if_block) if_block.m(nav, null);
    			append_dev(nav, t0);
    			append_dev(nav, img);
    			append_dev(nav, t1);
    			append_dev(nav, div0);
    			append_dev(nav, t3);
    			append_dev(nav, div1);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*clickMenu*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*hideMenu*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(nav, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, []);
    	let { hideMenu } = $$props;
    	let { modalMenu } = $$props;
    	let visible = false;

    	const clickMenu = () => {
    		$$invalidate(0, hideMenu = false);
    	};

    	const handlePdfClick = () => {
    		window.open("/cv-sergiodavidposse.pdf");
    	};

    	const writable_props = ["hideMenu", "modalMenu"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			modalMenu = $$value;
    			$$invalidate(1, modalMenu);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("hideMenu" in $$props) $$invalidate(0, hideMenu = $$props.hideMenu);
    		if ("modalMenu" in $$props) $$invalidate(1, modalMenu = $$props.modalMenu);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		setContext,
    		hideMenu,
    		modalMenu,
    		visible,
    		clickMenu,
    		handlePdfClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("hideMenu" in $$props) $$invalidate(0, hideMenu = $$props.hideMenu);
    		if ("modalMenu" in $$props) $$invalidate(1, modalMenu = $$props.modalMenu);
    		if ("visible" in $$props) visible = $$props.visible;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hideMenu, modalMenu, clickMenu, handlePdfClick, div_binding];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { hideMenu: 0, modalMenu: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hideMenu*/ ctx[0] === undefined && !("hideMenu" in props)) {
    			console.warn("<Nav> was created without expected prop 'hideMenu'");
    		}

    		if (/*modalMenu*/ ctx[1] === undefined && !("modalMenu" in props)) {
    			console.warn("<Nav> was created without expected prop 'modalMenu'");
    		}
    	}

    	get hideMenu() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideMenu(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalMenu() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalMenu(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\Footer.svelte generated by Svelte v3.25.0 */
    const file$2 = "src\\Footer.svelte";

    function create_fragment$2(ctx) {
    	let footer;
    	let input0;
    	let t0;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div7;
    	let input1;
    	let input1_class_value;
    	let t2;
    	let div1;
    	let h40;
    	let t4;
    	let div2;
    	let h41;
    	let t6;
    	let div3;
    	let h42;
    	let t8;
    	let div4;
    	let h43;
    	let t10;
    	let div5;
    	let h44;
    	let t12;
    	let div6;
    	let h45;
    	let t14;
    	let div8;
    	let h46;
    	let footer_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			input0 = element("input");
    			t0 = space();
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			div7 = element("div");
    			input1 = element("input");
    			t2 = space();
    			div1 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Whatsapp";
    			t4 = space();
    			div2 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Gmail";
    			t6 = space();
    			div3 = element("div");
    			h42 = element("h4");
    			h42.textContent = "Instagram";
    			t8 = space();
    			div4 = element("div");
    			h43 = element("h4");
    			h43.textContent = "Github";
    			t10 = space();
    			div5 = element("div");
    			h44 = element("h4");
    			h44.textContent = "Leave Message";
    			t12 = space();
    			div6 = element("div");
    			h45 = element("h4");
    			h45.textContent = "View resume";
    			t14 = space();
    			div8 = element("div");
    			h46 = element("h4");
    			h46.textContent = "Copyright Sergio Posse 2020";
    			set_style(input0, "position", "absolute");
    			set_style(input0, "left", "-9999px");
    			attr_dev(input0, "id", "justCopy");
    			input0.value = "SergioDavidPosse@gmail.com";
    			add_location(input0, file$2, 26, 4, 737);
    			if (img.src !== (img_src_value = "/images/up.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "open-footer");
    			attr_dev(img, "class", "svelte-yyv0is");
    			add_location(img, file$2, 28, 54, 893);
    			attr_dev(div0, "class", "button-footer2 svelte-yyv0is");
    			add_location(div0, file$2, 28, 4, 843);
    			set_style(input1, "width", "auto");
    			attr_dev(input1, "id", "in");

    			attr_dev(input1, "class", input1_class_value = "" + (null_to_empty(/*visible*/ ctx[0]
    			? "gmail-modal visible"
    			: "gmail-modal invisible") + " svelte-yyv0is"));

    			input1.value = "SergioDavidPosse@gmail.com";
    			add_location(input1, file$2, 31, 12, 995);
    			add_location(h40, file$2, 32, 79, 1210);
    			attr_dev(div1, "class", "svelte-yyv0is");
    			add_location(div1, file$2, 32, 12, 1143);
    			add_location(h41, file$2, 33, 108, 1343);
    			attr_dev(div2, "class", "svelte-yyv0is");
    			add_location(div2, file$2, 33, 12, 1247);
    			add_location(h42, file$2, 34, 83, 1448);
    			attr_dev(div3, "class", "svelte-yyv0is");
    			add_location(div3, file$2, 34, 12, 1377);
    			add_location(h43, file$2, 35, 78, 1552);
    			attr_dev(div4, "class", "svelte-yyv0is");
    			add_location(div4, file$2, 35, 12, 1486);
    			add_location(h44, file$2, 36, 17, 1593);
    			attr_dev(div5, "class", "svelte-yyv0is");
    			add_location(div5, file$2, 36, 12, 1588);
    			add_location(h45, file$2, 37, 45, 1668);
    			attr_dev(div6, "class", "svelte-yyv0is");
    			add_location(div6, file$2, 37, 12, 1635);
    			attr_dev(div7, "class", "footer-message svelte-yyv0is");
    			add_location(div7, file$2, 30, 4, 953);
    			add_location(h46, file$2, 40, 8, 1748);
    			attr_dev(div8, "class", "copyright svelte-yyv0is");
    			add_location(div8, file$2, 39, 4, 1715);
    			attr_dev(footer, "class", "svelte-yyv0is");
    			add_location(footer, file$2, 25, 0, 707);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, input0);
    			append_dev(footer, t0);
    			append_dev(footer, div0);
    			append_dev(div0, img);
    			append_dev(footer, t1);
    			append_dev(footer, div7);
    			append_dev(div7, input1);
    			append_dev(div7, t2);
    			append_dev(div7, div1);
    			append_dev(div1, h40);
    			append_dev(div7, t4);
    			append_dev(div7, div2);
    			append_dev(div2, h41);
    			append_dev(div7, t6);
    			append_dev(div7, div3);
    			append_dev(div3, h42);
    			append_dev(div7, t8);
    			append_dev(div7, div4);
    			append_dev(div4, h43);
    			append_dev(div7, t10);
    			append_dev(div7, div5);
    			append_dev(div5, h44);
    			append_dev(div7, t12);
    			append_dev(div7, div6);
    			append_dev(div6, h45);
    			append_dev(footer, t14);
    			append_dev(footer, div8);
    			append_dev(div8, h46);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*showFooter*/ ctx[2], false, false, false),
    					listen_dev(div1, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(div2, "mouseout", /*handleGmailOver*/ ctx[1], false, false, false),
    					listen_dev(div2, "mouseover", /*handleGmailOver*/ ctx[1], false, false, false),
    					listen_dev(div2, "click", /*handleGmailClick*/ ctx[4], false, false, false),
    					listen_dev(div3, "click", /*click_handler_1*/ ctx[6], false, false, false),
    					listen_dev(div4, "click", /*click_handler_2*/ ctx[7], false, false, false),
    					listen_dev(div6, "click", /*handlePdfClick*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*visible*/ 1 && input1_class_value !== (input1_class_value = "" + (null_to_empty(/*visible*/ ctx[0]
    			? "gmail-modal visible"
    			: "gmail-modal invisible") + " svelte-yyv0is"))) {
    				attr_dev(input1, "class", input1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!footer_transition) footer_transition = create_bidirectional_transition(footer, fade, {}, true);
    				footer_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!footer_transition) footer_transition = create_bidirectional_transition(footer, fade, {}, false);
    			footer_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (detaching && footer_transition) footer_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	let visible = false;

    	const handleGmailOver = () => {
    		$$invalidate(0, visible = !visible);
    	};

    	const showFooter = getContext("showingFooter");

    	const handlePdfClick = () => {
    		window.open("/cv-sergiodavidposse.pdf");
    	};

    	const handleGmailClick = () => {
    		document.getElementById("justCopy").value = "SergioDavidPosse@gmail.com";
    		let elemento = document.getElementById("justCopy");
    		elemento.select();
    		elemento.setSelectionRange(0, 99999);
    		document.execCommand("copy");
    		alert("Copied: " + elemento.value);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		window.open("https://wa.me/5493584849720");
    	};

    	const click_handler_1 = () => window.open("https://instagram.com/ssergio.posse");
    	const click_handler_2 = () => window.open("https://github.com/SergioPosse");

    	$$self.$capture_state = () => ({
    		fade,
    		getContext,
    		visible,
    		handleGmailOver,
    		showFooter,
    		handlePdfClick,
    		handleGmailClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visible,
    		handleGmailOver,
    		showFooter,
    		handlePdfClick,
    		handleGmailClick,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Social.svelte generated by Svelte v3.25.0 */

    const file$3 = "src\\Social.svelte";

    function create_fragment$3(ctx) {
    	let social;
    	let input0;
    	let t0;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let input1;
    	let input1_class_value;
    	let t3;
    	let img2;
    	let img2_src_value;
    	let t4;
    	let img3;
    	let img3_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			social = element("social");
    			input0 = element("input");
    			t0 = space();
    			img0 = element("img");
    			t1 = space();
    			img1 = element("img");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			img2 = element("img");
    			t4 = space();
    			img3 = element("img");
    			set_style(input0, "position", "absolute");
    			set_style(input0, "left", "-9999px");
    			attr_dev(input0, "id", "justCopy");
    			input0.value = "SergioDavidPosse@gmail.com";
    			add_location(input0, file$3, 22, 4, 508);
    			if (img0.src !== (img0_src_value = "/images/whatsapp.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "whatsapp");
    			attr_dev(img0, "class", "svelte-nbged6");
    			add_location(img0, file$3, 24, 4, 614);
    			set_style(img1, "filter", "invert()");
    			if (img1.src !== (img1_src_value = "/images/github.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "github");
    			attr_dev(img1, "class", "svelte-nbged6");
    			add_location(img1, file$3, 25, 4, 731);
    			attr_dev(input1, "id", "in");

    			attr_dev(input1, "class", input1_class_value = "" + (null_to_empty(/*visible*/ ctx[0]
    			? "gmail-modal visible"
    			: "gmail-modal invisible") + " svelte-nbged6"));

    			input1.value = "SergioDavidPosse@gmail.com";
    			add_location(input1, file$3, 27, 4, 882);
    			attr_dev(img2, "alt", "gmail");
    			if (img2.src !== (img2_src_value = "/images/gmail-circle.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-nbged6");
    			add_location(img2, file$3, 28, 4, 1022);
    			if (img3.src !== (img3_src_value = "/images/instagram.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "instagram");
    			attr_dev(img3, "class", "svelte-nbged6");
    			add_location(img3, file$3, 31, 4, 1264);
    			attr_dev(social, "class", "svelte-nbged6");
    			add_location(social, file$3, 21, 0, 494);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, social, anchor);
    			append_dev(social, input0);
    			append_dev(social, t0);
    			append_dev(social, img0);
    			append_dev(social, t1);
    			append_dev(social, img1);
    			append_dev(social, t2);
    			append_dev(social, input1);
    			/*input1_binding*/ ctx[6](input1);
    			append_dev(social, t3);
    			append_dev(social, img2);
    			append_dev(social, t4);
    			append_dev(social, img3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(img1, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(img2, "click", /*handleGmailClick*/ ctx[3], false, false, false),
    					listen_dev(img2, "mouseover", /*handleGmailOver*/ ctx[2], false, false, false),
    					listen_dev(img2, "mouseout", /*handleGmailOver*/ ctx[2], false, false, false),
    					listen_dev(img3, "click", /*click_handler_2*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible*/ 1 && input1_class_value !== (input1_class_value = "" + (null_to_empty(/*visible*/ ctx[0]
    			? "gmail-modal visible"
    			: "gmail-modal invisible") + " svelte-nbged6"))) {
    				attr_dev(input1, "class", input1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(social);
    			/*input1_binding*/ ctx[6](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Social", slots, []);
    	let visible = false;
    	let gmailEl;

    	const handleGmailOver = () => {
    		$$invalidate(0, visible = !visible);
    	};

    	const handleGmailClick = () => {
    		document.getElementById("justCopy").value = "SergioDavidPosse@gmail.com";
    		let elemento = document.getElementById("justCopy");
    		elemento.select();
    		elemento.setSelectionRange(0, 99999);
    		document.execCommand("copy");
    		alert("Copied: " + elemento.value);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Social> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		window.open("https://wa.me/5493584849720");
    	};

    	const click_handler_1 = () => {
    		window.open("https://github.com/SergioPosse");
    	};

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			gmailEl = $$value;
    			$$invalidate(1, gmailEl);
    		});
    	}

    	const click_handler_2 = () => {
    		window.open("https://instagram.com/ssergio.posse");
    	};

    	$$self.$capture_state = () => ({
    		visible,
    		gmailEl,
    		handleGmailOver,
    		handleGmailClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("gmailEl" in $$props) $$invalidate(1, gmailEl = $$props.gmailEl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visible,
    		gmailEl,
    		handleGmailOver,
    		handleGmailClick,
    		click_handler,
    		click_handler_1,
    		input1_binding,
    		click_handler_2
    	];
    }

    class Social extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Social",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var collectionUtils = createCommonjsModule(function (module) {

    var utils = module.exports = {};

    /**
     * Loops through the collection and calls the callback for each element. if the callback returns truthy, the loop is broken and returns the same value.
     * @public
     * @param {*} collection The collection to loop through. Needs to have a length property set and have indices set from 0 to length - 1.
     * @param {function} callback The callback to be called for each element. The element will be given as a parameter to the callback. If this callback returns truthy, the loop is broken and the same value is returned.
     * @returns {*} The value that a callback has returned (if truthy). Otherwise nothing.
     */
    utils.forEach = function(collection, callback) {
        for(var i = 0; i < collection.length; i++) {
            var result = callback(collection[i]);
            if(result) {
                return result;
            }
        }
    };
    });

    var elementUtils = function(options) {
        var getState = options.stateHandler.getState;

        /**
         * Tells if the element has been made detectable and ready to be listened for resize events.
         * @public
         * @param {element} The element to check.
         * @returns {boolean} True or false depending on if the element is detectable or not.
         */
        function isDetectable(element) {
            var state = getState(element);
            return state && !!state.isDetectable;
        }

        /**
         * Marks the element that it has been made detectable and ready to be listened for resize events.
         * @public
         * @param {element} The element to mark.
         */
        function markAsDetectable(element) {
            getState(element).isDetectable = true;
        }

        /**
         * Tells if the element is busy or not.
         * @public
         * @param {element} The element to check.
         * @returns {boolean} True or false depending on if the element is busy or not.
         */
        function isBusy(element) {
            return !!getState(element).busy;
        }

        /**
         * Marks the object is busy and should not be made detectable.
         * @public
         * @param {element} element The element to mark.
         * @param {boolean} busy If the element is busy or not.
         */
        function markBusy(element, busy) {
            getState(element).busy = !!busy;
        }

        return {
            isDetectable: isDetectable,
            markAsDetectable: markAsDetectable,
            isBusy: isBusy,
            markBusy: markBusy
        };
    };

    var listenerHandler = function(idHandler) {
        var eventListeners = {};

        /**
         * Gets all listeners for the given element.
         * @public
         * @param {element} element The element to get all listeners for.
         * @returns All listeners for the given element.
         */
        function getListeners(element) {
            var id = idHandler.get(element);

            if (id === undefined) {
                return [];
            }

            return eventListeners[id] || [];
        }

        /**
         * Stores the given listener for the given element. Will not actually add the listener to the element.
         * @public
         * @param {element} element The element that should have the listener added.
         * @param {function} listener The callback that the element has added.
         */
        function addListener(element, listener) {
            var id = idHandler.get(element);

            if(!eventListeners[id]) {
                eventListeners[id] = [];
            }

            eventListeners[id].push(listener);
        }

        function removeListener(element, listener) {
            var listeners = getListeners(element);
            for (var i = 0, len = listeners.length; i < len; ++i) {
                if (listeners[i] === listener) {
                  listeners.splice(i, 1);
                  break;
                }
            }
        }

        function removeAllListeners(element) {
          var listeners = getListeners(element);
          if (!listeners) { return; }
          listeners.length = 0;
        }

        return {
            get: getListeners,
            add: addListener,
            removeListener: removeListener,
            removeAllListeners: removeAllListeners
        };
    };

    var idGenerator = function() {
        var idCount = 1;

        /**
         * Generates a new unique id in the context.
         * @public
         * @returns {number} A unique id in the context.
         */
        function generate() {
            return idCount++;
        }

        return {
            generate: generate
        };
    };

    var idHandler = function(options) {
        var idGenerator     = options.idGenerator;
        var getState        = options.stateHandler.getState;

        /**
         * Gets the resize detector id of the element.
         * @public
         * @param {element} element The target element to get the id of.
         * @returns {string|number|null} The id of the element. Null if it has no id.
         */
        function getId(element) {
            var state = getState(element);

            if (state && state.id !== undefined) {
                return state.id;
            }

            return null;
        }

        /**
         * Sets the resize detector id of the element. Requires the element to have a resize detector state initialized.
         * @public
         * @param {element} element The target element to set the id of.
         * @returns {string|number|null} The id of the element.
         */
        function setId(element) {
            var state = getState(element);

            if (!state) {
                throw new Error("setId required the element to have a resize detection state.");
            }

            var id = idGenerator.generate();

            state.id = id;

            return id;
        }

        return {
            get: getId,
            set: setId
        };
    };

    /* global console: false */

    /**
     * Reporter that handles the reporting of logs, warnings and errors.
     * @public
     * @param {boolean} quiet Tells if the reporter should be quiet or not.
     */
    var reporter = function(quiet) {
        function noop() {
            //Does nothing.
        }

        var reporter = {
            log: noop,
            warn: noop,
            error: noop
        };

        if(!quiet && window.console) {
            var attachFunction = function(reporter, name) {
                //The proxy is needed to be able to call the method with the console context,
                //since we cannot use bind.
                reporter[name] = function reporterProxy() {
                    var f = console[name];
                    if (f.apply) { //IE9 does not support console.log.apply :)
                        f.apply(console, arguments);
                    } else {
                        for (var i = 0; i < arguments.length; i++) {
                            f(arguments[i]);
                        }
                    }
                };
            };

            attachFunction(reporter, "log");
            attachFunction(reporter, "warn");
            attachFunction(reporter, "error");
        }

        return reporter;
    };

    var browserDetector = createCommonjsModule(function (module) {

    var detector = module.exports = {};

    detector.isIE = function(version) {
        function isAnyIeVersion() {
            var agent = navigator.userAgent.toLowerCase();
            return agent.indexOf("msie") !== -1 || agent.indexOf("trident") !== -1 || agent.indexOf(" edge/") !== -1;
        }

        if(!isAnyIeVersion()) {
            return false;
        }

        if(!version) {
            return true;
        }

        //Shamelessly stolen from https://gist.github.com/padolsey/527683
        var ieVersion = (function(){
            var undef,
                v = 3,
                div = document.createElement("div"),
                all = div.getElementsByTagName("i");

            do {
                div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->";
            }
            while (all[0]);

            return v > 4 ? v : undef;
        }());

        return version === ieVersion;
    };

    detector.isLegacyOpera = function() {
        return !!window.opera;
    };
    });

    var utils_1 = createCommonjsModule(function (module) {

    var utils = module.exports = {};

    utils.getOption = getOption;

    function getOption(options, name, defaultValue) {
        var value = options[name];

        if((value === undefined || value === null) && defaultValue !== undefined) {
            return defaultValue;
        }

        return value;
    }
    });

    var batchProcessor = function batchProcessorMaker(options) {
        options             = options || {};
        var reporter        = options.reporter;
        var asyncProcess    = utils_1.getOption(options, "async", true);
        var autoProcess     = utils_1.getOption(options, "auto", true);

        if(autoProcess && !asyncProcess) {
            reporter && reporter.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true.");
            asyncProcess = true;
        }

        var batch = Batch();
        var asyncFrameHandler;
        var isProcessing = false;

        function addFunction(level, fn) {
            if(!isProcessing && autoProcess && asyncProcess && batch.size() === 0) {
                // Since this is async, it is guaranteed to be executed after that the fn is added to the batch.
                // This needs to be done before, since we're checking the size of the batch to be 0.
                processBatchAsync();
            }

            batch.add(level, fn);
        }

        function processBatch() {
            // Save the current batch, and create a new batch so that incoming functions are not added into the currently processing batch.
            // Continue processing until the top-level batch is empty (functions may be added to the new batch while processing, and so on).
            isProcessing = true;
            while (batch.size()) {
                var processingBatch = batch;
                batch = Batch();
                processingBatch.process();
            }
            isProcessing = false;
        }

        function forceProcessBatch(localAsyncProcess) {
            if (isProcessing) {
                return;
            }

            if(localAsyncProcess === undefined) {
                localAsyncProcess = asyncProcess;
            }

            if(asyncFrameHandler) {
                cancelFrame(asyncFrameHandler);
                asyncFrameHandler = null;
            }

            if(localAsyncProcess) {
                processBatchAsync();
            } else {
                processBatch();
            }
        }

        function processBatchAsync() {
            asyncFrameHandler = requestFrame(processBatch);
        }

        function cancelFrame(listener) {
            // var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
            var cancel = clearTimeout;
            return cancel(listener);
        }

        function requestFrame(callback) {
            // var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) { return window.setTimeout(fn, 20); };
            var raf = function(fn) { return setTimeout(fn, 0); };
            return raf(callback);
        }

        return {
            add: addFunction,
            force: forceProcessBatch
        };
    };

    function Batch() {
        var batch       = {};
        var size        = 0;
        var topLevel    = 0;
        var bottomLevel = 0;

        function add(level, fn) {
            if(!fn) {
                fn = level;
                level = 0;
            }

            if(level > topLevel) {
                topLevel = level;
            } else if(level < bottomLevel) {
                bottomLevel = level;
            }

            if(!batch[level]) {
                batch[level] = [];
            }

            batch[level].push(fn);
            size++;
        }

        function process() {
            for(var level = bottomLevel; level <= topLevel; level++) {
                var fns = batch[level];

                for(var i = 0; i < fns.length; i++) {
                    var fn = fns[i];
                    fn();
                }
            }
        }

        function getSize() {
            return size;
        }

        return {
            add: add,
            process: process,
            size: getSize
        };
    }

    var prop = "_erd";

    function initState(element) {
        element[prop] = {};
        return getState(element);
    }

    function getState(element) {
        return element[prop];
    }

    function cleanState(element) {
        delete element[prop];
    }

    var stateHandler = {
        initState: initState,
        getState: getState,
        cleanState: cleanState
    };

    var object = function(options) {
        options             = options || {};
        var reporter        = options.reporter;
        var batchProcessor  = options.batchProcessor;
        var getState        = options.stateHandler.getState;

        if(!reporter) {
            throw new Error("Missing required dependency: reporter.");
        }

        /**
         * Adds a resize event listener to the element.
         * @public
         * @param {element} element The element that should have the listener added.
         * @param {function} listener The listener callback to be called for each resize event of the element. The element will be given as a parameter to the listener callback.
         */
        function addListener(element, listener) {
            function listenerProxy() {
                listener(element);
            }

            if(browserDetector.isIE(8)) {
                //IE 8 does not support object, but supports the resize event directly on elements.
                getState(element).object = {
                    proxy: listenerProxy
                };
                element.attachEvent("onresize", listenerProxy);
            } else {
                var object = getObject(element);

                if(!object) {
                    throw new Error("Element is not detectable by this strategy.");
                }

                object.contentDocument.defaultView.addEventListener("resize", listenerProxy);
            }
        }

        function buildCssTextString(rules) {
            var seperator = options.important ? " !important; " : "; ";

            return (rules.join(seperator) + seperator).trim();
        }

        /**
         * Makes an element detectable and ready to be listened for resize events. Will call the callback when the element is ready to be listened for resize changes.
         * @private
         * @param {object} options Optional options object.
         * @param {element} element The element to make detectable
         * @param {function} callback The callback to be called when the element is ready to be listened for resize changes. Will be called with the element as first parameter.
         */
        function makeDetectable(options, element, callback) {
            if (!callback) {
                callback = element;
                element = options;
                options = null;
            }

            options = options || {};
            var debug = options.debug;

            function injectObject(element, callback) {
                var OBJECT_STYLE = buildCssTextString(["display: block", "position: absolute", "top: 0", "left: 0", "width: 100%", "height: 100%", "border: none", "padding: 0", "margin: 0", "opacity: 0", "z-index: -1000", "pointer-events: none"]);

                //The target element needs to be positioned (everything except static) so the absolute positioned object will be positioned relative to the target element.

                // Position altering may be performed directly or on object load, depending on if style resolution is possible directly or not.
                var positionCheckPerformed = false;

                // The element may not yet be attached to the DOM, and therefore the style object may be empty in some browsers.
                // Since the style object is a reference, it will be updated as soon as the element is attached to the DOM.
                var style = window.getComputedStyle(element);
                var width = element.offsetWidth;
                var height = element.offsetHeight;

                getState(element).startSize = {
                    width: width,
                    height: height
                };

                function mutateDom() {
                    function alterPositionStyles() {
                        if(style.position === "static") {
                            element.style.setProperty("position", "relative", options.important ? "important" : "");

                            var removeRelativeStyles = function(reporter, element, style, property) {
                                function getNumericalValue(value) {
                                    return value.replace(/[^-\d\.]/g, "");
                                }

                                var value = style[property];

                                if(value !== "auto" && getNumericalValue(value) !== "0") {
                                    reporter.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element);
                                    element.style.setProperty(property, "0", options.important ? "important" : "");
                                }
                            };

                            //Check so that there are no accidental styles that will make the element styled differently now that is is relative.
                            //If there are any, set them to 0 (this should be okay with the user since the style properties did nothing before [since the element was positioned static] anyway).
                            removeRelativeStyles(reporter, element, style, "top");
                            removeRelativeStyles(reporter, element, style, "right");
                            removeRelativeStyles(reporter, element, style, "bottom");
                            removeRelativeStyles(reporter, element, style, "left");
                        }
                    }

                    function onObjectLoad() {
                        // The object has been loaded, which means that the element now is guaranteed to be attached to the DOM.
                        if (!positionCheckPerformed) {
                            alterPositionStyles();
                        }

                        /*jshint validthis: true */

                        function getDocument(element, callback) {
                            //Opera 12 seem to call the object.onload before the actual document has been created.
                            //So if it is not present, poll it with an timeout until it is present.
                            //TODO: Could maybe be handled better with object.onreadystatechange or similar.
                            if(!element.contentDocument) {
                                var state = getState(element);
                                if (state.checkForObjectDocumentTimeoutId) {
                                    window.clearTimeout(state.checkForObjectDocumentTimeoutId);
                                }
                                state.checkForObjectDocumentTimeoutId = setTimeout(function checkForObjectDocument() {
                                    state.checkForObjectDocumentTimeoutId = 0;
                                    getDocument(element, callback);
                                }, 100);

                                return;
                            }

                            callback(element.contentDocument);
                        }

                        //Mutating the object element here seems to fire another load event.
                        //Mutating the inner document of the object element is fine though.
                        var objectElement = this;

                        //Create the style element to be added to the object.
                        getDocument(objectElement, function onObjectDocumentReady(objectDocument) {
                            //Notify that the element is ready to be listened to.
                            callback(element);
                        });
                    }

                    // The element may be detached from the DOM, and some browsers does not support style resolving of detached elements.
                    // The alterPositionStyles needs to be delayed until we know the element has been attached to the DOM (which we are sure of when the onObjectLoad has been fired), if style resolution is not possible.
                    if (style.position !== "") {
                        alterPositionStyles();
                        positionCheckPerformed = true;
                    }

                    //Add an object element as a child to the target element that will be listened to for resize events.
                    var object = document.createElement("object");
                    object.style.cssText = OBJECT_STYLE;
                    object.tabIndex = -1;
                    object.type = "text/html";
                    object.setAttribute("aria-hidden", "true");
                    object.onload = onObjectLoad;

                    //Safari: This must occur before adding the object to the DOM.
                    //IE: Does not like that this happens before, even if it is also added after.
                    if(!browserDetector.isIE()) {
                        object.data = "about:blank";
                    }

                    if (!getState(element)) {
                        // The element has been uninstalled before the actual loading happened.
                        return;
                    }

                    element.appendChild(object);
                    getState(element).object = object;

                    //IE: This must occur after adding the object to the DOM.
                    if(browserDetector.isIE()) {
                        object.data = "about:blank";
                    }
                }

                if(batchProcessor) {
                    batchProcessor.add(mutateDom);
                } else {
                    mutateDom();
                }
            }

            if(browserDetector.isIE(8)) {
                //IE 8 does not support objects properly. Luckily they do support the resize event.
                //So do not inject the object and notify that the element is already ready to be listened to.
                //The event handler for the resize event is attached in the utils.addListener instead.
                callback(element);
            } else {
                injectObject(element, callback);
            }
        }

        /**
         * Returns the child object of the target element.
         * @private
         * @param {element} element The target element.
         * @returns The object element of the target.
         */
        function getObject(element) {
            return getState(element).object;
        }

        function uninstall(element) {
            if (!getState(element)) {
                return;
            }

            var object = getObject(element);

            if (!object) {
                return;
            }

            if (browserDetector.isIE(8)) {
                element.detachEvent("onresize", object.proxy);
            } else {
                element.removeChild(object);
            }

            if (getState(element).checkForObjectDocumentTimeoutId) {
                window.clearTimeout(getState(element).checkForObjectDocumentTimeoutId);
            }

            delete getState(element).object;
        }

        return {
            makeDetectable: makeDetectable,
            addListener: addListener,
            uninstall: uninstall
        };
    };

    var forEach = collectionUtils.forEach;

    var scroll = function(options) {
        options             = options || {};
        var reporter        = options.reporter;
        var batchProcessor  = options.batchProcessor;
        var getState        = options.stateHandler.getState;
        var hasState        = options.stateHandler.hasState;
        var idHandler       = options.idHandler;

        if (!batchProcessor) {
            throw new Error("Missing required dependency: batchProcessor");
        }

        if (!reporter) {
            throw new Error("Missing required dependency: reporter.");
        }

        //TODO: Could this perhaps be done at installation time?
        var scrollbarSizes = getScrollbarSizes();

        var styleId = "erd_scroll_detection_scrollbar_style";
        var detectionContainerClass = "erd_scroll_detection_container";

        function initDocument(targetDocument) {
            // Inject the scrollbar styling that prevents them from appearing sometimes in Chrome.
            // The injected container needs to have a class, so that it may be styled with CSS (pseudo elements).
            injectScrollStyle(targetDocument, styleId, detectionContainerClass);
        }

        initDocument(window.document);

        function buildCssTextString(rules) {
            var seperator = options.important ? " !important; " : "; ";

            return (rules.join(seperator) + seperator).trim();
        }

        function getScrollbarSizes() {
            var width = 500;
            var height = 500;

            var child = document.createElement("div");
            child.style.cssText = buildCssTextString(["position: absolute", "width: " + width*2 + "px", "height: " + height*2 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);

            var container = document.createElement("div");
            container.style.cssText = buildCssTextString(["position: absolute", "width: " + width + "px", "height: " + height + "px", "overflow: scroll", "visibility: none", "top: " + -width*3 + "px", "left: " + -height*3 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);

            container.appendChild(child);

            document.body.insertBefore(container, document.body.firstChild);

            var widthSize = width - container.clientWidth;
            var heightSize = height - container.clientHeight;

            document.body.removeChild(container);

            return {
                width: widthSize,
                height: heightSize
            };
        }

        function injectScrollStyle(targetDocument, styleId, containerClass) {
            function injectStyle(style, method) {
                method = method || function (element) {
                    targetDocument.head.appendChild(element);
                };

                var styleElement = targetDocument.createElement("style");
                styleElement.innerHTML = style;
                styleElement.id = styleId;
                method(styleElement);
                return styleElement;
            }

            if (!targetDocument.getElementById(styleId)) {
                var containerAnimationClass = containerClass + "_animation";
                var containerAnimationActiveClass = containerClass + "_animation_active";
                var style = "/* Created by the element-resize-detector library. */\n";
                style += "." + containerClass + " > div::-webkit-scrollbar { " + buildCssTextString(["display: none"]) + " }\n\n";
                style += "." + containerAnimationActiveClass + " { " + buildCssTextString(["-webkit-animation-duration: 0.1s", "animation-duration: 0.1s", "-webkit-animation-name: " + containerAnimationClass, "animation-name: " + containerAnimationClass]) + " }\n";
                style += "@-webkit-keyframes " + containerAnimationClass +  " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n";
                style += "@keyframes " + containerAnimationClass +          " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }";
                injectStyle(style);
            }
        }

        function addAnimationClass(element) {
            element.className += " " + detectionContainerClass + "_animation_active";
        }

        function addEvent(el, name, cb) {
            if (el.addEventListener) {
                el.addEventListener(name, cb);
            } else if(el.attachEvent) {
                el.attachEvent("on" + name, cb);
            } else {
                return reporter.error("[scroll] Don't know how to add event listeners.");
            }
        }

        function removeEvent(el, name, cb) {
            if (el.removeEventListener) {
                el.removeEventListener(name, cb);
            } else if(el.detachEvent) {
                el.detachEvent("on" + name, cb);
            } else {
                return reporter.error("[scroll] Don't know how to remove event listeners.");
            }
        }

        function getExpandElement(element) {
            return getState(element).container.childNodes[0].childNodes[0].childNodes[0];
        }

        function getShrinkElement(element) {
            return getState(element).container.childNodes[0].childNodes[0].childNodes[1];
        }

        /**
         * Adds a resize event listener to the element.
         * @public
         * @param {element} element The element that should have the listener added.
         * @param {function} listener The listener callback to be called for each resize event of the element. The element will be given as a parameter to the listener callback.
         */
        function addListener(element, listener) {
            var listeners = getState(element).listeners;

            if (!listeners.push) {
                throw new Error("Cannot add listener to an element that is not detectable.");
            }

            getState(element).listeners.push(listener);
        }

        /**
         * Makes an element detectable and ready to be listened for resize events. Will call the callback when the element is ready to be listened for resize changes.
         * @private
         * @param {object} options Optional options object.
         * @param {element} element The element to make detectable
         * @param {function} callback The callback to be called when the element is ready to be listened for resize changes. Will be called with the element as first parameter.
         */
        function makeDetectable(options, element, callback) {
            if (!callback) {
                callback = element;
                element = options;
                options = null;
            }

            options = options || {};

            function debug() {
                if (options.debug) {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(idHandler.get(element), "Scroll: ");
                    if (reporter.log.apply) {
                        reporter.log.apply(null, args);
                    } else {
                        for (var i = 0; i < args.length; i++) {
                            reporter.log(args[i]);
                        }
                    }
                }
            }

            function isDetached(element) {
                function isInDocument(element) {
                    return element === element.ownerDocument.body || element.ownerDocument.body.contains(element);
                }

                if (!isInDocument(element)) {
                    return true;
                }

                // FireFox returns null style in hidden iframes. See https://github.com/wnr/element-resize-detector/issues/68 and https://bugzilla.mozilla.org/show_bug.cgi?id=795520
                if (window.getComputedStyle(element) === null) {
                    return true;
                }

                return false;
            }

            function isUnrendered(element) {
                // Check the absolute positioned container since the top level container is display: inline.
                var container = getState(element).container.childNodes[0];
                var style = window.getComputedStyle(container);
                return !style.width || style.width.indexOf("px") === -1; //Can only compute pixel value when rendered.
            }

            function getStyle() {
                // Some browsers only force layouts when actually reading the style properties of the style object, so make sure that they are all read here,
                // so that the user of the function can be sure that it will perform the layout here, instead of later (important for batching).
                var elementStyle            = window.getComputedStyle(element);
                var style                   = {};
                style.position              = elementStyle.position;
                style.width                 = element.offsetWidth;
                style.height                = element.offsetHeight;
                style.top                   = elementStyle.top;
                style.right                 = elementStyle.right;
                style.bottom                = elementStyle.bottom;
                style.left                  = elementStyle.left;
                style.widthCSS              = elementStyle.width;
                style.heightCSS             = elementStyle.height;
                return style;
            }

            function storeStartSize() {
                var style = getStyle();
                getState(element).startSize = {
                    width: style.width,
                    height: style.height
                };
                debug("Element start size", getState(element).startSize);
            }

            function initListeners() {
                getState(element).listeners = [];
            }

            function storeStyle() {
                debug("storeStyle invoked.");
                if (!getState(element)) {
                    debug("Aborting because element has been uninstalled");
                    return;
                }

                var style = getStyle();
                getState(element).style = style;
            }

            function storeCurrentSize(element, width, height) {
                getState(element).lastWidth = width;
                getState(element).lastHeight  = height;
            }

            function getExpandChildElement(element) {
                return getExpandElement(element).childNodes[0];
            }

            function getWidthOffset() {
                return 2 * scrollbarSizes.width + 1;
            }

            function getHeightOffset() {
                return 2 * scrollbarSizes.height + 1;
            }

            function getExpandWidth(width) {
                return width + 10 + getWidthOffset();
            }

            function getExpandHeight(height) {
                return height + 10 + getHeightOffset();
            }

            function getShrinkWidth(width) {
                return width * 2 + getWidthOffset();
            }

            function getShrinkHeight(height) {
                return height * 2 + getHeightOffset();
            }

            function positionScrollbars(element, width, height) {
                var expand          = getExpandElement(element);
                var shrink          = getShrinkElement(element);
                var expandWidth     = getExpandWidth(width);
                var expandHeight    = getExpandHeight(height);
                var shrinkWidth     = getShrinkWidth(width);
                var shrinkHeight    = getShrinkHeight(height);
                expand.scrollLeft   = expandWidth;
                expand.scrollTop    = expandHeight;
                shrink.scrollLeft   = shrinkWidth;
                shrink.scrollTop    = shrinkHeight;
            }

            function injectContainerElement() {
                var container = getState(element).container;

                if (!container) {
                    container                   = document.createElement("div");
                    container.className         = detectionContainerClass;
                    container.style.cssText     = buildCssTextString(["visibility: hidden", "display: inline", "width: 0px", "height: 0px", "z-index: -1", "overflow: hidden", "margin: 0", "padding: 0"]);
                    getState(element).container = container;
                    addAnimationClass(container);
                    element.appendChild(container);

                    var onAnimationStart = function () {
                        getState(element).onRendered && getState(element).onRendered();
                    };

                    addEvent(container, "animationstart", onAnimationStart);

                    // Store the event handler here so that they may be removed when uninstall is called.
                    // See uninstall function for an explanation why it is needed.
                    getState(element).onAnimationStart = onAnimationStart;
                }

                return container;
            }

            function injectScrollElements() {
                function alterPositionStyles() {
                    var style = getState(element).style;

                    if(style.position === "static") {
                        element.style.setProperty("position", "relative",options.important ? "important" : "");

                        var removeRelativeStyles = function(reporter, element, style, property) {
                            function getNumericalValue(value) {
                                return value.replace(/[^-\d\.]/g, "");
                            }

                            var value = style[property];

                            if(value !== "auto" && getNumericalValue(value) !== "0") {
                                reporter.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element);
                                element.style[property] = 0;
                            }
                        };

                        //Check so that there are no accidental styles that will make the element styled differently now that is is relative.
                        //If there are any, set them to 0 (this should be okay with the user since the style properties did nothing before [since the element was positioned static] anyway).
                        removeRelativeStyles(reporter, element, style, "top");
                        removeRelativeStyles(reporter, element, style, "right");
                        removeRelativeStyles(reporter, element, style, "bottom");
                        removeRelativeStyles(reporter, element, style, "left");
                    }
                }

                function getLeftTopBottomRightCssText(left, top, bottom, right) {
                    left = (!left ? "0" : (left + "px"));
                    top = (!top ? "0" : (top + "px"));
                    bottom = (!bottom ? "0" : (bottom + "px"));
                    right = (!right ? "0" : (right + "px"));

                    return ["left: " + left, "top: " + top, "right: " + right, "bottom: " + bottom];
                }

                debug("Injecting elements");

                if (!getState(element)) {
                    debug("Aborting because element has been uninstalled");
                    return;
                }

                alterPositionStyles();

                var rootContainer = getState(element).container;

                if (!rootContainer) {
                    rootContainer = injectContainerElement();
                }

                // Due to this WebKit bug https://bugs.webkit.org/show_bug.cgi?id=80808 (currently fixed in Blink, but still present in WebKit browsers such as Safari),
                // we need to inject two containers, one that is width/height 100% and another that is left/top -1px so that the final container always is 1x1 pixels bigger than
                // the targeted element.
                // When the bug is resolved, "containerContainer" may be removed.

                // The outer container can occasionally be less wide than the targeted when inside inline elements element in WebKit (see https://bugs.webkit.org/show_bug.cgi?id=152980).
                // This should be no problem since the inner container either way makes sure the injected scroll elements are at least 1x1 px.

                var scrollbarWidth          = scrollbarSizes.width;
                var scrollbarHeight         = scrollbarSizes.height;
                var containerContainerStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%", "left: 0px", "top: 0px"]);
                var containerStyle          = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden"].concat(getLeftTopBottomRightCssText(-(1 + scrollbarWidth), -(1 + scrollbarHeight), -scrollbarHeight, -scrollbarWidth)));
                var expandStyle             = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
                var shrinkStyle             = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
                var expandChildStyle        = buildCssTextString(["position: absolute", "left: 0", "top: 0"]);
                var shrinkChildStyle        = buildCssTextString(["position: absolute", "width: 200%", "height: 200%"]);

                var containerContainer      = document.createElement("div");
                var container               = document.createElement("div");
                var expand                  = document.createElement("div");
                var expandChild             = document.createElement("div");
                var shrink                  = document.createElement("div");
                var shrinkChild             = document.createElement("div");

                // Some browsers choke on the resize system being rtl, so force it to ltr. https://github.com/wnr/element-resize-detector/issues/56
                // However, dir should not be set on the top level container as it alters the dimensions of the target element in some browsers.
                containerContainer.dir              = "ltr";

                containerContainer.style.cssText    = containerContainerStyle;
                containerContainer.className        = detectionContainerClass;
                container.className                 = detectionContainerClass;
                container.style.cssText             = containerStyle;
                expand.style.cssText                = expandStyle;
                expandChild.style.cssText           = expandChildStyle;
                shrink.style.cssText                = shrinkStyle;
                shrinkChild.style.cssText           = shrinkChildStyle;

                expand.appendChild(expandChild);
                shrink.appendChild(shrinkChild);
                container.appendChild(expand);
                container.appendChild(shrink);
                containerContainer.appendChild(container);
                rootContainer.appendChild(containerContainer);

                function onExpandScroll() {
                    getState(element).onExpand && getState(element).onExpand();
                }

                function onShrinkScroll() {
                    getState(element).onShrink && getState(element).onShrink();
                }

                addEvent(expand, "scroll", onExpandScroll);
                addEvent(shrink, "scroll", onShrinkScroll);

                // Store the event handlers here so that they may be removed when uninstall is called.
                // See uninstall function for an explanation why it is needed.
                getState(element).onExpandScroll = onExpandScroll;
                getState(element).onShrinkScroll = onShrinkScroll;
            }

            function registerListenersAndPositionElements() {
                function updateChildSizes(element, width, height) {
                    var expandChild             = getExpandChildElement(element);
                    var expandWidth             = getExpandWidth(width);
                    var expandHeight            = getExpandHeight(height);
                    expandChild.style.setProperty("width", expandWidth + "px", options.important ? "important" : "");
                    expandChild.style.setProperty("height", expandHeight + "px", options.important ? "important" : "");
                }

                function updateDetectorElements(done) {
                    var width           = element.offsetWidth;
                    var height          = element.offsetHeight;

                    // Check whether the size has actually changed since last time the algorithm ran. If not, some steps may be skipped.
                    var sizeChanged = width !== getState(element).lastWidth || height !== getState(element).lastHeight;

                    debug("Storing current size", width, height);

                    // Store the size of the element sync here, so that multiple scroll events may be ignored in the event listeners.
                    // Otherwise the if-check in handleScroll is useless.
                    storeCurrentSize(element, width, height);

                    // Since we delay the processing of the batch, there is a risk that uninstall has been called before the batch gets to execute.
                    // Since there is no way to cancel the fn executions, we need to add an uninstall guard to all fns of the batch.

                    batchProcessor.add(0, function performUpdateChildSizes() {
                        if (!sizeChanged) {
                            return;
                        }

                        if (!getState(element)) {
                            debug("Aborting because element has been uninstalled");
                            return;
                        }

                        if (!areElementsInjected()) {
                            debug("Aborting because element container has not been initialized");
                            return;
                        }

                        if (options.debug) {
                            var w = element.offsetWidth;
                            var h = element.offsetHeight;

                            if (w !== width || h !== height) {
                                reporter.warn(idHandler.get(element), "Scroll: Size changed before updating detector elements.");
                            }
                        }

                        updateChildSizes(element, width, height);
                    });

                    batchProcessor.add(1, function updateScrollbars() {
                        // This function needs to be invoked event though the size is unchanged. The element could have been resized very quickly and then
                        // been restored to the original size, which will have changed the scrollbar positions.

                        if (!getState(element)) {
                            debug("Aborting because element has been uninstalled");
                            return;
                        }

                        if (!areElementsInjected()) {
                            debug("Aborting because element container has not been initialized");
                            return;
                        }

                        positionScrollbars(element, width, height);
                    });

                    if (sizeChanged && done) {
                        batchProcessor.add(2, function () {
                            if (!getState(element)) {
                                debug("Aborting because element has been uninstalled");
                                return;
                            }

                            if (!areElementsInjected()) {
                              debug("Aborting because element container has not been initialized");
                              return;
                            }

                            done();
                        });
                    }
                }

                function areElementsInjected() {
                    return !!getState(element).container;
                }

                function notifyListenersIfNeeded() {
                    function isFirstNotify() {
                        return getState(element).lastNotifiedWidth === undefined;
                    }

                    debug("notifyListenersIfNeeded invoked");

                    var state = getState(element);

                    // Don't notify if the current size is the start size, and this is the first notification.
                    if (isFirstNotify() && state.lastWidth === state.startSize.width && state.lastHeight === state.startSize.height) {
                        return debug("Not notifying: Size is the same as the start size, and there has been no notification yet.");
                    }

                    // Don't notify if the size already has been notified.
                    if (state.lastWidth === state.lastNotifiedWidth && state.lastHeight === state.lastNotifiedHeight) {
                        return debug("Not notifying: Size already notified");
                    }


                    debug("Current size not notified, notifying...");
                    state.lastNotifiedWidth = state.lastWidth;
                    state.lastNotifiedHeight = state.lastHeight;
                    forEach(getState(element).listeners, function (listener) {
                        listener(element);
                    });
                }

                function handleRender() {
                    debug("startanimation triggered.");

                    if (isUnrendered(element)) {
                        debug("Ignoring since element is still unrendered...");
                        return;
                    }

                    debug("Element rendered.");
                    var expand = getExpandElement(element);
                    var shrink = getShrinkElement(element);
                    if (expand.scrollLeft === 0 || expand.scrollTop === 0 || shrink.scrollLeft === 0 || shrink.scrollTop === 0) {
                        debug("Scrollbars out of sync. Updating detector elements...");
                        updateDetectorElements(notifyListenersIfNeeded);
                    }
                }

                function handleScroll() {
                    debug("Scroll detected.");

                    if (isUnrendered(element)) {
                        // Element is still unrendered. Skip this scroll event.
                        debug("Scroll event fired while unrendered. Ignoring...");
                        return;
                    }

                    updateDetectorElements(notifyListenersIfNeeded);
                }

                debug("registerListenersAndPositionElements invoked.");

                if (!getState(element)) {
                    debug("Aborting because element has been uninstalled");
                    return;
                }

                getState(element).onRendered = handleRender;
                getState(element).onExpand = handleScroll;
                getState(element).onShrink = handleScroll;

                var style = getState(element).style;
                updateChildSizes(element, style.width, style.height);
            }

            function finalizeDomMutation() {
                debug("finalizeDomMutation invoked.");

                if (!getState(element)) {
                    debug("Aborting because element has been uninstalled");
                    return;
                }

                var style = getState(element).style;
                storeCurrentSize(element, style.width, style.height);
                positionScrollbars(element, style.width, style.height);
            }

            function ready() {
                callback(element);
            }

            function install() {
                debug("Installing...");
                initListeners();
                storeStartSize();

                batchProcessor.add(0, storeStyle);
                batchProcessor.add(1, injectScrollElements);
                batchProcessor.add(2, registerListenersAndPositionElements);
                batchProcessor.add(3, finalizeDomMutation);
                batchProcessor.add(4, ready);
            }

            debug("Making detectable...");

            if (isDetached(element)) {
                debug("Element is detached");

                injectContainerElement();

                debug("Waiting until element is attached...");

                getState(element).onRendered = function () {
                    debug("Element is now attached");
                    install();
                };
            } else {
                install();
            }
        }

        function uninstall(element) {
            var state = getState(element);

            if (!state) {
                // Uninstall has been called on a non-erd element.
                return;
            }

            // Uninstall may have been called in the following scenarios:
            // (1) Right between the sync code and async batch (here state.busy = true, but nothing have been registered or injected).
            // (2) In the ready callback of the last level of the batch by another element (here, state.busy = true, but all the stuff has been injected).
            // (3) After the installation process (here, state.busy = false and all the stuff has been injected).
            // So to be on the safe side, let's check for each thing before removing.

            // We need to remove the event listeners, because otherwise the event might fire on an uninstall element which results in an error when trying to get the state of the element.
            state.onExpandScroll && removeEvent(getExpandElement(element), "scroll", state.onExpandScroll);
            state.onShrinkScroll && removeEvent(getShrinkElement(element), "scroll", state.onShrinkScroll);
            state.onAnimationStart && removeEvent(state.container, "animationstart", state.onAnimationStart);

            state.container && element.removeChild(state.container);
        }

        return {
            makeDetectable: makeDetectable,
            addListener: addListener,
            uninstall: uninstall,
            initDocument: initDocument
        };
    };

    var forEach$1                 = collectionUtils.forEach;









    //Detection strategies.



    function isCollection(obj) {
        return Array.isArray(obj) || obj.length !== undefined;
    }

    function toArray(collection) {
        if (!Array.isArray(collection)) {
            var array = [];
            forEach$1(collection, function (obj) {
                array.push(obj);
            });
            return array;
        } else {
            return collection;
        }
    }

    function isElement(obj) {
        return obj && obj.nodeType === 1;
    }

    /**
     * @typedef idHandler
     * @type {object}
     * @property {function} get Gets the resize detector id of the element.
     * @property {function} set Generate and sets the resize detector id of the element.
     */

    /**
     * @typedef Options
     * @type {object}
     * @property {boolean} callOnAdd    Determines if listeners should be called when they are getting added.
                                        Default is true. If true, the listener is guaranteed to be called when it has been added.
                                        If false, the listener will not be guarenteed to be called when it has been added (does not prevent it from being called).
     * @property {idHandler} idHandler  A custom id handler that is responsible for generating, setting and retrieving id's for elements.
                                        If not provided, a default id handler will be used.
     * @property {reporter} reporter    A custom reporter that handles reporting logs, warnings and errors.
                                        If not provided, a default id handler will be used.
                                        If set to false, then nothing will be reported.
     * @property {boolean} debug        If set to true, the the system will report debug messages as default for the listenTo method.
     */

    /**
     * Creates an element resize detector instance.
     * @public
     * @param {Options?} options Optional global options object that will decide how this instance will work.
     */
    var elementResizeDetector = function(options) {
        options = options || {};

        //idHandler is currently not an option to the listenTo function, so it should not be added to globalOptions.
        var idHandler$1;

        if (options.idHandler) {
            // To maintain compatability with idHandler.get(element, readonly), make sure to wrap the given idHandler
            // so that readonly flag always is true when it's used here. This may be removed next major version bump.
            idHandler$1 = {
                get: function (element) { return options.idHandler.get(element, true); },
                set: options.idHandler.set
            };
        } else {
            var idGenerator$1 = idGenerator();
            var defaultIdHandler = idHandler({
                idGenerator: idGenerator$1,
                stateHandler: stateHandler
            });
            idHandler$1 = defaultIdHandler;
        }

        //reporter is currently not an option to the listenTo function, so it should not be added to globalOptions.
        var reporter$1 = options.reporter;

        if(!reporter$1) {
            //If options.reporter is false, then the reporter should be quiet.
            var quiet = reporter$1 === false;
            reporter$1 = reporter(quiet);
        }

        //batchProcessor is currently not an option to the listenTo function, so it should not be added to globalOptions.
        var batchProcessor$1 = getOption(options, "batchProcessor", batchProcessor({ reporter: reporter$1 }));

        //Options to be used as default for the listenTo function.
        var globalOptions = {};
        globalOptions.callOnAdd     = !!getOption(options, "callOnAdd", true);
        globalOptions.debug         = !!getOption(options, "debug", false);

        var eventListenerHandler    = listenerHandler(idHandler$1);
        var elementUtils$1            = elementUtils({
            stateHandler: stateHandler
        });

        //The detection strategy to be used.
        var detectionStrategy;
        var desiredStrategy = getOption(options, "strategy", "object");
        var importantCssRules = getOption(options, "important", false);
        var strategyOptions = {
            reporter: reporter$1,
            batchProcessor: batchProcessor$1,
            stateHandler: stateHandler,
            idHandler: idHandler$1,
            important: importantCssRules
        };

        if(desiredStrategy === "scroll") {
            if (browserDetector.isLegacyOpera()) {
                reporter$1.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy.");
                desiredStrategy = "object";
            } else if (browserDetector.isIE(9)) {
                reporter$1.warn("Scroll strategy is not supported on IE9. Changing to object strategy.");
                desiredStrategy = "object";
            }
        }

        if(desiredStrategy === "scroll") {
            detectionStrategy = scroll(strategyOptions);
        } else if(desiredStrategy === "object") {
            detectionStrategy = object(strategyOptions);
        } else {
            throw new Error("Invalid strategy name: " + desiredStrategy);
        }

        //Calls can be made to listenTo with elements that are still being installed.
        //Also, same elements can occur in the elements list in the listenTo function.
        //With this map, the ready callbacks can be synchronized between the calls
        //so that the ready callback can always be called when an element is ready - even if
        //it wasn't installed from the function itself.
        var onReadyCallbacks = {};

        /**
         * Makes the given elements resize-detectable and starts listening to resize events on the elements. Calls the event callback for each event for each element.
         * @public
         * @param {Options?} options Optional options object. These options will override the global options. Some options may not be overriden, such as idHandler.
         * @param {element[]|element} elements The given array of elements to detect resize events of. Single element is also valid.
         * @param {function} listener The callback to be executed for each resize event for each element.
         */
        function listenTo(options, elements, listener) {
            function onResizeCallback(element) {
                var listeners = eventListenerHandler.get(element);
                forEach$1(listeners, function callListenerProxy(listener) {
                    listener(element);
                });
            }

            function addListener(callOnAdd, element, listener) {
                eventListenerHandler.add(element, listener);

                if(callOnAdd) {
                    listener(element);
                }
            }

            //Options object may be omitted.
            if(!listener) {
                listener = elements;
                elements = options;
                options = {};
            }

            if(!elements) {
                throw new Error("At least one element required.");
            }

            if(!listener) {
                throw new Error("Listener required.");
            }

            if (isElement(elements)) {
                // A single element has been passed in.
                elements = [elements];
            } else if (isCollection(elements)) {
                // Convert collection to array for plugins.
                // TODO: May want to check so that all the elements in the collection are valid elements.
                elements = toArray(elements);
            } else {
                return reporter$1.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
            }

            var elementsReady = 0;

            var callOnAdd = getOption(options, "callOnAdd", globalOptions.callOnAdd);
            var onReadyCallback = getOption(options, "onReady", function noop() {});
            var debug = getOption(options, "debug", globalOptions.debug);

            forEach$1(elements, function attachListenerToElement(element) {
                if (!stateHandler.getState(element)) {
                    stateHandler.initState(element);
                    idHandler$1.set(element);
                }

                var id = idHandler$1.get(element);

                debug && reporter$1.log("Attaching listener to element", id, element);

                if(!elementUtils$1.isDetectable(element)) {
                    debug && reporter$1.log(id, "Not detectable.");
                    if(elementUtils$1.isBusy(element)) {
                        debug && reporter$1.log(id, "System busy making it detectable");

                        //The element is being prepared to be detectable. Do not make it detectable.
                        //Just add the listener, because the element will soon be detectable.
                        addListener(callOnAdd, element, listener);
                        onReadyCallbacks[id] = onReadyCallbacks[id] || [];
                        onReadyCallbacks[id].push(function onReady() {
                            elementsReady++;

                            if(elementsReady === elements.length) {
                                onReadyCallback();
                            }
                        });
                        return;
                    }

                    debug && reporter$1.log(id, "Making detectable...");
                    //The element is not prepared to be detectable, so do prepare it and add a listener to it.
                    elementUtils$1.markBusy(element, true);
                    return detectionStrategy.makeDetectable({ debug: debug, important: importantCssRules }, element, function onElementDetectable(element) {
                        debug && reporter$1.log(id, "onElementDetectable");

                        if (stateHandler.getState(element)) {
                            elementUtils$1.markAsDetectable(element);
                            elementUtils$1.markBusy(element, false);
                            detectionStrategy.addListener(element, onResizeCallback);
                            addListener(callOnAdd, element, listener);

                            // Since the element size might have changed since the call to "listenTo", we need to check for this change,
                            // so that a resize event may be emitted.
                            // Having the startSize object is optional (since it does not make sense in some cases such as unrendered elements), so check for its existance before.
                            // Also, check the state existance before since the element may have been uninstalled in the installation process.
                            var state = stateHandler.getState(element);
                            if (state && state.startSize) {
                                var width = element.offsetWidth;
                                var height = element.offsetHeight;
                                if (state.startSize.width !== width || state.startSize.height !== height) {
                                    onResizeCallback(element);
                                }
                            }

                            if(onReadyCallbacks[id]) {
                                forEach$1(onReadyCallbacks[id], function(callback) {
                                    callback();
                                });
                            }
                        } else {
                            // The element has been unisntalled before being detectable.
                            debug && reporter$1.log(id, "Element uninstalled before being detectable.");
                        }

                        delete onReadyCallbacks[id];

                        elementsReady++;
                        if(elementsReady === elements.length) {
                            onReadyCallback();
                        }
                    });
                }

                debug && reporter$1.log(id, "Already detecable, adding listener.");

                //The element has been prepared to be detectable and is ready to be listened to.
                addListener(callOnAdd, element, listener);
                elementsReady++;
            });

            if(elementsReady === elements.length) {
                onReadyCallback();
            }
        }

        function uninstall(elements) {
            if(!elements) {
                return reporter$1.error("At least one element is required.");
            }

            if (isElement(elements)) {
                // A single element has been passed in.
                elements = [elements];
            } else if (isCollection(elements)) {
                // Convert collection to array for plugins.
                // TODO: May want to check so that all the elements in the collection are valid elements.
                elements = toArray(elements);
            } else {
                return reporter$1.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
            }

            forEach$1(elements, function (element) {
                eventListenerHandler.removeAllListeners(element);
                detectionStrategy.uninstall(element);
                stateHandler.cleanState(element);
            });
        }

        function initDocument(targetDocument) {
            detectionStrategy.initDocument && detectionStrategy.initDocument(targetDocument);
        }

        return {
            listenTo: listenTo,
            removeListener: eventListenerHandler.removeListener,
            removeAllListeners: eventListenerHandler.removeAllListeners,
            uninstall: uninstall,
            initDocument: initDocument
        };
    };

    function getOption(options, name, defaultValue) {
        var value = options[name];

        if((value === undefined || value === null) && defaultValue !== undefined) {
            return defaultValue;
        }

        return value;
    }

    var erd = elementResizeDetector({ strategy: "scroll" });
    function watchResize(element, handler) {
        erd.listenTo(element, handler);
        var currentHandler = handler;
        return {
            update: function (newHandler) {
                erd.removeListener(element, currentHandler);
                erd.listenTo(element, newHandler);
                currentHandler = newHandler;
            },
            destroy: function () {
                erd.removeListener(element, currentHandler);
            },
        };
    }

    /* src\App.svelte generated by Svelte v3.25.0 */

    const { console: console_1 } = globals;
    const file$4 = "src\\App.svelte";

    // (94:1) {:else}
    function create_else_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (img.src !== (img_src_value = "/images/up.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "open-footer");
    			attr_dev(img, "class", "svelte-1xxrcdr");
    			add_location(img, file$4, 95, 2, 2312);
    			attr_dev(div, "class", "button-footer svelte-1xxrcdr");
    			add_location(div, file$4, 94, 1, 2241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*openFooter*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(94:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (92:1) {#if ((showFooter===true)||(openf===true) )}
    function create_if_block$1(ctx) {
    	let footer;
    	let current;
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(92:1) {#if ((showFooter===true)||(openf===true) )}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let nav;
    	let updating_modalMenu;
    	let updating_hideMenu;
    	let t0;
    	let social;
    	let t1;
    	let about;
    	let updating_skillsEl;
    	let updating_whoEl;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let watchResize_action;
    	let current;
    	let mounted;
    	let dispose;

    	function nav_modalMenu_binding(value) {
    		/*nav_modalMenu_binding*/ ctx[8].call(null, value);
    	}

    	function nav_hideMenu_binding(value) {
    		/*nav_hideMenu_binding*/ ctx[9].call(null, value);
    	}

    	let nav_props = {};

    	if (/*modalMenu*/ ctx[3] !== void 0) {
    		nav_props.modalMenu = /*modalMenu*/ ctx[3];
    	}

    	if (/*hideMenu*/ ctx[2] !== void 0) {
    		nav_props.hideMenu = /*hideMenu*/ ctx[2];
    	}

    	nav = new Nav({ props: nav_props, $$inline: true });
    	binding_callbacks.push(() => bind(nav, "modalMenu", nav_modalMenu_binding));
    	binding_callbacks.push(() => bind(nav, "hideMenu", nav_hideMenu_binding));
    	social = new Social({ $$inline: true });

    	function about_skillsEl_binding(value) {
    		/*about_skillsEl_binding*/ ctx[10].call(null, value);
    	}

    	function about_whoEl_binding(value) {
    		/*about_whoEl_binding*/ ctx[11].call(null, value);
    	}

    	let about_props = {};

    	if (/*skillsEl*/ ctx[4] !== void 0) {
    		about_props.skillsEl = /*skillsEl*/ ctx[4];
    	}

    	if (/*whoEl*/ ctx[5] !== void 0) {
    		about_props.whoEl = /*whoEl*/ ctx[5];
    	}

    	about = new About({ props: about_props, $$inline: true });
    	binding_callbacks.push(() => bind(about, "skillsEl", about_skillsEl_binding));
    	binding_callbacks.push(() => bind(about, "whoEl", about_whoEl_binding));
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*showFooter*/ ctx[0] === true || /*openf*/ ctx[1] === true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(social.$$.fragment);
    			t1 = space();
    			create_component(about.$$.fragment);
    			t2 = space();
    			if_block.c();
    			attr_dev(main, "class", "svelte-1xxrcdr");
    			add_location(main, file$4, 87, 0, 1984);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav, main, null);
    			append_dev(main, t0);
    			mount_component(social, main, null);
    			append_dev(main, t1);
    			mount_component(about, main, null);
    			append_dev(main, t2);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(watchResize_action = watchResize.call(null, main, /*resize*/ ctx[6]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const nav_changes = {};

    			if (!updating_modalMenu && dirty & /*modalMenu*/ 8) {
    				updating_modalMenu = true;
    				nav_changes.modalMenu = /*modalMenu*/ ctx[3];
    				add_flush_callback(() => updating_modalMenu = false);
    			}

    			if (!updating_hideMenu && dirty & /*hideMenu*/ 4) {
    				updating_hideMenu = true;
    				nav_changes.hideMenu = /*hideMenu*/ ctx[2];
    				add_flush_callback(() => updating_hideMenu = false);
    			}

    			nav.$set(nav_changes);
    			const about_changes = {};

    			if (!updating_skillsEl && dirty & /*skillsEl*/ 16) {
    				updating_skillsEl = true;
    				about_changes.skillsEl = /*skillsEl*/ ctx[4];
    				add_flush_callback(() => updating_skillsEl = false);
    			}

    			if (!updating_whoEl && dirty & /*whoEl*/ 32) {
    				updating_whoEl = true;
    				about_changes.whoEl = /*whoEl*/ ctx[5];
    				add_flush_callback(() => updating_whoEl = false);
    			}

    			about.$set(about_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(social.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(social.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			destroy_component(social);
    			destroy_component(about);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	var showFooter = false;
    	let openf = false;
    	let reso;
    	let hideMenu;
    	let modalMenu;

    	onMount(() => {
    		window.addEventListener("mousemove", handleClickOutside);
    		console.dir(modalMenu);
    		$$invalidate(2, hideMenu = true);
    	});

    	const resize = () => {
    		reso = window.innerWidth;

    		if (reso <= 640) {
    			$$invalidate(0, showFooter = true);
    		}

    		if (reso > 640) {
    			$$invalidate(0, showFooter = false);
    		}
    	};

    	let skillsEl;
    	let whoEl;

    	// const handleTouchMove = (e)=>{
    	// let touchLocation = e.targetTouches[0];
    	// console.log(touchLocation);
    	// let pageX = Math.floor((touchLocation.screenX-touchLocation.target.offsetWidth)) + "px";
    	// let pageY = Math.floor((touchLocation.screenY-touchLocation.target.offsetHeight)) + "px";
    	// console.log("pagex: "+pageX);
    	// console.log("pagey: "+pageY);
    	//    let x =pageX;
    	//    let y =pageY;
    	//  	skillsEl.style.setProperty('--x', x + 'px');
    	//  	  skillsEl.style.setProperty('--y', y + 'px');
    	//  	whoEl.style.setProperty('--x', x + 'px');
    	//  	  whoEl.style.setProperty('--y', y + 'px');
    	// }
    	const openFooter = () => {
    		if (reso > 640) {
    			$$invalidate(1, openf = !openf);
    		}
    	};

    	setContext("showingFooter", openFooter);

    	const handleClickOutside = event => {
    		// console.table(modalMenu);
    		if (hideMenu === false) {
    			let x = parseInt(event.clientX);
    			let y = parseInt(event.clientY);
    			console.log("x: " + x, " y: " + y);
    			let modalx = parseInt(modalMenu.clientWidth);
    			let modaly = parseInt(modalMenu.clientHeight);
    			console.log("mx: " + modalx + " my: " + modaly);

    			if (x > modalx || y > modaly) {
    				$$invalidate(2, hideMenu = true);
    				console.log("hide modal menu...");
    			} else {
    				console.log("dont hide menu...");
    			}
    		} // document.removeEventListener("mousedown", handleClickOutside);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function nav_modalMenu_binding(value) {
    		modalMenu = value;
    		$$invalidate(3, modalMenu);
    	}

    	function nav_hideMenu_binding(value) {
    		hideMenu = value;
    		$$invalidate(2, hideMenu);
    	}

    	function about_skillsEl_binding(value) {
    		skillsEl = value;
    		$$invalidate(4, skillsEl);
    	}

    	function about_whoEl_binding(value) {
    		whoEl = value;
    		$$invalidate(5, whoEl);
    	}

    	$$self.$capture_state = () => ({
    		About,
    		Nav,
    		Footer,
    		Social,
    		onMount,
    		setContext,
    		fade,
    		watchResize,
    		showFooter,
    		openf,
    		reso,
    		hideMenu,
    		modalMenu,
    		resize,
    		skillsEl,
    		whoEl,
    		openFooter,
    		handleClickOutside
    	});

    	$$self.$inject_state = $$props => {
    		if ("showFooter" in $$props) $$invalidate(0, showFooter = $$props.showFooter);
    		if ("openf" in $$props) $$invalidate(1, openf = $$props.openf);
    		if ("reso" in $$props) reso = $$props.reso;
    		if ("hideMenu" in $$props) $$invalidate(2, hideMenu = $$props.hideMenu);
    		if ("modalMenu" in $$props) $$invalidate(3, modalMenu = $$props.modalMenu);
    		if ("skillsEl" in $$props) $$invalidate(4, skillsEl = $$props.skillsEl);
    		if ("whoEl" in $$props) $$invalidate(5, whoEl = $$props.whoEl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showFooter,
    		openf,
    		hideMenu,
    		modalMenu,
    		skillsEl,
    		whoEl,
    		resize,
    		openFooter,
    		nav_modalMenu_binding,
    		nav_hideMenu_binding,
    		about_skillsEl_binding,
    		about_whoEl_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
