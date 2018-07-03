"use strict";
var Scene = (function () {
    function Scene() {
        this.children = [];
    }
    Scene.prototype.addChild = function (object) {
        this.children.push(object);
    };
    Scene.prototype.removeChild = function (object) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].uuid == object.uuid) {
                this.children.splice(i, 1);
                break;
            }
        }
    };
    return Scene;
}());
