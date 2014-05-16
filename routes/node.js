module.exports = function(app) {

	// rpc config
	var bitcore = require('bitcore');
    var RpcClient = bitcore.RpcClient;
    var config = {
      protocol: 'http',
      user: '',
      pass: '', 
      host: '127.0.0.1',
      port: '8332',
    };
    var rpc = new RpcClient(config);

    // Home/node
    app.route('/node').get(function(req, res) {
    	var date = new Date();
    	rpc.getInfo(function(err, ret) {
      		if (err) {
        		console.error('An error occured while getinfo');
        		console.error(err);
        		return;
      		}
      		console.log(ret);
            res.render('node', {
        		title: 'Node Status - bitcc',
        		connection_count: ret.result.connections,
        		blocks: ret.result.blocks,
        		difficulty: ret.result.difficulty,
        		time: date.toLocaleTimeString()
        	});
    	});
	});

}