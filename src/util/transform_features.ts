import { scaleLinear } from "d3-scale";

export type FeatureTransitions = {
    transitioning: boolean; // Master flag for whether any transitions are happening
    transitions: Map<string, any>; // Map of transitions
};

export const calculateFeatureTransitions = (
    feature: any,
) => {
    const source = feature.source;
    const transitions: {
        [key: string]: {
            current: number;
            scale: any;
            transitioning: boolean;
        }
    } = {};
    
    const now = Date.now();

    transitions[source] = {
        current: 8,
        scale: scaleLinear()
            .domain([now, now + 10000])
            .range([8, 16]),
        transitioning: true
    };

    return transitions;
};

export const updateFeatureTransitions = (feature: any) => {
    const transitions = feature.state.transitions; // Now an object instead of Map
    const now = Date.now();
    
    if (transitions) {
        for (const key of Object.keys(transitions)) {
            const transition = transitions[key];
            const endTime = transition.scale.domain()[1];
            
            if (now >= endTime) {
                delete transitions[key];
            } else {
                transition.current = transition.scale(now);
                transitions[key] = transition;
            }
        }
    }
    
    return transitions || {};
};

