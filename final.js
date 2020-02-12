function outputAPICall(input) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve("response " + JSON.stringify(input));
        }, 5000);
    });
}

function MakePostCall() {
  this.requestArray = [];
  this.bodyObj = {};
  this.apiCallTimeInterval = 1000;
  this.requestTimeIntervals = 1000;
  this.batchIndex = 0;
  this.isAPICallScheduledOrRunning = false;
  this.batchTimerInterval = null;

  this.makeBatchCalls = () => {
    if (this.requestArray.length !== 0) {
      const currentBatchIndex = this.requestArray[0].batchIndex;
      const currentBatchRequestList = [];
      while (this.requestArray.length && currentBatchIndex === this.requestArray[0].batchIndex) {
        currentBatchRequestList.push(this.requestArray[0]);
        this.createBodyObj(this.requestArray[0].input);
        currentBatchRequestList.push(this.requestArray[0]);
        this.requestArray.shift();
      }
      const batchRequestInput = this.bodyObj;
      outputAPICall(batchRequestInput).then(batchRequestOutput => {
        this.processAPIOutput(currentBatchRequestList, batchRequestOutput);
        this.emptyBodyObj();
      }).catch(err => {
        console.log("Error in batch API call", err);
      }).finally(() => {
        this.isAPICallScheduledOrRunning = false;
        if (this.requestArray.length !== 0) {
          this.isAPICallScheduledOrRunning = true;
          setTimeout(this.makeBatchCalls, 0);
        }
      });
    } else {
      this.isAPICallScheduledOrRunning = false;
      clearInterval(this.batchTimerInterval);
      this.batchIndex = 0;
      this.batchTimerInterval = null;
    }
  }

  this.processAPIOutput = (currentBatchRequestList, batchRequestOutput) => {
    currentBatchRequestList.forEach((requestObject) => {
      requestObject.resolve(batchRequestOutput);

    });
  }

  //make the body object to pass for the post request
  this.createBodyObj = (url) => {
    let urlArr = url.split("/");
    let asset = urlArr[1];
    let assetID = urlArr[2];

    if (asset in this.bodyObj) {
      this.bodyObj[asset].push(assetID);
    } else {
      this.bodyObj[asset] = [];
      this.bodyObj[asset].push(assetID);
    }
  };

  //empty the body object
  this.emptyBodyObj = () => {
    this.bodyObj = {};
  } 

  //increment the batch index
  this.incrementBatchIndex = () => {
    this.batchIndex = this.batchIndex + 1;
  }

  this.makeAPICall = input => {
    return new Promise((resolve, reject) => {
      this.requestArray.push({
        input: input,
        resolve: resolve,
        reject: reject,
        batchIndex: this.batchIndex
      });
      if (!this.isAPICallScheduledOrRunning) {
        this.isAPICallScheduledOrRunning = true;
        setTimeout(this.makeBatchCalls, this.apiCallTimeInterval);
        this.batchTimerInterval = setInterval(
          this.incrementBatchIndex,
          this.requestTimeIntervals
        );
      }
    });
  };
}

let ddd = new MakePostCall();

setTimeout(() => {
  ddd.makeAPICall("lookup/user/1").then(rs => {
    console.log("here user 1", rs);
  });
}, 0);

setTimeout(() => {
  ddd.makeAPICall("lookup/customer/2").then(rs => {
    console.log("here customer 2", rs);
  });
}, 100);
setTimeout(() => {
  ddd.makeAPICall("lookup/user/3").then(rs => {
    console.log("here user 3", rs);
  });
}, 150);
setTimeout(() => {
  ddd.makeAPICall("lookup/customer/1").then(rs => {
    console.log("here customer 1", rs);
  });
}, 300);
setTimeout(() => {
  ddd.makeAPICall("lookup/user/2").then(rs => {
    console.log("here user 2", rs);
  });
}, 600);
setTimeout(() => {
  ddd.makeAPICall("lookup/customer/3").then(rs => {
    console.log("here customer 3", rs);
  });
}, 1000);
setTimeout(() => {
  ddd
    .makeAPICall("lookup/user/4")
    .then(rs => {
      console.log("here user 4", rs);
    })
    .catch(err => {
      console.log(err);
    });
}, 1500);
setTimeout(() => {
  ddd.makeAPICall("lookup/customer/5").then(rs => {
    console.log("here customer 5", rs);
  });
}, 2000);
setTimeout(() => {
  ddd
    .makeAPICall("lookup/user/5")
    .then(rs => {
      console.log("here user 5", rs);
    })
    .catch(err => {
      console.log(err);
    });
}, 2500);
setTimeout(() => {
  ddd
    .makeAPICall("lookup/customer/6")
    .then(rs => {
      console.log("here customer 6", rs);
      clearInterval(ddd.batchTimerInterval)
    })
    .catch(err => {
      console.log(err);
    });
}, 3000);
