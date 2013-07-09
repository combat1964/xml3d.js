(function(){

/**
 * @constructor
 * @param {Xflow.DataNode} dataNode
 * @param {Array.<string>} filter
 */
Xflow.Result = function(){
    this.loading = false;
    this.valid = false;
    this._listeners = [];
};
var Result = Xflow.Result;

/**
 * @param {function(Xflow.Result, Xflow.RESULT_STATE)} callback
 */
Result.prototype.addListener = function(callback){
    this._listeners.push(callback);
};

/**
 * @param {function(Xflow.Result, Xflow.RESULT_STATE)} callback
 */
Result.prototype.removeListener = function(callback){
    Array.erase(this._listeners, callback);
};

Result.prototype.notifyChanged = function(state){
    this.valid = false;
    for(var i = 0; i < this._listeners.length; ++i){
        this._listeners[i](this, state);
    }
}


/**
 * @constructor
 * @extends {Xflow.Result}
 */
Xflow.ComputeResult = function(){
    Xflow.Result.call(this);
    this._outputNames = [];
    /** @type {Object.<string,DataEntry>} */
    this._dataEntries = {};
};
Xflow.createClass(Xflow.ComputeResult, Xflow.Result);
var ComputeResult = Xflow.ComputeResult;

Object.defineProperty(ComputeResult.prototype, "outputNames", {
    set: function(v){
        throw new Error("outputNames is readonly");
    },
    get: function(){ return this._outputNames; }
});

ComputeResult.prototype.getOutputData = function(name){
    return this._dataEntries[name];
};

/**
 * @returns {Object.<string,DataEntry>}
 */
ComputeResult.prototype.getOutputMap = function() {
    return this._dataEntries;
};



    /**
 * @constructor
 * @extends {Xflow.Result}
 */
Xflow.VertexShaderResult = function(){
    Xflow.Result.call(this);
    this._shaderInputNames = null;
    this._uniform = []
    this._dataEntries = {};
    this._glslCode;
};
Xflow.createClass(Xflow.VertexShaderResult, Xflow.Result);
var VertexShaderResult = Xflow.VertexShaderResult;

Object.defineProperty(VertexShaderResult.prototype, "shaderInputNames", {
    set: function(v){
        throw new Error("shaderInputNames is readonly");
    },
    get: function(){ return this._outputNames; }
});

ComputeResult.prototype.getShaderInputData = function(name){
    return this._dataEntries[name];
};

ComputeResult.prototype.isShaderInputUniform = function(name){
    return this._uniform[name];
}

ComputeResult.prototype.getGLSLCode = function(){
    return this._glslCode;
}



})();
