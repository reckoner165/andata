export const SimpleSawtooth = `
    import("stdfaust.lib");

    freq = hslider("Frequency", 440, 20, 2000, 1);
    amp = hslider("Amplitude", 0.5, 0, 1, 0.01);

    sawOsc = os.sawtooth(freq);         // Fundamental sawtooth wave
    subOsc = os.sawtooth(freq / 2);     // Sub-octave for warmth
    harmonicOsc = os.sawtooth(freq * 2); // Second harmonic for richness

    richSaw = sawOsc + 0.5 * subOsc + 0.25 * harmonicOsc;

    process = richSaw * amp;
    `;


export const FM1 = `
    import("stdfaust.lib");

    freq = hslider("Frequency", 440, 20, 2000, 1);
    amp = hslider("Amplitude", 0.5, 0, 1, 0.01);
    modFreq = hslider("ModFreq", 2, 0.5, 2000, 1); // Modulation frequency
    modDepth = hslider("ModDepth", 0.5, 0, 1, 0.01); // Modulation depth
    modWave = hslider("ModWave", 0, 0, 1, 1); // 0 for sawtooth, 1 for sine

    // Modulator oscillators
    modSaw = os.sawtooth(modFreq); // Sawtooth modulator
    modSine = os.osc(modFreq); // Sine wave modulator
    modulator = (modWave > 0.5) * modSine + (modWave <= 0.5) * modSaw;

    // Carrier oscillator (sawtooth)
    fmSignal = os.sawtooth(freq * (1 + modDepth * modulator)); 

    // Output signal with amplitude control
    process = fmSignal * amp;
`;


// export const MoogFilter = `import("stdfaust.lib");
// cutoff = hslider("Cutoff", 200, 20, 20000, 0.1) : si.smoo;
// q = hslider("Q (Resonance)", 4, 0.1, 10, 0.01) : si.smoo; // Default Q is 0.707 (Butterworth)

// // Process: Apply a biquad low-pass filter
// process = fi.resonlp(cutoff, q, 1);`;


export const MoogFilter = `
import("stdfaust.lib");

// Simple one-pole low-pass filter (corrected)
lowpass(cutoff) = si.smooth(ba.tau2pole(1.0/(2.0*ma.PI*cutoff)));

// Saturation function
saturation(x) = ma.tanh(x);

// Ladder filter implementation
ladderFilter(cutoff, res) = stage4
with {
    stage1 = _ : lowpass(cutoff) : saturation;
    stage2 = _ : lowpass(cutoff) : saturation;
    stage3 = _ : lowpass(cutoff) : saturation;
    stage4 = _ : lowpass(cutoff) : saturation;
};

// Main process
process = _ <: ladderFilter(
    hslider("Cutoff", 1000, 20, 20000, 1),
    hslider("Resonance", 0.5, 0, 1, 0.01)
);

`