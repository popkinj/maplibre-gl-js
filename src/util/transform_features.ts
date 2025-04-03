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
                .domain([now, now + 10000])
                .range([8, 16]),
            transitioning: true
        });
    
    return transitions;
};

// TODO: How do I get the map to update the feature state?
// TODO: If the feature has passed the transition end time the remove the transition from the feature state
export const updateFeatureTransitions = (feature: any) => {
    const transitions = feature.state.transitions; // The Map Set of transitions
    const now = Date.now();
    
    if (transitions) {
        // Loop through all transitions in the set
        for (const [key, transition] of transitions.entries()) {
            // Check if we're past the end of the transition
            console.log('transition', transition);
            console.log('key', key);
            const endTime = transition.scale.domain()[1];
            console.log('endTime', endTime);
            console.log('now', now);
            if (now >= endTime) {
                // Remove the transition if it's complete
                transitions.delete(key);
            } else {
                // Update the current value using the scale
                transition.current = transition.scale(now);
                console.log('transition.current', transition.current);
                transitions.set(key, transition);
            }
        }
    }
    
    return transitions || new Map<string, any>();
};

