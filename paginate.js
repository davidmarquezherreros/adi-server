function Paginate (datos, cuantosPorPagina) {

	if (!datos) throw new Error('Required Argument Missing')
	if (!(datos instanceof Array)) throw new Error('Invalid Argument Type')

	this.datos = datos
	this.cuantosPorPagina = cuantosPorPagina || 10
	this.currentPage = 0
	this.totalPages = Math.ceil(this.datos.length / this.cuantosPorPagina)
}

Paginate.prototype.offset = function () {

	return ((this.currentPage - 1) * this.cuantosPorPagina);
}

Paginate.prototype.page = function (pageNum) {

	if (pageNum < 1) pageNum = 1
	if (pageNum > this.totalPages) pageNum = this.totalPages

	this.currentPage = pageNum

	var start = this.offset()
	  , end = start + this.cuantosPorPagina

	return this.datos.slice(start, end);
}

Paginate.prototype.hasNext = function () {

	return (this.currentPage < this.totalPages)
}

Paginate.prototype.hasPrev = function () {

	return (this.currentPage > 1)
}

Paginate.prototype.getLinks = function (req) {

	var baseUrl = req.baseUrl + req.url.split('?')[0];

	var links = {
		self 	 : "http://localhost:3000" + req.originalUrl,
		first	 : "http://localhost:3000" + baseUrl + "?page=" + 1,
		last	 : "http://localhost:3000" + baseUrl + "?page=" + this.totalPages
	};
	if (this.hasNext())
		links.next = "http://localhost:3000" + baseUrl + "?page=" + (this.currentPage+1);
	if (this.hasPrev())
		links.prev = "http://localhost:3000" + baseUrl + "?page=" + (this.currentPage-1);

	return links;
}

module.exports = Paginate
