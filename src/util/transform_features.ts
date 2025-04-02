import type { Map as MapLibreMap } from "../ui/map";
import { scaleLinear } from "d3-scale";

export type FeatureTransitions = {
    transitioning: boolean; // Master flag for whether any transitions are happening
    transitions: Map<string, any>; // Map of transitions
};

export const calculateFeatureTransitions = (
    feature: any,
) => {
    // Get the feature source
    const source = feature.source;
    const transitions = new Map<
        string,
        {
            current: number;
            scale: any;
            transitioning: boolean;
        }
    >();
        const now = Date.now();

        transitions.set(source, {
            current: 8,
            scale: scaleLinear()
                .domain([now, now + 1000])
                .range([8, 16]),
            transitioning: true
        });
    
    return transitions;
};

// TODO: How do I get the map to update the feature state?
// TODO: If the feature has passed the transition end time the remove the transition from the feature state
export const updateFeatureTransitions = (
    feature: any,
) => {
    const source = feature.source;
    const transitions = feature.transitions;
    const now = Date.now();
    const transition = transitions.get(source);
    transition.current = transition.scale(now);
    transitions.set(source, transition);
    return transitions;
};

