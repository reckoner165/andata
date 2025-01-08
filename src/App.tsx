import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import {
  instantiateFaustModuleFromFile,
  LibFaust,
  FaustMonoDspGenerator,
  FaustCompiler,
} from "@grame/faustwasm";

import { CiPower } from "react-icons/ci";
import NodeSliders from "./NodeSliders";
import { FM1, MoogFilter, SimpleSawtooth } from "./faust-synths";

// Main app
const App = () => {
  const [audioContext] = useState(() => new AudioContext());
  const [faustState, setFaustState] = useState<{
    libFaust: LibFaust | null;
    compiler: FaustCompiler | null;
    generator: FaustMonoDspGenerator | null;
  }>({
    libFaust: null,
    compiler: null,
    generator: null,
  });
  const [nodes, setNodes] = useState<number[]>([]);

  const nodeFreqList = useRef<number[][]>([]);

  const sequencer = useRef<number | null>(null);
  const [step, setStep] = useState<number>(0);

  const freqHandlersForNode = useRef<((value: number) => void)[]>([]);

  useEffect(() => {
    sequencer.current = setInterval(() => {
      setStep((step) => (step + 1) % 8);
    }, 250);

    return () => {
      if (sequencer.current) clearInterval(sequencer.current);
      sequencer.current = null;
    };
  }, []);

  useEffect(() => {
    // console.log("### STEP", step, nodeFreqList.current);
    freqHandlersForNode.current.forEach((handler, i) => {
      const currentFreq = nodeFreqList.current[i][step];
      handler(currentFreq);
    });
  }, [step]);

  useEffect(() => {
    const initializeFaust = async () => {
      const faustModule = await instantiateFaustModuleFromFile(
        "../node_modules/@grame/faustwasm/libfaust-wasm/libfaust-wasm.js"
      );
      const libFaust = new LibFaust(faustModule);
      const compiler = new FaustCompiler(libFaust);
      const generator = new FaustMonoDspGenerator();
      setFaustState({ libFaust, compiler, generator });
    };

    initializeFaust();
  }, []);

  const startAudio = () => {
    // audioContext.resume();
    if (audioContext.state === "suspended") {
      // Resume playback
      audioContext.resume();
      console.log("Audio resumed");
    } else if (audioContext.state === "running") {
      // Stop playback
      audioContext.suspend();
      console.log("Audio suspended");
    }
  };

  const addNode = useCallback(async () => {
    if (!faustState.compiler || !faustState.generator) return;

    const { generator, compiler } = faustState;

    // const code = `
    //   import("stdfaust.lib");
    //   freq = hslider("Frequency", 440, 20, 2000, 1);
    //   amp = hslider("Amplitude", 0.5, 0, 1, 0.01);
    //   process = os.osc(freq) * amp;
    // `;

    const code = FM1;
    const argv = ["-I", "libraries/"];
    const name = "oscillator";
    const moogName = "moogFilter";

    await generator.compile(compiler, name, code, argv.join(" "));
    const node = await generator.createNode(audioContext);

    await generator.compile(compiler, moogName, MoogFilter, argv.join(" "));
    const moogFilterNode = await generator.createNode(audioContext);

    if (node && moogFilterNode) {
      const nodeId = nodes.length + 1; // Unique ID for the node
      setNodes((prev) => [...prev, nodeId]);

      node.connect(moogFilterNode);
      moogFilterNode.connect(audioContext.destination);
      // node.start();

      console.log(node.numberOfOutputs); // Should be 1 or more
      console.log(moogFilterNode.numberOfInputs); // Should match the previous node's output
      console.log(moogFilterNode.numberOfOutputs);

      // Bind the parameter update handlers
      const handleFrequencyChange = (value: number) => {
        node.setParamValue("/oscillator/Frequency", value);
      };

      // moogFilterNode.setParamValue("/moogFilter/cutoff", 500); // Set cutoff to 1000 Hz
      // moogFilterNode.setParamValue("/moogFilter/Resonance", 0.7);

      freqHandlersForNode.current[nodeId] = handleFrequencyChange;

      const handleAmplitudeChange = (value: number) => {
        node.setParamValue("/oscillator/Amplitude", value);
      };

      const handleModFreqChange = (value: number) => {
        node.setParamValue("/oscillator/ModFreq", value);
        moogFilterNode.setParamValue("/moogFilter/Cutoff", value);
      };

      const handleModDepthChange = (value: number) => {
        node.setParamValue("/oscillator/ModDepth", value);
      };

      // const targetDiv = document.getElementById(`sliders-${nodeId}`);
      const targetDiv = document.getElementById(`sliders-container`);

      const container = document.createElement("div");
      container.id = `sliders-${nodeId}`;

      targetDiv?.appendChild(container);

      if (targetDiv) {
        const root = createRoot(container);
        root.render(
          // <div key={nodeId} id={`sliders-${nodeId}`}>
          <NodeSliders
            key={nodeId}
            nodeId={nodeId}
            onFrequencyChange={(values, nodeId) => {
              console.log(values);
              nodeFreqList.current[nodeId] = values;
              // console.log("###", nodeFreqList.current);
            }}
            onAmplitudeChange={handleAmplitudeChange}
            onModFreqChange={handleModFreqChange}
            onModDepthChange={handleModDepthChange}
          />
          // </div>
        );
      }
    }
  }, [audioContext, faustState, nodes.length]);

  return (
    <div style={{ width: "60%", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <button
          onClick={startAudio}
          style={{
            backgroundColor:
              audioContext.state === "running" ? "#ff5924" : "#1a1a1a",
          }}
        >
          {/* Start Audio */}
          <CiPower />
        </button>
        <button onClick={addNode}>Add Node</button>
      </div>
      <div id="sliders-container">
        {/* {nodes.map((nodeId) => (
          <div key={nodeId} id={`sliders-${nodeId}`} />
        ))} */}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
