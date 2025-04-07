import { scaleLinear } from "d3-scale";
import { easeElasticOut, easeLinear } from "d3-ease";
import type {FeatureIdentifier} from '../style/style';
import type {Map} from '../ui/map';

/**
 * Calculates a transition for a feature's circle radius.
 * 
 * @param state - The state of the feature to calculate the transition for.
 * @param map - The Map instance to use for state management.
 * @returns An object containing the current circle radius and a scale function for transitioning.
 * The scale function is configured to transition from 8 to 16 pixels over a 1-second period.
 * 
 * @example
 * ```ts
 * const transition = calculateTransition(feature, map);
 * ```
 */
export const calculateTransition = (
    state: any,
    map: Map
) => {
    const now = Date.now();
    const duration = 1000; // 1 second transition

    // Get the easing function based on the transitionEase state
    const easingFunction = state.transitionEase === 'elastic' ? easeElasticOut : easeLinear;

    // Create the scale with the time domain
    const scale = scaleLinear()
        .domain([now, now + duration])
        .range([8, 16]);

    // Create a wrapped scale that applies the easing function
    const wrappedScale = (t: number) => {
        const progress = (t - now) / duration;
        const easedProgress = easingFunction(Math.min(Math.max(progress, 0), 1));
        return 8 + (easedProgress * 8); // Scale from 8 to 16 based on eased progress
    };

    // Copy all d3 scale methods to our wrapped scale
    Object.assign(wrappedScale, scale);

    return {
        pointsCircleRadius: 8,
        pointsCircleRadiusScale: wrappedScale
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
            { pointsCircleRadius: state.pointsCircleRadiusScale.range()[1] }
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
            { pointsCircleRadius: state.pointsCircleRadiusScale(now) }
        );
        
        // Schedule the next tick
        requestAnimationFrame(() => animateFeatureTick(feature, map));
    }
}

