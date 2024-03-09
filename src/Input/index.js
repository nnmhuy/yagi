/*global gapi*/

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import QrReader from 'react-qr-scanner'
import { object, string, number } from 'yup';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import StudentLog from './StudentLog'

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID

const WEEKS = [
  { value: 0, name: "Tuần 02 (CN, 25/02)" },
  { value: 1, name: "Tuần 03 (CN, 03/03)" },
  { value: 2, name: "Tuần 04 (CN, 10/03)" },
  { value: 3, name: "Tuần 05 (CN, 17/03)" },
  { value: 4, name: "Tuần 06 (CN, 21/03)" },
  { value: 5, name: "Tổng hoa thiêng" },
]


let studentDataSchema = object({
  name: string().required(),
  id: number().required().positive().integer(),
  class: string().required()
});

const Container = styled(Box)({
  width: "100vw",
  height: "100vh",
})

const Background = styled(Box)({
  position: "fixed",
  zIndex: -1,
  width: "100vw",
  height: "100vh",
  backgroundImage: `url("https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-6/359835501_294613576291168_233522295257806940_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeE1DkBdw1_3rDW2tYI9J1luzsBErn-cABTOwESuf5wAFJ4Edw_429MErl05851zmdp2AdWR0qmAZTOr6kGLQ052&_nc_ohc=urjRrVnb-bIAX9d9YAS&_nc_oc=AQnIXT7ghOXyw5t0T_JtyqbFkZjdDPCVxAYsh5pC4m6jHM_g3Dy8GukcXnoNBWZCmXE&_nc_ht=scontent.fhan3-5.fna&oh=00_AfBAJ7TjHiXgyLKmFTpLmFfmU5BkG3LAGpG9jDzKG_qF2A&oe=65DF1F6F")`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  opacity: 0.2
})

function createData(week, value) {
  return { week, value };
}


