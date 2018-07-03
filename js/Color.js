"use strict";
var Color = (function () {
    function Color(r, g, b) {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        if (g === undefined && b === undefined) {
            this.set(r);
        }
        else {
            this.setRGB(r, g, b);
        }
    }
    Color.prototype.setRGB = function (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    };
    Color.prototype.set = function (value) {
        if (typeof value === "number") {
            this.setHex(value);
        }
    };
    Color.prototype.setHex = function (hex) {
        hex = Math.floor(hex);
        this.r = hex >> 16 & 255;
        this.g = hex >> 8 & 255;
        this.b = hex & 255;
    };
    Color.prototype.interp = function (c, t) {
        var iR = Math.round(_Math.interp(this.r, c.r, t));
        var iG = Math.round(_Math.interp(this.g, c.g, t));
        var iB = Math.round(_Math.interp(this.b, c.b, t));
        return new Color(iR, iG, iB);
    };
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b);
    };
    Color.prototype.swap = function (c) {
        var tmp = c.clone();
        c.r = this.r;
        c.g = this.g;
        c.b = this.b;
        this.r = tmp.r;
        this.g = tmp.g;
        this.b = tmp.b;
    };
    return Color;
}());
