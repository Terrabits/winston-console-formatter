const utils = require('./utils');
const yamlifyObject = require('yamlify-object');
const yamlifyColors = require('yamlify-object-colors');
const Message = require('./message');
const Colorizer = require('./colorizer');

function configuredFormatter({ colors, types = yamlifyColors }) {
  /**
   * @param {Object} options
   * @return {string}
   */
  return function formatter(options) {
    const { meta, level, label, message, timestamp } = options;

    const { from, stack, trace, message: objectMessage } = meta;

    delete meta.from;
    delete meta.message;
    delete meta.stack;
    delete meta.trace;

    let formattedMessage = new Message()
      .setColorizer(new Colorizer(colors))
      .setTime(timestamp)
      .setLabel(label)
      .setLevel(level)
      .setFrom(from)
      .setMessage(message || objectMessage)
      .toString();

    formattedMessage += utils.getStackTrace(stack || trace);
    formattedMessage += yamlifyObject(meta, {
      colors: types,
      indent: '  ',
    });

    return formattedMessage;
  };
}

module.exports = function config(options = {}) {
  return {
    timestamp: utils.getISOTime,
    formatter: configuredFormatter(options),
  };
};
