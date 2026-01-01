import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '10s',
  iterations: 10,
};

export default function () {
  const res = http.get('https://www.demoblaze.com/');
  check(res, {
    'Status is 200': (r) => r.status === 200,
    'Body includes user data': (r) => r.body.includes('data'),
  });
  sleep(1);
}

export function handleSummary (data){
    return {
        'F:/SQA/k6/demoBlaze/summary.json' : JSON.stringify(data),
    };
}