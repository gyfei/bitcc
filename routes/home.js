module.exports = function(app) {

    // Home/main
    app.route('/')
        .get(function(req, res) {
        	res.render('index', { title: 'BitTextures' })
        })

}