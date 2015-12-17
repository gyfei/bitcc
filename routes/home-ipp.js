var bitcore = require('bitcore');
var fs = require('fs');

var networks = bitcore.networks;
var Peer = bitcore.Peer;
var Transaction = bitcore.Transaction;
var Address = bitcore.Address;
var Script = bitcore.Script;
var coinUtil = bitcore.util;
var crypto = require('crypto');
var bs58 = require('bs58')


var http = require('http');

// Turn String to Hex
    function stringToHex(str){
      var val="";
      for(var i = 0; i < str.length; i++){
        if(val == "")
          val = str.charCodeAt(i).toString(16);
        else
          val += "" + str.charCodeAt(i).toString(16);
      }
      return val;
    }



module.exports = function(app) {

  // Home/main
  app.get('/', function(req, res) {
    res.render('index', { title: 'IPP-Intellectual Property Protection' })
 })
  app.get('/verify-ip', function(req, res) {
    res.render('verify-ip', { title: 'Verify' })
 })
  app.get('/search-ip', function(req, res) {
    res.render('search-ip', { title: 'Search' })
 })

  app.post('/hash_data', function(req, res){  
      // get data from dataFrom in index.jade
      var user_data = req.body.userData;
      // get sha256 hash from index.jade
      var data_hash = new Buffer(req.body.dataHash);
      var data_hash_2 = bitcore.crypto.Hash.sha256(data_hash);
   
      if (user_data!="") {
        // turn to big-endian
        var bn = bitcore.crypto.BN.fromBuffer(data_hash_2);
        // get address from String
        var addr = new bitcore.PrivateKey(bn).toAddress();
        console.log(addr);
       
        res.render('hash_data', {
          address_from_data: addr.toString(),
        });
     }
     else{
      //console.log('no data input');
      //res.render("no_input");
    }
  }) 


  app.post('/hash_file', function (req, res) {
    // get input file name
    
    var rela_data = req.body.relaData;
    var rela_data_h = new Buffer(req.body.relaData); 
    var hash_of_file = new Buffer(req.body.fileHash); 

    var privateKey = new bitcore.PrivateKey('cRTvS7eVJDcRZmMRwi1JGtiV9VZzHCxA2KzuLKSkUhuyoytbn9UF');
    var utxo = {
      "txId" : "3c301599df90a0542018396ac9f26e14c01a978933e77399b1792e91856a4666",
      "outputIndex" : 0,
      "address" : "n1iytRHpXwvDpQmSHGP75Ji7NM4RuNgeew",
      "script" : "",
      "satoshis" : 10000 
    };
    //console.log(utxo);
    
    //var tx_in_hash = '55 c4 a1 da 80 cd ee 01 c4 ba 5b a4 17 98 d6 47 51 f1 62 75 63 66 82 7a 6f e3 7c 5f cb c6 3f 0b';
    //var tx_in_hash_rv = tx_in_hash.split(" ").reverse().join("");
    //console.log(tx_in_hash_rv);



    res.render('hash_file.jade', {
           // rela: rela,
           // digest: file_hash,
            address_from_file: utxo.address,
            tx: JSON.stringify(utxo, null, '\t'),
            //r_tx: raw_tx
        });
   
  })

  app.get('/my-origami', function(req, res) {
    res.render('my-origami', { title: 'myOrigami' });
 })

  app.post('/pro_ip', function(req, res) {
    var pro_crea_name = new Buffer(req.body.pro_crea_name);
    var other_info = new Buffer(req.body.other_info); 
    var prod_hash = req.body.prod_hash; 
    console.log(prod_hash);


// Check if the size is 2 bytes, if not, add 0 before it 
    function checkHex2bytes(str){
      if(str.length < 2)
        str = '0' + str;
      else
        str = str;
      return str;
    }


    var hex_pro_crea_name = stringToHex(pro_crea_name.toString('utf8'));
    var hex_other_info = stringToHex(other_info.toString('utf8'));

    var prev_hash = '62 35 1b 66 f7 62 bf 53 c9 5e 9f 3f a6 a6 73 eb fe 48 7f bb f4 47 16 25 04 f4 ce d1 04 c8 a7 ff';
    var prev_hash_rv = prev_hash.split(" ").reverse().join("");
      console.log(prev_hash_rv);

    

  //--------Script-------------------------------------

    var OP_RETURN = '6a';         // 0x6a = 109

    var OP_DUP = '76';            // 0x76 = 118
    var OP_HASH160 = 'a9';        // 0xa9 = 169
    var OP_EQUALVERIFY = '88';    // 0x88 = 136
    var OP_CHECKSIG = 'ac';       // 0xac = 172

  //--------Script End---------------------------------


  //-----------Raw TX Begin--------------------
    var fee = '64000000';          // 0.0000100 BTC

    var version_no = '01000000';
    var tx_in_count = '01';
      var prev_in = prev_hash_rv;
      var txin_index = '03000000';
    var script_length = '00';

    var tx_in = tx_in_count + prev_in + txin_index + script_length;
    var sequence = 'ffffffff';

    var tx_out_count = '04';
    // Output 0: usual output, send the change back
    var value_0 = 'd8c4cc1d00000000'; // change

    var pubKeyHash = '8ddeebf1fa6d679f00607c599670d55da7a1f66e';  // Kou
    var pubKeyHash_size = checkHex2bytes((pubKeyHash.length/2).toString(16));
    var scri_0 = OP_DUP + OP_HASH160 + pubKeyHash_size + pubKeyHash + OP_EQUALVERIFY + OP_CHECKSIG;
    var scri_0_size = (scri_0.length/2).toString(16);
  
    var script_0 = value_0 + scri_0_size + scri_0;
 
    var de_scri_0 = "OP_DUP OP_HASH160 " + pubKeyHash_size + pubKeyHash + " OP_EQUALVERIFY OP_CHECKSIG";
    //---------------Output 0---------------------

    // Output 1: title, creator
    // OP_RETURN
    var value_1 = '0000000000000000';   // Modify, change to big-endian by using bitcore API
    var name_size = checkHex2bytes((hex_pro_crea_name.length/2).toString(16));
    var scri_1 = OP_RETURN + name_size + hex_pro_crea_name;
    var scri_1_size = (scri_1.length/2).toString(16);

    var script_1 = value_1 + scri_1_size + scri_1;

    var de_scri_1 = "OP_RETURN " + name_size + hex_pro_crea_name;
    var decoded_1 = pro_crea_name.toString('utf8');
    //-----------------Output 1-------------------

    // Output 2: related info, like website, permission...
    // OP_RETURN
    var value_2 = '0000000000000000';   // 0.0001000 BTC
    var rela_size = checkHex2bytes((hex_other_info.length/2).toString(16));
    var scri_2 = OP_RETURN + rela_size + hex_other_info;
    var scri_2_size = (scri_2.length/2).toString(16);

    var script_2 = value_2 + scri_2_size + scri_2;

    var de_scri_2 = "OP_RETURN " + rela_size + hex_other_info;
    var decoded_2 = other_info.toString('utf8');
    //-----------------Output 2-------------------


    // Output 3: hash of the product
    // OP_RETURN
    var value_3 = '0000000000000000'; // 0.0001000 BTC
    var phash_size = checkHex2bytes((prod_hash.length/2).toString(16));
    var scri_3 = OP_RETURN + phash_size + prod_hash;
    var scri_3_size = (scri_3.length/2).toString(16);

    var script_3 = value_3 + scri_3_size + scri_3;

    var de_scri_3 = "OP_RETURN " + phash_size + prod_hash;
    var decoded_3 = prod_hash.toString('utf8');
    //-----------------Output 3-------------------

    var tx_out = tx_out_count + script_0 + script_1 + script_2 + script_3;

    var locktime = '00000000';

    var ori_raw_tx = version_no + tx_in + sequence + tx_out + locktime;

    //console.log(ori_raw_tx);

  //-----------Raw TX End----------------------


  //----------- JSON TX Start -------------------
  var txobj = {
    hash: prev_hash.split(" ").join(""),
    ver: 1, 
    vin_sz: parseInt(tx_in_count),
    vout_sz: parseInt(tx_out_count),
    lock_time: parseInt(locktime), 
    size: 0,
    inputs: [],  
    outputs: []
  };

  var txin = {
    prev_out: []
  };
    var prev_out = {
      index: txin_index,
      hash: prev_hash_rv
    }
    txin.prev_out.push(prev_out);
  txobj.inputs.push(txin);


  var txout_0 = {
    value: value_0,
    scriptPubKey: scri_0,
    script_type: "pay-to-pubkey-hash",
    output_scripts: de_scri_0
  };
  txobj.outputs.push(txout_0);

  var txout_1 = {
    value: value_1,
    scriptPubKey: scri_1,
    script_type: "Data output",
    output_scripts: de_scri_1,
    decoded: decoded_1
  };
  txobj.outputs.push(txout_1);

  var txout_2 = {
    value: value_2,
    scriptPubKey: scri_2,
    script_type: "Data output",
    output_scripts: de_scri_2,
    decoded: decoded_2
  };
  txobj.outputs.push(txout_2);

  var txout_3 = {
    value: value_3,
    scriptPubKey: scri_3,
    script_type: "Data output",
    output_scripts: de_scri_3,
    decoded: decoded_3
  };
  txobj.outputs.push(txout_3);

    
  //----------- JSON TX End ---------------------

    res.render('pro_ip', {
           p_c: pro_crea_name, 
           r_info: other_info,
           p_hash: prod_hash,
           ori_raw_tx: ori_raw_tx,
           json_tx: JSON.stringify(txobj, null, '\t'),
          });
 })

/*
app.post('/verify-ip', function(req, res) {
    res.render('verify-result', {});
 })*/

app.post('/verify-ip', function(req, res) {
  var veri_hash = req.body.veri_hash;
  var veri_hash_str = '00' + veri_hash.toString() + '34eea55f'; 
  console.log(veri_hash);

    if(veri_hash == '3d84d6ae1e88b66e92a2d68c459c2c8700359fde'){
      var bs58_veri_hash = bs58.encode(new Buffer(veri_hash_str, 'hex'))
      console.log(bs58_veri_hash);
/*
      var http = require('https');
      var url = 'https://blockchain.info/rawtx/fa447e19911a4102a1159a2b38f929a989ee2183782f9b4d7ebcf877e5d243ca';
        http.get(url, function(res){
          var body = '';
          res.setEncoding('utf8');
          res.on('data', function(chunk){
            body += chunk;
          });
 
          res.on('end', function(res){
            ret = JSON.parse(body);
            //console.log(ret);
          });
        }).on('error', function(e){
            console.log(e.message); //エラー時
            
            });
        */
        res.render('verify-result', {
            addr_veri:bs58_veri_hash,
        });
    }
    else if(veri_hash == ''){
      res.render('verify-ip', {});
      console.log("No file input to be verify.");

    }
    else{
      res.render('verify-result-fail', {});
            
    }
})




app.post('/search-ip', function(req, res) {
    res.render('search-result', { title: 'Search' });
 })








}