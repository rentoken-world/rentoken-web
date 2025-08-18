// 简易K线图组件，支持蜡烛图渲染
(function(global){
  function KLineChart(props) {
    const { data, width=360, height=160, pad=32 } = props;
    if (!data || !data.klines || data.klines.length === 0) return React.createElement('div', null, '暂无K线数据');
    const klines = data.klines;
    const maxY = Math.max(...klines.map(k=>k.high)) * 1.05;
    const minY = Math.min(...klines.map(k=>k.low)) * 0.95;
    function scaleX(i) { return pad + (width-2*pad) * i / (klines.length-1); }
    function scaleY(y) { return height - pad - (height-2*pad) * (y-minY)/(maxY-minY); }
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect x="0" y="0" width="${width}" height="${height}" fill="none"/>
      <g stroke="#444" stroke-width="1">`;
    for(let y=0; y<=maxY; y+=Math.max(1,Math.round((maxY-minY)/5))) {
      svg += `<line x1="${pad}" y1="${scaleY(y)}" x2="${width-pad}" y2="${scaleY(y)}" stroke="#444" stroke-dasharray="2,2"/>`;
      svg += `<text x="4" y="${scaleY(y)+4}" font-size="10" fill="#b993ff99">${y.toFixed(2)}</text>`;
    }
    svg += `</g>`;
    klines.forEach((k,i)=>{
      const x = scaleX(i);
      const openY = scaleY(k.open), closeY = scaleY(k.close);
      const highY = scaleY(k.high), lowY = scaleY(k.low);
      const color = k.close >= k.open ? '#6a5cff' : '#ff4d4f';
      svg += `<line x1="${x}" y1="${highY}" x2="${x}" y2="${lowY}" stroke="${color}" stroke-width="2"/>`;
      svg += `<rect x="${x-5}" y="${Math.min(openY,closeY)}" width="10" height="${Math.abs(closeY-openY)||1}" fill="${color}" stroke="${color}" rx="2"/>`;
    });
    svg += `</svg>`;
    return React.createElement('div', { className: 'kline-chart', dangerouslySetInnerHTML: { __html: svg } });
  }
  global.KLineChart = KLineChart;
  if (typeof window !== 'undefined') window.KLineChart = KLineChart;
})(typeof window !== 'undefined' ? window : globalThis);
