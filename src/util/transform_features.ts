// import type {Map} from '../ui/map';
// import {interpolate} from 'd3-interpolate';
import {scaleLinear} from 'd3-scale';
// import {easeLinear} from 'd3-ease';

export const calculateFeatureState = (feature: any, state: any): any => {
        // Get all layers that use this feature's source
        // const layers = this.map.getStyle().layers.filter(layer => 
        //     'source' in layer && layer.source === feature.source
        // );

        // console.log('layers', layers);
        console.log('feature', feature);
        console.log('feature.id', feature.id);
        console.log('state', state);
        // Change the radius for the feature based on the id

        // const featureState = this.map.style.getFeatureState(feature);

        // const radiusScale = scaleLinear()
        //     .domain([1, 10]) // 50 values
        //     .range([10, 20]) // Output range between 10-20

        // console.log('radiusScale', radiusScale(10));

        // const easeScale = (t: number) => radiusScale(easeLinear(t));

        // featureState.circleRadius = easeScale(10);

        // featureState.circleRadiusQueue = 10;
        const featureState = (state.hover) ? {circleRadius: 20} : {};
    console.log('featureState', featureState);

    return featureState;
}