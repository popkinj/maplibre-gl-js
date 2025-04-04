import { scaleLinear } from "d3-scale";

export const calculateFeatureTransitions = (
    feature: any,
) => {
    const now = Date.now();
    
    // Start animation for this feature if map is available
    console.log('feature', feature);
    // XXX: There is now feature.map
    if (feature.map) {
        animateFeature(feature);
    }

    return {
        pointsCircleRadiusCurrent: 8,
        pointsCircleRadiusScale: scaleLinear()
            .domain([now, now + 10000])
            .range([8, 16])
    };
};

export const updateFeatureTransitions = (feature: any) => {
    const now = Date.now();
    const state = feature.state;
    
    if (!state.pointsCircleRadiusScale) {
        return state;
    }
    
    const endTime = state.pointsCircleRadiusScale.domain()[1];
    
    if (now >= endTime) {
        // Transition is complete - set final value
        state.pointsCircleRadiusCurrent = state.pointsCircleRadiusScale.range()[1];
        delete state.pointsCircleRadiusScale;
    } else {
        // Update current value
        state.pointsCircleRadiusCurrent = state.pointsCircleRadiusScale(now);
    }

    return state;
};

// Single recursive function to handle animation
function animateFeature(feature: any) {
    const map = feature.map;
    
    // Get current state
    const state = map.getFeatureState({
        source: feature.source,
        id: feature.id
    });
    
    // Continue only if transition is still active
    if (state && state.pointsCircleRadiusScale) {
        // Update feature state to trigger a recalculation
        map.setFeatureState(
            { source: feature.source, id: feature.id },
            { updateTimestamp: Date.now() }
        );
        
        // Schedule next update
        requestAnimationFrame(() => animateFeature(feature));
    }
}

