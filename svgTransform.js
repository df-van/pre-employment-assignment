const React = require("react");

module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: `
        const React = require("react");
        const SvgComponent = (props) => React.createElement("svg", props, "Mocked SVG");
        module.exports = SvgComponent;
        module.exports.ReactComponent = SvgComponent;
      `,
    };
  },
  getCacheKey() {
    return "svg-transform";
  },
};
