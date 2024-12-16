import { Slider, SliderSet } from "./Slider";

const NodeSliders = ({
  nodeId,
  onFrequencyChange,
  onAmplitudeChange,
  onModFreqChange,
  onModDepthChange,
}: {
  nodeId: number;
  onFrequencyChange: (values: number[], nodeId: number) => void;
  onAmplitudeChange: (value: number) => void;
  onModFreqChange: (value: number) => void;
  onModDepthChange: (value: number) => void;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h3>Node {nodeId}</h3>
      {/* <Slider
        label="Frequency"
        id={`freqSlider-${nodeId}`}
        min="20"
        max="2000"
        step="1"
        defaultValue="440"
        onChange={onFrequencyChange}
      /> */}
      <Slider
        label="Amplitude"
        id={`ampSlider-${nodeId}`}
        min="0"
        max="1"
        step="0.01"
        defaultValue="0.5"
        onChange={onAmplitudeChange}
      />
      <Slider
        label="Mod freq"
        id={`ampSlider-${nodeId}`}
        min="0.5"
        max="2000"
        step="1"
        defaultValue="2"
        onChange={onModFreqChange}
      />
      <Slider
        label="Mod depth"
        id={`ampSlider-${nodeId}`}
        min="0"
        max="1"
        step="0.01"
        defaultValue="0.5"
        onChange={onModDepthChange}
      />
      <SliderSet
        nodeId={nodeId}
        onFrequencyChange={(...args) => {
          console.log(args);
          onFrequencyChange(...args);
        }}
      />
    </div>
  );
};

export default NodeSliders;
