/*! npm.im/gsap-then */ ! function () {
    "use strict";
    window.com.greensock.core.Animation.prototype.then = function (n) {
        var t = this;
        return new Promise(function (n) {
            var e = t.eventCallback("onComplete");
            t.eventCallback("onComplete", function () {
                e && e.apply(this, arguments), n()
            })
        }).then(function () {
            return n(t)
        })
    }
}();