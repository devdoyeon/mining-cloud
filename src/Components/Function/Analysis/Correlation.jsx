import React, { useState, useEffect, memo } from 'react';
import { heatMapAPI } from 'js/solutionApi';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import html2canvas from 'html2canvas';

const Correlation = () => {
  const [info, setInfo] = useState([]);
  let prevent = false;

  const renderHeatMap = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    setInfo([]);
    const num = Math.floor(Math.random() * 18) + 4;
    const result = await heatMapAPI(num);
    if (typeof result === 'object') {
      const { hour } = result.data.data;
      const keys = Object.keys(hour);
      keys.forEach(item => {
        const values = Object.values(result.data.data[item]);
        let obj = {
          id: item,
          data: [],
        };
        values.forEach((value, idx) => {
          obj.data.push({ x: keys[idx], y: value });
        });
        setInfo(prev => {
          const clone = [...prev];
          clone.push(obj);
          return clone;
        });
      });
      return info;
    } else return;
  };

  useEffect(() => {
    renderHeatMap();
  }, []);

  const captureChart = () => {
    html2canvas(document.querySelector('.chart')).then(canvas => {
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = canvas.toDataURL('image/png');
      link.download = 'heatmap.png';
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <>
      <div style={{ width: '700px', height: '600px' }} className='chart'>
        <ResponsiveHeatMap
          data={info}
          margin={{ top: 30, right: 80, bottom: 40, left: 80 }}
          valueFormat='>-.2'
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          axisTop={false}
          enableLabels={false}
          colors={{
            type: 'diverging',
            scheme: 'viridis',
            minValue: -1,
            maxValue: 1,
          }}
          emptyColor='#555555'
          animate={false}
          legends={[
            {
              anchor: 'right',
              translateX: 40,
              length: 400,
              direction: 'column',
              tickPosition: 'after',
              tickSpacing: 4,
              tickFormat: '>-.2',
            },
          ]}
        />
      </div>
      <button onClick={() => captureChart()}>Download Chart</button>
    </>
  );
};

export default memo(Correlation);
