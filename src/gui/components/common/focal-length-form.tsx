import * as React from 'react'
import CameraPresetsDropdown from './../common/camera-presets-dropdown'
import NumericInputField from './../common/numeric-input-field'
import PanelSpacer from './../common/panel-spacer'
import { CameraData } from '../../types/calibration-settings'
import { cameraPresets } from '../../solver/camera-presets'
import strings from '../../strings/strings'

export interface FocalLengthFormProps {
  presetSelectionDisabled?: boolean
  focalLengthInputDisabled?: boolean
  absoluteFocalLength: number
  cameraData: CameraData
  onAbsoluteFocalLengthChange(absoluteFocalLength: number): void
  onCameraPresetChange(cameraPreset: string | null): void
  onSensorSizeChange(width: number | undefined, height: number | undefined): void
}

export default class FocalLengthForm extends React.PureComponent<FocalLengthFormProps> {
  render() {
    let sensorWidth = this.props.cameraData.customSensorWidth
    let sensorHeight = this.props.cameraData.customSensorHeight
    let presetId = this.props.cameraData.presetId
    let presetFocalLength: number | undefined
    if (presetId !== null) {
      let preset = cameraPresets[presetId]
      sensorWidth = preset.sensorWidth
      sensorHeight = preset.sensorHeight
      presetFocalLength = preset.focalLength
    }

    let focalLengthInputDisabled = this.props.focalLengthInputDisabled === true
    if (presetFocalLength) {
      focalLengthInputDisabled = true
    }

    let focalLengthValue = this.props.absoluteFocalLength
    if (presetFocalLength !== undefined) {
      focalLengthValue = presetFocalLength
    }

    // TODO: check presetSelectionDisabled
    return (
      <div>
        <CameraPresetsDropdown
          disabled={this.props.presetSelectionDisabled === true}
          cameraData={this.props.cameraData}
          onPresetChanged={this.props.onCameraPresetChange}
        />
        <PanelSpacer />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Sensor <NumericInputField
          isDisabled={presetId !== null || this.props.presetSelectionDisabled}
          value={sensorWidth}
          onSubmit={(value: number) => { this.props.onSensorSizeChange(value, undefined) }} />
        x
        <NumericInputField
          isDisabled={presetId !== null || this.props.presetSelectionDisabled}
          value={sensorHeight}
          onSubmit={(value: number) => { this.props.onSensorSizeChange(undefined, value) }} /> {strings.unitMm}
        </div>
        <PanelSpacer />
        Focal length <NumericInputField
          precision={2}
          isDisabled={focalLengthInputDisabled}
          value={ focalLengthValue }
          onSubmit={this.props.onAbsoluteFocalLengthChange}
        /> mm
        { this.renderFocalLengthSlider(focalLengthValue, presetFocalLength === undefined) }
      </div>
    )
  }

  private renderFocalLengthSlider(focalLength: number, sliderIsEnabled: boolean) {
    if (this.props.focalLengthInputDisabled === true) {
      return null
    }
    return (
      <input disabled={ !sliderIsEnabled } style={{ width: '100%', marginTop: '7px' }} type='range' min='10' max='200' value={focalLength} id='myRange' onChange={ (event) => {
        this.props.onAbsoluteFocalLengthChange(parseFloat(event.target.value))
      }} />
    )
  }
}
