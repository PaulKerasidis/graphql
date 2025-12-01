const SVG_NS = 'http://www.w3.org/2000/svg';

const createSvgElement = (name, attrs = {}) => {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      el.setAttribute(key, value);
    }
  });
  return el;
};

export const createLineChart = (data, { width = 520, height = 220 } = {}) => {
  const svg = createSvgElement('svg', {
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'XP progression line chart',
  });

  if (!data?.length) {
    const text = createSvgElement('text', {
      x: width / 2,
      y: height / 2,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      class: 'chart-empty-text',
    });
    text.textContent = 'No XP yet';
    svg.appendChild(text);
    return svg;
  }

  const padding = 32;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...data.map((d) => d.value));
  const step = chartWidth / Math.max(data.length - 1, 1);

  const points = data.map((point, index) => {
    const x = padding + index * step;
    const ratio = maxValue ? point.value / maxValue : 0;
    const y = height - padding - ratio * chartHeight;
    return { x, y };
  });

  const areaPath = points
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  const polygonPoints = `${points.map((p) => `${p.x},${p.y}`).join(' ')} ${
    padding + chartWidth
  },${height - padding} ${padding},${height - padding}`;

  const area = createSvgElement('polygon', {
    points: polygonPoints,
    class: 'chart-area',
  });
  svg.appendChild(area);

  const polyline = createSvgElement('polyline', {
    points: areaPath,
    class: 'chart-line',
  });
  svg.appendChild(polyline);

  points.forEach((point, idx) => {
    const circle = createSvgElement('circle', {
      cx: point.x,
      cy: point.y,
      r: 4,
      class: 'chart-point',
    });

    const title = createSvgElement('title');
    title.textContent = `${data[idx].label}: ${data[idx].value} XP`;
    circle.appendChild(title);
    svg.appendChild(circle);

    const valueLabel = createSvgElement('text', {
      x: point.x,
      y: Math.max(14, point.y - 10),
      'text-anchor': 'middle',
      class: 'chart-value-label',
    });
    valueLabel.textContent = data[idx].value.toLocaleString();
    svg.appendChild(valueLabel);
  });

  return svg;
};

export const createDonutChart = (data, { size = 200 } = {}) => {
  const svg = createSvgElement('svg', {
    viewBox: `0 0 ${size} ${size}`,
    role: 'img',
    'aria-label': 'Pass vs Fail donut chart',
  });

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (!total) {
    const text = createSvgElement('text', {
      x: size / 2,
      y: size / 2,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      class: 'chart-empty-text',
    });
    text.textContent = 'No data';
    svg.appendChild(text);
    return svg;
  }

  data.forEach((slice) => {
    const dash = (slice.value / total) * circumference;
    const circle = createSvgElement('circle', {
      cx: size / 2,
      cy: size / 2,
      r: radius,
      fill: 'transparent',
      'stroke-width': 18,
      stroke: slice.color,
      'stroke-dasharray': `${dash} ${circumference - dash}`,
      'stroke-dashoffset': -offset,
      class: 'chart-slice',
    });

    const title = createSvgElement('title');
    const percentage = ((slice.value / total) * 100).toFixed(1);
    title.textContent = `${slice.label}: ${slice.value} (${percentage}%)`;
    circle.appendChild(title);
    svg.appendChild(circle);

    offset += dash;
  });

  const centerText = createSvgElement('text', {
    x: size / 2,
    y: size / 2,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    class: 'chart-center-text',
  });
  centerText.textContent = `${Math.round((data[0].value / total) * 100) || 0}%`;
  svg.appendChild(centerText);

  return svg;
};
