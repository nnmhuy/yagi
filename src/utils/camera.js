const loadDeviceId = async () => {
  let devices = await navigator.mediaDevices.enumerateDevices();
  // if (devices.length === 0 || devices[0].deviceId === "") {
  //   await navigator.mediaDevices.getUserMedia({ video: true });
  // }
  let currentDeviceIndex = devices.length - 1
  while (devices[currentDeviceIndex].kind !== "videoinput") --currentDeviceIndex
  let videoInputDevices = devices.filter(device => device.kind === "videoinput")
  console.log(devices)
  videoInputDevices = devices
  localStorage.setItem("devices", JSON.stringify(videoInputDevices))
  localStorage.setItem("deviceId", devices[currentDeviceIndex].deviceId)
}

export { loadDeviceId }