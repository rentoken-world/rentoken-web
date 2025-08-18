// 简易K线图组件，支持蜡烛图渲染
(function(global){
  function KLineChart(props) {
    const { data, width=380, height=180, pad=36 } = props;
    if (!data || !data.klines || data.klines.length === 0) return React.createElement('div', null, '暂无K线数据');
    const klines = data.klines;
    const maxY = Math.max(...klines.map(k=>k.high)) * 1.05;
    const minY = Math.min(...klines.map(k=>k.low)) * 0.95;
    function scaleX(i) { return pad + (width-2*pad) * i / (klines.length-1); }
    function scaleY(y) { return height - pad - (height-2*pad) * (y-minY)/(maxY-minY); }
    // 渐变背景
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="kline-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#23244a" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#181a2a" stop-opacity="0.95"/>
        </linearGradient>
        <linearGradient id="kline-up" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6c47ff"/>
          <stop offset="100%" stop-color="#b983ff"/>
        </linearGradient>
        <linearGradient id="kline-down" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff4d4f"/>
          <stop offset="100%" stop-color="#ffb6ff"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#kline-bg)"/>
      <g stroke="#444" stroke-width="1">`;
    // Y轴刻度
    for(let y=0; y<=maxY; y+=Math.max(1,Math.round((maxY-minY)/5))) {
      svg += `<line x1="${pad}" y1="${scaleY(y)}" x2="${width-pad}" y2="${scaleY(y)}" stroke="#23244a" stroke-dasharray="2,2"/>`;
      svg += `<text x="8" y="${scaleY(y)+4}" font-size="11" fill="#b3b3c6">${y.toFixed(2)}</text>`;
    }
    svg += `</g>`;
    // K线蜡烛
    klines.forEach((k,i)=>{
      const x = scaleX(i);
      const openY = scaleY(k.open), closeY = scaleY(k.close);
      const highY = scaleY(k.high), lowY = scaleY(k.low);
      const up = k.close >= k.open;
      const color = up ? 'url(#kline-up)' : 'url(#kline-down)';
      svg += `<line x1="${x}" y1="${highY}" x2="${x}" y2="${lowY}" stroke="${up ? '#6c47ff' : '#ff4d4f'}" stroke-width="2.2"/>`;
      svg += `<rect x="${x-6}" y="${Math.min(openY,closeY)}" width="12" height="${Math.abs(closeY-openY)||1}" fill="${color}" stroke="${up ? '#6c47ff' : '#ff4d4f'}" rx="3"/>`;
      // 圆点高亮收盘价
      svg += `<circle cx="${x}" cy="${closeY}" r="4" fill="#fff" stroke="${up ? '#6c47ff' : '#ff4d4f'}" stroke-width="2"/>
        <title>收盘:${k.close}</title>`;
    });
    // X轴日期
    svg += `<g font-size="11" fill="#b3b3c6">`;
    klines.forEach((k,i)=>{
      svg += `<text x="${scaleX(i)}" y="${height-8}" text-anchor="middle">${data.days && data.days[i] !== undefined ? data.days[i]+'d' : i+1}</text>`;
    });
    svg += `</g></svg>`;
    return React.createElement('div', { className: 'kline-chart', dangerouslySetInnerHTML: { __html: svg } });
  }
  global.KLineChart = KLineChart;
  if (typeof window !== 'undefined') window.KLineChart = KLineChart;
})(typeof window !== 'undefined' ? window : globalThis);
