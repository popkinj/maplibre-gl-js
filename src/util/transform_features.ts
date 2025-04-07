import { scaleLinear } from "d3-scale";
import type {FeatureIdentifier} from '../style/style';
import type {Map} from '../ui/map';

export const calculateTransition = (
    feature: any,
) => {
    const now = Date.now();
    
    // These are specific to testing the transition
    return {
        pointsCircleRadiusCurrent: 8,
        pointsCircleRadiusScale: scaleLinear()
            .domain([now, now + 10000])
            .range([8, 16])
    };
};

export const animateFeatureTick = (feature: FeatureIdentifier, map: Map) => {
    const now = Date.now();
    
    // Get the current state from the map
    const state = map.getFeatureState(feature);
    
    if (!state.pointsCircleRadiusScale) {
        return;
    }
    
    const endTime = state.pointsCircleRadiusScale.domain()[1];
    
    if (now >= endTime) {
        // Transition is complete - set final value and remove scale
        map.setFeatureState(
            feature,
            { pointsCircleRadiusCurrent: state.pointsCircleRadiusScale.range()[1] }
        );
        // Remove the scale from the state
        map.removeFeatureState(
            feature,
            'pointsCircleRadiusScale'
        );
    } else {
        // Update current value
        map.setFeatureState(
            feature,
            { pointsCircleRadiusCurrent: state.pointsCircleRadiusScale(now) }
        );
        
        // Schedule the next tick
        requestAnimationFrame(() => animateFeatureTick(feature, map));
    }
}

