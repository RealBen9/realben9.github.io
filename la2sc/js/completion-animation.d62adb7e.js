(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["completion-animation"], {
    "7a56": function(t, i, e) {
        "use strict";
        e("ef50")
    },
    ee39: function(t, i, e) {
        "use strict";
        e.r(i);
        var n = function() {
            var t = this
              , i = t.$createElement
              , e = t._self._c || i;
            return e("div", {
                directives: [{
                    name: "animation-end",
                    rawName: "v-animation-end",
                    value: t.onAnimation,
                    expression: "onAnimation"
                }],
                staticClass: "completion",
                class: t.classes,
                attrs: {
                    id: "completion"
                }
            }, [e("div", {
                staticClass: "rays center"
            }), e("div", {
                staticClass: "items center"
            }, t._l(t.ELEMENTS, (function(i, n) {
                return e("div", {
                    key: i,
                    staticClass: "animation-item",
                    class: ["item" + (n + 1)]
                }, [e("img", {
                    attrs: {
                        src: t.iconUrl(i),
                        alt: "animation item"
                    }
                })])
            }
            )), 0), t._m(0), e("div", {
                staticClass: "cover"
            }), t._m(1)])
        }
          , a = [function() {
            var t = this
              , i = t.$createElement
              , e = t._self._c || i;
            return e("div", {
                staticClass: "hole-container center"
            }, [e("div", {
                staticClass: "hole dark center"
            }), e("div", {
                staticClass: "hole light center"
            })])
        }
        , function() {
            var t = this
              , i = t.$createElement
              , e = t._self._c || i;
            return e("div", {
                staticClass: "center text"
            }, [e("div", [t._v(" everything"), e("br"), t._v("discovered! ")])])
        }
        ]
          , s = e("6e95")
          , c = e("fd41")
          , o = e("1663")
          , r = e("53b2")
          , m = e("7d61");
        const d = m["a"][r["d"]]
          , l = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "13", "14", "15", "16"];
        var v = s["a"].extend({
            name: "animation-completion",
            data: ()=>({
                animate: !1
            }),
            computed: {
                ELEMENTS() {
                    return l
                },
                isActive() {
                    return this.$store.getters.isAnimationActive(r["d"])
                },
                classes() {
                    return {
                        "js-active": this.isActive && this.animate
                    }
                }
            },
            mounted() {
                this.checkActive()
            },
            watch: {
                isActive() {
                    this.checkActive()
                }
            },
            methods: {
                checkActive() {
                    this.isActive && this.$nextTick(()=>{
                        this.animate = !0
                    }
                    )
                },
                iconUrl(t) {
                    return Object(c["a"])(t)
                },
                onAnimation({animationName: t}) {
                    t === d.middle && this.onAnimationEnding(),
                    t === d.end && this.onAnimationEnd()
                },
                onAnimationEnding() {
                    this.$store.dispatch("animationCompletionEnding")
                },
                onAnimationEnd() {
                    this.animate = !1,
                    this.$store.dispatch("animationReset"),
                    o["a"].emit("GAME_COMPLETION_ANIMATION_END")
                }
            }
        })
          , h = v
          , u = (e("7a56"),
        e("2877"))
          , A = Object(u["a"])(h, n, a, !1, null, "437348e0", null);
        i["default"] = A.exports
    },
    ef50: function(t, i, e) {}
}]);
//# sourceMappingURL=completion-animation.d62adb7e.js.map
