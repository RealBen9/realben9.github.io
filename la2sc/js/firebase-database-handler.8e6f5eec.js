(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["firebase-database-handler"], {
    "65f2": function(e, t, s) {
        "use strict";
        s.r(t);
        s("e6cf"),
        s("e260"),
        s("ddb0");
        var r = s("d257")
          , i = s("1663")
          , o = s("f2ce")
          , h = (s("4e82"),
        s("b047"))
          , n = s.n(h)
          , a = (s("ac1f"),
        s("1276"),
        s("13d5"),
        s("2de2"));
        const d = "|"
          , l = e=>1e3 * (a["i"] + e)
          , c = e=>Math.round(e / 1e3) - a["i"]
          , g = ({key: e, value: {v: t}})=>{
            const [s,r] = e.split(d);
            return {
                father: s,
                mother: r,
                timestamp: l(t)
            }
        }
          , u = ({father: e, mother: t, timestamp: s})=>{
            const r = [e, t].join(d);
            return {
                key: r,
                value: c(s)
            }
        }
          , m = e=>Object.entries(e).map(([e,t])=>g({
            key: e,
            value: t
        }))
          , y = e=>e.reduce((e,t)=>{
            const {key: s, value: r} = u(t);
            return e[s] = r,
            e
        }
        , {})
          , f = 1500;
        class R {
            constructor(e) {
                this._history = [],
                this.reset = -1,
                this.onHandlerFinished = n()(e, f)
            }
            onProgressReceived(e) {
                this.logger("progress received", e);
                const t = !e;
                t ? this.onHandlerFinished() : (this.reset = e.r || -1,
                this._history = m(e.h || {}),
                this._history = this._history.sort((e,t)=>e.timestamp - t.timestamp),
                this.onHandlerFinished(),
                this.logger("progress prepared ", this.history, this.reset))
            }
            onChildAdded(e, t=!1) {
                const s = g(e);
                this.logger("onChildAdded", s),
                this._history.push(s),
                t || this.onHandlerFinished()
            }
            onChildRemoved(e, t=!1) {
                const s = g(e);
                this.logger("onChildRemoved", s),
                this._history = this._history.filter(({father: e, mother: t})=>e !== s.father && t !== s.mother),
                t || this.onHandlerFinished()
            }
            onResetChanged(e) {
                this.reset = e,
                this._history = [],
                this.onHandlerFinished()
            }
            get history() {
                return [...this._history]
            }
            logger(...e) {
                Object(r["q"])("firebase", "[DATABASE]", "[SYNC]", "[DATA_HANDLER]", ...e)
            }
        }
        var p = R
          , v = s("5530")
          , E = s("22a7")
          , S = s("2540")
          , b = s("b2eb");
        const H = b["HIDE_DURATION"];
        let A = null;
        const _ = (e,t,s)=>{
            let r = t
              , i = !0;
            s.length && (r = s[s.length - 1].timestamp,
            i = !1);
            const {totalProgress: o} = E["a"].analyzeHistory(e.getters.elements, s)
              , h = o.length;
            return {
                timestamp: r,
                reseted: i,
                count: h
            }
        }
          , O = async(e,t)=>{
            e.getters.isPopupActive && await S["a"].onHidePromise(),
            await Object(r["c"])(H),
            e.dispatch("popupShowWithData", {
                name: b["SYNC"],
                data: Object(v["a"])(Object(v["a"])({}, t), {}, {
                    closable: !1
                })
            })
        }
        ;
        var T = ({$store: e, remoteReset: t, remoteHistory: s})=>null !== A ? A : (A = new Promise(r=>{
            const i = Object(v["a"])(Object(v["a"])({}, _(e, t, s)), {}, {
                onSuccess: e=>{
                    r(e),
                    A = null
                }
            });
            O(e, i)
        }
        ),
        A)
          , C = s("ded8");
        const P = (e,t)=>{
            if (-1 === t)
                return !1;
            const s = !!e.getters.historyBefore(t).length;
            return e.dispatch("historyRemoveBeforeTimestamp", t),
            s
        }
          , k = ({store: e, remote: t})=>{
            let s = !1;
            return t.history.forEach(t=>{
                const r = Object(C["c"])([t.mother, t.father]);
                e.getters.hasMixed(r) || (e.commit("HISTORY_ADD", t),
                s = !0)
            }
            ),
            s
        }
          , w = ({store: e, remote: t, local: s, handleReset: r=!0})=>{
            let i;
            r || e.commit("RESET_TIMESTAMP", -1);
            const o = !t.history.length;
            if (o)
                return i = !1,
                r && (i = P(e, t.reset),
                i && e.commit("RESET_TIMESTAMP", t.reset)),
                i;
            const h = !s.history.length;
            if (h)
                return e.dispatch("historySet", t.history),
                !0;
            if (i = k({
                store: e,
                remote: t
            }),
            r) {
                const r = P(e, Math.max(t.reset, s.reset));
                r && (i = !0)
            }
            return i
        }
        ;
        var M = w
          , j = s("cf19");
        const $ = (e,t)=>{
            const s = t.every(({father: t, mother: s})=>e.getters.hasMixed([t, s]))
              , r = e.getters.history.length === t.length;
            return s && r
        }
          , D = (e,t,s)=>{
            const r = !t.length;
            if (r) {
                const t = !!e.getters.historyBefore(s).length;
                return t
            }
            const i = e.getters.history
              , o = e.getters.resetTimestamp
              , h = !i.length;
            if (h) {
                const e = -1 !== o
                  , t = o !== s;
                return e && t
            }
            return !$(e, t)
        }
          , I = (e,t)=>{
            const s = y(e)
              , r = y(t)
              , i = !t.length
              , o = []
              , h = [];
            return Object.entries(r).forEach(([e,t])=>{
                s.hasOwnProperty(e) || o.push({
                    key: e,
                    value: t
                })
            }
            ),
            Object.keys(s).forEach(e=>{
                if (!i) {
                    const {father: t="", mother: s=""} = g({
                        key: e,
                        value: {
                            v: 0
                        }
                    })
                      , r = Object(j["b"])(t, a["g"])
                      , i = Object(j["b"])(s, a["g"]);
                    if (!r || !i)
                        return
                }
                r.hasOwnProperty(e) || h.push(e)
            }
            ),
            {
                add: o,
                remove: h
            }
        }
        ;
        class L {
            constructor(e, t) {
                this.handleRemote = async()=>{
                    const e = D(this.$store, this.remoteHistory, this.remoteReset);
                    let t = !1;
                    if (!e)
                        return t = this.merge(),
                        void this.handleSync(t);
                    const s = await this.chooseSyncMethod();
                    s === o["a"].MERGE && (t = this.merge(!1)),
                    s === o["a"].LOCAL && (t = this.useLocal()),
                    s === o["a"].REMOTE && (t = this.useRemote()),
                    this.handleSync(t)
                }
                ,
                this.$store = e,
                this._updateRemote = t,
                this.dataHandler = new p(this.handleRemote)
            }
            handleSync(e) {
                if (this.$store.dispatch("userSynced"),
                e)
                    return this.$store.dispatch("historyReload"),
                    this.$store.dispatch("historyIntegrity"),
                    void this.updateRemote();
                const t = !e && this.remoteHistory.length < this.history.length;
                t && this.updateRemote()
            }
            merge(e=!0) {
                return M({
                    store: this.$store,
                    remote: {
                        history: this.remoteHistory,
                        reset: this.remoteReset
                    },
                    local: {
                        history: this.history,
                        reset: this.reset
                    },
                    handleReset: e
                })
            }
            useLocal() {
                return this.updateRemote(),
                !1
            }
            useRemote() {
                return this.$store.dispatch("historySet", this.remoteHistory),
                this.$store.commit("RESET_TIMESTAMP", this.remoteReset),
                !0
            }
            chooseSyncMethod() {
                return this.logger("choose sync method"),
                T({
                    $store: this.$store,
                    remoteHistory: this.remoteHistory,
                    remoteReset: this.remoteReset
                })
            }
            onProgressChange() {
                this.updateRemote()
            }
            updateRemote() {
                const e = I(this.remoteHistory, this.history);
                (this.remoteReset < this.reset || -1 === this.reset) && (e.reset = this.reset);
                const t = !e.add.length && !e.remove.length && !e.reset;
                t || this._updateRemote(e)
            }
            get handle() {
                return this.dataHandler
            }
            get remoteHistory() {
                return this.dataHandler.history
            }
            get remoteReset() {
                return this.dataHandler.reset
            }
            get history() {
                return this.$store.getters.history
            }
            get reset() {
                return this.$store.getters.resetTimestamp
            }
            logger(...e) {
                Object(r["q"])("firebase", "[DATABASE]", "[SYNC]", ...e)
            }
        }
        var B = L;
        class F {
            constructor(e, t) {
                if (this.added = {},
                this.removed = {},
                this.onInitialValue = e=>{
                    const t = e && e.exists() ? e.val() : null;
                    this.syncHandler.handle.onProgressReceived(t),
                    this.log("progress snapshot", t)
                }
                ,
                this.onChildAdded = e=>{
                    if (!e)
                        return;
                    const t = {
                        key: e.key,
                        value: e.val()
                    }
                      , s = this.detectSelfSent(this.added, e.key);
                    this.syncHandler.handle.onChildAdded(t, s),
                    this.log("child_added", e.key)
                }
                ,
                this.onChildRemoved = e=>{
                    if (!e)
                        return;
                    const t = {
                        key: e.key,
                        value: e.val()
                    }
                      , s = this.detectSelfSent(this.added, e.key);
                    this.syncHandler.handle.onChildRemoved(t, s),
                    this.log("child_removed", e.key)
                }
                ,
                this.onResetUpdated = e=>{
                    e && (this.syncHandler.handle.onResetChanged(e.val()),
                    this.log("reset child_changed", e.val()))
                }
                ,
                this.onProgressChange = ()=>{
                    this.syncHandler.onProgressChange()
                }
                ,
                this.updateRemote = ({add: e, remove: t, reset: s=null})=>{
                    null !== s && this.progressRef.child("r").set(s),
                    e.forEach(({key: e, value: t})=>{
                        this.added[e] = !0,
                        this.historyRef.child(e).set({
                            v: t,
                            _: Math.round(Date.now() / 1e3)
                        })
                    }
                    ),
                    t.forEach(e=>{
                        this.removed[e] = !0,
                        this.historyRef.child(e).remove()
                    }
                    ),
                    this.log("updateRemote", e, t, s)
                }
                ,
                this.firebase = e,
                this.destroy(),
                !t.getters.isLoggedIn)
                    return;
                this.syncHandler = new B(t,this.updateRemote);
                const s = t.getters.user.uid;
                this.initRefs(s),
                this.initEvents(),
                this.initListeners()
            }
            initRefs(e) {
                this.progressRef = this.firebase.database().ref(`users/${e}/progress`),
                this.historyRef = this.progressRef.child("h")
            }
            initEvents() {
                i["a"].on("HISTORY_UPDATE", this.onProgressChange),
                i["a"].on("PROGRESS_RESET", this.onProgressChange)
            }
            initListeners() {
                this.progressRef.once("value").then(this.onInitialValue);
                const e = Math.round(Date.now() / 1e3);
                this.historyRef.orderByChild("_").startAt(e).on("child_added", this.onChildAdded),
                this.historyRef.on("child_removed", this.onChildRemoved),
                this.progressRef.child("r").on("value", this.onResetUpdated)
            }
            detectSelfSent(e, t) {
                return !!t && (!!e.hasOwnProperty(t) && (delete e[t],
                !0))
            }
            sendNotificationsToken(e) {
                if (!e)
                    return Promise.reject();
                const t = this.firebase.database().ref(`tokens/${e}`);
                return t.set("w")
            }
            destroy() {
                this.progressRef && (this.progressRef.child("h").off(),
                this.progressRef.child("r").off(),
                this.progressRef.off(),
                this.progressRef = null),
                this.historyRef && (this.historyRef.off(),
                this.historyRef = null),
                this.syncHandler = null,
                i["a"].off("HISTORY_UPDATE", this.onProgressChange),
                i["a"].off("PROGRESS_RESET", this.onProgressChange)
            }
            log(...e) {
                Object(r["q"])("firebase", "[DATABASE]", ...e)
            }
        }
        t["default"] = F
    },
    f2ce: function(e, t, s) {
        "use strict";
        var r;
        s.d(t, "a", (function() {
            return r
        }
        )),
        function(e) {
            e["MERGE"] = "merge",
            e["LOCAL"] = "local",
            e["REMOTE"] = "remote"
        }(r || (r = {}));
        r.MERGE
    }
}]);
//# sourceMappingURL=firebase-database-handler.8e6f5eec.js.map
