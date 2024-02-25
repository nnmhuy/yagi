const loadDeviceId = async () => {
  let devices = await navigator.mediaDevices.enumerateDevices();
  let currentDeviceIndex = devices.length - 1
  while (devices[currentDeviceIndex].kind !== "videoinput") --currentDeviceIndex
  localStorage.setItem("deviceId", devices[currentDeviceIndex].deviceId)
}

export { loadDeviceId }