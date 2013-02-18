var CollectD = require('./lib/collectd');

var err = null
    , metrics = null
    , collectd = new CollectD();

collectd.getMetricList(function(err, metrics){

    var startErr = null;

    if (err){
        throw new Error(err);
    } else {
        collectd.start(startErr, metrics, 10000);

        if(startErr){
            throw new Error(startErr);
        }

    }

})


