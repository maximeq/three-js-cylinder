(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('three-full/builds/Three.cjs.js')) :
    typeof define === 'function' && define.amd ? define(['three-full/builds/Three.cjs.js'], factory) :
    (global.THREECylinder = factory(global.THREE));
}(this, (function (Three_cjs) { 'use strict';

    Three_cjs = Three_cjs && Three_cjs.hasOwnProperty('default') ? Three_cjs['default'] : Three_cjs;

    const Box3 = Three_cjs.Box3;
    const Vector3 = Three_cjs.Vector3;

    /**
     *  @param {Vector3} v The cylinder origin
     *  @param {Vector3} axis The axis, normalized.
     *  @param {number} radius The cylinder radius
     *  @param {number} sup The maximum distance from v in the axis direction (truncated cylinder). If null or undefined, will be +infinity
     *  @param {number} inf The minimum distance from v in the axis direction (truncated cylinder). if null or undefined, will be 0
     */
    function Cylinder( v, axis, radius, inf, sup ) {

    	this.v = v || new Three_cjs.Vector3();
        this.axis = axis  || new Three_cjs.Vector3(1,0,0);
        this.radius = radius;
        this.inf = inf || 0;
        this.sup = sup || +Infinity;
    }

    Object.assign( Cylinder.prototype, {

    	set: function ( v, axis, radius, inf, sup ) {

    		this.v.copy( v );
    		this.axis.copy( axis );
            this.radius = radius;
            this.inf = inf || 0;
            this.sup = sup || +Infinity;

    		return this;

    	},

    	clone: function () {

    		return new this.constructor().copy( this );

    	},

    	copy: function ( cylinder ) {

    		this.v.copy( cylinder.v );
    		this.axis.copy( cylinder.axis );
            this.radius = cylinder.radius;
            this.inf = cylinder.inf;
            this.sup = cylinder.sup;

    		return this;

    	},

    	empty: function () {

    		return ( this.radius <= 0 || this.inf >= this.sup );

    	},

    	getBoundingBox: function ( target ) {

    		throw "not implemented yet, todo";

    		return target;

    	},

    	equals: function ( cylinder ) {

    		return cylinder.v.equals(this.v) && cylinder.axis.equals(this.axis) && cylinder.radius === this.radius && cylinder.inf === this.inf && cylinder.sup === this.sup;

    	}

    } );

    Three_cjs.Cylinder = Cylinder;

    /**
     *
     * Compute intersections of a ray with a cylinder.
     *
     * @param {!Object} cyl a cylinder truncated which must define :
     *      cyl.v       Origin of the cylinder
     *      cyl.axis    Axis of the cylinder, unit lengthed and oriented
     *      cyl.r       Radius of the cylinder
     *      cyl.inf     All points P such that Dot(axis,P-v) < inf are not considered in the cylinder
     *      cyl.sup     All points P such that Dot(axis,P-v) > sup are not considered in the cylinder
     *  IMPORTANT NOTE : the cylinder is considered truncated but NOT CLOSED. So caps are not tested.
     *                   However, you MUST use this function as if caps do exists.
     *                   So that If someone (you?) is in a situation where caps matters it is possible to
     *                   improve this algorithm without risking to break anything.
     * @param {!Cylinder} cyl
     * @param {!Vector3} target Where to save the resulting hit point, if any.
     * @return {Vector3} The first hit point if any, null otherwise.
     *
     */
    Three_cjs.Ray.prototype.intersectCylinder = (function()
    {
        // function static variables
        var vtos = new Three_cjs.Vector3();
        var tmp  = new Three_cjs.Vector3();
        var tmp1 = new Three_cjs.Vector3();
        var tmp2 = new Three_cjs.Vector3();

        return function( cyl, target)
        {
            vtos.subVectors(this.origin,cyl.v);
            var vtos_dot_ax = vtos.dot(cyl.axis);
            var dir_dot_ax = this.direction.dot(cyl.axis);

            tmp1.set (
                this.direction.x - dir_dot_ax*cyl.axis.x,
                this.direction.y - dir_dot_ax*cyl.axis.y,
                this.direction.z - dir_dot_ax*cyl.axis.z);
            tmp2.set (
                vtos.x - vtos_dot_ax*cyl.axis.x,
                vtos.y - vtos_dot_ax*cyl.axis.y,
                vtos.z - vtos_dot_ax*cyl.axis.z);

            var a = tmp1.lengthSq();
            var b = 2*tmp1.dot(tmp2);
            var c = tmp2.lengthSq() - cyl.radius*cyl.radius;

            var delta = b*b - 4*a*c;
            if(delta < 0){
                return null;
            }else if(delta === 0){
                var t = (-b-Math.sqrt(delta))/(2*a);
                this.at(t,target);

                tmp.subVectors(target,cyl.v);
                var dot = tmp.dot(cyl.axis);
                if(t>0 && dot > cyl.inf && dot < cyl.sup){
                    return target;
                }else{
                    return null;
                }
            }else{
                var sqrt_d = Math.sqrt(delta);
                var t = (-b-sqrt_d)/(2*a);
                this.at(t,target);

                tmp.subVectors(target,cyl.v);
                var dot = tmp.dot(cyl.axis);
                if(t<0 || dot < cyl.inf || dot > cyl.sup){
                    t = Number.MAX_VALUE;
                }

                var t2 = (-b+sqrt_d)/(2*a);
                this.at(t2,tmp2);

                tmp.subVectors(tmp2,cyl.v);
                dot = tmp.dot(cyl.axis);
                if(t2>0 && dot > cyl.inf && dot < cyl.sup){
                    if(t2<t){
                        t = t2;
                        target.copy(tmp2);
                    }
                }

                if(t !== Number.MAX_VALUE){
                    return target;
                }else{
                    return null;
                }
            }
        };
    })();

    var Cylinder_1 = Cylinder;

    return Cylinder_1;

})));
