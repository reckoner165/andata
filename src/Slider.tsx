import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

// Slider component
export const Slider = ({
  label,
  id,
  min,
  max,
  step,
  defaultValue,
  onChange,
  className,
}: {
  label: string;
  id: string;
  min: string;
  max: string;
  step: string;
  defaultValue: string;
  onChange?: (value: number) => void;
  className?: string;
}) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onInput={(e) =>
          onChange?.(parseFloat((e.target as HTMLInputElement).value))
        }
      />
    </div>
  );
};

export const VerticalSlider = styled(Slider)`
  width: 50px;
  input[type="range"] {
    -webkit-appearance: slider-vertical;
    appearance: slider-vertical;
  }
`;

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
    <div style={{ display: "flex", flexDirection: "row" }}>
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
