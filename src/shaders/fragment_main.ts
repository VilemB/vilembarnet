export default `
    normal = perturbNormalArb( - vViewPosition, normal, vec2(dFdx(vDisplacement), dFdy(vDisplacement)), faceDirection );
`;
