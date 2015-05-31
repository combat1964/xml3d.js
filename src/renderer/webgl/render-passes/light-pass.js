var SceneRenderPass = require("./scene-pass.js");
var ObjectSorter = require("../../renderer/tools/objectsorter.js");
var mat4 = require("gl-matrix").mat4;

/**
 * @param {GLRenderInterface} renderInterface
 * @param {string} output
 * @param {RenderLight} light
 * @param {*} opt
 * @extends {SceneRenderPass}
 * @constructor
 */
var LightPass = function (renderInterface, output, light, opt) {
    SceneRenderPass.call(this, renderInterface, output, opt);
    this.light = light;
    this.program = null;
};

XML3D.createClass(LightPass, SceneRenderPass, {

    init: function (context) {
        this.sorter = new ObjectSorter();
        this.program = context.programFactory.getProgramByName("light-depth");
    },

    renderScene: function() {
        this.render(this.light.scene);
    },

    render: (function () {
        var c_viewMat_tmp = mat4.create();
        var c_projMat_tmp = mat4.create();
        var c_programSystemUniforms = ["viewMatrix", "projectionMatrix"];

        return function (scene) {
            var gl = this.renderInterface.context.gl, target = this.output, width = target.getWidth(), height = target.getHeight(), aspect = width / height, frustum = this.light.getFrustum(aspect), program = this.program;

            target.bind();
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.polygonOffset(4.0, -20.0);          // Set the polygon offset

            var count = {objects: 0, primitives: 0};

            this.light.model.getLightViewMatrix(c_viewMat_tmp);
            frustum.getProjectionMatrix(c_projMat_tmp, aspect);

            scene.updateReadyObjectsFromLightView(this.light.model, frustum, c_viewMat_tmp, c_projMat_tmp);
            var objects = this.sorter.sortScene(scene);

            var parameters = {};
            parameters["viewMatrix"] = c_viewMat_tmp;
            parameters["projectionMatrix"] = c_projMat_tmp;

            //Render opaque objects
            for (var shader in objects.opaque) {
                this.renderObjectsToActiveBuffer(objects.opaque[shader], scene, target, parameters, c_programSystemUniforms, {
                    transparent: false, stats: count, program: program
                });
            }

            gl.polygonOffset(0, 0);          // Set the polygon offset
            gl.disable(gl.POLYGON_OFFSET_FILL);
            // Do not render transparent objects (considered to not throw shadows
            target.unbind();
            return {count: count};
        }
    }())
});

module.exports = LightPass;

