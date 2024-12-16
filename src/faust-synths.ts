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