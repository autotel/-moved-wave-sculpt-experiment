extern crate wasm_bindgen;
extern crate synthrs;


use wasm_bindgen::prelude::*;

use synthrs::filter::{
    convolve, cutoff_from_frequency, lowpass_filter, Comb
};

use synthrs::synthesizer::{quantize_samples, make_samples};
use synthrs::wave::sine_wave;

//js uses f64, but Im using i32 because thats more than enough.
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn array_sine(sample_rate: usize, duration: f64, frequency: f64)->Vec<f64>
{
    let sample_count:usize =  (duration * (sample_rate as f64)).ceil() as usize; 
    // Generate a bunch of samples at two different frequencies
    let samples = make_samples(0.5, sample_rate, |t: f64| -> f64 {
        sine_wave(frequency)(t)
    });

    let mut vec = Vec::with_capacity(sample_count);
    for i in 0..sample_count {
        vec.push(samples[i]);
    }

    return vec;
}

#[wasm_bindgen]
pub fn array_filter_comb(
    sample_rate: usize, input_samples: Vec<f64>, 
    frequency: f64, dampening_inverse: f64,
    dampening: f64, feedback: f64

)->Vec<f64>
{
    let delay_time = 1./frequency;

    let mut comb = Comb::new(
        delay_time,
        sample_rate,
        dampening_inverse,
        dampening,
        feedback
    );

    let filtered_raw: Vec<f64> = input_samples
    .into_iter()
    .map(|sample| comb.tick(sample))
    .collect();

    return filtered_raw;
}
