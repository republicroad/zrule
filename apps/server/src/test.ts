// const { UltraLogLog, DDSketch, BinaryFuseFilter, CountMinSketch } = require('sketch-oxide');
import { UltraLogLog, DDSketch, BinaryFuseFilter, CountMinSketch } from 'sketch-oxide';

// Cardinality
const ull = new UltraLogLog(12);
for (const item of data) {
    ull.update(item);
}
console.log(`Unique: ~${ull.estimate()}`);

// Quantiles
const dd = new DDSketch(0.01);  // 1% relative error
for (const latency of latencies) {
    dd.add(latency);
}
console.log(`p99: ${dd.quantile(0.99)}`);

// Membership
const bf = new BinaryFuseFilter(seenIds, 9);  // 9 bits per entry
if (bf.contains(testId)) {
    console.log("Probably seen");
}

// Frequency
const cms = new CountMinSketch(0.01, 0.01);  // epsilon, delta
for (const event of events) {
    cms.update(event);
}
console.log(`Count: ~${cms.estimate(targetEvent)}`);