const Input = () => {
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const handleOpenSnackbar = (msg) => {
    setSnackbarMsg(msg)
  };

  const handleCloseSnackbar = () => {
    setSnackbarMsg("");
  };


  const [week, setWeek] = useState(() => {
    let date = new Date()
    date.setDate(date.getDate() - 1) //yesterday
    const firstSunday = new Date(2024, 1, 25); // the month is 0-indexed

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round((date - firstSunday) / oneDay);
    return Math.floor(Math.max(0, diffDays) / 7)
  })

  const [student, setStudent] = useState(null)
  const [studentData, setStudentData] = useState([])
  const [result, setResult] = useState("")

  const handleWeekChange = (event) => {
    setWeek(event.target.value)
  }

  const getStudentData = async (studentClass, id) => {
    const sheet = studentClass
    const row = Number(id) + 1
    const range = `${sheet}!E${row}:J${row}`

    try {
      if (!gapi || !gapi.client || !gapi.client.sheets) return
      const data = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
      }).then((response) => {
        const result = response.result;
        return result.values[0]
      });
      let studentData = []
      data.forEach((d, index) => {
        studentData.push(createData(WEEKS[index].name, d))
      })
      setStudentData(studentData)
    } catch (err) {
      console.log(err)
      // setSnackbarMsg("Hết phiên. Vui lòng đăng nhập lại.")
      // localStorage.removeItem("token")
      // window.location = "/"
      return;
    }
  }

  const handleScan = (data) => {
    if (student !== null) return
    if (data === null) return
    if (!!!data?.text) return
    const obj = JSON.parse(data?.text)
    try {
      studentDataSchema.validateSync(obj)
      getStudentData(obj.class, obj.id)
    } catch (error) {
      handleOpenSnackbar("Mã QR không hợp lệ")
      return
    }

    setStudent(obj)
  }

  const handleScanError = (err) => {
    console.error(err)
  }

  const resetScan = () => {
    setStudent(null)
    setResult("")
  }


  const submitStudentResult = async (callback) => {
    if (!student) return
    let values = [
      [
        Number(result)
      ],
    ];
    const body = {
      values: values,
    };
    const sheet = student.class
    const row = Number(student.id) + 1
    const column = String.fromCharCode(69 + Number(week))
    const range = `${sheet}!${column}${row}`
    try {
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        // range: "Chiên con 01!E2",
        range,
        valueInputOption: "USER_ENTERED",
        resource: body,
      }).then((response) => {
        const result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
        setSnackbarMsg("Cập nhật thành công")
        if (callback) callback(response);
      });
    } catch (err) {
      console.log(err)
      setSnackbarMsg("Hết phiên. Vui lòng đăng nhập lại.")
      localStorage.removeItem("token")
      window.location = "/"
      return;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setSnackbarMsg("Chưa đăng nhập")
      window.location = "/"
    }
    if (gapi && gapi?.client)
      gapi.client.setToken(JSON.parse(token))
  }, [gapi])

  useEffect(() => {
    const storedDeviceId = localStorage.getItem("deviceId")
    if (storedDeviceId) setDeviceId(storedDeviceId)
  }, [])


  const [deviceId, setDeviceId] = useState("")

  const resultValueError = !result || result > 6 || result < 0

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: "column" }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={!!snackbarMsg}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMsg}
        action={<IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleCloseSnackbar}
        >
          <CloseIcon fontSize="small" />
        </IconButton>}
      />
      <Background />
      <Typography variant="h6" sx={{ color: "brown", marginTop: 5 }}>
        Chiến dịch Mùa Chay 2024
      </Typography>
      <Typography variant="h5" sx={{ m: 1, color: "purple" }}>
        HOÁN ĐỔI VÀ CANH TÂN
      </Typography>
      <Box>
        <FormControl sx={{ m: 1, minWidth: 300 }}>
          <InputLabel id="week-select-label">Tuần</InputLabel>
          <Select
            labelId="week-select-label"
            id="week-select"
            value={week}
            label="Tuần"
            onChange={handleWeekChange}
          >
            <MenuItem value={0}>Tuần 02 (CN, 25/02)</MenuItem>
            <MenuItem value={1}>Tuần 03 (CN, 03/03)</MenuItem>
            <MenuItem value={2}>Tuần 04 (CN, 10/03)</MenuItem>
            <MenuItem value={3}>Tuần 05 (CN, 17/03)</MenuItem>
            <MenuItem value={4}>Tuần 06 (CN, 21/03)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        {!!!student &&
          <Box>
            <Typography variant='body1' sx={{ color: 'blue' }}>Quét mã QR trên phiếu hoa thiêng</Typography>
            <Box sx={{ margin: 1, border: 'black 1px dashed', p: 2 }}>
              {!!deviceId && <QrReader
                constraints={{
                  audio: false, video: {
                    deviceId,
                    facingMode: { ideal: 'environment' }
                  }
                }}
                style={{
                  maxHeight: 320,
                  maxWidth: 320,
                }}
                onError={handleScanError}
                onScan={handleScan}
              />}
            </Box>
          </Box>
        }
        <Modal
          open={!!student}
          onClose={resetScan}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 1,
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {student?.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Lớp: {student?.class} <br />
              STT: {student?.id} <br />
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={() => {
                if (!resultValueError) submitStudentResult(resetScan)
              }}
              sx={{ display: 'flex' }}
            >
              <TextField
                error={resultValueError}
                id="outlined-basic"
                label="Nhập hoa thiêng tuần"
                fullWidth
                autoFocus
                variant="outlined"
                value={result}
                type="number"
                onChange={(e) => setResult(e.target.value)}
                sx={{ mt: 2 }}
                helperText={resultValueError && "Giá trị không hợp lệ"}
              />
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => submitStudentResult(resetScan)}
                size='large'
                color='primary'
                disabled={resultValueError}
              >
                <SaveIcon fontSize='inherit' />
              </IconButton>
            </Box>
            <Box>
              <StudentLog studentData={studentData} />
            </Box>
          </Box>
        </Modal>
      </Box>
      <Box sx={{ boxSizing: "border-box", width: "100%", padding: "10px", minHeight: "700px", textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "brown" }}>
          Tổng hợp kết quả hoa thiêng các lớp<br /> <a href="https://docs.google.com/spreadsheets/d/1INz4zcQHHMUi7sULzq6678cmPHu_06CcoDEnydZnqPk">Mở trong google sheet</a>
        </Typography>
        <iframe style={{ width: `100%`, height: "100%" }} src="https://docs.google.com/spreadsheets/d/1INz4zcQHHMUi7sULzq6678cmPHu_06CcoDEnydZnqPk" title="Google sheets"></iframe>
      </Box>
    </Container>
  )
}

export default Input