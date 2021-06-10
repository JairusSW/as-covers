"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Covers = exports.CoverPoint = exports.CoverPointType = void 0;
var tableConfig = {
    border: {
        topBody: "\u2500",
        topJoin: "\u252C",
        topLeft: "\u250C",
        topRight: "\u2510",
        bottomBody: "\u2500",
        bottomJoin: "\u2534",
        bottomLeft: "\u2514",
        bottomRight: "\u2518",
        bodyLeft: "\u2502",
        bodyRight: "\u2502",
        bodyJoin: "\u2502",
        joinBody: "\u2500",
        joinLeft: "\u251C",
        joinRight: "\u2524",
        joinJoin: "\u253C",
    },
};
var table_1 = require("table");
var linecol = function (point) { return point.line + ":" + point.col; };
var CoverPointType;
(function (CoverPointType) {
    CoverPointType[CoverPointType["Function"] = 0] = "Function";
    CoverPointType[CoverPointType["Block"] = 1] = "Block";
    CoverPointType[CoverPointType["Expression"] = 2] = "Expression";
})(CoverPointType = exports.CoverPointType || (exports.CoverPointType = {}));
var CoverPoint = /** @class */ (function () {
    function CoverPoint(file, line, col, id, type) {
        this.file = file;
        this.line = line;
        this.col = col;
        this.id = id;
        this.type = type;
        this.covered = false;
    }
    return CoverPoint;
}());
exports.CoverPoint = CoverPoint;
var CoverPointReport = /** @class */ (function () {
    function CoverPointReport(fileName) {
        this.fileName = fileName;
        this.coverPoints = [];
        this.calculated = false;
        this.total = 0;
        this.totalCovered = 0;
        this.expressionTotal = 0;
        this.expressionCovered = 0;
        this.expressionCoveredFinite = true;
        this.blockTotal = 0;
        this.blockCovered = 0;
        this.blockCoveredFinite = true;
        this.functionTotal = 0;
        this.functionCovered = 0;
        this.functionCoveredFinite = true;
    }
    CoverPointReport.prototype.calculateStats = function () {
        var e_1, _a;
        if (this.calculated) {
            return;
        }
        try {
            for (var _b = __values(this.coverPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
                var point = _c.value;
                var covered = point.covered ? 1 : 0;
                this.total++;
                this.totalCovered += covered;
                switch (point.type) {
                    case CoverPointType.Expression: {
                        this.expressionTotal++;
                        this.expressionCovered += covered;
                        break;
                    }
                    case CoverPointType.Block: {
                        this.blockTotal++;
                        this.blockCovered += covered;
                        break;
                    }
                    case CoverPointType.Function: {
                        this.functionTotal++;
                        this.functionCovered += covered;
                        break;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.calculated = true;
        if (this.blockTotal === 0)
            this.blockCoveredFinite = false;
        if (this.expressionTotal === 0)
            this.expressionCoveredFinite = false;
        if (this.functionTotal === 0)
            this.functionCoveredFinite = false;
    };
    Object.defineProperty(CoverPointReport.prototype, "coveredPercent", {
        get: function () {
            this.calculateStats();
            if (this.totalCovered === 0)
                return 100;
            return Math.round(10 * (this.totalCovered / this.total) * 100) / 10;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoverPointReport.prototype, "coveredBlockPercent", {
        get: function () {
            this.calculateStats();
            if (this.blockTotal === 0)
                return 100;
            return Math.round(10 * (this.blockCovered / this.blockTotal) * 100) / 10;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoverPointReport.prototype, "coveredExpressionPercent", {
        get: function () {
            this.calculateStats();
            if (this.expressionTotal === 0)
                return 100;
            return (Math.round(10 * (this.expressionCovered / this.expressionTotal) * 100) /
                10);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoverPointReport.prototype, "coveredFunctionPercent", {
        get: function () {
            this.calculateStats();
            if (this.functionTotal === 0)
                return 100;
            return (Math.round(10 * (this.functionCovered / this.functionTotal) * 100) / 10);
        },
        enumerable: false,
        configurable: true
    });
    return CoverPointReport;
}());
var Covers = /** @class */ (function () {
    function Covers() {
        this.coverPoints = new Map();
    }
    Covers.prototype.installImports = function (imports) {
        imports.__asCovers = {
            cover: this.cover.bind(this),
            coverDeclare: this.coverDeclare.bind(this),
        };
        return imports;
    };
    Covers.prototype.registerLoader = function (loader) {
        this.loader = loader;
    };
    Covers.prototype.coverDeclare = function (filePtr, id, line, col, coverType) {
        var filePath = this.loader.exports.__getString(filePtr);
        var coverPoint = new CoverPoint(filePath, line, col, id, coverType);
        //if (this.coverPoints.has(id))
        //throw new Error("Cannot add dupliate cover point.");
        this.coverPoints.set(id, coverPoint);
    };
    Covers.prototype.cover = function (id) {
        if (!this.coverPoints.has(id))
            throw new Error("Cannot cover point that does not exist.");
        var coverPoint = this.coverPoints.get(id);
        coverPoint.covered = true;
    };
    Covers.prototype.reset = function () {
        this.coverPoints.clear();
    };
    Covers.prototype.createReport = function () {
        var e_2, _a;
        var results = new Map();
        try {
            for (var _b = __values(this.coverPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), _ = _d[0], coverPoint = _d[1];
                var fileName = coverPoint.file;
                if (!results.has(fileName))
                    results.set(fileName, new CoverPointReport(fileName));
                // Ensure it exists
                var report = results.get(fileName);
                // Grab report
                report.coverPoints.push(coverPoint);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return results;
    };
    Covers.prototype.stringify = function () {
        var report = this.createReport();
        return table_1.table(__spreadArray([
            ["File", "Total", "Block", "Func", "Expr", "Uncovered"]
        ], __read(Array.from(report).map(function (_a) {
            var _b = __read(_a, 2), file = _b[0], rep = _b[1];
            var uncoveredPoints = rep.coverPoints.filter(function (val) { return !val.covered; });
            return [
                file,
                rep.coveredPercent + "%",
                rep.coveredBlockPercent + "%",
                rep.coveredFunctionPercent + "%",
                rep.coveredExpressionPercent + "%",
                uncoveredPoints.length > 6
                    ? uncoveredPoints.slice(0, 6).map(linecol).join(", ") + ",..."
                    : uncoveredPoints.map(linecol).join(", "),
            ];
        }))), tableConfig);
    };
    // Output as a JSON object. Useful for viewing and manipulating results.
    Covers.prototype.toJSON = function () {
        var e_3, _a, e_4, _b;
        var report = this.createReport();
        var result = {};
        try {
            for (var _c = __values(report.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), path = _e[0], reportEntry = _e[1];
                var coveredPoints = reportEntry.coverPoints.filter(function (val) { return val.covered; });
                var uncoveredPoints = reportEntry.coverPoints.filter(function (val) { return !val.covered; });
                // @ts-ignore
                result['overview'] = {
                    covered: coveredPoints.length,
                    uncovered: uncoveredPoints.length,
                    types: {
                        block: (reportEntry.blockCoveredFinite ? reportEntry.coveredBlockPercent : "N/A") + "%",
                        function: (reportEntry.functionCoveredFinite ? reportEntry.coveredFunctionPercent : "N/A") + "%",
                        expression: (reportEntry.expressionCoveredFinite ? reportEntry.coveredExpressionPercent : "N/A") + "%",
                    }
                };
                // @ts-ignore
                if (!result[path])
                    result[path] = {};
                try {
                    for (var _f = (e_4 = void 0, __values(reportEntry.coverPoints)), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var coverPoint = _g.value;
                        // @ts-ignore
                        var data = result[path][coverPoint.file + ":" + coverPoint.line + ":" + coverPoint.col] = {};
                        // @ts-ignore
                        data['covered'] = coverPoint.covered;
                        // @ts-ignore
                        data['id'] = coverPoint.id;
                        // @ts-ignore
                        data['file'] = coverPoint.file;
                        // @ts-ignore
                        data['column'] = coverPoint.col;
                        // @ts-ignore
                        data['line'] = coverPoint.line;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
    return Covers;
}());
exports.Covers = Covers;
//# sourceMappingURL=index.js.map