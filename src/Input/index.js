/*global gapi*/

import React, { Component } from 'react';
import QrReader from 'react-qr-scanner'

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID
class App extends Component {
  constructor() {
    super()
    this.handleAuthClick = this.handleAuthClick.bind(this)
    this.listMajors = this.listMajors.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleClassChange = this.handleClassChange.bind(this)
    this.handleWeekChange = this.handleWeekChange.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.resetScan = this.resetScan.bind(this)
    this.state = {
      input: "",
      class: "Ấu nhi 01",
      week: "2",
      scanResult: null
    }
  }

  handleAuthClick() {
    window.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      window.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      window.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  async listMajors() {
    let response;
    try {
      // Fetch first 10 files
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Chiên con 01!A1:E4',
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const range = response.result;
    console.log(range)
    if (!range || !range.values || range.values.length === 0) {
      document.getElementById('content').innerText = 'No values found.';
      return;
    }
    // Flatten to string to display
    const output = range.values.reduce(
      (str, row) => `${str}${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}\n`,
      '');
    document.getElementById('content').innerText = output;
  }


  updateValues(_values, callback) {
    let values = [
      [
        // Cell values ...
      ],
      // Additional rows ...
    ];
    values = _values;
    const body = {
      values: values,
    };
    const sheet = this.state.class
    const row = Number(this.state.scanResult) + 1
    const column = String.fromCharCode(69 + Number(this.state.week) - 2)
    const range = `${sheet}!${column}${row}`
    try {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        // range: "Chiên con 01!E2",
        range,
        valueInputOption: "USER_ENTERED",
        resource: body,
      }).then((response) => {
        const result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
        if (callback) callback(response);
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
  }

  handleInputChange(e) {
    this.setState({
      input: e.target.value
    })
  }

  handleClassChange(e) {
    this.setState({
      class: e.target.value
    })
  }

  handleWeekChange(e) {
    this.setState({
      week: e.target.value
    })
  }

  handleScan(data) {
    this.setState({
      scanResult: data?.text
    })
  }
  handleError(err) {
    console.error(err)
  }

  resetScan() {
    this.setState({
      scanResult: null
    })
  }


  render() {
    return (
      <div className="App">
        <button onClick={this.handleAuthClick}>Đăng nhập</button>
        <button onClick={this.listMajors}>Get data</button>
        <div>
          <label for="class">Lớp:</label>

          <select name="class" id="class" onChange={this.handleClassChange}>
            <option value="Ấu nhi 01">Ấu nhi 01</option>
            <option value="Ấu nhi 02">Ấu nhi 02</option>
            <option value="Ấu nhi 03">Ấu nhi 03</option>
          </select>
        </div>
        <div>
          <label for="week">Tuần:</label>

          <select name="week" id="week" onChange={this.handleWeekChange}>
            <option value="2">Tuần 2</option>
            <option value="3">Tuần 3</option>
            <option value="4">Tuần 4</option>
          </select>
        </div>
        <pre id="content"></pre>
        {!!!this.state.scanResult ?
          <QrReader
            facingMode={"user"}
            style={{
              height: 240,
              width: 320,
            }}
            onError={this.handleError}
            onScan={this.handleScan}
          />
          : <div>
            <label for="value" id="value">Tổng hoa thiêng:</label>
            <input name="value" type="number" onChange={this.handleInputChange} />
            <button onClick={() => this.updateValues([[Number(this.state.input)]], this.resetScan)} >Update</button>
          </div>
        }
      </div>
    );
  }
}

export default App;
