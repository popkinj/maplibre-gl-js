import type {Map as MapLibreMap} from '../ui/map';
import {scaleLinear} from 'd3-scale';

export const calculateFeatureState = (map: MapLibreMap, feature: any, state: any): any => {
        // Get the layers tied to the same feature source
        const layers = map.getStyle()?.layers.filter(layer => 
            'source' in layer && layer.source === feature.source
        );

        const transitions = new Map<string, {start: number, end: number, before: any, after: any, scale: any}>();
        
        layers?.forEach(layer => {
            if (!layer.paint) return;
            
            // Look through paint properties for any ending in -transition
            Object.entries(layer.paint).forEach(([key, value]) => {
                if (key.endsWith('-transition') && typeof value === 'object' && value !== null) {
                    const transitionValue = value as any;
                    if (transitionValue.duration) {
                        // Extract the base property name without '-transition'
                        const baseProperty = key.replace('-transition', '');
                        const paintProperty = layer.paint[baseProperty];

                        // Check if the paint property is a case expression array
                        if (paintProperty && 
                            Array.isArray(paintProperty) &&
                            paintProperty[0] === 'case') {
                            // For case expressions, the before and after values are at index 2 and 3
                            const beforeValue = paintProperty[2];
                            const afterValue = paintProperty[3];
                            
                            const now = Date.now();
                            transitions.set(`${layer.id}-${key}`, {
                                start: now,
                                end: now + transitionValue.duration,
                                before: beforeValue,
                                after: afterValue,
                                scale: scaleLinear()
                                    .domain([now, now + transitionValue.duration])
                                    .range([beforeValue, afterValue])
                            });
                        }
                    }
                }
            });
        });

        console.log('transitions', transitions);

        console.log('layers', layers);
        console.log('feature', feature);
        console.log('feature.id', feature.id);
        console.log('state', state);

        const radiusScale = scaleLinear()
            .domain([1, 10]) // 50 values
            .range([10, 20]) // Output range between 10-20

        const featureState = (state.hover) ? {circleRadius: 20} : {};

    return featureState;
}