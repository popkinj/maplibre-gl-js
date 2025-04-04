import { scaleLinear } from "d3-scale";

export type FeatureTransitions = {
    transitioning: boolean; // Master flag for whether any transitions are happening
    transitions: Map<string, any>; // Map of transitions
};

export const calculateFeatureTransitions = (
    feature: any,
) => {
    
    const now = Date.now();

    return {
        pointsCircleRadiusCurrent: 8,
        pointsCircleRadiusTransition: false,
        pointsCircleRadiusScale: scaleLinear()
            .domain([now, now + 10000])
            .range([8, 16]),
        pointsCircleRadiusTransitioning: true
    }
};

export const updateFeatureTransitions = (feature: any) => {
    const now = Date.now();

    const state = feature.state;
    const endTime = state.pointsCircleRadiusScale.domain()[1];
    
    if (now >= endTime) {
        delete state.pointsCircleRadiusTransitioning;
        delete state.pointsCircleRadiusScale;
        delete state.pointsCircleRadiusCurrent;
    } else {
        state.pointsCircleRadiusCurrent = state.pointsCircleRadiusScale(now);
    }

    return state;
};

