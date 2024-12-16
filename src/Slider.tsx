import { FormEventHandler, useCallback, useEffect, useRef } from "react";
// import styled from "styled-components";
import * as RSlider from "@radix-ui/react-slider";

export const Slider = ({
  label,
  id,
  min,
  max,
  step,
  defaultValue,
  onChange,
  className,
  orientation,
}: {
  label?: string;
  id?: string;
  min: string;
  max: string;
  step: string;
  defaultValue: string;
  onChange?: (value: number) => void;
  className?: string;
  orientation?: "horizontal" | "vertical" | undefined;
}) => (
  <RSlider.Root
    className="SliderRoot"
    defaultValue={[Number(defaultValue)]}
    min={Number(min)}
    max={Number(max)}
    orientation={orientation ?? "horizontal"}
    step={Number(step)}
    onValueChange={(val) => {
      console.log("###", val);
      onChange?.(val[0]);
    }}
  >
    <RSlider.Track className="SliderTrack">
      <RSlider.Range className="SliderRange" />
    </RSlider.Track>
    <RSlider.Thumb className="SliderThumb" />
  </RSlider.Root>
);

export const VerticalSlider = (args: {
  label: string;
  id: string;
  min: string;
  max: string;
  step: string;
  defaultValue: string;
  onChange?: (value: number) => void;
  className?: string;
  orientation?: string;
}) => <Slider {...args} orientation={"vertical"} />;

export const SliderSet = ({
  nodeId,
  onFrequencyChange,
}: {
  nodeId: number;
  onFrequencyChange: (list: number[], nodeId: number) => void;
}) => {
  const freqList = useRef<number[]>(Array.from({ length: 8 }, () => 440));
  const updateFrequency = useCallback(
    (i: number, value: number) => {
      freqList.current[i] = value;
      onFrequencyChange(freqList.current, nodeId);
    },
    [nodeId, onFrequencyChange]
  );

  useEffect(() => {
    onFrequencyChange(freqList.current, nodeId);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "5%" }}>
      {Array.from({ length: 8 }, (_, i) => i).map((_, i) => (
        <VerticalSlider
          key={i}
          label=""
          id={`ampSlider-${nodeId}`}
          min="20"
          max="2000"
          step="1"
          defaultValue="440"
          onChange={(value) => updateFrequency(i, value)}
        />
      ))}
    </div>
  );
};
