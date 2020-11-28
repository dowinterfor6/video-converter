
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
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
            if (running_program || pending_program) {
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.30.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const demuxingFormats = [
      "3dotstr",
      "4xm",
      "aa",
      "aac",
      "ac3",
      "acm",
      "act",
      "adf",
      "adp",
      "ads",
      "adx",
      "aea",
      "afc",
      "aiff",
      "aix",
      "alaw",
      "alias_pix",
      "alp",
      "amr",
      "amrnb",
      "amrwb",
      "anm",
      "apc",
      "ape",
      "apm",
      "apng",
      "aptx",
      "aptx_hd",
      "aqtitle",
      "argo_asf",
      "asf",
      "asf_o",
      "ass",
      "ast",
      "au",
      "av1",
      "avi",
      "avr",
      "avs",
      "avs2",
      "bethsoftvid",
      "bfi",
      "bfstm",
      "bin",
      "bink",
      "bit",
      "bmp_pipe",
      "bmv",
      "boa",
      "brender_pix",
      "brstm",
      "c93",
      "caf",
      "cavsvideo",
      "cdg",
      "cdx1",
      "cine",
      "codec2",
      "codec2raw",
      "concat",
      "data",
      "daud",
      "dcstr",
      "dds_pipe",
      "defg",
      "dfa",
      "dhav",
      "dirac",
      "dnxhd",
      "dpx_pipe",
      "dsf",
      "dsicin",
      "dss",
      "dts",
      "dtshd",
      "dv",
      "dvbsub",
      "dvbtxt",
      "dxa",
      "ea",
      "ea_cdata",
      "eac3",
      "epaf",
      "exr_pipe",
      "f32be",
      "f32le",
      "f64be",
      "f64le",
      "ffmetadata",
      "film_cpk",
      "filmstrip",
      "fits",
      "flac",
      "flic",
      "flv",
      "frm",
      "fsb",
      "fwse",
      "g722",
      "g723_1",
      "g726",
      "g7261e",
      "g729",
      "gdv",
      "genh",
      "gif",
      "gif_pipe",
      "gsm",
      "gxf",
      "h261",
      "h263",
      "h264",
      "hca",
      "hcom",
      "hevc",
      "hls",
      "hnm",
      "ico",
      "idcin",
      "idf",
      "iff",
      "ifv",
      "ilbc",
      "image2",
      "image2pipe",
      "ingenient",
      "ipmovie",
      "ircam",
      "iss",
      "iv8",
      "ivf",
      "ivr",
      "j2k_pipe",
      "jacosub",
      "jpeg_pipe",
      "jpegls_pipe",
      "jv",
      "kux",
      "kvag",
      "lavfi",
      "live_flv",
      "lmlm4",
      "loas",
      "lrc",
      "lvf",
      "lxv",
      "m4v",
      "mkv",
      "webm",
      "mgsts",
      "microdvd",
      "mjpeg",
      "mjpeg_2000",
      "mlp",
      "mlv",
      "mm",
      "mmf",
      "mov",
      "mp4",
      "m4a",
      "3gp",
      "3g2",
      "mj2",
      "mp3",
      "mpc",
      "mpc8",
      "mpeg",
      "mpegts",
      "mpegtsraw",
      "mpegvideo",
      "mpjpeg",
      "mp12",
      "mpsub",
      "msf",
      "msnwctcp",
      "mtaf",
      "mtv",
      "mulaw",
      "musx",
      "mv",
      "mvi",
      "mxf",
      "mxg",
      "nc",
      "nistsphere",
      "nsp",
      "nsv",
      "nut",
      "nuv",
      "ogg",
      "oma",
      "paf",
      "pam_pipe",
      "pbm_pipe",
      "pcx_pipe",
      "pbm_pipe",
      "pgmyuv_pipe",
      "pictor_pipe",
      "pjs",
      "pmp",
      "png_pipe",
      "pp_bnk",
      "ppm_pipe",
      "psd_pipe",
      "psxstr",
      "pva",
      "pvf",
      "qcp",
      "qdraw_pipe",
      "r2d",
      "rawvideo",
      "realtext",
      "redspark",
      "rl2",
      "rm",
      "roq",
      "rpl",
      "rsd",
      "rso",
      "rtp",
      "rtsp",
      "s16be",
      "s16le",
      "s24be",
      "s24le",
      "s32be",
      "s32le",
      "s337m",
      "s8",
      "sami",
      "sap",
      "sbc",
      "sbg",
      "scc",
      "sdp",
      "sdr2",
      "sds",
      "sdx",
      "ser",
      "sgi_pipe",
      "shn",
      "siff",
      "sln",
      "smjpeg",
      "smk",
      "smush",
      "sol",
      "sox",
      "spdif",
      "srt",
      "stl",
      "subviewer",
      "subviewer1",
      "sunrast_pipe",
      "sup",
      "svag",
      "svg_pipe",
      "swf",
      "tak",
      "tedcaptions",
      "thp",
      "tiertexseq",
      "tiff_pipe",
      "tmv",
      "truehd",
      "tta",
      "tty",
      "txd",
      "ty",
      "u16be",
      "u16le",
      "u24be",
      "u24le",
      "u32be",
      "u32le",
      "u8",
      "v210",
      "v210x",
      "vag",
      "vc1",
      "vc1test",
      "vidc",
      "vividas",
      "vivo",
      "vmd",
      "vobsub",
      "voc",
      "vpk",
      "vplayer",
      "vqf",
      "w64",
      "wav",
      "wc3movie",
      "webm_dash_manifest",
      "webp_pipe",
      "webvtt",
      "wsaud",
      "wsd",
      "wsvqa",
      "wtv",
      "wv",
      "wve",
      "xa",
      "xbin",
      "xmv",
      "xpm_pipe",
      "xvag",
      "xwd_pipe",
      "xwma",
      "yop",
      "yuv4mpegpipe"
    ];

    const muxingFormats = [
      "3g2",
      "3gp",
      "a64",
      "ac3",
      "adts",
      "adx",
      "aiff",
      "alaw",
      "amr",
      "apng",
      "aptx",
      "aptx_hd",
      "asf",
      "asf_stream",
      "ass",
      "ast",
      "au",
      "avi",
      "avm2",
      "avs2",
      "bit",
      "caf",
      "cavsvideo",
      "codec2",
      "codec2raw",
      "crc",
      "dash",
      "data",
      "daud",
      "dirac",
      "dnxhd",
      "dts",
      "dv",
      "dvd",
      "eac3",
      "f32be",
      "f32le",
      "f4v",
      "f64be",
      "f64le",
      "ffmetadata",
      "fifo",
      "fifo_test",
      "film_cpk",
      "filmstrip",
      "fits",
      "flac",
      "flv",
      "framecrc",
      "framehash",
      "framemd5",
      "g722",
      "g723_1",
      "g726",
      "g726le",
      "gif",
      "gsm",
      "gxf",
      "h261",
      "h263",
      "h264",
      "hash",
      "hds",
      "hevc",
      "hls",
      "ico",
      "ilbc",
      "image2",
      "image2pipe",
      "ipod",
      "ircam",
      "ismv",
      "ivf",
      "jacosub",
      "kvag",
      "latm",
      "lrc",
      "m4v",
      "mkv",
      "md5",
      "microdvd",
      "mjpeg",
      "mkvtimestampe_v2",
      "mlp",
      "mmf",
      "mov",
      "mp2",
      "mp3",
      "mp4",
      "mpeg",
      "mpeg1video",
      "mpeg2video",
      "mpegts",
      "mpjpeg",
      "mulaw",
      "mxf",
      "mxf_d10",
      "mxf_opatom",
      "null",
      "nut",
      "oga",
      "ogg",
      "ogv",
      "oma",
      "opus",
      "psp",
      "rawvideo",
      "rm",
      "roq",
      "rso",
      "rtp",
      "rtp_mpegts",
      "rtsp",
      "s16be",
      "s16le",
      "s24be",
      "s24le",
      "s32be",
      "s32le",
      "s8",
      "sap",
      "sbc",
      "scc",
      "segment",
      "singlejpeg",
      "smjpeg",
      "smoothstreaming",
      "sox",
      "spdif",
      "spx",
      "srt",
      "stream_segment",
      "ssegment",
      "streamhash",
      "sup",
      "svcd",
      "swf",
      "tee",
      "truehd",
      "tta",
      "u16be",
      "u16le",
      "u24be",
      "u24le",
      "u32be",
      "u32le",
      "u8",
      "uncodedframecrc",
      "vc1",
      "vc1test",
      "vcd",
      "vidc",
      "vob",
      "voc",
      "w64",
      "wav",
      "webm",
      "webm_chunk",
      "webm_dash_manifest",
      "webp",
      "webvtt",
      "wtv",
      "wv",
      "yuv4mpegpipe"
    ];

    /* src/Input.svelte generated by Svelte v3.30.0 */
    const file = "src/Input.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (90:10) {:else}
    function create_else_block(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Choose a video or drag it here";
    			add_location(span, file, 90, 12, 2239);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(90:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (88:10) {#if error}
    function create_if_block_1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*error*/ ctx[2]);
    			attr_dev(span, "class", "error-message svelte-1pbzo3a");
    			add_location(span, file, 88, 12, 2166);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 4) set_data_dev(t, /*error*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(88:10) {#if error}",
    		ctx
    	});

    	return block;
    }

    // (85:8) {#if videoName}
    function create_if_block(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*videoName*/ ctx[4]);
    			add_location(span, file, 85, 10, 2091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*videoName*/ 16) set_data_dev(t, /*videoName*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(85:8) {#if videoName}",
    		ctx
    	});

    	return block;
    }

    // (101:6) {#each commonFileFormats as format}
    function create_each_block_1(ctx) {
    	let option;
    	let t0;
    	let t1_value = /*format*/ ctx[19] + "";
    	let t1;
    	let t2;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(".");
    			t1 = text(t1_value);
    			t2 = space();
    			option.__value = option_value_value = /*format*/ ctx[19];
    			option.value = option.__value;
    			add_location(option, file, 101, 8, 2633);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    			append_dev(option, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(101:6) {#each commonFileFormats as format}",
    		ctx
    	});

    	return block;
    }

    // (107:6) {#each muxFormats as format}
    function create_each_block(ctx) {
    	let option;
    	let t0;
    	let t1_value = /*format*/ ctx[19] + "";
    	let t1;
    	let t2;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(".");
    			t1 = text(t1_value);
    			t2 = space();
    			option.__value = option_value_value = /*format*/ ctx[19];
    			option.value = option.__value;
    			add_location(option, file, 107, 8, 2798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    			append_dev(option, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(107:6) {#each muxFormats as format}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let section;
    	let div1;
    	let div0;
    	let input0;
    	let input0_accept_value;
    	let t0;
    	let label;
    	let div1_onanimationend_value;
    	let t1;
    	let div2;
    	let input1;
    	let input1_value_value;
    	let t2;
    	let select;
    	let option;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*videoName*/ ctx[4]) return create_if_block;
    		if (/*error*/ ctx[2]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value_1 = /*commonFileFormats*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*muxFormats*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			label = element("label");
    			if_block.c();
    			t1 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t2 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			option = element("option");
    			option.textContent = "Other formats";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input0, "id", "file-input");
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "accept", input0_accept_value = demuxingFormats.map(func).join(", "));
    			attr_dev(input0, "class", "svelte-1pbzo3a");
    			add_location(input0, file, 80, 6, 1875);
    			attr_dev(label, "for", "file-input");
    			attr_dev(label, "class", "svelte-1pbzo3a");
    			add_location(label, file, 81, 6, 2017);
    			attr_dev(div0, "class", "file-upload-wrapper svelte-1pbzo3a");
    			toggle_class(div0, "highlight", /*fileInputHover*/ ctx[1]);
    			add_location(div0, file, 72, 4, 1645);
    			attr_dev(div1, "class", "file-upload-container svelte-1pbzo3a");
    			attr_dev(div1, "onanimationend", div1_onanimationend_value = func_1);
    			toggle_class(div1, "animate__shakeX", /*error*/ ctx[2]);
    			add_location(div1, file, 71, 2, 1499);
    			attr_dev(input1, "class", "searchable-dropdown svelte-1pbzo3a");
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = `.${/*fileFormat*/ ctx[0]}`;
    			add_location(input1, file, 98, 4, 2388);
    			option.disabled = true;
    			option.__value = "Other formats";
    			option.value = option.__value;
    			add_location(option, file, 105, 6, 2715);
    			attr_dev(select, "class", "svelte-1pbzo3a");
    			add_location(select, file, 99, 4, 2498);
    			attr_dev(div2, "class", "dropdown-container svelte-1pbzo3a");
    			add_location(div2, file, 97, 2, 2351);
    			attr_dev(section, "class", "input-container svelte-1pbzo3a");
    			add_location(section, file, 70, 0, 1463);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t0);
    			append_dev(div0, label);
    			if_block.m(label, null);
    			append_dev(section, t1);
    			append_dev(section, div2);
    			append_dev(div2, input1);
    			append_dev(div2, t2);
    			append_dev(div2, select);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select, null);
    			}

    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			/*select_binding*/ ctx[14](select);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*handleFileInputChange*/ ctx[11], false, false, false),
    					listen_dev(div0, "dragenter", /*handleDragEnter*/ ctx[7], false, false, false),
    					listen_dev(div0, "dragleave", /*handleDragLeave*/ ctx[9], false, false, false),
    					listen_dev(div0, "dragover", /*handleDragOver*/ ctx[8], false, false, false),
    					listen_dev(div0, "drop", /*handleDragDrop*/ ctx[10], false, false, false),
    					listen_dev(input1, "change", /*handleDropdownSearch*/ ctx[12], false, false, false),
    					listen_dev(select, "change", /*change_handler*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(label, null);
    				}
    			}

    			if (dirty & /*fileInputHover*/ 2) {
    				toggle_class(div0, "highlight", /*fileInputHover*/ ctx[1]);
    			}

    			if (dirty & /*error*/ 4) {
    				toggle_class(div1, "animate__shakeX", /*error*/ ctx[2]);
    			}

    			if (dirty & /*fileFormat*/ 1 && input1_value_value !== (input1_value_value = `.${/*fileFormat*/ ctx[0]}`) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty & /*commonFileFormats*/ 32) {
    				each_value_1 = /*commonFileFormats*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select, option);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*muxFormats*/ 64) {
    				each_value = /*muxFormats*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_block.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			/*select_binding*/ ctx[14](null);
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

    const func = format => `.${format}`;
    const func_1 = e => e.currentTarget.classList.remove("animate__shakeX");

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Input", slots, []);
    	let { video } = $$props;
    	let { fileFormat } = $$props;
    	let fileInputHover = false;
    	let error = "";
    	let selectRef;
    	const commonFileFormats = ["mp4", "mov", "flv", "avi", "webm", "mkv", "gif", "mp3"];
    	const muxFormats = muxingFormats.filter(format => !commonFileFormats.includes(format));

    	const highlight = e => {
    		$$invalidate(1, fileInputHover = true);
    		e.preventDefault();
    		e.stopPropagation();
    	};

    	const unhighlight = e => {
    		$$invalidate(1, fileInputHover = false);
    		e.preventDefault();
    		e.stopPropagation();
    	};

    	const handleDragEnter = e => {
    		highlight(e);
    	};

    	const handleDragOver = e => {
    		highlight(e);
    	};

    	const handleDragLeave = e => {
    		unhighlight(e);
    	};

    	const handleDragDrop = e => {
    		unhighlight(e);
    		const data = e.dataTransfer;
    		const file = data.files?.item(0);
    		validateFile(file);
    	};

    	const handleFileInputChange = e => {
    		const file = e.currentTarget.files?.item(0);
    		validateFile(file);
    	};

    	const validateFile = file => {
    		if (!file) return;

    		if (file.type.split("/")[0] !== "video") {
    			$$invalidate(2, error = "Error: Invalid file type");
    		} else if (file.size / 1024 / 1024 / 1024 >= 2) {
    			$$invalidate(2, error = "Error: File exceeded 2gb size limit");
    		} else {
    			$$invalidate(2, error = "");
    			$$invalidate(13, video = file);
    		}
    	};

    	const handleDropdownSearch = () => {
    		selectRef.focus();
    	};

    	const writable_props = ["video", "fileFormat"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function select_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			selectRef = $$value;
    			$$invalidate(3, selectRef);
    			$$invalidate(6, muxFormats);
    			$$invalidate(5, commonFileFormats);
    		});
    	}

    	const change_handler = e => $$invalidate(0, fileFormat = e.currentTarget.value);

    	$$self.$$set = $$props => {
    		if ("video" in $$props) $$invalidate(13, video = $$props.video);
    		if ("fileFormat" in $$props) $$invalidate(0, fileFormat = $$props.fileFormat);
    	};

    	$$self.$capture_state = () => ({
    		video,
    		fileFormat,
    		demuxingFormats,
    		muxingFormats,
    		fileInputHover,
    		error,
    		selectRef,
    		commonFileFormats,
    		muxFormats,
    		highlight,
    		unhighlight,
    		handleDragEnter,
    		handleDragOver,
    		handleDragLeave,
    		handleDragDrop,
    		handleFileInputChange,
    		validateFile,
    		handleDropdownSearch,
    		videoName
    	});

    	$$self.$inject_state = $$props => {
    		if ("video" in $$props) $$invalidate(13, video = $$props.video);
    		if ("fileFormat" in $$props) $$invalidate(0, fileFormat = $$props.fileFormat);
    		if ("fileInputHover" in $$props) $$invalidate(1, fileInputHover = $$props.fileInputHover);
    		if ("error" in $$props) $$invalidate(2, error = $$props.error);
    		if ("selectRef" in $$props) $$invalidate(3, selectRef = $$props.selectRef);
    		if ("videoName" in $$props) $$invalidate(4, videoName = $$props.videoName);
    	};

    	let videoName;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*video*/ 8192) {
    			 $$invalidate(4, videoName = video?.name);
    		}
    	};

    	return [
    		fileFormat,
    		fileInputHover,
    		error,
    		selectRef,
    		videoName,
    		commonFileFormats,
    		muxFormats,
    		handleDragEnter,
    		handleDragOver,
    		handleDragLeave,
    		handleDragDrop,
    		handleFileInputChange,
    		handleDropdownSearch,
    		video,
    		select_binding,
    		change_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { video: 13, fileFormat: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*video*/ ctx[13] === undefined && !("video" in props)) {
    			console.warn("<Input> was created without expected prop 'video'");
    		}

    		if (/*fileFormat*/ ctx[0] === undefined && !("fileFormat" in props)) {
    			console.warn("<Input> was created without expected prop 'fileFormat'");
    		}
    	}

    	get video() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set video(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fileFormat() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileFormat(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

    var runtime_1 = createCommonjsModule(function (module) {
    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var runtime = (function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.
      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }
      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);

        // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.
        generator._invoke = makeInvokeMethod(innerFn, self, context);

        return generator;
      }
      exports.wrap = wrap;

      // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.
      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed";

      // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.
      var ContinueSentinel = {};

      // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.
      function Generator() {}
      function GeneratorFunction() {}
      function GeneratorFunctionPrototype() {}

      // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.
      var IteratorPrototype = {};
      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };

      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
      if (NativeIteratorPrototype &&
          NativeIteratorPrototype !== Op &&
          hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype =
        Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunction.displayName = define(
        GeneratorFunctionPrototype,
        toStringTagSymbol,
        "GeneratorFunction"
      );

      // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function(method) {
          define(prototype, method, function(arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor
          ? ctor === GeneratorFunction ||
            // For the native GeneratorFunction constructor, the best we can
            // do is to check its .name property.
            (ctor.displayName || ctor.name) === "GeneratorFunction"
          : false;
      };

      exports.mark = function(genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
      };

      // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.
      exports.awrap = function(arg) {
        return { __await: arg };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;
            if (value &&
                typeof value === "object" &&
                hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function(value) {
                invoke("next", value, resolve, reject);
              }, function(err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function(unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function(error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function(resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise =
            // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(
              callInvokeWithMethodAndArg,
              // Avoid propagating failures to Promises returned by later
              // invocations of the iterator.
              callInvokeWithMethodAndArg
            ) : callInvokeWithMethodAndArg();
        }

        // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).
        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);
      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };
      exports.AsyncIterator = AsyncIterator;

      // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.
      exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;

        var iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList),
          PromiseImpl
        );

        return exports.isGeneratorFunction(outerFn)
          ? iter // If outerFn is a generator, return the full iterator.
          : iter.next().then(function(result) {
              return result.done ? result.value : iter.next();
            });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;

        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            }

            // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;
            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);
              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;

            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);

            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;

            var record = tryCatch(innerFn, self, context);
            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done
                ? GenStateCompleted
                : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };

            } else if (record.type === "throw") {
              state = GenStateCompleted;
              // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.
              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      }

      // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.
      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];
        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError(
              "The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (! info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value;

          // Resume execution at the desired location (see delegateYield).
          context.next = delegate.nextLoc;

          // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.
          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }

        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        }

        // The delegate iterator is finished, so forget it and continue with
        // the outer generator.
        context.delegate = null;
        return ContinueSentinel;
      }

      // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.
      defineIteratorMethods(Gp);

      define(Gp, toStringTagSymbol, "Generator");

      // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.
      Gp[iteratorSymbol] = function() {
        return this;
      };

      Gp.toString = function() {
        return "[object Generator]";
      };

      function pushTryEntry(locs) {
        var entry = { tryLoc: locs[0] };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function(object) {
        var keys = [];
        for (var key in object) {
          keys.push(key);
        }
        keys.reverse();

        // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.
        return function next() {
          while (keys.length) {
            var key = keys.pop();
            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          }

          // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.
          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];
          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1, next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;

              return next;
            };

            return next.next = next;
          }
        }

        // Return an iterator with no values.
        return { next: doneResult };
      }
      exports.values = values;

      function doneResult() {
        return { value: undefined$1, done: true };
      }

      Context.prototype = {
        constructor: Context,

        reset: function(skipTempReset) {
          this.prev = 0;
          this.next = 0;
          // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.
          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;

          this.method = "next";
          this.arg = undefined$1;

          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" &&
                  hasOwn.call(this, name) &&
                  !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },

        stop: function() {
          this.done = true;

          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },

        dispatchException: function(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !! caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }

              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }

              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }

              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },

        abrupt: function(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev &&
                hasOwn.call(entry, "finallyLoc") &&
                this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry &&
              (type === "break" ||
               type === "continue") &&
              finallyEntry.tryLoc <= arg &&
              arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },

        complete: function(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" ||
              record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },

        finish: function(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },

        "catch": function(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;
              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }
              return thrown;
            }
          }

          // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.
          throw new Error("illegal catch attempt");
        },

        delegateYield: function(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      };

      // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.
      return exports;

    }(
      // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
       module.exports 
    ));

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      Function("r", "regeneratorRuntime = r")(runtime);
    }
    });

    var config = {
      defaultArgs: [
        /* args[0] is always the binary path */
        './ffmpeg',
        /* Disable interaction mode */
        '-nostdin',
        /* Force to override output file */
        '-y',
      ],
      baseOptions: {
        /* Flag to turn on/off log messages in console */
        log: false,
        /*
         * Custom logger to get ffmpeg.wasm output messages.
         * a sample logger looks like this:
         *
         * ```
         * logger = ({ type, message }) => {
         *   console.log(type, message);
         * }
         * ```
         *
         * type can be one of following:
         *
         * info: internal workflow debug messages
         * fferr: ffmpeg native stderr output
         * ffout: ffmpeg native stdout output
         */
        logger: () => {},
        /*
         * Progress handler to get current progress of ffmpeg command.
         * a sample progress handler looks like this:
         *
         * ```
         * progress = ({ ratio }) => {
         *   console.log(ratio);
         * }
         * ```
         *
         * ratio is a float number between 0 to 1.
         */
        progress: () => {},
        /*
         * Path to find/download ffmpeg.wasm-core,
         * this value should be overwriten by `defaultOptions` in
         * each environment.
         */
        corePath: '',
      },
    };

    let logging = false;
    let customLogger = () => {};

    const setLogging = (_logging) => {
      logging = _logging;
    };

    const setCustomLogger = (logger) => {
      customLogger = logger;
    };

    const log = (type, message) => {
      customLogger({ type, message });
      if (logging) {
        console.log(`[${type}] ${message}`);
      }
    };

    var log_1 = {
      logging,
      setLogging,
      setCustomLogger,
      log,
    };

    let duration = 0;

    const ts2sec = (ts) => {
      const [h, m, s] = ts.split(':');
      return (parseFloat(h) * 60 * 60) + (parseFloat(m) * 60) + parseFloat(s);
    };

    var parseProgress = (message, progress) => {
      if (typeof message === 'string') {
        if (message.startsWith('  Duration')) {
          const ts = message.split(', ')[0].split(': ')[1];
          const d = ts2sec(ts);
          if (duration === 0 || duration > d) {
            duration = d;
          }
        } else if (message.startsWith('frame')) {
          const ts = message.split('time=')[1].split(' ')[0];
          const t = ts2sec(ts);
          progress({ ratio: t / duration });
        } else if (message.startsWith('video:')) {
          progress({ ratio: 1 });
          duration = 0;
        }
      }
    };

    var parseArgs = (Core, args) => {
      const argsPtr = Core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
      args.forEach((s, idx) => {
        const buf = Core._malloc(s.length + 1);
        Core.writeAsciiToMemory(s, buf);
        Core.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');
      });
      return [args.length, argsPtr];
    };

    var resolveUrl = createCommonjsModule(function (module, exports) {
    // Copyright 2014 Simon Lydell
    // X11 (“MIT”) Licensed. (See LICENSE.)

    void (function(root, factory) {
      {
        module.exports = factory();
      }
    }(commonjsGlobal, function() {

      function resolveUrl(/* ...urls */) {
        var numUrls = arguments.length;

        if (numUrls === 0) {
          throw new Error("resolveUrl requires at least one argument; got none.")
        }

        var base = document.createElement("base");
        base.href = arguments[0];

        if (numUrls === 1) {
          return base.href
        }

        var head = document.getElementsByTagName("head")[0];
        head.insertBefore(base, head.firstChild);

        var a = document.createElement("a");
        var resolved;

        for (var index = 1; index < numUrls; index++) {
          a.href = arguments[index];
          resolved = a.href;
          base.href = resolved;
        }

        head.removeChild(base);

        return resolved
      }

      return resolveUrl

    }));
    });

    var _from = "@ffmpeg/ffmpeg";
    var _id = "@ffmpeg/ffmpeg@0.9.6";
    var _inBundle = false;
    var _integrity = "sha512-ov5FAV3dHRJ/+ZxQH9V5GvY/iczwq5vrKWeu4tpytxZewTSAhZ1aKD/sFBzd79nQNF+CTktxUp3LWuGECXBNeA==";
    var _location = "/@ffmpeg/ffmpeg";
    var _phantomChildren = {
    };
    var _requested = {
    	type: "tag",
    	registry: true,
    	raw: "@ffmpeg/ffmpeg",
    	name: "@ffmpeg/ffmpeg",
    	escapedName: "@ffmpeg%2fffmpeg",
    	scope: "@ffmpeg",
    	rawSpec: "",
    	saveSpec: null,
    	fetchSpec: "latest"
    };
    var _requiredBy = [
    	"#USER",
    	"/"
    ];
    var _resolved = "https://registry.npmjs.org/@ffmpeg/ffmpeg/-/ffmpeg-0.9.6.tgz";
    var _shasum = "b44fa1ab34dd860785bb7c317dbfbe8b9ded7036";
    var _spec = "@ffmpeg/ffmpeg";
    var _where = "/home/dowinterfor6/linux_documents/video-converter";
    var author = {
    	name: "Jerome Wu",
    	email: "jeromewus@gmail.com"
    };
    var browser = {
    	"./src/node/index.js": "./src/browser/index.js"
    };
    var bugs = {
    	url: "https://github.com/ffmpegwasm/ffmpeg.wasm/issues"
    };
    var bundleDependencies = false;
    var dependencies = {
    	"is-url": "^1.2.4",
    	"node-fetch": "^2.6.1",
    	"regenerator-runtime": "^0.13.7",
    	"resolve-url": "^0.2.1"
    };
    var deprecated = false;
    var description = "FFmpeg WebAssembly version";
    var devDependencies = {
    	"@babel/core": "^7.12.3",
    	"@babel/preset-env": "^7.12.1",
    	"@ffmpeg/core": "^0.8.5",
    	"@types/emscripten": "^1.39.4",
    	"babel-loader": "^8.1.0",
    	chai: "^4.2.0",
    	cors: "^2.8.5",
    	eslint: "^7.12.1",
    	"eslint-config-airbnb-base": "^14.1.0",
    	"eslint-plugin-import": "^2.22.1",
    	express: "^4.17.1",
    	mocha: "^8.2.1",
    	"mocha-headless-chrome": "^2.0.3",
    	"npm-run-all": "^4.1.5",
    	"wait-on": "^5.2.0",
    	webpack: "^5.3.2",
    	"webpack-cli": "^4.1.0",
    	"webpack-dev-middleware": "^4.0.0"
    };
    var directories = {
    	example: "examples"
    };
    var engines = {
    	node: ">=12.16.1"
    };
    var homepage = "https://github.com/ffmpegwasm/ffmpeg.wasm#readme";
    var keywords = [
    	"ffmpeg",
    	"WebAssembly",
    	"video"
    ];
    var license = "MIT";
    var main = "src/index.js";
    var name = "@ffmpeg/ffmpeg";
    var repository = {
    	type: "git",
    	url: "git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"
    };
    var scripts = {
    	build: "rimraf dist && webpack --config scripts/webpack.config.prod.js",
    	lint: "eslint src",
    	prepublishOnly: "npm run build",
    	start: "node scripts/server.js",
    	test: "npm-run-all -p -r start test:all",
    	"test:all": "npm-run-all wait test:browser:ffmpeg test:node:all",
    	"test:browser": "mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000",
    	"test:browser:ffmpeg": "npm run test:browser -- -f ./tests/ffmpeg.test.html",
    	"test:node": "node --experimental-wasm-threads --experimental-wasm-bulk-memory node_modules/.bin/_mocha --exit --bail --require ./scripts/test-helper.js",
    	"test:node:all": "npm run test:node -- ./tests/*.test.js",
    	wait: "rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js"
    };
    var types = "src/index.d.ts";
    var version = "0.9.6";
    var require$$3 = {
    	_from: _from,
    	_id: _id,
    	_inBundle: _inBundle,
    	_integrity: _integrity,
    	_location: _location,
    	_phantomChildren: _phantomChildren,
    	_requested: _requested,
    	_requiredBy: _requiredBy,
    	_resolved: _resolved,
    	_shasum: _shasum,
    	_spec: _spec,
    	_where: _where,
    	author: author,
    	browser: browser,
    	bugs: bugs,
    	bundleDependencies: bundleDependencies,
    	dependencies: dependencies,
    	deprecated: deprecated,
    	description: description,
    	devDependencies: devDependencies,
    	directories: directories,
    	engines: engines,
    	homepage: homepage,
    	keywords: keywords,
    	license: license,
    	main: main,
    	name: name,
    	repository: repository,
    	scripts: scripts,
    	types: types,
    	version: version
    };

    const { devDependencies: devDependencies$1 } = require$$3;

    /*
     * Default options for browser environment
     */
    var defaultOptions = {
      corePath: (typeof process !== 'undefined' && process.env.FFMPEG_ENV === 'development')
        ? resolveUrl('/node_modules/@ffmpeg/core/dist/ffmpeg-core.js')
        : `https://unpkg.com/@ffmpeg/core@${devDependencies$1['@ffmpeg/core'].substring(1)}/dist/ffmpeg-core.js`,
    };

    /* eslint-disable no-undef */

    const { log: log$1 } = log_1;

    /*
     * Fetch data from remote URL and convert to blob URL
     * to avoid CORS issue
     */
    const toBlobURL = async (url, mimeType) => {
      log$1('info', `fetch ${url}`);
      const buf = await (await fetch(url)).arrayBuffer();
      log$1('info', `${url} file size = ${buf.byteLength} bytes`);
      const blob = new Blob([buf], { type: mimeType });
      const blobURL = URL.createObjectURL(blob);
      log$1('info', `${url} blob URL = ${blobURL}`);
      return blobURL;
    };

    var getCreateFFmpegCore = async ({ corePath: _corePath }) => {
      if (typeof _corePath !== 'string') {
        throw Error('corePath should be a string!');
      }
      const coreRemotePath = resolveUrl(_corePath);
      const corePath = await toBlobURL(
        coreRemotePath,
        'application/javascript',
      );
      const wasmPath = await toBlobURL(
        coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.wasm'),
        'application/wasm',
      );
      const workerPath = await toBlobURL(
        coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.worker.js'),
        'application/javascript',
      );
      if (typeof createFFmpegCore === 'undefined') {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          const eventHandler = () => {
            script.removeEventListener('load', eventHandler);
            log$1('info', 'ffmpeg-core.js script loaded');
            resolve({
              createFFmpegCore,
              corePath,
              wasmPath,
              workerPath,
            });
          };
          script.src = corePath;
          script.type = 'text/javascript';
          script.addEventListener('load', eventHandler);
          document.getElementsByTagName('head')[0].appendChild(script);
        });
      }
      log$1('info', 'ffmpeg-core.js script is loaded already');
      return Promise.resolve({
        createFFmpegCore,
        corePath,
        wasmPath,
        workerPath,
      });
    };

    const readFromBlobOrFile = (blob) => (
      new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = ({ target: { error: { code } } }) => {
          reject(Error(`File could not be read! Code=${code}`));
        };
        fileReader.readAsArrayBuffer(blob);
      })
    );

    var fetchFile = async (_data) => {
      let data = _data;
      if (typeof _data === 'undefined') {
        return new Uint8Array();
      }

      if (typeof _data === 'string') {
        /* From base64 format */
        if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(_data)) {
          data = atob(_data.split(',')[1])
            .split('')
            .map((c) => c.charCodeAt(0));
        /* From remote server/URL */
        } else {
          const res = await fetch(resolveUrl(_data));
          data = await res.arrayBuffer();
        }
      /* From Blob or File */
      } else if (_data instanceof File || _data instanceof Blob) {
        data = await readFromBlobOrFile(_data);
      }

      return new Uint8Array(data);
    };

    var browser$1 = {
      defaultOptions,
      getCreateFFmpegCore,
      fetchFile,
    };

    const { defaultArgs, baseOptions } = config;
    const { setLogging: setLogging$1, setCustomLogger: setCustomLogger$1, log: log$2 } = log_1;


    const { defaultOptions: defaultOptions$1, getCreateFFmpegCore: getCreateFFmpegCore$1 } = browser$1;
    const { version: version$1 } = require$$3;

    const NO_LOAD = Error('ffmpeg.wasm is not ready, make sure you have completed load().');

    var createFFmpeg = (_options = {}) => {
      const {
        log: logging,
        logger,
        progress: optProgress,
        ...options
      } = {
        ...baseOptions,
        ...defaultOptions$1,
        ..._options,
      };
      let Core = null;
      let ffmpeg = null;
      let runResolve = null;
      let running = false;
      let progress = optProgress;
      const detectCompletion = (message) => {
        if (message === 'FFMPEG_END' && runResolve !== null) {
          runResolve();
          runResolve = null;
          running = false;
        }
      };
      const parseMessage = ({ type, message }) => {
        log$2(type, message);
        parseProgress(message, progress);
        detectCompletion(message);
      };

      /*
       * Load ffmpeg.wasm-core script.
       * In browser environment, the ffmpeg.wasm-core script is fetch from
       * CDN and can be assign to a local path by assigning `corePath`.
       * In node environment, we use dynamic require and the default `corePath`
       * is `$ffmpeg/core`.
       *
       * Typically the load() func might take few seconds to minutes to complete,
       * better to do it as early as possible.
       *
       */
      const load = async () => {
        log$2('info', 'load ffmpeg-core');
        if (Core === null) {
          log$2('info', 'loading ffmpeg-core');
          /*
           * In node environment, all paths are undefined as there
           * is no need to set them.
           */
          const {
            createFFmpegCore,
            corePath,
            workerPath,
            wasmPath,
          } = await getCreateFFmpegCore$1(options);
          Core = await createFFmpegCore({
            /*
             * Assign mainScriptUrlOrBlob fixes chrome extension web worker issue
             * as there is no document.currentScript in the context of content_scripts
             */
            mainScriptUrlOrBlob: corePath,
            printErr: (message) => parseMessage({ type: 'fferr', message }),
            print: (message) => parseMessage({ type: 'ffout', message }),
            /*
             * locateFile overrides paths of files that is loaded by main script (ffmpeg-core.js).
             * It is critical for browser environment and we override both wasm and worker paths
             * as we are using blob URL instead of original URL to avoid cross origin issues.
             */
            locateFile: (path, prefix) => {
              if (typeof window !== 'undefined') {
                if (typeof wasmPath !== 'undefined'
                  && path.endsWith('ffmpeg-core.wasm')) {
                  return wasmPath;
                }
                if (typeof workerPath !== 'undefined'
                  && path.endsWith('ffmpeg-core.worker.js')) {
                  return workerPath;
                }
              }
              return prefix + path;
            },
          });
          ffmpeg = Core.cwrap('proxy_main', 'number', ['number', 'number']);
          log$2('info', 'ffmpeg-core loaded');
        } else {
          throw Error('ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.');
        }
      };


      /*
       * Determine whether the Core is loaded.
       */
      const isLoaded = () => Core !== null;

      /*
       * Run ffmpeg command.
       * This is the major function in ffmpeg.wasm, you can just imagine it
       * as ffmpeg native cli and what you need to pass is the same.
       *
       * For example, you can convert native command below:
       *
       * ```
       * $ ffmpeg -i video.avi -c:v libx264 video.mp4
       * ```
       *
       * To
       *
       * ```
       * await ffmpeg.run('-i', 'video.avi', '-c:v', 'libx264', 'video.mp4');
       * ```
       *
       */
      const run = (..._args) => {
        log$2('info', `run ffmpeg command: ${_args.join(' ')}`);
        if (Core === null) {
          throw NO_LOAD;
        } else if (running) {
          throw Error('ffmpeg.wasm can only run one command at a time');
        } else {
          running = true;
          return new Promise((resolve) => {
            const args = [...defaultArgs, ..._args].filter((s) => s.length !== 0);
            runResolve = resolve;
            ffmpeg(...parseArgs(Core, args));
          });
        }
      };

      /*
       * Run FS operations.
       * For input/output file of ffmpeg.wasm, it is required to save them to MEMFS
       * first so that ffmpeg.wasm is able to consume them. Here we rely on the FS
       * methods provided by Emscripten.
       *
       * Common methods to use are:
       * ffmpeg.FS('writeFile', 'video.avi', new Uint8Array(...)): writeFile writes
       * data to MEMFS. You need to use Uint8Array for binary data.
       * ffmpeg.FS('readFile', 'video.mp4'): readFile from MEMFS.
       * ffmpeg.FS('unlink', 'video.map'): delete file from MEMFS.
       *
       * For more info, check https://emscripten.org/docs/api_reference/Filesystem-API.html
       *
       */
      const FS = (method, ...args) => {
        log$2('info', `run FS.${method} ${args.map((arg) => (typeof arg === 'string' ? arg : `<${arg.length} bytes binary file>`)).join(' ')}`);
        if (Core === null) {
          throw NO_LOAD;
        } else {
          let ret = null;
          try {
            ret = Core.FS[method](...args);
          } catch (e) {
            if (method === 'readdir') {
              throw Error(`ffmpeg.FS('readdir', '${args[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`);
            } else if (method === 'readFile') {
              throw Error(`ffmpeg.FS('readFile', '${args[0]}') error. Check if the path exists`);
            } else {
              throw Error('Oops, something went wrong in FS operation.');
            }
          }
          return ret;
        }
      };

      const setProgress = (_progress) => {
        progress = _progress;
      };

      const setLogger = (_logger) => {
        setCustomLogger$1(_logger);
      };

      setLogging$1(logging);
      setCustomLogger$1(logger);

      log$2('info', `use ffmpeg.wasm v${version$1}`);

      return {
        setProgress,
        setLogger,
        setLogging: setLogging$1,
        load,
        isLoaded,
        run,
        FS,
      };
    };

    const { fetchFile: fetchFile$1 } = browser$1;

    var src = {
      /*
       * Create ffmpeg instance.
       * Each ffmpeg instance owns an isolated MEMFS and works
       * independently.
       *
       * For example:
       *
       * ```
       * const ffmpeg = createFFmpeg({
       *  log: true,
       *  logger: () => {},
       *  progress: () => {},
       *  corePath: '',
       * })
       * ```
       *
       * For the usage of these four arguments, check config.js
       *
       */
      createFFmpeg,
      /*
       * Helper function for fetching files from various resource.
       * Sometimes the video/audio file you want to process may located
       * in a remote URL and somewhere in your local file system.
       *
       * This helper function helps you to fetch to file and return an
       * Uint8Array variable for ffmpeg.wasm to consume.
       *
       */
      fetchFile: fetchFile$1,
    };

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
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
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut }) {
        const len = node.getTotalLength();
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }

    /* src/ProgressBar.svelte generated by Svelte v3.30.0 */
    const file$1 = "src/ProgressBar.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let div0_style_value;
    	let div1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "progress-bar svelte-10dqltm");
    			attr_dev(div0, "style", div0_style_value = `width: ${/*progress*/ ctx[0]}%`);
    			add_location(div0, file$1, 7, 2, 163);
    			attr_dev(div1, "class", "progress-bar-container svelte-10dqltm");
    			add_location(div1, file$1, 6, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*progress*/ 1 && div0_style_value !== (div0_style_value = `width: ${/*progress*/ ctx[0]}%`)) {
    				attr_dev(div0, "style", div0_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 1000 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 1000 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
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
    	validate_slots("ProgressBar", slots, []);
    	let { progress } = $$props;
    	const writable_props = ["progress"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProgressBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("progress" in $$props) $$invalidate(0, progress = $$props.progress);
    	};

    	$$self.$capture_state = () => ({ progress, fade });

    	$$self.$inject_state = $$props => {
    		if ("progress" in $$props) $$invalidate(0, progress = $$props.progress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [progress];
    }

    class ProgressBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { progress: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressBar",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*progress*/ ctx[0] === undefined && !("progress" in props)) {
    			console.warn("<ProgressBar> was created without expected prop 'progress'");
    		}
    	}

    	get progress() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progress(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Interactable.svelte generated by Svelte v3.30.0 */
    const file$2 = "src/Interactable.svelte";

    // (44:2) {#if video.name}
    function create_if_block_2(ctx) {
    	let div1;
    	let div0;
    	let svg;
    	let g1;
    	let g0;
    	let path0;
    	let path0_transition;
    	let g3;
    	let g2;
    	let path1;
    	let path1_transition;
    	let g5;
    	let g4;
    	let path2;
    	let path2_transition;
    	let t0;
    	let span;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			path1 = svg_element("path");
    			g5 = svg_element("g");
    			g4 = svg_element("g");
    			path2 = svg_element("path");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Convert";
    			attr_dev(path0, "d", "M472.897,124.269c-0.01-0.01-0.02-0.02-0.03-0.031l-0.017,0.017l-68.267-68.267c-6.78-6.548-17.584-6.36-24.132,0.42\n                c-6.388,6.614-6.388,17.099,0,23.713l39.151,39.151h-95.334c-65.948,0.075-119.391,53.518-119.467,119.467\n                c-0.056,47.105-38.228,85.277-85.333,85.333h-102.4C7.641,324.072,0,331.713,0,341.139s7.641,17.067,17.067,17.067h102.4\n                c65.948-0.075,119.391-53.518,119.467-119.467c0.056-47.105,38.228-85.277,85.333-85.333h95.334l-39.134,39.134\n                c-6.78,6.548-6.968,17.353-0.419,24.132c6.548,6.78,17.353,6.968,24.132,0.419c0.142-0.137,0.282-0.277,0.419-0.419l68.267-68.267\n                C479.54,141.748,479.553,130.942,472.897,124.269z");
    			attr_dev(path0, "class", "svelte-ncd8cq");
    			add_location(path0, file$2, 51, 14, 1408);
    			add_location(g0, file$2, 50, 12, 1390);
    			add_location(g1, file$2, 49, 10, 1374);
    			attr_dev(path1, "d", "M472.897,329.069c-0.01-0.01-0.02-0.02-0.03-0.03l-0.017,0.017l-68.267-68.267c-6.78-6.548-17.584-6.36-24.132,0.42\n                c-6.388,6.614-6.388,17.099,0,23.712l39.151,39.151h-95.334c-20.996,0.015-41.258-7.721-56.9-21.726\n                c-7.081-6.222-17.864-5.525-24.086,1.555c-6.14,6.988-5.553,17.605,1.319,23.874c21.898,19.614,50.269,30.451,79.667,30.43h95.334\n                l-39.134,39.134c-6.78,6.548-6.968,17.352-0.42,24.132c6.548,6.78,17.352,6.968,24.132,0.42c0.142-0.138,0.282-0.277,0.42-0.42\n                l68.267-68.267C479.54,346.548,479.553,335.742,472.897,329.069z");
    			attr_dev(path1, "class", "svelte-ncd8cq");
    			add_location(path1, file$2, 61, 14, 2227);
    			add_location(g2, file$2, 60, 12, 2209);
    			add_location(g3, file$2, 59, 10, 2193);
    			attr_dev(path2, "d", "M199.134,149.702c-21.898-19.614-50.269-30.451-79.667-30.43h-102.4C7.641,119.272,0,126.913,0,136.339\n                c0,9.426,7.641,17.067,17.067,17.067h102.4c20.996-0.015,41.258,7.721,56.9,21.726c7.081,6.222,17.864,5.525,24.086-1.555\n                C206.593,166.588,206.006,155.971,199.134,149.702z");
    			attr_dev(path2, "class", "svelte-ncd8cq");
    			add_location(path2, file$2, 70, 14, 2935);
    			add_location(g4, file$2, 69, 12, 2917);
    			add_location(g5, file$2, 68, 10, 2901);
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "id", "Capa_1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "x", "0px");
    			attr_dev(svg, "y", "0px");
    			attr_dev(svg, "width", "30px");
    			attr_dev(svg, "height", "30px");
    			set_style(svg, "enable-background", "new 0 0 75.716 75.716");
    			attr_dev(svg, "xml:space", "preserve");
    			attr_dev(svg, "viewBox", "150 70 350 350");
    			attr_dev(svg, "class", "svelte-ncd8cq");
    			add_location(svg, file$2, 46, 8, 1100);
    			attr_dev(div0, "class", "svelte-ncd8cq");
    			add_location(div0, file$2, 45, 6, 1086);
    			attr_dev(span, "class", "svelte-ncd8cq");
    			add_location(span, file$2, 77, 6, 3348);
    			attr_dev(div1, "class", "convert-container svelte-ncd8cq");
    			add_location(div1, file$2, 44, 4, 993);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, path0);
    			append_dev(svg, g3);
    			append_dev(g3, g2);
    			append_dev(g2, path1);
    			append_dev(svg, g5);
    			append_dev(g5, g4);
    			append_dev(g4, path2);
    			append_dev(div1, t0);
    			append_dev(div1, span);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*convert*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!path0_transition) path0_transition = create_bidirectional_transition(path0, draw, { duration: 2000 }, true);
    				path0_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!path1_transition) path1_transition = create_bidirectional_transition(path1, draw, { duration: 2000 }, true);
    				path1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!path2_transition) path2_transition = create_bidirectional_transition(path2, draw, { duration: 2000 }, true);
    				path2_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 300 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!path0_transition) path0_transition = create_bidirectional_transition(path0, draw, { duration: 2000 }, false);
    			path0_transition.run(0);
    			if (!path1_transition) path1_transition = create_bidirectional_transition(path1, draw, { duration: 2000 }, false);
    			path1_transition.run(0);
    			if (!path2_transition) path2_transition = create_bidirectional_transition(path2, draw, { duration: 2000 }, false);
    			path2_transition.run(0);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 300 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && path0_transition) path0_transition.end();
    			if (detaching && path1_transition) path1_transition.end();
    			if (detaching && path2_transition) path2_transition.end();
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(44:2) {#if video.name}",
    		ctx
    	});

    	return block;
    }

    // (81:2) {#if isConverting}
    function create_if_block_1$1(ctx) {
    	let progressbar;
    	let updating_progress;
    	let current;

    	function progressbar_progress_binding(value) {
    		/*progressbar_progress_binding*/ ctx[6].call(null, value);
    	}

    	let progressbar_props = {};

    	if (/*progress*/ ctx[2] !== void 0) {
    		progressbar_props.progress = /*progress*/ ctx[2];
    	}

    	progressbar = new ProgressBar({ props: progressbar_props, $$inline: true });
    	binding_callbacks.push(() => bind(progressbar, "progress", progressbar_progress_binding));

    	const block = {
    		c: function create() {
    			create_component(progressbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progressbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar_changes = {};

    			if (!updating_progress && dirty & /*progress*/ 4) {
    				updating_progress = true;
    				progressbar_changes.progress = /*progress*/ ctx[2];
    				add_flush_callback(() => updating_progress = false);
    			}

    			progressbar.$set(progressbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progressbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(81:2) {#if isConverting}",
    		ctx
    	});

    	return block;
    }

    // (84:2) {#if output}
    function create_if_block$1(ctx) {
    	let a;
    	let div;
    	let svg;
    	let g1;
    	let g0;
    	let path0;
    	let path0_transition;
    	let g3;
    	let g2;
    	let path1;
    	let path1_transition;
    	let t0;
    	let span;
    	let a_download_value;
    	let a_transition;
    	let current;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			path1 = svg_element("path");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Download";
    			attr_dev(path0, "d", "M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64\n                c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472\n                c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z");
    			attr_dev(path0, "class", "svelte-ncd8cq");
    			add_location(path0, file$2, 90, 14, 3900);
    			add_location(g0, file$2, 89, 12, 3882);
    			add_location(g1, file$2, 88, 10, 3866);
    			attr_dev(path1, "d", "M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z");
    			attr_dev(path1, "class", "svelte-ncd8cq");
    			add_location(path1, file$2, 97, 14, 4378);
    			add_location(g2, file$2, 96, 12, 4360);
    			add_location(g3, file$2, 95, 10, 4344);
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "id", "Capa_1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "x", "0px");
    			attr_dev(svg, "y", "0px");
    			attr_dev(svg, "viewBox", "0 10 500 500");
    			set_style(svg, "enable-background", "new 0 0 512 512");
    			attr_dev(svg, "xml:space", "preserve");
    			attr_dev(svg, "width", "30px");
    			attr_dev(svg, "height", "30px");
    			attr_dev(svg, "class", "svelte-ncd8cq");
    			add_location(svg, file$2, 86, 8, 3606);
    			attr_dev(div, "class", "svelte-ncd8cq");
    			add_location(div, file$2, 85, 6, 3592);
    			attr_dev(span, "class", "svelte-ncd8cq");
    			add_location(span, file$2, 102, 6, 4580);
    			attr_dev(a, "href", /*output*/ ctx[3]);
    			attr_dev(a, "download", a_download_value = `download.${/*fileFormat*/ ctx[1]}`);
    			attr_dev(a, "class", "download-container svelte-ncd8cq");
    			add_location(a, file$2, 84, 4, 3469);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(div, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, path0);
    			append_dev(svg, g3);
    			append_dev(g3, g2);
    			append_dev(g2, path1);
    			append_dev(a, t0);
    			append_dev(a, span);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*output*/ 8) {
    				attr_dev(a, "href", /*output*/ ctx[3]);
    			}

    			if (!current || dirty & /*fileFormat*/ 2 && a_download_value !== (a_download_value = `download.${/*fileFormat*/ ctx[1]}`)) {
    				attr_dev(a, "download", a_download_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!path0_transition) path0_transition = create_bidirectional_transition(path0, draw, { duration: 2000 }, true);
    				path0_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!path1_transition) path1_transition = create_bidirectional_transition(path1, draw, { duration: 2000 }, true);
    				path1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!a_transition) a_transition = create_bidirectional_transition(a, fade, { duration: 300 }, true);
    				a_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!path0_transition) path0_transition = create_bidirectional_transition(path0, draw, { duration: 2000 }, false);
    			path0_transition.run(0);
    			if (!path1_transition) path1_transition = create_bidirectional_transition(path1, draw, { duration: 2000 }, false);
    			path1_transition.run(0);
    			if (!a_transition) a_transition = create_bidirectional_transition(a, fade, { duration: 300 }, false);
    			a_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching && path0_transition) path0_transition.end();
    			if (detaching && path1_transition) path1_transition.end();
    			if (detaching && a_transition) a_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(84:2) {#if output}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = /*video*/ ctx[0].name && create_if_block_2(ctx);
    	let if_block1 = /*isConverting*/ ctx[4] && create_if_block_1$1(ctx);
    	let if_block2 = /*output*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(section, "class", "interactables-container svelte-ncd8cq");
    			add_location(section, file$2, 42, 0, 928);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t1);
    			if (if_block2) if_block2.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*video*/ ctx[0].name) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*video*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*isConverting*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*isConverting*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*output*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*output*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(section, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
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
    	validate_slots("Interactable", slots, []);
    	let { video } = $$props;
    	let { fileFormat } = $$props;
    	let progress = 0;
    	let output, isConverting;

    	const ffmpeg = src.createFFmpeg({
    		log: true,
    		progress: ({ ratio }) => {
    			if (ratio >= 0) {
    				$$invalidate(2, progress = (ratio * 100).toFixed(2));
    			}
    		}
    	});

    	const convert = async () => {
    		const { name } = video;
    		$$invalidate(4, isConverting = true);

    		if (!ffmpeg.isLoaded()) {
    			await ffmpeg.load();
    		}

    		ffmpeg.FS("writeFile", name, await src.fetchFile(video));
    		await ffmpeg.run("-i", name, "-f", `${fileFormat}`, `out.${fileFormat}`);
    		const data = ffmpeg.FS("readFile", `out.${fileFormat}`);
    		const url = URL.createObjectURL(new Blob([data.buffer]), { type: `video/${fileFormat}` });
    		$$invalidate(3, output = url);
    		$$invalidate(4, isConverting = false);
    	};

    	const writable_props = ["video", "fileFormat"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Interactable> was created with unknown prop '${key}'`);
    	});

    	function progressbar_progress_binding(value) {
    		progress = value;
    		$$invalidate(2, progress);
    	}

    	$$self.$$set = $$props => {
    		if ("video" in $$props) $$invalidate(0, video = $$props.video);
    		if ("fileFormat" in $$props) $$invalidate(1, fileFormat = $$props.fileFormat);
    	};

    	$$self.$capture_state = () => ({
    		video,
    		fileFormat,
    		createFFmpeg: src.createFFmpeg,
    		fetchFile: src.fetchFile,
    		fade,
    		draw,
    		ProgressBar,
    		progress,
    		output,
    		isConverting,
    		ffmpeg,
    		convert
    	});

    	$$self.$inject_state = $$props => {
    		if ("video" in $$props) $$invalidate(0, video = $$props.video);
    		if ("fileFormat" in $$props) $$invalidate(1, fileFormat = $$props.fileFormat);
    		if ("progress" in $$props) $$invalidate(2, progress = $$props.progress);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isConverting" in $$props) $$invalidate(4, isConverting = $$props.isConverting);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		video,
    		fileFormat,
    		progress,
    		output,
    		isConverting,
    		convert,
    		progressbar_progress_binding
    	];
    }

    class Interactable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { video: 0, fileFormat: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Interactable",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*video*/ ctx[0] === undefined && !("video" in props)) {
    			console.warn("<Interactable> was created without expected prop 'video'");
    		}

    		if (/*fileFormat*/ ctx[1] === undefined && !("fileFormat" in props)) {
    			console.warn("<Interactable> was created without expected prop 'fileFormat'");
    		}
    	}

    	get video() {
    		throw new Error("<Interactable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set video(value) {
    		throw new Error("<Interactable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fileFormat() {
    		throw new Error("<Interactable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileFormat(value) {
    		throw new Error("<Interactable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.30.0 */
    const file$3 = "src/App.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let input;
    	let updating_video;
    	let updating_fileFormat;
    	let t2;
    	let interactable;
    	let updating_video_1;
    	let updating_fileFormat_1;
    	let current;

    	function input_video_binding(value) {
    		/*input_video_binding*/ ctx[2].call(null, value);
    	}

    	function input_fileFormat_binding(value) {
    		/*input_fileFormat_binding*/ ctx[3].call(null, value);
    	}

    	let input_props = {};

    	if (/*video*/ ctx[0] !== void 0) {
    		input_props.video = /*video*/ ctx[0];
    	}

    	if (/*fileFormat*/ ctx[1] !== void 0) {
    		input_props.fileFormat = /*fileFormat*/ ctx[1];
    	}

    	input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "video", input_video_binding));
    	binding_callbacks.push(() => bind(input, "fileFormat", input_fileFormat_binding));

    	function interactable_video_binding(value) {
    		/*interactable_video_binding*/ ctx[4].call(null, value);
    	}

    	function interactable_fileFormat_binding(value) {
    		/*interactable_fileFormat_binding*/ ctx[5].call(null, value);
    	}

    	let interactable_props = {};

    	if (/*video*/ ctx[0] !== void 0) {
    		interactable_props.video = /*video*/ ctx[0];
    	}

    	if (/*fileFormat*/ ctx[1] !== void 0) {
    		interactable_props.fileFormat = /*fileFormat*/ ctx[1];
    	}

    	interactable = new Interactable({
    			props: interactable_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(interactable, "video", interactable_video_binding));
    	binding_callbacks.push(() => bind(interactable, "fileFormat", interactable_fileFormat_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Video Converter";
    			t1 = space();
    			create_component(input.$$.fragment);
    			t2 = space();
    			create_component(interactable.$$.fragment);
    			attr_dev(h1, "class", "svelte-1ozf4hk");
    			add_location(h1, file$3, 9, 1, 159);
    			attr_dev(main, "class", "svelte-1ozf4hk");
    			add_location(main, file$3, 8, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(input, main, null);
    			append_dev(main, t2);
    			mount_component(interactable, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const input_changes = {};

    			if (!updating_video && dirty & /*video*/ 1) {
    				updating_video = true;
    				input_changes.video = /*video*/ ctx[0];
    				add_flush_callback(() => updating_video = false);
    			}

    			if (!updating_fileFormat && dirty & /*fileFormat*/ 2) {
    				updating_fileFormat = true;
    				input_changes.fileFormat = /*fileFormat*/ ctx[1];
    				add_flush_callback(() => updating_fileFormat = false);
    			}

    			input.$set(input_changes);
    			const interactable_changes = {};

    			if (!updating_video_1 && dirty & /*video*/ 1) {
    				updating_video_1 = true;
    				interactable_changes.video = /*video*/ ctx[0];
    				add_flush_callback(() => updating_video_1 = false);
    			}

    			if (!updating_fileFormat_1 && dirty & /*fileFormat*/ 2) {
    				updating_fileFormat_1 = true;
    				interactable_changes.fileFormat = /*fileFormat*/ ctx[1];
    				add_flush_callback(() => updating_fileFormat_1 = false);
    			}

    			interactable.$set(interactable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			transition_in(interactable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			transition_out(interactable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(input);
    			destroy_component(interactable);
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
    	validate_slots("App", slots, []);
    	let video = {};
    	let fileFormat = "mp4";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_video_binding(value) {
    		video = value;
    		$$invalidate(0, video);
    	}

    	function input_fileFormat_binding(value) {
    		fileFormat = value;
    		$$invalidate(1, fileFormat);
    	}

    	function interactable_video_binding(value) {
    		video = value;
    		$$invalidate(0, video);
    	}

    	function interactable_fileFormat_binding(value) {
    		fileFormat = value;
    		$$invalidate(1, fileFormat);
    	}

    	$$self.$capture_state = () => ({ Input, Interactable, video, fileFormat });

    	$$self.$inject_state = $$props => {
    		if ("video" in $$props) $$invalidate(0, video = $$props.video);
    		if ("fileFormat" in $$props) $$invalidate(1, fileFormat = $$props.fileFormat);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		video,
    		fileFormat,
    		input_video_binding,
    		input_fileFormat_binding,
    		interactable_video_binding,
    		interactable_fileFormat_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
