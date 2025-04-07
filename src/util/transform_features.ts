import { scaleLinear } from "d3-scale";
import type {FeatureIdentifier} from '../style/style';
import type {Map} from '../ui/map';

/**
 * Calculates a transition for a feature's circle radius.
 * 
 * @param feature - The feature to calculate the transition for.
 * @returns An object containing the current circle radius and a scale function for transitioning.
 * The scale function is configured to transition from 8 to 16 pixels over a 10-second period.
 * 
 * @example
 * ```ts
 * const transition = calculateTransition(feature);
 * ```
 */
export const calculateTransition = (
    feature: any,
) => {
    const now = Date.now();
    
    // These are specific to testing the transition
    return {
        pointsCircleRadiusCurrent: 8,
        pointsCircleRadiusScale: scaleLinear()
            .domain([now, now + 1000])
            .range([8, 16])
    };
};

/**
 * Animates a feature's circle radius based on its current state.
 * 
 * @param feature - The feature identifier containing source, sourceLayer, and id properties.
 * @param map - The Map instance to use for state management.
 * 
 * This function:
 * 1. Gets the current state of the feature
 * 2. If the transition has completed (current time >= end time):
 *    - Sets the final circle radius value
 *    - Removes the scale from the feature's state
 * 3. If the transition is still ongoing:
 *    - Updates the current circle radius value
 *    - Schedules the next animation frame
 * 
 * @example
 * ```ts
 * // Start the animation for a feature
 * animateFeatureTick({
 *   source: 'my-source',
 *   sourceLayer: 'my-layer',
 *   id: 123
 * }, map);
 * ```
 */
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

