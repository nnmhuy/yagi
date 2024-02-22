import React, { Component } from "react";
import QRCode from "react-qr-code";

class App extends Component {
  state = {
    value: "Hello, World!",
  };

  onImageCownload = () => {
    const svg = document.getElementById("QRCode");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  onValueChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        <div>
          <div>
            <QRCode id="QRCode" title="Custom Title" value={value} />
          </div>
          <div>
            <input type="button" value="Download QR" onClick={this.onImageCownload} />
            <input type="number" value={value} onChange={this.onValueChange} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;