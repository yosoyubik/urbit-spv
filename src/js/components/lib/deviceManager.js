// From: https://github.com/bcoin-org/bledger/blob/master/examples/webusb/index.js

import EventEmitter from 'eventemitter3';
const { Device } = window.BLedger.USB;
const usb = navigator.usb;


export default class DeviceManager extends EventEmitter {
  constructor() {
    super();
    this.devices = new Set();
    this.wusbToDevice = new Map();
    this.selected = null;

    // callbacks for event listener to clean up later.
    this._addDevice = null;
    this._removeDevice = null;
  }

  bind() {
    console.log("binding", usb);
    this._addDevice = async (event) => {
      console.log("_addDevice", event);
      const device = Device.fromDevice(event.device);
      await this.addDevice(device);
      this.emit('connect', device);
    };

    this._removeDevice = async (event) => {
      const device = Device.fromDevice(event.device);
      await this.removeDevice(device);
      this.emit('disconnect', device);
    };

    usb.addEventListener('onconnect', this._addDevice);
    usb.addEventListener('ondisconnect', this._removeDevice);
    usb.addEventListener('connect', this._addDevice);
    usb.addEventListener('disconnect', this._removeDevice);
  }

  unbind() {
    assert(this._addDevice);
    assert(this._removeDevice);

    usb.removeEventListener('connect', this._addDevice);
    usb.removeEventListener('disconnect', this._removeDevice);

    this._addDevice = null;
    this._removeDevice = null;
  }

  async open() {
    console.log("open");
    const devices = await Device.getDevices();
    console.log(devices);
    for (const device of devices)
      await this.addDevice(device);

    this.bind();
  }

  async close() {
    this.unbind();
    this.reset();
  }

  reset() {
    this.devices = new Set();
    this.wusbToDevice = new Map();
    this.selected = null;
  }

  async addDevice(device) {
    assert(device instanceof Device, 'Could not add device.');

    if (this.wusbToDevice.has(device.device))
      return this.wusbToDevice.get(device.device);

    this.wusbToDevice.set(device.device, device);
    this.devices.add(device);

    return device;
  }

  async removeDevice(device) {
    assert(device.device, 'Could not find device.');
    if (!Device.isLedgerDevice(device.device))
      return;

    const mappedDevice = this.wusbToDevice.get(device.device);

    if (!mappedDevice)
      return;

    if (this.selected && this.selected.device === mappedDevice.device)
      await this.closeDevice(this.selected);

    this.devices.delete(mappedDevice);
    this.wusbToDevice.delete(mappedDevice.device);

    return;
  }

  getDevices() {
    return this.devices.values();
  }

  /**
   * Only User Action can have an access to this.
   * Otherwise this will fail.
   */

  async requestDevice() {
    const device = await Device.requestDevice();

    return this.addDevice(device);
  }

  async openDevice(device, timeout = 20000) {
    assert(!this.selected, 'Other device already in use.');
    assert(this.devices.has(device), 'Could not find device.');

    this.selected = device;

    device.set({ timeout });

    try {
      await this.selected.open();
      this.emit('device open', this.selected);
    } catch (e) {
      console.error(e);
      this.selected = null;
    }

    return this.selected;
  }

  async closeDevice(device) {
    assert(this.selected, 'No device in use.');
    assert(this.devices.has(device), 'Could not find device.');
    assert(this.selected === device,
      'Can not close closed non-selected device.');

    if (this.selected.opened)
      await this.selected.close();

    this.emit('device close', this.selected);

    this.selected = null;
  }
}
