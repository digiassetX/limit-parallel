require('nodeunit');
const LimitParallel = require('../index');
const sleep=require('sleep-promise');

module.exports = {
    'Test Limit': async function(test) {
        let limiter=new LimitParallel(10);
        let startTime=(new Date()).getTime();
        for (let i=0;i<15;i++) {
            await limiter.add(sleep(100));
        }
        test.equal(Math.floor(((new Date()).getTime()-startTime)/100),1); //should take 100ms to start all 15 tasks
        await limiter.finish();
        Math.floor((new Date()).getTime()-startTime/100)
        test.equal(Math.floor(((new Date()).getTime()-startTime)/100),2); //should take 200ms to finish all 15 tasks
        test.done();
    }

};

