// 兼容原有收益计算和曲线渲染逻辑
window.calcYield = function() {
  var amount = parseFloat(document.getElementById('invest-amount').value) || 0;
  var apy = parseFloat(document.getElementById('apy').value) || 0;
  var days = parseInt(document.getElementById('days').value) || 0;
  var result = 0;
  if (amount > 0 && apy > 0 && days > 0) {
    result = amount * (apy / 100) * (days / 365);
    document.getElementById('yield-result').innerText = '预期收益：' + result.toFixed(2) + ' USDT';
  } else {
    document.getElementById('yield-result').innerText = '';
  }
};

window.drawYieldChart = function() {
  const data = window.tokenYieldData;
  if (!data) return;
  const w = 360, h = 120, pad = 32;
  const days = data.days;
  const maxY = Math.max(...data.uniswap, ...data.centralized) * 1.1;
  const minY = 0;
  function scaleX(i) { return pad + (w-2*pad) * (days[i] - days[0]) / (days[days.length-1] - days[0]); }
  function scaleY(y) { return h - pad - (h-2*pad) * (y-minY)/(maxY-minY); }
  function linePath(arr) {
    return arr.map((y,i) => (i===0?'M':'L')+scaleX(i)+','+scaleY(y)).join(' ');
  }
  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect x="0" y="0" width="${w}" height="${h}" fill="none"/>
    <g stroke="#444" stroke-width="1">`;
  for(let y=0; y<=maxY; y+=Math.max(1,Math.round(maxY/5))) {
    svg += `<line x1="${pad}" y1="${scaleY(y)}" x2="${w-pad}" y2="${scaleY(y)}" stroke="#444" stroke-dasharray="2,2"/>`;
    svg += `<text x="4" y="${scaleY(y)+4}" font-size="10" fill="#b993ff99">${y}%</text>`;
  }
  for(let i=0;i<days.length;i++) {
    svg += `<text x="${scaleX(i)}" y="${h-8}" font-size="10" fill="#b993ff99" text-anchor="middle">${days[i]}d</text>`;
  }
  svg += `</g>`;
  svg += `<path d="${linePath(data.uniswap)}" fill="none" stroke="#6a5cff" stroke-width="2.5"/>`;
  svg += `<path d="${linePath(data.centralized)}" fill="none" stroke="#b993ff" stroke-width="2.5"/>`;
  data.uniswap.forEach((y,i)=>{
    svg += `<circle cx="${scaleX(i)}" cy="${scaleY(y)}" r="3" fill="#6a5cff"/>`;
  });
  data.centralized.forEach((y,i)=>{
    svg += `<circle cx="${scaleX(i)}" cy="${scaleY(y)}" r="3" fill="#b993ff"/>`;
  });
  svg += `</svg>`;
  document.getElementById('yield-chart').innerHTML = svg;
};
