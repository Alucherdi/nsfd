const nsfwjs = require("nsfwjs");
const tf = require("@tensorflow/tfjs-node");
const { default: axios } = require("axios");

let model;
nsfwjs.load().then(r => model = r);

module.exports = async function(msg) {
  for (const attachment of msg.attachments) {
    if (!attachment[1].url) break;

    let img = await axios.get(attachment[1].url, {
      responseType: "arraybuffer"
    });

    img = tf.node.decodeImage(img.data, 3);
    const prediction = await model.classify(img);

    if (["Porn", "Sexy"].includes(prediction[0].className)) {
      msg.delete();
      break;
    }
  }
}
