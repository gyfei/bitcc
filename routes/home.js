var bitcore = require('bitcore');
var fs = require('fs');

var networks = bitcore.networks;
var Peer = bitcore.Peer;
var Transaction = bitcore.Transaction;
var Address = bitcore.Address;
var Script = bitcore.Script;
var coinUtil = bitcore.util;
var crypto = require('crypto');

module.exports = function(app) {

  // Home/main
  app.get('/', function(req, res) {
    res.render('index', { title: 'bitcc' })
 })
 
  app.get('/decode', function(req, res) {
    res.render('decode', { title: 'decode' })
 })
//---------------unsuccessful------------------
//------problem in decoding to string----------
  app.post('/decode_result', function(req, res) {
    var de_data = req.body.deData;
    if (de_data!="") {
      var ori = new Buffer(de_data, 'utf8').toString();
      res.render('decode_result', { 
        title: 'decode',
        decode_data: de_data,
        ori_data: ori
      })}
    else{
      console.log('no data input');
      res.render("no_input");
    }
 })

  app.post('/hash_data', function(req, res){  
      // get data from dataFrom in index.jade
      var user_data = req.body.userData;
      if (user_data!="") {
       //count sha256 and ripe160 of user_data
        var hash_value = bitcore.util.sha256ripe160(user_data);
        var hv_d = bitcore.util.sha256ripe160(user_data).toString('hex');
      /*
        // solve unrecognized code 
          var hv_58 = bitcore.Base58.encode(hash_value);
          console.log(String(hv_58));
      */  
        // add version
        var version = bitcore.networks['livenet'].addressVersion;
        // count address
        var addr = new bitcore.Address(version, hash_value);
        // use base58 to change address to string
        var addrStr = addr.as('base58');
        // console.log(addrStr);
                
//******************data***************************

// TX
  var TXIN = 'd05f35e0bbc495f6dcab03e599c8f5e32a07cdb4bc76964de201d06a2a7d8265';
  var TXIN_N = 1;
  var ADDR = 'muHct3YZ9Nd5Pq7uLYYhXRAxeW4EnpcaLz';
  var VAL = '0.05';
  
  var txobj = {
    hash: TXIN, 
    ver: 1, 
    vin_sz: TXIN_N,
    vout_sz: 1,
    lock_time: 0, 
    //size: Buffer.length,
    in: [],  
    out: []
  };

  var txin = {
    prev_out: []
  };

  var prev_out = {
    index: 0,
    hash: TXIN
  }
  txin.prev_out.push(prev_out);
  
  var hash = new Buffer(TXIN.split('').reverse(), 'hex');
  var vout = parseInt(TXIN_N);
  var voutBuf = new Buffer(4);

  voutBuf.writeUInt32LE(vout, 0);
  // concat: connect two or more arrays
  // -----------change to hex, but may be wrong-------------
  var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8')
  var text = bitcore.Base58.encode(Buffer.concat([hash, voutBuf]));
  var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex')
  // -----------may be wrong-------------

   txin.scriptSig =crypted;

  txobj.in.push(txin);

  
  var script = Script.createPubKeyHashOut(addr.payload());
  var valueNum = coinUtil.parseValue(VAL);
  var value = coinUtil.bigIntToValue(valueNum);
  var s = script.getBuffer();
  var s1 = 'OP_DUP OP_HASH160 '+ hv_d +' OP_EQUALVERIFY OP_CHECKSIG';

  var txout = {
    //v: bitcore.Base58.encode(value),
    value: VAL,
    scriptPubKey: s1
  };
  txobj.out.push(txout);

//*****************data**************************************
  
// Raw TX
  var ver_hex = '01000000';
  var tx_in_count = '01';
  var index = '00000000';
  var script_length = txin.scriptSig.length;
  var sequence = 'ffffffff';
  var tx_out_count = '01';
  var val = 'c01c3d0900000000';
  var pk_script_length = hv_d.length;
  var pk_script = hv_d;
  var lock_time = '00000000';

  var raw_tx = ver_hex+tx_in_count+prev_out.hash+index+script_length+txin.scriptSig+sequence+tx_out_count+val+pk_script_length+pk_script+lock_time;

        res.render('hash_data', {
          address_from_data: addrStr,
          tx: JSON.stringify(txobj, null, 4),
          r_tx: raw_tx
          //digest: hash_value,
        });
     }
     else{
      console.log('no data input');
      res.render("no_input");
    }
  }) 

  app.get('/no_input', function(req, res) {
     res.render('no_input');
 })

  
  app.post('/hash_file', function (req, res) {
    // get input file name
    
    var rela_data = req.body.relaData;
    var hash_of_file = new Buffer(req.body.fileHash); 
         
    if (hash_of_file!="") {
      
      
        var file_hash = bitcore.util.ripe160(hash_of_file);
        var file_hash1 = file_hash.toString('hex');
        var b_PUB_KEY = bitcore.util.ripe160(hash_of_file).toString('hex');
        
        var version = bitcore.networks['livenet'].addressVersion;
        var addr = new bitcore.Address(version, file_hash);
/*
        var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8')
        var text = rela_data;
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex')
        var decipher = crypto.createDecipher('aes-256-cbc','InmbuvP6Z8')
        var dec = decipher.update(crypted,'hex','utf8')
        dec += decipher.final('utf8')
*/
        var rela = new Buffer(rela_data).toString('base64');
        var rela_hex = new Buffer(rela_data).toString('hex');
        var ori_rela = new Buffer(rela, 'base64').toString();
       

      //***************file******************************

  var TXIN = 'd05f35e0bbc495f6dcab03e599c8f5e32a07cdb4bc76964de201d06a2a7d8265';
  var TXIN_N = 0;
  var a_PRI_KEY = '5JE9hcdLpziG5SPeJzGMUekXmhjtD2i8Rq1BC9W1kQ5Fe7HbnXZ';
  var a_ADDR = '1NRgoiEU3kGb9TQx8yUMByEwVek4w4m4u9';
  var a_PUB_KEY = a_ADDR.toString('hex');
  //var script = Script.createPubKeyHashOut(addr.payload()).toString();
  //console.log(script);
  var VAL = '0';
  

  var txobj = {
    hash: 0,
    ver: 1, 
    vin_sz: TXIN_N,
    vout_sz: 1,
    lock_time: 0, 
    size: 0,
    in: [],  
    out: []
  };

var txin = {
    prev_out: []
  };

  var prev_out = {
    index: 0,
    hash: TXIN
  }
  txin.prev_out.push(prev_out);

  
  //var hash = new Buffer(TXIN.split('').reverse(), 'hex');
  var hash_f = TXIN.split('').reverse();
  var vout = parseInt(TXIN_N);
  var voutBuf = new Buffer(4);

  voutBuf.writeUInt32LE(vout, 0);
  // concat: connect two or more arrays
  var pripub = new Buffer(a_PRI_KEY+a_PUB_KEY, 'base64');
  txin.scriptSig = pripub.toString('hex');
  // nothing in txobj.in without the command below
  //txobj.in.push(txin);

  
  var script = Script.createPubKeyHashOut(addr.payload());
  var valueNum = coinUtil.parseValue(VAL);
  var value = coinUtil.bigIntToValue(valueNum);
  var s = script.getBuffer();
  //var s1 = 'OP_DUP OP_HASH160 '+ b_PUB_KEY +' OP_EQUALVERIFY OP_CHECKSIG';
  var s1 = 'OP_RETURN '+ '6269746363' + rela_hex + file_hash1;


  var txout = {
    //v: bitcore.Base58.encode(value),
    value: VAL,
    scriptPubKey: s1
  };
  txobj.out.push(txout);
var date = new Date();

//********************file*********************************** 

// Raw TX
  var ver_hex = '01000000';
  var tx_in_count = '00';

  var index = '00000000';
  var script_length = txin.scriptSig.length/2;
  var sequence = 'ffffffff';

  var tx_out_count = '01';
  var val = value.toString('hex');
  var pk_script = 6269746363 + rela_hex + file_hash1;
  // pk_script_length should be turn to hex
  var pk_script_length = (pk_script.length/2).toString(16);
  var pk_length = (pk_script.length/2+2).toString(16);
  var lock_time = '00000000';

//  nothing in txobj.in
//  var raw_tx = ver_hex+tx_in_count+prev_out.hash+index+script_length+txin.scriptSig+sequence+tx_out_count+val+pk_script_length+pk_script+lock_time;        
  // OP_RETURN's Opcode is 106(dec)=6a(hex)
  var raw_tx = ver_hex+tx_in_count+tx_out_count+val+pk_length+'6a'+pk_script_length+pk_script+lock_time;        
  txobj.size = raw_tx.length/2;
  txobj.hash = bitcore.util.sha256(new Buffer(raw_tx)).toString('hex');
        res.render('hash_file.jade', {
           // rela: rela,
           // digest: file_hash,
            address_from_file: addr,
            time: date.toLocaleString(),
            tx: JSON.stringify(txobj, null, '\t'),
            r_tx: raw_tx
        });
      
    }
  else{
    console.log('no file input');
    res.render("no_input");
   }
})

/*  // if input is hash value
   app.post('/get_hash', function(req, res){  
      var hashValue = req.body.hashValue;
      //console.log(user_data.toString());

        // add check if input value is a hash value
      if (hashValue!="") {
        var hash_value = bitcore.util.sha256ripe160(hashValue);

        var version = bitcore.networks['livenet'].addressVersion;
          console.log(hash_value);
        var addr = new bitcore.Address(version, hash_value);
        var addrStr = addr.as('base58');
                
        res.render('hash', {
          digest: String(hash_value),
          address: addrStr
        });
     }
     else{
      console.log('no data input');
      res.render("no_input");
    }
  }) 
*/
}
