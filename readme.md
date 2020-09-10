# limit-parallel



## Installation
``` bash
npm install limit-parallel
```

## Usage
``` javascript
const LimitParallel=require('limit-parallel');
const limiter=new LimitParallel(10); //allows only 10 parallel tasks
for (let i=0;i<15;i++) {
    await limiter.add(someFunctionThatReturnsAPromiseButResultsAreNotNeeded());
}
await limiter.finish(); //wait until all limiter functions are complete
```
