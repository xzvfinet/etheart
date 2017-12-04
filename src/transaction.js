function Transaction(obj) {
	this.transaction_date = "";
	this.type = "";
	this.units_traded = "";
	this.price = "";
	this.total = "";

	Object.assign(this, obj);
	this.jsonString = JSON.stringify(this);
}

Transaction.prototype.compare = function(data) {
	console.log("merong");
}

Transaction.prototype.findInArray = function(array) {
	var thiz = this;
	var num = -1;
	array.every(function(el, index) {
		if (thiz.jsonString === JSON.stringify(el)) {
			num = index;
			return false;
		}
		return true;
	});

	return num;
}