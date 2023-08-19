(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["login"], {
    a167: function(e, t, s) {
        "use strict";
        s.r(t);
        var i = function() {
            var e = this
              , t = e.$createElement
              , s = e._self._c || t;
            return s("div", [s("CloseButton", {
                attrs: {
                    "is-back": !e.isSuccess
                },
                on: {
                    click: e.back
                }
            }), s("div", {
                staticClass: "popup-header"
            }, [e._v("Sign in")]), s("div", {
                staticClass: "content"
            }, [s("transition", {
                attrs: {
                    name: "login-transition",
                    mode: "out-in"
                }
            }, [e.isStep("chooser") ? s("div", {
                staticClass: "step"
            }, [s("div", {
                staticClass: "group text-center"
            }, [e._v(" Use your existing account or set up a new one using your e‑mail address. ")]), s("div", {
                staticClass: "group text-center"
            }, [e._v(" By signing in you accept our "), s("span", {
                staticClass: "privacy-policy"
            }, [s("a", {
                attrs: {
                    href: "https://www.iubenda.com/privacy-policy/8201056",
                    target: "_blank",
                    rel: "noopener noreferrer"
                }
            }, [e._v("Privacy Policy")])]), e._v(". ")]), s("div", {
                staticClass: "button-group"
            }, [s("div", {
                staticClass: "popup-button login-google",
                on: {
                    click: e.loginGoogle
                }
            }, [s("span", {
                staticClass: "label"
            }, [e._v("Google")])]), s("div", {
                staticClass: "popup-button login-facebook",
                on: {
                    click: e.loginFacebook
                }
            }, [s("span", {
                staticClass: "label"
            }, [e._v("Facebook")])]), s("div", {
                staticClass: "popup-button login-mail",
                on: {
                    click: e.loginMail
                }
            }, [s("span", {
                staticClass: "label"
            }, [e._v("E-mail")])])])]) : e.isStep("mail") ? s("mail-login", {
                ref: "mailFlow"
            }) : e.isStep("success") ? s("div", {
                staticClass: "step"
            }, [s("div", {
                staticClass: "text-center bold group"
            }, [e._v("Signed in successfully.")]), e.shouldShowNewsletterOptin ? e._e() : s("div", {
                staticClass: "text-center group"
            }, [e._v("Now onwards! Discover new worlds!")]), e.shouldShowNewsletterOptin ? s("div", [s("div", {
                staticClass: "group text-center"
            }, [e._v(" While you're here, would you like to receive email notifications when we release updates? ")]), s("div", {
                staticClass: "group flex-row flex-justify-content-center"
            }, [s("div", {
                staticClass: "flip-switch newsletter-switch"
            }, [s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.joinNewsletter,
                    expression: "joinNewsletter"
                }],
                attrs: {
                    id: "newsletterCheckbox",
                    type: "checkbox"
                },
                domProps: {
                    checked: Array.isArray(e.joinNewsletter) ? e._i(e.joinNewsletter, null) > -1 : e.joinNewsletter
                },
                on: {
                    change: function(t) {
                        var s = e.joinNewsletter
                          , i = t.target
                          , a = !!i.checked;
                        if (Array.isArray(s)) {
                            var r = null
                              , o = e._i(s, r);
                            i.checked ? o < 0 && (e.joinNewsletter = s.concat([r])) : o > -1 && (e.joinNewsletter = s.slice(0, o).concat(s.slice(o + 1)))
                        } else
                            e.joinNewsletter = a
                    }
                }
            }), s("label", {
                attrs: {
                    for: "newsletterCheckbox"
                }
            })]), s("label", {
                attrs: {
                    for: "newsletterCheckbox"
                }
            }, [e._v("join Little Alchemy newsletter")])])]) : e._e(), s("div", {
                staticClass: "group"
            }, [s("div", {
                staticClass: "popup-button",
                on: {
                    click: e.hide
                }
            }, [s("span", {
                staticClass: "label"
            }, [e._v("continue")])])])]) : e._e()], 1)], 1)], 1)
        }
          , a = []
          , r = s("5530")
          , o = (s("e6cf"),
        s("6e95"))
          , n = s("5c57")
          , l = s("d257")
          , c = s("b2eb")
          , u = s("1663")
          , h = s("da33")
          , p = s("7897");
        const d = "newsletter"
          , v = "https://us-central1-little-alchemy-2.cloudfunctions.net/joinNewsletter"
          , m = "https://us-central1-little-alchemy-2.cloudfunctions.net/isSubscribed";
        class w {
            constructor() {
                0
            }
            async join(e) {
                try {
                    await Object(l["w"])(v, {
                        email: e
                    }),
                    this.updateStorage(e)
                } catch (t) {
                    throw new Error(t)
                }
            }
            updateStorage(e) {
                Object(p["b"])(d, e)
            }
            async hasJoined(e) {
                if (this.hasJoinedLocally(e))
                    return !0;
                const t = await this.hasSubscribed(e);
                return t
            }
            hasJoinedLocally(e) {
                const t = Object(p["a"])(d);
                return null !== t && t === e
            }
            async hasSubscribed(e) {
                const t = `${m}?email=${e}`;
                try {
                    const e = await Object(l["f"])(t)
                      , s = !["Email not passed", "Email does not exist in list"].includes(e);
                    return s
                } catch (s) {
                    return !1
                }
            }
        }
        var g = new w
          , b = s("437d")
          , y = s("e879")
          , f = function() {
            var e = this
              , t = e.$createElement
              , s = e._self._c || t;
            return s("div", [s("transition", {
                attrs: {
                    name: "login-transition",
                    mode: "out-in"
                },
                on: {
                    "after-leave": e.afterLeave
                }
            }, ["mail" === e.step ? s("div", {
                staticClass: "step"
            }, [s("div", {
                staticClass: "error-container",
                class: e.errorClasses
            }, [s("div", [e._v(e._s(e.error))])]), s("label", [s("div", {
                staticClass: "popup-input-label"
            }, [e._v("e-mail address")]), s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.mail,
                    expression: "mail"
                }],
                attrs: {
                    type: "email",
                    name: "mail",
                    autofocus: ""
                },
                domProps: {
                    value: e.mail
                },
                on: {
                    keyup: function(t) {
                        return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter") ? null : e.mailSubmit(t)
                    },
                    input: function(t) {
                        t.target.composing || (e.mail = t.target.value)
                    }
                }
            })]), e.isLogin || e.isSignup ? s("label", [s("div", {
                staticClass: "popup-input-label"
            }, [e._v(e._s(e.isLogin ? "password" : "new password"))]), s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.password,
                    expression: "password"
                }],
                ref: "password",
                attrs: {
                    type: "password"
                },
                domProps: {
                    value: e.password
                },
                on: {
                    keyup: function(t) {
                        return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter") ? null : e.mailSubmit(t)
                    },
                    input: function(t) {
                        t.target.composing || (e.password = t.target.value)
                    }
                }
            })]) : e._e(), e.isSignup ? s("div", [e._v(" By clicking the 'register' button, you indicate your agreement with our "), s("a", {
                staticClass: "link",
                attrs: {
                    href: "https://www.iubenda.com/privacy-policy/8201056",
                    target: "_blank",
                    rel: "noopener noreferrer"
                }
            }, [e._v("Privacy Policy")]), e._v(". ")]) : e._e(), s("div", {
                staticClass: "popup-button width-200",
                on: {
                    click: e.mailSubmit
                }
            }, [e.isCheck ? s("div", {
                staticClass: "label"
            }, [e._v("next")]) : e._e(), e.isSignup ? s("div", {
                staticClass: "label"
            }, [e._v("register")]) : e._e(), e.isLogin ? s("div", {
                staticClass: "label"
            }, [e._v("sign in")]) : e._e()]), e.isLogin ? s("div", {
                staticClass: "troubles-signing-in",
                on: {
                    click: function(t) {
                        return e.showNext("recover")
                    }
                }
            }, [e._v(" Troubles signing in? ")]) : e._e()]) : e._e(), "recover" === e.step ? s("div", {
                staticClass: "step text-center"
            }, [s("div", {
                staticClass: "error-container",
                class: e.errorClasses
            }, [s("div", [e._v(e._s(e.error))])]), s("div", {
                staticClass: "group"
            }, [e._v("You'll get an email with instructions on how to recover your password.")]), s("label", [s("div", {
                staticClass: "popup-input-label"
            }, [e._v("e-mail address")]), s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.mail,
                    expression: "mail"
                }],
                attrs: {
                    type: "email",
                    name: "mail"
                },
                domProps: {
                    value: e.mail
                },
                on: {
                    keyup: function(t) {
                        return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter") ? null : e.recoverSubmit(t)
                    },
                    input: function(t) {
                        t.target.composing || (e.mail = t.target.value)
                    }
                }
            })]), s("div", {
                staticClass: "popup-button width-200",
                on: {
                    click: e.recoverSubmit
                }
            }, [s("div", {
                staticClass: "label"
            }, [e._v("recover")])])]) : e._e(), "recoverSuccess" === e.step ? s("div", {
                staticClass: "step text-center"
            }, [e._v(" An e-mail with the recovery instructions was sent to your email address. ")]) : e._e()])], 1)
        }
          , k = [];
        const _ = 4e3;
        var C = o["a"].extend({
            name: "mail-login",
            data() {
                return {
                    step: "mail",
                    flow: "check",
                    mail: "",
                    password: "",
                    error: "",
                    errorVisible: !1,
                    nextStep: ""
                }
            },
            computed: {
                isCheck() {
                    return "check" === this.flow
                },
                isSignup() {
                    return "signup" === this.flow
                },
                isLogin() {
                    return "password" === this.flow
                },
                errorClasses() {
                    return {
                        "js-visible": this.errorVisible
                    }
                }
            },
            mounted() {
                this.handleError = this.handleError.bind(this)
            },
            methods: {
                mailSubmit() {
                    this.errorVisible = !1;
                    const e = {
                        mail: this.mail,
                        password: this.password
                    };
                    this.isCheck ? this.checkProvider() : this.isSignup ? h["a"].mailSignup(e).catch(this.handleError) : h["a"].mailLogin(e).catch(this.handleError)
                },
                async checkProvider() {
                    try {
                        const e = await h["a"].mailCheckProviders(this.mail);
                        if (!e)
                            return void this.hide();
                        this.flow = e,
                        this.showNext("mail")
                    } catch (e) {
                        this.handleError(e)
                    }
                },
                async recoverSubmit() {
                    this.errorVisible = !1;
                    try {
                        await h["a"].mailReset(this.mail),
                        this.showNext("recoverSuccess")
                    } catch (e) {
                        this.handleError(e)
                    }
                },
                async handleError(e) {
                    this.error = e.message,
                    this.errorVisible = !0,
                    await Object(l["c"])(_),
                    this.errorVisible = !1
                },
                afterLeave() {
                    this.step = `${this.nextStep}`,
                    this.nextStep = "",
                    this.$nextTick(()=>{
                        this.$refs.password && this.$refs.password.focus()
                    }
                    )
                },
                showNext(e) {
                    this.step = "",
                    this.nextStep = e
                },
                back() {
                    return "mail" === this.step ? !this.isCheck && (this.flow = "check",
                    this.showNext("mail"),
                    !0) : "recover" === this.step ? (this.showNext("mail"),
                    !0) : "recoverSuccess" === this.step && (this.flow = "password",
                    this.showNext("mail"),
                    !0)
                },
                hide() {
                    this.$store.dispatch("popupHide", void 0),
                    this.reset()
                },
                async reset() {
                    await Object(l["c"])(2 * c["DELAY"]),
                    this.mail = "",
                    this.password = "",
                    this.errorVisible = !1,
                    this.error = "",
                    this.flow = "check",
                    this.step = "mail"
                }
            }
        })
          , S = C
          , N = s("2877")
          , x = Object(N["a"])(S, f, k, !1, null, null, null)
          , j = x.exports;
        const E = !1;
        var O = o["a"].extend({
            name: "login-popup",
            components: {
                BasePopup: b["a"],
                CloseButton: y["a"],
                MailLogin: j
            },
            data: ()=>({
                step: "chooser",
                joinNewsletter: E,
                hasJoined: null
            }),
            computed: Object(r["a"])(Object(r["a"])({}, Object(n["b"])(["isPopupWithNameActive", "isLoggedIn", "user"])), {}, {
                name() {
                    return c["LOGIN"]
                },
                isLoginActive() {
                    return this.isPopupWithNameActive(c["LOGIN"])
                },
                isSuccess() {
                    return "success" === this.step
                },
                userEmail() {
                    return this.user ? this.user.email : null
                },
                hasJoinedNewsletter() {
                    return !!this.hasJoined
                },
                shouldShowNewsletterOptin() {
                    return !!this.userEmail && null !== this.hasJoined && !this.hasJoinedNewsletter
                }
            }),
            mounted() {
                u["a"].on("POPUP_HIDE", ()=>{
                    this.isLoginActive && (this.$refs.mailFlow && this.$refs.mailFlow.reset(),
                    this.handleNewsletter(),
                    this.reset())
                }
                )
            },
            watch: {
                isLoggedIn(e) {
                    e && this.isLoginActive && (this.step = "success")
                },
                userEmail(e) {
                    e && this.fetchNewsletterStatus()
                }
            },
            methods: {
                isStep(e) {
                    return this.step === e
                },
                loginGoogle() {
                    h["a"].login("google")
                },
                loginFacebook() {
                    h["a"].login("facebook")
                },
                loginMail() {
                    this.step = "mail"
                },
                async reset() {
                    await Object(l["c"])(c["HIDE_DURATION"]),
                    this.step = "chooser",
                    this.joinNewsletter = E,
                    this.hasJoined = null
                },
                back() {
                    if (this.isStep("success"))
                        this.hide();
                    else if (this.isStep("chooser"))
                        this.hide();
                    else {
                        const e = this.$refs.mailFlow.back();
                        if (e)
                            return;
                        this.step = "chooser"
                    }
                },
                hide() {
                    this.reset(),
                    this.isSuccess ? this.$store.dispatch("popupHide", void 0) : this.$store.dispatch("popupShowNext", {
                        name: c["SETTINGS"]
                    })
                },
                async fetchNewsletterStatus() {
                    if (!this.userEmail)
                        return;
                    const e = await g.hasJoined(this.userEmail);
                    this.hasJoined = e
                },
                handleNewsletter() {
                    this.joinNewsletter && this.userEmail && g.join(this.userEmail)
                }
            }
        })
          , L = O
          , P = Object(N["a"])(L, i, a, !1, null, null, null);
        t["default"] = P.exports
    }
}]);
//# sourceMappingURL=login.fbffc1f9.js.map
