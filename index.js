// noinspection JSValidateTypes
class LimitParallel {

    /**
     * @param {int} limit           sets the max number of parallel threads.
     */
    constructor(limit=1000) {

        /** @type {int} */
        this._limit=limit;

        /** @type {int} */
        this._waiting=0;

        /** @type {function} */
        this._waitingLimitFunc=undefined;

        /** @type {function} */
        this._waitingFunc=undefined;


    }


    /**
     * Marks a waiting task as done(only to be run by addTaksToWaiting)
     * @private
     */
    _markTaskComplete() {
        //mark task as complete
        this._waiting--;

        //if we had hit limit and are now under limit continue
        if ((this._waitingLimitFunc!==undefined) && (this._waiting<this._limit)) {
            let temp=this._waitingLimitFunc;
            this._waitingLimitFunc=undefined;
            temp();
        }

        //if all tasks done then allow to continue if finish was run
        if ((this._waiting===0)&&(this._waitingFunc!==undefined)) {
            let temp=this._waitingFunc;
            this._waitingFunc=undefined;
            temp();
        }
    }

    /**
     * Adds a task to the waiting list
     * @param {Promise} promise
     */
    async add(promise) {
        //pause if we have hit limit
        if (this._waiting>=this._limit) {
            await (new Promise((resolve) => {this._waitingLimitFunc=resolve}));
        }

        //add to waiting list
        this._waiting++;                                 //add to waiting
        promise.then(()=>{
            //mark task as complete
            this._waiting--;

            //if we had hit limit and are now under limit continue
            if ((this._waitingLimitFunc!==undefined) && (this._waiting<this._limit)) {
                let temp=this._waitingLimitFunc;
                this._waitingLimitFunc=undefined;
                temp();
            }

            //if all tasks done then allow to continue if finish was run
            if ((this._waiting===0)&&(this._waitingFunc!==undefined)) {
                let temp=this._waitingFunc;
                this._waitingFunc=undefined;
                temp();
            }
        });            //run markTaskComplete when done
    }

    /**
     * Forces thread to stop and wait for all tasks to finish so next call can be synchronous
     * @return {Promise<void>}
     */
    async finish() {
        if (this._waiting===0) return;                    //if no waiting tasks finish immediately
        return new Promise((resolve) => {this._waitingFunc=resolve});   //create a promise and save it to be resolved later
    }
}
module.exports=LimitParallel;