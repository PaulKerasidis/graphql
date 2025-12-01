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

export const createBarChart = (data, { width = 520, height = 260 } = {}) => {
  const svg = createSvgElement('svg', {
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'XP by project bar chart',
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

  const padding = { top: 20, right: 16, bottom: 70, left: 56 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...data.map((d) => d.value));
  const gap = 12;
  const barWidth = Math.max(20, (chartWidth - gap * (data.length - 1)) / data.length);
  const axisY = padding.top + chartHeight;

  const yAxis = createSvgElement('line', {
    x1: padding.left,
    y1: padding.top - 4,
    x2: padding.left,
    y2: axisY + 4,
    class: 'bar-axis',
  });
  const xAxis = createSvgElement('line', {
    x1: padding.left - 6,
    y1: axisY,
    x2: width - padding.right + 6,
    y2: axisY,
    class: 'bar-axis',
  });
  svg.append(yAxis, xAxis);

  const formatValue = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toLocaleString();
  };

  data.forEach((item, index) => {
    const ratio = maxValue ? item.value / maxValue : 0;
    const barHeight = ratio * chartHeight;
    const x = padding.left + index * (barWidth + gap);
    const y = padding.top + (chartHeight - barHeight);

    const rect = createSvgElement('rect', {
      x,
      y,
      width: barWidth,
      height: barHeight,
      rx: 8,
      class: 'bar-rect',
    });

    const title = createSvgElement('title');
    title.textContent = `${item.label}: ${item.value.toLocaleString()} XP`;
    rect.appendChild(title);
    svg.appendChild(rect);

    const valueLabel = createSvgElement('text', {
      x: x + barWidth / 2,
      y: y - 8,
      'text-anchor': 'middle',
      class: 'chart-value-label',
    });
    valueLabel.textContent = formatValue(item.value);
    svg.appendChild(valueLabel);

    const label = createSvgElement('text', {
      x: x + barWidth / 2,
      y: axisY + 18,
      'text-anchor': 'end',
      transform: `rotate(-45 ${x + barWidth / 2} ${axisY + 18})`,
      class: 'bar-label',
    });
    label.textContent = item.label;
    svg.appendChild(label);
  });

  return svg;
};

export const createProgressChart = (data, { width = 520, barHeight = 18, gap = 14 } = {}) => {
  if (!data?.length) {
    const svg = createSvgElement('svg', { viewBox: '0 0 200 80' });
    const text = createSvgElement('text', {
      x: 100,
      y: 40,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      class: 'chart-empty-text',
    });
    text.textContent = 'No skills yet';
    svg.appendChild(text);
    return svg;
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const height = data.length * (barHeight + gap) + gap;
  const padding = { top: gap, left: 120, right: 16, bottom: gap };
  const chartWidth = width - padding.left - padding.right;
  const svg = createSvgElement('svg', {
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'Skill progress chart',
  });

  data.forEach((item, index) => {
    const y = padding.top + index * (barHeight + gap);
    const ratio = item.ratio ?? (maxValue ? item.value / maxValue : 0);
    const barWidth = chartWidth * ratio;

    const label = createSvgElement('text', {
      x: padding.left - 12,
      y: y + barHeight / 2,
      'text-anchor': 'end',
      'dominant-baseline': 'middle',
      class: 'progress-label',
    });
    label.textContent = item.label;
    svg.appendChild(label);

    const bg = createSvgElement('rect', {
      x: padding.left,
      y,
      width: chartWidth,
      height: barHeight,
      rx: 9,
      class: 'progress-bg',
    });
    svg.appendChild(bg);

    const fill = createSvgElement('rect', {
      x: padding.left,
      y,
      width: Math.max(barHeight, barWidth),
      height: barHeight,
      rx: 9,
      class: 'progress-fill',
    });
    const title = createSvgElement('title');
    title.textContent = `${item.label}: ${item.value.toLocaleString()} XP`;
    fill.appendChild(title);
    svg.appendChild(fill);
  });

  return svg;
};

export const createAuditRatioChart = ({ up = 0, down = 0 }, { width = 520, height = 160 } = {}) => {
  const svg = createSvgElement('svg', {
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'Audit ratio chart',
  });

  if (!up && !down) {
    const text = createSvgElement('text', {
      x: width / 2,
      y: height / 2,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      class: 'chart-empty-text',
    });
    text.textContent = 'No audits yet';
    svg.appendChild(text);
    return svg;
  }

  const padding = 36;
  const chartWidth = width - padding * 2;
  const maxValue = Math.max(up, down);
  const barHeight = 28;
  const gap = 20;

  const entries = [
    { label: 'Done (up)', value: up, color: 'var(--green-500)' },
    { label: 'Received (down)', value: down, color: 'var(--red-500)' },
  ];

  entries.forEach((item, idx) => {
    const y = padding + idx * (barHeight + gap);
    const ratio = maxValue ? item.value / maxValue : 0;
    const barWidth = chartWidth * ratio;

    const bg = createSvgElement('rect', {
      x: padding,
      y,
      width: chartWidth,
      height: barHeight,
      rx: 12,
      class: 'progress-bg',
    });
    svg.appendChild(bg);

    const fill = createSvgElement('rect', {
      x: padding,
      y,
      width: Math.max(12, barWidth),
      height: barHeight,
      rx: 12,
      fill: item.color,
      opacity: 0.85,
    });
    const title = createSvgElement('title');
    title.textContent = `${item.label}: ${item.value.toLocaleString()} XP`;
    fill.appendChild(title);
    svg.appendChild(fill);

    const label = createSvgElement('text', {
      x: padding + 8,
      y: y + barHeight / 2,
      'text-anchor': 'start',
      'dominant-baseline': 'middle',
      class: 'progress-label',
    });
    label.textContent = item.label;
    svg.appendChild(label);

    const valueLabel = createSvgElement('text', {
      x: width - padding - 4,
      y: y + barHeight / 2,
      'text-anchor': 'end',
      'dominant-baseline': 'middle',
      class: 'progress-value',
    });
    valueLabel.textContent =
      item.value >= 1_000_000
        ? `${(item.value / 1_000_000).toFixed(2)}m`
        : `${Math.round(item.value / 1000)}k`;
    svg.appendChild(valueLabel);
  });

  const ratioText = createSvgElement('text', {
    x: width / 2,
    y: height - padding / 2,
    'text-anchor': 'middle',
    class: 'chart-aux-text',
  });
  const ratio = down ? up / down : up ? '∞' : 0;
  ratioText.textContent = `Audit ratio: ${typeof ratio === 'number' ? ratio.toFixed(2) : ratio}`;
  svg.appendChild(ratioText);

  return svg;
};

export const createRadarChart = (data, { size = 280, levels = 5 } = {}) => {
  const svg = createSvgElement('svg', {
    viewBox: `0 0 ${size} ${size}`,
    role: 'img',
    'aria-label': 'Skill radar chart',
  });

  if (!data?.length) {
    const text = createSvgElement('text', {
      x: size / 2,
      y: size / 2,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      class: 'chart-empty-text',
    });
    text.textContent = 'No skills yet';
    svg.appendChild(text);
    return svg;
  }

  const center = size / 2;
  const radius = size / 2 - 28;
  const angleStep = (Math.PI * 2) / data.length;
  const maxValue = Math.max(...data.map((d) => d.value));

  const getPoint = (ratio, index) => {
    const angle = -Math.PI / 2 + index * angleStep;
    return {
      x: center + radius * ratio * Math.cos(angle),
      y: center + radius * ratio * Math.sin(angle),
    };
  };

  for (let level = 1; level <= levels; level += 1) {
    const levelRatio = level / levels;
    const points = data.map((_, index) => getPoint(levelRatio, index));
    const path = createSvgElement('path', {
      d: `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`,
      class: 'radar-level',
    });
    svg.appendChild(path);
  }

  data.forEach((item, index) => {
    const outer = getPoint(1, index);
    const axis = createSvgElement('line', {
      x1: center,
      y1: center,
      x2: outer.x,
      y2: outer.y,
      class: 'radar-axis',
    });
    svg.appendChild(axis);

    const labelPoint = getPoint(1.12, index);
    const label = createSvgElement('text', {
      x: labelPoint.x,
      y: labelPoint.y,
      'text-anchor': labelPoint.x < center ? 'end' : labelPoint.x > center ? 'start' : 'middle',
      'dominant-baseline':
        labelPoint.y < center ? 'baseline' : labelPoint.y > center ? 'hanging' : 'middle',
      class: 'radar-label',
    });
    label.textContent = item.label;
    svg.appendChild(label);
  });

  const points = data.map((item, index) => {
    const ratio = item.ratio ?? (maxValue ? item.value / maxValue : 0);
    const point = getPoint(ratio, index);
    return { ...point, label: item.label, value: item.value };
  });

  const polygon = createSvgElement('path', {
    d: `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`,
    class: 'radar-shape',
  });
  svg.appendChild(polygon);

  points.forEach((point) => {
    const circle = createSvgElement('circle', {
      cx: point.x,
      cy: point.y,
      r: 5,
      class: 'radar-point',
    });
    const title = createSvgElement('title');
    title.textContent = `${point.label}: ${point.value.toLocaleString()} XP`;
    circle.appendChild(title);
    svg.appendChild(circle);
  });

  return svg;
};
