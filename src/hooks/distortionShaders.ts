export const DISTORTION_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const DISTORTION_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;
  uniform float u_gridSize;
  uniform float u_intensity;
  uniform float u_radius;

  void main() {
    vec2 gridUV = floor(vUv * vec2(u_gridSize, u_gridSize)) / vec2(u_gridSize, u_gridSize);
    vec2 centerOfPixel = gridUV + vec2(1.0/u_gridSize, 1.0/u_gridSize);

    vec2 mouseDirection = u_mouse - u_prevMouse;

    vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
    float pixelDistanceToMouse = length(pixelToMouseDirection);
    float strength = smoothstep(u_radius, 0.0, pixelDistanceToMouse);

    vec2 uvOffset = strength * -mouseDirection * u_intensity;
    vec2 uv = vUv - uvOffset;

    vec4 color = texture2D(u_texture, uv);
    gl_FragColor = color;
  }
`;
