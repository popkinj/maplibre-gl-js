import type { Map as MapLibreMap } from "../ui/map";
import { scaleLinear } from "d3-scale";

export const updateFeatureTransitions = (
    map: MapLibreMap,
    feature: any,
): any => {
    const featureState = map.getFeatureState(feature);

    // If there's no feature state, nothing to transition
    if (!featureState) return;

    // Get the start and end times for the transition
    const [start, end] = featureState.transitions.get("unclustered-point-circle-radius-transition").scale.domain();
    console.log("start", start);
    console.log("end", end);

    // TODO: Loop through all transitions and update them
    // TODO: if transition is set to false, skip it
    // TODO: If the current time is greater than the end time, set the transition to false and set the current value to the after value
    // TODO: If all transitions are set to false, set the "Global" transitioning flag to false
    // TODO: Reset the feature state

};


export type FeatureTransitions = {
    transitioning: boolean; // Master flag for whether any transitions are happening
    transitions: Map<string, any>; // Map of transitions
};

export type calculateFeatureTransitions = (
    map: MapLibreMap,
    feature: any,
    state: any
) => FeatureTransitions;

/**
 * Calculate the feature transitions for a given feature and state
 * @param map - The map instance
 * @param feature - The feature to calculate transitions for
 * @param state - The state of the feature
 * @returns The feature transitions
 */
export const calculateFeatureTransitions: calculateFeatureTransitions = (
    map: MapLibreMap,
    feature: any,
    state: any
): any => {
    // Get the layers tied to the same feature source
    const layers = map
        .getStyle()
        ?.layers.filter(
            (layer) => "source" in layer && layer.source === feature.source
        );

    const transitions = new Map<
        string,
        {
            start: number;
            end: number;
            before: number;
            after: number;
            current: number;
            scale: any;
            transitioning: boolean;
        }
    >();

    layers?.forEach((layer) => {
        if (!layer.paint) return;

        // Look through paint properties for any ending in -transition
        Object.entries(layer.paint).forEach(([key, value]) => {
            if (
                key.endsWith("-transition") &&
                typeof value === "object" &&
                value !== null
            ) {
                const transitionValue = value as any;
                if (transitionValue.duration) {
                    // Extract the base property name without '-transition'
                    const baseProperty = key.replace("-transition", "");
                    const paintProperty = layer.paint[baseProperty];

                    // Check if the paint property is a case expression array
                    if (
                        paintProperty &&
                        Array.isArray(paintProperty) &&
                        paintProperty[0] === "case"
                    ) {
                        // For case expressions, the before and after values are at index 3 and 2
                        const beforeValue = paintProperty[3];
                        const afterValue = paintProperty[2];



                        const now = Date.now();
                        transitions.set(`${layer.id}-${key}`, {
                            start: now,
                            end: now + transitionValue.duration,
                            before: beforeValue,
                            current: beforeValue,
                            after: afterValue,
                            scale: scaleLinear()
                                .domain([now, now + transitionValue.duration])
                                .range([beforeValue, afterValue]),
                            transitioning: true,
                        });
                    }
                }
            }
        });
    });

    

    return state.hover && transitions.size > 0
        ? { transitioning: true, transitions: transitions }
        : {};
};
